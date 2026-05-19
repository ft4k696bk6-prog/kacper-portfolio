"use client";

import Link from "next/link";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { CaseStudyItem } from "@/i18n/case-studies";

type CaseStudyPageProps = {
  slug: string;
};

export function CaseStudyPage({ slug }: CaseStudyPageProps) {
  const { t } = useLanguage();
  const study = useMemo(
    () => t.caseStudies.items.find((item) => item.slug === slug),
    [slug, t.caseStudies.items],
  );

  useEffect(() => {
    if (!study) return;

    document.title = `${study.title} | Kacper Bernecki`;
    const description =
      document.querySelector<HTMLMetaElement>('meta[name="description"]') ||
      document.head.appendChild(document.createElement("meta"));
    description.name = "description";
    description.content = study.summary;
  }, [study]);

  if (!study) {
    return (
      <main className="min-h-screen bg-[#070707] px-5 py-32 text-white md:px-8">
        <div className="mx-auto max-w-4xl">
          <BackLink label={t.caseStudies.backLabel} />
          <h1 className="mt-10 text-4xl md:text-5xl">{t.caseStudies.notFoundTitle}</h1>
          <p className="mt-4 text-zinc-300">{t.caseStudies.notFoundDescription}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#070707] px-5 py-28 text-white md:px-8">
      <div className="mx-auto max-w-6xl">
        <BackLink label={t.caseStudies.backLabel} />

        <section className="py-12">
          <p className="text-sm uppercase tracking-[0.28em] text-[#d7b46a]">
            {t.caseStudies.eyebrow}
          </p>
          <h1 className="mt-5 max-w-5xl text-4xl leading-tight text-white md:text-6xl">
            {study.title}
          </h1>
          <p className="mt-6 max-w-4xl text-lg leading-8 text-zinc-300">
            {study.subtitle}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={study.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-[#d7b46a] px-5 py-3 text-sm text-black transition-all hover:-translate-y-0.5"
            >
              <ExternalLink className="h-4 w-4" />
              {t.caseStudies.liveDemoLabel}
            </a>
            <a
              href={study.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-white/15 px-5 py-3 text-sm text-white transition-colors hover:border-[#d7b46a]/60 hover:text-[#f5dfae]"
            >
              <Github className="h-4 w-4" />
              {t.caseStudies.repoLabel}
            </a>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <SummaryCard title={t.caseStudies.sections.problem} body={study.problem} />
          <SummaryCard title={t.caseStudies.sections.goal} body={study.goal} />
          <SummaryCard title={t.projects.statusLabel} body={study.status} />
        </section>

        <section className="mt-8 rounded-md border border-white/10 bg-white/[0.035] p-5 md:p-6">
          <h2 className="text-sm uppercase tracking-[0.24em] text-[#d7b46a]">
            {t.caseStudies.stackLabel}
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {study.stack.map((tech) => (
              <span
                key={tech}
                className="rounded-md border border-white/10 bg-black/30 px-3 py-1.5 text-xs text-zinc-300"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>

        {study.roles.length > 0 && (
          <section className="mt-8 rounded-md border border-white/10 bg-white/[0.035] p-5 md:p-6">
            <h2 className="text-3xl text-white">{t.caseStudies.sections.roles}</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {study.roles.map((role) => (
                <article key={role.name} className="rounded-md border border-white/10 bg-black/20 p-4">
                  <h3 className="text-lg text-[#f5dfae]">{role.name}</h3>
                  <p className="mt-3 text-sm leading-7 text-zinc-300">{role.description}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <InfoList title={t.caseStudies.sections.features} items={study.features} />
          <InfoList title={t.caseStudies.sections.decisions} items={study.decisions} />
          <InfoList title={t.caseStudies.sections.learned} items={study.learned} />
          <InfoList title={t.caseStudies.sections.next} items={study.next} />
        </section>

        <section className="mt-8 rounded-md border border-[#d7b46a]/25 bg-[#d7b46a]/10 p-5 md:p-6">
          <h2 className="text-2xl text-white">{t.caseStudies.sections.limitations}</h2>
          <p className="mt-4 text-sm leading-7 text-zinc-200">{study.limitations}</p>
        </section>
      </div>
    </main>
  );
}

function BackLink({ label }: { label: string }) {
  return (
    <Link
      href="/#projects"
      className="inline-flex items-center gap-2 rounded-md border border-white/10 px-4 py-2 text-sm text-zinc-300 transition-colors hover:border-[#d7b46a]/60 hover:text-[#f5dfae]"
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </Link>
  );
}

function SummaryCard({ title, body }: { title: string; body: string }) {
  return (
    <article className="rounded-md border border-white/10 bg-white/[0.035] p-5">
      <h2 className="text-xl text-white">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-zinc-300">{body}</p>
    </article>
  );
}

function InfoList({ title, items }: Pick<CaseStudyItem, "title"> & { items: string[] }) {
  return (
    <article className="rounded-md border border-white/10 bg-white/[0.035] p-5 md:p-6">
      <h2 className="text-2xl text-white">{title}</h2>
      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-7 text-zinc-300">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d7b46a]" />
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}
