import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("shared visual system", () => {
  it.each(["LanguageSwitcher", "BookingCalendar", "Contact", "ContactReveal", "AIMascotAssistant", "Hero", "Services", "Profile", "Experience"])("removes legacy silver treatments from %s", name => {
    const source = readFileSync(new URL(`../components/${name}.tsx`, import.meta.url), "utf8");
    expect(source).not.toMatch(/#(?:f4f4f5|e4e4e7|c9a86a)|rgba\(244,244,245|text-zinc-/);
  });
  it("keeps calendar panels and icons on the shared treatment", () => {
    const calendar = readFileSync(new URL("../components/BookingCalendar.tsx", import.meta.url), "utf8");
    expect(calendar).toContain("ui-panel");
    expect(calendar).toContain("ui-icon");
    expect(calendar).not.toContain("linear-gradient");
  });
  it("applies the same page system to every page family", () => {
    for (const file of [
      "components/CaseStudyPage.tsx", "components/ServiceLandingPage.tsx", "components/ChoosePortfolio.tsx",
      "app/(pl)/case-studies/page.tsx", "app/(pl)/case-studies/re-energy-meta-ads/page.tsx",
      "app/(pl)/poradniki/page.tsx", "app/(pl)/poradniki/[slug]/page.tsx", "app/(pl)/realizacje/[slug]/page.tsx",
      "app/(pl)/reklamy-meta-ads-dla-firm/page.tsx", "app/not-found.tsx",
    ]) {
      expect(readFileSync(new URL(`../${file}`, import.meta.url), "utf8")).toContain('className="site-page ');
    }
  });
});
