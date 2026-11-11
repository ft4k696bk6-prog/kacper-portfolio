import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const robot = readFileSync(new URL("../components/BerniRobot.tsx", import.meta.url), "utf8");
const css = readFileSync(new URL("../components/BerniRobot.module.css", import.meta.url), "utf8");
const companion = readFileSync(new URL("../components/BerniCompanion.tsx", import.meta.url), "utf8");

describe("Berni premium custom vector", () => {
  it("uses custom layered silver materials, not a downloaded mascot", () => {
    for (const material of ["metal", "shell", "visor", "glass", "chrome", "eyeLight", "sole"]) {
      expect(robot).toContain('id={id+"' + material + '"}');
    }
    expect(robot).toContain('viewBox="0 0 160 160"');
    expect(robot).not.toMatch(/<image\s|\.png|\.webp|\.gif|iframe|href=["\x27]https?:/i);
  });

  it("contains physical parts and an expressive face rather than a flat icon", () => {
    for (const part of ["shadow", "feet", "arms", "armLeft", "armRight", "coreLight",
      "body", "head", "earLeft", "earRight", "tail", "eyes", "eyeLights", "mouth"]) {
      expect(robot).toContain("styles." + part);
      expect(css).toContain("." + part);
    }
    for (const mood of ["sleeping", "grabbed", "surprised", "worried", "thinking", "working", "excited"]) {
      expect(robot).toContain('"' + mood + '"');
    }
  });

  it("defines every referenced paint and filter in the SVG", () => {
    const paints = [...robot.matchAll(/paint\("([\w]+)"\)/g)].map(match => match[1]);
    expect(paints.length).toBeGreaterThan(15);
    for (const key of new Set(paints)) {
      expect(robot).toContain('id={id+"' + key + '"}');
    }
    expect(robot).not.toContain('id + "glow"');
  });

  it("is animated on entrance and returns to life after a notification", () => {
    for (const animation of [
      "premiumReveal", "premiumHeadIdle", "premiumBreathe", "premiumTail",
      "premiumBlink", "premiumCurious", "friendlyWave", "premiumPickedUp",
      "premiumDangle", "premiumSleep", "premiumThink", "premiumSurprise", "premiumWorried",
    ]) expect(css).toContain("@keyframes " + animation);
    expect(companion).toContain('setReaction(null), 5200');
    expect(companion).toContain('Math.random() * 3200');
  });

  it("preserves interactive typing and dragging, and never forces motion", () => {
    for (const state of ['data-mood="typing"', 'data-mood="grabbed"']) {
      expect(css).toContain(state);
    }
    expect(robot).toContain("styles.keyboardRig");
    expect(robot).toContain("styles.grabFx");
    expect(companion).toContain("onPointerDown={handlePointerDown}");
    expect(companion).toContain("onPointerMove={handlePointerMove}");
    expect(companion).toContain("onPointerUp={finishPointer}");
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
    expect(css).toContain("animation: none !important");
  });

  it("keeps all expected weather effects and small chat portrait", () => {
    for (const condition of ["clear", "clouds", "rain", "snow", "sleet", "thunder", "hail", "fog", "wind"]) {
      expect(robot).toContain('condition === "' + condition + '"');
    }
    expect(robot).toContain('data-compact={compact ? "true" : "false"}');
    expect(css).toContain('.stage[data-compact="true"]');
  });
});
