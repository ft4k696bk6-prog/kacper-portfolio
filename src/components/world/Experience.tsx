"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Box, PanelsTopLeft, X } from "lucide-react";
import { classicPaths, copy, worldPaths, worldPreferenceKey, type WorldLocale } from "./content";
import styles from "./experience.module.css";

type Mode = "classic" | "world";

export function rememberExperience(mode: Mode) {
  try { localStorage.setItem(worldPreferenceKey, mode); } catch {}
}

export function ExperienceChoices({ locale, current, onStay }: { locale: WorldLocale; current?: Mode; onStay?: () => void }) {
  const language = copy[locale];
  const [preferred, setPreferred] = useState<Mode | null>(null);
  useEffect(() => {
    try {
      const stored = localStorage.getItem(worldPreferenceKey);
      if (stored === "classic" || stored === "world") setPreferred(stored);
    } catch {}
  }, []);

  const modes = [
    { id: "classic", href: classicPaths[locale], title: language.classic, text: language.classicBlurb, image: "/images/world/classic.webp", Icon: PanelsTopLeft },
    { id: "world", href: worldPaths[locale], title: language.interactive, text: language.worldBlurb, image: "/images/world/model.webp", Icon: Box },
  ] as const;

  return <div className={styles.choices}>
    {modes.map(({ id, href, title, text, image, Icon }) => (
      <a key={id} href={href} className={styles.choice} data-preferred={(preferred ?? current) === id} aria-current={current === id ? "page" : undefined}
        onClick={event => {
          if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
          rememberExperience(id);
          setPreferred(id);
          if (current === id && onStay) {
            event.preventDefault();
            onStay();
          }
        }}>
        <div className={`${styles.preview} ${id === "classic" ? styles.classic : ""}`}>
          <Image src={image} alt="" fill sizes="(max-width: 620px) 84vw, 345px" unoptimized />
        </div>
        <div className={styles.caption}><Icon size={17} strokeWidth={1.5} /><strong>{title}</strong><ArrowUpRight size={16} strokeWidth={1.5} /></div>
        <p>{text}</p>
      </a>
    ))}
  </div>;
}

export function ExperienceDialog({ locale, current, open, onClose }: {
  locale: WorldLocale; current: Mode; open: boolean; onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (open && node && !node.open) node.showModal();
    if (!open && node?.open) node.close();
  }, [open]);
  if (!open) return null;
  const dismiss = () => {
    ref.current?.close();
    onClose();
  };

  return <dialog ref={ref} className={styles.dialog} aria-labelledby="experience-title"
    onCancel={event => { event.preventDefault(); dismiss(); }}
    onClick={event => { if (event.target === event.currentTarget) dismiss(); }}>
    <div className={styles.inner}>
      <button className={styles.close} type="button" aria-label={copy[locale].close} onClick={dismiss}><X size={20} strokeWidth={1.5} /></button>
      <h2 id="experience-title">{copy[locale].chooserTitle}</h2>
      <ExperienceChoices locale={locale} current={current} onStay={dismiss} />
    </div>
  </dialog>;
}

export function ExperienceEntry({ locale }: { locale: WorldLocale }) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLAnchorElement>(null);
  const language = copy[locale];
  return <>
    <a ref={trigger} className={styles.entry} href={worldPaths[locale]} aria-haspopup="dialog"
      onClick={event => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        setOpen(true);
      }}>
      <Box size={15} strokeWidth={1.55} /> <span>{language.interactive}</span><ArrowUpRight size={15} strokeWidth={1.55} />
    </a>
    <ExperienceDialog locale={locale} current="classic" open={open} onClose={() => { setOpen(false); trigger.current?.focus(); }} />
  </>;
}
