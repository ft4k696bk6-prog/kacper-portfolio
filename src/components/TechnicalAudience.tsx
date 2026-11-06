"use client";

import Link from "next/link";
import { Database, ExternalLink, Github, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

export function TechnicalAudience() {
  const { t } = useLanguage();

  return (
    <section className="px-5 py-24 md:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          className="grid gap-8 rounded-md border border-white/10 bg-white/[0.035] p-6 md:p-8 lg:grid-cols-[0.9fr_1.1fr]"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <div className="mb-5 grid h-12 w-12 place-items-center rounded-md bg-[#f4f4f5]/10 text-[#e4e4e7]">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <p className="text-sm uppercase tracking-[0.28em] text-[#f4f4f5]">
              {t.technicalAudience.title}
            </p>
            <h2 className="mt-4 text-4xl leading-tight text-white md:text-5xl">
              {t.technicalAudience.bestProject}
            </h2>
            <p className="mt-5 text-base leading-8 text-zinc-300">
              {t.technicalAudience.subtitle}
            </p>
            <div className="mt-6 rounded-md border border-[#f4f4f5]/25 bg-[#f4f4f5]/10 p-4">
              <div className="flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-[#e4e4e7]">
                <Database className="h-4 w-4" />
                {t.technicalAudience.stackLabel}
              </div>
              <p className="mt-3 text-sm leading-7 text-zinc-200">
                {t.technicalAudience.stack}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm uppercase tracking-[0.24em] text-[#f4f4f5]">
              {t.technicalAudience.showsLabel}
            </h3>
            <ul className="mt-5 grid gap-3">
              {t.technicalAudience.shows.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 rounded-md border border-white/10 bg-black/20 p-4 text-sm leading-7 text-zinc-300"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#f4f4f5]" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="https://demo-crm.bernecki.dev/login"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-[#f4f4f5] px-4 py-2 text-sm text-black transition-all hover:-translate-y-0.5"
              >
                <ExternalLink className="h-4 w-4" />
                {t.technicalAudience.links.demo}
              </a>
              <a
                href="https://github.com/ft4k696bk6-prog/B-CRM"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-white/15 px-4 py-2 text-sm text-white transition-colors hover:border-[#f4f4f5]/60 hover:text-[#e4e4e7]"
              >
                <Github className="h-4 w-4" />
                {t.technicalAudience.links.repo}
              </a>
              <Link
                href="/case-studies/b-crm"
                className="inline-flex items-center gap-2 rounded-md border border-white/15 px-4 py-2 text-sm text-white transition-colors hover:border-[#f4f4f5]/60 hover:text-[#e4e4e7]"
              >
                {t.technicalAudience.links.caseStudy}
              </Link>
              <Link
                href="#contact"
                className="inline-flex items-center gap-2 rounded-md border border-white/15 px-4 py-2 text-sm text-white transition-colors hover:border-[#f4f4f5]/60 hover:text-[#e4e4e7]"
              >
                {t.technicalAudience.links.contact}
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
