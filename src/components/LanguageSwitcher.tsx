"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { CalendarDays, Laptop, Mail, Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const navItems = [
  { href: "#home", key: "home" },
  { href: "#about", key: "about" },
  { href: "#projects", key: "projects" },
  { href: "#tech-stack", key: "techStack" },
  { href: "#contact", key: "contact" },
] as const;

export function LanguageSwitcher() {
  const { lang, setLang, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const anchorHref = (hash: string) => (pathname === "/static" ? hash : `/static${hash}`);

  const languageButton = (value: "pl" | "en", label: string) => (
    <button
      onClick={() => setLang(value)}
      className={`h-9 min-w-10 rounded-md px-3 text-sm transition-all ${
        lang === value
          ? "bg-[#d7b46a] text-black shadow-[0_0_24px_rgba(215,180,106,0.28)]"
          : "text-zinc-400 hover:bg-white/5 hover:text-white"
      }`}
      aria-pressed={lang === value}
    >
      {label}
    </button>
  );

  return (
    <motion.header
      className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-[#070707]/85 backdrop-blur-xl"
      initial={{ opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 md:px-8">
        <a
          href={anchorHref("#home")}
          className="group flex items-center gap-3"
          onClick={() => setIsOpen(false)}
        >
          <span className="grid h-10 w-10 place-items-center rounded-md border border-[#d7b46a]/40 bg-[#d7b46a]/10 text-sm text-[#f5dfae]">
            KB
          </span>
          <span className="hidden text-sm uppercase tracking-[0.28em] text-zinc-300 transition-colors group-hover:text-white sm:inline">
            Kacper Bernecki
          </span>
        </a>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={anchorHref(item.href)}
              className="rounded-md px-4 py-2 text-sm text-zinc-300 transition-colors hover:bg-white/5 hover:text-[#f5dfae]"
            >
              {t.nav[item.key]}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <div className="flex rounded-md border border-white/10 bg-white/[0.03] p-1">
            {languageButton("pl", "PL")}
            {languageButton("en", "ENG")}
          </div>
          <a
            href="https://kacper-bernecki.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/[0.03] px-4 py-2 text-sm text-zinc-100 transition-all hover:-translate-y-0.5 hover:border-[#d7b46a]/60 hover:text-[#f5dfae]"
          >
            <Laptop className="h-4 w-4 text-[#d7b46a]" />
            {t.nav.interactive}
          </a>
          <a
            href={anchorHref("#contact")}
            className="inline-flex items-center gap-2 rounded-md border border-[#d7b46a]/50 bg-[#d7b46a] px-4 py-2 text-sm text-black transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(215,180,106,0.25)]"
          >
            <Mail className="h-4 w-4" />
            {t.nav.cta}
          </a>
          <a
            href={anchorHref("#contact")}
            aria-label={t.contact.calendarCta}
            className="grid h-10 w-10 place-items-center rounded-md border border-[#d7b46a]/40 bg-[#d7b46a]/10 text-[#f5dfae] transition-all hover:-translate-y-0.5 hover:border-[#d7b46a]/70 hover:bg-[#d7b46a]/15"
          >
            <CalendarDays className="h-4 w-4" />
          </a>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <div className="flex rounded-md border border-[#d7b46a]/35 bg-white/[0.04] p-1">
            {languageButton("pl", "PL")}
            {languageButton("en", "ENG")}
          </div>
          <a
            href="https://kacper-bernecki.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t.nav.interactive}
            className="grid h-11 w-11 place-items-center rounded-md border border-[#d7b46a]/40 bg-[#d7b46a]/10 text-[#f5dfae]"
          >
            <Laptop className="h-5 w-5" />
          </a>
          <button
            onClick={() => setIsOpen((open) => !open)}
            className="grid h-11 w-11 place-items-center rounded-md border border-white/10 bg-white/[0.03] text-zinc-200"
            aria-label={isOpen ? t.nav.closeMenu : t.nav.openMenu}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <motion.div
          className="border-t border-white/10 bg-[#070707] px-5 py-5 lg:hidden"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-2">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={anchorHref(item.href)}
                className="rounded-md px-3 py-3 text-base text-zinc-200 hover:bg-white/5"
                onClick={() => setIsOpen(false)}
              >
                {t.nav[item.key]}
              </a>
            ))}
            <div className="mt-3 flex items-center justify-between gap-3">
              <a
                href={anchorHref("#contact")}
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center gap-2 rounded-md bg-[#d7b46a] px-4 py-2 text-sm text-black"
              >
                <Mail className="h-4 w-4" />
                {t.nav.cta}
              </a>
              <a
                href={anchorHref("#contact")}
                onClick={() => setIsOpen(false)}
                aria-label={t.contact.calendarCta}
                className="grid h-10 w-10 place-items-center rounded-md border border-[#d7b46a]/40 bg-[#d7b46a]/10 text-[#f5dfae]"
              >
                <CalendarDays className="h-4 w-4" />
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
