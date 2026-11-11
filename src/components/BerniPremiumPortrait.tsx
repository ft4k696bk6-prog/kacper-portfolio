"use client";

import { useState } from "react";
import Image from "next/image";
import { BerniLivingFace, type BerniLivingMood } from "./BerniLivingFace";
import styles from "./BerniPremiumPortrait.module.css";

export type BerniPortraitMood = BerniLivingMood;

/**
 * One character, one approved illustration rasterized as complete pose masters.
 * No sticker mouths, no overlapping irises, no visible texture changes.
 */
export function BerniPremiumPortrait({
  mood = "idle",
  size = 64,
  className = "",
  priority = false,
  blinkToken = 0,
  reactionToken = 0,
}: {
  mood?: BerniPortraitMood;
  size?: number;
  className?: string;
  priority?: boolean;
  blinkToken?: number;
  reactionToken?: number;
}) {
  const [hovered, setHovered] = useState(false);
  const actualMood = mood === "idle" && hovered ? "curious" : mood;
  const imgSizes = size >= 180 ? "(max-width: 640px) 78vw, 400px" : "112px";

  return (
    <span
      className={[styles.stage, className].filter(Boolean).join(" ")}
      data-testid="berni-fox-premium"
      data-mood={actualMood}
      style={{ width: size, height: size }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="img"
      aria-label="Berni — animowany lisek AI, płynne spojrzenia i wyrazy twarzy"
    >
      <span className={styles.portrait}>
        <Image src="/images/berni/poses/idle.png" alt="" fill
          priority={priority} quality={90} sizes={imgSizes}
          draggable={false} className={styles.art} aria-hidden="true" />

        <BerniLivingFace mood={actualMood} size={size} blinkToken={blinkToken} reactionToken={reactionToken} />
      </span>
    </span>
  );
}
