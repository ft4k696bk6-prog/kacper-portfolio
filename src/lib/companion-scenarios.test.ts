import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import {
  COMPANION_SCENARIO_COUNT,
  formatCompanionPlace,
  getEligibleCompanionMessages,
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
    device: "unknown",
    browser: "other",
    hour: 12,
    day: 2,
    month: 6,
    date: 11,
    dark: true,
    touch: false,
    reducedMotion: false,
    width: 390,
    returning: false,
    ...overrides,
  };
}

const wx = {
  temperature: -7, windSpeed: 15, symbol: "snow",
  approximate: true as const, source: "MET Norway" as const,
  sourceUrl: "https://www.met.no/en",
};

describe("companion wow copy: grounded context", () => {
  it("contains over 200 individually authored bilingual variants", () => {
    expect(COMPANION_SCENARIO_COUNT).toBeGreaterThanOrEqual(200);
  });

  it("does not emit any location/weather messages if the city is unknown", () => {
    const messages = getEligibleCompanionMessages(context({ weather: wx }));
    expect(messages.filter(message => message.category === "weather")).toEqual([]);
    expect(messages.filter(message => message.category === "location")).toEqual([]);
    expect(messages.filter(message => message.topic === "weather")).toEqual([]);
    expect(messages.some(message => message.category === "viewport")).toBe(true);
  });

  it("inflects named Polish places correctly and has a grammatical fallback", () => {
    const cases: Array<[string, string]> = [
      ["Rzeszów", "w Rzeszowie"], ["Warszawa", "w Warszawie"],
      ["Lublin", "w Lublinie"], ["Bieszczady", "w Bieszczadach"],
      ["Kraków", "w Krakowie"], ["Wrocław", "w Wrocławiu"],
      ["Gdańsk", "w Gdańsku"], ["London", "w Londynie"],
    ];
    for (const [city, expected] of cases) {
      expect(formatCompanionPlace(city, "pl")).toBe(expected);
    }
    expect(formatCompanionPlace("Unknownville", "pl")).toBe("Unknownville —");
    expect(formatCompanionPlace("Warsaw", "en")).toBe("in Warsaw");
  });

  it("names the real city in every weather and location response", () => {
    const cases = ["Rzeszów", "Warszawa", "Lublin", "Bieszczady", "Unknownville"];
    for (const city of cases) {
      const sample = context({ city, weather: wx, device: "iphone", hour: 0 });
      const expected = city === "Unknownville" ? city : city === "Rzeszów"
        ? "Rzeszowie" : city === "Warszawa" ? "Warszawie" :
        city === "Lublin" ? "Lublinie" : "Bieszczadach";
      const relevant = getEligibleCompanionMessages(sample)
        .filter(msg => msg.topic === "weather" || msg.category === "location");
      expect(relevant.length).toBeGreaterThan(10);
      for (const message of relevant) {
        expect(message.text.includes(expected) || message.text.includes(city)).toBe(true);
        expect(message.text).not.toMatch(/Twojej okolicy|u Was|your area|in your area/i);
        expect(message.text).not.toMatch(/\{(?:city|place|temp|wind|onDevice|width)\}/);
      }
    }
  });

  it("only announces a known device, never guesses from window width", () => {
    for (const width of [320, 390, 768, 1366, 1920]) {
      const ctx = context({ device: "unknown", width, touch: false });
      const messages = getEligibleCompanionMessages(ctx);
      expect(messages.filter(message => message.category === "device")).toEqual([]);
      expect(messages.filter(message => message.text.includes("iPhone") || message.text.includes("Android") || message.text.includes("Linux") || message.text.includes("iPad"))).toEqual([]);
      expect(messages.filter(message => message.category === "viewport").length).toBeGreaterThan(0);
      expect(messages.some(message => message.text.includes(String(width)) && message.text.includes("px"))).toBe(true);
    }
  });

  it("uses iPhone, Android, iPad, tablet, Linux, Mac and Windows only when detected", () => {
    const tests: Array<[CompanionContext["device"], string]> = [
      ["iphone", "iPhone"], ["android", "Android"],
      ["ipad", "iPad"], ["tablet", "tablet"],
      ["linux", "Linux"], ["mac", "Mac"], ["windows", "Windows"],
    ];
    for (const [device, name] of tests) {
      const messages = getEligibleCompanionMessages(context({ device }));
      expect(messages.some(msg => msg.category === "device" && msg.text.toLowerCase().includes(name.toLowerCase()))).toBe(true);
    }
  });

  it("supports combined iPhone + city + night and visible window-width messages", () => {
    const messages = getEligibleCompanionMessages(context({ city: "Rzeszów", device: "iphone", hour: 1, width: 390 }));
    expect(messages.some(msg => msg.id.startsWith("combo-iphone-city-night") && msg.text.includes("Rzeszowie"))).toBe(true);
    expect(messages.some(msg => msg.id.startsWith("combo-iphone-viewport") && msg.text.includes("390"))).toBe(true);
  });

  it("fully substitutes every placeholder in each eligible Polish and English variant", () => {
    const devices: CompanionContext["device"][] = ["unknown", "iphone", "android", "ipad", "tablet", "mac", "windows", "linux"];
    const weatherTypes = [null, wx, { ...wx, temperature: 34, symbol: "clearsky_day" }, { ...wx, temperature: 12, symbol: "rain" }, { ...wx, temperature: 17, symbol: "thunderstorm" }];
    for (const lang of ["pl", "en"] as const) for (const city of [null, "Rzeszów", "London"]) {
      for (const device of devices) for (const weather of weatherTypes) {
        const ctx = context({ lang, city, device, weather, hour: 0, pathname: "/narzedzia/audyt-strony" });
        for (const message of getEligibleCompanionMessages(ctx)) {
          expect(message.text.trim().length).toBeGreaterThan(12);
          expect(message.text).not.toMatch(/\{(?:city|place|temp|wind|width|onDevice|onTablet)\}/);
          if (!city) expect(message.category).not.toBe("location");
          if (message.topic === "weather") expect(city).not.toBeNull();
        }
      }
    }
  });

  it("does not repeat the same message when it has alternatives", () => {
    const ctx = context({ city: "Rzeszów", weather: wx, device: "iphone", hour: 1 });
    const first = pickCompanionNudge(ctx, [], undefined, () => 0);
    const second = pickCompanionNudge(ctx, [first!.id], first!.topic, () => 0);
    expect(first).not.toBeNull();
    expect(second).not.toBeNull();
    expect(second?.id).not.toBe(first?.id);
  });

  it("keeps the popup strictly to message content and an opt-out action", () => {
    const ui = readFileSync("src/components/AIMascotAssistant.tsx", "utf8");
    const start = ui.indexOf('data-testid="ai-mascot-nudge"');
    const end = ui.indexOf('data-testid="ai-mascot-open"', start);
    expect(start).toBeGreaterThan(0);
    const popup = ui.slice(start, end);
    expect(popup).toContain("nudge.text");
    expect(popup).toContain("Nie pokazuj więcej");
    expect(popup).not.toContain("Asystent AI · podpowiedź");
    expect(popup).not.toContain("Odpowiedz →");
    expect(popup).not.toContain("Prognoza: MET Norway");
    expect(popup).not.toContain("handleNudgeAction");
    expect(popup).not.toContain("onClick={dismissNudge}");
  });
});
