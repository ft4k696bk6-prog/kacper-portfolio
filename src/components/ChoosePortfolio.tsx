"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, Laptop, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

export function ChoosePortfolio() {
  const { t } = useLanguage();

  const cards = [
    {
      title: t.choose.businessTitle,
      description: t.choose.businessDescription,
      cta: t.choose.businessCta,
      href: "/static",
      image: "/images/projects/bcrm-admin-dashboard.jpg",
      alt: t.choose.businessImageAlt,
      icon: BriefcaseBusiness,
      external: false,
    },
    {
      title: t.choose.interactiveTitle,
      description: t.choose.interactiveDescription,
      cta: t.choose.interactiveCta,
      href: "https://kacper-bernecki.vercel.app",
      image: "/images/projects/interactive-portfolio-desktop.jpg",
      alt: t.choose.interactiveImageAlt,
      icon: Laptop,
      external: true,
    },
  ];

  return (
    <main className="min-h-screen bg-[#070707] px-5 pb-16 pt-32 text-white md:px-8">
      <section className="mx-auto flex max-w-7xl flex-col gap-10">
        <motion.div
          className="max-w-3xl"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <p className="text-sm uppercase tracking-[0.28em] text-[#d7b46a]">
            {t.choose.eyebrow}
          </p>
          <h1 className="mt-5 text-4xl leading-tight text-white md:text-6xl">
            {t.choose.title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-zinc-300">
            {t.choose.description}
          </p>
        </motion.div>

        <div className="grid gap-5 lg:grid-cols-2">
          {cards.map((card, index) => {
            const Icon = card.icon;
            const className =
              "group rounded-md border border-white/10 bg-[#11110f]/90 p-4 transition-all hover:-translate-y-1 hover:border-[#d7b46a]/55";
            const content = (
              <>
                <div className="overflow-hidden rounded-md border border-white/10 bg-black/30">
                  <Image
                    src={card.image}
                    alt={card.alt}
                    width={1600}
                    height={900}
                    sizes="(min-width: 1024px) 45vw, 100vw"
                    className="aspect-[16/9] h-auto w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                    priority={index === 0}
                  />
                </div>
                <div className="p-2 pt-5">
                  <div className="flex items-center gap-3 text-[#f5dfae]">
                    <span className="grid h-10 w-10 place-items-center rounded-md border border-[#d7b46a]/35 bg-[#d7b46a]/10">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-sm uppercase tracking-[0.18em]">0{index + 1}</span>
                  </div>
                  <h2 className="mt-5 text-2xl leading-tight text-white md:text-3xl">
                    {card.title}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-zinc-300">{card.description}</p>
                  <span className="mt-6 inline-flex items-center gap-2 rounded-md bg-[#d7b46a] px-4 py-2 text-sm text-black transition group-hover:shadow-[0_12px_30px_rgba(215,180,106,0.18)]">
                    {card.cta}
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </>
            );

            return card.external ? (
              <motion.a
                key={card.href}
                href={card.href}
                target="_blank"
                rel="noopener noreferrer"
                className={className}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.08 * index }}
              >
                {content}
              </motion.a>
            ) : (
              <motion.div
                key={card.href}
                className={className}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.08 * index }}
              >
                <Link href={card.href}>{content}</Link>
              </motion.div>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-3 border-t border-white/10 pt-6">
          <Link
            href="/static#projects"
            className="inline-flex items-center gap-2 rounded-md border border-[#d7b46a]/45 bg-[#d7b46a]/10 px-4 py-2 text-sm text-[#f5dfae] transition hover:border-[#d7b46a]"
          >
            {t.choose.projectsCta}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/static#contact"
            className="inline-flex items-center gap-2 rounded-md border border-white/15 px-4 py-2 text-sm text-zinc-100 transition hover:border-[#d7b46a]/60 hover:text-[#f5dfae]"
          >
            <Mail className="h-4 w-4" />
            {t.choose.contactCta}
          </Link>
        </div>
      </section>
    </main>
  );
}

