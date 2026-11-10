"use client";
import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowRight, ClipboardCopy, Download, LoaderCircle, ExternalLink, Globe2 } from "lucide-react";
import { englishToolPath } from "@/lib/toolbox-en";

type Issue={id:string;severity:"critical"|"warning"|"info";category:string;title:string;detail:string;fix:string;page?:string};
type Page={url:string;status:number;ttfb:number;sizeKb:number;html:{title:string;headings:{level:number;text:string}[];imagesMissingAlt:number}};
type Audit={url:string;host:string;analyzedAt:string;requestedPageLimit:number;pages:Page[];failedPages:{url:string;reason:string}[];
 issues:Issue[];summary:{critical:number;warning:number;info:number;scanned:number;meanTTFB:number;imagesMissingAlt:number};
 technical:{robots:{present:boolean;crawlingRestricted:boolean};sitemap:{present:boolean;discoveredUrls:number};tls:{authorized:boolean;daysRemaining:number|null}|null;dns:{spf:string[];dmarc:string[]}|null;
 tags:{metaPixel:boolean;gtm:boolean;ga4:boolean};securityHeaders:Record<string,string>;redirects:{from:string;to:string;status:number}[]}};
type EnglishIssue={id:string;severity:Issue["severity"];category:string;title:string;detail:string;fix:string;page?:string};
const categories:Record<string,string>={SEO:"SEO",Indeksowanie:"Indexability",Dostępność:"Accessibility",Wydajność:"Performance",Bezpieczeństwo:"Security",Analityka:"Analytics",Domena:"Domain & email"};
const severity:Record<Issue["severity"],string>={critical:"Critical",warning:"Needs attention",info:"Review"};
const definitions:Record<string,[string,string,string]>={
 "http-":["HTTP error","The page returned an error response.","Check that the page exists and is publicly accessible."],
 "title-":["Missing page title","No HTML title was found.","Add a unique, descriptive <title> element."],
 "titlelength-":["Long page title","The title may be truncated in search results.","Review the length and keep the most relevant keywords."],
 "desc-":["Missing meta description","No meta description was found.","Write a unique description matching the page content."],
 "h1-":["Missing H1 heading","No H1 element was found in server-returned HTML.","Add a clear main heading."],
 "h1multi-":["Multiple H1 headings","Several main headings were found.","Review the hierarchy to keep it clear."],
 "canonical-":["Missing canonical URL","No canonical URL was found.","Set a canonical URL where appropriate."],
 "noindex-":["Noindex directive","The page asks search engines not to index it.","Review CMS settings and noindex if this page should appear in search."],
 "lang-":["Missing document language","No HTML lang attribute was found.","Set the correct HTML language attribute."],
 "viewport-":["Missing viewport tag","No mobile viewport meta tag was found.","Add a standard responsive viewport tag."],
 "alt-":["Images without alt attributes","One or more image elements have no alt attribute.","Provide useful alt text for informative images and empty alt for decorative ones."],
 "ttfb-":["Slow first server response","A single request took more than 800 milliseconds to its first byte.","Review hosting, cache and server response time with repeated measurements."],
 "og-image":["Missing social-sharing image","No Open Graph image was found on the entry page.","Add a relevant og:image for link previews."],
 tags:["Analytics tags not found in HTML","No GTM or GA4 marker was detected in the initial HTML.","Check your analytics setup in the browser; scripts loaded later may not appear in this scan."],
 robots:["robots.txt not confirmed","The scanner could not confirm a usable robots.txt file.","Check /robots.txt and crawler rules."],
 sitemap:["Sitemap not found","No usable XML sitemap was found at /sitemap.xml.","Publish a valid sitemap and submit it in Search Console."],
 tls:["TLS certificate verification failed","The certificate could not be verified in this check.","Review the certificate, hostname and trust chain."],
 "tls-expiring":["TLS certificate expiring soon","The certificate is nearing its expiry date.","Configure or check certificate auto-renewal."],
 spf:["SPF record not detected","No public SPF policy was found.","Configure SPF with your email provider."],
 dmarc:["DMARC record not detected","No public DMARC policy was found.","Configure DMARC with your email provider."],
 "duplicate-title-":["Duplicate page title","More than one scanned page shares the same title.","Give relevant pages distinct titles."]
};
function enIssue(i:Issue):EnglishIssue {
 const key=Object.keys(definitions).sort((a,b)=>b.length-a.length).find(x=>i.id===x||i.id.startsWith(x))||"";
 const row=definitions[key]||["Additional observation","Review the detected item.","Investigate this part of the page."];
 return {id:i.id,severity:i.severity,category:categories[i.category]||i.category,title:row[0],detail:row[1],fix:row[2],page:i.page};
}
const limitations=[
 "This is a sample of up to seven public pages, not a full crawl of every URL on the site.",
 "The scanner inspects server-returned HTML; it does not run page JavaScript in a real browser.",
 "TTFB is a single server-side measurement, not a Google PageSpeed or Core Web Vitals score.",
 "Search rankings, actual Google indexation, all WCAG criteria and confirmed Pixel/CAPI event delivery are not checked."
];
function download(data:string,name:string,type:string){const u=URL.createObjectURL(new Blob([data],{type}));const link=document.createElement("a");link.href=u;link.download=name;link.click();URL.revokeObjectURL(u);}
export function EnglishFullWebsiteAuditRunner() {
 const [url,setUrl]=useState("");
 useEffect(()=>{
  const fromQuery=new URLSearchParams(window.location.search).get("url");
  if(fromQuery&&fromQuery.length<=2048&&/^https?:\/\//i.test(fromQuery))setUrl(fromQuery);
 },[]);
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState("");
 const [audit,setAudit]=useState<Audit|null>(null);
 const [tab,setTab]=useState<"issues"|"pages"|"technical">("issues");
 const [filter,setFilter]=useState<"all"|"critical"|"warning"|"info">("all");
 async function run(e:FormEvent<HTMLFormElement>){
  e.preventDefault();setBusy(true);setError("");setAudit(null);setTab("issues");setFilter("all");
  try{
   const r=await fetch("/api/tools/inspect",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({mode:"full",url:url.trim()}),signal:AbortSignal.timeout(55000)});
   const json=await r.json();if(!r.ok)throw Error(json.error||"Audit not available.");
   if(!json.summary||!Array.isArray(json.pages))throw Error("Incomplete audit result.");
   setAudit(json as Audit);
  }catch{setError("The website audit could not be completed. Enter a publicly accessible HTTP/HTTPS URL and try again.");}finally{setBusy(false);}
 }
 const issues=(audit?.issues||[]).map(enIssue).filter(i=>filter==="all"||i.severity===filter);
 const categoriesPresent=[...new Set(issues.map(i=>i.category))];
 const summaryText=audit?[
  "FREE WEBSITE AUDIT — BERNECKI.DEV",
  "Site: "+audit.host,"Date: "+audit.analyzedAt,"Pages scanned: "+audit.summary.scanned,
  "Critical: "+audit.summary.critical+" | Needs attention: "+audit.summary.warning+" | Review: "+audit.summary.info,"",
  ...audit.pages.map(p=>p.url+" | HTTP "+p.status+" | TTFB "+p.ttfb+" ms | "+p.html.title),"",
  ...audit.issues.map(enIssue).flatMap(i=>["["+severity[i.severity]+"] "+i.category+": "+i.title,i.page||"",i.detail,"Recommended fix: "+i.fix,""]),
  ...limitations
 ].join("\n"):"";
 return <div className="space-y-6">
  <form onSubmit={run} className="rounded-2xl border border-white/20 bg-[#121212] p-5 md:p-8">
   <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-[10px] uppercase tracking-[.2em] text-white/50">ONE URL / ONE REPORT</p>
    <h2 className="mt-3 text-2xl font-medium md:text-3xl">Check your website for free.</h2></div><span className="rounded-full border border-white/20 px-3 py-2 text-xs text-white/65">No sign-up</span></div>
   <p className="mt-4 max-w-3xl text-sm leading-7 text-white/65">Run checks for SEO, indexing, titles, headings, missing alt text, SSL, DNS, marketing tags and HTTP headers across a sample of up to seven pages.</p>
   <label htmlFor="en-audit-url" className="mt-7 block text-sm font-medium">Your website address</label>
   <div className="mt-2 flex flex-col gap-3 md:flex-row"><div className="relative min-w-0 flex-1"><Globe2 size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/45"/>
    <input id="en-audit-url" required value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://yourwebsite.com" autoComplete="url" className="min-h-14 w-full rounded-xl border border-white/25 bg-[#090909] py-4 pl-12 pr-4 text-sm outline-none focus:border-white/70"/>
   </div><button disabled={busy} className="brand-action inline-flex min-h-14 items-center justify-center gap-2 rounded-xl px-6 py-4 text-sm font-semibold disabled:opacity-60" type="submit">{busy?<LoaderCircle size={18} className="animate-spin"/>:<ArrowRight size={18}/>} {busy?"Running audit...":"Audit my website"}</button></div>
   {busy&&<p role="status" className="mt-4 text-sm text-white/65">Scanning public pages and technical settings...</p>}
   {error&&<p role="alert" className="mt-4 rounded-xl border border-rose-400/30 p-4 text-sm text-rose-200">{error}</p>}
   <p className="mt-4 text-xs leading-6 text-white/45">No account required. Limited to a sample of seven public pages; not a full SEO or accessibility audit.</p>
  </form>
  {!audit&&!busy&&<div className="grid gap-3 md:grid-cols-4">{["SEO & indexing","Accessibility & images","SSL, DNS & security","Pixel & Google Tags"].map((s,i)=><div key={s} className="rounded-xl border border-white/15 bg-[#101010] p-5"><span className="text-xs text-white/40">0{i+1}</span><h3 className="mt-4 text-sm font-medium">{s}</h3></div>)}</div>}
  {audit&&<section aria-live="polite" className="space-y-6">
   <div className="rounded-2xl border border-white/20 bg-[#111111] p-5 md:p-7">
    <div className="flex flex-wrap items-start justify-between gap-5">
     <div><p className="text-[10px] uppercase tracking-[.2em] text-white/50">Website report · {new Date(audit.analyzedAt).toLocaleString("en-GB")}</p>
      <h2 className="mt-3 break-all text-xl font-medium md:text-2xl">{audit.host}</h2>
      <p className="mt-2 text-sm text-white/55">Checked {audit.summary.scanned} of up to {audit.requestedPageLimit} public pages. This is a representative sample.</p></div>
     <div className="flex flex-wrap gap-2"><button type="button" onClick={()=>navigator.clipboard.writeText(summaryText)} className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-3 py-2 text-xs"><ClipboardCopy size={14}/>Copy</button>
      <button type="button" onClick={()=>download(summaryText,"website-audit-"+audit.host+".txt","text/plain;charset=utf-8")} className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-3 py-2 text-xs"><Download size={14}/>TXT report</button>
      <button type="button" onClick={()=>download(JSON.stringify({...audit,issues:audit.issues.map(enIssue),limitations},null,2),"website-audit-"+audit.host+".json","application/json")} className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-3 py-2 text-xs"><Download size={14}/>JSON</button>
     </div></div>
    <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">{[
     [audit.summary.critical,"Critical"],[audit.summary.warning,"Needs attention"],[audit.summary.info,"Review"],[audit.summary.scanned,"Pages scanned"]
    ].map(([n,label],i)=><div key={i} className="rounded-xl border border-white/15 bg-[#080808] p-4"><p className="text-2xl font-semibold tabular-nums">{n}</p><p className="mt-1 text-xs text-white/55">{label}</p></div>)}</div>
   </div>
   <div className="flex flex-wrap gap-2" role="tablist" aria-label="Audit report sections">{[["issues","Recommendations"],["pages","Scanned pages"],["technical","Technical findings"]].map(([id,title])=><button type="button" role="tab" key={id} aria-selected={tab===id} onClick={()=>setTab(id as typeof tab)} className={"rounded-full border px-4 py-2 text-sm "+(tab===id?"border-[#dedede] bg-[#dedede] text-black":"border-white/20 text-white/70")}>{title}</button>)}</div>
   {tab==="issues"&&<div className="space-y-4">
    <div className="flex flex-wrap items-center justify-between gap-3"><h3 className="text-xl font-medium">Findings and recommended fixes</h3><div className="flex flex-wrap gap-2">{[["all","All"],["critical","Critical"],["warning","Needs attention"],["info","Review"]].map(([id,label])=><button type="button" key={id} onClick={()=>setFilter(id as typeof filter)} className={"rounded-md border px-3 py-2 text-xs "+(filter===id?"border-white/60 bg-white/10":"border-white/15 text-white/60")}>{label}</button>)}</div></div>
    {issues.length===0?<p className="rounded-xl border border-white/15 p-5 text-sm text-white/65">No issues found in the selected category on this sample. This is not proof of full compliance.</p>:categoriesPresent.map(cat=><div key={cat} className="rounded-xl border border-white/15 bg-[#111111] p-5">
     <h4 className="mb-4 font-medium">{cat}</h4><div className="space-y-3">{issues.filter(x=>x.category===cat).map(issue=><details key={issue.id} className="rounded-lg border border-white/15 p-4"><summary className="cursor-pointer text-sm font-medium">{issue.title} <span className="ml-2 text-xs font-normal text-white/50">· {severity[issue.severity]}</span></summary>
      {issue.page&&<p className="mt-3 break-all text-xs text-white/50">{issue.page}</p>}
      <p className="mt-3 text-sm leading-6 text-white/70">{issue.detail}</p><p className="mt-3 text-sm leading-6"><strong>What to fix:</strong> {issue.fix}</p></details>)}</div>
    </div>)}
   </div>}
   {tab==="pages"&&<div className="space-y-3">{audit.pages.map(p=><div key={p.url} className="rounded-xl border border-white/15 bg-[#111111] p-5"><p className="break-all text-sm font-medium">{p.url}</p><p className="mt-2 text-sm text-white/60">{p.html.title||"Missing title"}</p><p className="mt-3 text-xs text-white/55">HTTP {p.status} · TTFB {p.ttfb} ms · HTML {p.sizeKb} kB · H1 {p.html.headings.filter(h=>h.level===1).length} · Missing alt {p.html.imagesMissingAlt}</p></div>)}
    {audit.failedPages.map(p=><p key={p.url} className="break-all rounded-xl border border-white/15 p-4 text-sm text-white/60">Not scanned: {p.url}</p>)}
   </div>}
   {tab==="technical"&&<div className="grid gap-3 sm:grid-cols-2">{[
    ["robots.txt",audit.technical.robots.present?"Found":"Not confirmed"],
    ["sitemap.xml",audit.technical.sitemap.present?"Found":"Not confirmed"],
    ["Sitemap URLs",String(audit.technical.sitemap.discoveredUrls)],
    ["SSL / TLS",audit.technical.tls?.authorized?"Valid":"Not verified"],
    ["SPF",audit.technical.dns?.spf.join("; ")||"Not found"],
    ["DMARC",audit.technical.dns?.dmarc.join("; ")||"Not found"],
    ["Meta Pixel",audit.technical.tags.metaPixel?"Marker found":"Not detected"],
    ["GTM",audit.technical.tags.gtm?"Marker found":"Not detected"],
    ["GA4",audit.technical.tags.ga4?"Marker found":"Not detected"],
    ["Average TTFB",audit.summary.meanTTFB+" ms"],
    ["Redirects",String(audit.technical.redirects.length)],
    ["Missing alt attributes",String(audit.summary.imagesMissingAlt)]
   ].map(([name,value])=><div key={name} className="min-w-0 rounded-xl border border-white/15 bg-[#111111] p-5"><p className="text-xs text-white/55">{name}</p><p className="mt-2 break-words text-sm font-medium">{value}</p></div>)}</div>}
   <div className="rounded-xl border border-white/15 p-5"><h3 className="text-sm font-medium">Important limitations</h3>{limitations.map(v=><p key={v} className="mt-2 text-xs leading-6 text-white/55">{v}</p>)}</div>
   <div className="flex flex-wrap items-center justify-between gap-5 rounded-xl border border-white/25 bg-[#121212] p-6"><div><h3 className="text-xl font-medium">Want these issues fixed?</h3><p className="mt-2 text-sm text-white/65">I can review the findings and suggest practical next steps.</p></div><Link href="/kontakt" className="brand-action inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-5 text-sm">Discuss the fixes <ArrowRight size={16}/></Link></div>
  </section>}
  <div className="text-sm text-white/65"><Link href={englishToolPath("audyt-seo")} className="inline-flex items-center gap-2 underline underline-offset-4">Run the separate SEO checker <ExternalLink size={14}/></Link></div>
 </div>;
}
