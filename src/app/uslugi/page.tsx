import type { Metadata } from "next";
import Link from "next/link";
import { serviceCities } from "@/lib/service-cities";

export const metadata: Metadata = {
  title: "Strony internetowe, CRM, marketing i AI — obsługa firm w całej Polsce",
  description: "Usługi tworzenia stron internetowych, CRM, aplikacji, marketingu i automatyzacji AI dla firm z całej Polski. Przegląd obsługiwanych miast i sposobu współpracy.",
  alternates: { canonical: "https://bernecki.dev/uslugi" },
};

const offers = [
  ["Strony internetowe", "/tworzenie-stron-internetowych"],
  ["CRM i aplikacje webowe", "/crm-i-aplikacje-webowe"],
  ["Marketing i reklamy", "/marketing-i-reklamy"],
  ["AI i automatyzacje", "/wdrozenia-ai-dla-firm"],
  ["Rozwój biznesu", "/rozwoj-biznesu"],
] as const;

export default function ServicesIndex() {
  return (
    <main className="relative z-10 min-h-screen bg-[var(--brand-black)] px-5 pb-24 pt-28 text-white md:px-8 md:pt-36">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-[.16em] text-white/60">Obsługa zdalna firm w całej Polsce</p>
        <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">Strony, CRM, marketing i AI — usługi dla firm w Polsce</h1>
        <p className="mt-7 max-w-3xl text-lg leading-8 text-white/70">Współpracuję z przedsiębiorcami niezależnie od miejsca prowadzenia działalności. Projekt i konsultacje mogą odbywać się zdalnie. Nie deklaruję fizycznych biur w podanych miastach.</p>
        <h2 className="mt-14 text-2xl font-semibold">Zakres usług</h2>
        <div className="mt-6 flex flex-wrap gap-3">
          {offers.map(([name, href]) => <Link key={href} className="rounded-full border border-white/25 px-5 py-3 hover:bg-white/10" href={href}>{name}</Link>)}
        </div>
        <h2 className="mt-14 text-2xl font-semibold">Miasta, dla których przygotowano informacje o ofercie</h2>
        <p className="mt-3 text-white/65">Wybierz miasto i sprawdź zakres współpracy, etapy realizacji oraz dostępne usługi.</p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {serviceCities.map(city => <Link key={city.slug} href={`/uslugi/${city.slug}`} className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-5 font-medium hover:border-white/35 hover:bg-white/[0.08]">{city.name} <span aria-hidden="true">↗</span></Link>)}
        </div>
        <Link href="/kontakt" className="mt-14 inline-block rounded-full bg-white px-7 py-4 font-semibold text-black">Omów projekt i wycenę</Link>
      </div>
    </main>
  );
}
