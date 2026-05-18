"use client";

import { Brain, BriefcaseBusiness, Gauge, Workflow } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const icons = [BriefcaseBusiness, Workflow, Brain, Gauge];

export function Profile() {
  const { t } = useLanguage();

  return (
    <section id="about" className="relative px-5 py-24 md:px-8">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <motion.div
          className="relative mx-auto w-full max-w-md lg:mx-0"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
        >
          <div className="absolute inset-x-6 bottom-0 top-12 rounded-full bg-[#1f4d3d]/24 blur-3xl" />
          <div className="relative rounded-md border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.065),rgba(255,255,255,0.025))] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
            <p className="text-sm uppercase tracking-[0.24em] text-[#f5dfae]">
              {t.about.focusTitle}
            </p>
            <div className="mt-6 space-y-4">
              {t.about.focusItems.map((item, index) => (
                <div key={item} className="flex gap-4 border-t border-white/10 pt-4 first:border-t-0 first:pt-0">
                  <span className="text-sm text-[#d7b46a]">0{index + 1}</span>
                  <p className="text-sm leading-6 text-zinc-300">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <div>
          <motion.p
            className="text-sm uppercase tracking-[0.28em] text-[#d7b46a]"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
          >
            {t.about.title}
          </motion.p>
          <motion.h2
            className="mt-4 max-w-3xl text-4xl leading-tight text-white md:text-5xl"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            {t.about.heading}
          </motion.h2>

          <div className="mt-7 space-y-5 text-base leading-8 text-zinc-300">
            {t.about.paragraphs.map((paragraph) => (
              <motion.p
                key={paragraph}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45 }}
              >
                {paragraph}
              </motion.p>
            ))}
          </div>

          <motion.div
            className="mt-10 grid gap-4 sm:grid-cols-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
          >
            {t.about.highlights.map((item, index) => {
              const Icon = icons[index] ?? BriefcaseBusiness;
              return (
                <motion.div
                  key={item.title}
                  variants={{
                    hidden: { opacity: 0, y: 24 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.42, ease: "easeOut" },
                    },
                  }}
                  className="rounded-md border border-white/10 bg-white/[0.035] p-5 transition-all hover:border-[#d7b46a]/45 hover:bg-[#d7b46a]/[0.055]"
                >
                  <div className="mb-4 grid h-11 w-11 place-items-center rounded-md bg-[#d7b46a]/10 text-[#f5dfae]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">{item.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
