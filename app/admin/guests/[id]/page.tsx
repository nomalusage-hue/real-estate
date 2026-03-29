// app/admin/guests/[id]/page.tsx
"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/supabase';
import { checkIfAdmin } from '@/utils/checkIfAdmin';
import AppLoader from '@/components/ui/AppLoader/AppLoader';

// ─── Types ────────────────────────────────────────────────────────────────────

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
  connection_type: string | null;
  device_memory: number | null;
  touch_support: boolean | null;
  screen_orientation: string | null;
  referrer: string | null;
  last_seen: string | null;
  visit_count: number | null;
  first_page: string | null;
  utm_params: Record<string, string> | null;
  profile_email?: string | null;
}

interface Session {
  id: string;
  guest_id: string;
  started_at: string;
  last_activity_at: string;
  user_agent: string | null;
}

interface PropertyView {
  id: number;
  guest_id: string;
  property_id: string;
  view_count: number;
  first_viewed_at: string;
  last_viewed_at: string;
  // joined from properties table
  property_title?: string | null;
  property_city?: string | null;
  property_type?: string | null;
  property_thumbnail?: string | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Format a duration in seconds into a human-readable string */
function formatDuration(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  if (seconds < 3600) {
    const m = Math.floor(seconds / 60);
    const s = Math.round(seconds % 60);
    return s > 0 ? `${m}m ${s}s` : `${m}m`;
  }
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

/** Return a friendly label for a date relative to today */
function dayLabel(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (isSameDay(date, today)) return 'Today';
  if (isSameDay(date, yesterday)) return 'Yesterday';

  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
  });
}

/** Format a session's time of day */
function timeOfDay(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Compute session duration in seconds (min 10s, max 2h to avoid stale tabs inflating numbers) */
function sessionDuration(session: Session): number {
  const start = new Date(session.started_at).getTime();
  const end = new Date(session.last_activity_at).getTime();
  const diff = (end - start) / 1000;
  // Clamp: a session that never updated is treated as ~10s; cap at 2h
  return Math.min(Math.max(diff, 10), 7200);
}

/** Return a clock emoji based on hour of day */
function partOfDayIcon(hour: number): string {
  if (hour >= 5 && hour < 12) return '🌅'; // morning
  if (hour >= 12 && hour < 17) return '☀️'; // afternoon
  if (hour >= 17 && hour < 21) return '🌆'; // evening
  return '🌙'; // night
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function GuestDetailPage() {
  const router = useRouter();
  const params = useParams();
  const guestId = params?.id as string;
  const supabase = createClient();

  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const [guest, setGuest] = useState<Guest | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [propertyViews, setPropertyViews] = useState<PropertyView[]>([]);

  // ── Auth ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.replace('/login'); return; }
      const admin = await checkIfAdmin(session.user.id);
      setIsAdmin(admin);
      setChecking(false);
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session) { router.replace('/login'); return; }
      const admin = await checkIfAdmin(session.user.id);
      setIsAdmin(admin);
      setChecking(false);
    });
    return () => subscription.unsubscribe();
  }, [router, supabase]);

  // ── Fetch data ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isAdmin || !guestId) return;

    const fetchAll = async () => {
      setLoading(true);
      try {
        // 1. Guest record
        const { data: guestData, error: guestError } = await supabase
          .from('guests')
          .select('*')
          .eq('id', guestId)
          .single();

        if (guestError) throw guestError;

        // 2. Fetch linked profile email if present
        let profileEmail: string | null = null;
        if (guestData.profile_id) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('email')
            .eq('id', guestData.profile_id)
            .single();
          profileEmail = profile?.email ?? null;
        }
        setGuest({ ...guestData, profile_email: profileEmail });

        // 3. Sessions – all of them, ordered chronologically
        const { data: sessionsData, error: sessionsError } = await supabase
          .from('sessions')
          .select('*')
          .eq('guest_id', guestId)
          .order('started_at', { ascending: false });

        if (sessionsError) throw sessionsError;
        setSessions(sessionsData || []);

        // 4. Property views
        const { data: viewsData, error: viewsError } = await supabase
          .from('property_views')
          .select('*')
          .eq('guest_id', guestId)
          .order('last_viewed_at', { ascending: false });

        if (viewsError) throw viewsError;

        // 5. Enrich property views with property metadata (title, city, type)
        //    We do this in one query using `in` to avoid N+1
        const propertyIds = [...new Set((viewsData || []).map((v) => v.property_id))];
        const propertiesMap: Record<string, { title: string; city: string; type: string; thumbnail: string }> = {};

        if (propertyIds.length > 0) {
          const { data: propertiesData } = await supabase
            .from('properties')
            .select('id, title, city, type, thumbnail')
            .in('id', propertyIds);

          (propertiesData || []).forEach((p) => {
            propertiesMap[p.id] = {
              title: p.title,
              city: p.city,
              type: p.type,
              thumbnail: p.thumbnail,
            };
          });
        }

        const enrichedViews: PropertyView[] = (viewsData || []).map((v) => ({
          ...v,
          property_title: propertiesMap[v.property_id]?.title ?? null,
          property_city: propertiesMap[v.property_id]?.city ?? null,
          property_type: propertiesMap[v.property_id]?.type ?? null,
          property_thumbnail: propertiesMap[v.property_id]?.thumbnail ?? null,
        }));

        setPropertyViews(enrichedViews);
      } catch (err) {
        console.error('Error loading guest detail:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [isAdmin, guestId, supabase]);

  // ── Derived stats ────────────────────────────────────────────────────────────

  /**
   * Group sessions by calendar date (YYYY-MM-DD) so we can show
   * "Today – 2 visits – 1h 12m total" etc.
   */
  const sessionsByDay = useMemo(() => {
    const map = new Map<string, Session[]>();
    sessions.forEach((s) => {
      const key = new Date(s.started_at).toISOString().slice(0, 10); // YYYY-MM-DD
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(s);
    });
    // Convert to array sorted newest-first
    return Array.from(map.entries())
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([date, daySessions]) => {
        const totalSeconds = daySessions.reduce((sum, s) => sum + sessionDuration(s), 0);
        return { date, sessions: daySessions, totalSeconds };
      });
  }, [sessions]);

  const totalTimeSeconds = useMemo(
    () => sessions.reduce((sum, s) => sum + sessionDuration(s), 0),
    [sessions]
  );

  const totalVisits = sessions.length;
  const totalPropertiesViewed = propertyViews.length;
  const totalPropertyViewCount = propertyViews.reduce((sum, v) => sum + v.view_count, 0);

  // ── Loading / auth guards ───────────────────────────────────────────────────

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

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <main className="main">
      {/* ── Page header ── */}
      <div className="page-title">
        <div className="heading">
          <div className="container">
            <div className="row d-flex justify-content-center text-center">
              <div className="col-lg-8">
                <h1 className="heading-title">Guest Analytics</h1>
                <p className="mb-0">
                  Detailed activity report for guest <code>{guestId?.slice(0, 8)}…</code>
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
              <li><Link href="/admin/guests">Guests</Link></li>
              <li className="current">Detail</li>
            </ol>
          </div>
        </nav>
      </div>

      <section className="section">
        <div className="container">
          {loading ? (
            <div className="text-center py-5">
              <AppLoader />
              <p>Loading guest data…</p>
            </div>
          ) : !guest ? (
            <div className="alert alert-warning">
              Guest not found.{' '}
              <Link href="/admin/guests" className="alert-link">Back to list</Link>
            </div>
          ) : (
            <>
              {/* ══════════════════════════════════════════
                  SECTION 1 – Summary stat cards
              ══════════════════════════════════════════ */}
              <div className="row g-3 mb-4">
                <StatCard
                  icon="bi-clock-history"
                  label="Total Time on Site"
                  value={formatDuration(totalTimeSeconds)}
                  color="primary"
                />
                <StatCard
                  icon="bi-door-open"
                  label="Total Visits (Sessions)"
                  value={String(totalVisits)}
                  color="success"
                />
                <StatCard
                  icon="bi-houses"
                  label="Unique Properties Viewed"
                  value={String(totalPropertiesViewed)}
                  color="info"
                />
                <StatCard
                  icon="bi-eye"
                  label="Total Property Views"
                  value={String(totalPropertyViewCount)}
                  color="warning"
                />
              </div>

              {/* ══════════════════════════════════════════
                  SECTION 2 – Guest profile info
              ══════════════════════════════════════════ */}
              <div className="row g-4 mb-4">
                {/* Left – identity */}
                <div className="col-md-6">
                  <div className="card h-100 shadow-sm border-0">
                    <div className="card-header bg-light fw-semibold">
                      <i className="bi bi-person-badge me-2"></i>Identity &amp; Location
                    </div>
                    <div className="card-body">
                      <InfoRow label="Guest ID" value={guest.id} mono />
                      <InfoRow label="IP Address" value={guest.ip} />
                      <InfoRow
                        label="Location"
                        value={[guest.city, guest.country].filter(Boolean).join(', ')}
                      />
                      <InfoRow label="Timezone" value={guest.timezone} />
                      <InfoRow label="Language" value={guest.language} />
                      <InfoRow label="Referrer" value={guest.referrer} />
                      <InfoRow label="First Page" value={guest.first_page} mono />
                      {guest.profile_id && (
                        <InfoRow
                          label="Linked Profile"
                          value={
                            <Link href={`/admin/profiles?highlight=${guest.profile_id}`}>
                              {guest.profile_email || guest.profile_id.slice(0, 12) + '…'}
                            </Link>
                          }
                        />
                      )}
                      <InfoRow
                        label="First Seen"
                        value={new Date(guest.created_at).toLocaleString()}
                      />
                      <InfoRow
                        label="Last Seen"
                        value={guest.last_seen ? new Date(guest.last_seen).toLocaleString() : '—'}
                      />
                    </div>
                  </div>
                </div>

                {/* Right – device */}
                <div className="col-md-6">
                  <div className="card h-100 shadow-sm border-0">
                    <div className="card-header bg-light fw-semibold">
                      <i className="bi bi-laptop me-2"></i>Device &amp; Browser
                    </div>
                    <div className="card-body">
                      <InfoRow label="Device Type" value={guest.device_type} badge="secondary" />
                      <InfoRow label="OS" value={guest.os} badge="info" />
                      <InfoRow label="Browser" value={guest.browser} badge="primary" />
                      <InfoRow
                        label="Screen"
                        value={
                          guest.screen_width && guest.screen_height
                            ? `${guest.screen_width}×${guest.screen_height}${guest.pixel_ratio ? ` @ ${guest.pixel_ratio}x` : ''}`
                            : null
                        }
                      />
                      <InfoRow label="Orientation" value={guest.screen_orientation} />
                      <InfoRow label="Connection" value={guest.connection_type} />
                      <InfoRow
                        label="Device Memory"
                        value={guest.device_memory != null ? `${guest.device_memory} GB` : null}
                      />
                      <InfoRow
                        label="Touch Support"
                        value={
                          guest.touch_support != null
                            ? guest.touch_support
                              ? '✅ Yes'
                              : '❌ No'
                            : null
                        }
                      />
                      {guest.utm_params && Object.keys(guest.utm_params).length > 0 && (
                        <div className="mt-2">
                          <small className="text-muted d-block fw-semibold mb-1">UTM Parameters</small>
                          <div className="d-flex flex-wrap gap-1">
                            {Object.entries(guest.utm_params).map(([k, v]) => (
                              <span key={k} className="badge bg-light text-dark border">
                                {k}: <strong>{v}</strong>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ══════════════════════════════════════════
                  SECTION 3 – Time on site by day (timeline)
              ══════════════════════════════════════════ */}
              <div className="card shadow-sm border-0 mb-4">
                <div className="card-header bg-light fw-semibold">
                  <i className="bi bi-calendar3 me-2"></i>Time Spent on Site — by Day
                </div>
                <div className="card-body p-0">
                  {sessionsByDay.length === 0 ? (
                    <p className="text-muted p-4 mb-0">No sessions recorded yet.</p>
                  ) : (
                    sessionsByDay.map(({ date, sessions: daySessions, totalSeconds }) => (
                      <DayBlock
                        key={date}
                        date={date}
                        sessions={daySessions}
                        totalSeconds={totalSeconds}
                      />
                    ))
                  )}
                </div>
              </div>

              {/* ══════════════════════════════════════════
                  SECTION 4 – Properties visited
              ══════════════════════════════════════════ */}
              <div className="card shadow-sm border-0">
                <div className="card-header bg-light fw-semibold">
                  <i className="bi bi-houses me-2"></i>Properties Visited
                </div>
                <div className="card-body p-0">
                  {propertyViews.length === 0 ? (
                    <p className="text-muted p-4 mb-0">No property views recorded.</p>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                          <tr>
                            <th>Property</th>
                            <th>City</th>
                            <th>Type</th>
                            <th>Times Viewed</th>
                            <th>First Viewed</th>
                            <th>Last Viewed</th>
                          </tr>
                        </thead>
                        <tbody>
                          {propertyViews.map((v) => (
                            <tr key={v.id}>
                              <td>
                                <Link
                                  href={`/properties/${v.property_id}`}
                                  className="text-decoration-none fw-semibold"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {v.property_title ?? (
                                    <code className="text-muted">{v.property_id.slice(0, 8)}…</code>
                                  )}
                                  <i className="bi bi-box-arrow-up-right ms-1 small text-muted"></i>
                                </Link>
                              </td>
                              <td>{v.property_city ?? '—'}</td>
                              <td>
                                {v.property_type ? (
                                  <span className="badge bg-secondary">{v.property_type}</span>
                                ) : '—'}
                              </td>
                              <td>
                                <span className="badge bg-primary rounded-pill">
                                  {v.view_count} ×
                                </span>
                              </td>
                              <td>
                                <small>{new Date(v.first_viewed_at).toLocaleString()}</small>
                              </td>
                              <td>
                                <small>{new Date(v.last_viewed_at).toLocaleString()}</small>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

/** A single summary stat card */
function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: string;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="col-6 col-md-3">
      <div className={`card shadow-sm h-100 border-start border-4 border-${color}`}>
        <div className="card-body d-flex align-items-center gap-3">
          <div
            className={`rounded-circle d-flex align-items-center justify-content-center bg-${color} bg-opacity-10`}
            style={{ width: 48, height: 48, flexShrink: 0 }}
          >
            <i className={`bi ${icon} text-${color} fs-5`}></i>
          </div>
          <div>
            <div className="fw-bold fs-5 lh-1">{value}</div>
            <small className="text-muted">{label}</small>
          </div>
        </div>
      </div>
    </div>
  );
}

/** A labeled key-value row inside a card body */
function InfoRow({
  label,
  value,
  mono = false,
  badge,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
  badge?: string;
}) {
  if (!value && value !== 0) return null;
  return (
    <div className="d-flex justify-content-between align-items-start py-1 border-bottom border-light">
      <small className="text-muted" style={{ minWidth: 140 }}>{label}</small>
      <span className={`text-end ms-2 ${mono ? 'font-monospace small' : 'small'}`}>
        {badge ? (
          <span className={`badge bg-${badge}`}>{value as string}</span>
        ) : (
          value
        )}
      </span>
    </div>
  );
}

/**
 * A collapsible day block showing:
 * - Day label, total visits, total time
 * - Individual session rows (time-of-day, duration, morning/afternoon/evening icon)
 */
function DayBlock({
  date,
  sessions,
  totalSeconds,
}: {
  date: string;
  sessions: Session[];
  totalSeconds: number;
}) {
  const [open, setOpen] = useState(date === new Date().toISOString().slice(0, 10));
  const label = dayLabel(date);
  const visitWord = sessions.length === 1 ? 'visit' : 'visits';

  return (
    <div className="border-bottom">
      {/* Header row – always visible */}
      <button
        className="w-100 d-flex align-items-center justify-content-between px-4 py-3 bg-transparent border-0 text-start"
        onClick={() => setOpen((o) => !o)}
        style={{ cursor: 'pointer' }}
      >
        <div className="d-flex align-items-center gap-3">
          <i
            className={`bi bi-chevron-${open ? 'down' : 'right'} text-muted`}
            style={{ transition: 'transform 0.2s', width: 14 }}
          ></i>
          <span className="fw-semibold">{label}</span>
          <span className="badge bg-secondary rounded-pill">
            {sessions.length} {visitWord}
          </span>
        </div>
        <span className="text-muted small">
          <i className="bi bi-clock me-1"></i>
          {formatDuration(totalSeconds)} total
        </span>
      </button>

      {/* Expandable session list */}
      {open && (
        <div className="px-4 pb-3">
          <div className="ms-4 border-start border-2 ps-3">
            {sessions
              .slice()
              .sort(
                (a, b) =>
                  new Date(a.started_at).getTime() - new Date(b.started_at).getTime()
              )
              .map((s, i) => {
                const hour = new Date(s.started_at).getHours();
                const duration = sessionDuration(s);
                const icon = partOfDayIcon(hour);
                return (
                  <div
                    key={s.id}
                    className="d-flex align-items-center gap-3 py-2"
                    style={{
                      borderBottom:
                        i < sessions.length - 1 ? '1px dashed #e9ecef' : 'none',
                    }}
                  >
                    {/* Part-of-day icon + time */}
                    <span
                      title={`Visit #${i + 1}`}
                      className="rounded-circle bg-light d-flex align-items-center justify-content-center"
                      style={{ width: 36, height: 36, fontSize: 18, flexShrink: 0 }}
                    >
                      {icon}
                    </span>

                    <div className="grow">
                      <div className="fw-semibold small">
                        {timeOfDay(s.started_at)}
                        <span className="text-muted mx-1">→</span>
                        {timeOfDay(s.last_activity_at)}
                      </div>
                      <small className="text-muted">
                        {hour < 12 ? 'Morning' : hour < 17 ? 'Afternoon' : hour < 21 ? 'Evening' : 'Night'}
                      </small>
                    </div>

                    {/* Duration badge */}
                    <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 fw-semibold">
                      <i className="bi bi-hourglass-split me-1"></i>
                      {formatDuration(duration)}
                    </span>

                    {/* Session ID (tooltip for debugging) */}
                    <span
                      className="font-monospace text-muted"
                      style={{ fontSize: 10 }}
                      title={s.id}
                    >
                      {s.id.slice(0, 6)}…
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}