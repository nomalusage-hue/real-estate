// "use client";

// import { usePathname } from "next/navigation";
// import Link from "next/link";
// import { useCallback, useEffect, useState } from "react";
// import { createClient } from "@/lib/supabase/supabase";

// export default function Header() {
//   const pathname = usePathname();
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [user, setUser] = useState<any>(null);
//   const [userRole, setUserRole] = useState<string | null>(null);

//   const toggleMobileNav = useCallback(() => {
//     setMobileOpen((prev) => !prev);
//   }, []);

//   // Sync body class with state
//   useEffect(() => {
//     if (mobileOpen) {
//       document.body.classList.add("mobile-nav-active");
//     } else {
//       document.body.classList.remove("mobile-nav-active");
//     }
//   }, [mobileOpen]);

//   // Close menu on route change
//   useEffect(() => {
//     setMobileOpen(false);
//   }, [pathname]);

//   // // Check user authentication and role
//   // useEffect(() => {
//   //   const supabase = createClient();

//   //   const checkAuth = async () => {
//   //     const { data: { user } } = await supabase.auth.getUser();

//   //     if (user) {
//   //       setUser(user);
//   //       // Get user role
//   //       const { data: profile, error } = await supabase
//   //         .from("profiles")
//   //         .select("role")
//   //         .eq("id", user.id)
//   //         .single();

//   //       if (error) {
//   //         console.error("Error fetching profile:", error);
//   //         setUserRole(null);
//   //       } else {
//   //         console.log("Profile fetched:", profile);
//   //         setUserRole(profile?.role || null);
//   //       }
//   //     } else {
//   //       setUser(null);
//   //       setUserRole(null);
//   //     }
//   //   };

//   //   checkAuth();

//   //   // Listen for auth changes
//   //   // const supabase = createClient();
//   //   const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
//   //     if (session?.user) {
//   //       setUser(session.user);
//   //       const { data: profile, error } = await supabase
//   //         .from("profiles")
//   //         .select("role")
//   //         .eq("id", session.user.id)
//   //         .single();

//   //       if (error) {
//   //         console.error("Error fetching profile on auth change:", error);
//   //         setUserRole(null);
//   //       } else {
//   //         console.log("Profile fetched on auth change:", profile);
//   //         setUserRole(profile?.role || null);
//   //       }
//   //     } else {
//   //       setUser(null);
//   //       setUserRole(null);
//   //     }
//   //   });

//   //   return () => subscription.unsubscribe();
//   // }, []);

//   const supabase = createClient();

//   useEffect(() => {
//     let mounted = true;

//     const init = async () => {
//       const { data: { user } } = await supabase.auth.getUser();
//       if (mounted) setUser(user);
//     };

//     init();

//     const { data: { subscription } } =
//       supabase.auth.onAuthStateChange((_event, session) => {
//         setUser(session?.user ?? null);
//       });

//     return () => {
//       mounted = false;
//       subscription.unsubscribe();
//     };
//   }, []);


//   return (
//     <header id="header" className="header d-flex align-items-center fixed-top">
//       <div className="header-container container-fluid container-xl position-relative d-flex align-items-center justify-content-between">
//         <Link
//           href="/"
//           className="logo d-flex align-items-center me-auto me-xl-0"
//         >
//           {/* <!-- Uncomment the line below if you also wish to use an image logo --> */}
//           {/* <!-- <img src="assets/img/logo.webp" alt=""> --> */}
//           <h1 className="sitename">TheProperty</h1>
//         </Link>

//         <nav id="navmenu" className="navmenu">
//           <ul>
//             <li>
//               <Link href="/" className={pathname === "/" ? "active" : ""}>
//                 Home
//               </Link>
//             </li>
//             <li>
//               <Link href="/about" className={pathname === "/about" ? "active" : ""}>About</Link>
//             </li>
//             <li>
//               <Link href="/properties" className={pathname === "/properties" ? "active" : ""}>Properties</Link>
//             </li>

//             {/* <li>
//               <Link href="/services" className={pathname === "/services" ? "active" : ""}>Services</Link>
//             </li>
//             <li>
//               <Link href="/agents" className={pathname === "/agents" ? "active" : ""}>Agents</Link>
//             </li>
//             <li>
//               <Link href="/blog" className={pathname === "/blog" ? "active" : ""}>Blog</Link>
//             </li> */}

//             {/* <li className="dropdown">
//               <Link href="#">
//                 <span>More Pages</span>{" "}
//                 <i className="bi bi-chevron-down toggle-dropdown"></i>
//               </Link>
//               <ul>
//                 <li>
//                   <a href="property-details.html">Property Details</a>
//                 </li>
//                 <li>
//                   <a href="service-details.html">Service Details</a>
//                 </li>
//                 <li>
//                   <a href="agent-profile.html">Agent Profile</a>
//                 </li>
//                 <li>
//                   <a href="blog-details.html">Blog Details</a>
//                 </li>
//                 <li>
//                   <a href="terms.html">Terms</a>
//                 </li>
//                 <li>
//                   <a href="privacy.html">Privacy</a>
//                 </li>
//                 <li>
//                   <a href="404.html">404</a>
//                 </li>
//               </ul>
//             </li> */}

//             {/* <li className="dropdown">
//               <a href="#">
//                 <span>Dropdown</span>{" "}
//                 <i className="bi bi-chevron-down toggle-dropdown"></i>
//               </a>
//               <ul>
//                 <li>
//                   <a href="#">Dropdown 1</a>
//                 </li>
//                 <li className="dropdown">
//                   <a href="#">
//                     <span>Deep Dropdown</span>{" "}
//                     <i className="bi bi-chevron-down toggle-dropdown"></i>
//                   </a>
//                   <ul>
//                     <li>
//                       <a href="#">Deep Dropdown 1</a>
//                     </li>
//                     <li>
//                       <a href="#">Deep Dropdown 2</a>
//                     </li>
//                     <li>
//                       <a href="#">Deep Dropdown 3</a>
//                     </li>
//                     <li>
//                       <a href="#">Deep Dropdown 4</a>
//                     </li>
//                     <li>
//                       <a href="#">Deep Dropdown 5</a>
//                     </li>
//                   </ul>
//                 </li>
//                 <li>
//                   <a href="#">Dropdown 2</a>
//                 </li>
//                 <li>
//                   <a href="#">Dropdown 3</a>
//                 </li>
//                 <li>
//                   <a href="#">Dropdown 4</a>
//                 </li>
//               </ul>
//             </li> */}

//             <li className="dropdown">
//               <Link href="#">
//                 <span>Listings</span>{" "}
//                 <i className="bi bi-chevron-down toggle-dropdown"></i>
//               </Link>
//               <ul>
//                 <li>
//                   <Link href="/properties?type=sale">For Sale</Link>
//                 </li>
//                 <li>
//                   <Link href="/properties?type=rent">For Rent</Link>
//                 </li>
//               </ul>
//             </li>


//             <li className="dropdown">
//               <Link href="#">
//                 <span>Property Type</span>{" "}
//                 <i className="bi bi-chevron-down toggle-dropdown"></i>
//               </Link>

//               <ul className="dropdown-checkbox">
//                 <li>
//                   <Link href="/properties?propertyType=House">House</Link>
//                 </li>

//                 <li>
//                   <Link href="/properties?propertyType=Apartment">Apartment</Link>
//                 </li>

//                 <li>
//                   <Link href="/properties?propertyType=Villa">Villa</Link>
//                 </li>

//                 <li>
//                   <Link href="/properties?propertyType=Commercial">Commercial</Link>
//                 </li>

//                 <li>
//                   <Link href="/properties?propertyType=Land">Land</Link>
//                 </li>
//               </ul>
//             </li>

//             <li>
//               <Link
//                 style={{ "paddingRight": "15px !important" }}
//                 href="/contact"
//                 className={pathname === "/contact" ? "active" : ""}>Contact</Link>
//             </li>


//             {userRole === 'admin' && (
//               <li>
//                 <Link href="/admin/properties/new" className={pathname === "/admin/properties/new" ? "active" : ""}>Dashboard</Link>
//               </li>
//             )}

//             {user && (
//               <li>
//                 <Link href="/favorites" className={pathname === "/favorites" ? "active" : ""}>
//                   {/* <i className="bi bi-heart me-1"></i>Favorites */}
//                   Favorites
//                 </Link>
//               </li>
//             )}


//           </ul>
//           {/* <i className="mobile-nav-toggle d-xl-none bi bi-list" onClick={toggleMobileNav} role="button"></i> */}
//           <i
//             className={`mobile-nav-toggle d-xl-none bi ${mobileOpen ? "bi-x" : "bi-list"
//               }`}
//             onClick={toggleMobileNav}
//             role="button"
//             aria-label="Toggle navigation"
//           />
//         </nav>

//         <Link className="btn-getstarted" href="/properties">
//           Get Started
//         </Link>
//       </div>
//     </header>
//   );
// }



"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/supabase";
// import { checkIfAdmin } from "@/utils/checkIfAdmin";

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // ✅ ONE Supabase client
  const supabase = createClient();

  const toggleMobileNav = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  // Sync body class with mobile nav
  useEffect(() => {
    document.body.classList.toggle("mobile-nav-active", mobileOpen);
  }, [mobileOpen]);

  // Close menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // // ✅ AUTH ONLY — NO DB, NO ROLES
  // useEffect(() => {
  //   let mounted = true;

  //   const initAuth = async () => {
  //     const { data: { user } } = await supabase.auth.getUser();
  //     if (mounted) setUser(user);
  //     console.log(user)
  //   };

  //   initAuth();

  //   const { data: { subscription } } =
  //     supabase.auth.onAuthStateChange((_event, session) => {
  //       setUser(session?.user ?? null);
  //     });

  //   return () => {
  //     mounted = false;
  //     subscription.unsubscribe();
  //   };
  // }, [supabase]);
  
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

    // fetch role from profiles table
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', currentUser.id)
        .single();

      if (error || !profile) {
        setIsAdmin(false);
      } else {
        setIsAdmin(profile.role === 'admin' || profile.role === 'superadmin');
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

      // safe: fetch role again after login
      supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()
        .then(({ data: profile }) => {
          setIsAdmin(profile?.role === 'admin');
        })
        // .catch(() => setIsAdmin(false));
    }
  );

  return () => subscription.unsubscribe();
}, []);

  return (
    <header id="header" className="header d-flex align-items-center fixed-top">
      <div className="header-container container-fluid container-xl d-flex align-items-center justify-content-between">

        <Link href="/" className="logo d-flex align-items-center">
          <h1 className="sitename">TheProperty</h1>
        </Link>

        <nav id="navmenu" className="navmenu">
          <ul>
            <li><Link href="/" className={pathname === "/" ? "active" : ""}>Home</Link></li>
            <li><Link href="/about" className={pathname === "/about" ? "active" : ""}>About</Link></li>
            <li><Link href="/properties" className={pathname === "/properties" ? "active" : ""}>Properties</Link></li>

            <li className="dropdown">
              <Link href="#"><span>Listings</span></Link>
              <ul>
                <li><Link href="/properties?type=sale">For Sale</Link></li>
                <li><Link href="/properties?type=rent">For Rent</Link></li>
              </ul>
            </li>

            <li className="dropdown">
              <Link href="#"><span>Property Type</span></Link>
              <ul>
                <li><Link href="/properties?propertyType=House">House</Link></li>
                <li><Link href="/properties?propertyType=Apartment">Apartment</Link></li>
                <li><Link href="/properties?propertyType=Villa">Villa</Link></li>
                <li><Link href="/properties?propertyType=Commercial">Commercial</Link></li>
                <li><Link href="/properties?propertyType=Land">Land</Link></li>
              </ul>
            </li>

            <li><Link href="/contact" className={pathname === "/contact" ? "active" : ""}>Contact</Link></li>

            {/* ✅ SAFE: only checks if logged in */}
            {user && (
              <li>
                <Link href="/favorites" className={pathname === "/favorites" ? "active" : ""}>
                  Favorites
                </Link>
              </li>
            )}

{isAdmin && (
  <li>
    <Link
      href="/admin/properties/new"
      className={pathname === "/admin/properties/new" ? "active" : ""}
    >
      Dashboard
    </Link>
  </li>
)}


          </ul>

          <i
            className={`mobile-nav-toggle d-xl-none bi ${mobileOpen ? "bi-x" : "bi-list"}`}
            onClick={toggleMobileNav}
            role="button"
          />
        </nav>

        <Link className="btn-getstarted" href="/properties">
          Get Started
        </Link>
      </div>
    </header>
  );
}
