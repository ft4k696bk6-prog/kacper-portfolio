"use client";

import { useId } from "react";
import styles from "./BerniFoxHead.module.css";

export type BerniFoxMood = "idle" | "curious" | "thinking" | "happy" | "excited" | "sleeping" | "typing" | "listening" | "surprised" | "worried" | "working";
export type BerniFoxAccessory = "none" | "santa" | "elf" | "alien" | "crown" | "cap" | "glasses";

export function seasonalBerniAccessory(date: Date): BerniFoxAccessory {
  const month = date.getMonth();
  const day = date.getDate();
  if (month === 11 && day >= 1 && day <= 26) return day % 4 === 0 ? "elf" : "santa";
  if (month === 0 && day <= 6) return "santa";
  return "none";
}

export function BerniFoxHead({
  mood = "idle",
  accessory = "none",
  size = 64,
  className = "",
}: {
  mood?: BerniFoxMood;
  accessory?: BerniFoxAccessory;
  size?: number | string;
  className?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const paint = (name: string) => "url(#" + uid + name + ")";
  const sleeping = mood === "sleeping";
  const surprised = mood === "surprised";
  const worried = mood === "worried";
  const happy = mood === "happy" || mood === "excited";
  const talking = mood === "typing" || mood === "working";
  return (
    <svg
      viewBox="0 0 240 240"
      width={size}
      height={size}
      className={[styles.fox, className].filter(Boolean).join(" ")}
      data-mood={mood}
      data-accessory={accessory}
      role="img"
      aria-label="Berni — lisek, asystent AI"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={uid + "fur"} x1="0.12" y1="0" x2=".8" y2="1">
          <stop stopColor="#ffffff" /><stop offset=".32" stopColor="#e9edf1" />
          <stop offset=".72" stopColor="#a6afbd" /><stop offset="1" stopColor="#777f8d" />
        </linearGradient>
        <linearGradient id={uid + "forehead"} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#ffffff"/><stop offset=".48" stopColor="#f2f4f6"/>
          <stop offset="1" stopColor="#adb5c1"/>
        </linearGradient>
        <linearGradient id={uid + "ear"} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#e8edf3"/><stop offset=".45" stopColor="#bfc8d2"/><stop offset="1" stopColor="#515d6b"/>
        </linearGradient>
        <linearGradient id={uid + "dark"} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#303640"/><stop offset=".5" stopColor="#0c1019"/><stop offset="1" stopColor="#424855"/>
        </linearGradient>
        <radialGradient id={uid + "eye"} cx=".35" cy=".27" r=".85">
          <stop stopColor="#8d9cae"/><stop offset=".35" stopColor="#394858"/><stop offset="1" stopColor="#101720"/>
        </radialGradient>
        <linearGradient id={uid + "red"} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#fe7579"/><stop offset=".43" stopColor="#c72636"/><stop offset="1" stopColor="#72121e"/>
        </linearGradient>
        <linearGradient id={uid + "green"} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#a6e0b5"/><stop offset=".55" stopColor="#2c9d6a"/><stop offset="1" stopColor="#12563c"/>
        </linearGradient>
        <linearGradient id={uid + "gold"} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#fff3c2"/><stop offset=".5" stopColor="#c79d44"/><stop offset="1" stopColor="#7b551f"/>
        </linearGradient>
        <filter id={uid + "shadow"} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="4"/>
        </filter>
      </defs>

      <ellipse cx="120" cy="218" rx="70" ry="9" fill="#030405" opacity=".45" filter={paint("shadow")}/>
      <g className={styles.float}>
        {/* Ears and a headset arc are separate parts for animation. */}
        <path d="M46 115 C33 57 52 24 86 19 C136 9 186 28 202 98" fill="none" stroke="#151b24" strokeWidth="13" strokeLinecap="round"/>
        <path d="M48 98 C40 68 42 27 53 12 C73 17 96 45 103 80 L91 115 Z" fill={paint("ear")} stroke="#e8edf2" strokeWidth="2" className={styles.earLeft}/>
        <path d="M60 82 Q52 43 59 32 Q80 51 88 87 Z" fill="#2b313b"/>
        <path d="M64 74 Q61 56 65 47 Q78 61 80 80 Z" fill="#9da4b1" opacity=".6"/>
        <path d="M141 80 Q169 37 208 14 C216 42 217 73 196 111 L170 117Z" fill={paint("ear")} stroke="#f1f3f7" strokeWidth="2" className={styles.earRight}/>
        <path d="M158 85 Q183 48 200 35 Q206 61 190 89 Z" fill="#2a3039"/>
        <path d="M178 77 Q191 54 197 51" fill="none" stroke="#a0a5ae" strokeWidth="5" strokeLinecap="round" opacity=".6"/>

        {/* The head and cheek fur are kept separate from eyes and expressions. */}
        <g className={styles.head}>
          <path d="M65 76 C85 51 153 43 182 70 C208 94 214 128 203 158 C217 157 216 171 198 180 C207 189 193 192 182 191 C169 208 144 220 120 221 C92 221 69 206 57 188 C44 195 28 187 40 178 C26 174 27 162 44 158 C34 124 45 93 65 76Z" fill={paint("fur")} stroke="#e1e7ee" strokeWidth="1.4"/>
          <path d="M58 150 Q37 150 32 165 Q42 169 49 168 Q31 175 41 185 Q56 192 71 176" fill={paint("forehead")}/>
          <path d="M181 160 Q202 151 215 163 Q206 170 196 171 Q213 179 198 187 Q184 192 172 176" fill={paint("fur")}/>
          <path d="M60 151 Q63 177 82 196 Q97 211 120 213 Q148 213 169 192 Q181 180 186 151 Q174 163 161 161 Q140 169 120 167 Q95 172 74 160 Z" fill="#f8f9fa" opacity=".92"/>
          <path d="M58 129 Q58 81 92 72 Q135 55 168 77 Q194 93 197 126" fill="none" stroke="#ffffff" strokeWidth="2" opacity=".22"/>

          <g className={styles.brows} stroke="#626b78" strokeWidth="4" strokeLinecap="round" fill="none">
            <path d={worried ? "M77 117 Q87 110 100 117" : "M76 115 Q91 105 104 112"}/>
            <path d={worried ? "M143 117 Q156 110 167 117" : "M137 112 Q151 105 165 115"}/>
          </g>
          <g className={styles.eyes}>
            {sleeping ? (
              <g fill="none" stroke="#303844" strokeWidth="5" strokeLinecap="round">
                <path d="M75 137 Q90 151 106 136"/><path d="M135 136 Q151 151 166 137"/>
              </g>
            ) : (
              <>
                <g className={styles.eyeLeft}>
                  <ellipse cx="90" cy="137" rx="20" ry={surprised ? 27 : 22} fill="#525e70"/>
                  <ellipse cx="90" cy="135" rx="18" ry={surprised ? 25 : 20} fill="#ffffff"/>
                  <g className={styles.pupils}>
                    <ellipse cx="92" cy="138" rx="12" ry="15" fill={paint("eye")}/>
                    <ellipse cx="92" cy="138" rx="6" ry="11" fill="#10151d"/>
                    <ellipse cx="87" cy="131" rx="4.5" ry="5.5" fill="white"/>
                    <circle cx="98" cy="144" r="2.1" fill="#e1e9f3" opacity=".75"/>
                  </g>
                </g>
                <g className={styles.eyeRight}>
                  <ellipse cx="150" cy="137" rx="20" ry={surprised ? 27 : 22} fill="#525e70"/>
                  <ellipse cx="150" cy="135" rx="18" ry={surprised ? 25 : 20} fill="#ffffff"/>
                  <g className={styles.pupils}>
                    <ellipse cx="152" cy="138" rx="12" ry="15" fill={paint("eye")}/>
                    <ellipse cx="152" cy="138" rx="6" ry="11" fill="#10151d"/>
                    <ellipse cx="147" cy="131" rx="4.5" ry="5.5" fill="white"/>
                    <circle cx="158" cy="144" r="2.1" fill="#e1e9f3" opacity=".75"/>
                  </g>
                </g>
              </>
            )}
          </g>

          <path d="M105 166 Q120 160 135 166 Q129 178 120 178 Q111 178 105 166Z" fill={paint("dark")}/>
          <path d="M111 167 Q120 165 128 167" stroke="#d8dee5" strokeWidth="1.8" fill="none" opacity=".7"/>
          <path d="M120 178 L120 184" stroke="#363d49" strokeWidth="2.7" strokeLinecap="round"/>
          {surprised ? (
            <ellipse cx="120" cy="193" rx="7" ry="10" fill="#29313c"/>
          ) : worried ? (
            <path d="M107 195 Q120 184 134 195" fill="none" stroke="#303946" strokeWidth="3.2" strokeLinecap="round"/>
          ) : sleeping ? (
            <path d="M113 190 Q120 193 127 190" fill="none" stroke="#303946" strokeWidth="3" strokeLinecap="round"/>
          ) : (
            <g>
              <path d={happy || talking ? "M100 185 Q119 211 141 185" : "M106 186 Q120 198 134 185"} fill={happy || talking ? "#31333f" : "none"} stroke="#29323d" strokeWidth="3" strokeLinecap="round"/>
              {(happy || talking) && <path d="M112 200 Q120 195 129 200 Q121 208 112 200Z" fill="#da8996"/>}
            </g>
          )}
          <ellipse cx="71" cy="171" rx="11" ry="6" fill="#b2bcc9" opacity=".25"/>
          <ellipse cx="169" cy="171" rx="11" ry="6" fill="#b2bcc9" opacity=".25"/>

          {/* Individual sculpted locks create the fox's recognizable hairstyle. */}
          <g className={styles.fringe}>
            <path d="M61 96 Q63 48 111 36 Q97 54 100 57 Q130 24 176 42 Q153 51 148 64 Q178 47 193 57 Q176 84 141 86 Q156 94 161 109 Q135 103 123 94 Q102 111 80 106 Q87 94 87 84 Q72 98 61 96Z" fill={paint("forehead")}/>
            <path d="M111 42 Q92 63 91 84" fill="none" stroke="#fff" strokeWidth="3" opacity=".68" strokeLinecap="round"/>
            <path d="M153 49 Q137 64 126 72" fill="none" stroke="#fff" strokeWidth="2.5" opacity=".65" strokeLinecap="round"/>
            <path d="M174 62 Q154 80 137 83" fill="none" stroke="#808e9e" strokeWidth="2.5" opacity=".55" strokeLinecap="round"/>
          </g>
        </g>

        {/* Headset hardware sits above cheek fur, but below optional hats. */}
        <g className={styles.headset}>
          <rect x="34" y="119" width="23" height="48" rx="11" fill="#151a23" stroke="#717e8f" strokeWidth="1.4"/>
          <ellipse cx="46" cy="142" rx="19" ry="26" fill={paint("dark")} stroke="#b7c2d0" strokeWidth="3"/>
          <ellipse cx="46" cy="142" rx="14" ry="21" fill="none" stroke="#d9e0e9" strokeWidth="1.4" opacity=".8"/>
          <text x="46" y="148" fontSize="20" textAnchor="middle" fontWeight="900" fontFamily="system-ui, sans-serif" fontStyle="italic" fill="#f9fafb">B</text>
          <rect x="185" y="119" width="22" height="48" rx="10" fill="#151a23" stroke="#717e8f" strokeWidth="1.4"/>
          <ellipse cx="196" cy="142" rx="17" ry="25" fill={paint("dark")} stroke="#aab5c3" strokeWidth="2.4"/>
          <ellipse cx="196" cy="142" rx="12.5" ry="20" fill="none" stroke="#d4dde8" strokeWidth="1.1" opacity=".65"/>
        </g>

        {/* Props are independent of the expression and can be switched live. */}
        {accessory === "glasses" && <g className={styles.accessory}>
          <path d="M68 121 Q87 114 109 121 L109 150 Q91 165 74 147 Z M131 121 Q153 114 174 121 L169 147 Q151 164 131 150Z" fill="#11151c" stroke="#aeb8c7" strokeWidth="4"/>
          <path d="M109 125 Q120 118 131 125" fill="none" stroke="#929aa9" strokeWidth="4"/>
          <path d="M79 125 L100 121 M140 125 L162 121" stroke="#ffffff" strokeWidth="2" opacity=".37"/>
        </g>}
        {accessory === "santa" && <g className={styles.accessory}>
          <path d="M62 75 Q63 8 136 6 Q169 8 194 42 Q211 60 207 85 Q186 70 174 74 Q126 49 62 75Z" fill={paint("red")} stroke="#ef777f" strokeWidth="2"/>
          <path d="M167 22 Q211 17 216 67" fill="none" stroke="#ef9ca2" strokeWidth="3" opacity=".5"/>
          <path d="M50 78 Q120 53 190 83 Q190 100 178 101 Q115 78 61 97 Q50 95 50 78Z" fill="#f7f8fb" stroke="#c6ced8" strokeWidth="3"/>
          <circle cx="208" cy="82" r="16" fill="#fff" stroke="#d7dee7" strokeWidth="3"/>
        </g>}
        {accessory === "elf" && <g className={styles.accessory}>
          <path d="M59 84 Q83 20 145 20 Q169 17 184 7 Q182 47 174 82 Q124 63 59 84Z" fill={paint("green")} stroke="#8aca9c" strokeWidth="2"/>
          <path d="M56 81 Q121 58 181 77 L175 94 Q122 75 63 99 Z" fill="#b82235" stroke="#f0b159" strokeWidth="3"/>
          <circle cx="183" cy="9" r="9" fill={paint("gold")}/>
        </g>}
        {accessory === "alien" && <g className={styles.accessory}>
          <path d="M102 53 Q94 28 81 21 M139 49 Q150 29 167 18" fill="none" stroke="#9bd2b8" strokeWidth="7" strokeLinecap="round"/>
          <circle cx="78" cy="17" r="10" fill="#91d8b4" stroke="#dcfff0" strokeWidth="3"/>
          <circle cx="171" cy="14" r="10" fill="#91d8b4" stroke="#dcfff0" strokeWidth="3"/>
        </g>}
        {accessory === "crown" && <g className={styles.accessory}>
          <path d="M72 75 L68 39 L94 57 L120 27 L146 56 L171 37 L168 77Z" fill={paint("gold")} stroke="#ffe9a0" strokeWidth="3"/>
          <circle cx="120" cy="55" r="7" fill="#e8e9fc" stroke="#a88442" strokeWidth="2"/>
          <path d="M76 75 L164 75" stroke="#fff0bd" strokeWidth="5"/>
        </g>}
        {accessory === "cap" && <g className={styles.accessory}>
          <path d="M58 81 Q69 31 127 37 Q174 36 189 77 Q132 64 58 81Z" fill="#1f2732" stroke="#b6c1ce" strokeWidth="3"/>
          <path d="M73 84 Q129 68 191 80 Q197 89 182 92 Q126 85 70 97Z" fill="#2f3c4b" stroke="#dce3ec" strokeWidth="2"/>
          <text x="125" y="64" fontSize="25" textAnchor="middle" fontWeight="900" fontStyle="italic" fontFamily="system-ui" fill="#fff">B</text>
        </g>}
      </g>
      {(mood === "thinking" || mood === "working") && (
        <g className={styles.thought} fill="#d7e1ec">
          <circle cx="214" cy="69" r="3.5"/><circle cx="223" cy="59" r="5"/><circle cx="233" cy="47" r="7"/>
        </g>
      )}
      {sleeping && <g className={styles.sleep} fill="#e3eaf2" fontFamily="system-ui" fontWeight="800">
        <text x="193" y="90" fontSize="17">z</text><text x="208" y="69" fontSize="22">Z</text>
      </g>}
    </svg>
  );
}
