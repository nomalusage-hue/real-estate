// // app/properties/[id]/page.tsx
// "use client";

// import { useState, useEffect, useRef, useMemo, memo } from "react";
// // import { useParams } from "next/navigation";
// import { PropertyData } from "@/types/property";
// import { useTemplateScripts } from "@/hooks/useTemplateScripts";
// import Link from "next/link";
// import Image from "next/image";
// import { createClient } from "@/lib/supabase/supabase";
// import { PropertiesRepository } from "@/lib/repositories/PropertiesRepository";
// import AppLoader from "@/components/ui/AppLoader/AppLoader";
// import { InternationalPhoneInput } from "@/components/ui/forms/InternationalPhoneInput";
// import { openWhatsApp } from "@/src/utils/whatsapp";
// import { formatNumber, formatPrice, formatUnit } from "@/utils/format";
// import { useFavorites } from "@/hooks/useFavorites";
// import "./PropertyClient.css";
// import LoginRequiredModal from "@/components/modules/LoginRequiredModal";
// import { getDisplayDate } from "@/src/utils/dateUtils";
// import { convertToUSD } from "@/utils/convertToUSD";
// import PropertyViewTracker from "@/components/tracking/PropertyViewTracker";
// import { getCurrentGuestId } from "@/lib/guest";
// // import { convertToUSD } from "@/utils/convertToUSD";

// // Loading component
// function LoadingSpinner() {
//   return (
//     <div className="d-flex justify-content-center" style={{ height: "100vh", alignItems: "center" }}>
//       <div className="loading-container text-center py-5">
//         {/* <div className="spinner-border text-primary" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </div> */}
//         <AppLoader />
//         <p className="mt-3">Loading property details...</p>
//       </div>
//     </div>
//   );
// }

// // // Not Found component
// // function PropertyNotFound() {
// //   return (
// //     <div className="container py-5 text-center">
// //       <div className="row d-flex justify-content-center" style={{ height: "100vh", alignItems: "center" }}>
// //         <div className="col-lg-6">
// //           <div className="alert alert-warning" role="alert">
// //             <h4 className="alert-heading">Property Not Found</h4>
// //             <p>
// //               The property you&#39;re looking for doesn&#39;t exist or has been
// //               removed.
// //             </p>
// //             <hr />
// //             <p className="mb-0">
// //               <Link href="/properties" className="btn btn-primary">
// //                 Browse Properties
// //               </Link>
// //             </p>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }


// const THEME = {
//   primary: "#2c7a7b",
//   muted: "#6b7280",
//   bg: "#f8fafc",
// };

// function PropertyNotFound() {
//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         backgroundColor: THEME.bg,
//         padding: "2rem",
//       }}
//     >
//       <div
//         style={{
//           maxWidth: 520,
//           width: "100%",
//           textAlign: "center",
//           background: "#ffffff",
//           borderRadius: 16,
//           padding: "3rem 2.5rem",
//           boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
//         }}
//       >
//         {/* Icon */}
//         <div
//           style={{
//             width: 64,
//             height: 64,
//             margin: "0 auto 1.5rem",
//             borderRadius: "50%",
//             backgroundColor: `${THEME.primary}15`,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             fontSize: 28,
//             color: THEME.primary,
//           }}
//         >
//           <Image
//             src="/favicon.ico"
//             alt="Properties Icon"
//             width={55}
//             height={55}
//           />
//         </div>

//         <h2 style={{ marginBottom: "0.75rem", fontWeight: 600 }}>
//           Property not found
//         </h2>

//         <p
//           style={{
//             color: THEME.muted,
//             fontSize: "0.95rem",
//             lineHeight: 1.6,
//             marginBottom: "2rem",
//           }}
//         >
//           The property you are looking for doesn&#39;t exist, has been removed,
//           or is no longer available.
//         </p>

//         <Link
//           href="/properties"
//           style={{
//             display: "inline-block",
//             padding: "0.75rem 1.75rem",
//             borderRadius: 999,
//             backgroundColor: THEME.primary,
//             color: "#ffffff",
//             fontWeight: 500,
//             textDecoration: "none",
//             transition: "transform 0.15s ease, box-shadow 0.15s ease",
//             boxShadow: "0 6px 18px rgba(44,122,123,0.35)",
//           }}
//         >
//           Browse properties
//         </Link>
//       </div>
//     </div>
//   );
// }


// export function formatSoldDateShort(date: string) {
//   return new Date(date).toLocaleDateString("en-US", {
//     year: "numeric",
//     month: "short",
//     day: "numeric",
//   });
// }


// // // const BUSINESS_WHATSAPP_NUMBER = "+96170118770"; // Replace with your business WhatsApp number in international format
// // const BUSINESS_WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

// type Props = {
//   id: string;
// };


// // const supabase = createClient();
// // const propertiesRepo = new PropertiesRepository();


// export default function PropertyPage({ id }: Props) {
//   const [property, setProperty] = useState<PropertyData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [phone, setPhone] = useState("");
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     message: ""
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   // const [usdValue, setUsdValue] = useState<number | null>(null);
//   const [usdLoading, setUsdLoading] = useState(false);
//   const [usdSale, setUsdSale] = useState<number | null>(null);
//   const [usdRent, setUsdRent] = useState<number | null>(null);


//   // if (params){
//   //   params.id = id;
//   // }

//   useTemplateScripts();


//   const { isFavorited: hookIsFavorited, toggleFavorite: hookToggleFavorite, user } = useFavorites();

//   const isFavorited = hookIsFavorited;
//   const toggleFavorite = hookToggleFavorite;
//   const [showLoginModal, setShowLoginModal] = useState(false);

//   const handleFavoriteClick = async (e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();

//     if (!user) {
//       setShowLoginModal(true);
//       return;
//     }

//     await toggleFavorite(id);
//   };

//   const supabase = createClient();
//   const [copied, setCopied] = useState(false);

//   const trackShare = async (type: string) => {
//     try {
//       const guestId = getCurrentGuestId();
//       const { error } = await supabase.from('property_shares').insert({
//         property_id: id,
//         share_type: type,
//         guest_id: guestId,
//       });
//       if (error) console.error('Share tracking error:', error);
//     } catch (err) {
//       console.error('Failed to track share:', err);
//     }
//   };

//   const copyToClipboard = () => {
//     navigator.clipboard.writeText(window.location.href);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//     trackShare('copy');
//   };


//   useEffect(() => {
//     async function fetchProperty() {
//       try {
//         setLoading(true);
//         setError(null);

//         // const supabase = createClient();
//         const propertiesRepo = new PropertiesRepository();


//         // Fetch property using Supabase repository
//         const data = await propertiesRepo.getById(id);

//         if (!data) {
//           setError("Property not found");
//           setProperty(null);
//           return;
//         }

//         // Check if property is published (unless admin preview)
//         if (!data.published && !data.draft) {
//           setError("Property is not available");
//           setProperty(null);
//           return;
//         }

//         setProperty(data);

//       } catch (err) {
//         // console.error("Error fetching property:", err);
//         setError("Failed to load property details");
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchProperty();
//     // }, [params?.id]);
//   }, [id]);


//   // Initialize image gallery when property loads
//   useEffect(() => {
//     if (!property || !property.images || property.images.length === 0) {
//       return;
//     }

//     const timer = setTimeout(() => {
//       initImageGallery();
//     }, 500);

//     return () => {
//       clearTimeout(timer);
//       if (driftInstanceRef.current) {
//         driftInstanceRef.current.destroy();
//         driftInstanceRef.current = null;
//       }
//     };
//   }, [property]);

//   // useEffect(() => {
//   //   if (!property) return;

//   //   async function fetchUSD() {
//   //     try {
//   //       setUsdLoading(true);
//   //       const price = property?.salePrice ?? property?.rentPrice ?? 0;
//   //       const currency = (property?.salePrice ? property?.saleCurrency : property?.rentCurrency) ?? "USD";
//   //       const value = await convertToUSD(price, currency);
//   //       setUsdValue(value);
//   //       // console.log("Converted USD value:", value);
//   //     } catch (err) {
//   //       console.error("USD conversion failed", err);
//   //     } finally{
//   //       setUsdLoading(false);
//   //     }
//   //   }

//   //   fetchUSD();
//   // }, [property]);

//   useEffect(() => {
//     if (!property) return;

//     async function fetchUSD() {
//       try {
//         setUsdLoading(true);

//         // Convert sale price if exists and not USD
//         if (property?.salePrice && property?.saleCurrency !== "USD") {
//           const convertedSale = await convertToUSD(
//             property?.salePrice,
//             property?.saleCurrency ?? 'USD'
//           );
//           setUsdSale(convertedSale);
//         } else if (property?.salePrice) {
//           setUsdSale(property?.salePrice);
//         }

//         // Convert rent price if exists and not USD
//         if (property?.rentPrice && property?.rentCurrency !== "USD") {
//           const convertedRent = await convertToUSD(
//             property?.rentPrice,
//             property?.rentCurrency ?? 'USD'
//           );
//           setUsdRent(convertedRent);
//         } else if (property?.rentPrice) {
//           setUsdRent(property?.rentPrice);
//         }

//       } catch (err) {
//         console.error("USD conversion failed", err);
//       } finally {
//         setUsdLoading(false);
//       }
//     }

//     fetchUSD();
//   }, [property]);



//   const driftInstanceRef = useRef<any>(null);

//   function initImageGallery() {
//     const thumbnailItems = document.querySelectorAll(".thumbnail-item");
//     const mainImage = document.getElementById("main-product-image");
//     const prevBtn = document.querySelector(".prev-image");
//     const nextBtn = document.querySelector(".next-image");

//     if (!thumbnailItems.length || !mainImage) return;

//     let currentIndex = 0;

//     const updateMainImage = (index: number) => {
//       const thumbnail = thumbnailItems[index];
//       if (!thumbnail) return;

//       const imageUrl = thumbnail.getAttribute("data-image");
//       if (mainImage && imageUrl) {
//         (mainImage as HTMLImageElement).src = imageUrl;
//         mainImage.setAttribute("data-zoom", imageUrl);

//         thumbnailItems.forEach((item) => item.classList.remove("active"));
//         thumbnail.classList.add("active");
//         currentIndex = index;

//         if (driftInstanceRef.current) {
//           setTimeout(() => {
//             if (driftInstanceRef.current) {
//               (driftInstanceRef.current as any).setZoomImageURL(imageUrl);
//             }
//           }, 50);
//         }
//       }
//     };

//     // Initialize Drift zoom
//     if (
//       typeof window !== 'undefined' &&
//       (window as any).Drift &&
//       mainImage &&
//       !driftInstanceRef.current
//     ) {
//       driftInstanceRef.current = new (window as any).Drift(mainImage, {
//         paneContainer: document.querySelector(".image-zoom-container"),
//         zoomFactor: 2.5,
//         hoverBoundingBox: false,
//         injectBaseStyles: true,
//         containInline: true,
//         touchDelay: 0,
//       });
//     }

//     // Add event listeners
//     thumbnailItems.forEach((thumbnail, index) => {
//       thumbnail.addEventListener("click", () => updateMainImage(index));
//     });

//     if (prevBtn) {
//       prevBtn.addEventListener("click", () => {
//         const newIndex =
//           currentIndex > 0 ? currentIndex - 1 : thumbnailItems.length - 1;
//         updateMainImage(newIndex);
//       });
//     }

//     if (nextBtn) {
//       nextBtn.addEventListener("click", () => {
//         const newIndex =
//           currentIndex < thumbnailItems.length - 1 ? currentIndex + 1 : 0;
//         updateMainImage(newIndex);
//       });
//     }

//     // Set first image as active
//     if (thumbnailItems.length > 0) {
//       thumbnailItems[0].classList.add("active");
//     }
//   }

//   const handleTourRequestSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!property) return;

//     // Basic validation
//     if (!formData.name.trim() || !formData.email.trim() || !phone.trim()) {
//       alert("Please fill in all required fields.");
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       // Save to database
//       const { error } = await supabase
//         .from('tour_requests')
//         .insert({
//           property_id: property.id,
//           name: formData.name.trim(),
//           email: formData.email.trim(),
//           phone: phone.trim(),
//           message: formData.message.trim() || null,
//         });

//       if (error) {
//         throw error;
//       }

//       // Prepare WhatsApp message
//       const propertyStatus = property.status.length > 0 ? property.status[0] : "Available";
//       const message = `Hello
// I'd like to schedule a tour for this property.

// Property: ${property.title || "Property"} - ${propertyStatus}
// Link: ${typeof window !== "undefined" ? window.location.href : ""}

// Could you please let me know available dates and times? Thank you.`;

//       // // Redirect to WhatsApp
//       // const whatsappUrl = `https://wa.me/${BUSINESS_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
//       // window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

//       openWhatsApp(message);

//       // Reset form
//       setFormData({ name: "", email: "", message: "" });
//       setPhone("");

//     } catch (error) {
//       console.error("Error submitting tour request:", error);
//       alert("Failed to submit tour request. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Show loading state
//   if (loading) {
//     return <LoadingSpinner />;
//   }

//   // Show not found state
//   if (error || !property) {
//     return <PropertyNotFound />;
//   }


//   // Get display price based on status
//   const getDisplayPrice = (return_price: boolean = false) => {
//     if (property.status?.includes("For Sale") && property.salePrice) {
//       // return formatPrice(property.salePrice);
//       return formatPrice(property.salePrice, property.saleCurrency);
//     }
//     if (property.status?.includes("For Rent") && property.rentPrice) {
//       // return formatPrice(property.rentPrice) + "/month";
//       // return formatPrice(property.rentPrice, property.rentCurrency) + "/month";
//       return formatPrice(property.rentPrice, property.rentCurrency) + property.rentPeriodLabel;
//     }
//     if (property.status?.includes("Sold")) {
//       if (return_price) {
//         if (property.salePrice) {
//           return formatPrice(property.salePrice, property.saleCurrency);
//         }
//       }
//       return "Sold";
//     }
//     return "Price on request";
//   };
//   const getRentPrice = () => {
//     if (property.status?.includes("For Sale") && property.salePrice
//       && property.status?.includes("For Rent") && property.rentPrice) {
//       return formatPrice(property.rentPrice, property.rentCurrency) + ' ' + property.rentPeriodLabel;
//     }
//   };

//   // Get status text
//   const getStatusText = () => {
//     if (property.status?.includes("For Sale")) return "For Sale";
//     if (property.status?.includes("For Rent")) return "For Rent";
//     if (property.status?.includes("Sold")) return "Sold";
//     return "Available";
//   };

//   // Format size display
//   const formatSizeDisplay = (size?: number, unit?: string) => {
//     if (!size) return "";
//     // return `${size.toLocaleString()} ${unit || "m²"}`;
//     return `${size.toLocaleString()} ${formatUnit(unit as any) || "m²"}`;
//   };


//   const isPropertyFavorited = isFavorited(id);

//   return (
//     <>
//       <main className="main">
//         {/* Tracking the views of every sigle property */}
//         <PropertyViewTracker propertyId={id} />

//         {/* Page Title */}
//         <div className="page-title">
//           <div className="heading">
//             <div className="container">
//               <div className="row d-flex justify-content-center text-center">
//                 <div className="col-lg-8">
//                   <h1 className="heading-title">
//                     {property.title || "Property Details"}
//                   </h1>
//                   <p className="mb-0">
//                     {property.description?.substring(0, 200) ||
//                       "Odio et unde deleniti. Deserunt numquam exercitationem. Officiis quo odio sint voluptas consequatur ut a odio voluptatem."}
//                     {property.description && property.description.length > 200
//                       ? "..."
//                       : ""}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <nav className="breadcrumbs">
//             <div className="container">
//               <ol>
//                 <li>
//                   <Link href="/">Home</Link>
//                 </li>
//                 <li>
//                   <Link href="/properties">Properties</Link>
//                 </li>
//                 <li className="current">
//                   {property.title || "Property Details"}
//                 </li>
//               </ol>
//             </div>
//           </nav>
//         </div>
//         {/* End Page Title */}

//         {/* Property Details Section */}
//         <section id="property-details" className="property-details section">
//           <div className="container" data-aos="fade-up" data-aos-delay="100">
//             <div className="row gy-4">
//               <div className="col-lg-8">
//                 {/* Property Gallery */}
//                 <div
//                   className="property-gallery"
//                   data-aos="fade-up"
//                   data-aos-delay="200"
//                 >
//                   <div className="main-image-container image-zoom-container">
//                     {/* <Image
//                       id="main-product-image"
//                       src={
//                         property.images?.[0] ||
//                         "/img/real-estate/property-exterior-3.webp"
//                       }
//                       alt={property.title || "Property"}
//                       className="img-fluid main-property-image"
//                       data-zoom={
//                         property.images?.[0] ||
//                         "/img/real-estate/property-exterior-3.webp"
//                       }
//                       width={0}
//                       height={0}
//                       unoptimized
//                       style={{
//                         width: "100%",
//                         height: "auto",
//                         objectFit: "cover",
//                       }}
//                     /> */}
//                     <Image
//                       id="main-product-image"
//                       src={property.images?.[0] || "/img/real-estate/property-exterior-3.webp"}
//                       alt={property.title || "Property"}
//                       className="img-fluid main-property-image"
//                       data-zoom={
//                         property.images?.[0] ||
//                         "/img/real-estate/property-exterior-3.webp"
//                       }
//                       width={0}
//                       height={0}
//                       unoptimized
//                       style={{ "width": "100%", "height": "auto", "objectFit": "cover" }}
//                       loading="eager"
//                       priority={true}
//                     />
//                     <div className="image-nav-buttons">
//                       <button
//                         className="image-nav-btn prev-image"
//                         type="button"
//                       >
//                         <i className="bi bi-chevron-left"></i>
//                       </button>
//                       <button
//                         className="image-nav-btn next-image"
//                         type="button"
//                       >
//                         <i className="bi bi-chevron-right"></i>
//                       </button>
//                     </div>
//                   </div>

//                   {/* Thumbnail Gallery */}
//                   {property.images && property.images.length > 0 ? (
//                     <div className="thumbnail-gallery thumbnail-list">
//                       {/* {property.images.map((image, index) => (
//                         <div
//                           key={index}
//                           className={`thumbnail-item ${index === 0 ? "active" : ""
//                             }`}
//                           data-image={image}
//                         >
//                           <Image
//                             src={image}
//                             alt={`${property.title} - Image ${index + 1}`}
//                             className="img-fluid"
//                             width={0}
//                             height={0}
//                             unoptimized
//                           />
//                         </div>
//                       ))} */}
//                       {property.images.map((image, index) => (
//                         <div key={index} className={`thumbnail-item ${index === 0 ? "active" : ""}`} data-image={image}>
//                           <Image
//                             src={image}
//                             alt={`${property.title} - Image ${index + 1}`}
//                             className="img-fluid"
//                             width={0}
//                             height={0}
//                             unoptimized
//                             loading={index === 0 ? "eager" : "lazy"}   // Only first loads eagerly
//                           />
//                         </div>
//                       ))}
//                     </div>
//                   ) : (
//                     <div className="thumbnail-gallery thumbnail-list">
//                       <div
//                         className="thumbnail-item active"
//                         data-image="/img/real-estate/property-exterior-3.webp"
//                       >
//                         <Image
//                           src="/img/real-estate/property-exterior-3.webp"
//                           alt="Property Exterior"
//                           className="img-fluid"
//                           width={0}
//                           height={0}
//                           unoptimized
//                         />
//                       </div>
//                     </div>
//                   )}
//                 </div>
//                 {/* End Property Gallery */}

//                 {/* Property Description */}
//                 <div
//                   className="property-description"
//                   data-aos="fade-up"
//                   data-aos-delay="300"
//                 >
//                   <h3>About This Property</h3>
//                   <p style={{ whiteSpace: "pre-line" }}>
//                     {property.description ||
//                       "No description available for this property."}
//                   </p>

//                   {/* Additional details */}
//                   <div className="mt-4">
//                     <h5>Property Details</h5>
//                     <ul className="list-unstyled">
//                       {property.propertyType && (
//                         <li>
//                           <strong>Type:</strong>{" "}
//                           {property.propertyType.charAt(0).toUpperCase() +
//                             property.propertyType.slice(1)}
//                         </li>
//                       )}
//                       {property.yearBuilt && (
//                         <li>
//                           <strong>Year Built:</strong> {property.yearBuilt}
//                         </li>
//                       )}
//                       {property.buildingSize && (
//                         <li>
//                           <strong>Building Size:</strong>{" "}
//                           {formatSizeDisplay(property.buildingSize, property.sizeUnit)}
//                         </li>
//                       )}
//                       {property.landSize && (
//                         <li>
//                           <strong>Land Size:</strong>{" "}
//                           {formatSizeDisplay(property.landSize, property.sizeUnit)}
//                         </li>
//                       )}
//                       {property.zoning && (
//                         <li>
//                           <strong>Zoning:</strong> {property.zoning}
//                         </li>
//                       )}
//                     </ul>

//                     {/* Utilities */}
//                     {property.utilities && (
//                       <div className="mt-3">
//                         <strong>Utilities:</strong>
//                         <div className="d-flex flex-wrap gap-2 mt-2">
//                           {property.utilities.water && (
//                             <span className="badge bg-info">Water</span>
//                           )}
//                           {property.utilities.electricity && (
//                             <span className="badge bg-info">Electricity</span>
//                           )}
//                           {property.utilities.sewage && (
//                             <span className="badge bg-info">Sewage</span>
//                           )}
//                           {property.utilities.roadAccess && (
//                             <span className="badge bg-info">Road Access</span>
//                           )}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//                 {/* End Property Description */}

//                 {/* Amenities */}
//                 <div
//                   className="property-amenities"
//                   data-aos="fade-up"
//                   data-aos-delay="400"
//                 >
//                   <h3>Amenities & Features</h3>
//                   <div className="row">
//                     {/* Interior Features */}
//                     <div className="col-md-6">
//                       <h4>Interior Features</h4>
//                       {property.interiorFeatures &&
//                         property.interiorFeatures.length > 0 ? (
//                         <ul className="features-list">
//                           {property.interiorFeatures.map((feature, index) => (
//                             <li key={index}>
//                               <i className="bi bi-check-circle"></i>
//                               {feature}
//                             </li>
//                           ))}
//                         </ul>
//                       ) : (
//                         <p className="text-muted">
//                           No interior features listed.
//                         </p>
//                       )}
//                     </div>

//                     {/* Exterior Features */}
//                     <div className="col-md-6">
//                       <h4>Exterior Features</h4>
//                       {property.exteriorFeatures &&
//                         property.exteriorFeatures.length > 0 ? (
//                         <ul className="features-list">
//                           {property.exteriorFeatures.map((feature, index) => (
//                             <li key={index}>
//                               <i className="bi bi-check-circle"></i>
//                               {feature}
//                             </li>
//                           ))}
//                         </ul>
//                       ) : (
//                         <p className="text-muted">
//                           No exterior features listed.
//                         </p>
//                       )}
//                     </div>

//                     {/* Custom Features */}
//                     {property.customFeatures &&
//                       property.customFeatures.length > 0 && (
//                         <div className="col-12 mt-4">
//                           <h4>Additional Features</h4>
//                           <ul className="features-list">
//                             {property.customFeatures.map((feature, index) => (
//                               <li key={index}>
//                                 <i className="bi bi-check-circle"></i>
//                                 {feature}
//                               </li>
//                             ))}
//                           </ul>
//                         </div>
//                       )}
//                   </div>

//                   {/* Property Labels */}
//                   <div className="mt-4">
//                     <h4>Property Labels</h4>
//                     <div className="d-flex flex-wrap gap-2">
//                       {property.hot && (
//                         <span className="badge bg-danger">
//                           <i className="bi bi-fire me-1"></i>Hot Property
//                         </span>
//                       )}
//                       {property.newListing && (
//                         <span className="badge bg-success">
//                           <i className="bi bi-star me-1"></i>New Listing
//                         </span>
//                       )}
//                       {property.featured && (
//                         <span className="badge bg-warning text-dark">
//                           <i className="bi bi-gem me-1"></i>Featured
//                         </span>
//                       )}
//                       {property.exclusive && (
//                         <span className="badge bg-primary">
//                           <i className="bi bi-shield-lock me-1"></i>Exclusive
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//                 {/* End Amenities */}

//                 {/* Address Section */}
//                 <div
//                   className="property-map"
//                   data-aos="fade-up"
//                   data-aos-delay="500"
//                 >
//                   <h3>Address</h3>
//                   <p>
//                     {property.showAddress && property.address ? (
//                       <>
//                         {property.address}
//                         <br />
//                         {property.city && <>{property.city}</>}
//                       </>
//                     ) : (
//                       <>
//                         {property.address}
//                         <br />
//                         {property.city && <>{property.city}</>}
//                         {/* <span className="text-muted">
//                           <i className="bi bi-eye-slash me-1"></i>
//                           Exact address hidden for privacy
//                         </span> */}
//                       </>
//                     )}
//                   </p>
//                 </div>
//                 {/* End Address Section */}
//               </div>

//               <div className="col-lg-4" style={{ zIndex: 1 }}>
//                 {/* Property Overview */}
//                 <div
//                   className="property-overview sticky-top"
//                   data-aos="fade-up"
//                   data-aos-delay="200"
//                 >
//                   <div className="price-tag d-flex align-items-center justify-content-between">
//                     {property.status?.includes("Sold") ? (
//                       <p style={{ "margin": "0" }}>
//                         {getDisplayPrice(true)}
//                       </p>
//                     ) : (
//                       <p style={{ "margin": "0" }}>
//                         {getDisplayPrice()}
//                       </p>
//                     )}
//                     <button
//                       className={`property-details favorite-btn ${isPropertyFavorited ? 'favorited' : ''}`}
//                       onClick={handleFavoriteClick}
//                       title={isPropertyFavorited ? 'Remove from favorites' : 'Add to favorites'}
//                     >
//                       <i className={`bi ${isPropertyFavorited ? 'bi-heart-fill' : 'bi-heart'}`}></i>
//                     </button>
//                   </div>
//                   {/* <div className="price-tag d-flex align-items-center justify-content-between">
//                     {(property?.salePrice ? property?.saleCurrency : property?.rentCurrency) !== "USD" && (
//                       <div className="price-usd">
//                         {usdLoading ? (
//                           <span className="usd-loading">
//                             ≈ USD loading… <i className="bi bi-arrow-repeat ms-1 spin" />
//                           </span>
//                         ) : (
//                           usdValue && (
//                             <>
//                               ≈ {formatPrice(Math.round(usdValue), "USD")}
//                               {Boolean(property?.rentPrice) && ' ' + property.rentPeriodLabel}
//                             </>
//                           )
//                         )}
//                       </div>
//                     )}
//                   </div> */}


//                   <div className="price-tag d-flex align-items-center justify-content-between">
//                     {usdLoading && (
//                       <span className="usd-loading">
//                         ≈ USD loading… <i className="bi bi-arrow-repeat ms-1 spin" />
//                       </span>
//                     )}

//                     {!usdLoading && (
//                       <>
//                         {usdSale && property?.saleCurrency !== "USD" && (
//                           <div className="price-usd">
//                             ≈ {formatPrice(Math.round(usdSale), "USD")}
//                           </div>
//                         )}

//                         {/* {usdRent && property?.rentCurrency !== "USD" && (
//                           <div className="price-usd">
//                             ≈ {formatPrice(Math.round(usdRent), "USD")}{" "}
//                             {property?.rentPeriodLabel}
//                           </div>
//                         )} */}
//                       </>
//                     )}
//                   </div>
//                   {property.rentPrice && (
//                     <>
//                       <div className="price-tag d-flex align-items-center justify-content-between">
//                         {getRentPrice()}
//                       </div>
//                       <div className="price-tag d-flex align-items-center justify-content-between">

//                         {usdLoading && (
//                           <span className="usd-loading">
//                             ≈ USD loading… <i className="bi bi-arrow-repeat ms-1 spin" />
//                           </span>
//                         )}

//                         {!usdLoading && (
//                           <>
//                             {usdRent && property?.rentCurrency !== "USD" && (
//                               <div className="price-usd">
//                                 ≈ {formatPrice(Math.round(usdRent), "USD")}{" "}
//                                 {property?.rentPeriodLabel}
//                               </div>
//                             )}
//                           </>
//                         )}
//                       </div>
//                     </>
//                   )}

//                   {property.status?.includes("Sold") && (
//                     <div className="price-tag d-flex align-items-center justify-content-between"
//                       style={{ "marginBottom": "25px" }}>
//                       <div className="price-usd">
//                         Sold on {getDisplayPrice(true) !== "Sold" && formatSoldDateShort(property.soldDate ?? "")}
//                       </div>
//                     </div>
//                   )}

//                   <div
//                     className={`property-status ${getStatusText()
//                       .toLowerCase()
//                       .replace(" ", "-")}`}
//                   >
//                     {getStatusText()}
//                   </div>

//                   {/* ADD CREATED DATE HERE */}
//                   {property.createdAt && (
//                     <div className="property-date text-muted small mb-2">
//                       <i className="bi bi-calendar-event me-1"></i>
//                       {"Listed on " + getDisplayDate(property.createdAt)}
//                     </div>
//                   )}

//                   <div className="property-address">
//                     <h4>{property.title || "Property"}</h4>
//                     <p>
//                       {property.city && <>{property.city}</>}
//                     </p>
//                   </div>

//                   <div className="property-stats">
//                     {property.bedrooms !== null &&
//                       property.bedrooms !== undefined &&
//                       property.bedrooms !== undefined && (
//                         <div className="stat-item">
//                           <i className="bi bi-house"></i>
//                           <div>
//                             <span className="value">{property.bedrooms}</span>
//                             <span className="label">Bedrooms</span>
//                           </div>
//                         </div>
//                       )}

//                     {property.bathrooms !== null &&
//                       property.bathrooms !== undefined &&
//                       property.bathrooms !== undefined && (
//                         <div className="stat-item">
//                           <i className="bi bi-droplet"></i>
//                           <div>
//                             <span className="value">{property.bathrooms}</span>
//                             <span className="label">Bathrooms</span>
//                           </div>
//                         </div>
//                       )}

//                     {property.buildingSize !== null &&
//                       property.buildingSize !== undefined &&
//                       property.buildingSize !== undefined && (
//                         <div className="stat-item">
//                           <i className="bi bi-rulers"></i>
//                           <div>
//                             <span className="value">
//                               {/* {property.buildingSize.toLocaleString()} */}
//                               {formatNumber(property.buildingSize)}
//                             </span>
//                             {/* <span className="label">{(property.sizeUnit) || "m²"}</span> */}
//                             <span className="label" style={{ "textTransform": "lowercase" }}>{formatUnit(property.sizeUnit) || "m²"}</span>
//                           </div>
//                         </div>
//                       )}

//                     {property.landSize !== null &&
//                       property.landSize !== undefined &&
//                       property.landSize !== undefined && (
//                         <div className="stat-item">
//                           <i className="bi bi-tree"></i>
//                           <div>
//                             <span className="value">
//                               {/* {calculateAcreage(property.landSize, property.sizeUnit)} */}
//                               {/* {property.landSize} */}
//                               {formatNumber(property.landSize)}
//                             </span>
//                             {/* <span className="label">Acres</span> */}
//                             {/* <span className="label">{property.sizeUnit || "m²"}</span> */}
//                             <span className="label" style={{ "textTransform": "lowercase" }}>{formatUnit(property.sizeUnit) || "m²"}</span>
//                           </div>
//                         </div>
//                       )}

//                     {property.yearBuilt !== null &&
//                       property.yearBuilt !== undefined &&
//                       property.yearBuilt !== undefined && (
//                         <div className="stat-item">
//                           <i className="bi bi-calendar"></i>
//                           <div>
//                             <span className="value">{property.yearBuilt}</span>
//                             <span className="label">Year Built</span>
//                           </div>
//                         </div>
//                       )}

//                     {property.garage !== null &&
//                       property.garage !== undefined &&
//                       property.garage !== undefined && (
//                         <div className="stat-item">
//                           <i className="bi bi-car-front"></i>
//                           <div>
//                             <span className="value">{property.garage}</span>
//                             <span className="label">Garage</span>
//                           </div>
//                         </div>
//                       )}
//                   </div>


//                   {/* Agent Info */}
//                   {property.showAgent && (
//                     <div className="agent-info">
//                       <div className="agent-avatar">
//                         <Image
//                           src={property.agent?.photo || "/img/real-estate/agent-3.webp"}
//                           alt={property.agent?.name || "Agent"}
//                           className="img-fluid"
//                           width={0}
//                           height={0}
//                           unoptimized
//                         />
//                       </div>
//                       <div className="agent-details">
//                         <h4>{property.agent?.name || "Sarah Johnson"}</h4>
//                         <p className="agent-title">
//                           {property.agent?.title || "Licensed Real Estate Agent"}
//                         </p>
//                         <p className="agent-phone">
//                           <i className="bi bi-telephone"></i>
//                           {property.agent?.phone || "+1 (555) 123-4567"}
//                         </p>
//                         <p className="agent-email">
//                           <i className="bi bi-envelope"></i>
//                           {property.agent?.email || "sarah@example.com"}
//                         </p>
//                       </div>
//                     </div>
//                   )}


//                   {/* New Inquire Now Button */}
//                   {!property.status?.includes("Sold") && (
//                     <div className="inquire-button mb-4">
//                       <a
//                         style={{ "background": "var(--accent-color)" }}
//                         href="#"
//                         onClick={(e) => {
//                           e.preventDefault();
//                           const message = `Hi, I'm interested in ${property.status?.includes("For Sale") ? "buying" : "renting"} this property: "${property.title || "Property"}". ${typeof window !== "undefined" ? window.location.href : ""}. Can you provide more details or help me proceed?`;
//                           // const whatsappUrl = `https://wa.me/${BUSINESS_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
//                           // window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
//                           openWhatsApp(message);
//                         }}
//                         className="btn custom-button btn-lg w-100"
//                         aria-label="Inquire about this property on WhatsApp"
//                       >
//                         <i className="bi bi-whatsapp me-2"></i>
//                         {property.status?.includes("For Sale") ? "Buy Now" : property.status?.includes("For Rent") ? "Rent Now" : "Inquire Now"}
//                       </a>
//                     </div>
//                   )}

//                   {/* Contact Form */}
//                   {!property.status?.includes("Sold") && (
//                     <div className="contact-form">
//                       <h4>Schedule a Tour</h4>
//                       <form
//                         onSubmit={handleTourRequestSubmit}
//                         className="php-email-form"
//                       >
//                         <div className="row">
//                           <div className="col-12 form-group">
//                             <input
//                               type="text"
//                               name="name"
//                               className="form-control"
//                               placeholder="Your Name"
//                               required
//                               value={formData.name}
//                               onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
//                             />
//                           </div>
//                           <div className="col-12 form-group">
//                             <input
//                               type="email"
//                               name="email"
//                               className="form-control"
//                               placeholder="Your Email"
//                               required
//                               value={formData.email}
//                               onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
//                             />
//                           </div>
//                           <div className="col-12 form-group">
//                             <InternationalPhoneInput
//                               value={phone}
//                               onChange={setPhone}
//                               required
//                               placeholder="Enter your phone number"
//                             />
//                           </div>
//                           {/* <div className="col-12 form-group">
//                           <input
//                             type="tel"
//                             name="phone"
//                             className="form-control"
//                             placeholder="Your Phone"
//                           />
//                         </div> */}
//                           <div className="col-12 form-group">
//                             <input
//                               type="text"
//                               name="subject"
//                               className="form-control"
//                               placeholder="Schedule a Tour"
//                               defaultValue={`Schedule a Tour for: ${property.title || "Property"
//                                 }`}
//                               readOnly
//                             />
//                           </div>
//                           <div className="col-12 form-group">
//                             <textarea
//                               className="form-control"
//                               name="message"
//                               rows={4}
//                               placeholder="Your Message (Optional)"
//                               maxLength={500}
//                               value={formData.message}
//                               onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
//                             ></textarea>
//                           </div>
//                           <div className="col-12 text-center">
//                             <div className="loading" style={{ display: isSubmitting ? 'block' : 'none' }}>Loading</div>
//                             <div className="error-message"></div>
//                             <div className="sent-message">
//                               Your message has been sent. Thank you!
//                             </div>
//                             <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
//                               {isSubmitting ? 'Submitting...' : 'Schedule Tour'}
//                             </button>
//                           </div>
//                         </div>
//                       </form>
//                     </div>
//                   )}
//                   {/* End Contact Form */}

//                   {/* <div className="social-share">
//                     <h5>Share This Property</h5>

//                     <div className="share-buttons">
//                       <a
//                         href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
//                           typeof window !== "undefined" ? window.location.href : ""
//                         )}`}
//                         target="_blank"
//                         rel="noopener"
//                         className="share-btn facebook"
//                         aria-label="Share on Facebook"
//                       >
//                         <i className="bi bi-facebook"></i>
//                       </a>

//                       <a
//                         href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
//                           typeof window !== "undefined" ? window.location.href : ""
//                         )}`}
//                         target="_blank"
//                         rel="noopener"
//                         className="share-btn twitter"
//                         aria-label="Share on X"
//                       >
//                         <i className="bi bi-twitter"></i>
//                       </a>

//                       <a
//                         href={`https://wa.me/?text=${encodeURIComponent(
//                           typeof window !== "undefined" ? window.location.href : ""
//                         )}`}
//                         target="_blank"
//                         rel="noopener"
//                         className="share-btn whatsapp"
//                         aria-label="Share on WhatsApp"
//                       >
//                         <i className="bi bi-whatsapp"></i>
//                       </a>
//                     </div>
//                   </div> */}


//                   <div className="social-share">
//                     <h5>Share This Property</h5>

//                     <div className="share-buttons">
//                       {/* Facebook */}
//                       <a
//                         href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
//                           typeof window !== 'undefined' ? window.location.href : ''
//                         )}`}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="share-btn facebook"
//                         aria-label="Share on Facebook"
//                         onClick={() => trackShare('facebook')}
//                       >
//                         <i className="bi bi-facebook"></i>
//                       </a>

//                       {/* Twitter */}
//                       <a
//                         href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
//                           typeof window !== 'undefined' ? window.location.href : ''
//                         )}`}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="share-btn twitter"
//                         aria-label="Share on X"
//                         onClick={() => trackShare('twitter')}
//                       >
//                         <i className="bi bi-twitter"></i>
//                       </a>

//                       {/* WhatsApp */}
//                       <a
//                         href={`https://wa.me/?text=${encodeURIComponent(
//                           typeof window !== 'undefined' ? window.location.href : ''
//                         )}`}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="share-btn whatsapp"
//                         aria-label="Share on WhatsApp"
//                         onClick={() => trackShare('whatsapp')}
//                       >
//                         <i className="bi bi-whatsapp"></i>
//                       </a>

//                       {/* Copy Link */}
//                       <button
//                         className={`share-btn copy ${copied ? 'copied' : ''}`}
//                         onClick={copyToClipboard}
//                         aria-label="Copy link"
//                       >
//                         <i className="bi bi-link"></i>
//                         {copied && <span className="copied-tooltip">Copied!</span>}
//                       </button>
//                     </div>
//                   </div>

//                   {/* End Social Share */}
//                 </div>
//                 {/* End Property Overview */}
//               </div>
//             </div>
//           </div>

//           <LoginRequiredModal
//             open={showLoginModal}
//             onClose={() => setShowLoginModal(false)}
//           />

//         </section>
//         {/* /Property Details Section */}
//       </main>
//     </>
//   );
// }





// app/properties/[id]/page.tsx
"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { PropertyData } from "@/types/property";
import { useTemplateScripts } from "@/hooks/useTemplateScripts";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/supabase";
import { PropertiesRepository } from "@/lib/repositories/PropertiesRepository";
import AppLoader from "@/components/ui/AppLoader/AppLoader";
import { InternationalPhoneInput } from "@/components/ui/forms/InternationalPhoneInput";
import { openWhatsApp } from "@/src/utils/whatsapp";
import { formatNumber, formatPrice, formatUnit } from "@/utils/format";
import { useFavorites } from "@/hooks/useFavorites";
import "./PropertyClient.css";
import LoginRequiredModal from "@/components/modules/LoginRequiredModal";
import { getDisplayDate } from "@/src/utils/dateUtils";
import { convertToUSD } from "@/utils/convertToUSD";
import PropertyViewTracker from "@/components/tracking/PropertyViewTracker";
import { getCurrentGuestId } from "@/lib/guest";
import ImageGalleryModal from "@/components/modules/ImageGalleryModal";


// ─── Loading spinner ──────────────────────────────────────────
function LoadingSpinner() {
  return (
    <div className="d-flex justify-content-center" style={{ height: "100vh", alignItems: "center" }}>
      <div className="loading-container text-center py-5">
        <AppLoader />
        <p className="mt-3">Loading property details...</p>
      </div>
    </div>
  );
}

// ─── Not-found page ───────────────────────────────────────────
const THEME = {
  primary: "#2c7a7b",
  muted: "#6b7280",
  bg: "#f8fafc",
};

function PropertyNotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: THEME.bg,
        padding: "2rem",
      }}
    >
      <div
        style={{
          maxWidth: 520,
          width: "100%",
          textAlign: "center",
          background: "#ffffff",
          borderRadius: 16,
          padding: "3rem 2.5rem",
          boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            margin: "0 auto 1.5rem",
            borderRadius: "50%",
            backgroundColor: `${THEME.primary}15`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
            color: THEME.primary,
          }}
        >
          <Image src="/favicon.ico" alt="Properties Icon" width={55} height={55} />
        </div>

        <h2 style={{ marginBottom: "0.75rem", fontWeight: 600 }}>Property not found</h2>

        <p style={{ color: THEME.muted, fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "2rem" }}>
          The property you are looking for doesn&#39;t exist, has been removed, or is no longer available.
        </p>

        <Link
          href="/properties"
          style={{
            display: "inline-block",
            padding: "0.75rem 1.75rem",
            borderRadius: 999,
            backgroundColor: THEME.primary,
            color: "#ffffff",
            fontWeight: 500,
            textDecoration: "none",
            transition: "transform 0.15s ease, box-shadow 0.15s ease",
            boxShadow: "0 6px 18px rgba(44,122,123,0.35)",
          }}
        >
          Browse properties
        </Link>
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────
export function formatSoldDateShort(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ─── Main component ───────────────────────────────────────────
type Props = { id: string };

export default function PropertyPage({ id }: Props) {
  // ── Data state ──
  const [property, setProperty] = useState<PropertyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Form state ──
  const [phone, setPhone] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Currency state ──
  const [usdLoading, setUsdLoading] = useState(false);
  const [usdSale, setUsdSale] = useState<number | null>(null);
  const [usdRent, setUsdRent] = useState<number | null>(null);

  // ── Gallery state (progressive loading + lightbox) ──
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [mainImageLoaded, setMainImageLoaded] = useState(false);
  const [loadedThumbnails, setLoadedThumbnails] = useState<Set<number>>(new Set());
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // ── Other UI state ──
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const supabase = createClient();
  const { isFavorited: hookIsFavorited, toggleFavorite: hookToggleFavorite, user } = useFavorites();
  const isFavorited = hookIsFavorited;
  const toggleFavorite = hookToggleFavorite;

  const activeLightboxThumbRef = useRef<HTMLImageElement>(null);
  const mainImgRef = useRef<HTMLImageElement>(null);

  useTemplateScripts();

  // ── Fetch property ──
  useEffect(() => {
    async function fetchProperty() {
      try {
        setLoading(true);
        setError(null);
        const propertiesRepo = new PropertiesRepository();
        const data = await propertiesRepo.getById(id);

        if (!data) { setError("Property not found"); setProperty(null); return; }
        if (!data.published && !data.draft) { setError("Property is not available"); setProperty(null); return; }

        setProperty(data);
      } catch {
        setError("Failed to load property details");
      } finally {
        setLoading(false);
      }
    }
    fetchProperty();
  }, [id]);

  // ── Fetch USD conversions ──
  useEffect(() => {
    if (!property) return;
    async function fetchUSD() {
      try {
        setUsdLoading(true);
        if (property?.salePrice && property?.saleCurrency !== "USD") {
          const v = await convertToUSD(property.salePrice, property.saleCurrency ?? "USD");
          setUsdSale(v);
        } else if (property?.salePrice) {
          setUsdSale(property.salePrice);
        }
        if (property?.rentPrice && property?.rentCurrency !== "USD") {
          const v = await convertToUSD(property.rentPrice, property.rentCurrency ?? "USD");
          setUsdRent(v);
        } else if (property?.rentPrice) {
          setUsdRent(property.rentPrice);
        }
      } catch (err) {
        console.error("USD conversion failed", err);
      } finally {
        setUsdLoading(false);
      }
    }
    fetchUSD();
  }, [property]);

  // // ── Lock body scroll when lightbox is open ──
  // useEffect(() => {
  //   document.body.style.overflow = lightboxOpen ? "hidden" : "";
  //   return () => { document.body.style.overflow = ""; };
  // }, [lightboxOpen]);

  // // ── Keyboard navigation for lightbox ──
  // useEffect(() => {
  //   if (!lightboxOpen) return;
  //   const onKey = (e: KeyboardEvent) => {
  //     if (e.key === "ArrowLeft") handlePrevImage();
  //     if (e.key === "ArrowRight") handleNextImage();
  //     if (e.key === "Escape") setLightboxOpen(false);
  //   };
  //   window.addEventListener("keydown", onKey);
  //   return () => window.removeEventListener("keydown", onKey);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [lightboxOpen, currentImageIndex]);

  useEffect(() => {
    if (lightboxOpen && activeLightboxThumbRef.current) {
      activeLightboxThumbRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [currentImageIndex, lightboxOpen]);

  useEffect(() => {
    setMainImageLoaded(false);
    const img = mainImgRef.current;
    if (img && img.complete && img.naturalWidth > 0) {
      setMainImageLoaded(true); // already cached, no delay
    }
  }, [currentImageIndex]);

  // ── Share tracking ──
  const trackShare = async (type: string) => {
    try {
      const guestId = getCurrentGuestId();
      const { error } = await supabase.from("property_shares").insert({
        property_id: id,
        share_type: type,
        guest_id: guestId,
      });
      if (error) console.error("Share tracking error:", error);
    } catch (err) {
      console.error("Failed to track share:", err);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    trackShare("copy");
  };

  // ── Favorite ──
  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { setShowLoginModal(true); return; }
    await toggleFavorite(id);
  };

  // ── Tour form ──
  const handleTourRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property) return;
    if (!formData.name.trim() || !formData.email.trim() || !phone.trim()) {
      alert("Please fill in all required fields.");
      return;
    }
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("tour_requests").insert({
        property_id: property.id,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: phone.trim(),
        message: formData.message.trim() || null,
      });
      if (error) throw error;

      const propertyStatus = property.status.length > 0 ? property.status[0] : "Available";
      const message = `Hello\nI'd like to schedule a tour for this property.\n\nProperty: ${property.title || "Property"} - ${propertyStatus}\nLink: ${typeof window !== "undefined" ? window.location.href : ""}\n\nCould you please let me know available dates and times? Thank you.`;
      openWhatsApp(message);
      setFormData({ name: "", email: "", message: "" });
      setPhone("");
    } catch (error) {
      console.error("Error submitting tour request:", error);
      alert("Failed to submit tour request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─────────────────────────────────────────────────────────────
  // Early returns (loading / not found)
  // ─────────────────────────────────────────────────────────────
  if (loading) return <LoadingSpinner />;
  if (error || !property) return <PropertyNotFound />;

  // ─────────────────────────────────────────────────────────────
  // Helpers (only used after property is confirmed non-null)
  // ─────────────────────────────────────────────────────────────
  const propertyImages = property.images?.length
    ? property.images
    : ["/img/real-estate/property-exterior-3.webp"];

  const handleThumbnailClick = (index: number) => {
    if (index === currentImageIndex) return;
    setMainImageLoaded(false);
    setCurrentImageIndex(index);
  };

  const handlePrevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setMainImageLoaded(false);
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : propertyImages.length - 1));
  };

  const handleNextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setMainImageLoaded(false);
    setCurrentImageIndex((prev) => (prev < propertyImages.length - 1 ? prev + 1 : 0));
  };

  const handleThumbnailLoad = (index: number) => {
    setLoadedThumbnails((prev) => new Set(prev).add(index));
  };

  const getDisplayPrice = (return_price: boolean = false) => {
    if (property.status?.includes("For Sale") && property.salePrice)
      return formatPrice(property.salePrice, property.saleCurrency);
    if (property.status?.includes("For Rent") && property.rentPrice)
      return formatPrice(property.rentPrice, property.rentCurrency) + property.rentPeriodLabel;
    if (property.status?.includes("Sold")) {
      if (return_price && property.salePrice)
        return formatPrice(property.salePrice, property.saleCurrency);
      return "Sold";
    }
    return "Price on request";
  };

  const getRentPrice = () => {
    if (
      property.status?.includes("For Sale") && property.salePrice &&
      property.status?.includes("For Rent") && property.rentPrice
    ) {
      return formatPrice(property.rentPrice, property.rentCurrency) + " " + property.rentPeriodLabel;
    }
  };

  const getStatusText = () => {
    if (property.status?.includes("For Sale")) return "For Sale";
    if (property.status?.includes("For Rent")) return "For Rent";
    if (property.status?.includes("Sold")) return "Sold";
    return "Available";
  };

  const formatSizeDisplay = (size?: number, unit?: string) => {
    if (!size) return "";
    return `${size.toLocaleString()} ${formatUnit(unit as any) || "m²"}`;
  };

  const isPropertyFavorited = isFavorited(id);

  // ─────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────
  return (
    <>
      <main className="main">
        <PropertyViewTracker propertyId={id} />

        {/* ── Page Title ── */}
        <div className="page-title">
          <div className="heading">
            <div className="container">
              <div className="row d-flex justify-content-center text-center">
                <div className="col-lg-8">
                  <h1 className="heading-title">{property.title || "Property Details"}</h1>
                  <p className="mb-0">
                    {property.description?.substring(0, 200) ||
                      "Odio et unde deleniti. Deserunt numquam exercitationem. Officiis quo odio sint voluptas consequatur ut a odio voluptatem."}
                    {property.description && property.description.length > 200 ? "..." : ""}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <nav className="breadcrumbs">
            <div className="container">
              <ol>
                <li><Link href="/">Home</Link></li>
                <li><Link href="/properties">Properties</Link></li>
                <li className="current">{property.title || "Property Details"}</li>
              </ol>
            </div>
          </nav>
        </div>

        {/* ── Property Details Section ── */}
        <section id="property-details" className="property-details section">
          <div className="container" data-aos="fade-up" data-aos-delay="100">
            <div className="row gy-4">

              {/* ════════════════════════════════════════════════
                  LEFT COLUMN
              ════════════════════════════════════════════════ */}
              <div className="col-lg-8">

                {/* ── Property Gallery ── */}
                <div className="property-gallery" data-aos="fade-up" data-aos-delay="200">

                  {/* MAIN IMAGE */}
                  <div
                    className="main-image-container"
                    style={{ position: "relative", overflow: "hidden" }}
                  >
                    {/* Shimmer skeleton shown while main image loads */}
                    {!mainImageLoaded && (
                      <div className="pc-img-skeleton" aria-hidden="true" />
                    )}

                    {/* Main image — key forces remount on src change so onLoad always fires */}
                    <Image
                      id="main-product-image"
                      // key={propertyImages[currentImageIndex]}
                      ref={mainImgRef}
                      src={propertyImages[currentImageIndex]}
                      alt={property.title || "Property"}
                      className={`img-fluid main-property-image pc-img ${mainImageLoaded ? "pc-img--loaded" : "pc-img--loading"}`}
                      width={0}
                      height={0}
                      unoptimized
                      style={{ width: "100%", height: "auto", objectFit: "cover", cursor: "zoom-in" }}
                      loading="eager"
                      priority={true}
                      onLoad={() => setMainImageLoaded(true)}
                      onClick={() => setLightboxOpen(true)}
                    />

                    {/* Prev / Next arrows */}
                    {propertyImages.length > 1 && (
                      <div className="image-nav-buttons">
                        <button
                          className="image-nav-btn prev-image"
                          type="button"
                          onClick={handlePrevImage}
                          aria-label="Previous image"
                        >
                          <i className="bi bi-chevron-left" />
                        </button>
                        <button
                          className="image-nav-btn next-image"
                          type="button"
                          onClick={handleNextImage}
                          aria-label="Next image"
                        >
                          <i className="bi bi-chevron-right" />
                        </button>
                      </div>
                    )}

                    {/* Image counter badge */}
                    {propertyImages.length > 1 && (
                      <div
                        className="pc-img-counter"
                        aria-label={`Image ${currentImageIndex + 1} of ${propertyImages.length}`}
                      >
                        <i className="bi bi-images me-1" style={{ fontSize: "0.75rem" }} />
                        {currentImageIndex + 1} / {propertyImages.length}
                      </div>
                    )}
                  </div>

                  {/* THUMBNAIL STRIP */}
                  {propertyImages.length > 1 && (
                    <div className="thumbnail-gallery thumbnail-list">
                      {propertyImages.map((image, index) => {
                        const isActive = index === currentImageIndex;
                        const isLoaded = loadedThumbnails.has(index);
                        return (
                          <div
                            key={index}
                            className={`thumbnail-item ${isActive ? "active" : ""}`}
                            onClick={() => handleThumbnailClick(index)}
                            style={{ position: "relative", cursor: "pointer", overflow: "hidden" }}
                          >
                            {/* Per-thumbnail shimmer */}
                            {!isLoaded && (
                              <div className="pc-thumb-skeleton" aria-hidden="true" />
                            )}
                            <Image
                              src={image}
                              alt={`${property.title} - Image ${index + 1}`}
                              className={`img-fluid pc-img ${isLoaded ? "pc-img--loaded" : "pc-img--loading"}`}
                              width={0}
                              height={0}
                              unoptimized
                              loading={index < 4 ? "eager" : "lazy"}
                              onLoad={() => handleThumbnailLoad(index)}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                // staggered delay → one-by-one reveal
                                transitionDelay: `${index * 60}ms`,
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                {/* End Property Gallery */}

                {/* ── Property Description ── */}
                <div className="property-description" data-aos="fade-up" data-aos-delay="300">
                  <h3>About This Property</h3>
                  <p style={{ whiteSpace: "pre-line" }}>
                    {property.description || "No description available for this property."}
                  </p>

                  <div className="mt-4">
                    <h5>Property Details</h5>
                    <ul className="list-unstyled">
                      {property.propertyType && (
                        <li>
                          <strong>Type:</strong>{" "}
                          {property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1)}
                        </li>
                      )}
                      {property.yearBuilt && (
                        <li><strong>Year Built:</strong> {property.yearBuilt}</li>
                      )}
                      {property.buildingSize && (
                        <li>
                          <strong>Building Size:</strong>{" "}
                          {formatSizeDisplay(property.buildingSize, property.sizeUnit)}
                        </li>
                      )}
                      {property.landSize && (
                        <li>
                          <strong>Land Size:</strong>{" "}
                          {formatSizeDisplay(property.landSize, property.sizeUnit)}
                        </li>
                      )}
                      {property.zoning && (
                        <li><strong>Zoning:</strong> {property.zoning}</li>
                      )}
                    </ul>

                    {property.utilities && (
                      <div className="mt-3">
                        <strong>Utilities:</strong>
                        <div className="d-flex flex-wrap gap-2 mt-2">
                          {property.utilities.water && <span className="badge bg-info">Water</span>}
                          {property.utilities.electricity && <span className="badge bg-info">Electricity</span>}
                          {property.utilities.sewage && <span className="badge bg-info">Sewage</span>}
                          {property.utilities.roadAccess && <span className="badge bg-info">Road Access</span>}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* ── Amenities ── */}
                <div className="property-amenities" data-aos="fade-up" data-aos-delay="400">
                  <h3>Amenities &amp; Features</h3>
                  <div className="row">
                    <div className="col-md-6">
                      <h4>Interior Features</h4>
                      {property.interiorFeatures && property.interiorFeatures.length > 0 ? (
                        <ul className="features-list">
                          {property.interiorFeatures.map((feature, index) => (
                            <li key={index}><i className="bi bi-check-circle" />{feature}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-muted">No interior features listed.</p>
                      )}
                    </div>

                    <div className="col-md-6">
                      <h4>Exterior Features</h4>
                      {property.exteriorFeatures && property.exteriorFeatures.length > 0 ? (
                        <ul className="features-list">
                          {property.exteriorFeatures.map((feature, index) => (
                            <li key={index}><i className="bi bi-check-circle" />{feature}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-muted">No exterior features listed.</p>
                      )}
                    </div>

                    {property.customFeatures && property.customFeatures.length > 0 && (
                      <div className="col-12 mt-4">
                        <h4>Additional Features</h4>
                        <ul className="features-list">
                          {property.customFeatures.map((feature, index) => (
                            <li key={index}><i className="bi bi-check-circle" />{feature}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="mt-4">
                    <h4>Property Labels</h4>
                    <div className="d-flex flex-wrap gap-2">
                      {property.hot && <span className="badge bg-danger"><i className="bi bi-fire me-1" />Hot Property</span>}
                      {property.newListing && <span className="badge bg-success"><i className="bi bi-star me-1" />New Listing</span>}
                      {property.featured && <span className="badge bg-warning text-dark"><i className="bi bi-gem me-1" />Featured</span>}
                      {property.exclusive && <span className="badge bg-primary"><i className="bi bi-shield-lock me-1" />Exclusive</span>}
                    </div>
                  </div>
                </div>

                {/* ── Address ── */}
                <div className="property-map" data-aos="fade-up" data-aos-delay="500">
                  <h3>Address</h3>
                  <p>
                    {property.showAddress && property.address ? (
                      <>{property.address}<br />{property.city && <>{property.city}</>}</>
                    ) : (
                      <>{property.address}<br />{property.city && <>{property.city}</>}</>
                    )}
                  </p>
                </div>
              </div>
              {/* End left column */}

              {/* ════════════════════════════════════════════════
                  RIGHT COLUMN (sidebar)
              ════════════════════════════════════════════════ */}
              <div className="col-lg-4" style={{ zIndex: 1 }}>
                <div
                  className="property-overview sticky-top"
                  data-aos="fade-up"
                  data-aos-delay="200"
                >
                  {/* Price */}
                  <div className="price-tag d-flex align-items-center justify-content-between">
                    {property.status?.includes("Sold") ? (
                      <p style={{ margin: "0" }}>{getDisplayPrice(true)}</p>
                    ) : (
                      <p style={{ margin: "0" }}>{getDisplayPrice()}</p>
                    )}
                    <button
                      className={`property-details favorite-btn ${isPropertyFavorited ? "favorited" : ""}`}
                      onClick={handleFavoriteClick}
                      title={isPropertyFavorited ? "Remove from favorites" : "Add to favorites"}
                    >
                      <i className={`bi ${isPropertyFavorited ? "bi-heart-fill" : "bi-heart"}`} />
                    </button>
                  </div>

                  {/* USD equivalent */}
                  <div className="price-tag d-flex align-items-center justify-content-between">
                    {usdLoading && (
                      <span className="usd-loading">
                        ≈ USD loading… <i className="bi bi-arrow-repeat ms-1 spin" />
                      </span>
                    )}
                    {!usdLoading && usdSale && property?.saleCurrency !== "USD" && (
                      <div className="price-usd">≈ {formatPrice(Math.round(usdSale), "USD")}</div>
                    )}
                  </div>

                  {/* Rent price row */}
                  {property.rentPrice && (
                    <>
                      <div className="price-tag d-flex align-items-center justify-content-between">
                        {getRentPrice()}
                      </div>
                      <div className="price-tag d-flex align-items-center justify-content-between">
                        {usdLoading && (
                          <span className="usd-loading">
                            ≈ USD loading… <i className="bi bi-arrow-repeat ms-1 spin" />
                          </span>
                        )}
                        {!usdLoading && usdRent && property?.rentCurrency !== "USD" && (
                          <div className="price-usd">
                            ≈ {formatPrice(Math.round(usdRent), "USD")} {property?.rentPeriodLabel}
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {/* Sold date */}
                  {property.status?.includes("Sold") && (
                    <div
                      className="price-tag d-flex align-items-center justify-content-between"
                      style={{ marginBottom: "25px" }}
                    >
                      <div className="price-usd">
                        Sold on{" "}
                        {getDisplayPrice(true) !== "Sold" && formatSoldDateShort(property.soldDate ?? "")}
                      </div>
                    </div>
                  )}

                  <div className={`property-status ${getStatusText().toLowerCase().replace(" ", "-")}`}>
                    {getStatusText()}
                  </div>

                  {property.createdAt && (
                    <div className="property-date text-muted small mb-2">
                      <i className="bi bi-calendar-event me-1" />
                      {"Listed on " + getDisplayDate(property.createdAt)}
                    </div>
                  )}

                  <div className="property-address">
                    <h4>{property.title || "Property"}</h4>
                    <p>{property.city && <>{property.city}</>}</p>
                  </div>

                  {/* Stats grid */}
                  <div className="property-stats">
                    {property.bedrooms != null && (
                      <div className="stat-item">
                        <i className="bi bi-house" />
                        <div>
                          <span className="value">{property.bedrooms}</span>
                          <span className="label">Bedrooms</span>
                        </div>
                      </div>
                    )}
                    {property.bathrooms != null && (
                      <div className="stat-item">
                        <i className="bi bi-droplet" />
                        <div>
                          <span className="value">{property.bathrooms}</span>
                          <span className="label">Bathrooms</span>
                        </div>
                      </div>
                    )}
                    {property.buildingSize != null && (
                      <div className="stat-item">
                        <i className="bi bi-rulers" />
                        <div>
                          <span className="value">{formatNumber(property.buildingSize)}</span>
                          <span className="label" style={{ textTransform: "lowercase" }}>
                            {formatUnit(property.sizeUnit) || "m²"}
                          </span>
                        </div>
                      </div>
                    )}
                    {property.landSize != null && (
                      <div className="stat-item">
                        <i className="bi bi-tree" />
                        <div>
                          <span className="value">{formatNumber(property.landSize)}</span>
                          <span className="label" style={{ textTransform: "lowercase" }}>
                            {formatUnit(property.sizeUnit) || "m²"}
                          </span>
                        </div>
                      </div>
                    )}
                    {property.yearBuilt != null && (
                      <div className="stat-item">
                        <i className="bi bi-calendar" />
                        <div>
                          <span className="value">{property.yearBuilt}</span>
                          <span className="label">Year Built</span>
                        </div>
                      </div>
                    )}
                    {property.garage != null && (
                      <div className="stat-item">
                        <i className="bi bi-car-front" />
                        <div>
                          <span className="value">{property.garage}</span>
                          <span className="label">Garage</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Agent info */}
                  {property.showAgent && (
                    <div className="agent-info">
                      <div className="agent-avatar">
                        <Image
                          src={property.agent?.photo || "/img/real-estate/agent-3.webp"}
                          alt={property.agent?.name || "Agent"}
                          className="img-fluid"
                          width={0}
                          height={0}
                          unoptimized
                        />
                      </div>
                      <div className="agent-details">
                        <h4>{property.agent?.name || "Sarah Johnson"}</h4>
                        <p className="agent-title">{property.agent?.title || "Licensed Real Estate Agent"}</p>
                        <p className="agent-phone">
                          <i className="bi bi-telephone" />
                          {property.agent?.phone || "+1 (555) 123-4567"}
                        </p>
                        <p className="agent-email">
                          <i className="bi bi-envelope" />
                          {property.agent?.email || "sarah@example.com"}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Inquire button */}
                  {!property.status?.includes("Sold") && (
                    <div className="inquire-button mb-4">
                      <a
                        style={{ background: "var(--accent-color)" }}
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          const message = `Hi, I'm interested in ${property.status?.includes("For Sale") ? "buying" : "renting"} this property: "${property.title || "Property"}". ${typeof window !== "undefined" ? window.location.href : ""}. Can you provide more details or help me proceed?`;
                          openWhatsApp(message);
                        }}
                        className="btn custom-button btn-lg w-100"
                        aria-label="Inquire about this property on WhatsApp"
                      >
                        <i className="bi bi-whatsapp me-2" />
                        {property.status?.includes("For Sale")
                          ? "Buy Now"
                          : property.status?.includes("For Rent")
                            ? "Rent Now"
                            : "Inquire Now"}
                      </a>
                    </div>
                  )}

                  {/* Contact / tour form */}
                  {!property.status?.includes("Sold") && (
                    <div className="contact-form">
                      <h4>Schedule a Tour</h4>
                      <form onSubmit={handleTourRequestSubmit} className="php-email-form">
                        <div className="row">
                          <div className="col-12 form-group">
                            <input
                              type="text"
                              name="name"
                              className="form-control"
                              placeholder="Your Name"
                              required
                              value={formData.name}
                              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                            />
                          </div>
                          <div className="col-12 form-group">
                            <input
                              type="email"
                              name="email"
                              className="form-control"
                              placeholder="Your Email"
                              required
                              value={formData.email}
                              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                            />
                          </div>
                          <div className="col-12 form-group">
                            <InternationalPhoneInput
                              value={phone}
                              onChange={setPhone}
                              required
                              placeholder="Enter your phone number"
                            />
                          </div>
                          <div className="col-12 form-group">
                            <input
                              type="text"
                              name="subject"
                              className="form-control"
                              placeholder="Schedule a Tour"
                              defaultValue={`Schedule a Tour for: ${property.title || "Property"}`}
                              readOnly
                            />
                          </div>
                          <div className="col-12 form-group">
                            <textarea
                              className="form-control"
                              name="message"
                              rows={4}
                              placeholder="Your Message (Optional)"
                              maxLength={500}
                              value={formData.message}
                              onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                            />
                          </div>
                          <div className="col-12 text-center">
                            <div className="loading" style={{ display: isSubmitting ? "block" : "none" }}>
                              Loading
                            </div>
                            <div className="error-message" />
                            <div className="sent-message">Your message has been sent. Thank you!</div>
                            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                              {isSubmitting ? "Submitting..." : "Schedule Tour"}
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Social share */}
                  <div className="social-share">
                    <h5>Share This Property</h5>
                    <div className="share-buttons">
                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                          typeof window !== "undefined" ? window.location.href : ""
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="share-btn facebook"
                        aria-label="Share on Facebook"
                        onClick={() => trackShare("facebook")}
                      >
                        <i className="bi bi-facebook" />
                      </a>
                      <a
                        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                          typeof window !== "undefined" ? window.location.href : ""
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="share-btn twitter"
                        aria-label="Share on X"
                        onClick={() => trackShare("twitter")}
                      >
                        <i className="bi bi-twitter" />
                      </a>
                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(
                          typeof window !== "undefined" ? window.location.href : ""
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="share-btn whatsapp"
                        aria-label="Share on WhatsApp"
                        onClick={() => trackShare("whatsapp")}
                      >
                        <i className="bi bi-whatsapp" />
                      </a>
                      <button
                        className={`share-btn copy ${copied ? "copied" : ""}`}
                        onClick={copyToClipboard}
                        aria-label="Copy link"
                      >
                        <i className="bi bi-link" />
                        {copied && <span className="copied-tooltip">Copied!</span>}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {/* End right column */}

            </div>
          </div>

          <LoginRequiredModal
            open={showLoginModal}
            onClose={() => setShowLoginModal(false)}
          />
        </section>

        {/* ════════════════════════════════════════════════════
            LIGHTBOX
            — opens on main image click
            — scrollable image inside so portrait photos
              don't trap the mobile page
            — keyboard: ← → Escape
        ════════════════════════════════════════════════════ */}
        {lightboxOpen && (
          <div
            className="pc-lightbox"
            onClick={() => setLightboxOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Image viewer"
          >
            {/* Close */}
            <button
              className="pc-lightbox__close"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close image viewer"
            >
              <i className="bi bi-x-lg" />
            </button>

            {/* Counter */}
            {propertyImages.length > 1 && (
              <div className="pc-lightbox__counter">
                {currentImageIndex + 1} / {propertyImages.length}
              </div>
            )}

            {/* Image — click inside does NOT close */}
            <div
              className="pc-lightbox__img-wrap"
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={propertyImages[currentImageIndex]}
                alt={`${property.title} – ${currentImageIndex + 1}`}
                className="pc-lightbox__img"
                draggable={false}
              />
            </div>

            {/* Prev / Next */}
            {propertyImages.length > 1 && (
              <>
                <button
                  className="pc-lightbox__nav pc-lightbox__nav--prev"
                  onClick={handlePrevImage}
                  aria-label="Previous image"
                >
                  <i className="bi bi-chevron-left" />
                </button>
                <button
                  className="pc-lightbox__nav pc-lightbox__nav--next"
                  onClick={handleNextImage}
                  aria-label="Next image"
                >
                  <i className="bi bi-chevron-right" />
                </button>
              </>
            )}

            {/* Thumbnail strip inside lightbox */}
            {propertyImages.length > 1 && (
              <div
                className="pc-lightbox__thumbs"
                onClick={(e) => e.stopPropagation()}
              >
                {propertyImages.map((img, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={img}
                    alt=""
                    ref={i === currentImageIndex ? activeLightboxThumbRef : null}
                    className={`pc-lightbox__thumb ${i === currentImageIndex ? "pc-lightbox__thumb--active" : ""}`}
                    onClick={() => handleThumbnailClick(i)}
                    draggable={false}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <ImageGalleryModal
          open={lightboxOpen}
          images={propertyImages}
          index={currentImageIndex}
          onClose={() => setLightboxOpen(false)}
          onNext={handleNextImage}
          onPrev={handlePrevImage}
        />

      </main>
    </>
  );
}
