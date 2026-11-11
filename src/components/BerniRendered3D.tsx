"use client";

import type { BerniMood, BerniWeather } from "@/lib/berni-reactions";
import { getBerniTemperatureMood } from "@/lib/berni-reactions";
import styles from "./BerniRendered3D.module.css";

type BerniRendered3DProps = {
  mood: BerniMood;
  weather?: BerniWeather | null;
  lang: "pl" | "en";
  compact?: boolean;
};

/**
 * The actual approved 3D Berni asset, not the old hand-drawn SVG dog.
 * Two cropped uses of the same locally hosted image let the head move
 * independently from the body without a bulky runtime 3D engine.
 */
export function BerniRendered3D({
  mood, weather, lang, compact = false,
}: BerniRendered3DProps) {
  const temperature = weather ? getBerniTemperatureMood(weather.temperature) : "normal";
  const typing = mood === "typing" || mood === "working";
  const label = lang === "pl" ? "Berni, robotyczny pies 3D" : "Berni, the 3D robot dog";

  return (
    <span
      aria-label={label}
      role="img"
      data-testid="berni-rendered-3d"
      data-mood={mood}
      data-thermal={temperature}
      data-compact={compact ? "true" : "false"}
      className={styles.stage}
    >
      <span className={styles.shadow} aria-hidden="true" />
      <span className={styles.figure} aria-hidden="true">
        <span className={styles.bodyImage} />
        <span className={styles.headMotion}>
          <span className={styles.headFollow}>
            <span className={styles.headImage} />
          </span>
        </span>
        <span className={styles.neckLight} />
        <span className={styles.statusGlow} />
        {typing ? (
          <span className={styles.keyboard} data-testid="berni-active-keyboard">
            <span className={styles.keyboardSurface}>
              <span className={styles.keys} />
            </span>
            <span className={styles.leftPaw} />
            <span className={styles.rightPaw} />
          </span>
        ) : null}
        {mood === "sleeping" ? <span className={styles.sleepMark}>z<span>z</span></span> : null}
        {mood === "thinking" ? <span className={styles.thoughtDots}>···</span> : null}
        {mood === "grabbed" ? <span className={styles.grabSpark}>✦</span> : null}
      </span>
    </span>
  );
}
