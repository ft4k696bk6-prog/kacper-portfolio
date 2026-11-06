"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { createKineticForm, createKineticProjection } from "@/lib/kinetic-form";

export function KineticBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const clock = useRef(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const { lang } = useLanguage();

  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0, height = 0, frame = 0, previous = 0;
    let lines = createKineticForm();
    const gold = getComputedStyle(canvas).getPropertyValue("--brand-gold").trim();

    function draw(time: number) {
      ctx!.clearRect(0, 0, width, height);
      const mobile = width < 768;
      const scale = mobile ? width * .7 : Math.min(width * .43, height * .64);
      const centerX = width * (mobile ? .97 : .88);
      const centerY = height * (mobile ? .57 : .53);
      const project = createKineticProjection(time);
      ctx!.strokeStyle = gold;
      ctx!.lineWidth = mobile ? .85 : 1;
      for (const line of lines) {
        ctx!.beginPath();
        let depth = 0;
        for (let i = 0; i < line.length; i++) {
          const p = project(line[i]);
          depth += p.depth;
          const x = centerX + p.x * scale;
          const y = centerY + p.y * scale;
          if (i === 0) ctx!.moveTo(x, y); else ctx!.lineTo(x, y);
        }
        // Depth changes transparency, never the brand hue.
        ctx!.globalAlpha = .2 + (depth / line.length + 1.4) * .09;
        ctx!.stroke();
      }
      ctx!.globalAlpha = 1;
    }
    function tick(now: number) {
      frame = 0;
      if (document.hidden || paused || media.matches) { previous = 0; return; }
      const interval = width < 768 ? 1000 / 24 : 1000 / 30;
      if (!previous || now - previous >= interval) {
        clock.current += previous ? Math.min((now - previous) / 1000, .1) : 0;
        previous = now;
        draw(clock.current);
      }
      frame = requestAnimationFrame(tick);
    }
    function start() {
      if (!frame && !document.hidden && !paused && !media.matches) frame = requestAnimationFrame(tick);
    }
    function resize() {
      const box = canvas!.getBoundingClientRect();
      width = box.width; height = box.height;
      const dpr = Math.min(devicePixelRatio || 1, 1.5);
      canvas!.width = Math.round(width * dpr); canvas!.height = Math.round(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      lines = createKineticForm(width < 768 ? 34 : 52, width < 768 ? 80 : 120);
      draw(clock.current);
      start();
    }
    function visibility() {
      cancelAnimationFrame(frame); frame = 0; previous = 0;
      start();
    }
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    document.addEventListener("visibilitychange", visibility);
    resize();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [paused, reduced]);

  return <>
    <canvas ref={canvasRef} className="kinetic-backdrop" aria-hidden="true" />
    {!reduced && <button type="button" className="motion-toggle brand-outline" onClick={() => setPaused(value => !value)} aria-pressed={paused} aria-label={lang === "pl" ? (paused ? "Wznów animację tła" : "Zatrzymaj animację tła") : (paused ? "Resume background animation" : "Pause background animation")}>
      {paused ? <Play size={13} /> : <Pause size={13} />}<span>{lang === "pl" ? "Ruch tła" : "Motion"}</span>
    </button>}
  </>;
}
