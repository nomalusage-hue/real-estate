"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/supabase";

export default function PropertyViewTracker({ propertyId }: { propertyId: string }) {
  const hasTracked = useRef(false);

  useEffect(() => {
    if (hasTracked.current) return;
    hasTracked.current = true;

    async function track() {
      const supabase = createClient();

      const guestId = localStorage.getItem("guest_id");
      if (!guestId) return;

      await supabase.rpc("increment_property_view", {
        p_guest_id: guestId,
        p_property_id: propertyId
      });
    }

    track();
  }, [propertyId]);

  return null;
}