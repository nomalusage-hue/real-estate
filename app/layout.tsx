import type { Metadata } from "next";
import { Roboto, Montserrat, Raleway } from "next/font/google";
import "./globals.css";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import AOSWrapper from "@/components/layout/AOSWrapper";
import NoSSRWrapper from "@/components/layout/NoSSRWrapper";
import Scripts from "@/components/layout/Scripts";
import ScrollToTop from "@/components/layout/ScrollToTop";
import { SITE } from "@/src/config/site";

// Fonts
const roboto = Roboto({ subsets: ["latin"], weight: ["100", "300", "400", "500", "700", "900"], variable: "--font-roboto" });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"], variable: "--font-montserrat" });
const raleway = Raleway({ subsets: ["latin"], weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"], variable: "--font-raleway" });


export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  ),

  title: {
    default: `${process.env.NEXT_PUBLIC_FOUNDER_NAME} Properties | Premium Real Estate`,
    template: `%s | ${process.env.NEXT_PUBLIC_FOUNDER_NAME} Properties`,
  },

  description:
    "Discover premium properties for sale and rent. Trusted real estate experts delivering value and quality.",

  openGraph: {
    type: "website",
    siteName: `${process.env.NEXT_PUBLIC_FOUNDER_NAME} Properties`,
    title: `${process.env.NEXT_PUBLIC_FOUNDER_NAME} Properties | Premium Real Estate`,
    description:
      "Discover premium properties for sale and rent. Trusted real estate experts delivering value and quality.",
    images: [
      {
        url: "/og/cover.png",
        width: 1200,
        height: 630,
        alt: `${process.env.NEXT_PUBLIC_FOUNDER_NAME} Properties`,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    images: ["/og/cover.png"],
  },

  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${roboto.variable} ${montserrat.variable} ${raleway.variable}`}>
      <head />
      <body className="index-page">
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