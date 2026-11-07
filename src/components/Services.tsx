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
      text: pl ? "Od pomysłu na markę do strony, komunikacji i pierwszych kampanii." : "From brand direction to your website, messaging and first campaigns.",
      tags: "Re-energy · Motomizer",
    },
    {
      icon: Globe,
      href: "/tworzenie-stron-internetowych",
      title: pl ? "Strony internetowe" : "Business websites",
      text: pl
        ? "Czytelna oferta, dopracowany wygląd i prosta droga do kontaktu."
        : "A clear offer, thoughtful design and an easy way to get in touch.",
      tags: "Motomizer · StarCars",
    },
    {
      icon: Workflow,
      href: "/crm-i-aplikacje-webowe",
      title: pl ? "CRM i aplikacje webowe" : "CRM & web apps",
      text: pl
        ? "Leady, zespół i procesy w narzędziu dopasowanym do Twojej firmy."
        : "Leads, teams and workflows in a tool built around your business.",
      tags: "B-CRM · BeatMarket",
    },
    {
      icon: MousePointer2,
      href: "/marketing-i-reklamy",
      title: pl ? "Marketing i social media" : "Marketing & social media",
      text: pl
        ? "Treści, kampanie reklamowe i pomiar zapytań od klientów."
        : "Content, ad campaigns and measurement of customer enquiries.",
      tags: pl
        ? "Jalapeno Kebab · StarCars"
        : "Jalapeno Kebab · StarCars",
    },
  ];
  return (
    <section id="services" className="services-editorial px-5 py-16 md:px-8 md:py-20">
      <div className="mx-auto max-w-7xl">
        <p className="brand-eyebrow text-xs uppercase tracking-[0.24em] text-white">
          {pl ? "W czym mogę pomóc" : "How I can help"}
        </p>
        <h2 className="mt-4 max-w-2xl text-4xl leading-tight tracking-tight md:text-5xl">
          {pl
            ? "Od pomysłu do działania."
            : "From idea to launch."}
        </h2>
        <div className="service-list mt-10 grid gap-x-12 md:grid-cols-2">
          {services.map(({ icon: Icon, ...s }, i) => (
            <Link
              key={s.href}
              href={s.href}
              className="service-item group flex flex-col border-t border-white/15 py-7 transition hover:border-[var(--brand-accent)]"
            >
              <div className="flex items-center justify-between">
                <Icon className="h-7 w-7 text-[var(--brand-accent)]" />
                <span className="text-xs text-white/70">0{i + 1}</span>
              </div>
              <h3 className="mt-5 text-2xl tracking-tight">{s.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-6 text-white/70">
                {s.text}
              </p>
              <span className="mt-5 flex items-center justify-between gap-4 text-xs text-white/60">
                <span>{s.tags}</span>
                <span className="sr-only">{pl ? "Zobacz zakres współpracy" : "Explore the service"}</span>
                <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-1 group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
