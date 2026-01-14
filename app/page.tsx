"use client";

import Hero from "@/components/sections/home/Hero";
import About from "@/components/sections/home/About";
import Properties from "@/components/sections/home/Properties";

// import dynamic from "next/dynamic";

// const Hero = dynamic(() => import("@/components/sections/home/Hero"), {
//   ssr: false,
// });
// const About = dynamic(() => import("@/components/sections/home/About"), {
//   ssr: false,
// });
// const Properties = dynamic(() => import("@/components/sections/home/Properties"), {
//   ssr: false,
// });


export default function Home() {
  return <>

  <main className="main">
    <Hero></Hero>
    <About></About>
    <Properties></Properties>
  </main>

  {/* <a href="#" id="scroll-top" className="scroll-top d-flex align-items-center justify-content-center"><i className="bi bi-arrow-up-short"></i></a> */}
  
  {/* <!-- Preloader --> */}
  {/* <div id="preloader"></div> */}

  </>;
}