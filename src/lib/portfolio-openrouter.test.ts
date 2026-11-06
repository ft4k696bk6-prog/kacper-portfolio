import { describe, expect, it } from "vitest";
import {
  buildPortfolioOpenRouterPrompt,
  isPortfolioTopic,
  offlinePortfolioAnswer,
  outsideScopeAnswer,
  PORTFOLIO_AI_MAX_QUESTION_LENGTH,
  PORTFOLIO_AI_MAX_RESPONSE_TOKENS,
  PORTFOLIO_AI_MODEL,
} from "./portfolio-openrouter";

describe("restricted portfolio OpenRouter configuration", () => {
  it("pins a single inexpensive model with strict token caps", () => {
    expect(PORTFOLIO_AI_MODEL).toBe("openai/gpt-oss-20b");
    expect(PORTFOLIO_AI_MAX_QUESTION_LENGTH).toBe(250);
    expect(PORTFOLIO_AI_MAX_RESPONSE_TOKENS).toBeLessThanOrEqual(256);
  });

  it("recognizes real portfolio questions in both languages", () => {
    expect(isPortfolioTopic("Jakie projekty stworzył Kacper?")).toBe(true);
    expect(isPortfolioTopic("Tell me about B-CRM and Motomizer")).toBe(true);
    expect(isPortfolioTopic("How can I contact Kacper?")).toBe(true);
  });

  it("refuses unrelated tasks before any paid model request", () => {
    expect(isPortfolioTopic("Napisz mi przepis na sernik")).toBe(false);
    expect(isPortfolioTopic("What is the capital of Canada?")).toBe(false);
    expect(isPortfolioTopic("Wymyśl opowiadanie o smokach")).toBe(false);
    expect(outsideScopeAnswer("pl")).toContain("Kacpra Berneckiego");
  });

  it("uses the site's actual public case study content", () => {
    const prompt = buildPortfolioOpenRouterPrompt("pl");
    expect(prompt).toContain("B-CRM");
    expect(prompt).toContain("Motomizer");
    expect(prompt).toContain("BeatMarket");
    expect(prompt).toContain("ONLY");
    expect(prompt).not.toContain("NVIDIA_API_KEY");
  });

  it("falls back without sending anything to another paid provider", () => {
    expect(offlinePortfolioAnswer("pl")).toContain("niedostępne");
  });
});
