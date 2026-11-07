import { describe, expect, it } from "vitest";
import { guideScreenshots } from "../content/guideScreenshots";
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
    expect(related.length).toBeLessThanOrEqual(6);
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

});
