import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const component = readFileSync(new URL("../components/ui/parallax-scrolling.tsx", import.meta.url), "utf8");
const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

describe("upper-only hero scenery", () => {
  it("clips the moving image through a separate stationary window", () => {
    expect(component).toContain('className="scenic-backdrop-window"');
    expect(css.match(/\.scenic-backdrop-window\{([^}]+)\}/)?.[1]).toMatch(/overflow:hidden/);
    expect(css.match(/\.scenic-backdrop-window\{([^}]+)\}/)?.[1]).toMatch(/mask-image:/);
    expect(css.match(/\.scenic-backdrop-window\{([^}]+)\}/)?.[1]).toContain("clip-path:inset(0)");
    expect(css.match(/\.scenic-backdrop\{([^}]+)\}/)?.[1]).not.toMatch(/mask-image:/);
  });
  it("cannot reintroduce a second terrain layer beneath the portrait", () => {
    expect(component).not.toContain("scenic-terrain");
    expect(component).not.toContain('data-parallax-layer="2"');
    expect(component).not.toContain('querySelector(\'[data-parallax-layer="2"]\')');
    expect(css.match(/\.scenic-scene\{([^}]+)\}/)?.[1]).toContain("overflow:hidden");
  });
});
