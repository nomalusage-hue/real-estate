// "use client";

// import dynamic from "next/dynamic";
// import React from "react";

// const NoSSRWrapper = dynamic(
//   ( children ) => Promise.resolve(({ children }) => <>{children}</>),
//   { ssr: false }
// );

// export default NoSSRWrapper;


"use client";

import dynamic from "next/dynamic";
import React from "react";

// Correct syntax for dynamic import
const NoSSRWrapper = dynamic(
  () => Promise.resolve(({ children }: { children: React.ReactNode }) => <>{children}</>),
  { ssr: false }
);

export default NoSSRWrapper;