// import { propertyService, PropertyStats } from "@/services/PropertyService";
// import { useEffect, useState } from "react";

// export function usePropertyStats() {
//   const [stats, setStats] = useState<PropertyStats | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const loadStats = async () => {
//       try {
//         setLoading(true);
//         const data = await propertyService.getStats();
//         setStats(data);
//       } catch (err: any) {
//         setError(err.message || 'Failed to load property stats');
//         console.error('Error loading property stats:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadStats();
//   }, []);

//   return { stats, loading, error };
// }


// hooks/usePropertyStats.ts
import { propertyService, PropertyStats } from "@/services/PropertyServiceSupabase";
import { useEffect, useState } from "react";

export function usePropertyStats() {
  const [stats, setStats] = useState<PropertyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const data = await propertyService.getStats();
        setStats(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load property stats');
        console.error('Error loading property stats:', err);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return { stats, loading, error };
}