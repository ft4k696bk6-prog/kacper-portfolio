"use client";

import { BriefcaseBusiness, Database, FileText, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const icons = [BriefcaseBusiness, FileText, ShieldCheck, Database];

export function Profile() {
  const { t } = useLanguage();

  return (
    <section id="about" className="relative border-y border-white/10 bg-[#0b0b0a] px-5 py-20 md:px-8">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d7b46a]/40 to-transparent" />
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm uppercase tracking-[0.28em] text-[#d7b46a]">
            {t.about.title}
          </p>
          <h2 className="mt-4 max-w-3xl text-4xl leading-tight text-white md:text-5xl">
            {t.about.heading}
          </h2>
        </motion.div>

        <div>
          <div className="space-y-4 text-base leading-8 text-zinc-300">
            {t.about.paragraphs.map((paragraph, index) => (
              <motion.p
                key={paragraph}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.05 }}
              >
                {paragraph}
              </motion.p>
            ))}
          </div>

          <motion.div
            className="mt-9 divide-y divide-white/10 rounded-md border border-white/10 bg-white/[0.03]"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
          >
            {t.about.highlights.map((item, index) => {
              const Icon = icons[index] ?? BriefcaseBusiness;

              return (
                <motion.div
                  key={item.title}
                  variants={{
                    hidden: { opacity: 0, y: 18 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.36, ease: "easeOut" },
                    },
                  }}
                  className="grid gap-4 p-5 sm:grid-cols-[3rem_1fr] sm:items-start"
                >
                  <div className="grid h-12 w-12 place-items-center rounded-md bg-[#d7b46a]/10 text-[#f5dfae]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg text-white">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-400">{item.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
