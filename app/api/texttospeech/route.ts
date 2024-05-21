import OpenAI from "openai";

export async function POST(req: Request) {
  const returnedText = await req.json();
  const input = returnedText.text;
  const voice = returnedText.senderType;

  if (!process.env.OPENAI_API_KEY) {
    return new Response(
      JSON.stringify({
        error: "No API key provided.",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY as string,
  });

  const mp3 = await openai.audio.speech.create({
    model: "tts-1",
    voice: voice,
    input,
    speed: 1,
    response_format: "opus",
  });

  const arrayBuffer = await mp3.arrayBuffer();

  const blob = new Blob([arrayBuffer], { type: "audio/mpeg" });

  return new Response(blob, {
    headers: {
      "Content-Type": "audio/ogg",
    },
  });
}
