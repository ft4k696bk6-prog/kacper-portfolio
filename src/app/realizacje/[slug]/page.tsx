import { notFound } from "next/navigation";
import Link from "next/link";
import { realizations } from "@/content/realizations";
import { serviceMetadata } from "@/lib/seo";
export const dynamicParams = false;
export function generateStaticParams(){return realizations.map(({slug})=>({slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const item=realizations.find(x=>x.slug===slug);if(!item)notFound();return serviceMetadata(item.title,item.summary,`realizacje/${slug}`);}
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const item=realizations.find(x=>x.slug===slug);if(!item)notFound();return <main className="site-page mx-auto max-w-3xl px-5 pb-24 pt-36"><Link href="/#projects" className="text-sm text-[var(--brand-accent)]">← Wszystkie realizacje</Link><p className="mt-8 text-sm text-white/60">{item.category}</p><h1 className="mt-4 text-4xl leading-tight">{item.title}</h1><p className="mt-6 text-xl leading-8">{item.summary}</p>{item.details.map(p=><p key={p} className="mt-8 leading-8 text-white/75">{p}</p>)}<Link href="/#contact" className="brand-action mt-10 inline-block rounded-lg px-5 py-3">Porozmawiajmy o Twojej firmie</Link></main>}
