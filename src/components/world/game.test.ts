import * as T from "three";
import { afterEach, describe, expect, it, vi } from "vitest";
import { awards, emptyExpedition, findCount, finds, readExpedition, type FindId } from "./discoveries";
import { gamePalette } from "./gameObjects";
import { globeRadius, makeSurfaceSites } from "./globe";
import { makeRoads, roadPairs, roadPoint, surfaceRadius } from "./terrain";
import { createVehicle } from "./vehicle";

afterEach(() => vi.unstubAllGlobals());

describe("expedition", () => {
  it("deduplicates saved finds and ignores unknown ids and world flags", () => {
    vi.stubGlobal("localStorage", {
      getItem: () => JSON.stringify({ finds: ["chest", "chest", "typo", 5, "ramp"], moon: 1, signal: true }),
    });
    expect(readExpedition()).toEqual({ finds: ["chest", "ramp"], moon: false, signal: true });
  });

  it("recovers from an unavailable save and unlocks the reward only for a complete log", () => {
    vi.stubGlobal("localStorage", { getItem: () => { throw new Error("unavailable"); } });
    expect(readExpedition()).toEqual(emptyExpedition);
    const complete = Object.keys(finds) as FindId[];
    expect(complete).toHaveLength(findCount);
    expect(awards({ finds: complete.slice(1), moon: true, signal: true })).not.toContain("complete");
    expect(awards({ finds: complete, moon: true, signal: true })).toContain("complete");
  });
});

describe("surface and vehicle", () => {
  it("connects every real site through short arcs along the globe", () => {
    const points = new Set(roadPairs.flat());
    expect(points.size).toBe(Object.keys(makeSurfaceSites()).length);
    const q = new T.Quaternion(), v = new T.Vector3();
    for (const road of makeRoads()) {
      expect(road.angle).toBeLessThan(Math.PI);
      expect(roadPoint(road, .5, v, q).length()).toBeCloseTo(1);
      expect(surfaceRadius(v)).toBeGreaterThanOrEqual(globeRadius);
      expect(roadPoint(road, 1, v, q).distanceTo(road.end)).toBeLessThan(.00001);
    }
  });

  it("accelerates, jumps the ramp, brakes and resets with radial orientation", () => {
    const discovered = vi.fn();
    const vehicle = createVehicle(gamePalette(), true, discovered, () => {});
    const spawn = vehicle.root.position.clone();
    vehicle.setActive(true);
    vehicle.input("w", true);
    for (let i = 0; i < 65; i++) vehicle.step(.016, true);
    expect(vehicle.speed).toBeGreaterThan(4.5);
    expect(vehicle.root.position.distanceTo(spawn)).toBeGreaterThan(3);
    expect(new T.Vector3(0, 1, 0).applyQuaternion(vehicle.root.quaternion).dot(vehicle.normal)).toBeCloseTo(1);
    expect(discovered).toHaveBeenCalledWith("ramp");
    vehicle.input("w", false);
    for (let i = 0; i < 120; i++) vehicle.step(.016, false);
    expect(vehicle.speed).toBe(0);
    vehicle.reset();
    expect(vehicle.root.position.distanceTo(spawn)).toBeLessThan(.00001);
    vehicle.horn();
    expect(discovered).toHaveBeenCalledWith("horn");
  });
});
