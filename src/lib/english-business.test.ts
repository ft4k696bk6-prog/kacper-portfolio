import {describe,expect,it} from "vitest";
import {englishServices,englishRealizations} from "../content/english-business";
import {realizations} from "../content/realizations";
import sitemap from "../app/sitemap";

describe("genuine English editions of public business pages",()=>{
 it("covers all Polish realization pages with real English copy",()=>{
  const polishSlugs=realizations.map(item=>item.slug).sort();
  const englishSlugs=Object.keys(englishRealizations).sort();
  expect(englishSlugs).toEqual(polishSlugs);
  for(const page of Object.values(englishRealizations)){
   expect(page.title.length).toBeGreaterThan(16);
   expect(page.summary.length).toBeGreaterThan(45);
   expect(page.details.length).toBeGreaterThanOrEqual(2);
   expect(page.details.every(text=>text.length>65)).toBe(true);
  }
 });
 it("includes English versions of the three core service categories",()=>{
  expect(Object.keys(englishServices).sort()).toEqual(["crm","marketing","websites"]);
  const originals=new Set(["/crm-i-aplikacje-webowe","/marketing-i-reklamy","/tworzenie-stron-internetowych"]);
  for(const service of Object.values(englishServices)){
   expect(originals.has(service.original)).toBe(true);
   expect(service.intro.length).toBeGreaterThan(80);
   expect(service.points).toHaveLength(4);
  }
 });
 it("adds reciprocal PL-EN alternate links for business pages and all 418 guides",()=>{
  const urls=sitemap();
  const byUrl=new Map(urls.map(entry=>[entry.url,entry]));
  const pagePairs=[
   ["/case-studies","/en/case-studies"],
   ["/case-studies/re-energy-meta-ads","/en/case-studies/re-energy-meta-ads"],
   ["/reklamy-meta-ads-dla-firm","/en/meta-ads"],
   ...Object.entries(englishServices).map(([key,item])=>[item.original,`/en/services/${key}`]),
   ...realizations.map(item=>[`/realizacje/${item.slug}`,`/en/projects/${item.slug}`]),
  ];
  const base="https://bernecki.dev";
  for(const [polish,english] of pagePairs){
   const a=byUrl.get(base+polish),b=byUrl.get(base+english);
   expect(a).toBeDefined();expect(b).toBeDefined();
   expect(a?.alternates?.languages?.["pl-PL"]).toBe(base+polish);
   expect(a?.alternates?.languages?.en).toBe(base+english);
   expect(b?.alternates?.languages?.["pl-PL"]).toBe(base+polish);
   expect(b?.alternates?.languages?.en).toBe(base+english);
  }
  expect(urls.filter(entry=>entry.url.includes("/en/guides/")&&!entry.url.includes("/topics/")).length).toBeGreaterThanOrEqual(418);
 });
 it("uses customer-facing English rather than internal source or audit notes",()=>{
  const raw=JSON.stringify([englishServices,englishRealizations]);
  for(const phrase of [/according to (the )?owner/i,/self.reported/i,/screenshots? (show|provided|captured)/i,/not independently audited/i,/not verified by us/i]){
   expect(raw).not.toMatch(phrase);
  }
 });
});
