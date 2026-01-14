"use client";

import { useEffect } from "react";
// import AOS from "aos";
import "aos/dist/aos.css";

export default function AOSWrapper({ children }: { children: React.ReactNode }) {
  // export default function AOSWrapper() {
  // useEffect(() => {
  //   AOS.init({ duration: 1600, once:true, });
  // }, []);

  // return null;

  useEffect(() => {
    import("aos").then((AOS) => {
      AOS.init({
        duration: 800,
        easing: "ease-in-out",
        once: true,
        mirror: false,
      });
    });
  }, []);

  return children;
}
