"use client";

// import Lottie from "lottie-react";
// import loader from "@/public/lottie/GlowLoading.json";
import styles from "./AppLoader.module.css";


type LoaderProps = {
  size?: number;
  thickness?: number;
  color?: string;
  speed?: number;
  className?: string;
};

function Loader({
  size = 120,
  thickness = 16,
  color = "#2c7a7b",
  speed = 1.5,
  className = "",
}: LoaderProps) {
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{
        animation: `spin ${speed}s linear infinite`,
      }}
      className={className}
    >
      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={hexToRgba(color, 0.2)}
        strokeWidth={thickness}
        fill="none"
      />

      {/* Rotating arc */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={thickness}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={`${circumference * 0.25} ${circumference}`}
      />

      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </svg>
  );
}

/* HEX → RGBA */
function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function AppLoader() {
  return (
    <div className={styles.container}>
      {/* <Lottie */}
      <Loader
        // animationData={loader}
        // loop
        className="w-32 h-32"
      />
    </div>
  );
}
