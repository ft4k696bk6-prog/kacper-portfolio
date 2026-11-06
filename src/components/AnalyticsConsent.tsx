"use client";

import { useEffect, useState } from "react";
import { GoogleTagManager } from "@/components/GoogleTagManager";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  COOKIE_CONSENT_EVENT,
  COOKIE_CONSENT_KEY,
  LANGUAGE_STORAGE_KEY,
  LEGACY_ANALYTICS_CONSENT_KEY,
} from "@/lib/preferences";

type ConsentState = "accepted" | "rejected" | null;

export function AnalyticsConsent() {
  const { lang, t } = useLanguage();
  const [consent, setConsent] = useState<ConsentState>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    localStorage.removeItem(LEGACY_ANALYTICS_CONSENT_KEY);
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    setConsent(stored === "accepted" || stored === "rejected" ? stored : null);
    setLoaded(true);
  }, []);

  function choose(next: Exclude<ConsentState, null>) {
    localStorage.setItem(COOKIE_CONSENT_KEY, next);
    if (next === "accepted") {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    } else {
      localStorage.removeItem(LANGUAGE_STORAGE_KEY);
    }
    setConsent(next);
    window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_EVENT, { detail: { consent: next } }));
  }

  function reopenSettings() {
    setConsent(null);
    window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_EVENT, { detail: { consent: null } }));
  }

  const analyticsEnabled = loaded && consent === "accepted";

  return (
    <>
      {analyticsEnabled ? <GoogleTagManager /> : null}

      {loaded && consent === null ? (
        <div className="fixed bottom-4 left-4 right-4 z-[70] mx-auto max-w-2xl rounded-md border border-white/35 bg-[var(--brand-black)]/95 p-4 text-sm text-white shadow-[0_22px_70px_rgba(0,0,0,0.42)] backdrop-blur-xl md:left-5 md:right-auto md:mx-0 md:max-w-md">
          <p className="text-base font-medium text-white">{t.consent.title}</p>
          <p className="mt-2 text-xs leading-5 text-white/70 md:text-sm md:leading-6">{t.consent.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => choose("accepted")}
              className="brand-action glass-action rounded-md px-4 py-2 text-sm transition hover:-translate-y-0.5"
            >
              {t.consent.accept}
            </button>
            <button
              type="button"
              onClick={() => choose("rejected")}
              className="glass-action rounded-md border border-white/15 px-4 py-2 text-sm text-white transition hover:border-[var(--brand-gold)] hover:text-white"
            >
              {t.consent.reject}
            </button>
          </div>
        </div>
      ) : null}

      {loaded && consent !== null ? (
        <button
          type="button"
          onClick={reopenSettings}
          className="fixed bottom-3 left-3 z-[65] rounded-md border border-white/10 bg-[var(--brand-black)]/80 px-3 py-2 text-xs text-white/70 backdrop-blur transition hover:border-[var(--brand-gold)] hover:text-white"
        >
          {t.consent.settings}
        </button>
      ) : null}
    </>
  );
}
