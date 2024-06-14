// app/api/uploadImage/route.ts
import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

export const POST = async (req: NextRequest) => {
  try {
    const { fileName, file } = await req.json();

    if (!file || !fileName) {
      return NextResponse.json(
        { message: "No file provided" },
        { status: 400 }
      );
    }

    // Upload the file to Vercel Blob and get the URL
    const { url } = await put(fileName, Buffer.from(file, "base64"), {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    console.log('url in api', url);

    return NextResponse.json({ url }, { status: 200 });
  } catch (err) {
    console.error("Image upload failed:", err);
    return NextResponse.json(
      { message: "Image upload failed" },
      { status: 500 }
    );
  }
};
