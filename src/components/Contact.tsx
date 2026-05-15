"use client";

import Image from "next/image";
import { Github, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

export function Contact() {
  const { t } = useLanguage();
  const mailHref = `mailto:${t.contact.email}`;
  const phoneHref = `tel:${t.contact.phone.replace(/\s/g, "")}`;

  const contactRows = [
    { label: t.contact.emailLabel, value: t.contact.email, href: mailHref, icon: Mail },
    { label: t.contact.phoneLabel, value: t.contact.phone, href: phoneHref, icon: Phone },
    { label: t.contact.locationLabel, value: t.contact.location, icon: MapPin },
    { label: t.contact.githubLabel, value: "ft4k696bk6-prog", href: t.contact.github, icon: Github },
    { label: t.contact.linkedinLabel, value: "casper-bernecki", href: t.contact.linkedin, icon: Linkedin },
  ];

  return (
    <section
      id="contact"
      className="relative overflow-hidden border-t border-white/10 bg-[#090908] px-5 py-24 md:px-8"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d7b46a]/60 to-transparent" />
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm uppercase tracking-[0.28em] text-[#d7b46a]">
            {t.nav.contact}
          </p>
          <h2 className="mt-4 max-w-3xl text-4xl leading-tight text-white md:text-5xl">
            {t.contact.title}
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-300">
            {t.contact.description}
          </p>

          <div className="mt-9 grid gap-3 sm:grid-cols-2">
            {contactRows.map((row) => {
              const Icon = row.icon;
              const content = (
                <div className="flex min-h-20 items-center gap-4 rounded-md border border-white/10 bg-white/[0.035] p-4 transition-colors hover:border-[#d7b46a]/45">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-[#d7b46a]/10 text-[#f5dfae]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                      {row.label}
                    </p>
                    <p className="mt-1 break-words text-sm text-zinc-100">{row.value}</p>
                  </div>
                </div>
              );

              return row.href ? (
                <a
                  key={row.label}
                  href={row.href}
                  target={row.href.startsWith("http") ? "_blank" : undefined}
                  rel={row.href.startsWith("http") ? "noopener noreferrer" : undefined}
                >
                  {content}
                </a>
              ) : (
                <div key={row.label}>{content}</div>
              );
            })}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={mailHref}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-[#d7b46a] px-5 py-3 text-sm text-black transition-all hover:-translate-y-0.5"
            >
              <Mail className="h-4 w-4" />
              {t.contact.emailCta}
            </a>
            <a
              href={t.contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-white/15 px-5 py-3 text-sm text-white transition-colors hover:border-[#d7b46a]/60 hover:text-[#f5dfae]"
            >
              <Github className="h-4 w-4" />
              {t.contact.githubCta}
            </a>
            <a
              href={t.contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-white/15 px-5 py-3 text-sm text-white transition-colors hover:border-[#d7b46a]/60 hover:text-[#f5dfae]"
            >
              <Linkedin className="h-4 w-4" />
              {t.contact.linkedinCta}
            </a>
          </div>
        </motion.div>

        <motion.div
          className="relative mx-auto w-full max-w-md"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute -inset-6 rounded-[1.5rem] bg-gradient-to-br from-[#d7b46a]/15 to-[#1f4d3d]/25 blur-2xl" />
          <div className="relative overflow-hidden rounded-[0.9rem] border border-white/10 bg-white/[0.03]">
            <Image
              src="/images/profile-3.png"
              alt={t.hero.imageAlt}
              width={1154}
              height={1408}
              className="aspect-[4/5] w-full object-cover object-[50%_35%]"
            />
          </div>
        </motion.div>
      </div>

      <div className="mx-auto mt-16 max-w-7xl border-t border-white/10 pt-6 text-sm text-zinc-500">
        {t.contact.copyright}
      </div>
    </section>
  );
}
