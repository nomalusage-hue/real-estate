"use client";

import Lottie from "lottie-react";
import loader from "@/public/lottie/GlowLoading.json";
import styles from "./AppLoader.module.css";

export default function AppLoader() {
  return (
    <div className={styles.container}>
      <Lottie
        animationData={loader}
        loop
        className="w-32 h-32"
      />
    </div>
  );
}
