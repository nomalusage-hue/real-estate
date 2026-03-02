// import { NextRequest } from "next/server";
// import sharp from "sharp";
// import { PropertiesRepository } from "@/lib/repositories/PropertiesRepository";

// export async function GET(
//   request: NextRequest,
//   context: { params: Promise<{ id: string }> }
// ) {
//   const { id } = await context.params;

//   const repo = new PropertiesRepository();
//   const property = await repo.getById(id);

//   if (!property?.images?.[0]) {
//     return new Response("No image", { status: 404 });
//   }

//   const imageUrl = property.images[0];

//   const response = await fetch(imageUrl);
//   const arrayBuffer = await response.arrayBuffer();

//   const resized = await sharp(Buffer.from(arrayBuffer))
//     .resize(1200, 630, {
//       fit: "cover",
//       position: "center",
//     })
//     .jpeg({ quality: 80 })
//     .toBuffer();

//   return new Response(new Uint8Array(resized), {
//     headers: {
//       "Content-Type": "image/jpeg",
//       "Cache-Control": "public, max-age=31536000, immutable",
//     },
//   });
// }






// // app/og/property/[id]/route.ts
// import { NextRequest } from "next/server";
// import sharp from "sharp";
// import { PropertiesRepository } from "@/lib/repositories/PropertiesRepository";

// export const runtime = 'nodejs'; // Required for sharp

// // Simple in-memory cache with TTL (5 minutes)
// const cache = new Map<string, { data: any; expires: number }>();
// const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

// async function getPropertyWithCache(id: string) {
//   const now = Date.now();
//   const cached = cache.get(id);
//   if (cached && cached.expires > now) {
//     return cached.data;
//   }
//   const repo = new PropertiesRepository();
//   const property = await repo.getById(id);
//   cache.set(id, { data: property, expires: now + CACHE_TTL });
//   return property;
// }

// // 1×1 transparent JPEG fallback (base64)
// const FALLBACK_JPEG_BASE64 =
//   "/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAH/wAALCAABAAEBAREA/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/9oACAEBAAA/AK4AH//Z";
// const FALLBACK_JPEG_BUFFER = Buffer.from(FALLBACK_JPEG_BASE64, "base64");

// export async function GET(
//   request: NextRequest,
//   context: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const { id } = await context.params;

//     // 1. Get property from cache or database
//     const property = await getPropertyWithCache(id);

//     if (!property?.images?.[0]) {
//       return fallbackResponse("No property image", 404);
//     }

//     const imageUrl = property.images[0];

//     // 2. Fetch the image with timeout
//     const controller = new AbortController();
//     const timeoutId = setTimeout(() => controller.abort(), 5000);
//     let response;
//     try {
//       response = await fetch(imageUrl, { signal: controller.signal });
//     } finally {
//       clearTimeout(timeoutId);
//     }

//     if (!response.ok) {
//       return fallbackResponse(`Fetch failed: ${response.status}`, 502);
//     }

//     const contentType = response.headers.get("content-type");
//     if (!contentType?.startsWith("image/")) {
//       return fallbackResponse(`Invalid content type: ${contentType}`, 415);
//     }

//     const arrayBuffer = await response.arrayBuffer();
//     const inputBuffer = Buffer.from(arrayBuffer);

//     // 3. Resize with sharp
//     let resizedBuffer;
//     try {
//       resizedBuffer = await sharp(inputBuffer)
//         .resize(1200, 630, {
//           fit: "cover",
//           position: "center",
//           withoutEnlargement: false, // allow upscaling
//         })
//         .jpeg({ quality: 85, mozjpeg: true })
//         .toBuffer();
//     } catch (sharpError) {
//       console.error("Sharp processing error:", sharpError);
//       return fallbackResponse("Image processing failed", 500);
//     }

//     // 4. Return the final image with strong caching
//     return new Response(resizedBuffer, {
//       headers: {
//         "Content-Type": "image/jpeg",
//         "Cache-Control": "public, max-age=2592000, immutable",
//         "Content-Length": resizedBuffer.length.toString(),
//       },
//     });
//   } catch (error) {
//     console.error("Unexpected error in OG route:", error);
//     return fallbackResponse("Internal server error", 500);
//   }
// }

// // Helper: returns a fallback image when something goes wrong
// function fallbackResponse(reason: string, status: number = 200) {
//   console.warn(`Returning fallback image because: ${reason}`);
//   const fallbackBlob = new Blob([FALLBACK_JPEG_BUFFER], { type: "image/jpeg" });
//   return new Response(fallbackBlob, {
//     status,
//     headers: {
//       "Content-Type": "image/jpeg",
//       "Cache-Control": "public, max-age=300", // short cache for fallback
//     },
//   });
// }




import { NextRequest } from "next/server";
import sharp from "sharp";
import { PropertiesRepository } from "@/lib/repositories/PropertiesRepository";

export const runtime = 'nodejs';

// Simple in-memory cache with TTL (5 minutes)
const cache = new Map<string, { data: any; expires: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function getPropertyWithCache(id: string) {
  const now = Date.now();
  const cached = cache.get(id);
  if (cached && cached.expires > now) {
    return cached.data;
  }
  const repo = new PropertiesRepository();
  const property = await repo.getById(id);
  cache.set(id, { data: property, expires: now + CACHE_TTL });
  return property;
}

// 1×1 transparent JPEG fallback (base64)
const FALLBACK_JPEG_BASE64 =
  "/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAH/wAALCAABAAEBAREA/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/9oACAEBAAA/AK4AH//Z";
const FALLBACK_JPEG_BUFFER = Buffer.from(FALLBACK_JPEG_BASE64, "base64");

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const property = await getPropertyWithCache(id);

    if (!property?.images?.[0]) {
      return fallbackResponse("No property image", 404);
    }

    const imageUrl = property.images[0];

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    let response;
    try {
      response = await fetch(imageUrl, { signal: controller.signal });
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      return fallbackResponse(`Fetch failed: ${response.status}`, 502);
    }

    const contentType = response.headers.get("content-type");
    if (!contentType?.startsWith("image/")) {
      return fallbackResponse(`Invalid content type: ${contentType}`, 415);
    }

    const arrayBuffer = await response.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    let resizedBuffer;
    try {
      resizedBuffer = await sharp(inputBuffer)
        .resize(1200, 630, {
          fit: "cover",
          position: "center",
          withoutEnlargement: false,
        })
        .jpeg({ quality: 85, mozjpeg: true })
        .toBuffer();
    } catch (sharpError) {
      console.error("Sharp processing error:", sharpError);
      return fallbackResponse("Image processing failed", 500);
    }

    // ✅ FIX: Convert Buffer to Uint8Array for Blob compatibility
    const imageBlob = new Blob([new Uint8Array(resizedBuffer)], { type: "image/jpeg" });
    return new Response(imageBlob, {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=2592000, immutable",
        "Content-Length": resizedBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Unexpected error in OG route:", error);
    return fallbackResponse("Internal server error", 500);
  }
}

function fallbackResponse(reason: string, status: number = 200) {
  console.warn(`Returning fallback image because: ${reason}`);
  const fallbackBlob = new Blob([new Uint8Array(FALLBACK_JPEG_BUFFER)], { type: "image/jpeg" });
  return new Response(fallbackBlob, {
    status,
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "public, max-age=300",
    },
  });
}