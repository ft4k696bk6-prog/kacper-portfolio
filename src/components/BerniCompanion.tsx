"use client";

import { useEffect, useRef, useState } from "react";
import { BerniRobot } from "@/components/BerniRobot";
import {
  classifyBerniWeather, detectBerniReaction,
  type BerniMood, type BerniWeather,
} from "@/lib/berni-reactions";
import type { CompanionWeather } from "@/lib/companion-scenarios";

type Props = {
  lang: "pl" | "en";
  mood: "idle" | "curious" | "joking" | "listening" | "thinking";
  input: string;
  loading: boolean;
  listening: boolean;
  open: boolean;
  lastReply: string;
  nudgeText: string;
  weatherContext: CompanionWeather | null;
  onOpen: () => void;
};

/** Companion visuals are intentionally independent of the chat backend. */
export function BerniCompanion({
  lang, mood, input, loading, listening, open, lastReply, nudgeText, weatherContext, onOpen,
}: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const lastActivityRef = useRef(0);
  const [sleeping, setSleeping] = useState(false);
  const [reaction, setReaction] = useState<BerniMood | null>(null);
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
    loading ? "thinking" :
    listening ? "listening" :
    input.trim() ? "typing" :
    reaction ?? (sleeping && !open ? "sleeping" :
      mood === "joking" ? "happy" : mood === "idle" ? "idle" : mood);

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

  return (
    <div ref={hostRef} className="relative h-[6.2rem] w-[6.2rem] sm:h-28 sm:w-28"
      data-testid="berni-companion" data-mood={robotMood} data-weather={weather?.condition ?? "unknown"}>
      <button type="button"
        onMouseEnter={() => { setSleeping(false); setReaction("curious"); }}
        onClick={() => { setSleeping(false); setReaction("happy"); onOpen(); }}
        aria-label={lang === "pl" ? "Porozmawiaj z Bernim, asystentem AI" : "Talk to Berni, the AI assistant"}
        title={lang === "pl" ? "Berni — asystent AI" : "Berni — AI assistant"}
        data-testid="ai-mascot-open"
        className="group relative block h-full w-full rounded-[2rem] bg-transparent p-0 outline-none transition-transform duration-200 hover:scale-105 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black active:scale-95">
        <span className="absolute inset-x-3 bottom-2 h-9 rounded-full bg-white/[0.055] blur-xl transition group-hover:bg-white/[0.12]" />
        <BerniRobot mood={robotMood} weather={weather} lang={lang} />
      </button>

    </div>
  );
}
