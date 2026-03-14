"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/supabase";

export default function SessionTracker() {

  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    async function trackSession() {

      const supabase = createClient();

      const guestId = localStorage.getItem("guest_id");
      if (!guestId) return;

      const userAgent = navigator.userAgent;

      const { data } = await supabase.rpc("track_session", {
        p_guest_id: guestId,
        p_user_agent: userAgent
      });

      if (data) {
        sessionStorage.setItem("session_id", data);
      }
    }

    trackSession();

  }, []);

  return null;
}