"use client";

import { createClient } from "@/lib/supabase/supabase";
import { useEffect } from "react";
import { UAParser } from "ua-parser-js";

export default function GuestTracker() {
  useEffect(() => {
    async function trackGuest() {
      const supabase = createClient();

      let guestId = localStorage.getItem("guest_id");

      if (!guestId) {
        guestId = crypto.randomUUID();
        localStorage.setItem("guest_id", guestId);
      }

      // Make guest_id accessible to server routes
      document.cookie = `guest_id=${guestId}; path=/; max-age=31536000; SameSite=Lax`;

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

      await supabase
        .from("guests")
        .upsert(data, { onConflict: "id" });
    }

    trackGuest();
  }, []);

  return null;
}