// import Image from "next/image";
// import { PropertyData } from "../../../types/property";
// import Link from "next/link";
// import { formatArea } from "@/utils/format";
// import { useEffect, useState } from "react";
// import { formatPrice } from "@/utils/format";
// import { useFavorites } from "@/hooks/useFavorites";
// import ImageGalleryModal from "@/components/modules/ImageGalleryModal";
// import LoginRequiredModal from "@/components/modules/LoginRequiredModal";


// export default function PropertyCardSimple({ data }: { data: PropertyData }) {
//     const labels = [
//         { show: data.hot, icon: "bi-lightning-charge-fill", text: "Hot", className: "hot" },
//         { show: data.newListing, icon: "bi-star-fill", text: "New", className: "new" },
//         { show: data.featured, icon: "bi-gem", text: "Featured", className: "featured" },
//         { show: data.exclusive, icon: "bi-stars", text: "Exclusive", className: "exclusive" },
//     ];

//     const { isFavorited: hookIsFavorited, toggleFavorite: hookToggleFavorite, user } = useFavorites();
//     const isFavorited = hookIsFavorited;
//     const toggleFavorite = hookToggleFavorite;

//     const [galleryOpen, setGalleryOpen] = useState(false);
//     const [galleryIndex, setGalleryIndex] = useState(0);
//     const [showLoginModal, setShowLoginModal] = useState(false);

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

//     const nextImage = () => setGalleryIndex((prev) => (prev + 1) % data.images.length);
//     const prevImage = () => setGalleryIndex((prev) => (prev - 1 + data.images.length) % data.images.length);



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

//         <div className="col-lg-4" data-aos="fade-up" data-aos-delay="300">
//             <article className="stack-card">
//                 <figure className="stack-media">
//                     {/* <Image src={data.images[0]} alt="Modern Facade" className="img-fluid" loading="lazy" width={0} height={0} unoptimized /> */}
//                     <figure className="stack-media">
//                         <Image
//                             src={data.images[0]}
//                             alt={data.title}
//                             className="img-fluid"
//                             loading="lazy"
//                             width={0}
//                             height={0}
//                             unoptimized
//                             onClick={() => openGallery(0)}
//                             style={{ cursor: "pointer" }}
//                         />
//                         <figcaption>
//                             {labels.filter(l => l.show).map((label, idx) => (
//                                 <span key={idx} className={`chip ${label.className}`}>{label.text}</span>
//                             ))}
//                         </figcaption>

//                         <button
//                             className={`favorite-btn simple-card-fav favorite-btn-custom ${isFavorited(data.id) ? "favorited" : ""}`}
//                             onClick={handleFavoriteClick}
//                             title={isFavorited(data.id) ? "Remove from favorites" : "Add to favorites"}
//                         >
//                             <i className={`bi ${isFavorited(data.id) ? "bi-heart-fill" : "bi-heart"}`}></i>
//                         </button>
//                     </figure>

//                     <figcaption>
//                         {/* <span className="chip exclusive">Exclusive</span> */}
//                         {labels
//                             .filter((label) => label.show)
//                             .map((label, idx) => (
//                                 <span key={idx} className={`chip ${label.className}`}>{label.text}</span>
//                             ))}
//                     </figcaption>
//                 </figure>
//                 <div className="stack-body">
//                     <h5>
//                         <Link href={`/properties/${data.id}`}>Modern Courtyard Residence</Link></h5>
//                     <div className="stack-loc"><i className="bi bi-geo-alt"></i> Scottsdale, AZ 85251</div>
//                     <ul className="stack-specs">
//                         <li><i className="bi bi-door-open"></i> 4</li>
//                         <li><i className="bi bi-droplet"></i> 3</li>
//                         <li><i className="bi bi-aspect-ratio"></i> {formatArea(data.landSize, data.sizeUnit)}</li>
//                     </ul>
//                     <div className="stack-foot">
//                         <span className="stack-price">
//                             {!price || !currency ? (
//                                 "Price on request"
//                             ) : (
//                                 <>
//                                     <div className="main-price">
//                                         {formatPrice(price, currency)}
//                                         {isRent && "/month"}
//                                     </div>

//                                     {currency !== "USD" && (
//                                         <div className="price-usd">
//                                             {usdLoading ? (
//                                                 <span className="usd-loading">
//                                                     ≈ USD…
//                                                     <i className="bi bi-arrow-repeat ms-1 spin" />
//                                                 </span>
//                                             ) : (
//                                                 usdRate && (
//                                                     <>
//                                                         ≈ {formatPrice(Math.round(price * usdRate), "USD")}
//                                                         {isRent && "/month"}
//                                                     </>
//                                                 )
//                                             )}
//                                         </div>
//                                     )}
//                                 </>
//                             )}
//                         </span>


//                         <Link href={`/properties/${data.id}`} className="stack-link">View</Link>
//                     </div>
//                 </div>
//             </article>

//             <ImageGalleryModal
//                 open={galleryOpen}
//                 images={data.images}
//                 index={galleryIndex}
//                 onClose={() => setGalleryOpen(false)}
//                 onNext={nextImage}
//                 onPrev={prevImage}
//             />

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
import { formatArea, formatPrice } from "@/utils/format";
import { useFavorites } from "@/hooks/useFavorites";
import { useState } from "react";
import ImageGalleryModal from "@/components/modules/ImageGalleryModal";
import LoginRequiredModal from "@/components/modules/LoginRequiredModal";
import { convertToUSD } from "@/utils/convertToUSD";

export default function PropertyCardSimple({ data }: { data: PropertyData }) {
  const labels = [
    { show: data.hot, icon: "bi-lightning-charge-fill", text: "Hot", className: "hot" },
    { show: data.newListing, icon: "bi-star-fill", text: "New", className: "new" },
    { show: data.featured, icon: "bi-gem", text: "Featured", className: "featured" },
    { show: data.exclusive, icon: "bi-stars", text: "Exclusive", className: "exclusive" },
  ];

  const { isFavorited: hookIsFavorited, toggleFavorite: hookToggleFavorite, user } = useFavorites();
  const isFavorited = hookIsFavorited;
  const toggleFavorite = hookToggleFavorite;

  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [usdValue, setUsdValue] = useState<number | null>(null);
  const [usdLoading, setUsdLoading] = useState(false);

  const price = data.salePrice ?? data.rentPrice;
  const currency = data.salePrice ? data.saleCurrency : data.rentCurrency;
  const isRent = Boolean(data.rentPrice);

  // fetch USD once
  if (price && currency && currency !== "USD" && usdValue === null && !usdLoading) {
    setUsdLoading(true);
    convertToUSD(price, currency)
      .then((v) => setUsdValue(v))
      .finally(() => setUsdLoading(false));
  }

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return setShowLoginModal(true);
    await toggleFavorite(data.id);
  };

  const openGallery = (index = 0) => {
    setGalleryIndex(index);
    setGalleryOpen(true);
  };

  const nextImage = () => setGalleryIndex((prev) => (prev + 1) % data.images.length);
  const prevImage = () => setGalleryIndex((prev) => (prev - 1 + data.images.length) % data.images.length);

  return (
    <div className="col-lg-4" data-aos="fade-up" data-aos-delay="300">
      <article className="stack-card">
        <figure className="stack-media">
          <Image
            src={data.images[0]}
            alt={data.title}
            className="img-fluid"
            width={0}
            height={0}
            unoptimized
            loading="lazy"
            onClick={() => openGallery(0)}
            style={{ cursor: "pointer" }}
          />
          <figcaption>
            {labels.filter((l) => l.show).map((label, idx) => (
              <span key={idx} className={`chip ${label.className}`}>{label.text}</span>
            ))}
          </figcaption>

          <button
            className={`favorite-btn simple-card-fav favorite-btn-custom ${isFavorited(data.id) ? "favorited" : ""}`}
            onClick={handleFavoriteClick}
            title={isFavorited(data.id) ? "Remove from favorites" : "Add to favorites"}
          >
            <i className={`bi ${isFavorited(data.id) ? "bi-heart-fill" : "bi-heart"}`}></i>
          </button>
        </figure>

        <div className="stack-body">
          <h5><Link href={`/properties/${data.id}`}>{data.title}</Link></h5>
          <div className="stack-loc"><i className="bi bi-geo-alt"></i> {data.showAddress ? data.address : data.city}</div>
          <ul className="stack-specs">
            <li><i className="bi bi-door-open"></i> {data.bedrooms || 0}</li>
            <li><i className="bi bi-droplet"></i> {data.bathrooms || 0}</li>
            <li><i className="bi bi-aspect-ratio"></i> {formatArea(data.landSize, data.sizeUnit)}</li>
          </ul>

          <div className="stack-foot">
            <span className="stack-price">
              {!price || !currency ? "Price on request" : (
                <>
                  <div className="main-price">
                    {formatPrice(price, currency)}{isRent && "/month"}
                  </div>
                  {currency !== "USD" && (
                    <div className="price-usd">
                      {usdLoading ? (
                        <span className="usd-loading">≈ USD… <i className="bi bi-arrow-repeat ms-1 spin"/></span>
                      ) : (
                        usdValue && <>≈ {formatPrice(Math.round(usdValue), "USD")}{isRent && "/month"}</>
                      )}
                    </div>
                  )}
                </>
              )}
            </span>
            <Link href={`/properties/${data.id}`} className="stack-link">View</Link>
          </div>
        </div>
      </article>

      <ImageGalleryModal open={galleryOpen} images={data.images} index={galleryIndex} onClose={() => setGalleryOpen(false)} onNext={nextImage} onPrev={prevImage}/>
      <LoginRequiredModal open={showLoginModal} onClose={() => setShowLoginModal(false)}/>
    </div>
  );
}
