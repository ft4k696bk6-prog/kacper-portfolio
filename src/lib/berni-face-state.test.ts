import { describe, expect, it } from "vitest";
import { createNeutralFace, faceTargetForMood } from "./berni-face-state";

describe("Berni blink must always reopen", () => {
  it("returns a new idle target for every animation frame", () => {
    const first = faceTargetForMood("idle");
    first.blink = 1; // simulate the first automatic blink
    expect(faceTargetForMood("idle").blink).toBe(0);
    expect(faceTargetForMood("idle")).not.toBe(first);
  });
  it("survives thousands of successive blink pulses without staying closed", () => {
    let face = createNeutralFace();
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
    expect(faceTargetForMood("happy").blink).toBe(0);
    expect(faceTargetForMood("idle").mouth).toBe(0);
  });
});
