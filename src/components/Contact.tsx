"use client";

import Image from "next/image";
import { Github, Linkedin, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { BookingCalendar } from "@/components/BookingCalendar";
import { ContactReveal } from "@/components/ContactReveal";

export function Contact() {
  const { lang, t } = useLanguage();

  return (
    <section
      id="contact"
      className="relative overflow-hidden border-t border-white/10 bg-[#090908] px-5 py-8 md:px-8 lg:min-h-[100svh] lg:py-10"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d7b46a]/60 to-transparent" />
      <div className="mx-auto flex min-h-[calc(100svh-5rem)] max-w-7xl flex-col justify-between gap-6">
        <div className="grid flex-1 gap-6 xl:grid-cols-[0.76fr_1.24fr] xl:items-center">
          <motion.div
            className="relative hidden overflow-hidden xl:order-first xl:block xl:min-h-[560px]"
            initial={{ opacity: 0, x: -44 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="absolute inset-x-0 bottom-3"
              animate={{ x: [-7, 7, -7] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            >
              <Image
                src="/images/profile-1-cutout.png"
                alt={t.hero.imageAlt}
                width={1122}
                height={1402}
                sizes="(min-width: 1280px) 34vw, (min-width: 768px) 50vw, 86vw"
                className="mx-auto h-auto max-h-[600px] w-auto max-w-full object-contain object-bottom drop-shadow-[0_28px_70px_rgba(0,0,0,0.48)]"
              />
            </motion.div>

            <div className="absolute inset-x-10 bottom-3 h-px bg-gradient-to-r from-transparent via-[#d7b46a]/75 to-transparent shadow-[0_0_26px_rgba(215,180,106,0.42)]" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <div className="max-w-3xl">
              <p className="text-sm uppercase tracking-[0.28em] text-[#d7b46a]">
                {t.nav.contact}
              </p>
              <h2 className="mt-4 text-4xl leading-tight text-white md:text-5xl">
                {t.contact.title}
              </h2>
              <p className="mt-5 text-base leading-8 text-zinc-300">
                {t.contact.description}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.035] px-3 py-2 text-sm text-zinc-300">
                <MapPin className="h-4 w-4 text-[#d7b46a]" />
                {t.contact.location}
              </span>
              <a
                href={t.contact.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.035] px-3 py-2 text-sm text-zinc-300 transition-colors hover:border-[#d7b46a]/45 hover:text-white"
              >
                <Github className="h-4 w-4 text-[#d7b46a]" />
                {t.contact.githubCta}
              </a>
              <a
                href={t.contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.035] px-3 py-2 text-sm text-zinc-300 transition-colors hover:border-[#d7b46a]/45 hover:text-white"
              >
                <Linkedin className="h-4 w-4 text-[#d7b46a]" />
                {t.contact.linkedinCta}
              </a>
            </div>

            <div className="mt-5 grid gap-4">
              <BookingCalendar
                copy={t.contact.booking}
                locale={lang === "pl" ? "pl-PL" : "en-US"}
              />
              <ContactReveal copy={t.contact.reveal} />
            </div>
          </motion.div>
        </div>

        <div className="border-t border-white/10 pt-5 text-sm text-zinc-500">
          {t.contact.copyright}
        </div>
      </div>
    </section>
  );
}
