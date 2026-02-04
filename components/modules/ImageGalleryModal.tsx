// "use client";

// import Image from "next/image";
// import Portal from "../Portal/Portal";

// interface ImageGalleryModalProps {
//     open: boolean;
//     images: string[];
//     index: number;
//     onClose: () => void;
//     onNext: () => void;
//     onPrev: () => void;
// }

// export default function ImageGalleryModal({
//     open,
//     images,
//     index,
//     onClose,
//     onNext,
//     onPrev,
// }: ImageGalleryModalProps) {
//     if (!open || images.length === 0) return null;

//     return (
//         <Portal>
//             <div className="gallery-modal">
//                 <div className="gallery-overlay" onClick={onClose}></div>

//                 <div className="gallery-content">
//                     <button className="close-btn" onClick={onClose}>
//                         &times;
//                     </button>

//                     <button className="prev-btn" onClick={onPrev}>
//                         &lt;
//                     </button>

//                     <Image
//                         src={images[index]}
//                         alt={`Image ${index + 1}`}
//                         width={0}
//                         height={0}
//                         unoptimized
//                         style={{
//                             width: "100%",
//                             maxWidth: "90vw",
//                             maxHeight: "80vh",
//                             objectFit: "contain",
//                             height: "auto",
//                         }}
//                     />

//                     <button className="next-btn" onClick={onNext}>
//                         &gt;
//                     </button>

//                     <div className="gallery-counter">
//                         {index + 1} / {images.length}
//                     </div>
//                 </div>
//             </div>
//         </Portal>
//     );
// }



"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Portal from "../Portal/Portal";
import "./ImageGalleryModal.css";
import AppLoader from "../ui/AppLoader/AppLoader";

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
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!open) return;
        setIsLoading(true);
    }, [index, open]);

    if (!open || images.length === 0) return null;

    return (
        <Portal>
            <div className="gallery-modal">
                <div className="gallery-overlay" onClick={onClose} />

                <div className="gallery-content">
                    <button className="close-btn" onClick={onClose}>
                        &times;
                    </button>

                    <button
                        className="prev-btn"
                        onClick={onPrev}
                        disabled={isLoading}
                    >
                        &lt;
                    </button>

                    <div className="gallery-image-wrapper">
                        {/* {isLoading && (
                            <div className="gallery-loader">
                                Loading...
                            </div>
                        )} */}

{isLoading && (
    <div className="gallery-loader">
        <AppLoader />
    </div>
)}


                        <Image
                            key={images[index]} // forces re-render
                            src={images[index]}
                            alt={`Image ${index + 1}`}
                            fill
                            unoptimized
                            onLoad={() => setIsLoading(false)}
                            style={{
                                objectFit: "contain",
                                opacity: isLoading ? 0 : 1,
                                transition: "opacity 0.3s ease",
                            }}
                        />
                    </div>

                    <button
                        className="next-btn"
                        onClick={onNext}
                        disabled={isLoading}
                    >
                        &gt;
                    </button>

                    <div className="gallery-counter">
                        {index + 1} / {images.length}
                    </div>
                </div>
            </div>
        </Portal>
    );
}