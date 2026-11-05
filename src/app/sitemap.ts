import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = "https://bernecki.dev";
  const caseStudySlugs = [
    "b-crm",
    "interactive-portfolio",
    "berni-rush",
    "portfolio",
    "unreal-gameplay-prototype",
    "motomizer",
    "starcars",
    "beatmarket",
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
    {
      url: `${siteUrl}/tworzenie-stron-internetowych`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/crm-i-aplikacje-webowe`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/marketing-i-reklamy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...caseStudySlugs.map((slug) => ({
      url: `${siteUrl}/case-studies/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    }) satisfies MetadataRoute.Sitemap[number]),
  ];
}
