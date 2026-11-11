import {describe,it,expect} from "vitest";
import { toolboxItems } from "./toolbox";
import { englishToolboxItems,englishToolForSlug,englishToolPath,localizedToolPath,localizedToolboxPath,englishToolboxCategories } from "./toolbox-en";
import { buildPortfolioOpenRouterPrompt,isPortfolioTopic } from "./portfolio-openrouter";
import { standaloneWebsiteCheckerSlugs,visibleToolboxItems,visibleEnglishToolboxItems,catalogToolboxCount,isShownInToolboxCatalog } from "./toolbox-visibility";
describe("bilingual toolbox SEO and assistant integration",()=>{
 it("provides one distinct English page for each of the 46 tools",()=>{
  expect(englishToolboxItems).toHaveLength(46);
  expect(new Set(englishToolboxItems.map(t=>t.englishSlug)).size).toBe(45);
  expect(new Set(englishToolboxItems.map(t=>t.slug)).size).toBe(45);
  for(const t of englishToolboxItems){
   expect(t.title).toMatch(/^Free /);
   expect(t.title).not.toMatch(/darmow|bezpłatn/i);
   expect(t.description.length).toBeGreaterThan(20);
   expect(t.englishSlug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
   expect(englishToolForSlug(t.englishSlug)?.slug).toBe(t.slug);
   expect(englishToolPath(t.slug)).toBe("/en/tools/"+t.englishSlug);
   expect(localizedToolPath(t.slug,"en")).toBe("/en/tools/"+t.englishSlug);
   expect(localizedToolPath(t.slug,"pl")).toBe("/narzedzia/"+t.slug);
  }
 });
 it("preserves the original 45 Polish URLs",()=>{
  expect(toolboxItems).toHaveLength(46);
  expect(localizedToolboxPath("pl")).toBe("/narzedzia");
  expect(localizedToolboxPath("en")).toBe("/en/tools");
  expect(englishToolPath("audyt-strony")).toBe("/en/tools/free-website-audit");
  expect(englishToolPath("diagnostyka-meta-ads")).toBe("/en/tools/meta-ads-troubleshooter");
  expect(englishToolPath("kalkulator-roas")).toBe("/en/tools/roas-calculator");
  expect(englishToolPath("kalkulator-vat")).toBe("/en/tools/vat-calculator");
 });
 it("has translations for all five tool categories",()=>{
  expect(Object.values(englishToolboxCategories)).toHaveLength(5);
  expect(englishToolboxItems.every(t=>Object.values(englishToolboxCategories).includes(t.category))).toBe(true);
 });
 it("instructs the assistant to recommend existing tools without inventing results",()=>{
  const pl=buildPortfolioOpenRouterPrompt("pl"),en=buildPortfolioOpenRouterPrompt("en");
  for(const prompt of [pl,en]){
   expect(prompt).toContain("/en/tools/free-website-audit");
   expect(prompt).toContain("/narzedzia/diagnostyka-meta-ads");
   expect(prompt).toContain("Never claim");
  }
  expect(isPortfolioTopic("Can you calculate ROAS?")).toBe(true);
  expect(isPortfolioTopic("Darmowe narzędzia SEO")).toBe(true);
 });
});

describe("focused public toolbox",()=>{
 it("keeps the 12 overlapping checkers out of both catalogs",()=>{
  expect(standaloneWebsiteCheckerSlugs).toHaveLength(12);
  expect(catalogToolboxCount).toBe(34);
  expect(visibleToolboxItems).toHaveLength(33);
  expect(visibleEnglishToolboxItems).toHaveLength(33);
  expect(visibleToolboxItems.some(x=>x.slug==="audyt-strony")).toBe(false);
  expect(visibleEnglishToolboxItems.some(x=>x.slug==="audyt-strony")).toBe(false);
  for(const slug of standaloneWebsiteCheckerSlugs){
   expect(isShownInToolboxCatalog(slug)).toBe(false);
   expect(visibleToolboxItems.some(t=>t.slug===slug)).toBe(false);
   expect(visibleEnglishToolboxItems.some(t=>t.slug===slug)).toBe(false);
   expect(toolboxItems.some(t=>t.slug===slug)).toBe(true);
   expect(englishToolboxItems.some(t=>t.slug===slug)).toBe(true);
  }
 });
 it("keeps standalone generators, validators and advertising tools discoverable",()=>{
  for(const slug of ["diagnostyka-meta-ads","kalkulator-roas","walidator-schema-org","walidator-sitemap-xml","generator-schema-localbusiness","czy-ai-widzi-strone"]){
   expect(isShownInToolboxCatalog(slug)).toBe(true);
  }
 });
});
