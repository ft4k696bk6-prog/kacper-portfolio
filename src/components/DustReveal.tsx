"use client";
import { useEffect, useRef } from "react";

/** Text particles disperse, then converge on the revealed contact value. */
export function DustReveal({ text }: { text: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const w = canvas.clientWidth, h = canvas.clientHeight;
    canvas.width = w * 2; canvas.height = h * 2; ctx.scale(2, 2);
    const sample = (label: string) => {
      ctx.clearRect(0, 0, w, h); ctx.fillStyle = "#fff";
      ctx.font = `500 ${Math.min(14, w / (label.length * .59))}px sans-serif`;
      ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(label, w / 2, h / 2);
      const data = ctx.getImageData(0, 0, w * 2, h * 2).data;
      const points: number[][] = [];
      for (let y = 0; y < h * 2; y += 3) for (let x = 0; x < w * 2; x += 3) if (data[(y * w * 2 + x) * 4 + 3] > 100) points.push([x / 2, y / 2]);
      return points;
    };
    const from = sample("Odsłoń kontakt"), to = sample(text);
    if (!from.length || !to.length) return;
    const particles = Array.from({ length: Math.min(650, to.length) }, (_, i) => ({ from: from[i % from.length], to: to[i % to.length], dx: Math.sin(i * 13.7) * 60, dy: Math.cos(i * 7.3) * 40 }));
    let frame = 0; const start = performance.now();
    const draw = (now: number) => {
      const t = Math.min(1, (now - start) / 1000), ease = t * t * (3 - 2 * t), scatter = Math.sin(t * Math.PI);
      ctx.clearRect(0, 0, w, h); ctx.fillStyle = "#d4af6a";
      for (const p of particles) { const x = p.from[0] + (p.to[0] - p.from[0]) * ease + p.dx * scatter, y = p.from[1] + (p.to[1] - p.from[1]) * ease + p.dy * scatter; ctx.fillRect(x, y, .8, .8); }
      if (t < 1) frame = requestAnimationFrame(draw); else ctx.clearRect(0, 0, w, h);
    };
    frame = requestAnimationFrame(draw); return () => cancelAnimationFrame(frame);
  }, [text]);
  return <canvas ref={ref} className="contact-dust" aria-hidden="true"/>;
}
