import type { MetadataRoute } from "next";
import { guides } from "@/content/guides";

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
    { url: `${siteUrl}/poradniki` },
    ...guides.map((guide) => ({ url: `${siteUrl}/poradniki/${guide.slug}` })),
    { url: siteUrl + "/case-studies/re-energy-meta-ads", changeFrequency: "monthly", priority: 0.9 },
    { url: siteUrl + "/reklamy-meta-ads-dla-firm", changeFrequency: "monthly", priority: 0.9 },
    {
      url: siteUrl,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteUrl}/case-studies`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/tworzenie-stron-internetowych`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/crm-i-aplikacje-webowe`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/marketing-i-reklamy`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...caseStudySlugs.map((slug) => ({
      url: `${siteUrl}/case-studies/${slug}`,
      changeFrequency: "monthly",
      priority: 0.9,
    }) satisfies MetadataRoute.Sitemap[number]),
  ];
}
