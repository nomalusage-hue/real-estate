// export const SITE = {
//   name: "TheProperty",
//   startingYear: 2015,
//   founderName: "Dian Rebekah",
//   founderAvatar: "/img/founder-avatar/image-1.jpeg"
// } as const;


import rawSite from "./site.json";

export interface SiteConfig {
  name: string;
  startingYear: number;
  founderName: string;
  founderAvatar: string;
}

export const SITE: SiteConfig = rawSite;