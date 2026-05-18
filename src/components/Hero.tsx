"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDown, BriefcaseBusiness, Mail, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export function Hero() {
  const { t } = useLanguage();

  return (
    <section id="home" className="relative min-h-screen overflow-hidden pt-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(215,180,106,0.16),transparent_34%),radial-gradient(circle_at_85%_25%,rgba(34,83,67,0.24),transparent_32%),linear-gradient(135deg,#020202_0%,#10100f_48%,#050505_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#070707] to-transparent" />

      <div className="relative mx-auto grid min-h-[calc(100vh-7rem)] max-w-7xl items-center gap-12 px-5 pb-16 md:px-8 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div
          className="max-w-3xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="mb-6 inline-flex items-center gap-2 rounded-md border border-[#d7b46a]/30 bg-[#d7b46a]/10 px-3 py-2 text-sm text-[#f5dfae]"
            variants={fadeUp}
          >
            <Sparkles className="h-4 w-4" />
            {t.hero.eyebrow}
          </motion.div>

          <motion.h1
            className="max-w-4xl text-5xl leading-[1.02] text-white sm:text-6xl lg:text-7xl"
            variants={fadeUp}
          >
            {t.hero.name}
          </motion.h1>

          <motion.p
            className="mt-5 max-w-2xl text-xl text-[#f5dfae] sm:text-2xl"
            variants={fadeUp}
          >
            {t.hero.title}
          </motion.p>

          <motion.p
            className="mt-6 max-w-2xl text-base leading-8 text-zinc-300 sm:text-lg"
            variants={fadeUp}
          >
            {t.hero.description}
          </motion.p>

          <motion.p
            className="mt-4 max-w-2xl text-base leading-8 text-zinc-400"
            variants={fadeUp}
          >
            {t.hero.secondary}
          </motion.p>

          <motion.div className="mt-9 flex flex-col gap-3 sm:flex-row" variants={fadeUp}>
            <Link
              href="#projects"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-[#d7b46a] px-6 py-3 text-base text-black transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_38px_rgba(215,180,106,0.26)]"
            >
              {t.hero.projectsBtn}
              <ArrowDown className="h-4 w-4" />
            </Link>
            <Link
              href="/b-crm-case-study"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-[#d7b46a]/50 bg-[#d7b46a]/10 px-6 py-3 text-base text-[#f5dfae] transition-all hover:-translate-y-0.5 hover:border-[#d7b46a]"
            >
              <BriefcaseBusiness className="h-4 w-4" />
              {t.hero.bcrmBtn}
            </Link>
            <Link
              href="#contact"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-white/15 bg-white/[0.03] px-6 py-3 text-base text-white transition-all hover:border-[#d7b46a]/60 hover:text-[#f5dfae]"
            >
              <Mail className="h-4 w-4" />
              {t.hero.contactBtn}
            </Link>
          </motion.div>

          <motion.div
            className="mt-10 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3"
            variants={fadeUp}
          >
            {t.hero.metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-md border border-white/10 bg-white/[0.035] p-4 backdrop-blur-sm"
              >
                <div className="text-lg text-[#f5dfae]">{metric.value}</div>
                <div className="mt-1 text-sm leading-5 text-zinc-400">{metric.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          className="relative mx-auto w-full max-w-[430px] lg:max-w-[520px]"
          initial={{ opacity: 0, x: 70 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: "easeOut" }}
        >
          <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-[#d7b46a]/20 via-transparent to-[#1f4d3d]/30 blur-2xl" />
          <div className="relative overflow-hidden rounded-[1rem] border border-[#d7b46a]/25 bg-[#111]/80 shadow-[0_28px_80px_rgba(0,0,0,0.55)]">
            <Image
              src="/images/profile-1.png"
              alt={t.hero.imageAlt}
              width={1154}
              height={1408}
              priority
              className="aspect-[4/5] w-full object-cover object-[52%_35%]"
            />
          </div>
          <div className="absolute -bottom-6 left-5 right-5 rounded-md border border-white/10 bg-black/70 p-4 backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.26em] text-[#f5dfae]">
              B-CRM · Supabase · Dashboardy
            </p>
            <p className="mt-1 text-sm text-zinc-300">
              Practical web apps for business workflows
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
