"use client";

import { BriefcaseBusiness, Database, FileText, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const icons = [BriefcaseBusiness, FileText, ShieldCheck, Database];

export function Profile() {
  const { t } = useLanguage();

  return (
    <section id="about" className="relative border-y border-white/10 bg-[#0b0b0b] px-5 py-20 md:px-8">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <p className="brand-eyebrow text-sm uppercase tracking-[0.28em] text-zinc-300">{t.about.title}</p>
          <h2 className="mt-4 max-w-3xl text-4xl leading-tight text-white md:text-5xl">{t.about.heading}</h2>
        </div>
        <div>
          <div className="space-y-4 text-base leading-8 text-zinc-300">
            {t.about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          {/* Essential content stays visible in SSR and with reduced motion.
              Inherited hidden variants previously left an empty-looking panel. */}
          <div className="mt-9 grid gap-x-6 gap-y-7 sm:grid-cols-2">
            {t.about.highlights.map((item, index) => {
              const Icon = icons[index] ?? BriefcaseBusiness;
              return (
                <div key={item.title} className="profile-highlight border-t border-white/15 pt-5">
                  <Icon className="mb-4 h-5 w-5 text-zinc-300" aria-hidden="true"/>
                  <h3 className="text-base text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
