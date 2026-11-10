"use client";

import { Suspense, useEffect, useState } from "react";
import Script from "next/script";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
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

  useEffect(() => {
    const open = () => { setConsent(null); window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_EVENT, { detail: { consent: null } })); };
    window.addEventListener("portfolio-open-cookie-settings", open);
    return () => window.removeEventListener("portfolio-open-cookie-settings", open);
  }, []);


  const analyticsEnabled = loaded && consent === "accepted";
  useEffect(() => {
    const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-9T1ZPCK96T";
    (window as unknown as Record<string, boolean>)[`ga-disable-${measurementId}`] = !analyticsEnabled;
  }, [analyticsEnabled]);

  return (
    <>
      {analyticsEnabled ? (
        <>
          <Suspense fallback={null}><GoogleAnalytics /></Suspense>
          <GoogleTagManager />
          <Script id="vercel-analytics-bootstrap" strategy="afterInteractive">
            {`window.va = window.va || function(){(window.vaq = window.vaq || []).push(arguments);};`}
          </Script>
          <Script src="/_vercel/insights/script.js" strategy="afterInteractive" />
        </>
      ) : null}

      {loaded && consent === null ? (
        <div className="cookie-consent-banner fixed inset-x-3 bottom-3 z-[70] mx-auto max-w-[23rem] rounded-xl border border-white/15 bg-[#101114]/80 p-3 text-white shadow-[0_12px_40px_rgba(0,0,0,0.24)] backdrop-blur-md sm:inset-x-auto sm:bottom-5 sm:left-5 sm:mx-0 sm:w-[23rem] sm:p-4">
          <p className="text-[13px] font-semibold leading-5 text-white">{t.consent.title}</p>
          <p className="mt-1 text-[11px] leading-[1.55] text-white/75 sm:text-xs">{t.consent.description}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => choose("accepted")}
              className="brand-action glass-action inline-flex min-h-9 items-center justify-center rounded-lg px-3 py-1.5 text-xs font-semibold transition hover:-translate-y-px"
            >
              {t.consent.accept}
            </button>
            <button
              type="button"
              onClick={() => choose("rejected")}
              className="inline-flex min-h-9 items-center justify-center rounded-lg border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/85 transition hover:border-white/40 hover:bg-white/10 hover:text-white"
            >
              {t.consent.reject}
            </button>
          </div>
        </div>
      ) : null}

    </>
  );
}
