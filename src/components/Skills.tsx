"use client";

import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

export function Skills() {
  const { t } = useLanguage();

  return (
    <section id="tech-stack" className="px-5 py-24 md:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          className="max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm uppercase tracking-[0.28em] text-[#d7b46a]">
            {t.skills.title}
          </p>
          <h2 className="mt-4 text-4xl leading-tight text-white md:text-5xl">
            {t.skills.description}
          </h2>
        </motion.div>

        <motion.div
          className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.04 } } }}
        >
          {t.skills.items.map((skill) => (
            <motion.div
              key={skill}
              variants={{
                hidden: { opacity: 0, y: 18 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.35, ease: "easeOut" },
                },
              }}
              className="flex min-h-16 items-center gap-3 rounded-md border border-white/10 bg-white/[0.035] px-4 py-4 text-zinc-200 transition-colors hover:border-[#d7b46a]/45 hover:text-white"
            >
              <CheckCircle2 className="h-5 w-5 shrink-0 text-[#d7b46a]" />
              <span className="text-sm">{skill}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
