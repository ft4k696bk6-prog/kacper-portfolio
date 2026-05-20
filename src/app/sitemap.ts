import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = "https://kacper-portfolio.vercel.app";
  const caseStudySlugs = [
    "b-crm",
    "interactive-portfolio",
    "berni-rush",
    "portfolio",
    "unreal-gameplay-prototype",
    "berninutri",
    "kalkulator-leasingu",
  ];

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteUrl}/static`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...caseStudySlugs.map((slug) => ({
      url: `${siteUrl}/case-studies/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    }) satisfies MetadataRoute.Sitemap[number]),
  ];
}
