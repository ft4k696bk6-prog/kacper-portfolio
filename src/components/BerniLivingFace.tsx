"use client";

import { useEffect, useRef, useState } from "react";

export type BerniLivingMood =
  | "idle" | "curious" | "thinking" | "happy" | "excited"
  | "sleeping" | "typing" | "listening" | "surprised"
  | "worried" | "working" | "grabbed";

type Face = {
  blink: number;
  mouth: number;
  smile: number;
  surprise: number;
  gazeX: number;
  gazeY: number;
  worried: number;
};

const BASE = "/images/berni/berni-fox-head.png";
const EYELIDS = "/images/berni/eyelids-closed.jpg";
const zero: Face = { blink: 0, mouth: 0, smile: 0, surprise: 0, gazeX: 0, gazeY: 0, worried: 0 };

function forMood(mood: BerniLivingMood): Face {
  switch (mood) {
    case "curious": return { ...zero, gazeX: .65, gazeY: -.3, smile: .16 };
    case "listening": return { ...zero, gazeX: .4, smile: .12 };
    case "thinking": return { ...zero, gazeX: -.5, gazeY: -.7, worried: .2 };
    case "working": return { ...zero, gazeX: -.3, gazeY: -.4 };
    case "happy": return { ...zero, smile: .82, mouth: .23 };
    case "excited": return { ...zero, smile: 1, surprise: .3, mouth: .65 };
    case "surprised": return { ...zero, surprise: 1, mouth: .78 };
    case "grabbed": return { ...zero, surprise: .65, mouth: .4 };
    case "typing": return { ...zero, smile: .3, mouth: .48 };
    case "worried": return { ...zero, worried: .9, gazeY: .35 };
    case "sleeping": return { ...zero, blink: 1 };
    default: return zero;
  }
}

/**
 * Canvas2D animation deliberately uses only the approved source portrait.
 * The eyelid reference appears ONLY inside the two eye sockets while blink
 * progress grows. It is never rendered as a complete replacement face.
 * An inline SVG or morphing a second head is intentionally not used.
 */
export function BerniLivingFace({
  mood, size, blinkToken = 0,
}: {
  mood: BerniLivingMood;
  size: number;
  blinkToken?: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const live = useRef({ mood, blinkToken });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    live.current.mood = mood;
    if (blinkToken !== live.current.blinkToken) {
      live.current.blinkToken = blinkToken;
      if (blinkToken > 0) ref.current?.dispatchEvent(new Event("berni-blink-now"));
    }
  }, [mood, blinkToken]);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !ctx) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const renderSize = Math.min(640, Math.max(128, Math.round(size * Math.min(2, window.devicePixelRatio || 1))));
    canvas.width = renderSize;
    canvas.height = renderSize;

    let active = true;
    let visible = true;
    let raf = 0;
    let lastTick = 0;
    let lastPaint = 0;
    let lastBlink = -10000;
    let nextBlink = performance.now() + 1400 + Math.random() * 1000;
    let base: HTMLImageElement | null = null;
    let lids: HTMLImageElement | null = null;
    let current: Face = { ...zero };
    let watcher: IntersectionObserver | null = null;
    const onForceBlink = () => { lastBlink = performance.now(); };

    function load(src: string): Promise<HTMLImageElement> {
      return new Promise((resolve, reject) => {
        const image = new window.Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = src;
      });
    }

    function eyeClip(near: boolean) {
      ctx!.beginPath();
      if (near) {
        ctx!.moveTo(262, 320);
        ctx!.bezierCurveTo(283, 286, 344, 271, 376, 304);
        ctx!.bezierCurveTo(388, 316, 389, 349, 387, 367);
        ctx!.bezierCurveTo(340, 359, 290, 349, 262, 320);
      } else {
        ctx!.moveTo(436, 348);
        ctx!.bezierCurveTo(439, 320, 459, 308, 478, 326);
        ctx!.bezierCurveTo(490, 337, 493, 371, 486, 381);
        ctx!.bezierCurveTo(461, 378, 447, 363, 436, 348);
      }
      ctx!.closePath();
    }

    function drawEyes(gazeX: number, gazeY: number) {
      // Only the detailed original eye texture is translated, not its fur,
      // headphones, or muzzle. A soft central iris region avoids seams.
      if (!base || (Math.abs(gazeX) < .05 && Math.abs(gazeY) < .05)) return;
      const eyes = [
        { x: 338, y: 325, rx: 28, ry: 31 },
        { x: 462, y: 347, rx: 15, ry: 22 },
      ];
      for (const eye of eyes) {
        ctx!.save();
        ctx!.beginPath();
        ctx!.ellipse(eye.x, eye.y, eye.rx, eye.ry, -.14, 0, Math.PI * 2);
        ctx!.clip();
        ctx!.globalAlpha = .55;
        ctx!.drawImage(base, -gazeX * 2.8, -gazeY * 2, 640, 640);
        ctx!.restore();
      }
    }

    function drawBlink(blink: number, near: boolean) {
      if (!lids || blink < .015) return;
      // Reveal reference eyelid TOP to BOTTOM as a smooth geometric wipe,
      // rather than crossfading entire open vs closed characters.
      const left = near ? 260 : 436;
      const right = near ? 389 : 491;
      const top = near ? 279 : 309;
      const bottom = near ? 370 : 383;
      const extent = (bottom - top) * Math.min(1, blink);
      ctx!.save();
      eyeClip(near);
      ctx!.clip();
      // The solid part of the eyelid slides down, then the last 6px fade
      // into the original iris. No rectangular hard edge mid-blink.
      const edge = top + extent;
      const feather = 7;
      ctx!.save();
      ctx!.beginPath();
      ctx!.rect(left, top, right - left, Math.max(0, extent - feather));
      ctx!.clip();
      ctx!.drawImage(lids, 0, 0, 640, 640);
      ctx!.restore();
      for (let band = 0; band < 7; band++) {
        const y = edge - feather + band;
        if (y < top || y > bottom) continue;
        ctx!.save();
        ctx!.beginPath();
        ctx!.rect(left, y, right - left, 1.4);
        ctx!.clip();
        ctx!.globalAlpha = Math.max(0, 1 - band / 7);
        ctx!.drawImage(lids, 0, 0, 640, 640);
        ctx!.restore();
      }
      ctx!.restore();
    }

    function drawExpression(face: Face) {
      // Organic curved lip geometry follows Berni's APPROVED smile,
      // not an oval painted over his muzzle. Continuous depth parameter.
      const amount = Math.max(0, Math.min(1, face.mouth));
      if (amount > .02) {
        const depth = 22 * amount;
        const left = 362;
        const right = 457;
        const smooth = (value: number) => {
          const t = Math.max(0, Math.min(1, value));
          return t * t * (3 - 2 * t);
        };
        const upper = (t: number) =>
          397 + 37 * smooth(t / .65) + 6 * Math.sin(Math.PI * t);
        const lower = (t: number) =>
          upper(t) + depth * Math.pow(Math.max(0, Math.sin(Math.PI * t)), .6);

        ctx!.save();
        ctx!.globalAlpha = Math.min(1, amount * 1.25);
        ctx!.beginPath();
        for (let i = 0; i <= 40; i++) {
          const t = i / 40, x = left + (right - left) * t;
          if (i === 0) ctx!.moveTo(x, upper(t));
          else ctx!.lineTo(x, upper(t));
        }
        for (let i = 40; i >= 0; i--) {
          const t = i / 40;
          ctx!.lineTo(left + (right - left) * t, lower(t));
        }
        ctx!.closePath();
        const gradient = ctx!.createLinearGradient(0, 412, 0, 460);
        gradient.addColorStop(0, "#120b16");
        gradient.addColorStop(.6, "#190d14");
        gradient.addColorStop(1, "#52303e");
        ctx!.fillStyle = gradient;
        ctx!.fill();

        if (amount > .42) {
          ctx!.globalAlpha = Math.min(.7, (amount - .42) * 1.1);
          ctx!.fillStyle = "#a4566d";
          ctx!.beginPath();
          ctx!.ellipse(417, 440 + depth * .6,
            14 * amount, 3.2 + 1.6 * amount, -.05, 0, Math.PI * 2);
          ctx!.fill();
        }
        ctx!.restore();
      }

      // Raised or worried eyebrows move by fractions of a pixel; keep
      // existing realistic source eyebrows visible underneath.
      const intensity = Math.max(face.surprise, face.worried * .65);
      if (intensity > .01) {
        ctx!.save();
        ctx!.globalAlpha = intensity * .28;
        ctx!.strokeStyle = "#eef0f7";
        ctx!.lineCap = "round";
        ctx!.lineWidth = 3;
        ctx!.beginPath();
        ctx!.moveTo(284, 262 - 3 * face.surprise);
        ctx!.quadraticCurveTo(333, 229 - 7 * face.surprise, 386, 276 - 4 * face.surprise);
        ctx!.stroke();
        ctx!.restore();
      }
    }

    function render(now: number) {
      raf = 0;
      if (!active || !visible || document.hidden || !base) return;
      raf = requestAnimationFrame(render);
      // 30 fps on small widgets, 45 fps on preview. Both work in Safari.
      const interval = size <= 72 ? 33 : 22;
      if (now - lastPaint < interval && !motionQuery.matches) return;
      const dt = Math.min(64, Math.max(0, now - (lastTick || now)));
      lastTick = now;
      lastPaint = now;

      const status = live.current.mood;
      const target = forMood(status);
      if (!motionQuery.matches) {
        if (now >= nextBlink && status !== "sleeping") {
          lastBlink = now;
          nextBlink = now + 3600 + Math.random() * 2700;
        }
        const timeSinceBlink = (now - lastBlink) / 240;
        const pulse = timeSinceBlink >= 0 && timeSinceBlink <= 1
          ? Math.pow(Math.sin(Math.PI * timeSinceBlink), 1.3)
          : 0;
        target.blink = Math.max(target.blink, pulse);
        if (status === "typing") {
          target.mouth = .18 + .63 * (.5 + .5 * Math.sin(now / 170))
            * (.78 + .22 * Math.cos(now / 590));
        }
        if (status === "idle") {
          target.gazeX = .19 * Math.sin(now / 2600);
          target.gazeY = .12 * Math.sin(now / 4200);
        }
        for (const key of Object.keys(target) as (keyof Face)[]) {
          const tau = key === "blink" ? 28 : 170;
          const alpha = 1 - Math.exp(-dt / tau);
          current[key] += (target[key] - current[key]) * alpha;
        }
      } else {
        current = { ...zero }; // A static, open-eyed portrait for reduced motion.
      }

      ctx!.clearRect(0, 0, renderSize, renderSize);
      ctx!.save();
      ctx!.scale(renderSize / 640, renderSize / 640);
      ctx!.drawImage(base, 0, 0, 640, 640);
      if (!motionQuery.matches) {
        drawEyes(current.gazeX, current.gazeY);
        drawBlink(current.blink, true);
        drawBlink(current.blink, false);
        drawExpression(current);
      }
      ctx!.restore();
    }

    function visibilityChanged() {
      if (active && !document.hidden && visible && !raf) raf = requestAnimationFrame(render);
    }
    canvas.addEventListener("berni-blink-now", onForceBlink);
    document.addEventListener("visibilitychange", visibilityChanged);
    if ("IntersectionObserver" in window) {
      watcher = new IntersectionObserver(entries => {
        visible = !!entries[0]?.isIntersecting;
        if (!visible && raf) { cancelAnimationFrame(raf); raf = 0; }
        if (visible && !raf && !document.hidden) raf = requestAnimationFrame(render);
      });
      watcher.observe(canvas);
    }

    // Eyelids are optional. Even if the reference cannot load, the neutral
    // illustration remains OPEN and the mouth keeps animating.
    void Promise.all([
      load(BASE),
      load(EYELIDS).catch(() => null),
    ]).then(([main, closed]) => {
      if (!active) return;
      base = main;
      lids = closed;
      ctx.drawImage(main, 0, 0, canvas.width, canvas.height);
      setReady(true);
      if (!raf && visible && !document.hidden) raf = requestAnimationFrame(render);
    }).catch(() => {
      // The Next Image under the canvas is the no-JS/no-image fallback.
    });

    return () => {
      active = false;
      if (raf) cancelAnimationFrame(raf);
      watcher?.disconnect();
      canvas.removeEventListener("berni-blink-now", onForceBlink);
      document.removeEventListener("visibilitychange", visibilityChanged);
    };
  }, [size]);

  return (
    <canvas
      ref={ref}
      data-testid="berni-continuous-face"
      data-ready={ready ? "true" : "false"}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ opacity: ready ? 1 : 0, transition: "opacity 140ms ease-in-out" }}
    />
  );
}
