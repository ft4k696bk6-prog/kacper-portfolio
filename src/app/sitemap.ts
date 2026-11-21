import type { MetadataRoute } from "next";
import { ukSalesPages, ukAlternates, ukPath } from "../content/uk-sales";
import { toolboxItems } from "../lib/toolbox";
import { englishToolboxItems, englishToolPath } from "../lib/toolbox-en";
import { realizations } from "../content/realizations";
import { englishServices, englishRealizations } from "../content/english-business";
import {blogPosts, BLOG_PUBLISHED_DATE} from "../content/blog";
import { serviceCities } from "../lib/service-cities";
import { commercialServiceSlugs } from "../content/commercial-services";

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

  const entries: MetadataRoute.Sitemap = [
    ...ukSalesPages.map(page=>({url:siteUrl+ukPath(page),changeFrequency:"monthly" as const,priority:page.slug?0.82:0.93,alternates:{languages:ukAlternates(page)}})),
    {url:siteUrl+"/minigry",changeFrequency:"monthly",priority:0.8,alternates:{languages:{"pl-PL":siteUrl+"/minigry",en:siteUrl+"/en/games"}}},
    {url:siteUrl+"/en/games",changeFrequency:"monthly",priority:0.8,alternates:{languages:{"pl-PL":siteUrl+"/minigry",en:siteUrl+"/en/games"}}},
    // Every commercial translation is indexed as its own canonical URL, with reciprocal hreflang.
    ...([["/cennik","/en/pricing",0.95],["/pakiety","/en/packages",0.95],["/pozyskiwanie-klientow","/en/customer-acquisition",0.96],["/reklamy-online","/en/advertising",0.95],["/kontakt","/en/contact",0.85],["/polityka-prywatnosci","/en/privacy",0.2],["/automatyzacja-leadow-i-sprzedazy","/en/services/automation",0.9]] as const).flatMap(([pl,en,priority])=>{
      const languages={"pl-PL":siteUrl+pl,en:siteUrl+en};
      return [
        {url:siteUrl+pl,changeFrequency:"monthly" as const,priority,alternates:{languages}},
        {url:siteUrl+en,changeFrequency:"monthly" as const,priority,alternates:{languages}}
      ];
    }),
    {url:siteUrl+"/narzedzia/test-mobilnosci-strony",changeFrequency:"monthly",priority:0.82},
    {url:siteUrl+"/narzedzia",changeFrequency:"monthly",priority:0.9,alternates:{languages:{"pl-PL":siteUrl+"/narzedzia",en:siteUrl+"/en/tools"}}},
    {url:siteUrl+"/en/tools",changeFrequency:"monthly",priority:0.9,alternates:{languages:{"pl-PL":siteUrl+"/narzedzia",en:siteUrl+"/en/tools"}}},
    {url:siteUrl+"/narzedzia/codzienne",changeFrequency:"monthly",priority:0.8,alternates:{languages:{"pl-PL":siteUrl+"/narzedzia/codzienne",en:siteUrl+"/en/tools/everyday"}}},
    {url:siteUrl+"/en/tools/everyday",changeFrequency:"monthly",priority:0.8,alternates:{languages:{"pl-PL":siteUrl+"/narzedzia/codzienne",en:siteUrl+"/en/tools/everyday"}}},
    {url:siteUrl+"/narzedzia/sprawdz-czy-zdjecie-ai",changeFrequency:"monthly",priority:0.8,alternates:{languages:{"pl-PL":siteUrl+"/narzedzia/sprawdz-czy-zdjecie-ai",en:siteUrl+"/en/tools/ai-image-check"}}},
    {url:siteUrl+"/en/tools/ai-image-check",changeFrequency:"monthly",priority:0.8,alternates:{languages:{"pl-PL":siteUrl+"/narzedzia/sprawdz-czy-zdjecie-ai",en:siteUrl+"/en/tools/ai-image-check"}}},
    ...toolboxItems.map(tool=>({url:siteUrl+"/narzedzia/"+tool.slug,changeFrequency:"monthly" as const,priority:0.75,alternates:{languages:{"pl-PL":siteUrl+"/narzedzia/"+tool.slug,en:siteUrl+englishToolPath(tool.slug)}}})),
    ...englishToolboxItems.map(tool=>({url:siteUrl+"/en/tools/"+tool.englishSlug,changeFrequency:"monthly" as const,priority:0.75,alternates:{languages:{"pl-PL":siteUrl+"/narzedzia/"+tool.slug,en:siteUrl+"/en/tools/"+tool.englishSlug}}})),




    { url: siteUrl + "/wykonawca-stron-i-crm", changeFrequency: "monthly", priority: 0.95 },
    { url: siteUrl + "/dla-agencji", changeFrequency: "monthly", priority: 0.85 },
    { url: siteUrl + "/partner-w-rozwoju-biznesu", changeFrequency: "monthly", priority: 0.95 },

    { url: siteUrl + "/materialy/brief-strony", changeFrequency: "monthly", priority: 0.8 },
    { url: siteUrl + "/materialy/brief-crm", changeFrequency: "monthly", priority: 0.8 },
    { url: siteUrl + "/case-studies/isto-kebab", changeFrequency: "monthly", priority: 0.9 },
    { url: siteUrl + "/realizacje", changeFrequency: "monthly", priority: 0.85 },
    { url: siteUrl + "/uslugi", lastModified: new Date("2026-11-16"), changeFrequency: "monthly", priority: 0.75 },
    ...serviceCities.map(city => ({ url: `${siteUrl}/uslugi/${city.slug}`, changeFrequency: "monthly" as const, priority: 0.7 })),
    // Keep the focused city hubs indexable; city-by-service variants remain available but are noindex.
    // National, substantial commercial landing pages stay in the sitemap.
    ...commercialServiceSlugs.map(slug => ({
      url: siteUrl + "/oferta/" + slug,
      lastModified: new Date("2026-11-18"),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),

    { url: siteUrl + "/google-ads-dla-firm", changeFrequency: "monthly", priority: 0.95 },
    { url: siteUrl + "/narzedzia/kalkulator-budzetu-google-ads", changeFrequency: "monthly", priority: 0.85 },
    { url: siteUrl + "/wdrozenia-ai-dla-firm", changeFrequency: "monthly", priority: 0.9 },
    { url: siteUrl + "/crm-dla-firm-handlowych", changeFrequency: "monthly", priority: 0.9 },

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
    // Editorial guide archive intentionally excluded from sitemap.
    // Commercial pages, real case studies, tools and curated blog posts stay listed.
    // Removing URLs from a sitemap alone does NOT deindex them; follow up with
    // page-level noindex for low-value technical guides after route verification.
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
    {url:siteUrl+"/",lastModified:new Date("2026-11-16"),changeFrequency:"monthly",priority:1,alternates:{languages:{"pl-PL":siteUrl+"/",en:siteUrl+"/en"}}},
    {url:siteUrl+"/en",lastModified:new Date("2026-11-16"),changeFrequency:"monthly",priority:1,alternates:{languages:{"pl-PL":siteUrl+"/",en:siteUrl+"/en"}}},
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
  // One canonical <loc> per page. Several sources (translated services, realizations,
  // guides and standalone offers) can expose the same URL as the site grows.
  // Merge reciprocal language links rather than publishing duplicate sitemap entries.
  const unique = new Map<string, MetadataRoute.Sitemap[number]>();
  for (const entry of entries) {
    const previous = unique.get(entry.url);
    if (!previous) {
      unique.set(entry.url, entry);
      continue;
    }
    unique.set(entry.url, {
      ...previous,
      alternates: previous.alternates || entry.alternates
        ? { languages: { ...previous.alternates?.languages, ...entry.alternates?.languages } }
        : undefined,
      lastModified: previous.lastModified ?? entry.lastModified,
    });
  }
  // Add reciprocal Ukrainian alternates to matching Polish/English pages.
  return [...unique.values()].map(entry=>{
    const match=ukSalesPages.find(page=>entry.url===siteUrl+page.pl||entry.url===siteUrl+page.en);
    if(!match)return entry;
    return {...entry,alternates:{languages:{...(entry.alternates?.languages||{}),...ukAlternates(match)}}};
  });
}
