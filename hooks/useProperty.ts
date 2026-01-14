// import { PropertyWithId } from "@/types/property";
// import { propertyService } from "@/services/PropertyService";
// import { useEffect, useState } from "react";

// export function useProperty(id: string | undefined) {
//   const [property, setProperty] = useState<PropertyWithId | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!id) return;

//     const loadProperty = async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         const data = await propertyService.getById(id);
//         setProperty(data);

//         if (data) {
//           await propertyService.incrementViews(id);
//         }
//       } catch (err: any) {
//         setError(err.message || "Failed to load property");
//         console.error("Error loading property:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadProperty();
//   }, [id]);

//   return { property, loading, error };
// }



import { propertyService } from "@/services/PropertyService";
import { PropertyData } from "@/types/property";
import { useEffect, useState } from "react";

export function useProperty(id: string | undefined) {
  const [property, setProperty] = useState<PropertyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const loadProperty = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await propertyService.getById(id);
        setProperty(data);
        
        if (data) {
          await propertyService.incrementViews(id);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load property');
        console.error('Error loading property:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProperty();
  }, [id]);

  return { property, loading, error };
}