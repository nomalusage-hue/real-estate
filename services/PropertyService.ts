// // services/PropertyService.ts
// import { FirebaseDataSource } from "@/services/FirebaseDataSource";
// import { Property } from "@/core/types";

// const source = new FirebaseDataSource<Property>("properties");

// export class PropertyService {
//   async create(property: Property) {
//     return source.create(property);
//   }
// }

// // services/PropertyService.ts
// import {
//   collection,
//   query,
//   where,
//   orderBy,
//   limit,
//   startAfter,
//   getDocs,
//   getDoc,
//   doc,
//   addDoc,
//   updateDoc,
//   deleteDoc,
//   QueryDocumentSnapshot,
//   DocumentData,
//   QueryConstraint
// } from 'firebase/firestore';
// import { firestore } from '@/config/firebase';
// import { PropertyData, PropertyWithId } from '@/components/property/types';

// export interface PropertyFilterOptions {
//   status?: ('For Sale' | 'For Rent' | 'Sold')[];
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
//   sortBy?: 'price' | 'createdAt' | 'buildingSize' | 'landSize' | 'bedrooms';
//   sortOrder?: 'asc' | 'desc';
// }

// export interface PaginatedResult<T> {
//   items: T[];
//   total: number;
//   hasMore: boolean;
//   lastDoc: QueryDocumentSnapshot<DocumentData> | null;
//   page: number;
//   pageSize: number;
// }

// export interface PropertyStats {
//   totalProperties: number;
//   forSaleCount: number;
//   forRentCount: number;
//   soldCount: number;
//   averageSalePrice: number;
//   averageRentPrice: number;
//   cities: string[];
//   propertyTypes: Record<string, number>;
// }

// export class PropertyService {
//   private readonly collectionName = 'properties';
//   private readonly defaultPageSize = 12;

//   // Basic CRUD operations
//   async create(property: PropertyData): Promise<string> {
//     try {
//       const propertyWithTimestamps = {
//         ...property,
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//         views: 0,
//         favorites: 0,
//         published: property.published !== undefined ? property.published : true,
//       };

//       const docRef = await addDoc(
//         collection(firestore, this.collectionName),
//         propertyWithTimestamps
//       );

//       return docRef.id;
//     } catch (error) {
//       console.error('Error creating property:', error);
//       throw error;
//     }
//   }

//   async getById(id: string): Promise<PropertyWithId | null> {
//     try {
//       const docRef = doc(firestore, this.collectionName, id);
//       const docSnap = await getDoc(docRef);

//       if (!docSnap.exists()) {
//         return null;
//       }

//       const data = docSnap.data() as PropertyData;
//       return {
//         id: docSnap.id,
//         ...data,
//         status: data.status || [],
//         interiorFeatures: data.interiorFeatures || [],
//         exteriorFeatures: data.exteriorFeatures || [],
//         customFeatures: data.customFeatures || [],
//       };
//     } catch (error) {
//       console.error('Error getting property:', error);
//       throw error;
//     }
//   }

//   async update(id: string, updates: Partial<PropertyData>): Promise<void> {
//     try {
//       const docRef = doc(firestore, this.collectionName, id);
//       await updateDoc(docRef, {
//         ...updates,
//         updatedAt: new Date().toISOString(),
//       });
//     } catch (error) {
//       console.error('Error updating property:', error);
//       throw error;
//     }
//   }

//   async delete(id: string): Promise<void> {
//     try {
//       const docRef = doc(firestore, this.collectionName, id);
//       await deleteDoc(docRef);
//     } catch (error) {
//       console.error('Error deleting property:', error);
//       throw error;
//     }
//   }

//   // Advanced query methods
//   async getAll(): Promise<PropertyWithId[]> {
//     try {
//       const q = query(
//         collection(firestore, this.collectionName),
//         where('published', '==', true),
//         orderBy('createdAt', 'desc')
//       );

//       const snapshot = await getDocs(q);
//       return snapshot.docs.map(doc => {
//         const data = doc.data() as PropertyData;
//         return {
//           id: doc.id,
//           ...data,
//           status: data.status || [],
//           interiorFeatures: data.interiorFeatures || [],
//           exteriorFeatures: data.exteriorFeatures || [],
//           customFeatures: data.customFeatures || [],
//         };
//       });
//     } catch (error) {
//       console.error('Error getting all properties:', error);
//       throw error;
//     }
//   }

//   // Paginated query with filters
//   async getPaginated(
//     page: number = 1,
//     pageSize: number = this.defaultPageSize,
//     filters: PropertyFilterOptions = {},
//     lastDoc: QueryDocumentSnapshot<DocumentData> | null = null
//   ): Promise<PaginatedResult<PropertyWithId>> {
//     try {
//       const q = collection(firestore, this.collectionName);
//       const constraints: QueryConstraint[] = [];

//       // Apply filters
//       this.applyFilters(constraints, filters);

//       // Apply sorting
//       this.applySorting(constraints, filters);

//       // Apply pagination for subsequent pages
//       if (lastDoc && page > 1) {
//         constraints.push(startAfter(lastDoc));
//       }

//       // Apply page limit
//       constraints.push(limit(pageSize + 1));

//       // Create query
//       const finalQuery = query(q, ...constraints);
//       const snapshot = await getDocs(finalQuery);

//       // Process results
//       const items: PropertyWithId[] = [];
//       let newLastDoc: QueryDocumentSnapshot<DocumentData> | null = null;

//       snapshot.forEach((docSnap, index) => {
//         const data = docSnap.data() as PropertyData;

//         if (index < pageSize) {
//           items.push({
//             id: docSnap.id,
//             ...data,
//             status: data.status || [],
//             interiorFeatures: data.interiorFeatures || [],
//             exteriorFeatures: data.exteriorFeatures || [],
//             customFeatures: data.customFeatures || [],
//           });
//         }

//         if (index === pageSize - 1) {
//           newLastDoc = docSnap;
//         }
//       });

//       // Get total count (if first page)
//       let total = 0;
//       if (page === 1) {
//         total = await this.getTotalCount(filters);
//       }

//       const hasMore = snapshot.size > pageSize;

//       return {
//         items,
//         total,
//         hasMore,
//         lastDoc: newLastDoc,
//         page,
//         pageSize
//       };
//     } catch (error) {
//       console.error('Error getting paginated properties:', error);
//       throw error;
//     }
//   }

//   // Special collections
//   async getFeatured(limitCount: number = 6): Promise<PropertyWithId[]> {
//     try {
//       const q = query(
//         collection(firestore, this.collectionName),
//         where('featured', '==', true),
//         where('published', '==', true),
//         orderBy('createdAt', 'desc'),
//         limit(limitCount)
//       );

//       const snapshot = await getDocs(q);
//       return snapshot.docs.map(doc => {
//         const data = doc.data() as PropertyData;
//         return {
//           id: doc.id,
//           ...data,
//           status: data.status || [],
//           interiorFeatures: data.interiorFeatures || [],
//           exteriorFeatures: data.exteriorFeatures || [],
//           customFeatures: data.customFeatures || [],
//         };
//       });
//     } catch (error) {
//       console.error('Error getting featured properties:', error);
//       throw error;
//     }
//   }

//   async getHot(limitCount: number = 6): Promise<PropertyWithId[]> {
//     try {
//       const q = query(
//         collection(firestore, this.collectionName),
//         where('hot', '==', true),
//         where('published', '==', true),
//         orderBy('createdAt', 'desc'),
//         limit(limitCount)
//       );

//       const snapshot = await getDocs(q);
//       return snapshot.docs.map(doc => {
//         const data = doc.data() as PropertyData;
//         return {
//           id: doc.id,
//           ...data,
//           status: data.status || [],
//           interiorFeatures: data.interiorFeatures || [],
//           exteriorFeatures: data.exteriorFeatures || [],
//           customFeatures: data.customFeatures || [],
//         };
//       });
//     } catch (error) {
//       console.error('Error getting hot properties:', error);
//       throw error;
//     }
//   }

//   async getNewest(limitCount: number = 6): Promise<PropertyWithId[]> {
//     try {
//       const q = query(
//         collection(firestore, this.collectionName),
//         where('published', '==', true),
//         orderBy('createdAt', 'desc'),
//         limit(limitCount)
//       );

//       const snapshot = await getDocs(q);
//       return snapshot.docs.map(doc => {
//         const data = doc.data() as PropertyData;
//         return {
//           id: doc.id,
//           ...data,
//           status: data.status || [],
//           interiorFeatures: data.interiorFeatures || [],
//           exteriorFeatures: data.exteriorFeatures || [],
//           customFeatures: data.customFeatures || [],
//         };
//       });
//     } catch (error) {
//       console.error('Error getting newest properties:', error);
//       throw error;
//     }
//   }

//   // Statistics
//   async getStats(): Promise<PropertyStats> {
//     try {
//       const q = query(
//         collection(firestore, this.collectionName),
//         where('published', '==', true)
//       );

//       const snapshot = await getDocs(q);

//       let totalProperties = 0;
//       let forSaleCount = 0;
//       let forRentCount = 0;
//       let soldCount = 0;
//       let totalSalePrice = 0;
//       let saleCount = 0;
//       let totalRentPrice = 0;
//       let rentCount = 0;
//       const cities = new Set<string>();
//       const propertyTypes: Record<string, number> = {};

//       snapshot.forEach((docSnap) => {
//         const data = docSnap.data() as PropertyData;
//         totalProperties++;

//         if (data.status?.includes('For Sale')) forSaleCount++;
//         if (data.status?.includes('For Rent')) forRentCount++;
//         if (data.status?.includes('Sold')) soldCount++;

//         if (data.salePrice && data.status?.includes('For Sale')) {
//           totalSalePrice += data.salePrice;
//           saleCount++;
//         }

//         if (data.rentPrice && data.status?.includes('For Rent')) {
//           totalRentPrice += data.rentPrice;
//           rentCount++;
//         }

//         if (data.city) cities.add(data.city);

//         if (data.propertyType) {
//           propertyTypes[data.propertyType] = (propertyTypes[data.propertyType] || 0) + 1;
//         }
//       });

//       return {
//         totalProperties,
//         forSaleCount,
//         forRentCount,
//         soldCount,
//         averageSalePrice: saleCount > 0 ? totalSalePrice / saleCount : 0,
//         averageRentPrice: rentCount > 0 ? totalRentPrice / rentCount : 0,
//         cities: Array.from(cities),
//         propertyTypes
//       };
//     } catch (error) {
//       console.error('Error getting property stats:', error);
//       throw error;
//     }
//   }

//   // View counting
//   async incrementViews(id: string): Promise<void> {
//     try {
//       const docRef = doc(firestore, this.collectionName, id);
//       const docSnap = await getDoc(docRef);

//       if (docSnap.exists()) {
//         const currentViews = docSnap.data().views || 0;
//         await updateDoc(docRef, {
//           views: currentViews + 1,
//           updatedAt: new Date().toISOString(),
//         });
//       }
//     } catch (error) {
//       console.error('Error incrementing views:', error);
//       throw error;
//     }
//   }

//   // Search (basic implementation)
//   async search(term: string, limitCount: number = 10): Promise<PropertyWithId[]> {
//     try {
//       const q = query(
//         collection(firestore, this.collectionName),
//         where('published', '==', true),
//         orderBy('title'),
//         limit(limitCount)
//       );

//       const snapshot = await getDocs(q);
//       const results: PropertyWithId[] = [];

//       snapshot.forEach((docSnap) => {
//         const data = docSnap.data() as PropertyData;
//         const searchableText = [
//           data.title,
//           data.description,
//           data.address,
//           data.city,
//           ...(data.interiorFeatures || []),
//           ...(data.exteriorFeatures || []),
//           ...(data.customFeatures || []),
//         ].join(' ').toLowerCase();

//         if (searchableText.includes(term.toLowerCase())) {
//           results.push({
//             id: docSnap.id,
//             ...data,
//             status: data.status || [],
//             interiorFeatures: data.interiorFeatures || [],
//             exteriorFeatures: data.exteriorFeatures || [],
//             customFeatures: data.customFeatures || [],
//           });
//         }
//       });

//       return results;
//     } catch (error) {
//       console.error('Error searching properties:', error);
//       throw error;
//     }
//   }

//   // Get properties by agent ID (assuming agent has an id field)
//   async getPropertiesByAgent(agentId: string): Promise<PropertyWithId[]> {
//     try {
//       const q = query(
//         collection(firestore, this.collectionName),
//         where('agent.id', '==', agentId),
//         where('published', '==', true),
//         orderBy('createdAt', 'desc')
//       );

//       const snapshot = await getDocs(q);
//       return snapshot.docs.map(doc => {
//         const data = doc.data() as PropertyData;
//         return {
//           id: doc.id,
//           ...data,
//           status: data.status || [],
//           interiorFeatures: data.interiorFeatures || [],
//           exteriorFeatures: data.exteriorFeatures || [],
//           customFeatures: data.customFeatures || [],
//         };
//       });
//     } catch (error) {
//       console.error('Error getting properties by agent:', error);
//       throw error;
//     }
//   }

//   // Toggle favorite status for a property (user-based)
//   async toggleFavorite(propertyId: string, userId: string): Promise<boolean> {
//     try {
//       const userFavoritesRef = doc(firestore, 'userFavorites', userId);
//       const userFavoritesSnap = await getDoc(userFavoritesRef);

//       let favorites: string[] = [];
//       if (userFavoritesSnap.exists()) {
//         favorites = userFavoritesSnap.data().favorites || [];
//       }

//       const isCurrentlyFavorite = favorites.includes(propertyId);

//       if (isCurrentlyFavorite) {
//         // Remove from favorites
//         favorites = favorites.filter(id => id !== propertyId);
//       } else {
//         // Add to favorites
//         favorites.push(propertyId);
//       }

//       // Update user's favorites
//       await updateDoc(userFavoritesRef, {
//         favorites,
//         updatedAt: new Date().toISOString(),
//       }, { merge: true });

//       return !isCurrentlyFavorite;
//     } catch (error) {
//       console.error('Error toggling favorite:', error);
//       throw error;
//     }
//   }

//   // Get user's favorite properties
//   async getUserFavorites(userId: string): Promise<PropertyWithId[]> {
//     try {
//       const userFavoritesRef = doc(firestore, 'userFavorites', userId);
//       const userFavoritesSnap = await getDoc(userFavoritesRef);

//       if (!userFavoritesSnap.exists()) {
//         return [];
//       }

//       const favorites = userFavoritesSnap.data().favorites || [];
//       const properties: PropertyWithId[] = [];

//       // Get each favorite property
//       for (const propertyId of favorites) {
//         const property = await this.getById(propertyId);
//         if (property) {
//           properties.push(property);
//         }
//       }

//       return properties;
//     } catch (error) {
//       console.error('Error getting user favorites:', error);
//       throw error;
//     }
//   }

//   // Private helper methods
//   private async getTotalCount(filters: PropertyFilterOptions): Promise<number> {
//     try {
//       const q = collection(firestore, this.collectionName);
//       const constraints: QueryConstraint[] = [];

//       this.applyFilters(constraints, filters);

//       const finalQuery = query(q, ...constraints);
//       const snapshot = await getDocs(finalQuery);

//       return snapshot.size;
//     } catch (error) {
//       console.error('Error getting total count:', error);
//       return 0;
//     }
//   }

//   private applyFilters(constraints: QueryConstraint[], filters: PropertyFilterOptions): void {
//     constraints.push(where('published', '==', true));

//     if (filters.status && filters.status.length > 0) {
//       constraints.push(where('status', 'array-contains-any', filters.status));
//     }

//     if (filters.propertyTypes && filters.propertyTypes.length > 0) {
//       constraints.push(where('propertyType', 'in', filters.propertyTypes));
//     }

//     if (filters.cities && filters.cities.length > 0) {
//       constraints.push(where('city', 'in', filters.cities));
//     }

//     if (filters.minSalePrice !== undefined) {
//       constraints.push(where('salePrice', '>=', filters.minSalePrice));
//     }
//     if (filters.maxSalePrice !== undefined) {
//       constraints.push(where('salePrice', '<=', filters.maxSalePrice));
//     }
//     if (filters.minRentPrice !== undefined) {
//       constraints.push(where('rentPrice', '>=', filters.minRentPrice));
//     }
//     if (filters.maxRentPrice !== undefined) {
//       constraints.push(where('rentPrice', '<=', filters.maxRentPrice));
//     }

//     if (filters.minBuildingSize !== undefined) {
//       constraints.push(where('buildingSize', '>=', filters.minBuildingSize));
//     }
//     if (filters.maxBuildingSize !== undefined) {
//       constraints.push(where('buildingSize', '<=', filters.maxBuildingSize));
//     }
//     if (filters.minLandSize !== undefined) {
//       constraints.push(where('landSize', '>=', filters.minLandSize));
//     }
//     if (filters.maxLandSize !== undefined) {
//       constraints.push(where('landSize', '<=', filters.maxLandSize));
//     }

//     if (filters.minBedrooms !== undefined) {
//       constraints.push(where('bedrooms', '>=', filters.minBedrooms));
//     }
//     if (filters.maxBedrooms !== undefined) {
//       constraints.push(where('bedrooms', '<=', filters.maxBedrooms));
//     }
//     if (filters.minBathrooms !== undefined) {
//       constraints.push(where('bathrooms', '>=', filters.minBathrooms));
//     }
//     if (filters.maxBathrooms !== undefined) {
//       constraints.push(where('bathrooms', '<=', filters.maxBathrooms));
//     }

//     if (filters.hasPool === true) {
//       constraints.push(where('exteriorFeatures', 'array-contains', 'Swimming Pool'));
//     }
//     if (filters.hasGarage === true) {
//       constraints.push(where('garage', '>', 0));
//     }
//     if (filters.hasGarden === true) {
//       constraints.push(where('exteriorFeatures', 'array-contains', 'Garden'));
//     }

//     if (filters.hot !== undefined) {
//       constraints.push(where('hot', '==', filters.hot));
//     }
//     if (filters.featured !== undefined) {
//       constraints.push(where('featured', '==', filters.featured));
//     }
//     if (filters.exclusive !== undefined) {
//       constraints.push(where('exclusive', '==', filters.exclusive));
//     }
//     if (filters.newListing !== undefined) {
//       constraints.push(where('newListing', '==', filters.newListing));
//     }

//     if (filters.createdAfter) {
//       constraints.push(where('createdAt', '>=', filters.createdAfter.toISOString()));
//     }
//     if (filters.createdBefore) {
//       constraints.push(where('createdAt', '<=', filters.createdBefore.toISOString()));
//     }
//   }

//   private applySorting(constraints: QueryConstraint[], filters: PropertyFilterOptions): void {
//     const sortBy = filters.sortBy || 'createdAt';
//     const sortOrder = filters.sortOrder || 'desc';

//     switch (sortBy) {
//       case 'price':
//         // Sort by sale price first, then rent price
//         constraints.push(orderBy('salePrice', sortOrder));
//         constraints.push(orderBy('rentPrice', sortOrder));
//         break;
//       case 'buildingSize':
//         constraints.push(orderBy('buildingSize', sortOrder));
//         break;
//       case 'landSize':
//         constraints.push(orderBy('landSize', sortOrder));
//         break;
//       case 'bedrooms':
//         constraints.push(orderBy('bedrooms', sortOrder));
//         break;
//       default:
//         constraints.push(orderBy('createdAt', sortOrder));
//     }
//   }
// }

// // Export singleton instance
// export const propertyService = new PropertyService();









// services/PropertyService.ts
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  QueryDocumentSnapshot,
  DocumentData,
  QueryConstraint,
  startAt,
  Timestamp,
} from "firebase/firestore";
import { firestore } from "@/config/firebase";
import { PropertyData } from "@/types/property";

// Extend your existing Property interface if needed
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
  createdAfter?: Date;
  createdBefore?: Date;
  sortBy?: "price" | "createdAt" | "buildingSize" | "landSize" | "bedrooms";
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  hasMore: boolean;
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
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


const allowedStatus = ["For Sale", "For Rent", "Sold"] as const;
type PropertyStatus = typeof allowedStatus[number];

function normalizeStatus(value: unknown): PropertyStatus[] {
  if (!Array.isArray(value)) return [];

  return value.filter(
    (v): v is PropertyStatus => allowedStatus.includes(v)
  );
}



export class PropertyService {
  private readonly collectionName = "properties";
  private readonly defaultPageSize = 12;

  // Basic CRUD operations using your existing pattern
  async create(property: Omit<PropertyData, "id">): Promise<string> {
    try {
      const propertyWithTimestamps = {
        ...property,
        // createdAt: new Date().toISOString(),
        // updatedAt: new Date().toISOString(),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        views: 0,
        favorites: 0,
        published: property.published !== undefined ? property.published : true,
      };

      const docRef = await addDoc(
        collection(firestore, this.collectionName),
        propertyWithTimestamps
      );

      return docRef.id;
    } catch (error) {
      console.error("Error creating property:", error);
      throw error;
    }
  }

  async getById(id: string): Promise<PropertyData | null> {
    try {
      const docRef = doc(firestore, this.collectionName, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      const data = docSnap.data() as PropertyData;
      return {
        // id: docSnap.id,
        ...data,
        status: data.status || [],
        interiorFeatures: data.interiorFeatures || [],
        exteriorFeatures: data.exteriorFeatures || [],
        customFeatures: data.customFeatures || [],
      };
    } catch (error) {
      console.error("Error getting property:", error);
      throw error;
    }
  }

  async update(id: string, updates: Partial<PropertyData>): Promise<void> {
    try {
      const docRef = doc(firestore, this.collectionName, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error updating property:", error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(firestore, this.collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting property:", error);
      throw error;
    }
  }

  // Advanced query methods
  async getAll(): Promise<PropertyData[]> {
    try {
      const q = query(
        collection(firestore, this.collectionName),
        where("published", "==", true),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);
      // return snapshot.docs.map((doc) => ({
      //   // id: doc.id,
      //   ...(doc.data() as PropertyData),
      //   status: (doc.data().status || []) as string[],
      //   interiorFeatures: doc.data().interiorFeatures || [],
      //   exteriorFeatures: doc.data().exteriorFeatures || [],
      //   customFeatures: doc.data().customFeatures || [],
      // }));
      return snapshot.docs.map((doc) => {
        const data = doc.data();

        return {
          ...(data as PropertyData),
          status: normalizeStatus(data.status),
          interiorFeatures: data.interiorFeatures ?? [],
          exteriorFeatures: data.exteriorFeatures ?? [],
          customFeatures: data.customFeatures ?? [],
        };
      });

    } catch (error) {
      console.error("Error getting all properties:", error);
      throw error;
    }
  }

  // Paginated query with filters
  async getPaginated(
    page: number = 1,
    pageSize: number = this.defaultPageSize,
    filters: PropertyFilterOptions = {},
    lastDoc: QueryDocumentSnapshot<DocumentData> | null = null
  ): Promise<PaginatedResult<PropertyData>> {
    try {
      const q = collection(firestore, this.collectionName);
      const constraints: QueryConstraint[] = [];

      // Apply filters
      this.applyFilters(constraints, filters);

      // Apply sorting
      this.applySorting(constraints, filters);

      // Apply pagination for subsequent pages
      if (lastDoc && page > 1) {
        constraints.push(startAfter(lastDoc));
      }

      // Apply page limit
      constraints.push(limit(pageSize + 1));

      // Create query
      const finalQuery = query(q, ...constraints);
      const snapshot = await getDocs(finalQuery);

      // // Process results
      // const items: PropertyData[] = [];
      // let newLastDoc: QueryDocumentSnapshot<DocumentData> | null = null;

      // snapshot.forEach((docSnap, index) => {
      //   const data = docSnap.data() as PropertyData;
      //   // console.log('Document Data:', data);

      //   if (index < pageSize) {
      //     items.push({
      //       id: docSnap.id,
      //       ...data,
      //       status: data.status || [],
      //       interiorFeatures: data.interiorFeatures || [],
      //       exteriorFeatures: data.exteriorFeatures || [],
      //       customFeatures: data.customFeatures || [],
      //     });
      //   }

      //   if (index === pageSize - 1) {
      //     newLastDoc = docSnap;
      //   }
      // });

      // Process results
      const allDocs = snapshot.docs;
      const items: PropertyData[] = allDocs
        .slice(0, pageSize)
        .map((docSnap) => {
          const data = docSnap.data() as PropertyData;
          return {
            // id: docSnap.id,
            ...data,
            status: data.status || [],
            interiorFeatures: data.interiorFeatures || [],
            exteriorFeatures: data.exteriorFeatures || [],
            customFeatures: data.customFeatures || [],
          };
        });

      // Set lastDoc to the last document of current page (if exists)
      const newLastDoc = items.length > 0 ? allDocs[items.length - 1] : null;

      // Get total count (if first page)
      let total = 0;
      if (page === 1) {
        total = await this.getTotalCount(filters);
      }

      const hasMore = snapshot.size > pageSize;

      return {
        items,
        total,
        hasMore,
        lastDoc: newLastDoc,
        page,
        pageSize,
      };
    } catch (error) {
      console.error("Error getting paginated properties:", error);
      throw error;
    }
  }

  // Special collections
  async getFeatured(limitCount: number = 6): Promise<PropertyData[]> {
    try {
      const q = query(
        collection(firestore, this.collectionName),
        where("featured", "==", true),
        where("published", "==", true),
        orderBy("createdAt", "desc"),
        limit(limitCount)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        // id: doc.id,
        ...(doc.data() as PropertyData),
        status: doc.data().status || [],
        interiorFeatures: doc.data().interiorFeatures || [],
        exteriorFeatures: doc.data().exteriorFeatures || [],
        customFeatures: doc.data().customFeatures || [],
      }));
    } catch (error) {
      console.error("Error getting featured properties:", error);
      throw error;
    }
  }

  async getHot(limitCount: number = 6): Promise<PropertyData[]> {
    try {
      const q = query(
        collection(firestore, this.collectionName),
        where("hot", "==", true),
        where("published", "==", true),
        orderBy("createdAt", "desc"),
        limit(limitCount)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        // id: doc.id,
        ...(doc.data() as PropertyData),
        status: doc.data().status || [],
        interiorFeatures: doc.data().interiorFeatures || [],
        exteriorFeatures: doc.data().exteriorFeatures || [],
        customFeatures: doc.data().customFeatures || [],
      }));
    } catch (error) {
      console.error("Error getting hot properties:", error);
      throw error;
    }
  }

  async getNewest(limitCount: number = 6): Promise<PropertyData[]> {
    try {
      const q = query(
        collection(firestore, this.collectionName),
        where("published", "==", true),
        orderBy("createdAt", "desc"),
        limit(limitCount)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        // id: doc.id,
        ...(doc.data() as PropertyData),
        status: doc.data().status || [],
        interiorFeatures: doc.data().interiorFeatures || [],
        exteriorFeatures: doc.data().exteriorFeatures || [],
        customFeatures: doc.data().customFeatures || [],
      }));
    } catch (error) {
      console.error("Error getting newest properties:", error);
      throw error;
    }
  }

  // Statistics
  async getStats(): Promise<PropertyStats> {
    try {
      const q = query(
        collection(firestore, this.collectionName),
        where("published", "==", true)
      );

      const snapshot = await getDocs(q);

      const cityCounts: Record<string, number> = {};

      let totalProperties = 0;
      let forSaleCount = 0;
      let forRentCount = 0;
      let soldCount = 0;
      let totalSalePrice = 0;
      let saleCount = 0;
      let totalRentPrice = 0;
      let rentCount = 0;
      const cities = new Set<string>();
      const propertyTypes: Record<string, number> = {};

      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as PropertyData;
        totalProperties++;

        if (data.status?.includes("For Sale")) forSaleCount++;
        if (data.status?.includes("For Rent")) forRentCount++;
        if (data.status?.includes("Sold")) soldCount++;

        if (data.salePrice && data.status?.includes("For Sale")) {
          totalSalePrice += data.salePrice;
          saleCount++;
        }

        if (data.rentPrice && data.status?.includes("For Rent")) {
          totalRentPrice += data.rentPrice;
          rentCount++;
        }

        // if (data.city) cities.add(data.city);

        if (data.propertyType) {
          propertyTypes[data.propertyType] =
            (propertyTypes[data.propertyType] || 0) + 1;
        }

        if (data.city) {
          cities.add(data.city);
          cityCounts[data.city] = (cityCounts[data.city] || 0) + 1;
        }
      });

      return {
        totalProperties,
        forSaleCount,
        forRentCount,
        soldCount,
        averageSalePrice: saleCount > 0 ? totalSalePrice / saleCount : 0,
        averageRentPrice: rentCount > 0 ? totalRentPrice / rentCount : 0,
        cities: Array.from(cities),
        cityCounts,
        propertyTypes,
      };
    } catch (error) {
      console.error("Error getting property stats:", error);
      throw error;
    }
  }

  // View counting
  async incrementViews(id: string): Promise<void> {
    try {
      const docRef = doc(firestore, this.collectionName, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const currentViews = docSnap.data().views || 0;
        await updateDoc(docRef, {
          views: currentViews + 1,
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("Error incrementing views:", error);
      throw error;
    }
  }

  // Search (basic implementation)
  async search(term: string, limitCount: number = 10): Promise<PropertyData[]> {
    try {
      const q = query(
        collection(firestore, this.collectionName),
        where("published", "==", true),
        orderBy("title"),
        limit(limitCount)
      );

      const snapshot = await getDocs(q);
      const results: PropertyData[] = [];

      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as PropertyData;
        const searchableText = [
          data.title,
          data.description,
          data.address,
          data.city,
          ...(data.interiorFeatures || []),
          ...(data.exteriorFeatures || []),
          ...(data.customFeatures || []),
        ]
          .join(" ")
          .toLowerCase();

        if (searchableText.includes(term.toLowerCase())) {
          results.push({
            // id: docSnap.id,
            ...data,
            status: data.status || [],
            interiorFeatures: data.interiorFeatures || [],
            exteriorFeatures: data.exteriorFeatures || [],
            customFeatures: data.customFeatures || [],
          });
        }
      });

      return results;
    } catch (error) {
      console.error("Error searching properties:", error);
      throw error;
    }
  }

  // Private helper methods
  private async getTotalCount(filters: PropertyFilterOptions): Promise<number> {
    try {
      const q = collection(firestore, this.collectionName);
      const constraints: QueryConstraint[] = [];

      this.applyFilters(constraints, filters);

      const finalQuery = query(q, ...constraints);
      const snapshot = await getDocs(finalQuery);

      return snapshot.size;
    } catch (error) {
      console.error("Error getting total count:", error);
      return 0;
    }
  }

  private applyFilters(
    constraints: QueryConstraint[],
    filters: PropertyFilterOptions
  ): void {
    constraints.push(where("published", "==", true));

    // if (filters.status && filters.status.length > 0) {
    //   constraints.push(where('status', 'array-contains-any', filters.status));
    // }
    if (filters.status && filters.status.length === 1) {
      constraints.push(where("status", "array-contains", filters.status[0]));
    }

    if (filters.propertyTypes && filters.propertyTypes.length > 0) {
      constraints.push(where("propertyType", "in", filters.propertyTypes));
    }

    if (filters.cities && filters.cities.length > 0) {
      constraints.push(where("city", "in", filters.cities));
    }

    if (filters.minSalePrice !== undefined) {
      constraints.push(where("salePrice", ">=", filters.minSalePrice));
    }
    if (filters.maxSalePrice !== undefined) {
      constraints.push(where("salePrice", "<=", filters.maxSalePrice));
    }
    if (filters.minRentPrice !== undefined) {
      constraints.push(where("rentPrice", ">=", filters.minRentPrice));
    }
    if (filters.maxRentPrice !== undefined) {
      constraints.push(where("rentPrice", "<=", filters.maxRentPrice));
    }

    if (filters.minBuildingSize !== undefined) {
      constraints.push(where("buildingSize", ">=", filters.minBuildingSize));
    }
    if (filters.maxBuildingSize !== undefined) {
      constraints.push(where("buildingSize", "<=", filters.maxBuildingSize));
    }
    if (filters.minLandSize !== undefined) {
      constraints.push(where("landSize", ">=", filters.minLandSize));
    }
    if (filters.maxLandSize !== undefined) {
      constraints.push(where("landSize", "<=", filters.maxLandSize));
    }

    if (filters.minBedrooms !== undefined) {
      constraints.push(where("bedrooms", ">=", filters.minBedrooms));
    }
    if (filters.maxBedrooms !== undefined) {
      constraints.push(where("bedrooms", "<=", filters.maxBedrooms));
    }
    if (filters.minBathrooms !== undefined) {
      constraints.push(where("bathrooms", ">=", filters.minBathrooms));
    }
    if (filters.maxBathrooms !== undefined) {
      constraints.push(where("bathrooms", "<=", filters.maxBathrooms));
    }

    if (filters.hasPool === true) {
      constraints.push(
        where("exteriorFeatures", "array-contains", "Swimming Pool")
      );
    }
    if (filters.hasGarage === true) {
      constraints.push(where("garage", ">", 0));
    }
    if (filters.hasGarden === true) {
      constraints.push(where("exteriorFeatures", "array-contains", "Garden"));
    }

    if (filters.hot !== undefined) {
      constraints.push(where("hot", "==", filters.hot));
    }
    if (filters.featured !== undefined) {
      constraints.push(where("featured", "==", filters.featured));
    }
    if (filters.exclusive !== undefined) {
      constraints.push(where("exclusive", "==", filters.exclusive));
    }
    if (filters.newListing !== undefined) {
      constraints.push(where("newListing", "==", filters.newListing));
    }

    if (filters.createdAfter) {
      constraints.push(
        where("createdAt", ">=", filters.createdAfter.toISOString())
      );
    }
    if (filters.createdBefore) {
      constraints.push(
        where("createdAt", "<=", filters.createdBefore.toISOString())
      );
    }
  }

  private applySorting(
    constraints: QueryConstraint[],
    filters: PropertyFilterOptions
  ): void {
    const sortBy = filters.sortBy || "createdAt";
    const sortOrder = filters.sortOrder || "desc";

    switch (sortBy) {
      // case 'price':
      //   constraints.push(orderBy('salePrice', sortOrder));
      //   constraints.push(orderBy('rentPrice', sortOrder));
      //   break;
      case "price":
        constraints.push(orderBy("salePrice", sortOrder));
        break;
      case "buildingSize":
        constraints.push(orderBy("buildingSize", sortOrder));
        break;
      case "landSize":
        constraints.push(orderBy("landSize", sortOrder));
        break;
      case "bedrooms":
        constraints.push(orderBy("bedrooms", sortOrder));
        break;
      default:
        constraints.push(orderBy("createdAt", sortOrder));
    }
  }
}

// Export singleton instance
export const propertyService = new PropertyService();