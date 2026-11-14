"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";

export function SiteFooter() {
  const {lang} = useLanguage();
  const pathname = usePathname();
  const english = pathname.startsWith("/en/") || (!pathname.startsWith("/poradniki") && !pathname.startsWith("/blog") && lang === "en");
  return <footer className="site-footer relative z-10 border-t border-white/10 bg-[var(--brand-black)] px-5 py-14 md:px-8">
    <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-3">
      <div>
        <Link href="/" className="text-xl text-white">Kacper Bernecki</Link>
        <p className="mt-4 max-w-sm leading-7 text-white/70">{english
          ? "Business development, product sourcing, websites, CRM, advertising and sales. Direct collaboration with businesses across Poland."
          : "Rozwój biznesu, sourcing produktów, strony, CRM, reklamy i sprzedaż. Bezpośrednia współpraca w całej Polsce."}</p>
        <a href="mailto:kacper@bernecki.dev" className="mt-5 inline-block text-white underline underline-offset-4">kacper@bernecki.dev</a>
      </div>
      <nav aria-label={english?"Services":"Oferta"} className="space-y-4 text-white">
        <p className="text-xs uppercase tracking-widest text-white/70">{english?"Services":"Oferta"}</p>
        <Link className="block" href="/partner-w-rozwoju-biznesu">{english?"Growth and business operations partner":"Partner w rozwoju biznesu"}</Link>
        <Link className="block" href={english?"/en/business":"/rozwoj-biznesu"}>{english?"Business development and sourcing":"Rozwój biznesu i sourcing"}</Link>
        <Link className="block" href={english?"/en/services/websites":"/tworzenie-stron-internetowych"}>{english?"Website development":"Tworzenie stron internetowych"}</Link>
        <Link className="block" href={english?"/en/services/crm":"/crm-i-aplikacje-webowe"}>{english?"CRM and web applications":"CRM i aplikacje webowe"}</Link>
        {!english && <Link className="block" href="/crm-dla-firm-handlowych">CRM dla firm handlowych</Link>}
        {!english && <Link className="block" href="/automatyzacja-leadow-i-sprzedazy">Automatyzacja leadów i sprzedaży</Link>}
        <Link className="block" href={english?"/en/services/marketing":"/marketing-i-reklamy"}>{english?"Marketing, advertising and social media":"Marketing, reklamy i social media"}</Link>
        {!english && <Link className="block" href="/uslugi">Usługi dla firm w całej Polsce</Link>}
        <Link className="block" href="/wdrozenia-ai-dla-firm">{english?"AI and process automation":"AI i automatyzacje dla firm"}</Link>
      </nav>
      <nav aria-label={english?"Before we talk":"Poznaj współpracę"} className="space-y-4 text-white">
        <p className="text-xs uppercase tracking-widest text-white/70">{english?"Before we talk":"Przed rozmową"}</p>
        <Link className="block" href={english?"/en/case-studies":"/case-studies"}>{english?"Case studies and live projects":"Realizacje i działające projekty"}</Link>
        {!english && <Link className="block" href="/realizacje">Pozostałe realizacje</Link>}
        <Link className="block" href="/#collaborations">{english?"Client collaborations":"Współprace z firmami"}</Link>
        <Link className="block" href={english?"/en/guides":"/poradniki"}>{english?"Practical troubleshooting guides":"Poradniki dla przedsiębiorców"}</Link>
        <Link className="block" href={english?"/en/blog":"/blog"}>{english?"Articles and insights":"Blog i artykuły"}</Link>
        <Link className="block" href={english?"/en/tools":"/narzedzia"}>{english?"Free online tools":"Darmowe narzędzia online"}</Link>
        <Link className="block" href="/#faq">{english?"Questions about collaboration":"Pytania o współpracę"}</Link>
        <Link className="block" href="/polityka-prywatnosci">{english?"Privacy policy":"Polityka prywatności"}</Link>
        <Link className="block" href="/kontakt">{english?"Contact and booking":"Kontakt i wycena"}</Link>
      </nav>
    </div>
    <div className="mx-auto mt-12 max-w-7xl border-t border-white/10 pt-6">
      <div className="flex flex-row flex-wrap items-center justify-between gap-x-5 gap-y-3">
        <p className="text-[10px] uppercase tracking-[0.16em] text-white/40 sm:text-xs">
          {english ? "Industry profiles" : "Profile branżowe"}
        </p>
        <a
          href="https://techbehemoths.com/company/kacper-bernecki"
          target="_blank"
          rel="noopener noreferrer"
          data-techbehemoths-verification
          aria-label={english ? "Company profile on TechBehemoths" : "Profil firmy w TechBehemoths"}
          className="inline-flex max-w-full items-center opacity-85 transition-opacity hover:opacity-100"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/techbehemoths-logo-transparent.png"
            alt="TechBehemoths"
            width={300}
            height={99}
            className="block h-auto w-[116px] max-w-full object-contain sm:w-[128px]"
            loading="lazy"
          />
        </a>
      </div>
    </div>
  </footer>;
}
