"use client";

import Image from "next/image";
import styles from "./BerniPremiumPortrait.module.css";

export type BerniPortraitMood =
  | "idle" | "curious" | "thinking" | "happy" | "excited"
  | "sleeping" | "typing" | "listening" | "surprised"
  | "worried" | "working" | "grabbed";

/**
 * Uses the APPROVED 3/4 illustration as the single source of truth.
 * Do not recreate the face/headphones with SVG primitives.
 * All animations affect the entire rendered asset (no fake facial rig).
 */
export function BerniPremiumPortrait({
  mood = "idle",
  size = 64,
  className = "",
  priority = false,
}: {
  mood?: BerniPortraitMood;
  size?: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    <span className={[styles.stage, className].filter(Boolean).join(" ")}
      data-testid="berni-fox-premium" data-mood={mood}
      style={{ width: size, height: size }}
      role="img" aria-label="Berni — srebrno-biały lisek AI w słuchawkach B">
      <span className={styles.motion}>
        <Image
          src="/images/berni/berni-fox-head.png"
          alt=""
          fill
          priority={priority}
          quality={82}
          sizes={size >= 200 ? "(max-width: 640px) 78vw, 400px" : "112px"}
          className={styles.art}
          draggable={false}
        />
      </span>
      {mood === "thinking" || mood === "working" ? <span className={styles.thinking} aria-hidden="true"><i/><i/><i/></span> : null}
    </span>
  );
}
