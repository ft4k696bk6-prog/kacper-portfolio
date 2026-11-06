import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("shared visual system", () => {
  it.each(["LanguageSwitcher", "BookingCalendar", "Contact", "ContactReveal", "AIMascotAssistant", "Hero", "Services", "Profile", "Experience"])("removes legacy silver treatments from %s", name => {
    const source = readFileSync(new URL(`../components/${name}.tsx`, import.meta.url), "utf8");
    expect(source).not.toMatch(/#(?:f4f4f5|e4e4e7|c9a86a)|rgba\(244,244,245|text-zinc-/);
  });
  it("keeps the calendar and header icon on the shared gold treatment", () => {
    const calendar = readFileSync(new URL("../components/BookingCalendar.tsx", import.meta.url), "utf8");
    expect(calendar).toContain("ui-panel");
    expect(calendar).toContain("ui-icon");
    expect(calendar).not.toContain("linear-gradient");
  });
});
