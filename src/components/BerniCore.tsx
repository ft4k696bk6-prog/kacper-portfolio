"use client";

import type { BerniMood, BerniWeather } from "@/lib/berni-reactions";
import { getBerniTemperatureMood } from "@/lib/berni-reactions";
import styles from "./BerniCore.module.css";

type Props = {
  mood: BerniMood;
  weather?: BerniWeather | null;
  lang: "pl" | "en";
  compact?: boolean;
};

/**
 * Berni Core: an original monochrome character with its own expressive face.
 * Layered 2.5D CSS materials + real state-driven motions, not generic GLB clips.
 * Does not require any 3D engine, external CDN, video, asset download or subscription.
 */
export function BerniCore({ mood, weather, lang, compact = false }: Props) {
  const thermal = weather ? getBerniTemperatureMood(weather.temperature) : "normal";
  const isTyping = mood === "typing" || mood === "working";
  return (
    <span
      role="img"
      aria-label={lang === "pl" ? "Berni, srebrny interaktywny robot" : "Berni, the interactive silver robot"}
      data-testid="berni-core"
      data-mood={mood}
      data-thermal={thermal}
      data-weather={weather?.condition ?? "unknown"}
      data-compact={compact ? "true" : "false"}
      className={styles.stage}
    >
      <span className={styles.ambient} aria-hidden="true" />
      <span className={styles.groundShadow} aria-hidden="true" />
      <span className={styles.character} aria-hidden="true">
        <span className={styles.leftFin}><span /></span>
        <span className={styles.rightFin}><span /></span>
        <span className={styles.helmet}>
          <span className={styles.shellReflection} />
          <span className={styles.visor}>
            <span className={styles.matrix} />
            <span className={styles.faceSheen} />
            <span className={styles.eyes}>
              <span className={styles.eyeLeft} />
              <span className={styles.eyeRight} />
            </span>
            <span className={styles.mouth} />
            <span className={styles.scanline} />
          </span>
          <span className={styles.chinPlate}>
            <span className={styles.makerMark}>B</span>
            <span className={styles.chinGlint} />
          </span>
        </span>
        <span className={styles.neck} />
        <span className={styles.coreLight} />
      </span>
      {isTyping && !compact ? (
        <span className={styles.typeConsole} data-testid="berni-active-keyboard" aria-hidden="true">
          <span className={styles.typeKeyRow} />
          <span className={styles.typeHandLeft} />
          <span className={styles.typeHandRight} />
        </span>
      ) : null}
      {mood === "sleeping" && !compact ? <span className={styles.sleepMarker} aria-hidden="true">z<span>z</span></span> : null}
      {mood === "thinking" && !compact ? <span className={styles.thinkingMarker} aria-hidden="true"><i /><i /><i /></span> : null}
    </span>
  );
}
