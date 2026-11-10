import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  classifyBerniWeather,
  detectBerniReaction,
  getBerniTemperatureMood,
  getBerniWeatherLabel,
} from "./berni-reactions";

const robot = readFileSync(new URL("../components/BerniRobot.tsx", import.meta.url), "utf8");
const companion = readFileSync(new URL("../components/BerniCompanion.tsx", import.meta.url), "utf8");
const styles = readFileSync(new URL("../components/BerniRobot.module.css", import.meta.url), "utf8");
const assistant = readFileSync(new URL("../components/AIMascotAssistant.tsx", import.meta.url), "utf8");

describe("Berni weather scenarios", () => {
  it.each([
    ["clearsky_day", 2, "clear"],
    ["partlycloudy_night", 2, "clouds"],
    ["lightrain", 2, "rain"],
    ["heavyrainshowers", 3, "rain"],
    ["snow", 1, "snow"],
    ["lightsnowshowers_day", 2, "snow"],
    ["sleet", 1, "sleet"],
    ["lightsleetshowersandthunder_night", 1, "thunder"],
    ["heavyrainandthunder", 2, "thunder"],
    ["hail", 2, "hail"],
    ["fog", 1, "fog"],
    ["clearsky_day", 16, "wind"],
    ["unknown", 1, "unknown"],
  ] as const)("classifies %s at %s m/s as %s", (symbol, wind, result) => {
    expect(classifyBerniWeather(symbol, wind)).toBe(result);
  });

  it.each([
    [-15, "cold"], [0, "cold"], [2, "cold"], [3, "normal"],
    [20, "normal"], [28, "normal"], [29, "hot"], [40, "hot"],
  ] as const)("reacts to %s°C as %s", (temperature, result) => {
    expect(getBerniTemperatureMood(temperature)).toBe(result);
  });

  it("covers all weather symbols in Polish and English", () => {
    for (const condition of ["clear", "clouds", "rain", "snow", "sleet", "thunder", "hail", "fog", "wind"] as const) {
      expect(getBerniWeatherLabel(condition, "pl").length).toBeGreaterThan(2);
      expect(getBerniWeatherLabel(condition, "en").length).toBeGreaterThan(2);
    }
  });

  it("has an individual graphic treatment for each precipitation type", () => {
    for (const state of ["rain", "snow", "sleet", "thunder", "hail", "fog", "wind", "clear"]) {
      expect(robot).toContain('condition === "' + state + '"');
    }
    for (const animation of ["rainDrop", "snowFall", "lightning", "hailFall", "fogFlow", "shiver", "hotPant"]) {
      expect(styles).toContain("@keyframes " + animation);
    }
  });
});

describe("Berni conversation and interaction scenarios", () => {
  it.each([
    ["Wystąpił błąd. Spróbuj ponownie.", "worried"],
    ["The request failed.", "worried"],
    ["Udało się! Gotowe.", "excited"],
    ["Your booking is confirmed", "excited"],
    ["Haha, niezłe XD", "happy"],
    ["Przeanalizuj SEO mojej strony", "working"],
    ["Let's scan the website", "working"],
    ["Cześć!", "happy"],
    ["Umów spotkanie", "curious"],
    ["How much does this cost?", "curious"],
    ["No specific intent", "idle"],
  ] as const)("reacts to '%s' as %s", (message, expected) => {
    expect(detectBerniReaction(message)).toBe(expected);
  });

  it("replaces the old chat bubble without removing the existing chat functions", () => {
    expect(assistant).toContain("<BerniCompanion");
    expect(assistant).not.toContain('data-testid="ai-mascot-open"');
    expect(companion).toContain('data-testid="ai-mascot-open"');
    for (const kept of ['sendMessage(', 'renderBookingPanel()', '"/api/ai-consultant"', '"/api/tools/inspect"']) {
      expect(assistant).toContain(kept);
    }
  });

  it("tracks pointer with RAF, wakes from sleep and respects reduced motion", () => {
    expect(companion).toContain('window.requestAnimationFrame');
    expect(companion).toContain("if (sleeping) setSleeping(false)");
    expect(companion).toContain("document.visibilityState");
    expect(companion).toContain("window.cancelAnimationFrame");
    expect(styles).toContain("prefers-reduced-motion: reduce");
  });
});
