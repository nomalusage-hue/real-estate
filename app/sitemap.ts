import { MetadataRoute } from "next";
import { PropertiesRepository } from "@/lib/repositories/PropertiesRepository";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

  const repo = new PropertiesRepository();
  const properties = await repo.getAll();

  // Static routes
  const staticRoutes = [
    "",
    "about",
    "contact",
    "favorites",
    "privacy",
    "properties",
  ];

  const staticUrls = staticRoutes.map((route) => ({
    url: `${baseUrl}/${route}`,
    lastModified: new Date(),
  }));

  // Dynamic property pages
  const propertyUrls = properties.map((property) => ({
    url: `${baseUrl}/properties/${property.id}`,
    lastModified: new Date(property.updatedAt ?? Date.now()),
  }));

  return [...staticUrls, ...propertyUrls];
}