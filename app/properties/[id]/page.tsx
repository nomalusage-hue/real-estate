import type { Metadata } from "next";
import { headers } from "next/headers";
import { PropertiesRepository } from "@/lib/repositories/PropertiesRepository";
import PropertyClient from "./PropertyClient";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata(
  props: Props
): Promise<Metadata> {
  const { id } = await props.params;

  const repo = new PropertiesRepository();
  const property = await repo.getById(id);

  if (!property) {
    return {
      title: `Property Not Found | ${process.env.NEXT_PUBLIC_FOUNDER_NAME} Properties`,
    };
  }

  /* Get current site URL dynamically */
  const headersList = await headers();
  const host = headersList.get("x-forwarded-host") ?? headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") ?? "https";
  const baseUrl = `${protocol}://${host}`;

  // const image = `${baseUrl}/og/property/${property.id}`;
  const image = `${baseUrl}/og/property/${property.id}?url=${encodeURIComponent(property.images[0])}`;

  const description = property.description?.substring(0, 155).trim() + "...";

  return {
    title: `${property.title} | ${process.env.NEXT_PUBLIC_FOUNDER_NAME} Properties`,
    description,
    alternates: {
      canonical: `${baseUrl}/properties/${property.id}`,
    },
  keywords: [
    property.title,
    property.city,
    "Luxury villa in Bali",
  ],
    openGraph: {
      title: property.title,
      description,
      url: `${baseUrl}/properties/${property.id}`,
      type: "website",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: property.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: property.title,
      description,
      images: [image],
    },
  };

}

export default async function Page(props: Props) {
  const { id } = await props.params;
  return <PropertyClient id={id} />;
}