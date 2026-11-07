import Link from "next/link";

export default function NotFound() {
  return (
    <main className="site-page mx-auto min-h-[75vh] max-w-6xl px-5 pb-24 pt-40 md:px-8 md:pt-48">
      <p className="page-eyebrow">404 / Nie znaleziono strony</p>
      <h1 className="mt-6 max-w-3xl">Tej strony tu nie ma.</h1>
      <p className="page-intro mt-6 max-w-xl">
        Sprawdź adres albo wróć do portfolio. Znajdziesz tam realizacje, ofertę i kontakt.
      </p>
      <div className="mt-9 flex flex-wrap gap-3">
        <Link href="/" className="brand-action inline-flex px-5 py-3">Wróć do strony głównej</Link>
        <Link href="/case-studies" className="brand-outline inline-flex rounded-lg px-5 py-3">Zobacz realizacje</Link>
      </div>
    </main>
  );
}
