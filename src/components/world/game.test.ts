import * as T from "three";
import { afterEach, describe, expect, it, vi } from "vitest";
import { awards, emptyExpedition, findCount, finds, readExpedition, type FindId } from "./discoveries";
import { clearancePose, flightPath, spheres, systemAxis } from "./cameraFlight";
import { visibleBodies } from "./planets";
import { makeLane, placeOnLane, ringWaypoints, type TrafficKind } from "./routes";
import { frontNormal, worldSurface } from "./planetSurface";
import { makeWorldLife } from "./worldLife";
import { gamePalette } from "./gameObjects";
import { makeDistrict } from "./district";

afterEach(() => vi.unstubAllGlobals());

describe("expedition", () => {
  it("deduplicates saved finds and preserves older valid saves", () => {
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

describe("routes", () => {
  const body = worldSurface("starcars");
  it("keeps road and water lanes on the correct medium and refuses occupied terrain", () => {
    const land = ringWaypoints(frontNormal, .52);
    const openSea = ringWaypoints(new T.Vector3(.72, .10, -.70).normalize(), .16);
    expect(makeLane("road", land, body)).not.toBeNull();
    expect(makeLane("water", land, body)).toBeNull();
    expect(makeLane("road", openSea, body)).toBeNull();
    expect(makeLane("water", openSea, body)).not.toBeNull();
    expect(makeLane("road", land, body, [{ normal: land[0], radius: .1 }])).toBeNull();
  });

  it("gives home traffic verified road, rail and water paths", () => {
    const home = makeWorldLife(gamePalette(), true);
    expect(home.lanes.map(lane => lane.kind)).toEqual(expect.arrayContaining(["road", "rail", "water"]));
  });

  it("wraps lane distance smoothly and points the vehicle away from the planet", () => {
    const lane = makeLane("road", ringWaypoints(frontNormal, .52), body)!;
    const agent = new T.Object3D(), basis = new T.Matrix4();
    const vectors = [new T.Vector3(), new T.Vector3(), new T.Vector3()] as const;
    placeOnLane(agent, lane, lane.length - .02, basis, ...vectors);
    const last = agent.position.clone();
    placeOnLane(agent, lane, lane.length + .02, basis, ...vectors);
    expect(agent.position.distanceTo(last)).toBeLessThan(.06);
    expect(agent.up.clone().applyQuaternion(agent.quaternion).dot(agent.position.clone().normalize())).toBeCloseTo(1);
  });

  it("builds the planned autonomous lanes on the shipping worlds", () => {
    const required = { starcars: ["road", "water"], reenergy: ["walk"], motomizer: ["road"], "b-crm": ["walk"], ai: ["walk"], "isto-kebab": ["walk"] } as const;
    for (const [id, kinds] of Object.entries(required)) {
      const scene = makeDistrict(id as keyof typeof required, true, { find() {}, portal() {}, alert() {}, beat() {} });
      const built = scene.lanes.map(lane => lane.kind);
      for (const kind of kinds) expect(built, id).toContain(kind as TrafficKind);
    }
  });
});

describe("system camera", () => {
  it("keeps worlds apart and keeps secret bodies out of the initial catalog", () => {
    for (const [i, a] of spheres.entries()) {
      for (const b of spheres.slice(i + 1)) expect(a.center.distanceTo(b.center)).toBeGreaterThan(a.radius + b.radius + 12);
    }
    expect(visibleBodies(false, false)).not.toContain("moon");
    expect(visibleBodies(false, false)).not.toContain("signal");
    expect(visibleBodies(false, false)).not.toContain("garage");
    expect(visibleBodies(false, false, true)).toContain("garage");
    expect(visibleBodies(true, true)).toContain("signal");
  });

  it("keeps sampled flights above all planetary surfaces", () => {
    for (const a of spheres) for (const b of spheres) {
      if (a === b) continue;
      const start = a.center.clone().addScaledVector(systemAxis, a.radius + 19);
      const end = b.center.clone().addScaledVector(systemAxis, b.radius + 18);
      const flight = flightPath(start, end, a.key, b.key);
      const eye = new T.Vector3();
      for (let i = 0; i <= 65; i++) {
        flight.sample(i / 65, eye);
        for (const { center, radius } of spheres) expect(eye.distanceTo(center)).toBeGreaterThan(radius + .9);
      }
      expect(eye.distanceTo(end)).toBeLessThan(.001);
    }
    const blocked = spheres[0].center.clone();
    clearancePose(blocked, spheres[0].key, 2);
    expect(blocked.length()).toBeGreaterThan(spheres[0].radius + 2);
  });
});
