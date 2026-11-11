"use client";

import { useEffect, useRef, useState } from "react";

export type BerniLivingMood =
  | "idle" | "curious" | "thinking" | "happy" | "excited"
  | "sleeping" | "typing" | "listening" | "surprised"
  | "worried" | "working" | "grabbed";

type Expression = {
  blink: number;
  mouth: number;
  smile: number;
  surprise: number;
  lookX: number;
  lookY: number;
  worried: number;
};

const VERTEX_SHADER = `
attribute vec2 aPosition;
varying vec2 vUV;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
  vUV = vec2((aPosition.x + 1.0) * 0.5, (1.0 - aPosition.y) * 0.5);
}
`;

/**
 * Single-texture facial rig. Every frame is sampled from the EXACT same
 * approved neutral portrait; no AI-generated JPEG replaces the face.
 * Smooth local texture deformation affects the eyelids, pupils and eyebrows.
 * A small shaded mouth opening is synthesized under the original smile.
 * Therefore face shape, fur color, B logos and headphones never jump.
 */
const FRAGMENT_SHADER = `
precision highp float;
varying vec2 vUV;
uniform sampler2D uPortrait;
uniform vec4 uFace;   // blink, mouth, smile, surprise
uniform vec4 uMotion; // lookX, lookY, worried, breathing

float gaussian(vec2 xy, vec2 center, vec2 radius) {
  vec2 q = (xy - center) / radius;
  return exp(-2.0 * dot(q, q));
}
float eyeMask(vec2 p, vec2 c, vec2 r) {
  vec2 d = (p - c) / r;
  return 1.0 - smoothstep(.55, 1.3, dot(d, d));
}
void main() {
  vec2 p = vUV;
  float blink = clamp(uFace.x, 0.0, 1.0);
  float mouth = clamp(uFace.y, 0.0, 1.0);
  float smile = clamp(uFace.z, -0.4, 1.0);
  float surprise = clamp(uFace.w, 0.0, 1.0);

  // Landmark coordinates were measured from the 640px approved artwork.
  // The far eye is perspective-correct: its region is much smaller.
  vec2 nearEye = vec2(.515, .497);
  vec2 farEye = vec2(.731, .537);
  vec2 nearRadius = vec2(.098, .069);
  vec2 farRadius = vec2(.044, .050);
  float n = eyeMask(p, nearEye, nearRadius);
  float f = eyeMask(p, farEye, farRadius);
  vec2 source = p;

  // Source-region contraction is continuous (not a hard image swap).
  // Nearby eyelid skin naturally slides into the gap as the eyes close.
  float nearClosure = blink * n;
  float farClosure = blink * f;
  float nearScale = 1.0 - .86 * blink;
  float farScale = 1.0 - .86 * blink;
  source.y += n * (p.y - nearEye.y) * (1.0 / nearScale - 1.0);
  source.y += f * (p.y - farEye.y) * (1.0 / farScale - 1.0);
  source.y += surprise * (n * (p.y - nearEye.y) * -.11
                          + f * (p.y - farEye.y) * -.09);

  // Pupils track the visitor gently, only inside the orbital masks.
  source.x -= uMotion.x * (.012 * n + .006 * f) * (1.0 - blink);
  source.y -= uMotion.y * (.008 * n + .004 * f) * (1.0 - blink);

  // Expressive eyebrows and tiny cheek lift, without re-rendering fur.
  float nearBrow = gaussian(p, vec2(.503, .410), vec2(.100, .031));
  float farBrow = gaussian(p, vec2(.733, .470), vec2(.043, .035));
  source.y += (surprise * .012 - uMotion.z * .004) * (nearBrow + farBrow);
  float cheek = gaussian(p, vec2(.631, .641), vec2(.111, .080));
  source.y += smile * .004 * cheek;

  vec4 skin = texture2D(uPortrait, clamp(source, .001, .999));

  // Draw an eyelid line *from the same source palette*. It follows
  // the perspective of each eye and fades in with closure.
  float nLine = n * exp(-pow((p.y - nearEye.y) / .005, 2.0));
  float fLine = f * exp(-pow((p.y - farEye.y) / .004, 2.0));
  float lid = max(nLine, fLine) * smoothstep(.48, .96, blink) * .56;
  skin.rgb = mix(skin.rgb, vec3(.20, .23, .30), lid * skin.a);

  // A continuously opening, tapered mouth under Berni's ORIGINAL smile.
  // It does not replace his muzzle with a different generated muzzle.
  vec2 mouthCenter = vec2(.641, .666 + mouth * .004);
  float mw = mix(.044, .058, smile > 0.0 ? smile : 0.0);
  mw = mix(mw, .034, surprise);
  float mh = .004 + mouth * (surprise > .4 ? .026 : .018);
  vec2 mouthLocal = (p - mouthCenter) / vec2(mw, max(mh,.003));
  // Mild curve follows his natural smile rather than a flat ellipse.
  mouthLocal.y += (mouthLocal.x * mouthLocal.x) * .21 * (1.0 - surprise);
  float edge = dot(mouthLocal, mouthLocal);
  float cavity = (1.0 - smoothstep(.79, 1.06, edge))
                 * smoothstep(.09, .27, mouth);
  vec3 darkMouth = mix(vec3(.10,.062,.087), vec3(.17,.083,.107),
                        smoothstep(-.15, .9, mouthLocal.y));
  // Pink tongue is visible only in the lower open-mouth region.
  float tongue = (1.0 - smoothstep(.32, .62,
                  length(vec2(mouthLocal.x * 1.1, (mouthLocal.y - .49) * 1.4))))
                  * smoothstep(.32,.64,mouth);
  darkMouth = mix(darkMouth, vec3(.53,.25,.33), tongue * .74);
  skin.rgb = mix(skin.rgb, darkMouth, cavity * skin.a * .93);

  gl_FragColor = skin;
}
`;

const SOURCE = "/images/berni/berni-fox-head.png";
const defaultExpression: Expression = {
  blink: 0, mouth: 0, smile: 0, surprise: 0,
  lookX: 0, lookY: 0, worried: 0,
};

function targetForMood(mood: BerniLivingMood): Expression {
  switch (mood) {
    case "curious": return { ...defaultExpression, lookX: .42, lookY: -.3, smile: .15 };
    case "thinking": return { ...defaultExpression, lookX: -.40, lookY: -.64, worried: .2 };
    case "listening": return { ...defaultExpression, lookX: .35, lookY: .02, smile: .12 };
    case "working": return { ...defaultExpression, lookX: -.42, lookY: -.5 };
    case "typing": return { ...defaultExpression, smile: .32, mouth: .45 };
    case "happy": return { ...defaultExpression, smile: .72, mouth: .19 };
    case "excited": return { ...defaultExpression, smile: 1, mouth: .55, surprise: .2 };
    case "surprised": return { ...defaultExpression, surprise: .9, mouth: .76, lookY: -.1 };
    case "grabbed": return { ...defaultExpression, surprise: .55, mouth: .35 };
    case "worried": return { ...defaultExpression, worried: 1, smile: -.25, lookY: .36 };
    case "sleeping": return { ...defaultExpression, blink: 1 };
    default: return defaultExpression;
  }
}

function compileShader(
  gl: WebGLRenderingContext, kind: number, source: string,
): WebGLShader {
  const shader = gl.createShader(kind);
  if (!shader) throw new Error("WebGL shader unavailable");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(log || "WebGL shader compile failed");
  }
  return shader;
}

export function BerniLivingFace({
  mood, size, blinkToken = 0, onReady,
}: {
  mood: BerniLivingMood;
  size: number;
  blinkToken?: number;
  onReady?: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const liveRef = useRef({ mood, blinkToken, pointerX: 0, pointerY: 0 });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    liveRef.current.mood = mood;
    if (blinkToken !== liveRef.current.blinkToken) {
      liveRef.current.blinkToken = blinkToken;
      if (blinkToken > 0) {
        canvasRef.current?.dispatchEvent(new CustomEvent("berni-force-blink"));
      }
    }
  }, [mood, blinkToken]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", {
      alpha: true, antialias: false, depth: false, stencil: false,
      preserveDrawingBuffer: false, premultipliedAlpha: false,
      powerPreference: "low-power",
    });
    if (!gl) return; // Static, accessible original image remains underneath.

    let alive = true;
    let raf = 0;
    let visible = true;
    let lastFrame = 0;
    let lastTick = 0;
    let blinkStarted = -10000;
    let manualBlinkStarted = -10000;
    let nextBlink = 1500 + Math.random() * 1500;
    let occasionalLookX = 0;
    let current: Expression = { ...defaultExpression };
    let program: WebGLProgram | null = null;
    let texture: WebGLTexture | null = null;
    let buffer: WebGLBuffer | null = null;
    let observer: IntersectionObserver | undefined;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onBlink = () => { manualBlinkStarted = performance.now(); };
    const onPageVisibility = () => {
      if (!document.hidden && visible && !raf) raf = requestAnimationFrame(draw);
    };
    canvas.addEventListener("berni-force-blink", onBlink);
    document.addEventListener("visibilitychange", onPageVisibility);

    function easeToward(from: number, to: number, dt: number): number {
      return from + (to - from) * (1 - Math.exp(-dt / 180));
    }
    function blinkCurve(now: number, start: number): number {
      const progress = (now - start) / 255;
      return progress >= 0 && progress <= 1
        ? Math.pow(Math.sin(Math.PI * progress), 1.55)
        : 0;
    }
    function draw(now: number) {
      raf = 0;
      if (!alive || document.hidden || !visible || !program || !texture || !buffer) return;
      raf = requestAnimationFrame(draw);
      // 45 fps cap keeps three tiny widgets cheap on iPhone.
      if (now - lastFrame < 22 && !reduced.matches) return;
      const dt = Math.max(0, Math.min(48, now - (lastTick || now)));
      lastFrame = now;
      lastTick = now;

      const actualMood = liveRef.current.mood;
      const target = targetForMood(actualMood);
      if (!reduced.matches) {
        if (now > nextBlink && actualMood !== "sleeping") {
          blinkStarted = now;
          nextBlink = now + 3100 + Math.random() * 2600;
        }
        const naturalBlink = Math.max(
          blinkCurve(now, blinkStarted),
          blinkCurve(now, manualBlinkStarted),
        );
        target.blink = Math.max(target.blink, naturalBlink);
        if (actualMood === "typing") {
          // Natural, continuously interpolated visemes instead of a repeated GIF.
          target.mouth = .25 + .42 * Math.abs(Math.sin(now / 178) * Math.cos(now / 491));
        }
        if (actualMood === "idle") {
          occasionalLookX = Math.sin(now / 2500) * .22;
          target.lookX = occasionalLookX;
          target.lookY = Math.sin(now / 4100) * .12;
        }
        for (const key of Object.keys(target) as (keyof Expression)[]) {
          // Blink is quick, mood changes are gradual.
          current[key] = easeToward(
            current[key], target[key], key === "blink" ? dt * 1.8 : dt,
          );
        }
      } else {
        current = target; // Respect reduced-motion; no automatic loops.
      }
      gl!.viewport(0, 0, canvas!.width, canvas!.height);
      gl!.clearColor(0, 0, 0, 0);
      gl!.clear(gl!.COLOR_BUFFER_BIT);
      gl!.useProgram(program);
      gl!.bindBuffer(gl!.ARRAY_BUFFER, buffer);
      const position = gl!.getAttribLocation(program, "aPosition");
      gl!.enableVertexAttribArray(position);
      gl!.vertexAttribPointer(position, 2, gl!.FLOAT, false, 0, 0);
      gl!.activeTexture(gl!.TEXTURE0);
      gl!.bindTexture(gl!.TEXTURE_2D, texture);
      gl!.uniform1i(gl!.getUniformLocation(program, "uPortrait"), 0);
      gl!.uniform4f(gl!.getUniformLocation(program, "uFace"),
        current.blink, current.mouth, current.smile, current.surprise);
      gl!.uniform4f(gl!.getUniformLocation(program, "uMotion"),
        current.lookX, current.lookY, current.worried, now / 1000);
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
    }

    try {
      const vert = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
      const frag = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
      program = gl.createProgram();
      if (!program) throw new Error("Unable to create Berni program");
      gl.attachShader(program, vert);
      gl.attachShader(program, frag);
      gl.linkProgram(program);
      gl.deleteShader(vert);
      gl.deleteShader(frag);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(program) || "Berni WebGL link failed");
      }
      buffer = gl.createBuffer();
      if (!buffer) throw new Error("Unable to create Berni vertex buffer");
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1, -1, 1, -1, -1, 1, 1, 1,
      ]), gl.STATIC_DRAW);
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.min(512, Math.max(64, Math.round(size * dpr)));
      canvas.height = canvas.width;
      texture = gl.createTexture();
      if (!texture) throw new Error("Unable to create Berni texture");
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    } catch (error) {
      if (process.env.NODE_ENV !== "production") console.warn("Berni graphics fallback", error);
      if (program) gl.deleteProgram(program);
      if (buffer) gl.deleteBuffer(buffer);
      if (texture) gl.deleteTexture(texture);
      canvas.removeEventListener("berni-force-blink", onBlink);
      document.removeEventListener("visibilitychange", onPageVisibility);
      return;
    }

    const portrait = new window.Image();
    portrait.src = SOURCE;
    portrait.onload = () => {
      if (!alive || !texture) return;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 0);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
        gl.UNSIGNED_BYTE, portrait);
      draw(performance.now());
      setLoaded(true);
      onReady?.();
    };
    portrait.onerror = () => {
      // Keep the original Next Image visible. No blank chatbot.
    };
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(entries => {
        visible = entries[0]?.isIntersecting ?? true;
        if (visible && !raf && !document.hidden) raf = requestAnimationFrame(draw);
        if (!visible && raf) { cancelAnimationFrame(raf); raf = 0; }
      }, { threshold: 0 });
      observer.observe(canvas);
    }
    return () => {
      alive = false;
      if (raf) cancelAnimationFrame(raf);
      observer?.disconnect();
      canvas.removeEventListener("berni-force-blink", onBlink);
      document.removeEventListener("visibilitychange", onPageVisibility);
      if (texture) gl.deleteTexture(texture);
      if (buffer) gl.deleteBuffer(buffer);
      if (program) gl.deleteProgram(program);
    };
  }, [size, onReady]);

  return (
    <canvas
      ref={canvasRef}
      data-testid="berni-continuous-face"
      data-ready={loaded ? "true" : "false"}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ opacity: loaded ? 1 : 0, transition: "opacity 120ms ease-out" }}
    />
  );
}
