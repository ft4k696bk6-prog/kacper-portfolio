import Link from "next/link";

export function SiteFooter() {
  return <footer className="border-t border-white/10 bg-[#0b0b0b] px-5 py-14 md:px-8">
    <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-3">
      <div><Link href="/" className="text-xl text-[#f5dfae]">Kacper Bernecki</Link><p className="mt-4 max-w-sm leading-7 text-zinc-400">Strony internetowe, CRM-y, aplikacje webowe, reklamy i social media. Bezpośrednia współpraca, zdalnie w całej Polsce.</p><a href="mailto:kacper@bernecki.dev" className="mt-5 inline-block text-[#d7b46a] underline underline-offset-4">kacper@bernecki.dev</a></div>
      <nav aria-label="Oferta" className="space-y-4 text-zinc-300"><p className="text-xs uppercase tracking-widest text-zinc-500">Oferta</p><Link className="block" href="/tworzenie-stron-internetowych">Tworzenie stron internetowych</Link><Link className="block" href="/crm-i-aplikacje-webowe">CRM i aplikacje webowe</Link><Link className="block" href="/marketing-i-reklamy">Marketing, reklamy i social media</Link></nav>
      <nav aria-label="Poznaj współpracę" className="space-y-4 text-zinc-300"><p className="text-xs uppercase tracking-widest text-zinc-500">Przed rozmową</p><Link className="block" href="/case-studies">Realizacje i działające projekty</Link><Link className="block" href="/#collaborations">Współprace z firmami</Link><Link className="block" href="/poradniki">Poradniki dla przedsiębiorców</Link><Link className="block" href="/#faq">Pytania o współpracę</Link><Link className="block" href="/#contact">Umów rozmowę</Link></nav>
    </div>
  </footer>;
}
