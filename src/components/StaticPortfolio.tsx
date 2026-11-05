"use client";

import { Hero } from "@/components/Hero";
import { Profile } from "@/components/Profile";
import { Experience } from "@/components/Experience";
import { Services } from "@/components/Services";
import { Projects } from "@/components/Projects";
import { Skills } from "@/components/Skills";
import { Contact } from "@/components/Contact";
import { TechnicalAudience } from "@/components/TechnicalAudience";
import { useLanguage } from "@/contexts/LanguageContext";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://bernecki.dev/#person",
      name: "Kacper Bernecki",
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
    },
    {
      "@type": "ProfessionalService",
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
    },
  ],
};

export function StaticPortfolio() {
  const { lang } = useLanguage();
  const faq = lang === "pl"
    ? [
        ["Czy pracuję bezpośrednio z klientem?", "Tak. Rozmawiasz bezpośrednio z osobą, która analizuje problem, buduje rozwiązanie i odpowiada za jakość wykonania."],
        ["Czy można zacząć od małego zakresu?", "Tak. Możemy zacząć od landing page, pierwszej wersji CRM-u albo konkretnego fragmentu procesu i rozwijać rozwiązanie etapami."],
        ["Czy dostanę uczciwą wycenę?", "Tak. Najpierw ustalamy cel, zakres i ryzyka, a potem dostajesz konkretną wycenę bez niepotrzebnych dodatków."],
        ["Czy pracuję z klientami z całej Polski?", "Tak. Pracuję zdalnie, a rozmowę i ustalenia możemy prowadzić online."],
      ]
    : [
        ["Do I work directly with clients?", "Yes. You speak directly with the person who analyses the problem, builds the solution and owns the implementation quality."],
        ["Can we start with a small scope?", "Yes. We can start with a landing page, a first CRM version or one concrete workflow and expand in stages."],
        ["Will I get a fair quote?", "Yes. We agree on the goal, scope and risks first, then you get a concrete quote without unnecessary extras."],
        ["Do I work with clients across Poland?", "Yes. I work remotely and we can handle the whole conversation and delivery online."],
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
        <Profile />
        <Experience />
        <Services />
        <TechnicalAudience />
        <section id="faq" className="border-y border-white/10 bg-white/[0.02] px-5 py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-4xl">
            <p className="text-sm uppercase tracking-[0.24em] text-[#d7b46a]">
              {lang === "pl" ? "Najczęstsze pytania" : "Frequently asked questions"}
            </p>
            <h2 className="mt-4 text-3xl text-white md:text-4xl">
              {lang === "pl" ? "Jak wygląda współpraca?" : "What is working together like?"}
            </h2>
            <div className="mt-8 divide-y divide-white/10 rounded-md border border-white/10 bg-white/[0.035] px-5">
              {faq.map(([question, answer]) => (
                <details key={question} className="group py-5">
                  <summary className="cursor-pointer list-none pr-8 text-lg text-white marker:hidden">
                    {question}
                  </summary>
                  <p className="mt-3 max-w-3xl leading-7 text-zinc-400">{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
        <Projects />
        <Skills />
        <Contact />
      </main>
    </>
  );
}
