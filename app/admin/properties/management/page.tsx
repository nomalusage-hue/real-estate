// // app/admin/properties/management/page.tsx
// "use client";

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import Image from 'next/image';
// import { createClient } from '@/lib/supabase/supabase';
// import { checkIfAdmin } from '@/utils/checkIfAdmin';
// import AppLoader from '@/components/ui/AppLoader/AppLoader';
// import { formatPrice } from '@/utils/format';
// import './management.css'; // optional custom styles

// interface PropertyWithViews {
//   id: string;
//   title: string;
//   description: string | null;
//   property_type: 'house' | 'apartment' | 'villa' | 'commercial' | 'land';
//   city: string | null;
//   address: string | null;
//   bedrooms: number | null;
//   bathrooms: number | null;
//   building_size: number | null;
//   land_size: number | null;
//   featured: boolean;
//   hot: boolean;
//   new_listing: boolean;
//   published: boolean;
//   draft: boolean;
//   created_at: string;
//   sale_price: number | null;
//   rent_price: number | null;
//   sale_currency: string;
//   rent_currency: string;
//   images: string[];
//   status: string[];
//   show_address: boolean;
//   total_views: number;
// }

// export default function PropertiesManagementPage() {
//   const router = useRouter();
//   const supabase = createClient();

//   const [properties, setProperties] = useState<PropertyWithViews[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [checking, setChecking] = useState(true);
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState<string>('all');
//   const [typeFilter, setTypeFilter] = useState<string>('all');
//   const [page, setPage] = useState(1);
//   const [totalCount, setTotalCount] = useState(0);
//   const pageSize = 10;

//   // Authentication check
//   useEffect(() => {
//     const checkAuth = async () => {
//       const { data: { session } } = await supabase.auth.getSession();
//       if (!session) {
//         router.replace('/login');
//         return;
//       }
//       const admin = await checkIfAdmin(session.user.id);
//       if (!admin) {
//         setIsAdmin(false);
//         setChecking(false);
//         return;
//       }
//       setIsAdmin(true);
//       setChecking(false);
//     };
//     checkAuth();

//     const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
//       if (event === 'SIGNED_OUT' || !session) {
//         router.replace('/login');
//         return;
//       }
//       const admin = await checkIfAdmin(session.user.id);
//       setIsAdmin(!!admin);
//       setChecking(false);
//     });
//     return () => subscription.unsubscribe();
//   }, [router, supabase]);

//   // Fetch properties with view counts
//   useEffect(() => {
//     if (!isAdmin) return;
//     fetchProperties();
//   }, [isAdmin, page, searchTerm, statusFilter, typeFilter]);

//   // const fetchProperties = async () => {
//   //   setLoading(true);
//   //   try {
//   //     // Base query
//   //     let query = supabase
//   //       .from('properties')
//   //       .select(`
//   //         *,
//   //         property_views!left ( view_count )
//   //       `, { count: 'exact' });

//   //     // Apply filters
//   //     if (searchTerm) {
//   //       query = query.ilike('title', `%${searchTerm}%`);
//   //     }
//   //     if (statusFilter !== 'all') {
//   //       if (statusFilter === 'published') query = query.eq('published', true);
//   //       if (statusFilter === 'draft') query = query.eq('draft', true);
//   //       if (statusFilter === 'featured') query = query.eq('featured', true);
//   //     }
//   //     if (typeFilter !== 'all') {
//   //       query = query.eq('property_type', typeFilter);
//   //     }

//   //     // Pagination
//   //     const from = (page - 1) * pageSize;
//   //     const to = from + pageSize - 1;
//   //     query = query.range(from, to).order('created_at', { ascending: false });

//   //     const { data, error, count } = await query;

//   //     if (error) throw error;

//   //     // Aggregate views per property
//   //     const propertiesWithViews: PropertyWithViews[] = (data || []).map((prop: any) => {
//   //       const totalViews = (prop.property_views || []).reduce(
//   //         (sum: number, view: any) => sum + (view.view_count || 0),
//   //         0
//   //       );
//   //       // Remove the nested property_views to clean up
//   //       const { property_views, ...rest } = prop;
//   //       return {
//   //         ...rest,
//   //         total_views: totalViews,
//   //       };
//   //     });

//   //     setProperties(propertiesWithViews);
//   //     setTotalCount(count || 0);
//   //   } catch (error) {
//   //     console.error('Error fetching properties:', error);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

// const fetchProperties = async () => {
//   setLoading(true);
//   try {
//     // 1. Build the properties query with filters and pagination
//     let query = supabase
//       .from('properties')
//       .select('*', { count: 'exact' });

//     // Apply filters
//     if (searchTerm.trim()) {
//       query = query.ilike('title', `%${searchTerm.trim()}%`);
//     }
//     if (statusFilter !== 'all') {
//       if (statusFilter === 'published') query = query.eq('published', true);
//       else if (statusFilter === 'draft') query = query.eq('draft', true);
//       else if (statusFilter === 'featured') query = query.eq('featured', true);
//     }
//     if (typeFilter !== 'all') {
//       query = query.eq('property_type', typeFilter);
//     }

//     // Pagination
//     const from = (page - 1) * pageSize;
//     const to = from + pageSize - 1;
//     query = query.range(from, to).order('created_at', { ascending: false });

//     const { data: propertiesData, error: propertiesError, count } = await query;

//     if (propertiesError) throw propertiesError;
//     if (!propertiesData || propertiesData.length === 0) {
//       setProperties([]);
//       setTotalCount(0);
//       return;
//     }

//     // 2. Fetch view counts for these property IDs
//     const propertyIds = propertiesData.map(p => p.id);
//     const { data: viewsData, error: viewsError } = await supabase
//       .from('property_views')
//       .select('property_id, view_count')
//       .in('property_id', propertyIds);

//     if (viewsError) throw viewsError;

//     // 3. Aggregate views per property
//     const viewsMap = new Map<string, number>();
//     (viewsData || []).forEach(view => {
//       const current = viewsMap.get(view.property_id) || 0;
//       viewsMap.set(view.property_id, current + (view.view_count || 0));
//     });

//     // 4. Merge counts into properties
//     const propertiesWithViews: PropertyWithViews[] = propertiesData.map(prop => ({
//       ...prop,
//       total_views: viewsMap.get(prop.id) || 0,
//     }));

//     setProperties(propertiesWithViews);
//     setTotalCount(count || 0);
//   } catch (error) {
//     console.error('Error fetching properties:', error);
//     alert('Failed to load properties. Please check your connection and try again.');
//   } finally {
//     setLoading(false);
//   }
// };
  
//   const handleDelete = async (id: string, title: string) => {
//     if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
//       return;
//     }
//     try {
//       // First delete property_views (foreign key constraint)
//       await supabase.from('property_views').delete().eq('property_id', id);
//       const { error } = await supabase.from('properties').delete().eq('id', id);
//       if (error) throw error;
//       // Refresh list
//       fetchProperties();
//     } catch (error) {
//       console.error('Delete error:', error);
//       alert('Failed to delete property. Please try again.');
//     }
//   };

//   const togglePublish = async (id: string, currentPublished: boolean) => {
//     try {
//       const { error } = await supabase
//         .from('properties')
//         .update({ published: !currentPublished, draft: false })
//         .eq('id', id);
//       if (error) throw error;
//       fetchProperties();
//     } catch (error) {
//       console.error('Toggle publish error:', error);
//       alert('Failed to update property.');
//     }
//   };

//   const totalPages = Math.ceil(totalCount / pageSize);

//   if (checking) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
//         <div className="text-center">
//           <AppLoader />
//           <p className="mt-3">Verifying permissions...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!isAdmin) {
//     return (
//       <div className="container py-5">
//         <div className="alert alert-danger">
//           <h4 className="alert-heading">Access Denied</h4>
//           <p>You don't have permission to access this page.</p>
//           <Link href="/" className="btn btn-primary">Return to Home</Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <main className="main">
//       {/* Page Title */}
//       <div className="page-title">
//         <div className="heading">
//           <div className="container">
//             <div className="row d-flex justify-content-center text-center">
//               <div className="col-lg-8">
//                 <h1 className="heading-title">Property Management</h1>
//                 <p className="mb-0">
//                   Manage all your property listings, view stats, and perform actions.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//         <nav className="breadcrumbs">
//           <div className="container">
//             <ol>
//               <li><Link href="/">Home</Link></li>
//               <li><Link href="/admin">Admin</Link></li>
//               <li className="current">Property Management</li>
//             </ol>
//           </div>
//         </nav>
//       </div>

//       <section className="section">
//         <div className="container">
//           {/* Header with Add New button */}
//           <div className="d-flex justify-content-between align-items-center mb-4">
//             <h3>All Properties</h3>
//             <Link href="/admin/properties/new" className="btn btn-success">
//               <i className="bi bi-plus-lg me-2"></i>Add New Property
//             </Link>
//           </div>

//           {/* Filters */}
//           <div className="row g-3 mb-4">
//             <div className="col-md-4">
//               <input
//                 type="text"
//                 className="form-control"
//                 placeholder="Search by title..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//             <div className="col-md-3">
//               <select
//                 className="form-select"
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//               >
//                 <option value="all">All Status</option>
//                 <option value="published">Published</option>
//                 <option value="draft">Draft</option>
//                 <option value="featured">Featured</option>
//               </select>
//             </div>
//             <div className="col-md-3">
//               <select
//                 className="form-select"
//                 value={typeFilter}
//                 onChange={(e) => setTypeFilter(e.target.value)}
//               >
//                 <option value="all">All Types</option>
//                 <option value="house">House</option>
//                 <option value="apartment">Apartment</option>
//                 <option value="villa">Villa</option>
//                 <option value="commercial">Commercial</option>
//                 <option value="land">Land</option>
//               </select>
//             </div>
//             <div className="col-md-2">
//               <button className="btn btn-outline-secondary w-100" onClick={fetchProperties}>
//                 <i className="bi bi-search me-2"></i>Filter
//               </button>
//             </div>
//           </div>

//           {/* Table */}
//           {loading ? (
//             <div className="text-center py-5">
//               <AppLoader />
//               <p>Loading properties...</p>
//             </div>
//           ) : (
//             <>
//               <div className="table-responsive">
//                 <table className="table table-hover align-middle">
//                   <thead className="table-light">
//                     <tr>
//                       <th>Image</th>
//                       <th>Title</th>
//                       <th>Type</th>
//                       <th>City</th>
//                       <th>Price</th>
//                       <th>Status</th>
//                       <th>Published</th>
//                       <th>Views</th>
//                       <th>Created</th>
//                       <th>Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {properties.length === 0 ? (
//                       <tr>
//                         <td colSpan={10} className="text-center py-4">
//                           No properties found.
//                         </td>
//                       </tr>
//                     ) : (
//                       properties.map((prop) => (
//                         <tr key={prop.id}>
//                           <td>
//                             {prop.images && prop.images.length > 0 ? (
//                               <Image
//                                 src={prop.images[0]}
//                                 alt={prop.title}
//                                 width={50}
//                                 height={50}
//                                 className="rounded"
//                                 style={{ objectFit: 'cover' }}
//                                 unoptimized
//                               />
//                             ) : (
//                               <div
//                                 className="bg-light rounded d-flex align-items-center justify-content-center"
//                                 style={{ width: 50, height: 50 }}
//                               >
//                                 <i className="bi bi-house text-muted"></i>
//                               </div>
//                             )}
//                           </td>
//                           <td>
//                             <strong>{prop.title}</strong>
//                             <br />
//                             <small className="text-muted">{prop.id.slice(0, 8)}...</small>
//                           </td>
//                           <td className="text-capitalize">{prop.property_type}</td>
//                           <td>{prop.city || '—'}</td>
//                           <td>
//                             {prop.sale_price && (
//                               <div>{formatPrice(prop.sale_price, prop.sale_currency)}</div>
//                             )}
//                             {prop.rent_price && (
//                               <div>
//                                 {formatPrice(prop.rent_price, prop.rent_currency)}
//                                 <small className="text-muted">/mo</small>
//                               </div>
//                             )}
//                             {!prop.sale_price && !prop.rent_price && '—'}
//                           </td>
//                           <td>
//                             {prop.status?.map((s) => (
//                               <span key={s} className="badge bg-info me-1">
//                                 {s}
//                               </span>
//                             ))}
//                           </td>
//                           <td>
//                             {prop.published ? (
//                               <span className="badge bg-success">Published</span>
//                             ) : prop.draft ? (
//                               <span className="badge bg-warning text-dark">Draft</span>
//                             ) : (
//                               <span className="badge bg-secondary">Unpublished</span>
//                             )}
//                           </td>
//                           <td>
//                             <span className="badge bg-primary">{prop.total_views}</span>
//                           </td>
//                           <td>
//                             <small>{new Date(prop.created_at).toLocaleDateString()}</small>
//                           </td>
//                           <td>
//                             <div className="dropdown">
//                               <button
//                                 className="btn btn-sm btn-outline-secondary"
//                                 type="button"
//                                 data-bs-toggle="dropdown"
//                                 aria-expanded="false"
//                               >
//                                 <i className="bi bi-three-dots-vertical"></i>
//                               </button>
//                               <ul className="dropdown-menu dropdown-menu-end">
//                                 <li>
//                                   <Link
//                                     href={`/admin/properties/${prop.id}/edit`}
//                                     className="dropdown-item"
//                                   >
//                                     <i className="bi bi-pencil-square me-2"></i>Edit
//                                   </Link>
//                                 </li>
//                                 <li>
//                                   <button
//                                     className="dropdown-item"
//                                     onClick={() => togglePublish(prop.id, prop.published)}
//                                   >
//                                     <i className="bi bi-globe me-2"></i>
//                                     {prop.published ? 'Unpublish' : 'Publish'}
//                                   </button>
//                                 </li>
//                                 <li>
//                                   <Link
//                                     href={`/properties/${prop.id}`}
//                                     target="_blank"
//                                     className="dropdown-item"
//                                   >
//                                     <i className="bi bi-eye me-2"></i>View on Site
//                                   </Link>
//                                 </li>
//                                 <li>
//                                   <button
//                                     className="dropdown-item text-danger"
//                                     onClick={() => handleDelete(prop.id, prop.title)}
//                                   >
//                                     <i className="bi bi-trash me-2"></i>Delete
//                                   </button>
//                                 </li>
//                               </ul>
//                             </div>
//                           </td>
//                         </tr>
//                       ))
//                     )}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Pagination */}
//               {totalPages > 1 && (
//                 <nav className="mt-4">
//                   <ul className="pagination justify-content-center">
//                     <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
//                       <button className="page-link" onClick={() => setPage(page - 1)}>
//                         Previous
//                       </button>
//                     </li>
//                     {[...Array(totalPages)].map((_, i) => (
//                       <li key={i} className={`page-item ${page === i + 1 ? 'active' : ''}`}>
//                         <button className="page-link" onClick={() => setPage(i + 1)}>
//                           {i + 1}
//                         </button>
//                       </li>
//                     ))}
//                     <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
//                       <button className="page-link" onClick={() => setPage(page + 1)}>
//                         Next
//                       </button>
//                     </li>
//                   </ul>
//                 </nav>
//               )}
//             </>
//           )}
//         </div>
//       </section>
//     </main>
//   );
// }




// app/admin/properties/management/page.tsx (updated with views modal)
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/supabase';
import { checkIfAdmin } from '@/utils/checkIfAdmin';
import AppLoader from '@/components/ui/AppLoader/AppLoader';
import { formatPrice } from '@/utils/format';
import './management.css';

interface PropertyWithViews {
  id: string;
  title: string;
  description: string | null;
  property_type: 'house' | 'apartment' | 'villa' | 'commercial' | 'land';
  city: string | null;
  address: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  building_size: number | null;
  land_size: number | null;
  featured: boolean;
  hot: boolean;
  new_listing: boolean;
  published: boolean;
  draft: boolean;
  created_at: string;
  sale_price: number | null;
  rent_price: number | null;
  sale_currency: string;
  rent_currency: string;
  images: string[];
  status: string[];
  show_address: boolean;
  total_views: number;
  sold_date?: string | null;
}

interface GuestView {
  guest_id: string;
  view_count: number;
  first_viewed_at: string;
  last_viewed_at: string;
  ip: string | null;
  country: string | null;
  city: string | null;
  device_type: string | null;
  os: string | null;
  browser: string | null;
  language: string | null;
}

export default function PropertiesManagementPage() {
  const router = useRouter();
  const supabase = createClient();

  const [properties, setProperties] = useState<PropertyWithViews[]>([]);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  // Views modal state
  const [showViewsModal, setShowViewsModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<{ id: string; title: string } | null>(null);
  const [guestViews, setGuestViews] = useState<GuestView[]>([]);
  const [loadingViews, setLoadingViews] = useState(false);

  // Authentication check
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace('/login');
        return;
      }
      const admin = await checkIfAdmin(session.user.id);
      if (!admin) {
        setIsAdmin(false);
        setChecking(false);
        return;
      }
      setIsAdmin(true);
      setChecking(false);
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        router.replace('/login');
        return;
      }
      const admin = await checkIfAdmin(session.user.id);
      setIsAdmin(!!admin);
      setChecking(false);
    });
    return () => subscription.unsubscribe();
  }, [router, supabase]);

  // Fetch properties with view counts
  const fetchProperties = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('properties')
        .select('*', { count: 'exact' });

      if (searchTerm.trim()) {
        query = query.ilike('title', `%${searchTerm.trim()}%`);
      }
      if (statusFilter !== 'all') {
        if (statusFilter === 'published') query = query.eq('published', true);
        else if (statusFilter === 'draft') query = query.eq('draft', true);
        else if (statusFilter === 'featured') query = query.eq('featured', true);
      }
      if (typeFilter !== 'all') {
        query = query.eq('property_type', typeFilter);
      }

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to).order('created_at', { ascending: false });

      const { data: propertiesData, error: propertiesError, count } = await query;

      if (propertiesError) throw propertiesError;
      if (!propertiesData || propertiesData.length === 0) {
        setProperties([]);
        setTotalCount(0);
        return;
      }

      const propertyIds = propertiesData.map(p => p.id);
      const { data: viewsData, error: viewsError } = await supabase
        .from('property_views')
        .select('property_id, view_count')
        .in('property_id', propertyIds);

      if (viewsError) throw viewsError;

      const viewsMap = new Map<string, number>();
      (viewsData || []).forEach(view => {
        const current = viewsMap.get(view.property_id) || 0;
        viewsMap.set(view.property_id, current + (view.view_count || 0));
      });

      const propertiesWithViews: PropertyWithViews[] = propertiesData.map(prop => ({
        ...prop,
        total_views: viewsMap.get(prop.id) || 0,
      }));

      setProperties(propertiesWithViews);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error fetching properties:', error);
      alert('Failed to load properties. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAdmin) return;
    fetchProperties();
  }, [isAdmin, page, searchTerm, statusFilter, typeFilter]);

  // Fetch detailed guest views for a property
  const fetchGuestViews = async (propertyId: string) => {
    setLoadingViews(true);
    try {
      // Get property_views with guest details
      const { data, error } = await supabase
        .from('property_views')
        .select(`
          view_count,
          first_viewed_at,
          last_viewed_at,
          guest:guests (
            id,
            ip,
            country,
            city,
            device_type,
            os,
            browser,
            language
          )
        `)
        .eq('property_id', propertyId)
        .order('last_viewed_at', { ascending: false });

      if (error) throw error;

      const formattedViews: GuestView[] = (data || []).map((item: any) => ({
        guest_id: item.guest?.id || 'unknown',
        view_count: item.view_count || 0,
        first_viewed_at: item.first_viewed_at,
        last_viewed_at: item.last_viewed_at,
        ip: item.guest?.ip || null,
        country: item.guest?.country || null,
        city: item.guest?.city || null,
        device_type: item.guest?.device_type || null,
        os: item.guest?.os || null,
        browser: item.guest?.browser || null,
        language: item.guest?.language || null,
      }));

      setGuestViews(formattedViews);
    } catch (error) {
      console.error('Error fetching guest views:', error);
      alert('Failed to load visitor details.');
    } finally {
      setLoadingViews(false);
    }
  };

  const handleViewDetails = (propertyId: string, propertyTitle: string) => {
    setSelectedProperty({ id: propertyId, title: propertyTitle });
    setShowViewsModal(true);
    fetchGuestViews(propertyId);
  };

  const closeViewsModal = () => {
    setShowViewsModal(false);
    setSelectedProperty(null);
    setGuestViews([]);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) return;
    try {
      await supabase.from('property_views').delete().eq('property_id', id);
      const { error } = await supabase.from('properties').delete().eq('id', id);
      if (error) throw error;
      fetchProperties();
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete property. Please try again.');
    }
  };

  const togglePublish = async (id: string, currentPublished: boolean) => {
    try {
      const { error } = await supabase
        .from('properties')
        .update({ published: !currentPublished, draft: false })
        .eq('id', id);
      if (error) throw error;
      fetchProperties();
    } catch (error) {
      console.error('Toggle publish error:', error);
      alert('Failed to update property.');
    }
  };

  const markAsSold = async (id: string) => {
    if (!confirm('Are you sure you want to mark this property as sold?')) return;
    try {
      const { error } = await supabase
        .from('properties')
        .update({
          status: ['Sold'],
          sold_date: new Date().toISOString().split('T')[0],
          sale_price: null,
          rent_price: null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);
      if (error) throw error;
      fetchProperties();
    } catch (error) {
      console.error('Error marking as sold:', error);
      alert('Failed to mark property as sold.');
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  // Helper to mask IP for privacy
  const maskIP = (ip: string | null) => {
    if (!ip) return '—';
    const parts = ip.split('.');
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.*.*`;
    }
    return ip.substring(0, ip.length / 2) + '...';
  };

  if (checking) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="text-center">
          <AppLoader />
          <p className="mt-3">Verifying permissions...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          <h4 className="alert-heading">Access Denied</h4>
          <p>You don't have permission to access this page.</p>
          <Link href="/" className="btn btn-primary">Return to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <main className="main">
      <div className="page-title">
        <div className="heading">
          <div className="container">
            <div className="row d-flex justify-content-center text-center">
              <div className="col-lg-8">
                <h1 className="heading-title">Property Management</h1>
                <p className="mb-0">Manage all your property listings, view stats, and perform actions.</p>
              </div>
            </div>
          </div>
        </div>
        <nav className="breadcrumbs">
          <div className="container">
            <ol>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/admin">Admin</Link></li>
              <li className="current">Property Management</li>
            </ol>
          </div>
        </nav>
      </div>

      <section className="section">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3>All Properties</h3>
            <Link href="/admin/properties/new" className="btn btn-success">
              <i className="bi bi-plus-lg me-2"></i>Add New Property
            </Link>
          </div>

          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Search by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="featured">Featured</option>
              </select>
            </div>
            <div className="col-md-3">
              <select className="form-select" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                <option value="all">All Types</option>
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
                <option value="commercial">Commercial</option>
                <option value="land">Land</option>
              </select>
            </div>
            <div className="col-md-2">
              <button className="btn btn-outline-secondary w-100" onClick={fetchProperties}>
                <i className="bi bi-search me-2"></i>Filter
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <AppLoader />
              <p>Loading properties...</p>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Image</th>
                      <th>Title</th>
                      <th>Type</th>
                      <th>City</th>
                      <th>Price</th>
                      <th>Status</th>
                      <th>Published</th>
                      <th>Views</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {properties.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="text-center py-4">No properties found.</td>
                      </tr>
                    ) : (
                      properties.map((prop) => (
                        <tr key={prop.id}>
                          <td>
                            {prop.images && prop.images.length > 0 ? (
                              <Image
                                src={prop.images[0]}
                                alt={prop.title}
                                width={50}
                                height={50}
                                className="rounded"
                                style={{ objectFit: 'cover' }}
                                unoptimized
                              />
                            ) : (
                              <div className="bg-light rounded d-flex align-items-center justify-content-center" style={{ width: 50, height: 50 }}>
                                <i className="bi bi-house text-muted"></i>
                              </div>
                            )}
                          </td>
                          <td>
                            <strong>{prop.title}</strong>
                            <br />
                            <small className="text-muted">{prop.id.slice(0, 8)}...</small>
                          </td>
                          <td className="text-capitalize">{prop.property_type}</td>
                          <td>{prop.city || '—'}</td>
                          <td>
                            {prop.sale_price && (
                              <div>{formatPrice(prop.sale_price, prop.sale_currency)}</div>
                            )}
                            {prop.rent_price && (
                              <div>
                                {formatPrice(prop.rent_price, prop.rent_currency)}
                                <small className="text-muted">/mo</small>
                              </div>
                            )}
                            {!prop.sale_price && !prop.rent_price && '—'}
                          </td>
                          <td>
                            {prop.status?.map((s) => (
                              <span key={s} className="badge bg-info me-1">{s}</span>
                            ))}
                          </td>
                          <td>
                            {prop.published ? (
                              <span className="badge bg-success">Published</span>
                            ) : prop.draft ? (
                              <span className="badge bg-warning text-dark">Draft</span>
                            ) : (
                              <span className="badge bg-secondary">Unpublished</span>
                            )}
                          </td>
                          <td>
                            <button
                              className="btn btn-sm btn-link p-0 text-decoration-none"
                              onClick={() => handleViewDetails(prop.id, prop.title)}
                              title="View visitor details"
                            >
                              <span className="badge bg-primary" style={{ cursor: 'pointer' }}>
                                {prop.total_views} <i className="bi bi-eye-fill ms-1"></i>
                              </span>
                            </button>
                          </td>
                          <td>
                            <small>{new Date(prop.created_at).toLocaleDateString()}</small>
                          </td>
                          <td>
                            <div className="dropdown">
                              <button
                                className="btn btn-sm btn-outline-secondary"
                                type="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              >
                                <i className="bi bi-three-dots-vertical"></i>
                              </button>
                              <ul className="dropdown-menu dropdown-menu-end">
                                <li>
                                  <Link href={`/admin/properties/${prop.id}/edit`} className="dropdown-item">
                                    <i className="bi bi-pencil-square me-2"></i>Edit
                                  </Link>
                                </li>
                                <li>
                                  <button className="dropdown-item" onClick={() => togglePublish(prop.id, prop.published)}>
                                    <i className="bi bi-globe me-2"></i>
                                    {prop.published ? 'Unpublish' : 'Publish'}
                                  </button>
                                </li>
                                {!prop.status?.includes('Sold') && (
                                  <li>
                                    <button className="dropdown-item" onClick={() => markAsSold(prop.id)}>
                                      <i className="bi bi-check-circle me-2"></i>Mark as Sold
                                    </button>
                                  </li>
                                )}
                                <li>
                                  <Link href={`/properties/${prop.id}`} target="_blank" className="dropdown-item">
                                    <i className="bi bi-eye me-2"></i>View on Site
                                  </Link>
                                </li>
                                <li>
                                  <button className="dropdown-item text-danger" onClick={() => handleDelete(prop.id, prop.title)}>
                                    <i className="bi bi-trash me-2"></i>Delete
                                  </button>
                                </li>
                              </ul>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <nav className="mt-4">
                  <ul className="pagination justify-content-center">
                    <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={() => setPage(page - 1)}>Previous</button>
                    </li>
                    {[...Array(totalPages)].map((_, i) => (
                      <li key={i} className={`page-item ${page === i + 1 ? 'active' : ''}`}>
                        <button className="page-link" onClick={() => setPage(i + 1)}>{i + 1}</button>
                      </li>
                    ))}
                    <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={() => setPage(page + 1)}>Next</button>
                    </li>
                  </ul>
                </nav>
              )}
            </>
          )}
        </div>
      </section>

      {/* Views Details Modal */}
      {showViewsModal && selectedProperty && (
        <div className="modal fade show d-block" tabIndex={-1} role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-xl modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-people-fill me-2"></i>
                  Visitors for "{selectedProperty.title}"
                </h5>
                <button type="button" className="btn-close" onClick={closeViewsModal} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                {loadingViews ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading visitor details...</p>
                  </div>
                ) : guestViews.length === 0 ? (
                  <div className="alert alert-info">No views recorded for this property yet.</div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-sm table-striped">
                      <thead>
                        <tr>
                          <th>IP (masked)</th>
                          <th>Location</th>
                          <th>Device</th>
                          <th>OS</th>
                          <th>Browser</th>
                          <th>Language</th>
                          <th>First Viewed</th>
                          <th>Last Viewed</th>
                          <th>View Count</th>
                        </tr>
                      </thead>
                      <tbody>
                        {guestViews.map((view, idx) => (
                          <tr key={view.guest_id + idx}>
                            <td><code>{maskIP(view.ip)}</code></td>
                            <td>{[view.country, view.city].filter(Boolean).join(', ') || '—'}</td>
                            <td>{view.device_type || '—'}</td>
                            <td>{view.os || '—'}</td>
                            <td>{view.browser || '—'}</td>
                            <td>{view.language || '—'}</td>
                            <td>{new Date(view.first_viewed_at).toLocaleString()}</td>
                            <td>{new Date(view.last_viewed_at).toLocaleString()}</td>
                            <td><span className="badge bg-primary">{view.view_count}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeViewsModal}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}