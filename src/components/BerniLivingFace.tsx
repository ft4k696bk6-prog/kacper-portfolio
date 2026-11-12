"use client";

import { useEffect, useRef, useState } from "react";
import { type BerniLivingMood } from "@/lib/berni-face-state";
import { berniMouthOpenness, berniBlinkAmount, drawBerniMouth, drawBerniBlink } from "./BerniLiveFeatures";
import { BERNI_MOOD_POSE, BERNI_POSE_MOOD, berniPoseUrl, type BerniPose } from "@/lib/berni-poses";
import {
  berniTransitionFrame, chooseBerniTransition, emptyTransitionMemory,
  type BerniTransitionName, type TransitionChoice, type TransitionFrame,
} from "@/lib/berni-transition";

export type { BerniLivingMood } from "@/lib/berni-face-state";

const cachedImages = new Map<string, Promise<HTMLImageElement>>();
function loadPortrait(src: string): Promise<HTMLImageElement> {
  const existing = cachedImages.get(src);
  if (existing) return existing;
  const result = new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new window.Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Berni portrait could not load: " + src));
    image.src = src;
  });
  cachedImages.set(src, result);
  return result;
}

const clamp = (x: number, min = 0, max = 1) => Math.max(min, Math.min(max, x));
type Inputs = {
  mood: BerniLivingMood;
  pose: BerniPose | null;
  blinkToken: number;
  reactionToken: number;
  transitionToken: number;
  transitionPreset: BerniTransitionName | null;
};
type Transition = {
  from: BerniPose;
  to: BerniPose;
  start: number;
  choice: TransitionChoice;
};

function paintAccent(
  ctx: CanvasRenderingContext2D, fx: TransitionFrame, progress: number, size: number,
) {
  if (fx.accent === "none" || progress <= .08 || progress >= .95) return;
  const middle = Math.max(0, 1 - Math.abs(progress - .5) * 2);
  const intensity = Math.pow(middle, .6);
  if (intensity < .05) return;
  ctx.save();
  ctx.translate(size / 2, size / 2);
  ctx.strokeStyle = "rgba(218,225,241," + (.24 + intensity * .43) + ")";
  ctx.fillStyle = "rgba(214,222,238," + (.12 + intensity * .28) + ")";
  ctx.lineWidth = Math.max(1, size * .007);
  if (fx.accent === "dust") {
    // A Looney-Tunes-style dust burst survives the moment when Berni disappears.
    for (let j = 0; j < 8; j++) {
      const a = Math.PI * 2 * j / 8 + .2;
      const r = size * (.08 + .26 * intensity) * (j % 2 ? 1.1 : .9);
      ctx.beginPath();
      ctx.arc(Math.cos(a) * r, size * .25 + Math.sin(a) * r * .5,
        size * (.023 + (j % 3) * .008) * intensity, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (fx.accent === "spin") {
    for (let j = 0; j < 3; j++) {
      const radius = size * (.10 + j * .095) * (.3 + intensity);
      ctx.beginPath();
      ctx.ellipse(0, 0, radius, radius * .37, (j + progress * 4) * .65,
        -.8, Math.PI * 1.38);
      ctx.stroke();
    }
  } else if (fx.accent === "speed") {
    for (let j = 0; j < 6; j++) {
      const y = (j - 2.5) * size * .09;
      const sign = j % 2 ? 1 : -1;
      const x = sign * size * (.20 + .10 * intensity);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + sign * size * (.15 + .12 * intensity), y);
      ctx.stroke();
    }
  } else {
    for (let j = 0; j < 7; j++) {
      const a = 2 * Math.PI * j / 7 + progress;
      const r = size * (.1 + .21 * intensity);
      const x = Math.cos(a) * r, y = Math.sin(a) * r;
      ctx.beginPath();ctx.moveTo(x - 5, y);ctx.lineTo(x + 5, y);
      ctx.moveTo(x, y - 5);ctx.lineTo(x, y + 5);ctx.stroke();
    }
  }
  ctx.restore();
}

/**
 * Each emotion retains its own original artwork, but within an emotion the
 * jaw and eyelids move continuously on ONE portrait. The whole head changes
 * only for deliberately selected cinematic effects.
 */
export function BerniLivingFace({
  mood, pose = null, size, blinkToken = 0, reactionToken = 0,
  transitionToken = 0, transitionPreset = null, transitionEnabled = true, onReady,
}: {
  mood: BerniLivingMood;
  pose?: BerniPose | null;
  size: number;
  blinkToken?: number;
  reactionToken?: number;
  transitionToken?: number;
  transitionPreset?: BerniTransitionName | null;
  transitionEnabled?: boolean;
  onReady?: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const latest = useRef<Inputs>({
    mood, pose, blinkToken, reactionToken, transitionToken, transitionPreset,
  });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const prev = latest.current;
    const changed = mood !== prev.mood || pose !== prev.pose;
    const blink = blinkToken !== prev.blinkToken && blinkToken > 0;
    const replay = reactionToken !== prev.reactionToken;
    const force = transitionToken !== prev.transitionToken;
    latest.current = { mood, pose, blinkToken, reactionToken, transitionToken, transitionPreset };
    const canvas = canvasRef.current;
    if (changed || force) canvas?.dispatchEvent(new Event("berni-pose-change"));
    if (blink) canvas?.dispatchEvent(new Event("berni-blink"));
    if (replay) canvas?.dispatchEvent(new Event("berni-replay"));
  }, [mood, pose, blinkToken, reactionToken, transitionToken, transitionPreset]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { alpha: true, desynchronized: true });
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pixels = Math.min(640, Math.max(112, Math.round(size * Math.min(2, window.devicePixelRatio || 1))));
    canvas.width = pixels;canvas.height = pixels;
    const mouthLayer = document.createElement("canvas");
    mouthLayer.width = mouthLayer.height = pixels;
    const mouthCtx = mouthLayer.getContext("2d");


    let alive = true, visible = true, raf = 0, lastFrame = 0;
    let showing: BerniPose = "neutral";
    let transition: Transition | null = null;
    let nextBlink = performance.now() + 2600 + Math.random() * 1800;
    let blinkingAt = -100000;
    let replayAt = 0;
    let loopStart = performance.now();
    let handledTransitionToken = 0;
    let lookX = 0, lookY = 0, gazeX = 0, gazeY = 0, lookUntil = 0;
    let observer: IntersectionObserver | null = null;
    const history = emptyTransitionMemory();
    const portraits = new Map<BerniPose, HTMLImageElement>();

    function loadPose(p: BerniPose) {
      if (portraits.has(p)) return Promise.resolve(portraits.get(p)!);
      return loadPortrait(berniPoseUrl(p)).then(image => {
        if (alive) portraits.set(p, image);
        return image;
      });
    }

    function requestChange() {
      const desired = latest.current.pose ?? BERNI_MOOD_POSE[latest.current.mood];
      if (!portraits.has(desired)) {
        void loadPose(desired).then(() => { if (alive) requestChange(); }).catch(() => {});
        return;
      }
      const now = performance.now();
      const from = transition
        ? ((now - transition.start) / transition.choice.duration < .5 ? transition.from : transition.to)
        : showing;
      const forced = latest.current.transitionToken !== handledTransitionToken && !!latest.current.transitionPreset;
      const same = from === desired;
      if (same && !forced) return;
      const levelFrom = BERNI_POSE_MOOD[from];
      const levelTo = BERNI_POSE_MOOD[desired];
      // Even two poses classified under the same broad mood can be visually
      // completely different. Never hard-swap them in full view.
      const effectiveFrom = levelFrom === levelTo && !same ? "idle" : levelFrom;
      const effectiveTo = levelFrom === levelTo && !same ? "happy" : levelTo;
      let choice = reduceMotion.matches || !transitionEnabled ? null
        : chooseBerniTransition(effectiveFrom, effectiveTo, now, history);
      if (!choice && !same && !reduceMotion.matches && transitionEnabled) {
        choice = chooseBerniTransition("idle", "happy", now, history);
      }
      if (forced && !reduceMotion.matches && transitionEnabled && latest.current.transitionPreset) {
        choice = {
          name: latest.current.transitionPreset,
          duration: 760,
          strength: "large",
        };
      }
      handledTransitionToken = latest.current.transitionToken;
      if (choice) {
        showing = from;
        transition = { from, to: desired, start: now, choice };
      } else {
        showing = desired;
        transition = null;
        loopStart = now;
      }
    }

    function replay() { replayAt = performance.now(); loopStart = replayAt; }
    function blink() { blinkingAt = performance.now(); nextBlink = blinkingAt + 3900; }

    function track(x: number, y: number, duration: number) {
      const rect = canvas!.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      lookX = clamp((x - centerX) / Math.max(180, window.innerWidth * .65), -.7, .7);
      lookY = clamp((y - centerY) / Math.max(200, window.innerHeight * .65), -.7, .7);
      lookUntil = performance.now() + duration;
    }
    function move(event: PointerEvent) {
      if (window.matchMedia("(hover: hover) and (pointer: fine)").matches)
        track(event.clientX, event.clientY, 700);
    }
    function tap(event: PointerEvent) { track(event.clientX, event.clientY, 1200); }

    function draw(now: number) {
      raf = 0;
      if (!alive || document.hidden || !visible) return;
      raf = requestAnimationFrame(draw);
      if (now - lastFrame < (size <= 72 ? 32 : 23) && !reduceMotion.matches) return;
      lastFrame = now;

      let activePose = showing;
      let frame: TransitionFrame | null = null;
      let progress = 0;
      if (transition) {
        progress = clamp((now - transition.start) / transition.choice.duration);
        if (progress >= 1) {
          showing = transition.to; transition = null; activePose = showing; loopStart = now;
        } else {
          frame = berniTransitionFrame(transition.choice.name, progress);
          activePose = frame.phase === "exit" ? transition.from : transition.to;
        }
      }
      const motionOff = reduceMotion.matches;
      if (now >= nextBlink && activePose !== "sleeping" && !motionOff) {
        blinkingAt = now;
        nextBlink = now + 4000 + Math.random() * 4000;
      }

      ctx!.clearRect(0, 0, pixels, pixels);
      if (frame) paintAccent(ctx!, frame, progress, pixels);
      // The empty window is truly empty: NEVER render a fallback image behind.
      if (frame && !frame.visible) return;

      const picture = portraits.get(activePose) ?? portraits.get("neutral");
      if (!picture) return;
      // Avoid the old hard cuts between three completely different foxes
      // during speech, and the "sleeping" full-head replacement at blinks.
      // Mouth animation is now an independent, seamless loop on this image.
      const aimX = now < lookUntil && !motionOff ? lookX : 0;
      const aimY = now < lookUntil && !motionOff ? lookY : 0;
      gazeX += (aimX - gazeX) * .14;
      gazeY += (aimY - gazeY) * .14;
      const breath = motionOff ? 0 : Math.sin(now / (activePose === "sleeping" ? 920 : 1250)) * .004;
      const replayJump = motionOff ? 0 : Math.max(0, 1 - (now - replayAt) / 470) * -.018;
      ctx!.save();
      ctx!.translate(pixels / 2, pixels / 2);
      ctx!.translate(gazeX * pixels * .012, gazeY * pixels * .008);
      ctx!.translate(0, pixels * (breath + replayJump));
      if (frame && !motionOff) {
        ctx!.translate(frame.x * pixels, frame.y * pixels);
        ctx!.rotate(frame.rotate);
        ctx!.scale(frame.scaleX, frame.scaleY);
        ctx!.globalAlpha = frame.opacity;
        // A tiny blur is confined to the moving complete character.
        if (frame.blur > .3) ctx!.filter = "blur(" + Math.min(6, frame.blur * pixels / 400).toFixed(1) + "px)";
      }
      ctx!.translate(-pixels / 2, -pixels / 2);
      ctx!.drawImage(picture, 0, 0, pixels, pixels);
      if (!motionOff && mouthCtx && !transition) {
        drawBerniMouth(ctx!, picture, activePose, pixels,
          berniMouthOpenness(activePose, now - loopStart), mouthLayer, mouthCtx);
      }
      if (!motionOff && !transition) {
        drawBerniBlink(ctx!, picture, activePose, pixels,
          berniBlinkAmount(now - blinkingAt));
      }
      ctx!.restore();
    }
    function run() { if (alive && visible && !document.hidden && !raf) raf = requestAnimationFrame(draw); }
    function visibilityChanged() { run(); }

    canvas.addEventListener("berni-pose-change", requestChange);
    canvas.addEventListener("berni-blink", blink);
    canvas.addEventListener("berni-replay", replay);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", tap, { passive: true });
    document.addEventListener("visibilitychange", visibilityChanged);
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(entries => {
        visible = !!entries[0]?.isIntersecting;
        if (!visible && raf) { cancelAnimationFrame(raf); raf = 0; }
        if (visible) run();
      }, { threshold: 0 });
      observer.observe(canvas);
    }

    void loadPose("neutral").then(() => {
      if (!alive) return;
      setIsReady(true);
      onReady?.();
      requestChange();
      run();
      // Keep only frequently used reactions warm; selected other poses load
      // on demand. A small 56px launcher will not fetch all twenty PNG files.
      for (const p of ["talk-small", "happy", "laughing"] as const)
        void loadPose(p).catch(() => {});
    }).catch(() => { /* The neutral fallback stays visible. */ });

    return () => {
      alive = false;
      if (raf) cancelAnimationFrame(raf);
      observer?.disconnect();
      canvas.removeEventListener("berni-pose-change", requestChange);
      canvas.removeEventListener("berni-blink", blink);
      canvas.removeEventListener("berni-replay", replay);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", tap);
      document.removeEventListener("visibilitychange", visibilityChanged);
    };
  }, [size, onReady, transitionEnabled]);

  return (
    <canvas ref={canvasRef}
      data-testid="berni-continuous-face"
      data-ready={isReady ? "true" : "false"}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ opacity: isReady ? 1 : 0 }}
    />
  );
}
