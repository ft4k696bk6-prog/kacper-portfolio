import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategory, getGuideCounts, guideCategories, listGuides } from "@/lib/guide-directory";
import { serviceMetadata } from "@/lib/seo";
import { englishCategoryCounts } from "@/lib/guide-i18n";

export const dynamicParams = true;
export const revalidate = 86400;
type Props = { params: Promise<{ kategoria: string }>; searchParams: Promise<{ strona?: string }> };

export function generateStaticParams() {
  const published = new Set(getGuideCounts().filter((item) => item.count > 0).map((item) => item.slug));
  return guideCategories.filter((category) => published.has(category.slug)).map((category) => ({ kategoria: category.slug }));
}

function parsePage(value?: string) {
  const page = Number(value ?? "1");
  return Number.isSafeInteger(page) && page > 0 ? page : 1;
}

export async function generateMetadata({ params, searchParams }: Props) {
  const [{ kategoria }, search] = await Promise.all([params, searchParams]);
  const category = getCategory(kategoria);
  if (!category) notFound();
  const { total, page } = listGuides({ category: kategoria, page: parsePage(search.strona) });
  if (!total) notFound();
  const metadata = serviceMetadata(
    `${category.label} — poradniki i rozwiązywanie błędów`,
    category.description,
    `poradniki/tematy/${kategoria}`
  );
  return {
    ...metadata,
    alternates: {
      canonical: `https://bernecki.dev/poradniki/tematy/${kategoria}${page > 1 ? `?strona=${page}` : ""}`,
      ...(page===1&&englishCategoryCounts().some(c=>c.slug===kategoria&&c.count>0)?{languages:{"pl-PL":`https://bernecki.dev/poradniki/tematy/${kategoria}`,en:`https://bernecki.dev/en/guides/topics/${kategoria}`}}:{})
    },
    openGraph:{...metadata.openGraph,url:`https://bernecki.dev/poradniki/tematy/${kategoria}${page>1?`?strona=${page}`:""}`},
    robots: { index: true, follow: true }
  };
}

export default async function GuideCategoryPage({ params, searchParams }: Props) {
  const [{ kategoria }, search] = await Promise.all([params, searchParams]);
  const category = getCategory(kategoria);
  if (!category) notFound();
  const { items, total, page, pages } = listGuides({ category: kategoria, page: parsePage(search.strona) });
  const numericStart = Math.max(1, Math.min(pages - 4, page - 2));
  const pageNumbers = [...new Set([1, ...Array.from({length: Math.min(5,pages)}, (_,i)=>numericStart+i), pages])].filter(n=>n>=1 && n<=pages).sort((a,b)=>a-b);
  if (!total) notFound();
  const url = `https://bernecki.dev/poradniki/tematy/${kategoria}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.label,
    description: category.description,
    url,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: items.map((guide, index) => ({
        "@type": "ListItem",
        position: (page - 1) * 24 + index + 1,
        name: guide.title,
        url: `https://bernecki.dev/poradniki/${guide.slug}`
      }))
    }
  };

  return <main className="site-page editorial-page mx-auto max-w-5xl px-5 pb-24 pt-36 md:px-8">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    <nav aria-label="Ścieżka strony" className="flex flex-wrap gap-2 text-sm text-white/65">
      <Link href="/" className="underline underline-offset-4">Kacper Bernecki</Link><span>/</span>
      <Link href="/poradniki" className="underline underline-offset-4">Poradniki</Link><span>/</span>
      <span>{category.label}</span>
    </nav>
    <header className="mt-10">
      <p className="page-eyebrow">Poradniki według problemu</p>
      <h1 className="mt-5 text-4xl leading-tight md:text-5xl">{category.label}</h1>
      <p className="mt-6 max-w-3xl text-lg leading-8 text-white/75">{category.description}</p>
      <p className="mt-4 text-sm text-white/65">{total} opublikowanych poradników w tej kategorii</p>
    </header>
    <section aria-label="Poradniki" className="mt-10 grid gap-4 sm:grid-cols-2">
      {items.map((guide) => <Link key={guide.slug} href={`/poradniki/${guide.slug}`} className="surface-card rounded-2xl border border-white/15 p-6 transition-colors hover:border-white/50">
        <h2 className="text-xl text-white">{guide.title}</h2>
        <p className="mt-3 leading-7 text-white/70">{guide.description}</p>
        <span className="mt-5 inline-block text-sm underline underline-offset-4">Zobacz rozwiązanie</span>
      </Link>)}
    </section>
    {pages > 1 && <nav aria-label="Strony kategorii" className="mt-10 flex flex-wrap items-center justify-between gap-4 text-sm">
      {page > 1 ? <Link className="underline underline-offset-4" href={page === 2 ? `/poradniki/tematy/${kategoria}` : `/poradniki/tematy/${kategoria}?strona=${page - 1}`}>Poprzednia</Link> : <span />}
      <div className="flex flex-wrap items-center gap-2">{pageNumbers.map(n=><Link key={n} href={n===1 ? `/poradniki/tematy/${kategoria}` : `/poradniki/tematy/${kategoria}?strona=${n}`} aria-current={page===n ? "page" : undefined} className={`rounded-lg border px-3 py-2 ${page===n?"border-white/70 bg-white/15":"border-white/20"}`}>{n}</Link>)}</div>
      {page < pages ? <Link className="underline underline-offset-4" href={`/poradniki/tematy/${kategoria}?strona=${page + 1}`}>Następna</Link> : <span />}
    </nav>}
    <div className="mt-12"><Link href="/poradniki" className="underline underline-offset-4">Wróć do wszystkich poradników</Link></div>
  </main>;
}
