import Link from "next/link";
import { guides } from "@/content/guides";
import { serviceMetadata } from "@/lib/seo";

export const metadata = serviceMetadata("Poradniki: strona, CRM i marketing dla firmy", "Praktyczne wskazówki przed zamówieniem strony, wyborem CRM-u i rozpoczęciem reklam. Zakres, koszty i pytania do wykonawcy.", "poradniki");

export default function GuidesPage() {
  return <main className="mx-auto max-w-6xl px-5 pb-24 pt-36 md:px-8">
    <Link href="/" className="text-[#d7b46a]">Kacper Bernecki /</Link>
    <p className="mt-10 text-sm uppercase tracking-widest text-[#d7b46a]">Przed pierwszą rozmową</p>
    <h1 className="mt-5 max-w-4xl text-4xl leading-tight md:text-6xl">Podejmij dobrą decyzję o stronie, CRM-ie i reklamie.</h1>
    <p className="mt-6 max-w-2xl leading-8 text-zinc-400">Co zamówić, jak porównać oferty i co przygotować, żeby sprawnie rozpocząć współpracę. Konkretne pytania, które warto zadać przed wydaniem budżetu.</p>
    <div className="mt-12 grid gap-6 md:grid-cols-3">{guides.map((guide, i) => <Link key={guide.slug} href={`/poradniki/${guide.slug}`} className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 hover:border-[#d7b46a]/60">
      <span className="text-[#d7b46a]">0{i+1}</span><h2 className="mt-6 text-2xl">{guide.title}</h2><p className="mt-4 leading-7 text-zinc-400">{guide.description}</p><p className="mt-8 text-[#f5dfae]">Przeczytaj poradnik →</p>
    </Link>)}</div>
  </main>;
}
