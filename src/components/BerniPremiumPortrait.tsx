"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { BerniLivingFace, type BerniLivingMood } from "./BerniLivingFace";
import type { BerniPose } from "@/lib/berni-poses";
import type { BerniTransitionName } from "@/lib/berni-transition";
import styles from "./BerniPremiumPortrait.module.css";

export type BerniPortraitMood = BerniLivingMood;

export function BerniPremiumPortrait({
  mood = "idle",
  pose = null,
  size = 64,
  className = "",
  priority = false,
  blinkToken = 0,
  reactionToken = 0,
  transitionToken = 0,
  transitionPreset = null,
  transitionEnabled = true,
}: {
  mood?: BerniPortraitMood;
  pose?: BerniPose | null;
  size?: number;
  className?: string;
  priority?: boolean;
  blinkToken?: number;
  reactionToken?: number;
  transitionToken?: number;
  transitionPreset?: BerniTransitionName | null;
  transitionEnabled?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);
  const handleReady = useCallback(() => setCanvasReady(true), []);
  const actualMood = mood === "idle" && hovered ? "curious" : mood;
  const imgSizes = size >= 180 ? "(max-width: 640px) 78vw, 400px" : "112px";

  return (
    <span className={[styles.stage, className].filter(Boolean).join(" ")}
      data-testid="berni-fox-premium"
      data-mood={actualMood}
      style={{ width: size, height: size }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="img" aria-label="Berni — lisek AI z animowanymi emocjami">
      <span className={styles.portrait}>
        {/*
          Once the canvas is ready, completely HIDE the fallback image.
          Otherwise, the stationary portrait remains visible through the
          transparent frame during dives and spins (the previous bug).
        */}
        <Image src="/images/berni/generated/neutral.png" alt="" fill
          priority={priority} quality={90} sizes={imgSizes} draggable={false}
          className={styles.art} aria-hidden="true"
          style={{ visibility: canvasReady ? "hidden" : "visible" }} />
        <BerniLivingFace mood={actualMood} pose={pose} size={size}
          blinkToken={blinkToken} reactionToken={reactionToken}
          transitionToken={transitionToken} transitionPreset={transitionPreset}
          transitionEnabled={transitionEnabled}
          onReady={handleReady} />
      </span>
    </span>
  );
}
