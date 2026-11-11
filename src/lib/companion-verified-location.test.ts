import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { verifyCompanionIpCity } from "./companion-verified-location";
import type { CompanionServerContext } from "./companion-scenarios";

const candidate: CompanionServerContext = {
  location: {
    city: null,
    country: "PL",
    approximate: true,
    candidate: { city: "Warszawa", latitude: 52.2, longitude: 21.0 },
  },
  weather: {
    temperature: 5,
    windSpeed: 3,
    symbol: "cloudy",
    approximate: true,
    source: "MET Norway",
    sourceUrl: "https://www.met.no/en",
  },
};

describe("verified Berni city and weather", () => {
  it("never accepts IP city when browser coordinates are missing", () => {
    expect(verifyCompanionIpCity(candidate, null)).toBeNull();
  });

  it("rejects 5G/IP Warsaw if browser location says Rzeszow", () => {
    const result = verifyCompanionIpCity(candidate, {
      latitude: 50.0412, longitude: 21.9991, accuracy: 50,
    });
    expect(result).toBeNull();
  });

  it("only accepts an independently agreeing, accurate position", () => {
    const verified = verifyCompanionIpCity(candidate, {
      latitude: 52.222, longitude: 21.001, accuracy: 70,
    });
    expect(verified?.location.city).toBe("Warszawa");
    expect(verified?.weather?.temperature).toBe(5);
    expect(verified?.location.candidate).toBeUndefined();
  });

  it("rejects even matching IP location if browser accuracy is poor", () => {
    expect(verifyCompanionIpCity(candidate, {
      latitude: 52.2, longitude: 21.0, accuracy: 1700,
    })).toBeNull();
  });

  it("rejects nearby but different locations beyond the safety radius", () => {
    expect(verifyCompanionIpCity(candidate, {
      latitude: 52.29, longitude: 21.0, accuracy: 20,
    })).toBeNull();
  });

  it("never accepts coordinates outside real latitude and longitude bounds", () => {
    expect(verifyCompanionIpCity(candidate, {
      latitude: 122, longitude: 21.0, accuracy: 10,
    })).toBeNull();
  });
});

describe("Berni presentation and voice regression", () => {
  const assistant = readFileSync("src/components/AIMascotAssistant.tsx", "utf8");
  const pet = readFileSync("src/components/BerniCompanion.tsx", "utf8");
  const css = readFileSync("src/components/BerniRobot.module.css", "utf8");
  const route = readFileSync("src/app/api/companion-context/route.ts", "utf8");

  it("hides the WHOLE mascot until the actual intro is finished", () => {
    expect(assistant).toContain("!mounted || cookieBannerVisible || !introFinished");
    expect(assistant).toContain('attributeFilter: ["data-home-intro"]');
    expect(assistant).toContain('phase !== "armed" && phase !== "running"');
    expect(assistant).toContain("!mounted || !introFinished");
  });

  it("does not auto-prompt for geolocation and fails closed on IP guesses", () => {
    expect(assistant).toContain('permission.state !== "granted"');
    expect(assistant).toContain("verifyCompanionIpCity");
    expect(assistant).not.toContain("setServerContext(data)");
    expect(route).toContain("city: null");
    expect(route).toContain("candidate:");
    expect(route).not.toContain("const location = { city, country, approximate: true }");
  });

  it("removes browser SpeechRecognition and microphone controls entirely", () => {
    for (const forbidden of ["SpeechRecognition", "startDictation", "stopDictation", "dictationSupported", "MicOff", "listening={"]) {
      expect(assistant).not.toContain(forbidden);
    }
    expect(pet).not.toContain("listening");
    expect(assistant).toContain("placeholder={t.aiMascot.placeholder}");
    expect(assistant).toContain('data-testid="ai-chat-bubble"');
    expect(assistant).not.toContain("<BerniCompanion");
    expect(assistant).toContain('"/api/ai-consultant"');
  });

  it("adds frequent randomized gestures but respects reduced motion", () => {
    expect(pet).toContain("setIdleGesture(next)");
    expect(pet).toContain("Math.random()");
    expect(pet).toContain('prefers-reduced-motion: reduce');
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
    expect(css).toContain("animation: headIdle 3.9s");
    expect(css).toContain("animation: blink 4.6s");
  });
});
