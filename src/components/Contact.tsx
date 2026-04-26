"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail, Linkedin, Phone, Download } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

export function Contact() {
  const { t } = useLanguage();
  return (
    <section className="py-24 px-6 md:px-12 lg:px-24 bg-slate-900/50">
      <div className="w-full">
        <div className="max-w-none w-full">
          <motion.h2
            className="text-4xl md:text-5xl text-white mb-12"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {t.contact.title}
          </motion.h2>

          <div className="mb-4 grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-lg text-slate-300 leading-relaxed">
                {t.contact.description}
              </p>

              <div className="space-y-4 max-w-md">
                <motion.a
                  href="mailto:michal@sagan.dev"
                  className="flex items-center gap-4 p-4 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-cyan-500/50 transition-all group"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="p-3 bg-cyan-500/10 rounded-lg group-hover:bg-cyan-500/20 transition-colors">
                    <Mail className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-400">{t.contact.emailLabel}</div>
                    <div className="text-white">michal@sagan.dev</div>
                  </div>
                </motion.a>

                <motion.a
                  href="tel:+48600341211"
                  className="flex items-center gap-4 p-4 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-cyan-500/50 transition-all group"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <div className="p-3 bg-cyan-500/10 rounded-lg group-hover:bg-cyan-500/20 transition-colors">
                    <Phone className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-400">{t.contact.phoneLabel}</div>
                    <div className="text-white">+48 600 341 211</div>
                  </div>
                </motion.a>

                <motion.a
                  href="https://linkedin.com/in/michal-sagan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-cyan-500/50 transition-all group"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <div className="p-3 bg-cyan-500/10 rounded-lg group-hover:bg-cyan-500/20 transition-colors">
                    <Linkedin className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-400">{t.contact.linkedinLabel}</div>
                    <div className="text-white">in/michal-sagan</div>
                  </div>
                </motion.a>

                <motion.button
                  onClick={() => window.print()}
                  className="flex items-center gap-4 p-4 w-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all group cursor-pointer"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <div className="p-3 bg-white/10 rounded-lg">
                    <Download className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm text-cyan-100">
                      {t.contact.downloadLabel}
                    </div>
                    <div className="text-white">{t.contact.saveLabel}</div>
                  </div>
                </motion.button>
              </div>
            </div>

            <motion.div
              className="flex justify-center items-end overflow-hidden -mb-4"
              initial={{ opacity: 0, x: 80 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full blur-3xl opacity-30 scale-75"></div>
                <motion.div
                  animate={{ y: [0, 12, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Image
                    src="/footer.png"
                    alt="Michał Sagan"
                    width={384}
                    height={500}
                    className="relative w-80 h-auto md:w-100 object-contain object-bottom drop-shadow-2xl"
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>

          <div className="pt-8 border-t border-slate-700">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400">
              <div>
                <p className="text-sm">
                  {t.contact.copyright}
                </p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <Link
                  href="/cookies"
                  className="hover:text-cyan-400 transition-colors"
                >
                  {t.cookies.policyLink}
                </Link>
                <p>
                  {t.contact.roleAt}{" "}
                  <span className="text-cyan-400">Heineken</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
