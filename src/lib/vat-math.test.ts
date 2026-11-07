import { describe, expect, it } from "vitest";
import { calculateVat } from "./vat-math";
import { businessArticles, businessGuides } from "../content/businessGuides";
import { companyGuideArticles } from "../content/companyGuides";
import { industryGuideArticles } from "../content/industryGuides";
import { getEnglishGuide, getEnglishGuides } from "./guide-i18n";
import { getGuide, guideCategory } from "./guide-directory";

describe("business education and VAT math",()=>{
 it("extracts 8% and 23% VAT from gross PLN 50,000 without subtracting a gross percentage",()=>{
  expect(calculateVat(50000,8,"gross")).toEqual({gross:50000,net:46296.30,vat:3703.70});
  expect(calculateVat(50000,23,"gross")).toEqual({gross:50000,net:40650.41,vat:9349.59});
  const sale=calculateVat(50000,8,"gross"),buy=calculateVat(50000,23,"gross");
  expect(Math.round((buy.vat-sale.vat)*100)/100).toBe(5645.89);
  expect(Math.round((sale.net-buy.net)*100)/100).toBe(5645.89);
 });
 it("finds PLN 7,500 of excess VAT but zero net margin on equal PLN 50,000 net values",()=>{
  const sale=calculateVat(50000,8,"net"),buy=calculateVat(50000,23,"net");
  expect(sale).toEqual({net:50000,gross:54000,vat:4000});
  expect(buy).toEqual({net:50000,gross:61500,vat:11500});
  expect(buy.vat-sale.vat).toBe(7500);
  expect(sale.net-buy.net).toBe(0);
 });
 it("adds uniquely named source-backed guides with complete paired English editions",()=>{
  expect(businessGuides).toHaveLength(15);
  expect(new Set(businessGuides.map(g=>g.slug)).size).toBe(businessGuides.length);
  for(const entry of businessArticles){
   expect(entry.sources.length).toBeGreaterThanOrEqual(2);
   expect(entry.sources.every(source=>source.url.startsWith("https://"))).toBe(true);
   expect(getGuide(entry.slug)).toBeDefined();
   expect(guideCategory(getGuide(entry.slug)!)).toBe(companyGuideArticles.some(g=>g.slug===entry.slug)?"spolki-cit":industryGuideArticles.some(g=>g.slug===entry.slug)?"branze-pkd":"biznes-podatki");
   const english=getEnglishGuide(entry.slug);
   expect(english?.title).toBe(entry.en.title);
   expect(english?.sections.length).toBe(entry.en.sections.length);
   expect(english?.sections.every((s,i)=>s.paragraphs.length===entry.pl.sections[i].paragraphs.length)).toBe(true);
  }
  expect(getEnglishGuides().length).toBeGreaterThanOrEqual(421);
 });
});
