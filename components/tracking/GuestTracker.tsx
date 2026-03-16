"use client";

import { createClient } from "@/lib/supabase/supabase";
import { useEffect, useRef } from "react";
import { UAParser } from "ua-parser-js";

// Cross‑browser UUID v4 generator
function generateUUID(): string {
  // Use crypto.getRandomValues if available (modern browsers, Node.js)
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const buf = new Uint8Array(16);
    crypto.getRandomValues(buf);
    // Set version (4) and variant bits
    buf[6] = (buf[6] & 0x0f) | 0x40; // version 4
    buf[8] = (buf[8] & 0x3f) | 0x80; // variant
    const hex = Array.from(buf, b => b.toString(16).padStart(2, '0')).join('');
    return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
  }
  // Fallback (non‑crypto, but sufficient for guest tracking)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export default function GuestTracker() {
  const ran = useRef(false);

  useEffect(() => {
    // Avoid double‑running in StrictMode
    if (ran.current) return;
    ran.current = true;

    async function trackGuest() {
      const supabase = createClient();

      // Get or create guest ID using the safe generator
      let guestId = localStorage.getItem("guest_id");
      if (!guestId) {
        guestId = generateUUID();
        localStorage.setItem("guest_id", guestId);
        console.log('Generated new guest_id:', guestId);
      } else {
        console.log('Existing guest_id:', guestId);
      }

      // Set cookie for server‑side access
      document.cookie = `guest_id=${guestId}; path=/; max-age=31536000; SameSite=Lax`;

      // Skip admin check? (you can add it here if desired)

      try {
        // Collect device info
        const parser = new UAParser();
        const result = parser.getResult();

        const data = {
          id: guestId,
          language: navigator.language,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          device_type: result.device.type || "desktop",
          os: result.os.name,
          browser: result.browser.name,
          screen_width: window.screen.width,
          screen_height: window.screen.height,
          pixel_ratio: window.devicePixelRatio
        };

        const { error } = await supabase
          .from("guests")
          .upsert(data, { onConflict: "id" });

        if (error) {
          console.error('Supabase guest upsert error:', error);
        } else {
          console.log('Guest upsert successful');
        }
      } catch (err) {
        console.error('Error in trackGuest:', err);
      }
    }

    trackGuest();
  }, []);

  return null;
}