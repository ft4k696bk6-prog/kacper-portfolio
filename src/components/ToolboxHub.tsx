"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronDown, Gamepad2, Search, Sparkles } from "lucide-react";
import { visibleToolboxItems, visibleEnglishToolboxItems } from "@/lib/toolbox-visibility";
import { englishToolPath } from "@/lib/toolbox-en";

type Language = "pl" | "en";
type ToolCard = { id: string; title: string; description: string; category: string; href: string };
const dailyTools = [
  { id: "text", pl: "Porządkowanie tekstu", en: "Text cleaner", plDesc: "Usuwanie duplikatów, ukrytych znaków AI i formatowania.", enDesc: "Remove duplicate lines, invisible characters and unwanted formatting." },
  { id: "percentage", pl: "Kalkulator procentów", en: "Percentage calculator", plDesc: "Rabaty, podwyżki i różnice procentowe.", enDesc: "Discounts, increases and percentage differences." },
  { id: "password", pl: "Generator haseł", en: "Password generator", plDesc: "Bezpieczne losowe hasła tworzone na Twoim urządzeniu.", enDesc: "Secure random passwords generated on your device." },
  { id: "image", pl: "Konwerter zdjęć", en: "Image converter", plDesc: "Zmiana formatu i kompresja JPG, PNG i WebP.", enDesc: "Convert and compress JPG, PNG and WebP files." },
  { id: "random", pl: "Losowanie", en: "Random picker", plDesc: "Wylosuj jedną z podanych opcji lub zwycięzcę.", enDesc: "Randomly pick a winner or an option." },
  { id: "signature", pl: "Generator stopki e-mail", en: "Email signature generator", plDesc: "Utwórz i skopiuj stopkę z podglądem HTML.", enDesc: "Create and copy an HTML email signature." },
] as const;

const priority = ["ai-image", "vat", "text", "image", "percentage", "password"];
const cardClass = "group flex min-w-0 min-h-[142px] flex-col justify-between gap-4 rounded-2xl border border-white/15 bg-[#111] p-5 transition-colors hover:border-white/50 hover:bg-[#1b1b1b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

export function ToolboxHub({ lang }: { lang: Language }) {
  const en = lang === "en";
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("featured");
  const tools = en ? visibleEnglishToolboxItems : visibleToolboxItems;
  const everydayCategory = en ? "Everyday" : "Codzienne";
  const calculatorCategory = en ? "Calculators" : "Kalkulatory";
  const aiCategory = en ? "AI & images" : "AI i zdjęcia";
  const cards: ToolCard[] = useMemo(() => [
    {
      id: "ai-image", title: en ? "Was this image made by AI?" : "Sprawdź, czy zdjęcie jest AI",
      description: en ? "Check image metadata for AI origin clues. A result is not proof of authorship." : "Sprawdź metadane zdjęcia pod kątem śladów AI. Wynik nie jest dowodem pochodzenia.",
      category: aiCategory, href: en ? "/en/tools/ai-image-check" : "/narzedzia/sprawdz-czy-zdjecie-ai",
    },
    {
      id: "vat", title: en ? "Net / gross VAT calculator (8% and 23%)" : "Kalkulator brutto–netto (8% i 23%)",
      description: en ? "Convert net to gross and gross to net, with the VAT amount." : "Przelicz brutto na netto lub netto na brutto i sprawdź kwotę VAT.",
      category: calculatorCategory, href: en ? englishToolPath("kalkulator-vat") : "/narzedzia/kalkulator-vat",
    },
    ...dailyTools.map(t => ({
      id: t.id, title: en ? t.en : t.pl, description: en ? t.enDesc : t.plDesc,
      category: everydayCategory, href: (en ? "/en/tools/everyday" : "/narzedzia/codzienne") + "#" + t.id,
    })),
    ...tools.filter(t => t.slug !== "kalkulator-vat").map(t => ({
      id: t.slug, title: t.title, description: t.description, category: t.category,
      href: en ? englishToolPath(t.slug) : "/narzedzia/" + t.slug,
    })),
  ], [aiCategory, calculatorCategory, everydayCategory, en, tools]);

  const categories = useMemo(() => [...new Set(cards.map(c => c.category))], [cards]);
  const term = query.trim().toLocaleLowerCase(en ? "en" : "pl");
  const filtered = cards.filter(c => {
    const matches = !term || (c.title + " " + c.description + " " + c.category).toLocaleLowerCase(en ? "en" : "pl").includes(term);
    return matches && (term || category === "all" || category === "featured" && priority.includes(c.id) || category === c.category);
  });
  const featuredVisible = !term || (en ? "free comprehensive website audit seo ssl dns analytics" : "darmowy kompleksowy audyt strony www seo ssl dns analityka").includes(term);
  const auditHref = en ? englishToolPath("audyt-strony") : "/narzedzia/audyt-strony";
  const gamesHref = en ? "/en/games" : "/minigry";

  return <div className="mt-10">
    {featuredVisible && <Link href={auditHref} className="group block overflow-hidden rounded-[1.6rem] border border-white/30 bg-[radial-gradient(ellipse_at_90%_10%,#373737_0%,#191919_42%,#0e0e0e_90%)] p-6 transition-colors hover:border-white/65 sm:p-9">
      <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.16em] text-white/55"><Sparkles size={15}/>{en ? "START HERE • ALL-IN-ONE" : "ZACZNIJ TUTAJ • WSZYSTKO W JEDNYM"}</p>
      <h2 className="mt-5 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">{en ? "Comprehensive website audit" : "Kompleksowy audyt strony WWW"}</h2>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-white/65">{en ? "Enter your website address to check SEO, indexability, images, SSL, DNS and analytics. Get a clear report with recommended fixes." : "Wpisz adres witryny. Sprawdzisz SEO, indeksowanie, obrazy, SSL, DNS i analitykę, a następnie otrzymasz czytelny raport z zaleceniami."}</p>
      <span className="brand-action mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-center text-sm font-semibold sm:w-auto sm:px-7">{en ? "Analyze my website for free" : "Przeanalizuj stronę za darmo"}<ArrowUpRight size={18} className="shrink-0"/></span>
      <div className="mt-6 flex flex-wrap gap-2">{["SEO", "SSL / DNS", en ? "Indexing" : "Indeksowanie", en ? "Analytics" : "Analityka"].map(t => <span key={t} className="rounded-full border border-white/15 bg-white/[.04] px-3 py-1.5 text-xs text-white/60">{t}</span>)}</div>
    </Link>}

    <section className="mt-12" aria-label={en ? "Tool directory" : "Katalog narzędzi"}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[.2em] text-white/45">{en ? "TOOLS LIBRARY" : "KATALOG NARZĘDZI"}</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{en ? "Choose a tool" : "Wybierz narzędzie"}</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-white/55">{en ? "Find the right tool by name or category. Free and without sign-up." : "Znajdź narzędzie po nazwie lub kategorii. Bez opłat i rejestracji."}</p>
        </div>
        <Link href={gamesHref} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/20 px-4 py-2.5 text-sm text-white/75 transition hover:border-white/60 hover:text-white"><Gamepad2 size={18}/>{en ? "Mini-games" : "Minigry"}<ArrowUpRight size={14}/></Link>
      </div>

      <label className="relative mt-6 block">
        <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/50"/>
        <span className="sr-only">{en ? "Search tools" : "Szukaj narzędzi"}</span>
        <input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder={en ? "Search: AI photo, VAT, SEO, Meta Ads…" : "Szukaj: zdjęcie AI, VAT, SEO, Meta Ads…"} className="min-h-12 w-full rounded-xl border border-white/20 bg-[#101010] py-3 pl-12 pr-4 text-base text-white outline-none placeholder:text-white/40 focus:border-white/60"/>
      </label>

      <div className="mt-5 w-full max-w-sm">
        <label htmlFor={`tool-category-${lang}`} className="mb-2 block text-xs font-medium uppercase tracking-[.12em] text-white/50">
          {en ? "Category" : "Kategoria"}
        </label>
        <div className="relative">
          <select
            id={`tool-category-${lang}`}
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="min-h-12 w-full appearance-none rounded-xl border border-white/25 bg-[#161616] px-4 py-3 pr-12 text-base text-white outline-none transition-colors focus:border-white/70 focus:ring-2 focus:ring-white/15"
          >
            <option value="featured">{en ? "Recommended" : "Polecane"}</option>
            <option value="all">{en ? "All tools" : "Wszystkie"}</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <ChevronDown size={18} aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/65"/>
        </div>
      </div>

      <div aria-live="polite" className="mt-6">
        {filtered.length > 0 ? <>
          {category === "all" && !term && <p className="mb-4 text-xs text-white/50">{en ? "All categories" : "Wszystkie kategorie"} · {filtered.length}</p>}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map(t => <Link key={t.id} href={t.href} className={cardClass}>
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[.14em] text-white/45">{t.category}</p>
                <h3 className="mt-3 text-lg font-semibold leading-snug">{t.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/60">{t.description}</p>
              </div>
              <span className="inline-flex items-center gap-2 text-sm font-medium text-white/90">{en ? "Open tool" : "Otwórz narzędzie"}<ArrowUpRight size={16}/></span>
            </Link>)}
          </div>
        </> : <p className="rounded-xl border border-white/15 p-6 text-sm text-white/60">{en ? "No matching tools. Try a different search or category." : "Nie znaleziono narzędzi. Zmień frazę lub kategorię."}</p>}
      </div>
    </section>
  </div>;
}
