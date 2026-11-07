import Link from "next/link";
import { getGuideCounts, guideCategory, getCategory, listGuides } from "@/lib/guide-directory";
import { serviceMetadata } from "@/lib/seo";
import { getEnglishGuides } from "@/lib/guide-i18n";

type Props = { searchParams: Promise<{ q?: string; strona?: string }> };

export async function generateMetadata({ searchParams }: Props) {
  const params = await searchParams;
  const metadata = serviceMetadata(
    "Poradniki: błędy Vercel, CRM, Meta Ads, Supabase i stron",
    "Praktyczne poradniki rozwiązywania błędów w programowaniu, reklamach, CRM, SEO i integracjach. Diagnostyka, rozwiązanie i test poprawności.",
    "poradniki"
  );
  const pageNumber = Number(params.strona ?? "1");
  const page = Number.isSafeInteger(pageNumber) && pageNumber > 1 ? pageNumber : 1;
  return {
    ...metadata,
    alternates: {
      canonical: `https://bernecki.dev/poradniki${!params.q && page > 1 ? `?strona=${page}` : ""}`,
      ...(getEnglishGuides().length>0&&!params.q&&page===1?{languages:{"pl-PL":"https://bernecki.dev/poradniki",en:"https://bernecki.dev/en/guides"}}:{})
    },
    robots: params.q ? { index: false, follow: true } : { index: true, follow: true }
  };
}

export default async function GuidesPage({ searchParams }: Props) {
  const params = await searchParams;
  const query = (params.q ?? "").slice(0, 100);
  const parsedPage = Number(params.strona ?? "1");
  const { items, total, page, pages } = listGuides({
    query,
    page: Number.isSafeInteger(parsedPage) ? parsedPage : 1
  });
  const categories = getGuideCounts().filter((category) => category.count > 0);
  const start = Math.max(1, Math.min(pages - 4, page - 2));
  const numbers = [...new Set([1, ...Array.from({length: Math.min(5, pages)}, (_, i) => start + i), pages])].filter(n => n >= 1 && n <= pages).sort((a,b)=>a-b);
  const pageUrl = (next: number) => {
    const search = new URLSearchParams();
    if (query) search.set("q", query);
    if (next > 1) search.set("strona", String(next));
    return `/poradniki${search.size ? `?${search}` : ""}`;
  };

  return <main className="site-page editorial-page mx-auto max-w-6xl px-5 pb-24 pt-36 md:px-8">
    <nav className="text-sm text-white/65" aria-label="Ścieżka strony"><Link href="/" className="underline underline-offset-4">Kacper Bernecki</Link> / Poradniki</nav>
    <header className="mt-10">
      <p className="page-eyebrow">Baza rozwiązań • praktyczne problemy</p>
      <h1 className="mt-5 max-w-5xl text-4xl leading-tight md:text-6xl">Nie działa? Znajdź przyczynę i napraw.</h1>
      <p className="mt-6 max-w-3xl text-lg leading-8 text-white/75">Praktyczne rozwiązania problemów ze stronami internetowymi, CRM, reklamami Meta, SEO, WordPressem i integracjami. Wybierz temat, sprawdź możliwe przyczyny, wykonaj kolejne kroki i przetestuj rezultat.</p>
      <form role="search" action="/poradniki" method="get" className="mt-8 flex max-w-3xl flex-wrap gap-3">
        <label htmlFor="guide-search" className="sr-only">Szukaj rozwiązania lub komunikatu błędu</label>
        <input id="guide-search" name="q" type="search" maxLength={100} defaultValue={query} placeholder="Np. Vercel deployment, RLS, formularz..." className="min-w-0 flex-1 rounded-xl border border-white/25 bg-[var(--brand-black)] px-5 py-4 text-white placeholder:text-white/55" />
        <button type="submit" className="brand-action rounded-xl px-6 py-4 text-black">Szukaj</button>
      </form>
    </header>

    <section className="mt-14" aria-labelledby="guide-categories-heading">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 id="guide-categories-heading" className="text-2xl md:text-3xl">Przeglądaj tematami</h2>
        <span className="text-sm text-white/60">{total} poradników{query ? " pasujących do wyszukiwania" : ""}</span>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => <Link href={`/poradniki/tematy/${category.slug}`} key={category.slug} className="surface-card rounded-xl border border-white/15 p-5 transition-colors hover:border-white/50">
          <div className="flex items-start justify-between gap-3"><h3 className="text-lg text-white">{category.label}</h3><span className="text-sm text-white/60">{category.count}</span></div>
          <p className="mt-2 text-sm leading-6 text-white/65">{category.description}</p>
        </Link>)}
      </div>
    </section>

    <section className="mt-14" aria-labelledby="guide-results-heading">
      <h2 id="guide-results-heading" className="text-2xl md:text-3xl">{query ? `Wyniki dla: „${query}”` : "Wszystkie poradniki"}</h2>
      {items.length === 0
        ? <p className="mt-6 text-white/70">Brak poradników pasujących do tego wyszukiwania. Spróbuj krótszego komunikatu albo wybierz kategorię.</p>
        : <div className="mt-7 grid gap-4 md:grid-cols-2">
            {items.map((guide) => <Link key={guide.slug} href={`/poradniki/${guide.slug}`} className="surface-card block rounded-2xl border border-white/15 bg-[var(--brand-black)] p-6 transition-colors hover:border-white/50">
              <span className="text-xs text-white/60">{getCategory(guideCategory(guide))?.label}</span>
              <h3 className="mt-3 text-xl leading-snug text-white">{guide.title}</h3>
              <p className="mt-3 leading-7 text-white/65">{guide.description}</p>
              <span className="mt-5 inline-block text-sm font-medium text-white underline underline-offset-4">Czytaj rozwiązanie</span>
            </Link>)}
          </div>}
      {pages > 1 && <nav aria-label="Strony wyników" className="mt-9 flex flex-wrap items-center justify-between gap-4 text-sm">
        <div>{page > 1 ? <Link className="underline underline-offset-4" href={pageUrl(page - 1)}>Poprzednia strona</Link> : <span className="text-white/40">Poprzednia strona</span>}</div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {numbers.map(n => <Link key={n} href={pageUrl(n)} aria-current={page === n ? "page" : undefined} className={`rounded-lg border px-3 py-2 ${page === n ? "border-white/70 bg-white/15 text-white" : "border-white/20 text-white/75 hover:border-white/60"}`}>{n}</Link>)}
        </div>
        <div>{page < pages ? <Link className="underline underline-offset-4" href={pageUrl(page + 1)}>Następna strona</Link> : <span className="text-white/40">Następna strona</span>}</div>
      </nav>}
    </section>
  </main>;
}
