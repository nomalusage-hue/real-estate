// "use client";

// import Image from "next/image";
// import { PropertyData } from "../types";
// import Link from "next/link";
// import { formatArea, formatNumber } from "@/utils/format";

// export default function PropertyCardPremium({ data }: { data: PropertyData }) {
//     return (
//         <div className="col-lg-6 col-md-6">
//             <div className="property-card">
//                 <div className="property-image">
//                     <Image src="/img/real-estate/property-interior-4.webp" alt="Suburban Villa" className="img-fluid" width={0} height={0} unoptimized />
//                     <div className="property-badges">
//                         <span className="badge for-rent">For Rent</span>
//                     </div>
//                     <div className="property-overlay">
//                         <button className="favorite-btn"><i className="bi bi-heart"></i></button>
//                         <button className="gallery-btn" data-count="15"><i className="bi bi-images"></i></button>
//                     </div>
//                 </div>
//                 <div className="property-content">
//                     <div className="property-price">$4,500<span>/month</span></div>
//                     <h4 className="property-title">Spacious Suburban Villa</h4>
//                     <p className="property-location"><i className="bi bi-geo-alt"></i> 789 Pine Ridge Drive, Austin, TX 73301</p>
//                     <div className="property-features">
//                         <span><i className="bi bi-house"></i> 5 Bed</span>
//                         <span><i className="bi bi-water"></i> 4 Bath</span>
//                         <span><i className="bi bi-arrows-angle-expand"></i> 3,200 sqft</span>
//                     </div>
//                     {/* <div className="property-agent">
//                         <Image src="/img/real-estate/agent-5.webp" alt="Agent" className="agent-avatar" width={0} height={0} unoptimized />
//                         <div className="agent-info">
//                             <strong>Emma Rodriguez</strong>
//                             <div className="agent-contact">
//                                 <small><i className="bi bi-telephone"></i> +1 (555) 345-6789</small>
//                             </div>
//                         </div>
//                     </div> */}
//                     <Link href={`/properties/${data.id}`} className="btn btn-primary w-100">View Details</Link>
//                 </div>
//             </div>
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
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function PropertyCardPremium({ data, isFavorited: propIsFavorited, toggleFavorite: propToggleFavorite }: { data: PropertyData, isFavorited?: (id: string) => boolean, toggleFavorite?: (id: string) => Promise<boolean> }) {
    const { isFavorited: hookIsFavorited, toggleFavorite: hookToggleFavorite, user } = useFavorites();
    const router = useRouter();

    const isFavorited = propIsFavorited || hookIsFavorited;
    const toggleFavorite = propToggleFavorite || hookToggleFavorite;

    // Helper function to get display price
    const getDisplayPrice = () => {
        const parts = [];

        if (data.salePrice && data.status?.includes('For Sale')) {
            parts.push(`$${formatNumber(data.salePrice)}`);
        }

        if (data.rentPrice && data.status?.includes('For Rent')) {
            parts.push(`$${formatNumber(data.rentPrice)}/month`);
        }

        if (data.status?.includes('Sold')) {
            parts.push('Sold');
        }

        return parts.join(' • ') || 'Price on request';
    };

    // Helper function to get primary badge (first status or "Sold")
    const getPrimaryBadge = () => {
        if (!data.status || data.status.length === 0) return null;

        // If sold, show sold badge
        if (data.status.includes('Sold')) {
            return 'Sold';
        }

        // Otherwise show first status
        return data.status[0];
    };

    // Get badge class based on status
    const getBadgeClass = (status: string) => {
        switch (status) {
            case 'For Sale': return 'badge for-sale';
            case 'For Rent': return 'badge for-rent';
            case 'Sold': return 'badge sold';
            default: return 'badge';
        }
    };

    // Format area with unit
    const formatBuildingArea = () => {
        if (data.buildingSize && data.sizeUnit) {
            return formatArea(data.buildingSize, data.sizeUnit);
        }
        return null;
    };

    // Handle favorite toggle
    const handleFavoriteClick = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigation
        e.stopPropagation(); // Prevent event bubbling

        if (!user) {
            // Show login message and redirect
            alert('Please login first to save favorites!');
            router.push('/login');
            return;
        }

        await toggleFavorite(data.id);
    };

    const primaryBadge = getPrimaryBadge();
    const isPropertyFavorited = isFavorited(data.id);


    return (
        <div className="col-lg-6 col-md-6">
            <div className="property-card">
                <div className="property-image">
                    {/* Use first image from data or placeholder */}
                    <Image
                        src={data.images && data.images.length > 0 ? data.images[0] : "/img/placeholder-property.jpg"}
                        alt={data.title}
                        className="img-fluid"
                        width={0}
                        height={0}
                        unoptimized
                        style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                    />

                    <div className="property-badges">
                        {primaryBadge && (
                            <span className={getBadgeClass(primaryBadge)}>
                                {primaryBadge}
                            </span>
                        )}
                        {data.status && data.status.length > 1 && (
                            <span className="badge badge-secondary">
                                {data.status.length} Options
                            </span>
                        )}
                        {data.hot && <span className="badge hot">Hot</span>}
                        {data.newListing && <span className="badge new">New</span>}
                        {data.featured && <span className="badge featured">Featured</span>}
                        {data.exclusive && <span className="badge exclusive">Exclusive</span>}
                    </div>

                    <div className="property-overlay">
                        {/* <button
                            className={`favorite-btn ${isPropertyFavorited ? 'favorited' : ''}`}
                            onClick={handleFavoriteClick}
                            title={isPropertyFavorited ? 'Remove from favorites' : 'Add to favorites'}
                        >
                            <i className={`bi ${isPropertyFavorited ? 'bi-heart-fill' : 'bi-heart'}`}></i>
                        </button> */}
                        <button
                            className={`favorite-btn`}
                            onClick={handleFavoriteClick}
                        >
                            <i className={`bi bi-heart`}></i>
                        </button>
                        <button className="gallery-btn" data-count={data.images?.length || 0}>
                            <i className="bi bi-images"></i>
                        </button>
                    </div>
                </div>

                <div className="property-content">
                    <div className="property-price">
                        {getDisplayPrice()}
                    </div>

                    <h4 className="property-title">{data.title}</h4>

                    <p className="property-location">
                        <i className="bi bi-geo-alt"></i>
                        {data.showAddress ? data.address : `${data.city}`}
                    </p>

                    <div className="property-features">
                        {data.bedrooms && data.bedrooms > 0 && (
                            <span><i className="bi bi-house"></i> {data.bedrooms} {data.bedrooms === 1 ? 'Bed' : 'Beds'}</span>
                        )}
                        {data.bathrooms && data.bathrooms > 0 && (
                            <span><i className="bi bi-water"></i> {data.bathrooms} {data.bathrooms === 1 ? 'Bath' : 'Baths'}</span>
                        )}
                        {formatBuildingArea() && (
                            <span><i className="bi bi-arrows-angle-expand"></i> {formatBuildingArea()}</span>
                        )}
                        {data.landSize && data.buildingSize && data.landSize > data.buildingSize && (
                            <span title="Land Size"><i className="bi bi-tree"></i> {formatArea(data.landSize, data.sizeUnit)}</span>
                        )}
                    </div>

                    {data.showAgent && data.agent && (
                        <div className="property-agent">
                            {data.agent.photo ? (
                                <Image
                                    src={data.agent.photo}
                                    alt={data.agent.name || "Agent"}
                                    className="agent-avatar"
                                    width={40}
                                    height={40}
                                    unoptimized
                                />
                            ) : (
                                <div className="agent-avatar placeholder">
                                    <i className="bi bi-person"></i>
                                </div>
                            )}
                            <div className="agent-info">
                                <strong>{data.agent.name || "Agent"}</strong>
                                {data.agent.title && (
                                    <small className="agent-title">{data.agent.title}</small>
                                )}
                                <div className="agent-contact">
                                    {data.agent.phone && (
                                        <small><i className="bi bi-telephone"></i> {data.agent.phone}</small>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    <Link href={`/properties/${data.id}`} className="btn btn-primary w-100 mt-3">
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
}