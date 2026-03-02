import { Metadata } from "next";
import PropertiesClient from "./PropertiesClient";

export const metadata: Metadata = {
  title: `Luxury Villas & Properties in Bali | ${process.env.NEXT_PUBLIC_FOUNDER_NAME} Estates`,
  description:
    "Explore premium villas and luxury properties for sale and rent in Bali. Verified listings with full details, pricing, and images.",
  keywords: [
    "Bali villas for sale",
    "Bali villas for rent",
    "Luxury villas in Bali",
    "Bali real estate listings",
  ],
  openGraph: {
    title: "Luxury Villas & Properties in Bali",
    description:
      "Browse exclusive Bali villas and real estate listings.",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/properties`,
    type: "website",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/og/properties.jpg`,
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function Properties() {
  return <PropertiesClient />;
}