import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { realizations } from "@/content/realizations";
import { serviceMetadata } from "@/lib/seo";
export const dynamicParams = false;
export function generateStaticParams(){return realizations.map(({slug})=>({slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const item=realizations.find(x=>x.slug===slug);if(!item)notFound();const metadata=serviceMetadata(item.title,item.summary,`realizacje/${slug}`);const pl=`https://bernecki.dev/realizacje/${slug}`;return {...metadata,alternates:{canonical:pl,languages:{"pl-PL":pl,en:`https://bernecki.dev/en/projects/${slug}`}}};}
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const item=realizations.find(x=>x.slug===slug);if(!item)notFound();return <main className="site-page mx-auto max-w-3xl px-5 pb-24 pt-36"><Link href="/#projects" className="text-sm text-[var(--brand-accent)]">← Wszystkie realizacje</Link><p className="mt-8 text-sm text-white/60">{item.category}</p><h1 className="mt-4 text-4xl leading-tight">{item.title}</h1><p className="mt-6 text-xl leading-8">{item.summary}</p>{slug === "isto-kebab-strona" && <figure className="mt-10 overflow-hidden rounded-2xl border border-white/15 bg-[#111]">
    <Image src="https://s0.wp.com/mshots/v1/https%3A%2F%2Ftest-test-kebab-berni.vercel.app%2F?vpw=1440&vph=940&w=1200" width={1200} height={784} alt="Zrzut działającej strony Isto Kebab" sizes="(max-width: 768px) 100vw, 768px" className="h-auto w-full" unoptimized/>
    <figcaption className="p-4 text-xs text-white/65">Podgląd działającej strony Isto Kebab — rzeczywisty zrzut witryny.</figcaption>
  </figure>}
  {slug === "isto-kebab-strona" && <a href="https://isto.bernecki.dev" target="_blank" rel="noopener noreferrer" className="mt-6 inline-block rounded-lg border border-white/25 px-5 py-3 text-sm">Otwórz działającą stronę ↗</a>}
  {item.details.map(p=><p key={p} className="mt-8 leading-8 text-white/75">{p}</p>)}<Link href="/#contact" className="brand-action mt-10 inline-block rounded-lg px-5 py-3">Porozmawiajmy o Twojej firmie</Link></main>}
