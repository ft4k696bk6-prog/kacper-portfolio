import { describe, expect, it } from "vitest";
import { createKineticForm, projectKineticPoint } from "./kinetic-form";

describe("autonomous kinetic background", () => {
  it("changes perspective without pointer or scroll input", () => {
    const point = createKineticForm(4, 12)[1][3];
    const first = projectKineticPoint(point, 0);
    const next = projectKineticPoint(point, 3);
    expect(Math.hypot(next.x - first.x, next.y - first.y)).toBeGreaterThan(.1);
  });
  it("keeps projections finite throughout a full minute", () => {
    for (const line of createKineticForm(8, 16)) for (const point of line) {
      for (let time = 0; time <= 60; time += 2) {
        const p = projectKineticPoint(point, time);
        expect(Number.isFinite(p.x) && Number.isFinite(p.y)).toBe(true);
        expect(Math.abs(p.x)).toBeLessThan(3);
        expect(Math.abs(p.y)).toBeLessThan(3);
      }
    }
  });
});
