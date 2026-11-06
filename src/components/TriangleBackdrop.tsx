"use client";

import { useEffect, useRef } from "react";

/** A fixed, faceted ribbon. It redraws only on resize or pointer movement. */
export function TriangleBackdrop() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const context = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !context) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const fine = matchMedia("(pointer: fine)");
    let width = 0, height = 0, frame = 0;
    let x = 0, y = 0, targetX = 0, targetY = 0;

    function draw() {
      frame = 0;
      if (document.hidden) return;
      x += (targetX - x) * .12;
      y += (targetY - y) * .12;
      context!.clearRect(0, 0, width, height);
      const rows = 68, columns = 16;
      for (let row = 0; row < rows; row++) {
        const t = row / (rows - 1);
        const bend = Math.sin(t * Math.PI * 2 - .6);
        for (let column = 0; column < columns; column++) {
          const u = column / (columns - 1) - .5;
          const twist = Math.cos(t * Math.PI * 2.3);
          const px = width * (.82 + bend * .14 + u * (.13 + .11 * Math.abs(twist))) + x * (1 + u);
          const py = height * (-.08 + t * 1.18) + u * 100 * Math.sin(t * Math.PI * 2.3) + y;
          const edge = Math.sin((column + 1) / (columns + 1) * Math.PI);
          const facet = (Math.sin(row * 13.3 + column * 7.7) + 1) / 2;
          const size = Math.min(width / 130, 8) * (.35 + edge * .65);
          const angle = twist * .8 + (row % 2 ? Math.PI : 0);
          const alpha = (.08 + facet * .26) * edge;
          context!.beginPath();
          for (let point = 0; point < 3; point++) {
            const a = angle + point * Math.PI * 2 / 3;
            const vx = px + Math.cos(a) * size;
            const vy = py + Math.sin(a) * size;
            if (point === 0) context!.moveTo(vx, vy); else context!.lineTo(vx, vy);
          }
          context!.closePath();
          context!.fillStyle = `rgba(214,177,107,${alpha})`;
          context!.fill();
        }
      }
      if (Math.abs(targetX - x) + Math.abs(targetY - y) > .08) schedule();
    }
    function schedule() { if (!frame && !document.hidden) frame = requestAnimationFrame(draw); }
    function resize() {
      const rect = canvas!.getBoundingClientRect();
      width = rect.width; height = rect.height;
      const dpr = Math.min(devicePixelRatio || 1, 1.5);
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      context!.setTransform(dpr, 0, 0, dpr, 0, 0);
      schedule();
    }
    function pointer(event: PointerEvent) {
      if (reduced.matches || !fine.matches || event.pointerType === "touch") return;
      targetX = (event.clientX / width - .5) * 20;
      targetY = (event.clientY / height - .5) * 12;
      schedule();
    }
    function reset() { targetX = 0; targetY = 0; schedule(); }
    function visibility() {
      if (document.hidden) { cancelAnimationFrame(frame); frame = 0; }
      else schedule();
    }
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    window.addEventListener("pointermove", pointer, { passive: true });
    document.documentElement.addEventListener("pointerleave", reset);
    document.addEventListener("visibilitychange", visibility);
    reduced.addEventListener("change", reset);
    fine.addEventListener("change", reset);
    resize();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("pointermove", pointer);
      document.documentElement.removeEventListener("pointerleave", reset);
      document.removeEventListener("visibilitychange", visibility);
      reduced.removeEventListener("change", reset);
      fine.removeEventListener("change", reset);
    };
  }, []);

  return <canvas ref={ref} className="triangle-backdrop" aria-hidden="true" />;
}
