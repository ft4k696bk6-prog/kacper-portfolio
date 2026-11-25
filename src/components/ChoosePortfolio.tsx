"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { ExperienceChoices } from "@/components/world/Experience";
import { copy } from "@/components/world/content";
import styles from "@/components/world/world.module.css";

export function ChoosePortfolio() {
  const { lang } = useLanguage();
  return <main className="site-page bg-black">
    <div className={styles.choicePage}>
    <div className={styles.chooseContent}>
      <h1>{copy[lang].chooserTitle}</h1>
      <ExperienceChoices locale={lang} />
    </div>
    </div>
  </main>;
}
