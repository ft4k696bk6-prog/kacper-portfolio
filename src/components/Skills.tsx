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
          <h2 className="mt-4 max-w-4xl text-4xl leading-tight text-white md:text-5xl">
            {t.skills.description}
          </h2>
        </motion.div>

        <motion.div
          className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.04 } } }}
        >
          {t.skills.items.map((skill) => (
            <motion.div
              key={skill.title}
              variants={{
                hidden: { opacity: 0, y: 18 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.35, ease: "easeOut" },
                },
              }}
              className="min-h-40 rounded-md border border-white/10 bg-white/[0.035] p-5 text-zinc-200 transition-colors hover:border-[#d7b46a]/45 hover:text-white"
            >
              <div className="mb-4 flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-[#d7b46a]" />
                <h3 className="text-lg text-white">{skill.title}</h3>
              </div>
              <p className="text-sm leading-7 text-zinc-400">{skill.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
