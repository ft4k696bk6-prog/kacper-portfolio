import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const css = readFileSync("src/components/BerniRobot.module.css", "utf8");
const robot = readFileSync("src/components/BerniRobot.tsx", "utf8");
const companion = readFileSync("src/components/BerniCompanion.tsx", "utf8");

describe("Berni complete animation coverage", () => {
  it("defines every keyframe referenced by active animation declarations", () => {
    const definitions = new Set([...css.matchAll(/@keyframes\s+([a-zA-Z][\w-]*)/g)].map(m => m[1]));
    const references = [...css.matchAll(/\banimation\s*:\s*([a-zA-Z][\w-]*)/g)]
      .map(m => m[1]).filter(name => name !== "none");
    expect(definitions.size).toBeGreaterThanOrEqual(25);
    for (const name of references) {
      expect(definitions.has(name), "Missing @keyframes " + name).toBe(true);
    }
  });

  it.each([
    ["idle", [".head", ".body", ".tail", ".eyeLights"]],
    ["typing", ['data-mood="typing"', ".keyboardRig", ".typePawLeft", ".typePawRight"]],
    ["curious", ['data-mood="curious"', "curiousTilt"]],
    ["thinking", ['data-mood="thinking"', "thinkingLook", ".thought"]],
    ["working", ['data-mood="working"', ".keyboardRig"]],
    ["sleeping", ['data-mood="sleeping"', "asleep", "sleepFloat"]],
    ["happy", ['data-mood="happy"', "tailWag"]],
    ["excited", ['data-mood="excited"', "happyBounce"]],
    ["surprised", ['data-mood="surprised"', "startled"]],
    ["worried", ['data-mood="worried"', "worried"]],
    ["grabbed", ['data-mood="grabbed"', "grabbedLift", "grabbedHead", "grabbedEars", "grabbedTail"]],
  ] as const)("provides visual behavior for %s mood", (_mood, required) => {
    for (const marker of required) expect(css).toContain(marker);
  });

  it.each([
    ["clear", "sunPulse"],
    ["rain", "rainDrop"],
    ["snow", "snowFall"],
    ["sleet", "snowFall"],
    ["thunder", "lightning"],
    ["hail", "hailFall"],
    ["fog", "fogFlow"],
    ["wind", "fogFlow"],
  ] as const)("renders %s weather with %s animation", (weather, fx) => {
    expect(robot).toContain('condition === "' + weather + '"');
    expect(css).toContain("@keyframes " + fx);
  });

  it("animates heat/cold and preserves prefers-reduced-motion", () => {
    expect(css).toContain('data-thermal="cold"');
    expect(css).toContain('data-thermal="hot"');
    expect(css).toContain("shiver");
    expect(css).toContain("hotPant");
    expect(css).toContain("animation: none !important");
    expect(companion).toContain("prefers-reduced-motion: reduce");
  });

  it("types while Berni answers or composes a note, not while a visitor writes", () => {
    const begin = companion.indexOf("const robotMood:");
    const section = companion.slice(begin, begin + 310);
    expect(begin).toBeGreaterThan(0);
    expect(section).toContain('dragging ? "grabbed"');
    expect(section).toContain('(loading || nudgeWriting) ? "typing"');
    expect(section).not.toContain('input.trim() ? "typing"');
    expect(companion).toContain('setNudgeWriting(false), 850');
  });

  it("lets CSS inherit actual pointer tracking from the host", () => {
    expect(companion).toContain('host.style.setProperty("--berni-look-x"');
    expect(companion).toContain('host.style.setProperty("--berni-look-y"');
    expect(css).toContain("var(--berni-look-x, 0px)");
    expect(css).not.toContain("--berni-look-x: 0px");
  });
});
