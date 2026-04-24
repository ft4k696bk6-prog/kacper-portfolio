"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

type ConsentValue = "granted" | "denied";

function updateConsent(analytics: ConsentValue, ads: ConsentValue) {
  if (typeof window === "undefined") return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).gtag?.("consent", "update", {
    analytics_storage: analytics,
    ad_storage: ads,
    ad_user_data: ads,
    ad_personalization: ads,
  });
}

export function CookieBanner() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("cookie_consent");
    if (!stored) {
      setVisible(true);
    } else {
      const value: ConsentValue = stored === "granted" ? "granted" : "denied";
      updateConsent(value, value);
    }
  }, []);

  function accept() {
    localStorage.setItem("cookie_consent", "granted");
    updateConsent("granted", "granted");
    setVisible(false);
  }

  function reject() {
    localStorage.setItem("cookie_consent", "denied");
    updateConsent("denied", "denied");
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-t border-slate-700 p-4 md:p-6"
          role="dialog"
          aria-label="Cookie consent"
        >
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-4 items-start md:items-center">
            <p className="flex-1 text-sm text-slate-300 leading-relaxed">
              {t.cookies.bannerText}{" "}
              <Link
                href="/cookies"
                className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2"
              >
                {t.cookies.policyLink}
              </Link>
              .
            </p>
            <div className="flex gap-3 shrink-0">
              <button
                onClick={reject}
                className="px-4 py-2 text-sm text-slate-300 border border-slate-600 hover:border-slate-400 hover:text-white rounded-lg transition-colors"
              >
                {t.cookies.reject}
              </button>
              <button
                onClick={accept}
                className="px-4 py-2 text-sm bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors font-medium"
              >
                {t.cookies.accept}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
