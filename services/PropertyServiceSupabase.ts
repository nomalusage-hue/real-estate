// services/PropertyServiceSupabase.ts
// import {
//   PropertiesRepository,
//   PropertyStatus,
// } from "@/lib/repositories/PropertiesRepository";
// import { PropertyData } from "@/types/property";

// export interface PropertyFilterOptions {
//   status?: ("For Sale" | "For Rent" | "Sold")[];
//   minSalePrice?: number;
//   maxSalePrice?: number;
//   minRentPrice?: number;
//   maxRentPrice?: number;
//   propertyTypes?: string[];
//   cities?: string[];
//   minBuildingSize?: number;
//   maxBuildingSize?: number;
//   minLandSize?: number;
//   maxLandSize?: number;
//   minBedrooms?: number;
//   maxBedrooms?: number;
//   minBathrooms?: number;
//   maxBathrooms?: number;
//   hasPool?: boolean;
//   hasGarage?: boolean;
//   hasGarden?: boolean;
//   hot?: boolean;
//   featured?: boolean;
//   exclusive?: boolean;
//   newListing?: boolean;
//   searchTerm?: string;
//   createdAfter?: Date;
//   createdBefore?: Date;
//   sortBy?: "price" | "created_at" | "buildingSize" | "landSize" | "bedrooms";
//   sortOrder?: "asc" | "desc";
// }

// services/PropertyServiceSupabase.ts
import {
  PropertiesRepository,
  RepositoryFilterOptions,
} from "@/lib/repositories/PropertiesRepository";
import { PropertyData } from "@/types/property";

export interface PropertyFilterOptions {
  status?: ("For Sale" | "For Rent" | "Sold")[];
  minSalePrice?: number;
  maxSalePrice?: number;
  minRentPrice?: number;
  maxRentPrice?: number;
  propertyTypes?: string[];
  cities?: string[];
  minBuildingSize?: number;
  maxBuildingSize?: number;
  minLandSize?: number;
  maxLandSize?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  minBathrooms?: number;
  maxBathrooms?: number;
  hasPool?: boolean;
  hasGarage?: boolean;
  hasGarden?: boolean;
  hot?: boolean;
  featured?: boolean;
  exclusive?: boolean;
  newListing?: boolean;
  searchTerm?: string;
  sortBy?: "price" | "created_at" | "buildingSize" | "landSize" | "bedrooms";
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  hasMore: boolean;
  page: number;
  pageSize: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  hasMore: boolean;
  lastDoc?: unknown;
  page: number;
  pageSize: number;
}

export interface PropertyStats {
  totalProperties: number;
  forSaleCount: number;
  forRentCount: number;
  soldCount: number;
  averageSalePrice: number;
  averageRentPrice: number;
  cities: string[];
  propertyTypes: Record<string, number>;
  cityCounts: Record<string, number>;
}

export class PropertyServiceSupabase {
  private repository: PropertiesRepository;

  constructor() {
    this.repository = new PropertiesRepository();
  }

  // Basic CRUD operations
  async create(property: Omit<PropertyData, "id">): Promise<PropertyData> {
    return await this.repository.create(property);
  }

  async getById(id: string): Promise<PropertyData | null> {
    try {
      return await this.repository.getById(id);
    } catch (error) {
      console.error("Error getting property:", error);
      return null;
    }
  }

  async update(
    id: string,
    updates: Partial<PropertyData>,
  ): Promise<PropertyData> {
    return await this.repository.update(id, updates);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  // Get all properties
  async getAll(): Promise<PropertyData[]> {
    return await this.repository.getAll();
  }

  // // Paginated query with filters
  // async getPaginated(
  //   page: number = 1,
  //   pageSize: number = 12,
  //   filters: PropertyFilterOptions = {}
  // ): Promise<PaginatedResult<PropertyData>> {
  //   // console.log("getPaginated - Filters received:", filters);

  //   // // Handle status filter separately if multiple statuses are selected
  //   // let statusFilter: "For Sale" | "For Rent" | "Sold" | undefined;
  //   // let additionalStatusFilter: string[] = [];

  //   type PropertyStatus = "For Sale" | "For Rent" | "Sold";
  //   let statusFilter: PropertyStatus[] | undefined;
  //   let additionalStatusFilter: PropertyStatus[] = [];

  //   // if (filters.status && filters.status.length > 0) {
  //   //   // Use first status for Supabase query
  //   //   statusFilter = filters.status[0] as "For Sale" | "For Rent" | "Sold";

  //   //   // Store additional statuses for client-side filtering
  //   //   if (filters.status.length > 1) {
  //   //     additionalStatusFilter = filters.status.slice(1);
  //   //   }
  //   // }

  //   if (filters.status && filters.status.length > 0) {
  //     statusFilter = filters.status as PropertyStatus[];

  //     if (filters.status.length > 1) {
  //       additionalStatusFilter = filters.status as PropertyStatus[];
  //     }
  //   }

  //   // const options = {
  //   //   page,
  //   //   pageSize,
  //   //   city: filters.cities?.[0],
  //   //   propertyType: filters.propertyTypes?.[0] as PropertyData["propertyType"],
  //   //   status: statusFilter,
  //   //   minPrice: filters.minSalePrice || filters.minRentPrice,
  //   //   maxPrice: filters.maxSalePrice || filters.maxRentPrice,
  //   //   featured: filters.featured,
  //   //   orderBy:
  //   //     filters.sortBy === "created_at"
  //   //       ? "created_at"
  //   //       : filters.sortBy === "price"
  //   //       ? "salePrice"
  //   //       : "created_at",
  //   //   ascending: filters.sortOrder === "asc",
  //   // };

  //   const options = {
  //     page,
  //     pageSize,
  //     city: filters.cities?.[0],
  //     // propertyType: filters.propertyTypes?.[0] as PropertyData["propertyType"],
  //     propertyTypes: filters.propertyTypes as PropertyData["propertyType"][],
  //     // status: statusFilter,
  //     status: filters.status as PropertyStatus[],
  //     minPrice: filters.minSalePrice || filters.minRentPrice,
  //     maxPrice: filters.maxSalePrice || filters.maxRentPrice,
  //     featured: filters.featured,
  //     orderBy:  filters.sortBy as "created_at" | "salePrice" | "rentPrice" | "views",
  //     // orderBy:
  //     //   filters.sortBy === "created_at"
  //     //     ? "created_at"
  //     //     : filters.sortBy === "price"
  //     //     ? "salePrice"
  //     //     : "created_at",
  //     ascending: filters.sortOrder === "asc",
  //   };

  //   // "created_at" | "salePrice" | "rentPrice" | "views"

  //   // console.log("getPaginated - Options for repository:", options);

  //   let result;
  //   try {
  //     result = await this.repository.getPaged(options);
  //   } catch (error) {
  //     console.error(
  //       "getPaginated - Repository error, trying without status filter:",
  //       error
  //     );

  //     // Try without status filter if it fails
  //     const retryOptions = { ...options, status: undefined };
  //     result = await this.repository.getPaged(retryOptions);
  //   }

  //   // Apply additional filters that aren't handled by getPaged
  //   let filteredData = result.data;

  //   // Apply additional status filters client-side
  //   if (additionalStatusFilter.length > 0) {
  //     filteredData = filteredData.filter(
  //       (p) =>
  //         p.status &&
  //         additionalStatusFilter.some((status) => p.status.includes(status))
  //     );
  //   }

  //   // Filter by multiple statuses if specified
  //   if (filters.status && filters.status.length > 0 && !statusFilter) {
  //     filteredData = filteredData.filter(
  //       (p) =>
  //         p.status &&
  //         filters.status!.some((status) => p.status.includes(status))
  //     );
  //   }

  //   // Filter by property types if multiple selected
  //   if (filters.propertyTypes && filters.propertyTypes.length > 1) {
  //     filteredData = filteredData.filter(
  //       (p) => p.propertyType && filters.propertyTypes!.includes(p.propertyType)
  //     );
  //   }

  //   // Filter by multiple cities if specified
  //   if (filters.cities && filters.cities.length > 1) {
  //     filteredData = filteredData.filter(
  //       (p) => p.city && filters.cities!.includes(p.city)
  //     );
  //   }

  //   // Filter by bedrooms
  //   if (filters.minBedrooms !== undefined) {
  //     filteredData = filteredData.filter(
  //       (p) => (p.bedrooms || 0) >= filters.minBedrooms!
  //     );
  //   }
  //   if (filters.maxBedrooms !== undefined) {
  //     filteredData = filteredData.filter(
  //       (p) => (p.bedrooms || 0) <= filters.maxBedrooms!
  //     );
  //   }

  //   // Filter by bathrooms
  //   if (filters.minBathrooms !== undefined) {
  //     filteredData = filteredData.filter(
  //       (p) => (p.bathrooms || 0) >= filters.minBathrooms!
  //     );
  //   }
  //   if (filters.maxBathrooms !== undefined) {
  //     filteredData = filteredData.filter(
  //       (p) => (p.bathrooms || 0) <= filters.maxBathrooms!
  //     );
  //   }

  //   // Filter by building size
  //   if (filters.minBuildingSize !== undefined) {
  //     filteredData = filteredData.filter(
  //       (p) => (p.buildingSize || 0) >= filters.minBuildingSize!
  //     );
  //   }
  //   if (filters.maxBuildingSize !== undefined) {
  //     filteredData = filteredData.filter(
  //       (p) => (p.buildingSize || 0) <= filters.maxBuildingSize!
  //     );
  //   }

  //   // Filter by land size
  //   if (filters.minLandSize !== undefined) {
  //     filteredData = filteredData.filter(
  //       (p) => (p.landSize || 0) >= filters.minLandSize!
  //     );
  //   }
  //   if (filters.maxLandSize !== undefined) {
  //     filteredData = filteredData.filter(
  //       (p) => (p.landSize || 0) <= filters.maxLandSize!
  //     );
  //   }

  //   // Filter by features
  //   if (filters.hot !== undefined) {
  //     filteredData = filteredData.filter((p) => p.hot === filters.hot);
  //   }
  //   if (filters.newListing !== undefined) {
  //     filteredData = filteredData.filter(
  //       (p) => p.newListing === filters.newListing
  //     );
  //   }
  //   if (filters.exclusive !== undefined) {
  //     filteredData = filteredData.filter(
  //       (p) => p.exclusive === filters.exclusive
  //     );
  //   }

  //   // Filter by hasPool
  //   if (filters.hasPool === true) {
  //     filteredData = filteredData.filter(
  //       (p) =>
  //         p.exteriorFeatures?.includes("Swimming Pool") ||
  //         p.customFeatures?.some((f) => f.toLowerCase().includes("pool"))
  //     );
  //   }

  //   // Filter by hasGarage
  //   if (filters.hasGarage === true) {
  //     filteredData = filteredData.filter((p) => (p.garage || 0) > 0);
  //   }

  //   // Filter by hasGarden
  //   if (filters.hasGarden === true) {
  //     filteredData = filteredData.filter(
  //       (p) =>
  //         p.exteriorFeatures?.includes("Garden") ||
  //         p.customFeatures?.some((f) => f.toLowerCase().includes("garden"))
  //     );
  //   }

  //   // Filter by searchTerm
  //   if (filters.searchTerm && filters.searchTerm.trim()) {
  //     const searchTerm = filters.searchTerm.toLowerCase().trim();
  //     filteredData = filteredData.filter((property) => {
  //       const searchableText = [
  //         property.title,
  //         property.description,
  //         property.address,
  //         property.city,
  //         ...(property.interiorFeatures || []),
  //         ...(property.exteriorFeatures || []),
  //         ...(property.customFeatures || []),
  //       ]
  //         .join(" ")
  //         .toLowerCase();

  //       return searchableText.includes(searchTerm);
  //     });
  //   }

  //   // console.log("getPaginated - After filtering:", {
  //   //   originalCount: result.data.length,
  //   //   filteredCount: filteredData.length,
  //   //   page,
  //   //   pageSize,
  //   // });

  //   // Calculate hasMore based on filtered results
  //   const startIndex = (page - 1) * pageSize;
  //   const endIndex = startIndex + pageSize;
  //   const paginatedItems = filteredData.slice(startIndex, endIndex);
  //   const hasMore = filteredData.length > endIndex;

  //   return {
  //     items: paginatedItems,
  //     total: filteredData.length,
  //     hasMore,
  //     page,
  //     pageSize,
  //   };
  // }

  // async getPaginated(
  //   page: number = 1,
  //   pageSize: number = 12,
  //   filters: PropertyFilterOptions = {},
  // ): Promise<PaginatedResult<PropertyData>> {
  //   // Build options for server‑side filters (the ones that can be handled by the repository)
  //   const serverOptions = {
  //     city: filters.cities?.[0], // only first city for server‑side (you may extend later)
  //     propertyTypes: filters.propertyTypes as PropertyData["propertyType"][],
  //     status: filters.status as PropertyStatus[],
  //     minPrice: filters.minSalePrice || filters.minRentPrice,
  //     maxPrice: filters.maxSalePrice || filters.maxRentPrice,
  //     featured: filters.featured,
  //     orderBy: filters.sortBy as
  //       | "created_at"
  //       | "salePrice"
  //       | "rentPrice"
  //       | "views",
  //     ascending: filters.sortOrder === "asc",
  //   };

  //   // Fetch all properties that match the server‑side filters
  //   const allProperties =
  //     await this.repository.getAllWithFilters(serverOptions);

  //   // Apply client‑side filters that are not (yet) handled by the repository
  //   let filteredData = allProperties;

  //   // Filter by multiple cities (if more than one)
  //   if (filters.cities && filters.cities.length > 1) {
  //     filteredData = filteredData.filter(
  //       (p) => p.city && filters.cities!.includes(p.city),
  //     );
  //   }

  //   // Bedrooms
  //   if (filters.minBedrooms !== undefined) {
  //     filteredData = filteredData.filter(
  //       (p) => (p.bedrooms || 0) >= filters.minBedrooms!,
  //     );
  //   }
  //   if (filters.maxBedrooms !== undefined) {
  //     filteredData = filteredData.filter(
  //       (p) => (p.bedrooms || 0) <= filters.maxBedrooms!,
  //     );
  //   }

  //   // Bathrooms
  //   if (filters.minBathrooms !== undefined) {
  //     filteredData = filteredData.filter(
  //       (p) => (p.bathrooms || 0) >= filters.minBathrooms!,
  //     );
  //   }
  //   if (filters.maxBathrooms !== undefined) {
  //     filteredData = filteredData.filter(
  //       (p) => (p.bathrooms || 0) <= filters.maxBathrooms!,
  //     );
  //   }

  //   // Building size
  //   if (filters.minBuildingSize !== undefined) {
  //     filteredData = filteredData.filter(
  //       (p) => (p.buildingSize || 0) >= filters.minBuildingSize!,
  //     );
  //   }
  //   if (filters.maxBuildingSize !== undefined) {
  //     filteredData = filteredData.filter(
  //       (p) => (p.buildingSize || 0) <= filters.maxBuildingSize!,
  //     );
  //   }

  //   // Land size
  //   if (filters.minLandSize !== undefined) {
  //     filteredData = filteredData.filter(
  //       (p) => (p.landSize || 0) >= filters.minLandSize!,
  //     );
  //   }
  //   if (filters.maxLandSize !== undefined) {
  //     filteredData = filteredData.filter(
  //       (p) => (p.landSize || 0) <= filters.maxLandSize!,
  //     );
  //   }

  //   // Feature flags
  //   if (filters.hot !== undefined) {
  //     filteredData = filteredData.filter((p) => p.hot === filters.hot);
  //   }
  //   if (filters.newListing !== undefined) {
  //     filteredData = filteredData.filter(
  //       (p) => p.newListing === filters.newListing,
  //     );
  //   }
  //   if (filters.exclusive !== undefined) {
  //     filteredData = filteredData.filter(
  //       (p) => p.exclusive === filters.exclusive,
  //     );
  //   }

  //   // Has pool
  //   if (filters.hasPool === true) {
  //     filteredData = filteredData.filter(
  //       (p) =>
  //         p.exteriorFeatures?.includes("Swimming Pool") ||
  //         p.customFeatures?.some((f) => f.toLowerCase().includes("pool")),
  //     );
  //   }

  //   // Has garage
  //   if (filters.hasGarage === true) {
  //     filteredData = filteredData.filter((p) => (p.garage || 0) > 0);
  //   }

  //   // Has garden
  //   if (filters.hasGarden === true) {
  //     filteredData = filteredData.filter(
  //       (p) =>
  //         p.exteriorFeatures?.includes("Garden") ||
  //         p.customFeatures?.some((f) => f.toLowerCase().includes("garden")),
  //     );
  //   }

  //   // Search term
  //   if (filters.searchTerm && filters.searchTerm.trim()) {
  //     const term = filters.searchTerm.toLowerCase().trim();
  //     filteredData = filteredData.filter((property) => {
  //       const searchable = [
  //         property.title,
  //         property.description,
  //         property.address,
  //         property.city,
  //         ...(property.interiorFeatures || []),
  //         ...(property.exteriorFeatures || []),
  //         ...(property.customFeatures || []),
  //       ]
  //         .join(" ")
  //         .toLowerCase();
  //       return searchable.includes(term);
  //     });
  //   }

  //   // Paginate
  //   const startIndex = (page - 1) * pageSize;
  //   const endIndex = startIndex + pageSize;
  //   const paginatedItems = filteredData.slice(startIndex, endIndex);
  //   const hasMore = filteredData.length > endIndex;

  //   return {
  //     items: paginatedItems,
  //     total: filteredData.length,
  //     hasMore,
  //     page,
  //     pageSize,
  //   };
  // }

  // /* =========================
  //    Paginated query – uses repository's built‑in filters
  // ========================== */
  // async getPaginated(
  //   page: number = 1,
  //   pageSize: number = 12,
  //   filters: PropertyFilterOptions = {}
  // ): Promise<PaginatedResult<PropertyData>> {
  //   // Convert frontend filters to repository format
  //   const repoOptions: RepositoryFilterOptions = {
  //     page,
  //     pageSize,
  //     cities: filters.cities,
  //     propertyTypes: filters.propertyTypes,
  //     status: filters.status,
  //     minPrice: filters.minSalePrice ?? filters.minRentPrice,
  //     maxPrice: filters.maxSalePrice ?? filters.maxRentPrice,
  //     minBuildingSize: filters.minBuildingSize,
  //     maxBuildingSize: filters.maxBuildingSize,
  //     minLandSize: filters.minLandSize,
  //     maxLandSize: filters.maxLandSize,
  //     minBedrooms: filters.minBedrooms,
  //     maxBedrooms: filters.maxBedrooms,
  //     minBathrooms: filters.minBathrooms,
  //     maxBathrooms: filters.maxBathrooms,
  //     featured: filters.featured,
  //     hot: filters.hot,
  //     newListing: filters.newListing,
  //     exclusive: filters.exclusive,
  //     searchTerm: filters.searchTerm,
  //   };

  //   // Map sortBy to repository column name
  //   if (filters.sortBy) {
  //     switch (filters.sortBy) {
  //       case "price":
  //         // For price we need to decide which column to sort by.
  //         // We'll use sale_price (most common) and ignore rent for simplicity.
  //         // Alternatively, we could sort by the min of the two, but that's complex.
  //         repoOptions.orderBy = "sale_price";
  //         break;
  //       case "buildingSize":
  //         repoOptions.orderBy = "building_size";
  //         break;
  //       case "landSize":
  //         repoOptions.orderBy = "land_size";
  //         break;
  //       case "bedrooms":
  //         repoOptions.orderBy = "bedrooms";
  //         break;
  //       default:
  //         repoOptions.orderBy = "created_at";
  //     }
  //     repoOptions.ascending = filters.sortOrder === "asc";
  //   }

  //   // Call repository with all filters
  //   const result = await this.repository.getPaged(repoOptions);

  //   // Features like pool, garage, garden are not yet in the database schema.
  //   // For now, we filter them client‑side if needed (they are rarely used).
  //   let items = result.data;

  //   if (filters.hasPool === true) {
  //     items = items.filter(
  //       (p) =>
  //         p.exteriorFeatures?.includes("Swimming Pool") ||
  //         p.customFeatures?.some((f) => f.toLowerCase().includes("pool"))
  //     );
  //   }
  //   if (filters.hasGarage === true) {
  //     items = items.filter((p) => (p.garage || 0) > 0);
  //   }
  //   if (filters.hasGarden === true) {
  //     items = items.filter(
  //       (p) =>
  //         p.exteriorFeatures?.includes("Garden") ||
  //         p.customFeatures?.some((f) => f.toLowerCase().includes("garden"))
  //     );
  //   }

  //   // Re‑paginate after client‑side filtering (if necessary)
  //   const startIndex = (page - 1) * pageSize;
  //   const endIndex = startIndex + pageSize;
  //   const paginatedItems = items.slice(startIndex, endIndex);
  //   const hasMore = items.length > endIndex;

  //   return {
  //     items: paginatedItems,
  //     total: items.length,
  //     hasMore,
  //     page,
  //     pageSize,
  //   };
  // }

  /* =========================
     Paginated query – all filters now handled by the repository
  ========================== */
  async getPaginated(
    page: number = 1,
    pageSize: number = 12,
    filters: PropertyFilterOptions = {},
  ): Promise<PaginatedResult<PropertyData>> {
    // Convert frontend filters to repository options
    const repoOptions: RepositoryFilterOptions = {
      page,
      pageSize,
      cities: filters.cities,
      propertyTypes: filters.propertyTypes,
      status: filters.status,
      minPrice: filters.minSalePrice ?? filters.minRentPrice,
      maxPrice: filters.maxSalePrice ?? filters.maxRentPrice,
      minBuildingSize: filters.minBuildingSize,
      maxBuildingSize: filters.maxBuildingSize,
      minLandSize: filters.minLandSize,
      maxLandSize: filters.maxLandSize,
      minBedrooms: filters.minBedrooms,
      maxBedrooms: filters.maxBedrooms,
      minBathrooms: filters.minBathrooms,
      maxBathrooms: filters.maxBathrooms,
      featured: filters.featured,
      hot: filters.hot,
      newListing: filters.newListing,
      exclusive: filters.exclusive,
      hasPool: filters.hasPool,
      hasGarage: filters.hasGarage,
      hasGarden: filters.hasGarden,
      searchTerm: filters.searchTerm,
    };

    // Map sortBy to repository column name
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case "price":
          repoOptions.orderBy = "sale_price";
          break;
        case "buildingSize":
          repoOptions.orderBy = "building_size";
          break;
        case "landSize":
          repoOptions.orderBy = "land_size";
          break;
        case "bedrooms":
          repoOptions.orderBy = "bedrooms";
          break;
        default:
          repoOptions.orderBy = "created_at";
      }
      repoOptions.ascending = filters.sortOrder === "asc";
    }

    // Call repository – all filtering is done at the database level
    const result = await this.repository.getPaged(repoOptions);

    return {
      items: result.data,
      total: result.total,
      hasMore: result.page < result.totalPages,
      page: result.page,
      pageSize: result.pageSize,
    };
  }

  // Special collections – now using getPaginated for efficiency
  async getFeatured(limitCount: number = 6): Promise<PropertyData[]> {
    const result = await this.getPaginated(1, limitCount, { featured: true });
    return result.items;
  }

  async getHot(limitCount: number = 6): Promise<PropertyData[]> {
    const result = await this.getPaginated(1, limitCount, { hot: true });
    return result.items;
  }

  async getNewest(limitCount: number = 6): Promise<PropertyData[]> {
    const result = await this.getPaginated(1, limitCount, {
      sortBy: "created_at",
      sortOrder: "desc",
    });
    return result.items;
  }

  // Statistics – uses separate database view
  async getStats(): Promise<PropertyStats> {
    return await this.repository.getStats();
  }

  // Search – now uses repository filtering
  async search(term: string, limitCount: number = 10): Promise<PropertyData[]> {
    const result = await this.getPaginated(1, limitCount, { searchTerm: term });
    return result.items;
  }

  // // Special collections
  // async getFeatured(limitCount: number = 6): Promise<PropertyData[]> {
  //   const allProperties = await this.repository.getAll();
  //   return allProperties
  //     .filter((p) => p.featured && p.published && !p.draft)
  //     .sort(
  //       (a, b) =>
  //         new Date(b.createdAt || "").getTime() -
  //         new Date(a.createdAt || "").getTime(),
  //     )
  //     .slice(0, limitCount);
  // }

  // async getHot(limitCount: number = 6): Promise<PropertyData[]> {
  //   const allProperties = await this.repository.getAll();
  //   return allProperties
  //     .filter((p) => p.hot && p.published && !p.draft)
  //     .sort(
  //       (a, b) =>
  //         new Date(b.createdAt || "").getTime() -
  //         new Date(a.createdAt || "").getTime(),
  //     )
  //     .slice(0, limitCount);
  // }

  // async getNewest(limitCount: number = 6): Promise<PropertyData[]> {
  //   const allProperties = await this.repository.getAll();
  //   return allProperties
  //     .filter((p) => p.published && !p.draft)
  //     .sort(
  //       (a, b) =>
  //         new Date(b.createdAt || "").getTime() -
  //         new Date(a.createdAt || "").getTime(),
  //     )
  //     .slice(0, limitCount);
  // }

  // // Statistics
  // async getStats(): Promise<PropertyStats> {
  //   const allProperties = await this.repository.getAll();
  //   const publishedProperties = allProperties.filter(
  //     (p) => p.published && !p.draft
  //   );

  //   const cityCounts: Record<string, number> = {};
  //   const propertyTypes: Record<string, number> = {};

  //   let totalProperties = 0;
  //   let forSaleCount = 0;
  //   let forRentCount = 0;
  //   let soldCount = 0;
  //   let totalSalePrice = 0;
  //   let saleCount = 0;
  //   let totalRentPrice = 0;
  //   let rentCount = 0;
  //   const cities = new Set<string>();

  //   publishedProperties.forEach((property) => {
  //     totalProperties++;

  //     if (property.status?.includes("For Sale")) forSaleCount++;
  //     if (property.status?.includes("For Rent")) forRentCount++;
  //     if (property.status?.includes("Sold")) soldCount++;

  //     if (property.salePrice && property.status?.includes("For Sale")) {
  //       totalSalePrice += property.salePrice;
  //       saleCount++;
  //     }

  //     if (property.rentPrice && property.status?.includes("For Rent")) {
  //       totalRentPrice += property.rentPrice;
  //       rentCount++;
  //     }

  //     if (property.city) {
  //       cities.add(property.city);
  //       cityCounts[property.city] = (cityCounts[property.city] || 0) + 1;
  //     }

  //     if (property.propertyType) {
  //       propertyTypes[property.propertyType] =
  //         (propertyTypes[property.propertyType] || 0) + 1;
  //     }
  //   });

  //   return {
  //     totalProperties,
  //     forSaleCount,
  //     forRentCount,
  //     soldCount,
  //     averageSalePrice:
  //       saleCount > 0 ? Math.round(totalSalePrice / saleCount) : 0,
  //     averageRentPrice:
  //       rentCount > 0 ? Math.round(totalRentPrice / rentCount) : 0,
  //     cities: Array.from(cities).sort(),
  //     cityCounts,
  //     propertyTypes,
  //   };
  // }
  // async getStats(): Promise<PropertyStats> {
  //   const allProperties = await this.repository.getStats();
  //   return allProperties;
  // }

  // View counting
  async incrementViews(id: string): Promise<void> {
    await this.repository.incrementViews(id);
  }

  // // Search
  // async search(term: string, limitCount: number = 10): Promise<PropertyData[]> {
  //   const allProperties = await this.repository.getAll();
  //   const publishedProperties = allProperties.filter(
  //     (p) => p.published && !p.draft,
  //   );

  //   const searchTerm = term.toLowerCase();

  //   return publishedProperties
  //     .filter((property) => {
  //       const searchableText = [
  //         property.title,
  //         property.description,
  //         property.address,
  //         property.city,
  //         ...(property.interiorFeatures || []),
  //         ...(property.exteriorFeatures || []),
  //         ...(property.customFeatures || []),
  //       ]
  //         .join(" ")
  //         .toLowerCase();

  //       return searchableText.includes(searchTerm);
  //     })
  //     .slice(0, limitCount);
  // }
}

// Export singleton instance
export const propertyService = new PropertyServiceSupabase();
