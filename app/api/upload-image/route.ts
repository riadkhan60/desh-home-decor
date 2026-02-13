import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get("image") as File;

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Convert to base64
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");

    // Upload to ImgBB
    const imgbbApiKey = process.env.IMGBB_API_KEY;
    
    if (!imgbbApiKey) {
      return NextResponse.json(
        { error: "ImgBB API key not configured" },
        { status: 500 }
      );
    }

    const imgbbFormData = new FormData();
    imgbbFormData.append("image", base64);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
      {
        method: "POST",
        body: imgbbFormData,
      }
    );

    const data = await response.json();

    if (!data.success) {
      return NextResponse.json(
        { error: "Failed to upload to ImgBB" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      url: data.data.url,
      display_url: data.data.display_url,
      delete_url: data.data.delete_url,
    });
  } catch (error) {
    console.error("Image upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
