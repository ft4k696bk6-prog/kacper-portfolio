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
  const paint = (name: string) => `url(#${id}${name})`;
  const isJoy = mood === "happy" || mood === "excited";
  const isWorking = mood === "typing" || mood === "working";
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
      <svg className={styles.robot} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" fill="none" aria-hidden="true">

        <defs>
          <linearGradient id={id+"metal"} x1="27" y1="28" x2="136" y2="145" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fff"/><stop offset=".17" stopColor="#d7dce2"/><stop offset=".39" stopColor="#8f9aa7"/><stop offset=".59" stopColor="#f9fafc"/><stop offset=".8" stopColor="#9aa5b2"/><stop offset="1" stopColor="#e8edf1"/>
          </linearGradient>
          <linearGradient id={id+"shell"} x1="27" y1="43" x2="132" y2="128" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fafcff"/><stop offset=".25" stopColor="#c5cdd6"/><stop offset=".48" stopColor="#718091"/><stop offset=".7" stopColor="#e3e9ee"/><stop offset="1" stopColor="#657180"/>
          </linearGradient>
          <linearGradient id={id+"visor"} x1="52" y1="47" x2="115" y2="105" gradientUnits="userSpaceOnUse">
            <stop stopColor="#24303d"/><stop offset=".27" stopColor="#121821"/><stop offset=".73" stopColor="#06090f"/><stop offset="1" stopColor="#1f2834"/>
          </linearGradient>
          <linearGradient id={id+"glass"} x1="44" y1="49" x2="110" y2="114" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fff" stopOpacity=".18"/><stop offset=".3" stopColor="#e5f0ff" stopOpacity=".04"/><stop offset=".84" stopColor="#bcc8d6" stopOpacity=".01"/><stop offset="1" stopColor="#fff" stopOpacity=".11"/>
          </linearGradient>
          <linearGradient id={id+"chrome"} x1="26" y1="60" x2="138" y2="114" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fefeff"/><stop offset=".18" stopColor="#8a96a2"/><stop offset=".43" stopColor="#fff"/><stop offset=".71" stopColor="#8592a0"/><stop offset="1" stopColor="#eaf1fa"/>
          </linearGradient>
          <radialGradient id={id+"eyeLight"}><stop stopColor="#fdfdff"/><stop offset=".5" stopColor="#d7e6f3"/><stop offset="1" stopColor="#aeb9c6"/></radialGradient>
          <linearGradient id={id+"sole"} x1="39" y1="131" x2="60" y2="152" gradientUnits="userSpaceOnUse">
            <stop stopColor="#697686"/><stop offset="1" stopColor="#171d28"/>
          </linearGradient>
          <filter id={id+"shadowBlur"} x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="3.3"/></filter>
          <filter id={id+"eyeBlur"} x="-75%" y="-75%" width="250%" height="250%"><feGaussianBlur stdDeviation="1.2"/></filter>
        </defs>

        <ellipse className={styles.shadow} cx="81" cy="148" rx="42" ry="6.5" fill="#aab4c2" opacity=".25" filter={paint("shadowBlur")}/>
        <g className={styles.tail}>
          <path d="M117 122q23 2 25-19 2-13-8-18" stroke="#313a47" strokeWidth="15" strokeLinecap="round"/>
          <path d="M117 122q24 1 25-19 1-13-8-18" stroke={paint("chrome")} strokeWidth="10" strokeLinecap="round"/>
          <ellipse cx="134" cy="84" rx="6" ry="8" fill={paint("metal")} stroke="#52606f" strokeWidth="1.3"/>
          <path d="M132 80q4 1 4 4" stroke="#fff" strokeWidth="1.4" opacity=".75" strokeLinecap="round"/>
        </g>
        <g className={styles.feet}>
          <rect x="43" y="126" width="23" height="21" rx="9" fill={paint("shell")} stroke="#414d5b" strokeWidth="1.5"/>
          <rect x="94" y="126" width="23" height="21" rx="9" fill={paint("shell")} stroke="#414d5b" strokeWidth="1.5"/>
          <path d="M43 139q0-7 10-7h4q9 0 9 8v6H43Z" fill={paint("sole")}/>
          <path d="M94 139q0-7 10-7h4q9 0 9 8v6H94Z" fill={paint("sole")}/>
          <path d="M46 142h16M98 142h16" stroke="#edf3fb" strokeWidth="1.25" opacity=".62" strokeLinecap="round"/>
        </g>
        <g className={styles.arms}>
          <g className={styles.armLeft}>
            <path d="M51 113q-16-1-17 14" stroke="#3b4655" strokeWidth="14" strokeLinecap="round"/>
            <path d="M50 112q-16 1-16 13" stroke={paint("metal")} strokeWidth="10" strokeLinecap="round"/>
            <circle cx="34" cy="126" r="6" fill={paint("shell")} stroke="#5b6877" strokeWidth="1.2"/>
          </g>
          <g className={styles.armRight}>
            <path d="M111 113q16-1 17 14" stroke="#3b4655" strokeWidth="14" strokeLinecap="round"/>
            <path d="M111 112q16 1 17 13" stroke={paint("metal")} strokeWidth="10" strokeLinecap="round"/>
            <circle cx="128" cy="126" r="6" fill={paint("shell")} stroke="#5b6877" strokeWidth="1.2"/>
          </g>
        </g>
        <g className={styles.body}>
          <path d="M50 99q32-16 60 0 15 12 12 31-2 12-12 13H51q-12-2-13-13-3-19 12-31Z" fill={paint("shell")} stroke="#404b5a" strokeWidth="1.5"/>
          <path d="M49 115q31-15 62 0l2 15q-31 8-66 0Z" fill="#aab5c1" opacity=".24"/>
          <rect x="61" y="111" width="38" height="26" rx="12" fill="#1b2430" stroke="#c1cbd7" strokeWidth="1.7"/>
          <rect x="65" y="115" width="30" height="18" rx="9" fill="#101720" stroke="#5a6879" strokeWidth=".7"/>
          <g className={styles.coreLight}>
            <path d="M72 124q4-5 8 0-4 5-8 0Zm10-5h4q7 0 2 5 6 5-3 5h-3" stroke="#f0f5fa" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
          </g>
        </g>

        <g className={styles.ears}>
          <g className={styles.earLeft}>
            <path d="M46 53 32 26Q27 18 23 27q-10 28-2 48l19 6Z" fill={paint("shell")} stroke="#505d6b" strokeWidth="1.6"/>
            <path d="M37 56 29 39q-5 16-2 28l10 5Z" fill="#293645"/>
            <path d="M26 33q-2 12-2 18" stroke="#fff" strokeWidth="1.5" opacity=".7" strokeLinecap="round"/>
          </g>
          <g className={styles.earRight}>
            <path d="m116 53 13-27q5-8 10 1 10 28 2 48l-20 6Z" fill={paint("shell")} stroke="#505d6b" strokeWidth="1.6"/>
            <path d="m126 56 7-17q6 16 3 28l-10 5Z" fill="#293645"/>
            <path d="M136 33q2 12 2 18" stroke="#fff" strokeWidth="1.5" opacity=".7" strokeLinecap="round"/>
          </g>
        </g>
        <g className={styles.head}>
          <ellipse cx="39" cy="75" rx="12" ry="18" fill="#626f7e" stroke="#e4edf4" strokeWidth="1.4"/>
          <ellipse cx="123" cy="75" rx="12" ry="18" fill="#626f7e" stroke="#e4edf4" strokeWidth="1.4"/>
          <ellipse cx="40" cy="75" rx="7" ry="13" fill="#222d39"/>
          <ellipse cx="122" cy="75" rx="7" ry="13" fill="#222d39"/>
          <path d="M33 69q-1-33 48-37 49 4 48 37v28q-4 25-48 26-45-1-48-26Z" fill={paint("metal")} stroke="#5b6674" strokeWidth="2"/>
          <path d="M41 73q0-29 40-30 40 1 40 30v23q-2 18-40 19-39-1-40-19Z" fill={paint("visor")} stroke={paint("chrome")} strokeWidth="3"/>
          <path d="M45 64q8-18 37-18 23 0 33 15" stroke="#fff" strokeWidth="2.4" opacity=".47" strokeLinecap="round"/>
          <path d="M47 54q27-21 68-1v16q-42-15-68 2Z" fill={paint("glass")}/>
          <path d="M51 101q31 11 62-2" stroke="#9aa8b8" strokeWidth="1.4" opacity=".32" strokeLinecap="round"/>
          <g className={styles.eyes}>
            {mood === "sleeping" ? (
              <g className={styles.eyeLights}><path d="M55 81q9 10 18 0M89 81q9 10 18 0" stroke="#f2f7ff" strokeWidth="4.2" strokeLinecap="round"/></g>
            ) : isJoy ? (
              <g className={styles.eyeLights}><path d="M56 87q8-16 17 0M89 87q8-16 17 0" stroke="#f2f7ff" strokeWidth="5" strokeLinecap="round"/></g>
            ) : mood === "worried" ? (
              <g className={styles.eyeLights}><path d="M57 79l15 8M90 87l15-8" stroke="#e8f2ff" strokeWidth="4.5" strokeLinecap="round"/></g>
            ) : mood === "grabbed" || mood === "surprised" ? (
              <g className={styles.eyeLights}>
                <ellipse cx="64" cy="82" rx="8.2" ry="10.6" fill={paint("eyeLight")}/>
                <ellipse cx="98" cy="82" rx="8.2" ry="10.6" fill={paint("eyeLight")}/>
                <circle cx="66" cy="84" r="2.1" fill="#202b39"/><circle cx="100" cy="84" r="2.1" fill="#202b39"/>
              </g>
            ) : (
              <g className={styles.eyeLights}>
                <ellipse cx="64" cy="82" rx="8.4" ry="11" fill="#cbd7e7" opacity=".28" filter={paint("eyeBlur")}/>
                <ellipse cx="98" cy="82" rx="8.4" ry="11" fill="#cbd7e7" opacity=".28" filter={paint("eyeBlur")}/>
                <rect x="59" y="71" width="11" height="23" rx="5.5" fill={paint("eyeLight")}/>
                <rect x="93" y="71" width="11" height="23" rx="5.5" fill={paint("eyeLight")}/>
                <path d="M61 75v5M95 75v5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" opacity=".8"/>
              </g>
            )}
          </g>
          <g className={styles.mouth}>
            {mood === "grabbed" || mood === "surprised" ? <ellipse cx="81" cy="102" rx="3.2" ry="4.2" fill="#e9f2fb"/> :
              mood === "worried" ? <path d="M75 104q6-5 12 0" stroke="#e9f2fb" strokeWidth="2.3" strokeLinecap="round"/> :
              isJoy ? <path d="M73 100q8 11 17 0" stroke="#e9f2fb" strokeWidth="2.4" strokeLinecap="round"/> :
              isWorking ? <path d="M76 102h10" stroke="#e9f2fb" strokeWidth="2.2" strokeLinecap="round"/> :
              <path d="M76 100q5 4 10 0" stroke="#e9f2fb" strokeWidth="2.2" strokeLinecap="round"/>}
          </g>
          <circle cx="48" cy="94" r="1" fill="#dce7ef" opacity=".5"/><circle cx="114" cy="94" r="1" fill="#dce7ef" opacity=".5"/>
          <rect x="70" y="35" width="22" height="4" rx="2" fill="#606d7c" opacity=".7"/>
          <rect x="77" y="36" width="8" height="1.5" rx=".75" fill="#fff" opacity=".8"/>
          <path d="M37 73q-2-30 24-38" stroke="#fff" strokeWidth="2" opacity=".4" strokeLinecap="round"/>
          <path d="M127 68q2-19-13-28" stroke="#fff" strokeWidth="1.4" opacity=".2" strokeLinecap="round"/>
        </g>
        {/* Real, visible mini keyboard and animated paws while the visitor types. */}
        <g className={styles.keyboardRig} aria-hidden="true">
          <rect x="48" y="116" width="72" height="26" rx="4.5" fill="#0c1119" stroke="#9baabc" strokeWidth="2" />
          <rect x="53" y="120" width="62" height="9" rx="2" fill="#243246" stroke="#a6b7c9" strokeWidth=".8" />
          <path d="M56 124h55M60 120v9M69 120v9M78 120v9M87 120v9M96 120v9M105 120v9" stroke="#d4e1f1" strokeWidth=".8" opacity=".7"/>
          <path d="M62 135h45" stroke="#dfeaf5" strokeWidth="2" strokeLinecap="round" />
          <g className={styles.typePawLeft}>
            <path d="M49 121q-10-9-13 0-3 8 15 16" stroke="#b0bac6" strokeWidth="9" strokeLinecap="round" fill="none"/>
            <ellipse cx="58" cy="134" rx="7" ry="4" fill="#f2f5f8" stroke="#566271" strokeWidth="1"/>
          </g>
          <g className={styles.typePawRight}>
            <path d="M119 122q9-8 13 0 3 7-15 15" stroke="#b0bac6" strokeWidth="9" strokeLinecap="round" fill="none"/>
            <ellipse cx="111" cy="134" rx="7" ry="4" fill="#f2f5f8" stroke="#566271" strokeWidth="1"/>
          </g>
          <circle cx="109" cy="124" r="2" fill="#eaf7ff" className={styles.keyFlash}/>
        </g>
        {mood === "grabbed" ? (
          <g className={styles.grabFx} stroke="#edf5ff" strokeWidth="2" strokeLinecap="round" opacity=".9">
            <path d="M18 52l-5-8M23 38l-1-9M142 52l6-8M136 38l2-10" />
          </g>
        ) : null}
        {weather ? <WeatherFX condition={weather.condition} /> : null}
        {thermal === "hot" ? <g className={styles.hot}><path d="M130 65q-10 13-2 13 9 0 2-13ZM36 85q-9 12-2 12 9 0 2-12Z" fill="#c0dff6"/></g> : null}
        {mood === "sleeping" ? <g className={styles.sleep}><text x="121" y="49">z</text><text x="134" y="35">Z</text></g> : null}
        {mood === "thinking" || mood === "working" ? <g className={styles.thought}><circle cx="127" cy="52" r="2.5"/><circle cx="137" cy="45" r="3.2"/><circle cx="146" cy="32" r="4"/></g> : null}
        {mood === "excited" ? <g className={styles.sparkles}><path d="M28 42v-9m-5 5h10M136 101v-12m-6 6h12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/></g> : null}
        <rect x="66" y="79" width="9" height="17" rx="4.5" fill="#eaf6ff" opacity=".1" filter={"url(#" + id + "glow)"} />
      </svg>
    </span>
  );
}
