// "use client";

// import Image from "next/image";
// import { PropertyData } from "../../../types/property";
// import Link from "next/link";
// import { formatArea, formatNumber } from "@/utils/format";
// import "../css/PropertyCardPremium.css";
// import { useFavorites } from "@/hooks/useFavorites";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import Toast from "../../ui/Toast";

// export default function PropertyCardPremium({ data, isFavorited: propIsFavorited, toggleFavorite: propToggleFavorite, lgClass = 'col-lg-6' }: { data: PropertyData, isFavorited?: (id: string) => boolean, toggleFavorite?: (id: string) => Promise<boolean>, lgClass?: string }) {
//     const { isFavorited: hookIsFavorited, toggleFavorite: hookToggleFavorite, user } = useFavorites();
//     const router = useRouter();
//     const [toastMessage, setToastMessage] = useState<string | null>(null);
//     const [toastType, setToastType] = useState<'error' | 'success' | 'info'>('info');
//     const [showLoginModal, setShowLoginModal] = useState(false);

//     const isFavorited = propIsFavorited || hookIsFavorited;
//     const toggleFavorite = propToggleFavorite || hookToggleFavorite;

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
//     const getBadgeClass = (status: string) => {
//         switch (status) {
//             case 'For Sale': return 'badge for-sale';
//             case 'For Rent': return 'badge for-rent';
//             case 'Sold': return 'badge sold';
//             default: return 'badge';
//         }
//     };

//     // Format area with unit
//     const formatBuildingArea = () => {
//         if (data.buildingSize && data.sizeUnit) {
//             return formatArea(data.buildingSize, data.sizeUnit);
//         }
//         return null;
//     };

//     // Handle favorite toggle
//     const handleFavoriteClick = async (e: React.MouseEvent) => {
//         e.preventDefault(); // Prevent navigation
//         e.stopPropagation(); // Prevent event bubbling

//         if (!user) {
//             // Show login modal
//             setShowLoginModal(true);
//             return;
//         }

//         await toggleFavorite(data.id);
//     };

//     // // Show toast notification
//     // const showToast = (message: string, type: 'error' | 'success' | 'info' = 'info', onAction?: () => void, actionText?: string) => {
//     //     setToastMessage(message);
//     //     setToastType(type);
//     //     setToastAction({ onAction, actionText });
//     //     setTimeout(() => setToastMessage(null), 5000); // Hide after 5 seconds
//     // };

//     const primaryBadge = getPrimaryBadge();
//     const isPropertyFavorited = isFavorited(data.id);

//     return (
//         <div className={`${lgClass} col-md-6`}>
//             <div className="property-card">
//                 <div className="property-image">
//                     {/* Use first image from data or placeholder */}
//                     <Image
//                         src={data.images && data.images.length > 0 ? data.images[0] : "/img/placeholder-property.jpg"}
//                         alt={data.title}
//                         className="img-fluid"
//                         width={0}
//                         height={0}
//                         unoptimized
//                         style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
//                     />

//                     <div className="property-badges">
//                         {primaryBadge && (
//                             <span className={getBadgeClass(primaryBadge)}>
//                                 {primaryBadge}
//                             </span>
//                         )}
//                         {data.status && data.status.length > 1 && (
//                             <span className="badge badge-secondary">
//                                 {data.status.length} Options
//                             </span>
//                         )}
//                         {data.hot && <span className="badge hot">Hot</span>}
//                         {data.newListing && <span className="badge new">New</span>}
//                         {data.featured && <span className="badge featured">Featured</span>}
//                         {data.exclusive && <span className="badge exclusive">Exclusive</span>}
//                     </div>

//                     <div className="property-overlay">
//                         <button
//                             className={`favorite-btn ${isPropertyFavorited ? 'favorited' : ''}`}
//                             onClick={handleFavoriteClick}
//                             title={isPropertyFavorited ? 'Remove from favorites' : 'Add to favorites'}
//                         >
//                             <i className={`bi ${isPropertyFavorited ? 'bi-heart-fill' : 'bi-heart'}`}></i>
//                         </button>
//                         <button className="gallery-btn" data-count={data.images?.length || 0}>
//                             <i className="bi bi-images"></i>
//                         </button>
//                     </div>
//                 </div>

//                 <div className="property-content">
//                     <div className="property-price">
//                         {getDisplayPrice()}
//                     </div>

//                     <h4 className="property-title">{data.title}</h4>

//                     <p className="property-location">
//                         <i className="bi bi-geo-alt"></i>
//                         {data.showAddress ? data.address : `${data.city}`}
//                     </p>

//                     <div className="property-features">
//                         {data.bedrooms && data.bedrooms > 0 && (
//                             <span><i className="bi bi-house"></i> {data.bedrooms} {data.bedrooms === 1 ? 'Bed' : 'Beds'}</span>
//                         )}
//                         {data.bathrooms && data.bathrooms > 0 && (
//                             <span><i className="bi bi-water"></i> {data.bathrooms} {data.bathrooms === 1 ? 'Bath' : 'Baths'}</span>
//                         )}
//                         {formatBuildingArea() && (
//                             <span><i className="bi bi-arrows-angle-expand"></i> {formatBuildingArea()}</span>
//                         )}
//                         {data.landSize && data.buildingSize && data.landSize > data.buildingSize && (
//                             <span title="Land Size"><i className="bi bi-tree"></i> {formatArea(data.landSize, data.sizeUnit)}</span>
//                         )}
//                     </div>

//                     {data.showAgent && data.agent && (
//                         <div className="property-agent">
//                             {data.agent.photo ? (
//                                 <Image
//                                     src={data.agent.photo}
//                                     alt={data.agent.name || "Agent"}
//                                     className="agent-avatar"
//                                     width={40}
//                                     height={40}
//                                     unoptimized
//                                 />
//                             ) : (
//                                 <div className="agent-avatar placeholder">
//                                     <i className="bi bi-person"></i>
//                                 </div>
//                             )}
//                             <div className="agent-info">
//                                 <strong>{data.agent.name || "Agent"}</strong>
//                                 {data.agent.title && (
//                                     <small className="agent-title">{data.agent.title}</small>
//                                 )}
//                                 <div className="agent-contact">
//                                     {data.agent.phone && (
//                                         <small><i className="bi bi-telephone"></i> {data.agent.phone}</small>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>
//                     )}

//                     <Link href={`/properties/${data.id}`} className="btn btn-primary w-100 mt-3">
//                         View Details
//                     </Link>
//                 </div>
//             </div>
//             {toastMessage && (
//                 <Toast
//                     message={toastMessage}
//                     type={toastType}
//                     onClose={() => {
//                         setToastMessage(null);
//                         // setToastAction(null);
//                     }}
//                     // onAction={toastAction?.onAction}
//                     // actionText={toastAction?.actionText}
//                 />
//             )}

//             {/* Login Required Modal */}
//             {showLoginModal && (
//                 <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
//                     <div className="modal-dialog modal-dialog-centered">
//                         <div className="modal-content">
//                             <div className="modal-header">
//                                 <h5 className="modal-title">Login Required</h5>
//                                 <button type="button" className="btn-close" onClick={() => setShowLoginModal(false)}></button>
//                             </div>
//                             <div className="modal-body">
//                                 <p>You need to be logged in to save properties to your favorites.</p>
//                                 <p className="text-muted">Would you like to login now?</p>
//                             </div>
//                             <div className="modal-footer">
//                                 <button type="button" className="btn btn-secondary cancel-favorite-btn" onClick={() => setShowLoginModal(false)}>
//                                     Cancel
//                                 </button>
//                                 <button type="button" className="btn custom-button" onClick={() => {
//                                     setShowLoginModal(false);
//                                     router.push('/login');
//                                 }}>
//                                     Login Now
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }





// "use client";

// import Image from "next/image";
// import { PropertyData } from "../../../types/property";
// import Link from "next/link";
// import { formatPrice } from "@/utils/format";
// import { useFavorites } from "@/hooks/useFavorites";
// import { useEffect, useState } from "react";
// import LoginRequiredModal from "@/components/modules/LoginRequiredModal";
// import ImageGalleryModal from "@/components/modules/ImageGalleryModal";
// import { getDisplayDate } from "@/src/utils/dateUtils";
// // import "../css/PropertyCardPremium.css";
// // import "./css/PropertyCardPremium.css";

// export default function PropertyCardPremium({
//     data,
//     isFavorited: propIsFavorited,
//     toggleFavorite: propToggleFavorite,
//     lgClass = "col-lg-6",
// }: {
//     data: PropertyData;
//     isFavorited?: (id: string) => boolean;
//     toggleFavorite?: (id: string) => Promise<boolean>;
//     lgClass?: string;
// }) {
//     const {
//         isFavorited: hookIsFavorited,
//         toggleFavorite: hookToggleFavorite,
//         user,
//     } = useFavorites();

//     const isFavorited = propIsFavorited || hookIsFavorited;
//     const toggleFavorite = propToggleFavorite || hookToggleFavorite;

//     const [galleryOpen, setGalleryOpen] = useState(false);
//     const [galleryIndex, setGalleryIndex] = useState(0);

//     const [showLoginModal, setShowLoginModal] = useState(false);

//     const images =
//         data.images && data.images.length > 0
//             ? data.images
//             : ["/img/placeholder-property.jpg"];

//     const [usdRate, setUsdRate] = useState<number | null>(null);
//     const [usdLoading, setUsdLoading] = useState(false);
//     const price = data.salePrice ?? data.rentPrice;
//     const currency = data.salePrice ? data.saleCurrency : data.rentCurrency;
//     const isRent = Boolean(data.rentPrice);
//     // useEffect(() => {
//     //     if (!price || !currency || currency === "USD") return;

//     //     async function fetchRate() {
//     //         try {
//     //             const res = await fetch(`/api/exchange?base=${currency}`);
//     //             const json = await res.json();
//     //             if (json?.rates?.USD) {
//     //                 setUsdRate(json.rates.USD);
//     //             }
//     //         } catch {
//     //             setUsdRate(null);
//     //         }
//     //     }

//     //     fetchRate();
//     // }, [price, currency]);

//     useEffect(() => {
//         if (!price || !currency || currency === "USD") return;

//         async function fetchRate() {
//             setUsdLoading(true);
//             setUsdRate(null);

//             try {
//                 const res = await fetch(`/api/exchange?base=${currency}`);
//                 const json = await res.json();

//                 if (json?.rates?.USD) {
//                     setUsdRate(json.rates.USD);
//                 }
//             } catch {
//                 setUsdRate(null);
//             } finally {
//                 setUsdLoading(false);
//             }
//         }

//         fetchRate();
//     }, [price, currency]);

//     const handleFavoriteClick = async (e: React.MouseEvent) => {
//         e.preventDefault();
//         e.stopPropagation();

//         if (!user) {
//             setShowLoginModal(true);
//             return;
//         }

//         await toggleFavorite(data.id);
//     };

//     const openGallery = (index = 0) => {
//         setGalleryIndex(index);
//         setGalleryOpen(true);
//     };

//     const nextImage = () => setGalleryIndex((prev) => (prev + 1) % images.length);
//     const prevImage = () =>
//         setGalleryIndex((prev) => (prev - 1 + images.length) % images.length);

//     const primaryBadge = data.status?.includes("Sold")
//         ? "Sold"
//         : data.status?.[0] || null;
//     const isPropertyFavorited = isFavorited(data.id);

//     const displayDate = getDisplayDate(data.createdAt);

//     return (
//         <div className={`${lgClass} col-md-6`}>
//             <div className="property-card">
//                 <div className="property-image">
//                     <Image
//                         src={images[0]}
//                         alt={data.title}
//                         className="img-fluid"
//                         width={0}
//                         height={0}
//                         unoptimized
//                         style={{ width: "100%", height: "300px", objectFit: "cover" }}
//                         loading="eager"
//                         priority
//                     />

//                     <div className="property-badges">
//                         {primaryBadge && (
//                             <span
//                                 className={`badge ${primaryBadge.toLowerCase().replace(" ", "-")}`}
//                             >
//                                 {primaryBadge}
//                             </span>
//                         )}
//                         {data.hot && <span className="badge hot">Hot</span>}
//                         {data.newListing && <span className="badge new">New</span>}
//                         {data.featured && <span className="badge featured">Featured</span>}
//                         {data.exclusive && (
//                             <span className="badge exclusive">Exclusive</span>
//                         )}
//                     </div>

//                     <div className="property-overlay premium">
//                         <button
//                             className={`favorite-btn ${isPropertyFavorited ? "favorited" : ""}`}
//                             onClick={handleFavoriteClick}
//                             title={
//                                 isPropertyFavorited
//                                     ? "Remove from favorites"
//                                     : "Add to favorites"
//                             }
//                         >
//                             <i
//                                 className={`bi ${isPropertyFavorited ? "bi-heart-fill" : "bi-heart"}`}
//                             ></i>
//                         </button>

//                         <button
//                             className="gallery-btn"
//                             onClick={() => openGallery(0)}
//                             data-count={images.length}
//                         >
//                             <i className="bi bi-images"></i>
//                         </button>
//                     </div>
//                 </div>

//                 <div className="property-content d-flex flex-column align-items-start" style={{"height": "46%"}}>
//                     <div className="property-price">
//                         {!price || !currency ? (
//                             "Price on request" + " " + price + " " + currency
//                         ) : (
//                             <>
//                                 <div>
//                                     {formatPrice(price, currency)}
//                                     {isRent && "/month"}
//                                 </div>
//                                 {currency !== "USD" && (
//                                     <div className="price-usd">
//                                         {usdLoading ? (
//                                             <span className="usd-loading">
//                                                 ≈ USD loading…
//                                                 <i className="bi bi-arrow-repeat ms-1 spin" />
//                                             </span>
//                                         ) : (
//                                             usdRate && (
//                                                 <>
//                                                     ≈ {formatPrice(Math.round(price * usdRate), "USD")}
//                                                     <i
//                                                         className="bi bi-info-circle ms-1"
//                                                         title="Approximate USD value based on current exchange rates"
//                                                     />
//                                                     {isRent && "/month"}
//                                                 </>
//                                             )
//                                         )}
//                                     </div>
//                                 )}
//                             </>
//                         )}
//                     </div>

//                     <h4 className="property-title">{data.title}</h4>
//                     <p className="property-location">
//                         <i className="bi bi-geo-alt"></i>
//                         {data.showAddress ? data.address : data.city}
//                     </p>

//                     <div style={{"width": "100%", "marginTop": "auto"}}>
//                         <p className="property-location">
//                             {/* {data.createdAt} */}
//                             { displayDate }
//                         </p>

//                         <Link
//                             href={`/properties/${data.id}`}
//                             className="btn btn-primary w-100 mt-3 mt-auto"
//                         >
//                             View Details
//                         </Link>
//                     </div>
//                 </div>
//             </div>

//             <ImageGalleryModal
//                 open={galleryOpen}
//                 images={images}
//                 index={galleryIndex}
//                 onClose={() => {setGalleryOpen(false)}}
//                 onNext={nextImage}
//                 onPrev={prevImage}
//             />

//             {/* Login Required Modal */}
//             <LoginRequiredModal
//                 open={showLoginModal}
//                 onClose={() => setShowLoginModal(false)}
//             />
//         </div>
//     );
// }





"use client";

import Image from "next/image";
import { PropertyData } from "../../../types/property";
import Link from "next/link";
import { formatPrice } from "@/utils/format";
import { useFavorites } from "@/hooks/useFavorites";
import { useState } from "react";
import LoginRequiredModal from "@/components/modules/LoginRequiredModal";
import ImageGalleryModal from "@/components/modules/ImageGalleryModal";
import { getDisplayDate } from "@/src/utils/dateUtils";
import { convertToUSD } from "@/utils/convertToUSD";

export default function PropertyCardPremium({
  data,
  isFavorited: propIsFavorited,
  toggleFavorite: propToggleFavorite,
  lgClass = "col-lg-6",
}: {
  data: PropertyData;
  isFavorited?: (id: string) => boolean;
  toggleFavorite?: (id: string) => Promise<boolean>;
  lgClass?: string;
}) {
  const { isFavorited: hookIsFavorited, toggleFavorite: hookToggleFavorite, user } = useFavorites();

  const isFavorited = propIsFavorited || hookIsFavorited;
  const toggleFavorite = propToggleFavorite || hookToggleFavorite;

  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [usdSaleValue, setUsdSaleValue] = useState<number | null>(null);
  const [usdRentValue, setUsdRentValue] = useState<number | null>(null);
  const [usdLoading, setUsdLoading] = useState(false);

  const images = data.images && data.images.length > 0 ? data.images : ["/img/placeholder-property.jpg"];
  const salePrice = data.salePrice;
  const rentPrice = data.rentPrice;
  const saleCurrency = data.salePrice ? data.saleCurrency : "USD";
  const rentCurrency = data.rentPrice ? data.rentCurrency : "USD";
  const isRent = Boolean(data.rentPrice);
  const displayDate = getDisplayDate(data.createdAt);

  // Fetch USD value whenever price or currency changes
  if (salePrice && saleCurrency && saleCurrency !== "USD" && usdSaleValue === null && !usdLoading) {
    setUsdLoading(true);
    convertToUSD(salePrice, saleCurrency)
      .then((value) => setUsdSaleValue(value))
      .finally(() => setUsdLoading(false));
  }
  if (rentPrice && rentCurrency && rentCurrency !== "USD" && usdRentValue === null && !usdLoading) {
    setUsdLoading(true);
    convertToUSD(rentPrice, rentCurrency)
      .then((value) => setUsdRentValue(value))
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

  // const openGallery = (index = 0) => setGalleryIndex(index) || setGalleryOpen(true);
  const openGallery = (index = 0) => {
    setGalleryIndex(index);
    setGalleryOpen(true);
  };
  const nextImage = () => setGalleryIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setGalleryIndex((prev) => (prev - 1 + images.length) % images.length);

  // const primaryBadge = data.status?.includes("Sold") ? "Sold" : data.status?.[0] || null;
  const isPropertyFavorited = isFavorited(data.id);

  return (
    <div className={`${lgClass} col-md-6`}>
      <div className="property-card" style={{ "display": "grid", "gridTemplateRows": "auto 1fr" }}>
        <div className="property-image" style={{ height: "100%" }}>
          <Image
            src={images[0]}
            alt={data.title}
            className="img-fluid"
            width={0}
            height={0}
            unoptimized
            style={{ width: "100%", height: "300px", objectFit: "cover" }}
            loading="eager"
            priority
          />

          <div className="property-badges">
            {/* {primaryBadge && (
              <span className={`badge ${primaryBadge.toLowerCase().replace(" ", "-")}`}>
                {primaryBadge}
              </span>
            )} */}
            {data.status?.map((status) => (
              <span
                key={status}
                className={`badge ${status.toLowerCase().replace(" ", "-")}`}
              >
                {status}
              </span>
            ))}
            {data.hot && <span className="badge hot">Hot</span>}
            {data.newListing && <span className="badge new">New</span>}
            {data.featured && <span className="badge featured">Featured</span>}
            {data.exclusive && <span className="badge for-sale">Exclusive</span>}
          </div>

          <div className="property-overlay premium">
            <button
              className={`favorite-btn ${isPropertyFavorited ? "favorited" : ""}`}
              onClick={handleFavoriteClick}
              title={isPropertyFavorited ? "Remove from favorites" : "Add to favorites"}
            >
              <i className={`bi ${isPropertyFavorited ? "bi-heart-fill" : "bi-heart"}`}></i>
            </button>

            <button className="gallery-btn" onClick={() => openGallery(0)} data-count={images.length}>
              <i className="bi bi-images"></i>
            </button>
          </div>
        </div>

        <div className="property-content d-flex flex-column align-items-start" style={{ height: "100%" }}>
          <div className="property-price">
            {/* SALE PRICE */}
            {salePrice && saleCurrency && (
              <div className="mb-1">
                <div>{formatPrice(salePrice, saleCurrency)}</div>

                {saleCurrency !== "USD" && (
                  <div className="price-usd">
                    {usdLoading ? (
                      <span className="usd-loading">
                        ≈ USD loading… <i className="bi bi-arrow-repeat ms-1 spin" />
                      </span>
                    ) : (
                      usdSaleValue && (
                        <>≈ {formatPrice(Math.round(usdSaleValue), "USD")}</>
                      )
                    )}
                  </div>
                )}
              </div>
            )}

            {/* RENT PRICE */}
            {rentPrice && rentCurrency && (
              <div>
                <div>
                  {formatPrice(rentPrice, rentCurrency)}
                  {isRent && data.rentPeriodLabel
                    ? ` ${data.rentPeriodLabel.toLowerCase()}`
                    : isRent
                      ? " /month"
                      : ""}
                </div>

                {rentCurrency !== "USD" && (
                  <div className="price-usd">
                    {usdLoading ? (
                      <span className="usd-loading">
                        ≈ USD loading… <i className="bi bi-arrow-repeat ms-1 spin" />
                      </span>
                    ) : (
                      usdRentValue && (
                        <>
                          ≈ {formatPrice(Math.round(usdRentValue), "USD")}
                          {isRent && data.rentPeriodLabel
                            ? ` ${data.rentPeriodLabel.toLowerCase()}`
                            : isRent
                              ? " /month"
                              : ""}
                        </>
                      )
                    )}
                  </div>
                )}
              </div>
            )}

            {/* FALLBACK */}
            {!salePrice && !rentPrice && (
              <div>Price on request</div>
            )}
          </div>

          <h4 className="property-title">{data.title}</h4>
          <p className="property-location">
            <i className="bi bi-geo-alt"></i>
            {data.showAddress ? data.address : data.city}
          </p>

          <div style={{ width: "100%", marginTop: "auto" }}>
            <p className="property-location">{displayDate}</p>
            <Link href={`/properties/${data.id}`} className="btn btn-primary w-100 mt-3 mt-auto">
              View Details
            </Link>
          </div>
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
    </div>
  );
}
