"use client";

import Script from "next/script";

export default function Scripts() {
  return (
    <>
      <Script
        src="/vendor/bootstrap/js/bootstrap.bundle.min.js"
        strategy="lazyOnload"
      />
      <Script
        src="/vendor/php-email-form/validate.js"
        strategy="lazyOnload"
      />
      <Script
        src="/vendor/purecounter/purecounter_vanilla.js"
        strategy="lazyOnload"
      />
      <Script
        src="/vendor/glightbox/js/glightbox.min.js"
        strategy="lazyOnload"
      />
      <Script
        src="/vendor/swiper/swiper-bundle.min.js"
        strategy="lazyOnload"
      />
      <Script
        src="/vendor/drift-zoom/Drift.min.js"
        strategy="lazyOnload"
      />
      <Script 
        src="/js/main.js" 
        strategy="lazyOnload" 
      />
      <Script 
        src="/js/my-script.js" 
        strategy="lazyOnload" 
      />
    </>
  );
}