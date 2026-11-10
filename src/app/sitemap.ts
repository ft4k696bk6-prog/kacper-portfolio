import type { MetadataRoute } from "next";
import { toolboxItems } from "../lib/toolbox";
import { englishToolboxItems, englishToolPath } from "../lib/toolbox-en";
import { allGuides, getGuideCounts } from "../lib/guide-directory";
import { getEnglishGuide, getEnglishGuides, englishCategoryCounts } from "../lib/guide-i18n";
import { realizations } from "../content/realizations";
import { englishServices, englishRealizations } from "../content/english-business";
import {blogPosts, BLOG_PUBLISHED_DATE} from "../content/blog";
import { serviceCities } from "../lib/service-cities";

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
    {url:siteUrl+"/narzedzia",changeFrequency:"monthly",priority:0.9,alternates:{languages:{"pl-PL":siteUrl+"/narzedzia",en:siteUrl+"/en/tools"}}},
    {url:siteUrl+"/en/tools",changeFrequency:"monthly",priority:0.9,alternates:{languages:{"pl-PL":siteUrl+"/narzedzia",en:siteUrl+"/en/tools"}}},
    {url:siteUrl+"/narzedzia/codzienne",changeFrequency:"monthly",priority:0.8,alternates:{languages:{"pl-PL":siteUrl+"/narzedzia/codzienne",en:siteUrl+"/en/tools/everyday"}}},
    {url:siteUrl+"/en/tools/everyday",changeFrequency:"monthly",priority:0.8,alternates:{languages:{"pl-PL":siteUrl+"/narzedzia/codzienne",en:siteUrl+"/en/tools/everyday"}}},
    ...toolboxItems.map(tool=>({url:siteUrl+"/narzedzia/"+tool.slug,changeFrequency:"monthly" as const,priority:0.75,alternates:{languages:{"pl-PL":siteUrl+"/narzedzia/"+tool.slug,en:siteUrl+englishToolPath(tool.slug)}}})),
    ...englishToolboxItems.map(tool=>({url:siteUrl+"/en/tools/"+tool.englishSlug,changeFrequency:"monthly" as const,priority:0.75,alternates:{languages:{"pl-PL":siteUrl+"/narzedzia/"+tool.slug,en:siteUrl+"/en/tools/"+tool.englishSlug}}})),
    { url: siteUrl + "/partner-w-rozwoju-biznesu", changeFrequency: "monthly", priority: 0.95 },
    { url: siteUrl + "/kontakt", changeFrequency: "monthly", priority: 0.85 },
    { url: siteUrl + "/materialy/brief-strony", changeFrequency: "monthly", priority: 0.8 },
    { url: siteUrl + "/materialy/brief-crm", changeFrequency: "monthly", priority: 0.8 },
    { url: siteUrl + "/case-studies/isto-kebab", changeFrequency: "monthly", priority: 0.9 },
    { url: siteUrl + "/realizacje", changeFrequency: "monthly", priority: 0.85 },
    { url: siteUrl + "/uslugi", changeFrequency: "monthly", priority: 0.75 },
    ...serviceCities.map(city => ({ url: `${siteUrl}/uslugi/${city.slug}`, changeFrequency: "monthly" as const, priority: 0.7 })),
    { url: siteUrl + "/polityka-prywatnosci", changeFrequency: "yearly", priority: 0.2 },
    { url: siteUrl + "/wdrozenia-ai-dla-firm", changeFrequency: "monthly", priority: 0.9 },
    { url: siteUrl + "/crm-dla-firm-handlowych", changeFrequency: "monthly", priority: 0.9 },
    { url: siteUrl + "/automatyzacja-leadow-i-sprzedazy", changeFrequency: "monthly", priority: 0.9 },
    {url:siteUrl+"/blog",lastModified:new Date(BLOG_PUBLISHED_DATE),alternates:{languages:{"pl-PL":siteUrl+"/blog",en:siteUrl+"/en/blog"}}},
    {url:siteUrl+"/en/blog",lastModified:new Date(BLOG_PUBLISHED_DATE),alternates:{languages:{"pl-PL":siteUrl+"/blog",en:siteUrl+"/en/blog"}}},
    ...blogPosts.flatMap(post=>{
      const pl=siteUrl+"/blog/"+post.slug;
      const en=siteUrl+"/en/blog/"+post.slug;
      const alternates={languages:{"pl-PL":pl,en}};
      return [
        {url:pl,lastModified:new Date(BLOG_PUBLISHED_DATE),alternates},
        {url:en,lastModified:new Date(BLOG_PUBLISHED_DATE),alternates}
      ];
    }),
    ...realizations.map(item => ({
      url: `${siteUrl}/realizacje/${item.slug}`,
      alternates:{languages:{"pl-PL":`${siteUrl}/realizacje/${item.slug}`,en:`${siteUrl}/en/projects/${item.slug}`}}
    })),
    ...Object.keys(englishRealizations).map(slug=>({
      url: `${siteUrl}/en/projects/${slug}`,
      alternates:{languages:{"pl-PL":`${siteUrl}/realizacje/${slug}`,en:`${siteUrl}/en/projects/${slug}`}}
    })),
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
    { url: siteUrl + "/case-studies/re-energy-meta-ads",changeFrequency:"monthly",priority:0.9,
      alternates:{languages:{"pl-PL":siteUrl+"/case-studies/re-energy-meta-ads",en:siteUrl+"/en/case-studies/re-energy-meta-ads"}} },
    { url: siteUrl + "/en/case-studies/re-energy-meta-ads",changeFrequency:"monthly",priority:0.9,
      alternates:{languages:{"pl-PL":siteUrl+"/case-studies/re-energy-meta-ads",en:siteUrl+"/en/case-studies/re-energy-meta-ads"}} },
    { url: siteUrl + "/rozwoj-biznesu",changeFrequency:"monthly",priority:0.9,
      alternates:{languages:{"pl-PL":siteUrl+"/rozwoj-biznesu",en:siteUrl+"/en/business"}} },
    { url: siteUrl + "/en/business",changeFrequency:"monthly",priority:0.9,
      alternates:{languages:{"pl-PL":siteUrl+"/rozwoj-biznesu",en:siteUrl+"/en/business"}} },
    { url: siteUrl + "/reklamy-meta-ads-dla-firm",changeFrequency:"monthly",priority:0.9,
      alternates:{languages:{"pl-PL":siteUrl+"/reklamy-meta-ads-dla-firm",en:siteUrl+"/en/meta-ads"}} },
    { url: siteUrl + "/en/meta-ads",changeFrequency:"monthly",priority:0.9,
      alternates:{languages:{"pl-PL":siteUrl+"/reklamy-meta-ads-dla-firm",en:siteUrl+"/en/meta-ads"}} },
    {
      url: siteUrl,
      changeFrequency: "monthly",
      priority: 1,
    },
    {url:`${siteUrl}/case-studies`,changeFrequency:"monthly",priority:0.8,
      alternates:{languages:{"pl-PL":`${siteUrl}/case-studies`,en:`${siteUrl}/en/case-studies`}}},
    {url:`${siteUrl}/en/case-studies`,changeFrequency:"monthly",priority:0.8,
      alternates:{languages:{"pl-PL":`${siteUrl}/case-studies`,en:`${siteUrl}/en/case-studies`}}},
    ...Object.entries(englishServices).flatMap(([kind,service])=>{
      const pl=siteUrl+service.original;
      const en=`${siteUrl}/en/services/${kind}`;
      return [
        {url:pl,changeFrequency:"monthly" as const,priority:0.9,alternates:{languages:{"pl-PL":pl,en}}},
        {url:en,changeFrequency:"monthly" as const,priority:0.9,alternates:{languages:{"pl-PL":pl,en}}}
      ];
    }),
    ...caseStudySlugs.map((slug) => ({
      url: `${siteUrl}/case-studies/${slug}`,
      changeFrequency: "monthly",
      priority: 0.9,
    }) satisfies MetadataRoute.Sitemap[number]),
  ];
}
