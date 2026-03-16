// app/admin/profiles/page.tsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/supabase';
import { checkIfAdmin } from '@/utils/checkIfAdmin';
import AppLoader from '@/components/ui/AppLoader/AppLoader';

interface Profile {
  id: string;
  email: string;
  role: 'user' | 'admin';
  created_at: string;
  guest_count?: number;
}

export default function ProfilesPage() {
  const router = useRouter();
  const supabase = createClient();

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);

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

  // Fetch profiles with guest counts
  const fetchProfiles = async () => {
    setLoading(true);
    try {
      // Get all profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // For each profile, count linked guests
      const profilesWithCounts = await Promise.all(
        (profilesData || []).map(async (profile) => {
          const { count, error: countError } = await supabase
            .from('guests')
            .select('*', { count: 'exact', head: true })
            .eq('profile_id', profile.id);

          if (countError) console.error('Error counting guests for profile', profile.id, countError);
          return {
            ...profile,
            guest_count: count || 0,
          };
        })
      );

      setProfiles(profilesWithCounts);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAdmin) return;
    fetchProfiles();
  }, [isAdmin]);

  const handleRoleChange = async (profileId: string, newRole: 'user' | 'admin') => {
    setUpdating(profileId);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', profileId);

      if (error) throw error;

      // Update local state
      setProfiles(prev =>
        prev.map(p => (p.id === profileId ? { ...p, role: newRole } : p))
      );
    } catch (error) {
      console.error('Error updating role:', error);
      alert('Failed to update role.');
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (profileId: string, email: string) => {
    if (!confirm(`Are you sure you want to delete profile for ${email}? This will also delete all associated guest records.`)) return;

    try {
      // First delete guests linked to this profile (optional: cascade is not set, so we must delete manually)
      const { error: guestsError } = await supabase
        .from('guests')
        .delete()
        .eq('profile_id', profileId);
      if (guestsError) throw guestsError;

      // Then delete profile
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', profileId);

      if (error) throw error;

      // Remove from state
      setProfiles(prev => prev.filter(p => p.id !== profileId));
    } catch (error) {
      console.error('Error deleting profile:', error);
      alert('Failed to delete profile.');
    }
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
                <h1 className="heading-title">User Profiles</h1>
                <p className="mb-0">Manage user accounts and roles.</p>
              </div>
            </div>
          </div>
        </div>
        <nav className="breadcrumbs">
          <div className="container">
            <ol>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/admin">Admin</Link></li>
              <li className="current">Profiles</li>
            </ol>
          </div>
        </nav>
      </div>

      <section className="section">
        <div className="container">
          {loading ? (
            <div className="text-center py-5">
              <AppLoader />
              <p>Loading profiles...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Guest Sessions</th>
                    <th>Created At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {profiles.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-4">No profiles found.</td>
                    </tr>
                  ) : (
                    profiles.map(profile => (
                      <tr key={profile.id}>
                        <td><code>{profile.id.slice(0, 8)}...</code></td>
                        <td>{profile.email || '—'}</td>
                        <td>
                          <select
                            className="form-select form-select-sm"
                            value={profile.role}
                            onChange={(e) => handleRoleChange(profile.id, e.target.value as 'user' | 'admin')}
                            disabled={updating === profile.id}
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td>
                          <Link href={`/admin/guests?profile=${profile.id}`} className="badge bg-info text-decoration-none">
                            {profile.guest_count} sessions
                          </Link>
                        </td>
                        <td>{new Date(profile.created_at).toLocaleString()}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(profile.id, profile.email || 'unknown')}
                            disabled={updating === profile.id}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}