// import "./style.css";

// function Skeleton({ className }: { className?: string }) {
//   return (
//     <div
//       className={`relative overflow-hidden rounded-lg bg-gray-200 ${className}`}
//     >
//       <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
//     </div>
//   );
// }


// export default function Loading() {
//   return (
//     <div className="p-6 space-y-6">
//       <Skeleton className="h-8 w-1/3" />
//       <Skeleton className="h-64 w-full" />
//       <div className="grid grid-cols-3 gap-4">
//         <Skeleton className="h-40" />
//         <Skeleton className="h-40" />
//         <Skeleton className="h-40" />
//       </div>
//     </div>
//   );
// }





"use client";

import Lottie from "lottie-react";
import loader from "@/public/lottie/GlowLoading.json";
import "./style.css";

export default function ProLoader() {
  return (
    <div className="flex h-full items-center justify-center content">
        <Lottie
          animationData={loader}
          loop
          className="w-32 h-32"
        />
    </div>
  );
}



// "use client";

// import { useState, useEffect } from "react";
// import Lottie from "lottie-react";
// import loader from "@/public/lottie/GlowLoading.json";
// import "./style.css";

// export default function ProLoader({ 
//   theme = "blue", // blue, green, purple, orange, pink
//   size = "md"     // sm, md, lg
// }) {
//   const [modifiedLoader, setModifiedLoader] = useState(loader);
  
//   // Define color themes
//   const colorThemes = {
//     blue: "#2AD9CF",
//     green: "#33D9A2",
//     purple: "#9D33D9",
//     orange: "#D97A33",
//     pink: "#D933B2",
//     red: "#D93333",
//   };

//   // Size classes
//   const sizeClasses = {
//     sm: "w-16 h-16",
//     md: "w-32 h-32",
//     lg: "w-48 h-48"
//   };

//   useEffect(() => {
//     const color = colorThemes[theme] || colorThemes.blue;
    
//     // Method 1: Use CSS filter (simpler, less accurate)
//     // Method 2: Use JSON manipulation (more accurate)
    
//     // For JSON manipulation:
//     const modified = JSON.parse(JSON.stringify(loader));
//     updateLottieColors(modified, color);
//     setModifiedLoader(modified);
//   }, [theme]);

//   const updateLottieColors = (animationData, hexColor) => {
//     const rgb = hexToRgbNormalized(hexColor);
    
//     // Update main glow ball color (layer 0)
//     if (animationData.layers?.[0]?.shapes?.[0]?.it?.[1]?.c) {
//       animationData.layers[0].shapes[0].it[1].c.k = [rgb.r, rgb.g, rgb.b, 1];
//     }
    
//     // Update other layers (1-8)
//     for (let i = 1; i < Math.min(9, animationData.layers.length); i++) {
//       const layer = animationData.layers[i];
//       if (layer?.shapes?.[0]?.it?.[1]?.c?.k) {
//         const colorData = layer.shapes[0].it[1].c.k;
        
//         // Handle both static and animated colors
//         if (Array.isArray(colorData)) {
//           colorData.forEach(item => {
//             if (item.s) item.s = [rgb.r, rgb.g, rgb.b, 1];
//             if (item.e) item.e = [rgb.r, rgb.g, rgb.b, 1];
//           });
//         }
//       }
//     }
//   };

//   const hexToRgbNormalized = (hex) => {
//     const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
//     if (!result) return { r: 0.164, g: 0.851, b: 0.811 };
    
//     return {
//       r: parseInt(result[1], 16) / 255,
//       g: parseInt(result[2], 16) / 255,
//       b: parseInt(result[3], 16) / 255
//     };
//   };

//   return (
//     <div className="flex h-full items-center justify-center content">
//       <Lottie
//         animationData={modifiedLoader}
//         loop
//         className={sizeClasses[size]}
//       />
//     </div>
//   );
// }