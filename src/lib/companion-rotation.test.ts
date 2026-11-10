import { describe, expect, it } from "vitest";
import {
  COMPANION_SCENARIO_COUNT,
  getEligibleCompanionMessages,
  pickCompanionNudge,
  type CompanionContext,
  type CompanionTopic,
} from "./companion-scenarios";
import { expandedCompanionRules } from "./companion-expanded";

function context(override: Partial<CompanionContext> = {}): CompanionContext {
  return {
    lang: "pl", pathname: "/", city: "Rzeszów", country: "PL",
    weather: { temperature: 3, windSpeed: 4, symbol: "rain", approximate: true, source: "MET Norway", sourceUrl: "https://www.met.no/en" },
    device: "iphone", browser: "safari", hour: 1, day: 3, month: 10, date: 11,
    dark: true, touch: true, reducedMotion: false, width: 390, returning: true,
    ...override,
  };
}

describe("Berni >1000 authored combinations", () => {
  it("ships more than 1000 literal bilingual pre-authored message templates", () => {
    expect(expandedCompanionRules.length).toBeGreaterThanOrEqual(1000);
    expect(COMPANION_SCENARIO_COUNT).toBeGreaterThanOrEqual(1200);
    expect(new Set(expandedCompanionRules.map(r => r.id)).size).toBe(expandedCompanionRules.length);
    expect(new Set(expandedCompanionRules.map(r => r.pl)).size).toBe(expandedCompanionRules.length);
    expect(new Set(expandedCompanionRules.map(r => r.en)).size).toBe(expandedCompanionRules.length);
  });

  it("never guesses a specific device from browser window size", () => {
    for (const width of [320, 390, 414, 768, 1280, 1920]) {
      const messages = getEligibleCompanionMessages(context({
        city: null, weather: null, device: "unknown", browser: "other",
        width, pathname: "/",
      }));
      expect(messages.some(m => m.id.startsWith("exp-page-") || m.id.startsWith("exp-clock-") || m.id.startsWith("exp-weather-device-"))).toBe(false);
      expect(messages.some(m => /iPhone|iPad|Android|Windows|Linux|Linuksie|Macu/.test(m.text))).toBe(false);
    }
  });

  it("requires an actual city for every weather sentence, including double-signal variants", () => {
    const withoutCity = getEligibleCompanionMessages(context({ city: null }));
    expect(withoutCity.some(m => m.topic === "weather")).toBe(false);
    const withCity = getEligibleCompanionMessages(context());
    const weather = withCity.filter(m => m.topic === "weather");
    expect(weather.length).toBeGreaterThan(15);
    for (const message of weather) {
      expect(message.text.includes("Rzeszów") || message.text.includes("Rzeszowie")).toBe(true);
      expect(message.text).not.toMatch(/w twojej okolicy|u was|your area|around you/i);
    }
  });

  it("never leaves placeholders in contextualized copy", () => {
    const symbols = ["rain", "snow", "thunderstorm", "clearsky_day", "cloudy", "wind", "fog"];
    for (const lang of ["pl", "en"] as const) {
      for (const symbol of symbols) {
        const ctx = context({ lang, weather: { ...context().weather!, symbol, temperature: symbol === "snow" ? -8 : 33 } });
        const messages = getEligibleCompanionMessages(ctx);
        expect(messages.length).toBeGreaterThan(45);
        for (const m of messages) {
          expect(m.text).not.toMatch(/\{(?:city|place|temp|wind|width|onDevice|onTablet)\}/);
          expect(m.text.trim().length).toBeGreaterThan(20);
        }
      }
    }
  });

  it("avoids 80 consecutive repeats under identical iPhone + rainy night conditions", () => {
    const ctx = context();
    const ids: string[] = [];
    const topics: CompanionTopic[] = [];
    const families: string[] = [];
    const texts: string[] = [];
    for (let n = 0; n < 80; n++) {
      const chosen = pickCompanionNudge(ctx, ids, topics.at(-1), () => (n * 0.61803398875) % 1, {
        recentTopics: topics.slice(-6),
        recentFamilies: families.slice(-8),
        recentTexts: texts.slice(-150),
      });
      expect(chosen).not.toBeNull();
      expect(ids).not.toContain(chosen!.id);
      expect(texts).not.toContain(chosen!.text);
      ids.push(chosen!.id);
      topics.push(chosen!.topic);
      families.push(chosen!.family);
      texts.push(chosen!.text);
    }
  });

  it("avoids first-visit repeats even without IP weather or device identification", () => {
    const ctx = context({ city: null, weather: null, device: "unknown", browser: "other", touch: false });
    const seenIds: string[] = [], seenTexts: string[] = [], topics: CompanionTopic[] = [], families: string[] = [];
    for (let n = 0; n < 25; n++) {
      const selected = pickCompanionNudge(ctx, seenIds, topics.at(-1), () => (n * 0.71) % 1, {
        recentTopics: topics.slice(-6), recentFamilies: families.slice(-8), recentTexts: seenTexts.slice(-150),
      });
      expect(selected).not.toBeNull();
      expect(seenTexts).not.toContain(selected!.text);
      seenIds.push(selected!.id);
      seenTexts.push(selected!.text);
      topics.push(selected!.topic);
      families.push(selected!.family);
    }
  });

  it("actually changes the random choice when the source of randomness changes", () => {
    const ctx = context();
    const first = pickCompanionNudge(ctx, [], undefined, () => 0);
    const second = pickCompanionNudge(ctx, [], undefined, () => 0.9999);
    expect(first?.id).not.toBe(second?.id);
  });

  it("keeps category rotation when several topics are eligible", () => {
    const ctx = context();
    const recentIds: string[] = [], recentTopics: CompanionTopic[] = [], recentFamilies: string[] = [];
    for (let n = 0; n < 25; n++) {
      const choice = pickCompanionNudge(ctx, recentIds, recentTopics.at(-1), () => (n * 0.29) % 1, {
        recentTopics: recentTopics.slice(-3), recentFamilies: recentFamilies.slice(-4),
      });
      expect(choice).not.toBeNull();
      // No same topic back-to-back when there are plenty of fresh alternatives.
      if (n) expect(choice!.topic).not.toBe(recentTopics.at(-1));
      recentIds.push(choice!.id);
      recentTopics.push(choice!.topic);
      recentFamilies.push(choice!.family);
    }
  });
});
