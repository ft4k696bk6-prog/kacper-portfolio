"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function Hero() {
  const { lang, t } = useLanguage();
  const pl = lang === "pl";
  return (
    <section
      id="home"
      className="relative isolate overflow-hidden px-5 pb-10 pt-32 md:px-8 lg:pt-40"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_80%_40%,rgba(215,180,106,0.12),transparent_50%)]" />
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="pb-6 lg:pb-14">
          <p className="mb-7 text-xs font-medium uppercase tracking-[0.2em] text-[#d7b46a]">
            Kacper Bernecki /{" "}
            {pl
              ? "Twój partner od stron i aplikacji"
              : "Your website & app developer"}
          </p>
          <h1 className="max-w-3xl text-[clamp(2.6rem,5.6vw,5.25rem)] font-medium leading-[1.04] tracking-[-0.055em]">
            {pl
              ? "Strony, które robią wrażenie."
              : "Websites that make an impression."}
            <span className="mt-3 block text-[#d7b46a]">
              {pl
                ? "Aplikacje, które ułatwiają pracę."
                : "Apps that make work easier."}
            </span>
          </h1>
          <p className="mt-7 max-w-xl text-base leading-8 text-zinc-300 sm:text-lg">
            {pl
              ? "Tworzę strony internetowe, CRM-y i aplikacje webowe dla firm. Od pierwszego pomysłu do działającego rozwiązania — z bezpośrednim kontaktem i wyceną dopasowaną do zakresu."
              : "I build websites, CRMs and web apps for businesses. From the first idea to a working solution, with direct communication and a quote based on what you actually need."}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="#contact"
              className="inline-flex items-center justify-center gap-3 rounded-xl bg-[#d7b46a] px-6 py-4 font-medium text-black transition hover:bg-[#efd49a]"
            >
              {pl
                ? "Porozmawiajmy o Twoim projekcie"
                : "Tell me about your project"}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              href="#projects"
              className="inline-flex items-center justify-center gap-3 rounded-xl border border-white/15 px-6 py-4 text-zinc-200 transition hover:border-[#d7b46a]/60"
            >
              {t.hero.projectsBtn}
              <ArrowDown className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs text-zinc-400">
            {(pl
              ? [
                  "Kontakt bezpośrednio ze mną",
                  "Współpraca zdalna",
                  "Jasny zakres i wycena",
                ]
              : [
                  "Work directly with me",
                  "Remote collaboration",
                  "Clear scope and pricing",
                ]
            ).map((item) => (
              <span key={item} className="inline-flex items-center gap-2">
                <Check className="h-3 w-3 text-[#d7b46a]" />
                {item}
              </span>
            ))}
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-[430px] self-end">
          <div className="absolute inset-x-4 bottom-0 top-16 rounded-t-full border border-[#d7b46a]/15 bg-gradient-to-b from-[#d7b46a]/[0.06] to-transparent" />
          <Image
            src="/images/profile-3-cutout.png"
            alt={t.hero.imageAlt}
            width={1024}
            height={1280}
            priority
            sizes="(min-width: 1024px) 34vw, 80vw"
            className="relative mx-auto h-auto max-h-[560px] w-auto max-w-full object-contain"
          />
          <div className="relative mx-4 border-t border-[#d7b46a]/30 bg-[#0e0e0c] px-5 py-4">
            <p className="text-sm text-white">Kacper Bernecki</p>
            <p className="mt-1 text-xs text-zinc-400">
              {pl
                ? "Projektuję. Programuję. Dopracowuję."
                : "Design. Development. Attention to detail."}
            </p>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-10 flex max-w-7xl flex-wrap items-center justify-between gap-5 border-y border-white/10 py-5 text-sm text-zinc-500">
        <span className="text-xs uppercase tracking-[0.18em]">
          {pl ? "Wybrane projekty" : "Selected projects"}
        </span>
        {[
          ["Motomizer", "motomizer"],
          ["StarCars", "starcars"],
          ["BeatMarket", "beatmarket"],
          ["B-CRM", "b-crm"],
        ].map(([name, slug]) => (
          <Link
            key={slug}
            href={`/case-studies/${slug}`}
            className="font-medium text-zinc-300 transition hover:text-[#f5dfae]"
          >
            {name}
          </Link>
        ))}
      </div>
    </section>
  );
}
