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
uniform sampler2D uClosedEyes;
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

  // The exact neutral texture remains fixed. Eyes can glance and widen without
  // a large UV stretch (which previously produced double pupils).
  source.y += surprise * (n * (p.y - nearEye.y) * -.06
                          + f * (p.y - farEye.y) * -.045);

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

  // Match only the exact eyelid areas against a fixed reference expression.
  // The eyelid reveal is continuous in a shader, not an image-frame swap.
  // Eyes, eyebrows, nose, fur, headphones and both B logos keep one original
  // neutral image, with the small inner-eye patch fading gradually.
  vec4 closedEye = texture2D(uClosedEyes, p);
  float nearEyeArea = 1.0 - smoothstep(.50, .90,
    dot((p - nearEye) / vec2(.082, .053),
        (p - nearEye) / vec2(.082, .053)));
  float farEyeArea = 1.0 - smoothstep(.50, .92,
    dot((p - farEye) / vec2(.034, .039),
        (p - farEye) / vec2(.034, .039)));
  float eyelidMask = clamp(max(nearEyeArea, farEyeArea), 0.0, 1.0);
  float shut = smoothstep(.04, .93, blink);
  skin.rgb = mix(skin.rgb, closedEye.rgb, eyelidMask * shut);

  // The opening follows the EXISTING curved dark smile instead of
  // stamping a round ellipse over a different muzzle.
  float t = clamp((p.x - .566) / .147, 0.0, 1.0);
  float taper = pow(max(0.0, sin(3.14159265 * t)), .6);
  float lip = .620 + .058 * smoothstep(0.0, .65, t)
            + .009 * sin(3.14159265 * t);
  float depth = mouth * mix(.034, .039, smile > 0.0 ? smile : 0.0) * taper;
  float aperture = smoothstep(lip - .002, lip + .004, p.y)
                 * (1.0 - smoothstep(lip + depth - .006, lip + depth + .002, p.y));
  aperture *= smoothstep(0.0, .13, t)
            * (1.0 - smoothstep(.88, 1.0, t))
            * taper * smoothstep(.05, .25, mouth);
  vec3 darkMouth = vec3(.070, .047, .062);
  vec2 tonguePos = vec2((p.x - .645) / .054,
                        (p.y - (lip + depth * .75)) / (depth * .35 + .001));
  float tongue = (1.0 - smoothstep(.23, .45, dot(tonguePos, tonguePos)))
               * smoothstep(.35, .70, mouth);
  darkMouth = mix(darkMouth, vec3(.47, .18, .27), tongue);
  skin.rgb = mix(skin.rgb, darkMouth, aperture * skin.a * .98);

  gl_FragColor = skin;
}
`;

const SOURCE = "/images/berni/berni-fox-head.png";
const CLOSED_EYES = "/images/berni/eyelids-closed.jpg";
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
    let closedTexture: WebGLTexture | null = null;
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
      if (!alive || document.hidden || !visible || !program || !texture || !closedTexture || !buffer) return;
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
      gl!.activeTexture(gl!.TEXTURE1);
      gl!.bindTexture(gl!.TEXTURE_2D, closedTexture);
      gl!.uniform1i(gl!.getUniformLocation(program, "uClosedEyes"), 1);
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
      closedTexture = gl.createTexture();
      if (!closedTexture) throw new Error("Unable to create Berni eyelid texture");
      gl.bindTexture(gl.TEXTURE_2D, closedTexture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    } catch (error) {
      if (process.env.NODE_ENV !== "production") console.warn("Berni graphics fallback", error);
      if (program) gl.deleteProgram(program);
      if (buffer) gl.deleteBuffer(buffer);
      if (texture) gl.deleteTexture(texture);
      if (closedTexture) gl.deleteTexture(closedTexture);
      canvas.removeEventListener("berni-force-blink", onBlink);
      document.removeEventListener("visibilitychange", onPageVisibility);
      return;
    }

    function loadImage(url: string): Promise<HTMLImageElement> {
      return new Promise((resolve, reject) => {
        const img = new window.Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error("Berni image unavailable: " + url));
        img.src = url;
      });
    }
    void Promise.all([loadImage(SOURCE), loadImage(CLOSED_EYES)])
      .then(([portrait, eyelid]) => {
        if (!alive || !texture || !closedTexture) return;
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 0);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
          gl.UNSIGNED_BYTE, portrait);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, closedTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
          gl.UNSIGNED_BYTE, eyelid);
        draw(performance.now());
        setLoaded(true);
        onReady?.();
      })
      .catch(() => {
        // Never hide the matching static portrait if a texture fails to load.
      });
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
      if (closedTexture) gl.deleteTexture(closedTexture);
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
