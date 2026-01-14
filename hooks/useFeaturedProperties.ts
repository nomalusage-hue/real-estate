import { PropertyData } from "@/types/property";
import { propertyService } from "@/services/PropertyService";
import { useEffect, useState } from "react";

// export function useFeaturedProperties(limit: number = 6) {
//   const [properties, setProperties] = useState<PropertyData[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const loadFeatured = async () => {
//       try {
//         setLoading(true);
//         const data = await propertyService.getFeatured(limit);
//         setProperties(data);
//       } catch (err: any) {
//         setError(err.message || "Failed to load featured properties");
//         console.error("Error loading featured properties:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadFeatured();
//   }, [limit]);

//   return { properties, loading, error };
// }



export function useFeaturedProperties(limit: number = 6) {
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        setLoading(true);
        const data = await propertyService.getFeatured(limit);
        setProperties(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load featured properties');
        console.error('Error loading featured properties:', err);
      } finally {
        setLoading(false);
      }
    };

    loadFeatured();
  }, [limit]);

  return { properties, loading, error };
}