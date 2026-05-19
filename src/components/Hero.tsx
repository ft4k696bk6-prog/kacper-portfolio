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
              href="/case-studies/b-crm"
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

        </motion.div>

        <motion.div
          className="relative mx-auto w-full max-w-[430px] pb-4 lg:max-w-[520px]"
          initial={{ opacity: 0, x: 70 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: "easeOut" }}
        >
          <div className="absolute inset-x-6 bottom-0 top-16 rounded-full bg-[#d7b46a]/16 blur-3xl" />
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image
              src="/images/profile-3-cutout.png"
              alt={t.hero.imageAlt}
              width={1024}
              height={1280}
              priority
              sizes="(min-width: 1024px) 42vw, (min-width: 640px) 70vw, 92vw"
              className="relative z-10 mx-auto h-auto max-h-[72vh] w-auto max-w-full object-contain drop-shadow-[0_30px_70px_rgba(0,0,0,0.55)]"
            />
          </motion.div>
          <div className="relative mx-auto mt-2 h-px w-44 bg-gradient-to-r from-transparent via-[#d7b46a] to-transparent shadow-[0_0_22px_rgba(215,180,106,0.5)]" />
          <div className="relative mx-auto mt-1 h-6 w-56 bg-[#d7b46a]/10 blur-2xl" />
        </motion.div>
      </div>
    </section>
  );
}
