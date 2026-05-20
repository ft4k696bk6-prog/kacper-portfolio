"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { en, pl } from "@/i18n";
import type { Translations } from "@/i18n";
import { COOKIE_CONSENT_KEY, LANGUAGE_STORAGE_KEY } from "@/lib/preferences";

type Lang = "en" | "pl";

interface LanguageContextValue {
  lang: Lang;
  t: Translations;
  setLang: (lang: Lang) => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "en",
  t: en,
  setLang: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const cookieConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (cookieConsent !== "accepted") {
      return;
    }

    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Lang | null;
    if (stored === "pl" || stored === "en") {
      setLangState(stored);
    }
  }, []);

  const setLang = (next: Lang) => {
    setLangState(next);
    if (localStorage.getItem(COOKIE_CONSENT_KEY) === "accepted") {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, next);
    }
  };

  return (
    <LanguageContext.Provider value={{ lang, t: lang === "pl" ? pl : en, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
