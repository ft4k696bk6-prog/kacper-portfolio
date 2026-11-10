"use client";

import { useId } from "react";
import type { BerniMood, BerniWeather, BerniWeatherCondition } from "@/lib/berni-reactions";
import { getBerniTemperatureMood, getBerniWeatherLabel } from "@/lib/berni-reactions";
import styles from "./BerniRobot.module.css";

type Props = {
  mood: BerniMood;
  weather?: BerniWeather | null;
  lang: "pl" | "en";
  compact?: boolean;
};

function WeatherFX({ condition }: { condition: BerniWeatherCondition }) {
  if (condition === "unknown") return null;
  const cloud = <path d="M60 31c-9 0-13-7-9-13 3-6 9-7 14-4 4-11 18-13 25-4 11-2 18 6 15 15-2 5-7 6-15 6Z" className={styles.cloud} />;
  return (
    <g className={styles.forecast}>
      {condition === "clear" ? <g className={styles.sun}><circle cx="81" cy="18" r="11" /><path d="M81 1v6M81 29v7M64 18h-7M104 18h-7M69 6l-5-5M93 30l5 5M93 6l5-5M69 30l-5 5" /></g> : null}
      {["clouds", "rain", "snow", "sleet", "thunder", "hail"].includes(condition) ? cloud : null}
      {condition === "rain" ? <g className={styles.rain}><path d="M63 36l-5 11M80 35l-5 11M96 36l-5 11" /></g> : null}
      {condition === "snow" ? <g className={styles.snow}><text x="57" y="47">✳</text><text x="76" y="47">✳</text><text x="94" y="47">✳</text></g> : null}
      {condition === "sleet" ? <g className={styles.sleet}><path d="M61 36l-4 9M90 36l-4 9"/><text x="73" y="47">✳</text><text x="102" y="47">✳</text></g> : null}
      {condition === "thunder" ? <g className={styles.thunder}><path d="M82 31l-12 16h10l-6 15 22-24H85l6-7Z" /></g> : null}
      {condition === "hail" ? <g className={styles.hail}><circle cx="61" cy="41" r="3"/><circle cx="82" cy="45" r="3.4"/><circle cx="100" cy="40" r="3"/></g> : null}
      {condition === "fog" ? <g className={styles.fog}><path d="M43 15h52M55 26h67M39 36h49"/></g> : null}
      {condition === "wind" ? <g className={styles.wind}><path d="M41 17h63q11 0 9-8t-13 0M31 31h77q12 0 9 8t-12 0M47 45h45"/></g> : null}
    </g>
  );
}

/**
 * Lightweight, resolution-independent SVG robot dog.
 * Facial expression and motion use CSS; no 3D engine, canvas or animation files.
 */
export function BerniRobot({ mood, weather, lang, compact = false }: Props) {
  const id = useId().replace(/:/g, "");
  const thermal = weather ? getBerniTemperatureMood(weather.temperature) : "normal";
  const label = (lang === "pl" ? "Berni, robot-pies. " : "Berni, robot dog. ") +
    (weather ? getBerniWeatherLabel(weather.condition, lang) + ", " + Math.round(weather.temperature) + "°C" : "");
  return (
    <span
      className={styles.stage}
      data-mood={mood}
      data-thermal={thermal}
      data-weather={weather?.condition ?? "unknown"}
      data-compact={compact ? "true" : "false"}
      aria-label={label}
      role="img"
    >
      <svg className={styles.robot} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 156" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id={id + "metal"} x1="20" y1="35" x2="135" y2="146" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fff" /><stop offset=".22" stopColor="#a6b0bc" /><stop offset=".54" stopColor="#eff2f6"/><stop offset=".8" stopColor="#727c88"/><stop offset="1" stopColor="#d4dae2"/>
          </linearGradient>
          <linearGradient id={id + "visor"} x1="48" y1="52" x2="107" y2="104" gradientUnits="userSpaceOnUse">
            <stop stopColor="#2b3440"/><stop offset=".36" stopColor="#11161d"/><stop offset="1" stopColor="#020408"/>
          </linearGradient>
          <linearGradient id={id + "edge"} x1="45" y1="40" x2="104" y2="101" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fff"/><stop offset=".5" stopColor="#b2bcc8"/><stop offset="1" stopColor="#535d69"/>
          </linearGradient>
          <filter id={id + "glow"} x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="1.4"/>
          </filter>
        </defs>
        <ellipse cx="84" cy="145" rx="52" ry="5" fill="#d9e2ef" opacity=".15" className={styles.shadow}/>
        <g className={styles.tail}>
          <path d="M119 111q26-4 22-25" stroke={"url(#" + id + "metal)"} strokeWidth="11" strokeLinecap="round" />
          <path d="M141 85l1-7" stroke="#e4eaf4" strokeWidth="4" strokeLinecap="round"/>
        </g>
        <g className={styles.body}>
          <path d="M55 92q-12 2-14 19v12q3 16 20 15h48q20-1 22-20v-9q-2-18-22-20Z" fill={"url(#" + id + "metal)"} stroke="#4d5865" strokeWidth="1.8" />
          <path d="M60 109v25M113 109v25" stroke="#4d5865" strokeWidth="1.3" opacity=".5"/>
          <path d="M53 115q-10 1-10 10v11q0 5 7 5h11q6 0 6-5v-11q-1-9-14-10ZM111 115q-11 1-11 10v11q0 5 7 5h11q6 0 6-5v-11q0-9-13-10Z" fill={"url(#" + id + "metal)"} stroke="#49515f" strokeWidth="1.7" />
          <path d="M51 135h9M109 135h9" stroke="#555e6c" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="85" cy="117" r="12.3" fill="#202a35" stroke="#cdd5e0" strokeWidth="2"/>
          <path d="M79 115l-4 3 4 3M90 115l4 3-4 3M87 113l-4 10" stroke="#f1f5fc" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <g className={styles.ears}>
          <g className={styles.earLeft}>
            <path d="M50 61Q20 36 22 69q1 20 14 18l17-10Z" fill={"url(#" + id + "metal)"} stroke="#555f6d" strokeWidth="2"/>
            <path d="M45 71Q29 54 32 75l7 3Z" fill="#434e5a"/>
          </g>
          <g className={styles.earRight}>
            <path d="M113 61q30-24 30 7 0 20-16 18l-18-10Z" fill={"url(#" + id + "metal)"} stroke="#555f6d" strokeWidth="2"/>
            <path d="M116 71q20-17 17 3l-9 5Z" fill="#434e5a"/>
          </g>
        </g>
        <g className={styles.head}>
          <path d="M41 71Q40 45 82 43q41 0 43 29v23q-3 23-43 24-41-1-43-24Z" fill={"url(#" + id + "metal)"} stroke="#5a6370" strokeWidth="1.6"/>
          <path d="M48 72q0-22 34-22 36 0 36 22v20q-2 18-36 19-34-1-35-19Z" fill={"url(#" + id + "visor)"} stroke={"url(#" + id + "edge)"} strokeWidth="2.6"/>
          <path d="M53 69q8-17 30-16 20 0 28 11" stroke="#fff" strokeWidth="2.4" opacity=".17" strokeLinecap="round"/>
          <g className={styles.eyes}>
            {mood === "sleeping" ? (
              <g className={styles.eyeLights}><path d="M60 84q9 6 18 0M88 84q9 6 18 0" stroke="#f2f7ff" strokeWidth="3.8" strokeLinecap="round" /></g>
            ) : mood === "happy" || mood === "excited" ? (
              <g className={styles.eyeLights}><path d="M61 88q8-14 17 0M88 88q8-14 17 0" stroke="#f2f7ff" strokeWidth="4.2" strokeLinecap="round"/></g>
            ) : mood === "worried" ? (
              <g className={styles.eyeLights}><path d="M64 82l12 5M90 87l12-5" stroke="#f2f7ff" strokeWidth="4.4" strokeLinecap="round"/></g>
            ) : (
              <g className={styles.eyeLights}>
                <rect x="65" y="76" width="8" height="20" rx="4" fill="#f4f8ff"/>
                <rect x="93" y="76" width="8" height="20" rx="4" fill="#f4f8ff"/>
              </g>
            )}
          </g>
          <g className={styles.mouth}>
            {mood === "surprised" ? <ellipse cx="82" cy="101" rx="3" ry="4" fill="#e4f2ff"/> :
              <path d="M78 100q4 4 8 0" stroke="#edf4ff" strokeWidth="2" strokeLinecap="round" />}
          </g>
          <path d="M48 97q-4 5-6 2" stroke="#d0d8e3" strokeWidth="2" strokeLinecap="round"/>
        </g>
        {weather ? <WeatherFX condition={weather.condition} /> : null}
        {thermal === "cold" ? <g className={styles.cold}><path d="M38 88l-3 11M132 85l4 12M47 45l-2 8" stroke="#bde6ff" strokeWidth="3" strokeLinecap="round"/></g> : null}
        {thermal === "hot" ? <g className={styles.hot}><path d="M130 65q-10 13-2 13 9 0 2-13ZM36 85q-9 12-2 12 9 0 2-12Z" fill="#c0dff6"/></g> : null}
        {mood === "sleeping" ? <g className={styles.sleep}><text x="121" y="49">z</text><text x="134" y="35">Z</text></g> : null}
        {mood === "thinking" || mood === "working" ? <g className={styles.thought}><circle cx="127" cy="52" r="2.5"/><circle cx="137" cy="45" r="3.2"/><circle cx="146" cy="32" r="4"/></g> : null}
        {mood === "excited" ? <g className={styles.sparkles}><path d="M28 42v-9m-5 5h10M136 101v-12m-6 6h12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/></g> : null}
        <rect x="66" y="79" width="9" height="17" rx="4.5" fill="#eaf6ff" opacity=".1" filter={"url(#" + id + "glow)"} />
      </svg>
    </span>
  );
}
