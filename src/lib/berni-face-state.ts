export type BerniLivingMood =
  | "idle" | "curious" | "thinking" | "happy" | "excited"
  | "sleeping" | "typing" | "listening" | "surprised"
  | "worried" | "working" | "grabbed";

export type Face = {
  blink: number;
  mouth: number;
  smile: number;
  surprise: number;
  gazeX: number;
  gazeY: number;
  worried: number;
};

const neutral: Readonly<Face> = Object.freeze({
  blink: 0, mouth: 0, smile: 0, surprise: 0,
  gazeX: 0, gazeY: 0, worried: 0,
});

// Each frame gets a fresh copy; automatic blinking may mutate its own target.
export function createNeutralFace(): Face {
  return { ...neutral };
}

export function faceTargetForMood(mood: BerniLivingMood): Face {
  const base = createNeutralFace();
  switch (mood) {
    case "curious": return { ...base, gazeX: .65, gazeY: -.3, smile: .16 };
    case "listening": return { ...base, gazeX: .4, smile: .12 };
    case "thinking": return { ...base, gazeX: -.5, gazeY: -.7, worried: .2 };
    case "working": return { ...base, gazeX: -.3, gazeY: -.4 };
    case "happy": return { ...base, smile: .82, mouth: .23 };
    case "excited": return { ...base, smile: 1, surprise: .3, mouth: .65 };
    case "surprised": return { ...base, surprise: 1, mouth: .78 };
    case "grabbed": return { ...base, surprise: .65, mouth: .4 };
    case "typing": return { ...base, smile: .3, mouth: .48 };
    case "worried": return { ...base, worried: .9, gazeY: .35 };
    case "sleeping": return { ...base, blink: 1 };
    default: return base;
  }
}
