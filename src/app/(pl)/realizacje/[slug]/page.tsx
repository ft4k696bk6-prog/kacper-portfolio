import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { realizations } from "@/content/realizations";
import { serviceMetadata } from "@/lib/seo";
export const dynamicParams = false;
export function generateStaticParams(){return realizations.map(({slug})=>({slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const item=realizations.find(x=>x.slug===slug);if(!item)notFound();const metadata=serviceMetadata(item.title,item.summary,`realizacje/${slug}`);const pl=`https://bernecki.dev/realizacje/${slug}`;return {...metadata,alternates:{canonical:pl,languages:{"pl-PL":pl,en:`https://bernecki.dev/en/projects/${slug}`}}};}
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const item=realizations.find(x=>x.slug===slug);if(!item)notFound();const url=`https://bernecki.dev/realizacje/${slug}`;const articleSchema={"@context":"https://schema.org","@type":"Article",headline:item.title,description:item.summary,mainEntityOfPage:url,inLanguage:"pl-PL",author:{"@type":"Person","@id":"https://bernecki.dev/#person",name:"Kacper Bernecki"}};return <main className="site-page mx-auto max-w-3xl px-5 pb-24 pt-36"><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(articleSchema).replace(/</g,"\\u003c")}}/><Link href="/#projects" className="text-sm text-[var(--brand-accent)]">← Wszystkie realizacje</Link><p className="mt-8 text-sm text-white/60">{item.category}</p><h1 className="mt-4 text-4xl leading-tight">{item.title}</h1><p className="mt-6 text-xl leading-8">{item.summary}</p>  {(slug === "isto-kebab-strona" || slug === "reenergy-strona") && <figure className="site-preview-detail mt-10 overflow-hidden rounded-xl border border-white/10 bg-[var(--brand-black)]">
    <Image
      src={slug === "reenergy-strona" ? "/images/projects/reenergy-website-live.jpg" : "/images/projects/isto-live-nov08.jpg"}
      width={1600}
      height={900}
      alt={slug === "reenergy-strona" ? "Zrzut działającej strony Re-Energy System" : "Zrzut działającej strony Isto Kebab"}
      sizes="(max-width: 768px) 100vw, 768px"
      className="h-auto w-full"
    />
    <figcaption className="p-4 text-xs text-white/65">{slug === "reenergy-strona" ? "Re-Energy System — strona internetowa firmy OZE." : "Isto Kebab — strona internetowa i menu."}</figcaption>
  </figure>}
  {(slug === "isto-kebab-strona" || slug === "reenergy-strona") && <a href={slug === "reenergy-strona" ? "https://re-energysystem.pl" : "https://isto.bernecki.dev"} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block rounded-lg border border-white/25 px-5 py-3 text-sm">{slug === "reenergy-strona" ? "Otwórz działającą stronę Re-Energy ↗" : "Otwórz działającą stronę ↗"}</a>}
  {item.details.map(p=><p key={p} className="mt-8 leading-8 text-white/75">{p}</p>)}{slug === "b-code" && <Link href="/wdrozenia-ai-dla-firm" className="mt-8 inline-flex items-center rounded-lg border border-white/20 px-5 py-3 text-white hover:border-white/50">Zobacz ofertę wdrożeń AI dla firm →</Link>}<Link href="/#contact" className="brand-action mt-10 inline-block rounded-lg px-5 py-3">Porozmawiajmy o Twojej firmie</Link></main>}
