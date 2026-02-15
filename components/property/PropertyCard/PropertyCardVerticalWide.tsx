// import Image from "next/image";
// import { PropertyData } from "../../../types/property";
// import Link from "next/link";
// import { formatNumber } from "@/utils/format";
// import { formatArea } from "@/utils/format";

// // export default function PropertyCardSimpleWide() {
// export default function PropertyCardSimpleWide({ data }: { data: PropertyData }) {
//     const labels = [
//         { show: data.hot, icon: "bi-lightning-charge-fill", text: "Hot", className: "hot" },
//         { show: data.newListing, icon: "bi-star-fill", text: "New", className: "new" },
//         { show: data.featured, icon: "bi-gem", text: "Featured", className: "featured" },
//         { show: data.exclusive, icon: "bi-stars", text: "Exclusive", className: "exclusive" },
//     ];

//     return (
//         <article className="highlight-card">
//             <div className="media">
//                 <div className="badge-set">
//                     {labels
//                         .filter((label) => label.show)
//                         .map((label, idx) => (
//                             <span key={idx} className="flag featured">{label.text}</span>
//                         ))}
//                     {/* <span className="flag premium">{data.status}</span> */}
//                     {/* <span className="flag featured">Featured</span> */}
//                     <span className="flag premium">Premium</span>


//                 </div>
//                 <Link href={`/properties/${data.id}`} className="image-link">
//                     <Image src={data.images[0]} alt="Showcase Villa" className="img-fluid" width={0} height={0} unoptimized />
//                 </Link>
//                 <div className="quick-specs">
//                     <span><i className="bi bi-door-open"></i> {data.bedrooms} Beds</span>
//                     <span><i className="bi bi-droplet"></i> {data.bathrooms} Baths</span>
//                     {/* <span><i className="bi bi-aspect-ratio"></i> {formatNumber(data.areaSize ? data.areaSize : 0)} {data.areaUnit}</span> */}
//                     <span><i className="bi bi-aspect-ratio"></i> {formatArea(data.landSize, data.sizeUnit)}</span>
//                 </div>
//             </div>
//             <div className="content">
//                 <div className="top">
//                     <div>
//                         <h3><Link href={`/properties/${data.id}`}>{data.title}</Link></h3>
//                         <div className="loc"><i className="bi bi-geo-alt-fill"></i> {data.address}</div>
//                     </div>
//                     <div>
//                     <div className="price">${formatNumber(data.salePrice)}</div>
//                     <div className="price">${formatNumber(data.salePrice)}</div>

//                     </div>
//                 </div>
//                 <p className="excerpt">{data.description}</p>
//                 <div className="cta">
//                     <Link href={`/properties/${data.id}`} className="btn-main">Arrange Visit</Link>
//                     <Link href={`/properties/${data.id}`} className="btn-soft">More Photos</Link>
//                     <div className="meta">
//                         <span className="status for-sale">{data.status}</span>
//                         <span className="listed">Listed 2 days ago</span>
//                     </div>
//                 </div>
//             </div>
//         </article>
//     );
// }



// "use client";

// import Image from "next/image";
// import { PropertyData } from "../../../types/property";
// import Link from "next/link";
// import { formatPrice, formatArea } from "@/utils/format";
// import { useFavorites } from "@/hooks/useFavorites";
// import { useEffect, useState } from "react";
// import LoginRequiredModal from "@/components/modules/LoginRequiredModal";
// import ImageGalleryModal from "@/components/modules/ImageGalleryModal";
// import "./css/PropertyCardVerticalWide.css";

// export default function PropertyCardSimpleWide({
//     data,
//     isFavorited: propIsFavorited,
//     toggleFavorite: propToggleFavorite
// }: {
//     data: PropertyData,
//     isFavorited?: (id: string) => boolean,
//     toggleFavorite?: (id: string) => Promise<boolean>
// }) {
//     const { isFavorited: hookIsFavorited, toggleFavorite: hookToggleFavorite, user } = useFavorites();

//     const isFavorited = propIsFavorited || hookIsFavorited;
//     const toggleFavorite = propToggleFavorite || hookToggleFavorite;

//     const [galleryOpen, setGalleryOpen] = useState(false);
//     const [galleryIndex, setGalleryIndex] = useState(0);
//     const [showLoginModal, setShowLoginModal] = useState(false);

//     const images = data.images && data.images.length > 0 ? data.images : ["/img/placeholder-property.jpg"];

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
//     const prevImage = () => setGalleryIndex((prev) => (prev - 1 + images.length) % images.length);

//     const primaryBadge = data.status?.includes('Sold') ? 'Sold' : data.status?.[0] || null;
//     const isPropertyFavorited = isFavorited(data.id);

//     const labels = [
//         { show: data.hot, icon: "bi-lightning-charge-fill", text: "Hot", className: "hot" },
//         { show: data.newListing, icon: "bi-star-fill", text: "New", className: "new" },
//         { show: data.featured, icon: "bi-gem", text: "Featured", className: "featured" },
//         { show: data.exclusive, icon: "bi-stars", text: "Exclusive", className: "exclusive" },
//     ];


//     const price = data.salePrice ?? data.rentPrice;
//     const currency = data.salePrice ? data.saleCurrency : data.rentCurrency;
//     const isRent = Boolean(data.rentPrice);

//     const [usdRate, setUsdRate] = useState<number | null>(null);
//     const [usdLoading, setUsdLoading] = useState(false);

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

//     return (
//         <article className="highlight-card">
//             <div className="media">
//                 <div className="badge-set">
//                     {/* Status badge */}
//                     {/* {primaryBadge && <span className="flag status-badge">{primaryBadge}</span>} */}
//                     {primaryBadge && <span className="flag featured">{primaryBadge}</span>}

//                     {/* Render only the labels that are true */}
//                     {labels
//                         .filter((label) => label.show)
//                         .map((label, idx) => (
//                             <span key={idx} className="flag featured">{label.text}</span>
//                         ))}

//                     {data.featured && <span className="flag premium">Premium</span>}
//                 </div>

//                 <Link href={`/properties/${data.id}`} className="image-link">
//                     <Image
//                         src={images[0]}
//                         alt={data.title}
//                         className="img-fluid"
//                         width={0}
//                         height={0}
//                         unoptimized
//                     />

//                     {/* Favorite button */}
//                     <button
//                         className={`favorite-btn favorite-btn-custom ${isPropertyFavorited ? 'favorited' : ''}`}
//                         onClick={handleFavoriteClick}
//                         title={isPropertyFavorited ? 'Remove from favorites' : 'Add to favorites'}
//                     >
//                         <i className={`bi ${isPropertyFavorited ? 'bi-heart-fill' : 'bi-heart'}`}></i>
//                     </button>
//                 </Link>

//                 <div className="quick-specs">
//                     <span><i className="bi bi-door-open"></i> {data.bedrooms || 0} Beds</span>
//                     <span><i className="bi bi-droplet"></i> {data.bathrooms || 0} Baths</span>
//                     <span><i className="bi bi-aspect-ratio"></i> {formatArea(data.landSize, data.sizeUnit)}</span>
//                 </div>
//             </div>

//             <div className="content">
//                 <div className="top">
//                     <div>
//                         <h3><Link href={`/properties/${data.id}`}>{data.title}</Link></h3>
//                         <div className="loc">
//                             <i className="bi bi-geo-alt-fill"></i> {data.showAddress ? data.address : data.city}
//                         </div>
//                     </div>
//                     <div className="price">
//                         {!price || !currency ? (
//                             "Price on request"
//                         ) : (
//                             <>
//                                 <div className="main-price">
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
//                                                     {isRent && "/month"}
//                                                     <i
//                                                         className="bi bi-info-circle ms-1"
//                                                         title="Approximate USD value based on current exchange rates"
//                                                     />
//                                                 </>
//                                             )
//                                         )}
//                                     </div>
//                                 )}
//                             </>
//                         )}
//                     </div>

//                 </div>

//                 <p className="excerpt">{data.description?.substring(0, 150)}...</p>

//                 <div className="cta">
//                     <Link href={`/properties/${data.id}`} className="btn-main">Arrange Visit</Link>
//                     <button
//                         className="btn-soft"
//                         onClick={() => openGallery(0)}
//                         data-count={images.length}
//                         style={{ "backgroundColor": "transparent" }}
//                     >
//                         More Photos
//                     </button>
//                     <div className="meta">
//                         <span className={`status ${data.status?.toString().toLowerCase().replace(' ', '-')}`}>
//                             {data.status}
//                         </span>
//                         <span className="listed">Listed recently</span>
//                     </div>
//                 </div>
//             </div>

//             <ImageGalleryModal
//                 open={galleryOpen}
//                 images={images}
//                 index={galleryIndex}
//                 onClose={() => setGalleryOpen(false)}
//                 onNext={nextImage}
//                 onPrev={prevImage}
//             />

//             <LoginRequiredModal
//                 open={showLoginModal}
//                 onClose={() => setShowLoginModal(false)}
//             />
//         </article>
//     );
// }





"use client";

import Image from "next/image";
import { PropertyData } from "../../../types/property";
import Link from "next/link";
import { formatPrice, formatArea } from "@/utils/format";
import { useFavorites } from "@/hooks/useFavorites";
import { useState } from "react";
import LoginRequiredModal from "@/components/modules/LoginRequiredModal";
import ImageGalleryModal from "@/components/modules/ImageGalleryModal";
import { convertToUSD } from "@/utils/convertToUSD";
import "./css/PropertyCardVerticalWide.css";

export default function PropertyCardSimpleWide({
  data,
  isFavorited: propIsFavorited,
  toggleFavorite: propToggleFavorite
}: {
  data: PropertyData,
  isFavorited?: (id: string) => boolean,
  toggleFavorite?: (id: string) => Promise<boolean>
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

  // fetch USD once
  if (price && currency && currency !== "USD" && usdValue === null && !usdLoading) {
    setUsdLoading(true);
    convertToUSD(price, currency).then(v => setUsdValue(v)).finally(() => setUsdLoading(false));
  }

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return setShowLoginModal(true);
    await toggleFavorite(data.id);
  };

  const openGallery = (index = 0) => { setGalleryIndex(index); setGalleryOpen(true); };
  const nextImage = () => setGalleryIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setGalleryIndex((prev) => (prev - 1 + images.length) % images.length);

  const primaryBadge = data.status?.includes('Sold') ? 'Sold' : data.status?.[0] || null;
  const labels = [
    { show: data.hot, icon: "bi-lightning-charge-fill", text: "Hot", className: "hot" },
    { show: data.newListing, icon: "bi-star-fill", text: "New", className: "new" },
    { show: data.featured, icon: "bi-gem", text: "Featured", className: "featured" },
    { show: data.exclusive, icon: "bi-stars", text: "Exclusive", className: "exclusive" },
  ];

  const isPropertyFavorited = isFavorited(data.id);

  return (
    <article className="highlight-card">
      <div className="media">
        <div className="badge-set">
          {primaryBadge && <span className="flag featured">{primaryBadge}</span>}
          {labels.filter(label => label.show).map((label, idx) => <span key={idx} className="flag featured">{label.text}</span>)}
          {data.featured && <span className="flag premium">Premium</span>}
        </div>

        <Link href={`/properties/${data.id}`} className="image-link">
          <Image src={images[0]} alt={data.title} className="img-fluid" width={0} height={0} unoptimized/>
          <button className={`favorite-btn favorite-btn-custom ${isPropertyFavorited ? 'favorited' : ''}`} onClick={handleFavoriteClick} title={isPropertyFavorited ? 'Remove from favorites' : 'Add to favorites'}>
            <i className={`bi ${isPropertyFavorited ? 'bi-heart-fill' : 'bi-heart'}`}></i>
          </button>
        </Link>

        <div className="quick-specs">
          <span><i className="bi bi-door-open"></i> {data.bedrooms || 0} Beds</span>
          <span><i className="bi bi-droplet"></i> {data.bathrooms || 0} Baths</span>
          <span><i className="bi bi-aspect-ratio"></i> {formatArea(data.landSize, data.sizeUnit)}</span>
        </div>
      </div>
      <div className="content">
        <div className="top">
          <div>
            <h3><Link href={`/properties/${data.id}`}>{data.title}</Link></h3>
            <div className="loc"><i className="bi bi-geo-alt-fill"></i> {data.showAddress ? data.address : data.city}</div>
          </div>
          <div className="price">
            {!price || !currency ? "Price on request" : (
              <>
                {/* <div className="main-price">{formatPrice(price, currency)}{isRent && "/month"}</div>
                {currency !== "USD" && (
                  <div className="price-usd">
                    {usdLoading ? <span className="usd-loading">≈ USD loading… <i className="bi bi-arrow-repeat ms-1 spin" /></span> :
                      usdValue && <>≈ {formatPrice(Math.round(usdValue), "USD")}{isRent && "/month"}<i className="bi bi-info-circle ms-1" title="Approximate USD value based on current exchange rates" /></>}
                  </div>
                )} */}
<div className="main-price">
  {formatPrice(price, currency)}
  {isRent && data.rentPeriodLabel ? ` ${data.rentPeriodLabel.toLowerCase()}` : isRent && "/month"}
</div>
{currency !== "USD" && (
  <div className="price-usd">
    {usdLoading ? (
      <span className="usd-loading">≈ USD loading…</span>
    ) : (
      usdValue && <>≈ {formatPrice(Math.round(usdValue), "USD")}{isRent && data.rentPeriodLabel ? ` ${data.rentPeriodLabel.toLowerCase()}` : isRent && "/month"}</>
    )}
  </div>
)}

              </>
            )}
          </div>
        </div>

        {/* <p className="excerpt">{data.description?.substring(0, 150)}...</p> */}
        <p className="excerpt">{data.description?.substring(0, 250)}...</p>

        <div className="cta">
          <Link href={`/properties/${data.id}`} className="btn-main">Arrange Visit</Link>
          <button className="btn-soft" onClick={() => openGallery(0)} data-count={images.length} style={{ backgroundColor: "transparent" }}>More Photos</button>
          <div className="meta">
            <span className={`status ${data.status?.toString().toLowerCase().replace(' ', '-')}`}>{data.status}</span>
            <span className="listed">Listed recently</span>
          </div>
        </div>
      </div>

      <ImageGalleryModal open={galleryOpen} images={images} index={galleryIndex} onClose={() => setGalleryOpen(false)} onNext={nextImage} onPrev={prevImage} />
      <LoginRequiredModal open={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </article>
  );
}
