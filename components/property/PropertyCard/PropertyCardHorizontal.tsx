// "use client";
// import Image from "next/image";
// import { PropertyData } from "../../../types/property";
// import Link from "next/link";
// import { formatArea, formatNumber, formatPrice } from "@/utils/format";

// export default function PropertyCardSimple({ data, className }: { data: PropertyData, className?: string }) {
//     const labels = [
//         { show: data.hot, icon: "bi-lightning-charge-fill", text: "Hot", className: "hot" },
//         { show: data.newListing, icon: "bi-star-fill", text: "New", className: "new" },
//         { show: data.featured, icon: "bi-gem", text: "Featured", className: "featured" },
//         { show: data.exclusive, icon: "bi-stars", text: "Exclusive", className: "exclusive" },
//     ];

//     return (
//         <article className={`mini-card ${className || ''}`} data-aos="fade-up" data-aos-delay="200">
//             <Link href={`/properties/${data.id}`} className="thumb">
//                 <Image
//                     src={data.images[0]}
//                     alt="Loft Haven"
//                     className="img-fluid"
//                     loading="lazy"
//                     width={0}
//                     height={0}
//                     unoptimized
//                 />

//                 {/* Render only the labels that are true */}
//                 {labels
//                     .filter((label) => label.show)
//                     .map((label, idx) => (
//                         <span key={idx} className={`label ${label.className}`}>
//                             <i className={`bi ${label.icon}`}></i> {label.text}
//                         </span>
//                     ))}

//             </Link>
//             <div className="mini-body">
//                 <h4>
//                     <Link href={`/properties/${data.id}`}>{data.title}</Link>
//                 </h4>
//                 <div className="mini-loc">
//                     <i className="bi bi-geo"></i> {data.address}, {data.city}
//                 </div>
//                 <div className="mini-specs">
//                     <span>
//                         <i className="bi bi-door-open"></i> {data.bedrooms}
//                     </span>
//                     <span>
//                         <i className="bi bi-droplet"></i> {data.bathrooms}
//                     </span>
//                     <span>
//                         <i className="bi bi-rulers"></i> {formatArea(data.landSize, data.sizeUnit)}
//                     </span>
//                 </div>
//                 <div className="mini-foot">
//                     {/* <div className="mini-price">${formatNumber(data.salePrice)}</div> */}
//                     <div>
//                         <div className="mini-price">
//                             {data.salePrice ? `${formatPrice(data.salePrice, data.saleCurrency)}` :
//                                 data.rentPrice ? `${formatPrice(data.rentPrice, data.rentCurrency)}/month` : 'Price on request'}
//                         </div>
//                         <div className="mini-price">
//                             {data.salePrice ? `${formatPrice(data.salePrice, data.saleCurrency)}` :
//                                 data.rentPrice ? `${formatPrice(data.rentPrice, data.rentCurrency)}/month` : 'Price on request'}
//                         </div>
//                     </div>
//                     <Link href={`/properties/${data.id}`} className="mini-btn">
//                         Details
//                     </Link>
//                 </div>
//             </div>
//         </article>
//     );
// }








// "use client";

// import Image from "next/image";
// import { PropertyData } from "../../../types/property";
// import Link from "next/link";
// import { formatArea, formatPrice } from "@/utils/format";
// import { useFavorites } from "@/hooks/useFavorites";
// import { useState, useEffect } from "react";
// import ImageGalleryModal from "@/components/modules/ImageGalleryModal";
// import LoginRequiredModal from "@/components/modules/LoginRequiredModal";
// import { getDisplayDate } from "@/src/utils/dateUtils";

// export default function PropertyCardSimple({
//   data,
//   className,
//   isFavorited: propIsFavorited,
//   toggleFavorite: propToggleFavorite,
// }: {
//   data: PropertyData;
//   className?: string;
//   isFavorited?: (id: string) => boolean;
//   toggleFavorite?: (id: string) => Promise<boolean>;
// }) {
//   const {
//     isFavorited: hookIsFavorited,
//     toggleFavorite: hookToggleFavorite,
//     user,
//   } = useFavorites();

//   const isFavorited = propIsFavorited || hookIsFavorited;
//   const toggleFavorite = propToggleFavorite || hookToggleFavorite;

//   const [galleryOpen, setGalleryOpen] = useState(false);
//   const [galleryIndex, setGalleryIndex] = useState(0);
//   const [showLoginModal, setShowLoginModal] = useState(false);

//   const images =
//     data.images && data.images.length > 0
//       ? data.images
//       : ["/img/placeholder-property.jpg"];

//   const [usdRate, setUsdRate] = useState<number | null>(null);
//   const [usdLoading, setUsdLoading] = useState(false);

//   const price = data.salePrice ?? data.rentPrice;
//   const currency = data.salePrice ? data.saleCurrency : data.rentCurrency;
//   const isRent = Boolean(data.rentPrice);

//   // useEffect(() => {
//   //     if (!price || !currency || currency === "USD") return;

//   //     async function fetchRate() {
//   //         try {
//   //         const res = await fetch(`/api/exchange?base=${currency}`);
//   //         const json = await res.json();
//   //         if (json?.rates?.USD) {
//   //             setUsdRate(json.rates.USD);
//   //         }
//   //         } catch {
//   //         setUsdRate(null);
//   //         }
//   //     }

//   //     fetchRate();
//   //     }, [price, currency]);

//   useEffect(() => {
//     if (!price || !currency || currency === "USD") return;

//     async function fetchRate() {
//       setUsdLoading(true);
//       setUsdRate(null);

//       try {
//         const res = await fetch(`/api/exchange?base=${currency}`);
//         const json = await res.json();

//         if (json?.rates?.USD) {
//           setUsdRate(json.rates.USD);
//         }
//       } catch {
//         setUsdRate(null);
//       } finally {
//         setUsdLoading(false);
//       }
//     }

//     fetchRate();
//   }, [price, currency]);

//   const handleFavoriteClick = async (e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();

//     if (!user) {
//       setShowLoginModal(true);
//       return;
//     }

//     await toggleFavorite(data.id);
//   };

//   const openGallery = (index = 0) => {
//     setGalleryIndex(index);
//     setGalleryOpen(true);
//   };


//   const nextImage = () => setGalleryIndex((prev) => (prev + 1) % images.length);
//   const prevImage = () =>
//     setGalleryIndex((prev) => (prev - 1 + images.length) % images.length);

//   const primaryBadge = data.status?.includes("Sold")
//     ? "Sold"
//     : data.status?.[0] || null;
//   const isPropertyFavorited = isFavorited(data.id);

//   const labels = [
//     {
//       show: data.hot,
//       icon: "bi-lightning-charge-fill",
//       text: "Hot",
//       className: "hot",
//     },
//     {
//       show: data.newListing,
//       icon: "bi-star-fill",
//       text: "New",
//       className: "new",
//     },
//     {
//       show: data.featured,
//       icon: "bi-gem",
//       text: "Featured",
//       className: "featured",
//     },
//     {
//       show: data.exclusive,
//       icon: "bi-stars",
//       text: "Exclusive",
//       className: "exclusive",
//     },
//   ];

//   return (
//     <article
//       className={`mini-card ${className || ""}`}
//       data-aos="fade-up"
//       data-aos-delay="200"
//     >
//       <div className="thumb">
//         <Image
//           src={images[0]}
//           alt={data.title}
//           className="img-fluid"
//           loading="lazy"
//           width={0}
//           height={0}
//           unoptimized
//         />

//         {/* Status badge */}
//         {primaryBadge && (
//           <span
//             className={`label status-badge ${primaryBadge.toLowerCase().replace(" ", "-")}`}
//           >
//             {primaryBadge}
//           </span>
//         )}

//         {/* Render only the labels that are true */}
//         {labels
//           .filter((label) => label.show)
//           .map((label, idx) => (
//             <span
//               key={idx}
//               className={`label ${label.className}`}
//               style={{ left: "70px" }}
//             >
//               <i className={`bi ${label.icon}`}></i> {label.text}
//             </span>
//           ))}
//       </div>

//       <div className="mini-body">
//         {/* <div className="mini-loc"> */}
//         <div className="property-overlay">
//           <h4>
//             <Link href={`/properties/${data.id}`}>{data.title}</Link>
//           </h4>
//           <div className="heart-gallery">
//             <button
//               className={`favorite-btn ${isPropertyFavorited ? "favorited" : ""}`}
//               onClick={handleFavoriteClick}
//               title={
//                 isPropertyFavorited
//                   ? "Remove from favorites"
//                   : "Add to favorites"
//               }
//             >
//               <i
//                 className={`bi ${isPropertyFavorited ? "bi-heart-fill" : "bi-heart"}`}
//               ></i>
//             </button>
//             {images.length > 0 && (
//               <button
//                 className="gallery-btn"
//                 onClick={() => openGallery(0)}
//                 data-count={images.length}
//               >
//                 <i className="bi bi-images"></i>
//               </button>
//             )}
//           </div>
//         </div>
//         {/* <h4>
//                     <Link href={`/properties/${data.id}`}>{data.title}</Link>
//                 </h4> */}
//         <div className="mini-loc">
//           <i className="bi bi-geo"></i>{" "}
//           {data.showAddress ? data.address : data.city}
//         </div>
//         <div className="mini-specs">
//           <span>
//             <i className="bi bi-door-open"></i> {data.bedrooms || 0}
//           </span>
//           <span>
//             <i className="bi bi-droplet"></i> {data.bathrooms || 0}
//           </span>
//           <span>
//             <i className="bi bi-rulers"></i>{" "}
//             {formatArea(data.landSize, data.sizeUnit)}
//           </span>
//         </div>
//         <div>
//           <p style={{"marginBottom": "5px"}}>
//             {getDisplayDate(data.createdAt)}
//           </p>
//         </div>
//         <div className="mini-foot">
//           {/* <div className="mini-price">
//                         {data.salePrice ? `${formatPrice(data.salePrice, data.saleCurrency)}` : 
//                             data.rentPrice ? `${formatPrice(data.rentPrice, data.rentCurrency)}/month` : 'Price on request'}
//                     </div> */}
//           <div className="mini-price">
//             {!price || !currency ? (
//               "Price on request"
//             ) : (
//               <>
//                 <div>
//                   {formatPrice(price, currency)}
//                   {isRent && "/month"}
//                 </div>
//                 {currency !== "USD" && (
//                   <div className="price-usd">
//                     {usdLoading ? (
//                       <span className="usd-loading">
//                         ≈ USD loading…
//                         <i className="bi bi-arrow-repeat ms-1 spin" />
//                       </span>
//                     ) : (
//                       usdRate && (
//                         <>
//                           ≈ {formatPrice(Math.round(price * usdRate), "USD")}
//                           <i
//                             className="bi bi-info-circle ms-1"
//                             title="Approximate USD value based on current exchange rates"
//                           />
//                           {isRent && "/month"}
//                         </>
//                       )
//                     )}
//                   </div>
//                 )}
//               </>
//             )}
//           </div>

//           <Link href={`/properties/${data.id}`} className="mini-btn">
//             Details
//           </Link>
//         </div>
//       </div>


//     <ImageGalleryModal
//         open={galleryOpen}
//         images={images}
//         index={galleryIndex}
//         onClose={() => setGalleryOpen(false)}
//         onNext={nextImage}
//         onPrev={prevImage}
//         />

//       <LoginRequiredModal
//         open={showLoginModal}
//         onClose={() => setShowLoginModal(false)}
//         />
//     </article>
//   );
// }





"use client";

import Image from "next/image";
import { PropertyData } from "../../../types/property";
import Link from "next/link";
import { formatArea, formatPrice } from "@/utils/format";
import { useFavorites } from "@/hooks/useFavorites";
import { useState } from "react";
import ImageGalleryModal from "@/components/modules/ImageGalleryModal";
import LoginRequiredModal from "@/components/modules/LoginRequiredModal";
import { getDisplayDate } from "@/src/utils/dateUtils";
import { convertToUSD } from "@/utils/convertToUSD"; // <- import the helper

export default function PropertyCardSimple({
  data,
  className,
  isFavorited: propIsFavorited,
  toggleFavorite: propToggleFavorite,
}: {
  data: PropertyData;
  className?: string;
  isFavorited?: (id: string) => boolean;
  toggleFavorite?: (id: string) => Promise<boolean>;
}) {
  const { isFavorited: hookIsFavorited, toggleFavorite: hookToggleFavorite, user } = useFavorites();

  const isFavorited = propIsFavorited || hookIsFavorited;
  const toggleFavorite = propToggleFavorite || hookToggleFavorite;

  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [usdValue, setUsdValue] = useState<number | null>(null);
  const [usdLoading, setUsdLoading] = useState(false);

  const images = data.images && data.images.length > 0 ? data.images : ["/img/placeholder-property.jpg"];
  const price = data.salePrice ?? data.rentPrice;
  const currency = data.salePrice ? data.saleCurrency : data.rentCurrency;
  const isRent = Boolean(data.rentPrice);

  const primaryBadge = data.status?.includes("Sold") ? "Sold" : data.status?.[0] || null;
  const isPropertyFavorited = isFavorited(data.id);

  const labels = [
    { show: data.hot, icon: "bi-lightning-charge-fill", text: "Hot", className: "hot" },
    { show: data.newListing, icon: "bi-star-fill", text: "New", className: "new" },
    { show: data.featured, icon: "bi-gem", text: "Featured", className: "featured" },
    { show: data.exclusive, icon: "bi-stars", text: "Exclusive", className: "exclusive" },
  ];

  // Fetch USD value once
  if (price && currency && currency !== "USD" && usdValue === null && !usdLoading) {
    setUsdLoading(true);
    convertToUSD(price, currency)
      .then((value) => setUsdValue(value))
      .finally(() => setUsdLoading(false));
  }

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    await toggleFavorite(data.id);
  };

  const openGallery = (index = 0) => {
    setGalleryIndex(index);
    setGalleryOpen(true);
  };

  const nextImage = () => setGalleryIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setGalleryIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <article className={`mini-card ${className || ""}`} data-aos="fade-up" data-aos-delay="200">
      <div className="thumb">
        <Image
          src={images[0]}
          alt={data.title}
          className="img-fluid"
          loading="lazy"
          width={0}
          height={0}
          unoptimized
        />

        {primaryBadge && (
          <span className={`label status-badge ${primaryBadge.toLowerCase().replace(" ", "-")}`}>
            {primaryBadge}
          </span>
        )}

        {/* {labels.filter((label) => label.show).map((label, idx) => (
          <span key={idx} className={`label ${label.className}`} style={{ left: "70px" }}>
            <i className={`bi ${label.icon}`}></i> {label.text}
          </span>
        ))} */}
        
        <span className={`label ${labels[0].className}`} style={{ left: "70px" }}>
          <i className={`bi ${labels[0].icon}`}></i> {labels[0].text}
        </span>
      </div>

      <div className="mini-body">
        <div className="property-overlay">
          <h4>
            <Link href={`/properties/${data.id}`}>{data.title}</Link>
          </h4>
          <div className="heart-gallery">
            <button
              className={`favorite-btn ${isPropertyFavorited ? "favorited" : ""}`}
              onClick={handleFavoriteClick}
              title={isPropertyFavorited ? "Remove from favorites" : "Add to favorites"}
            >
              <i className={`bi ${isPropertyFavorited ? "bi-heart-fill" : "bi-heart"}`}></i>
            </button>
            {images.length > 0 && (
              <button className="gallery-btn" onClick={() => openGallery(0)} data-count={images.length}>
                <i className="bi bi-images"></i>
              </button>
            )}
          </div>
        </div>

        <div className="mini-loc">
          <i className="bi bi-geo"></i> {data.showAddress ? data.address : data.city}
        </div>
        <div className="mini-specs">
          <span>
            <i className="bi bi-door-open"></i> {data.bedrooms || 0}
          </span>
          <span>
            <i className="bi bi-droplet"></i> {data.bathrooms || 0}
          </span>
          <span>
            <i className="bi bi-rulers"></i> {formatArea(data.landSize, data.sizeUnit)}
          </span>
        </div>
        <div>
          <p style={{ marginBottom: "5px" }}>{getDisplayDate(data.createdAt)}</p>
        </div>

        <div className="mini-foot">
          <div className="mini-price">
            {!price || !currency ? (
              "Price on request"
            ) : (
              <>
                <div>
                  {formatPrice(price, currency)}
                  {isRent && "/month"}
                </div>
                {currency !== "USD" && (
                  <div className="price-usd">
                    {usdLoading ? (
                      <span className="usd-loading">
                        ≈ USD loading… <i className="bi bi-arrow-repeat ms-1 spin" />
                      </span>
                    ) : (
                      usdValue && (
                        <>
                          ≈ {formatPrice(Math.round(usdValue), "USD")}
                          <i
                            className="bi bi-info-circle ms-1"
                            title="Approximate USD value based on current exchange rates"
                          />
                          {isRent && "/month"}
                        </>
                      )
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          <Link href={`/properties/${data.id}`} className="mini-btn">
            Details
          </Link>
        </div>
      </div>

      <ImageGalleryModal
        open={galleryOpen}
        images={images}
        index={galleryIndex}
        onClose={() => setGalleryOpen(false)}
        onNext={nextImage}
        onPrev={prevImage}
      />

      <LoginRequiredModal open={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </article>
  );
}




// // PropertyCardSimple.tsx
// "use client";

// import Image from "next/image";
// import { PropertyData } from "../../../types/property";
// import Link from "next/link";
// import { formatArea, formatNumber } from "@/utils/format";
// import "./PropertyCardHorizontal.css";

// export default function PropertyCardSimple({ data }: { data: PropertyData }) {
//     // Helper function to get display price
//     const getDisplayPrice = () => {
//         const parts = [];

//         if (data.salePrice && data.status?.includes('For Sale')) {
//             parts.push(`$${formatNumber(data.salePrice)}`);
//         }

//         if (data.rentPrice && data.status?.includes('For Rent')) {
//             parts.push(`$${formatNumber(data.rentPrice)}/month`);
//         }

//         if (data.status?.includes('Sold')) {
//             parts.push('Sold');
//         }

//         return parts.join(' • ') || 'Price on request';
//     };

//     // Helper function to get primary badge (first status or "Sold")
//     const getPrimaryBadge = () => {
//         if (!data.status || data.status.length === 0) return null;

//         // If sold, show sold badge
//         if (data.status.includes('Sold')) {
//             return 'Sold';
//         }

//         // Otherwise show first status
//         return data.status[0];
//     };

//     // Get badge class based on status
//     const getStatusBadgeClass = (status: string) => {
//         switch (status) {
//             case 'For Sale': return 'badge-status for-sale';
//             case 'For Rent': return 'badge-status for-rent';
//             case 'Sold': return 'badge-status sold';
//             default: return 'badge-status';
//         }
//     };

//     // Format area with unit
//     const formatBuildingArea = () => {
//         if (data.buildingSize && data.sizeUnit) {
//             return formatArea(data.buildingSize, data.sizeUnit);
//         }
//         return null;
//     };

//     const formatLandArea = () => {
//         if (data.landSize && data.sizeUnit) {
//             return formatArea(data.landSize, data.sizeUnit);
//         }
//         return null;
//     };

//     // Get labels to display
//     const getLabels = () => {
//         const labels = [];

//         // Status badge (highest priority)
//         const primaryBadge = getPrimaryBadge();
//         if (primaryBadge) {
//             labels.push({
//                 show: true,
//                 icon: primaryBadge === 'For Sale' ? 'bi-tag-fill' :
//                       primaryBadge === 'For Rent' ? 'bi-calendar-check-fill' :
//                       'bi-check-circle-fill',
//                 text: primaryBadge,
//                 className: getStatusBadgeClass(primaryBadge).replace('badge-status ', '')
//             });
//         }

//         // Additional labels
//         if (data.hot) labels.push({
//             show: true,
//             icon: "bi-lightning-charge-fill",
//             text: "Hot",
//             className: "hot"
//         });

//         if (data.newListing) labels.push({
//             show: true,
//             icon: "bi-star-fill",
//             text: "New",
//             className: "new"
//         });

//         if (data.featured) labels.push({
//             show: true,
//             icon: "bi-gem",
//             text: "Featured",
//             className: "featured"
//         });

//         if (data.exclusive) labels.push({
//             show: true,
//             icon: "bi-stars",
//             text: "Exclusive",
//             className: "exclusive"
//         });

//         // Limit to 2 labels for simplicity
//         return labels.slice(0, 2);
//     };

//     // Get fallback image
//     const getImageSrc = () => {
//         if (data.images && data.images.length > 0) {
//             return data.images[0];
//         }
//         return "/img/placeholder-property.jpg";
//     };

//     // Get location text
//     const getLocationText = () => {
//         if (data.showAddress && data.address) {
//             return data.address;
//         }
//         if (data.city) {
//             return data.city;
//         }
//         // if (data.state) {
//         //     return data.state;
//         // }
//         return "Location not specified";
//     };

//     const labels = getLabels();
//     const displayPrice = getDisplayPrice();
//     const buildingArea = formatBuildingArea();
//     const landArea = formatLandArea();

//     return (
//         <article className="mini-card" data-aos="fade-up" data-aos-delay="200">
//             {/* Thumbnail with Link */}
//             <Link href={`/properties/${data.id}`} className="thumb">
//                 <Image
//                     src={getImageSrc()}
//                     alt={data.title || "Property"}
//                     className="img-fluid"
//                     loading="lazy"
//                     width={0}
//                     height={0}
//                     unoptimized
//                     style={{
//                         width: '100%',
//                         height: '200px',
//                         objectFit: 'cover'
//                     }}
//                 />

//                 {/* Labels/Badges */}
//                 <div className="labels-container">
//                     {labels.map((label, idx) => (
//                         <span
//                             key={idx}
//                             className={`label ${label.className}`}
//                             title={label.text}
//                         >
//                             <i className={`bi ${label.icon}`}></i>
//                             <span className="label-text">{label.text}</span>
//                         </span>
//                     ))}
//                 </div>

//                 {/* Image overlay on hover */}
//                 <div className="thumb-overlay">
//                     <span className="overlay-text">View Details</span>
//                 </div>
//             </Link>

//             {/* Card Body */}
//             <div className="mini-body">
//                 {/* Title */}
//                 <h4 className="mini-title">
//                     <Link href={`/properties/${data.id}`} className="text-decoration-none">
//                         {data.title || "Untitled Property"}
//                     </Link>
//                 </h4>

//                 {/* Location */}
//                 <div className="mini-loc">
//                     <i className="bi bi-geo-alt"></i>
//                     <span className="loc-text">{getLocationText()}</span>
//                 </div>

//                 {/* Features/Specifications */}
//                 <div className="mini-specs">
//                     {data.bedrooms && data.bedrooms > 0 && (
//                         <span className="spec-item" title="Bedrooms">
//                             <i className="bi bi-door-open"></i>
//                             <span className="spec-text">{data.bedrooms} Bed{data.bedrooms !== 1 ? 's' : ''}</span>
//                         </span>
//                     )}

//                     {data.bathrooms && data.bathrooms > 0 && (
//                         <span className="spec-item" title="Bathrooms">
//                             <i className="bi bi-droplet"></i>
//                             <span className="spec-text">{data.bathrooms} Bath{data.bathrooms !== 1 ? 's' : ''}</span>
//                         </span>
//                     )}

//                     {buildingArea && (
//                         <span className="spec-item" title="Building Size">
//                             <i className="bi bi-rulers"></i>
//                             <span className="spec-text">{buildingArea}</span>
//                         </span>
//                     )}

//                     {landArea && data.landSize && data.buildingSize && data.landSize > data.buildingSize && (
//                         <span className="spec-item" title="Land Size">
//                             <i className="bi bi-tree"></i>
//                             <span className="spec-text">{landArea}</span>
//                         </span>
//                     )}
//                 </div>

//                 {/* Footer with Price and Button */}
//                 <div className="mini-foot">
//                     <div className="mini-price" title={displayPrice}>
//                         {displayPrice}
//                     </div>
//                     <Link
//                         href={`/properties/${data.id}`}
//                         className="mini-btn"
//                         aria-label={`View details for ${data.title}`}
//                     >
//                         Details
//                         <i className="bi bi-arrow-right ms-1"></i>
//                     </Link>
//                 </div>

//                 {/* Quick Actions (optional) */}
//                 <div className="mini-actions">
//                     <button
//                         className="mini-action-btn"
//                         onClick={(e) => {
//                             e.preventDefault();
//                             e.stopPropagation();
//                             // Add to favorites logic here
//                         }}
//                         title="Add to favorites"
//                     >
//                         <i className="bi bi-heart"></i>
//                     </button>
//                     <button
//                         className="mini-action-btn"
//                         onClick={(e) => {
//                             e.preventDefault();
//                             e.stopPropagation();
//                             // Share logic here
//                         }}
//                         title="Share property"
//                     >
//                         <i className="bi bi-share"></i>
//                     </button>
//                 </div>
//             </div>
//         </article>
//     );
// }
