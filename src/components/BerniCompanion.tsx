"use client";

import { useEffect, useRef, useState } from "react";
import { CloudSun, Loader2 } from "lucide-react";
import { BerniRobot } from "@/components/BerniRobot";
import {
  detectBerniReaction, getBerniWeatherLabel,
  type BerniMood, type BerniWeather,
} from "@/lib/berni-reactions";

type Props = {
  lang: "pl" | "en";
  mood: "idle" | "curious" | "joking" | "listening" | "thinking";
  input: string;
  loading: boolean;
  listening: boolean;
  open: boolean;
  lastReply: string;
  onOpen: () => void;
};

/** Companion visuals are intentionally independent of the chat backend. */
export function BerniCompanion({
  lang, mood, input, loading, listening, open, lastReply, onOpen,
}: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const lastActivityRef = useRef(0);
  const geoPendingRef = useRef(false);
  const [sleeping, setSleeping] = useState(false);
  const [reaction, setReaction] = useState<BerniMood | null>(null);
  const [weather, setWeather] = useState<BerniWeather | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState("");

  const robotMood: BerniMood =
    loading ? "thinking" :
    listening ? "listening" :
    input.trim() ? "typing" :
    reaction ?? (sleeping && !open ? "sleeping" :
      mood === "joking" ? "happy" : mood === "idle" ? "idle" : mood);

  useEffect(() => {
    const controller = new AbortController();
    // Approximate region weather, if Vercel IP geo headers are present.
    fetch("/api/berni-weather", { signal: controller.signal })
      .then((response) => response.ok ? response.json() : null)
      .then((data: BerniWeather | null) => {
        if (data && Number.isFinite(data.temperature) && data.source === "MET Norway") {
          setWeather(data);
        }
      })
      .catch(() => { /* No forecast is preferable to fake weather. */ });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!lastReply) return;
    const start = window.setTimeout(() => setReaction(detectBerniReaction(lastReply)), 0);
    const end = window.setTimeout(() => setReaction(null), 6200);
    return () => { window.clearTimeout(start); window.clearTimeout(end); };
  }, [lastReply]);

  useEffect(() => {
    if (!lastActivityRef.current) lastActivityRef.current = Date.now();
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    let frame = 0;
    const onMove = (event: PointerEvent) => {
      lastActivityRef.current = Date.now();
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
  }, [open]);

  function requestLocalWeather() {
    if (geoPendingRef.current) return;
    if (!navigator.geolocation) {
      setWeatherError(lang === "pl" ? "Lokalizacja nie jest dostępna." : "Location is unavailable.");
      return;
    }
    geoPendingRef.current = true;
    setWeatherError("");
    setWeatherLoading(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          // Coordinates are rounded BEFORE sending them to our server.
          const lat = (Math.round(coords.latitude * 10) / 10).toFixed(1);
          const lon = (Math.round(coords.longitude * 10) / 10).toFixed(1);
          const response = await fetch("/api/berni-weather?lat=" + lat + "&lon=" + lon);
          if (!response.ok) throw new Error("weather");
          const data = (await response.json()) as BerniWeather;
          if (!Number.isFinite(data.temperature) || data.source !== "MET Norway") throw new Error("weather");
          setWeather(data);
          setReaction("excited");
        } catch {
          setWeatherError(lang === "pl" ? "Prognoza jest chwilowo niedostępna." : "Forecast is temporarily unavailable.");
        } finally {
          setWeatherLoading(false);
          geoPendingRef.current = false;
        }
      },
      () => {
        setWeatherError(lang === "pl" ? "Możesz pozwolić przeglądarce na lokalizację." : "Allow location in your browser.");
        setWeatherLoading(false);
        geoPendingRef.current = false;
      },
      { enableHighAccuracy: false, timeout: 8500, maximumAge: 30 * 60 * 1000 },
    );
  }

  return (
    <div ref={hostRef} className="relative h-[6.2rem] w-[6.2rem] sm:h-28 sm:w-28"
      data-testid="berni-companion" data-mood={robotMood} data-weather={weather?.condition ?? "unknown"}>
      <button type="button"
        onClick={() => { setSleeping(false); setReaction("happy"); onOpen(); }}
        aria-label={lang === "pl" ? "Porozmawiaj z Bernim, asystentem AI" : "Talk to Berni, the AI assistant"}
        title={lang === "pl" ? "Berni — asystent AI" : "Berni — AI assistant"}
        data-testid="ai-mascot-open"
        className="group relative block h-full w-full rounded-[2rem] bg-transparent p-0 outline-none transition-transform duration-200 hover:scale-105 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black active:scale-95">
        <span className="absolute inset-x-3 bottom-2 h-9 rounded-full bg-white/[0.055] blur-xl transition group-hover:bg-white/[0.12]" />
        <BerniRobot mood={robotMood} weather={weather} lang={lang} />
        <span className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full border border-white/20 bg-[#171a1e]/95 px-3 py-0.5 text-[10px] font-semibold tracking-[0.1em] text-[#e5eaf0] shadow-lg">BERNI</span>
      </button>
      <button type="button" onClick={requestLocalWeather} disabled={weatherLoading}
        aria-label={lang === "pl" ? "Sprawdź pogodę u mnie" : "Check local weather"}
        title={lang === "pl" ? "Dokładna pogoda (za zgodą na lokalizację)" : "Precise weather (with location consent)"}
        className="absolute -left-4 bottom-5 grid h-7 w-7 place-items-center rounded-full border border-white/20 bg-[#161a20] text-white/80 shadow-lg transition hover:border-white/60 hover:text-white disabled:opacity-50">
        {weatherLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CloudSun className="h-3.5 w-3.5" />}
      </button>
      {weather ? <span className="pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/15 bg-[#12161b]/95 px-2 py-0.5 text-[9px] text-white/80"
        title="Forecast: MET Norway">
        {getBerniWeatherLabel(weather.condition, lang)} · {Math.round(weather.temperature)}°C
      </span> : null}
      {weatherError ? <span role="status" className="absolute bottom-[100%] right-0 w-48 rounded-lg bg-[#1b2027] p-2 text-[11px] text-white shadow-xl">{weatherError}</span> : null}
    </div>
  );
}
