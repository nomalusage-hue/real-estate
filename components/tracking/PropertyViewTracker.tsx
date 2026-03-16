"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/supabase";

export default function PropertyViewTracker({ propertyId }: { propertyId: string }) {
  const hasTracked = useRef(false);

  useEffect(() => {
    // Avoid tracking in development (localhost)
    if (typeof window !== 'undefined' && window.location.hostname.includes('localhost')) {
      return;
    }

    if (hasTracked.current) return;
    hasTracked.current = true;

    async function track() {
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

      // 3. Track the view
      await supabase.rpc("increment_property_view", {
        p_guest_id: guestId,
        p_property_id: propertyId
      });
    }

    track();
  }, [propertyId]);

  return null;
}