import { describe, expect, it } from "vitest";
import { businessGrowthGuidesOne } from "./businessGrowthGuidesOne";
import { businessGrowthGuidesTwo } from "./businessGrowthGuidesTwo";
import { businessGrowthGuidesThree } from "./businessGrowthGuidesThree";
import { businessGrowthGuidesFour } from "./businessGrowthGuidesFour";

const guides = [...businessGrowthGuidesOne, ...businessGrowthGuidesTwo, ...businessGrowthGuidesThree, ...businessGrowthGuidesFour];

describe("business growth search guides", () => {
  it("publishes exactly 100 unique problem-oriented guides", () => {
    expect(guides).toHaveLength(100);
    expect(new Set(guides.map((guide) => guide.slug)).size).toBe(100);
    expect(new Set(guides.map((guide) => guide.title.toLocaleLowerCase("pl"))).size).toBe(100);
  });

  it("uses understandable descriptions, useful diagnostics and measurable checks", () => {
    for (const guide of guides) {
      expect(guide.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(guide.title.length).toBeGreaterThan(25);
      expect(guide.description.length).toBeGreaterThan(35);
      expect(guide.intro.length).toBeGreaterThan(75);
      expect(guide.category).toBe("rozwoj-firmy");
      expect(guide.sections).toHaveLength(4);
      for (const section of guide.sections) {
        expect(section.title.length).toBeGreaterThan(8);
        expect(section.paragraphs.join(" ").length).toBeGreaterThan(55);
      }
      expect(guide.service).toMatch(/^\//);
    }
  });
});
