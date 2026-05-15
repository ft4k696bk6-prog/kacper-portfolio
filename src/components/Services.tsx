"use client";

import {
  Bot,
  FileText,
  Gauge,
  LayoutTemplate,
  PanelTop,
  Workflow,
} from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const icons = [PanelTop, LayoutTemplate, FileText, Gauge, Workflow, Bot];

export function Services() {
  const { t } = useLanguage();

  return (
    <section className="px-5 py-24 md:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          className="max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm uppercase tracking-[0.28em] text-[#d7b46a]">
            {t.services.title}
          </p>
          <h2 className="mt-4 text-4xl leading-tight text-white md:text-5xl">
            {t.services.subtitle}
          </h2>
        </motion.div>

        <motion.div
          className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
        >
          {t.services.items.map((item, index) => {
            const Icon = icons[index] ?? PanelTop;
            return (
              <motion.article
                key={item.title}
                variants={{
                  hidden: { opacity: 0, y: 26 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.42, ease: "easeOut" },
                  },
                }}
                className="group min-h-56 rounded-md border border-white/10 bg-white/[0.035] p-6 transition-all hover:-translate-y-1 hover:border-[#d7b46a]/50 hover:bg-[#d7b46a]/[0.055]"
              >
                <div className="mb-6 grid h-12 w-12 place-items-center rounded-md bg-[#d7b46a]/10 text-[#f5dfae] transition-colors group-hover:bg-[#d7b46a]/20">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-zinc-400">
                  {item.description}
                </p>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
