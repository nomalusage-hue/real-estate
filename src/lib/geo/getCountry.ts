import { getClientIPCountry } from "./geo.client";

export async function getCountry(): Promise<string> {
  // 👇 THIS is what you loved
  if (process.env.NODE_ENV === "development") {
    return getClientIPCountry();
  }

  // Production → server API
  const res = await fetch("/api/geo");
  const data = await res.json();

  return data?.country || "us";
}

// export async function getCountry(): Promise<string> {
//   return "us";
// }
