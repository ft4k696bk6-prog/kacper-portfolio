import Link from "next/link";
import {UkrainianLeadForm} from "@/components/UkrainianLeadForm";
import {ukSalesPages,ukPath,type UkrainianSalesPage} from "@/content/uk-sales";

const popular=ukSalesPages.filter(page=>page.slug&&page.slug!=="kontakty");
const nav=[["/uk/stvorennia-saitiv","Сайти"],["/uk/crm-dlia-biznesu","CRM"],["/uk/avtomatyzatsiia-biznesu","Автоматизація"],["/uk/reklama-google-meta","Реклама"],["/uk/tsiny","Ціни"]];
export function UkrainianLanding({page}:{page:UkrainianSalesPage}){
 return <div className="min-h-screen bg-[#090909] text-white">
  <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0d0d0d]/95 backdrop-blur">
   <div className="mx-auto flex min-h-20 max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-3">
    <Link href="/uk" className="flex items-center gap-3 text-sm font-semibold tracking-widest"><span className="rounded-lg border border-white/40 px-3 py-2">KB</span> BERNECKI.DEV</Link>
    <nav aria-label="Навігація" className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-white/75">{nav.map(([href,label])=><Link key={href} href={href} className="hover:text-white">{label}</Link>)}<Link href="/uk/kontakty" className="font-semibold text-white">Контакт</Link></nav>
   </div>
  </header>
  <main>
   <section className="mx-auto max-w-6xl px-5 pb-12 pt-20 sm:pt-28">
    <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-white/55">{page.eyebrow} · Польща</p>
    <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">{page.h1}</h1>
    <p className="mt-8 max-w-3xl text-lg leading-8 text-white/75">{page.lead}</p>
    <div className="mt-9 flex flex-wrap gap-3"><Link href="/uk/kontakty#forma" className="brand-action rounded-lg px-6 py-3 font-semibold text-black">Обговорити проєкт</Link><Link href="/uk/tsiny" className="rounded-lg border border-white/25 px-6 py-3">Як формується ціна</Link></div>
   </section>
   <section className="border-y border-white/10 bg-[#101010] py-14">
    <div className="mx-auto grid max-w-6xl gap-8 px-5 md:grid-cols-2">
     <div><h2 className="text-2xl font-semibold">Для кого це рішення</h2><p className="mt-4 leading-8 text-white/70">{page.audience}</p></div>
     <div><h2 className="text-2xl font-semibold">Що входить у роботу</h2><p className="mt-4 leading-8 text-white/70">{page.offer}</p></div>
    </div>
   </section>
   <section className="mx-auto max-w-6xl px-5 py-16"><h2 className="text-3xl font-semibold">Що ви отримуєте</h2>
    <div className="mt-7 grid gap-4 md:grid-cols-3">{page.points.map(p=><article key={p.title} className="rounded-xl border border-white/15 bg-white/[0.035] p-6"><h3 className="text-xl font-semibold">{p.title}</h3><p className="mt-4 leading-7 text-white/70">{p.text}</p></article>)}</div>
    <p className="mt-9 max-w-4xl leading-8 text-white/75">{page.closing}</p>
   </section>
   <section className="mx-auto max-w-6xl px-5 pb-16"><h2 className="mb-6 text-2xl font-semibold">Інші послуги</h2><div className="flex flex-wrap gap-3">{popular.filter(p=>p.slug!==page.slug).map(p=><Link href={ukPath(p)} key={p.slug} className="rounded-lg border border-white/20 px-4 py-3 text-sm hover:border-white/60">{p.eyebrow}</Link>)}</div></section>
   <section id="forma" className="mx-auto max-w-4xl scroll-mt-28 px-5 pb-24"><UkrainianLeadForm service={page.service}/></section>
  </main>
  <footer className="border-t border-white/10 px-5 py-8 text-center text-xs text-white/60">© bernecki.dev · <Link href="/polityka-prywatnosci" lang="pl" className="underline">Політика конфіденційності (PL)</Link> · Послуги для компаній у Польщі</footer>
 </div>;
}
