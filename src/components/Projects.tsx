"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ExternalLink, Github } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function Projects() {
  const { lang, t } = useLanguage();
  return (
    <section
      id="projects"
      className="border-y border-white/10 bg-[#0c0c0b] px-5 py-20 md:px-8 md:py-24"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[#d7b46a]">
              {t.projects.title}
            </p>
            <h2 className="mt-4 text-4xl tracking-tight md:text-5xl">
              {t.projects.subtitle}
            </h2>
          </div>
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-2 text-sm text-[#f5dfae]"
          >
            {lang === "pl" ? "Wszystkie case studies" : "All case studies"}
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {t.projects.items.slice(0, 4).map((project, index) => (
            <article
              key={project.title}
              className="overflow-hidden rounded-2xl border border-white/10 bg-[#11110f] transition hover:border-[#d7b46a]/40"
              data-case-study-card={project.caseStudyUrl}
            >
              <Link
                href={project.caseStudyUrl}
                aria-label={`${t.projects.caseStudyLabel}: ${project.title}`}
                className="group block overflow-hidden border-b border-white/10 bg-black/20"
              >
                <Image
                  src={project.image.src}
                  alt={project.image.alt}
                  width={1440}
                  height={900}
                  sizes="(min-width: 1024px) 45vw, 95vw"
                  className="aspect-[16/10] h-auto w-full object-cover object-top transition duration-500 group-hover:scale-[1.02]"
                />
              </Link>
              <div className="p-6 md:p-8">
                <p className="text-xs uppercase tracking-[0.16em] text-[#d7b46a]">
                  0{index + 1} / {project.title}
                </p>
                <h3 className="mt-3 text-2xl tracking-tight">
                  {project.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-zinc-400">
                  {project.description}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {project.technologies.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="rounded-md bg-white/[0.04] px-2.5 py-1 text-xs text-zinc-400"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <details className="mt-5 border-y border-white/10 py-4">
                  <summary className="text-sm text-zinc-300">
                    {lang === "pl"
                      ? "Funkcje i szczegóły projektu"
                      : "Features and project details"}
                  </summary>
                  <p className="mt-4 text-sm leading-7 text-zinc-400">
                    {project.problem}
                  </p>
                  <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-7 text-zinc-400">
                    {project.features.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                  <p className="mt-3 text-xs text-zinc-500">{project.status}</p>
                  {project.credentials && (
                    <div className="mt-3 space-y-1 text-xs text-zinc-400">
                      {project.credentials.map((c) => (
                        <p key={c}>{c}</p>
                      ))}
                    </div>
                  )}
                </details>
                <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
                  <Link
                    href={project.caseStudyUrl}
                    className="inline-flex items-center gap-2 text-sm text-[#f5dfae]"
                  >
                    {lang === "pl"
                      ? "Zobacz realizację"
                      : "Explore the project"}
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-zinc-300"
                    >
                      Live
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-zinc-400"
                    >
                      <Github className="h-4 w-4" />
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
        <details className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <summary className="text-lg text-zinc-200">
            {lang === "pl"
              ? "Więcej projektów i eksperymentów"
              : "More projects and experiments"}{" "}
            <span className="ml-2 text-sm text-zinc-500">
              ({t.projects.items.length - 4})
            </span>
          </summary>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {t.projects.items.slice(4).map((p) => (
              <Link
                href={p.caseStudyUrl}
                key={p.title}
                className="overflow-hidden rounded-xl border border-white/10 transition hover:border-[#d7b46a]/40"
              >
                <Image
                  src={p.image.src}
                  alt={p.image.alt}
                  width={800}
                  height={450}
                  sizes="(min-width: 1024px) 28vw, 90vw"
                  className="aspect-video h-auto w-full object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg text-[#f5dfae]">{p.title}</h3>
                  <p className="mt-2 text-xs leading-6 text-zinc-400">
                    {p.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </details>
      </div>
    </section>
  );
}
