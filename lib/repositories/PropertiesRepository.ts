// // lib/repositories/PropertiesRepository.ts
// import { createClient } from "@/lib/supabase/supabase";
// import { PropertyData } from "@/types/property";

// export class PropertiesRepository {
//   private supabase = createClient();
//   private table = "properties";

//   /* =========================
//      CREATE
//   ========================== */
//   async create(data: Omit<PropertyData, "id">) {
//     // Convert camelCase to snake_case for Supabase
//     const snakeCaseData = this.convertToSnakeCase(data);
    
//     const { data: result, error } = await this.supabase
//       .from(this.table)
//       .insert({
//         ...snakeCaseData,
//         created_at: new Date().toISOString(),
//         updated_at: new Date().toISOString(), // Add updated_at too
//       })
//       .select()
//       .single();

//     if (error) throw error;
    
//     // Convert back to camelCase for the frontend
//     return this.convertToCamelCase(result) as PropertyData;
//   }

//   /* =========================
//     HELPER METHODS
//   ========================== */
//   private convertToSnakeCase(obj: any): any {
//     if (obj === null || obj === undefined) return obj;
//     if (Array.isArray(obj)) return obj.map(item => this.convertToSnakeCase(item));
//     if (typeof obj !== 'object') return obj;

//     const newObj: any = {};
//     for (const key in obj) {
//       if (obj.hasOwnProperty(key)) {
//         const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
//         newObj[snakeKey] = this.convertToSnakeCase(obj[key]);
//       }
//     }
//     return newObj;
//   }

//   private convertToCamelCase(obj: any): any {
//     if (obj === null || obj === undefined) return obj;
//     if (Array.isArray(obj)) return obj.map(item => this.convertToCamelCase(item));
//     if (typeof obj !== 'object') return obj;

//     const newObj: any = {};
//     for (const key in obj) {
//       if (obj.hasOwnProperty(key)) {
//         const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
//         newObj[camelKey] = this.convertToCamelCase(obj[key]);
//       }
//     }
//     return newObj;
//   }


//   /* =========================
//      UPDATE
//   ========================== */
//   async update(id: string, data: Partial<PropertyData>) {
//     const { data: result, error } = await this.supabase
//       .from(this.table)
//       .update({
//         ...data,
//         updated_at: new Date().toISOString(),
//       })
//       .eq("id", id)
//       .select()
//       .single();

//     if (error) throw error;
//     return result as PropertyData;
//   }

//   /* =========================
//      DELETE
//   ========================== */
//   async delete(id: string) {
//     const { error } = await this.supabase
//       .from(this.table)
//       .delete()
//       .eq("id", id);

//     if (error) throw error;
//     return true;
//   }

//   /* =========================
//      GET BY ID
//   ========================== */
//   async getById(id: string) {
//     const { data, error } = await this.supabase
//       .from(this.table)
//       .select("*")
//       .eq("id", id)
//       .single();

//     if (error) throw error;
//     return data as PropertyData;
//   }

//   /* =========================
//      GET ALL (ADMIN / EXPORT)
//   ========================== */
//   async getAll() {
//     const { data, error } = await this.supabase
//       .from(this.table)
//       .select("*")
//       .order("created_at", { ascending: false });

//     if (error) throw error;
//     return data as PropertyData[];
//   }

//   /* =========================
//      PAGINATION + FILTERING
//   ========================== */
//   async getPaged(options: {
//     page?: number;
//     pageSize?: number;
//     city?: string;
//     propertyType?: PropertyData["propertyType"];
//     status?: "For Sale" | "For Rent" | "Sold";
//     minPrice?: number;
//     maxPrice?: number;
//     featured?: boolean;
//     orderBy?: "created_at" | "salePrice" | "rentPrice" | "views";
//     ascending?: boolean;
//   }) {
//     const {
//       page = 1,
//       pageSize = 12,
//       city,
//       propertyType,
//       status,
//       minPrice,
//       maxPrice,
//       featured,
//       orderBy = "created_at",
//       ascending = false,
//     } = options;

//     const from = (page - 1) * pageSize;
//     const to = from + pageSize - 1;

//     let query = this.supabase
//       .from(this.table)
//       .select("*", { count: "exact" })
//       .eq("published", true)
//       .eq("draft", false);

//     if (city) query = query.eq("city", city);
//     if (propertyType) query = query.eq("propertyType", propertyType);
//     if (featured !== undefined) query = query.eq("featured", featured);
//     if (status) query = query.contains("status", [status]);

//     if (minPrice) {
//       query = query.or(
//         `salePrice.gte.${minPrice},rentPrice.gte.${minPrice}`
//       );
//     }

//     if (maxPrice) {
//       query = query.or(
//         `salePrice.lte.${maxPrice},rentPrice.lte.${maxPrice}`
//       );
//     }

//     const { data, count, error } = await query
//       .order(orderBy, { ascending })
//       .range(from, to);

//     if (error) throw error;

//     return {
//       data: data as PropertyData[],
//       page,
//       pageSize,
//       total: count ?? 0,
//       totalPages: Math.ceil((count ?? 0) / pageSize),
//     };
//   }

//   /* =========================
//      INCREMENT VIEWS
//   ========================== */
//   async incrementViews(id: string) {
//     await this.supabase.rpc("increment_property_views", {
//       property_id: id,
//     });
//   }
// }



// lib/repositories/PropertiesRepository.ts
import { createClient } from "@/lib/supabase/supabase";
import { PropertyData } from "@/types/property";

type PropertyStatus = "For Sale" | "For Rent" | "Sold";

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

export class PropertiesRepository {
  private supabase = createClient();
  private table = "properties";

  /* =========================
     CREATE
  ========================== */
  async create(data: Omit<PropertyData, "id">) {
    console.log('CREATE - Original data:', data);
    
    // Convert camelCase to snake_case for Supabase
    const snakeCaseData = this.convertToSnakeCase(data);
    console.log('CREATE - Converted to snake_case:', snakeCaseData);
    
    const { data: result, error } = await this.supabase
      .from(this.table)
      .insert({
        ...snakeCaseData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('CREATE - Supabase error:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw error;
    }
    
    console.log('CREATE - Success, result:', result);
    // Convert back to camelCase for the frontend
    return this.convertToCamelCase(result) as PropertyData;
  }
// async create(data: Omit<PropertyData, "id">) {
//   console.log('CREATE - Original data:', data);
  
//   // Convert camelCase to snake_case for Supabase
//   const snakeCaseData = this.convertToSnakeCase(data);
//   console.log('CREATE - Converted to snake_case:', snakeCaseData);
  
//   // REMOVE created_at and updated_at from the insert
//   // The database has defaults for these
//   const { data: result, error } = await this.supabase
//     .from(this.table)
//     .insert(snakeCaseData) // Just send the data, no extra fields
//     .select()
//     .single();

//   if (error) {
//     console.error('CREATE - Supabase error:', {
//       message: error.message,
//       details: error.details,
//       hint: error.hint,
//       code: error.code
//     });
//     throw error;
//   }
  
//   console.log('CREATE - Success, result:', result);
//   // Convert back to camelCase for the frontend
//   return this.convertToCamelCase(result) as PropertyData;
// }

  /* =========================
    HELPER METHODS
  ========================== */
  // private convertToSnakeCase(obj: any): any {
  //   if (obj === null || obj === undefined) return obj;
  //   if (Array.isArray(obj)) return obj.map(item => this.convertToSnakeCase(item));
  //   if (typeof obj !== 'object') return obj;

  //   const newObj: any = {};
  //   for (const key in obj) {
  //     if (obj.hasOwnProperty(key)) {
  //       const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
  //       newObj[snakeKey] = this.convertToSnakeCase(obj[key]);
  //     }
  //   }
  //   return newObj;
  // }
private convertToSnakeCase(obj: any): any {
  if (obj === null || obj === undefined) {
    return null;
  }
  if (Array.isArray(obj)) {
    return obj.map(item => this.convertToSnakeCase(item));
  }
  if (typeof obj !== 'object') {
    return obj;
  }

  const newObj: any = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      // Convert camelCase to snake_case
      const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      newObj[snakeKey] = this.convertToSnakeCase(obj[key]);
    }
  }
  return newObj;
}

  convertToCamelCase(obj: any): any {
    if (obj === null || obj === undefined) return obj;
    if (Array.isArray(obj)) return obj.map(item => this.convertToCamelCase(item));
    if (typeof obj !== 'object') return obj;

    const newObj: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
        newObj[camelKey] = this.convertToCamelCase(obj[key]);
      }
    }
    return newObj;
  }

  /* =========================
     UPDATE
  ========================== */
  async update(id: string, data: Partial<PropertyData>) {
    const snakeCaseData = this.convertToSnakeCase(data);
    
    const { data: result, error } = await this.supabase
      .from(this.table)
      .update({
        ...snakeCaseData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return this.convertToCamelCase(result) as PropertyData;
  }

  /* =========================
     DELETE
  ========================== */
  async delete(id: string) {
    const { error } = await this.supabase
      .from(this.table)
      .delete()
      .eq("id", id);

    if (error) throw error;
    return true;
  }

  /* =========================
     GET BY ID
  ========================== */
  // async getById(id: string) {
  //   const { data, error } = await this.supabase
  //     .from(this.table)
  //     .select("*")
  //     .eq("id", id)
  //     .single();

  //   if (error) throw error;
  //   return this.convertToCamelCase(data) as PropertyData;
  // }
  async getById(id: string): Promise<PropertyData | null> {
    const { data, error } = await this.supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) {
      // console.error('Error fetching property:', error);
      return null;
    }
    
    return this.convertToCamelCase(data);
  }


  /* =========================
     GET ALL (ADMIN / EXPORT)
  ========================== */
  async getAll() {
    const { data, error } = await this.supabase
      .from(this.table)
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data.map(item => this.convertToCamelCase(item)) as PropertyData[];
  }

  /* =========================
     PAGINATION + FILTERING
  ========================== */
  // async getPaged(options: {
  //   page?: number;
  //   pageSize?: number;
  //   city?: string;
  //   propertyType?: PropertyData["propertyType"];
  //   status?: "For Sale" | "For Rent" | "Sold";
  //   minPrice?: number;
  //   maxPrice?: number;
  //   featured?: boolean;
  //   orderBy?: "created_at" | "salePrice" | "rentPrice" | "views";
  //   ascending?: boolean;
  // }) {
  //   const {
  //     page = 1,
  //     pageSize = 12,
  //     city,
  //     propertyType,
  //     status,
  //     minPrice,
  //     maxPrice,
  //     featured,
  //     orderBy = "created_at",
  //     ascending = false,
  //   } = options;

  //   const from = (page - 1) * pageSize;
  //   const to = from + pageSize - 1;

  //   let query = this.supabase
  //     .from(this.table)
  //     .select("*", { count: "exact" })
  //     .eq("published", true)
  //     .eq("draft", false);

  //   if (city) query = query.eq("city", city);
  //   if (propertyType) query = query.eq("property_type", propertyType); // snake_case
  //   if (featured !== undefined) query = query.eq("featured", featured);
  //   if (status) query = query.contains("status", [status]);

  //   if (minPrice) {
  //     query = query.or(
  //       `sale_price.gte.${minPrice},rent_price.gte.${minPrice}` // snake_case
  //     );
  //   }

  //   if (maxPrice) {
  //     query = query.or(
  //       `sale_price.lte.${maxPrice},rent_price.lte.${maxPrice}` // snake_case
  //     );
  //   }

  //   const { data, count, error } = await query
  //     .order(orderBy, { ascending })
  //     .range(from, to);

  //   if (error) throw error;

  //   return {
  //     data: data.map(item => this.convertToCamelCase(item)) as PropertyData[],
  //     page,
  //     pageSize,
  //     total: count ?? 0,
  //     totalPages: Math.ceil((count ?? 0) / pageSize),
  //   };
  // }

  async getPaged(options: {
    page?: number;
    pageSize?: number;
    city?: string;
    // propertyType?: PropertyData["propertyType"];
    propertyTypes?: PropertyData["propertyType"][];
    // status?: "For Sale" | "For Rent" | "Sold";
    status?: PropertyStatus[];
    minPrice?: number;
    maxPrice?: number;
    featured?: boolean;
    orderBy?: "created_at" | "salePrice" | "rentPrice" | "views";
    ascending?: boolean;
  }) {
    const {
      page = 1,
      pageSize = 12,
      city,
      // propertyType,
      propertyTypes,
      status,
      minPrice,
      maxPrice,
      featured,
      orderBy = "created_at",
      ascending = false,
    } = options;

    // console.log('getPaged - Options:', options);

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    try {
      let query = this.supabase
        .from(this.table)
        .select("*", { count: "exact" })
        // .eq("published", true)
        // .eq("draft", false);

      // console.log('getPaged - Initial query built');

      if (city) {
        query = query.eq("city", city);
        // console.log('getPaged - Added city filter:', city);
      }
      
      // if (propertyType) {
      //   query = query.eq("property_type", propertyType);
      //   // console.log('getPaged - Added property_type filter:', propertyType);
      // }
      if (propertyTypes && propertyTypes.length > 0) {
        query = query.in("property_type", propertyTypes);
      }


      if (featured !== undefined) {
        query = query.eq("featured", featured);
        // console.log('getPaged - Added featured filter:', featured);
      }
      
      // Fix for status filter - Supabase array contains
      // if (status) {
      //   // // console.log('getPaged - Adding status filter:', status);
      //   // // First, let's check what's actually in the database
      //   // const testQuery = this.supabase
      //   //   .from(this.table)
      //   //   .select("status")
      //   //   .limit(5);
        
      //   // const { data: testData } = await testQuery;
      //   // // console.log('getPaged - Sample status data:', testData);
        
      //   // Try different approaches for status filtering
      //   try {
      //     // Approach 1: Use contains for array
      //     query = query.contains("status", [status]);
      //     // console.log('getPaged - Using contains for status');
      //   } catch (statusError) {
      //     console.error('getPaged - Status filter error, trying alternative:', statusError);
      //     // If contains doesn't work, we'll filter client-side later
      //     query = query; // no filter
      //   }
      // }

      // if (status && status.length > 0) {
      //   query = query.contains("status", status);
      // }

      if (status && status.length > 0) {
        const orConditions = status
          .map(s => `status.cs.{${s}}`)
          .join(",");

        query = query.or(orConditions);
      }



      // Price filtering - check both sale and rent prices
      if (minPrice !== undefined) {
        query = query.or(`sale_price.gte.${minPrice},rent_price.gte.${minPrice}`);
        // console.log('getPaged - Added minPrice filter:', minPrice);
      }

      if (maxPrice !== undefined) {
        query = query.or(`sale_price.lte.${maxPrice},rent_price.lte.${maxPrice}`);
        // console.log('getPaged - Added maxPrice filter:', maxPrice);
      }

      // console.log('getPaged - Final query executing...');
      const { data, count, error } = await query
        .order(orderBy, { ascending })
        // .range(from, to);

      if (error) {
        console.error('getPaged - Supabase error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
          fullError: error
        });
        throw error;
      }

      // console.log('getPaged - Query successful, data count:', data?.length);

      // Convert snake_case to camelCase
      const camelCaseData = data.map(item => this.convertToCamelCase(item)) as PropertyData[];

      // // If we have a status filter but couldn't apply it server-side, filter client-side
      // if (status && data?.length > 0) {
      //   const filteredData = camelCaseData.filter(item => 
      //     item.status && item.status.includes(status)
      //   );
      //   // console.log('getPaged - Client-side status filtering:', {
      //   //   before: camelCaseData.length,
      //   //   after: filteredData.length,
      //   //   status
      //   // });
        
      //   return {
      //     data: filteredData,
      //     page,
      //     pageSize,
      //     total: filteredData.length, // Note: this is filtered total, not full total
      //     totalPages: Math.ceil(filteredData.length / pageSize),
      //   };
      // }

      return {
        data: camelCaseData,
        page,
        pageSize,
        total: count ?? 0,
        totalPages: Math.ceil((count ?? 0) / pageSize),
      };
    } catch (error: any) {
      console.error('getPaged - Unexpected error:', error);
      throw error;
    }
  }

async getStats(): Promise<PropertyStats> {
  const { data: stats, error } = await this.supabase
    .from('property_stats')
    .select('*')
    .single();

  if (error) throw error;

  const { data: cityRows, error: cityError } = await this.supabase
    .from('property_city_counts')
    .select('city, count');

  if (cityError) throw cityError;

  const cityCounts: Record<string, number> = {};
  const cities: string[] = [];

  cityRows.forEach(row => {
    cityCounts[row.city] = row.count;
    cities.push(row.city);
  });

  return {
    totalProperties: stats.total_properties,
    forSaleCount: stats.for_sale_count,
    forRentCount: stats.for_rent_count,
    soldCount: stats.sold_count,
    averageSalePrice: stats.average_sale_price ?? 0,
    averageRentPrice: stats.average_rent_price ?? 0,
    cities,
    cityCounts,
    propertyTypes: {}, // can be added via another view if needed
  };
}


  /* =========================
     INCREMENT VIEWS
  ========================== */
  async incrementViews(id: string) {
    await this.supabase.rpc("increment_property_views", {
      property_id: id,
    });
  }
}