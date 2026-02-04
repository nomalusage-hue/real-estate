"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
export default function ScrollToTop({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
  return <>{children}</>;
}
