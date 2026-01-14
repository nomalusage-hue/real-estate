// export function getClientCountryFallback(): string {
//   if (typeof navigator === "undefined") return "us";

//   const lang = navigator.language; // e.g. ar-LB
//   const country = lang.split("-")[1];

//   return country ? country.toLowerCase() : "us";
// }



// src/lib/geo/geo.client.ts

export async function getClientIPCountry(): Promise<string> {
  try {
    const res = await fetch("http://ip-api.com/json/");
    const data = await res.json();

    return data?.countryCode?.toLowerCase() || "us";
  } catch {
    return "us";
  }
}
