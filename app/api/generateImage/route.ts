import OpenAI from "openai";
import { put } from "@vercel/blob";

export const maxDuration = 300; // This function can run for a maximum of 5 minutes
export const dynamic = 'force-dynamic';


export async function POST(req: Request) {
  const { text: input } = await req.json();

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

  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: input,
      n: 1,
      size: "1792x1024",
    });

    const imageUrl = response.data[0].url;
    const imageResponse = await fetch(imageUrl!);
    const imageBlob = await imageResponse.blob();

    const putResponse = await put(imageUrl!, imageBlob, {
      access: "public",
    });

    console.log('putResponse.url', putResponse.url)

    return new Response(JSON.stringify({ image: putResponse.url }), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    console.error("Error generating image:", error);

    // Use a placeholder image from Unsplash in case of an error
    const placeholderImage =
      "https://a35xtqdaetxqwjba.public.blob.vercel-storage.com/place%20holder%20image-ygdCIjmGow9pmaW88QnYJdPalM7cvE.png";

    return new Response(
      JSON.stringify({
        error: {
          message:
            error.response?.data?.error?.message ||
            "An unknown error occurred.",
        },
        image: placeholderImage,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
