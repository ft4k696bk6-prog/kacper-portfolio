import { describe, expect, it } from "vitest";
import {
  COMPANION_SCENARIO_COUNT,
  pickCompanionNudge,
  type CompanionContext,
} from "./companion-scenarios";

function context(overrides: Partial<CompanionContext> = {}): CompanionContext {
  return {
    lang: "pl",
    pathname: "/",
    city: null,
    country: "PL",
    weather: null,
    device: "desktop",
    browser: "other",
    hour: 12,
    day: 2,
    month: 6,
    dark: true,
    touch: false,
    reducedMotion: false,
    width: 1280,
    returning: false,
    ...overrides,
  };
}

describe("authored companion notifications", () => {
  it("has a broad library rather than a handful of repetitive AI replies", () => {
    expect(COMPANION_SCENARIO_COUNT).toBeGreaterThanOrEqual(130);
  });

  it("has no unresolved placeholders without weather or geolocation", () => {
    const ctx = context();
    const history: string[] = [];
    for (let i = 0; i < 50; i += 1) {
      const next = pickCompanionNudge(ctx, history, undefined, () => 0);
      expect(next?.text).toBeTruthy();
      expect(next?.text).not.toMatch(/\\{(?:city|temp|wind)\\}/);
      if (next) history.push(next.id);
    }
  });

  it("renders Polish templates safely for IP-based city and weather", () => {
    const ctx = context({
      device: "iphone",
      city: "Rzeszów",
      weather: {
        temperature: -11,
        windSpeed: 15,
        symbol: "snow",
        approximate: true,
        source: "MET Norway",
        sourceUrl: "https://www.met.no/en",
      },
      hour: 1,
      returning: true,
    });
    const recent: string[] = [];
    for (let i = 0; i < 70; i += 1) {
      const choice = pickCompanionNudge(ctx, recent, undefined, () => 0);
      expect(choice?.text).not.toContain("{city}");
      expect(choice?.text).not.toContain("{temp}");
      expect(choice?.text).not.toContain("{wind}");
      if (choice) recent.push(choice.id);
    }
  });

  it("supports English without mixing in Polish scenario copy", () => {
    const result = pickCompanionNudge(context({ lang: "en", device: "iphone", hour: 0 }), [], undefined, () => 0);
    expect(result).not.toBeNull();
    expect(result?.text.length).toBeGreaterThan(10);
    expect(result?.text).not.toContain("Widz");
  });

  it("does not claim that a generic device is an exact iPhone model", () => {
    const ctx = context({ device: "mobile", browser: "safari" });
    const recent: string[] = [];
    for (let i = 0; i < 30; i += 1) {
      const next = pickCompanionNudge(ctx, recent, undefined, () => 0);
      expect(next?.text).not.toContain("iPhonie");
      expect(next?.text).not.toContain("256 GB");
      if (next) recent.push(next.id);
    }
  });
});
