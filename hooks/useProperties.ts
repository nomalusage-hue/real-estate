// import { useState, useEffect, useCallback } from "react";
// import {
//   propertyService,
//   PropertyFilterOptions,
//   PaginatedResult,
// } from "@/services/PropertyService";
// import { PropertyWithId } from "@/types/property";

// export function useProperties() {
//   const [properties, setProperties] = useState<PropertyWithId[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [pagination, setPagination] = useState<
//     Omit<PaginatedResult<PropertyWithId>, "items">
//   >({
//     total: 0,
//     hasMore: false,
//     lastDoc: null,
//     page: 1,
//     pageSize: 12,
//   });

//   const loadProperties = useCallback(
//     async (
//       page: number = 1,
//       filters: PropertyFilterOptions = {},
//       reset: boolean = false
//     ) => {
//       try {
//         setLoading(true);
//         setError(null);

//         const result = await propertyService.getPaginated(
//           page,
//           pagination.pageSize,
//           filters,
//           reset ? null : pagination.lastDoc
//         );

//         if (reset) {
//           setProperties(result.items);
//         } else {
//           setProperties((prev) => [...prev, ...result.items]);
//         }

//         setPagination({
//           total: result.total,
//           hasMore: result.hasMore,
//           lastDoc: result.lastDoc,
//           page: result.page,
//           pageSize: result.pageSize,
//         });
//       } catch (err: any) {
//         setError(err.message || "Failed to load properties");
//         console.error("Error loading properties:", err);
//       } finally {
//         setLoading(false);
//       }
//     },
//     [pagination.lastDoc, pagination.pageSize]
//   );

//   const loadNextPage = useCallback(
//     (filters: PropertyFilterOptions = {}) => {
//       loadProperties(pagination.page + 1, filters, false);
//     },
//     [loadProperties, pagination.page]
//   );

//   const refreshWithFilters = useCallback(
//     (filters: PropertyFilterOptions = {}) => {
//       loadProperties(1, filters, true);
//     },
//     [loadProperties]
//   );

//   useEffect(() => {
//     loadProperties(1, {}, true);
//   }, []);

//   return {
//     properties,
//     loading,
//     error,
//     pagination,
//     loadProperties,
//     loadNextPage,
//     refreshWithFilters,
//     hasMore: pagination.hasMore,
//     total: pagination.total,
//   };
// }






// import { useState, useEffect, useCallback } from 'react';
// import { propertyService, PropertyFilterOptions, PaginatedResult } from '@/services/PropertyService';
// import { PropertyData } from '@/types/property';

// export function useProperties() {
//   const [properties, setProperties] = useState<PropertyData[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [pagination, setPagination] = useState<Omit<PaginatedResult<PropertyData>, 'items'>>({
//     total: 0,
//     hasMore: false,
//     lastDoc: null,
//     page: 1,
//     pageSize: 12
//   });

//   const loadProperties = useCallback(async (
//     page: number = 1,
//     filters: PropertyFilterOptions = {},
//     reset: boolean = false
//   ) => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       const result = await propertyService.getPaginated(
//         page,
//         pagination.pageSize,
//         filters,
//         reset ? null : pagination.lastDoc
//       );
      
//       if (reset) {
//         setProperties(result.items);
//       } else {
//         setProperties(prev => [...prev, ...result.items]);
//       }
      
//       setPagination({
//         total: result.total,
//         hasMore: result.hasMore,
//         lastDoc: result.lastDoc,
//         page: result.page,
//         pageSize: result.pageSize
//       });
//     } catch (err: any) {
//       setError(err.message || 'Failed to load properties');
//       console.error('Error loading properties:', err);
//     } finally {
//       setLoading(false);
//     }
//   }, [pagination.lastDoc, pagination.pageSize]);

//   const loadNextPage = useCallback((filters: PropertyFilterOptions = {}) => {
//     loadProperties(pagination.page + 1, filters, false);
//   }, [loadProperties, pagination.page]);

//   const refreshWithFilters = useCallback((filters: PropertyFilterOptions = {}) => {
//     loadProperties(1, filters, true);
//   }, [loadProperties]);

//   useEffect(() => {
//     loadProperties(1, {}, true);
//   }, []);

//   return {
//     properties,
//     loading,
//     error,
//     pagination,
//     loadProperties,
//     loadNextPage,
//     refreshWithFilters,
//     hasMore: pagination.hasMore,
//     total: pagination.total
//   };
// }







// hooks/useProperties.ts
import { useState, useEffect, useCallback } from 'react';
import { propertyService, PropertyFilterOptions, PaginatedResult } from '@/services/PropertyServiceSupabase';
import { PropertyData } from '@/types/property';

export function useProperties() {
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Omit<PaginatedResult<PropertyData>, 'items'>>({
    total: 0,
    hasMore: false,
    page: 1,
    pageSize: 12
  });

  const loadProperties = useCallback(async (
    page: number = 1,
    filters: PropertyFilterOptions = {},
    reset: boolean = false
  ) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await propertyService.getPaginated(
        page,
        pagination.pageSize,
        filters
      );
      
      if (reset) {
        setProperties(result.items);
      } else {
        setProperties(prev => [...prev, ...result.items]);
      }
      
      setPagination({
        total: result.total,
        hasMore: result.hasMore,
        page: result.page,
        pageSize: result.pageSize
      });
    } catch (err: any) {
      setError(err.message || 'Failed to load properties');
      console.error('Error loading properties:', err);
    } finally {
      setLoading(false);
    }
  }, [pagination.pageSize]);

  const loadNextPage = useCallback((filters: PropertyFilterOptions = {}) => {
    loadProperties(pagination.page + 1, filters, false);
  }, [loadProperties, pagination.page]);

  const refreshWithFilters = useCallback((filters: PropertyFilterOptions = {}) => {
    loadProperties(1, filters, true);
  }, [loadProperties]);

  useEffect(() => {
    loadProperties(1, {}, true);
  }, []);

  return {
    properties,
    loading,
    error,
    pagination,
    loadProperties,
    loadNextPage,
    refreshWithFilters,
    hasMore: pagination.hasMore,
    total: pagination.total
  };
}