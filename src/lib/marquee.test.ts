import { describe, expect, it } from "vitest";
import { wrapMarqueePosition } from "./marquee";

describe("infinite client strip", () => {
  it("wraps in both directions without changing the visible content offset", () => {
    for (const direction of [-1, 1]) {
      let position = 1800;
      for (let step = 1; step <= 100; step++) {
        position = wrapMarqueePosition(position + direction * 300, 1800);
        expect(position).toBeGreaterThanOrEqual(1800);
        expect(position).toBeLessThan(3600);
        expect(position % 1800).toBe(((direction * step * 300) % 1800 + 1800) % 1800);
      }
    }
  });
  it("preserves subpixel automatic movement and large drag offsets", () => {
    expect(wrapMarqueePosition(1799.6, 1800)).toBeCloseTo(3599.6);
    expect(wrapMarqueePosition(5400, 1800)).toBe(1800);
    expect(wrapMarqueePosition(-5400, 1800)).toBe(1800);
  });
  it("handles a not-yet-measured track", () => {
    expect(wrapMarqueePosition(100, 0)).toBe(0);
    expect(wrapMarqueePosition(NaN, 1800)).toBe(0);
  });
});
