// import type { Metadata } from "next";
// import { PropertiesRepository } from "@/lib/repositories/PropertiesRepository";
// import PropertyClient from "./PropertyClient";

// export const dynamic = "force-dynamic";

// type Props = {
//   params: Promise<{ id: string }>;
// };

// export async function generateMetadata(
//   props: Props
// ): Promise<Metadata> {
//   const { id } = await props.params;

//   const repo = new PropertiesRepository();
//   const property = await repo.getById(id);

//   const url = "https://flip-investigations-how-competitions.trycloudflare.com";

//   if (!property) {
//     return {
//       title: "Property Not Found | {SITE.founderName} Properties",
//     };
//   }

//   const image =
//     property.images?.[0] ??
//     "https://i.ibb.co/wZzgxMsY/Untitledasdfa.jpg";

//   return {
//     title: `${property.title} | {SITE.founderName} Properties`,
//     description: property.description?.slice(0, 160),
//     openGraph: {
//       title: property.title,
//       description: property.description?.slice(0, 160),
//       url: `${url}/properties/${property.id}`,
//       type: "website",
//       images: [
//         {
//           url: image,
//           width: 1200,
//           height: 630,
//           alt: property.title,
//         },
//       ],
//     },
//   };
// }

// export default function Page() {
//   return <PropertyClient />;
// }








// import type { Metadata } from "next";
// import { headers } from "next/headers";
// import { PropertiesRepository } from "@/lib/repositories/PropertiesRepository";
// import PropertyClient from "./PropertyClient";

// export const dynamic = "force-dynamic";

// // type Props = {
// //   params: Promise<{ id: string }>;
// // };

// type Props = {
//   params: { id: string };
// };


// // export async function generateMetadata(
// //   props: Props
// // ): Promise<Metadata> {
// //   const { id } = await props.params;

// export async function generateMetadata(
//   { params }: Props
// ): Promise<Metadata> {
//   const { id } = params;

//   const repo = new PropertiesRepository();
//   const property = await repo.getById(id);

//   if (!property) {
//     return {
//       title: "Property Not Found | {SITE.founderName} Properties",
//     };
//   }

//   /* Get current site URL dynamically */
//   const headersList = await headers();
//   const host = headersList.get("x-forwarded-host") ?? headersList.get("host");
//   const protocol = headersList.get("x-forwarded-proto") ?? "https";
//   const baseUrl = `${protocol}://${host}`;

//   const image =
//     property.images?.[0] ??
//     "/og/logo.jpeg";

//   return {
//     title: `${property.title} | {SITE.founderName} Properties`,
//     description: property.description?.slice(0, 160),
//     openGraph: {
//       title: property.title,
//       description: property.description?.slice(0, 160),
//       url: `${baseUrl}/properties/${property.id}`,
//       type: "website",
//       images: [
//         {
//           url: image,
//           width: 1200,
//           height: 630,
//           alt: property.title,
//         },
//       ],
//     },
//   };
// }

// // export default function Page() {
// //   return <PropertyClient />;
// // }

// // export default function Page({
// //   params,
// // }: {
// //   params: { id: string };
// // }) {
// //   return <PropertyClient id={params.id} />;
// // }


// export default function Page({ params }: { params: { id: string } }) {
//   return <PropertyClient id={params.id} />;
//   // return <PropertyClient />;
// }







import type { Metadata } from "next";
import { headers } from "next/headers";
import { PropertiesRepository } from "@/lib/repositories/PropertiesRepository";
import PropertyClient from "./PropertyClient";
import { SITE } from "@/src/config/site";

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
      title: `Property Not Found | ${SITE.founderName} Properties`,
    };
  }

  /* Get current site URL dynamically */
  const headersList = await headers();
  const host = headersList.get("x-forwarded-host") ?? headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") ?? "https";
  const baseUrl = `${protocol}://${host}`;

  const image =
    property.images?.[0] ??
    "/og/logo.jpeg";

  return {
    title: `${property.title} | ${SITE.founderName} Properties`,
    description: property.description?.slice(0, 160),
    openGraph: {
      title: property.title,
      description: property.description?.slice(0, 160),
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
  };
}

export default async function Page(props: Props) {
  const { id } = await props.params;
  return <PropertyClient id={id} />;
}