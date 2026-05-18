import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";

export const metadata: Metadata = {
  title: "B-CRM Case Study — CRM do obsługi leadów",
  description:
    "Case study B-CRM: production-like CRM demo do obsługi leadów, ról użytkowników, callbacków, spotkań, komentarzy i dashboardów.",
  alternates: {
    canonical: "https://kacper-portfolio.vercel.app/b-crm-case-study",
  },
};

const sections = [
  {
    title: "Problem",
    body:
      "Firmy obsługujące leady sprzedażowe potrzebują miejsca do kontroli statusów, kontaktów, callbacków, spotkań, komentarzy i pracy kilku ról użytkowników.",
  },
  {
    title: "Cel projektu",
    body:
      "Zbudowanie aplikacji webowej, która porządkuje proces obsługi leadów i daje różne widoki dla admina, menadżera i handlowca.",
  },
  {
    title: "Stack",
    body:
      "React, TypeScript, Next.js, Supabase, PostgreSQL, Tailwind CSS i Vercel.",
  },
];

const roles = [
  {
    name: "Admin",
    description:
      "Zarządza CRM operacyjnie: widzi dane zespołu, obsługuje panel administracyjny, import danych, leady, użytkowników i ustawienia systemowe.",
  },
  {
    name: "Menadżer",
    description:
      "Pracuje na widoku zespołu, rozdziela leady, kontroluje statusy, raporty i aktywności handlowców.",
  },
  {
    name: "Handlowiec",
    description:
      "Obsługuje przypisane leady, zmienia statusy, dodaje komentarze, planuje callbacki, spotkania i pracuje z ofertami.",
  },
];

const features = [
  "Logowanie i konta demo",
  "Role użytkowników i reguły uprawnień",
  "Dashboardy dla pracy operacyjnej",
  "Zarządzanie leadami",
  "Statusy leadów i historia działań",
  "Komentarze, callbacki i spotkania",
  "Widok kalendarza",
  "Import/eksport danych CSV",
  "Oferty PDF i kalkulatory ofertowe",
  "Panel admina i zarządzanie użytkownikami",
];

const technicalDecisions = [
  "Supabase łączy auth, PostgreSQL i szybkie prototypowanie backendu w jednym środowisku.",
  "Role są mapowane w kodzie aplikacji i wspierane przez polityki bazy oraz helpery uprawnień.",
  "Aplikacja pracuje z danymi przez klienta Supabase oraz route handlers dla operacji wymagających walidacji serwerowej.",
  "Podział widoków kieruje użytkownika do ekranu zgodnego z rolą: panel admina, sales view albo realizacja.",
  "Największe ryzyka to brak pełnego pokrycia testami e2e, duże komponenty ekranów i potrzeba mocniejszego monitoringu błędów.",
];

const learned = [
  "Projektowanie ról i uprawnień w aplikacji CRM",
  "Praca z bazą PostgreSQL i Supabase auth",
  "Budowa dashboardów i filtrów dla danych operacyjnych",
  "Organizacja większej aplikacji Next.js",
  "Deploy aplikacji webowej na Vercel",
  "Obsługa statusów, formularzy i workflow leadów",
];

const roadmap = [
  "Dodać więcej testów jednostkowych i Playwright smoke tests",
  "Wzmocnić CI oraz automatyczne sprawdzanie build/typecheck/lint",
  "Rozbić największe komponenty ekranów na mniejsze moduły",
  "Dodać lepsze logowanie błędów i analytics",
  "Poprawić UX tabel na mobile",
  "Rozszerzyć dokumentację techniczną i seed demo data",
];

export default function BcrmCaseStudyPage() {
  return (
    <main className="min-h-screen bg-[#070707] px-5 py-10 text-white md:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-md border border-white/10 px-4 py-2 text-sm text-zinc-300 transition-colors hover:border-[#d7b46a]/60 hover:text-[#f5dfae]"
        >
          <ArrowLeft className="h-4 w-4" />
          Portfolio
        </Link>

        <section className="py-14">
          <p className="text-sm uppercase tracking-[0.28em] text-[#d7b46a]">
            Case study
          </p>
          <h1 className="mt-5 max-w-4xl text-5xl leading-tight text-white md:text-6xl">
            B-CRM — aplikacja CRM do obsługi leadów i procesu sprzedażowego
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-300">
            Production-like CRM demo pokazujące praktyczne zastosowanie React,
            TypeScript, Next.js, Supabase i PostgreSQL w aplikacji biznesowej.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="https://b-crm-berni.vercel.app/login"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-[#d7b46a] px-5 py-3 text-sm text-black"
            >
              <ExternalLink className="h-4 w-4" />
              Live demo
            </a>
            <a
              href="https://github.com/ft4k696bk6-prog/B-CRM"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-white/15 px-5 py-3 text-sm text-white hover:border-[#d7b46a]/60 hover:text-[#f5dfae]"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {sections.map((section) => (
            <article
              key={section.title}
              className="rounded-md border border-white/10 bg-white/[0.035] p-5"
            >
              <h2 className="text-xl text-white">{section.title}</h2>
              <p className="mt-3 text-sm leading-7 text-zinc-300">{section.body}</p>
            </article>
          ))}
        </section>

        <section className="mt-12 rounded-md border border-white/10 bg-white/[0.035] p-6">
          <h2 className="text-3xl text-white">Użytkownicy i role</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {roles.map((role) => (
              <div key={role.name} className="rounded-md border border-white/10 bg-black/20 p-4">
                <h3 className="text-lg text-[#f5dfae]">{role.name}</h3>
                <p className="mt-3 text-sm leading-7 text-zinc-300">{role.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 grid gap-6 lg:grid-cols-2">
          <InfoList title="Najważniejsze funkcje" items={features} />
          <InfoList title="Decyzje techniczne" items={technicalDecisions} />
          <InfoList title="Czego się nauczyłem" items={learned} />
          <InfoList title="Co poprawiłbym dalej" items={roadmap} />
        </section>

        <section className="mt-12 rounded-md border border-white/10 bg-white/[0.035] p-6">
          <h2 className="text-3xl text-white">Ograniczenia projektu</h2>
          <p className="mt-4 text-sm leading-7 text-zinc-300">
            B-CRM jest demo portfolio o charakterze production-like. Pokazuje
            realne wzorce aplikacji biznesowej, ale przed użyciem produkcyjnym
            wymagałby pełniejszego pokrycia testami, monitoringu błędów,
            przeglądu bezpieczeństwa, procesu migracji danych i dopracowania UX
            dla wszystkich ról na urządzeniach mobilnych.
          </p>
        </section>
      </div>
    </main>
  );
}

function InfoList({ title, items }: { title: string; items: string[] }) {
  return (
    <article className="rounded-md border border-white/10 bg-white/[0.035] p-6">
      <h2 className="text-2xl text-white">{title}</h2>
      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-7 text-zinc-300">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d7b46a]" />
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}
