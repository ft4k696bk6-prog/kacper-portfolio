"use client";

import Link from "next/link";
import { ArrowUpRight, Globe, Workflow, MousePointer2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function Services() {
  const { lang } = useLanguage();
  const pl = lang === "pl";
  const services = [
    {
      icon: Globe,
      href: "/#contact",
      title: pl ? "Marka i rozwój od zera" : "Brand and business launch",
      text: pl ? "Pozycjonowanie oferty, kierunek identyfikacji marki i wejście firmy do internetu. Łączę stronę, komunikację, reklamy i narzędzia do obsługi klientów w jeden plan rozwoju." : "Brand direction, online presence, marketing and tools for customer operations in one development plan.",
      tags: "Re-energy · Motomizer",
    },
    {
      icon: Globe,
      href: "/tworzenie-stron-internetowych",
      title: pl ? "Strony internetowe" : "Business websites",
      text: pl
        ? "Strona firmy, usługi lub produktu. Przemyślany wygląd, wygoda na telefonie i prosta droga do kontaktu."
        : "Business, service and product websites. Thoughtful design, a great mobile experience and a clear path to contact.",
      tags: "Motomizer · StarCars",
    },
    {
      icon: Workflow,
      href: "/crm-i-aplikacje-webowe",
      title: pl ? "CRM i aplikacje webowe" : "CRM & web apps",
      text: pl
        ? "Leady, zespół i procesy w jednym miejscu. Narzędzia dopasowane do tego, jak naprawdę działa Twoja firma."
        : "Leads, teams and workflows in one place. Tools tailored to how your business actually operates.",
      tags: "B-CRM · BeatMarket",
    },
    {
      icon: MousePointer2,
      href: "/marketing-i-reklamy",
      title: pl ? "Marketing, reklamy i social media" : "Marketing, ads & social media",
      text: pl
        ? "Prowadzenie social mediów, reklamy i strony kampanii. Spójna oferta oraz pomiar zapytań od klientów."
        : "Social media management, advertising and campaign pages. A consistent offer and measurement of customer enquiries.",
      tags: pl
        ? "Jalapeno Kebab · StarCars"
        : "Jalapeno Kebab · StarCars",
    },
  ];
  return (
    <section id="services" className="px-5 py-20 md:px-8 md:py-24">
      <div className="mx-auto max-w-7xl">
        <p className="brand-eyebrow text-xs uppercase tracking-[0.24em] text-white">
          {pl ? "W czym mogę pomóc" : "How I can help"}
        </p>
        <h2 className="mt-4 max-w-2xl text-4xl leading-tight tracking-tight md:text-5xl">
          {pl
            ? "Masz cel. Zbudujmy do niego dobre narzędzie."
            : "You have a goal. Let’s build the right tool."}
        </h2>
        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          {services.map(({ icon: Icon, ...s }, i) => (
            <Link
              key={s.href}
              href={s.href}
              className="group flex flex-col rounded-2xl border border-white/10 bg-[var(--brand-black)] p-7 transition hover:border-[var(--brand-accent)] hover:bg-[var(--brand-black)]"
            >
              <div className="flex items-center justify-between">
                <Icon className="h-7 w-7 text-[var(--brand-accent)]" />
                <span className="text-xs text-white/70">0{i + 1}</span>
              </div>
              <h3 className="mt-9 text-2xl tracking-tight">{s.title}</h3>
              <p className="mt-4 flex-1 text-sm leading-7 text-white/70">
                {s.text}
              </p>
              <p className="mt-7 text-xs text-white/70">{s.tags}</p>
              <span className="mt-7 flex items-center justify-between border-t border-white/10 pt-5 text-sm text-white">
                {pl ? "Zobacz zakres współpracy" : "Explore the service"}
                <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-1 group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
