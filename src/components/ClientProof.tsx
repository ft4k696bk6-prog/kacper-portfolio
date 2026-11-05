"use client";

import { useLanguage } from "@/contexts/LanguageContext";

const collaborations = [
  {
    name: "Jalapeno Kebab Niemce",
    person: "Arek",
    pl: "Reklamy, marketing i prowadzenie social mediów.",
    en: "Advertising, marketing and social media management.",
  },
  {
    name: "Re-energy System",
    person: "Bartłomiej",
    pl: "Strona internetowa, reklamy i CRM — od koncepcji po wdrożenie.",
    en: "Website, advertising and CRM — from concept to implementation.",
  },
  {
    name: "StarCars",
    person: "Przemysław",
    pl: "Strona internetowa, reklamy, marketing i rozwój obecności online.",
    en: "Website, advertising, marketing and ongoing online presence.",
  },
  {
    name: "Gentlemen Barber Warszawa",
    person: "Kacper",
    pl: "Współpraca przy stronie i działaniach online.",
    en: "Collaboration around the website and online activity.",
  },
];

export function ClientProof() {
  const { lang } = useLanguage();

  return (
    <section
      id="collaborations"
      className="border-y border-white/10 bg-[#0b0b0b] px-5 py-20 md:px-8 md:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.24em] text-[#d7b46a]">
            {lang === "pl" ? "Współprace" : "Collaborations"}
          </p>
          <h2 className="mt-4 text-3xl text-white md:text-5xl">
            {lang === "pl"
              ? "Nie tylko projekty do portfolio — także realna praca dla firm."
              : "Not just portfolio pieces — real work for real businesses."}
          </h2>
          <p className="mt-5 max-w-2xl leading-8 text-zinc-400">
            {lang === "pl"
              ? "Poniżej pokazuję wybrane współprace za zgodą klientów. Zakres jest konkretny, a kontakt pozostaje bezpośredni — bez przekazywania projektu między kilkoma osobami."
              : "Selected collaborations shown with client permission. The scope is concrete and communication stays direct — without passing the project between several people."}
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {collaborations.map((collaboration) => (
            <article
              key={collaboration.name}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
            >
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                {lang === "pl" ? "Klient" : "Client"}
              </p>
              <h3 className="mt-3 text-xl text-[#f5dfae]">
                {collaboration.name}
              </h3>
              <p className="mt-2 text-sm text-zinc-500">
                {lang === "pl" ? "Kontakt: " : "Contact: "}
                {collaboration.person}
              </p>
              <p className="mt-5 text-sm leading-7 text-zinc-300">
                {lang === "pl" ? collaboration.pl : collaboration.en}
              </p>
            </article>
          ))}
        </div>

        <p className="mt-6 text-xs leading-6 text-zinc-500">
          {lang === "pl"
            ? "To opis zakresu współpracy, nie fikcyjne wyniki ani anonimowe rekomendacje. Cytaty klientów mogą pojawić się po ich osobnej akceptacji."
            : "This describes the collaboration scope, not invented results or anonymous testimonials. Client quotes can be added after separate approval."}
        </p>
      </div>
    </section>
  );
}
