"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, AlertTriangle, CheckCircle2, ClipboardCopy, Download, ExternalLink, FileSearch, Globe2, LoaderCircle, ShieldCheck } from "lucide-react";

type Severity="critical"|"warning"|"info";
type Issue={id:string;severity:Severity;category:string;title:string;detail:string;fix:string;page?:string};
type ReportPage={url:string;status:number;ttfb:number;sizeKb:number;html:{
 title:string;description:string;robots:string;canonical:string;lang:string;
 headings:{level:number;text:string}[];imageCount:number;imagesMissingAlt:number;
 og:{title:string;description:string;image:string;type:string};
 tracking:{metaPixel:boolean;gtm:boolean;ga4:boolean};
}};
type Report={
 requestedUrl:string;url:string;host:string;analyzedAt:string;
 pages:ReportPage[];failedPages:{url:string;reason:string}[];
 issues:Issue[];requestedPageLimit:number;
 summary:{critical:number;warning:number;info:number;scanned:number;foundPages:number;totalImages:number;imagesMissingAlt:number;meanTTFB:number};
 technical:{
  robots:{present:boolean;url:string;sample:string;crawlingRestricted:boolean};
  sitemap:{present:boolean;url:string;discoveredUrls:number;isIndex:boolean};
  securityHeaders:Record<string,string>;
  redirects:{from:string;to:string;status:number}[];
  tls:{authorized:boolean;daysRemaining:number|null;validTo:string;issuer:string;protocol:string;authorizationError?:string}|null;
  dns:{spf:string[];dmarc:string[];notes:string[]}|null;
  tags:{metaPixel:boolean;gtm:boolean;ga4:boolean};
 };
 limitations:string[];
};
const issueTone:Record<Severity,string>={
 critical:"border-rose-400/25 text-rose-200 bg-rose-400/5",
 warning:"border-amber-200/20 text-amber-100 bg-amber-100/5",
 info:"border-white/15 text-white/75 bg-white/[.035]"
};
const issueText:Record<Severity,string>={critical:"Krytyczne",warning:"Do poprawy",info:"Do weryfikacji"};
const categoryOrder=["SEO","Indeksowanie","Dostępność","Wydajność","Bezpieczeństwo","Analityka","Domena"];
const toolLinks:Record<string,{label:string;href:string}>={
 SEO:{label:"Osobny audyt SEO",href:"/narzedzia/audyt-seo"},
 Indeksowanie:{label:"Tester robots.txt",href:"/narzedzia/walidator-robots-txt"},
 Dostępność:{label:"Tester ALT obrazów",href:"/narzedzia/tester-obrazow-alt"},
 Wydajność:{label:"Tester TTFB",href:"/narzedzia/test-czasu-odpowiedzi-serwera"},
 Bezpieczeństwo:{label:"Tester TLS",href:"/narzedzia/sprawdzanie-certyfikatu-ssl"},
 Analityka:{label:"Tester Meta Pixel",href:"/narzedzia/tester-meta-pixel"},
 Domena:{label:"Tester SPF i DMARC",href:"/narzedzia/test-spf-dmarc"}
};
function downloadFile(content:string,name:string,type:string) {
 const url=URL.createObjectURL(new Blob([content],{type}));
 const link=document.createElement("a");link.href=url;link.download=name;link.click();URL.revokeObjectURL(url);
}
function plainReport(report:Report) {
 const summary=report.summary;
 return [
 "KOMPLEKSOWY AUDYT STRONY — BERNECKI.DEV",
 "Domena: "+report.host,
 "Adres końcowy: "+report.url,
 "Data: "+report.analyzedAt,
 "Zakres: "+summary.scanned+" / maksymalnie "+report.requestedPageLimit+" podstron",
 "Ustalenia: "+summary.critical+" krytycznych, "+summary.warning+" do poprawy, "+summary.info+" do sprawdzenia",
 "",
 ...report.pages.map(page=>"PODSTRONA "+page.url+" | HTTP "+page.status+" | TTFB "+page.ttfb+" ms | TITLE: "+page.html.title),
 "",
 ...report.issues.flatMap(item=>[
  "["+issueText[item.severity]+"] "+item.category+" — "+item.title,
  "Opis: "+item.detail,
  ...(item.page?["URL: "+item.page]:[]),
  "Co poprawić: "+item.fix,
  ""
 ]),
 "TECHNIKALIA",
 "Robots: "+(report.technical.robots.present?"dostępny":"brak potwierdzenia"),
 "Sitemap: "+(report.technical.sitemap.present?"dostępna":"brak potwierdzenia"),
 "Certyfikat TLS: "+(report.technical.tls?.authorized?"poprawny":"nie potwierdzono"),
 "SPF: "+(report.technical.dns?.spf.join("; ")||"nie wykryto"),
 "DMARC: "+(report.technical.dns?.dmarc.join("; ")||"nie wykryto"),
 "",
 ...report.limitations.map(v=>"Ograniczenie: "+v)
 ].join("\n");
}
export function FullWebsiteAuditRunner(){
 const [url,setUrl]=useState("");
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState("");
 const [report,setReport]=useState<Report|null>(null);
 const [view,setView]=useState<"issues"|"pages"|"technical">("issues");
 const [filter,setFilter]=useState<"all"|Severity>("all");
 async function handleSubmit(event:React.FormEvent<HTMLFormElement>){
  event.preventDefault();setBusy(true);setError("");setReport(null);setView("issues");setFilter("all");
  try{
   const response=await fetch("/api/tools/inspect",{
    method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({mode:"full",url:url.trim()}),
    signal:AbortSignal.timeout(55000)
   });
   const data=await response.json();
   if(!response.ok)throw new Error(data.error||"Nie udało się zakończyć audytu.");
   if(!data.summary||!Array.isArray(data.pages))throw new Error("Serwer zwrócił niepełny raport.");
   setReport(data as Report);
  }catch(err){
   setError(err instanceof Error?err.name==="TimeoutError"?"Audyt przekroczył limit czasu. Spróbuj ponownie później.":err.message:"Nie udało się przeprowadzić audytu.");
  }finally{setBusy(false);}
 }
 const findings=report?.issues.filter(v=>filter==="all"||v.severity===filter)||[];
 const ordered=categoryOrder.filter(cat=>findings.some(v=>v.category===cat));
 return <div className="space-y-6">
  <form onSubmit={handleSubmit} className="rounded-2xl border border-white/20 bg-[#121212] p-5 md:p-8">
   <div className="flex flex-wrap items-center justify-between gap-3">
    <div><p className="text-[10px] font-medium uppercase tracking-[.22em] text-white/45">Jedno narzędzie / jeden raport</p><h2 className="mt-3 text-2xl font-medium tracking-tight md:text-3xl">Sprawdź swoją witrynę.</h2></div>
    <span className="rounded-full border border-white/20 px-3 py-2 text-xs text-white/65">Za darmo · bez konta</span>
   </div>
   <p className="mt-4 max-w-3xl text-sm leading-7 text-white/60">Automatyczny audyt SEO, metadanych, nagłówków, indeksowania, obrazów, SSL, DNS, śladów analityki i podstawowych parametrów HTTP. Analizuje do 7 publicznych podstron z linków i mapy witryny.</p>
   <label htmlFor="full-audit-url" className="mt-7 block text-sm font-medium text-white/80">Adres strony internetowej</label>
   <div className="mt-2 flex flex-col gap-3 md:flex-row">
    <div className="relative min-w-0 flex-1"><Globe2 size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/45"/>
     <input id="full-audit-url" required value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://twojafirma.pl" autoComplete="url"
       className="min-h-14 w-full rounded-xl border border-white/25 bg-[#090909] py-4 pl-12 pr-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-white/70"/>
    </div>
    <button type="submit" disabled={busy} className="brand-action inline-flex min-h-14 items-center justify-center gap-2 rounded-xl px-6 py-4 text-sm font-semibold disabled:opacity-60">
     {busy?<LoaderCircle size={19} className="animate-spin"/>:<ArrowRight size={19}/>}
     {busy?"Analizuję witrynę…":"Uruchom pełny audyt"}
    </button>
   </div>
   {busy&&<p className="mt-4 flex items-center gap-2 text-sm text-white/65" role="status"><LoaderCircle size={15} className="animate-spin"/>Pobieram publiczne podstrony i weryfikuję sygnały techniczne. Nie zamykaj tej karty.</p>}
   {error&&<p className="mt-4 rounded-xl border border-rose-400/35 bg-rose-500/5 p-4 text-sm leading-6 text-rose-200" role="alert">{error}</p>}
   <p className="mt-4 text-xs leading-6 text-white/50">Skan jest ograniczony do maksymalnie 7 podstron i nie zastępuje pełnego crawla, Lighthouse ani Search Console. Nie zapisujemy obowiązkowo danych kontaktowych.</p>
  </form>
  {!report&&!busy&&<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
   {["SEO i indeksowanie","Dostępność i obrazy","SSL, DNS i nagłówki","Meta Pixel i Google Tag"].map((name,i)=><div key={name} className="rounded-xl border border-white/15 bg-[#101010] p-5">
    <span className="font-mono text-xs text-white/35">0{i+1}</span><h3 className="mt-4 text-sm font-medium text-white/80">{name}</h3><p className="mt-2 text-xs text-white/45">Wyniki w jednym raporcie</p>
   </div>)}
  </div>}
  {report&&<section aria-live="polite" className="space-y-6">
   <div className="rounded-2xl border border-white/20 bg-[#111111] p-5 md:p-7">
    <div className="flex flex-wrap items-start justify-between gap-5">
     <div><p className="text-[10px] uppercase tracking-[.2em] text-white/50">Wyniki audytu · {new Date(report.analyzedAt).toLocaleString("pl-PL")}</p>
      <h2 className="mt-3 break-all text-xl font-medium tracking-tight md:text-2xl">{report.host}</h2>
      <p className="mt-2 text-sm text-white/55">Sprawdzono {report.summary.scanned} z maksymalnie {report.requestedPageLimit} podstron. To analiza próbki, nie całej domeny.</p></div>
     <div className="flex flex-wrap gap-2">
      <button type="button" onClick={()=>navigator.clipboard.writeText(plainReport(report))} className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-3 py-2 text-xs hover:border-white/65"><ClipboardCopy size={15}/>Kopiuj</button>
      <button type="button" onClick={()=>downloadFile(plainReport(report),"audyt-"+report.host+".txt","text/plain;charset=utf-8")} className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-3 py-2 text-xs hover:border-white/65"><Download size={15}/>Raport TXT</button>
      <button type="button" onClick={()=>downloadFile(JSON.stringify(report,null,2),"audyt-"+report.host+".json","application/json")} className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-3 py-2 text-xs hover:border-white/65"><Download size={15}/>JSON</button>
     </div>
    </div>
    <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
     <div className="rounded-xl border border-rose-400/25 bg-rose-400/5 p-4"><p className="text-2xl font-semibold tabular-nums text-rose-200">{report.summary.critical}</p><p className="mt-1 text-xs text-white/65">Krytyczne</p></div>
     <div className="rounded-xl border border-amber-200/20 bg-amber-100/5 p-4"><p className="text-2xl font-semibold tabular-nums text-amber-100">{report.summary.warning}</p><p className="mt-1 text-xs text-white/65">Do poprawy</p></div>
     <div className="rounded-xl border border-white/15 bg-[#090909] p-4"><p className="text-2xl font-semibold tabular-nums">{report.summary.info}</p><p className="mt-1 text-xs text-white/65">Do sprawdzenia</p></div>
     <div className="rounded-xl border border-white/15 bg-[#090909] p-4"><p className="text-2xl font-semibold tabular-nums">{report.summary.scanned}</p><p className="mt-1 text-xs text-white/65">Stron w próbce</p></div>
    </div>
    {report.technical.robots.crawlingRestricted&&<p className="mt-4 rounded-lg border border-amber-200/25 p-3 text-sm text-amber-100">robots.txt zawiera Disallow: / dla ogólnego crawlowania. Zatrzymano skanowanie kolejnych podstron.</p>}
   </div>
   <div className="flex flex-wrap gap-2" role="tablist" aria-label="Sekcje raportu">
    {[["issues","Zalecenia"],["pages","Zbadane podstrony"],["technical","Dane techniczne"]].map(([value,name])=><button key={value} type="button" role="tab" aria-selected={view===value} onClick={()=>setView(value as typeof view)} className={"rounded-full border px-4 py-2 text-sm "+(view===value?"border-[#dedede] bg-[#dedede] text-black":"border-white/20 text-white/75 hover:border-white/60")}>{name}</button>)}
   </div>
   {view==="issues"&&<div className="space-y-5">
    <div className="flex flex-wrap items-center justify-between gap-3"><h3 className="text-xl font-medium">Problemy i konkretne poprawki</h3>
     <div className="flex flex-wrap gap-2">{[["all","Wszystkie"],["critical","Krytyczne"],["warning","Do poprawy"],["info","Do sprawdzenia"]].map(([value,name])=><button key={value} type="button" onClick={()=>setFilter(value as typeof filter)} className={"rounded-md border px-3 py-2 text-xs "+(filter===value?"border-white/60 bg-white/10 text-white":"border-white/10 text-white/55 hover:border-white/40")}>{name}</button>)}</div>
    </div>
    {ordered.length===0?<p className="rounded-xl border border-white/15 p-5 text-sm text-white/70">Nie wykryto uwag w tej kategorii na przeskanowanej próbce. Nie oznacza to pełnej zgodności witryny.</p>:ordered.map(cat=><div key={cat} className="overflow-hidden rounded-xl border border-white/15 bg-[#111111]">
     <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 p-4 md:px-5"><h4 className="font-medium">{cat} <span className="ml-2 text-sm font-normal text-white/45">{findings.filter(i=>i.category===cat).length}</span></h4><Link href={toolLinks[cat]?.href||"/narzedzia"} className="inline-flex items-center gap-1.5 text-xs text-white/60 hover:text-white">{toolLinks[cat]?.label||"Inne narzędzia"}<ExternalLink size={13}/></Link></div>
     <div className="space-y-3 p-4 md:p-5">{findings.filter(i=>i.category===cat).map(item=><details key={item.id} className={"group rounded-lg border p-4 "+issueTone[item.severity]}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium"><span>{item.title}</span><span className="shrink-0 text-[10px] opacity-75">{issueText[item.severity]} +</span></summary>
      {item.page&&<p className="mt-3 break-all text-xs opacity-70">{item.page}</p>}
      <p className="mt-3 text-sm leading-6 text-white/70">{item.detail}</p>
      <p className="mt-3 text-sm leading-6 text-white"><strong>Co poprawić:</strong> {item.fix}</p>
     </details>)}</div>
    </div>)}
   </div>}
   {view==="pages"&&<div className="space-y-3">
    {report.pages.map(page=><div key={page.url} className="rounded-xl border border-white/15 bg-[#111111] p-5">
     <div className="flex flex-wrap items-start justify-between gap-3"><p className="min-w-0 break-all text-sm font-medium">{page.url}</p><span className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/70">HTTP {page.status}</span></div>
     <p className="mt-2 text-sm text-white/60">{page.html.title||"Brak title"}</p>
     <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-white/60"><span>TTFB: {page.ttfb} ms</span><span>HTML: {page.sizeKb} kB</span><span>H1: {page.html.headings.filter(h=>h.level===1).length}</span><span>Obrazy bez alt: {page.html.imagesMissingAlt}</span></div>
    </div>)}
    {report.failedPages.map(item=><div key={item.url} className="rounded-xl border border-amber-200/25 p-4 text-sm"><p className="break-all text-amber-100">{item.url}</p><p className="mt-2 text-white/60">Pominięto: {item.reason}</p></div>)}
   </div>}
   {view==="technical"&&<div className="grid gap-3 md:grid-cols-2">
    {[["robots.txt",report.technical.robots.present?"Wykryto":"Nie potwierdzono"],["sitemap.xml",report.technical.sitemap.present?"Wykryto":"Nie potwierdzono"],["Sitemap: wykryte URL",String(report.technical.sitemap.discoveredUrls)],["HTTPS / TLS",report.technical.tls?.authorized?"Certyfikat poprawny":"Nie zweryfikowano"],["SPF",report.technical.dns?.spf.join("; ")||"Nie wykryto"],["DMARC",report.technical.dns?.dmarc.join("; ")||"Nie wykryto"],["Meta Pixel (HTML)",report.technical.tags.metaPixel?"Wykryto fragment kodu":"Nie wykryto"],["Google Tag Manager (HTML)",report.technical.tags.gtm?"Wykryto fragment kodu":"Nie wykryto"],["GA4 / gtag (HTML)",report.technical.tags.ga4?"Wykryto fragment kodu":"Nie wykryto"],["Średni TTFB próbki",report.summary.meanTTFB+" ms"],["Przekierowania wejściowe",String(report.technical.redirects.length)],["Obrazy bez alt w próbce",String(report.summary.imagesMissingAlt)]].map(([label,value])=><div key={label} className="min-w-0 rounded-xl border border-white/15 bg-[#111111] p-5"><p className="text-xs text-white/50">{label}</p><p className="mt-2 break-words text-sm font-medium">{value}</p></div>)}
    <div className="rounded-xl border border-white/15 bg-[#111111] p-5 md:col-span-2"><h4 className="font-medium">Nagłówki bezpieczeństwa</h4><div className="mt-4 space-y-2 text-xs">{["content-security-policy","strict-transport-security","x-content-type-options","referrer-policy","permissions-policy"].map(k=><p key={k} className="break-all"><span className="text-white/50">{k}: </span>{report.technical.securityHeaders[k]?"Obecny — "+report.technical.securityHeaders[k].slice(0,180):"Brak w odpowiedzi"}</p>)}</div></div>
   </div>}
   <div className="space-y-3 rounded-xl border border-white/15 bg-[#101010] p-5">
    <div className="flex items-center gap-2 text-sm font-medium"><AlertTriangle size={17}/>Zakres i ograniczenia</div>
    {report.limitations.map(item=><p key={item} className="text-xs leading-6 text-white/60">{item}</p>)}
   </div>
   <div className="flex flex-wrap items-center justify-between gap-5 rounded-xl border border-white/25 bg-[#121212] p-6 md:p-8">
    <div><h3 className="text-xl font-medium">Chcesz usunąć wykryte problemy?</h3><p className="mt-2 max-w-xl text-sm leading-6 text-white/65">Mogę sprawdzić szczegóły i wycenić konkretne poprawki — raport możesz dołączyć do zgłoszenia.</p></div>
    <Link href="/kontakt" className="brand-action inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-5 text-sm font-medium">Zapytaj o poprawki <ArrowRight size={16}/></Link>
   </div>
  </section>}
 </div>;
}
