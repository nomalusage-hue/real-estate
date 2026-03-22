// // services/FeaturedPropertiesService.ts
// import { mapProperty } from '@/lib/mappers/propertyMapper';
// import { createClient } from '@/lib/supabase/supabase';
// import { PropertyData } from '@/types/property';

// export async function getHomepageFeaturedProperties(): Promise<{
//   wide: PropertyData | null;
//   mini: PropertyData[];
//   stack: PropertyData[];
// }> {
//   const supabase = createClient();

//   // Wide Highlight Card
//   const { data: wideData } = await supabase
//     .from('properties')
//     .select('*')
//     .eq('published', true)
//     .eq('featured', true)
//     .or('status.cs.{For Sale}')
//     .order('hot', { ascending: false })
//     .order('created_at', { ascending: false })
//     .limit(1)
//     .maybeSingle();

//   const wideId = wideData?.id;

//   // Mini Cards
//   let miniQuery = supabase
//     .from('properties')
//     .select('*')
//     .eq('published', true)
//     .or('status.cs.{For Sale}')
//     .or('featured.eq.true,hot.eq.true,new_listing.eq.true');

//   if (wideId) miniQuery = miniQuery.not('id', 'eq', wideId);

//   const { data: miniData } = await miniQuery
//     .order('hot', { ascending: false })
//     .order('new_listing', { ascending: false })
//     .order('created_at', { ascending: false })
//     .limit(3);

//   const miniIds = miniData?.map((p) => p.id) ?? [];

//   // Stack Cards
//   let stackQuery = supabase
//     .from('properties')
//     .select('*')
//     .eq('published', true);

//   const excludeIds = [wideId, ...miniIds].filter(Boolean);

//   if (excludeIds.length > 0) {
//     stackQuery = stackQuery.not(
//       'id',
//       'in',
//       `(${excludeIds.join(',')})`
//     );
//   }

//   const { data: stackData } = await stackQuery
//     .order('created_at', { ascending: false })
//     .limit(3);

//   // return {
//   //   wide: wideData ?? null,
//   //   mini: miniData ?? [],
//   //   stack: stackData ?? [],
//   // };
//   return {
//     wide: wideData ? mapProperty(wideData) : null,
//     mini: (miniData ?? []).map(mapProperty),
//     stack: (stackData ?? []).map(mapProperty),
//   };
// }

// // services/FeaturedPropertiesService.ts

// import { mapProperty } from '@/lib/mappers/propertyMapper';
// import { createClient } from '@/lib/supabase/supabase';
// import { PropertyData } from '@/types/property';

// export async function getHomepageFeaturedProperties(): Promise<{
//   wide: PropertyData | null;
//   mini: PropertyData[];
//   stack: PropertyData[];
// }> {
//   const supabase = createClient();

//   const { data, error } = await supabase
//     .from('properties')
//     .select(`*`)
//     .eq('published', true)
//     // Priority ordering
//     .order('featured', { ascending: false })
//     .order('hot', { ascending: false })
//     .order('new_listing', { ascending: false })
//     .order('created_at', { ascending: false })
//     .limit(7); // enough to safely slice 1 + 3 + 3

//   if (error) {
//     console.error('Failed to fetch homepage properties:', error);
//     return {
//       wide: null,
//       mini: [],
//       stack: [],
//     };
//   }

//   const mapped = (data ?? []).map(mapProperty);

//   return {
//     wide: mapped[0] ?? null,
//     mini: mapped.slice(1, 4),
//     stack: mapped.slice(4, 7),
//   };
// }

// import { mapProperty } from '@/lib/mappers/propertyMapper';
// import { createClient } from '@/lib/supabase/supabase';
// import { PropertyData } from '@/types/property';

// /** Initial load — top 7 properties split into wide / mini / stack */
// export async function getHomepageFeaturedProperties(): Promise<{ wide: PropertyData | null; mini: PropertyData[]; stack: PropertyData[]; fixedExcludeIds: string[]; totalStackPages: number }>
// {
//   const supabase = createClient();

//   const { data, error } = await supabase
//     .from('properties')
//     .select('*')
//     .eq('published', true)
//     .order('featured',    { ascending: false })
//     .order('hot',         { ascending: false })
//     .order('new_listing', { ascending: false })
//     .order('created_at',  { ascending: false })
//     .limit(7);

//   if (error) {
//     console.error('Failed to fetch homepage properties:', error);
//     return { wide: null, mini: [], stack: [], fixedExcludeIds: [], totalStackPages: 0};
//   }

//   // ADD this right after the existing `const { data, error } = await supabase...` block
//   const { count } = await supabase
//     .from('properties')
//     .select('*', { count: 'exact', head: true })
//     .eq('published', true);

//   const totalStackPages = Math.max(1, Math.ceil(((count ?? 0) - 4) / 3));

//   const mapped = (data ?? []).map(mapProperty);
//   const fixedExcludeIds = mapped.slice(0, 4).map((p) => p.id); // wide + mini ids

//   return {
//     wide: mapped[0] ?? null,
//     mini: mapped.slice(1, 4),
//     stack: mapped.slice(4, 7),
//     fixedExcludeIds,
//     totalStackPages,
//   };
// }

// /**
//  * Fetch a subsequent page of stack cards.
//  * @param page          0-based page index (page 0 = already loaded, start from 1)
//  * @param excludeIds    ids to always skip (the fixed wide + mini cards)
//  * @param pageSize      cards per page (default 3)
//  */
// export async function getStackPage(
//   page: number,
//   excludeIds: string[],
//   pageSize = 3
// ): Promise<PropertyData[]> {
//   const supabase = createClient();

//   let query = supabase
//     .from('properties')
//     .select('*')
//     .eq('published', true)
//     .order('featured',    { ascending: false })
//     .order('hot',         { ascending: false })
//     .order('new_listing', { ascending: false })
//     .order('created_at',  { ascending: false })
//     .range(page * pageSize, page * pageSize + pageSize - 1);

//   if (excludeIds.length > 0) {
//     query = query.not('id', 'in', `(${excludeIds.join(',')})`);
//   }

//   const { data, error } = await query;

//   if (error) {
//     console.error('Failed to fetch stack page:', error);
//     return [];
//   }

//   return (data ?? []).map(mapProperty);
// }

// export async function getFilteredStackCount(
//   filter: "For Sale" | "For Rent",
//   excludeIds: string[]
// ): Promise<number> {
//   const supabase = createClient();

//   let query = supabase
//     .from("properties")
//     .select("*", { count: "exact", head: true })
//     .eq("published", true)
//     .contains("status", [filter]);

//   if (excludeIds.length > 0) {
//     query = query.not("id", "in", `(${excludeIds.join(",")})`);
//   }

//   const { count } = await query;
//   return count ?? 0;
// }

import { mapProperty } from "@/lib/mappers/propertyMapper";
import { createClient } from "@/lib/supabase/supabase";
import { PropertyData } from "@/types/property";

const PAGE_SIZE = 3;

/** Initial load — top 7 split into wide / mini / stack */
export async function getHomepageFeaturedProperties(): Promise<{
  wide: PropertyData | null;
  mini: PropertyData[];
  stack: PropertyData[];
  fixedExcludeIds: string[];
  totalStackPages: number;
}> {
  const supabase = createClient();

  // Fetch top 7 + total count in parallel
  const [{ data, error }, { count }] = await Promise.all([
    supabase
      .from("properties")
      .select("*")
      .eq("published", true)
      .order('priority',    { ascending: false, nullsFirst: false })
      .order('featured',    { ascending: false })
      .order('hot',         { ascending: false })
      .order('new_listing', { ascending: false })
      .order('created_at',  { ascending: false })
      .limit(7),

    // supabase
    //   .from('properties')
    //   .select('*', { count: 'exact', head: true })
    //   .eq('published', true),
    supabase
      .from("properties")
      .select("*", { count: "exact", head: true })
      .eq("published", true)
      .or('status.cs.{"For Sale"},status.cs.{"For Rent"}'),
  ]);

  if (error) {
    console.error("Failed to fetch homepage properties:", error);
    return {
      wide: null,
      mini: [],
      stack: [],
      fixedExcludeIds: [],
      totalStackPages: 1,
    };
  }

  const mapped = (data ?? []).map(mapProperty);
  const fixedExcludeIds = mapped.slice(0, 4).map((p) => p.id);
  const stackTotal = Math.max(0, (count ?? 0) - 4); // subtract wide + mini
  const totalStackPages = Math.max(1, Math.ceil(stackTotal / PAGE_SIZE));

  return {
    wide: mapped[0] ?? null,
    mini: mapped.slice(1, 4),
    stack: mapped.slice(4, 7),
    fixedExcludeIds,
    totalStackPages,
  };
}

/**
 * Fetch a page of stack cards — with optional status filter done in SQL.
 * filter = undefined → no WHERE on status (all)
 * filter = "For Sale" | "For Rent" → .contains('status', [filter])
 */
export async function getStackPage(
  page: number,
  excludeIds: string[],
  filter?: "For Sale" | "For Rent",
): Promise<{ data: PropertyData[]; total: number }> {
  const supabase = createClient();

  const from = page * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let dataQuery = supabase
    .from("properties")
    .select("*")
    .eq("published", true)
    .order("featured", { ascending: false })
    .order("hot", { ascending: false })
    .order("new_listing", { ascending: false })
    .order("created_at", { ascending: false })
    .range(from, to);

  let countQuery = supabase
    .from("properties")
    .select("*", { count: "exact", head: true })
    .eq("published", true);

  // Apply status filter in SQL — no client-side filtering needed
  // "All" = For Sale + For Rent (exclude Sold)
  // specific filter = exact status match
  if (filter) {
    dataQuery = dataQuery.contains("status", [filter]);
    countQuery = countQuery.contains("status", [filter]);
  } else {
    // exclude pure "Sold" — only show active listings
    dataQuery = dataQuery.or('status.cs.{"For Sale"},status.cs.{"For Rent"}');
    countQuery = countQuery.or('status.cs.{"For Sale"},status.cs.{"For Rent"}');
  }

  if (excludeIds.length > 0) {
    const exclusion = `(${excludeIds.join(",")})`;
    dataQuery = dataQuery.not("id", "in", exclusion);
    countQuery = countQuery.not("id", "in", exclusion);
  }

  // Run both in parallel
  const [{ data, error }, { count }] = await Promise.all([
    dataQuery,
    countQuery,
  ]);

  if (error) {
    console.error("Failed to fetch stack page:", error);
    return { data: [], total: 0 };
  }

  return {
    data: (data ?? []).map(mapProperty),
    total: count ?? 0,
  };
}
