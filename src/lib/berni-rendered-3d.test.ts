import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const pet = readFileSync("src/components/BerniCompanion.tsx", "utf8");
const core = readFileSync("src/components/BerniCore.tsx", "utf8");
const css = readFileSync("src/components/BerniCore.module.css", "utf8");
const assistant = readFileSync("src/components/AIMascotAssistant.tsx", "utf8");

describe("Berni Core premium character", () => {
  it("is the displayed character both in chat and in the draggable companion", () => {
    expect(pet).toContain("import { BerniCore }");
    expect(pet).toContain("<BerniCore mood={robotMood}");
    expect(assistant).toContain("import { BerniCore }");
    expect(assistant).toContain('<BerniCore mood="sleeping"');
    expect(assistant).toContain('<BerniCore mood={loading ? "typing" : "happy"}');
    expect(pet).not.toContain("BerniRendered3D");
    expect(assistant).not.toContain("BerniRendered3D");
  });

  it("has a distinctive black visor, titanium shell, LED face and ear fins", () => {
    for (const name of ["helmet","visor","faceSheen","matrix","leftFin","rightFin","eyes","eyeLeft","eyeRight","mouth","chinPlate"]) {
      expect(core).toContain("styles." + name);
      expect(css).toContain("." + name);
    }
    expect(css).toContain("radial-gradient");
    expect(css).toContain("linear-gradient");
    expect(css).toContain("#fafcfe");
    expect(css).toContain("#080b0e");
    expect(core).not.toContain("model-viewer");
    expect(core).not.toContain(".glb");
    expect(core).not.toContain("https://");
  });

  it("supports all emotional reactions and distinct eyes and mouths", () => {
    for (const mood of ["curious", "happy", "excited", "surprised", "worried", "thinking", "typing", "working", "sleeping", "listening", "grabbed"]) {
      expect(css).toContain('data-mood="' + mood + '"');
    }
    expect(core).toContain('data-mood={mood}');
    expect(core).toContain('data-testid="berni-core"');
  });

  it("only shows keyboard for AI output and never while visitor enters text", () => {
    expect(core).toContain('mood === "typing" || mood === "working"');
    expect(core).toContain('data-testid="berni-active-keyboard"');
    expect(core).toContain("isTyping && !compact");
    expect(pet).toContain('(loading || nudgeWriting) ? "typing"');
    expect(pet).not.toContain('input.trim() ? "typing"');
    expect(pet).toContain("setNudgeWriting(false), 850");
  });

  it("works as a small chat avatar, supports weather and reduces motion", () => {
    expect(core).toContain('data-compact={compact ? "true" : "false"}');
    expect(core).toContain('data-weather={weather?.condition ?? "unknown"}');
    expect(core).toContain("getBerniTemperatureMood");
    expect(css).toContain('[data-weather="rain"]');
    expect(css).toContain("prefers-reduced-motion: reduce");
    expect(css).toContain("animation:none!important");
    expect(pet).toContain("onPointerDown={handlePointerDown}");
    expect(pet).toContain("onPointerMove={handlePointerMove}");
  });

  it("contains no new external scripts, WebGL or paid runtime", () => {
    expect(core).not.toMatch(/<canvas|new WebGL|model-viewer|\\.riv|\\.lottie|\\.glb|iframe/);
    expect(css).not.toMatch(/https?:\\/\\//);
    const declared = new Set([...css.matchAll(/@keyframes\s+([a-zA-Z][\w-]*)/g)].map(m => m[1]));
    const animations = [...css.matchAll(/animation:\s*([a-zA-Z][\w-]*)/g)].map(m => m[1]).filter(x => x !== "none");
    for (const name of animations) expect(declared.has(name), "Missing @keyframes " + name).toBe(true);
  });
});
