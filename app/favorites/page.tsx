import { Metadata } from "next";
import FavoritesPage from "./FavoriteClient";

export const metadata: Metadata = {
  title: `Your Favorite Properties | ${process.env.NEXT_PUBLIC_FOUNDER_NAME} Estates Bali`,
  description:
    `View and manage your favorite luxury villas, apartments, and land for sale or rent in Bali with ${process.env.NEXT_PUBLIC_FOUNDER_NAME} Estates.`,
  alternates: { canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/favorites` },
  openGraph: {
    type: "website",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/favorites`,
    title: `Your Favorite Properties | ${process.env.NEXT_PUBLIC_FOUNDER_NAME} Estates Bali`,
    description:
      `View and manage your favorite luxury properties in Bali with ${process.env.NEXT_PUBLIC_FOUNDER_NAME} Estates.`,
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/og/favorites.jpg`,
        width: 1200,
        height: 630,
        alt: `Favorites ${process.env.NEXT_PUBLIC_FOUNDER_NAME} Estates`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Your Favorite Properties | ${process.env.NEXT_PUBLIC_FOUNDER_NAME} Estates Bali`,
    description:
      `Manage your favorite luxury properties in Bali with ${process.env.NEXT_PUBLIC_FOUNDER_NAME} Estates.`,
    images: [`${process.env.NEXT_PUBLIC_BASE_URL}/og/favorites.jpg`],
  },
};

export default function Favorites() {
  return <FavoritesPage/>;
}