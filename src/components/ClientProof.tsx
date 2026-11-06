"use client";

import { useLanguage } from "@/contexts/LanguageContext";

const collaborations = [
  { name: "Majka Szado Walter", person: null, url: "https://rzeszow-adwokat.pl/", pl: "Współpraca z kancelarią adwokacką w Rzeszowie.", en: "Collaboration with a law firm in Rzeszów." },
  {
    name: "Jalapeno Kebab Niemce",
    person: "Arek",
    url: "https://www.instagram.com/jalapeno_kebab/",
    pl: "Reklamy, marketing i prowadzenie social mediów.",
    en: "Advertising, marketing and social media management.",
  },
  {
    name: "Re-energy System",
    person: "Bartłomiej",
    url: "https://re-energysystem.pl/",
    pl: "Strona internetowa, reklamy i CRM — od koncepcji po wdrożenie.",
    en: "Website, advertising and CRM — from concept to implementation.",
  },
  {
    name: "StarCars",
    person: "Przemysław",
    url: "https://star-cars.us",
    pl: "Strona internetowa, reklamy, marketing i rozwój obecności online.",
    en: "Website, advertising, marketing and ongoing online presence.",
  },
  {
    name: "Gentlemen Barber Warszawa",
    person: "Kacper",
    url: null,
    pl: "Współpraca z salonem barberskim w Warszawie.",
    en: "Collaboration with a Warsaw barbershop.",
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
          <p className="text-sm uppercase tracking-[0.24em] text-[#f4f4f5]">
            {lang === "pl" ? "Współprace" : "Collaborations"}
          </p>
          <h2 className="mt-4 text-3xl text-white md:text-5xl">
            {lang === "pl"
              ? "Firmy, z którymi współpracuję."
              : "Businesses I work with."}
          </h2>
          <p className="mt-5 max-w-2xl leading-8 text-zinc-400">
            {lang === "pl"
              ? "Poniżej pokazuję wybrane współprace za zgodą klientów. Zakres jest konkretny, a kontakt pozostaje bezpośredni — bez przekazywania projektu między kilkoma osobami."
              : "Selected collaborations shown with client permission. The scope is concrete and communication stays direct — without passing the project between several people."}
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {collaborations.map((collaboration) => (
            <article
              key={collaboration.name}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
            >
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                {lang === "pl" ? "Klient" : "Client"}
              </p>
              <h3 className="mt-3 text-xl text-[#e4e4e7]">
                {collaboration.name}
              </h3>
              {collaboration.person && <p className="mt-2 text-sm text-zinc-500">
                {lang === "pl" ? "Współpraca z: " : "Working with: "}
                {collaboration.person}
              </p>}
              <p className="mt-5 text-sm leading-7 text-zinc-300">
                {lang === "pl" ? collaboration.pl : collaboration.en}
              </p>
              {collaboration.url && <a href={collaboration.url} target="_blank" rel="noopener noreferrer" className="mt-5 inline-block text-sm text-[#f4f4f5] underline underline-offset-4">{lang === "pl" ? "Strona lub profil firmy ↗" : "Business website or profile ↗"}</a>}
            </article>
          ))}
        </div>


      </div>
    </section>
  );
}
