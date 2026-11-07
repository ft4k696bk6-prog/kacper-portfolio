import { describe, expect, it } from "vitest";
import { guideScreenshots } from "../content/guideScreenshots";
import { offlineCases } from "../content/pseo/offline-guides";
import { offlineBatchTwoCases } from "../content/pseo/offline-batch2-guides";
import { publishedEntries } from "../content/pseo/guides";
import {
  allGuides,
  getGuide,
  getGuideCounts,
  getRelatedGuides,
  guideCategory,
  listGuides,
  normalizeGuideText
} from "./guide-directory";

describe("programmatic SEO catalog", () => {
  it("uses unique, safe URLs and unique article titles", () => {
    const slugs = allGuides.map((guide) => guide.slug);
    const titles = allGuides.map((guide) => normalizeGuideText(guide.title));
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(titles).size).toBe(titles.length);
    for (const guide of allGuides) {
      expect(guide.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(guide.title.trim().length).toBeGreaterThan(12);
      expect(guide.description.trim().length).toBeGreaterThan(20);
      expect(guide.sections.length).toBeGreaterThanOrEqual(2);
      expect(guide.sections.every((section) => section.paragraphs.length > 0)).toBe(true);
    }
  });

  it("does not publish a new pSEO entry without useful diagnostic content", () => {
    for (const entry of publishedEntries) {
      expect(entry.diagnostics.length).toBeGreaterThanOrEqual(2);
      expect(entry.steps.length).toBeGreaterThanOrEqual(4);
      expect(entry.verification.length).toBeGreaterThanOrEqual(2);
      expect(entry.mistakes.length).toBeGreaterThanOrEqual(1);
      expect(entry.sources.length).toBeGreaterThanOrEqual(1);
      expect(entry.sources.every((source) => /^https:\/\//.test(source.url))).toBe(true);
      const paragraphs = [...entry.diagnostics, ...entry.steps, ...entry.verification, ...entry.mistakes];
      expect(new Set(paragraphs.map(normalizeGuideText)).size).toBe(paragraphs.length);
      expect(paragraphs.join(" ").length).toBeGreaterThan(1000);
    }
  });

  it("includes both the older guides and pSEO guides in one searchable directory", () => {
    expect(allGuides.length).toBeGreaterThanOrEqual(publishedEntries.length + 18);
    expect(getGuide("github-merge-conflict-rownolegla-praca-nad-strona")).toBeDefined();
    expect(listGuides({ query: "Supabase" }).items.length).toBeGreaterThan(0);
    expect(listGuides({ page: 10000 }).items.length).toBeLessThanOrEqual(24);
    expect(getGuideCounts().reduce((sum, category) => sum + category.count, 0)).toBe(allGuides.length);
  });

  it("recommends relevant articles without producing thousands of links", () => {
    const slug = "supabase-storage-413-entity-too-large-upload";
    const related = getRelatedGuides(slug);
    expect(related.length).toBeLessThanOrEqual(10);
    expect(related.every((guide) => guide.slug !== slug)).toBe(true);
    expect(guideCategory(getGuide(slug)!)).toBe("supabase-bazy");
  });
  it("shows authentic cropped screenshots only on existing relevant guides", () => {
    const names = Object.keys(guideScreenshots);
    expect(names).toHaveLength(2);
    for (const slug of names) {
      expect(getGuide(slug)).toBeDefined();
      for (const shot of guideScreenshots[slug]) {
        expect(shot.src).toMatch(/^\/poradniki\/[a-z0-9-]+\.webp$/);
        expect(shot.alt.length).toBeGreaterThan(50);
        expect(shot.caption).toContain("Rzeczywisty ekran");
        expect(shot.width).toBeGreaterThan(400);
      }
    }
  });

  it("adds exactly 100 distinct offline troubleshooting problems without API generation", () => {
    expect(offlineCases).toHaveLength(100);
    const slugSet = new Set<string>();
    const titleSet = new Set<string>();
    for (const item of offlineCases) {
      expect(item.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(item.source).toMatch(/^https:\/\//);
      expect(item.title.length).toBeGreaterThan(28);
      expect(item.symptom.length).toBeGreaterThan(60);
      expect(item.cause.length).toBeGreaterThan(65);
      expect(item.inspect).toHaveLength(2);
      expect(item.fix).toHaveLength(2);
      expect(item.verify.length).toBeGreaterThan(65);
      expect(item.warning.length).toBeGreaterThan(65);
      const total = [item.symptom,item.cause,...item.inspect,...item.fix,item.verify,item.warning].join(" ").length;
      expect(total).toBeGreaterThan(700);
      expect(slugSet.has(item.slug)).toBe(false);
      expect(titleSet.has(normalizeGuideText(item.title))).toBe(false);
      slugSet.add(item.slug);
      titleSet.add(normalizeGuideText(item.title));
      expect(getGuide(item.slug)).toBeDefined();
      expect(guideCategory(getGuide(item.slug)!)).toBe(item.category);
    }
    expect(new Set(allGuides.map(x=>x.slug)).size).toBe(allGuides.length);
  });

  it("adds 200 original offline incident guides, all with valid source and unique URLs", () => {
    expect(offlineBatchTwoCases).toHaveLength(200);
    const slugs = new Set<string>();
    const titles = new Set<string>();
    const hosts = new Set(["react.dev","www.typescriptlang.org","nextjs.org","developer.mozilla.org","supabase.com","www.postgresql.org","github.com","docs.github.com","vercel.com","developers.google.com","support.google.com","wordpress.org","developer.wordpress.org","woocommerce.com","www.facebook.com","transparency.meta.com","developers.facebook.com","www.cloudflare.com","www.rfc-editor.org","www.itu.int","owasp.org","web.dev"]);
    for (const item of offlineBatchTwoCases) {
      expect(item.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(item.title.length).toBeGreaterThan(28);
      expect(item.symptom.length).toBeGreaterThan(40);
      expect(item.diagnose.length).toBeGreaterThan(65);
      expect(item.fix.length).toBeGreaterThan(65);
      expect(item.verify.length).toBeGreaterThan(55);
      const url = new URL(item.source);
      expect(url.protocol).toBe("https:");
      expect(hosts.has(url.hostname)).toBe(true);
      expect(slugs.has(item.slug)).toBe(false);
      expect(titles.has(normalizeGuideText(item.title))).toBe(false);
      slugs.add(item.slug);
      titles.add(normalizeGuideText(item.title));
      const guide = getGuide(item.slug);
      expect(guide).toBeDefined();
      expect(guideCategory(guide!)).toBe(item.category);
      expect(guide?.sections.length).toBeGreaterThanOrEqual(4);
    }
    expect(new Set(allGuides.map(x => x.slug)).size).toBe(allGuides.length);
  });

});
