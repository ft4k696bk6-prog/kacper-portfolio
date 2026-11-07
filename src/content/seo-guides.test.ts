import { describe, expect, it } from "vitest";
import { guides } from "./guides";

describe("SEO poradników", () => {
  it("ma dokładnie 100 unikatowych poradników", () => {
    expect(guides).toHaveLength(100);
    const slugs = guides.map(g => g.slug);
    expect(new Set(slugs).size).toBe(100);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  });
  it("każdy poradnik ma użyteczny opis i treść", () => {
    for (const guide of guides) {
      expect(guide.title.length).toBeGreaterThan(15);
      expect(guide.description.length).toBeGreaterThan(40);
      expect(guide.sections.length).toBeGreaterThanOrEqual(2);
      expect(guide.sections.every(s => s.paragraphs.every(p => p.length > 40))).toBe(true);
    }
  });
});
