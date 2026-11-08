"use client";

import Image from "next/image";
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
      <main className="site-page min-h-screen bg-[var(--brand-black)] px-5 py-32 text-white md:px-8">
        <div className="mx-auto max-w-4xl">
          <BackLink label={t.caseStudies.projectsBackLabel} />
          <h1 className="mt-10 text-4xl md:text-5xl">{t.caseStudies.notFoundTitle}</h1>
          <p className="mt-4 text-white">{t.caseStudies.notFoundDescription}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="site-page min-h-screen bg-[var(--brand-black)] px-5 py-28 text-white md:px-8">
      <div className="mx-auto max-w-6xl">
        <BackLink label={t.caseStudies.projectsBackLabel} />

        <section className="py-12">
          <p className="brand-eyebrow text-sm uppercase tracking-[0.28em] text-white">
            {t.caseStudies.eyebrow}
          </p>
          <h1 className="mt-5 max-w-5xl text-4xl leading-tight text-white md:text-6xl">
            {study.title}
          </h1>
          <p className="page-intro mt-6 max-w-4xl text-lg">
            {study.subtitle}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {study.liveUrl && (
              <a
                href={study.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="brand-action glass-action inline-flex items-center gap-2 rounded-md  px-5 py-3 text-sm text-black transition-all hover:-translate-y-0.5"
              >
                <ExternalLink className="h-4 w-4" />
                {study.liveLabel || t.caseStudies.liveDemoLabel}
              </a>
            )}
            {study.repoUrl && (
              <a
                href={study.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-action inline-flex items-center gap-2 rounded-md border border-white/15 px-5 py-3 text-sm text-white transition-colors hover:border-[var(--brand-accent)] hover:text-white"
              >
                <Github className="h-4 w-4" />
                {t.caseStudies.repoLabel}
              </a>
            )}
          </div>
        </section>

        {study.images && study.images.length > 0 && (
          <section
            className={[
              "mb-8 grid gap-4",
              study.images.length > 1 ? "lg:grid-cols-2" : "",
            ].join(" ")}
          >
            {study.images.map((image, index) => (
              <div
                key={image.src}
                className="surface-card overflow-hidden rounded-xl border border-white/10 bg-[var(--brand-black)] first:lg:col-span-2"
              >
                <Image
                  src={image.src}
                  unoptimized={image.src.startsWith("https://")}
                  alt={image.alt}
                  width={1600}
                  height={900}
                  sizes={
                    index > 0 && study.images && study.images.length > 1
                      ? "(min-width: 1024px) 44vw, 100vw"
                      : "(min-width: 1024px) 72vw, 100vw"
                  }
                  className="h-auto w-full"
                />
              </div>
            ))}
          </section>
        )}

        <section className="grid gap-4 md:grid-cols-3">
          <SummaryCard title={t.caseStudies.sections.problem} body={study.problem} />
          <SummaryCard title={t.caseStudies.sections.goal} body={study.goal} />
          <SummaryCard title={t.projects.statusLabel} body={study.status} />
        </section>

        <section className="surface-card mt-8 rounded-md border border-white/10 bg-[var(--brand-black)] p-5 md:p-6">
          <h2 className="text-sm uppercase tracking-[0.24em] text-white">
            {t.caseStudies.stackLabel}
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {study.stack.map((tech) => (
              <span
                key={tech}
                className="rounded-md border border-white/10 bg-black/30 px-3 py-1.5 text-xs text-white"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>

        {study.roles.length > 0 && (
          <section className="surface-card mt-8 rounded-md border border-white/10 bg-[var(--brand-black)] p-5 md:p-6">
            <h2 className="text-3xl text-white">{t.caseStudies.sections.roles}</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {study.roles.map((role) => (
                <article key={role.name} className="surface-card rounded-md border border-white/10 bg-black/20 p-4">
                  <h3 className="text-lg text-white">{role.name}</h3>
                  <p className="mt-3 text-sm leading-7 text-white">{role.description}</p>
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

        <section className="surface-card mt-8 rounded-md border border-white/25 bg-[var(--brand-black)] p-5 md:p-6">
          <h2 className="text-2xl text-white">{t.caseStudies.sections.limitations}</h2>
          <p className="mt-4 text-sm leading-7 text-white">{study.limitations}</p>
        </section>

        <div className="mt-8">
          <BackLink label={t.caseStudies.projectsBackLabel} />
        </div>
      </div>
    </main>
  );
}

function BackLink({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        window.location.assign("/#projects");
      }}
      className="brand-outline inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm transition-all hover:-translate-y-0.5"
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </button>
  );
}

function SummaryCard({ title, body }: { title: string; body: string }) {
  return (
    <article className="surface-card rounded-md border border-white/10 bg-[var(--brand-black)] p-5">
      <h2 className="text-xl text-white">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-white">{body}</p>
    </article>
  );
}

function InfoList({ title, items }: Pick<CaseStudyItem, "title"> & { items: string[] }) {
  return (
    <article className="surface-card rounded-md border border-white/10 bg-[var(--brand-black)] p-5 md:p-6">
      <h2 className="text-2xl text-white">{title}</h2>
      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-7 text-white">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand-accent)]" />
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}
