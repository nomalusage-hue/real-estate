// // app/admin/page.tsx
// "use client";

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import Image from 'next/image';
// import { createClient } from '@/lib/supabase/supabase';
// import { checkIfAdmin } from '@/utils/checkIfAdmin';
// import AppLoader from '@/components/ui/AppLoader/AppLoader';
// import { formatPrice } from '@/utils/format';
// import { 
//   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
//   PieChart, Pie, Cell
// } from 'recharts';

// interface DashboardStats {
//   totalGuests: number;
//   totalProperties: number;
//   totalViews: number;
//   avgSessionSeconds: number;
//   sumSalePrices: number;
//   sumRentPrices: number;
//   soldCount: number;
//   propertyTypeCounts: { type: string; count: number }[];
// }

// interface Guest {
//   id: string;
//   created_at: string;
//   ip: string | null;
//   country: string | null;
//   city: string | null;
//   device_type: string | null;
//   browser: string | null;
//   profile_id: string | null;
// }

// interface PropertyView {
//   property_id: string;
//   title: string;
//   images: string[];
//   city: string;
//   total_views: number;
// }

// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

// export default function AdminDashboard() {
//   const router = useRouter();
//   const supabase = createClient();

//   const [checking, setChecking] = useState(true);
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [loadingStats, setLoadingStats] = useState(true);

//   const [stats, setStats] = useState<DashboardStats>({
//     totalGuests: 0,
//     totalProperties: 0,
//     totalViews: 0,
//     avgSessionSeconds: 0,
//     sumSalePrices: 0,
//     sumRentPrices: 0,
//     soldCount: 0,
//     propertyTypeCounts: [],
//   });
//   const [recentGuests, setRecentGuests] = useState<Guest[]>([]);
//   const [topProperties, setTopProperties] = useState<PropertyView[]>([]);

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

//   // Fetch all dashboard data
//   useEffect(() => {
//     if (!isAdmin) return;

//     const fetchDashboard = async () => {
//       setLoadingStats(true);
//       try {
//         // 1. Total guests
//         const { count: guestCount } = await supabase
//           .from('guests')
//           .select('*', { count: 'exact', head: true });

//         // 2. Total properties (published)
//         const { count: propCount } = await supabase
//           .from('properties')
//           .select('*', { count: 'exact', head: true })
//           .eq('published', true);

//         // 3. Total property views
//         const { data: viewsSum } = await supabase
//           .from('property_views')
//           .select('view_count');
//         const totalViews = (viewsSum || []).reduce((acc, v) => acc + (v.view_count || 0), 0);

//         // 4. Average session duration
//         const { data: sessions } = await supabase
//           .from('sessions')
//           .select('started_at, last_activity_at')
//           .not('last_activity_at', 'is', null);
//         let avgSeconds = 0;
//         if (sessions && sessions.length > 0) {
//           const totalSeconds = sessions.reduce((acc, s) => {
//             const start = new Date(s.started_at).getTime();
//             const end = new Date(s.last_activity_at).getTime();
//             return acc + (end - start) / 1000;
//           }, 0);
//           avgSeconds = totalSeconds / sessions.length;
//         }

//         // 5. Sum of sale prices (published, For Sale)
//         const { data: saleProps } = await supabase
//           .from('properties')
//           .select('sale_price, sale_currency')
//           .eq('published', true)
//           .contains('status', ['For Sale']);
//         const sumSale = (saleProps || []).reduce((acc, p) => acc + (p.sale_price || 0), 0);

//         // 6. Sum of rent prices (published, For Rent)
//         const { data: rentProps } = await supabase
//           .from('properties')
//           .select('rent_price, rent_currency')
//           .eq('published', true)
//           .contains('status', ['For Rent']);
//         const sumRent = (rentProps || []).reduce((acc, p) => acc + (p.rent_price || 0), 0);

//         // 7. Sold count
//         const { count: soldCount } = await supabase
//           .from('properties')
//           .select('*', { count: 'exact', head: true })
//           .eq('published', true)
//           .contains('status', ['Sold']);

//         // 8. Property type distribution
//         const { data: typeData } = await supabase
//           .from('properties')
//           .select('property_type')
//           .eq('published', true);
//         const typeCounts = (typeData || []).reduce((acc: Record<string, number>, p) => {
//           acc[p.property_type] = (acc[p.property_type] || 0) + 1;
//           return acc;
//         }, {});
//         const propertyTypeCounts = Object.entries(typeCounts).map(([type, count]) => ({
//           type,
//           count: count as number,
//         }));

//         setStats({
//           totalGuests: guestCount || 0,
//           totalProperties: propCount || 0,
//           totalViews,
//           avgSessionSeconds: avgSeconds,
//           sumSalePrices: sumSale,
//           sumRentPrices: sumRent,
//           soldCount: soldCount || 0,
//           propertyTypeCounts,
//         });

//         // 9. Recent guests
//         const { data: guests } = await supabase
//           .from('guests')
//           .select('*')
//           .order('created_at', { ascending: false })
//           .limit(10);
//         setRecentGuests(guests || []);

//         // 10. Most visited properties
//         const { data: topViews } = await supabase
//           .from('property_views')
//           .select('property_id, view_count')
//           .order('view_count', { ascending: false })
//           .limit(10);
//         if (topViews && topViews.length > 0) {
//           const propertyIds = topViews.map(v => v.property_id);
//           const { data: props } = await supabase
//             .from('properties')
//             .select('id, title, images, city')
//             .in('id', propertyIds);
//           const merged = topViews.map(v => {
//             const prop = (props || []).find(p => p.id === v.property_id);
//             return {
//               property_id: v.property_id,
//               title: prop?.title || 'Unknown',
//               images: prop?.images || [],
//               city: prop?.city || '',
//               total_views: v.view_count || 0,
//             };
//           });
//           setTopProperties(merged);
//         }
//       } catch (error) {
//         console.error('Error fetching dashboard data:', error);
//       } finally {
//         setLoadingStats(false);
//       }
//     };

//     fetchDashboard();
//   }, [isAdmin, supabase]);

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
//           <p>You don&#39;t have permission to access this page.</p>
//           <Link href="/" className="btn btn-primary">Return to Home</Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="d-flex">
//       {/* Sidebar */}
//       <div className="bg-light border-end" style={{ width: '250px', minHeight: '100vh' }}>
//         <div className="p-3">
//           <h5 className="mb-3">Admin Menu</h5>
//           <ul className="nav nav-pills flex-column">
//             <li className="nav-item">
//               <Link href="/admin" className="nav-link active">
//                 <i className="bi bi-speedometer2 me-2"></i>Dashboard
//               </Link>
//             </li>
//             <li className="nav-item">
//               <Link href="/admin/configuration" className="nav-link">
//                 <i className="bi bi-gear me-2"></i>Configuration
//               </Link>
//             </li>
//             <li className="nav-item">
//               <Link href="/admin/guests" className="nav-link">
//                 <i className="bi bi-people me-2"></i>Guests
//               </Link>
//             </li>
//             <li className="nav-item">
//               <Link href="/admin/profiles" className="nav-link">
//                 <i className="bi bi-person-badge me-2"></i>Profiles
//               </Link>
//             </li>
//             <li className="nav-item mt-2">
//               <span className="text-muted small fw-bold">PROPERTIES</span>
//             </li>
//             <li className="nav-item">
//               <Link href="/admin/properties/management" className="nav-link">
//                 <i className="bi bi-list-ul me-2"></i>Management
//               </Link>
//             </li>
//             <li className="nav-item">
//               <Link href="/admin/properties/priority" className="nav-link">
//                 <i className="bi bi-sort-numeric-up me-2"></i>Priority
//               </Link>
//             </li>
//             <li className="nav-item">
//               <Link href="/admin/properties/new" className="nav-link">
//                 <i className="bi bi-plus-circle me-2"></i>Add New
//               </Link>
//             </li>
//           </ul>
//         </div>
//       </div>

//       {/* Main Content */}
//       <main className="grow p-4">
//         <div className="container-fluid">
//           <h1 className="mb-4">Dashboard</h1>

//           {loadingStats ? (
//             <div className="text-center py-5">
//               <AppLoader />
//               <p className="mt-3">Loading dashboard...</p>
//             </div>
//           ) : (
//             <>
//               {/* KPI Cards */}
//               <div className="row g-4 mb-4">
//                 <div className="col-sm-6 col-md-4 col-lg-3">
//                   <div className="card text-white bg-primary">
//                     <div className="card-body">
//                       <h5 className="card-title">Total Guests</h5>
//                       <p className="display-6">{stats.totalGuests}</p>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="col-sm-6 col-md-4 col-lg-3">
//                   <div className="card text-white bg-success">
//                     <div className="card-body">
//                       <h5 className="card-title">Published Properties</h5>
//                       <p className="display-6">{stats.totalProperties}</p>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="col-sm-6 col-md-4 col-lg-3">
//                   <div className="card text-white bg-info">
//                     <div className="card-body">
//                       <h5 className="card-title">Total Views</h5>
//                       <p className="display-6">{stats.totalViews}</p>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="col-sm-6 col-md-4 col-lg-3">
//                   <div className="card text-white bg-warning">
//                     <div className="card-body">
//                       <h5 className="card-title">Avg. Session</h5>
//                       <p className="display-6">{Math.round(stats.avgSessionSeconds)}s</p>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="col-sm-6 col-md-4 col-lg-3">
//                   <div className="card text-white bg-secondary">
//                     <div className="card-body">
//                       <h5 className="card-title">Sold Properties</h5>
//                       <p className="display-6">{stats.soldCount}</p>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="col-sm-6 col-md-4 col-lg-3">
//                   <div className="card text-white bg-dark">
//                     <div className="card-body">
//                       <h5 className="card-title">Total Sale Value</h5>
//                       <p className="display-6">{formatPrice(stats.sumSalePrices, 'USD')}</p>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="col-sm-6 col-md-4 col-lg-3">
//                   <div className="card text-white bg-danger">
//                     <div className="card-body">
//                       <h5 className="card-title">Total Rent (monthly)</h5>
//                       <p className="display-6">{formatPrice(stats.sumRentPrices, 'USD')}</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Charts Row */}
//               <div className="row mb-4">
//                 <div className="col-md-6">
//                   <div className="card">
//                     <div className="card-header">
//                       <h5>Property Types</h5>
//                     </div>
//                     <div className="card-body">
//                       <ResponsiveContainer width="100%" height={300}>
//                         <PieChart>
//                           <Pie
//                             data={stats.propertyTypeCounts}
//                             cx="50%"
//                             cy="50%"
//                             labelLine={false}
//                             label={({ type, percent }) => `${type} (${(percent? percent : 0 * 100).toFixed(0)}%)`}
//                             outerRadius={80}
//                             fill="#8884d8"
//                             dataKey="count"
//                           >
//                             {stats.propertyTypeCounts.map((entry, index) => (
//                               <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                             ))}
//                           </Pie>
//                           <Tooltip />
//                         </PieChart>
//                       </ResponsiveContainer>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="col-md-6">
//                   <div className="card">
//                     <div className="card-header">
//                       <h5>Most Viewed Properties</h5>
//                     </div>
//                     <div className="card-body">
//                       <div className="table-responsive">
//                         <table className="table table-sm">
//                           <thead>
//                             <tr>
//                               <th>Image</th>
//                               <th>Title</th>
//                               <th>City</th>
//                               <th>Views</th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {topProperties.map((prop) => (
//                               <tr key={prop.property_id}>
//                                 <td>
//                                   {prop.images && prop.images[0] ? (
//                                     <Image
//                                       src={prop.images[0]}
//                                       alt={prop.title}
//                                       width={40}
//                                       height={40}
//                                       className="rounded"
//                                       style={{ objectFit: 'cover' }}
//                                       unoptimized
//                                     />
//                                   ) : (
//                                     <div className="bg-light rounded" style={{ width: 40, height: 40 }} />
//                                   )}
//                                 </td>
//                                 <td>{prop.title}</td>
//                                 <td>{prop.city}</td>
//                                 <td><span className="badge bg-primary">{prop.total_views}</span></td>
//                               </tr>
//                             ))}
//                           </tbody>
//                         </table>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Recent Guests */}
//               <div className="row">
//                 <div className="col-12">
//                   <div className="card">
//                     <div className="card-header">
//                       <h5>Recent Guests</h5>
//                     </div>
//                     <div className="card-body">
//                       <div className="table-responsive">
//                         <table className="table table-sm">
//                           <thead>
//                             <tr>
//                               <th>IP</th>
//                               <th>Location</th>
//                               <th>Device</th>
//                               <th>Browser</th>
//                               <th>First Seen</th>
//                               <th>Profile</th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {recentGuests.map((guest) => (
//                               <tr key={guest.id}>
//                                 <td><code>{guest.ip || '—'}</code></td>
//                                 <td>{[guest.country, guest.city].filter(Boolean).join(', ') || '—'}</td>
//                                 <td>{guest.device_type || '—'}</td>
//                                 <td>{guest.browser || '—'}</td>
//                                 <td>{new Date(guest.created_at).toLocaleString()}</td>
//                                 <td>
//                                   {guest.profile_id ? (
//                                     <Link href={`/admin/profiles?highlight=${guest.profile_id}`}>
//                                       View
//                                     </Link>
//                                   ) : '—'}
//                                 </td>
//                               </tr>
//                             ))}
//                           </tbody>
//                         </table>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// }




// app/admin/page.tsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/supabase';
import { checkIfAdmin } from '@/utils/checkIfAdmin';
import AppLoader from '@/components/ui/AppLoader/AppLoader';
import { formatPrice } from '@/utils/format';
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';

interface DashboardStats {
  // Core counts
  totalGuests: number;
  totalProperties: number;
  totalViews: number;
  avgSessionSeconds: number;

  // Financial
  sumSalePrices: number;
  sumRentPrices: number;
  avgSalePrice: number;
  avgRentPrice: number;
  soldCount: number;

  // Property flags
  featuredCount: number;
  hotCount: number;
  exclusiveCount: number;

  // Distributions
  propertyTypeCounts: { type: string; count: number }[];
  statusCounts: { status: string; count: number }[];
}

interface Guest {
  id: string;
  created_at: string;
  ip: string | null;
  country: string | null;
  city: string | null;
  device_type: string | null;
  browser: string | null;
  profile_id: string | null;
}

interface PropertyView {
  property_id: string;
  title: string;
  images: string[];
  city: string;
  total_views: number;
}

const COLORS = ['#0d6efd', '#198754', '#ffc107', '#dc3545', '#6f42c1', '#20c997', '#fd7e14'];

export default function AdminDashboard() {
  const router = useRouter();
  const supabase = createClient();

  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loadingStats, setLoadingStats] = useState(true);

  const [stats, setStats] = useState<DashboardStats>({
    totalGuests: 0,
    totalProperties: 0,
    totalViews: 0,
    avgSessionSeconds: 0,
    sumSalePrices: 0,
    sumRentPrices: 0,
    avgSalePrice: 0,
    avgRentPrice: 0,
    soldCount: 0,
    featuredCount: 0,
    hotCount: 0,
    exclusiveCount: 0,
    propertyTypeCounts: [],
    statusCounts: [],
  });
  const [recentGuests, setRecentGuests] = useState<Guest[]>([]);
  const [topProperties, setTopProperties] = useState<PropertyView[]>([]);

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

  // Fetch all dashboard data
  useEffect(() => {
    if (!isAdmin) return;

    const fetchDashboard = async () => {
      setLoadingStats(true);
      try {
        // ---------- GUESTS ----------
        const { count: guestCount } = await supabase
          .from('guests')
          .select('*', { count: 'exact', head: true });

        // ---------- PROPERTIES (published only) ----------
        const propsQuery = supabase
          .from('properties')
          .select('*', { count: 'exact', head: false })
          .eq('published', true);

        const { data: props, error, count: propCount } = await propsQuery;
        if (error) throw error;

        const properties = props || [];

        // ---------- VIEWS ----------
        const { data: viewsSum } = await supabase
          .from('property_views')
          .select('view_count');
        const totalViews = (viewsSum || []).reduce((acc, v) => acc + (v.view_count || 0), 0);

        // ---------- SESSION DURATION ----------
        const { data: sessions } = await supabase
          .from('sessions')
          .select('started_at, last_activity_at')
          .not('last_activity_at', 'is', null);
        let avgSeconds = 0;
        if (sessions && sessions.length > 0) {
          const totalSeconds = sessions.reduce((acc, s) => {
            const start = new Date(s.started_at).getTime();
            const end = new Date(s.last_activity_at).getTime();
            return acc + (end - start) / 1000;
          }, 0);
          avgSeconds = totalSeconds / sessions.length;
        }

        // ---------- FINANCIALS ----------
        let sumSale = 0, sumRent = 0, saleCount = 0, rentCount = 0;
        properties.forEach(p => {
          if (p.sale_price && p.status?.includes('For Sale')) {
            sumSale += p.sale_price;
            saleCount++;
          }
          if (p.rent_price && p.status?.includes('For Rent')) {
            sumRent += p.rent_price;
            rentCount++;
          }
        });
        const avgSale = saleCount ? sumSale / saleCount : 0;
        const avgRent = rentCount ? sumRent / rentCount : 0;

        const soldCount = properties.filter(p => p.status?.includes('Sold')).length;
        const featuredCount = properties.filter(p => p.featured).length;
        const hotCount = properties.filter(p => p.hot).length;
        const exclusiveCount = properties.filter(p => p.exclusive).length;

        // For property types
        const typeMap: Record<string, number> = {};
        properties.forEach(p => {
          if (p.property_type) {
            typeMap[p.property_type] = (typeMap[p.property_type] || 0) + 1;
          }
        });
        const propertyTypeCounts = Object.entries(typeMap).map(([type, count]) => ({ type, count }));

        // For status distribution
        const statusMap: Record<string, number> = {};
        properties.forEach(p => {
          if (p.status && Array.isArray(p.status)) {
            p.status.forEach((s: string) => {
              statusMap[s] = (statusMap[s] || 0) + 1;
            });
          }
        });
        const statusCounts = Object.entries(statusMap).map(([status, count]) => ({ status, count }));

        setStats({
          totalGuests: guestCount || 0,
          totalProperties: propCount || 0,
          totalViews,
          avgSessionSeconds: avgSeconds,
          sumSalePrices: sumSale,
          sumRentPrices: sumRent,
          avgSalePrice: avgSale,
          avgRentPrice: avgRent,
          soldCount,
          featuredCount,
          hotCount,
          exclusiveCount,
          propertyTypeCounts,
          statusCounts,
        });

        // ---------- RECENT GUESTS ----------
        const { data: guests } = await supabase
          .from('guests')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);
        setRecentGuests(guests || []);

        // ---------- MOST VIEWED PROPERTIES ----------
        const { data: topViews } = await supabase
          .from('property_views')
          .select('property_id, view_count')
          .order('view_count', { ascending: false })
          .limit(10);
        if (topViews && topViews.length > 0) {
          const propertyIds = topViews.map(v => v.property_id);
          const { data: props } = await supabase
            .from('properties')
            .select('id, title, images, city')
            .in('id', propertyIds);
          const merged = topViews.map(v => {
            const prop = (props || []).find(p => p.id === v.property_id);
            return {
              property_id: v.property_id,
              title: prop?.title || 'Unknown',
              images: prop?.images || [],
              city: prop?.city || '',
              total_views: v.view_count || 0,
            };
          });
          setTopProperties(merged);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchDashboard();
  }, [isAdmin, supabase]);

  if (checking) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="text-center">
          <AppLoader />
          <p className="mt-3 text-muted">Verifying permissions...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger shadow-sm">
          <h4 className="alert-heading">Access Denied</h4>
          <p>You don&#39;t have permission to access this page.</p>
          <Link href="/" className="btn btn-primary">Return to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex min-vh-100 bg-light">
      {/* Sidebar */}
      <div className="bg-dark text-white" style={{ width: '280px' }}>
        <div className="p-4">
          <h5 className="text-white-50 mb-4">ADMIN MENU</h5>
          <ul className="nav flex-column nav-pills">
            <li className="nav-item mb-2">
              <Link href="/admin" className="nav-link active bg-gradient">
                <i className="bi bi-speedometer2 me-3"></i>Dashboard
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link href="/admin/configuration" className="nav-link text-white-50">
                <i className="bi bi-gear me-3"></i>Configuration
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link href="/admin/guests" className="nav-link text-white-50">
                <i className="bi bi-people me-3"></i>Guests
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link href="/admin/profiles" className="nav-link text-white-50">
                <i className="bi bi-person-badge me-3"></i>Profiles
              </Link>
            </li>
            <li className="nav-item mt-4">
              <span className="text-white-50 small fw-bold">PROPERTIES</span>
            </li>
            <li className="nav-item mb-2">
              <Link href="/admin/properties/management" className="nav-link text-white-50">
                <i className="bi bi-list-ul me-3"></i>Management
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link href="/admin/properties/priority" className="nav-link text-white-50">
                <i className="bi bi-sort-numeric-up me-3"></i>Priority
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link href="/admin/properties/new" className="nav-link text-white-50">
                <i className="bi bi-plus-circle me-3"></i>Add New
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <main className="grow p-4 overflow-auto">
        <div className="container-fluid" style={{ "paddingTop": "80px" }}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="h2 fw-light">Dashboard</h1>
            <div className="text-muted">
              <i className="bi bi-calendar3 me-2"></i>
              {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>

          {loadingStats ? (
            <div className="text-center py-5">
              <AppLoader />
              <p className="mt-3 text-muted">Loading dashboard data...</p>
            </div>
          ) : (
            <>
              {/* KPI Cards */}
              <div className="row g-4 mb-5">
                <div className="col-sm-6 col-xl-3">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <div className="bg-primary bg-opacity-10 p-3 rounded-3">
                          <i className="bi bi-people fs-3 text-primary"></i>
                        </div>
                        <div className="ms-3">
                          <h6 className="text-muted mb-1">Total Guests</h6>
                          <h3 className="mb-0 fw-bold">{stats.totalGuests.toLocaleString()}</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 col-xl-3">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <div className="bg-success bg-opacity-10 p-3 rounded-3">
                          <i className="bi bi-house fs-3 text-success"></i>
                        </div>
                        <div className="ms-3">
                          <h6 className="text-muted mb-1">Published Properties</h6>
                          <h3 className="mb-0 fw-bold">{stats.totalProperties.toLocaleString()}</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 col-xl-3">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <div className="bg-info bg-opacity-10 p-3 rounded-3">
                          <i className="bi bi-eye fs-3 text-info"></i>
                        </div>
                        <div className="ms-3">
                          <h6 className="text-muted mb-1">Total Views</h6>
                          <h3 className="mb-0 fw-bold">{stats.totalViews.toLocaleString()}</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 col-xl-3">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <div className="bg-warning bg-opacity-10 p-3 rounded-3">
                          <i className="bi bi-clock fs-3 text-warning"></i>
                        </div>
                        <div className="ms-3">
                          <h6 className="text-muted mb-1">Avg. Session</h6>
                          <h3 className="mb-0 fw-bold">{Math.round(stats.avgSessionSeconds)} s</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 col-xl-3">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <div className="bg-secondary bg-opacity-10 p-3 rounded-3">
                          <i className="bi bi-tag fs-3 text-secondary"></i>
                        </div>
                        <div className="ms-3">
                          <h6 className="text-muted mb-1">Sold Properties</h6>
                          <h3 className="mb-0 fw-bold">{stats.soldCount}</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 col-xl-3">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <div className="bg-dark bg-opacity-10 p-3 rounded-3">
                          <i className="bi bi-currency-dollar fs-3 text-dark"></i>
                        </div>
                        <div className="ms-3">
                          <h6 className="text-muted mb-1">Avg Sale Price</h6>
                          <h3 className="mb-0 fw-bold">{formatPrice(stats.avgSalePrice, 'USD')}</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 col-xl-3">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <div className="bg-danger bg-opacity-10 p-3 rounded-3">
                          <i className="bi bi-cash-stack fs-3 text-danger"></i>
                        </div>
                        <div className="ms-3">
                          <h6 className="text-muted mb-1">Avg Rent Price</h6>
                          <h3 className="mb-0 fw-bold">{formatPrice(stats.avgRentPrice, 'USD')}/mo</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 col-xl-3">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <div className="bg-purple bg-opacity-10 p-3 rounded-3">
                          <i className="bi bi-star fs-3 text-purple"></i>
                        </div>
                        <div className="ms-3">
                          <h6 className="text-muted mb-1">Featured / Hot / Exclusive</h6>
                          <h3 className="mb-0 fw-bold">
                            {stats.featuredCount} / {stats.hotCount} / {stats.exclusiveCount}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts Row */}
              <div className="row g-4 mb-5">
                <div className="col-md-6">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-header bg-transparent border-0 pt-4 px-4">
                      <h5 className="mb-0"><i className="bi bi-pie-chart me-2"></i>Property Types</h5>
                    </div>
                    <div className="card-body">
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={stats.propertyTypeCounts}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ payload, percent }) =>
                              `${payload.type} (${(percent ? percent : 0 * 100).toFixed(0)}%)`
                            }
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="count"
                          >
                            {stats.propertyTypeCounts.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value} properties`, 'Count']} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-header bg-transparent border-0 pt-4 px-4">
                      <h5 className="mb-0"><i className="bi bi-bar-chart me-2"></i>Status Distribution</h5>
                    </div>
                    <div className="card-body">
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={stats.statusCounts} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="status" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" fill="#0d6efd" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>

              {/* Most Viewed Properties */}
              <div className="row g-4 mb-5">
                <div className="col-12">
                  <div className="card border-0 shadow-sm">
                    <div className="card-header bg-transparent border-0 pt-4 px-4">
                      <h5 className="mb-0"><i className="bi bi-bar-chart-steps me-2"></i>Most Viewed Properties</h5>
                    </div>
                    <div className="card-body p-4">
                      <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                          <thead className="table-light">
                            <tr>
                              <th>Image</th>
                              <th>Title</th>
                              <th>City</th>
                              <th>Views</th>
                            </tr>
                          </thead>
                          <tbody>
                            {topProperties.map((prop) => (
                              <tr key={prop.property_id}>
                                <td style={{ width: '60px' }}>
                                  {prop.images && prop.images[0] ? (
                                    <Image
                                      src={prop.images[0]}
                                      alt={prop.title}
                                      width={50}
                                      height={50}
                                      className="rounded-2 object-fit-cover"
                                      unoptimized
                                    />
                                  ) : (
                                    <div className="bg-light rounded-2 d-flex align-items-center justify-content-center" style={{ width: 50, height: 50 }}>
                                      <i className="bi bi-house text-muted"></i>
                                    </div>
                                  )}
                                </td>
                                <td className="fw-semibold">{prop.title}</td>
                                <td>{prop.city || '—'}</td>
                                <td><span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill">{prop.total_views}</span></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Guests */}
              <div className="row g-4">
                <div className="col-12">
                  <div className="card border-0 shadow-sm">
                    <div className="card-header bg-transparent border-0 pt-4 px-4">
                      <h5 className="mb-0"><i className="bi bi-clock-history me-2"></i>Recent Guests</h5>
                    </div>
                    <div className="card-body p-4">
                      <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                          <thead className="table-light">
                            <tr>
                              <th>IP</th>
                              <th>Location</th>
                              <th>Device</th>
                              <th>Browser</th>
                              <th>First Seen</th>
                              <th>Profile</th>
                            </tr>
                          </thead>
                          <tbody>
                            {recentGuests.map((guest) => (
                              <tr key={guest.id}>
                                <td><code className="bg-light px-2 py-1 rounded">{guest.ip || '—'}</code></td>
                                <td>{[guest.country, guest.city].filter(Boolean).join(', ') || '—'}</td>
                                <td>{guest.device_type || '—'}</td>
                                <td>{guest.browser || '—'}</td>
                                <td>{new Date(guest.created_at).toLocaleString()}</td>
                                <td>
                                  {guest.profile_id ? (
                                    <Link href={`/admin/profiles?highlight=${guest.profile_id}`} className="text-decoration-none">
                                      <i className="bi bi-box-arrow-up-right me-1"></i>View
                                    </Link>
                                  ) : '—'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}