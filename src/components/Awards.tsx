"use client";

import { Award, Trophy, Star } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const icons: LucideIcon[] = [Trophy, Award, Star, Award, Trophy, Star];

export function Awards() {
  const { t } = useLanguage();

  return (
    <section className="py-24 px-6 md:px-12 lg:px-24 bg-slate-900/50">
      <div className="container mx-auto">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-4xl md:text-5xl text-white mb-12"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {t.awards.title}
          </motion.h2>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
          >
            {t.awards.items.map((award, index) => {
              const Icon = icons[index];
              return (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, scale: 0.85, y: 20 },
                  visible: {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    transition: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] },
                  },
                }}
                className="group bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-all hover:shadow-lg hover:shadow-cyan-500/10"
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg group-hover:from-cyan-500/30 group-hover:to-blue-500/30 transition-colors">
                      <Icon className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white mb-1">{award.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <span>{award.issuer}</span>
                        <span>•</span>
                        <span>{award.date}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 mt-auto">
                    {award.description}
                  </p>
                </div>
              </motion.div>
            );})}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
