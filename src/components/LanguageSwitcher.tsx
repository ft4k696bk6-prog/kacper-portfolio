"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useContactForm } from "@/contexts/ContactFormContext";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  const { openForm } = useContactForm();

  return (
    <motion.div
      className="fixed top-5 right-5 z-50 flex items-center gap-1 bg-slate-800/80 border border-slate-700 rounded-full px-1 py-1 backdrop-blur-sm"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4 }}
    >
      <button
        onClick={() => setLang("en")}
        className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
          lang === "en"
            ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/30"
            : "text-slate-400 hover:text-white"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLang("pl")}
        className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
          lang === "pl"
            ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/30"
            : "text-slate-400 hover:text-white"
        }`}
      >
        PL
      </button>
      <button
        onClick={() => {
          openForm();
          window.dataLayer?.push({ event: "contact_form_opened_from_header" });
        }}
        className="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium text-slate-400 hover:text-cyan-400 transition-colors"
        title="Contact"
      >
        <Mail className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
