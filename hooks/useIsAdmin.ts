"use client";

import { useEffect, useState } from "react";
import { firebaseAuth } from "@/config/firebase";
import { onIdTokenChanged } from "firebase/auth";

export function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null); // null = loading

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(firebaseAuth, async (user) => {
      if (!user) {
        setIsAdmin(false);
        return;
      }

      const tokenResult = await user.getIdTokenResult(true);
      setIsAdmin(tokenResult.claims.role === "admin");
    });

    return () => unsubscribe();
  }, []);

  return isAdmin;
}
