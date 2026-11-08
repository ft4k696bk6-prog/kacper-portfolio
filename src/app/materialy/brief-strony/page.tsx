import type { Metadata } from "next";
import Link from "next/link";
import { PrintChecklistButton } from "@/components/PrintChecklistButton";

const url = "https://bernecki.dev/materialy/brief-strony";
export const metadata: Metadata = {
  title: "Brief strony internetowej — lista pytań przed wyceną",
  description: "Praktyczna lista informacji do wyceny strony internetowej: cel, oferta, treści, funkcje, integracje, termin i utrzymanie. Bez rejestracji.",
  alternates: { canonical: url },
  openGraph: { title: "Brief strony internetowej — checklista", description: "Przygotuj zakres przed wyceną strony.", url, type: "article" },
};

const sections = [
  { title: "Cel i odbiorcy", items: ["Co klient ma zrobić na stronie: zadzwonić, wysłać formularz, złożyć zamówienie?", "Dla kogo jest oferta i na jakim obszarze działa firma?", "Jakie 2–3 strony konkurencji lub inspiracje warto przejrzeć?"] },
  { title: "Treści i struktura", items: ["Jakie usługi lub produkty trzeba pokazać?", "Czy są gotowe teksty, logo, zdjęcia i opinie z prawem do publikacji?", "Jakie podstrony i wersje językowe są naprawdę potrzebne?"] },
  { title: "Funkcje i integracje", items: ["Formularz, telefon, mapa, kalendarz, płatności — co musi działać w pierwszej wersji?", "Czy stronę trzeba połączyć z CRM, reklamami lub pocztą?", "Kto otrzymuje i obsługuje zgłoszenia?"] },
  { title: "Technika i utrzymanie", items: ["Czy istnieje domena i hosting oraz kto ma do nich dostęp?", "Kto aktualizuje treści, dba o kopie i bezpieczeństwo?", "Jakie zdarzenia mierzyć po uruchomieniu, zgodnie ze zgodą użytkownika?"] },
  { title: "Budżet i termin", items: ["Kiedy strona musi być gotowa i co jest absolutnym minimum?", "Czy budżet obejmuje teksty, zdjęcia, domenę, hosting i utrzymanie?", "Kto zatwierdza projekt i przekazuje materiały?"] },
];
export default function WebsiteBrief() {
  return <main className="site-page min-h-screen bg-[var(--brand-black)] px-5 pb-24 pt-32 text-white md:px-8 md:pt-40">
    <div className="mx-auto max-w-4xl">
      <Link href="/tworzenie-stron-internetowych" className="print:hidden text-sm text-white/65 underline">← Tworzenie stron internetowych</Link>
      <p className="mt-9 text-xs uppercase tracking-[.2em] text-white/55">Bezpłatny materiał · bez zapisu na newsletter</p>
      <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-5xl">Brief strony internetowej</h1>
      <p className="mt-5 max-w-3xl text-lg leading-8 text-white/70">Zaznacz, co już wiesz. Nie musisz mieć wszystkich odpowiedzi — ta lista pomaga uniknąć niepełnej wyceny i późniejszych kosztownych zmian.</p>
      <div className="mt-8 flex flex-wrap gap-3"><PrintChecklistButton/><Link href="/kontakt?usluga=Strona%20internetowa%20lub%20sklep" className="print:hidden rounded-lg bg-white px-5 py-3 text-sm font-semibold text-black">Omów brief i poproś o wycenę</Link></div>
      <div className="mt-12 space-y-7">{sections.map((section,i)=><section key={section.title} className="rounded-xl border border-white/15 p-6">
        <h2 className="text-2xl font-semibold">{i+1}. {section.title}</h2>
        <ul className="mt-5 space-y-4">{section.items.map(item=><li key={item}><label className="flex items-start gap-3 leading-7 text-white/80"><input type="checkbox" className="mt-1.5 h-4 w-4 shrink-0 accent-white"/><span>{item}</span></label></li>)}</ul>
      </section>)}</div>
      <p className="mt-10 text-sm leading-7 text-white/65">Cena nie wynika tylko z liczby podstron. Wpływają na nią również jakość materiałów, integracje, zakres projektowania, migracja i późniejsze utrzymanie.</p>
      <Link href="/poradniki/ile-kosztuje-strona-internetowa" className="mt-4 inline-block text-sm underline">Zobacz poradnik o kosztach strony</Link>
    </div>
  </main>;
}
