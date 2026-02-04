// "use client";

// import { useEffect, useState } from "react";
// import { createClient } from "@/lib/supabase/supabase";

// type Profile = {
//   role: string;
//   email: string;
//   created_at: string;
// };

// export default function AuthStatus() {
//   const supabase = createClient();

//   const [user, setUser] = useState<any>(null);
//   const [profile, setProfile] = useState<Profile | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadUserAndProfile = async () => {
//       const { data: authData } = await supabase.auth.getUser();
//       const authUser = authData.user;

//       setUser(authUser);

//       if (authUser) {
//         const { data: profileData } = await supabase
//           .from("profiles")
//           .select("role, email, created_at")
//           .eq("id", authUser.id)
//           .single();

//         setProfile(profileData);
//       }

//       setLoading(false);
//     };

//     loadUserAndProfile();

//     const {
//       data: { subscription },
//     } = supabase.auth.onAuthStateChange((_event, session) => {
//       setUser(session?.user ?? null);
//       if (!session?.user) {
//         setProfile(null);
//       }
//     });

//     return () => subscription.unsubscribe();
//   }, [supabase]);

//   const handleGoogleLogin = async () => {
//     await supabase.auth.signInWithOAuth({
//       provider: "google",
//       options: {
//         redirectTo: `${location.origin}/auth/callback`,
//       },
//     });
//   };

//   const handleLogout = async () => {
//     await supabase.auth.signOut();
//     setUser(null);
//     setProfile(null);
//   };

//   if (loading) {
//     return <p>Loading...</p>;
//   }

//   if (!user) {
//     return (
//       <button
//         style={{ margin: "400px" }}
//         onClick={handleGoogleLogin}
//         className="google-login-btn"
//       >
//         Sign in with Google
//       </button>
//     );
//   }

//   return (
//     <div style={{ padding: "20px" }}>
//       <h3>Account Info</h3>

//       <p><strong>User ID:</strong> {user.id}</p>
//       <p><strong>Email:</strong> {user.email}</p>
//       <p><strong>Provider:</strong> {user.app_metadata.provider}</p>
//       <p><strong>Email Verified:</strong> {String(user.email_confirmed_at !== null)}</p>

//       {profile && (
//         <>
//           <hr />
//           <h4>Profile</h4>
//           <p><strong>Role:</strong> {profile.role}</p>
//           <p><strong>Profile Created:</strong> {new Date(profile.created_at).toLocaleString()}</p>
//         </>
//       )}

//       <button
//         onClick={handleLogout}
//         style={{ marginTop: "20px" }}
//         className="logout-btn"
//       >
//         Logout
//       </button>
//     </div>
//   );
// }










// // app/login/page.tsx
// "use client";

// import { useEffect, useState } from "react";
// import { createClient } from "@/lib/supabase/supabase";
// import { useRouter, useSearchParams } from "next/navigation";
// import Link from "next/link";
// import Image from "next/image";
// import AppLoader from "@/components/ui/AppLoader/AppLoader";
// import "./style.css";

// export default function LoginPage() {
//   const supabase = createClient();
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const [loading, setLoading] = useState(true);
//   const [isLoggingIn, setIsLoggingIn] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // Check if user is already logged in and redirect
//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const { data: { user } } = await supabase.auth.getUser();

//         if (user) {
//           // Get user role to determine redirect
//           const { data: profile } = await supabase
//             .from("profiles")
//             .select("role")
//             .eq("id", user.id)
//             .single();

//           // Get redirect URL from query params or use default based on role
//           const callbackUrl = searchParams?.get('redirect') || searchParams?.get('callbackUrl');

//           if (callbackUrl) {
//             router.push(callbackUrl);
//           } else if (profile?.role === 'admin') {
//             router.push("/admin");
//           } else {
//             // Redirect to previous page or dashboard
//             const referrer = document.referrer;
//             const isFromSameOrigin = referrer && new URL(referrer).origin === window.location.origin;

//             if (isFromSameOrigin && !referrer.includes('/login')) {
//               router.back();
//             } else {
//               router.push("/");
//             }
//           }
//         }
//       } catch (err) {
//         console.error("Auth check error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkAuth();

//     // Listen for auth state changes
//     const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
//       if (session?.user) {
//         // User just logged in, redirect based on role
//         supabase
//           .from("profiles")
//           .select("role")
//           .eq("id", session.user.id)
//           .single()
//           .then(({ data: profile }) => {
//             const callbackUrl = searchParams?.get('redirect') || searchParams?.get('callbackUrl');

//             if (callbackUrl) {
//               router.push(callbackUrl);
//             } else if (profile?.role === 'admin') {
//               router.push("/admin");
//             } else {
//               router.push("/");
//             }
//           });
//       }
//     });

//     return () => subscription.unsubscribe();
//   }, [supabase, router, searchParams]);

//   const handleGoogleLogin = async () => {
//     try {
//       setIsLoggingIn(true);
//       setError(null);

//       const callbackUrl = searchParams?.get('redirect') || searchParams?.get('callbackUrl') || `${location.origin}/dashboard`;

//       const { error } = await supabase.auth.signInWithOAuth({
//         provider: "google",
//         options: {
//           redirectTo: `${location.origin}/auth/callback?redirect=${encodeURIComponent(callbackUrl)}`,
//           queryParams: {
//             access_type: 'offline',
//             prompt: 'consent',
//           }
//         },
//       });

//       if (error) {
//         throw error;
//       }
//     } catch (err: any) {
//       setError(err.message || "Failed to sign in with Google. Please try again.");
//       setIsLoggingIn(false);
//     }
//   };

//   // Show loading while checking auth
//   if (loading) {
//     return (
//       <div className="min-vh-100 d-flex align-items-center justify-content-center">
//         <AppLoader />
//       </div>
//     );
//   }

//   // Show login page if not authenticated
//   return (
//     <main className="main">
//       {/* Page Title */}
//       <div className="page-title">
//         <div className="heading">
//           <div className="container">
//             <div className="row d-flex justify-content-center text-center">
//               <div className="col-lg-8">
//                 <h1 className="heading-title">Welcome Back</h1>
//                 <p className="mb-0">
//                   Sign in to access your account, manage your property listings,
//                   save favorites, and connect with agents.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//         <nav className="breadcrumbs">
//           <div className="container">
//             <ol>
//               <li>
//                 <Link href="/">Home</Link>
//               </li>
//               <li className="current">Login</li>
//             </ol>
//           </div>
//         </nav>
//       </div>
//       {/* End Page Title */}

//       {/* Login Section */}
//       <section className="login-section section">
//         <div className="container" data-aos="fade-up">
//           <div className="row justify-content-center">
//             <div className="col-lg-6 col-md-8 col-sm-10">
//               <div className="login-card">
//                 {/* Login Header */}
//                 <div className="login-header text-center mb-5">
//                   <div className="login-icon mb-4">
//                     <div className="login-icon-circle">
//                       <i className="bi bi-house-door-fill"></i>
//                     </div>
//                   </div>
//                   <h2 className="login-title">Sign In to Your Account</h2>
//                   <p className="text-muted mb-0">
//                     Connect using your Google account for secure and easy access
//                   </p>
//                 </div>

//                 {/* Error Message */}
//                 {error && (
//                   <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
//                     <div className="d-flex align-items-center">
//                       <i className="bi bi-exclamation-triangle-fill me-2"></i>
//                       <span>{error}</span>
//                     </div>
//                     <button
//                       type="button"
//                       className="btn-close"
//                       onClick={() => setError(null)}
//                       aria-label="Close"
//                     ></button>
//                   </div>
//                 )}

//                 {/* Google Sign In Button */}
//                 <div className="login-body" data-aos="fade-up" data-aos-delay="100">
//                   <button
//                     className="btn btn-google w-100 py-3 mb-4"
//                     onClick={handleGoogleLogin}
//                     disabled={isLoggingIn}
//                   >
//                     <div className="d-flex align-items-center justify-content-center">
//                       {isLoggingIn ? (
//                         <>
//                           <div className="spinner-border spinner-border-sm me-2" role="status">
//                             <span className="visually-hidden">Loading...</span>
//                           </div>
//                           <span className="fw-semibold">Connecting to Google...</span>
//                         </>
//                       ) : (
//                         <>
//                           <Image
//                             src="/img/google-logo.svg"
//                             alt="Google"
//                             width={20}
//                             height={20}
//                             className="me-3"
//                             onError={(e) => {
//                               // Fallback if Google logo doesn't exist
//                               const target = e.target as HTMLImageElement;
//                               target.style.display = 'none';
//                               target.parentElement!.insertAdjacentHTML('beforeend', 
//                                 '<i class="bi bi-google me-3"></i>'
//                               );
//                             }}
//                           />
//                           <span className="fw-semibold">Continue with Google</span>
//                         </>
//                       )}
//                     </div>
//                   </button>

//                   {/* Divider */}
//                   <div className="divider d-flex align-items-center my-4">
//                     <span className="divider-line flex-grow-1"></span>
//                     <span className="divider-text px-3 text-muted small">Secure authentication</span>
//                     <span className="divider-line flex-grow-1"></span>
//                   </div>

//                   {/* Features List */}
//                   <div className="features-list mb-4">
//                     <div className="feature-item d-flex align-items-center mb-3">
//                       <i className="bi bi-check-circle-fill text-success me-3"></i>
//                       <span>One-click login with your Google account</span>
//                     </div>
//                     <div className="feature-item d-flex align-items-center mb-3">
//                       <i className="bi bi-check-circle-fill text-success me-3"></i>
//                       <span>Automatically redirects you back to your previous page</span>
//                     </div>
//                     <div className="feature-item d-flex align-items-center">
//                       <i className="bi bi-check-circle-fill text-success me-3"></i>
//                       <span>Secure and encrypted authentication</span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Login Footer */}
//                 <div className="login-footer mt-4 pt-4 border-top text-center">
//                   <p className="text-muted small mb-2">
//                     Don&#39;t have an account? Just sign in with Google to create one automatically.
//                   </p>
//                   <p className="small text-muted mb-0">
//                     By signing in, you agree to our{" "}
//                     <Link href="/terms" className="text-decoration-underline">
//                       Terms of Service
//                     </Link>{" "}
//                     and{" "}
//                     <Link href="/privacy" className="text-decoration-underline">
//                       Privacy Policy
//                     </Link>
//                     .
//                   </p>
//                 </div>
//               </div>

//               {/* Info Cards */}
//               <div className="row g-4 mt-4">
//                 <div className="col-md-4">
//                   <div className="info-card text-center p-4 h-100">
//                     <div className="info-icon mb-3">
//                       <i className="bi bi-shield-lock fs-2"></i>
//                     </div>
//                     <h5 className="info-title mb-2">Secure</h5>
//                     <p className="small text-muted mb-0">
//                       Google&#39;s industry-leading security protects your account
//                     </p>
//                   </div>
//                 </div>
//                 <div className="col-md-4">
//                   <div className="info-card text-center p-4 h-100">
//                     <div className="info-icon mb-3">
//                       <i className="bi bi-lightning-fill fs-2"></i>
//                     </div>
//                     <h5 className="info-title mb-2">Fast</h5>
//                     <p className="small text-muted mb-0">
//                       One-click login, no passwords to remember
//                     </p>
//                   </div>
//                 </div>
//                 <div className="col-md-4">
//                   <div className="info-card text-center p-4 h-100">
//                     <div className="info-icon mb-3">
//                       <i className="bi bi-arrow-left-right fs-2"></i>
//                     </div>
//                     <h5 className="info-title mb-2">Seamless</h5>
//                     <p className="small text-muted mb-0">
//                       Automatically returns you to where you left off
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//     </main>
//   );
// }








// app/login/page.tsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import AppLoader from "@/components/ui/AppLoader/AppLoader";
import "./style.css";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // const [user, setUser] = useState<any>(null);

  // Check if user is already logged in and redirect
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        // setUser(user);

        if (user) {
          // Get user role to determine redirect
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

          // Get redirect URL from query params or use default based on role
          const callbackUrl = searchParams?.get('redirect') || searchParams?.get('callbackUrl');

          if (callbackUrl) {
            router.push(callbackUrl);
          } else if (profile?.role === 'admin') {
            router.push("/admin");
          } else {
            // Redirect to previous page or dashboard
            const referrer = document.referrer;
            const isFromSameOrigin = referrer && new URL(referrer).origin === window.location.origin;

            if (isFromSameOrigin && !referrer.includes('/login')) {
              router.back();
            } else {
              router.push("/");
            }
          }
        }
      } catch (err) {
        console.error("Auth check error:", err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      // setUser(session?.user || null);
      if (session?.user) {
        // User just logged in, redirect based on role
        supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single()
          .then(({ data: profile }) => {
            const callbackUrl = searchParams?.get('redirect') || searchParams?.get('callbackUrl');

            if (callbackUrl) {
              router.push(callbackUrl);
            } else if (profile?.role === 'admin') {
              router.push("/admin");
            } else {
              router.push("/");
            }
          });
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, router, searchParams]);


  const handleGoogleLogin = async () => {
    try {
      setIsLoggingIn(true);
      setError(null);

      const callbackUrl = searchParams?.get('redirect') || searchParams?.get('callbackUrl') || `${location.origin}/`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${location.origin}/auth/callback?redirect=${encodeURIComponent(callbackUrl)}`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        },
      });

      if (error) {
        throw error;
      }
    } catch (err: any) {
      setError(err.message || "Failed to sign in with Google. Please try again.");
      setIsLoggingIn(false);
    }
  };

  // const handleLogout = async () => {
  //   try {
  //     setError(null);
  //     const { error } = await supabase.auth.signOut();

  //     if (error) throw error;

  //     // After logout, redirect to login page with a message
  //     router.push("/login?message=You have been logged out successfully");
  //   } catch (err: any) {
  //     setError(err.message || "Failed to log out. Please try again.");
  //   }
  // };

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <AppLoader />
      </div>
    );
  }

  // // Show logout interface if user is already authenticated
  // if (user) {
  //   return (
  //     <main className="main">
  //       <div className="page-title">
  //         <div className="heading">
  //           <div className="container">
  //             <div className="row d-flex justify-content-center text-center">
  //               <div className="col-lg-8">
  //                 <h1 className="heading-title">Already Logged In</h1>
  //                 <p className="mb-0">
  //                   You are currently signed in to your account.
  //                 </p>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //         <nav className="breadcrumbs">
  //           <div className="container">
  //             <ol>
  //               <li>
  //                 <Link href="/">Home</Link>
  //               </li>
  //               <li className="current">Account</li>
  //             </ol>
  //           </div>
  //         </nav>
  //       </div>

  //       <section className="login-section section">
  //         <div className="container" data-aos="fade-up">
  //           <div className="row justify-content-center">
  //             <div className="col-lg-6 col-md-8 col-sm-10">
  //               <div className="login-card">
  //                 <div className="login-header text-center mb-5">
  //                   <div className="login-icon mb-4">
  //                     <div className="login-icon-circle bg-success">
  //                       <i className="bi bi-person-check-fill text-white"></i>
  //                     </div>
  //                   </div>
  //                   <h2 className="login-title">Welcome Back!</h2>
  //                   <p className="text-muted mb-0">
  //                     You are already signed in as <strong>{user.email}</strong>
  //                   </p>
  //                 </div>

  //                 {error && (
  //                   <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
  //                     <div className="d-flex align-items-center">
  //                       <i className="bi bi-exclamation-triangle-fill me-2"></i>
  //                       <span>{error}</span>
  //                     </div>
  //                     <button
  //                       type="button"
  //                       className="btn-close"
  //                       onClick={() => setError(null)}
  //                       aria-label="Close"
  //                     ></button>
  //                   </div>
  //                 )}

  //                 <div className="login-body" data-aos="fade-up" data-aos-delay="100">
  //                   <div className="d-grid gap-3">
  //                     <button
  //                       className="btn btn-primary w-100 py-3"
  //                       onClick={() => router.push("/dashboard")}
  //                     >
  //                       <div className="d-flex align-items-center justify-content-center">
  //                         <i className="bi bi-speedometer2 me-2"></i>
  //                         <span className="fw-semibold">Go to Dashboard</span>
  //                       </div>
  //                     </button>

  //                     <button
  //                       className="btn btn-outline-primary w-100 py-3"
  //                       onClick={() => router.push("/")}
  //                     >
  //                       <div className="d-flex align-items-center justify-content-center">
  //                         <i className="bi bi-house me-2"></i>
  //                         <span className="fw-semibold">Return to Homepage</span>
  //                       </div>
  //                     </button>

  //                     <button
  //                       className="btn btn-danger w-100 py-3"
  //                       onClick={handleLogout}
  //                     >
  //                       <div className="d-flex align-items-center justify-content-center">
  //                         <i className="bi bi-box-arrow-right me-2"></i>
  //                         <span className="fw-semibold">Sign Out</span>
  //                       </div>
  //                     </button>
  //                   </div>

  //                   <div className="divider d-flex align-items-center my-4">
  //                     <span className="divider-line flex-grow-1"></span>
  //                     <span className="divider-text px-3 text-muted small">Account Management</span>
  //                     <span className="divider-line flex-grow-1"></span>
  //                   </div>

  //                   <div className="features-list mb-4">
  //                     <div className="feature-item d-flex align-items-center mb-3">
  //                       <i className="bi bi-check-circle-fill text-success me-3"></i>
  //                       <span>Access your property listings and saved favorites</span>
  //                     </div>
  //                     <div className="feature-item d-flex align-items-center mb-3">
  //                       <i className="bi bi-check-circle-fill text-success me-3"></i>
  //                       <span>Manage your profile and preferences</span>
  //                     </div>
  //                     <div className="feature-item d-flex align-items-center">
  //                       <i className="bi bi-check-circle-fill text-success me-3"></i>
  //                       <span>Connect with agents and track inquiries</span>
  //                     </div>
  //                   </div>
  //                 </div>

  //                 <div className="login-footer mt-4 pt-4 border-top text-center">
  //                   <p className="small text-muted mb-0">
  //                     Need help?{" "}
  //                     <Link href="/contact" className="text-decoration-underline">
  //                       Contact Support
  //                     </Link>
  //                   </p>
  //                 </div>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       </section>
  //     </main>
  //   );
  // }

  // Show login page if not authenticated
  return (
    <main className="main">
      {/* Page Title */}
      <div className="page-title">
        <div className="heading">
          <div className="container">
            <div className="row d-flex justify-content-center text-center">
              <div className="col-lg-8">
                <h1 className="heading-title">Welcome Back</h1>
                <p className="mb-0">
                  Sign in to access your account, manage your property listings,
                  save favorites, and connect with agents.
                </p>
              </div>
            </div>
          </div>
        </div>
        <nav className="breadcrumbs">
          <div className="container">
            <ol>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li className="current">Login</li>
            </ol>
          </div>
        </nav>
      </div>
      {/* End Page Title */}

      {/* Login Section */}
      <section className="login-section section">
        <div className="container" data-aos="fade-up">
          <div className="row justify-content-center">
            <div className="col-lg-6 col-md-8 col-sm-10">
              <div className="login-card">
                {/* Login Header */}
                <div className="login-header text-center mb-5">
                  <div className="login-icon mb-4">
                    <div className="login-icon-circle">
                      <i className="bi bi-house-door-fill"></i>
                    </div>
                  </div>
                  <h2 className="login-title">Sign In to Your Account</h2>
                  <p className="text-muted mb-0">
                    Connect using your Google account for secure and easy access
                  </p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-exclamation-triangle-fill me-2"></i>
                      <span>{error}</span>
                    </div>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setError(null)}
                      aria-label="Close"
                    ></button>
                  </div>
                )}

                {/* Google Sign In Button */}
                <div className="login-body" data-aos="fade-up" data-aos-delay="100">
                  <button
                    className="btn btn-google w-100 py-3 mb-4"
                    onClick={handleGoogleLogin}
                    disabled={isLoggingIn}
                  >
                    <div className="d-flex align-items-center justify-content-center">
                      {isLoggingIn ? (
                        <>
                          <div className="spinner-border spinner-border-sm me-2" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          <span className="fw-semibold">Connecting to Google...</span>
                        </>
                      ) : (
                        <>
                          <Image
                            // src="/img/google-logo.svg"
                            src="/img/google-logo.png"
                            // src="/img/google-black-icon.jpg"
                            alt="Google"
                            width={20}
                            height={20}
                            className="me-3"
                            onError={(e) => {
                              // Fallback if Google logo doesn't exist
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.parentElement!.insertAdjacentHTML('beforeend',
                                '<i class="bi bi-google me-3"></i>'
                              );
                            }}
                          />
                          <span className="fw-semibold">Continue with Google</span>
                        </>
                      )}
                    </div>
                  </button>

                  {/* Divider */}
                  <div className="divider d-flex align-items-center my-4">
                    <span className="divider-line grow"></span>
                    <span className="divider-text px-3 text-muted small">Secure authentication</span>
                    <span className="divider-line grow"></span>
                  </div>

                  {/* Features List */}
                  <div className="features-list mb-4">
                    <div className="feature-item d-flex align-items-center mb-3">
                      <i className="bi bi-check-circle-fill text-success me-3"></i>
                      <span>One-click login with your Google account</span>
                    </div>
                    <div className="feature-item d-flex align-items-center mb-3">
                      <i className="bi bi-check-circle-fill text-success me-3"></i>
                      <span>Automatically redirects you back to your previous page</span>
                    </div>
                    <div className="feature-item d-flex align-items-center">
                      <i className="bi bi-check-circle-fill text-success me-3"></i>
                      <span>Secure and encrypted authentication</span>
                    </div>
                  </div>
                </div>

                {/* Login Footer */}
                <div className="login-footer mt-4 pt-4 border-top text-center">
                  <p className="text-muted small mb-2">
                    Don&#39;t have an account? Just sign in with Google to create one automatically.
                  </p>
                  <p className="small text-muted mb-0">
                    By signing in, you agree to our{" "}
                    <Link href="/privacy" className="text-decoration-underline">
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </div>

              </div>

              {/* Info Cards */}
              <div className="row g-4 mt-4">
                <div className="col-md-4">
                  <div className="info-card text-center p-4 h-100">
                    <div className="info-icon mb-3">
                      <i className="bi bi-shield-lock fs-2"></i>
                    </div>
                    <h5 className="info-title mb-2">Secure</h5>
                    <p className="small text-muted mb-0">
                      Google&#39;s industry-leading security protects your account
                    </p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="info-card text-center p-4 h-100">
                    <div className="info-icon mb-3">
                      <i className="bi bi-lightning-fill fs-2"></i>
                    </div>
                    <h5 className="info-title mb-2">Fast</h5>
                    <p className="small text-muted mb-0">
                      One-click login, no passwords to remember
                    </p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="info-card text-center p-4 h-100">
                    <div className="info-icon mb-3">
                      <i className="bi bi-arrow-left-right fs-2"></i>
                    </div>
                    <h5 className="info-title mb-2">Seamless</h5>
                    <p className="small text-muted mb-0">
                      Automatically returns you to where you left off
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}