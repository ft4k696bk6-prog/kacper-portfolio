"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import styles from "./BerniPremiumPortrait.module.css";

export type BerniPortraitMood =
  | "idle" | "curious" | "thinking" | "happy" | "excited"
  | "sleeping" | "typing" | "listening" | "surprised"
  | "worried" | "working" | "grabbed";

const FACE_ASSETS = {
  blink: "/images/berni/moods/blink.jpg",
  happy: "/images/berni/moods/happy.jpg",
  surprised: "/images/berni/moods/surprised.jpg",
  thinking: "/images/berni/moods/thinking.jpg",
  worried: "/images/berni/moods/worried.jpg",
  talking: "/images/berni/moods/talking.jpg",
  wink: "/images/berni/moods/wink.jpg",
} as const;

type FacialFrame = Exclude<keyof typeof FACE_ASSETS, "blink" | "wink" | "talking">;

function facialFrameForMood(mood: BerniPortraitMood): FacialFrame | null {
  switch (mood) {
    case "happy":
    case "excited":
      return "happy";
    case "curious":
    case "thinking":
    case "listening":
    case "working":
      return "thinking";
    case "surprised":
    case "grabbed":
      return "surprised";
    case "worried":
      return "worried";
    default:
      return null;
  }
}

/**
 * Real facial expression frames with a feathered face-only mask.
 * The approved cinematic portrait, headphones and fur silhouette stay
 * perfectly stationary; only the eyes, eyebrows and mouth are blended.
 * Unlike the earlier prototype, facial changes are not head-shaking CSS.
 */
export function BerniPremiumPortrait({
  mood = "idle",
  size = 64,
  className = "",
  priority = false,
  blinkToken = 0,
}: {
  mood?: BerniPortraitMood;
  size?: number;
  className?: string;
  priority?: boolean;
  blinkToken?: number;
}) {
  const [hovered, setHovered] = useState(false);
  const reduceMotion = useReducedMotion();
  const actualMood = mood === "idle" && hovered ? "curious" : mood;
  const faceFrame = facialFrameForMood(actualMood);
  const speaking = actualMood === "typing";
  const asleep = actualMood === "sleeping";
  const imgSizes = size >= 180 ? "(max-width: 640px) 78vw, 400px" : "112px";
  const frameImage = (src: string) => (
    <Image src={src} alt="" fill sizes={imgSizes} className={styles.art}
      unoptimized draggable={false} aria-hidden="true" />
  );

  return (
    <span
      className={[styles.stage, className].filter(Boolean).join(" ")}
      data-testid="berni-fox-premium"
      data-mood={actualMood}
      style={{ width: size, height: size }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="img"
      aria-label="Berni — lisek, który mruga, mówi i reaguje mimiką twarzy"
    >
      <span className={styles.portrait}>
        <Image src="/images/berni/berni-fox-head.png" alt="" fill
          priority={priority} quality={90} sizes={imgSizes}
          draggable={false} className={styles.art} aria-hidden="true" />

        <AnimatePresence initial={false}>
          {faceFrame && (
            <motion.span key={faceFrame} className={styles.expressionLayer}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.22 }}>
              <span className={styles.expressionEyes}>{frameImage(FACE_ASSETS[faceFrame])}</span>
              <span className={styles.expressionMouth}>{frameImage(FACE_ASSETS[faceFrame])}</span>
            </motion.span>
          )}
        </AnimatePresence>

        {/* Mouth is the ONLY animated region while Berni is speaking. */}
        {speaking && (
          <span className={styles.mouthLayer} data-testid="berni-mouth-animation">
            {frameImage(FACE_ASSETS.talking)}
          </span>
        )}

        {/* A genuine closed-eye frame, not a transform of the whole head. */}
        <span className={styles.blinkLayer} data-testid="berni-eye-blink">
          {frameImage(FACE_ASSETS.blink)}
        </span>

        {/* A rare playful wink when idle; disabled during focused conversation. */}
        {actualMood === "idle" && !reduceMotion && (
          <span className={styles.winkLayer}>
            {frameImage(FACE_ASSETS.wink)}
          </span>
        )}

        {/* Trigger an immediate blink on demand in the preview. */}
        {blinkToken > 0 && (
          <span key={blinkToken} className={styles.manualBlink} data-testid="berni-manual-blink">
            {frameImage(FACE_ASSETS.blink)}
          </span>
        )}
      </span>
    </span>
  );
}
