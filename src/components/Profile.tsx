"use client";

import Image from "next/image";
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
          <Image
            src="/images/profile-2-cutout.png"
            alt={t.about.imageAlt}
            width={1122}
            height={1402}
            className="relative mx-auto h-auto max-h-[620px] w-auto max-w-full object-contain drop-shadow-[0_24px_60px_rgba(0,0,0,0.5)]"
          />
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
