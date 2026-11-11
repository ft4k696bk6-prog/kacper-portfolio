"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { BerniRobot } from "@/components/BerniRobot";
import {
  classifyBerniWeather, detectBerniReaction,
  type BerniMood, type BerniWeather,
} from "@/lib/berni-reactions";
import type { CompanionWeather } from "@/lib/companion-scenarios";
import { clampBerniPosition, normalizeBerniPosition, denormalizeBerniPosition, type BerniPositionRatio } from "@/lib/berni-drag";

type Props = {
  lang: "pl" | "en";
  mood: "idle" | "curious" | "joking" | "thinking";
  input: string;
  loading: boolean;
  open: boolean;
  lastReply: string;
  nudgeText: string;
  weatherContext: CompanionWeather | null;
  onOpen: () => void;
  onDragEnd?: (bounds: { x: number; y: number; width: number; height: number }) => void;
};

/** Companion visuals are intentionally independent of the chat backend. */
export function BerniCompanion({
  lang, mood, input, loading, open, lastReply, nudgeText, weatherContext, onOpen, onDragEnd,
}: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const lastActivityRef = useRef(0);
  const [sleeping, setSleeping] = useState(false);
  const [reaction, setReaction] = useState<BerniMood | null>(null);
  const [idleGesture, setIdleGesture] = useState<BerniMood | null>(null);
  const [gestureCycle, setGestureCycle] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [hovered, setHovered] = useState(false);
  const suppressClickRef = useRef(false);
  const pressRef = useRef<{
    id: number; startX: number; startY: number; originX: number; originY: number;
    width: number; height: number; active: boolean; timer: number; floating: HTMLElement;
  } | null>(null);
  // Context is inferred server-side from approximate IP region after consent.
  // It only influences expressions, never adds a standalone forecast or GPS prompt.
  const weather: BerniWeather | null = weatherContext && Number.isFinite(weatherContext.temperature)
    ? {
        condition: classifyBerniWeather(weatherContext.symbol ?? "", weatherContext.windSpeed ?? 0),
        temperature: weatherContext.temperature,
        updatedAt: "",
        source: "MET Norway",
      }
    : null;

  const robotMood: BerniMood =
    dragging ? "grabbed" :
    input.trim() ? "typing" :
    loading ? "thinking" :
    reaction ?? (sleeping && !open ? "sleeping" :
      idleGesture ?? (hovered ? "curious" : (mood === "joking" ? "happy" : mood === "idle" ? "idle" : mood)));

  useEffect(() => {
    if (!lastReply) {
      const clear = window.setTimeout(() => setReaction(null), 0);
      return () => window.clearTimeout(clear);
    }
    const start = window.setTimeout(() => setReaction(detectBerniReaction(lastReply)), 0);
    const end = window.setTimeout(() => setReaction(null), 6200);
    return () => { window.clearTimeout(start); window.clearTimeout(end); };
  }, [lastReply]);

  useEffect(() => {
    if (!nudgeText) return;
    const start = window.setTimeout(() => {
      const eventMood = detectBerniReaction(nudgeText);
      setReaction(eventMood === "idle" ? "curious" : eventMood);
    }, 0);
    const end = window.setTimeout(() => setReaction(null), 12500);
    return () => { window.clearTimeout(start); window.clearTimeout(end); };
  }, [nudgeText]);

  // Berni has a short, randomized idle action every few seconds even if no
  // visitor interacts with him. Timers are paused for open chat, active text,
  // reduced motion and sleeping. No animation libraries or network calls.
  useEffect(() => {
    if (open || loading || input.trim() || sleeping || reaction ||
        document.visibilityState !== "visible" ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIdleGesture(null);
      return;
    }

    const actions: BerniMood[] = ["curious", "happy", "surprised", "excited", "thinking"];
    let resetTimer: number | undefined;
    const startTimer = window.setTimeout(() => {
      if (document.visibilityState !== "visible") return;
      const next = actions[Math.floor(Math.random() * actions.length)];
      setIdleGesture(next);
      resetTimer = window.setTimeout(() => {
        setIdleGesture(null);
        setGestureCycle(current => current + 1);
      }, 1350 + Math.floor(Math.random() * 850));
    }, 3300 + Math.floor(Math.random() * 3600));
    return () => {
      window.clearTimeout(startTimer);
      if (resetTimer !== undefined) window.clearTimeout(resetTimer);
    };
  }, [open, loading, input, sleeping, reaction, gestureCycle]);

  useEffect(() => {
    if (!lastActivityRef.current) lastActivityRef.current = Date.now();
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    let frame = 0;
    const onMove = (event: PointerEvent) => {
      lastActivityRef.current = Date.now();
      if (sleeping) setSleeping(false);
      if (!finePointer || frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const host = hostRef.current;
        if (!host) return;
        const bounds = host.getBoundingClientRect();
        const x = (event.clientX - bounds.left - bounds.width / 2) / Math.max(1, bounds.width);
        const y = (event.clientY - bounds.top - bounds.height / 2) / Math.max(1, bounds.height);
        host.style.setProperty("--berni-look-x", Math.max(-5, Math.min(5, x * 9)).toFixed(2) + "px");
        host.style.setProperty("--berni-look-y", Math.max(-3, Math.min(3, y * 6)).toFixed(2) + "px");
      });
    };
    const onActivity = () => {
      lastActivityRef.current = Date.now();
      setSleeping(false);
    };
    const onVisibility = () => {
      if (document.visibilityState === "visible") onActivity();
    };
    const timer = window.setInterval(() => {
      if (!open && document.visibilityState === "visible" && Date.now() - lastActivityRef.current > 55000) {
        setSleeping(true);
      }
    }, 7000);
    const onScroll = () => {
      // Tracking activity is cheap: no state updates on each scroll frame.
      lastActivityRef.current = Date.now();
      if (sleeping) setSleeping(false);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onActivity, { passive: true });
    window.addEventListener("keydown", onActivity);
    window.addEventListener("touchstart", onActivity, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onActivity);
      window.removeEventListener("keydown", onActivity);
      window.removeEventListener("touchstart", onActivity);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      window.clearInterval(timer);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [open, sleeping]);

  // Store only viewport-relative placement, never visitor identity or screen
  // coordinates from the operating system. Clamp after resize/rotation.
  useEffect(() => {
    const floating = hostRef.current?.closest<HTMLElement>("[data-berni-floating]");
    if (!floating) return;
    const restore = () => {
      try {
        const raw = localStorage.getItem("berni-drag-position-v1");
        if (!raw) return;
        const saved = JSON.parse(raw) as BerniPositionRatio;
        const measured = floating.getBoundingClientRect();
        const pos = denormalizeBerniPosition(saved, { width: window.innerWidth, height: window.innerHeight },
          { width: measured.width, height: measured.height });
        if (!pos) return;
        floating.style.left = pos.x + "px";
        floating.style.top = pos.y + "px";
        floating.style.right = "auto";
        floating.style.bottom = "auto";
        onDragEnd?.({ ...pos, width: measured.width, height: measured.height });
      } catch { /* Storage may be unavailable; default dock remains usable. */ }
    };
    const initial = window.setTimeout(restore, 250);
    window.addEventListener("resize", restore, { passive: true });
    return () => { window.clearTimeout(initial); window.removeEventListener("resize", restore); };
  }, [onDragEnd]);

  function handlePointerDown(event: ReactPointerEvent<HTMLButtonElement>) {
    if (open || event.button !== 0) return;
    const floating = hostRef.current?.closest<HTMLElement>("[data-berni-floating]");
    if (!floating) return;
    const rect = floating.getBoundingClientRect();
    if (pressRef.current) window.clearTimeout(pressRef.current.timer);
    const press = {
      id: event.pointerId, startX: event.clientX, startY: event.clientY,
      originX: rect.left, originY: rect.top, width: rect.width, height: rect.height,
      active: false, timer: 0, floating,
    };
    pressRef.current = press;
    try { event.currentTarget.setPointerCapture(event.pointerId); } catch { /* Safari fallback */ }
    press.timer = window.setTimeout(() => {
      if (pressRef.current !== press) return;
      press.active = true;
      setDragging(true);
      setSleeping(false);
      setReaction(null);
      setIdleGesture(null);
    }, event.pointerType === "mouse" ? 200 : 340);
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLButtonElement>) {
    const press = pressRef.current;
    if (!press || press.id !== event.pointerId) return;
    const dx = event.clientX - press.startX;
    const dy = event.clientY - press.startY;
    if (!press.active) {
      // A quick swipe must not accidentally grab the pet.
      if (Math.hypot(dx, dy) > 12) {
        window.clearTimeout(press.timer);
        pressRef.current = null;
        try { event.currentTarget.releasePointerCapture(event.pointerId); } catch {}
      }
      return;
    }
    event.preventDefault();
    const pos = clampBerniPosition(
      { x: press.originX + dx, y: press.originY + dy },
      { width: window.innerWidth, height: window.innerHeight },
      { width: press.width, height: press.height },
    );
    press.floating.style.left = pos.x + "px";
    press.floating.style.top = pos.y + "px";
    press.floating.style.right = "auto";
    press.floating.style.bottom = "auto";
  }

  function finishPointer(event: ReactPointerEvent<HTMLButtonElement>) {
    const press = pressRef.current;
    if (!press || press.id !== event.pointerId) return;
    window.clearTimeout(press.timer);
    pressRef.current = null;
    if (press.active) {
      suppressClickRef.current = true;
      setDragging(false);
      const rect = press.floating.getBoundingClientRect();
      const pos = clampBerniPosition({ x: rect.left, y: rect.top },
        { width: window.innerWidth, height: window.innerHeight },
        { width: rect.width, height: rect.height });
      press.floating.style.left = pos.x + "px";
      press.floating.style.top = pos.y + "px";
      press.floating.style.right = "auto";
      press.floating.style.bottom = "auto";
      try {
        localStorage.setItem("berni-drag-position-v1", JSON.stringify(normalizeBerniPosition(pos,
          { width: window.innerWidth, height: window.innerHeight },
          { width: rect.width, height: rect.height })));
      } catch { /* Drag works without storage. */ }
      onDragEnd?.({ ...pos, width: rect.width, height: rect.height });
      window.setTimeout(() => { suppressClickRef.current = false; }, 360);
    }
    try { event.currentTarget.releasePointerCapture(event.pointerId); } catch {}
  }

  useEffect(() => () => {
    if (pressRef.current) window.clearTimeout(pressRef.current.timer);
  }, []);

  return (
    <div ref={hostRef} className="relative h-[6.2rem] w-[6.2rem] sm:h-28 sm:w-28"
      data-testid="berni-companion" data-mood={robotMood} data-weather={weather?.condition ?? "unknown"} data-dragging={dragging ? "true" : "false"}>
      <button type="button"
        onMouseEnter={() => { setSleeping(false); setHovered(true); }}
        onMouseLeave={() => setHovered(false)}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishPointer}
        onPointerCancel={finishPointer}
        onClick={() => {
          if (suppressClickRef.current) return;
          setSleeping(false);
          setReaction("happy");
          onOpen();
        }}
        aria-label={lang === "pl" ? "Porozmawiaj z Bernim, asystentem AI" : "Talk to Berni, the AI assistant"}
        title={lang === "pl" ? "Berni — kliknij, aby porozmawiać. Przytrzymaj i przeciągnij, aby go przesunąć." : "Berni — click to chat. Press and hold to drag me."}
        data-testid="ai-mascot-open"
        className={`group relative block h-full w-full touch-none select-none rounded-[2rem] bg-transparent p-0 outline-none transition-transform duration-200 hover:scale-105 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black active:scale-95 ${dragging ? "cursor-grabbing scale-110" : "cursor-grab"}`} style={{ WebkitUserSelect: "none", WebkitTouchCallout: "none" } as React.CSSProperties}>
        <span className="absolute inset-x-3 bottom-2 h-9 rounded-full bg-white/[0.055] blur-xl transition group-hover:bg-white/[0.12]" />
        <BerniRobot mood={robotMood} weather={weather} lang={lang} />
      </button>

    </div>
  );
}
