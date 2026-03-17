// "use client";

// import { createClient } from "@/lib/supabase/supabase";
// import { useEffect, useRef } from "react";
// import { UAParser } from "ua-parser-js";

// // Cross‑browser UUID v4 generator
// function generateUUID(): string {
//   // Use crypto.getRandomValues if available (modern browsers, Node.js)
//   if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
//     const buf = new Uint8Array(16);
//     crypto.getRandomValues(buf);
//     // Set version (4) and variant bits
//     buf[6] = (buf[6] & 0x0f) | 0x40; // version 4
//     buf[8] = (buf[8] & 0x3f) | 0x80; // variant
//     const hex = Array.from(buf, b => b.toString(16).padStart(2, '0')).join('');
//     return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
//   }
//   // Fallback (non‑crypto, but sufficient for guest tracking)
//   return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
//     const r = Math.random() * 16 | 0;
//     const v = c === 'x' ? r : (r & 0x3 | 0x8);
//     return v.toString(16);
//   });
// }

// export default function GuestTracker() {
//   const ran = useRef(false);

//   useEffect(() => {
//     // Avoid double‑running in StrictMode
//     if (ran.current) return;
//     ran.current = true;

//     async function trackGuest() {
//       const supabase = createClient();

//       // Get or create guest ID using the safe generator
//       let guestId = localStorage.getItem("guest_id");
//       if (!guestId) {
//         guestId = generateUUID();
//         localStorage.setItem("guest_id", guestId);
//         console.log('Generated new guest_id:', guestId);
//       } else {
//         console.log('Existing guest_id:', guestId);
//       }

//       // Set cookie for server‑side access
//       document.cookie = `guest_id=${guestId}; path=/; max-age=31536000; SameSite=Lax`;

//       // Skip admin check? (you can add it here if desired)

//       try {
//         // Collect device info
//         const parser = new UAParser();
//         const result = parser.getResult();

//         const data = {
//           id: guestId,
//           language: navigator.language,
//           timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
//           device_type: result.device.type || "desktop",
//           os: result.os.name,
//           browser: result.browser.name,
//           screen_width: window.screen.width,
//           screen_height: window.screen.height,
//           pixel_ratio: window.devicePixelRatio
//         };

//         const { error } = await supabase
//           .from("guests")
//           .upsert(data, { onConflict: "id" });

//         if (error) {
//           console.error('Supabase guest upsert error:', error);
//         } else {
//           console.log('Guest upsert successful');
//         }
//       } catch (err) {
//         console.error('Error in trackGuest:', err);
//       }
//     }

//     trackGuest();
//   }, []);

//   return null;
// }



"use client";

import { useEffect, useRef } from "react";
import { UAParser } from "ua-parser-js";

// Cross‑browser UUID v4 generator (same as before)
function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const buf = new Uint8Array(16);
    crypto.getRandomValues(buf);
    buf[6] = (buf[6] & 0x0f) | 0x40; // version 4
    buf[8] = (buf[8] & 0x3f) | 0x80; // variant
    const hex = Array.from(buf, b => b.toString(16).padStart(2, '0')).join('');
    return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
  }
  // Fallback
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Helper to parse UTM params from URL
function getUTMParams(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const urlParams = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(key => {
    const val = urlParams.get(key);
    if (val) utm[key] = val;
  });
  return utm;
}

export default function GuestTracker() {
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    async function trackGuest() {
      // 1. Get or create guest ID
      let guestId = localStorage.getItem("guest_id");
      if (!guestId) {
        guestId = generateUUID();
        localStorage.setItem("guest_id", guestId);
      }

      // 2. Set cookie for server‑side access
      document.cookie = `guest_id=${guestId}; path=/; max-age=31536000; SameSite=Lax`;

      // 3. Collect all client‑side data
      const parser = new UAParser();
      const result = parser.getResult();

      // Device info
      const deviceData = {
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        device_type: result.device.type || "desktop",
        os: result.os.name,
        browser: result.browser.name,
        screen_width: window.screen.width,
        screen_height: window.screen.height,
        pixel_ratio: window.devicePixelRatio,
      };

      // Additional analytics
      const connection = (navigator as any).connection?.effectiveType || null; // '4g', '3g', etc.
      const memory = (navigator as any).deviceMemory || null; // in GB, approx
      const touchSupport = 'ontouchstart' in window;
      const orientation = window.screen.orientation?.type || null;
      const referrer = document.referrer || null;
      const currentUrl = window.location.href;
      const utmParams = getUTMParams();

      // 4. Send to server endpoint
      try {
        await fetch('/api/track-guest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            guestId,
            ...deviceData,
            connection,
            memory,
            touchSupport,
            orientation,
            referrer,
            currentUrl,
            utm: utmParams,
          }),
        });
      } catch (err) {
        console.error('Failed to send tracking data:', err);
      }

      // 5. (Optional) Direct Supabase upsert as fallback
      // You could still attempt direct upsert here, but the API is preferred.
    }

    trackGuest();
  }, []);

  return null;
}