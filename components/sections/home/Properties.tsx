// import PropertyCardHorizontal from "@/components/property/PropertyCard/PropertyCardHorizontal";
// import PropertyCardVertical from "@/components/property/PropertyCard/PropertyCardVertical";
// import PropertyCardVerticalWide from "@/components/property/PropertyCard/PropertyCardVerticalWide";
// import Link from "next/link";
// import { useEffect, useState } from "react";
// import { getHomepageFeaturedProperties } from "@/services/FeaturedPropertiesService";
// import { PropertyData } from '@/types/property';
// import AppLoader from "@/components/ui/AppLoader/AppLoader";

// export default function Properties() {

//     const [wide, setWide] = useState<PropertyData | null>(null);
//     const [mini, setMini] = useState<PropertyData[]>([]);
//     const [stack, setStack] = useState<PropertyData[]>([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         async function load() {
//             setLoading(true);
//             const { wide, mini, stack } = await getHomepageFeaturedProperties();
//             setWide(wide);
//             setMini(mini);
//             setStack(stack);
//             setLoading(false);
//         }
//         load();
//     }, []);

//     if (loading) {
//         return <>
//             <section id="featured-properties" className="featured-properties section">

//                 {/* <!-- Section Title --> */}
//                 <div className="container section-title" data-aos="fade-up">
//                     <h2>Featured Properties</h2>
//                     <p>Explore a curated selection of premium properties tailored to your lifestyle.</p>
//                 </div>
//                 {/* <!-- End Section Title --> */}

//                 <div className="container" data-aos="fade-up" data-aos-delay="100">

//                     <div className="text-center py-5">
//                         <AppLoader />
//                     </div>

//                     <div className="row mt-5">
//                         <div className="col-12 d-flex justify-content-center">
//                             <Link
//                                 href="/properties"
//                                 className="btn custom-button px-4"
//                                 style={{ background: "var(--accent-color)" }}
//                                 aria-label="Chat on WhatsApp"
//                             >
//                                 {/* <i className="bi bi-whatsapp me-2"></i> */}
//                                 Explore More Properties
//                             </Link>
//                         </div>
//                     </div>


//                 </div>

//             </section>
//         </>


//     };

//     return (
//         <section id="featured-properties" className="featured-properties section">

//             {/* <!-- Section Title --> */}
//             <div className="container section-title" data-aos="fade-up">
//                 <h2>Featured Properties</h2>
//                 <p>Explore a curated selection of premium properties tailored to your lifestyle.</p>
//             </div>
//             {/* <!-- End Section Title --> */}

//             <div className="container" data-aos="fade-up" data-aos-delay="100">

//                 <div className="grid-featured" data-aos="zoom-in" data-aos-delay="150">

//                     {wide && <PropertyCardVerticalWide key={wide.id} data={wide} />}

//                     <div className="mini-list">

//                         {mini.map((property) => (
//                             <PropertyCardHorizontal key={property.id} data={property} />
//                         ))}
//                     </div>
//                     {/* <!-- End Mini List --> */}

//                 </div>

//                 <div className="row gy-4 mt-4">
//                     {stack.map((property) => (
//                         <PropertyCardVertical key={property.id} data={property} />
//                     ))}
//                 </div>

//                 <div className="row mt-5">
//                     <div className="col-12 d-flex justify-content-center">
//                         <Link
//                             href="/properties"
//                             className="btn custom-button px-4"
//                             style={{ background: "var(--accent-color)" }}
//                             aria-label="Chat on WhatsApp"
//                         >
//                             <i className="bi bi-house-door me-2"></i>
//                             Explore More Properties
//                         </Link>
//                     </div>
//                 </div>


//             </div>

//         </section>
//     );
// }




// "use client";

// import PropertyCardHorizontal from "@/components/property/PropertyCard/PropertyCardHorizontal";
// import PropertyCardVertical from "@/components/property/PropertyCard/PropertyCardVertical";
// import PropertyCardVerticalWide from "@/components/property/PropertyCard/PropertyCardVerticalWide";
// import Link from "next/link";
// import { useEffect, useRef, useState } from "react";
// import { getHomepageFeaturedProperties, getStackPage } from "@/services/FeaturedPropertiesService";
// import { PropertyData } from "@/types/property";
// import AppLoader from "@/components/ui/AppLoader/AppLoader";
// import "./css/Properties.css";

// const PAGE_SIZE = 3;
// // const MAX_PAGES = 5; // fetch up to 5 pages (15 extra properties) before pushing to /properties

// export default function Properties() {
//     // ── Fixed section (never change) ──
//     const [wide, setWide] = useState<PropertyData | null>(null);
//     const [mini, setMini] = useState<PropertyData[]>([]);

//     // ── Paginated stack section ──
//     // pages[0] is the initial 3, pages[1] is next 3, etc.
//     const [pages, setPages] = useState<Record<number, PropertyData[]>>({});
//     const [currentPage, setCurrentPage] = useState(0);
//     const [totalPages, setTotalPages] = useState(1); // grows as we discover more
//     const [loadingPage, setLoadingPage] = useState<number | null>(null);
//     const [animating, setAnimating] = useState(false);
//     const [fadeIn, setFadeIn] = useState(true);

//     // ids of the fixed cards — never show these in stack
//     const fixedIdsRef = useRef<string[]>([]);

//     const [initialLoading, setInitialLoading] = useState(true);

//     // ── Initial fetch ──
//     useEffect(() => {
//         async function load() {
//             setInitialLoading(true);
//             //   const { wide, mini, stack, fixedExcludeIds } = await getHomepageFeaturedProperties();
//             const { wide, mini, stack, fixedExcludeIds, totalStackPages } = await getHomepageFeaturedProperties();

//             setWide(wide);
//             setMini(mini);
//             setPages({ 0: stack });
//             fixedIdsRef.current = fixedExcludeIds;

//             // If we got a full page, assume there may be more
//             // if (stack.length === PAGE_SIZE) setTotalPages(2);
//             // else setTotalPages(1);
//             setTotalPages(totalStackPages);

//             setInitialLoading(false);
//         }
//         load();
//     }, []);

//     // ── Load a page on demand ──
//     const loadPage = async (pageIndex: number) => {
//         // Already cached
//         if (pages[pageIndex] !== undefined) {
//             triggerTransition(pageIndex);
//             return;
//         }

//         setLoadingPage(pageIndex);

//         // page 0 was the initial slice(4,7) — subsequent pages start at offset 3
//         // getStackPage page param maps to: page 1 → offset 3, page 2 → offset 6 …
//         const data = await getStackPage(pageIndex, fixedIdsRef.current, PAGE_SIZE);

//         setPages((prev) => ({ ...prev, [pageIndex]: data }));

//         // // If we got a full page and haven't hit the cap, unlock another dot
//         // if (data.length === PAGE_SIZE && pageIndex + 1 < MAX_PAGES) {
//         //     setTotalPages((prev) => Math.max(prev, pageIndex + 2));
//         // }

//         setLoadingPage(null);
//         triggerTransition(pageIndex);
//     };

//     // ── Fade transition ──
//     const triggerTransition = (targetPage: number) => {
//         setAnimating(true);
//         setFadeIn(false);
//         setTimeout(() => {
//             setCurrentPage(targetPage);
//             setFadeIn(true);
//             setAnimating(false);
//         }, 220);
//     };

//     const currentCards = pages[currentPage] ?? [];

//     // ── Section title ──────────────────────────────────────
//     const SectionTitle = () => (
//         <div className="container section-title" data-aos="fade-up">
//             <h2>Featured Properties</h2>
//             <p>Explore a curated selection of premium properties tailored to your lifestyle.</p>
//         </div>
//     );

//     // ── Loading state ──────────────────────────────────────
//     if (initialLoading) {
//         return (
//             <section id="featured-properties" className="featured-properties section">
//                 <SectionTitle />
//                 <div className="container" data-aos="fade-up" data-aos-delay="100">
//                     <div className="text-center py-5">
//                         <AppLoader />
//                     </div>
//                     <div className="row mt-5">
//                         <div className="col-12 d-flex justify-content-center">
//                             <Link
//                                 href="/properties"
//                                 className="btn custom-button px-4"
//                                 style={{ background: "var(--accent-color)" }}
//                             >
//                                 Explore More Properties
//                             </Link>
//                         </div>
//                     </div>
//                 </div>
//             </section>
//         );
//     }

//     // ── Main render ────────────────────────────────────────
//     return (
//         <section id="featured-properties" className="featured-properties section">
//             <SectionTitle />

//             <div className="container" data-aos="fade-up" data-aos-delay="100">

//                 {/* ── Fixed top: 1 wide + 3 mini ── */}
//                 <div className="grid-featured" data-aos="zoom-in" data-aos-delay="150">
//                     {wide && <PropertyCardVerticalWide key={wide.id} data={wide} />}
//                     <div className="mini-list">
//                         {mini.map((property) => (
//                             <PropertyCardHorizontal key={property.id} data={property} />
//                         ))}
//                     </div>
//                 </div>

//                 {/* ── Paginated stack ── */}
//                 <div style={{ position: "relative", minHeight: 320 }}>

//                     {/* Cards — fade in/out on page change */}
//                     <div
//                         className="row gy-4 mt-4"
//                         style={{
//                             transition: "opacity 0.22s ease, transform 0.22s ease",
//                             opacity: fadeIn ? 1 : 0,
//                             transform: fadeIn ? "translateY(0)" : "translateY(10px)",
//                             pointerEvents: animating ? "none" : "auto",
//                         }}
//                     >
//                         {currentCards.map((property) => (
//                             <PropertyCardVertical key={property.id} data={property} />
//                         ))}
//                     </div>

//                     {/* Per-page loading overlay */}
//                     {loadingPage !== null && (
//                         <div
//                             style={{
//                                 position: "absolute",
//                                 inset: 0,
//                                 display: "flex",
//                                 alignItems: "center",
//                                 justifyContent: "center",
//                                 background: "rgba(255,255,255,0.6)",
//                                 backdropFilter: "blur(2px)",
//                                 borderRadius: 8,
//                                 zIndex: 10,
//                             }}
//                         >
//                             <AppLoader />
//                         </div>
//                     )}
//                 </div>

//                 {/* ── Pagination dots ── */}
//                 {/* {totalPages > 1 && (
//                     <div
//                         style={{
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "center",
//                             gap: 10,
//                             marginTop: 28,
//                             marginBottom: 8,
//                         }}
//                     >
//                         {Array.from({ length: totalPages }).map((_, i) => {
//                             const isActive = i === currentPage;
//                             const isLoading = loadingPage === i;
//                             return (
//                                 <button
//                                     key={i}
//                                     onClick={() => !animating && loadingPage === null && loadPage(i)}
//                                     aria-label={`Page ${i + 1}`}
//                                     style={{
//                                         width: isActive ? 28 : 10,
//                                         height: 10,
//                                         borderRadius: 999,
//                                         border: "none",
//                                         cursor: isActive ? "default" : "pointer",
//                                         background: isActive
//                                             ? "var(--accent-color, #2c7a7b)"
//                                             : "rgba(0,0,0,0.18)",
//                                         transition: "width 0.3s ease, background 0.3s ease, transform 0.15s ease",
//                                         transform: isLoading ? "scale(1.3)" : "scale(1)",
//                                         padding: 0,
//                                         flexShrink: 0,
//                                         outline: "none",
//                                     }}
//                                 />
//                             );
//                         })}
//                     </div>
//                 )} */}

//                 {/* ── Pagination tabs ── */}
//                 {totalPages > 1 && (
//                     <div
//                         style={{
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "center",
//                             gap: 8,
//                             marginTop: 36,
//                             marginBottom: 8,
//                             flexWrap: "wrap",
//                         }}
//                     >
//                         {/* Prev arrow */}
//                         <button
//                             onClick={() => !animating && loadingPage === null && currentPage > 0 && loadPage(currentPage - 1)}
//                             disabled={currentPage === 0 || animating || loadingPage !== null}
//                             aria-label="Previous page"
//                             style={{
//                                 width: 40,
//                                 height: 40,
//                                 borderRadius: "50%",
//                                 border: "1.5px solid rgba(0,0,0,0.12)",
//                                 background: "transparent",
//                                 color: currentPage === 0 ? "rgba(0,0,0,0.25)" : "var(--accent-color, #2c7a7b)",
//                                 cursor: currentPage === 0 ? "not-allowed" : "pointer",
//                                 display: "flex",
//                                 alignItems: "center",
//                                 justifyContent: "center",
//                                 fontSize: "1rem",
//                                 transition: "all 0.2s ease",
//                                 flexShrink: 0,
//                             }}
//                         >
//                             <i className="bi bi-chevron-left" />
//                         </button>

//                         {/* Page number pills */}
//                         {/* {Array.from({ length: totalPages }).map((_, i) => {
//                             const isActive = i === currentPage;
//                             const isLoading = loadingPage === i;
//                             return (
//                                 <button
//                                     key={i}
//                                     onClick={() => !animating && loadingPage === null && !isActive && loadPage(i)}
//                                     aria-label={`Page ${i + 1}`}
//                                     style={{
//                                         minWidth: isActive ? 48 : 40,
//                                         height: 40,
//                                         borderRadius: 999,
//                                         border: isActive
//                                             ? "none"
//                                             : "1.5px solid rgba(0,0,0,0.12)",
//                                         cursor: isActive ? "default" : "pointer",
//                                         background: isActive
//                                             ? "var(--accent-color, #2c7a7b)"
//                                             : isLoading
//                                                 ? "rgba(44,122,123,0.08)"
//                                                 : "transparent",
//                                         color: isActive
//                                             ? "#fff"
//                                             : isLoading
//                                                 ? "var(--accent-color, #2c7a7b)"
//                                                 : "rgba(0,0,0,0.55)",
//                                         fontWeight: isActive ? 600 : 400,
//                                         fontSize: "0.92rem",
//                                         display: "flex",
//                                         alignItems: "center",
//                                         justifyContent: "center",
//                                         transition: "all 0.25s ease",
//                                         boxShadow: isActive
//                                             ? "0 4px 14px rgba(44,122,123,0.35)"
//                                             : "none",
//                                         transform: isActive ? "scale(1.05)" : "scale(1)",
//                                         padding: "0 14px",
//                                         flexShrink: 0,
//                                         outline: "none",
//                                     }}
//                                 >
//                                     {isLoading
//                                         ? <i className="bi bi-arrow-repeat" style={{ animation: "spin 0.7s linear infinite" }} />
//                                         : i + 1}
//                                 </button>
//                             );
//                         })} */}

//                         {/* Page number pills */}
//                         {(() => {
//                             const getVisiblePages = () => {
//                                 if (totalPages <= 7) {
//                                     return Array.from({ length: totalPages }, (_, i) => i);
//                                 }
//                                 const pages: (number | "...")[] = [];
//                                 // Always show first
//                                 pages.push(0);
//                                 if (currentPage > 2) pages.push("...");
//                                 // Show neighbours around current
//                                 for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages - 2, currentPage + 1); i++) {
//                                     pages.push(i);
//                                 }
//                                 if (currentPage < totalPages - 3) pages.push("...");
//                                 // Always show last
//                                 pages.push(totalPages - 1);
//                                 return pages;
//                             };

//                             return getVisiblePages().map((item, idx) => {
//                                 if (item === "...") {
//                                     return (
//                                         <span
//                                             key={`ellipsis-${idx}`}
//                                             style={{
//                                                 width: 40,
//                                                 height: 40,
//                                                 display: "flex",
//                                                 alignItems: "center",
//                                                 justifyContent: "center",
//                                                 color: "rgba(0,0,0,0.35)",
//                                                 fontSize: "1rem",
//                                                 letterSpacing: 1,
//                                                 flexShrink: 0,
//                                             }}
//                                         >
//                                             ···
//                                         </span>
//                                     );
//                                 }

//                                 const i = item as number;
//                                 const isActive = i === currentPage;
//                                 const isLoading = loadingPage === i;

//                                 return (
//                                     <button
//                                         key={i}
//                                         onClick={() => !animating && loadingPage === null && !isActive && loadPage(i)}
//                                         aria-label={`Page ${i + 1}`}
//                                         style={{
//                                             minWidth: isActive ? 48 : 40,
//                                             height: 40,
//                                             borderRadius: 999,
//                                             border: isActive ? "none" : "1.5px solid rgba(0,0,0,0.12)",
//                                             cursor: isActive ? "default" : "pointer",
//                                             background: isActive
//                                                 ? "var(--accent-color, #2c7a7b)"
//                                                 : isLoading
//                                                     ? "rgba(44,122,123,0.08)"
//                                                     : "transparent",
//                                             color: isActive ? "#fff" : isLoading ? "var(--accent-color, #2c7a7b)" : "rgba(0,0,0,0.55)",
//                                             fontWeight: isActive ? 600 : 400,
//                                             fontSize: "0.92rem",
//                                             display: "flex",
//                                             alignItems: "center",
//                                             justifyContent: "center",
//                                             transition: "all 0.25s ease",
//                                             boxShadow: isActive ? "0 4px 14px rgba(44,122,123,0.35)" : "none",
//                                             transform: isActive ? "scale(1.05)" : "scale(1)",
//                                             padding: "0 14px",
//                                             flexShrink: 0,
//                                             outline: "none",
//                                         }}
//                                     >
//                                         {isLoading
//                                             ? <i className="bi bi-arrow-repeat" style={{ animation: "spin 0.7s linear infinite" }} />
//                                             : i + 1}
//                                     </button>
//                                 );
//                             });
//                         })()}

//                         {/* Next arrow */}
//                         <button
//                             onClick={() => !animating && loadingPage === null && currentPage < totalPages - 1 && loadPage(currentPage + 1)}
//                             disabled={currentPage === totalPages - 1 || animating || loadingPage !== null}
//                             aria-label="Next page"
//                             style={{
//                                 width: 40,
//                                 height: 40,
//                                 borderRadius: "50%",
//                                 border: "1.5px solid rgba(0,0,0,0.12)",
//                                 background: "transparent",
//                                 color: currentPage === totalPages - 1 ? "rgba(0,0,0,0.25)" : "var(--accent-color, #2c7a7b)",
//                                 cursor: currentPage === totalPages - 1 ? "not-allowed" : "pointer",
//                                 display: "flex",
//                                 alignItems: "center",
//                                 justifyContent: "center",
//                                 fontSize: "1rem",
//                                 transition: "all 0.2s ease",
//                                 flexShrink: 0,
//                             }}
//                         >
//                             <i className="bi bi-chevron-right" />
//                         </button>
//                     </div>
//                 )}

//                 {/* ── Explore button ── */}
//                 <div className="row mt-4">
//                     <div className="col-12 d-flex justify-content-center">
//                         <Link
//                             href="/properties"
//                             className="btn custom-button px-4"
//                             style={{ background: "var(--accent-color)" }}
//                         >
//                             <i className="bi bi-house-door me-2" />
//                             Explore More Properties
//                         </Link>
//                     </div>
//                 </div>

//             </div>
//         </section>
//     );
// }






// "use client";

// import PropertyCardHorizontal from "@/components/property/PropertyCard/PropertyCardHorizontal";
// import PropertyCardVertical from "@/components/property/PropertyCard/PropertyCardVertical";
// import PropertyCardVerticalWide from "@/components/property/PropertyCard/PropertyCardVerticalWide";
// import Link from "next/link";
// import { useEffect, useRef, useState } from "react";
// import { getHomepageFeaturedProperties, getStackPage, getFilteredStackCount } from "@/services/FeaturedPropertiesService";
// import { PropertyData } from "@/types/property";
// import AppLoader from "@/components/ui/AppLoader/AppLoader";


// const PAGE_SIZE = 3;

// type FilterType = "All" | "For Sale" | "For Rent";

// const FILTERS: FilterType[] = ["All", "For Sale", "For Rent"];

// const FILTER_ICONS: Record<FilterType, string> = {
//   "All":      "bi-grid-3x3-gap",
//   "For Sale": "bi-tag",
//   "For Rent": "bi-key",
// };

// export default function Properties() {
//   // ── Fixed section ──
//   const [wide, setWide] = useState<PropertyData | null>(null);
//   const [mini, setMini] = useState<PropertyData[]>([]);

//   // ── Paginated stack ──
//   const [pages, setPages]             = useState<Record<number, PropertyData[]>>({});
//   const [currentPage, setCurrentPage] = useState(0);
//   const [totalPages, setTotalPages]   = useState(1);
//   const [loadingPage, setLoadingPage] = useState<number | null>(null);
//   const [animating, setAnimating]     = useState(false);
//   const [fadeIn, setFadeIn]           = useState(true);

//   // ── Filter ──
//   const [activeFilter, setActiveFilter] = useState<FilterType>("All");
//   const [filterAnimating, setFilterAnimating] = useState(false);

//   const fixedIdsRef      = useRef<string[]>([]);
//   const [initialLoading, setInitialLoading] = useState(true);

//   const [filteredTotalPages, setFilteredTotalPages] = useState<number | null>(null);


//   // ── Initial fetch ──
//   useEffect(() => {
//     async function load() {
//       setInitialLoading(true);
//       const { wide, mini, stack, fixedExcludeIds, totalStackPages } =
//         await getHomepageFeaturedProperties();
//       setWide(wide);
//       setMini(mini);
//       setPages({ 0: stack });
//       fixedIdsRef.current = fixedExcludeIds;
//       setTotalPages(totalStackPages);
//       setInitialLoading(false);
//     }
//     load();
//   }, []);

//   // ── Load a page on demand ──
//   const loadPage = async (pageIndex: number) => {
//     if (pages[pageIndex] !== undefined) {
//       triggerTransition(pageIndex);
//       return;
//     }
//     setLoadingPage(pageIndex);
//     const data = await getStackPage(pageIndex, fixedIdsRef.current, PAGE_SIZE);
//     setPages((prev) => ({ ...prev, [pageIndex]: data }));
//     setLoadingPage(null);
//     triggerTransition(pageIndex);
//   };

//   const triggerTransition = (targetPage: number) => {
//     setAnimating(true);
//     setFadeIn(false);
//     setTimeout(() => {
//       setCurrentPage(targetPage);
//       setFadeIn(true);
//       setAnimating(false);
//     }, 220);
//   };

//   // ── Filter change with mini fade ──
// //   const handleFilterChange = (f: FilterType) => {
// //     if (f === activeFilter) return;
// //     setFilterAnimating(true);
// //     setTimeout(() => {
// //       setActiveFilter(f);
// //       setFilterAnimating(false);
// //     }, 180);
// //   };
// const handleFilterChange = async (f: FilterType) => {
//   if (f === activeFilter) return;

//   // reset to page 0 immediately
//   setCurrentPage(0);
//   setFilterAnimating(true);

//   if (f === "All") {
//     setFilteredTotalPages(null); // go back to unfiltered total
//   } else {
//     // fetch count for this filter from DB
//     const count = await getFilteredStackCount(f, fixedIdsRef.current);
//     setFilteredTotalPages(Math.max(1, Math.ceil(count / PAGE_SIZE)));
//   }

//   setTimeout(() => {
//     setActiveFilter(f);
//     setFilterAnimating(false);
//   }, 180);
// };

//   // ── Filter cards client-side (no extra fetch) ──
//   const rawCards     = pages[currentPage] ?? [];
//   const currentCards = activeFilter === "All"
//     ? rawCards
//     : rawCards.filter((p) => p.status?.includes(activeFilter));

//   // ── Smart pagination ──
//   const getVisiblePages = (): (number | "...")[] => {
//     if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i);
//     const result: (number | "...")[] = [];
//     result.push(0);
//     if (currentPage > 2) result.push("...");
//     for (
//       let i = Math.max(1, currentPage - 1);
//       i <= Math.min(totalPages - 2, currentPage + 1);
//       i++
//     ) result.push(i);
//     if (currentPage < totalPages - 3) result.push("...");
//     result.push(totalPages - 1);
//     return result;
//   };

//   // ─────────────────────────────────────────────────────────
//   const SectionTitle = () => (
//     <div className="container section-title" data-aos="fade-up">
//       <h2>Featured Properties</h2>
//       <p>Explore a curated selection of premium properties tailored to your lifestyle.</p>
//     </div>
//   );

//   if (initialLoading) {
//     return (
//       <section id="featured-properties" className="featured-properties section">
//         <SectionTitle />
//         <div className="container" data-aos="fade-up" data-aos-delay="100">
//           <div className="text-center py-5"><AppLoader /></div>
//           <div className="row mt-5">
//             <div className="col-12 d-flex justify-content-center">
//               <Link href="/properties" className="btn custom-button px-4"
//                 style={{ background: "var(--accent-color)" }}>
//                 Explore More Properties
//               </Link>
//             </div>
//           </div>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section id="featured-properties" className="featured-properties section">
//       <SectionTitle />

//       <div className="container" data-aos="fade-up" data-aos-delay="100">

//         {/* ── Fixed: wide + mini ── */}
//         <div className="grid-featured" data-aos="zoom-in" data-aos-delay="150">
//           {wide && <PropertyCardVerticalWide key={wide.id} data={wide} />}
//           <div className="mini-list">
//             {mini.map((p) => <PropertyCardHorizontal key={p.id} data={p} />)}
//           </div>
//         </div>

//         {/* ════════════════════════════════════════════════════
//             FILTER CHIPS
//         ════════════════════════════════════════════════════ */}
//         <div style={{
//           display: "flex", alignItems: "center", justifyContent: "center",
//           gap: 10, marginTop: 52, marginBottom: 4, flexWrap: "wrap",
//         }}>
//           {FILTERS.map((f) => {
//             const isActive = f === activeFilter;
//             return (
//               <button
//                 key={f}
//                 onClick={() => handleFilterChange(f)}
//                 style={{
//                   display:       "inline-flex",
//                   alignItems:    "center",
//                   gap:           7,
//                   padding:       "10px 22px",
//                   borderRadius:  999,
//                   border:        isActive ? "none" : "1.5px solid rgba(0,0,0,0.13)",
//                   background:    isActive ? "var(--accent-color, #2c7a7b)" : "transparent",
//                   color:         isActive ? "#fff" : "rgba(0,0,0,0.52)",
//                   fontWeight:    isActive ? 600 : 400,
//                   fontSize:      "0.9rem",
//                   cursor:        isActive ? "default" : "pointer",
//                   boxShadow:     isActive ? "0 6px 18px rgba(44,122,123,0.28)" : "none",
//                   transform:     isActive ? "translateY(-1px)" : "translateY(0)",
//                   transition:    "all 0.22s ease",
//                   outline:       "none",
//                   letterSpacing: "0.01em",
//                   whiteSpace:    "nowrap",
//                 }}
//               >
//                 <i
//                   className={`bi ${FILTER_ICONS[f]}`}
//                   style={{ fontSize: "0.85rem", opacity: isActive ? 1 : 0.65 }}
//                 />
//                 {f}
//               </button>
//             );
//           })}
//         </div>

//         {/* divider under chips */}
//         <div style={{
//           height: 1, background: "rgba(0,0,0,0.06)",
//           borderRadius: 1, margin: "16px 0 0",
//         }} />

//         {/* ════════════════════════════════════════════════════
//             PAGINATED STACK CARDS
//         ════════════════════════════════════════════════════ */}
//         <div style={{ position: "relative", minHeight: 320 }}>
//           <div
//             className="row gy-4 mt-4"
//             style={{
//               transition:    "opacity 0.22s ease, transform 0.22s ease",
//               opacity:       (fadeIn && !filterAnimating) ? 1 : 0,
//               transform:     (fadeIn && !filterAnimating) ? "translateY(0)" : "translateY(10px)",
//               pointerEvents: (animating || filterAnimating) ? "none" : "auto",
//             }}
//           >
//             {currentCards.length > 0
//               ? currentCards.map((p) => <PropertyCardVertical key={p.id} data={p} />)
//               : (
//                 <div style={{
//                   width: "100%", textAlign: "center",
//                   padding: "48px 24px", color: "rgba(0,0,0,0.38)",
//                 }}>
//                   <i className="bi bi-house-slash" style={{
//                     fontSize: "2.5rem", display: "block", marginBottom: 12,
//                   }} />
//                   <p style={{ margin: 0, fontSize: "0.95rem" }}>
//                     No <strong>{activeFilter}</strong> properties on this page.
//                     <br />Try another page or{" "}
//                     <button
//                       onClick={() => setActiveFilter("All")}
//                       style={{
//                         background: "none", border: "none", padding: 0,
//                         color: "var(--accent-color, #2c7a7b)", cursor: "pointer",
//                         fontWeight: 600, fontSize: "inherit", textDecoration: "underline",
//                       }}
//                     >
//                       view all
//                     </button>.
//                   </p>
//                 </div>
//               )
//             }
//           </div>

//           {/* Loading overlay */}
//           {loadingPage !== null && (
//             <div style={{
//               position: "absolute", inset: 0,
//               display: "flex", alignItems: "center", justifyContent: "center",
//               background: "rgba(255,255,255,0.6)",
//               backdropFilter: "blur(2px)", borderRadius: 8, zIndex: 10,
//             }}>
//               <AppLoader />
//             </div>
//           )}
//         </div>

//         {/* ════════════════════════════════════════════════════
//             SMART PAGINATION
//         ════════════════════════════════════════════════════ */}
//         {/* {totalPages > 1 && ( */}
//         {(filteredTotalPages ?? totalPages) > 1 && (
//           <div style={{
//             display: "flex", alignItems: "center", justifyContent: "center",
//             gap: 8, marginTop: 36, marginBottom: 8, flexWrap: "wrap",
//           }}>

//             {/* Prev */}
//             <button
//               onClick={() => !animating && loadingPage === null && currentPage > 0 && loadPage(currentPage - 1)}
//               disabled={currentPage === 0 || animating || loadingPage !== null}
//               aria-label="Previous page"
//               style={{
//                 width: 40, height: 40, borderRadius: "50%",
//                 border: "1.5px solid rgba(0,0,0,0.12)", background: "transparent",
//                 color: currentPage === 0 ? "rgba(0,0,0,0.25)" : "var(--accent-color, #2c7a7b)",
//                 cursor: currentPage === 0 ? "not-allowed" : "pointer",
//                 display: "flex", alignItems: "center", justifyContent: "center",
//                 fontSize: "1rem", transition: "all 0.2s ease", flexShrink: 0,
//               }}
//             >
//               <i className="bi bi-chevron-left" />
//             </button>

//             {/* Page pills */}
//             {getVisiblePages().map((item, idx) => {
//               if (item === "...") {
//                 return (
//                   <span key={`e-${idx}`} style={{
//                     width: 40, height: 40, display: "flex",
//                     alignItems: "center", justifyContent: "center",
//                     color: "rgba(0,0,0,0.35)", fontSize: "1rem",
//                     letterSpacing: 1, flexShrink: 0,
//                   }}>···</span>
//                 );
//               }
//               const i        = item as number;
//               const isActive  = i === currentPage;
//               const isLoading = loadingPage === i;
//               return (
//                 <button
//                   key={i}
//                   onClick={() => !animating && loadingPage === null && !isActive && loadPage(i)}
//                   aria-label={`Page ${i + 1}`}
//                   style={{
//                     minWidth:       isActive ? 48 : 40,
//                     height:         40,
//                     borderRadius:   999,
//                     border:         isActive ? "none" : "1.5px solid rgba(0,0,0,0.12)",
//                     cursor:         isActive ? "default" : "pointer",
//                     background:     isActive
//                       ? "var(--accent-color, #2c7a7b)"
//                       : isLoading ? "rgba(44,122,123,0.08)" : "transparent",
//                     color:          isActive ? "#fff"
//                       : isLoading ? "var(--accent-color, #2c7a7b)" : "rgba(0,0,0,0.55)",
//                     fontWeight:     isActive ? 600 : 400,
//                     fontSize:       "0.92rem",
//                     display:        "flex", alignItems: "center", justifyContent: "center",
//                     transition:     "all 0.25s ease",
//                     boxShadow:      isActive ? "0 4px 14px rgba(44,122,123,0.35)" : "none",
//                     transform:      isActive ? "scale(1.05)" : "scale(1)",
//                     padding:        "0 14px",
//                     flexShrink:     0, outline: "none",
//                   }}
//                 >
//                   {isLoading
//                     ? <i className="bi bi-arrow-repeat" style={{ animation: "spin 0.7s linear infinite" }} />
//                     : i + 1}
//                 </button>
//               );
//             })}

//             {/* Next */}
//             <button
//               onClick={() => !animating && loadingPage === null && currentPage < totalPages - 1 && loadPage(currentPage + 1)}
//               disabled={currentPage === totalPages - 1 || animating || loadingPage !== null}
//               aria-label="Next page"
//               style={{
//                 width: 40, height: 40, borderRadius: "50%",
//                 border: "1.5px solid rgba(0,0,0,0.12)", background: "transparent",
//                 color: currentPage === totalPages - 1 ? "rgba(0,0,0,0.25)" : "var(--accent-color, #2c7a7b)",
//                 cursor: currentPage === totalPages - 1 ? "not-allowed" : "pointer",
//                 display: "flex", alignItems: "center", justifyContent: "center",
//                 fontSize: "1rem", transition: "all 0.2s ease", flexShrink: 0,
//               }}
//             >
//               <i className="bi bi-chevron-right" />
//             </button>

//           </div>
//         )}

//         {/* ── Explore button ── */}
//         <div className="row mt-4">
//           <div className="col-12 d-flex justify-content-center">
//             <Link href="/properties" className="btn custom-button px-4"
//               style={{ background: "var(--accent-color)" }}>
//               <i className="bi bi-house-door me-2" />
//               Explore More Properties
//             </Link>
//           </div>
//         </div>

//       </div>
//     </section>
//   );
// }







"use client";

import PropertyCardHorizontal from "@/components/property/PropertyCard/PropertyCardHorizontal";
import PropertyCardVertical from "@/components/property/PropertyCard/PropertyCardVertical";
import PropertyCardVerticalWide from "@/components/property/PropertyCard/PropertyCardVerticalWide";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { getHomepageFeaturedProperties, getStackPage } from "@/services/FeaturedPropertiesService";
import { PropertyData } from "@/types/property";
import AppLoader from "@/components/ui/AppLoader/AppLoader";
import "./css/Properties.css";

type FilterType = "All" | "For Sale" | "For Rent";
const FILTERS: FilterType[] = ["All", "For Sale", "For Rent"];
const FILTER_ICONS: Record<FilterType, string> = {
    "All": "bi-grid-3x3-gap",
    "For Sale": "bi-tag",
    "For Rent": "bi-key",
};

// Cache key = `${filter}:${page}`
type PageCache = Record<string, PropertyData[]>;

// ─────────────────────────────────────────────────────
const SectionTitle = () => (
    <div className="container section-title" data-aos="fade-up">
        <h2>Featured Properties</h2>
        <p>Explore a curated selection of premium properties tailored to your lifestyle.</p>
    </div>
);

export default function Properties() {
    // ── Fixed section ──
    const [wide, setWide] = useState<PropertyData | null>(null);
    const [mini, setMini] = useState<PropertyData[]>([]);

    // ── Pagination state ──
    const [cache, setCache] = useState<PageCache>({});
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState<Record<FilterType, number>>({
        "All": 1, "For Sale": 1, "For Rent": 1,
    });
    const [loadingPage, setLoadingPage] = useState(false);
    const [animating, setAnimating] = useState(false);
    const [fadeIn, setFadeIn] = useState(true);

    // ── Filter ──
    const [activeFilter, setActiveFilter] = useState<FilterType>("All");

    const fixedIdsRef = useRef<string[]>([]);
    const [initialLoading, setInitialLoading] = useState(true);

    // ── Initial fetch ──
    useEffect(() => {
        async function load() {
            setInitialLoading(true);
            const { wide, mini, stack, fixedExcludeIds, totalStackPages } =
                await getHomepageFeaturedProperties();

            setWide(wide);
            setMini(mini);
            fixedIdsRef.current = fixedExcludeIds;

            // Seed page 0 for "All" from the initial fetch
            setCache({ "All:0": stack });
            setTotalPages((prev) => ({ ...prev, "All": totalStackPages }));
            setInitialLoading(false);
        }
        load();
    }, []);

    // ── Core fetch: one page, one filter, SQL does the work ──
    const fetchPage = async (filter: FilterType, page: number) => {
        const key = `${filter}:${page}`;
        if (cache[key]) return cache[key]; // already cached

        const sqlFilter = filter === "All" ? undefined : filter as "For Sale" | "For Rent";
        const { data, total } = await getStackPage(page, fixedIdsRef.current, sqlFilter);

        // Update cache and total pages for this filter
        const pages = Math.max(1, Math.ceil(total / 3));
        setCache((prev) => ({ ...prev, [key]: data }));
        setTotalPages((prev) => ({ ...prev, [filter]: pages }));

        return data;
    };

    // ── Navigate to page (same filter) ──
    const goToPage = async (page: number) => {
        setLoadingPage(true);
        await fetchPage(activeFilter, page);
        setLoadingPage(false);
        triggerTransition(page);
    };

    // ── Switch filter → reset to page 0, fetch if not cached ──
    const handleFilterChange = async (f: FilterType) => {
        if (f === activeFilter) return;

        // Optimistic UI: switch filter label immediately, fade cards
        setAnimating(true);
        setFadeIn(false);
        setActiveFilter(f);
        setCurrentPage(0);

        const key = `${f}:0`;
        if (!cache[key]) {
            setLoadingPage(true);
            await fetchPage(f, 0);
            setLoadingPage(false);
        }

        setTimeout(() => {
            setFadeIn(true);
            setAnimating(false);
        }, 220);
    };

    const triggerTransition = (targetPage: number) => {
        setAnimating(true);
        setFadeIn(false);
        setTimeout(() => {
            setCurrentPage(targetPage);
            setFadeIn(true);
            setAnimating(false);
        }, 220);
    };

    // ── Derived ──
    const currentCards = cache[`${activeFilter}:${currentPage}`] ?? [];
    const currentTotalPages = totalPages[activeFilter];

    // ── Smart pagination ──
    const getVisiblePages = (): (number | "...")[] => {
        if (currentTotalPages <= 7)
            return Array.from({ length: currentTotalPages }, (_, i) => i);
        const result: (number | "...")[] = [];
        result.push(0);
        if (currentPage > 2) result.push("...");
        for (
            let i = Math.max(1, currentPage - 1);
            i <= Math.min(currentTotalPages - 2, currentPage + 1);
            i++
        ) result.push(i);
        if (currentPage < currentTotalPages - 3) result.push("...");
        result.push(currentTotalPages - 1);
        return result;
    };

    //   // ─────────────────────────────────────────────────────
    //   const SectionTitle = () => (
    //     <div className="container section-title" data-aos="fade-up">
    //       <h2>Featured Properties</h2>
    //       <p>Explore a curated selection of premium properties tailored to your lifestyle.</p>
    //     </div>
    //   );

    if (initialLoading) {
        return (
            <section id="featured-properties" className="featured-properties section">
                <SectionTitle />
                <div className="container" data-aos="fade-up" data-aos-delay="100">
                    <div className="text-center py-5"><AppLoader /></div>
                    <div className="row mt-5">
                        <div className="col-12 d-flex justify-content-center">
                            <Link href="/properties" className="btn custom-button px-4"
                                style={{ background: "var(--accent-color)" }}>
                                Explore More Properties
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="featured-properties" className="featured-properties section">
            <SectionTitle />

            <div className="container" data-aos="fade-up" data-aos-delay="100">

                {/* ── Fixed: wide + mini ── */}
                <div className="grid-featured" data-aos="zoom-in" data-aos-delay="150">
                    {wide && <PropertyCardVerticalWide key={wide.id} data={wide} priority={(wide.priority ? wide.priority : 0) > 0} />}
                    <div className="mini-list">
                        {mini.map((p) => <PropertyCardHorizontal key={p.id} data={p} priority={(p.priority ? p.priority : 0) > 0} />)}
                    </div>
                </div>

                {/* ════════════════════════════════════════
            FILTER CHIPS
        ════════════════════════════════════════ */}
                <div style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    gap: 10, marginTop: 52, marginBottom: 4, flexWrap: "wrap",
                }}>
                    {FILTERS.map((f) => {
                        const isActive = f === activeFilter;
                        return (
                            <button
                                key={f}
                                onClick={() => !loadingPage && handleFilterChange(f)}
                                disabled={loadingPage}
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 7,
                                    padding: "10px 22px",
                                    borderRadius: 999,
                                    border: isActive ? "none" : "1.5px solid rgba(0,0,0,0.13)",
                                    background: isActive ? "var(--accent-color, #2c7a7b)" : "transparent",
                                    color: isActive ? "#fff" : "rgba(0,0,0,0.52)",
                                    fontWeight: isActive ? 600 : 400,
                                    fontSize: "0.9rem",
                                    cursor: loadingPage ? "wait" : isActive ? "default" : "pointer",
                                    boxShadow: isActive ? "0 6px 18px rgba(44,122,123,0.28)" : "none",
                                    transform: isActive ? "translateY(-1px)" : "translateY(0)",
                                    transition: "all 0.22s ease",
                                    outline: "none",
                                    letterSpacing: "0.01em",
                                    whiteSpace: "nowrap",
                                    opacity: loadingPage && !isActive ? 0.5 : 1,
                                }}
                            >
                                <i
                                    className={`bi ${FILTER_ICONS[f]}`}
                                    style={{ fontSize: "0.85rem", opacity: isActive ? 1 : 0.65 }}
                                />
                                {f}
                            </button>
                        );
                    })}
                </div>

                {/* divider */}
                <div style={{
                    height: 1, background: "rgba(0,0,0,0.06)",
                    borderRadius: 1, margin: "16px 0 0",
                }} />

                {/* ════════════════════════════════════════
            PAGINATED STACK CARDS
        ════════════════════════════════════════ */}
                <div style={{ position: "relative", minHeight: 320 }}>
                    <div
                        className="row gy-4 mt-4"
                        style={{
                            transition: "opacity 0.22s ease, transform 0.22s ease",
                            opacity: fadeIn ? 1 : 0,
                            transform: fadeIn ? "translateY(0)" : "translateY(10px)",
                            pointerEvents: animating ? "none" : "auto",
                        }}
                    >
                        {currentCards.length > 0
                            ? currentCards.map((p) => <PropertyCardVertical key={p.id} data={p} />)
                            : !loadingPage && (
                                <div style={{
                                    width: "100%", textAlign: "center",
                                    padding: "48px 24px", color: "rgba(0,0,0,0.38)",
                                }}>
                                    <i className="bi bi-house-slash" style={{
                                        fontSize: "2.5rem", display: "block", marginBottom: 12,
                                    }} />
                                    <p style={{ margin: 0, fontSize: "0.95rem" }}>
                                        No <strong>{activeFilter}</strong> properties found.
                                        <br />
                                        <button
                                            onClick={() => handleFilterChange("All")}
                                            style={{
                                                background: "none", border: "none", padding: 0,
                                                color: "var(--accent-color, #2c7a7b)", cursor: "pointer",
                                                fontWeight: 600, fontSize: "inherit", textDecoration: "underline",
                                            }}
                                        >
                                            View all properties
                                        </button>
                                    </p>
                                </div>
                            )
                        }
                    </div>

                    {/* Loading overlay */}
                    {loadingPage && (
                        <div style={{
                            position: "absolute", inset: 0,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            background: "rgba(255,255,255,0.65)",
                            backdropFilter: "blur(3px)", borderRadius: 8, zIndex: 10,
                        }}>
                            <AppLoader />
                        </div>
                    )}
                </div>

                {/* ════════════════════════════════════════
            SMART PAGINATION
        ════════════════════════════════════════ */}
                {currentTotalPages > 1 && (
                    <div style={{
                        display: "flex", alignItems: "center", justifyContent: "center",
                        gap: 8, marginTop: 36, marginBottom: 8, flexWrap: "wrap",
                    }}>

                        {/* Prev */}
                        <button
                            onClick={() => !animating && !loadingPage && currentPage > 0 && goToPage(currentPage - 1)}
                            disabled={currentPage === 0 || animating || !!loadingPage}
                            aria-label="Previous page"
                            style={{
                                width: 40, height: 40, borderRadius: "50%",
                                border: "1.5px solid rgba(0,0,0,0.12)", background: "transparent",
                                color: currentPage === 0 ? "rgba(0,0,0,0.25)" : "var(--accent-color, #2c7a7b)",
                                cursor: currentPage === 0 ? "not-allowed" : "pointer",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: "1rem", transition: "all 0.2s ease", flexShrink: 0,
                            }}
                        >
                            <i className="bi bi-chevron-left" />
                        </button>

                        {/* Smart page numbers */}
                        {getVisiblePages().map((item, idx) => {
                            if (item === "...") {
                                return (
                                    <span key={`e-${idx}`} style={{
                                        width: 40, height: 40, display: "flex",
                                        alignItems: "center", justifyContent: "center",
                                        color: "rgba(0,0,0,0.35)", fontSize: "1rem",
                                        letterSpacing: 1, flexShrink: 0,
                                    }}>···</span>
                                );
                            }
                            const i = item as number;
                            const isActive = i === currentPage;
                            return (
                                <button
                                    key={i}
                                    onClick={() => !animating && !loadingPage && !isActive && goToPage(i)}
                                    aria-label={`Page ${i + 1}`}
                                    style={{
                                        minWidth: isActive ? 48 : 40,
                                        height: 40,
                                        borderRadius: 999,
                                        border: isActive ? "none" : "1.5px solid rgba(0,0,0,0.12)",
                                        cursor: isActive ? "default" : "pointer",
                                        background: isActive ? "var(--accent-color, #2c7a7b)" : "transparent",
                                        color: isActive ? "#fff" : "rgba(0,0,0,0.55)",
                                        fontWeight: isActive ? 600 : 400,
                                        fontSize: "0.92rem",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        transition: "all 0.25s ease",
                                        boxShadow: isActive ? "0 4px 14px rgba(44,122,123,0.35)" : "none",
                                        transform: isActive ? "scale(1.05)" : "scale(1)",
                                        padding: "0 14px",
                                        flexShrink: 0, outline: "none",
                                    }}
                                >
                                    {i + 1}
                                </button>
                            );
                        })}

                        {/* Next */}
                        <button
                            onClick={() => !animating && !loadingPage && currentPage < currentTotalPages - 1 && goToPage(currentPage + 1)}
                            disabled={currentPage === currentTotalPages - 1 || animating || !!loadingPage}
                            aria-label="Next page"
                            style={{
                                width: 40, height: 40, borderRadius: "50%",
                                border: "1.5px solid rgba(0,0,0,0.12)", background: "transparent",
                                color: currentPage === currentTotalPages - 1 ? "rgba(0,0,0,0.25)" : "var(--accent-color, #2c7a7b)",
                                cursor: currentPage === currentTotalPages - 1 ? "not-allowed" : "pointer",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: "1rem", transition: "all 0.2s ease", flexShrink: 0,
                            }}
                        >
                            <i className="bi bi-chevron-right" />
                        </button>

                    </div>
                )}

                {/* ── Explore button ── */}
                <div className="row mt-4">
                    <div className="col-12 d-flex justify-content-center">
                        <Link href="/properties" className="btn custom-button px-4"
                            style={{ background: "var(--accent-color)" }}>
                            <i className="bi bi-house-door me-2" />
                            Explore More Properties
                        </Link>
                    </div>
                </div>

            </div>
        </section>
    );
}
