import { describe, it, expect } from "vitest";
import { calculateVat, formatVatCurrency, parseVatAmount } from "./vat-calculator";
import { clampBerniPosition, normalizeBerniPosition, denormalizeBerniPosition, isBerniDragGesture } from "./berni-drag";
import { readFileSync } from "node:fs";

describe("VAT calculator: money and 8%/23% rate", () => {
  it.each([
    ["1000", 100000], ["1000,00", 100000], ["1 000,00", 100000],
    ["1000.00", 100000], ["1.000,00", 100000], ["1,000.00", 100000],
    ["0,01", 1], ["1.234", 123400], ["1 234,56", 123456],
  ] as const)("parses %s to %i grosz", (input, expected) => {
    expect(parseVatAmount(input)).toBe(expected);
  });
  it.each(["", "abc", "-1", "1,2222", "1.2.3", "1,234,567", "Infinity", "12 zł"])("rejects malformed or negative %s", input => {
    expect(parseVatAmount(input)).toBeNull();
  });
  it.each([
    [8, "net-to-gross", 100000, 100000, 8000, 108000],
    [23, "net-to-gross", 100000, 100000, 23000, 123000],
    [8, "gross-to-net", 108000, 100000, 8000, 108000],
    [23, "gross-to-net", 123000, 100000, 23000, 123000],
    [8, "gross-to-net", 10000, 9259, 741, 10000],
    [23, "gross-to-net", 10000, 8130, 1870, 10000],
    [23, "net-to-gross", 1, 1, 0, 1],
  ] as const)("VAT %i %s on %i grosz", (rate, direction, input, net, vat, gross) => {
    expect(calculateVat(input, rate, direction)).toEqual({
      netCents: net, taxCents: vat, grossCents: gross, rate,
    });
  });
  it("supports zero price and rejects negative or enormous inputs", () => {
    expect(calculateVat(0, 23, "net-to-gross")).toMatchObject({ netCents: 0, taxCents: 0, grossCents: 0 });
    expect(calculateVat(-1, 8, "net-to-gross")).toBeNull();
    expect(parseVatAmount("999999999999999999")).toBeNull();
  });
  it("formats output to exactly two decimal places in PL/EN", () => {
    expect(formatVatCurrency(123456, "pl")).toContain("1");
    expect(formatVatCurrency(123456, "pl")).toContain("234,56");
    expect(formatVatCurrency(123456, "en")).toContain("1,234.56");
  });
});

describe("Berni drag behavior and animations", () => {
  const pet = readFileSync("src/components/BerniCompanion.tsx", "utf8");
  const robot = readFileSync("src/components/BerniRobot.tsx", "utf8");
  const css = readFileSync("src/components/BerniRobot.module.css", "utf8");
  const assistant = readFileSync("src/components/AIMascotAssistant.tsx", "utf8");
  it("clamps mouse/touch dragging to viewport after resizing", () => {
    expect(clampBerniPosition({ x: -100, y: 5000 }, { width: 390, height: 844 }, { width: 100, height: 100 }))
      .toEqual({ x: 8, y: 736 });
    expect(clampBerniPosition({ x: 700, y: 400 }, { width: 320, height: 568 }, { width: 100, height: 100 }))
      .toEqual({ x: 212, y: 400 });
  });
  it("restores relative position after phone rotation", () => {
    const ratio = normalizeBerniPosition({ x: 195, y: 372 }, { width: 390, height: 844 }, { width: 100, height: 100 });
    const actual = denormalizeBerniPosition(ratio, { width: 844, height: 390 }, { width: 100, height: 100 });
    expect(actual).not.toBeNull();
    expect(actual!.x).toBeGreaterThan(300);
    expect(actual!.y).toBeGreaterThan(90);
    expect(denormalizeBerniPosition({ x: NaN, y: 0.5 }, { width: 390, height: 844 }, { width: 100, height: 100 })).toBeNull();
  });
  it("requires hold and movement, not an ordinary tap", () => {
    expect(isBerniDragGesture(100, 4)).toBe(false);
    expect(isBerniDragGesture(250, 4)).toBe(false);
    expect(isBerniDragGesture(200, 30)).toBe(false);
    expect(isBerniDragGesture(400, 15)).toBe(true);
  });
  it("uses pointer capture for touch and mouse, suppresses chat click after drag", () => {
    for (const event of ["onPointerDown={handlePointerDown}", "onPointerMove={handlePointerMove}", "onPointerUp={finishPointer}",
      "onPointerCancel={finishPointer}", "setPointerCapture", "releasePointerCapture", "suppressClickRef.current", "touch-none", "onDragEnd?."]) {
      expect(pet).toContain(event);
    }
    expect(assistant).toContain("data-berni-floating");
    expect(assistant).toContain("onDragEnd={handleBerniDragEnd}");
  });
  it("switches to visible typing and picked-up moods", () => {
    expect(pet).toContain('dragging ? "grabbed"');
    expect(pet).toContain('input.trim() ? "typing"');
    expect(robot).toContain("keyboardRig");
    expect(robot).toContain('mood === "grabbed"');
    expect(css).toContain(".stage[data-mood=\"typing\"] .keyboardRig");
    expect(css).toContain(".stage[data-mood=\"grabbed\"] .robot");
    expect(css).toContain("pawTyping");
    expect(css).toContain("grabbedLift");
    expect(css).toContain("prefers-reduced-motion: reduce");
  });
  it("fixes mouse-eye tracking and keeps all weather and idle keyframes", () => {
    expect(css).not.toContain("--berni-look-x: 0px;");
    expect(css).toContain("var(--berni-look-x, 0px)");
    for (const key of ["breathe", "headIdle", "tailWag", "earTwitch", "blink", "curiousTilt", "typingLook",
      "thinkingLook", "asleep", "happyBounce", "startled", "worried", "shiver", "hotPant",
      "sunPulse", "rainDrop", "snowFall", "lightning", "hailFall", "fogFlow", "sparkle", "grabbedLift", "pawTyping"]) {
      expect(css).toContain("@keyframes " + key);
    }
  });
});
