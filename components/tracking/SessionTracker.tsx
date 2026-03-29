// "use client";

// import { useEffect, useRef } from "react";
// import { createClient } from "@/lib/supabase/supabase";

// export default function SessionTracker() {
//   const ran = useRef(false);

//   useEffect(() => {
//     // Avoid tracking in development (localhost)
//     if (typeof window !== 'undefined' && window.location.hostname.includes('localhost')) {
//       return;
//     }

//     if (ran.current) return;
//     ran.current = true;

//     async function trackSession() {
//       const supabase = createClient();

//       // 1. Get guest ID from localStorage (anonymous)
//       const guestId = localStorage.getItem("guest_id");
//       if (!guestId) return;

//       // 2. Check if current user is admin (if logged in)
//       const { data: { session } } = await supabase.auth.getSession();
//       if (session?.user) {
//         const { data: profile } = await supabase
//           .from('profiles')
//           .select('role')
//           .eq('id', session.user.id)
//           .single();
//         if (profile?.role === 'admin') {
//           return; // skip tracking for admins
//         }
//       }

//       // 3. Track the session
//       const userAgent = navigator.userAgent;
//       const { data } = await supabase.rpc("track_session", {
//         p_guest_id: guestId,
//         p_user_agent: userAgent
//       });

//       if (data) {
//         sessionStorage.setItem("session_id", data);
//       }
//     }

//     trackSession();
//   }, []);

//   return null;
// }





"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/supabase";

// How often we ping Supabase to update last_activity_at (in ms).
// 60 seconds is a good balance — frequent enough for accuracy, cheap enough on DB.
const HEARTBEAT_INTERVAL_MS = 60_000;

// If the guest record doesn't exist yet (race with GuestTracker), we retry
// up to this many times before giving up.
const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 1_500; // wait 1.5s between retries

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export default function SessionTracker() {
  const ran = useRef(false);

  useEffect(() => {
    // Skip in dev to keep your local DB clean
    if (typeof window !== "undefined" && window.location.hostname.includes("localhost")) {
      return;
    }
    if (ran.current) return;
    ran.current = true;

    // We keep a reference to the interval so we can clear it on unmount
    let heartbeatTimer: ReturnType<typeof setInterval> | null = null;

    async function startTracking() {
      const supabase = createClient();

      // 1. Bail out if there's no guest ID yet (GuestTracker hasn't run, or cookies
      //    are blocked). We'll retry below to handle the race condition.
      let guestId: string | null = null;

      for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        guestId = localStorage.getItem("guest_id");
        if (guestId) break;
        // Guest ID isn't in localStorage yet — GuestTracker may still be running.
        // Wait a moment and try again.
        await sleep(RETRY_DELAY_MS);
      }

      if (!guestId) {
        // Couldn't get a guest ID after several attempts — give up silently.
        console.warn("[SessionTracker] No guest_id found after retries. Skipping session tracking.");
        return;
      }

      // 2. Skip admins — no point polluting analytics with admin activity
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();
        if (profile?.role === "admin") return;
      }

      // 3. Track the session for the first time. We also retry here because the
      //    guest row itself might not be committed to the DB yet (GuestTracker
      //    uses /api/track-guest which has server-side latency).
      const userAgent = navigator.userAgent;
      let sessionId: string | null = null;

      for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        const { data, error } = await supabase.rpc("track_session", {
          p_guest_id: guestId,
          p_user_agent: userAgent,
        });

        if (error) {
          // Foreign key violation means the guest row isn't inserted yet — wait and retry
          const isFKViolation =
            error.code === "23503" || error.message?.includes("foreign key");
          if (isFKViolation && attempt < MAX_RETRIES - 1) {
            await sleep(RETRY_DELAY_MS);
            continue;
          }
          console.error("[SessionTracker] Failed to track session:", error);
          return;
        }

        sessionId = data as string;
        break;
      }

      if (sessionId) {
        sessionStorage.setItem("session_id", sessionId);
      }

      // 4. ── THE HEARTBEAT ──────────────────────────────────────────────────
      //
      // This is the fix for 0s durations. We call track_session again every
      // 60 seconds. The SQL function checks for an active session in the last
      // 30 minutes and updates last_activity_at = now() if it finds one.
      // So as long as the user keeps the tab open, last_activity_at keeps
      // advancing, and duration = last_activity_at - started_at grows correctly.
      //
      heartbeatTimer = setInterval(async () => {
        const { error } = await supabase.rpc("track_session", {
          p_guest_id: guestId,
          p_user_agent: userAgent,
        });
        if (error) {
          console.error("[SessionTracker] Heartbeat error:", error);
        }
      }, HEARTBEAT_INTERVAL_MS);
    }

    startTracking();

    // Clean up the interval when the component unmounts (e.g. navigation)
    return () => {
      if (heartbeatTimer) clearInterval(heartbeatTimer);
    };
  }, []);

  return null;
}
