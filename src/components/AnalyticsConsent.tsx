"use client";

import { Suspense, useEffect, useState } from "react";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { GoogleTagManager } from "@/components/GoogleTagManager";
import { useLanguage } from "@/contexts/LanguageContext";
import {
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
  }

  const analyticsEnabled = loaded && consent === "accepted";

  return (
    <>
      {analyticsEnabled ? (
        <>
          <GoogleTagManager />
          <Suspense fallback={null}>
            <GoogleAnalytics />
          </Suspense>
        </>
      ) : null}

      {loaded && consent === null ? (
        <div className="fixed bottom-4 left-4 right-4 z-[70] mx-auto max-w-2xl rounded-md border border-[#d7b46a]/35 bg-[#11110f]/95 p-4 text-sm text-zinc-300 shadow-[0_22px_70px_rgba(0,0,0,0.42)] backdrop-blur-xl md:left-auto md:right-5 md:max-w-md">
          <p className="text-base font-medium text-white">{t.consent.title}</p>
          <p className="mt-2 leading-6">{t.consent.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => choose("accepted")}
              className="rounded-md bg-[#d7b46a] px-4 py-2 text-sm text-black transition hover:-translate-y-0.5"
            >
              {t.consent.accept}
            </button>
            <button
              type="button"
              onClick={() => choose("rejected")}
              className="rounded-md border border-white/15 px-4 py-2 text-sm text-zinc-100 transition hover:border-[#d7b46a]/60 hover:text-[#f5dfae]"
            >
              {t.consent.reject}
            </button>
          </div>
        </div>
      ) : null}

      {loaded && consent !== null ? (
        <button
          type="button"
          onClick={() => setConsent(null)}
          className="fixed bottom-3 left-3 z-[65] rounded-md border border-white/10 bg-[#11110f]/80 px-3 py-2 text-xs text-zinc-400 backdrop-blur transition hover:border-[#d7b46a]/45 hover:text-[#f5dfae]"
        >
          {t.consent.settings}
        </button>
      ) : null}
    </>
  );
}
