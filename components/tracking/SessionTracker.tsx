"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/supabase";

export default function SessionTracker() {
  const ran = useRef(false);

  useEffect(() => {
    // Avoid tracking in development (localhost)
    if (typeof window !== 'undefined' && window.location.hostname.includes('localhost')) {
      return;
    }

    if (ran.current) return;
    ran.current = true;

    async function trackSession() {
      const supabase = createClient();

      // 1. Get guest ID from localStorage (anonymous)
      const guestId = localStorage.getItem("guest_id");
      if (!guestId) return;

      // 2. Check if current user is admin (if logged in)
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        if (profile?.role === 'admin') {
          return; // skip tracking for admins
        }
      }

      // 3. Track the session
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