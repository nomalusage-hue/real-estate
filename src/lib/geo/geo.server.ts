// import { headers } from "next/headers";
// import { LocationData } from "./types";

// export async function getServerLocation(): Promise<LocationData> {
//   const h = await headers();

//   const country =
//     h.get("x-vercel-ip-country") ||
//     h.get("cf-ipcountry") ||
//     "US";

//   return {
//     country_name: country,
//     country_code: country.toUpperCase(),
//   };
// }

// export async function getServerCountryCode(): Promise<string> {
//   const location = await getServerLocation();
//   return location.country_code;
// }



// src/lib/geo/geo.server.ts
import { headers } from "next/headers";

export async function getServerCountry(): Promise<string> {
  const h = await headers();

  return (
    h.get("x-vercel-ip-country") ||
    h.get("cf-ipcountry") ||
    "US"
  ).toLowerCase();
}