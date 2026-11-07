import Link from "next/link";
import { guides } from "@/content/guides";
import { serviceMetadata } from "@/lib/seo";

export const metadata = serviceMetadata(
  "100 poradników: naprawa błędów, CRM, Next.js, SEO i Meta Ads",
  "Konkretne problemy i rozwiązania krok po kroku: CRM, Supabase, Vercel, Next.js, domeny, iCloud Mail, Google, SEO i reklamy Meta.",
  "poradniki"
);

const categories = [
  { id: "crm", label: "CRM i Supabase", summary: "Leady, RLS, uprawnienia, zadania, załączniki i powiadomienia.", category: "CRM i Supabase" },
  { id: "vercel", label: "Vercel, Next.js i frontend", summary: "Deploye, błędy produkcyjne, domeny i problemy na telefonie.", category: "Vercel, Next.js i frontend" },
  { id: "integracje", label: "Poczta, integracje i bezpieczeństwo", summary: "iCloud, OpenRouter, Meta webhook, Google Drive i phishing.", category: "Poczta, integracje i bezpieczeństwo" },
  { id: "seo", label: "SEO i reklamy Meta", summary: "Indeksacja, widoczność w Google, kampanie i analiza leadów.", category: "SEO i reklamy Meta" },
  { id: "pozostale", label: "Pozostałe poradniki", summary: "Wcześniejsze materiały o stronach, marketingu i popularnych błędach.", category: null },
] as const;

const sections = categories.map((category) => ({
  ...category,
  items: guides.filter((guide) => category.category === null
    ? !("category" in guide)
    : ("category" in guide && guide.category === category.category))
})).filter((category) => category.items.length > 0);

export default function GuidesPage() {
  return <main className="site-page mx-auto max-w-6xl px-5 pb-24 pt-36 md:px-8">
    <nav aria-label="Ścieżka strony"><Link href="/" className="text-white">Kacper Bernecki /</Link></nav>
    <p className="page-eyebrow mt-10">Błędy, diagnozy, rozwiązania</p>
    <h1 className="mt-5 max-w-5xl text-4xl leading-tight md:text-6xl">{guides.length} konkretnych poradników. Problemy, które da się rozwiązać.</h1>
    <p className="mt-6 max-w-3xl leading-8 text-white/70">Praktyczne scenariusze z pracy przy stronach, CRM i reklamach, w tym problemy spotkane podczas rozwoju moich projektów. Każdy tekst opisuje objawy, możliwą przyczynę, kroki diagnostyczne i sposób sprawdzenia wyniku. Tam, gdzie nie potwierdziłem skuteczności naprawy w konkretnym wdrożeniu, opisuję procedurę, a nie rzekomo zakończony sukces.</p>
    <nav aria-label="Kategorie poradników" className="mt-10 flex flex-wrap gap-3">
      {sections.map(section => <a key={section.id} href={`#${section.id}`} className="surface-card rounded-full border border-white/20 px-4 py-2 text-sm text-white hover:border-[var(--brand-accent)]">{section.label} ({section.items.length})</a>)}
    </nav>
    {sections.map(section => <section key={section.id} id={section.id} className="mt-16 scroll-mt-28">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4"><div><h2 className="text-3xl md:text-4xl">{section.label}</h2><p className="mt-3 max-w-2xl leading-7 text-white/70">{section.summary}</p></div><span className="text-sm text-white/60">{section.items.length} poradników</span></div>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {section.items.map((guide) => <article key={guide.slug} className="surface-card rounded-2xl border border-white/10 bg-[var(--brand-black)] p-6 hover:border-[var(--brand-accent)]">
          <h3 className="text-xl leading-snug"><Link href={`/poradniki/${guide.slug}`} className="hover:underline">{guide.title}</Link></h3>
          <p className="mt-4 leading-7 text-white/70">{guide.description}</p>
          <Link href={`/poradniki/${guide.slug}`} className="mt-6 inline-block text-sm text-white underline underline-offset-4">Zobacz rozwiązanie →</Link>
        </article>)}
      </div>
    </section>)}
  </main>;
}
