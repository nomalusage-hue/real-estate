"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useCallback, useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/supabase";
import Image from "next/image";
import { FiLogOut } from "react-icons/fi";
import { FaUser, FaCrown, FaShieldAlt, FaSignInAlt } from "react-icons/fa";
import { SITE } from "@/src/config/site";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const links = [
    { href: "/admin/properties/new", label: "Add New Property" },
    { href: "/admin/configuration", label: "Manage Configs" },
  ];
  const isActive = links.some(link => pathname?.startsWith(link.href));

  const toggleMobileNav = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  const closeMobileNav = () => setMobileOpen(false);

  // Check if mobile/tablet screen
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 1200);
    };

    // Initial check
    checkIfMobile();

    // Add event listener
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setIsDropdownOpen(false);
  }, [pathname]);

  // Fetch user data
  useEffect(() => {
    const supabase = createClient();

    const loadUserAndRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        setUser(null);
        setIsAdmin(false);
        return;
      }

      const currentUser = session.user;
      setUser(currentUser);

      // Fetch role from profiles table
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', currentUser.id)
          .single();

        if (error || !profile) {
          setIsAdmin(false);
        } else {
          setIsAdmin(profile.role === 'admin');
        }
      } catch {
        setIsAdmin(false);
      }
    };

    loadUserAndRole();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) {
          setUser(null);
          setIsAdmin(false);
          return;
        }
        setUser(session.user);

        // Fetch role again after login
        supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profile }) => {
            setIsAdmin(profile?.role === 'admin');
          });
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    setIsDropdownOpen(false);
  };

  const handleLoginRedirect = () => {
    router.push("/login");
    setIsDropdownOpen(false);
  };

  const getUserInitials = () => {
    if (!user?.user_metadata?.full_name) return "U";
    return user.user_metadata.full_name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getUserName = () => {
    return user?.user_metadata?.full_name || "User";
  };

  const getUserEmail = () => {
    return user?.email || "No email";
  };

  const getAvatarUrl = () => {
    return user?.user_metadata?.avatar_url || null;
  };

  const getGuestAvatar = () => {
    return (
      <div
        className="rounded-circle d-flex align-items-center justify-content-center"
        style={{
          width: '44px',
          height: '44px',
          background: 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
          fontSize: '20px', // Slightly larger for icon
          color: 'white',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          cursor: 'pointer'
        }}
      >
        <FaUser style={{ fontSize: '18px' }} /> {/* User icon instead of text */}
      </div>
    );
  };

  return (
    <header id="header" className="header d-flex align-items-center fixed-top">
      <div className="header-container container-fluid container-xl d-flex align-items-center justify-content-between">
        {/* Keep your existing navigation code... */}
        <Link href="/" className="logo d-flex align-items-center">
          <h1 className="sitename">{SITE.name}</h1>
        </Link>

        <nav id="navmenu" className="navmenu">
          <ul>
            <li><Link href="/" className={pathname === "/" ? "active" : ""} onClick={closeMobileNav}>Home</Link></li>
            <li><Link href="/about" className={pathname === "/about" ? "active" : ""} onClick={closeMobileNav}>About</Link></li>
            <li><Link href="/properties" className={pathname === "/properties" ? "active" : ""} onClick={closeMobileNav}>Properties</Link></li>

            <li className="dropdown">
              <Link href="#">
                <span>Listings</span>
                <i className="bi bi-chevron-down toggle-dropdown"></i>
              </Link>
              <ul>
                {/* Single status */}
                <li><Link href="/properties?status=For%20Sale" onClick={closeMobileNav}>For Sale</Link></li>
                <li><Link href="/properties?status=For%20Rent" onClick={closeMobileNav}>For Rent</Link></li>

                {/* Multiple statuses combined (optional) */}
                <li><Link href="/properties?status=For%20Sale,For%20Rent" onClick={closeMobileNav}>All Active Listings</Link></li>

                {/* Sold properties */}
                <li><Link href="/properties?status=Sold" onClick={closeMobileNav}>Sold Properties</Link></li>
              </ul>
            </li>

            <li className="dropdown">
              <Link href="#">
                <span>Property Type</span>
                <i className="bi bi-chevron-down toggle-dropdown"></i>
              </Link>
              <ul>
                <li><Link href="/properties?propertyType=House" onClick={closeMobileNav}>House</Link></li>
                <li><Link href="/properties?propertyType=Apartment" onClick={closeMobileNav}>Apartment</Link></li>
                <li><Link href="/properties?propertyType=Villa" onClick={closeMobileNav}>Villa</Link></li>
                <li><Link href="/properties?propertyType=Commercial" onClick={closeMobileNav}>Commercial</Link></li>
                <li><Link href="/properties?propertyType=Land" onClick={closeMobileNav}>Land</Link></li>
              </ul>
            </li>

            <li><Link href="/contact" className={pathname === "/contact" ? "active" : ""} onClick={closeMobileNav}>Contact</Link></li>

            <li>
              <Link href="/favorites" className={pathname === "/favorites" ? "active" : ""} onClick={closeMobileNav}>
                Favorites
              </Link>
            </li>

            {isAdmin && (
              <li className="dropdown">
                <Link href="/admin" className={`${isActive ? "active" : ""}`}>
                  <span>Dashboard</span>
                  <i className="bi bi-chevron-down toggle-dropdown"></i>
                </Link>
                <ul>
                  {links.map(link => (
                    <li key={link.href}>
                      <Link href={link.href} onClick={closeMobileNav}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            )}
          </ul>

          <i
            className={`mobile-nav-toggle d-xl-none bi ${mobileOpen ? "bi-x" : "bi-list"}`}
            onClick={toggleMobileNav}
            role="button"
          />
        </nav>

        {
          !isAdmin && (
            <Link className="btn-getstarted" href="/properties" onClick={closeMobileNav}>
              Get Started
            </Link>
          )
        }

        {/* AVATAR & DROPDOWN SECTION - FOR BOTH LOGGED-IN AND NON-LOGGED-IN USERS */}
        <div className="position-relative ms-3" ref={dropdownRef}>
          {/* Avatar Button - Always shown */}
          <div className="position-relative">
            <button
              className="d-flex align-items-center justify-content-center p-0 bg-transparent border-0"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              style={{
                cursor: 'pointer',
                outline: 'none',
                transition: 'transform 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              aria-label="User menu"
              aria-expanded={isDropdownOpen}
            >
              {/* Show different avatar based on login status */}
              {user ? (
                getAvatarUrl() ? (
                  <Image
                    src={getAvatarUrl()}
                    referrerPolicy="no-referrer"
                    alt="User"
                    className="rounded-circle"
                    width={44}
                    height={44}
                    unoptimized
                    style={{
                      width: '44px',
                      height: '44px',
                      objectFit: 'cover',
                      border: isAdmin ? '2px solid #f59e0b' : '2px solid white',
                      boxShadow: isAdmin ? '0 2px 12px rgba(245, 158, 11, 0.3)' : '0 2px 8px rgba(0,0,0,0.15)'
                    }}
                  />
                ) : (
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center text-white fw-semibold"
                    style={{
                      width: '44px',
                      height: '44px',
                      background: isAdmin
                        ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      fontSize: '16px',
                      boxShadow: isAdmin
                        ? '0 2px 12px rgba(245, 158, 11, 0.3)'
                        : '0 2px 8px rgba(0,0,0,0.15)'
                    }}
                  >
                    {getUserInitials()}
                  </div>
                )
              ) : (
                // Guest avatar for non-logged-in users
                getGuestAvatar()
              )}

              {/* Admin crown badge on avatar (only for logged-in admins) */}
              {user && isAdmin && (
                <div
                  className="position-absolute rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    top: '-4px',
                    right: '-4px',
                    width: '20px',
                    height: '20px',
                    backgroundColor: '#f59e0b',
                    border: '2px solid white',
                    color: 'white',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    zIndex: 10
                  }}
                >
                  <FaCrown />
                </div>
              )}

              {/* Online indicator (only for logged-in users) */}
              {user && (
                <div
                  className="position-absolute rounded-circle border border-white"
                  style={{
                    width: '12px',
                    height: '12px',
                    backgroundColor: isAdmin ? '#10B981' : '#10B981',
                    bottom: '2px',
                    right: '2px',
                    zIndex: 5
                  }}
                />
              )}
            </button>
          </div>

          {/* Dropdown Menu - Different content based on login status */}
          {isDropdownOpen && (
            <div
              className="position-absolute rounded-xl shadow-lg border bg-white overflow-hidden z-50"
              style={{
                width: user ? '320px' : '280px',
                animation: 'fadeIn 0.2s ease-out',
                top: '110%',
                borderColor: user && isAdmin ? '#fef3c7' : '#e5e7eb',
                right: isMobile ? 'auto' : '-15%',
                left: isMobile ? '-15%' : 'auto'
              }}
            >
              {/* Header section - Different for logged-in vs non-logged-in */}
              {user ? (
                // Logged-in user header
                <div
                  className="p-4"
                  style={{
                    background: isAdmin
                      ? 'linear-gradient(to right, #fffbeb, #fef3c7)'
                      : 'linear-gradient(to right, #f8fafc, #f1f5f9)',
                    borderBottom: isAdmin ? '1px solid #fde68a' : '1px solid #e5e7eb'
                  }}
                >
                  <div className="d-flex align-items-center gap-3">
                    {getAvatarUrl() ? (
                      <div className="position-relative">
                        <Image
                          src={getAvatarUrl()}
                          referrerPolicy="no-referrer"
                          alt="User"
                          className="rounded-circle"
                          width={48}
                          height={48}
                          unoptimized
                          style={{
                            width: '48px',
                            height: '48px',
                            objectFit: 'cover',
                            border: isAdmin ? '3px solid #fbbf24' : '3px solid white',
                            boxShadow: isAdmin
                              ? '0 4px 12px rgba(245, 158, 11, 0.2)'
                              : '0 4px 12px rgba(0,0,0,0.1)'
                          }}
                        />
                        {isAdmin && (
                          <div
                            className="position-absolute rounded-circle d-flex align-items-center justify-content-center"
                            style={{
                              top: '-6px',
                              right: '-6px',
                              width: '24px',
                              height: '24px',
                              backgroundColor: '#d97706',
                              border: '2px solid white',
                              color: 'white',
                              fontSize: '12px',
                              fontWeight: 'bold'
                            }}
                          >
                            <FaCrown />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="position-relative">
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                          style={{
                            width: '48px',
                            height: '48px',
                            background: isAdmin
                              ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            fontSize: '18px',
                            boxShadow: isAdmin
                              ? '0 4px 12px rgba(245, 158, 11, 0.2)'
                              : '0 4px 12px rgba(0,0,0,0.1)'
                          }}
                        >
                          {getUserInitials()}
                        </div>
                        {isAdmin && (
                          <div
                            className="position-absolute rounded-circle d-flex align-items-center justify-content-center"
                            style={{
                              top: '-6px',
                              right: '-6px',
                              width: '24px',
                              height: '24px',
                              backgroundColor: '#d97706',
                              border: '2px solid white',
                              color: 'white',
                              fontSize: '12px',
                              fontWeight: 'bold'
                            }}
                          >
                            <FaCrown />
                          </div>
                        )}
                      </div>
                    )}
                    <div className="grow overflow-hidden">
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <h3
                          className="mb-0 fw-semibold text-truncate"
                          style={{ color: isAdmin ? '#92400e' : '#1f2937', fontSize: '16px' }}
                        >
                          {getUserName()}
                        </h3>
                        {isAdmin && (
                          <span
                            className="badge rounded-pill px-2 py-1"
                            style={{
                              fontSize: '10px',
                              backgroundColor: '#fef3c7',
                              color: '#92400e',
                              border: '1px solid #fbbf24',
                              fontWeight: '600'
                            }}
                          >
                            ADMIN
                          </span>
                        )}
                      </div>
                      <p
                        className="mb-0 text-truncate"
                        style={{
                          fontSize: '14px',
                          color: isAdmin ? '#b45309' : '#6b7280'
                        }}
                      >
                        {getUserEmail()}
                      </p>

                      {/* ADMIN ACCOUNT BADGE */}
                      <div className="d-flex align-items-center gap-2 mt-2">
                        {isAdmin ? (
                          <>
                            <FaShieldAlt style={{
                              fontSize: '12px',
                              color: '#d97706'
                            }} />
                            <small className="fw-semibold" style={{
                              color: '#92400e',
                              background: 'linear-gradient(to right, #fef3c7, #fde68a)',
                              padding: '2px 8px',
                              borderRadius: '12px',
                              border: '1px solid #fbbf24'
                            }}>
                              Admin Account
                            </small>
                          </>
                        ) : (
                          <>
                            <FaUser style={{ fontSize: '12px', color: '#9ca3af' }} />
                            <small className="text-muted">Standard Account</small>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Guest/Non-logged-in user header
                <div
                  className="p-4"
                  style={{
                    background: 'linear-gradient(to right, #f8fafc, #f1f5f9)',
                    borderBottom: '1px solid #e5e7eb'
                  }}
                >
                  <div className="d-flex align-items-center gap-3">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                      style={{
                        width: '48px',
                        height: '48px',
                        background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
                        fontSize: '18px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                    >
                      GU
                    </div>
                    <div className="grow overflow-hidden">
                      <h3
                        className="mb-1 fw-semibold"
                        style={{ color: '#1f2937', fontSize: '16px' }}
                      >
                        Guest User
                      </h3>
                      <p
                        className="mb-0 text-muted"
                        style={{ fontSize: '14px' }}
                      >
                        Not logged in
                      </p>
                      <div className="d-flex align-items-center gap-2 mt-2">
                        <FaUser style={{ fontSize: '12px', color: '#9ca3af' }} />
                        <small className="text-muted">Guest Account</small>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action buttons - Different based on login status */}
              <div className="p-3">
                {user ? (
                  // Logout button for logged-in users
                  <button
                    onClick={handleLogout}
                    className="w-100 d-flex align-items-center justify-content-center gap-2 py-2 border rounded-lg"
                    style={{
                      backgroundColor: isAdmin ? '#fef3c7' : '#f9fafb',
                      borderColor: isAdmin ? '#fbbf24' : '#e5e7eb',
                      color: isAdmin ? '#92400e' : '#374151',
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = isAdmin ? '#fde68a' : '#f3f4f6';
                      e.currentTarget.style.borderColor = isAdmin ? '#f59e0b' : '#d1d5db';
                      e.currentTarget.style.color = isAdmin ? '#b45309' : '#dc2626';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = isAdmin ? '#fef3c7' : '#f9fafb';
                      e.currentTarget.style.borderColor = isAdmin ? '#fbbf24' : '#e5e7eb';
                      e.currentTarget.style.color = isAdmin ? '#92400e' : '#374151';
                    }}
                  >
                    <FiLogOut style={{ fontSize: '16px' }} />
                    <span>Sign Out</span>
                  </button>
                ) : (
                  // Login button for non-logged-in users
                  <button
                    onClick={handleLoginRedirect}
                    className="w-100 d-flex align-items-center justify-content-center gap-2 py-2 border rounded-lg custom-button"
                    style={{
                      backgroundColor: '#3b82f6',
                      borderColor: '#2563eb',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#2563eb';
                      e.currentTarget.style.borderColor = '#1d4ed8';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#3b82f6';
                      e.currentTarget.style.borderColor = '#2563eb';
                    }}
                  >
                    <FaSignInAlt style={{ fontSize: '16px' }} />
                    <span>Login to Continue</span>
                  </button>
                )}
              </div>

              {/* Footer section */}
              <div
                className="px-3 py-2 text-center border-top"
                style={{
                  backgroundColor: user && isAdmin ? '#fffbeb' : '#f9fafb',
                  borderColor: user && isAdmin ? '#fde68a' : '#e5e7eb'
                }}
              >
                <small style={{ color: user && isAdmin ? '#b45309' : '#6b7280' }}>
                  {user
                    ? (isAdmin ? 'Admin account • Signed in via Google' : 'Signed in via Google')
                    : 'Login to access all features'
                  }
                </small>
              </div>

              {/* Responsive dropdown arrow */}
              <div
                className="position-absolute"
                style={{
                  top: '-8px',
                  left: isMobile ? '20px' : 'auto',
                  right: isMobile ? 'auto' : '20px',
                  width: '16px',
                  height: '16px',
                  backgroundColor: 'white',
                  transform: 'rotate(45deg)',
                  borderTop: `1px solid ${user && isAdmin ? '#fde68a' : '#e5e7eb'}`,
                  borderLeft: `1px solid ${user && isAdmin ? '#fde68a' : '#e5e7eb'}`
                }}
              />
            </div>
          )}
        </div>

        <style jsx global>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-8px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          /* Ensure header maintains its height */
          .header {
            height: auto !important;
            min-height: auto !important;
          }

          .header-container {
            position: relative;
            z-index: 1000;
          }

          /* Fix for Bootstrap conflict */
          .position-relative {
            position: relative !important;
          }

          .position-absolute {
            position: absolute !important;
          }

          .z-50 {
            z-index: 50 !important;
          }

          .shadow-lg {
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
          }

          .rounded-xl {
            border-radius: 12px !important;
          }

          /* Override any Bootstrap styles that might interfere */
          .btn-getstarted {
            margin-left: auto;
          }

          /* Extra small screens (phones) */
          @media (max-width: 576px) {
            .position-absolute[style*="width: 320px"],
            .position-absolute[style*="width: 280px"] {
              width: 260px !important;
              max-width: calc(100vw - 24px) !important;
            }
            
            .p-4 {
              padding: 1rem !important;
            }
          }
        `}</style>
      </div>
    </header>
  );
}