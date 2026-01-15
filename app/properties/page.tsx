// // app/properties/page.tsx
// "use client";

// import { useState, useCallback } from 'react';
// // import { useProperties, usePropertyStats } from '@/hooks';
// import { useProperties } from '@/hooks/useProperties';
// import { usePropertyStats } from '@/hooks/usePropertyStats';
// import PropertyCard from '@/components/property/PropertyCard/PropertyCardPremium';
// // import PropertyFilters from '@/components/property/PropertyFilters';
// import { PropertyFilterOptions } from '@/services/PropertyService';

// export default function PropertiesPage() {
//   const [filters, setFilters] = useState<PropertyFilterOptions>({});
//   const { stats, loading: statsLoading } = usePropertyStats();
//   const {
//     properties,
//     loading,
//     error,
//     hasMore,
//     total,
//     loadNextPage,
//     refreshWithFilters
//   } = useProperties();

//   const handleFilterChange = useCallback((newFilters: PropertyFilterOptions) => {
//     setFilters(newFilters);
//     refreshWithFilters(newFilters);
//   }, [refreshWithFilters]);

//   return (
//     <div className="container py-5">
//       {/* Stats section */}
//       {stats && (
//         <div className="row mb-4">
//           <div className="col-12">
//             <div className="stats-grid">
//               <div className="stat-card">
//                 <h3>{stats.totalProperties}</h3>
//                 <p>Total Properties</p>
//               </div>
//               <div className="stat-card">
//                 <h3>{stats.forSaleCount}</h3>
//                 <p>For Sale</p>
//               </div>
//               <div className="stat-card">
//                 <h3>{stats.forRentCount}</h3>
//                 <p>For Rent</p>
//               </div>
//               <div className="stat-card">
//                 <h3>{stats.averageSalePrice.toLocaleString()}</h3>
//                 <p>Avg Sale Price</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="row">
//         {/* Filters sidebar */}
//         {/* <div className="col-lg-3">
//           <PropertyFilters 
//             filters={filters}
//             onChange={handleFilterChange}
//             stats={stats}
//           />
//         </div> */}

//         {/* Properties grid */}
//         <div className="col-lg-9">
//           <div className="d-flex justify-content-between align-items-center mb-4">
//             <h2>
//               Properties {total > 0 && `(${total})`}
//             </h2>
//             <select 
//               className="form-select w-auto"
//               value={filters.sortBy || 'createdAt'}
//               onChange={(e) => handleFilterChange({
//                 ...filters,
//                 sortBy: e.target.value as any
//               })}
//             >
//               <option value="createdAt">Newest First</option>
//               <option value="price">Price: Low to High</option>
//               <option value="buildingSize">Size: Small to Large</option>
//             </select>
//           </div>

//           {error && (
//             <div className="alert alert-danger">
//               {error}
//               <button 
//                 className="btn btn-sm btn-primary ms-3"
//                 onClick={() => refreshWithFilters(filters)}
//               >
//                 Retry
//               </button>
//             </div>
//           )}

//           {properties.length === 0 && !loading ? (
//             <div className="text-center py-5">
//               <h4>No properties found</h4>
//               <p>Try adjusting your filters</p>
//             </div>
//           ) : (
//             <>
//               <div className="row">
//                 {properties.map((property) => (
//                   <div key={property.id} className="col-lg-6 col-md-6 mb-4">
//                     <PropertyCard data={property} />
//                   </div>
//                 ))}
//               </div>

//               {hasMore && (
//                 <div className="text-center mt-4">
//                   <button
//                     className="btn btn-primary"
//                     onClick={() => loadNextPage(filters)}
//                     disabled={loading}
//                   >
//                     {loading ? 'Loading...' : 'Load More'}
//                   </button>
//                 </div>
//               )}

//               {loading && (
//                 <div className="text-center py-4">
//                   <div className="spinner-border text-primary" role="status">
//                     <span className="visually-hidden">Loading...</span>
//                   </div>
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }





// // app/properties/page.tsx (Updated version)
// "use client";

// import { useState, useCallback, useEffect } from 'react';
// import { useProperties } from '@/hooks/useProperties';
// import { usePropertyStats } from '@/hooks/usePropertyStats';
// import PropertyCardPremium from '@/components/property/PropertyCard/PropertyCardPremium';
// import PropertyFilters from '@/components/property/PropertyFilters';
// import { PropertyFilterOptions } from '@/services/PropertyService';
// import Link from 'next/link';

// export default function Properties() {
//   const [filters, setFilters] = useState<PropertyFilterOptions>({});
//   const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
//   const { stats, loading: statsLoading } = usePropertyStats();
//   const {
//     properties,
//     loading,
//     error,
//     hasMore,
//     total,
//     loadNextPage,
//     refreshWithFilters,
//     pagination
//   } = useProperties();

//   const handleFilterChange = useCallback((newFilters: PropertyFilterOptions) => {
//     setFilters(newFilters);
//     refreshWithFilters(newFilters);
//   }, [refreshWithFilters]);

//   const handleSortChange = useCallback((sortBy: string) => {
//     const newFilters = {
//       ...filters,
//       sortBy: sortBy as any,
//       sortOrder: sortBy === 'price' ? 'asc' : 'desc'
//     };
//     setFilters(newFilters);
//     refreshWithFilters(newFilters);
//   }, [filters, refreshWithFilters]);

//   const handleViewToggle = (view: 'grid' | 'list') => {
//     setViewType(view);
//     // You can save preference to localStorage if needed
//     localStorage.setItem('propertyViewPreference', view);
//   };

//   // Load view preference from localStorage on mount
//   useEffect(() => {
//     const savedView = localStorage.getItem('propertyViewPreference') as 'grid' | 'list';
//     if (savedView) {
//       setViewType(savedView);
//     }
//   }, []);


//   return (
//     <main className="main">
//       {/* Page Title */}
//       <div className="page-title">
//         <div className="heading">
//           <div className="container">
//             <div className="row d-flex justify-content-center text-center">
//               <div className="col-lg-8">
//                 <h1 className="heading-title">Properties</h1>
//                 <p className="mb-0">
//                   Browse our collection of premium properties. Find your perfect home, 
//                   investment opportunity, or rental property from our curated selection.
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
//       {/* End Page Title */}

//       {/* Properties Section */}
//       <section id="properties" className="properties section">
//         <div className="container" data-aos="fade-up" data-aos-delay="100">
//           <div className="row">
//             {/* Filters Sidebar */}
//             <div className="col-lg-4" data-aos="fade-up" data-aos-delay="200">
//               <PropertyFilters 
//                 filters={filters}
//                 onChange={handleFilterChange}
//                 stats={stats}
//               />
//             </div>

//             {/* Properties Content */}
//             <div className="col-lg-8">
//               {/* Properties Header */}
//               <div className="properties-header mb-4">
//                 <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
//                   <div className="view-toggle d-flex gap-2">
//                     <button 
//                       className={`btn btn-sm ${viewType === 'grid' ? 'btn-primary' : 'btn-outline-secondary'} view-btn`}
//                       onClick={() => handleViewToggle('grid')}
//                     >
//                       <i className="bi bi-grid-3x3-gap"></i> Grid
//                     </button>
//                     <button 
//                       className={`btn btn-sm ${viewType === 'list' ? 'btn-primary' : 'btn-outline-secondary'} view-btn`}
//                       onClick={() => handleViewToggle('list')}
//                     >
//                       <i className="bi bi-list"></i> List
//                     </button>
//                   </div>

//                   <div className="d-flex align-items-center gap-3">
//                     <span className="text-muted small">
//                       {total > 0 ? `${total} properties found` : 'No properties found'}
//                     </span>
//                     <div className="sort-dropdown">
//                       <select 
//                         className="form-select form-select-sm"
//                         value={filters.sortBy || 'createdAt'}
//                         onChange={(e) => handleSortChange(e.target.value)}
//                       >
//                         <option value="createdAt">Sort by: Newest</option>
//                         <option value="price">Price: Low to High</option>
//                         <option value="-price">Price: High to Low</option>
//                         <option value="buildingSize">Size: Small to Large</option>
//                         <option value="-buildingSize">Size: Large to Small</option>
//                       </select>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Error Display */}
//               {error && (
//                 <div className="alert alert-danger" data-aos="fade-up">
//                   {error}
//                   <button 
//                     className="btn btn-sm btn-primary ms-3"
//                     onClick={() => refreshWithFilters(filters)}
//                   >
//                     Retry
//                   </button>
//                 </div>
//               )}

//               {/* Grid View */}
//               {viewType === 'grid' && (
//                 <div className={`properties-grid ${viewType === 'grid' ? 'active' : ''}`} data-aos="fade-up" data-aos-delay="200">
//                   {properties.length === 0 && !loading ? (
//                     <div className="text-center py-5">
//                       <h4>No properties found</h4>
//                       <p className="text-muted">Try adjusting your filters or check back later for new listings.</p>
//                       <button 
//                         className="btn btn-outline-primary mt-2"
//                         onClick={() => handleFilterChange({})}
//                       >
//                         Clear All Filters
//                       </button>
//                     </div>
//                   ) : (
//                     <div className="row g-4">
//                       {properties.map((property) => (
//                         <div key={property.id} className="col-lg-6">
//                           <PropertyCardPremium data={property} />
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* List View */}
//               {viewType === 'list' && (
//                 <div className={`properties-list ${viewType === 'list' ? 'active' : ''}`} data-aos="fade-up" data-aos-delay="200">
//                   {properties.length === 0 && !loading ? (
//                     <div className="text-center py-5">
//                       <h4>No properties found</h4>
//                       <p className="text-muted">Try adjusting your filters or check back later for new listings.</p>
//                     </div>
//                   ) : (
//                     <div className="row">
//                       {properties.map((property) => (
//                         <div key={property.id} className="col-12 mb-4">
//                           {/* You can create a PropertyCardList component for list view */}
//                           <div className="property-list-item">
//                             <div className="row align-items-center">
//                               <div className="col-lg-4">
//                                 <div className="property-image">
//                                   <img 
//                                     src={property.images && property.images.length > 0 ? property.images[0] : "/img/placeholder-property.jpg"} 
//                                     alt={property.title}
//                                     className="img-fluid"
//                                   />
//                                   <div className="property-badges">
//                                     {property.status?.includes('For Sale') && (
//                                       <span className="badge for-sale">For Sale</span>
//                                     )}
//                                     {property.status?.includes('For Rent') && (
//                                       <span className="badge for-rent">For Rent</span>
//                                     )}
//                                     {property.hot && <span className="badge hot">Hot</span>}
//                                     {property.featured && <span className="badge featured">Featured</span>}
//                                   </div>
//                                 </div>
//                               </div>
//                               <div className="col-lg-8">
//                                 <div className="property-content">
//                                   <div className="d-flex justify-content-between align-items-start mb-2">
//                                     <div>
//                                       <h4 className="property-title mb-1">{property.title}</h4>
//                                       <p className="property-location mb-2">
//                                         <i className="bi bi-geo-alt"></i> 
//                                         {property.showAddress ? property.address : property.city}
//                                       </p>
//                                     </div>
//                                     <div className="property-price">
//                                       {property.salePrice && property.status?.includes('For Sale') && (
//                                         <div>${property.salePrice.toLocaleString()}</div>
//                                       )}
//                                       {property.rentPrice && property.status?.includes('For Rent') && (
//                                         <div>${property.rentPrice.toLocaleString()}/month</div>
//                                       )}
//                                     </div>
//                                   </div>
//                                   <div className="property-features mb-3">
//                                     {property.bedrooms && (
//                                       <span><i className="bi bi-house"></i> {property.bedrooms} Bed</span>
//                                     )}
//                                     {property.bathrooms && (
//                                       <span><i className="bi bi-water"></i> {property.bathrooms} Bath</span>
//                                     )}
//                                     {property.buildingSize && (
//                                       <span><i className="bi bi-arrows-angle-expand"></i> {property.buildingSize} {property.sizeUnit}</span>
//                                     )}
//                                   </div>
//                                   <div className="d-flex justify-content-between align-items-center">
//                                     {property.showAgent && property.agent && (
//                                       <div className="property-agent">
//                                         {property.agent.photo ? (
//                                           <img src={property.agent.photo} alt={property.agent.name} className="agent-avatar" />
//                                         ) : (
//                                           <div className="agent-avatar placeholder">
//                                             <i className="bi bi-person"></i>
//                                           </div>
//                                         )}
//                                         <span>{property.agent.name}</span>
//                                       </div>
//                                     )}
//                                     <div className="property-actions">
//                                       <button className="btn btn-outline-secondary btn-sm">
//                                         <i className="bi bi-heart"></i>
//                                       </button>
//                                       <Link 
//                                         href={`/properties/${property.id}`} 
//                                         className="btn btn-primary btn-sm ms-2"
//                                       >
//                                         View Details
//                                       </Link>
//                                     </div>
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* Loading Indicator */}
//               {loading && (
//                 <div className="text-center py-5">
//                   <div className="spinner-border text-primary" role="status">
//                     <span className="visually-hidden">Loading...</span>
//                   </div>
//                   <p className="mt-2 text-muted">Loading properties...</p>
//                 </div>
//               )}

//               {/* Load More Button */}
//               {hasMore && !loading && properties.length > 0 && (
//                 <div className="text-center mt-5" data-aos="fade-up" data-aos-delay="300">
//                   <button
//                     className="btn btn-primary"
//                     onClick={() => loadNextPage(filters)}
//                     disabled={loading}
//                   >
//                     {loading ? 'Loading...' : `Load More (${pagination.pageSize} per page)`}
//                   </button>
//                 </div>
//               )}

//               {/* Pagination */}
//               {!hasMore && properties.length > 0 && (
//                 <div className="text-center mt-4">
//                   <p className="text-muted">Showing all {properties.length} properties</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// }






// app/properties/page.tsx
"use client";

import { useState, useCallback, useEffect } from "react";
import { useProperties } from "@/hooks/useProperties";
import { usePropertyStats } from "@/hooks/usePropertyStats";
import PropertyCardPremium from "@/components/property/PropertyCard/PropertyCardPremium";
import PropertyFilters from "@/components/property/PropertyFilters";
// import { PropertyFilterOptions } from "@/services/PropertyService";
import { propertyService, PropertyFilterOptions, PaginatedResult } from '@/services/PropertyServiceSupabase';
import Link from "next/link";
import AppLoader from "@/components/ui/AppLoader/AppLoader";
import PropertyCardHorizontal from "@/components/property/PropertyCard/PropertyCardHorizontal";
import { useSearchParams, useRouter } from 'next/navigation';
import "./style.css";
// import { useFavorites } from '@/hooks/useFavorites';

export default function Properties() {
  const [filters, setFilters] = useState<PropertyFilterOptions>({});
  const [viewType, setViewType] = useState<"grid" | "list">("grid");

  const searchParams = useSearchParams();
  const router = useRouter();

  const { stats } = usePropertyStats();

  const {
    properties,
    loading,
    error,
    hasMore,
    total,
    loadNextPage,
    refreshWithFilters,
    pagination,
  } = useProperties();

  // const { isFavorited, toggleFavorite } = useFavorites();

  console.log(total, properties.length, properties);

  const handleFilterChange = useCallback(
    (newFilters: PropertyFilterOptions) => {
      setFilters(newFilters);
      refreshWithFilters(newFilters);

      // Update URL based on status
      const newSearchParams = new URLSearchParams(searchParams || undefined);
      if (newFilters.status) {
        if (newFilters.status.includes('For Sale') && !newFilters.status.includes('For Rent')) {
          newSearchParams.set('type', 'sale');
        } else if (newFilters.status.includes('For Rent') && !newFilters.status.includes('For Sale')) {
          newSearchParams.set('type', 'rent');
        } else {
          newSearchParams.delete('type');
        }
      } else {
        newSearchParams.delete('type');
      }

      // Update URL based on propertyTypes
      if (newFilters.propertyTypes && newFilters.propertyTypes.length === 1) {
        newSearchParams.set('propertyType', newFilters.propertyTypes[0].toLowerCase());
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

      router.replace(`?${newSearchParams.toString()}`, { scroll: false });
    },
    [refreshWithFilters, searchParams, router]
  );

  const handleSortChange = useCallback(
    (sortBy: string) => {
      const newFilters: PropertyFilterOptions = {
        ...filters,
        sortBy: sortBy as any,
        sortOrder:
          sortBy.startsWith("-") || sortBy === "createdAt"
            ? "desc"
            : "asc",
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

  // Handle URL params for type and propertyType
  useEffect(() => {
    const type = searchParams?.get('type');
    const propertyType = searchParams?.get('propertyType')?.toLowerCase();
    const searchTerm = searchParams?.get('searchTerm');
    const minSalePrice = searchParams?.get('minSalePrice');
    const maxSalePrice = searchParams?.get('maxSalePrice');
    const minBedrooms = searchParams?.get('minBedrooms');
    const minBathrooms = searchParams?.get('minBathrooms');
    const newFilters = { ...filters };

    if (type === 'sale') {
      newFilters.status = ['For Sale'];
    } else if (type === 'rent') {
      newFilters.status = ['For Rent'];
    } else if (type) {
      // wrong type, remove it
      const newSearchParams = new URLSearchParams(searchParams || undefined);
      newSearchParams.delete('type');
      router.replace(`?${newSearchParams.toString()}`, { scroll: false });
      newFilters.status = undefined;
    }

    // Valid property types
    const validPropertyTypes = ['house', 'apartment', 'villa', 'commercial', 'land'];
    if (propertyType && validPropertyTypes.includes(propertyType)) {
      newFilters.propertyTypes = [propertyType];
    } else if (propertyType) {
      // wrong propertyType, remove it
      const newSearchParams = new URLSearchParams(searchParams || undefined);
      newSearchParams.delete('propertyType');
      router.replace(`?${newSearchParams.toString()}`, { scroll: false });
      newFilters.propertyTypes = undefined;
    }

    if (searchTerm) {
      newFilters.searchTerm = searchTerm;
    }

    if (minSalePrice) {
      newFilters.minSalePrice = Number(minSalePrice);
    }

    if (maxSalePrice) {
      newFilters.maxSalePrice = Number(maxSalePrice);
    }

    if (minBedrooms) {
      newFilters.minBedrooms = Number(minBedrooms);
    }

    if (minBathrooms) {
      newFilters.minBathrooms = Number(minBathrooms);
    }

    setFilters(newFilters);
    refreshWithFilters(newFilters);
  }, [searchParams, router]);

  // ✅ SINGLE SOURCE OF TRUTH FOR RENDERING
  const hasVisibleProperties = properties.length > 0;

  return (
    <main className="main">
      {/* Page Title */}
      <div className="page-title">
        <div className="heading">
          <div className="container">
            <div className="row d-flex justify-content-center text-center">
              <div className="col-lg-8">
                <h1 className="heading-title">Properties</h1>
                <p className="mb-0">
                  Browse our collection of premium properties. Find your perfect
                  home, investment opportunity, or rental property from our
                  curated selection.
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
              <li className="current">Properties</li>
            </ol>
          </div>
        </nav>
      </div>

      {/* Properties Section */}
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
                      className={`btn btn-sm view-btn btn-outline-secondary ${viewType === "grid"
                        ? "active"
                        : ""
                        }`}
                      onClick={() => handleViewToggle("grid")}
                    >
                      <i className="bi bi-grid-3x3-gap"></i> Grid
                    </button>
                    {/* class="btn btn-outline-secondary btn-sm view-btn active" */}
                    <button
                      className={`btn btn-sm view-btn btn-outline-secondary ${viewType === "list"
                        ? "active"
                        : ""
                        }`}
                      onClick={() => handleViewToggle("list")}
                    >
                      <i className="bi bi-list"></i> List
                    </button>
                  </div>

                  <div className="d-flex align-items-center gap-3">
                    <span className="text-muted small">
                      {hasVisibleProperties
                        ? `${properties.length} properties shown`
                        : "No properties found"}
                    </span>

                    <select
                      className="form-select form-select-sm"
                      value={filters.sortBy || "createdAt"}
                      onChange={(e) => handleSortChange(e.target.value)}
                    >
                      <option value="createdAt">Sort by: Newest</option>
                      <option value="salePrice">Price: Low to High</option>
                      <option value="-salePrice">Price: High to Low</option>
                      <option value="buildingSize">
                        Size: Small to Large
                      </option>
                      <option value="-buildingSize">
                        Size: Large to Small
                      </option>
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

              {/* GRID */}
              {viewType === "grid" ? (
                <>
                  {!hasVisibleProperties && !loading ? (
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
                    <div className="row g-4
                    ">
                      {properties.map((property) => (
                        // <div key={property.id} className="col-lg-6">
                        // </div>
                        // <PropertyCardPremium key={property.id} data={property} isFavorited={isFavorited} toggleFavorite={toggleFavorite} />
                        <PropertyCardPremium key={property.id} data={property} />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <>
                  {!hasVisibleProperties && !loading ? (
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
                          // <div key={property.id} className="col-lg-6">
                          // </div>
                          <PropertyCardHorizontal key={property.id} data={property} className="list" />
                        ))}
                      </div>
                    </div>
                  )}
                </>

              )}

              {/* LOADING */}
              {loading && (
                <div className="text-center py-5">
                  <AppLoader />
                  {/* <div className="spinner-border text-primary" />
                  <p className="mt-2 text-muted">Loading properties...</p> */}
                </div>
              )}

              {/* LOAD MORE */}
              {hasMore && hasVisibleProperties && !loading && (
                <div className="text-center mt-5">
                  <button
                    className="btn btn-primary"
                    onClick={() => loadNextPage(filters)}
                  >
                    Load More ({pagination.pageSize} per page)
                  </button>
                </div>
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
    </main>
  );
}



// "use client";

// import PropertyCardPremium from "@/components/property/PropertyCard/PropertyCardPremium";
// // import NoSSrWrapper from '@/components/layout/NoSSRWrapper';
// import Image from "next/image";

// export default function Properties() {
//     return (
//         // <NoSSrWrapper>
//         <main className="main">
//             {/* <!-- Page Title --> */}
//             <div className="page-title">
//                 <div className="heading">
//                     <div className="container">
//                         <div className="row d-flex justify-content-center text-center">
//                             <div className="col-lg-8">
//                                 <h1 className="heading-title">Properties</h1>
//                                 <p className="mb-0">
//                                     Odio et unde deleniti. Deserunt numquam exercitationem. Officiis quo
//                                     odio sint voluptas consequatur ut a odio voluptatem. Sit dolorum
//                                     debitis veritatis natus dolores. Quasi ratione sint. Sit quaerat
//                                     ipsum dolorem.
//                                 </p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 <nav className="breadcrumbs">
//                     <div className="container">
//                         <ol>
//                             <li><a href="index.html">Home</a></li>
//                             <li className="current">Properties</li>
//                         </ol>
//                     </div>
//                 </nav>
//             </div>
//             {/* <!-- End Page Title --> */}

//             {/* <!-- Properties Section --> */}
//             <section id="properties" className="properties section">

//                 <div className="container" data-aos="fade-up" data-aos-delay="100">

//                     <div className="row">

//                         <div className="col-lg-8">

//                             <div className="properties-header mb-4">
//                                 <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
//                                     <div className="view-toggle d-flex gap-2">
//                                         <button className="btn btn-outline-secondary btn-sm view-btn active" data-view="grid">
//                                             <i className="bi bi-grid-3x3-gap"></i> Grid
//                                         </button>
//                                         <button className="btn btn-outline-secondary btn-sm view-btn" data-view="list">
//                                             <i className="bi bi-list"></i> List
//                                         </button>
//                                     </div>
//                                     <div className="sort-dropdown">
//                                         <select className="form-select form-select-sm">
//                                             <option>Sort by: Newest</option>
//                                             <option>Price: Low to High</option>
//                                             <option>Price: High to Low</option>
//                                             <option>Most Viewed</option>
//                                         </select>
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="properties-grid view-grid active" data-aos="fade-up" data-aos-delay="200">
//                                 <div className="row g-4">

//                                     {/* <div className="col-lg-6 col-md-6">
//                                         <div className="property-card">
//                                             <div className="property-image">
//                                                 <Image src="/img/real-estate/property-exterior-1.webp" alt="Modern Family Home" className="img-fluid" width={0} height={0} unoptimized />
//                                                 <div className="property-badges">
//                                                     <span className="badge featured">Featured</span>
//                                                     <span className="badge for-sale">For Sale</span>
//                                                 </div>
//                                                 <div className="property-overlay">
//                                                     <button className="favorite-btn"><i className="bi bi-heart"></i></button>
//                                                     <button className="gallery-btn" data-count="12"><i className="bi bi-images"></i></button>
//                                                 </div>
//                                             </div>
//                                             <div className="property-content">
//                                                 <div className="property-price">$875,000</div>
//                                                 <h4 className="property-title">Modern Family Home with Garden</h4>
//                                                 <p className="property-location"><i className="bi bi-geo-alt"></i> 2847 Oak Street, Beverly Hills, CA 90210</p>
//                                                 <div className="property-features">
//                                                     <span><i className="bi bi-house"></i> 4 Bed</span>
//                                                     <span><i className="bi bi-water"></i> 3 Bath</span>
//                                                     <span><i className="bi bi-arrows-angle-expand"></i> 2,400 sqft</span>
//                                                 </div>
//                                                 <div className="property-agent">
//                                                     <Image src="/img/real-estate/agent-1.webp" alt="Agent" className="agent-avatar" width={0} height={0} unoptimized />
//                                                     <div className="agent-info">
//                                                         <strong>Sarah Johnson</strong>
//                                                         <div className="agent-contact">
//                                                             <small><i className="bi bi-telephone"></i> +1 (555) 123-4567</small>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                                 <a href="#" className="btn btn-primary w-100">View Details</a>
//                                             </div>
//                                         </div>
//                                     </div> */}
//                                     <PropertyCardPremium
//                                     data={{
//                         id: "prop-002",
//                         images: ["/img/real-estate/property-exterior-6.webp"],
//                         title: "Seaside Villa with Infinity Pool",
//                         address: "Coronado, CA 92118",
//                         city: "Coronado",
//                         showAddress: false,
//                         bathrooms: 2,
//                         bedrooms: 2,
//                         buildingSize: 1450,
//                         sizeUnit: "ft2",
//                         salePrice: 3760000,
//                         description: "Praesent commodo cursus magna, fusce dapibus tellus ac cursus commodo, vestibulum id ligula porta felis euismod semper.",

//                         propertyType: "apartment",
//                         status: ["For Sale"],

//                         showAgent: false,

//                         hot: true,}}
//                                     ></PropertyCardPremium>
//                                     {/* <!-- End Property Item --> */}

//                                     <div className="col-lg-6 col-md-6">
//                                         <div className="property-card">
//                                             <div className="property-image">
//                                                 <Image src="/img/real-estate/property-exterior-3.webp" alt="Downtown Luxury Condo" className="img-fluid" width={0} height={0} unoptimized />
//                                                 <div className="property-badges">
//                                                     <span className="badge new">New</span>
//                                                     <span className="badge for-sale">For Sale</span>
//                                                 </div>
//                                                 <div className="property-overlay">
//                                                     <button className="favorite-btn"><i className="bi bi-heart"></i></button>
//                                                     <button className="gallery-btn" data-count="8"><i className="bi bi-images"></i></button>
//                                                 </div>
//                                             </div>
//                                             <div className="property-content">
//                                                 <div className="property-price">$1,250,000</div>
//                                                 <h4 className="property-title">Downtown Luxury Condominium</h4>
//                                                 <p className="property-location"><i className="bi bi-geo-alt"></i> 1542 Main Avenue, Manhattan, NY 10001</p>
//                                                 <div className="property-features">
//                                                     <span><i className="bi bi-house"></i> 2 Bed</span>
//                                                     <span><i className="bi bi-water"></i> 2 Bath</span>
//                                                     <span><i className="bi bi-arrows-angle-expand"></i> 1,800 sqft</span>
//                                                 </div>
//                                                 <div className="property-agent">
//                                                     <Image src="/img/real-estate/agent-3.webp" alt="Agent" className="agent-avatar" width={0} height={0} unoptimized />
//                                                     <div className="agent-info">
//                                                         <strong>Michael Chen</strong>
//                                                         <div className="agent-contact">
//                                                             <small><i className="bi bi-telephone"></i> +1 (555) 234-5678</small>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                                 <a href="#" className="btn btn-primary w-100">View Details</a>
//                                             </div>
//                                         </div>
//                                     </div>
//                                     {/* <!-- End Property Item --> */}

//                                     <div className="col-lg-6 col-md-6">
//                                         <div className="property-card">
//                                             <div className="property-image">
//                                                 <Image src="/img/real-estate/property-interior-4.webp" alt="Suburban Villa" className="img-fluid" width={0} height={0} unoptimized />
//                                                 <div className="property-badges">
//                                                     <span className="badge for-rent">For Rent</span>
//                                                 </div>
//                                                 <div className="property-overlay">
//                                                     <button className="favorite-btn"><i className="bi bi-heart"></i></button>
//                                                     <button className="gallery-btn" data-count="15"><i className="bi bi-images"></i></button>
//                                                 </div>
//                                             </div>
//                                             <div className="property-content">
//                                                 <div className="property-price">$4,500<span>/month</span></div>
//                                                 <h4 className="property-title">Spacious Suburban Villa</h4>
//                                                 <p className="property-location"><i className="bi bi-geo-alt"></i> 789 Pine Ridge Drive, Austin, TX 73301</p>
//                                                 <div className="property-features">
//                                                     <span><i className="bi bi-house"></i> 5 Bed</span>
//                                                     <span><i className="bi bi-water"></i> 4 Bath</span>
//                                                     <span><i className="bi bi-arrows-angle-expand"></i> 3,200 sqft</span>
//                                                 </div>
//                                                 <div className="property-agent">
//                                                     <Image src="/img/real-estate/agent-5.webp" alt="Agent" className="agent-avatar" width={0} height={0} unoptimized />
//                                                     <div className="agent-info">
//                                                         <strong>Emma Rodriguez</strong>
//                                                         <div className="agent-contact">
//                                                             <small><i className="bi bi-telephone"></i> +1 (555) 345-6789</small>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                                 <a href="#" className="btn btn-primary w-100">View Details</a>
//                                             </div>
//                                         </div>
//                                     </div>
//                                     {/* <!-- End Property Item --> */}

//                                     <div className="col-lg-6 col-md-6">
//                                         <div className="property-card">
//                                             <div className="property-image">
//                                                 <Image src="/img/real-estate/property-exterior-6.webp" alt="Waterfront Townhouse" className="img-fluid" width={0} height={0} unoptimized />
//                                                 <div className="property-badges">
//                                                     <span className="badge open-house">Open House</span>
//                                                     <span className="badge for-sale">For Sale</span>
//                                                 </div>
//                                                 <div className="property-overlay">
//                                                     <button className="favorite-btn"><i className="bi bi-heart"></i></button>
//                                                     <button className="gallery-btn" data-count="20"><i className="bi bi-images"></i></button>
//                                                 </div>
//                                             </div>
//                                             <div className="property-content">
//                                                 <div className="property-price">$695,000</div>
//                                                 <h4 className="property-title">Waterfront Townhouse with Dock</h4>
//                                                 <p className="property-location"><i className="bi bi-geo-alt"></i> 456 Harbor View Lane, Miami, FL 33101</p>
//                                                 <div className="property-features">
//                                                     <span><i className="bi bi-house"></i> 3 Bed</span>
//                                                     <span><i className="bi bi-water"></i> 2 Bath</span>
//                                                     <span><i className="bi bi-arrows-angle-expand"></i> 2,100 sqft</span>
//                                                 </div>
//                                                 <div className="property-agent">
//                                                     <Image src="/img/real-estate/agent-7.webp" alt="Agent" className="agent-avatar" width={0} height={0} unoptimized />
//                                                     <div className="agent-info">
//                                                         <strong>David Williams</strong>
//                                                         <div className="agent-contact">
//                                                             <small><i className="bi bi-telephone"></i> +1 (555) 456-7890</small>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                                 <a href="#" className="btn btn-primary w-100">View Details</a>
//                                             </div>
//                                         </div>
//                                     </div>
//                                     {/* <!-- End Property Item --> */}

//                                 </div>
//                             </div>

//                             <div className="properties-list view-list" data-aos="fade-up" data-aos-delay="200">

//                                 <div className="property-list-item">
//                                     <div className="row align-items-center">
//                                         <div className="col-lg-4">
//                                             <div className="property-image">
//                                                 <Image src="/img/real-estate/property-exterior-1.webp" alt="Modern Family Home" className="img-fluid" width={0} height={0} unoptimized />
//                                                 <div className="property-badges">
//                                                     <span className="badge featured">Featured</span>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         <div className="col-lg-8">
//                                             <div className="property-content">
//                                                 <div className="d-flex justify-content-between align-items-start mb-2">
//                                                     <div>
//                                                         <h4 className="property-title mb-1">Modern Family Home with Garden</h4>
//                                                         <p className="property-location mb-2"><i className="bi bi-geo-alt"></i> 2847 Oak Street, Beverly Hills, CA 90210</p>
//                                                     </div>
//                                                     <div className="property-price">$875,000</div>
//                                                 </div>
//                                                 <div className="property-features mb-3">
//                                                     <span><i className="bi bi-house"></i> 4 Bed</span>
//                                                     <span><i className="bi bi-water"></i> 3 Bath</span>
//                                                     <span><i className="bi bi-arrows-angle-expand"></i> 2,400 sqft</span>
//                                                 </div>
//                                                 <div className="d-flex justify-content-between align-items-center">
//                                                     <div className="property-agent">
//                                                         <Image src="/img/real-estate/agent-1.webp" alt="Agent" className="agent-avatar" width={0} height={0} unoptimized />
//                                                         <span>Sarah Johnson</span>
//                                                     </div>
//                                                     <div className="property-actions">
//                                                         <button className="btn btn-outline-secondary btn-sm"><i className="bi bi-heart"></i></button>
//                                                         <a href="#" className="btn btn-primary btn-sm">View Details</a>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 {/* <!-- End Property List Item --> */}

//                                 <div className="property-list-item">
//                                     <div className="row align-items-center">
//                                         <div className="col-lg-4">
//                                             <div className="property-image">
//                                                 <Image src="/img/real-estate/property-exterior-3.webp" alt="Downtown Luxury Condo" className="img-fluid" width={0} height={0} unoptimized />
//                                                 <div className="property-badges">
//                                                     <span className="badge new">New</span>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         <div className="col-lg-8">
//                                             <div className="property-content">
//                                                 <div className="d-flex justify-content-between align-items-start mb-2">
//                                                     <div>
//                                                         <h4 className="property-title mb-1">Downtown Luxury Condominium</h4>
//                                                         <p className="property-location mb-2"><i className="bi bi-geo-alt"></i> 1542 Main Avenue, Manhattan, NY 10001</p>
//                                                     </div>
//                                                     <div className="property-price">$1,250,000</div>
//                                                 </div>
//                                                 <div className="property-features mb-3">
//                                                     <span><i className="bi bi-house"></i> 2 Bed</span>
//                                                     <span><i className="bi bi-water"></i> 2 Bath</span>
//                                                     <span><i className="bi bi-arrows-angle-expand"></i> 1,800 sqft</span>
//                                                 </div>
//                                                 <div className="d-flex justify-content-between align-items-center">
//                                                     <div className="property-agent">
//                                                         <Image src="/img/real-estate/agent-3.webp" alt="Agent" className="agent-avatar" width={0} height={0} unoptimized />
//                                                         <span>Michael Chen</span>
//                                                     </div>
//                                                     <div className="property-actions">
//                                                         <button className="btn btn-outline-secondary btn-sm"><i className="bi bi-heart"></i></button>
//                                                         <a href="#" className="btn btn-primary btn-sm">View Details</a>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 {/* <!-- End Property List Item --> */}

//                                 <div className="property-list-item">
//                                     <div className="row align-items-center">
//                                         <div className="col-lg-4">
//                                             <div className="property-image">
//                                                 <Image src="/img/real-estate/property-interior-4.webp" alt="Suburban Villa" className="img-fluid" width={0} height={0} unoptimized />
//                                                 <div className="property-badges">
//                                                     <span className="badge for-rent">For Rent</span>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         <div className="col-lg-8">
//                                             <div className="property-content">
//                                                 <div className="d-flex justify-content-between align-items-start mb-2">
//                                                     <div>
//                                                         <h4 className="property-title mb-1">Spacious Suburban Villa</h4>
//                                                         <p className="property-location mb-2"><i className="bi bi-geo-alt"></i> 789 Pine Ridge Drive, Austin, TX 73301</p>
//                                                     </div>
//                                                     <div className="property-price">$4,500<span>/month</span></div>
//                                                 </div>
//                                                 <div className="property-features mb-3">
//                                                     <span><i className="bi bi-house"></i> 5 Bed</span>
//                                                     <span><i className="bi bi-water"></i> 4 Bath</span>
//                                                     <span><i className="bi bi-arrows-angle-expand"></i> 3,200 sqft</span>
//                                                 </div>
//                                                 <div className="d-flex justify-content-between align-items-center">
//                                                     <div className="property-agent">
//                                                         <Image src="/img/real-estate/agent-5.webp" alt="Agent" className="agent-avatar" width={0} height={0} unoptimized />
//                                                         <span>Emma Rodriguez</span>
//                                                     </div>
//                                                     <div className="property-actions">
//                                                         <button className="btn btn-outline-secondary btn-sm"><i className="bi bi-heart"></i></button>
//                                                         <a href="#" className="btn btn-primary btn-sm">View Details</a>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 {/* <!-- End Property List Item --> */}

//                                 <div className="property-list-item">
//                                     <div className="row align-items-center">
//                                         <div className="col-lg-4">
//                                             <div className="property-image">
//                                                 <Image src="/img/real-estate/property-exterior-6.webp" alt="Waterfront Townhouse" className="img-fluid" width={0} height={0} unoptimized />
//                                                 <div className="property-badges">
//                                                     <span className="badge open-house">Open House</span>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         <div className="col-lg-8">
//                                             <div className="property-content">
//                                                 <div className="d-flex justify-content-between align-items-start mb-2">
//                                                     <div>
//                                                         <h4 className="property-title mb-1">Waterfront Townhouse with Dock</h4>
//                                                         <p className="property-location mb-2"><i className="bi bi-geo-alt"></i> 456 Harbor View Lane, Miami, FL 33101</p>
//                                                     </div>
//                                                     <div className="property-price">$695,000</div>
//                                                 </div>
//                                                 <div className="property-features mb-3">
//                                                     <span><i className="bi bi-house"></i> 3 Bed</span>
//                                                     <span><i className="bi bi-water"></i> 2 Bath</span>
//                                                     <span><i className="bi bi-arrows-angle-expand"></i> 2,100 sqft</span>
//                                                 </div>
//                                                 <div className="d-flex justify-content-between align-items-center">
//                                                     <div className="property-agent">
//                                                         <Image src="/img/real-estate/agent-7.webp" alt="Agent" className="agent-avatar" width={0} height={0} unoptimized />
//                                                         <span>David Williams</span>
//                                                     </div>
//                                                     <div className="property-actions">
//                                                         <button className="btn btn-outline-secondary btn-sm"><i className="bi bi-heart"></i></button>
//                                                         <a href="#" className="btn btn-primary btn-sm">View Details</a>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 {/* <!-- End Property List Item --> */}

//                             </div>

//                             <nav className="mt-5" data-aos="fade-up" data-aos-delay="300">
//                                 <ul className="pagination justify-content-center">
//                                     <li className="page-item disabled">
//                                         <a className="page-link" href="#" tab-index="-1">Previous</a>
//                                     </li>
//                                     <li className="page-item active"><a className="page-link" href="#">1</a></li>
//                                     <li className="page-item"><a className="page-link" href="#">2</a></li>
//                                     <li className="page-item"><a className="page-link" href="#">3</a></li>
//                                     <li className="page-item">
//                                         <a className="page-link" href="#">Next</a>
//                                     </li>
//                                 </ul>
//                             </nav>

//                         </div>

//                         <div className="col-lg-4" data-aos="fade-up" data-aos-delay="200">

//                             <div className="properties-sidebar">

//                                 <div className="filter-widget">
//                                     <h5 className="filter-title">Filter Properties</h5>

//                                     <div className="filter-section">
//                                         <label className="form-label">Property Type</label>
//                                         <select className="form-select">
//                                             <option>All Types</option>
//                                             <option>House</option>
//                                             <option>Apartment</option>
//                                             <option>Condo</option>
//                                             <option>Townhouse</option>
//                                             <option>Commercial</option>
//                                         </select>
//                                     </div>

//                                     <div className="filter-section">
//                                         <label className="form-label">Price Range</label>
//                                         <div className="row g-2">
//                                             <div className="col-6">
//                                                 <input type="number" className="form-control" placeholder="Min Price" />
//                                             </div>
//                                             <div className="col-6">
//                                                 <input type="number" className="form-control" placeholder="Max Price" />
//                                             </div>
//                                         </div>
//                                     </div>

//                                     <div className="filter-section">
//                                         <label className="form-label">Bedrooms</label>
//                                         <div className="bedroom-filter">
//                                             <button className="btn btn-outline-secondary btn-sm filter-btn active">Any</button>
//                                             <button className="btn btn-outline-secondary btn-sm filter-btn">1+</button>
//                                             <button className="btn btn-outline-secondary btn-sm filter-btn">2+</button>
//                                             <button className="btn btn-outline-secondary btn-sm filter-btn">3+</button>
//                                             <button className="btn btn-outline-secondary btn-sm filter-btn">4+</button>
//                                         </div>
//                                     </div>

//                                     <div className="filter-section">
//                                         <label className="form-label">Bathrooms</label>
//                                         <div className="bathroom-filter">
//                                             <button className="btn btn-outline-secondary btn-sm filter-btn active">Any</button>
//                                             <button className="btn btn-outline-secondary btn-sm filter-btn">1+</button>
//                                             <button className="btn btn-outline-secondary btn-sm filter-btn">2+</button>
//                                             <button className="btn btn-outline-secondary btn-sm filter-btn">3+</button>
//                                         </div>
//                                     </div>

//                                     <div className="filter-section">
//                                         <label className="form-label">Location</label>
//                                         <input type="text" className="form-control" placeholder="Enter city or neighborhood" />
//                                     </div>

//                                     <div className="filter-section">
//                                         <label className="form-label">Features</label>
//                                         <div className="features-filter">
//                                             <div className="form-check">
//                                                 <input className="form-check-input" type="checkbox" id="garage" />
//                                                 <label className="form-check-label" htmlFor="garage">Garage</label>
//                                             </div>
//                                             <div className="form-check">
//                                                 <input className="form-check-input" type="checkbox" id="pool" />
//                                                 <label className="form-check-label" htmlFor="pool">Swimming Pool</label>
//                                             </div>
//                                             <div className="form-check">
//                                                 <input className="form-check-input" type="checkbox" id="balcony" />
//                                                 <label className="form-check-label" htmlFor="balcony">Balcony</label>
//                                             </div>
//                                             <div className="form-check">
//                                                 <input className="form-check-input" type="checkbox" id="garden" />
//                                                 <label className="form-check-label" htmlFor="garden">Garden</label>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     <button className="btn btn-primary w-100">Apply Filters</button>

//                                 </div>

//                                 <div className="featured-properties mt-4">
//                                     <h5>Featured Properties</h5>

//                                     <div className="featured-item">
//                                         <div className="row g-3 align-items-center">
//                                             <div className="col-5">
//                                                 <img src="/img/real-estate/property-exterior-8.webp" alt="Property" className="img-fluid rounded"/>
//                                             </div>
//                                             <div className="col-7">
//                                                 <h6 className="mb-1">Luxury Penthouse</h6>
//                                                 <p className="text-muted small mb-1">Manhattan, NY</p>
//                                                 <strong className="text-primary">$2,850,000</strong>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     <div className="featured-item">
//                                         <div className="row g-3 align-items-center">
//                                             <div className="col-5">
//                                                 <img src="/img/real-estate/property-interior-7.webp" alt="Property" className="img-fluid rounded"/>
//                                             </div>
//                                             <div className="col-7">
//                                                 <h6 className="mb-1">Modern Studio</h6>
//                                                 <p className="text-muted small mb-1">Brooklyn, NY</p>
//                                                 <strong className="text-primary">$3,200/mo</strong>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     <div className="featured-item">
//                                         <div className="row g-3 align-items-center">
//                                             <div className="col-5">
//                                                 <img src="/img/real-estate/property-exterior-9.webp" alt="Property" className="img-fluid rounded"/>
//                                             </div>
//                                             <div className="col-7">
//                                                 <h6 className="mb-1">Family Home</h6>
//                                                 <p className="text-muted small mb-1">Queens, NY</p>
//                                                 <strong className="text-primary">$895,000</strong>
//                                             </div>
//                                         </div>
//                                     </div>

//                                 </div>

//                             </div>

//                         </div>

//                     </div>

//                 </div>

//             </section>
//             {/* <!-- /Properties Section --> */}
//         </main>
//         // </NoSSrWrapper>
//     );
// }