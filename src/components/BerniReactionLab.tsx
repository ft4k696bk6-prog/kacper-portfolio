"use client";

import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  BERNI_GROUPS, BERNI_REACTIONS, getBerniReaction, detectBerniReaction,
  berniReactionCount, type ReactionGroup,
} from "@/lib/berni-reaction-model";
import { berniPoseUrl } from "@/lib/berni-poses";
import styles from "./BerniReactionLab.module.css";

const autoSequence = [
  "face-neutral", "motion-peek", "clip-mruganie", "motion-listen",
  "clip-usmiech", "motion-scan", "motion-nod", "face-confident",
  "clip-smiech", "motion-think", "face-neutral",
] as const;

const samples = [
  "Cześć Berni!", "Haha, opowiedz żart!", "To nie działa, mam błąd.",
  "Udało się, sukces!", "Co myślisz o SEO?", "Jesteś śpiący?",
] as const;

export function BerniReactionLab() {
  const [activeId, setActiveId] = useState("face-neutral");
  const [group, setGroup] = useState<ReactionGroup>("klipy");
  const [automatic, setAutomatic] = useState(true);
  const [revision, setRevision] = useState(0);
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState("Dotknij mnie, napisz coś albo wybierz reakcję.");
  const autoIndex = useRef(0);

  const active = getBerniReaction(activeId);
  const groupItems = useMemo(
    () => BERNI_REACTIONS.filter(reaction => reaction.group === group), [group],
  );

  function react(id: string, manual = true) {
    const response = getBerniReaction(id);
    setActiveId(response.id);
    setFeedback(response.message);
    setRevision(n => n + 1);
    if (manual) setAutomatic(false);
  }

  useEffect(() => {
    if (!automatic) return;
    const timer = window.setInterval(() => {
      autoIndex.current = (autoIndex.current + 1) % autoSequence.length;
      const response = getBerniReaction(autoSequence[autoIndex.current]);
      setActiveId(response.id);
      setFeedback(response.message);
      setRevision(n => n + 1);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [automatic]);

  function answer(text: string) {
    setMessage(text);
    react(detectBerniReaction(text));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!message.trim()) return;
    answer(message);
  }

  const src = active.clip
    ? `/images/berni/clips/${active.clip}.gif`
    : berniPoseUrl(active.pose);
  const motion = active.motion ?? "idle";

  return (
    <section data-testid="berni-reaction-lab" className={styles.lab} aria-label="Interaktywny Berni">
      <div className={styles.topline}>
        <div>
          <p className={styles.eyebrow}>INTERAKTYWNY PODGLĄD · TESTY</p>
          <h2 className={styles.headline}>Berni reaguje — {BERNI_REACTIONS.length} zachowań</h2>
          <p className={styles.description}>
            Wybierz zachowanie. Główna maskotka naprawdę je wykona — to nie jest galeria
            obrazków. Przetestuj też pisanie, dotyk i automatyczne reakcje.
          </p>
        </div>
        <button type="button" aria-pressed={automatic}
          data-testid="berni-autoplay-toggle"
          className={automatic ? styles.autoOn : styles.autoOff}
          onClick={() => { setAutomatic(v => !v); autoIndex.current = 0; }}>
          <span className={styles.autoDot} aria-hidden="true" />
          {automatic ? "Sam reaguje: WŁ." : "Sam reaguje: WYŁ."}
        </button>
      </div>

      <div className={styles.hero}>
        <div className={styles.heroImagePanel}>
          <button type="button" className={styles.touch}
            data-testid="berni-tap-reaction"
            onPointerEnter={() => { if (automatic) react("motion-peek", false); }}
            onClick={() => react("motion-startle")}
            title="Dotknij Berniego — będzie zaskoczony"
            aria-label="Dotknij Berniego, aby zobaczyć jego reakcję">
            <span className={styles.halo} aria-hidden="true" />
            <span className={styles.artBox}>
              <span key={active.id + ":" + revision}
                className={[styles.motion, styles[motion]].filter(Boolean).join(" ")}
                data-motion={motion}>
                <Image src={src} width={400} height={400} priority unoptimized
                  alt={`Berni: ${active.label}`}
                  className={styles.mainArt}
                  draggable={false} />
              </span>
            </span>
            <span className={styles.tapHint}>Dotknij mnie</span>
          </button>
          <div className={styles.response} aria-live="polite">
            <span className={styles.responseDot} aria-hidden="true" />
            <span>{feedback}</span>
          </div>
          <div className={styles.current}>
            <span data-testid="berni-active-reaction">{active.label}</span>
            <span className={styles.counter}>{active.group === "klipy" ? "Animowany GIF" :
              active.group === "mimika" ? "Mimika" : "Żywy gest"}</span>
          </div>
        </div>

        <div className={styles.sidePanel}>
          <div className={styles.sideTitle}>Porozmawiaj z Bernim — test reakcji</div>
          <p className={styles.sideDescription}>
            Wpisuj tekst lub kliknij przykład. Berni dobierze minę i zachowanie
            do tego, co napiszesz.
          </p>
          <form onSubmit={submit} className={styles.form}>
            <label htmlFor="berni-test-message" className={styles.inputLabel}>
              Co chcesz mu powiedzieć?
            </label>
            <input id="berni-test-message" data-testid="berni-reaction-input"
              type="text" maxLength={240} value={message}
              onFocus={() => { setAutomatic(false); react("motion-listen"); }}
              onChange={event => {
                setMessage(event.target.value);
                if (event.target.value.length > 0 && activeId !== "clip-wariant-01") {
                  react("clip-wariant-01");
                }
              }}
              placeholder="Np. Cześć, coś mi nie działa..."
              className={styles.input} />
            <button className={styles.submit} type="submit">Zobacz reakcję</button>
          </form>
          <p className={styles.examplesTitle}>Wypróbuj sytuacje:</p>
          <div className={styles.samples}>
            {samples.map(sample => (
              <button key={sample} type="button" className={styles.sample}
                onClick={() => answer(sample)}>{sample}</button>
            ))}
          </div>
          <div className={styles.mini}>
            <div className={styles.miniArt}>
              <Image src={src} width={56} height={56} alt="" unoptimized />
            </div>
            <div>
              <strong>Rzeczywisty rozmiar dymka: 56 px</strong>
              <span>Podgląd również na telefonie</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.selector}>
        <div className={styles.tabs} role="group" aria-label="Kategorie reakcji">
          {BERNI_GROUPS.map(item => (
            <button type="button" key={item.id} aria-pressed={group === item.id}
              className={group === item.id ? styles.tabActive : styles.tab}
              onClick={() => setGroup(item.id)}>
              {item.label} <span>{berniReactionCount(item.id)}</span>
            </button>
          ))}
        </div>
        <div className={styles.reactionGrid} data-testid="berni-reaction-buttons">
          {groupItems.map(reaction => (
            <button type="button" key={reaction.id}
              data-testid={`berni-reaction-${reaction.id}`}
              aria-pressed={activeId === reaction.id}
              onClick={() => react(reaction.id)}
              className={activeId === reaction.id ? styles.reactionActive : styles.reaction}>
              <span className={styles.thumbnail}>
                <Image src={reaction.clip ? `/images/berni/clips/${reaction.clip}.gif` : berniPoseUrl(reaction.pose)}
                  alt="" width={64} height={64} unoptimized loading="lazy" />
              </span>
              <span className={styles.reactionLabel}>{reaction.label}</span>
            </button>
          ))}
        </div>
      </div>
      <p className={styles.footer}>
        Automatyczne reakcje zatrzymują się, kiedy sam wybierasz animację.
        Włącz je ponownie przyciskiem u góry. To symulator zachowań maskotki,
        nie rozmowa z modelem AI.
      </p>
    </section>
  );
}
