// // hooks/useFavorites.ts
// import { useState, useEffect, useCallback } from 'react';
// import { createClient } from '@/lib/supabase/supabase';

// export function useFavorites() {
//   const [favorites, setFavorites] = useState<Set<string>>(new Set());
//   const [loading, setLoading] = useState(false);
//   const [user, setUser] = useState<any>(null);
//   const supabase = createClient();

//   // Check auth and load favorites on mount
//   useEffect(() => {
//     checkAuthAndLoadFavorites();
//   }, []);

//   const checkAuthAndLoadFavorites = async () => {
//     try {
//       const { data: { user } } = await supabase.auth.getUser();
//       setUser(user);

//       if (user) {
//         await loadUserFavorites();
//       }
//     } catch (error) {
//       console.error('Error checking auth:', error);
//     }
//   };

//   const loadUserFavorites = async () => {
//     try {
//       console.log('Loading favorites for user:', user?.id);
//       const { data, error } = await supabase
//         .from('favorites')
//         .select('property_id')
//         .eq('user_id', user.id); // Filter by user_id

//       if (error) {
//         console.error('Load favorites error:', error);
//         throw error;
//       }

//       const favoriteIds = new Set(data?.map(fav => fav.property_id) || []);
//       console.log('Loaded favorites:', favoriteIds);
//       setFavorites(favoriteIds);
//     } catch (error) {
//       console.error('Error loading favorites:', error);
//     }
//   };

//   const toggleFavorite = useCallback(async (propertyId: string) => {
//     if (!user) {
//       // Show login message
//       alert('Please login first to save favorites!');
//       return false;
//     }

//     const isFavorited = favorites.has(propertyId);
//     setLoading(true);

//     try {
//       if (isFavorited) {
//         // Remove from favorites
//         console.log('Removing favorite:', propertyId);
//         const { error } = await supabase
//           .from('favorites')
//           .delete()
//           .eq('property_id', propertyId);

//         if (error) {
//           console.error('Delete error:', error);
//           throw error;
//         }

//         setFavorites(prev => {
//           const newSet = new Set(prev);
//           newSet.delete(propertyId);
//           return newSet;
//         });
//       } else {
//         // Add to favorites
//         console.log('Adding favorite:', propertyId, 'for user:', user.id);
//         const { error } = await supabase
//           .from('favorites')
//           .insert({
//             property_id: propertyId,
//             user_id: user.id // Make sure user_id is included
//           });

//         if (error) {
//           console.error('Insert error:', error);
//           throw error;
//         }

//         setFavorites(prev => new Set([...prev, propertyId]));
//       }

//       return !isFavorited;
//     } catch (error) {
//       console.error('Error toggling favorite:', error);
//       alert(`Failed to update favorite. Please try again. Error: ${error.message}`);
//       return isFavorited;
//     } finally {
//       setLoading(false);
//     }
//   }, [user, favorites]);

//   const isFavorited = useCallback((propertyId: string) => {
//     return favorites.has(propertyId);
//   }, [favorites]);

//   return {
//     favorites: Array.from(favorites),
//     isFavorited,
//     toggleFavorite,
//     loading,
//     user,
//     refreshFavorites: loadUserFavorites
//   };
// }


"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/supabase";
import { User } from "@supabase/supabase-js";

export function useFavorites() {
  const supabase = createClient();

  const [user, setUser] = useState<User | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  // ---- AUTH LISTENER (FAST AFTER LOGIN) ----
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  // ---- LOAD FAVORITES ONCE ----
  useEffect(() => {
    if (!user) {
      setFavoriteIds(new Set());
      setLoading(false);
      return;
    }

    const loadFavorites = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("favorites")
        .select("property_id")
        .eq("user_id", user.id);

      if (!error && data) {
        setFavoriteIds(new Set(data.map(f => f.property_id)));
      }

      setLoading(false);
    };

    loadFavorites();
  }, [user, supabase]);

  // ---- PURE CHECK (NO SIDE EFFECTS) ----
  const isFavorited = useCallback(
    (propertyId: string) => favoriteIds.has(propertyId),
    [favoriteIds]
  );

  // ---- TOGGLE FAVORITE ----
  const toggleFavorite = useCallback(
    async (propertyId: string) => {
      if (!user) return false;

      const alreadyFavorited = favoriteIds.has(propertyId);

      if (alreadyFavorited) {
        await supabase
          .from("favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("property_id", propertyId);

        setFavoriteIds(prev => {
          const next = new Set(prev);
          next.delete(propertyId);
          return next;
        });
      } else {
        await supabase.from("favorites").insert({
          user_id: user.id,
          property_id: propertyId,
        });

        setFavoriteIds(prev => new Set(prev).add(propertyId));
      }

      return true;
    },
    [user, favoriteIds, supabase]
  );

  return {
    user,
    loading,
    isFavorited,
    toggleFavorite,
  };
}
