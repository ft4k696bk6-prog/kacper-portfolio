import { createHash } from "node:crypto";
import englishCorpus from "../content/pseo/guide-translations.en.json";
import { allGuides, getGuide, guideCategories, guideCategory } from "./guide-directory";

export type EnglishSection = {title:string;paragraphs:string[]};
export type EnglishEdition = {
  status:"machine"|"reviewed";
  sourceHash:string;
  title:string;
  description:string;
  intro:string;
  serviceLabel:string;
  sections:EnglishSection[];
};
export type EnglishGuide = {
  slug:string;
  title:string;
  description:string;
  intro:string;
  sections:EnglishSection[];
  service:string;
  serviceLabel:string;
  sources?: readonly {label:string;url:string}[];
  status:"machine"|"reviewed";
};
const english = englishCorpus as Record<string,EnglishEdition>;

export function guideSourceHash(guide: {
  title:string; description:string; intro:string; serviceLabel:string;
  sections: readonly {title:string;paragraphs:readonly unknown[]}[]
}) {
  const content = [
    guide.title,guide.description,guide.intro,guide.serviceLabel,
    ...guide.sections.flatMap(s=>[s.title,...s.paragraphs.map(p=>String(p))])
  ].join("\u0000");
  return createHash("sha256").update(content,"utf8").digest("hex");
}
export function getEnglishGuide(slug:string):EnglishGuide | undefined {
  const original = getGuide(slug);
  const t = english[slug];
  if(!original||!t||t.sourceHash!==guideSourceHash(original))return undefined;
  if(!Array.isArray(t.sections)||t.sections.length!==original.sections.length)return undefined;
  if(t.sections.some((s,i)=>!s.title||!Array.isArray(s.paragraphs)||s.paragraphs.length!==original.sections[i].paragraphs.length))return undefined;
  if(!t.title||!t.description||!t.intro)return undefined;
  return {
    slug, title:t.title,description:t.description,intro:t.intro,
    sections:t.sections,service:original.service,serviceLabel:t.serviceLabel,
    sources:"sources" in original ? original.sources : undefined,status:t.status
  };
}
export function getEnglishGuides():EnglishGuide[] {
  return allGuides.map(g=>getEnglishGuide(g.slug)).filter((g):g is EnglishGuide=>Boolean(g));
}
const categoryLabels:Record<string,readonly [string,string]>={
  "meta-ads":["Meta Ads and advertising","Ads Manager, lead forms, Pixel, conversion measurement and account restrictions."],
  "vercel-hosting":["Vercel and hosting","Deployments, project settings, domains, SSL and runtime errors."],
  "supabase-bazy":["Supabase and databases","PostgreSQL, RLS, authentication, storage and database permissions."],
  "nextjs-react":["Next.js, React and TypeScript","Client/server rendering, components, hooks, TypeScript and build errors."],
  "crm-leady":["CRM and lead management","Lead visibility, assignments, statuses, follow-ups and CRM integrations."],
  "seo-google":["SEO and Google Search","Indexing, Search Console, sitemaps, canonical URLs and structured data."],
  "domeny-poczta":["Domains and email","DNS, mail hosting, MX, SPF, DKIM and delivery errors."],
  "formularze-api":["Forms and APIs","Web forms, CORS, webhooks, authentication and HTTP errors."],
  "wordpress":["WordPress","Plugins, website configuration, WooCommerce and WordPress issues."],
  "strony-ux":["Websites and UX","Mobile layout, images, navigation, performance and accessibility."],
  "automatyzacje":["Automation","Scheduled jobs, integrations, CI/CD workflows and alerts."],
  "inne":["Other guides","Practical fixes for business websites and web applications."]
};
export function englishCategory(slug:string) {
  const entry=guideCategories.find(c=>c.slug===slug);
  if(!entry)return undefined;
  const [label,description]=categoryLabels[slug]??[entry.label,entry.description];
  return {slug,label,description};
}
export function englishGuideCategory(guide:EnglishGuide) {
  const source=getGuide(guide.slug);
  return source ? guideCategory(source) : "inne";
}
export function englishCategoryCounts() {
  const guides=getEnglishGuides();
  return guideCategories.map(c=>({...englishCategory(c.slug)!,count:guides.filter(g=>englishGuideCategory(g)===c.slug).length}));
}
export function listEnglishGuides(options:{category?:string;query?:string;page?:number}={}) {
  const q=(options.query??"").trim().toLowerCase().slice(0,100);
  const filtered=getEnglishGuides().filter(g=>(!options.category||englishGuideCategory(g)===options.category) &&
    (!q||[g.title,g.description,g.intro].some(s=>s.toLowerCase().includes(q))))
    .sort((a,b)=>a.title.localeCompare(b.title,"en"));
  const total=filtered.length, size=24, pages=Math.max(1,Math.ceil(total/size));
  const page=Math.max(1,Math.min(pages,Number.isFinite(options.page)?Math.floor(options.page!):1));
  return {items:filtered.slice((page-1)*size,page*size),total,page,pages};
}
