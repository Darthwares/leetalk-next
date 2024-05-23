import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage } from '@langchain/core/messages';
import { ChatAnthropic } from '@langchain/anthropic';

const encoder = new TextEncoder();
const decoder = new TextDecoder();

interface DebateResponse {
  model: string;
  response: string;
}

const runDebate = async function* (
  prompt: string,
  key: string,
  maxIterations: number = 5
): AsyncGenerator<DebateResponse | { end: true }, void, unknown> {
  let currentPrompt = prompt;
  let currentModel = 'OpenAI'; // Start with OpenAI
  let iterations = 0;

  while (iterations < maxIterations) {
    let responseStream;
    let modelIdentifier: string;

    if (currentModel === 'Anthropic') {
      responseStream = await runLLMChainAnthropic(currentPrompt);
      modelIdentifier = 'Claude';
      currentModel = 'OpenAI';
    } else {
      responseStream = await runLLMChainOpenAI(currentPrompt, key);
      modelIdentifier = 'OpenAI';
      currentModel = 'Anthropic';
    }

    let responseText = '';
    for await (const token of streamToString(responseStream)) {
      responseText += token;
    }

    // Add greeting and addressing each other
    let addressedResponse = responseText.trim();
    if (iterations === 0) {
      addressedResponse = `Hello ${
        modelIdentifier === 'Claude' ? 'OpenAI' : 'Claude'
      }, ${addressedResponse}`;
    } else {
      addressedResponse = `Dear ${
        modelIdentifier === 'Claude' ? 'OpenAI' : 'Claude'
      }, ${addressedResponse}`;
    }

    yield { model: modelIdentifier, response: addressedResponse };
    currentPrompt = addressedResponse;
    iterations++;
  }

  // Yield an end marker
  yield { end: true };
};

const runLLMChainAnthropic = async (prompt: string) => {
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

  model.call([new HumanMessage(prompt)]);

  return stream.readable;
};

const runLLMChainOpenAI = async (prompt: string, key: string) => {
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

  model.call([new HumanMessage(prompt)]);

  return stream.readable;
};

const streamToString = async function* (stream: ReadableStream) {
  const reader = stream.getReader();
  let result = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    result = decoder.decode(value, { stream: true });
    yield result;
  }
};

export async function POST(req: Request) {
  const { prompt, key } = await req.json();

  const debateStream = runDebate(prompt, key);
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  (async () => {
    for await (const response of debateStream) {
      const jsonResponse = JSON.stringify(response);
      await writer.ready;
      await writer.write(encoder.encode(jsonResponse + '\n'));
    }
    await writer.ready;
    await writer.close();
  })();

  return new Response(stream.readable, {
    headers: { 'Content-Type': 'application/json' },
  });
}
