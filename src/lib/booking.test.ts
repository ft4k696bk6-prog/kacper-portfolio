import { describe, expect, it } from "vitest";
import {
  addDays,
  getBookingDateStatus,
  getBookingDays,
  getWeekdayIndex,
} from "./booking";

describe("booking calendar rules", () => {
  it("blocks Saturdays, Sundays and Mondays", () => {
    expect(getWeekdayIndex("2026-05-23")).toBe(6);
    expect(getBookingDateStatus("2026-05-23", "2026-05-18")).toMatchObject({
      blocked: true,
      reason: "weekend",
    });
    expect(getBookingDateStatus("2026-05-24", "2026-05-18")).toMatchObject({
      blocked: true,
      reason: "weekend",
    });
    expect(getBookingDateStatus("2026-05-25", "2026-05-18")).toMatchObject({
      blocked: true,
      reason: "monday",
    });
  });

  it("blocks the travel window inclusively", () => {
    expect(getBookingDateStatus("2026-05-27", "2026-05-18")).toMatchObject({
      blocked: true,
      reason: "vacation",
    });
    expect(getBookingDateStatus("2026-06-04", "2026-05-18")).toMatchObject({
      blocked: true,
      reason: "vacation",
    });
  });

  it("keeps regular weekdays available outside blocked ranges", () => {
    expect(getBookingDateStatus("2026-05-26", "2026-05-18")).toEqual({
      blocked: false,
    });
    expect(getBookingDateStatus("2026-06-05", "2026-05-18")).toEqual({
      blocked: false,
    });
  });

  it("generates available day tiles from the current Warsaw date", () => {
    const days = getBookingDays({
      count: 3,
      now: new Date("2026-05-18T10:00:00.000Z"),
      locale: "pl-PL",
    });

    expect(days.map((day) => day.date)).toEqual([
      "2026-05-19",
      "2026-05-20",
      "2026-05-21",
    ]);
    expect(days.every((day) => day.blocked === false)).toBe(true);
  });

  it("returns twelve available days and skips the travel window", () => {
    const days = getBookingDays({
      now: new Date("2026-05-18T10:00:00.000Z"),
      locale: "pl-PL",
    });

    expect(days).toHaveLength(12);
    expect(days.map((day) => day.date)).not.toContain("2026-05-27");
    expect(days.map((day) => day.date)).not.toContain("2026-06-04");
    expect(days.every((day) => ![0, 1, 6].includes(getWeekdayIndex(day.date)))).toBe(true);
  });

  it("adds days without timezone drift", () => {
    expect(addDays("2026-05-31", 1)).toBe("2026-06-01");
  });
});
