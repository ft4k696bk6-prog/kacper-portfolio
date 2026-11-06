import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

function token(name: string) {
  const value = css.match(new RegExp(name + ":\\s*(#[a-f0-9]{6})", "i"))?.[1];
  if (!value) throw new Error("Missing brand color: " + name);
  return value;
}

function luminance(hex: string) {
  const channels = hex.slice(1).match(/../g)!.map((part) => {
    const value = parseInt(part, 16) / 255;
    return value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4;
  });
  return channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722;
}

function contrast(first: string, second: string) {
  const a = luminance(first), b = luminance(second);
  return (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
}

describe("champagne accent readability", () => {
  it.each(["--brand-gold", "--brand-gold-hover"])("keeps dark CTA text at AAA contrast on %s", (name) => {
    expect(contrast(token(name), "#171717")).toBeGreaterThanOrEqual(7);
  });

  it("keeps small gold labels readable against the dark section surfaces", () => {
    for (const background of ["#070707", "#0b0b0b", "#101010"]) {
      expect(contrast(token("--brand-gold"), background)).toBeGreaterThanOrEqual(7);
    }
  });
});
