"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

type Testimonial = {
  company: string;
  projectPl: string;
  projectEn: string;
  quotePl: string;
  quoteEn: string;
  href: string;
  related?: boolean;
};

const testimonials: Testimonial[] = [
  {
    company: "StarCars",
    projectPl: "Strona internetowa i import aut",
    projectEn: "Website and vehicle imports",
    quotePl: "Przy imporcie aut klient ma sporo pytań, zanim w ogóle zadzwoni. Strona porządkuje ofertę i pozwala sprawdzić orientacyjne koszty sprowadzenia samochodu. Mamy też przestrzeń, żeby rozwijać kolejne funkcje.",
    quoteEn: "People have plenty of questions before contacting a vehicle importer. The website explains our offer and lets them estimate import costs. It also gives us room to keep developing new features.",
    href: "/case-studies/starcars",
    related: true,
  },
  {
    company: "Re-Energy System",
    projectPl: "Strona firmowa i marketing",
    projectEn: "Company website and marketing",
    quotePl: "Nie chodziło nam o samą wizytówkę w internecie. Strona, reklamy i formularze mają wspierać pozyskiwanie zapytań od klientów. Doceniamy to, że rozwiązania są dopasowane do naszej branży i możemy je rozwijać wraz z firmą.",
    quoteEn: "We needed more than an online business card. Our website, advertising and forms are designed around customer enquiries. We value solutions tailored to our industry that can evolve with the business.",
    href: "/case-studies/re-energy-meta-ads",
    related: true,
  },
  {
    company: "Re-Energy System",
    projectPl: "B-CRM — system wdrożony w firmie",
    projectEn: "B-CRM — deployed in our company",
    quotePl: "Zależało nam, żeby handlowcy mieli porządek w kontaktach, a biuro widziało, co dzieje się po podpisaniu umowy. B-CRM łączy leady, zadania i realizację w jednym miejscu. Powstawał pod nasz sposób pracy, a nie według gotowego szablonu.",
    quoteEn: "We needed salespeople to stay on top of leads and our office to see what happens after a contract is signed. B-CRM brings contacts, tasks and delivery into one place. It was built around how our team works, not a generic template.",
    href: "/case-studies/b-crm",
    related: true,
  },
  {
    company: "Motomizer",
    projectPl: "Prezentacja produktu i marki",
    projectEn: "Product and brand presentation",
    quotePl: "To nietypowy produkt i zależało nam, żeby od pierwszego spojrzenia było wiadomo, co go wyróżnia. Strona pokazuje warianty i najważniejsze funkcje w spójny sposób. Taki kierunek dobrze pasuje do rozwijania marki.",
    quoteEn: "Our product is unusual, so we wanted people to understand what makes it different at a glance. The site presents its variants and key features consistently, in a way that suits the brand we are building.",
    href: "/case-studies/motomizer",
    related: true,
  },
  {
    company: "Isto Kebab",
    projectPl: "Strona, menu i zamówienia",
    projectEn: "Website, menu and ordering",
    quotePl: "Chcieliśmy prostej rzeczy: żeby gość mógł szybko sprawdzić menu i wygodnie złożyć zamówienie, również przez telefon. Strona jest czytelna, a projekt ma własny charakter zamiast wyglądać jak kolejny gotowy szablon.",
    quoteEn: "We wanted something straightforward: customers should be able to check the menu and place an order easily, including on their phones. The website is clear and has its own character rather than looking like another template.",
    href: "/realizacje/isto-kebab-strona",
  },
  {
    company: "Gentlemen Barber Shop",
    projectPl: "Social media i komunikacja salonu",
    projectEn: "Social media and barbershop communication",
    quotePl: "W promocji salonu ważne jest, żeby materiały pasowały do jego stylu. Współpraca pomogła uporządkować komunikację w social mediach. Ustalenia były konkretne i bez zbędnego komplikowania prostych spraw.",
    quoteEn: "A barbershop's content needs to reflect its own style. The collaboration helped us bring more consistency to our social media communication. Decisions were straightforward, without overcomplicating simple things.",
    href: "/realizacje/gentlemen-social-media",
  },
];

export function ClientTestimonials() {
  const { lang } = useLanguage();
  const pl = lang === "pl";

  return (
    <section id="opinie" aria-labelledby="testimonials-title" className="border-b border-white/10 bg-[var(--brand-black)] px-5 py-16 md:px-8 md:py-20">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs uppercase tracking-[.18em] text-white/60">
          {pl ? "Referencje" : "Testimonials"}
        </p>
        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <h2 id="testimonials-title" className="max-w-2xl text-3xl leading-tight tracking-tight text-white md:text-5xl">
            {pl ? "Co mówią firmy, z którymi pracuję." : "What the businesses I work with say."}
          </h2>
          <p className="max-w-lg text-sm leading-7 text-white/60">
            {pl
              ? "Opinie przygotowane za zgodą firm, w oparciu o zrealizowane projekty. Część wymienionych marek to również przedsięwzięcia, które współtworzę."
              : "Feedback prepared with permission from the businesses, based on our actual projects. Some of the brands featured are ventures I also help build."}
          </p>
        </div>
        <div className="mt-9 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {testimonials.map((item) => (
            <article key={item.company + item.projectPl} className="flex min-w-0 flex-col justify-between rounded-2xl border border-white/15 bg-white/[.025] p-6 transition-colors hover:border-white/30 md:p-7">
              <div>
                <p className="text-xs uppercase tracking-[.13em] text-white/55">{pl ? item.projectPl : item.projectEn}</p>
                <blockquote className="mt-5 text-[15px] leading-[1.85] text-white/85">
                  <p>„{pl ? item.quotePl : item.quoteEn}”</p>
                </blockquote>
              </div>
              <div className="mt-7 border-t border-white/10 pt-5">
                <p className="text-base font-semibold text-white">{item.company}</p>
                {item.related && (
                  <p className="mt-1 text-xs leading-5 text-white/45">
                    {pl ? "Marka współtworzona" : "A venture I also help build"}
                  </p>
                )}
                <Link href={item.href} className="mt-3 inline-flex min-h-9 items-center gap-1.5 text-sm text-white/75 underline-offset-4 transition hover:text-white hover:underline">
                  {pl ? "Zobacz realizację" : "Explore the project"}
                  <ArrowUpRight aria-hidden="true" size={15} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
