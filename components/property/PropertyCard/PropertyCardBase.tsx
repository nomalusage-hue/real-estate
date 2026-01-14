"use client";

export default function PropertyCardBase({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    // <div className={`property-card-base ${className || ""}`}>
    // </div>
    {children}
  );
}