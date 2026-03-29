// app/admin/guests/page.tsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/supabase';
import { checkIfAdmin } from '@/utils/checkIfAdmin';
import AppLoader from '@/components/ui/AppLoader/AppLoader';

interface Guest {
  id: string;
  created_at: string;
  ip: string | null;
  country: string | null;
  city: string | null;
  language: string | null;
  timezone: string | null;
  device_type: string | null;
  os: string | null;
  browser: string | null;
  screen_width: number | null;
  screen_height: number | null;
  pixel_ratio: number | null;
  profile_id: string | null;
  profile_email?: string | null;
}

export default function GuestsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 20;

  const profileFilter = searchParams?.get('profile');

  // Authentication check
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace('/login');
        return;
      }
      const admin = await checkIfAdmin(session.user.id);
      setIsAdmin(admin);
      setChecking(false);
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        router.replace('/login');
        return;
      }
      const admin = await checkIfAdmin(session.user.id);
      setIsAdmin(admin);
      setChecking(false);
    });
    return () => subscription.unsubscribe();
  }, [router, supabase]);

  // Fetch guests
  useEffect(() => {
    if (!isAdmin) return;

    const fetchGuests = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from('guests')
          .select('*', { count: 'exact' })
          .order('created_at', { ascending: false })
          .range((page - 1) * pageSize, page * pageSize - 1);

        if (profileFilter) {
          query = query.eq('profile_id', profileFilter);
        }

        const { data, error, count } = await query;

        if (error) throw error;

        // For guests with profile_id, fetch the associated email
        const guestsWithEmail = await Promise.all(
          (data || []).map(async (guest) => {
            if (guest.profile_id) {
              const { data: profile } = await supabase
                .from('profiles')
                .select('email')
                .eq('id', guest.profile_id)
                .single();
              return { ...guest, profile_email: profile?.email };
            }
            return { ...guest, profile_email: null };
          })
        );

        setGuests(guestsWithEmail);
        setTotalCount(count || 0);
      } catch (error) {
        console.error('Error fetching guests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGuests();
  }, [isAdmin, page, profileFilter, supabase]);

  const handleDelete = async (guestId: string) => {
    if (!confirm('Are you sure you want to delete this guest record?')) return;
    try {
      const { error } = await supabase.from('guests').delete().eq('id', guestId);
      if (error) throw error;
      setGuests(prev => prev.filter(g => g.id !== guestId));
      setTotalCount(prev => prev - 1);
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete guest.');
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

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
          <p>You don&#39;t have permission to access this page.</p>
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
                <h1 className="heading-title">Guest Sessions</h1>
                <p className="mb-0">
                  {profileFilter ? 'Guests linked to a specific profile' : 'All anonymous and registered guest visits.'}
                </p>
              </div>
            </div>
          </div>
        </div>
        <nav className="breadcrumbs">
          <div className="container">
            <ol>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/admin">Admin</Link></li>
              <li className="current">Guests</li>
            </ol>
          </div>
        </nav>
      </div>

      <section className="section">
        <div className="container">
          {profileFilter && (
            <div className="alert alert-info mb-4">
              <i className="bi bi-funnel me-2"></i>
              Filtered by profile ID: <code>{profileFilter}</code>
              <Link href="/admin/guests" className="btn btn-sm btn-outline-secondary ms-3">
                Clear filter
              </Link>
            </div>
          )}

          {loading ? (
            <div className="text-center py-5">
              <AppLoader />
              <p>Loading guests...</p>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-sm table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>ID</th>
                      <th>IP</th>
                      <th>Location</th>
                      <th>Device / OS / Browser</th>
                      <th>Screen</th>
                      <th>Language</th>
                      <th>Timezone</th>
                      <th>Created</th>
                      <th>Profile</th>
                      <th>Actions</th>
                      <th>View</th>
                    </tr>
                  </thead>
                  <tbody>
                    {guests.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="text-center py-4">No guest sessions found.</td>
                      </tr>
                    ) : (
                      guests.map(guest => (
                        <tr key={guest.id}>
                          <td><code>{guest.id.slice(0, 8)}...</code></td>
                          <td>{guest.ip || '—'}</td>
                          <td>
                            {[guest.country, guest.city].filter(Boolean).join(', ') || '—'}
                          </td>
                          <td>
                            {guest.device_type && <span className="badge bg-secondary me-1">{guest.device_type}</span>}
                            {guest.os && <span className="badge bg-info me-1">{guest.os}</span>}
                            {guest.browser && <span className="badge bg-primary">{guest.browser}</span>}
                          </td>
                          <td>
                            {guest.screen_width && guest.screen_height
                              ? `${guest.screen_width}x${guest.screen_height}`
                              : '—'}
                            {guest.pixel_ratio && ` (${guest.pixel_ratio}x)`}
                          </td>
                          <td>{guest.language || '—'}</td>
                          <td>{guest.timezone || '—'}</td>
                          <td>{new Date(guest.created_at).toLocaleString()}</td>
                          <td>
                            {guest.profile_id ? (
                              <Link href={`/admin/profiles?highlight=${guest.profile_id}`} className="text-decoration-none">
                                {guest.profile_email || guest.profile_id.slice(0, 8)}...
                              </Link>
                            ) : (
                              '—'
                            )}
                          </td>
                          <td>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(guest.id)}
                              title="Delete guest record"
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
                          <td>
                            <Link href={`/admin/guests/${guest.id}`} className="btn btn-sm btn-outline-primary">
                              <i className="bi bi-eye"></i> Details
                            </Link>
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
    </main>
  );
}