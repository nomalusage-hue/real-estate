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




"use client";

import Image from "next/image";
import { PropertyData } from "../../../types/property";
import Link from "next/link";
import { formatArea, formatNumber } from "@/utils/format";
import "../css/PropertyCardPremium.css";
import { useFavorites } from "@/hooks/useFavorites";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PropertyCardPremium({ data, isFavorited: propIsFavorited, toggleFavorite: propToggleFavorite, lgClass = 'col-lg-6' }: { data: PropertyData, isFavorited?: (id: string) => boolean, toggleFavorite?: (id: string) => Promise<boolean>, lgClass?: string }) {
    const { isFavorited: hookIsFavorited, toggleFavorite: hookToggleFavorite, user } = useFavorites();
    const router = useRouter();

    const isFavorited = propIsFavorited || hookIsFavorited;
    const toggleFavorite = propToggleFavorite || hookToggleFavorite;

    const [galleryOpen, setGalleryOpen] = useState(false);
    const [galleryIndex, setGalleryIndex] = useState(0);

    const images = data.images && data.images.length > 0 ? data.images : ["/img/placeholder-property.jpg"];

    const handleFavoriteClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            alert('Please login first to save favorites!');
            router.push('/login');
            return;
        }

        await toggleFavorite(data.id);
    };

    const openGallery = (index = 0) => {
        setGalleryIndex(index);
        setGalleryOpen(true);
    };

    const closeGallery = () => setGalleryOpen(false);

    const nextImage = () => setGalleryIndex((prev) => (prev + 1) % images.length);
    const prevImage = () => setGalleryIndex((prev) => (prev - 1 + images.length) % images.length);

    const primaryBadge = data.status?.includes('Sold') ? 'Sold' : data.status?.[0] || null;
    const isPropertyFavorited = isFavorited(data.id);

    return (
        <div className={`${lgClass} col-md-6`}>
            <div className="property-card">
                <div className="property-image">
                    <Image
                        src={images[0]}
                        alt={data.title}
                        className="img-fluid"
                        width={0}
                        height={0}
                        unoptimized
                        style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                    />

                    <div className="property-badges">
                        {primaryBadge && <span className={`badge ${primaryBadge.toLowerCase().replace(' ', '-')}`}>{primaryBadge}</span>}
                        {data.hot && <span className="badge hot">Hot</span>}
                        {data.newListing && <span className="badge new">New</span>}
                        {data.featured && <span className="badge featured">Featured</span>}
                        {data.exclusive && <span className="badge exclusive">Exclusive</span>}
                    </div>

                    <div className="property-overlay">
                        <button
                            className={`favorite-btn ${isPropertyFavorited ? 'favorited' : ''}`}
                            onClick={handleFavoriteClick}
                            title={isPropertyFavorited ? 'Remove from favorites' : 'Add to favorites'}
                        >
                            <i className={`bi ${isPropertyFavorited ? 'bi-heart-fill' : 'bi-heart'}`}></i>
                        </button>

                        <button className="gallery-btn" onClick={() => openGallery(0)} data-count={images.length}>
                            <i className="bi bi-images"></i>
                        </button>
                    </div>
                </div>

                <div className="property-content">
                    <div className="property-price">
                        {data.salePrice ? `$${formatNumber(data.salePrice)}` : data.rentPrice ? `$${formatNumber(data.rentPrice)}/month` : 'Price on request'}
                    </div>

                    <h4 className="property-title">{data.title}</h4>
                    <p className="property-location">
                        <i className="bi bi-geo-alt"></i>
                        {data.showAddress ? data.address : data.city}
                    </p>

                    <Link href={`/properties/${data.id}`} className="btn btn-primary w-100 mt-3">
                        View Details
                    </Link>
                </div>
            </div>

            {/* Gallery Modal */}
            {/* {galleryOpen && (
                <div className="gallery-modal">
                    <div className="gallery-overlay" onClick={closeGallery}></div>
                    <div className="gallery-content">
                        <button className="close-btn" onClick={closeGallery}>&times;</button>
                        <button className="prev-btn" onClick={prevImage}>&lt;</button>
                        <Image
                            src={images[galleryIndex]}
                            alt={`Image ${galleryIndex + 1}`}
                            width={800}
                            height={600}
                            unoptimized
                            style={{ width: '100%', maxHeight: '80vh', objectFit: 'contain' }}
                        />
                        <button className="next-btn" onClick={nextImage}>&gt;</button>
                        <div className="gallery-counter">{galleryIndex + 1} / {images.length}</div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .gallery-modal {
                    position: fixed;
                    top: 0; left: 0;
                    width: 100vw;
                    height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 9999;
                }
                .gallery-overlay {
                    position: absolute;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    background: rgba(0,0,0,0.7);
                }
                .gallery-content {
                    position: relative;
                    max-width: 90%;
                    max-height: 90%;
                    z-index: 10000;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                .gallery-content img {
                    max-width: 100%;
                    max-height: 80vh;
                    object-fit: contain;
                }
                .close-btn, .prev-btn, .next-btn {
                    position: absolute;
                    background: rgba(0,0,0,0.5);
                    color: white;
                    border: none;
                    font-size: 2rem;
                    padding: 0.5rem 1rem;
                    cursor: pointer;
                    z-index: 10001;
                }
                .close-btn { top: 10px; right: 10px; }
                .prev-btn { left: 10px; top: 50%; transform: translateY(-50%); }
                .next-btn { right: 10px; top: 50%; transform: translateY(-50%); }
                .gallery-counter {
                    margin-top: 10px;
                    color: white;
                    font-weight: bold;
                }
            `}</style> */}

            {galleryOpen && (
                <div className="gallery-modal">
                    <div className="gallery-overlay" onClick={closeGallery}></div>
                    <div className="gallery-content">
                        <button className="close-btn" onClick={closeGallery}>&times;</button>
                        <button className="prev-btn" onClick={prevImage}>&lt;</button>
                        <Image
                            key={galleryIndex} // Key ensures transition works when changing images
                            src={images[galleryIndex]}
                            alt={`Image ${galleryIndex + 1}`}
                            width={0}
                            height={0}
                            unoptimized
                            style={{
                                width: '100%',
                                maxWidth: '90vw',
                                maxHeight: '80vh',
                                objectFit: 'contain',
                                transition: 'transform 0.4s ease, opacity 0.4s ease',
                                transform: 'scale(1)',
                                opacity: 1,
                                height: "auto"
                            }}
                        />
                        <button className="next-btn" onClick={nextImage}>&gt;</button>
                        <div className="gallery-counter">{galleryIndex + 1} / {images.length}</div>
                    </div>
                </div>
            )}

            {/* <style jsx>{`
    .gallery-modal {
        position: fixed;
        top: 0; left: 0;
        width: 100vw; height: 100vh;
        display: flex; justify-content: center; align-items: center;
        z-index: 9999;
        animation: fadeIn 0.3s ease;
    }
    .gallery-overlay {
        position: absolute;
        top: 0; left: 0;
        width: 100%; height: 100%;
        background: rgba(0,0,0,0.7);
        backdrop-filter: blur(2px);
        animation: fadeIn 0.3s ease;
    }
    .gallery-content {
        position: relative;
        width: 90%;
        max-width: 900px;
        max-height: 90%;
        z-index: 10000;
        display: flex;
        flex-direction: column;
        align-items: center;
        animation: scaleIn 0.3s ease;
    }
    .close-btn, .prev-btn, .next-btn {
        position: absolute;
        background: rgba(0,0,0,0.5);
        color: white;
        border: none;
        font-size: 2rem;
        padding: 0.5rem 1rem;
        cursor: pointer;
        z-index: 10001;
        transition: background 0.2s;
    }
    .close-btn:hover, .prev-btn:hover, .next-btn:hover {
        background: rgba(0,0,0,0.8);
    }
    .close-btn { top: 10px; right: 10px; }
    .prev-btn { left: 10px; top: 50%; transform: translateY(-50%); }
    .next-btn { right: 10px; top: 50%; transform: translateY(-50%); }
    .gallery-counter {
        margin-top: 10px;
        color: white;
        font-weight: bold;
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes scaleIn {
        from { transform: scale(0.8); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
    }

    @media (max-width: 768px) {
        .gallery-content { max-width: 95%; }
    }
`}</style> */}


        </div>
    );
}
