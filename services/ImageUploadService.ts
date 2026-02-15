export class ImageUploadService {
  async upload(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("/api/upload-image", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json();
      console.error(err);
      throw new Error("Image upload failed");
    }

    const data = await res.json();
    return data.url as string;
  }
}