// "use client";

// import Image from "next/image";
// import { useState, useEffect } from "react";
// import Portal from "../Portal/Portal";
// import "./ImageGalleryModal.css";
// import AppLoader from "../ui/AppLoader/AppLoader";

// interface ImageGalleryModalProps {
//   open: boolean;
//   images: string[];
//   index: number;
//   onClose: () => void;
//   onNext: () => void;
//   onPrev: () => void;
// }

// export default function ImageGalleryModal({
//   open,
//   images,
//   index,
//   onClose,
//   onNext,
//   onPrev,
// }: ImageGalleryModalProps) {
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     if (!open) return;
//     setIsLoading(true);
//   }, [index, open]);

//   if (!open || images.length === 0) return null;

//   return (
//     <Portal>
//       <div className="gallery-modal">
//         <div className="gallery-overlay" onClick={onClose} />

//         <div
//           className="gallery-content"
//           onClick={(e) => e.stopPropagation()}
//         >
//           <button className="close-btn" onClick={onClose}>
//             &times;
//           </button>

//           <button
//             className="prev-btn"
//             onClick={onPrev}
//             disabled={isLoading}
//           >
//             &lt;
//           </button>

//           <div className="gallery-image-wrapper" onClick={onClose}>
//             {isLoading && (
//               <div className="gallery-loader">
//                 <AppLoader />
//               </div>
//             )}

//             <Image
//               key={images[index]}
//               src={images[index]}
//               alt={`Image ${index + 1}`}
//               // fill
//               width={0}
//               height={0}
//               unoptimized
//               onLoad={() => setIsLoading(false)}
//               style={{
//                 objectFit: "contain",
//                 opacity: isLoading ? 0 : 1,
//                 transition: "opacity 0.3s ease",
//                 width: "auto",
//                 height: "100%",
//                 position: "absolute",
//                 top: "50%",
//                 left: "50%",
//                 transform: "translate(-50%, -50%)",
//               }}
//               onClick={(e) => e.stopPropagation()}
//             />
//           </div>

//           <button
//             className="next-btn"
//             onClick={onNext}
//             disabled={isLoading}
//           >
//             &gt;
//           </button>

//           <div className="gallery-counter">
//             {index + 1} / {images.length}
//           </div>
//         </div>
//       </div>

//     </Portal>
//   );
// }





"use client";

import { useEffect, useRef } from "react";
import Portal from "../Portal/Portal";
import "./ImageGalleryModal.css";

interface ImageGalleryModalProps {
  open: boolean;
  images: string[];
  index: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function ImageGalleryModal({
  open,
  images,
  index,
  onClose,
  onNext,
  onPrev,
}: ImageGalleryModalProps) {
  const activeThumbRef = useRef<HTMLImageElement>(null);

  // ── Keyboard navigation ──
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onPrev, onNext, onClose]);

  // ── Lock body scroll ──
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // ── Scroll active thumbnail into view ──
  useEffect(() => {
    if (open && activeThumbRef.current) {
      activeThumbRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [index, open]);

  if (!open || images.length === 0) return null;

  return (
    <Portal>
      {/* ── Overlay — click outside closes ── */}
      <div
        className="pc-lightbox"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label="Image viewer"
      >
        {/* Close */}
        <button
          className="pc-lightbox__close"
          onClick={onClose}
          aria-label="Close image viewer"
        >
          <i className="bi bi-x-lg" />
        </button>

        {/* Counter */}
        {images.length > 1 && (
          <div className="pc-lightbox__counter">
            {index + 1} / {images.length}
          </div>
        )}

        {/* Image — click inside does NOT close */}
        <div
          className="pc-lightbox__img-wrap"
          onClick={(e) => e.stopPropagation()}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={images[index]}
            src={images[index]}
            alt={`Image ${index + 1}`}
            className="pc-lightbox__img"
            draggable={false}
          />
        </div>

        {/* Prev / Next */}
        {images.length > 1 && (
          <>
            <button
              className="pc-lightbox__nav pc-lightbox__nav--prev"
              onClick={(e) => { e.stopPropagation(); onPrev(); }}
              aria-label="Previous image"
            >
              <i className="bi bi-chevron-left" />
            </button>
            <button
              className="pc-lightbox__nav pc-lightbox__nav--next"
              onClick={(e) => { e.stopPropagation(); onNext(); }}
              aria-label="Next image"
            >
              <i className="bi bi-chevron-right" />
            </button>
          </>
        )}

        {/* Thumbnail strip */}
        {images.length > 1 && (
          <div
            className="pc-lightbox__thumbs"
            onClick={(e) => e.stopPropagation()}
          >
            {images.map((img, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                ref={i === index ? activeThumbRef : null}
                src={img}
                alt=""
                className={`pc-lightbox__thumb ${i === index ? "pc-lightbox__thumb--active" : ""}`}
                onClick={() => {
                  // jump to specific image — call onNext/onPrev the delta times
                  const delta = i - index;
                  if (delta === 0) return;
                  const fn = delta > 0 ? onNext : onPrev;
                  for (let d = 0; d < Math.abs(delta); d++) fn();
                }}
                draggable={false}
              />
            ))}
          </div>
        )}
      </div>
    </Portal>
  );
}
