import {describe, expect, it} from "vitest";
import {blogPosts, getBlogPost, blogPostsForGuideCategory, blogTopicLabels} from "../content/blog";
import {allGuides,getGuide,guideCategory} from "./guide-directory";
import {getEnglishGuide} from "./guide-i18n";
import sitemap from "../app/sitemap";

describe("bilingual blog and contextual internal SEO links",()=>{
 it("has distinct useful articles with full Polish and English versions",()=>{
  expect(blogPosts.length).toBeGreaterThanOrEqual(4);
  const slugs=new Set<string>(),titles=new Set<string>();
  for(const post of blogPosts){
   expect(post.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
   expect(slugs.has(post.slug)).toBe(false);slugs.add(post.slug);
   expect(getBlogPost(post.slug)).toBe(post);
   expect(post.guideCategories.length).toBeGreaterThan(0);
   for(const locale of ["pl","en"] as const){
    const entry=post[locale];
    expect(entry.title.length).toBeGreaterThan(30);
    expect(entry.excerpt.length).toBeGreaterThan(60);
    expect(entry.lead.length).toBeGreaterThan(130);
    expect(entry.sections.length).toBeGreaterThanOrEqual(4);
    expect(entry.sections.every(section=>section.heading.length>18&&section.paragraphs.length>=2&&section.paragraphs.every(text=>text.length>80))).toBe(true);
    expect(titles.has(entry.title.toLowerCase())).toBe(false);titles.add(entry.title.toLowerCase());
    expect(blogTopicLabels[locale][post.topic]).toBeTruthy();
   }
  }
 });
 it("links only to published Polish guides with complete English versions",()=>{
  const published=new Set(allGuides.map(g=>g.slug));
  for(const post of blogPosts){
   expect(post.guideSlugs.length).toBeGreaterThanOrEqual(3);
   expect(new Set(post.guideSlugs).size).toBe(post.guideSlugs.length);
   for(const slug of post.guideSlugs){
    expect(published.has(slug)).toBe(true);
    expect(getGuide(slug)).toBeDefined();
    expect(getEnglishGuide(slug)?.title.length).toBeGreaterThan(15);
   }
   expect(post.service.pl.startsWith("/")).toBe(true);
   expect(post.service.en.startsWith("/en/")).toBe(true);
  }
 });
 it("links relevant guide categories back to their blog topic",()=>{
  for(const post of blogPosts){
   for(const category of post.guideCategories){
    expect(allGuides.some(guide=>guideCategory(guide)===category)).toBe(true);
    expect(blogPostsForGuideCategory(category,4).some(item=>item.slug===post.slug)).toBe(true);
   }
  }
  expect(blogPostsForGuideCategory("domeny-poczta")).toEqual([]);
 });
 it("publishes all blog and guide URLs with reciprocal hreflang in sitemap",()=>{
  const byUrl=new Map(sitemap().map(item=>[item.url,item]));
  const base="https://bernecki.dev";
  for(const slug of ["",...blogPosts.map(post=>"/"+post.slug)]){
   const pl=base+"/blog"+slug,en=base+"/en/blog"+slug;
   const plItem=byUrl.get(pl),enItem=byUrl.get(en);
   expect(plItem).toBeDefined();expect(enItem).toBeDefined();
   expect(plItem?.alternates?.languages?.["pl-PL"]).toBe(pl);
   expect(plItem?.alternates?.languages?.en).toBe(en);
   expect(enItem?.alternates?.languages?.["pl-PL"]).toBe(pl);
   expect(enItem?.alternates?.languages?.en).toBe(en);
  }
  for(const guide of allGuides)expect(byUrl.has(base+"/poradniki/"+guide.slug)).toBe(true);
 });
});
