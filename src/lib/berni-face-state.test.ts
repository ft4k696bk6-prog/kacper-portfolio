import { describe, expect, it } from "vitest";
import { createNeutralFace, faceTargetForMood, animatedFaceTarget } from "./berni-face-state";

describe("Berni blink must always reopen", () => {
  it("returns a new idle target for every animation frame", () => {
    const first = faceTargetForMood("idle");
    first.blink = 1; // simulate the first automatic blink
    expect(faceTargetForMood("idle").blink).toBe(0);
    expect(faceTargetForMood("idle")).not.toBe(first);
  });
  it("survives thousands of successive blink pulses without staying closed", () => {
    const face = createNeutralFace();
    for (let frame = 0; frame < 3000; frame++) {
      const target = faceTargetForMood("idle");
      const since = (frame % 200) / 60;
      const pulse = since < .24 ? Math.sin(Math.PI * since / .24) : 0;
      target.blink = Math.max(target.blink, pulse);
      face.blink += (target.blink - face.blink) * .6;
      if (frame % 200 === 100) expect(face.blink).toBeLessThan(.001);
    }
    expect(faceTargetForMood("idle").blink).toBe(0);
  });
  it("keeps sleep separate from normal idle", () => {
    expect(faceTargetForMood("sleeping").blink).toBe(1);
    expect(faceTargetForMood("idle").blink).toBe(0);
    expect(createNeutralFace().blink).toBe(0);
  });
  it("does not leak one mood into another", () => {
    const worried = faceTargetForMood("worried");
    worried.blink = 1;
    worried.mouth = 1;
    expect(faceTargetForMood("worried").blink).toBe(0);
    expect(faceTargetForMood("happy").blink).toBe(.17);
    expect(faceTargetForMood("idle").mouth).toBe(0);
  });
});


describe("Each Berni reaction button is visibly distinct and animated", () => {
  const modes = [
    "curious", "thinking", "happy", "excited", "sleeping", "typing",
    "listening", "surprised", "worried", "working", "grabbed",
  ] as const;
  it.each(modes)("%s is not the idle portrait", mood => {
    const face = animatedFaceTarget(mood, 500);
    const totalChange = Math.abs(face.blink) + Math.abs(face.mouth)
      + Math.abs(face.smile) + Math.abs(face.surprise)
      + Math.abs(face.gazeX) + Math.abs(face.gazeY) + Math.abs(face.worried);
    expect(totalChange).toBeGreaterThan(.35);
  });
  const changingModes = [
    "curious", "thinking", "happy", "excited", "typing",
    "listening", "surprised", "worried", "working", "grabbed",
  ] as const;
  it.each(changingModes)("%s continues moving after selection", mood => {
    const start = animatedFaceTarget(mood, 0);
    const later = animatedFaceTarget(mood, 730);
    const difference = (Object.keys(start) as (keyof typeof start)[])
      .reduce((total, key) => total + Math.abs(start[key] - later[key]), 0);
    expect(difference).toBeGreaterThan(.015);
  });
  it("the mouth actually opens in happy, excited, surprised and speaking", () => {
    for (const mood of ["happy", "excited", "surprised", "typing"] as const) {
      expect(animatedFaceTarget(mood, 500).mouth).toBeGreaterThan(.3);
    }
  });
  it("resets to neutral without permanently closed eyes after any mood", () => {
    for (const mood of modes) {
      const pose = animatedFaceTarget(mood, 800);
      pose.blink = 1;
      expect(animatedFaceTarget("idle", 0).blink).toBe(0);
      expect(createNeutralFace().blink).toBe(0);
    }
  });
});
