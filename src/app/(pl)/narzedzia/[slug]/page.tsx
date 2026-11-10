import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, ShieldCheck, MoveRight } from "lucide-react";
import { toolboxItems, findTool } from "@/lib/toolbox";
import { englishToolPath } from "@/lib/toolbox-en";
import { FreeToolRunner } from "@/components/FreeToolRunner";
import { FullWebsiteAuditRunner } from "@/components/FullWebsiteAuditRunner";

type Props={params:Promise<{slug:string}>};
export function generateStaticParams(){return toolboxItems.map(t=>({slug:t.slug}));}
export async function generateMetadata({params}:Props):Promise<Metadata>{
 const {slug}=await params;const t=findTool(slug);if(!t)return {};
 const url="https://bernecki.dev/narzedzia/"+slug;
 const seoDescription = t.title+". "+t.description+" Bez opłat i rejestracji.";
 return {title:t.title+" | bernecki.dev",description:seoDescription,alternates:{canonical:url,languages:{"pl-PL":url,en:"https://bernecki.dev"+englishToolPath(slug)}},
  openGraph:{title:t.title+" | bernecki.dev",description:seoDescription,url,type:"website"}};
}
export default async function ToolPage({params}:Props){
 const {slug}=await params;const tool=findTool(slug);if(!tool)notFound();
 const related=toolboxItems.filter(t=>t.category===tool.category&&t.slug!==slug).slice(0,3);
 const service=tool.category==="Reklamy i marketing"?"/marketing-i-reklamy":tool.category==="CRM i sprzedaż"?"/crm-i-aplikacje-webowe":"/tworzenie-stron-internetowych";
 const jsonLd={"@context":"https://schema.org","@graph":[
  {"@type":"WebApplication",name:tool.title,url:"https://bernecki.dev/narzedzia/"+slug,description:tool.description,
   applicationCategory:"BusinessApplication",operatingSystem:"Web",inLanguage:"pl-PL",offers:{"@type":"Offer",price:"0",priceCurrency:"PLN"}},
  {"@type":"FAQPage",mainEntity:[{"@type":"Question",name:tool.question,acceptedAnswer:{"@type":"Answer",text:tool.answer}}]},
  {"@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"Strona główna",item:"https://bernecki.dev/"},{"@type":"ListItem",position:2,name:"Darmowe narzędzia",item:"https://bernecki.dev/narzedzia"},{"@type":"ListItem",position:3,name:tool.title,item:"https://bernecki.dev/narzedzia/"+slug}]}
 ]};
 return <main className="site-page mx-auto max-w-7xl px-5 pb-24 pt-32 md:px-8">
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(jsonLd).replace(/</g,"\\u003c")}}/>
  <nav className="flex flex-wrap items-center gap-2 text-xs text-white/60" aria-label="Ścieżka strony">
   <Link href="/" className="hover:text-white">Start</Link><span>/</span><Link href="/narzedzia" className="hover:text-white">Darmowe narzędzia</Link><span>/</span><span className="text-white/85">{tool.title}</span>
  </nav>
  <header className="mb-10 mt-12">
   <p className="page-eyebrow">{tool.category} <span className="mx-2">/</span> BEZPŁATNIE</p>
   <h1 className="mt-5 max-w-5xl">{tool.title}</h1>
   <p className="page-intro mt-6 max-w-3xl text-base md:text-lg">{tool.description}</p>
   <div className="mt-6 flex flex-wrap gap-3 text-xs text-white/60"><span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-2"><ShieldCheck size={14}/> Bez konta</span><span className="rounded-full border border-white/15 px-3 py-2">Wynik od razu</span><span className="rounded-full border border-white/15 px-3 py-2">Raport do skopiowania</span></div>
  </header>
  {tool.slug==="audyt-strony"?<FullWebsiteAuditRunner/>:<FreeToolRunner mode={tool.mode} slug={tool.slug}/>}
  {tool.slug!=="audyt-strony"&&["WWW i SEO","AI i wyszukiwarki"].includes(tool.category)&&<Link href="/narzedzia/audyt-strony" className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/20 bg-[#141414] p-5 transition-colors hover:border-white/50">
   <div><span className="text-xs font-medium text-white/50">Jedna analiza zamiast kilku</span><h2 className="mt-2 text-base font-medium">Sprawdź też SEO, obrazy, SSL, DNS i inne elementy w jednym audycie.</h2></div><span className="inline-flex items-center gap-2 text-sm">Darmowy audyt całej próbki <ArrowUpRight size={16}/></span>
  </Link>}
  <section className="mt-14 grid gap-6 border-t border-white/15 pt-12 md:grid-cols-2">
   <article className="rounded-xl border border-white/15 bg-[#111111] p-6">
    <p className="page-eyebrow">Jak korzystać</p>
    <h2 className="mt-4 text-2xl font-medium">Co pokazuje wynik?</h2>
    <p className="mt-4 text-sm leading-7 text-white/70">{tool.hint}</p>
    <p className="mt-4 text-sm leading-7 text-white/60">Wynik służy do wstępnej diagnozy lub obliczenia wybranego scenariusza. Jeśli korzystasz z niego przy decyzjach biznesowych, zweryfikuj dane wejściowe i szerszy kontekst.</p>
   </article>
   <article className="rounded-xl border border-white/15 bg-[#111111] p-6">
    <p className="page-eyebrow">Warto wiedzieć</p>
    <h2 className="mt-4 text-2xl font-medium">{tool.question}</h2>
    <p className="mt-4 text-sm leading-7 text-white/70">{tool.answer}</p>
   </article>
  </section>
  <section className="mt-14 rounded-xl border border-white/20 p-7 md:flex md:items-center md:justify-between md:gap-8">
   <div><p className="page-eyebrow">Zamień diagnozę w konkretne działania</p><h2 className="mt-3 text-2xl font-medium">Wolisz zlecić poprawki?</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">Mogę pomóc z wdrożeniem strony, reklam lub CRM. Samo korzystanie z narzędzi pozostaje darmowe.</p></div>
   <Link className="brand-action mt-5 inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-lg px-6 text-sm md:mt-0" href="/kontakt">Zapytaj o współpracę <ArrowUpRight size={17}/></Link>
  </section>
  <section className="mt-16">
   <div className="flex flex-wrap items-center justify-between gap-4"><h2 className="text-2xl font-medium">Podobne narzędzia</h2><Link href="/narzedzia" className="inline-flex items-center gap-2 text-sm text-white/75 underline underline-offset-4">Wszystkie narzędzia <MoveRight size={16}/></Link></div>
   <div className="mt-6 grid gap-3 md:grid-cols-3">{related.map(t=><Link href={"/narzedzia/"+t.slug} key={t.slug} className="group rounded-xl border border-white/15 bg-[#111111] p-5 transition hover:border-white/50"><h3 className="font-medium">{t.title}</h3><p className="mt-3 text-sm leading-6 text-white/60">{t.description}</p><span className="mt-5 inline-flex items-center gap-2 text-xs text-white/75">Uruchom <ArrowUpRight size={14}/></span></Link>)}</div>
  </section>
  <Link href="/narzedzia" className="mt-10 inline-flex items-center gap-2 text-sm text-white/70 hover:text-white"><ArrowLeft size={16}/>Powrót do katalogu</Link>
  <div className="sr-only"><Link href={service}>Zobacz powiązaną usługę</Link></div>
 </main>;
}