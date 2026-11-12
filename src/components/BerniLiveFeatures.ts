"use client";

import type { BerniPose } from "@/lib/berni-poses";

// The art stays a single, identical head during every loop. Only an area
// INSIDE the mouth or eyelid is deformed; no full-head sprite swapping.
type MouthSpec = { x: number; y: number; rx: number; ry: number; closePx: number };
const mouth: Partial<Record<BerniPose, MouthSpec>> = {
  happy:      { x: 430, y: 434, rx: 120, ry: 79, closePx: 27 },
  laughing:   { x: 432, y: 438, rx: 124, ry: 83, closePx: 30 },
  excited:    { x: 427, y: 438, rx: 123, ry: 81, closePx: 28 },
  surprised:  { x: 421, y: 441, rx: 108, ry: 77, closePx: 26 },
  "talk-small":{ x: 425, y: 445, rx: 117, ry: 76, closePx: 30 },
  "talk-open": { x: 419, y: 449, rx: 121, ry: 82, closePx: 31 },
  "talk-round":{ x: 428, y: 447, rx: 106, ry: 72, closePx: 24 },
};

// Each cycle begins AND ends in exactly the same frame. Animated openness
// uses a single source portrait, not 3 different faces with different ears.
export function berniMouthOpenness(pose: BerniPose, elapsedMs: number, reduced = false): number {
  if (reduced || !mouth[pose]) return 1;
  const talking = pose.startsWith("talk-");
  const laughing = pose === "laughing" || pose === "excited";
  const period = talking ? 1080 : laughing ? 1480 : pose === "happy" ? 2250 : 2550;
  const phase = (((elapsedMs % period) + period) % period) / period;
  const envelope = Math.sin(Math.PI * phase) ** 2;
  const syllables = talking
    ? .68 + .32 * Math.sin(5 * Math.PI * phase) ** 2
    : laughing ? .76 + .24 * Math.sin(3 * Math.PI * phase) ** 2 : 1;
  return 0.23 + 0.77 * envelope * syllables;
}

// Actual eyelid movement: cover the eye only using neighbouring skin texture.
// Never briefly replace the entire head with the unrelated "sleeping" portrait.
export function berniBlinkAmount(elapsedMs: number, reduced = false): number {
  if (reduced || elapsedMs < 0 || elapsedMs > 205) return 0;
  return Math.sin(Math.PI * elapsedMs / 205) ** 2;
}

export function drawBerniMouth(
  ctx: CanvasRenderingContext2D,
  source: HTMLImageElement,
  pose: BerniPose,
  pixels: number,
  open: number,
  layer: HTMLCanvasElement,
  work: CanvasRenderingContext2D,
) {
  const spec = mouth[pose];
  if (!spec || open >= .998) return;
  const k = pixels / 640;
  const {x, y, rx, ry, closePx} = spec;
  const minY = y - ry, maxY = y + ry;
  const minX = x - rx, width = rx * 2;
  const strength = closePx * (1 - open);

  // Smooth, monotone row displacement. Upper and lower lips converge when
  // the jaw closes. Rows touch exactly, so there are no horizontal gaps.
  function warp(sourceY: number) {
    const t = (sourceY - y) / 27;
    return sourceY - strength * Math.tanh(t) * Math.exp(-.5 * (t / 1.8) ** 2);
  }

  work.clearRect(0, 0, pixels, pixels);
  work.imageSmoothingEnabled = true;
  work.imageSmoothingQuality = "high";
  for (let sy = minY; sy < maxY; sy += 2) {
    const end = Math.min(sy + 2, maxY);
    const destY = warp(sy), nextDestY = warp(end);
    const height = Math.max(.25, (nextDestY - destY) * k);
    work.drawImage(source, minX, sy, width, end - sy,
      minX * k, destY * k, width * k, height + .35);
  }

  // A feathered elliptical patch replaces only the moving jaw; the ears,
  // cheeks and headphone never change during a laugh/talking cycle.
  work.globalCompositeOperation = "destination-in";
  work.save();
  work.translate(x * k, y * k);
  work.scale(rx * k, ry * k);
  const alpha = work.createRadialGradient(0, 0, .45, 0, 0, 1);
  alpha.addColorStop(0, "rgba(255,255,255,1)");
  alpha.addColorStop(.69, "rgba(255,255,255,1)");
  alpha.addColorStop(1, "rgba(255,255,255,0)");
  work.fillStyle = alpha;
  work.fillRect(-1, -1, 2, 2);
  work.restore();
  work.globalCompositeOperation = "source-over";
  ctx.drawImage(layer, 0, 0);
}

const eyes: Partial<Record<BerniPose, Array<[number,number,number,number]>>> = {
  neutral: [[346,326,65,38],[481,341,30,30]],
  curious: [[346,330,65,38],[481,344,30,31]],
  focused: [[344,325,65,36],[475,337,29,30]],
  happy: [[341,321,65,31],[486,341,31,27]],
  laughing: [[346,328,67,33],[488,341,29,29]],
  excited: [[346,328,67,33],[488,341,29,29]],
  "talk-small": [[348,331,65,39],[476,350,34,32]],
  "talk-open": [[344,319,66,40],[476,331,34,32]],
  "talk-round": [[347,320,66,40],[475,333,33,32]],
};

export function drawBerniBlink(
  ctx: CanvasRenderingContext2D, source: HTMLImageElement, pose: BerniPose,
  pixels: number, amount: number,
) {
  if (amount <= .02 || pose === "sleeping" || pose === "sleepy") return;
  const coords = eyes[pose] ?? eyes.neutral!;
  const k = pixels / 640;
  for (const [x, y, rx, ry] of coords) {
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(x * k, y * k, rx * k, ry * k, 0, 0, Math.PI * 2);
    ctx.clip();
    ctx.globalAlpha = Math.min(.98, amount * 1.08);
    // Pull real, lit silver fur from just above the pupil to form an eyelid.
    ctx.drawImage(source, x-rx, Math.max(0, y-ry*2.5), rx*2, ry*1.12,
      (x-rx)*k, (y-ry)*k, 2*rx*k, 2*ry*k);
    ctx.restore();

    if (amount > .64) {
      ctx.save();
      ctx.globalAlpha = (amount - .64) / .36 * .86;
      ctx.strokeStyle = "#232733";
      ctx.lineWidth = Math.max(1.1, 2.5*k);
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo((x-rx*.84)*k,(y+ry*.12)*k);
      ctx.quadraticCurveTo(x*k,(y+ry*.7)*k,(x+rx*.82)*k,(y+ry*.08)*k);
      ctx.stroke();
      ctx.restore();
    }
  }
}
