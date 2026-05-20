"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink, FileText, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

export function ChoosePortfolio() {
  const { t } = useLanguage();

  const staticHref = "/static";
  const interactiveHref = "https://kacper-bernecki.vercel.app";

  const choiceButtonClass =
    "group inline-flex h-11 items-center gap-2 rounded-md border border-[#d7b46a]/40 bg-[#0b0d0c]/92 px-4 text-sm text-[#f5dfae] shadow-[0_18px_45px_rgba(0,0,0,0.42)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-[#d7b46a]/75 hover:bg-[#17130b]";
  const mobileChoiceButtonClass =
    "pointer-events-auto inline-flex h-8 items-center gap-1.5 rounded-md border border-[#d7b46a]/45 bg-[#0b0d0c]/92 px-2 text-[11px] text-[#f5dfae] shadow-[0_16px_38px_rgba(0,0,0,0.42)] backdrop-blur-xl";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070707] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(215,180,106,0.18),transparent_32%),radial-gradient(circle_at_82%_28%,rgba(34,83,67,0.22),transparent_34%),linear-gradient(135deg,#020202_0%,#10100f_50%,#050505_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#070707] via-[#070707]/86 to-transparent" />

      <section className="relative mx-auto flex min-h-screen max-w-7xl flex-col items-center px-5 pb-8 pt-28 text-center sm:pt-24 md:px-8 lg:pt-24">
        <motion.div
          className="max-w-4xl"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <h1 className="text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
            {t.choose.title}
          </h1>
        </motion.div>

        <motion.div
          className="relative mt-2 flex w-full max-w-[1120px] flex-col items-center sm:mt-7"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08, ease: "easeOut" }}
        >
          <div className="pointer-events-none absolute left-1/2 top-[228px] z-20 flex w-full max-w-[360px] -translate-x-1/2 items-center justify-between sm:hidden">
            <Link href={staticHref} className={mobileChoiceButtonClass}>
              <FileText className="h-3 w-3 shrink-0 text-[#d7b46a]" />
              {t.choose.staticLabel}
            </Link>
            <a
              href={interactiveHref}
              target="_blank"
              rel="noopener noreferrer"
              className={mobileChoiceButtonClass}
            >
              <ExternalLink className="h-3 w-3 shrink-0 text-[#d7b46a]" />
              {t.choose.interactiveLabel}
            </a>
          </div>

          <div className="relative mt-0 h-[500px] w-full max-w-[1000px] sm:h-[610px] lg:h-[650px]">
            <div className="absolute left-1/2 top-[194px] z-20 hidden w-full max-w-[620px] -translate-x-1/2 items-center justify-between sm:flex lg:top-[208px]">
              <Link href={staticHref} className={choiceButtonClass}>
                <FileText className="h-4 w-4 shrink-0 text-[#d7b46a]" />
                {t.choose.staticLabel}
              </Link>
              <a
                href={interactiveHref}
                target="_blank"
                rel="noopener noreferrer"
                className={choiceButtonClass}
              >
                <ExternalLink className="h-4 w-4 shrink-0 text-[#d7b46a]" />
                {t.choose.interactiveLabel}
              </a>
            </div>

            <div className="pointer-events-none absolute left-1/2 top-8 h-[450px] w-[450px] -translate-x-1/2 rounded-full bg-[#d7b46a]/12 blur-3xl sm:top-12 sm:h-[560px] sm:w-[560px]" />
            <Image
              src="/images/portfolio-choice-portrait.png"
              alt={t.choose.imageAlt}
              width={886}
              height={1002}
              priority
              sizes="(min-width: 1024px) 720px, (min-width: 640px) 620px, 94vw"
              className="relative z-10 mx-auto h-full w-auto object-contain object-bottom drop-shadow-[0_24px_80px_rgba(0,0,0,0.72)]"
            />
          </div>

          <Link
            href="/static#contact"
            className="relative z-20 mt-4 inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/[0.03] px-4 py-2 text-sm text-zinc-300 transition-colors hover:border-[#d7b46a]/60 hover:text-[#f5dfae]"
          >
            <Mail className="h-4 w-4" />
            {t.choose.contactCta}
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
