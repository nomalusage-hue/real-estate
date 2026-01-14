// "use client";

// import { useState, useEffect, useRef } from "react";
// import { useParams } from "next/navigation";
// import { propertyService } from "@/services/PropertyService";
// import { PropertyData } from "@/types/property";
// import { useTemplateScripts } from "@/hooks/useTemplateScripts";
// import Link from "next/link";
// import Image from "next/image";

// // Loading component
// function LoadingSpinner() {
//   return (
//     <div className="d-flex justify-content-center" style={{height: "100vh", alignItems: "center"}}>
//       <div className="loading-container text-center py-5">
//         <div className="spinner-border text-primary" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </div>
//         <p className="mt-3">Loading property details...</p>
//       </div>
//     </div>
//   );
// }

// // Not Found component
// function PropertyNotFound() {
//   return (
//     <div className="container py-5 text-center">
//       <div className="row d-flex justify-content-center" style={{height: "100vh", alignItems: "center"}}>
//         <div className="col-lg-6">
//           <div className="alert alert-warning" role="alert">
//             <h4 className="alert-heading">Property Not Found</h4>
//             <p>
//               The property you&#39;re looking for doesn&#39;t exist or has been
//               removed.
//             </p>
//             <hr />
//             <p className="mb-0">
//               <Link href="/properties" className="btn btn-primary">
//                 Browse Properties
//               </Link>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function PropertyPage() {
//   // props: { params: Promise<{ id: string }> }
//   const params = useParams();
//   const [property, setProperty] = useState<PropertyData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useTemplateScripts();

//   useEffect(() => {
//     async function fetchProperty() {
//       try {
//         setLoading(true);
//         setError(null);

//         // Get the id from params - in client components, we use useParams
//         const id = params?.id as string;
//         if (!id) {
//           setError("Invalid property ID");
//           return;
//         }

//         const data = await propertyService.getById(id);
//         setProperty(data);

//         if (!data) {
//           setError("Property not found");
//         }
//       } catch (err) {
//         console.error("Error fetching property:", err);
//         setError("Failed to load property details");
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchProperty();
//   }, [params?.id]);

//   const driftInstanceRef = useRef(null);

//   // Initialize image gallery when property loads
//   useEffect(() => {
//     if (!property || !property.images || property.images.length === 0) {
//       return;
//     }

//     // Wait a bit for images to render
//     const timer = setTimeout(() => {
//       initImageGallery();
//     }, 500);

//     return () => {
//       clearTimeout(timer);
//       // Clean up Drift instance
//       if (driftInstanceRef.current) {
//         driftInstanceRef.current.destroy();
//         driftInstanceRef.current = null;
//       }
//     };
//   }, [property]);

//   function initImageGallery() {
//     const thumbnailItems = document.querySelectorAll(".thumbnail-item");
//     const mainImage = document.getElementById("main-product-image");
//     const prevBtn = document.querySelector(".prev-image");
//     const nextBtn = document.querySelector(".next-image");

//     if (!thumbnailItems.length || !mainImage) return;

//     let currentIndex = 0;

//     const updateMainImage = (index) => {
//       const thumbnail = thumbnailItems[index];
//       if (!thumbnail) return;

//       const imageUrl = thumbnail.getAttribute("data-image");
//       mainImage.src = imageUrl;
//       mainImage.setAttribute("data-zoom", imageUrl);

//       thumbnailItems.forEach((item) => item.classList.remove("active"));
//       thumbnail.classList.add("active");
//       currentIndex = index;

//       if (driftInstanceRef.current) {
//         setTimeout(() => {
//           driftInstanceRef.current?.setZoomImageURL(imageUrl);
//         }, 50);
//       }
//     };

//     // Initialize Drift zoom
//     if (
//       typeof Drift !== "undefined" &&
//       mainImage &&
//       !driftInstanceRef.current
//     ) {
//       driftInstanceRef.current = new Drift(mainImage, {
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

//   // Show loading state
//   if (loading) {
//     return <LoadingSpinner />;
//   }

//   // Show not found state
//   if (error || !property) {
//     return <PropertyNotFound />;
//   }

//   // Format price with commas
//   const formatPrice = (price: number) => {
//     return new Intl.NumberFormat("en-US", {
//       style: "currency",
//       currency: "USD",
//       minimumFractionDigits: 0,
//     }).format(price);
//   };

//   // Get display price based on status
//   const getDisplayPrice = () => {
//     if (property.status?.includes("For Sale") && property.salePrice) {
//       return formatPrice(property.salePrice);
//     }
//     if (property.status?.includes("For Rent") && property.rentPrice) {
//       return formatPrice(property.rentPrice) + "/month";
//     }
//     return "Price on request";
//   };

//   // Get status text
//   const getStatusText = () => {
//     if (property.status?.includes("For Sale")) return "For Sale";
//     if (property.status?.includes("For Rent")) return "For Rent";
//     if (property.status?.includes("Sold")) return "Sold";
//     return "Available";
//   };

//   return (
//     <>
//       <main className="main">
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
//                     <Image
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
//                       {property.images.map((image, index) => (
//                         <div
//                           key={index}
//                           className={`thumbnail-item ${
//                             index === 0 ? "active" : ""
//                           }`}
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
//                       <div
//                         className="thumbnail-item"
//                         data-image="/img/real-estate/property-interior-1.webp"
//                       >
//                         <Image
//                           src="/img/real-estate/property-interior-1.webp"
//                           alt="Living Room"
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
//                   <p>
//                     {property.description ||
//                       "No description available for this property."}
//                   </p>

//                   {/* Additional details */}
//                   <div className="mt-4">
//                     <h5>Property Details</h5>
//                     <ul className="list-unstyled">
//                       {property.propertyType && (
//                         <li>
//                           <strong>Type:</strong> {property.propertyType}
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
//                           {property.buildingSize} sq ft
//                         </li>
//                       )}
//                       {property.landSize && (
//                         <li>
//                           <strong>Land Size:</strong> {property.landSize} sq ft
//                         </li>
//                       )}
//                     </ul>
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
//                       property.interiorFeatures.length > 0 ? (
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
//                       property.exteriorFeatures.length > 0 ? (
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
//                 </div>
//                 {/* End Amenities */}

//                 {/* Map Section */}
//                 <div
//                   className="property-map"
//                   data-aos="fade-up"
//                   data-aos-delay="500"
//                 >
//                                       <h3>Address</h3>
//                     <p>
//                       {property.address && (
//                         <>
//                           {property.address}
//                           <br />
//                         </>
//                       )}
//                       {property.city && <>{property.city}, </>}
//                       {/* {property.state && <>{property.state} </>}
//                       {property.zipCode && <>{property.zipCode}</>} */}
//                     </p>


//                   {/* <h3>Location</h3>
//                   <div className="map-container">
//                     <iframe
//                       src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.2219901290355!2d-74.00369368400567!3d40.71312937933185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQyJzQ3LjMiTiA3NMKwMDAnMTMuMyJX!5e0!3m2!1sen!2sus!4v1616153169789!5m2!1sen!2sus`}
//                       width="100%"
//                       height="400"
//                       style={{ border: 0 }}
//                       allowFullScreen
//                       loading="lazy"
//                     ></iframe>
//                   </div>
//                   <div className="location-details">
//                     <h4>Address</h4>
//                     <p>
//                       {property.address && (
//                         <>
//                           {property.address}
//                           <br />
//                         </>
//                       )}
//                       {property.city && <>{property.city}, </>}
//                     </p>
//                   </div> */}
//                 </div>
//                 {/* End Map Section */}
//               </div>

//               <div className="col-lg-4" style={{ zIndex: 1 }}>
//                 {/* Property Overview */}
//                 <div
//                   className="property-overview sticky-top"
//                   data-aos="fade-up"
//                   data-aos-delay="200"
//                 >
//                   <div className="price-tag">{getDisplayPrice()}</div>
//                   <div
//                     className={`property-status ${getStatusText()
//                       .toLowerCase()
//                       .replace(" ", "-")}`}
//                   >
//                     {getStatusText()}
//                   </div>

//                   <div className="property-address">
//                     <h4>{property.title || "Property"}</h4>
//                     <p>
//                       {property.city && <>{property.city}, </>}
//                       {/* {property.state && <>{property.state}</>} */}
//                     </p>
//                   </div>

//                   <div className="property-stats">
//                     {property.bedrooms && (
//                       <div className="stat-item">
//                         <i className="bi bi-house"></i>
//                         <div>
//                           <span className="value">{property.bedrooms}</span>
//                           <span className="label">Bedrooms</span>
//                         </div>
//                       </div>
//                     )}

//                     {property.bathrooms && (
//                       <div className="stat-item">
//                         <i className="bi bi-droplet"></i>
//                         <div>
//                           <span className="value">{property.bathrooms}</span>
//                           <span className="label">Bathrooms</span>
//                         </div>
//                       </div>
//                     )}

//                     {property.buildingSize && (
//                       <div className="stat-item">
//                         <i className="bi bi-rulers"></i>
//                         <div>
//                           <span className="value">
//                             {property.buildingSize.toLocaleString()}
//                           </span>
//                           <span className="label">Sq Ft</span>
//                         </div>
//                       </div>
//                     )}

//                     {property.landSize && (
//                       <div className="stat-item">
//                         <i className="bi bi-tree"></i>
//                         <div>
//                           <span className="value">
//                             {(property.landSize / 43560).toFixed(2)}
//                           </span>
//                           <span className="label">Acre Lot</span>
//                         </div>
//                       </div>
//                     )}

//                     {property.yearBuilt && (
//                       <div className="stat-item">
//                         <i className="bi bi-calendar"></i>
//                         <div>
//                           <span className="value">{property.yearBuilt}</span>
//                           <span className="label">Year Built</span>
//                         </div>
//                       </div>
//                     )}

//                     {property.garage && (
//                       <div className="stat-item">
//                         <i className="bi bi-car-front"></i>
//                         <div>
//                           <span className="value">{property.garage}</span>
//                           <span className="label">Garage</span>
//                         </div>
//                       </div>
//                     )}
//                   </div>

//                   {/* Agent Info */}
//                   {property.showAgent == true && (
//                     <div className="agent-info">
//                       <div className="agent-avatar">
//                         <Image
//                           src="/img/real-estate/agent-3.webp"
//                           alt="Agent"
//                           className="img-fluid"
//                           width={0}
//                           height={0}
//                           unoptimized
//                         />
//                       </div>
//                       <div className="agent-details">
//                         <h4>{property.agent?.name || "Sarah Johnson"}</h4>
//                         <p className="agent-title">
//                           Licensed Real Estate Agent
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

//                   {/* End Agent Info */}

//                   {/* Contact Form */}
//                   <div className="contact-form">
//                     <h4>Schedule a Tour</h4>
//                     <form
//                       action="forms/contact.php"
//                       method="post"
//                       className="php-email-form"
//                     >
//                       <div className="row">
//                         <div className="col-12 form-group">
//                           <input
//                             type="text"
//                             name="name"
//                             className="form-control"
//                             placeholder="Your Name"
//                             required
//                           />
//                         </div>
//                         <div className="col-12 form-group">
//                           <input
//                             type="email"
//                             name="email"
//                             className="form-control"
//                             placeholder="Your Email"
//                             required
//                           />
//                         </div>
//                         <div className="col-12 form-group">
//                           <input
//                             type="tel"
//                             name="phone"
//                             className="form-control"
//                             placeholder="Your Phone"
//                           />
//                         </div>
//                         <div className="col-12 form-group">
//                           <input
//                             type="text"
//                             name="subject"
//                             className="form-control"
//                             placeholder="Schedule a Tour"
//                             defaultValue={`Schedule a Tour for: ${
//                               property.title || "Property"
//                             }`}
//                             readOnly
//                           />
//                         </div>
//                         <div className="col-12 form-group">
//                           <textarea
//                             className="form-control"
//                             name="message"
//                             rows={4}
//                             placeholder="Your Message"
//                           ></textarea>
//                         </div>
//                         <div className="col-12 text-center">
//                           <div className="loading">Loading</div>
//                           <div className="error-message"></div>
//                           <div className="sent-message">
//                             Your message has been sent. Thank you!
//                           </div>
//                           <button type="submit" className="btn btn-primary">
//                             Schedule Tour
//                           </button>
//                         </div>
//                       </div>
//                     </form>
//                   </div>
//                   {/* End Contact Form */}

//                   {/* Social Share */}
//                   <div className="social-share">
//                     <h5>Share This Property</h5>
//                     <div className="share-buttons">
//                       <a href="#" className="share-btn facebook">
//                         <i className="bi bi-facebook"></i>
//                       </a>
//                       <a href="#" className="share-btn twitter">
//                         <i className="bi bi-twitter"></i>
//                       </a>
//                       <a href="#" className="share-btn whatsapp">
//                         <i className="bi bi-whatsapp"></i>
//                       </a>
//                       <a href="#" className="share-btn email">
//                         <i className="bi bi-envelope"></i>
//                       </a>
//                       <a href="#" className="share-btn print">
//                         <i className="bi bi-printer"></i>
//                       </a>
//                     </div>
//                   </div>
//                   {/* End Social Share */}
//                 </div>
//                 {/* End Property Overview */}
//               </div>
//             </div>
//           </div>
//         </section>
//         {/* /Property Details Section */}
//       </main>
//     </>
//   );
// }



// app/properties/[id]/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { PropertyData } from "@/types/property";
import { useTemplateScripts } from "@/hooks/useTemplateScripts";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/supabase";
import { PropertiesRepository } from "@/lib/repositories/PropertiesRepository";
import AppLoader from "@/components/ui/AppLoader/AppLoader";
import { InternationalPhoneInput } from "@/components/ui/forms/InternationalPhoneInput";
import { openWhatsApp } from "@/src/utils/whatsapp";

// Loading component
function LoadingSpinner() {
  return (
    <div className="d-flex justify-content-center" style={{ height: "100vh", alignItems: "center" }}>
      <div className="loading-container text-center py-5">
        {/* <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div> */}
        <AppLoader />
        <p className="mt-3">Loading property details...</p>
      </div>
    </div>
  );
}

// Not Found component
function PropertyNotFound() {
  return (
    <div className="container py-5 text-center">
      <div className="row d-flex justify-content-center" style={{ height: "100vh", alignItems: "center" }}>
        <div className="col-lg-6">
          <div className="alert alert-warning" role="alert">
            <h4 className="alert-heading">Property Not Found</h4>
            <p>
              The property you&#39;re looking for doesn&#39;t exist or has been
              removed.
            </p>
            <hr />
            <p className="mb-0">
              <Link href="/properties" className="btn btn-primary">
                Browse Properties
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// const BUSINESS_WHATSAPP_NUMBER = "+96170118770"; // Replace with your business WhatsApp number in international format
const BUSINESS_WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;


export default function PropertyPage() {
  const params = useParams();
  const [property, setProperty] = useState<PropertyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  const propertiesRepo = new PropertiesRepository();
  const [phone, setPhone] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useTemplateScripts();

  useEffect(() => {
    async function fetchProperty() {
      try {
        setLoading(true);
        setError(null);

        // Get the id from params
        const id = params?.id as string;
        if (!id) {
          setError("Invalid property ID");
          return;
        }

        // Fetch property using Supabase repository
        const data = await propertiesRepo.getById(id);

        if (!data) {
          setError("Property not found");
          setProperty(null);
          return;
        }

        // Check if property is published (unless admin preview)
        if (!data.published && !data.draft) {
          setError("Property is not available");
          setProperty(null);
          return;
        }

        setProperty(data);

      } catch (err) {
        console.error("Error fetching property:", err);
        setError("Failed to load property details");
      } finally {
        setLoading(false);
      }
    }

    fetchProperty();
  }, [params?.id]);

  // Initialize image gallery when property loads
  useEffect(() => {
    if (!property || !property.images || property.images.length === 0) {
      return;
    }

    const timer = setTimeout(() => {
      initImageGallery();
    }, 500);

    return () => {
      clearTimeout(timer);
      if (driftInstanceRef.current) {
        driftInstanceRef.current.destroy();
        driftInstanceRef.current = null;
      }
    };
  }, [property]);

  const driftInstanceRef = useRef(null);

  function initImageGallery() {
    const thumbnailItems = document.querySelectorAll(".thumbnail-item");
    const mainImage = document.getElementById("main-product-image");
    const prevBtn = document.querySelector(".prev-image");
    const nextBtn = document.querySelector(".next-image");

    if (!thumbnailItems.length || !mainImage) return;

    let currentIndex = 0;

    const updateMainImage = (index: number) => {
      const thumbnail = thumbnailItems[index];
      if (!thumbnail) return;

      const imageUrl = thumbnail.getAttribute("data-image");
      if (mainImage && imageUrl) {
        (mainImage as HTMLImageElement).src = imageUrl;
        mainImage.setAttribute("data-zoom", imageUrl);

        thumbnailItems.forEach((item) => item.classList.remove("active"));
        thumbnail.classList.add("active");
        currentIndex = index;

        if (driftInstanceRef.current) {
          setTimeout(() => {
            if (driftInstanceRef.current) {
              (driftInstanceRef.current as any).setZoomImageURL(imageUrl);
            }
          }, 50);
        }
      }
    };

    // Initialize Drift zoom
    if (
      typeof window !== 'undefined' &&
      (window as any).Drift &&
      mainImage &&
      !driftInstanceRef.current
    ) {
      driftInstanceRef.current = new (window as any).Drift(mainImage, {
        paneContainer: document.querySelector(".image-zoom-container"),
        zoomFactor: 2.5,
        hoverBoundingBox: false,
        injectBaseStyles: true,
        containInline: true,
        touchDelay: 0,
      });
    }

    // Add event listeners
    thumbnailItems.forEach((thumbnail, index) => {
      thumbnail.addEventListener("click", () => updateMainImage(index));
    });

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        const newIndex =
          currentIndex > 0 ? currentIndex - 1 : thumbnailItems.length - 1;
        updateMainImage(newIndex);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        const newIndex =
          currentIndex < thumbnailItems.length - 1 ? currentIndex + 1 : 0;
        updateMainImage(newIndex);
      });
    }

    // Set first image as active
    if (thumbnailItems.length > 0) {
      thumbnailItems[0].classList.add("active");
    }
  }

  const handleTourRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!property) return;

    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !phone.trim()) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Save to database
      const { error } = await supabase
        .from('tour_requests')
        .insert({
          property_id: property.id,
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: phone.trim(),
          message: formData.message.trim() || null,
        });

      if (error) {
        throw error;
      }

      // Prepare WhatsApp message
      const propertyStatus = property.status.length > 0 ? property.status[0] : "Available";
      const message = `Hello
I'd like to schedule a tour for this property.

Property: ${property.title || "Property"} - ${propertyStatus}
Link: ${typeof window !== "undefined" ? window.location.href : ""}

Could you please let me know available dates and times? Thank you.`;

      // Redirect to WhatsApp
      const whatsappUrl = `https://wa.me/${BUSINESS_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

      // Reset form
      setFormData({ name: "", email: "", message: "" });
      setPhone("");

    } catch (error) {
      console.error("Error submitting tour request:", error);
      alert("Failed to submit tour request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state
  if (loading) {
    return <LoadingSpinner />;
  }

  // Show not found state
  if (error || !property) {
    return <PropertyNotFound />;
  }

  // Format price with commas
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Get display price based on status
  const getDisplayPrice = () => {
    if (property.status?.includes("For Sale") && property.salePrice) {
      return formatPrice(property.salePrice);
    }
    if (property.status?.includes("For Rent") && property.rentPrice) {
      return formatPrice(property.rentPrice) + "/month";
    }
    if (property.status?.includes("Sold")) {
      return "Sold";
    }
    return "Price on request";
  };

  // Get status text
  const getStatusText = () => {
    if (property.status?.includes("For Sale")) return "For Sale";
    if (property.status?.includes("For Rent")) return "For Rent";
    if (property.status?.includes("Sold")) return "Sold";
    return "Available";
  };

  // Format size display
  const formatSizeDisplay = (size?: number, unit?: string) => {
    if (!size) return "";
    return `${size.toLocaleString()} ${unit || "m²"}`;
  };

  // Calculate acreage from square meters/feet
  const calculateAcreage = (landSize?: number, sizeUnit?: string) => {
    if (!landSize) return "";

    let acres = 0;
    if (sizeUnit === 'm2' || sizeUnit === 'sqm') {
      acres = landSize / 4046.86; // square meters to acres
    } else if (sizeUnit === 'ft2' || sizeUnit === 'sqft') {
      acres = landSize / 43560; // square feet to acres
    } else if (sizeUnit === 'acre') {
      acres = landSize;
    } else if (sizeUnit === 'hectare') {
      acres = landSize * 2.47105; // hectares to acres
    }

    return acres.toFixed(2);
  };

  return (
    <>
      <main className="main">
        {/* Page Title */}
        <div className="page-title">
          <div className="heading">
            <div className="container">
              <div className="row d-flex justify-content-center text-center">
                <div className="col-lg-8">
                  <h1 className="heading-title">
                    {property.title || "Property Details"}
                  </h1>
                  <p className="mb-0">
                    {property.description?.substring(0, 200) ||
                      "Odio et unde deleniti. Deserunt numquam exercitationem. Officiis quo odio sint voluptas consequatur ut a odio voluptatem."}
                    {property.description && property.description.length > 200
                      ? "..."
                      : ""}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <nav className="breadcrumbs">
            <div className="container">
              <ol>
                <li>
                  <Link href="/">Home</Link>
                </li>
                <li>
                  <Link href="/properties">Properties</Link>
                </li>
                <li className="current">
                  {property.title || "Property Details"}
                </li>
              </ol>
            </div>
          </nav>
        </div>
        {/* End Page Title */}

        {/* Property Details Section */}
        <section id="property-details" className="property-details section">
          <div className="container" data-aos="fade-up" data-aos-delay="100">
            <div className="row gy-4">
              <div className="col-lg-8">
                {/* Property Gallery */}
                <div
                  className="property-gallery"
                  data-aos="fade-up"
                  data-aos-delay="200"
                >
                  <div className="main-image-container image-zoom-container">
                    <Image
                      id="main-product-image"
                      src={
                        property.images?.[0] ||
                        "/img/real-estate/property-exterior-3.webp"
                      }
                      alt={property.title || "Property"}
                      className="img-fluid main-property-image"
                      data-zoom={
                        property.images?.[0] ||
                        "/img/real-estate/property-exterior-3.webp"
                      }
                      width={0}
                      height={0}
                      unoptimized
                      style={{
                        width: "100%",
                        height: "auto",
                        objectFit: "cover",
                      }}
                    />
                    <div className="image-nav-buttons">
                      <button
                        className="image-nav-btn prev-image"
                        type="button"
                      >
                        <i className="bi bi-chevron-left"></i>
                      </button>
                      <button
                        className="image-nav-btn next-image"
                        type="button"
                      >
                        <i className="bi bi-chevron-right"></i>
                      </button>
                    </div>
                  </div>

                  {/* Thumbnail Gallery */}
                  {property.images && property.images.length > 0 ? (
                    <div className="thumbnail-gallery thumbnail-list">
                      {property.images.map((image, index) => (
                        <div
                          key={index}
                          className={`thumbnail-item ${index === 0 ? "active" : ""
                            }`}
                          data-image={image}
                        >
                          <Image
                            src={image}
                            alt={`${property.title} - Image ${index + 1}`}
                            className="img-fluid"
                            width={0}
                            height={0}
                            unoptimized
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="thumbnail-gallery thumbnail-list">
                      <div
                        className="thumbnail-item active"
                        data-image="/img/real-estate/property-exterior-3.webp"
                      >
                        <Image
                          src="/img/real-estate/property-exterior-3.webp"
                          alt="Property Exterior"
                          className="img-fluid"
                          width={0}
                          height={0}
                          unoptimized
                        />
                      </div>
                    </div>
                  )}
                </div>
                {/* End Property Gallery */}

                {/* Property Description */}
                <div
                  className="property-description"
                  data-aos="fade-up"
                  data-aos-delay="300"
                >
                  <h3>About This Property</h3>
                  <p>
                    {property.description ||
                      "No description available for this property."}
                  </p>

                  {/* Additional details */}
                  <div className="mt-4">
                    <h5>Property Details</h5>
                    <ul className="list-unstyled">
                      {property.propertyType && (
                        <li>
                          <strong>Type:</strong>{" "}
                          {property.propertyType.charAt(0).toUpperCase() +
                            property.propertyType.slice(1)}
                        </li>
                      )}
                      {property.yearBuilt && (
                        <li>
                          <strong>Year Built:</strong> {property.yearBuilt}
                        </li>
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
                        <li>
                          <strong>Zoning:</strong> {property.zoning}
                        </li>
                      )}
                    </ul>

                    {/* Utilities */}
                    {property.utilities && (
                      <div className="mt-3">
                        <strong>Utilities:</strong>
                        <div className="d-flex flex-wrap gap-2 mt-2">
                          {property.utilities.water && (
                            <span className="badge bg-info">Water</span>
                          )}
                          {property.utilities.electricity && (
                            <span className="badge bg-info">Electricity</span>
                          )}
                          {property.utilities.sewage && (
                            <span className="badge bg-info">Sewage</span>
                          )}
                          {property.utilities.roadAccess && (
                            <span className="badge bg-info">Road Access</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {/* End Property Description */}

                {/* Amenities */}
                <div
                  className="property-amenities"
                  data-aos="fade-up"
                  data-aos-delay="400"
                >
                  <h3>Amenities & Features</h3>
                  <div className="row">
                    {/* Interior Features */}
                    <div className="col-md-6">
                      <h4>Interior Features</h4>
                      {property.interiorFeatures &&
                        property.interiorFeatures.length > 0 ? (
                        <ul className="features-list">
                          {property.interiorFeatures.map((feature, index) => (
                            <li key={index}>
                              <i className="bi bi-check-circle"></i>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-muted">
                          No interior features listed.
                        </p>
                      )}
                    </div>

                    {/* Exterior Features */}
                    <div className="col-md-6">
                      <h4>Exterior Features</h4>
                      {property.exteriorFeatures &&
                        property.exteriorFeatures.length > 0 ? (
                        <ul className="features-list">
                          {property.exteriorFeatures.map((feature, index) => (
                            <li key={index}>
                              <i className="bi bi-check-circle"></i>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-muted">
                          No exterior features listed.
                        </p>
                      )}
                    </div>

                    {/* Custom Features */}
                    {property.customFeatures &&
                      property.customFeatures.length > 0 && (
                        <div className="col-12 mt-4">
                          <h4>Additional Features</h4>
                          <ul className="features-list">
                            {property.customFeatures.map((feature, index) => (
                              <li key={index}>
                                <i className="bi bi-check-circle"></i>
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </div>

                  {/* Property Labels */}
                  <div className="mt-4">
                    <h4>Property Labels</h4>
                    <div className="d-flex flex-wrap gap-2">
                      {property.hot && (
                        <span className="badge bg-danger">
                          <i className="bi bi-fire me-1"></i>Hot Property
                        </span>
                      )}
                      {property.newListing && (
                        <span className="badge bg-success">
                          <i className="bi bi-star me-1"></i>New Listing
                        </span>
                      )}
                      {property.featured && (
                        <span className="badge bg-warning text-dark">
                          <i className="bi bi-gem me-1"></i>Featured
                        </span>
                      )}
                      {property.exclusive && (
                        <span className="badge bg-primary">
                          <i className="bi bi-shield-lock me-1"></i>Exclusive
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {/* End Amenities */}

                {/* Address Section */}
                <div
                  className="property-map"
                  data-aos="fade-up"
                  data-aos-delay="500"
                >
                  <h3>Address</h3>
                  <p>
                    {property.showAddress && property.address ? (
                      <>
                        {property.address}
                        <br />
                        {property.city && <>{property.city}</>}
                      </>
                    ) : (
                      <>
                        {property.address}
                        <br />
                        {property.city && <>{property.city}</>}
                        {/* <span className="text-muted">
                          <i className="bi bi-eye-slash me-1"></i>
                          Exact address hidden for privacy
                        </span> */}
                      </>
                    )}
                  </p>
                </div>
                {/* End Address Section */}
              </div>

              <div className="col-lg-4" style={{ zIndex: 1 }}>
                {/* Property Overview */}
                <div
                  className="property-overview sticky-top"
                  data-aos="fade-up"
                  data-aos-delay="200"
                >
                  <div className="price-tag">{getDisplayPrice()}</div>
                  <div
                    className={`property-status ${getStatusText()
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    {getStatusText()}
                  </div>

                  <div className="property-address">
                    <h4>{property.title || "Property"}</h4>
                    <p>
                      {property.city && <>{property.city}</>}
                    </p>
                  </div>

                  <div className="property-stats">
                    {property.bedrooms !== null &&
                      property.bedrooms !== undefined &&
                      property.bedrooms !== undefined && (
                        <div className="stat-item">
                          <i className="bi bi-house"></i>
                          <div>
                            <span className="value">{property.bedrooms}</span>
                            <span className="label">Bedrooms</span>
                          </div>
                        </div>
                      )}

                    {property.bathrooms !== null &&
                      property.bathrooms !== undefined &&
                      property.bathrooms !== undefined && (
                        <div className="stat-item">
                          <i className="bi bi-droplet"></i>
                          <div>
                            <span className="value">{property.bathrooms}</span>
                            <span className="label">Bathrooms</span>
                          </div>
                        </div>
                      )}

                    {property.buildingSize !== null &&
                      property.buildingSize !== undefined &&
                      property.buildingSize !== undefined && (
                        <div className="stat-item">
                          <i className="bi bi-rulers"></i>
                          <div>
                            <span className="value">
                              {property.buildingSize.toLocaleString()}
                            </span>
                            <span className="label">{property.sizeUnit || "m²"}</span>
                          </div>
                        </div>
                      )}

                    {property.landSize !== null &&
                      property.landSize !== undefined &&
                      property.landSize !== undefined && (
                        <div className="stat-item">
                          <i className="bi bi-tree"></i>
                          <div>
                            <span className="value">
                              {/* {calculateAcreage(property.landSize, property.sizeUnit)} */}
                              {property.landSize}
                            </span>
                            {/* <span className="label">Acres</span> */}
                            <span className="label">{property.sizeUnit || "m²"}</span>
                          </div>
                        </div>
                      )}

                    {property.yearBuilt !== null &&
                      property.yearBuilt !== undefined &&
                      property.yearBuilt !== undefined && (
                        <div className="stat-item">
                          <i className="bi bi-calendar"></i>
                          <div>
                            <span className="value">{property.yearBuilt}</span>
                            <span className="label">Year Built</span>
                          </div>
                        </div>
                      )}

                    {property.garage !== null &&
                      property.garage !== undefined &&
                      property.garage !== undefined && (
                        <div className="stat-item">
                          <i className="bi bi-car-front"></i>
                          <div>
                            <span className="value">{property.garage}</span>
                            <span className="label">Garage</span>
                          </div>
                        </div>
                      )}
                  </div>


                  {/* Agent Info */}
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
                        <p className="agent-title">
                          {property.agent?.title || "Licensed Real Estate Agent"}
                        </p>
                        <p className="agent-phone">
                          <i className="bi bi-telephone"></i>
                          {property.agent?.phone || "+1 (555) 123-4567"}
                        </p>
                        <p className="agent-email">
                          <i className="bi bi-envelope"></i>
                          {property.agent?.email || "sarah@example.com"}
                        </p>
                      </div>
                    </div>
                  )}


                  {/* New Inquire Now Button */}
                  {/* <div className="inquire-button mb-4">
  <a
    href={`https://wa.me/${BUSINESS_WHATSAPP_NUMBER}?text=${encodeURIComponent(
      `Hi, I'm interested in ${property.status?.includes("For Sale") ? "buying" : "renting"} this property: "${property.title || "Property"}". ${typeof window !== "undefined" ? window.location.href : ""}. Can you provide more details or help me proceed?`
    )}`}
    target="_blank"
    rel="noopener noreferrer"
    className="btn btn-success btn-lg w-100"
    aria-label="Inquire about this property on WhatsApp"
  >
    <i className="bi bi-whatsapp me-2"></i>
    {property.status?.includes("For Sale") ? "Buy Now" : property.status?.includes("For Rent") ? "Rent Now" : "Inquire Now"}
  </a>
</div> */}
                  {/* New Inquire Now Button */}
                  <div className="inquire-button mb-4">
                    <a
                      style={{ "background": "var(--accent-color)" }}
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        const message = `Hi, I'm interested in ${property.status?.includes("For Sale") ? "buying" : "renting"} this property: "${property.title || "Property"}". ${typeof window !== "undefined" ? window.location.href : ""}. Can you provide more details or help me proceed?`;
                        // const whatsappUrl = `https://wa.me/${BUSINESS_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
                        // window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
                        openWhatsApp(message);
                      }}
                      className="btn custom-button btn-lg w-100"
                      aria-label="Inquire about this property on WhatsApp"
                    >
                      <i className="bi bi-whatsapp me-2"></i>
                      {property.status?.includes("For Sale") ? "Buy Now" : property.status?.includes("For Rent") ? "Rent Now" : "Inquire Now"}
                    </a>
                  </div>

                  {/* Contact Form */}
                  <div className="contact-form">
                    <h4>Schedule a Tour</h4>
                    <form
                      onSubmit={handleTourRequestSubmit}
                      className="php-email-form"
                    >
                      <div className="row">
                        <div className="col-12 form-group">
                          <input
                            type="text"
                            name="name"
                            className="form-control"
                            placeholder="Your Name"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
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
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
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
                        {/* <div className="col-12 form-group">
                          <input
                            type="tel"
                            name="phone"
                            className="form-control"
                            placeholder="Your Phone"
                          />
                        </div> */}
                        <div className="col-12 form-group">
                          <input
                            type="text"
                            name="subject"
                            className="form-control"
                            placeholder="Schedule a Tour"
                            defaultValue={`Schedule a Tour for: ${property.title || "Property"
                              }`}
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
                            onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                          ></textarea>
                        </div>
                        <div className="col-12 text-center">
                          <div className="loading" style={{ display: isSubmitting ? 'block' : 'none' }}>Loading</div>
                          <div className="error-message"></div>
                          <div className="sent-message">
                            Your message has been sent. Thank you!
                          </div>
                          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Schedule Tour'}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                  {/* End Contact Form */}

                  {/* Social Share */}
                  {/* <div className="social-share">
                    <h5>Share This Property</h5>
                    <div className="share-buttons">
                      <a href="#" className="share-btn facebook">
                        <i className="bi bi-facebook"></i>
                      </a>
                      <a href="#" className="share-btn twitter">
                        <i className="bi bi-twitter"></i>
                      </a>
                      <a href="#" className="share-btn whatsapp">
                        <i className="bi bi-whatsapp"></i>
                      </a>
                      <a href="#" className="share-btn email">
                        <i className="bi bi-envelope"></i>
                      </a>
                      <a href="#" className="share-btn print">
                        <i className="bi bi-printer"></i>
                      </a>
                    </div>
                  </div> */}
                  <div className="social-share">
                    <h5>Share This Property</h5>

                    <div className="share-buttons">
                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                          typeof window !== "undefined" ? window.location.href : ""
                        )}`}
                        target="_blank"
                        rel="noopener"
                        className="share-btn facebook"
                        aria-label="Share on Facebook"
                      >
                        <i className="bi bi-facebook"></i>
                      </a>

                      <a
                        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                          typeof window !== "undefined" ? window.location.href : ""
                        )}`}
                        target="_blank"
                        rel="noopener"
                        className="share-btn twitter"
                        aria-label="Share on X"
                      >
                        <i className="bi bi-twitter"></i>
                      </a>

                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(
                          typeof window !== "undefined" ? window.location.href : ""
                        )}`}
                        target="_blank"
                        rel="noopener"
                        className="share-btn whatsapp"
                        aria-label="Share on WhatsApp"
                      >
                        <i className="bi bi-whatsapp"></i>
                      </a>
                    </div>
                  </div>

                  {/* End Social Share */}
                </div>
                {/* End Property Overview */}
              </div>
            </div>
          </div>
        </section>
        {/* /Property Details Section */}
      </main>
    </>
  );
}






// "use client";

// import PropertyCard from "@/components/ui/PropertyCard";
// import Script from "next/script";
// // import PropertyCardDetailed from "@/app/components/ui/PropertyCardDetailed";

// import { useTemplateScripts } from '@/hooks/useTemplateScripts';

// // Example: fetch from Firebase or any API
// async function getProperty(id: string) {
//   // Your fetching logic here
// }

// // export default async function PropertyPage({ params }: { params: { id: string } }) {
// //   const property = await getProperty(params.id);

// // export default async function PropertyPage(
// export default function PropertyPage(
//   props: { params: Promise<{ id: string }> }
// ) {
//   // const { id } = await props.params;

//   // const property = await getProperty(id);

//  useTemplateScripts();

//   return (
//     <>

//     <main className="main">

//       {/* <!-- Page Title --> */}
//       <div className="page-title">
//         <div className="heading">
//           <div className="container">
//             <div className="row d-flex justify-content-center text-center">
//               <div className="col-lg-8">
//                 <h1 className="heading-title">Property Details</h1>
//                 <p className="mb-0">
//                   Odio et unde deleniti. Deserunt numquam exercitationem. Officiis quo
//                   odio sint voluptas consequatur ut a odio voluptatem. Sit dolorum
//                   debitis veritatis natus dolores. Quasi ratione sint. Sit quaerat
//                   ipsum dolorem.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//         <nav className="breadcrumbs">
//           <div className="container">
//             <ol>
//               <li><a href="index.html">Home</a></li>
//               <li className="current">Property Details</li>
//             </ol>
//           </div>
//         </nav>
//       </div>
//       {/* End Page Title --> */}

//       {/* Property Details Section --> */}
//       <section id="property-details" className="property-details section">

//         <div className="container" data-aos="fade-up" data-aos-delay="100">

//           <div className="row gy-4">

//             <div className="col-lg-8">

//               {/* Property Gallery --> */}
//               <div className="property-gallery" data-aos="fade-up" data-aos-delay="200">
//                 <div className="main-image-container image-zoom-container">
//                   <img id="main-product-image" src="/img/real-estate/property-exterior-3.webp" alt="Property Exterior" className="img-fluid main-property-image" data-zoom="/img/real-estate/property-exterior-3.webp" />
//                   <div className="image-nav-buttons">
//                     <button className="image-nav-btn prev-image" type="button">
//                       <i className="bi bi-chevron-left"></i>
//                     </button>
//                     <button className="image-nav-btn next-image" type="button">
//                       <i className="bi bi-chevron-right"></i>
//                     </button>
//                   </div>
//                 </div>
//                 <div className="thumbnail-gallery thumbnail-list">
//                   <div className="thumbnail-item active" data-image="/img/real-estate/property-exterior-3.webp">
//                     <img src="/img/real-estate/property-exterior-3.webp" alt="Property Exterior" className="img-fluid" />
//                   </div>
//                   <div className="thumbnail-item" data-image="/img/real-estate/property-interior-1.webp">
//                     <img src="/img/real-estate/property-interior-1.webp" alt="Living Room" className="img-fluid" />
//                   </div>
//                   <div className="thumbnail-item" data-image="/img/real-estate/property-interior-2.webp">
//                     <img src="/img/real-estate/property-interior-2.webp" alt="Kitchen" className="img-fluid" />
//                   </div>
//                   <div className="thumbnail-item" data-image="/img/real-estate/property-interior-3.webp">
//                     <img src="/img/real-estate/property-interior-3.webp" alt="Master Bedroom" className="img-fluid" />
//                   </div>
//                   <div className="thumbnail-item" data-image="/img/real-estate/property-exterior-4.webp">
//                     <img src="/img/real-estate/property-exterior-4.webp" alt="Garden View" className="img-fluid" />
//                   </div>
//                   <div className="thumbnail-item" data-image="/img/real-estate/property-interior-4.webp">
//                     <img src="/img/real-estate/property-interior-4.webp" alt="Bathroom" className="img-fluid" />
//                   </div>
//                   <div className="thumbnail-item" data-image="/img/real-estate/property-interior-5.webp">
//                     <img src="/img/real-estate/property-interior-5.webp" alt="Dining Room" className="img-fluid" />
//                   </div>
//                   <div className="thumbnail-item" data-image="/img/real-estate/property-exterior-5.webp">
//                     <img src="/img/real-estate/property-exterior-5.webp" alt="Front View" className="img-fluid" />
//                   </div>
//                   <div className="thumbnail-item" data-image="/img/real-estate/property-interior-6.webp">
//                     <img src="/img/real-estate/property-interior-6.webp" alt="Guest Room" className="img-fluid" />
//                   </div>
//                   <div className="thumbnail-item" data-image="/img/real-estate/property-interior-7.webp">
//                     <img src="/img/real-estate/property-interior-7.webp" alt="Office Space" className="img-fluid" />
//                   </div>
//                   <div className="thumbnail-item" data-image="/img/real-estate/property-exterior-6.webp">
//                     <img src="/img/real-estate/property-exterior-6.webp" alt="Side View" className="img-fluid" />
//                   </div>
//                   <div className="thumbnail-item" data-image="/img/real-estate/property-interior-8.webp">
//                     <img src="/img/real-estate/property-interior-8.webp" alt="Balcony" className="img-fluid" />
//                   </div>
//                 </div>
//               </div>
//               {/* End Property Gallery --> */}

//               {/* Property Description --> */}
//               <div className="property-description" data-aos="fade-up" data-aos-delay="300">
//                 <h3>About This Property</h3>
//                 <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
//                 <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.</p>
//                 <p>Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.</p>
//               </div>
//               {/* End Property Description --> */}

//               {/* Amenities --> */}
//               <div className="property-amenities" data-aos="fade-up" data-aos-delay="400">
//                 <h3>Amenities &amp; Features</h3>
//                 <div className="row">
//                   <div className="col-md-6">
//                     <h4>Interior Features</h4>
//                     <ul className="features-list">
//                       <li><i className="bi bi-check-circle"></i>Hardwood Floors</li>
//                       <li><i className="bi bi-check-circle"></i>Updated Kitchen</li>
//                       <li><i className="bi bi-check-circle"></i>Walk-in Closets</li>
//                       <li><i className="bi bi-check-circle"></i>Central Air Conditioning</li>
//                       <li><i className="bi bi-check-circle"></i>Fireplace</li>
//                       <li><i className="bi bi-check-circle"></i>High Ceilings</li>
//                     </ul>
//                   </div>
//                   <div className="col-md-6">
//                     <h4>Exterior Features</h4>
//                     <ul className="features-list">
//                       <li><i className="bi bi-check-circle"></i>2-Car Garage</li>
//                       <li><i className="bi bi-check-circle"></i>Swimming Pool</li>
//                       <li><i className="bi bi-check-circle"></i>Garden</li>
//                       <li><i className="bi bi-check-circle"></i>Patio/Deck</li>
//                       <li><i className="bi bi-check-circle"></i>Security System</li>
//                       <li><i className="bi bi-check-circle"></i>Sprinkler System</li>
//                     </ul>
//                   </div>
//                 </div>
//               </div>
//               {/* End Amenities --> */}

//               {/* Map Section --> */}
//               <div className="property-map" data-aos="fade-up" data-aos-delay="500">
//                 <h3>Location</h3>
//                 <div className="map-container">
//                   <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2965.0824050173574!2d-87.63000000000002!3d41.88844360000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x880e2c3cd0f4cbed%3A0xafe0a6ad09c0c000!2sChicago%2C%20IL%2C%20USA!5e0!3m2!1sen!2sus!4v1234567890123" width="100%" height="400" style={{ "border": 0 }} allowFullScreen loading="lazy"></iframe>
//                 </div>
//                 <div className="location-details">
//                   <h4>Neighborhood Information</h4>
//                   <p>Located in the heart of downtown, this property offers easy access to shopping, dining, and entertainment. Public transportation and major highways are just minutes away.</p>
//                 </div>
//               </div>
//               {/* End Map Section --> */}

//             </div>

//             <div className="col-lg-4">

//               {/* Property Overview --> */}
//               <div className="property-overview sticky-top" data-aos="fade-up" data-aos-delay="200">
//                 <div className="price-tag">$875,000</div>
//                 <div className="property-status">For Sale</div>

//                 <div className="property-address">
//                   <h4>1234 Maple Street</h4>
//                   <p>Chicago, IL 60601</p>
//                 </div>

//                 <div className="property-stats">
//                   <div className="stat-item">
//                     <i className="bi bi-house"></i>
//                     <div>
//                       <span className="value">4</span>
//                       <span className="label">Bedrooms</span>
//                     </div>
//                   </div>
//                   <div className="stat-item">
//                     <i className="bi bi-droplet"></i>
//                     <div>
//                       <span className="value">3</span>
//                       <span className="label">Bathrooms</span>
//                     </div>
//                   </div>
//                   <div className="stat-item">
//                     <i className="bi bi-rulers"></i>
//                     <div>
//                       <span className="value">2,450</span>
//                       <span className="label">Sq Ft</span>
//                     </div>
//                   </div>
//                   <div className="stat-item">
//                     <i className="bi bi-tree"></i>
//                     <div>
//                       <span className="value">0.25</span>
//                       <span className="label">Acre Lot</span>
//                     </div>
//                   </div>
//                   <div className="stat-item">
//                     <i className="bi bi-calendar"></i>
//                     <div>
//                       <span className="value">2018</span>
//                       <span className="label">Year Built</span>
//                     </div>
//                   </div>
//                   <div className="stat-item">
//                     <i className="bi bi-car-front"></i>
//                     <div>
//                       <span className="value">2</span>
//                       <span className="label">Garage</span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Agent Info --> */}
//                 <div className="agent-info">
//                   <div className="agent-avatar">
//                     <img src="/img/real-estate/agent-3.webp" alt="Sarah Johnson" className="img-fluid" />
//                   </div>
//                   <div className="agent-details">
//                     <h4>Sarah Johnson</h4>
//                     <p className="agent-title">Licensed Real Estate Agent</p>
//                     <p className="agent-phone"><i className="bi bi-telephone"></i>+1 (555) 123-4567</p>
//                     <p className="agent-email"><i className="bi bi-envelope"></i>sarah@example.com</p>
//                   </div>
//                 </div>
//                 {/* <!-- End Agent Info --> */}

//                 {/* <!-- Contact Form --> */}
//                 <div className="contact-form">
//                   <h4>Schedule a Tour</h4>
//                   <form action="forms/contact.php" method="post" className="php-email-form">
//                     <div className="row">
//                       <div className="col-12 form-group">
//                         <input type="text" name="name" className="form-control" placeholder="Your Name" required />
//                       </div>
//                       <div className="col-12 form-group">
//                         <input type="email" name="email" className="form-control" placeholder="Your Email" required />
//                       </div>
//                       <div className="col-12 form-group">
//                         <input type="tel" name="phone" className="form-control" placeholder="Your Phone" />
//                       </div>

//                       <div className="col-12 form-group">
//                         <input type="text" name="subject" className="form-control" placeholder="Schedule a Tour for date: " value="Schedule a Tour for date: " readOnly />
//                       </div>

//                       <div className="col-12 form-group">
//                         <textarea className="form-control" name="message" rows={4} placeholder="Your Message"></textarea>
//                       </div>
//                       <div className="col-12 text-center">
//                         <div className="loading">Loading</div>
//                         <div className="error-message"></div>
//                         <div className="sent-message">Your message has been sent. Thank you!</div>
//                         <button type="submit" className="btn btn-primary">Schedule Tour</button>
//                       </div>
//                     </div>
//                   </form>
//                 </div>
//                 {/* <!-- End Contact Form --> */}

//                 {/* <!-- Social Share --> */}
//                 <div className="social-share">
//                   <h5>Share This Property</h5>
//                   <div className="share-buttons">
//                     <a href="#" className="share-btn facebook"><i className="bi bi-facebook"></i></a>
//                     <a href="#" className="share-btn twitter"><i className="bi bi-twitter"></i></a>
//                     <a href="#" className="share-btn whatsapp"><i className="bi bi-whatsapp"></i></a>
//                     <a href="#" className="share-btn email"><i className="bi bi-envelope"></i></a>
//                     <a href="#" className="share-btn print"><i className="bi bi-printer"></i></a>
//                   </div>
//                 </div>
//                 {/* <!-- End Social Share --> */}

//               </div>
//               {/* <!-- End Property Overview --> */}

//             </div>

//           </div>

//         </div>

//       </section>
//       {/* <!-- /Property Details Section --> */}

//     </main>

//     </>
//   );
// }
