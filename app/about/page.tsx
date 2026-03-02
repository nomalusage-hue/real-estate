// app/about/page.tsx
import AboutContent from "./AboutContent";

export const metadata = {
    title: `About ${process.env.NEXT_PUBLIC_FOUNDER_NAME} Estates | Bali Luxury Real Estate`,
    description:
        `Learn about ${process.env.NEXT_PUBLIC_FOUNDER_NAME} Estates, Bali’s premier luxury real estate agency. We specialize in villas, apartments, land, and high-end properties for sale and rent.`,
    keywords: [
    "Dian Rebecca Estates",
    "Dian Rebecca",
    "Bali luxury real estate agency",
    "About Dian Rebecca Estates",
    ],
    openGraph: {
        type: "website",
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/about`,
        title: `About ${process.env.NEXT_PUBLIC_FOUNDER_NAME} Estates | Bali Luxury Real Estate`,
        description:
            `Learn about ${process.env.NEXT_PUBLIC_FOUNDER_NAME} Estates, Bali’s premier luxury real estate agency. We specialize in villas, apartments, land, and high-end properties for sale and rent.`,
        images: [
            {
                url: `${process.env.NEXT_PUBLIC_BASE_URL}/og/about.jpg`,
                width: 1200,
                height: 630,
                alt: `${process.env.NEXT_PUBLIC_FOUNDER_NAME} Estates - Luxury Real Estate in Bali`,
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        images: [`${process.env.NEXT_PUBLIC_BASE_URL}/og/about.jpg`],
    },
};

export default function About() {
    return (
        <AboutContent />
    );
}