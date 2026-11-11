import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const pet = readFileSync("src/components/BerniCompanion.tsx", "utf8");
const mascot = readFileSync("src/components/BerniRendered3D.tsx", "utf8");
const css = readFileSync("src/components/BerniRendered3D.module.css", "utf8");
const assistant = readFileSync("src/components/AIMascotAssistant.tsx", "utf8");
const image = readFileSync("public/berni-3d.svg", "utf8");

describe("Approved 3D Berni asset", () => {
  it("embeds an actual 3D image as a local self-contained asset", () => {
    expect(image).toContain("data:image/png;base64,iVBOR");
    expect(image.length).toBeGreaterThan(50_000);
    expect(image).not.toContain("https://");
    expect(css).toContain('url("/berni-3d.svg")');
    expect(mascot).toContain('data-testid="berni-rendered-3d"');
  });

  it("replaces the previous hand-drawn SVG at every visible entry point", () => {
    expect(pet).toContain("BerniRendered3D");
    expect(pet).not.toContain("BerniRobot");
    expect(assistant).toContain("BerniRendered3D");
    expect(assistant).not.toContain("BerniRobot");
    expect(assistant).toContain('<BerniRendered3D mood="sleeping"');
    expect(assistant).toContain('<BerniRendered3D mood={loading ? "typing" : "happy"}');
  });

  it("only shows the keyboard when Berni is answering or composing a nudge", () => {
    expect(pet).toContain('(loading || nudgeWriting) ? "typing"');
    expect(pet).not.toContain('input.trim() ? "typing"');
    expect(pet).toContain('setNudgeWriting(false), 850');
    expect(mascot).toContain('const typing = mood === "typing" || mood === "working"');
    expect(mascot).toContain('{typing ? (');
    expect(mascot).toContain('data-testid="berni-active-keyboard"');
  });

  it("has real layered animations rather than animating the same flat SVG", () => {
    for (const layer of ["bodyImage", "headImage", "headMotion", "headFollow", "figure", "shadow"]) {
      expect(mascot).toContain("styles." + layer);
      expect(css).toContain("." + layer);
    }
    for (const state of ["curious", "thinking", "typing", "happy", "excited", "surprised", "worried", "sleeping", "grabbed"]) {
      expect(css).toContain('data-mood="' + state + '"');
    }
    expect(css).toContain("--berni-look-x");
    expect(css).toContain('prefers-reduced-motion:reduce');
  });

  it("still supports portrait, dragging and accessibility", () => {
    expect(mascot).toContain('role="img"');
    expect(mascot).toContain('data-compact={compact ? "true" : "false"}');
    expect(pet).toContain("onPointerDown={handlePointerDown}");
    expect(pet).toContain("onPointerMove={handlePointerMove}");
    expect(pet).toContain('data-dragging={dragging ? "true" : "false"}');
    expect(assistant).toContain("onDragEnd={handleBerniDragEnd}");
  });
});
