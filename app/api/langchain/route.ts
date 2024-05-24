import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatAnthropic } from "@langchain/anthropic";
import { guid } from '@/constants/default';
import { setMessages } from "@/lib/helper/edgedb/setMessages";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

interface DebateResponse {
  sender: string;
  message_text: string;
  created_at: string;
}

const runDebate = async function* (
  prompt: string,
  key: string,
  maxIterations: number = 7
): AsyncGenerator<DebateResponse | { end: true }, void, unknown> {
  let currentPrompt = prompt;
  let currentModel = "openAIDebater"; // Start with openAIDebater
  let iterations = 0;

  const systemMessageOpenAIDebater = new SystemMessage(
    "You are an AI assistant named openAIDebater. Your role is to engage in a debate with another AI assistant named claudeDebater. Analyze the given topic and provide your perspective, while also considering and responding to claudeDebater's arguments. The debate should continue until a satisfactory conclusion is reached. As an engineer, aim to provide technical insights and logical reasoning to support your position."
  );

  const systemMessageClaudeDebater = new SystemMessage(
    "You are an AI assistant named claudeDebater. Your role is to engage in a debate with another AI assistant named openAIDebater. Analyze the given topic and provide your perspective, while also considering and responding to openAIDebater's arguments. The debate should continue until a satisfactory conclusion is reached. Aim to provide well-reasoned and insightful arguments to support your position."
  );

  while (iterations < maxIterations) {
    let responseStream;
    let modelIdentifier: string;

    if (currentModel === "Anthropic") {
      responseStream = await runLLMChainAnthropic(
        currentPrompt,
        systemMessageClaudeDebater
      );
      modelIdentifier = "claudeDebater";
      currentModel = "openAIDebater";
    } else {
      responseStream = await runLLMChainOpenAI(
        currentPrompt,
        key,
        systemMessageOpenAIDebater
      );
      modelIdentifier = "openAIDebater";
      currentModel = "Anthropic";
    }

    let responseText = "";
    for await (const token of streamToString(responseStream)) {
      responseText += token;
    }

    let addressedResponse = responseText.trim();
    if (iterations === 0) {
      addressedResponse = `Hello ${
        modelIdentifier === "claudeDebater" ? "openAIDebater" : "claudeDebater"
      }, ${addressedResponse}`;
    } else {
      addressedResponse = `${modelIdentifier}, ${addressedResponse}`;
    }

    const createdAt = new Date().toISOString();
    yield { sender: modelIdentifier, message_text: addressedResponse, created_at: createdAt };
    currentPrompt = addressedResponse;
    iterations++;
  }

 yield { sender: 'system', message_text: '', created_at: new Date().toISOString(), end: true };
};

const runLLMChainAnthropic = async (
  prompt: string,
  systemMessage: SystemMessage
) => {
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  const model = new ChatAnthropic({
    streaming: true,
    anthropicApiKey: process.env.ANTHROPIC_API_KEY!,
    callbacks: [
      {
        async handleLLMNewToken(token) {
          await writer.ready;
          await writer.write(encoder.encode(token));
        },
        async handleLLMEnd() {
          await writer.ready;
          await writer.close();
        },
      },
    ],
  });

  model.invoke([systemMessage, new HumanMessage(prompt)]);

  return stream.readable;
};

const runLLMChainOpenAI = async (
  prompt: string,
  key: string,
  systemMessage: SystemMessage
) => {
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  const model = new ChatOpenAI({
    streaming: true,
    openAIApiKey: process.env.OPENAI_API_KEY!,
    callbacks: [
      {
        async handleLLMNewToken(token) {
          await writer.ready;
          await writer.write(encoder.encode(token));
        },
        async handleLLMEnd() {
          await writer.ready;
          await writer.close();
        },
      },
    ],
  });

  model.invoke([systemMessage, new HumanMessage(prompt)]);

  return stream.readable;
};

const streamToString = async function* (stream: ReadableStream) {
  const reader = stream.getReader();
  let result = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    result = decoder.decode(value, { stream: true });
    yield result;
  }
};

export async function POST(req: Request) {
  const { prompt, key } = await req.json();

  const debateStream: any = runDebate(prompt, key);
  // console.log('key', key);
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  (async () => {
    try {
      for await (const response of debateStream) {
        console.log('jsonResponse', response);

        const message = {
          conversationId: key!,
          messageId: guid(),
          messageText: response?.message_text ?? '',
          sender: response?.sender ?? '',
        };

        await setMessages(message);
        const jsonResponse = JSON.stringify(response);
        await writer.ready;
        await writer.write(encoder.encode(jsonResponse + '\n'));
      }
    } catch (error) {
      console.error('Error during debate stream:', error);
    } finally {
      await writer.ready;
      await writer.close();
    }
  })();
  
  return new Response(stream.readable, {
    headers: { "Content-Type": "application/json" },
  });
}
