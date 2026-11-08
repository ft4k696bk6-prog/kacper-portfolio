import type { Metadata } from "next";
import Link from "next/link";
import { PrintChecklistButton } from "@/components/PrintChecklistButton";
import { BriefPrintStyles } from "@/components/BriefPrintStyles";

const url = "https://bernecki.dev/materialy/brief-crm";
export const metadata: Metadata = {
  title: "Brief CRM dla firmy — checklista przed wdrożeniem",
  description: "Przygotuj proces sprzedaży, role, statusy, integracje, dane i priorytety przed wyceną CRM. Praktyczna checklista bez rejestracji.",
  alternates: { canonical: url },
  openGraph: { title: "Brief systemu CRM — checklista", description: "Lista pytań przed wdrożeniem systemu CRM.", url, type: "article" },
};
const sections = [
  { title: "Proces sprzedaży", items: ["Skąd przychodzą leady: formularz, Meta Ads, telefon, polecenia, e-mail?", "Jakie etapy przechodzi klient od zapytania do podpisania umowy?", "Kto odpowiada za pierwszy kontakt i ponowienie rozmowy?"] },
  { title: "Role i uprawnienia", items: ["Kto będzie pracował w CRM: handlowiec, menedżer, administracja, realizacja?", "Które dane każdy pracownik ma widzieć i edytować?", "Czy potrzebne są zespoły, regiony, hierarchia i akceptacje?"] },
  { title: "Dane i integracje", items: ["W jakich plikach i narzędziach są obecne kontakty i historia ustaleń?", "Czy wymagany jest import z Excela oraz usuwanie duplikatów?", "Jakie systemy trzeba połączyć: poczta, formularze, kalendarz, reklamy, dokumenty?"] },
  { title: "Widoki i automatyzacje", items: ["Jakie informacje musi mieć karta klienta?", "Które przypomnienia, powiadomienia i raporty są rzeczywiście potrzebne?", "Czy CRM ma obsługiwać również ofertowanie, umowy lub realizację?"] },
  { title: "Bezpieczeństwo i wdrożenie", items: ["Kto jest administratorem danych, kto ma je przetwarzać i jak długo?", "Jakie są wymagania dotyczące uprawnień, kopii zapasowych i audytu zmian?", "Co jest konieczne w pierwszej wersji, a co można dobudować po pilotażu?"] },
];
export default function CrmBrief() {
 return <main className="printable-brief site-page min-h-screen bg-[var(--brand-black)] px-5 pb-24 pt-32 text-white md:px-8 md:pt-40">
    <BriefPrintStyles />
  <div className="mx-auto max-w-4xl">
   <Link href="/crm-dla-firm-handlowych" className="print:hidden text-sm text-white/65 underline">← Oferta CRM</Link>
   <p className="mt-9 text-xs uppercase tracking-[.2em] text-white/55">Bezpłatny materiał · bez rejestracji</p>
   <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-5xl">Brief systemu CRM dla firmy</h1>
   <p className="mt-5 max-w-3xl text-lg leading-8 text-white/70">CRM warto wyceniać na podstawie procesu, ról i danych — nie na podstawie liczby przycisków. Zaznacz, na co masz już odpowiedź.</p>
   <div className="mt-8 flex flex-wrap gap-3"><PrintChecklistButton/><Link href="/kontakt?usluga=CRM%20i%20aplikacja" className="print:hidden rounded-lg bg-white px-5 py-3 text-sm font-semibold text-black">Porozmawiaj o wdrożeniu CRM</Link></div>
   <div className="mt-12 space-y-7">{sections.map((section,i)=><section key={section.title} className="rounded-xl border border-white/15 p-6">
    <h2 className="text-2xl font-semibold">{i+1}. {section.title}</h2>
    <ul className="mt-5 space-y-4">{section.items.map(item=><li key={item}><label className="flex items-start gap-3 leading-7 text-white/80"><input type="checkbox" className="mt-1.5 h-4 w-4 shrink-0 accent-white"/><span>{item}</span></label></li>)}</ul>
   </section>)}</div>
   <p className="mt-10 text-sm leading-7 text-white/65">Liczba ról, migracja danych, bezpieczeństwo oraz integracje wpływają na koszt. Pilotaż na jednym procesie pozwala sprawdzić dopasowanie bez wdrażania wszystkich modułów jednocześnie.</p>
   <Link href="/poradniki/crm-na-zamowienie-czy-gotowy" className="mt-4 inline-block text-sm underline">Przeczytaj: gotowy CRM czy dedykowany?</Link>
  </div>
 </main>;
}
