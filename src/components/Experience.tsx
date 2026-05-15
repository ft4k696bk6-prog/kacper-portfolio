"use client";

import { Layers3 } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

export function Experience() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden border-y border-white/10 bg-[#0c0c0b] px-5 py-24 md:px-8">
      <div className="absolute left-0 top-1/2 h-72 w-72 -translate-y-1/2 bg-[#1f4d3d]/25 blur-3xl" />
      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-5 grid h-12 w-12 place-items-center rounded-md border border-[#d7b46a]/35 bg-[#d7b46a]/10 text-[#f5dfae]">
              <Layers3 className="h-6 w-6" />
            </div>
            <p className="text-sm uppercase tracking-[0.28em] text-[#d7b46a]">
              {t.background.title}
            </p>
            <h2 className="mt-4 max-w-xl text-4xl leading-tight text-white md:text-5xl">
              {t.background.heading}
            </h2>
          </motion.div>

          <div className="space-y-5">
            {t.background.paragraphs.map((paragraph, index) => (
              <motion.div
                key={paragraph}
                className="relative rounded-md border border-white/10 bg-white/[0.035] p-6"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
              >
                <span className="mb-4 inline-flex h-8 w-8 items-center justify-center rounded-md bg-[#d7b46a]/10 text-sm text-[#f5dfae]">
                  0{index + 1}
                </span>
                <p className="text-base leading-8 text-zinc-300">{paragraph}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
