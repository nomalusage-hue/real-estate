import { NextResponse } from "next/server";

export const config = {
  api: {
    bodyParser: false, // because we're using FormData
  },
};

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const image = formData.get("image") as Blob;

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const imgbbForm = new FormData();
    imgbbForm.append("image", image);

    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
      {
        method: "POST",
        body: imgbbForm,
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json({ error: errorData }, { status: 500 });
    }

    const data = await res.json();
    return NextResponse.json({
      url: data.data.url,
      deleteUrl: data.data.delete_url,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}