import type { Metadata } from "next";
import Link from "next/link";
import { AiImageOriginChecker } from "@/components/AiImageOriginChecker";

const url = "https://bernecki.dev/narzedzia/sprawdz-czy-zdjecie-ai";
export const metadata: Metadata = {
  title: "Sprawdź, czy zdjęcie jest AI — darmowa analiza | bernecki.dev",
  description: "Darmowe sprawdzanie metadanych zdjęcia pod kątem śladów generatorów AI i znaczników C2PA. Lokalnie, bez przesyłania pliku, bez rejestracji i bez karty kredytowej. Wynik nie stanowi dowodu pochodzenia.",
  alternates: { canonical: url, languages: { "pl-PL": url, en: "https://bernecki.dev/en/tools/ai-image-check" } },
  openGraph: { title: "Czy zdjęcie powstało w AI? Sprawdź metadane", description: "Lokalna analiza śladów AI w zdjęciach JPEG, PNG i WebP.", url, type: "website" },
};
export default function AiImageCheckPage() {
  return <main className="site-page mx-auto max-w-7xl px-5 pb-24 pt-32 md:px-8">
    <nav aria-label="Ścieżka strony" className="text-xs text-white/60"><Link href="/" className="underline underline-offset-4">Strona główna</Link><span className="mx-2">/</span><Link href="/narzedzia" className="underline underline-offset-4">Narzędzia</Link><span className="mx-2">/</span>Sprawdzanie zdjęć AI</nav>
    <header className="mx-auto mb-10 mt-12 max-w-4xl">
      <p className="page-eyebrow">DARMOWE NARZĘDZIE / BEZ REJESTRACJI</p>
      <h1 className="mt-5">Darmowe sprawdzanie zdjęć AI</h1>
      <p className="page-intro mt-5 max-w-3xl text-base md:text-lg">Sprawdź, czy w pliku zapisano ślady generatorów obrazów AI. Narzędzie nie wydaje pewnego werdyktu na podstawie wyglądu zdjęcia — analizuje dostępne metadane.</p>
    </header>
    <AiImageOriginChecker lang="pl"/>
    <p className="mx-auto mt-8 max-w-4xl text-sm leading-7 text-white/60">Brak śladów AI nie potwierdza autentyczności zdjęcia. Poświadczenia C2PA wymagają osobnej weryfikacji kryptograficznej. <Link href="/narzedzia" className="underline underline-offset-4">Wróć do katalogu narzędzi</Link>.</p>
  </main>;
}
