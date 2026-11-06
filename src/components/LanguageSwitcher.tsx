"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { CalendarDays, Cookie, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const navItems = [
  { href: "#services", key: "home" },
  { href: "#about", key: "about" },
  { href: "#projects", key: "projects" },
  { href: "#faq", key: "techStack" },
  { href: "#contact", key: "contact" },
] as const;

export function LanguageSwitcher() {
  const { lang, setLang, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [dark, setDark] = useState(pathname !== "/");
  useEffect(() => {
    const update = () => { const hero = document.getElementById("home"); setDark(!hero || scrollY > hero.offsetHeight * .52); };
    window.addEventListener("scroll", update, { passive: true }); update();
    return () => window.removeEventListener("scroll", update);
  }, [pathname]);
  const cookies = <button type="button" aria-label={t.consent.settings} onClick={() => window.dispatchEvent(new Event("portfolio-open-cookie-settings"))} className="brand-outline grid h-10 w-10 place-items-center rounded-md"><Cookie size={17}/></button>;
  const anchorHref = (hash: string) => (pathname === "/" ? hash : `/${hash}`);

  const languageButton = (value: "pl" | "en", label: string) => (
    <button
      onClick={() => setLang(value)}
      className={`h-9 min-w-10 rounded-md px-3 text-sm transition-all ${
        lang === value
          ? "brand-selected"
          : "text-white/70 hover:bg-[var(--brand-black)] hover:text-white"
      }`}
      aria-pressed={lang === value}
    >
      {label}
    </button>
  );

  return (
    <motion.header
      data-dark={dark} className="site-nav fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-[var(--brand-black)]/85 backdrop-blur-xl"
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
          <span className="brand-mark grid h-10 w-10 place-items-center rounded-md border text-sm">
            KB
          </span>
          <span className="hidden text-sm uppercase tracking-[0.28em] text-white transition-colors group-hover:text-white sm:inline">
            Kacper Bernecki
          </span>
        </a>

        <nav className="hidden items-center gap-1 xl:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={anchorHref(item.href)}
              className="ui-nav rounded-md px-4 py-2 text-sm"
            >
              {t.nav[item.key]}
            </a>
          ))}
          <Link href="/poradniki" className="ui-nav rounded-md px-4 py-2 text-sm">{lang === "pl" ? "Poradniki" : "Guides"}</Link>
        </nav>

        <div className="hidden items-center gap-3 xl:flex">{cookies}
          <div className="nav-language flex rounded-md border border-white/10 bg-[var(--brand-black)] p-1">
            {languageButton("pl", "PL")}
            {languageButton("en", "ENG")}
          </div>
          <a
            href={anchorHref("#contact")}
            className="brand-action glass-action inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm transition-all hover:-translate-y-0.5"
          >
            <Mail className="h-4 w-4" />
            {t.nav.cta}
          </a>
          <a
            href={anchorHref("#contact")}
            aria-label={t.contact.calendarCta}
            className="brand-outline grid h-10 w-10 place-items-center rounded-md transition-colors"
          >
            <CalendarDays className="h-4 w-4" />
          </a>
        </div>

        <div className="flex items-center gap-2 xl:hidden">{cookies}
          <div className="nav-language flex rounded-md border border-white/35 bg-[var(--brand-black)] p-1">
            {languageButton("pl", "PL")}
            {languageButton("en", "ENG")}
          </div>
          <button
            onClick={() => setIsOpen((open) => !open)}
            className="brand-outline grid h-11 w-11 place-items-center rounded-md transition-colors"
            aria-expanded={isOpen}
            aria-controls="mobile-portfolio-navigation"
            aria-label={isOpen ? t.nav.closeMenu : t.nav.openMenu}
          >
            <span className={["menu-morph", isOpen ? "is-open" : ""].join(" ")} aria-hidden="true"><i/><i/><i/></span>
          </button>
        </div>
      </div>

      {isOpen && (
        <motion.div
          id="mobile-portfolio-navigation"
          className="border-t border-white/10 bg-[var(--brand-black)] px-5 py-5 xl:hidden"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-2">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={anchorHref(item.href)}
                className="glass-action rounded-md px-3 py-3 text-base text-white hover:bg-[var(--brand-black)]"
                onClick={() => setIsOpen(false)}
              >
                {t.nav[item.key]}
              </a>
            ))}
            <Link href="/poradniki" className="glass-action rounded-md px-3 py-3 text-base text-white" onClick={() => setIsOpen(false)}>{lang === "pl" ? "Poradniki" : "Guides"}</Link>
            <div className="mt-3 flex items-center justify-between gap-3">
              <a
                href={anchorHref("#contact")}
                onClick={() => setIsOpen(false)}
                className="brand-action glass-action inline-flex items-center gap-2 rounded-md  px-4 py-2 text-sm text-black"
              >
                <Mail className="h-4 w-4" />
                {t.nav.cta}
              </a>
              <a
                href={anchorHref("#contact")}
                onClick={() => setIsOpen(false)}
                aria-label={t.contact.calendarCta}
                className="brand-outline grid h-10 w-10 place-items-center rounded-md transition-colors"
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
