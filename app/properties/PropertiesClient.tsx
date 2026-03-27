// // app/properties/PropertiesClient.tsx
// "use client";

// import { useState, useCallback, useEffect, useRef } from "react";
// import { useProperties } from "@/hooks/useProperties";
// import { usePropertyStats } from "@/hooks/usePropertyStats";
// import PropertyCardPremium from "@/components/property/PropertyCard/PropertyCardPremium";
// import PropertyFilters from "@/components/property/PropertyFilters";
// import { PropertyFilterOptions } from '@/services/PropertyServiceSupabase';
// import Link from "next/link";
// import AppLoader from "@/components/ui/AppLoader/AppLoader";
// import PropertyCardHorizontal from "@/components/property/PropertyCard/PropertyCardHorizontal";
// import { useSearchParams, useRouter } from 'next/navigation';
// import "./style.css";
// import ImageGalleryModal from "@/components/modules/ImageGalleryModal";
// import LoginRequiredModal from "@/components/modules/LoginRequiredModal";


// // Helper to parse searchParams into filters
// const getFiltersFromSearchParams = (searchParams: URLSearchParams | null): PropertyFilterOptions => {
//   if (!searchParams) return { status: ["For Sale", "For Rent"] };

//   const propertyType = searchParams.get('propertyType')?.toLowerCase();
//   const searchTerm = searchParams.get('searchTerm');
//   const minSalePrice = searchParams.get('minSalePrice');
//   const maxSalePrice = searchParams.get('maxSalePrice');
//   const minBedrooms = searchParams.get('minBedrooms');
//   const minBathrooms = searchParams.get('minBathrooms');
//   const statusParam = searchParams.get("status");

//   const newFilters: PropertyFilterOptions = {};

//   // Parse status
//   if (statusParam) {
//     const validStatuses = ["For Sale", "For Rent", "Sold"] as const;
//     const parsedStatuses = statusParam
//       .split(",")
//       .map(s => s.trim())
//       .filter((s): s is typeof validStatuses[number] =>
//         validStatuses.includes(s as any)
//       );
//     if (parsedStatuses.length > 0) {
//       newFilters.status = parsedStatuses;
//     } else {
//       // Invalid values – just ignore and use default
//       newFilters.status = ["For Sale", "For Rent"];
//     }
//   } else {
//     newFilters.status = ["For Sale", "For Rent"];
//   }

//   // Parse property types
//   if (propertyType) {
//     const validPropertyTypes = ['house', 'apartment', 'villa', 'commercial', 'land'] as const;
//     const parsedTypes = propertyType
//       .split(',')
//       .map(t => t.toLowerCase().trim())
//       .filter((t): t is typeof validPropertyTypes[number] =>
//         validPropertyTypes.includes(t as any)
//       );
//     if (parsedTypes.length > 0) {
//       newFilters.propertyTypes = parsedTypes;
//     }
//   }

//   newFilters.searchTerm = searchTerm || undefined;
//   newFilters.minSalePrice = minSalePrice ? Number(minSalePrice) : undefined;
//   newFilters.maxSalePrice = maxSalePrice ? Number(maxSalePrice) : undefined;
//   newFilters.minBedrooms = minBedrooms ? Number(minBedrooms) : undefined;
//   newFilters.minBathrooms = minBathrooms ? Number(minBathrooms) : undefined;

//   return newFilters;
// };


// export default function PropertiesClient() {
//   const [filters, setFilters] = useState<PropertyFilterOptions>({});
//   const [viewType, setViewType] = useState<"grid" | "list">("grid");

//   const searchParams = useSearchParams();
//   const router = useRouter();

//   const { stats } = usePropertyStats();

//   const {
//     properties,
//     loading,
//     error,
//     total,
//     loadPage,
//     refreshWithFilters,
//     pagination,
//   } = useProperties();

//   // Refs to track initial sync and current filters
//   const hasSynced = useRef(false);
//   const currentFiltersRef = useRef(filters);

//   // Keep currentFiltersRef in sync with filters state
//   useEffect(() => {
//     currentFiltersRef.current = filters;
//   }, [filters]);


//   // Modal states
//   const [galleryOpen, setGalleryOpen] = useState(false);
//   const [galleryImages, setGalleryImages] = useState<string[]>([]);
//   const [galleryIndex, setGalleryIndex] = useState(0);
//   const [loginModalOpen, setLoginModalOpen] = useState(false);

//   // Stable callbacks to avoid re‑creating them on every render
//   const handleOpenGallery = useCallback((images: string[], index: number) => {
//     setGalleryImages(images);
//     setGalleryIndex(index);
//     setGalleryOpen(true);
//   }, []);

//   const handleCloseGallery = useCallback(() => setGalleryOpen(false), []);
//   const handleOpenLoginModal = useCallback(() => setLoginModalOpen(true), []);
//   const handleCloseLoginModal = useCallback(() => setLoginModalOpen(false), []);

//   // Sync filters from URL on mount and when searchParams change
//   // useEffect(() => {
//   //   const propertyType = searchParams?.get('propertyType')?.toLowerCase();
//   //   const searchTerm = searchParams?.get('searchTerm');
//   //   const minSalePrice = searchParams?.get('minSalePrice');
//   //   const maxSalePrice = searchParams?.get('maxSalePrice');
//   //   const minBedrooms = searchParams?.get('minBedrooms');
//   //   const minBathrooms = searchParams?.get('minBathrooms');
//   //   const statusParam = searchParams?.get("status");

//   //   const newFilters: PropertyFilterOptions = {};

//   //   // Parse status
//   //   if (statusParam) {
//   //     const validStatuses = ["For Sale", "For Rent", "Sold"] as const;
//   //     const parsedStatuses = statusParam
//   //       .split(",")
//   //       .map(s => s.trim())
//   //       .filter((s): s is typeof validStatuses[number] =>
//   //         validStatuses.includes(s as any)
//   //       );
//   //     if (parsedStatuses.length > 0) {
//   //       newFilters.status = parsedStatuses;
//   //     } else {
//   //       // Invalid values – clean URL
//   //       const newSearchParams = new URLSearchParams(searchParams || undefined);
//   //       newSearchParams.delete("status");
//   //       router.replace(`?${newSearchParams.toString()}`, { scroll: false });
//   //     }
//   //   }

//   //   // Parse property types
//   //   if (propertyType) {
//   //     const validPropertyTypes = ['house', 'apartment', 'villa', 'commercial', 'land'] as const;
//   //     const parsedTypes = propertyType
//   //       .split(',')
//   //       .map(t => t.toLowerCase().trim())
//   //       .filter((t): t is typeof validPropertyTypes[number] =>
//   //         validPropertyTypes.includes(t as any)
//   //       );
//   //     if (parsedTypes.length > 0) {
//   //       newFilters.propertyTypes = parsedTypes;
//   //     } else {
//   //       const newSearchParams = new URLSearchParams(searchParams || undefined);
//   //       newSearchParams.delete('propertyType');
//   //       router.replace(`?${newSearchParams.toString()}`, { scroll: false });
//   //     }
//   //   }

//   //   newFilters.searchTerm = searchTerm || undefined;
//   //   newFilters.minSalePrice = minSalePrice ? Number(minSalePrice) : undefined;
//   //   newFilters.maxSalePrice = maxSalePrice ? Number(maxSalePrice) : undefined;
//   //   newFilters.minBedrooms = minBedrooms ? Number(minBedrooms) : undefined;
//   //   newFilters.minBathrooms = minBathrooms ? Number(minBathrooms) : undefined;

//   //   // Only update if filters actually changed
//   //   if (JSON.stringify(newFilters) !== JSON.stringify(currentFiltersRef.current)) {
//   //     setFilters(newFilters);
//   //     // Do NOT call refreshWithFilters here – let the page handling effect load the data
//   //   }

//   //   // Mark initial sync as done (after first run)
//   //   hasSynced.current = true;
//   // }, [searchParams, router]); // No `filters` dependency!

//   // // Sync filters from URL on mount and when searchParams change
//   // useEffect(() => {
//   //   const propertyType = searchParams?.get('propertyType')?.toLowerCase();
//   //   const searchTerm = searchParams?.get('searchTerm');
//   //   const minSalePrice = searchParams?.get('minSalePrice');
//   //   const maxSalePrice = searchParams?.get('maxSalePrice');
//   //   const minBedrooms = searchParams?.get('minBedrooms');
//   //   const minBathrooms = searchParams?.get('minBathrooms');
//   //   const statusParam = searchParams?.get("status");

//   //   const newFilters: PropertyFilterOptions = {};

//   //   // Parse status
//   //   if (statusParam) {
//   //     const validStatuses = ["For Sale", "For Rent", "Sold"] as const;
//   //     const parsedStatuses = statusParam
//   //       .split(",")
//   //       .map(s => s.trim())
//   //       .filter((s): s is typeof validStatuses[number] =>
//   //         validStatuses.includes(s as any)
//   //       );
//   //     if (parsedStatuses.length > 0) {
//   //       newFilters.status = parsedStatuses;
//   //     } else {
//   //       // Invalid values – clean URL
//   //       const newSearchParams = new URLSearchParams(searchParams || undefined);
//   //       newSearchParams.delete("status");
//   //       router.replace(`?${newSearchParams.toString()}`, { scroll: false });
//   //     }
//   //   }

//   //   // If no status in URL, default to For Sale and For Rent
//   //   if (!newFilters.status) {
//   //     newFilters.status = ["For Sale", "For Rent"];
//   //   }

//   //   // Parse property types
//   //   if (propertyType) {
//   //     const validPropertyTypes = ['house', 'apartment', 'villa', 'commercial', 'land'] as const;
//   //     const parsedTypes = propertyType
//   //       .split(',')
//   //       .map(t => t.toLowerCase().trim())
//   //       .filter((t): t is typeof validPropertyTypes[number] =>
//   //         validPropertyTypes.includes(t as any)
//   //       );
//   //     if (parsedTypes.length > 0) {
//   //       newFilters.propertyTypes = parsedTypes;
//   //     } else {
//   //       const newSearchParams = new URLSearchParams(searchParams || undefined);
//   //       newSearchParams.delete('propertyType');
//   //       router.replace(`?${newSearchParams.toString()}`, { scroll: false });
//   //     }
//   //   }

//   //   newFilters.searchTerm = searchTerm || undefined;
//   //   newFilters.minSalePrice = minSalePrice ? Number(minSalePrice) : undefined;
//   //   newFilters.maxSalePrice = maxSalePrice ? Number(maxSalePrice) : undefined;
//   //   newFilters.minBedrooms = minBedrooms ? Number(minBedrooms) : undefined;
//   //   newFilters.minBathrooms = minBathrooms ? Number(minBathrooms) : undefined;

//   //   // Only update if filters actually changed
//   //   if (JSON.stringify(newFilters) !== JSON.stringify(currentFiltersRef.current)) {
//   //     setFilters(newFilters);
//   //     // Do NOT call refreshWithFilters here – let the page handling effect load the data
//   //   }

//   //   // Mark initial sync as done (after first run)
//   //   hasSynced.current = true;
//   // }, [searchParams, router]); // No `filters` dependency!


//   // Sync filters from URL when searchParams change (e.g., browser navigation)
//   useEffect(() => {
//     const newFilters = getFiltersFromSearchParams(searchParams);

//     // Only update if filters actually changed
//     if (JSON.stringify(newFilters) !== JSON.stringify(currentFiltersRef.current)) {
//       setFilters(newFilters);
//       // Do NOT call refreshWithFilters here – let the page handling effect load the data
//     }

//     // Mark initial sync as done (after first run)
//     hasSynced.current = true;
//   }, [searchParams]);


//   const handleFilterChange = useCallback(
//     (newFilters: PropertyFilterOptions) => {
//       // Ignore any calls from PropertyFilters before the URL sync is complete
//       if (!hasSynced.current) return;

//       setFilters(newFilters);
//       refreshWithFilters(newFilters);

//       const newSearchParams = new URLSearchParams(searchParams || undefined);

//       // Update URL based on status
//       if (newFilters.status?.length) {
//         newSearchParams.set("status", newFilters.status.join(","));
//       } else {
//         newSearchParams.delete("status");
//       }

//       // Update URL based on propertyTypes
//       if (newFilters.propertyTypes?.length) {
//         newSearchParams.set(
//           'propertyType',
//           newFilters.propertyTypes.map(t => t.toLowerCase()).join(',')
//         );
//       } else {
//         newSearchParams.delete('propertyType');
//       }

//       // Update URL based on other filters
//       if (newFilters.searchTerm) {
//         newSearchParams.set('searchTerm', newFilters.searchTerm);
//       } else {
//         newSearchParams.delete('searchTerm');
//       }

//       if (newFilters.minSalePrice) {
//         newSearchParams.set('minSalePrice', newFilters.minSalePrice.toString());
//       } else {
//         newSearchParams.delete('minSalePrice');
//       }

//       if (newFilters.maxSalePrice) {
//         newSearchParams.set('maxSalePrice', newFilters.maxSalePrice.toString());
//       } else {
//         newSearchParams.delete('maxSalePrice');
//       }

//       if (newFilters.minBedrooms) {
//         newSearchParams.set('minBedrooms', newFilters.minBedrooms.toString());
//       } else {
//         newSearchParams.delete('minBedrooms');
//       }

//       if (newFilters.minBathrooms) {
//         newSearchParams.set('minBathrooms', newFilters.minBathrooms.toString());
//       } else {
//         newSearchParams.delete('minBathrooms');
//       }

//       // Remove page parameter when filters change (back to page 1)
//       newSearchParams.delete('page');

//       router.replace(`?${newSearchParams.toString()}`, { scroll: false });
//     },
//     [refreshWithFilters, searchParams, router]
//   );

//   const handleSortChange = useCallback(
//     (sortBy: string) => {
//       const isDesc = sortBy.startsWith("-");
//       const key = isDesc ? sortBy.slice(1) : sortBy;

//       const newFilters: PropertyFilterOptions = {
//         ...filters,
//         sortBy: key as any,
//         sortOrder: isDesc ? "desc" : "asc",
//       };

//       setFilters(newFilters);
//       refreshWithFilters(newFilters);
//     },
//     [filters, refreshWithFilters]
//   );

//   const handleViewToggle = (view: "grid" | "list") => {
//     setViewType(view);
//     localStorage.setItem("propertyViewPreference", view);
//   };

//   useEffect(() => {
//     const savedView = localStorage.getItem(
//       "propertyViewPreference"
//     ) as "grid" | "list" | null;
//     if (savedView) setViewType(savedView);
//   }, []);

//   // Calculate total pages
//   const totalPages = total ? Math.ceil(total / pagination.pageSize) : 0;

//   // Determine the desired page from URL
//   const pageParam = searchParams?.get('page');
//   const desiredPage = pageParam ? parseInt(pageParam, 10) : 1;
//   const isValidPage = !isNaN(desiredPage) && desiredPage > 0 && desiredPage <= totalPages;
//   const effectiveDesiredPage = isValidPage ? desiredPage : 1;

//   // Condition to know if the current displayed data matches the desired page
//   const isPageReady = pagination.page === effectiveDesiredPage && !loading && (properties.length > 0 || total === 0);

//   // Handle page change
//   const handlePageChange = (newPage: number) => {
//     if (newPage < 1 || newPage > totalPages || loading) return;

//     // Update URL
//     const newParams = new URLSearchParams(searchParams || undefined);
//     newParams.set('page', newPage.toString());
//     router.push(`?${newParams.toString()}`, { scroll: false });

//     // Load the page
//     loadPage(newPage, filters);
//   };

//   // Handle page parameter from URL and load the correct page when needed
//   useEffect(() => {
//     if (!hasSynced.current) return; // wait for initial sync
//     if (!total || total === 0) return; // total not yet known

//     const pageParam = searchParams?.get('page');
//     let pageNum = 1;
//     if (pageParam) {
//       const parsed = parseInt(pageParam, 10);
//       if (!isNaN(parsed) && parsed > 0 && parsed <= totalPages) {
//         pageNum = parsed;
//       } else {
//         // Invalid page number – redirect to page 1 by removing the param
//         const newParams = new URLSearchParams(searchParams || undefined);
//         newParams.delete('page');
//         router.replace(`?${newParams.toString()}`, { scroll: false });
//         return;
//       }
//     }

//     // If the current page in pagination doesn't match the desired page, load it
//     if (pagination.page !== pageNum && !loading) {
//       loadPage(pageNum, filters);
//     }
//   }, [total, totalPages, searchParams, router, filters, loadPage, pagination.page, loading, hasSynced]);

//   useEffect(() => {
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   }, [pagination.page]);

//   const getActiveStatusText = () => {
//     if (!filters.status || filters.status.length === 0) return "All Properties";
//     const statusText = filters.status
//       .map(s => {
//         if (s === "For Sale") return "For Sale";
//         if (s === "For Rent") return "For Rent";
//         if (s === "Sold") return "Sold";
//         return s;
//       })
//       .join(" & ");
//     return `${statusText} Properties`;
//   };

//   return (
//     <main className="main">
//       <div className="page-title">
//         <div className="heading">
//           <div className="container">
//             <div className="row d-flex justify-content-center text-center">
//               <div className="col-lg-8">
//                 <h1 className="heading-title">{getActiveStatusText()}</h1>
//                 <p className="mb-0">
//                   Browse our collection of {filters.status && filters.status.length > 0
//                     ? filters.status.map(s => s.toLowerCase()).join(' and ')
//                     : 'premium'} properties. Find your perfect home, investment opportunity,
//                   or rental property from our curated selection.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//         <nav className="breadcrumbs">
//           <div className="container">
//             <ol>
//               <li><Link href="/">Home</Link></li>
//               <li className="current">Properties</li>
//             </ol>
//           </div>
//         </nav>
//       </div>

//       <section id="properties" className="properties section">
//         <div className="container" data-aos="fade-up">
//           <div className="row">
//             {/* Content */}
//             <div className="col-lg-8">
//               {/* Header */}
//               <div className="properties-header mb-4">
//                 <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
//                   <div className="view-toggle d-flex gap-2">
//                     <button
//                       className={`btn btn-sm view-btn btn-outline-secondary ${viewType === "grid" ? "active" : ""}`}
//                       onClick={() => handleViewToggle("grid")}
//                     >
//                       <i className="bi bi-grid-3x3-gap"></i> Grid
//                     </button>
//                     <button
//                       className={`btn btn-sm view-btn btn-outline-secondary ${viewType === "list" ? "active" : ""}`}
//                       onClick={() => handleViewToggle("list")}
//                     >
//                       <i className="bi bi-list"></i> List
//                     </button>
//                   </div>

//                   <div className="d-flex align-items-center gap-3">
//                     <span className="text-muted small">
//                       {total ? `${properties.length} properties shown` : "No properties found"}
//                     </span>

//                     <select
//                       id="sort-filter"
//                       name="sortBy"
//                       className="form-select form-select-sm order-by-select"
//                       value={filters.sortBy || "created_at"}
//                       onChange={(e) => handleSortChange(e.target.value)}
//                     >
//                       <option value="-created_at">Sort by: Newest</option>
//                       <option value="sale_price">Price: Low to High</option>
//                       <option value="-sale_price">Price: High to Low</option>
//                       <option value="building_size">Size: Small to Large</option>
//                       <option value="-building_size">Size: Large to Small</option>
//                     </select>
//                   </div>
//                 </div>
//               </div>

//               {/* Error */}
//               {error && (
//                 <div className="alert alert-danger">
//                   {error}
//                   <button
//                     className="btn btn-sm btn-primary ms-3"
//                     onClick={() => refreshWithFilters(filters)}
//                   >
//                     Retry
//                   </button>
//                 </div>
//               )}

//               {/* Main content with loader until the correct page is ready */}
//               {!isPageReady ? (
//                 <div className="text-center py-5">
//                   <AppLoader />
//                 </div>
//               ) : (
//                 <>
//                   {/* GRID */}
//                   {viewType === "grid" ? (
//                     <>
//                       {properties.length === 0 ? (
//                         <div className="text-center py-5">
//                           <h4>No properties found</h4>
//                           <p className="text-muted">
//                             Try adjusting your filters or check back later.
//                           </p>
//                           <button
//                             className="btn btn-outline-primary"
//                             onClick={() => handleFilterChange({})}
//                           >
//                             Clear All Filters
//                           </button>
//                         </div>
//                       ) : (
//                         <div className="row g-4">
//                           {/* {properties.map((property) => (
//                             <PropertyCardPremium key={property.id} data={property} />
//                           ))} */}

//                           {/* {properties.map((property, index) => (
//                             <PropertyCardPremium
//                               key={property.id}
//                               data={property}
//                               priority={index !== 0}
//                             />
//                           ))} */}

//                           {properties.map((property, index) => (
//                             <PropertyCardPremium
//                               key={property.id}
//                               data={property}
//                               priority={index !== 0}          // only first image eager
//                               onOpenGallery={handleOpenGallery}
//                               onOpenLoginModal={handleOpenLoginModal}
//                             />
//                           ))}
//                         </div>
//                       )}
//                     </>
//                   ) : (
//                     // LIST
//                     <>
//                       {properties.length === 0 ? (
//                         <div className="text-center py-5">
//                           <h4>No properties found</h4>
//                           <p className="text-muted">
//                             Try adjusting your filters or check back later.
//                           </p>
//                           <button
//                             className="btn btn-outline-primary"
//                             onClick={() => handleFilterChange({})}
//                           >
//                             Clear All Filters
//                           </button>
//                         </div>
//                       ) : (
//                         <div className="featured-properties">
//                           <div className="mini-list list expand-image">
//                             {properties.map((property) => (
//                               <PropertyCardHorizontal key={property.id} data={property} className="list" />
//                             ))}
//                           </div>
//                         </div>
//                       )}
//                     </>
//                   )}
//                 </>
//               )}

//               {/* PAGINATION - always visible, but disabled while loading, highlighting desired page */}
//               {totalPages > 1 && (
//                 <nav className="mt-5" data-aos-delay="300">
//                   <ul className="pagination justify-content-center">
//                     <li className={`page-item ${effectiveDesiredPage === 1 ? 'disabled' : ''}`}>
//                       <button
//                         className="page-link"
//                         onClick={() => handlePageChange(effectiveDesiredPage - 1)}
//                         disabled={loading || effectiveDesiredPage === 1}
//                       >
//                         Previous
//                       </button>
//                     </li>
//                     {[...Array(totalPages)].map((_, i) => {
//                       const pageNum = i + 1;
//                       if (
//                         pageNum === 1 ||
//                         pageNum === totalPages ||
//                         (pageNum >= effectiveDesiredPage - 1 && pageNum <= effectiveDesiredPage + 1)
//                       ) {
//                         return (
//                           <li key={pageNum} className={`page-item ${effectiveDesiredPage === pageNum ? 'active' : ''}`}>
//                             <button
//                               className="page-link"
//                               onClick={() => handlePageChange(pageNum)}
//                               disabled={loading}
//                             >
//                               {pageNum}
//                             </button>
//                           </li>
//                         );
//                       } else if (
//                         (pageNum === 2 && effectiveDesiredPage > 3) ||
//                         (pageNum === totalPages - 1 && effectiveDesiredPage < totalPages - 2)
//                       ) {
//                         return <li key={pageNum} className="page-item disabled"><span className="page-link">…</span></li>;
//                       }
//                       return null;
//                     })}
//                     <li className={`page-item ${effectiveDesiredPage === totalPages ? 'disabled' : ''}`}>
//                       <button
//                         className="page-link"
//                         onClick={() => handlePageChange(effectiveDesiredPage + 1)}
//                         disabled={loading || effectiveDesiredPage === totalPages}
//                       >
//                         Next
//                       </button>
//                     </li>
//                   </ul>
//                 </nav>
//               )}
//             </div>

//             {/* Filters */}
//             <div className="col-lg-4">
//               <PropertyFilters
//                 filters={filters}
//                 onChange={handleFilterChange}
//                 stats={stats}
//               />
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Single Image Gallery Modal */}
//       <ImageGalleryModal
//         open={galleryOpen}
//         images={galleryImages}
//         index={galleryIndex}
//         onClose={handleCloseGallery}
//         onNext={() => setGalleryIndex((prev) => (prev + 1) % galleryImages.length)}
//         onPrev={() => setGalleryIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)}
//       />
      
//       {/* Single Login Modal */}
//       <LoginRequiredModal open={loginModalOpen} onClose={handleCloseLoginModal} />

//     </main>
//   );
// }








// app/properties/PropertiesClient.tsx
"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { useProperties } from "@/hooks/useProperties";
import { usePropertyStats } from "@/hooks/usePropertyStats";
import PropertyCardPremium from "@/components/property/PropertyCard/PropertyCardPremium";
import PropertyFilters from "@/components/property/PropertyFilters";
import { PropertyFilterOptions } from '@/services/PropertyServiceSupabase';
import Link from "next/link";
import AppLoader from "@/components/ui/AppLoader/AppLoader";
import PropertyCardHorizontal from "@/components/property/PropertyCard/PropertyCardHorizontal";
import { useSearchParams, useRouter } from 'next/navigation';
import ImageGalleryModal from "@/components/modules/ImageGalleryModal";
import LoginRequiredModal from "@/components/modules/LoginRequiredModal";
import "./style.css";

// Helper to parse searchParams into filters
const getFiltersFromSearchParams = (searchParams: URLSearchParams | null): PropertyFilterOptions => {
  if (!searchParams) return { status: ["For Sale", "For Rent"] };

  const propertyType = searchParams.get('propertyType')?.toLowerCase();
  const searchTerm = searchParams.get('searchTerm');
  const minSalePrice = searchParams.get('minSalePrice');
  const maxSalePrice = searchParams.get('maxSalePrice');
  const minBedrooms = searchParams.get('minBedrooms');
  const minBathrooms = searchParams.get('minBathrooms');
  const statusParam = searchParams.get("status");

  const newFilters: PropertyFilterOptions = {};

  // Parse status
  if (statusParam) {
    const validStatuses = ["For Sale", "For Rent", "Sold"] as const;
    const parsedStatuses = statusParam
      .split(",")
      .map(s => s.trim())
      .filter((s): s is typeof validStatuses[number] =>
        validStatuses.includes(s as any)
      );
    if (parsedStatuses.length > 0) {
      newFilters.status = parsedStatuses;
    } else {
      // Invalid values – just ignore and use default
      newFilters.status = ["For Sale", "For Rent"];
    }
  } else {
    newFilters.status = ["For Sale", "For Rent"];
  }

  // Parse property types
  if (propertyType) {
    const validPropertyTypes = ['house', 'apartment', 'villa', 'commercial', 'land'] as const;
    const parsedTypes = propertyType
      .split(',')
      .map(t => t.toLowerCase().trim())
      .filter((t): t is typeof validPropertyTypes[number] =>
        validPropertyTypes.includes(t as any)
      );
    if (parsedTypes.length > 0) {
      newFilters.propertyTypes = parsedTypes;
    }
  }

  newFilters.searchTerm = searchTerm || undefined;
  newFilters.minSalePrice = minSalePrice ? Number(minSalePrice) : undefined;
  newFilters.maxSalePrice = maxSalePrice ? Number(maxSalePrice) : undefined;
  newFilters.minBedrooms = minBedrooms ? Number(minBedrooms) : undefined;
  newFilters.minBathrooms = minBathrooms ? Number(minBathrooms) : undefined;

  return newFilters;
};

export default function PropertiesClient() {
  const [filters, setFilters] = useState<PropertyFilterOptions>({});
  const [viewType, setViewType] = useState<"grid" | "list">("grid");

  const searchParams = useSearchParams();
  const router = useRouter();

  const { stats } = usePropertyStats();

  const {
    properties,
    loading,
    error,
    total,
    loadPage,
    refreshWithFilters,
    pagination,
  } = useProperties(true); 

  // Refs to track initial sync and current filters
  const hasSynced = useRef(false);
  const currentFiltersRef = useRef(filters);

  // Modal states
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  // Stable callbacks for modals
  const handleOpenGallery = useCallback((images: string[], index: number) => {
    setGalleryImages(images);
    setGalleryIndex(index);
    setGalleryOpen(true);
  }, []);

  const handleCloseGallery = useCallback(() => setGalleryOpen(false), []);
  const handleOpenLoginModal = useCallback(() => setLoginModalOpen(true), []);
  const handleCloseLoginModal = useCallback(() => setLoginModalOpen(false), []);

  const handleNextImage = useCallback(() => {
    setGalleryIndex((prev) => (prev + 1) % galleryImages.length);
  }, [galleryImages.length]);

  const handlePrevImage = useCallback(() => {
    setGalleryIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  }, [galleryImages.length]);

  // Keep currentFiltersRef in sync with filters state
  useEffect(() => {
    currentFiltersRef.current = filters;
  }, [filters]);

  // Sync filters from URL when searchParams change (e.g., browser navigation)
  useEffect(() => {
    const newFilters = getFiltersFromSearchParams(searchParams);

    const filtersChanged = JSON.stringify(newFilters) !== JSON.stringify(currentFiltersRef.current);
    if (filtersChanged) {
      setFilters(newFilters);
    }

    const wasSynced = hasSynced.current;
    hasSynced.current = true;

    // On first sync, load the properties with the filters from URL
    if (!wasSynced && filtersChanged) {
      refreshWithFilters(newFilters);
    }
  }, [searchParams, refreshWithFilters]);


  const handleFilterChange = useCallback(
    (newFilters: PropertyFilterOptions) => {
      // Ignore any calls from PropertyFilters before the URL sync is complete
      if (!hasSynced.current) return;

      setFilters(newFilters);
      refreshWithFilters(newFilters);

      const newSearchParams = new URLSearchParams(searchParams || undefined);

      // Update URL based on status
      if (newFilters.status?.length) {
        newSearchParams.set("status", newFilters.status.join(","));
      } else {
        newSearchParams.delete("status");
      }

      // Update URL based on propertyTypes
      if (newFilters.propertyTypes?.length) {
        newSearchParams.set(
          'propertyType',
          newFilters.propertyTypes.map(t => t.toLowerCase()).join(',')
        );
      } else {
        newSearchParams.delete('propertyType');
      }

      // Update URL based on other filters
      if (newFilters.searchTerm) {
        newSearchParams.set('searchTerm', newFilters.searchTerm);
      } else {
        newSearchParams.delete('searchTerm');
      }

      if (newFilters.minSalePrice) {
        newSearchParams.set('minSalePrice', newFilters.minSalePrice.toString());
      } else {
        newSearchParams.delete('minSalePrice');
      }

      if (newFilters.maxSalePrice) {
        newSearchParams.set('maxSalePrice', newFilters.maxSalePrice.toString());
      } else {
        newSearchParams.delete('maxSalePrice');
      }

      if (newFilters.minBedrooms) {
        newSearchParams.set('minBedrooms', newFilters.minBedrooms.toString());
      } else {
        newSearchParams.delete('minBedrooms');
      }

      if (newFilters.minBathrooms) {
        newSearchParams.set('minBathrooms', newFilters.minBathrooms.toString());
      } else {
        newSearchParams.delete('minBathrooms');
      }

      // Remove page parameter when filters change (back to page 1)
      newSearchParams.delete('page');

      router.replace(`?${newSearchParams.toString()}`, { scroll: false });
    },
    [refreshWithFilters, searchParams, router]
  );

  const handleSortChange = useCallback(
    (sortBy: string) => {
      const isDesc = sortBy.startsWith("-");
      const key = isDesc ? sortBy.slice(1) : sortBy;

      const newFilters: PropertyFilterOptions = {
        ...filters,
        sortBy: key as any,
        sortOrder: isDesc ? "desc" : "asc",
      };

      setFilters(newFilters);
      refreshWithFilters(newFilters);
    },
    [filters, refreshWithFilters]
  );

  const handleViewToggle = (view: "grid" | "list") => {
    setViewType(view);
    localStorage.setItem("propertyViewPreference", view);
  };

  useEffect(() => {
    const savedView = localStorage.getItem(
      "propertyViewPreference"
    ) as "grid" | "list" | null;
    if (savedView) setViewType(savedView);
  }, []);

  // Calculate total pages
  const totalPages = total ? Math.ceil(total / pagination.pageSize) : 0;

  // Determine the desired page from URL
  const pageParam = searchParams?.get('page');
  const desiredPage = pageParam ? parseInt(pageParam, 10) : 1;
  const isValidPage = !isNaN(desiredPage) && desiredPage > 0 && desiredPage <= totalPages;
  const effectiveDesiredPage = isValidPage ? desiredPage : 1;

  // Condition to know if the current displayed data matches the desired page
  const isPageReady = pagination.page === effectiveDesiredPage && !loading && (properties.length > 0 || total === 0);

  const [currentPage, setCurrentPage] = useState(pageParam ? pageParam : 1);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || loading) return;


    if (currentPage == newPage) return;
    setCurrentPage(newPage);

    // Update URL
    const newParams = new URLSearchParams(searchParams || undefined);
    newParams.set('page', newPage.toString());
    router.push(`?${newParams.toString()}`, { scroll: false });

    // Load the page
    loadPage(newPage, filters);
  };

  // Handle page parameter from URL and load the correct page when needed
  useEffect(() => {
    if (!hasSynced.current) return; // wait for initial sync
    if (!total || total === 0) return; // total not yet known

    const pageParam = searchParams?.get('page');
    let pageNum = 1;
    if (pageParam) {
      const parsed = parseInt(pageParam, 10);
      if (!isNaN(parsed) && parsed > 0 && parsed <= totalPages) {
        pageNum = parsed;
      } else {
        // Invalid page number – redirect to page 1 by removing the param
        const newParams = new URLSearchParams(searchParams || undefined);
        newParams.delete('page');
        router.replace(`?${newParams.toString()}`, { scroll: false });
        return;
      }
    }

    // If the current page in pagination doesn't match the desired page, load it
    if (pagination.page !== pageNum && !loading) {
      loadPage(pageNum, filters);
    }
  }, [total, totalPages, searchParams, router, filters, loadPage, pagination.page, loading, hasSynced]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pagination.page]);

  const getActiveStatusText = () => {
    if (!filters.status || filters.status.length === 0) return "All Properties";
    const statusText = filters.status
      .map(s => {
        if (s === "For Sale") return "For Sale";
        if (s === "For Rent") return "For Rent";
        if (s === "Sold") return "Sold";
        return s;
      })
      .join(" & ");
    return `${statusText} Properties`;
  };

  return (
    <main className="main">
      <div className="page-title">
        <div className="heading">
          <div className="container">
            <div className="row d-flex justify-content-center text-center">
              <div className="col-lg-8">
                <h1 className="heading-title">{getActiveStatusText()}</h1>
                <p className="mb-0">
                  Browse our collection of {filters.status && filters.status.length > 0
                    ? filters.status.map(s => s.toLowerCase()).join(' and ')
                    : 'premium'} properties. Find your perfect home, investment opportunity,
                  or rental property from our curated selection.
                </p>
              </div>
            </div>
          </div>
        </div>
        <nav className="breadcrumbs">
          <div className="container">
            <ol>
              <li><Link href="/">Home</Link></li>
              <li className="current">Properties</li>
            </ol>
          </div>
        </nav>
      </div>

      <section id="properties" className="properties section">
        <div className="container" data-aos="fade-up">
          <div className="row">
            {/* Content */}
            <div className="col-lg-8">
              {/* Header */}
              <div className="properties-header mb-4">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                  <div className="view-toggle d-flex gap-2">
                    <button
                      className={`btn btn-sm view-btn btn-outline-secondary ${viewType === "grid" ? "active" : ""}`}
                      onClick={() => handleViewToggle("grid")}
                    >
                      <i className="bi bi-grid-3x3-gap"></i> Grid
                    </button>
                    <button
                      className={`btn btn-sm view-btn btn-outline-secondary ${viewType === "list" ? "active" : ""}`}
                      onClick={() => handleViewToggle("list")}
                    >
                      <i className="bi bi-list"></i> List
                    </button>
                  </div>

                  <div className="d-flex align-items-center gap-3">
                    <span className="text-muted small">
                      {total ? `${properties.length} properties shown` : "No properties found"}
                    </span>

                    <select
                      id="sort-filter"
                      name="sortBy"
                      className="form-select form-select-sm order-by-select"
                      value={filters.sortBy || "created_at"}
                      onChange={(e) => handleSortChange(e.target.value)}
                    >
                      <option value="-created_at">Sort by: Newest</option>
                      <option value="sale_price">Price: Low to High</option>
                      <option value="-sale_price">Price: High to Low</option>
                      <option value="building_size">Size: Small to Large</option>
                      <option value="-building_size">Size: Large to Small</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="alert alert-danger">
                  {error}
                  <button
                    className="btn btn-sm btn-primary ms-3"
                    onClick={() => refreshWithFilters(filters)}
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* Main content with loader until the correct page is ready */}
              {!isPageReady ? (
                <div className="text-center py-5">
                  <AppLoader />
                </div>
              ) : (
                <>
                  {/* GRID */}
                  {viewType === "grid" ? (
                    <>
                      {properties.length === 0 ? (
                        <div className="text-center py-5">
                          <h4>No properties found</h4>
                          <p className="text-muted">
                            Try adjusting your filters or check back later.
                          </p>
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => handleFilterChange({})}
                          >
                            Clear All Filters
                          </button>
                        </div>
                      ) : (
                        <div className="row g-4">
                          {properties.map((property, index) => (
                            // <p key={property.id}>{property.title}</p>
                            <PropertyCardPremium
                              key={property.id}
                              data={property}
                              priority={index === 0} // only first image eager
                              onOpenGallery={handleOpenGallery}
                              onOpenLoginModal={handleOpenLoginModal}
                            />
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    // LIST
                    <>
                      {properties.length === 0 ? (
                        <div className="text-center py-5">
                          <h4>No properties found</h4>
                          <p className="text-muted">
                            Try adjusting your filters or check back later.
                          </p>
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => handleFilterChange({})}
                          >
                            Clear All Filters
                          </button>
                        </div>
                      ) : (
                        <div className="featured-properties">
                          <div className="mini-list list expand-image">
                            {properties.map((property) => (
                              <PropertyCardHorizontal
                                key={property.id}
                                data={property}
                                className="list"
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}

              {/* PAGINATION - always visible, but disabled while loading, highlighting desired page */}
              {totalPages > 1 && (
                <nav className="mt-5" data-aos-delay="300">
                  <ul className="pagination justify-content-center">
                    <li className={`page-item ${effectiveDesiredPage === 1 ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(effectiveDesiredPage - 1)}
                        disabled={loading || effectiveDesiredPage === 1}
                      >
                        Previous
                      </button>
                    </li>
                    {[...Array(totalPages)].map((_, i) => {
                      const pageNum = i + 1;
                      if (
                        pageNum === 1 ||
                        pageNum === totalPages ||
                        (pageNum >= effectiveDesiredPage - 1 && pageNum <= effectiveDesiredPage + 1)
                      ) {
                        return (
                          <li key={pageNum} className={`page-item ${effectiveDesiredPage === pageNum ? 'active' : ''}`}>
                            <button
                              className="page-link"
                              onClick={() => handlePageChange(pageNum)}
                              disabled={loading}
                            >
                              {pageNum}
                            </button>
                          </li>
                        );
                      } else if (
                        (pageNum === 2 && effectiveDesiredPage > 3) ||
                        (pageNum === totalPages - 1 && effectiveDesiredPage < totalPages - 2)
                      ) {
                        return <li key={pageNum} className="page-item disabled"><span className="page-link">…</span></li>;
                      }
                      return null;
                    })}
                    <li className={`page-item ${effectiveDesiredPage === totalPages ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(effectiveDesiredPage + 1)}
                        disabled={loading || effectiveDesiredPage === totalPages}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
            </div>

            {/* Filters */}
            <div className="col-lg-4">
              <PropertyFilters
                filters={filters}
                onChange={handleFilterChange}
                stats={stats}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Modals – rendered only once */}
      <ImageGalleryModal
        open={galleryOpen}
        images={galleryImages}
        index={galleryIndex}
        onClose={handleCloseGallery}
        onNext={handleNextImage}
        onPrev={handlePrevImage}
      />
      <LoginRequiredModal open={loginModalOpen} onClose={handleCloseLoginModal} />
    </main>
  );
}