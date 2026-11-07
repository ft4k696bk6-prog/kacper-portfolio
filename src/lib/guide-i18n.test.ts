import {describe,it,expect} from "vitest";
import englishRecords from "@/content/pseo/guide-translations.en.json";
import {allGuides,getGuide} from "./guide-directory";
import {getEnglishGuide,getEnglishGuides,guideSourceHash,englishCategoryCounts,listEnglishGuides} from "./guide-i18n";

describe("fully translated PL/EN guides",()=>{
 it("has a complete and source-matched English edition for every published Polish guide",()=>{
  const en=getEnglishGuides();
  expect(en.length).toBe(allGuides.length);
  expect(Object.keys(englishRecords).length).toBe(allGuides.length);
  const slugs=new Set<string>();
  for(const original of allGuides){
   const english=getEnglishGuide(original.slug);
   expect(english).toBeDefined();
   expect(slugs.has(original.slug)).toBe(false);
   slugs.add(original.slug);
   expect(english?.sections.length).toBe(original.sections.length);
   expect(english?.sections.every((s,i)=>s.paragraphs.length===original.sections[i].paragraphs.length)).toBe(true);
   expect(english?.intro.trim().length).toBeGreaterThan(15);
   expect(english?.description.trim().length).toBeGreaterThan(15);
   expect(english?.title.trim().length).toBeGreaterThan(12);
   expect(guideSourceHash(original).length).toBe(64);
   expect(getGuide(english!.slug)).toBeDefined();
  }
 });
 it("has localized category counters, search and paginated English listings",()=>{
  expect(englishCategoryCounts().reduce((n,c)=>n+c.count,0)).toBe(allGuides.length);
  expect(listEnglishGuides({page:10000}).items.length).toBeLessThanOrEqual(24);
  expect(listEnglishGuides({query:"Next.js"}).total).toBeGreaterThan(0);
  expect(listEnglishGuides({query:"nonexistentpatternxyz"}).total).toBe(0);
 });
});
