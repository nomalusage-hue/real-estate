// app/favorites/page.tsx
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/supabase';
import PropertyCardPremium from '@/components/property/PropertyCard/PropertyCardPremium';
import { PropertyData } from '@/types/property';
import AppLoader from '@/components/ui/AppLoader/AppLoader';

export function convertToCamelCase<T = any>(obj: any): T {
  if (obj === null || obj === undefined) return obj;

  if (Array.isArray(obj)) {
    return obj.map(item => convertToCamelCase(item)) as any;
  }

  if (typeof obj !== 'object') {
    return obj;
  }

  const newObj: any = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) =>
        letter.toUpperCase()
      );

      newObj[camelKey] = convertToCamelCase(obj[key]);
    }
  }

  return newObj;
}


export default function FavoritesPage() {
  const [user, setUser] = useState<any>(null);
  const [favorites, setFavorites] = useState<PropertyData[]>([]);
  // const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const router = useRouter();
  const supabase = createClient();

  const [authLoading, setAuthLoading] = useState(true);
  const [favoritesLoading, setFavoritesLoading] = useState(false);

  const isPageLoading = authLoading || favoritesLoading;


  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch {
        setError('Failed to check authentication');
      } finally {
        setAuthLoading(false);
      }
    };

    initAuth();
  }, []);


  useEffect(() => {
    if (user?.id) {
      loadFavorites(user.id);
    }
  }, [user]);


  const loadFavorites = async (userId: string) => {
    try {
      setFavoritesLoading(true);
      setError(null);

      const { data: favoritesData, error: favoritesError } = await supabase
        .from('favorites')
        .select('property_id')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (favoritesError) throw favoritesError;

      if (!favoritesData?.length) {
        setFavorites([]);
        return;
      }

      const propertyIds = favoritesData.map(f => f.property_id);

      const { data: propertiesData, error: propertiesError } = await supabase
        .from('properties')
        .select('*')
        .in('id', propertyIds);

      if (propertiesError) throw propertiesError;

      // setFavorites(
      //   propertyIds
      //     .map(id => propertiesData?.find(p => p.id === id))
      //     .filter(Boolean) as PropertyData[]
      // );
      const normalizedFavorites = propertyIds
        .map(id => propertiesData?.find(p => p.id === id))
        .filter(Boolean)
        .map(p => convertToCamelCase(p));

      setFavorites(normalizedFavorites as PropertyData[]);


    } catch (err: any) {
      setError(err.message || 'Failed to load favorites');
    } finally {
      setFavoritesLoading(false);
    }
  };




  // const removeFavorite = async (propertyId: string) => {
  //   try {
  //     const { error } = await supabase
  //       .from('favorites')
  //       .delete()
  //       .eq('property_id', propertyId);

  //     if (error) throw error;

  //     // Update local state
  //     setFavorites(prev => prev.filter(prop => prop.id !== propertyId));
  //   } catch (err: any) {
  //     console.error('Error removing favorite:', err);
  //     setError(err.message || 'Failed to remove favorite');
  //   }
  // };

  // if (loading) {
  if (isPageLoading) {
    return (
      <main className="main">
        {/* Page Title */}
        <div className="page-title">
          <div className="heading">
            <div className="container">
              <div className="row d-flex justify-content-center text-center">
                <div className="col-lg-8">
                  <h1 className="heading-title">My Favorites</h1>
                  <p className="mb-0">
                    Your saved properties. Keep track of the homes you&#39;re interested in.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <nav className="breadcrumbs">
            <div className="container">
              <ol>
                <li><Link href="/">Home</Link></li>
                <li className="current">Favorites</li>
              </ol>
            </div>
          </nav>
        </div>

        {/* Favorites Section */}
        <section className="properties favorites section">
          <div className="container" data-aos="fade-up" data-aos-delay="100">
            <div className="row">
              <div className="col-lg-12">
                <AppLoader />
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // if (!user) {
  if (!authLoading && !user) {
    return (
      <main className="main">
        {/* Page Title */}
        <div className="page-title">
          <div className="heading">
            <div className="container">
              <div className="row d-flex justify-content-center text-center">
                <div className="col-lg-8">
                  <h1 className="heading-title">My Favorites</h1>
                  <p className="mb-4">
                    You need to be logged in to view and manage your favorite properties.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <nav className="breadcrumbs">
            <div className="container">
              <ol>
                <li><Link href="/">Home</Link></li>
                <li className="current">Favorites</li>
              </ol>
            </div>
          </nav>
        </div>

        {/* Content */}
        <section className="favorites section">
          <div className="container" data-aos="fade-up" data-aos-delay="100">
            <div className="row">
              <div className="col-12">
                <div className="text-center py-5">
                  <div className="mb-4">
                    <i className="bi bi-heart display-1 text-muted"></i>
                  </div>
                  <h3>Please Login First</h3>
                  <p className="text-muted mb-4">
                    Create an account or sign in to save your favorite properties and access them anytime.
                  </p>
                  <div className="d-flex justify-content-center gap-3">
                    <Link href="/login" className="btn btn-lg custom-button">
                      Login to Continue
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="main">
      {/* Page Title */}
      <div className="page-title">
        <div className="heading">
          <div className="container">
            <div className="row d-flex justify-content-center text-center">
              <div className="col-lg-8">
                <h1 className="heading-title">My Favorites</h1>
                <p className="mb-0">
                  Your saved properties. Keep track of the homes you&#39;re interested in.
                </p>
              </div>
            </div>
          </div>
        </div>
        <nav className="breadcrumbs">
          <div className="container">
            <ol>
              <li><Link href="/">Home</Link></li>
              <li className="current">Favorites</li>
            </ol>
          </div>
        </nav>
      </div>

      {/* Favorites Section */}
      <section className="properties favorites section">
        <div className="container" data-aos="fade-up" data-aos-delay="100">
          <div className="row">
            <div className="col-lg-12">
              {error && (
                <div className="alert alert-danger mb-4">
                  {error}
                  {/* <button
                    className="btn btn-sm btn-primary ms-3"
                    onClick={loadFavorites}
                  >
                    Retry
                  </button> */}
                  <button
                    className="btn btn-sm btn-primary ms-3"
                    onClick={() => user?.id && loadFavorites(user.id)}
                  >
                    Retry
                  </button>

                </div>
              )}

              {favorites.length === 0 ? (
                <div className="text-center py-5">
                  <div className="mb-4">
                    <i className="bi bi-heart display-1 text-muted"></i>
                  </div>
                  <h3>No Favorites Yet</h3>
                  <p className="text-muted mb-4">
                    Start browsing properties and click the heart icon to save your favorites.
                  </p>
                  <Link href="/properties" className="btn custom-button">
                    <i className="bi bi-search me-2"></i>
                    Browse Properties
                  </Link>
                </div>
              ) : (
                <>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>
                      Your Favorites ({favorites.length})
                    </h2>
                  </div>

                  <div className="row g-4">
                    {favorites.map((property) => (
                      //   <div key={property.id} className="col-lg-6 col-md-6 mb-4">
                      //   </div>
                      <PropertyCardPremium data={property} key={property.id} lgClass="col-lg-4" />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}