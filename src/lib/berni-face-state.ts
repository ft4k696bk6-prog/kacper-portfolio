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

export function createNeutralFace(): Face {
  return { ...neutral };
}

/** Meaningfully distinct facial poses — not single-pixel eye movements. */
export function faceTargetForMood(mood: BerniLivingMood): Face {
  const base = createNeutralFace();
  switch (mood) {
    case "curious": return { ...base, gazeX: .85, gazeY: -.45, surprise: .33, smile: .3, mouth: .18 };
    case "listening": return { ...base, gazeX: .62, gazeY: -.12, surprise: .24, smile: .28, mouth: .12 };
    case "thinking": return { ...base, gazeX: -.9, gazeY: -.9, surprise: .18, worried: .2, mouth: .11 };
    case "working": return { ...base, gazeX: -.85, gazeY: -.52, worried: .22, mouth: .18 };
    case "happy": return { ...base, smile: .95, mouth: .8, blink: .17 };
    case "excited": return { ...base, smile: 1, surprise: .42, mouth: 1, blink: .12 };
    case "surprised": return { ...base, surprise: 1, mouth: .96, gazeY: -.3 };
    case "grabbed": return { ...base, surprise: .82, mouth: .7 };
    case "typing": return { ...base, smile: .52, mouth: .78 };
    case "worried": return { ...base, worried: 1, gazeX: -.26, gazeY: .67, mouth: .18, blink: .16 };
    case "sleeping": return { ...base, blink: 1 };
    default: return base;
  }
}

/**
 * A continuous pose evolves while the reaction button is active.
 * All intermediate values feed Canvas2D easing; no image-frame swapping.
 */
export function animatedFaceTarget(mood: BerniLivingMood, elapsedMs: number): Face {
  const target = faceTargetForMood(mood);
  const t = Math.max(0, elapsedMs);
  switch (mood) {
    case "curious":
      target.gazeX = .7 + .22 * Math.sin(t / 600);
      target.surprise = .27 + .15 * (1 + Math.sin(t / 680)) / 2;
      break;
    case "listening":
      target.gazeX = .52 + .15 * Math.sin(t / 870);
      target.gazeY = -.18 + .2 * Math.sin(t / 460);
      break;
    case "thinking":
      target.gazeX = -.8 + .2 * Math.sin(t / 710);
      target.gazeY = -.8 + .14 * Math.cos(t / 620);
      target.mouth = .13 + .09 * Math.sin(t / 720) ** 2;
      break;
    case "working":
      target.gazeX = -.72 + .23 * Math.sin(t / 600);
      target.gazeY = -.42 + .2 * Math.cos(t / 800);
      target.mouth = .13 + .1 * Math.sin(t / 520) ** 2;
      break;
    case "happy":
      target.mouth = .68 + .25 * (1 + Math.sin(t / 450)) / 2;
      target.blink = .11 + .16 * Math.sin(t / 660) ** 2;
      break;
    case "excited":
      target.mouth = .72 + .27 * Math.sin(t / 240) ** 2;
      target.blink = .08 + .17 * Math.sin(t / 440) ** 2;
      target.surprise = .38 + .1 * Math.sin(t / 520);
      break;
    case "surprised":
      target.mouth = .82 + .16 * Math.sin(t / 390) ** 2;
      target.gazeY = -.35 + .1 * Math.cos(t / 550);
      break;
    case "grabbed":
      target.mouth = .6 + .2 * Math.sin(t / 380) ** 2;
      break;
    case "typing": {
      const syllables = Math.abs(Math.sin(t / 151) * Math.cos(t / 393));
      target.mouth = .33 + .67 * syllables;
      target.gazeX = .22 * Math.sin(t / 760);
      break;
    }
    case "worried":
      target.worried = .9 + .1 * Math.sin(t / 680) ** 2;
      target.gazeY = .57 + .17 * Math.cos(t / 890);
      target.blink = .1 + .1 * Math.sin(t / 650) ** 2;
      break;
    default: break;
  }
  return target;
}
