"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { CalendarDays, Cookie, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const navItems = [
  { href: "#services", pl: "Oferta", en: "Services" },
  { href: "#projects", pl: "Realizacje", en: "Projects" },
  { href: "#guides", pl: "Poradniki", en: "Guides" },
] as const;

export function LanguageSwitcher() {
  const { lang, setLang, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!isOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);
  const pathname = usePathname();
  const router = useRouter();
  // Every static business route has a real English counterpart, not just translated menu labels.
  const bilingualRoutes: Record<string,string> = {
    "/case-studies": "/en/case-studies",
    "/blog": "/en/blog",
    "/rozwoj-biznesu": "/en/business",
    "/case-studies/re-energy-meta-ads": "/en/case-studies/re-energy-meta-ads",
    "/reklamy-meta-ads-dla-firm": "/en/meta-ads",
    "/tworzenie-stron-internetowych": "/en/services/websites",
    "/crm-i-aplikacje-webowe": "/en/services/crm",
    "/marketing-i-reklamy": "/en/services/marketing"
  };
  // Guides have separate, indexable EN URLs; a localStorage toggle alone would leave Polish text visible.
  const guideLanguagePath = (target: "pl" | "en") => {
    if (pathname.startsWith("/blog/")) return target==="en"?`/en/blog/${pathname.slice("/blog/".length)}`:pathname;
    if (pathname.startsWith("/en/blog/")) return target==="pl"?`/blog/${pathname.slice("/en/blog/".length)}`:pathname;
    if (pathname.startsWith("/realizacje/")) {
      const slug=pathname.slice("/realizacje/".length);
      return target==="en" ? `/en/projects/${slug}` : pathname;
    }
    if (pathname.startsWith("/en/projects/")) {
      const slug=pathname.slice("/en/projects/".length);
      return target==="pl" ? `/realizacje/${slug}` : pathname;
    }
    if (target==="en" && bilingualRoutes[pathname])return bilingualRoutes[pathname];
    if (target==="pl") {
      const source=Object.entries(bilingualRoutes).find(([,english])=>english===pathname);
      if (source)return source[0];
    }
    if (pathname.startsWith("/poradniki/tematy/")) {
      const suffix = pathname.slice("/poradniki/tematy/".length);
      return target === "en" ? `/en/guides/topics/${suffix}` : pathname;
    }
    if (pathname.startsWith("/en/guides/topics/")) {
      const suffix = pathname.slice("/en/guides/topics/".length);
      return target === "pl" ? `/poradniki/tematy/${suffix}` : pathname;
    }
    if (pathname.startsWith("/poradniki/")) {
      const slug = pathname.slice("/poradniki/".length);
      return target === "en" ? `/en/guides/${slug}` : pathname;
    }
    if (pathname.startsWith("/en/guides/")) {
      const slug = pathname.slice("/en/guides/".length);
      return target === "pl" ? `/poradniki/${slug}` : pathname;
    }
    if (pathname === "/poradniki" || pathname === "/en/guides")
      return target === "en" ? "/en/guides" : "/poradniki";
    return null;
  };
  const switchLanguage = (next: "pl"|"en") => {
    setLang(next);
    const path = guideLanguagePath(next);
    if (path && path !== pathname) router.push(path);
  };
  useEffect(() => {
    if (pathname.startsWith("/en/") && lang !== "en") setLang("en");
    if ((pathname.startsWith("/poradniki") || pathname.startsWith("/blog") || pathname.startsWith("/realizacje/") ||
      ["/case-studies","/case-studies/re-energy-meta-ads","/reklamy-meta-ads-dla-firm",
       "/tworzenie-stron-internetowych","/crm-i-aplikacje-webowe","/marketing-i-reklamy","/rozwoj-biznesu"].includes(pathname)) &&
       lang !== "pl") setLang("pl");
  }, [pathname, lang, setLang]);

  const [dark, setDark] = useState(true);
  useEffect(() => {
    const update = () => { const hero = document.getElementById("home"); setDark(!hero || hero.classList.contains("hero-night") || scrollY > hero.offsetHeight * .52); };
    window.addEventListener("scroll", update, { passive: true }); update();
    return () => window.removeEventListener("scroll", update);
  }, [pathname]);
  const cookies = <button type="button" aria-label={t.consent.settings} onClick={() => window.dispatchEvent(new Event("portfolio-open-cookie-settings"))} className="brand-outline grid h-10 w-10 place-items-center rounded-md"><Cookie size={17}/></button>;
  const anchorHref = (hash: string) => (pathname === "/" ? hash : `/${hash}`);

  const languageButton = (value: "pl" | "en", label: string) => (
    <button
      onClick={() => switchLanguage(value)}
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
          <span data-bernecki-nav-logo className="brand-mark grid h-10 w-10 place-items-center rounded-md border text-sm">
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
              {lang==="pl"?item.pl:item.en}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 xl:flex">{cookies}
          <div className="nav-language flex rounded-md border border-white/10 bg-[var(--brand-black)] p-1">
            {languageButton("pl", "PL")}
            {languageButton("en", "ENG")}
          </div>
          <a
            href="/kontakt"
            className="brand-action glass-action inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm transition-all hover:-translate-y-0.5"
          >
            <Mail className="h-4 w-4" />
            {t.nav.cta}
          </a>
          <a
            href="/kontakt"
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
            ref={menuButton}
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
          className="max-h-[calc(100dvh-5rem)] overflow-y-auto overscroll-contain border-t border-white/10 bg-[var(--brand-black)] px-5 py-5 xl:hidden"
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
                {lang==="pl"?item.pl:item.en}
              </a>
            ))}
            <div className="mt-3 flex items-center justify-between gap-3">
              <a
                href="/kontakt"
                onClick={() => setIsOpen(false)}
                className="brand-action glass-action inline-flex items-center gap-2 rounded-md  px-4 py-2 text-sm text-black"
              >
                <Mail className="h-4 w-4" />
                {t.nav.cta}
              </a>
              <a
                href="/kontakt"
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
