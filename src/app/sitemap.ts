import type { MetadataRoute } from "next";
import { allGuides, getGuideCounts } from "@/lib/guide-directory";
import { getEnglishGuide, getEnglishGuides, englishCategoryCounts } from "@/lib/guide-i18n";
import { realizations } from "@/content/realizations";

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
    ...realizations.map(item => ({url: `${siteUrl}/realizacje/${item.slug}`})),
    {url: `${siteUrl}/poradniki`, alternates:{languages:{"pl-PL":`${siteUrl}/poradniki`,en:`${siteUrl}/en/guides`}}},
    {url: `${siteUrl}/en/guides`, alternates:{languages:{"pl-PL":`${siteUrl}/poradniki`,en:`${siteUrl}/en/guides`}}},
    ...getGuideCounts().filter(category=>category.count>0).map(category=>{
      const pl=`${siteUrl}/poradniki/tematy/${category.slug}`;
      const en=`${siteUrl}/en/guides/topics/${category.slug}`;
      const available=englishCategoryCounts().some(item=>item.slug===category.slug&&item.count>0);
      return available?{url:pl,alternates:{languages:{"pl-PL":pl,en}}}:{url:pl};
    }),
    ...englishCategoryCounts().filter(category=>category.count>0).map(category=>({
      url:`${siteUrl}/en/guides/topics/${category.slug}`,
      alternates:{languages:{"pl-PL":`${siteUrl}/poradniki/tematy/${category.slug}`,en:`${siteUrl}/en/guides/topics/${category.slug}`}}
    })),
    ...allGuides.map((guide)=>{
      const pl=`${siteUrl}/poradniki/${guide.slug}`;
      const en=`${siteUrl}/en/guides/${guide.slug}`;
      return getEnglishGuide(guide.slug)?{url:pl,alternates:{languages:{"pl-PL":pl,en}}}:{url:pl};
    }),
    ...getEnglishGuides().map(guide=>({
      url:`${siteUrl}/en/guides/${guide.slug}`,
      alternates:{languages:{"pl-PL":`${siteUrl}/poradniki/${guide.slug}`,en:`${siteUrl}/en/guides/${guide.slug}`}}
    })),
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
