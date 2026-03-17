"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/supabase';
import { checkIfAdmin } from '@/utils/checkIfAdmin';
import AppLoader from '@/components/ui/AppLoader/AppLoader';
import Image from 'next/image';
import { PropertyData } from '@/types/property';

export default function PropertyPriorityPage() {
  const router = useRouter();
  const supabase = createClient();

  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

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
  }, [router, supabase]);

  // Fetch properties sorted by priority then created_at
  useEffect(() => {
    if (!isAdmin) return;

    const fetchProperties = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .order('priority', { ascending: false, nullsFirst: false })
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProperties(data || []);
      } catch (error) {
        console.error('Error fetching properties:', error);
        alert('Failed to load properties.');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [isAdmin, supabase]);

  // Move property up (swap priority with previous)
  const moveUp = (index: number) => {
    if (index === 0) return;
    const newProperties = [...properties];
    const prev = newProperties[index - 1];
    const current = newProperties[index];
    // Swap priority values
    [prev.priority, current.priority] = [current.priority, prev.priority];
    // Reorder array
    newProperties[index - 1] = current;
    newProperties[index] = prev;
    setProperties(newProperties);
  };

  // Move property down
  const moveDown = (index: number) => {
    if (index === properties.length - 1) return;
    const newProperties = [...properties];
    const next = newProperties[index + 1];
    const current = newProperties[index];
    [current.priority, next.priority] = [next.priority, current.priority];
    newProperties[index] = next;
    newProperties[index + 1] = current;
    setProperties(newProperties);
  };

  // Save all priority changes
  const savePriorities = async () => {
    setSaving(true);
    try {
      // Update each property's priority
      const updates = properties.map((prop, idx) => ({
        id: prop.id,
        priority: prop.priority ?? 0, // ensure number
      }));

      // Use Promise.all to send updates concurrently
      await Promise.all(
        updates.map(update =>
          supabase
            .from('properties')
            .update({ priority: update.priority })
            .eq('id', update.id)
        )
      );

      alert('Priorities updated successfully!');
    } catch (error) {
      console.error('Error saving priorities:', error);
      alert('Failed to save priorities.');
    } finally {
      setSaving(false);
    }
  };

  if (checking) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="text-center">
          <AppLoader />
          <p>Verifying permissions...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          <h4>Access Denied</h4>
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
                <h1 className="heading-title">Property Priority Management</h1>
                <p className="mb-0">
                  Drag or use arrows to reorder properties. Higher priority = higher in listings.
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
              <li className="current">Priority</li>
            </ol>
          </div>
        </nav>
      </div>

      <section className="section">
        <div className="container">
          {loading ? (
            <div className="text-center py-5">
              <AppLoader />
              <p>Loading properties...</p>
            </div>
          ) : (
            <>
              <div className="d-flex justify-content-end mb-3">
                <button
                  className="btn btn-success"
                  onClick={savePriorities}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Saving...
                    </>
                  ) : (
                    'Save Order'
                  )}
                </button>
              </div>

              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Image</th>
                      <th>Title</th>
                      <th>City</th>
                      <th>Status</th>
                      <th>Priority</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {properties.map((prop, index) => (
                      <tr key={prop.id}>
                        <td>{index + 1}</td>
                        <td>
                          {prop.images && prop.images[0] ? (
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
                            <div className="bg-light rounded" style={{ width: 50, height: 50 }} />
                          )}
                        </td>
                        <td>
                          <strong>{prop.title}</strong>
                          <br />
                          <small className="text-muted">{prop.id.slice(0, 8)}...</small>
                        </td>
                        <td>{prop.city || '—'}</td>
                        <td>
                          {prop.status?.map(s => (
                            <span key={s} className="badge bg-info me-1">{s}</span>
                          ))}
                        </td>
                        <td>
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            style={{ width: '80px' }}
                            value={prop.priority ?? 0}
                            onChange={(e) => {
                              const newPriority = parseInt(e.target.value) || 0;
                              const newProperties = [...properties];
                              newProperties[index].priority = newPriority;
                              setProperties(newProperties);
                            }}
                          />
                        </td>
                        <td>
                          <div className="btn-group btn-group-sm" role="group">
                            <button
                              className="btn btn-outline-secondary"
                              onClick={() => moveUp(index)}
                              disabled={index === 0}
                              title="Move Up"
                            >
                              <i className="bi bi-arrow-up"></i>
                            </button>
                            <button
                              className="btn btn-outline-secondary"
                              onClick={() => moveDown(index)}
                              disabled={index === properties.length - 1}
                              title="Move Down"
                            >
                              <i className="bi bi-arrow-down"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}