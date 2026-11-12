import type { Metadata } from "next";
import Link from "next/link";
import { GoogleAdsBudgetCalculator } from "./GoogleAdsBudgetCalculator";

const url = "https://bernecki.dev/narzedzia/kalkulator-budzetu-google-ads";
export const metadata: Metadata = {
  title: { absolute: "DARMOWY kalkulator Google Ads – budżet, CPC, CPL i koszt klienta" },
  description: "Darmowy kalkulator budżetu Google Ads bez rejestracji i karty. Policz kliknięcia, leady, CPL, koszt pozyskania klienta i marżę na podstawie własnych danych.",
  alternates: { canonical: url },
  openGraph: {
    title: "Darmowy kalkulator budżetu Google Ads – CPC, leady i CPL",
    description: "Sprawdź przykładowy koszt leada i klienta na własnych liczbach. Darmowe narzędzie, bez rejestracji.",
    url, locale: "pl_PL", type: "website",
  },
};
const schema = {
  "@context": "https://schema.org", "@type": "WebApplication",
  name: "Darmowy kalkulator budżetu Google Ads",
  description: "Kalkulator szacowanego kosztu CPC, CPL i pozyskania klienta na podstawie parametrów użytkownika.",
  url, applicationCategory: "BusinessApplication", operatingSystem: "Web",
  inLanguage: "pl-PL", isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "PLN" },
};
export default function GoogleAdsBudgetToolPage() {
  return (
    <main className="relative z-10 min-h-screen bg-[var(--brand-black)] px-5 pb-24 pt-28 text-white md:px-8 md:pt-36">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      <div className="mx-auto max-w-6xl">
        <nav aria-label="Ścieżka nawigacji" className="mb-8 text-sm text-white/60">
          <Link href="/">Start</Link> / <Link href="/narzedzia">Darmowe narzędzia</Link> / Kalkulator Google Ads
        </nav>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/60">DARMOWY · Bez rejestracji · Bez karty płatniczej</p>
        <h1 className="mt-6 max-w-5xl text-4xl font-semibold tracking-tight md:text-6xl">
          Kalkulator budżetu Google Ads
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-white/70">
          Oblicz hipotetyczny koszt kliknięcia, leada i pozyskania klienta.
          Wpisz własne założenia — narzędzie nie pobiera stawek z kont Google Ads
          i nie udaje, że zna rynkowy CPC Twojej branży.
        </p>
        <GoogleAdsBudgetCalculator />
      </div>
    </main>
  );
}
