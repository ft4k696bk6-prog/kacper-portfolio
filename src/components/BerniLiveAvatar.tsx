"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { BerniPremiumPortrait } from "./BerniPremiumPortrait";
import { getBerniReaction } from "@/lib/berni-reaction-model";
import styles from "./BerniLiveAvatar.module.css";

export function BerniLiveAvatar({
  reactionId = "face-neutral",
  size = 56,
  revision = 0,
  className = "",
}: {
  reactionId?: string;
  size?: number;
  revision?: number;
  className?: string;
}) {
  const reaction = useMemo(() => getBerniReaction(reactionId), [reactionId]);
  const [clipFailed, setClipFailed] = useState(false);
  useEffect(() => setClipFailed(false), [reaction.clip]);
  const motion = reaction.motion ?? "idle";
  const useClip = Boolean(reaction.clip) && !clipFailed;
  return (
    <span
      data-testid="berni-live-avatar"
      data-reaction={reaction.id}
      data-motion={motion}
      className={[styles.stage, className].filter(Boolean).join(" ")}
      style={{ width: size, height: size }}
      role="img" aria-label={`Berni: ${reaction.label}`}
    >
      <span key={reaction.id + ":" + revision}
        className={[styles.motion, styles[motion]].filter(Boolean).join(" ")}
      >
        {useClip ? (
          <Image
            src={`/images/berni/clips/${reaction.clip}.gif`}
            alt="" aria-hidden="true" unoptimized draggable={false}
            width={size} height={size}
            className={styles.art}
            onError={() => setClipFailed(true)}
          />
        ) : (
          <BerniPremiumPortrait
            mood="idle" pose={reaction.pose} size={size}
            transitionEnabled={false}
          />
        )}
      </span>
    </span>
  );
}
