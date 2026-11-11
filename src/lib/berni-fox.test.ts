import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";

const portrait = readFileSync("src/components/BerniPremiumPortrait.tsx", "utf8");
const css = readFileSync("src/components/BerniPremiumPortrait.module.css", "utf8");
const chat = readFileSync("src/components/AIMascotAssistant.tsx", "utf8");
const preview = readFileSync("src/app/(pl)/berni-preview/page.tsx", "utf8");

describe("Premium 3/4 Berni on the actual website", () => {
  it("uses a detailed local image rather than hand-drawn SVG or remote asset", () => {
    expect(existsSync("public/images/berni/berni-fox-head.png")).toBe(true);
    expect(portrait).toContain('src="/images/berni/berni-fox-head.png"');
    expect(portrait).toContain('from "next/image"');
    expect(portrait).not.toContain("<svg");
    expect(portrait).not.toContain("BerniFoxHead");
  });
  it("places the portrait in both the chat launcher and chat header", () => {
    expect(chat).toContain("<BerniPremiumPortrait");
    expect(chat).toContain('size={56}');
    expect(chat).toContain('size={36}');
    expect(chat).toContain('data-testid="ai-chat-bubble"');
    expect(chat).not.toContain("BerniFoxHead");
  });
  it("reacts to real AI states and keeps the actual conversation", () => {
    expect(chat).toContain("detectBerniReaction(lastMessage.content)");
    expect(chat).toContain('loading ? "thinking"');
    expect(chat).toContain('error ? "worried"');
    expect(chat).toContain('onClick={() => openChat()}');
    expect(chat).toContain('"/api/ai-consultant"');
    expect(chat).toContain('"/api/booking"');
  });
  it("includes restrained animations and no artificial ugly costume overlays", () => {
    for (const mood of ["idle", "thinking", "curious", "happy", "excited", "sleeping", "worried", "typing"]) {
      expect(portrait).toContain(mood);
    }
    expect(css).toContain("prefers-reduced-motion:reduce");
    const defined = new Set([...css.matchAll(/@keyframes\s+([a-zA-Z][\w-]*)/g)].map(match => match[1]));
    const used = [...css.matchAll(/\banimation:\s*([a-zA-Z][\w-]*)/g)].map(match => match[1]).filter(v => v !== "none");
    expect(defined.size).toBeGreaterThanOrEqual(8);
    for (const keyframe of used) expect(defined.has(keyframe)).toBe(true);
  });
  it("renders actual expression image assets with eye and mouth masks", () => {
    for (const emotion of ["blink", "happy", "surprised", "thinking", "worried", "talking", "wink"]) {
      expect(existsSync("public/images/berni/moods/" + emotion + ".jpg")).toBe(true);
      expect(portrait).toContain('moods/' + emotion + '.jpg');
    }
    expect(portrait).toContain('data-testid="berni-eye-blink"');
    expect(portrait).toContain('data-testid="berni-mouth-animation"');
    expect(portrait).toContain("facialFrameForMood(actualMood)");
    expect(css).toContain("@keyframes berniEyelids");
    expect(css).toContain("@keyframes berniSpeak");
    expect(css).toContain("-webkit-mask-image");
    expect(css).toContain("mask-image");
  });
  it("actually speaks first and then reacts to each assistant response", () => {
    expect(chat).toContain('setFoxReaction("typing")');
    expect(chat).toContain('setFoxReaction(detected === "idle" ? "happy" : detected)');
    expect(chat).toContain("speakTimer");
    expect(chat).toContain("resetTimer");
  });
  it("has a dedicated preview featuring large and 56px portraits", () => {
    expect(preview).toContain('size={320}');
    expect(preview).toContain('size={56}');
    expect(preview).toContain("BerniPremiumPortrait");
  });
});
