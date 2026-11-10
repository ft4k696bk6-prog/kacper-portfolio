"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Check, ClipboardCopy, Download, FileUp, LoaderCircle } from "lucide-react";
import { inputs, localRun, fromSite, calculateSha256, type Result, type SiteReport } from "@/lib/toolbox-engine";
import { englishToolboxItems } from "@/lib/toolbox-en";

const inputLabels:Record<string,string>={
 url:"Public website URL",body:"Text to analyze",name:"Business name",city:"City",street:"Street address (optional)",
 phone:"Phone (optional)",title:"Search result title",description:"Description",links:"Important links (one URL per line)",
 issue:"What problem are you seeing?",spend:"Advertising spend (PLN)",revenue:"Revenue (PLN)",
 leads:"Number of leads",cpl:"Estimated cost per lead (PLN)",clicks:"Link clicks",impressions:"Impressions",
 views:"Visits / sessions",rate:"Assumed conversion rate (%)",avg:"Average order value (PLN)",
 orders:"Orders per year",years:"Years as a customer",margin:"Gross margin (%)",
 source:"utm_source",medium:"utm_medium",campaign:"utm_campaign",content:"utm_content (optional)",
 headline:"Ad headline",clients:"New customers",delta:"Assumed conversion increase (percentage points)",
 cost:"Cost (PLN)",monthly:"Monthly running cost (PLN)",hours:"Hours per month",pages:"Number of pages",
 type:"Website type",forms:"Forms & integrations",timestamp:"Unix timestamp (seconds or milliseconds)",
 operation:"Operation",fg:"Text color (HEX)",bg:"Background color (HEX)"
};
const modeLabels:Record<string,Record<string,string>>={
 robots:{body:"Paste robots.txt contents"},sitemap:{body:"Paste the XML sitemap"},
 schema:{body:"Paste JSON-LD markup"},schemaGenerate:{url:"Website URL",name:"Business name"},
 serp:{url:"Website URL",title:"Page title",description:"Meta description"},
 llms:{name:"Website or business name",description:"Short business description",url:"Website URL",links:"Important page URLs (one per line)"},
 adsCsv:{body:"Upload Meta Ads CSV export"},adText:{body:"Primary ad text"},base64:{body:"Text or Base64 value"},
 sha256:{body:"Text to hash using SHA-256"},jwt:{body:"JWT token (decoded locally)"},
 json:{body:"JSON input"},profit:{margin:"Gross margin (%)"},
 lostLeads:{leads:"Unanswered leads per month",margin:"Average margin per sale (PLN)"},
 crm:{leads:"Leads per month",margin:"Margin per sale (PLN)",cost:"CRM setup cost (PLN)"},
 automation:{cost:"Cost per work hour (PLN)",rate:"Time that can be automated (%)",monthly:"Monthly tools cost (PLN)"},
 ltv:{margin:"Gross margin (%)"},traffic:{rate:"Expected lead conversion (%)"},
 conversion:{leads:"Enquiries / leads",clients:"New customers"},
 adText:{headline:"Ad headline"},
 siteCost:{type:"Website type",forms:"Forms and integrations"}
};
const options:Record<string,string>={
 inactive:"Campaign / ad set is inactive",rejected:"My ad was rejected",
 spend:"Ads are not spending budget",results:"Clicks but no enquiries",pixel:"Pixel / CAPI events are missing",
 learning:"Stuck in the learning phase",payment:"Payment or account spending limit",
 landing:"Landing page",business:"Business website",extended:"Larger website",
 simple:"Basic contact form",advanced:"Multiple integrations / CRM",
 encode:"UTF-8 text → Base64",decode:"Base64 → UTF-8 text"
};
const metricNames:Record<string,string>={
 "Dyrektywy":"Directives","Typ":"Type","Liczba adresów":"URLs","Niepoprawne URL":"Invalid URLs",
 "Obiekty":"Objects","Obiekty z @type":"Objects with @type","Wiersze kampanii":"Report rows",
 "Wydatki":"Spend","Wyniki":"Results","CPL / koszt wyniku":"Cost per result","Kliknięcia linku":"Link clicks",
 "CTR linku":"Link CTR","Kliknięcia":"Clicks","Wyświetlenia":"Impressions",
 "Zakładane leady":"Estimated leads","Konwersja":"Conversion rate","Odwiedziny":"Visits",
 "Przychód w okresie":"Revenue over period","Marża z klienta (LTV)":"Gross-margin LTV","Roczne przychody":"Annual revenue",
 "Współczynnik":"Contrast ratio","WCAG AA tekst zwykły":"WCAG AA normal text",
 "WCAG AA tekst duży":"WCAG AA large text","WCAG AAA zwykły":"WCAG AAA normal text",
 "Przychód / 1 zł reklamy":"Revenue per PLN spent","Przychód minus reklamy":"Revenue minus ad spend",
 "Leady":"Leads","Potrzebny budżet":"Estimated required budget","Liczba leadów":"Target leads",
 "Założony CPL":"Assumed CPL","Marża brutto":"Gross margin","Marża po reklamach":"Margin after ad spend",
 "Nagłówek":"Headline","Tekst główny":"Primary text","Słowa":"Words",
 "Od wizyty do leada":"Visit-to-lead rate","Od leada do klienta":"Lead-to-customer rate",
 "Od wizyty do klienta":"Visit-to-customer rate","Łączny koszt":"Total cost","Nowi klienci":"New customers",
 "Potencjalne transakcje":"Potential sales","Potencjalna marża / miesiąc":"Potential monthly margin",
 "Potencjalna marża / rok":"Potential annual margin","Dodatkowa marża / miesiąc":"Additional margin per month",
 "Po kosztach utrzymania":"After monthly running costs","Zwrot z wdrożenia":"Payback period",
 "Odzyskany czas / miesiąc":"Time recovered per month","Wartość odzyskanego czasu":"Value of recovered time",
 "Po koszcie narzędzi":"After software costs","Minimalny model":"Basic estimate",
 "Rozszerzony zakres":"Expanded scope","Algorytm":"Algorithm","Ważność exp (czas PL)":"Expiry (Poland time)",
 "Polska":"Poland time","Timestamp w sekundach":"Timestamp in seconds",
 "Timestamp w milisekundach":"Timestamp in milliseconds",
 "Weryfikacja":"Verification","Ważny do":"Valid until","Pozostałe dni":"Days remaining",
 "Protokół":"Protocol","Wystawca":"Issuer","Domena (CN)":"Certificate subject (CN)",
 "Rekordy SPF":"SPF records","Rekordy DMARC":"DMARC records",
 "Sprawdzone elementy":"Checks performed","Uwag do weryfikacji":"Issues to review",
 "Rozmiar HTML":"HTML size","Pobrany HTML":"Downloaded HTML",
 "H1":"H1","H2":"H2","Pozostałe":"Other headings","Język":"Language",
 "Meta robots":"Meta robots","Tekst HTML":"HTML content",
 "Obrazy img w HTML":"Images in HTML","Brak atrybutu alt":"Missing alt attributes",
 "Z atrybutem alt":"Images with alt","Kod HTTP":"HTTP status",
 "Końcowy status HTTP":"Final HTTP status","Liczba przekierowań":"Redirects",
 "Docelowy URL":"Destination URL","Ślady Meta Pixel":"Meta Pixel markers",
 "Meta Pixel":"Meta Pixel","Google Analytics / gtag":"Google Analytics / gtag",
 "TTFB z serwera testowego":"TTFB from our server"
};
const adsSteps:Record<string,string[]>={
 inactive:["Check that the campaign, ad set and ad are all enabled.","Read the full message in the Delivery column.","Review start and end dates, budget limits and schedules.","Check billing, account quality and advertising restrictions.","After changes, allow delivery status to refresh."],
 rejected:["Open the rejection details and identify the specific policy.","Review the creative, text, claims and destination page.","Correct any violations rather than attempting to bypass review.","Request a review if you believe the decision was incorrect.","Keep a record of the rejection notice and changes."],
 spend:["Check that campaign, ad set and ad are active.","Review billing methods, account limits and daily budget.","Verify schedule and audience size.","Review any bid or cost caps that may prevent delivery.","Avoid making repeated edits every few minutes."],
 results:["Compare link clicks with all clicks and engagement.","Test the landing-page form on a real mobile device.","Check whether the offer matches the ad message.","Verify conversion tracking and UTMs.","Compare campaigns to identify where visitors drop off."],
 pixel:["Verify the data source is connected to the advertising account.","Use Events Manager's test events tool.","Check consent settings, browser blockers and tag installation.","Review Pixel/CAPI event_id deduplication if both are used.","Confirm the correct conversion event is selected."],
 learning:["Review whether the chosen event occurs often enough.","Reduce unnecessary ad-set fragmentation.","Check budget against your target acquisition cost.","Avoid frequent significant edits.","Assess performance over a meaningful period."],
 payment:["Open Billing in Ads Manager.","Check payment status and overdue charges.","Review the account spending limit.","Check Account Quality for restrictions and appeal options.","Never share passwords, payment card details or 2FA codes with third parties."]
};
const genericCaveat:Record<string,string>={
 site:"Checks selected elements of the public HTML of one page; it is not a full SEO or Core Web Vitals audit.",
 seo:"These are on-page observations, not Google ranking or indexation data.",
 ai:"Crawler access signals do not guarantee AI citations or recommendations.",
 tls:"This is a point-in-time TLS check, not a full security audit.",
 dns:"This checks public SPF and DMARC records only; DKIM and delivery are not verified.",
 ttfb:"One server-side measurement; not a Core Web Vitals score.",
 pixel:"Code detection does not confirm that conversion events are delivered correctly.",
 gtm:"JavaScript-loaded tags may be missed. Presence does not confirm correct analytics.",
 images:"Decorative images may correctly use an empty alt attribute.",
 siteCost:"Illustrative budget range, not a binding quote or official price list.",
 profit:"Gross margin minus ad spend is not accounting profit.",
 crm:"Scenario based on your assumptions; improvements are not guaranteed.",
 lostLeads:"Hypothetical potential value, not confirmed financial loss.",
 automation:"Recovered work hours do not always translate into cash savings.",
 ltv:"Simplified model; it excludes churn and discount rates.",
 adsCsv:"CSV results can represent different event types; verify currency, date range and column mapping.",
 adsIssues:"These are general diagnostics. The actual cause depends on the specific account and delivery message.",
 schema:"Valid JSON-LD syntax alone does not ensure eligibility for rich results.",
 jwt:"Decoding a JWT does not verify its signature.",
 base64:"Base64 is encoding, not encryption.",
 llms:"llms.txt does not guarantee visibility in AI search.",
 uuid:"Random UUIDs are identifiers, not secrets."
};
function readableValue(value:string) {
 const dictionary:Record<string,string>={
  "brak":"Not found","Brak":"Not found","Nie wykryto":"Not detected","Znaleziono ślad kodu":"Code marker found",
  "Nie wykryto w HTML":"Not detected in HTML","Wykryto ślad":"Marker found","Brak śladu":"No marker found",
  "Poprawna":"Valid","Niepoprawna":"Invalid","Obecny":"Present","Brak":"Missing",
  "Spełnia":"Pass","Nie spełnia":"Fail","odczytano":"Found","nie odczytano":"Not found",
  "brak tytułu":"Missing title","wykryto tytuł":"Title detected"
 };
 if(dictionary[value])return dictionary[value];
 return value.replace(" mies."," months").replace("zł","PLN").replace("Brak: ","Missing: ");
}
function normalizeResult(mode:string,result:Result,values:Record<string,string>,title:string):Result {
 let messages:string[]=[];
 if(mode==="adsIssues")messages=adsSteps[values.issue||"inactive"]?.map((v,i)=>(i+1)+". "+v)||[];
 else if(mode==="headings"||mode==="ai"||mode==="dns"||mode==="headers") {
  messages=(result.messages||[]).filter(v=>/^(?:H[1-6]:|User-agent:|Allow:|Disallow:|Sitemap:|SPF:|DMARC:|content-security-policy:|strict-transport-security:)/i.test(v));
 } else if(mode==="site"||mode==="seo"){
  // Add English recommendations based on the returned check descriptions, without inventing a score.
  const translate:Record<string,string>={
   "Brakuje znacznika title.":"Missing page title tag.",
   "Brakuje meta description.":"Missing meta description.",
   "W pobranym HTML nie znaleziono H1.":"No H1 heading found in server-returned HTML.",
   "Brakuje adresu canonical.":"No canonical URL was found.",
   "Brakuje atrybutu lang w znaczniku HTML.":"HTML lang attribute is missing.",
   "Brak meta viewport.":"Meta viewport tag is missing."
  };
  messages=(result.messages||[]).map(v=>translate[v]||(/noindex/i.test(v)?"The page includes a noindex directive.":/obraz/i.test(v)?"Some images are missing alt attributes.":/nie wykryto problemów/i.test(v)?"No issues were found in the limited set of checks.":"Review this on-page element.")).filter((v,i,a)=>a.indexOf(v)===i);
 }
 let value=result.text;
 if(mode==="llms"&&value)value=value.replace(/^Strona:/m,"Website:").replace(/^## Najważniejsze zasoby/m,"## Key resources");
 if(mode==="serp"||mode==="json"||mode==="jwt"||mode==="base64"||mode==="uuid"||mode==="sha256"||mode==="schema"||mode==="schemaGenerate"||mode==="utm")messages=[];
 return {title:title+" — results",metrics:result.metrics?.map(m=>({...m,label:metricNames[m.label]||m.label,value:readableValue(m.value)})),messages,
  text:value,warning:genericCaveat[mode]||"This check uses the information provided. Review the assumptions before making decisions."};
}
function localizedInput(mode:string,field:{key:string;label:string;placeholder?:string;type?:string;options?:{value:string;label:string}[]}) {
 let placeholder=field.placeholder||"";
 placeholder=placeholder.replaceAll("twojafirma.pl","yourwebsite.com").replaceAll("Wklej","Paste").replaceAll("Opisz","Describe")
  .replaceAll("Przykładowa firma","Example business").replaceAll("Moja firma","My business").replaceAll("Rzeszów","London")
  .replaceAll("Sprawdź naszą ofertę","Explore our services").replaceAll("Opis produktu lub usługi...","Describe the product or service...");
 return {...field,label:modeLabels[mode]?.[field.key]||inputLabels[field.key]||field.label,placeholder,
  options:field.options?.map(o=>({...o,label:options[o.value]||o.label}))};
}
export function EnglishToolRunner({mode,slug}:{mode:string;slug:string}){
 const tool=englishToolboxItems.find(t=>t.slug===slug);
 const [values,setValues]=useState<Record<string,string>>({});
 const [result,setResult]=useState<Result|null>(null);
 const [error,setError]=useState("");
 const [busy,setBusy]=useState(false);
 const [csv,setCsv]=useState("");
 const [fileName,setFileName]=useState("");
 const fields=(inputs[mode]||[]).map(f=>localizedInput(mode,f));
 const remote=["site","seo","meta","headings","og","ai","tls","dns","ttfb","redirects","headers","pixel","gtm","images"].includes(mode);
 const update=(key:string,value:string)=>{setValues(p=>({...p,[key]:value}));setResult(null);setError("");};
 async function submit(e:FormEvent<HTMLFormElement>){
  e.preventDefault();setBusy(true);setError("");setResult(null);
  try {
   let raw:Result;
   if(remote){
    const r=await fetch("/api/tools/inspect",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({mode,url:values.url||""}),signal:AbortSignal.timeout(20000)});
    const data=await r.json() as SiteReport&{error?:string};
    if(!r.ok)throw new Error(data.error||"Website check unavailable");
    raw=fromSite(mode,data);
   }else if(mode==="sha256"){
    if(!values.body)throw Error("Enter text to hash.");
    raw={title:"SHA-256",text:await calculateSha256(values.body)};
   }else raw=localRun(mode,values,csv);
   setResult(normalizeResult(mode,raw,values,tool?.title||"Free tool"));
  }catch(e){
   if(e instanceof Error&&/limit/i.test(e.message))setError("Rate limit reached. Please try again shortly.");
   else if(remote)setError("Unable to check this URL. Verify it is a public HTTP/HTTPS website and try again.");
   else setError("Please verify your input and try again. All required fields must contain valid values.");
  }finally{setBusy(false);}
 }
 const copy=result?[result.title,...(result.metrics||[]).map(m=>m.label+": "+m.value),...(result.messages||[]),result.text||"",result.warning||""].filter(Boolean).join("\n"):"";
 function download(){const u=URL.createObjectURL(new Blob([copy],{type:"text/plain;charset=utf-8"}));const link=document.createElement("a");link.href=u;link.download=(slug||"tool")+"-report.txt";link.click();URL.revokeObjectURL(u);}
 return <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,.88fr)]">
  <form onSubmit={submit} className="rounded-2xl border border-white/15 bg-[#111111] p-5 md:p-7">
   <div className="mb-7 flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-medium tracking-tight md:text-2xl">Your input</h2><span className="rounded-full border border-white/15 px-3 py-1 text-[11px] text-white/65">No account required</span></div>
   <div className="space-y-5">
    {fields.map(field=><label key={field.key} className="block"><span className="mb-2 block text-sm font-medium text-white/85">{field.label}</span>
     {field.type==="select"?<select value={values[field.key]||field.options?.[0]?.value||""} onChange={e=>update(field.key,e.target.value)} className="w-full rounded-xl border border-white/20 bg-[#191919] px-4 py-3.5 text-white outline-none focus:border-white/65">{field.options?.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}</select>
     :field.type==="textarea"?<textarea rows={5} placeholder={field.placeholder} value={values[field.key]||""} onChange={e=>update(field.key,e.target.value)} className="min-h-36 w-full resize-y rounded-xl border border-white/20 bg-[#0a0a0a] px-4 py-3 font-mono text-sm text-white outline-none placeholder:text-white/30 focus:border-white/65"/>
     :<input value={values[field.key]||""} onChange={e=>update(field.key,e.target.value)} placeholder={field.placeholder} inputMode={field.type==="number"?"decimal":"text"} className="w-full min-w-0 rounded-xl border border-white/20 bg-[#0a0a0a] px-4 py-3.5 text-sm text-white outline-none placeholder:text-white/30 focus:border-white/65"/>}
    </label>)}
    {mode==="adsCsv"&&<label className="flex cursor-pointer flex-col items-center gap-3 rounded-xl border border-dashed border-white/35 bg-[#0a0a0a] px-4 py-9 text-center">
     <FileUp size={28}/><span className="text-sm">{fileName||"Choose a CSV export from Meta Ads Manager"}</span><span className="text-xs text-white/55">Up to 1 MB. File analyzed locally in your browser.</span>
     <input type="file" accept=".csv,text/csv" className="sr-only" onChange={async e=>{const f=e.target.files?.[0];if(!f)return;if(f.size>1_000_000){setError("Maximum file size is 1 MB.");return;}setCsv(await f.text());setFileName(f.name);setResult(null);setError("");}}/>
    </label>}
    {mode==="uuid"&&<p className="text-sm text-white/65">Generate five random UUID v4 values. No input required.</p>}
   </div>
   <button disabled={busy} className="brand-action mt-7 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold disabled:opacity-60" type="submit">{busy?<LoaderCircle size={18} className="animate-spin"/>:<ArrowRight size={18}/>} {busy?"Running check...":mode==="uuid"?"Generate UUIDs":"Run free check"}</button>
   {error&&<p role="alert" className="mt-4 rounded-xl border border-rose-400/30 bg-rose-400/5 p-3 text-sm text-rose-200">{error}</p>}
   <p className="mt-4 text-xs leading-6 text-white/45">{["jwt","json","adsCsv","uuid","base64","sha256"].includes(mode)?"Your data stays in your browser.":"Public website checks make a server request. No account or email is required."}</p>
  </form>
  <section aria-live="polite" className="min-w-0 rounded-2xl border border-white/15 bg-[#111111] p-5 md:p-7">
   <div className="mb-7 flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-medium md:text-2xl">Results</h2>{result&&<div className="flex gap-2"><button onClick={()=>navigator.clipboard.writeText(copy)} type="button" className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-3 py-2 text-xs"><ClipboardCopy size={14}/>Copy</button><button type="button" onClick={download} className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-3 py-2 text-xs"><Download size={14}/>TXT</button></div>}</div>
   {!result?<p className="rounded-xl border border-dashed border-white/15 bg-[#0b0b0b] px-5 py-16 text-center text-sm leading-6 text-white/50">Fill out the form to see your results. No sign-up required.</p>:<div className="space-y-4">
    <p className="flex items-center gap-2 text-sm font-medium"><Check size={17}/>{result.title}</p>
    {result.metrics&&<dl className="grid gap-2 sm:grid-cols-2">{result.metrics.map((m,i)=><div key={i} className="min-w-0 rounded-xl border border-white/10 bg-[#090909] p-3.5"><dt className="text-xs text-white/55">{m.label}</dt><dd className="mt-2 break-words text-base font-medium">{m.value}</dd></div>)}</dl>}
    {result.messages?.map((s,i)=><p key={i} className="rounded-lg border border-white/10 p-3 text-sm leading-6 text-white/75">{s}</p>)}
    {result.text&&<pre className="max-h-[420px] overflow-auto whitespace-pre-wrap break-all rounded-xl border border-white/10 bg-[#080808] p-4 font-mono text-xs leading-6 text-white/80">{result.text}</pre>}
    {result.warning&&<p className="border-t border-white/10 pt-4 text-xs leading-6 text-white/55">{result.warning}</p>}
   </div>}
  </section>
 </div>;
}
