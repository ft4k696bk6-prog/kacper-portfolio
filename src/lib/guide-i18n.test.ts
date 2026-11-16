import { describe, it, expect } from "vitest";
import englishRecords from "../content/pseo/guide-translations.en.json";
import salesEnA from "../content/sales-en-a.json";
import salesEnB from "../content/sales-en-b.json";
import salesEnC from "../content/sales-en-c.json";
import salesEnD from "../content/sales-en-d.json";
import { businessArticles } from "../content/businessGuides";
import { allGuides, getGuide } from "./guide-directory";
import { getEnglishGuide, getEnglishGuides, guideSourceHash, englishCategoryCounts, listEnglishGuides } from "./guide-i18n";

describe("published PL/EN guide pairs", () => {
  it("publishes English alternate URLs only for complete, source-matched translations", () => {
    const editions = getEnglishGuides();
    expect(editions.length).toBeGreaterThan(350);
    const sourceTranslationCount = new Set([
      ...Object.keys(englishRecords),
      ...Object.keys(salesEnA),
      ...Object.keys(salesEnB),
      ...Object.keys(salesEnC),
      ...Object.keys(salesEnD),
      ...businessArticles.map((article) => article.slug),
    ]).size;
    expect(editions.length).toBeLessThanOrEqual(sourceTranslationCount);
    expect(editions.length).toBeLessThanOrEqual(allGuides.length);
    const slugs = new Set<string>();
    for (const english of editions) {
      const original = getGuide(english.slug);
      expect(original).toBeDefined();
      expect(slugs.has(english.slug)).toBe(false);
      slugs.add(english.slug);
      expect(getEnglishGuide(english.slug)).toBeDefined();
      expect(english.sections.length).toBe(original!.sections.length);
      expect(english.sections.every((section, i) => section.paragraphs.length === original!.sections[i].paragraphs.length)).toBe(true);
      expect(english.intro.trim().length).toBeGreaterThan(15);
      expect(english.description.trim().length).toBeGreaterThan(15);
      expect(english.title.trim().length).toBeGreaterThan(12);
      expect(guideSourceHash(original!).length).toBe(64);
    }
  });

  it("counts only valid English editions in localized categories and search", () => {
    expect(englishCategoryCounts().reduce((sum, category) => sum + category.count, 0)).toBe(getEnglishGuides().length);
    expect(listEnglishGuides({ page: 10000 }).items.length).toBeLessThanOrEqual(24);
    expect(listEnglishGuides({ query: "Next.js" }).total).toBeGreaterThan(0);
    expect(listEnglishGuides({ query: "nonexistentpatternxyz" }).total).toBe(0);
  });
});
