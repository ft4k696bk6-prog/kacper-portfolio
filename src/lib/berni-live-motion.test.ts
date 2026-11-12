import {describe, expect, it} from "vitest";
import {berniMouthOpenness, berniBlinkAmount} from "../components/BerniLiveFeatures";
import {BERNI_POSES} from "./berni-poses";

describe("Berni: seamless live animation", () => {
  it("closes each loop on the identical starting frame", () => {
    for(const [pose, period] of [
      ["talk-small",1080],["talk-open",1080],["talk-round",1080],
      ["happy",2250],["laughing",1480],["excited",1480],["surprised",2550]
    ] as const) {
      expect(berniMouthOpenness(pose,0)).toBeCloseTo(berniMouthOpenness(pose,period),10);
      expect(berniMouthOpenness(pose,period/2)).toBeGreaterThan(berniMouthOpenness(pose,0)+.3);
      expect(berniMouthOpenness(pose,period/4)).toBeGreaterThanOrEqual(.23);
    }
  });
  it("leaves non-speech moods stable and respects reduced motion", () => {
    for(const pose of BERNI_POSES) {
      expect(berniMouthOpenness(pose,120,true)).toBe(1);
    }
    expect(berniMouthOpenness("neutral",150)).toBe(1);
    expect(berniMouthOpenness("sleeping",150)).toBe(1);
  });
  it("blinks briefly and returns to exactly open", () => {
    expect(berniBlinkAmount(-1)).toBe(0);
    expect(berniBlinkAmount(0)).toBe(0);
    expect(berniBlinkAmount(205)).toBeCloseTo(0,10);
    expect(berniBlinkAmount(102.5)).toBeCloseTo(1,10);
    expect(berniBlinkAmount(350)).toBe(0);
    expect(berniBlinkAmount(102,true)).toBe(0);
  });
});
