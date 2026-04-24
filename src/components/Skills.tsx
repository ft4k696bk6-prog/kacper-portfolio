"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

export function Skills() {
  const { t } = useLanguage();

  return (
    <section className="py-24 px-6 md:px-12 lg:px-24">
      <div className="container mx-auto">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-4xl md:text-5xl text-white mb-12"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {t.skills.title}
          </motion.h2>

          <motion.div
            className="grid lg:grid-cols-2 gap-8 mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
          >
            {t.skills.categories.map((category, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
                }}
                className="bg-slate-800/50 border border-slate-700 rounded-xl p-6"
              >
                <h3 className="text-xl text-cyan-400 mb-6">
                  {category.category}
                </h3>
                <div className="space-y-4">
                  {category.skills.map((skill, i) => (
                    <div key={i}>
                      <div className="flex justify-between mb-2">
                        <span className="text-white">{skill.name}</span>
                        <span className="text-slate-400 text-sm">
                          {skill.level}%
                        </span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: i * 0.08, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
          >
            <motion.div
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
              className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-xl text-cyan-400 mb-6">
                  {t.skills.languagesTitle}
                </h3>
              <div className="space-y-4">
                {t.skills.languages.map((lang, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-2">
                      <span className="text-white">{lang.name}</span>
                      <span className="text-slate-400 text-sm">
                        {lang.level}%
                      </span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${lang.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
              className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-xl text-cyan-400 mb-6">
                {t.skills.hobbiesTitle}
              </h3>
              <div className="flex flex-wrap gap-3">
                {t.skills.hobbies.map((hobby, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-white rounded-lg border border-cyan-500/30 hover:border-cyan-500/50 transition-colors"
                  >
                    {hobby}
                  </span>
                ))}
              </div>
              <p className="mt-6 text-slate-400 text-sm">
                {t.skills.bio}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
