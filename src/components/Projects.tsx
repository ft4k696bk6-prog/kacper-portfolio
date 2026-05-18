"use client";

import { BookOpen, ExternalLink, Github, KeyRound, ListChecks } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

export function Projects() {
  const { t } = useLanguage();

  return (
    <section
      id="projects"
      className="relative overflow-hidden border-y border-white/10 bg-[#0c0c0b] px-5 py-24 md:px-8"
    >
      <div className="absolute right-0 top-0 h-96 w-96 bg-[#d7b46a]/10 blur-3xl" />
      <div className="relative mx-auto max-w-7xl">
        <motion.div
          className="max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm uppercase tracking-[0.28em] text-[#d7b46a]">
            {t.projects.title}
          </p>
          <h2 className="mt-4 text-4xl leading-tight text-white md:text-5xl">
            {t.projects.subtitle}
          </h2>
        </motion.div>

        <motion.div
          className="mt-12 grid gap-5 xl:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
        >
          {t.projects.items.map((project, index) => (
            <motion.article
              key={project.title}
              variants={{
                hidden: { opacity: 0, y: 32 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.48, ease: "easeOut" },
                },
              }}
              className={`rounded-md border border-white/10 bg-[#11110f]/90 p-6 transition-all hover:-translate-y-1 hover:border-[#d7b46a]/50 ${
                index === 0 ? "xl:col-span-2 xl:grid xl:grid-cols-[1fr_0.9fr] xl:gap-8" : ""
              }`}
            >
              <div>
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <span className="inline-flex rounded-md border border-[#d7b46a]/25 bg-[#d7b46a]/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-[#f5dfae]">
                      0{index + 1}
                    </span>
                    <h3 className="mt-4 text-2xl leading-tight text-white">
                      {project.title}
                    </h3>
                  </div>
                </div>

                <div className="rounded-md border border-white/10 bg-black/25 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#d7b46a]">
                    {t.projects.problemLabel}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-zinc-300">{project.problem}</p>
                </div>

                <p className="mt-5 text-sm leading-7 text-zinc-300">{project.description}</p>

                {"note" in project && typeof project.note === "string" && project.note && (
                  <div className="mt-5 rounded-md border border-[#d7b46a]/20 bg-[#d7b46a]/10 p-4 text-sm leading-6 text-[#f5dfae]">
                    <span className="text-white">{t.projects.noteLabel}: </span>
                    {project.note}
                  </div>
                )}
              </div>

              <div>
                {project.features && (
                  <div className="mt-6 xl:mt-0">
                    <h4 className="flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-[#d7b46a]">
                      <ListChecks className="h-4 w-4" />
                      {t.projects.featuresLabel}
                    </h4>
                    <ul className="mt-3 space-y-2">
                      {project.features.map((feature) => (
                        <li key={feature} className="flex gap-2 text-sm leading-6 text-zinc-300">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d7b46a]" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {project.credentials && (
                  <div className="mt-6">
                    <h4 className="flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-[#d7b46a]">
                      <KeyRound className="h-4 w-4" />
                      {t.projects.credentialsLabel}
                    </h4>
                    <div className="mt-3 space-y-2">
                      {project.credentials.map((credential) => (
                        <p
                          key={credential}
                          className="rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-zinc-300"
                        >
                          {credential}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-6">
                  <h4 className="text-sm uppercase tracking-[0.2em] text-[#d7b46a]">
                    {t.projects.techLabel}
                  </h4>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md border border-white/10 bg-white/[0.035] px-3 py-1.5 text-xs text-zinc-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {project.status && (
                  <p className="mt-5 text-sm text-zinc-400">
                    <span className="text-[#f5dfae]">{t.projects.statusLabel}: </span>
                    {project.status}
                  </p>
                )}

                <div className="mt-7 flex flex-wrap gap-3">
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-md bg-[#d7b46a] px-4 py-2 text-sm text-black transition-all hover:-translate-y-0.5"
                    >
                      <ExternalLink className="h-4 w-4" />
                      {t.projects.demoLabel}
                    </a>
                  )}
                  {project.caseStudyUrl && (
                    <a
                      href={project.caseStudyUrl}
                      className="inline-flex items-center gap-2 rounded-md border border-[#d7b46a]/50 bg-[#d7b46a]/10 px-4 py-2 text-sm text-[#f5dfae] transition-colors hover:border-[#d7b46a]"
                    >
                      <BookOpen className="h-4 w-4" />
                      {t.projects.caseStudyLabel}
                    </a>
                  )}
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-md border border-white/15 px-4 py-2 text-sm text-white transition-colors hover:border-[#d7b46a]/60 hover:text-[#f5dfae]"
                    >
                      <Github className="h-4 w-4" />
                      {t.projects.repoLabel}
                    </a>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
