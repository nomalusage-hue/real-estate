import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = {
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/properties/new',
        permanent: true,
      },
    ]
  }
}

export default nextConfig;






// // next.config.js
// const nextConfig = {
//   async rewrites() {
//     return [
//       {
//         source: "/__/auth/:path*",
//         destination: "https://realestates-eec2e.firebaseapp.com/:path*",
//       },
//       {
//         source: "/__/firebase/:path*",
//         destination: "https://realestates-eec2e.firebaseapp.com/:path*",
//       },
//     ];
//   },
// };

// export default nextConfig;
