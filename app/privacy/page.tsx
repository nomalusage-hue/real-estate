import { Metadata } from "next";
import PrivacyPage from "./PrivacyClient";

export const metadata: Metadata = {
  title: `Privacy Policy | ${process.env.NEXT_PUBLIC_FOUNDER_NAME} Estates Bali`,
  description:
    `Read the privacy policy of ${process.env.NEXT_PUBLIC_FOUNDER_NAME} Estates, protecting client data and information for all luxury real estate services in Bali.`,
  alternates: { canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/privacy` },
  openGraph: {
    type: "website",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/privacy`,
    title: `Privacy Policy | ${process.env.NEXT_PUBLIC_FOUNDER_NAME} Estates Bali`,
    description:
      `Read the privacy policy of ${process.env.NEXT_PUBLIC_FOUNDER_NAME} Estates for luxury real estate services in Bali.`,
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/og/privacy.jpg`,
        width: 1200,
        height: 630,
        alt: `Privacy ${process.env.NEXT_PUBLIC_FOUNDER_NAME} Estates`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Privacy Policy | ${process.env.NEXT_PUBLIC_FOUNDER_NAME} Estates Bali`,
    description:
      `Privacy policy of ${process.env.NEXT_PUBLIC_FOUNDER_NAME} Estates for luxury real estate services in Bali.`,
    images: [`${process.env.NEXT_PUBLIC_BASE_URL}/og/privacy.jpg`],
  },
};

export default function Privacy() {
  return <PrivacyPage/>;
}