// // components/property/PropertyFilters.tsx
// "use client";

// import { useState, useEffect } from 'react';
// // import { PropertyFilterOptions, PropertyStats } from '@/services/PropertyService';
// import { PropertyFilterOptions, PropertyStats } from '@/services/PropertyServiceSupabase';

// interface PropertyFiltersProps {
//   filters: PropertyFilterOptions;
//   onChange: (filters: PropertyFilterOptions) => void;
//   stats?: PropertyStats | null;
// }

// export default function PropertyFilters({ filters, onChange, stats }: PropertyFiltersProps) {
//   // const [localFilters, setLocalFilters] = useState<PropertyFilterOptions>(filters);
//   // const [viewType, setViewType] = useState<'grid' | 'list'>('grid');

//   const [searchTerm, setSearchTerm] = useState<string>('');

//   const [saleMinPrice, setSaleMinPrice] = useState<string>('');
//   const [saleMaxPrice, setSaleMaxPrice] = useState<string>('');
//   const [rentMinPrice, setRentMinPrice] = useState<string>('');
//   const [rentMaxPrice, setRentMaxPrice] = useState<string>('');


//   // Sync localFilters with filters prop
//   useEffect(() => {
//     // setLocalFilters(filters);

//     // Update price inputs
//     setSaleMinPrice(filters.minSalePrice?.toString() || '');
//     setSaleMaxPrice(filters.maxSalePrice?.toString() || '');
//     setRentMinPrice(filters.minRentPrice?.toString() || '');
//     setRentMaxPrice(filters.maxRentPrice?.toString() || '');

//     // Update search term
//     setSearchTerm(filters.searchTerm || '');
//   }, [filters]);


//   // Property types
//   const propertyTypes = [
//     { value: 'house', label: 'House' },
//     { value: 'apartment', label: 'Apartment' },
//     { value: 'villa', label: 'Villa' },
//     { value: 'commercial', label: 'Commercial' },
//     { value: 'land', label: 'Land' },
//   ];

//   // Status options
//   const statusOptions = [
//     { value: 'For Sale', label: 'For Sale' },
//     { value: 'For Rent', label: 'For Rent' },
//     { value: 'Sold', label: 'Sold' },
//   ];

//   // Bedroom options
//   const bedroomOptions = ['Any', '1+', '2+', '3+', '4+', '5+'];
//   const bathroomOptions = ['Any', '1+', '2+', '3+', '4+'];

//   // Available cities from stats
//   const availableCities = stats?.cities || [];

//   // // Handle filter change
//   // const handleFilterChange = (key: keyof PropertyFilterOptions, value: any) => {
//   //   const newFilters = { ...filters, [key]: value };
//   //   // setfilters(newFilters);
//   //   onChange(newFilters);
//   // };
//   const handleFilterChange = (key: keyof PropertyFilterOptions, value: any) => {
//     const newFilters = { ...filters, [key]: value };

//     if (value === undefined) {
//       delete (newFilters as any)[key];
//     }

//     onChange(newFilters);
//   };


//   // Handle array filter changes (like propertyTypes)
//   const handleArrayFilterChange = (key: keyof PropertyFilterOptions, value: string, isChecked: boolean) => {
//     const currentArray = (filters[key] as string[]) || [];
//     let newArray: string[];

//     if (isChecked) {
//       newArray = [...currentArray, value];
//     } else {
//       newArray = currentArray.filter(item => item !== value);
//     }
//     // console.log('Updated array filter:', newArray);

//     handleFilterChange(key, newArray.length > 0 ? newArray : undefined);
//   };

//   // Reset all filters
//   const handleReset = () => {
//     const resetFilters: PropertyFilterOptions = {};
//     // setLocalFilters(resetFilters);
//     onChange(resetFilters);
//   };

//   // // Handle numeric range filter
//   // const handleNumericFilter = (minKey: keyof PropertyFilterOptions, maxKey: keyof PropertyFilterOptions, minValue?: number, maxValue?: number) => {
//   //   const newFilters = { ...filters };

//   //   if (minValue !== undefined) {
//   //     (newFilters as any)[minKey] = minValue;
//   //   } else {
//   //     delete (newFilters as any)[minKey];
//   //   }

//   //   if (maxValue !== undefined) {
//   //     (newFilters as any)[maxKey] = maxValue;
//   //   } else {
//   //     delete (newFilters as any)[maxKey];
//   //   }

//   //   // setLocalFilters(newFilters);
//   //   onChange(newFilters);
//   // };
//   // const handleNumericFilter = (
//   //   minKey: keyof PropertyFilterOptions,
//   //   maxKey: keyof PropertyFilterOptions,
//   //   minValue?: number,
//   //   maxValue?: number
//   // ) => {
//   //   const newFilters = { ...filters };

//   //   minValue !== undefined
//   //     ? (newFilters as any)[minKey] = minValue
//   //     : delete (newFilters as any)[minKey];

//   //   maxValue !== undefined
//   //     ? (newFilters as any)[maxKey] = maxValue
//   //     : delete (newFilters as any)[maxKey];

//   //   onChange(newFilters);
//   // };
//   const handleNumericFilter = (
//     minKey: keyof PropertyFilterOptions,
//     maxKey: keyof PropertyFilterOptions,
//     minValue?: number,
//     maxValue?: number
//   ) => {
//     const newFilters = { ...filters };

//     if (minValue !== undefined) {
//       (newFilters as any)[minKey] = minValue;
//     } else {
//       delete (newFilters as any)[minKey];
//     }

//     if (maxValue !== undefined) {
//       (newFilters as any)[maxKey] = maxValue;
//     } else {
//       delete (newFilters as any)[maxKey];
//     }

//     onChange(newFilters);
//   };

//   // Handle bedroom filter
//   // const handleBedroomFilter = (value: string) => {
//   //   if (value === 'Any') {
//   //     handleFilterChange('minBedrooms', undefined);
//   //     handleFilterChange('maxBedrooms', undefined);
//   //   } else {
//   //     const minBedrooms = parseInt(value.replace('+', ''));
//   //     handleFilterChange('minBedrooms', minBedrooms);
//   //   }
//   // };
//   const handleBedroomFilter = (value: string) => {
//     if (value === 'Any') {
//       // Clear both min and max bedroom filters
//       const newFilters = { ...filters };
//       delete newFilters.minBedrooms;
//       delete newFilters.maxBedrooms;
//       // setLocalFilters(newFilters);
//       onChange(newFilters);
//     } else {
//       const minBedrooms = parseInt(value.replace('+', ''));
//       handleFilterChange('minBedrooms', minBedrooms);
//     }
//   };

//   // Handle bathroom filter
//   // const handleBathroomFilter = (value: string) => {
//   //   if (value === 'Any') {
//   //     handleFilterChange('minBathrooms', undefined);
//   //     handleFilterChange('maxBathrooms', undefined);
//   //   } else {
//   //     const minBathrooms = parseInt(value.replace('+', ''));
//   //     handleFilterChange('minBathrooms', minBathrooms);
//   //   }
//   // };
//   const handleBathroomFilter = (value: string) => {
//     if (value === 'Any') {
//       // Clear both min and max bathroom filters
//       const newFilters = { ...filters };
//       delete newFilters.minBathrooms;
//       delete newFilters.maxBathrooms;
//       // setLocalFilters(newFilters);
//       onChange(newFilters);
//     } else {
//       const minBathrooms = parseInt(value.replace('+', ''));
//       handleFilterChange('minBathrooms', minBathrooms);
//     }
//   };

//   // Handle features filter
//   const handleFeatureFilter = (feature: 'hasPool' | 'hasGarage' | 'hasGarden', value: boolean) => {
//     handleFilterChange(feature, value);
//   };

//   return (
//     <div className="properties-sidebar">
//       <div className="filter-widget">
//         <div className="d-flex justify-content-between align-items-center mb-3">
//           <h5 className="filter-title mb-0">Filter Properties</h5>
//           <button
//             className="btn btn-sm btn-outline-secondary"
//             onClick={handleReset}
//             disabled={Object.keys(filters).length === 0}
//           >
//             Clear All
//           </button>
//         </div>

//         {/* Search Filter */}
//         <div className="filter-section mb-4">
//           <label className="form-label fw-semibold mb-2">Search Properties</label>
//           <input
//             type="text"
//             className="form-control"
//             placeholder="Search by title, description, location..."
//             value={searchTerm}
//             onChange={(e) => {
//               const value = e.target.value;
//               setSearchTerm(value);
//               handleFilterChange('searchTerm', value || undefined);
//             }}
//           />
//         </div>

//         {/* Property Type Filter */}
//         <div className="filter-section mb-4">
//           <label className="form-label fw-semibold mb-2">Property Type</label>
//           <div className="property-type-filter">
//             <div className="form-check mb-2">
//               <input
//                 className="form-check-input"
//                 type="checkbox"
//                 id="type-all"
//                 checked={!filters.propertyTypes || filters.propertyTypes.length === 0}
//                 onChange={(e) => handleFilterChange('propertyTypes', undefined)}
//               />
//               <label className="form-check-label" htmlFor="type-all">
//                 All Types
//               </label>
//             </div>
//             {propertyTypes.map((type) => (
//               <div className="form-check mb-2" key={type.value}>
//                 <input
//                   className="form-check-input"
//                   type="checkbox"
//                   id={`type-${type.value}`}
//                   checked={filters.propertyTypes?.includes(type.value) || false}
//                   onChange={(e) =>
//                     handleArrayFilterChange('propertyTypes', type.value, e.target.checked)
//                   }
//                 />
//                 <label className="form-check-label" htmlFor={`type-${type.value}`}>
//                   {type.label}
//                 </label>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Status Filter */}
//         <div className="filter-section mb-4">
//           <label className="form-label fw-semibold mb-2">Status</label>
//           <div className="status-filter">
//             {statusOptions.map((status) => (
//               <div className="form-check mb-2" key={status.value}>
//                 <input
//                   className="form-check-input"
//                   type="checkbox"
//                   id={`status-${status.value}`}
//                   checked={filters.status?.includes(status.value as any) || false}
//                   onChange={(e) =>
//                     handleArrayFilterChange('status', status.value, e.target.checked)
//                   }
//                 />
//                 <label className="form-check-label" htmlFor={`status-${status.value}`}>
//                   {status.label}
//                 </label>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Price Range Filter */}
//         <div className="filter-section mb-4">
//           <label className="form-label fw-semibold mb-2">Price Range</label>

//           {/* Sale Price Range */}
//           <div className="mb-3">
//             <label className="form-label small fw-semibold mb-1">For Sale</label>
//             <div className="row g-2">
//               <div className="col-6">
//                 <input
//                   type="number"
//                   className="form-control form-control-sm"
//                   placeholder="Min Sale Price"
//                   // value={saleMinPrice}
//                   value={filters.minSalePrice ?? ''}
//                   // onChange={(e) => {
//                   //   const raw = e.target.value;
//                   //   setSaleMinPrice(raw);
//                   //   const value = raw === '' ? undefined : Number(raw);
//                   //   handleNumericFilter('minSalePrice', 'maxSalePrice', value, filters.maxSalePrice);
//                   // }}
//                   onChange={(e) => {
//                     const value = e.target.value === '' ? undefined : Number(e.target.value);
//                     handleNumericFilter('minSalePrice', 'maxSalePrice', value, filters.maxSalePrice);
//                   }}


//                 />
//               </div>
//               <div className="col-6">
//                 <input
//                   type="number"
//                   className="form-control form-control-sm"
//                   placeholder="Max Sale Price"
//                   value={saleMaxPrice}
//                   onChange={(e) => {
//                     const raw = e.target.value;
//                     setSaleMaxPrice(raw);
//                     const value = raw === '' ? undefined : Number(raw);
//                     handleNumericFilter('minSalePrice', 'maxSalePrice', filters.minSalePrice, value);
//                   }}
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Rent Price Range */}
//           <div>
//             <label className="form-label small fw-semibold mb-1">For Rent</label>
//             <div className="row g-2">
//               <div className="col-6">
//                 <input
//                   type="number"
//                   className="form-control form-control-sm"
//                   placeholder="Min Rent Price"
//                   value={rentMinPrice}
//                   onChange={(e) => {
//                     const raw = e.target.value;
//                     setRentMinPrice(raw);
//                     const value = raw === '' ? undefined : Number(raw);
//                     handleNumericFilter('minRentPrice', 'maxRentPrice', value, filters.maxRentPrice);
//                   }}
//                 />
//               </div>
//               <div className="col-6">
//                 <input
//                   type="number"
//                   className="form-control form-control-sm"
//                   placeholder="Max Rent Price"
//                   value={rentMaxPrice}
//                   onChange={(e) => {
//                     const raw = e.target.value;
//                     setRentMaxPrice(raw);
//                     const value = raw === '' ? undefined : Number(raw);
//                     handleNumericFilter('minRentPrice', 'maxRentPrice', filters.minRentPrice, value);
//                   }}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Bedrooms Filter */}
//         <div className="filter-section mb-4">
//           <label className="form-label fw-semibold mb-2">Bedrooms</label>
//           <div className="bedroom-filter d-flex flex-wrap gap-2">
//             {/* {bedroomOptions.map((option) => {
//               const isActive = option === 'Any'
//                 ? !filters.minBedrooms
//                 : filters.minBedrooms === parseInt(option.replace('+', ''));

//               return (
//                 <button
//                   key={option}
//                   className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-outline-secondary'}`}
//                   onClick={() => handleBedroomFilter(option)}
//                 >
//                   {option}
//                 </button>
//               );
//             })} */}
//             {bedroomOptions.map((option) => {
//               const isActive = option === 'Any'
//                 ? !filters.minBedrooms && !filters.maxBedrooms // Check both
//                 : filters.minBedrooms === parseInt(option.replace('+', ''));

//               return (
//                 <button
//                   key={option}
//                   className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-outline-secondary'}`}
//                   onClick={() => handleBedroomFilter(option)}
//                 >
//                   {option}
//                 </button>
//               );
//             })}
//           </div>
//         </div>

//         {/* Bathrooms Filter */}
//         <div className="filter-section mb-4">
//           <label className="form-label fw-semibold mb-2">Bathrooms</label>
//           <div className="bathroom-filter d-flex flex-wrap gap-2">
//             {bathroomOptions.map((option) => {
//               const isActive = option === 'Any'
//                 ? !filters.minBathrooms
//                 : filters.minBathrooms === parseInt(option.replace('+', ''));

//               return (
//                 <button
//                   key={option}
//                   className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-outline-secondary'}`}
//                   onClick={() => handleBathroomFilter(option)}
//                 >
//                   {option}
//                 </button>
//               );
//             })}
//           </div>
//         </div>

//         {/* Location Filter */}
//         <div className="filter-section mb-4">
//           <label className="form-label fw-semibold mb-2">Location</label>
//           <select
//             className="form-select form-select-sm"
//             value={filters.cities?.[0] || ''}
//             onChange={(e) => handleFilterChange('cities', e.target.value ? [e.target.value] : undefined)}
//           >
//             <option value="">All Cities</option>
//             {availableCities.map((city) => (
//               <option key={city} value={city}>
//                 {city}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Size Filter */}
//         <div className="filter-section mb-4">
//           <label className="form-label fw-semibold mb-2">Size Range</label>
//           <div className="row g-2">
//             <div className="col-6">
//               <input
//                 type="number"
//                 className="form-control form-control-sm"
//                 placeholder="Min Size"
//                 value={filters.minBuildingSize || filters.minLandSize || ''}
//                 onChange={(e) => {
//                   const value = e.target.value ? parseInt(e.target.value) : undefined;
//                   handleNumericFilter('minBuildingSize', 'maxBuildingSize', value, filters.maxBuildingSize);
//                 }}
//               />
//             </div>
//             <div className="col-6">
//               <input
//                 type="number"
//                 className="form-control form-control-sm"
//                 placeholder="Max Size"
//                 value={filters.maxBuildingSize || filters.maxLandSize || ''}
//                 onChange={(e) => {
//                   const value = e.target.value ? parseInt(e.target.value) : undefined;
//                   handleNumericFilter('minBuildingSize', 'maxBuildingSize', filters.minBuildingSize, value);
//                 }}
//               />
//             </div>
//           </div>
//         </div>

//         {/* Features Filter */}
//         <div className="filter-section mb-4">
//           <label className="form-label fw-semibold mb-2">Features</label>
//           <div className="features-filter">
//             <div className="form-check mb-2">
//               <input
//                 className="form-check-input"
//                 type="checkbox"
//                 id="has-pool"
//                 // checked={localFilters.hasPool || false}
//                 checked={filters.hasPool || false}
//                 onChange={(e) => handleFeatureFilter('hasPool', e.target.checked)}
//               />
//               <label className="form-check-label" htmlFor="has-pool">
//                 Swimming Pool
//               </label>
//             </div>
//             <div className="form-check mb-2">
//               <input
//                 className="form-check-input"
//                 type="checkbox"
//                 id="has-garage"
//                 // checked={localFilters.hasGarage || false}
//                 checked={filters.hasGarage || false}
//                 onChange={(e) => handleFeatureFilter('hasGarage', e.target.checked)}
//               />
//               <label className="form-check-label" htmlFor="has-garage">
//                 Garage
//               </label>
//             </div>
//             <div className="form-check mb-2">
//               <input
//                 className="form-check-input"
//                 type="checkbox"
//                 id="has-garden"
//                 checked={filters.hasGarden || false}
//                 onChange={(e) => handleFeatureFilter('hasGarden', e.target.checked)}
//               />
//               <label className="form-check-label" htmlFor="has-garden">
//                 Garden
//               </label>
//             </div>
//           </div>
//         </div>

//         {/* Labels Filter */}
//         <div className="filter-section mb-4">
//           <label className="form-label fw-semibold mb-2">Property Labels</label>
//           <div className="labels-filter">
//             <div className="form-check mb-2">
//               <input
//                 className="form-check-input"
//                 type="checkbox"
//                 id="hot-label"
//                 checked={filters.hot || false}
//                 onChange={(e) => handleFilterChange('hot', e.target.checked)}
//               />
//               <label className="form-check-label" htmlFor="hot-label">
//                 Hot Property
//               </label>
//             </div>
//             <div className="form-check mb-2">
//               <input
//                 className="form-check-input"
//                 type="checkbox"
//                 id="featured-label"
//                 checked={filters.featured || false}
//                 onChange={(e) => handleFilterChange('featured', e.target.checked)}
//               />
//               <label className="form-check-label" htmlFor="featured-label">
//                 Featured
//               </label>
//             </div>
//             <div className="form-check mb-2">
//               <input
//                 className="form-check-input"
//                 type="checkbox"
//                 id="new-label"
//                 checked={filters.newListing || false}
//                 onChange={(e) => handleFilterChange('newListing', e.target.checked)}
//               />
//               <label className="form-check-label" htmlFor="new-label">
//                 New Listing
//               </label>
//             </div>
//           </div>
//         </div>

//         {/* Apply Filters Button */}
//         <button
//           className="btn btn-primary w-100 mt-3"
//           onClick={() => onChange(filters)}
//         >
//           Apply Filters ({Object.keys(filters).length})
//         </button>
//       </div>

//       {/* Featured Properties Section */}
//       {stats && (
//         <div className="featured-properties mt-4">
//           <h5 className="mb-3">Market Overview</h5>

//           <div className="market-stats mb-4">
//             <div className="d-flex justify-content-between mb-2">
//               <span className="text-muted">Total Properties:</span>
//               <strong>{stats.totalProperties}</strong>
//             </div>
//             <div className="d-flex justify-content-between mb-2">
//               <span className="text-muted">For Sale:</span>
//               <strong>{stats.forSaleCount}</strong>
//             </div>
//             <div className="d-flex justify-content-between mb-2">
//               <span className="text-muted">For Rent:</span>
//               <strong>{stats.forRentCount}</strong>
//             </div>
//             <div className="d-flex justify-content-between mb-2">
//               <span className="text-muted">Avg Sale Price:</span>
//               <strong>${stats.averageSalePrice.toLocaleString()}</strong>
//             </div>
//           </div>

//           <h6 className="mb-2">Popular Cities</h6>
//           <div className="popular-cities">
//             {stats.cities.slice(0, 5).map((city, index) => (
//               <div key={city} className="d-flex justify-content-between mb-1">
//                 <span className="small">{city}</span>
//                 {/* <span className="small text-muted">
//                   {stats.propertyTypes[city.toLowerCase()] || 0} properties
//                 </span> */}
//                 <span className="small text-muted">
//                   {stats.cityCounts?.[city] || 0} properties
//                 </span>

//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }








// components/property/PropertyFilters.tsx
"use client";

import { useState } from 'react';
import { PropertyFilterOptions, PropertyStats } from '@/services/PropertyServiceSupabase';

interface PropertyFiltersProps {
  filters: PropertyFilterOptions;
  onChange: (filters: PropertyFilterOptions) => void;
  stats?: PropertyStats | null;
}

export default function PropertyFilters({ filters, onChange, stats }: PropertyFiltersProps) {
  // Remove all local price state - we'll use filters directly
  const [searchTerm, setSearchTerm] = useState<string>(filters.searchTerm || '');

  // Property types
  const propertyTypes = [
    { value: 'house', label: 'House' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'villa', label: 'Villa' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'land', label: 'Land' },
  ];

  // Status options
  const statusOptions = [
    { value: 'For Sale', label: 'For Sale' },
    { value: 'For Rent', label: 'For Rent' },
    { value: 'Sold', label: 'Sold' },
  ];

  // Bedroom options
  const bedroomOptions = ['Any', '1+', '2+', '3+', '4+', '5+'];
  const bathroomOptions = ['Any', '1+', '2+', '3+', '4+'];

  // Available cities from stats
  const availableCities = stats?.cities || [];

  // Handle filter change
  const handleFilterChange = (key: keyof PropertyFilterOptions, value: any) => {
    // console.log(key, value);
    const newFilters = { ...filters, [key]: value };

    if (value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) {
      delete (newFilters as any)[key];
    }
    if (["newListing", "featured", "hot"].includes(key) && value === false) {
      delete (newFilters as any)[key];
    }

    onChange(newFilters);
  };

  // Handle array filter changes (like propertyTypes)
  const handleArrayFilterChange = (key: keyof PropertyFilterOptions, value: string, isChecked: boolean) => {
    const currentArray = (filters[key] as string[]) || [];
    let newArray: string[];

    if (isChecked) {
      newArray = [...currentArray, value];
    } else {
      newArray = currentArray.filter(item => item !== value);
    }

    handleFilterChange(key, newArray.length > 0 ? newArray : undefined);
  };

  // Reset all filters
  const handleReset = () => {
    const resetFilters: PropertyFilterOptions = {};
    setSearchTerm('');
    onChange(resetFilters);
  };

  // Handle numeric range filter
  const handleNumericFilter = (
    minKey: keyof PropertyFilterOptions,
    maxKey: keyof PropertyFilterOptions,
    minValue?: number,
    maxValue?: number
  ) => {
    const newFilters = { ...filters };

    if (minValue !== undefined && minValue !== null && minValue !== 0) {
      (newFilters as any)[minKey] = minValue;
    } else {
      delete (newFilters as any)[minKey];
    }

    if (maxValue !== undefined && maxValue !== null && maxValue !== 0) {
      (newFilters as any)[maxKey] = maxValue;
    } else {
      delete (newFilters as any)[maxKey];
    }

    onChange(newFilters);
  };

  // Handle bedroom filter
  const handleBedroomFilter = (value: string) => {
    if (value === 'Any') {
      const newFilters = { ...filters };
      delete newFilters.minBedrooms;
      delete newFilters.maxBedrooms;
      onChange(newFilters);
    } else {
      const minBedrooms = parseInt(value.replace('+', ''));
      handleFilterChange('minBedrooms', minBedrooms);
    }
  };

  // Handle bathroom filter
  const handleBathroomFilter = (value: string) => {
    if (value === 'Any') {
      const newFilters = { ...filters };
      delete newFilters.minBathrooms;
      delete newFilters.maxBathrooms;
      onChange(newFilters);
    } else {
      const minBathrooms = parseInt(value.replace('+', ''));
      handleFilterChange('minBathrooms', minBathrooms);
    }
  };

  // Handle features filter
  const handleFeatureFilter = (feature: 'hasPool' | 'hasGarage' | 'hasGarden', value: boolean) => {
    handleFilterChange(feature, value);
  };

  // Handle search input change with debouncing
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    // You could add debouncing here if needed
    handleFilterChange('searchTerm', value || undefined);
  };

  return (
    <div className="properties-sidebar">
      <div className="filter-widget">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="filter-title mb-0">Filter Properties</h5>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={handleReset}
            disabled={Object.keys(filters).length === 0}
          >
            Clear All
          </button>
        </div>

        {/* Search Filter */}
        <div className="filter-section mb-4">
          <label className="form-label fw-semibold mb-2">Search Properties</label>
          <input
            type="text"
            className="form-control"
            placeholder="Search by title, description, location..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>

        {/* Property Type Filter */}
        <div className="filter-section mb-4">
          <label className="form-label fw-semibold mb-2">Property Type</label>
          <div className="property-type-filter">
            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="checkbox"
                id="type-all"
                checked={!filters.propertyTypes || filters.propertyTypes.length === 0}
                onChange={(e) => handleFilterChange('propertyTypes', undefined)}
              />
              <label className="form-check-label" htmlFor="type-all">
                All Types
              </label>
            </div>
            {propertyTypes.map((type) => (
              <div className="form-check mb-2" key={type.value}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`type-${type.value}`}
                  checked={filters.propertyTypes?.includes(type.value) || false}
                  onChange={(e) =>
                    handleArrayFilterChange('propertyTypes', type.value, e.target.checked)
                  }
                />
                <label className="form-check-label" htmlFor={`type-${type.value}`}>
                  {type.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div className="filter-section mb-4">
          <label className="form-label fw-semibold mb-2">Status</label>
          <div className="status-filter">
            {statusOptions.map((status) => (
              <div className="form-check mb-2" key={status.value}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`status-${status.value}`}
                  checked={filters.status?.includes(status.value as any) || false}
                  onChange={(e) =>
                    handleArrayFilterChange('status', status.value, e.target.checked)
                  }
                />
                <label className="form-check-label" htmlFor={`status-${status.value}`}>
                  {status.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Price Range Filter */}
        <div className="filter-section mb-4">
          <label className="form-label fw-semibold mb-2">Price Range</label>

          {/* Sale Price Range */}
          <div className="mb-3">
            <label className="form-label small fw-semibold mb-1">For Sale</label>
            <div className="row g-2">
              <div className="col-6">
                <input
                  type="number"
                  className="form-control form-control-sm"
                  placeholder="Min Sale Price"
                  value={filters.minSalePrice ?? ''}
                  onChange={(e) => {
                    const value = e.target.value === '' ? undefined : Number(e.target.value);
                    handleNumericFilter('minSalePrice', 'maxSalePrice', value, filters.maxSalePrice);
                  }}
                />
              </div>
              <div className="col-6">
                <input
                  type="number"
                  className="form-control form-control-sm"
                  placeholder="Max Sale Price"
                  value={filters.maxSalePrice ?? ''}
                  onChange={(e) => {
                    const value = e.target.value === '' ? undefined : Number(e.target.value);
                    handleNumericFilter('minSalePrice', 'maxSalePrice', filters.minSalePrice, value);
                  }}
                />
              </div>
            </div>
          </div>

          {/* Rent Price Range */}
          <div>
            <label className="form-label small fw-semibold mb-1">For Rent</label>
            <div className="row g-2">
              <div className="col-6">
                <input
                  type="number"
                  className="form-control form-control-sm"
                  placeholder="Min Rent Price"
                  value={filters.minRentPrice ?? ''}
                  onChange={(e) => {
                    const value = e.target.value === '' ? undefined : Number(e.target.value);
                    handleNumericFilter('minRentPrice', 'maxRentPrice', value, filters.maxRentPrice);
                  }}
                />
              </div>
              <div className="col-6">
                <input
                  type="number"
                  className="form-control form-control-sm"
                  placeholder="Max Rent Price"
                  value={filters.maxRentPrice ?? ''}
                  onChange={(e) => {
                    const value = e.target.value === '' ? undefined : Number(e.target.value);
                    handleNumericFilter('minRentPrice', 'maxRentPrice', filters.minRentPrice, value);
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bedrooms Filter */}
        <div className="filter-section mb-4">
          <label className="form-label fw-semibold mb-2">Bedrooms</label>
          <div className="bedroom-filter d-flex flex-wrap gap-2">
            {bedroomOptions.map((option) => {
              const isActive = option === 'Any'
                ? !filters.minBedrooms && !filters.maxBedrooms
                : filters.minBedrooms === parseInt(option.replace('+', ''));

              return (
                <button
                  key={option}
                  className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => handleBedroomFilter(option)}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bathrooms Filter */}
        <div className="filter-section mb-4">
          <label className="form-label fw-semibold mb-2">Bathrooms</label>
          <div className="bathroom-filter d-flex flex-wrap gap-2">
            {bathroomOptions.map((option) => {
              const isActive = option === 'Any'
                ? !filters.minBathrooms && !filters.maxBathrooms
                : filters.minBathrooms === parseInt(option.replace('+', ''));

              return (
                <button
                  key={option}
                  className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => handleBathroomFilter(option)}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        {/* Location Filter */}
        <div className="filter-section mb-4">
          <label className="form-label fw-semibold mb-2">Location</label>
          <select
            className="form-select form-select-sm"
            value={filters.cities?.[0] || ''}
            onChange={(e) => handleFilterChange('cities', e.target.value ? [e.target.value] : undefined)}
          >
            <option value="">All Cities</option>
            {availableCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Size Filter */}
        <div className="filter-section mb-4">
          <label className="form-label fw-semibold mb-2">Size Range</label>
          <div className="row g-2">
            <div className="col-6">
              <input
                type="number"
                className="form-control form-control-sm"
                placeholder="Min Size"
                value={filters.minBuildingSize || filters.minLandSize || ''}
                onChange={(e) => {
                  const value = e.target.value === '' ? undefined : parseInt(e.target.value);
                  handleNumericFilter('minBuildingSize', 'maxBuildingSize', value, filters.maxBuildingSize);
                }}
              />
            </div>
            <div className="col-6">
              <input
                type="number"
                className="form-control form-control-sm"
                placeholder="Max Size"
                value={filters.maxBuildingSize || filters.maxLandSize || ''}
                onChange={(e) => {
                  const value = e.target.value === '' ? undefined : parseInt(e.target.value);
                  handleNumericFilter('minBuildingSize', 'maxBuildingSize', filters.minBuildingSize, value);
                }}
              />
            </div>
          </div>
        </div>

        {/* Features Filter */}
        <div className="filter-section mb-4">
          <label className="form-label fw-semibold mb-2">Features</label>
          <div className="features-filter">
            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="checkbox"
                id="has-pool"
                checked={filters.hasPool || false}
                onChange={(e) => handleFeatureFilter('hasPool', e.target.checked)}
              />
              <label className="form-check-label" htmlFor="has-pool">
                Swimming Pool
              </label>
            </div>
            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="checkbox"
                id="has-garage"
                checked={filters.hasGarage || false}
                onChange={(e) => handleFeatureFilter('hasGarage', e.target.checked)}
              />
              <label className="form-check-label" htmlFor="has-garage">
                Garage
              </label>
            </div>
            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="checkbox"
                id="has-garden"
                checked={filters.hasGarden || false}
                onChange={(e) => handleFeatureFilter('hasGarden', e.target.checked)}
              />
              <label className="form-check-label" htmlFor="has-garden">
                Garden
              </label>
            </div>
          </div>
        </div>

        {/* Labels Filter */}
        <div className="filter-section mb-4">
          <label className="form-label fw-semibold mb-2">Property Labels</label>
          <div className="labels-filter">
            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="checkbox"
                id="hot-label"
                checked={filters.hot || false}
                onChange={(e) => handleFilterChange('hot', e.target.checked)}
              />
              <label className="form-check-label" htmlFor="hot-label">
                Hot Property
              </label>
            </div>
            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="checkbox"
                id="featured-label"
                checked={filters.featured || false}
                onChange={(e) => handleFilterChange('featured', e.target.checked)}
              />
              <label className="form-check-label" htmlFor="featured-label">
                Featured
              </label>
            </div>
            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="checkbox"
                id="new-label"
                checked={filters.newListing || false}
                onChange={(e) => handleFilterChange('newListing', e.target.checked)}
              />
              <label className="form-check-label" htmlFor="new-label">
                New Listing
              </label>
            </div>
          </div>
        </div>

        {/* Apply Filters Button (optional since filters apply immediately) */}
        <button
          className="btn btn-primary w-100 mt-3"
          onClick={() => onChange(filters)}
        >
          Apply Filters ({Object.keys(filters).length})
        </button>
      </div>

      {/* Featured Properties Section */}
      {stats && (
        <div className="featured-properties mt-4">
          <h5 className="mb-3">Market Overview</h5>

          <div className="market-stats mb-4">
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Total Properties:</span>
              <strong>{stats.totalProperties}</strong>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">For Sale:</span>
              <strong>{stats.forSaleCount}</strong>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">For Rent:</span>
              <strong>{stats.forRentCount}</strong>
            </div>
            {/* <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Avg Sale Price:</span>
              <strong>${stats.averageSalePrice.toLocaleString()}</strong>
            </div> */}
          </div>

          <h6 className="mb-2">Popular Cities</h6>
          <div className="popular-cities">
            {stats.cities.slice(0, 5).map((city, index) => (
              <div key={city} className="d-flex justify-content-between mb-1">
                <span className="small">{city}</span>
                <span className="small text-muted">
                  {stats.cityCounts?.[city] || 0} properties
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}