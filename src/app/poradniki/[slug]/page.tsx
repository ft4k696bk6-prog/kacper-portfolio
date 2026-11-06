import Link from "next/link";
import { notFound } from "next/navigation";
import { guides } from "@/content/guides";
import { serviceMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return guides.map(({slug}) => ({slug})); }
export async function generateMetadata({params}: Props) {
  const {slug} = await params;
  const guide = guides.find(g => g.slug === slug);
  if (!guide) notFound();
  return serviceMetadata(guide.title, guide.description, `poradniki/${slug}`);
}
export default async function GuidePage({params}: Props) {
  const {slug} = await params;
  const guide = guides.find(g => g.slug === slug);
  if (!guide) notFound();
  const url = `https://bernecki.dev/poradniki/${slug}`;
  const data = {"@context":"https://schema.org", "@graph":[
    {"@type":"Article", "@id":`${url}#article`, headline:guide.title, description:guide.description, mainEntityOfPage:url, inLanguage:"pl-PL", author:{"@type":"Person", "@id":"https://bernecki.dev/#person", name:"Kacper Bernecki", url:"https://bernecki.dev/"}, image:"https://bernecki.dev/opengraph-image"},
    {"@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"Kacper Bernecki",item:"https://bernecki.dev/"},{"@type":"ListItem",position:2,name:"Poradniki",item:"https://bernecki.dev/poradniki"},{"@type":"ListItem",position:3,name:guide.title,item:url}]}
  ]};
  return <main className="mx-auto max-w-4xl px-5 pb-24 pt-36 md:px-8">
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(data).replace(/</g,"\\u003c")}} />
    <nav aria-label="Ścieżka strony" className="flex flex-wrap gap-2 text-sm text-white"><Link href="/">Kacper Bernecki</Link><span>/</span><Link href="/poradniki">Poradniki</Link></nav>
    <article>
      <h1 className="mt-8 text-4xl leading-tight md:text-5xl">{guide.title}</h1>
      <p className="mt-5 text-sm text-white/70">Autor: <Link href="/#about" className="underline">Kacper Bernecki</Link> · Strony, aplikacje i marketing dla firm</p>
      <p className="mt-8 rounded-2xl border border-white/25 bg-[var(--brand-black)] p-6 text-lg leading-8 text-white">{guide.intro}</p>
      <nav aria-label="Spis treści" className="my-10 rounded-xl border border-white/10 p-6"><p className="mb-4 text-white">W tym poradniku</p><ol className="list-inside list-decimal space-y-3 text-white">{guide.sections.map((s,i)=><li key={s.title}><a href={`#sekcja-${i+1}`} className="underline underline-offset-4">{s.title.replace(/^\d+\.\s*/, "")}</a></li>)}</ol></nav>
      {guide.sections.map((s,i)=><section key={s.title} id={`sekcja-${i+1}`} className="mt-12 scroll-mt-28"><h2 className="text-2xl text-white md:text-3xl">{s.title}</h2>{s.paragraphs.map(p=><p key={p} className="mt-5 leading-8 text-white">{p}</p>)}</section>)}
      {"sources" in guide && guide.sources && <aside className="mt-12 rounded-xl border border-white/15 p-5"><h2 className="text-lg">Dokumentacja i źródła</h2><ul className="mt-3 space-y-2">{guide.sources.map((source)=><li key={source.url}><a className="text-sm text-[var(--brand-gold)] underline underline-offset-4" href={source.url} target="_blank" rel="noopener noreferrer">{source.label}</a></li>)}</ul></aside>}
    </article>
    <aside className="mt-14 rounded-2xl border border-white/30 bg-[var(--brand-black)] p-7"><h2 className="text-2xl">Przełóżmy to na Twoją firmę.</h2><p className="mt-4 leading-7 text-white/70">Opisz swój cel, obecne rozwiązanie i termin. Ustalimy, czego potrzebujesz na start.</p><div className="mt-6 flex flex-wrap gap-5"><a href={`mailto:kacper@bernecki.dev?subject=${encodeURIComponent(guide.title)}`} className="rounded-lg bg-white px-5 py-3 text-black">Napisz o projekcie</a><Link href={guide.service} className="py-3 text-white">{guide.serviceLabel} →</Link></div></aside>
    <nav aria-label="Powiązane poradniki" className="mt-12 space-y-4">{guides.filter(g=>g.slug!==slug).map(g=><Link key={g.slug} href={`/poradniki/${g.slug}`} className="block text-white underline underline-offset-4">{g.title} →</Link>)}</nav>
  </main>;
}
