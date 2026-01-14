import { DataResult } from "@/core/types";
import { normalizeError } from "@/core/errors";

export class ImgBBService {
  constructor(private apiKey: string) {}

  async upload(file: File): Promise<DataResult<string>> {
    try {
      const form = new FormData();
      form.append("image", file);

      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${this.apiKey}`,
        { method: "POST", body: form }
      );

      const json = await res.json();

      if (!json.success) {
        return { ok: false, error: "Image upload failed" };
      }

      return { ok: true, data: json.data.url };
    } catch (e) {
      return { ok: false, error: normalizeError(e) };
    }
  }
}
