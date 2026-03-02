import { Metadata } from "next";
import ContactPage from "./ContactClient";

export const metadata: Metadata = {
  title: `Contact ${process.env.NEXT_PUBLIC_FOUNDER_NAME} Estates | Bali Luxury Real Estate`,
  description:
    `Get in touch with ${process.env.NEXT_PUBLIC_FOUNDER_NAME} Estates for inquiries on luxury villas, apartments, land, and high-end properties for sale or rent in Bali.`,
  alternates: { canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/contact` },
  openGraph: {
    type: "website",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/contact`,
    title: `Contact ${process.env.NEXT_PUBLIC_FOUNDER_NAME} Estates | Bali Luxury Real Estate`,
    description:
      `Get in touch with ${process.env.NEXT_PUBLIC_FOUNDER_NAME} Estates for inquiries on luxury properties in Bali.`,
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/og/contact.jpg`,
        width: 1200,
        height: 630,
        alt: `Contact ${process.env.NEXT_PUBLIC_FOUNDER_NAME} Estates`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Contact ${process.env.NEXT_PUBLIC_FOUNDER_NAME} Estates | Bali Luxury Real Estate`,
    description: `Contact ${process.env.NEXT_PUBLIC_FOUNDER_NAME} Estates for luxury real estate inquiries in Bali.`,
    images: [`${process.env.NEXT_PUBLIC_BASE_URL}/og/contact.jpg`],
  },
};

export default function Contact() {
    return <ContactPage/>
}