import { headers } from "next/headers";

export class GeoService {
  private static getHeaders() {
    return headers();
  }

  /** ISO country code (us, lb, fr, ...) */
  static getCountry(): string {
    return (
      this.getHeaders()
        .get("x-vercel-ip-country")
        ?.toLowerCase() || "us"
    );
  }

  /** Region / state (e.g. CA, TX, IDF) */
  static getRegion(): string | null {
    return this.getHeaders().get("x-vercel-ip-country-region");
  }

  /** City name (approximate) */
  static getCity(): string | null {
    return this.getHeaders().get("x-vercel-ip-city");
  }

  /** User IP address */
  static getIP(): string | null {
    return this.getHeaders().get("x-forwarded-for");
  }

  /** Browser language (e.g. en-US, fr-FR) */
  static getLanguage(): string {
    const lang =
      this.getHeaders().get("accept-language") || "en";
    return lang.split(",")[0];
  }

  /** Full user agent string */
  static getUserAgent(): string {
    return this.getHeaders().get("user-agent") || "";
  }

  /** Simple device detection */
  static getDeviceType(): "mobile" | "tablet" | "desktop" {
    const ua = this.getUserAgent().toLowerCase();

    if (ua.includes("ipad") || ua.includes("tablet")) {
      return "tablet";
    }
    if (ua.includes("mobile")) {
      return "mobile";
    }
    return "desktop";
  }

  /** Combined snapshot (useful for logging) */
  static getSnapshot() {
    return {
      country: this.getCountry(),
      region: this.getRegion(),
      city: this.getCity(),
      ip: this.getIP(),
      language: this.getLanguage(),
      device: this.getDeviceType(),
      userAgent: this.getUserAgent(),
    };
  }
}
