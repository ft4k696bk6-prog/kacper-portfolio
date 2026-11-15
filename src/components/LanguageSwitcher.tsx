"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { CalendarDays, ChevronDown, Cookie, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { englishToolboxItems, englishToolPath, localizedToolboxPath } from "@/lib/toolbox-en";

const navItems = [
  { href: "#services", pl: "Oferta", en: "Services" },
  { href: "#cennik", pl: "Cennik", en: "Pricing" },
  { href: "#projects", pl: "Realizacje", en: "Projects" },
  { href: "#guides", pl: "Poradniki", en: "Guides" },
  { href: "/narzedzia", pl: "Darmowe narzędzia", en: "Free tools" },
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
    "/marketing-i-reklamy": "/en/services/marketing",
    "/cennik": "/en/pricing",
    "/pakiety": "/en/packages",
    "/pozyskiwanie-klientow": "/en/customer-acquisition",
    "/reklamy-online": "/en/advertising",
    "/kontakt": "/en/contact",
    "/automatyzacja-leadow-i-sprzedazy": "/en/services/automation",
    "/wdrozenia-ai-dla-firm": "/en/services/automation",
    "/crm-dla-firm-handlowych": "/en/services/crm",
    "/google-ads-dla-firm": "/en/advertising"
  };
  // Guides have separate, indexable EN URLs; a localStorage toggle alone would leave Polish text visible.
  const guideLanguagePath = (target: "pl" | "en") => {
    if(pathname==="/narzedzia"||pathname==="/en/tools")return localizedToolboxPath(target);
    if(pathname.startsWith("/narzedzia/")){
      const slug=pathname.slice("/narzedzia/".length);
      return target==="en"?englishToolPath(slug):pathname;
    }
    if(pathname.startsWith("/en/tools/")){
      const englishSlug=pathname.slice("/en/tools/".length);
      const tool=englishToolboxItems.find(t=>t.englishSlug===englishSlug);
      return target==="pl"&&tool?"/narzedzia/"+tool.slug:pathname;
    }
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
    const path = guideLanguagePath(next);
    // Do not show Polish content with an English-language toggle on a route without translation.
    if (path && path !== pathname) { setLang(next); router.push(path); return; }
    if (pathname === "/") { setLang(next); return; }
    if (path === pathname) { setLang(next); return; }
    // Unsupported translation: go to a real, translated catalogue instead of creating a false-language URL.
    setLang(next);
    router.push(next === "en" ? "/en/guides" : "/poradniki");
  };
  useEffect(() => {
    if (pathname.startsWith("/en/") && lang !== "en") setLang("en");
    if ((pathname.startsWith("/narzedzia") || pathname.startsWith("/poradniki") || pathname.startsWith("/blog") || pathname.startsWith("/realizacje/") ||
      ["/case-studies","/case-studies/re-energy-meta-ads","/reklamy-meta-ads-dla-firm",
       "/tworzenie-stron-internetowych","/crm-i-aplikacje-webowe","/marketing-i-reklamy","/rozwoj-biznesu","/cennik","/pakiety","/reklamy-online","/pozyskiwanie-klientow","/kontakt","/automatyzacja-leadow-i-sprzedazy"].includes(pathname)) &&
       lang !== "pl") setLang("pl");
  }, [pathname, lang, setLang]);

  const [dark, setDark] = useState(true);
  useEffect(() => {
    const update = () => { const hero = document.getElementById("home"); setDark(!hero || hero.classList.contains("hero-night") || scrollY > hero.offsetHeight * .52); };
    window.addEventListener("scroll", update, { passive: true }); update();
    return () => window.removeEventListener("scroll", update);
  }, [pathname]);
  const cookies = <button type="button" aria-label={t.consent.settings} onClick={() => window.dispatchEvent(new Event("portfolio-open-cookie-settings"))} className="brand-outline grid h-10 w-10 place-items-center rounded-md"><Cookie size={17}/></button>;
  const anchorHref = (hash: string) => hash==="/narzedzia" ? localizedToolboxPath(lang) : hash.startsWith("/") ? hash : (pathname === "/" ? hash : `/${hash}`);

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
      initial={pathname === "/" ? false : { opacity: 0, y: -18 }}
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
          {navItems.map((item) => item.href === "#cennik" ? (
            <details key={item.href} className="group relative">
              <summary className="ui-nav flex cursor-pointer list-none items-center gap-1 rounded-md px-4 py-2 text-sm">
                {lang==="pl" ? "Cennik" : "Pricing"} <ChevronDown size={14} aria-hidden="true"/>
              </summary>
              <div className="absolute left-0 top-full z-50 mt-2 w-64 rounded-xl border border-white/20 bg-[#111] p-2 shadow-xl">
                <a href={lang==="en"?"/en/packages":"/pakiety"} className="block rounded-lg px-4 py-3 text-sm text-white hover:bg-white/10">{lang==="pl" ? "Pakiety dla firm" : "Service packages"}</a>
                <a href={lang==="en"?"/en/pricing":"/cennik"} className="block rounded-lg px-4 py-3 text-sm text-white hover:bg-white/10">{lang==="pl" ? "Cennik pojedynczych usług" : "Individual service prices"}</a>
              </div>
            </details>
          ) : (
            <a key={item.href} href={anchorHref(item.href)} className="ui-nav rounded-md px-4 py-2 text-sm">
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
            href={lang==="en"?"/en/contact":"/kontakt"}
            className="brand-action glass-action inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm transition-all hover:-translate-y-0.5"
          >
            <Mail className="h-4 w-4" />
            {t.nav.cta}
          </a>
          <a
            href={lang==="en"?"/en/contact":"/kontakt"}
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
            {navItems.map((item) => item.href === "#cennik" ? (
              <details key={item.href} className="rounded-lg border border-white/15">
                <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-3 text-base text-white">
                  {lang==="pl" ? "Cennik" : "Pricing"} <ChevronDown size={16} aria-hidden="true"/>
                </summary>
                <div className="flex flex-col gap-1 px-2 pb-2">
                  <a href={lang==="en"?"/en/packages":"/pakiety"} className="rounded-md px-4 py-3 text-sm text-white/90 hover:bg-white/10" onClick={() => setIsOpen(false)}>{lang==="pl" ? "Pakiety dla firm" : "Service packages"}</a>
                  <a href={lang==="en"?"/en/pricing":"/cennik"} className="rounded-md px-4 py-3 text-sm text-white/90 hover:bg-white/10" onClick={() => setIsOpen(false)}>{lang==="pl" ? "Ceny pojedynczych usług" : "Individual service prices"}</a>
                </div>
              </details>
            ) : (
              <a key={item.href} href={anchorHref(item.href)} className="glass-action rounded-md px-3 py-3 text-base text-white hover:bg-[var(--brand-black)]" onClick={() => setIsOpen(false)}>
                {lang==="pl"?item.pl:item.en}
              </a>
            ))}
            <div className="mt-3 flex items-center justify-between gap-3">
              <a
                href={lang==="en"?"/en/contact":"/kontakt"}
                onClick={() => setIsOpen(false)}
                className="brand-action glass-action inline-flex items-center gap-2 rounded-md  px-4 py-2 text-sm text-black"
              >
                <Mail className="h-4 w-4" />
                {t.nav.cta}
              </a>
              <a
                href={lang==="en"?"/en/contact":"/kontakt"}
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
