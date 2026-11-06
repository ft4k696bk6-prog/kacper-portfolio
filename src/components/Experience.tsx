"use client";

import { Layers3 } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

export function Experience() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden border-y border-white/10 bg-[var(--brand-black)] px-5 py-24 md:px-8">
      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="ui-icon mb-5 grid h-12 w-12 place-items-center rounded-md">
              <Layers3 className="h-6 w-6" />
            </div>
            <p className="text-sm uppercase tracking-[0.28em] text-white">
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
                className="relative rounded-md border border-white/10 bg-[var(--brand-black)] p-6"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
              >
                <span className="mb-4 inline-flex h-8 w-8 items-center justify-center rounded-md bg-[var(--brand-black)] text-sm text-white">
                  0{index + 1}
                </span>
                <p className="text-base leading-8 text-white">{paragraph}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
