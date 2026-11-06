"use client";

import { Hero } from "@/components/Hero";
import { ClientMarquee } from "@/components/ClientMarquee";
import { Profile } from "@/components/Profile";
import { Experience } from "@/components/Experience";
import { Services } from "@/components/Services";
import { Projects } from "@/components/Projects";
import { Skills } from "@/components/Skills";
import { Contact } from "@/components/Contact";
import { TechnicalAudience } from "@/components/TechnicalAudience";
import { ClientProof } from "@/components/ClientProof";
import { useLanguage } from "@/contexts/LanguageContext";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://bernecki.dev/#website",
      url: "https://bernecki.dev/",
      name: "Kacper Bernecki — strony internetowe, CRM i aplikacje webowe",
      description:
        "Strony internetowe, CRM-y i aplikacje webowe tworzone bezpośrednio przez Kacpra Berneckiego.",
      inLanguage: ["pl-PL", "en-US"],
      publisher: { "@id": "https://bernecki.dev/#person" },
    },
    {
      "@type": "Person",
      "@id": "https://bernecki.dev/#person",
      name: "Kacper Bernecki",
      url: "https://bernecki.dev/",
      jobTitle: "Frontend / Web App Developer",
      description:
        "Independent Polish developer building websites, CRM systems and practical business web apps.",
      address: { "@type": "PostalAddress", addressCountry: "PL" },
      sameAs: [
        "https://github.com/ft4k696bk6-prog",
        "https://www.linkedin.com/in/kacper-bernecki/",
      ],
      image: "https://bernecki.dev/images/profile-3-cutout.png",
      knowsAbout: [
        "Website development",
        "CRM systems",
        "Business web applications",
        "React",
        "TypeScript",
        "Next.js",
        "Supabase",
        "PostgreSQL",
        "Digital marketing websites",
      ],
      knowsLanguage: ["pl-PL", "en-US"],
    },
    {
      "@type": "Service",
      "@id": "https://bernecki.dev/#service",
      name: "Kacper Bernecki — strony internetowe, CRM i web app",
      url: "https://bernecki.dev/",
      provider: { "@id": "https://bernecki.dev/#person" },
      areaServed: "PL",
      serviceType: [
        "Website development",
        "CRM development",
        "Business web application development",
        "Landing page development",
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Usługi Kacpra Berneckiego",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Tworzenie stron internetowych",
              url: "https://bernecki.dev/tworzenie-stron-internetowych",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "CRM i aplikacje webowe",
              url: "https://bernecki.dev/crm-i-aplikacje-webowe",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Marketing i reklamy",
              url: "https://bernecki.dev/marketing-i-reklamy",
            },
          },
        ],
      },
    },
  ],
};

export function StaticPortfolio() {
  const { lang } = useLanguage();
  const faq =
    lang === "pl"
      ? [
          [
            "Czy pracuję bezpośrednio z klientem?",
            "Tak. Rozmawiasz bezpośrednio z osobą, która analizuje problem, buduje rozwiązanie i odpowiada za jakość wykonania.",
          ],
          [
            "Czy można zacząć od małego zakresu?",
            "Tak. Możemy zacząć od landing page, pierwszej wersji CRM-u albo konkretnego fragmentu procesu i rozwijać rozwiązanie etapami.",
          ],
          [
            "Ile kosztuje strona internetowa lub CRM?",
            "Cena zależy od zakresu: liczby widoków, treści, formularzy, integracji i funkcji. Po krótkiej rozmowie ustalamy, co jest potrzebne, i przygotowuję wycenę. Możemy zacząć od mniejszej wersji i rozwijać ją etapami.",
          ],
          [
            "Jak długo trwa realizacja?",
            "Termin zależy od zakresu i dostępności materiałów. Ustalamy go przed rozpoczęciem prac, razem z etapami i kolejnością funkcji.",
          ],
          [
            "Czy pracuję z klientami z całej Polski?",
            "Tak. Pracuję zdalnie, a rozmowę i ustalenia możemy prowadzić online.",
          ],
        ]
      : [
          [
            "Do I work directly with clients?",
            "Yes. You speak directly with the person who analyses the problem, builds the solution and owns the implementation quality.",
          ],
          [
            "Can we start with a small scope?",
            "Yes. We can start with a landing page, a first CRM version or one concrete workflow and expand in stages.",
          ],
          [
            "How much does a website or CRM cost?",
            "The price depends on the scope: screens, content, forms, integrations and features. After a conversation, I prepare a quote. We can start with a smaller version and grow in stages.",
          ],
          [
            "How long does a project take?",
            "Timing depends on scope and the availability of content. We agree on the timeline, stages and priorities before work begins.",
          ],
          [
            "Do I work with clients across Poland?",
            "Yes. I work remotely and we can handle the whole conversation and delivery online.",
          ],
        ];
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <main className="min-h-screen bg-[#070707] text-white">
        <Hero />
        <ClientMarquee />
        <Projects />
        <Services />
        <Experience />
        <Profile />
        <ClientProof />
        <details className="mx-auto max-w-7xl px-5 py-10 md:px-8">
          <summary className="cursor-pointer rounded-xl border border-white/10 bg-white/[0.03] p-5 text-[#e1f4c9]">
            {lang === "pl"
              ? "Dla osób technicznych — stack i szczegóły B-CRM"
              : "For technical reviewers — stack and B-CRM details"}
          </summary>
          <TechnicalAudience />
          <Skills />
        </details>
        <section
          id="faq"
          className="border-y border-white/10 bg-white/[0.02] px-5 py-20 md:px-8 md:py-28"
        >
          <div className="mx-auto max-w-4xl">
            <p className="text-sm uppercase tracking-[0.24em] text-[#c2f970]">
              {lang === "pl"
                ? "Najczęstsze pytania"
                : "Frequently asked questions"}
            </p>
            <h2 className="mt-4 text-3xl text-white md:text-4xl">
              {lang === "pl"
                ? "Jak wygląda współpraca?"
                : "What is working together like?"}
            </h2>
            <div className="mt-8 divide-y divide-white/10 rounded-md border border-white/10 bg-white/[0.035] px-5">
              {faq.map(([question, answer]) => (
                <details key={question} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-lg text-white marker:hidden">
                    {question}
                    <span
                      aria-hidden="true"
                      className="text-[#c2f970] transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-3 max-w-3xl leading-7 text-zinc-400">
                    {answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
        <Contact />
      </main>
    </>
  );
}
