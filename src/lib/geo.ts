import { headers } from "next/headers";

export class GeoService {
  private static async getHeaders() {
    return await headers();
  }

  /** ISO country code (us, lb, fr, ...) */
  static async getCountry(): Promise<string> {
    const headers = await this.getHeaders();
    return headers.get("x-vercel-ip-country")?.toLowerCase() || "us";
  }

  /** Region / state (e.g. CA, TX, IDF) */
  static async getRegion(): Promise<string | null> {
    const headers = await this.getHeaders();
    return headers.get("x-vercel-ip-country-region");
  }

  /** City name (approximate) */
  static async getCity(): Promise<string | null> {
    const headers = await this.getHeaders();
    return headers.get("x-vercel-ip-city");
  }

  /** User IP address */
  static async getIP(): Promise<string | null> {
    const headers = await this.getHeaders();
    return headers.get("x-forwarded-for");
  }

  /** Browser language (e.g. en-US, fr-FR) */
  static async getLanguage(): Promise<string> {
    const headers = await this.getHeaders();
    const lang = headers.get("accept-language") || "en";
    return lang.split(",")[0];
  }

  /** Full user agent string */
  static async getUserAgent(): Promise<string> {
    const headers = await this.getHeaders();
    return headers.get("user-agent") || "";
  }

  /** Simple device detection */
  static async getDeviceType(): Promise<"mobile" | "tablet" | "desktop"> {
    const ua = (await this.getUserAgent()).toLowerCase();

    if (ua.includes("ipad") || ua.includes("tablet")) {
      return "tablet";
    }
    if (ua.includes("mobile")) {
      return "mobile";
    }
    return "desktop";
  }

  /** Combined snapshot (useful for logging) */
  static async getSnapshot() {
    return {
      country: await this.getCountry(),
      region: await this.getRegion(),
      city: await this.getCity(),
      ip: await this.getIP(),
      language: await this.getLanguage(),
      device: await this.getDeviceType(),
      userAgent: await this.getUserAgent(),
    };
  }
}