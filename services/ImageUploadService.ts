export class ImageUploadService {
  private apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY!;

  async upload(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${this.apiKey}`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!res.ok) {
      throw new Error("Image upload failed");
    }

    const json = await res.json();
    return json.data.url as string;
  }
}
