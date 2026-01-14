"use client";

import dynamic from "next/dynamic";
import React from "react";

const NoSSRWrapper = dynamic(
  ( children ) => Promise.resolve(({ children }) => <>{children}</>),
  { ssr: false }
);

export default NoSSRWrapper;