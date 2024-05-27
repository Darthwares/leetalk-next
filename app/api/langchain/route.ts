import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatAnthropic } from "@langchain/anthropic";
import { guid } from "@/constants/default";
import { setMessages } from "@/lib/helper/edgedb/setMessages";
import OpenAI from "openai";
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export const maxDuration = 300; // This function can run for a maximum of 5 minutes
export const dynamic = "force-dynamic";

interface DebateResponse {
  sender: string;
  message_text: string;
  created_at: string;
  audio_url?: string;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const generateAudioBytes = async (
  text: string,
  voice: any
): Promise<ArrayBuffer> => {
  const mp3 = await openai.audio.speech.create({
    model: "tts-1",
    voice: voice,
    input: text,
    speed: 1,
    response_format: "mp3",
  });

  return mp3.arrayBuffer();
};

const uploadAudioToVercelBlob = async (
  filename: string,
  audioBuffer: ArrayBuffer
) => {
  const blob = await put(filename, audioBuffer, {
    access: "public",
  });
  return blob;
};

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
    let voice: string;

    if (currentModel === "Anthropic") {
      responseStream = await runLLMChainAnthropic(
        currentPrompt,
        systemMessageClaudeDebater
      );
      modelIdentifier = "claudeDebater";
      voice = "nova";
      currentModel = "openAIDebater";
    } else {
      responseStream = await runLLMChainOpenAI(
        currentPrompt,
        key,
        systemMessageOpenAIDebater
      );
      modelIdentifier = "openAIDebater";
      voice = "alloy";
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

    const audioBuffer = await generateAudioBytes(addressedResponse, voice);
    const blob = await uploadAudioToVercelBlob(
      `${modelIdentifier}-${iterations}.mp3`,
      audioBuffer
    );

    console.log("blob", blob);

    const createdAt = new Date().toISOString();
    yield {
      sender: modelIdentifier,
      message_text: addressedResponse,
      created_at: createdAt,
      audio_url: blob.url,
    };

    currentPrompt = addressedResponse;
    iterations++;
  }

  yield {
    sender: "system",
    message_text: "",
    created_at: new Date().toISOString(),
    end: true,
  };
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

export async function POST(request: Request): Promise<NextResponse> {
  const { prompt, key } = await request.json();

  const debateStream: any = runDebate(prompt, key);
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  (async () => {
    try {
      for await (const response of debateStream) {
        const message = {
          conversationId: key!,
          messageId: guid(),
          messageText: response?.message_text!,
          sender: response?.sender!,
          audioUrl: response?.audio_url!,
        };

        console.log("response?.audio_url", response?.audio_url);

        await setMessages(message);
        const jsonResponse = JSON.stringify(response);
        await writer.ready;
        await writer.write(encoder.encode(jsonResponse + "\n"));
      }
    } catch (error) {
      console.error("Error during debate stream:", error);
    } finally {
      await writer.ready;
      await writer.close();
    }
  })();

  return new NextResponse(stream.readable, {
    headers: { "Content-Type": "application/json" },
  });
}
