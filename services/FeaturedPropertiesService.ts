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



// services/FeaturedPropertiesService.ts

import { mapProperty } from '@/lib/mappers/propertyMapper';
import { createClient } from '@/lib/supabase/supabase';
import { PropertyData } from '@/types/property';

export async function getHomepageFeaturedProperties(): Promise<{
  wide: PropertyData | null;
  mini: PropertyData[];
  stack: PropertyData[];
}> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('properties')
    .select(`*`)
    .eq('published', true)
    // Priority ordering
    .order('featured', { ascending: false })
    .order('hot', { ascending: false })
    .order('new_listing', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(7); // enough to safely slice 1 + 3 + 3

  if (error) {
    console.error('Failed to fetch homepage properties:', error);
    return {
      wide: null,
      mini: [],
      stack: [],
    };
  }

  const mapped = (data ?? []).map(mapProperty);

  return {
    wide: mapped[0] ?? null,
    mini: mapped.slice(1, 4),
    stack: mapped.slice(4, 7),
  };
}