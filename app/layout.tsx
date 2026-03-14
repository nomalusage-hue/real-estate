import type { Metadata } from "next";
import { Roboto, Montserrat, Raleway } from "next/font/google";
import "./globals.css";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import AOSWrapper from "@/components/layout/AOSWrapper";
import NoSSRWrapper from "@/components/layout/NoSSRWrapper";
import Scripts from "@/components/layout/Scripts";
import ScrollToTop from "@/components/layout/ScrollToTop";
import GuestTracker from "@/components/tracking/GuestTracker";
import SessionTracker from "@/components/tracking/SessionTracker";

// Fonts
const roboto = Roboto({ subsets: ["latin"], weight: ["100", "300", "400", "500", "700", "900"], variable: "--font-roboto" });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"], variable: "--font-montserrat" });
const raleway = Raleway({ subsets: ["latin"], weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"], variable: "--font-raleway" });


const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),

  title:
    "Luxury Villas for Sale & Rent in Bali | Dian Rebecca Estates",

  description:
    "Discover exclusive luxury villas, beachfront homes, apartments, and land for sale and rent in Bali, Indonesia. Dian Rebecca Estates specializes in high-end real estate across Canggu, Uluwatu, Seminyak, and prime Bali locations.",

  keywords: [
    "Dian Rebecca Estates",
    "Luxury villas in Bali",
    "Bali real estate agency",
    "Premium Bali properties",
  ],

  alternates: {
    canonical: baseUrl,
  },

  openGraph: {
    type: "website",
    url: baseUrl,
    title: "Luxury Villas for Sale & Rent in Bali | Dian Rebecca Estates",
    description: "Explore premium villas, apartments, and land for sale and rent with Dian Rebecca Estates in Bali’s most exclusive locations.",
    images: [
      {
        url: `${baseUrl}/og/cover.jpg`,
        width: 1200,
        height: 630,
        alt: "Luxury villa in Bali with private pool | Dian Rebecca Estates",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Luxury Villas for Sale & Rent in Bali | Dian Rebecca Estates",
    description: "Explore premium villas and investment properties across Bali with Dian Rebecca Estates.",
    images: [`${baseUrl}/og/cover.jpg`],
  },

  icons: {
    icon: [
      { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-48.png", sizes: "48x48", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${roboto.variable} ${montserrat.variable} ${raleway.variable}`}>
      <head />
      <body className="index-page">

        <SessionTracker />
        <GuestTracker />
        
        <Header />
        <AOSWrapper>
          <NoSSRWrapper>
            <ScrollToTop>
              {children}
            </ScrollToTop>
            <Footer />
          </NoSSRWrapper>
        </AOSWrapper>

        <a href="#" id="scroll-top" className="scroll-top d-flex align-items-center justify-content-center">
          <i className="bi bi-arrow-up-short"></i>
        </a>

        <Scripts />
      </body>
    </html>
  );
}