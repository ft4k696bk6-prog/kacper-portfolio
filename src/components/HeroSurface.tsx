"use client";

import { useEffect, useRef } from "react";

/**
 * A fine, folded surface rather than a field of floating particles.
 * Pointer movement changes its curvature; rendering stops once it settles.
 */
export function HeroSurface() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const hero = canvas?.closest("section");
    const context = canvas?.getContext("2d");
    if (!canvas || !hero || !context) return;

    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = matchMedia("(hover: hover) and (pointer: fine)");
    let width = 0, height = 0, frame = 0, visible = true, previousTime = 0;
    const rest = { x: .64, y: .72, strength: 0 };
    const current = { ...rest };
    let target = { ...rest };

    function draw() {
      if (!context || !canvas || width === 0 || height === 0) return;
      context.clearRect(0, 0, width, height);
      const mobile = width < 768;
      const bandTop = height * (mobile ? .74 : .66);
      const bandHeight = Math.min(height * .32, 280);
      const pointerX = current.x * width;
      const pointerY = current.y * height;
      for (let row = 0; row < 30; row++) {
        const depth = row / 29;
        const light = context.createLinearGradient(0, 0, width, 0);
        const peak = Math.max(.15, Math.min(.85, current.x));
        light.addColorStop(0, "rgba(182,190,196,0)");
        light.addColorStop(Math.max(0, peak - .25), "rgba(182,190,196,.035)");
        light.addColorStop(peak, `rgba(205,211,216,${.11 + Math.sin(depth * Math.PI) * .09})`);
        light.addColorStop(Math.min(1, peak + .25), "rgba(182,190,196,.045)");
        light.addColorStop(1, "rgba(182,190,196,0)");
        context.strokeStyle = light;
        context.lineWidth = .8;
        context.beginPath();
        for (let step = 0; step <= 100; step++) {
          const x = width * step / 100;
          const normalized = x / width;
          const fold = Math.sin(normalized * Math.PI * 2.1 + depth * 1.6) * (mobile ? 24 : 50);
          const baseY = bandTop + depth * bandHeight + fold;
          const distanceX = (x - pointerX) / Math.max(width * .2, 140);
          const distanceY = (baseY - pointerY) / 300;
          const influence = Math.exp(-distanceX * distanceX - distanceY * distanceY);
          const y = baseY - influence * current.strength * 70 * Math.sin(depth * Math.PI);
          if (step === 0) context.moveTo(x, y);
          else context.lineTo(x, y);
        }
        context.stroke();
      }
    }

    function stop() {
      cancelAnimationFrame(frame);
      frame = 0;
      previousTime = 0;
    }

    function tick(time: number) {
      frame = 0;
      if (!visible || document.hidden || reduced.matches || !finePointer.matches) return;
      const elapsed = previousTime ? Math.min(time - previousTime, 40) : 16;
      previousTime = time;
      const ease = 1 - Math.exp(-elapsed / 120);
      current.x += (target.x - current.x) * ease;
      current.y += (target.y - current.y) * ease;
      current.strength += (target.strength - current.strength) * ease;
      draw();
      const delta = Math.abs(target.x - current.x) + Math.abs(target.y - current.y) + Math.abs(target.strength - current.strength);
      if (delta > .001) frame = requestAnimationFrame(tick);
      else previousTime = 0;
    }

    function schedule() {
      if (!frame && visible && !document.hidden && !reduced.matches && finePointer.matches) frame = requestAnimationFrame(tick);
    }

    function move(event: PointerEvent) {
      if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
      if (reduced.matches || !finePointer.matches) return;
      const rect = hero!.getBoundingClientRect();
      target = { x: Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)), y: Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height)), strength: 1 };
      schedule();
    }

    function reset() { target = { ...rest }; schedule(); }
    function preferenceChanged() {
      stop();
      target = { ...rest };
      Object.assign(current, rest);
      draw();
    }
    function resize() {
      const rect = hero!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas!.width = Math.round(width * ratio);
      canvas!.height = Math.round(height * ratio);
      context!.setTransform(ratio, 0, 0, ratio, 0, 0);
      draw();
    }
    function visibilityChanged() {
      if (document.hidden) stop();
      else schedule();
    }

    const resizeObserver = new ResizeObserver(resize);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) schedule();
      else stop();
    });
    resizeObserver.observe(hero);
    intersectionObserver.observe(hero);
    hero.addEventListener("pointermove", move, { passive: true });
    hero.addEventListener("pointerleave", reset);
    reduced.addEventListener("change", preferenceChanged);
    finePointer.addEventListener("change", preferenceChanged);
    document.addEventListener("visibilitychange", visibilityChanged);
    resize();
    return () => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      hero.removeEventListener("pointermove", move);
      hero.removeEventListener("pointerleave", reset);
      reduced.removeEventListener("change", preferenceChanged);
      finePointer.removeEventListener("change", preferenceChanged);
      document.removeEventListener("visibilitychange", visibilityChanged);
    };
  }, []);

  return <canvas ref={ref} className="hero-surface" aria-hidden="true"/>;
}
