"use client";
import Image from "next/image";
// import PropertyCardBase from "./PropertyCardBase";
import { PropertyData } from "../../../types/property";
import Link from "next/link";
import { formatArea, formatNumber } from "@/utils/format";

export default function PropertyCardSimple({ data, className }: { data: PropertyData, className?: string }) {
    const labels = [
        { show: data.hot, icon: "bi-lightning-charge-fill", text: "Hot", className: "hot" },
        { show: data.newListing, icon: "bi-star-fill", text: "New", className: "new" },
        { show: data.featured, icon: "bi-gem", text: "Featured", className: "featured" },
        { show: data.exclusive, icon: "bi-stars", text: "Exclusive", className: "exclusive" },
    ];

    return (
        <article className={`mini-card ${className || ''}`} data-aos="fade-up" data-aos-delay="200">
            <Link href={`/properties/${data.id}`} className="thumb">
                <Image
                    src={data.images[0]}
                    alt="Loft Haven"
                    className="img-fluid"
                    loading="lazy"
                    width={0}
                    height={0}
                    unoptimized
                />

                {/* <span className="label hot"><i className="bi bi-lightning-charge-fill"></i> Hot</span>
                <span className="label new"><i className="bi bi-star-fill"></i> New</span>
                <span className="label featured"><i className="bi bi-gem"></i> Featured</span>
                <span className="label featured"><i className="bi bi-stars"></i> Exclusive</span> */}

                {/* Render only the labels that are true */}
                {labels
                    .filter((label) => label.show)
                    .map((label, idx) => (
                        <span key={idx} className={`label ${label.className}`}>
                            <i className={`bi ${label.icon}`}></i> {label.text}
                        </span>
                    ))}

            </Link>
            <div className="mini-body">
                <h4>
                    <Link href={`/properties/${data.id}`}>{data.title}</Link>
                </h4>
                <div className="mini-loc">
                    <i className="bi bi-geo"></i> {data.address}, {data.city}
                </div>
                <div className="mini-specs">
                    <span>
                        <i className="bi bi-door-open"></i> {data.bedrooms}
                    </span>
                    <span>
                        <i className="bi bi-droplet"></i> {data.bathrooms}
                    </span>
                    <span>
                        <i className="bi bi-rulers"></i> {formatArea(data.landSize, data.sizeUnit)}
                    </span>
                </div>
                <div className="mini-foot">
                    <div className="mini-price">${formatNumber(data.salePrice)}</div>
                    <Link href={`/properties/${data.id}`} className="mini-btn">
                        Details
                    </Link>
                </div>
            </div>
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