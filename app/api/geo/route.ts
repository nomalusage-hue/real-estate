// import { headers } from "next/headers";
// import { NextResponse } from "next/server";

// export async function GET() {
//   try {
//     const h = await headers(); // ✅ await is REQUIRED

//     const country =
//       h.get("x-vercel-ip-country") ||
//       h.get("cf-ipcountry") ||
//       "US";

//     return NextResponse.json({
//       country: country.toLowerCase(),
//     });
//   } catch {
//     return NextResponse.json({
//       country: "us",
//     });
//   }
// }






// // app/api/country/route.ts
// import { NextRequest, NextResponse } from "next/server";

// export async function GET(request: NextRequest) {
//   try {
//     // Get IP from request
//     const ip = request.ip || 
//                request.headers.get("x-real-ip") || 
//                request.headers.get("x-forwarded-for")?.split(",")[0] || 
//                "0.0.0.0";

//     // Try to get country from headers first (fastest)
//     const headerCountry = 
//       request.headers.get("x-vercel-ip-country") ||
//       request.headers.get("cf-ipcountry") ||
//       request.headers.get("x-country-code");

//     if (headerCountry) {
//       return NextResponse.json({
//         country: headerCountry.toUpperCase(),
//         source: "header",
//         ip
//       });
//     }

//     // Fallback: Use IP geolocation API (slower but more accurate)
//     let apiCountry = "US";
    
//     // Option A: Free IPAPI service
//     try {
//       const response = await fetch(`https://ipapi.co/${ip}/country/`, {
//         headers: { "User-Agent": "YourApp/1.0" }
//       });
//       if (response.ok) {
//         apiCountry = await response.text();
//       }
//     } catch (apiError) {
//       console.log("IPAPI failed, trying alternative...");
//     }

//     // Option B: Alternative service (ipinfo.io - requires token)
//     if (!apiCountry || apiCountry === "Undefined") {
//       try {
//         const token = process.env.IPINFO_TOKEN; // Get free token from ipinfo.io
//         const response = await fetch(
//           token ? `https://ipinfo.io/${ip}/country?token=${token}` : 
//                   `https://ipinfo.io/${ip}/country`
//         );
//         if (response.ok) {
//           apiCountry = await response.text();
//         }
//       } catch {}
//     }

//     // Final fallback: Use accept-language
//     if (!apiCountry || apiCountry.length !== 2) {
//       const acceptLanguage = request.headers.get("accept-language");
//       apiCountry = acceptLanguage?.split("-")[1]?.toUpperCase() || "LB3";
//     }

//     return NextResponse.json({
//       country: apiCountry.trim().toUpperCase(),
//       source: "api",
//       ip
//     });

//   } catch (error) {
//     console.error("Country detection failed:", error);
//     return NextResponse.json({
//       country: "US",
//       source: "fallback",
//       error: "Detection failed"
//     });
//   }
// }






// import { NextResponse } from "next/server";
// import { getServerCountryCode } from "@/src/lib/geo/geo.server";

// export async function GET() {
//   try {
//     const country = await getServerCountryCode();

//     return NextResponse.json({
//       country: country.toLowerCase(),
//       source: "ip",
//     });
//   } catch {
//     return NextResponse.json({
//       country: "us",
//       source: "fallback",
//     });
//   }
// }

import { NextResponse } from "next/server";
import { getServerCountry } from "@/src/lib/geo/geo.server";

export async function GET() {
  const country = await getServerCountry();

  return NextResponse.json({
    country,
  });
}
