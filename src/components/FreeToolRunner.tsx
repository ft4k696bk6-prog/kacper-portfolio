"use client";

import { useState } from "react";
import { ArrowRight, Check, ClipboardCopy, Download, FileUp, LoaderCircle, RotateCcw } from "lucide-react";

import { inputs, localRun, fromSite, calculateSha256 } from "@/lib/toolbox-engine";
import type { Result, SiteReport } from "@/lib/toolbox-engine";

export function FreeToolRunner({mode,slug}:{mode:string;slug:string}){
 const [values,setValues]=useState<Record<string,string>>({});
 const [result,setResult]=useState<Result|null>(null);
 const [error,setError]=useState("");
 const [loading,setLoading]=useState(false);
 const [csv,setCsv]=useState("");
 const [filename,setFilename]=useState("");
 const set=(key:string,value:string)=>{setValues(current=>({...current,[key]:value}));setResult(null);setError("");};
 const run=async(e:React.FormEvent<HTMLFormElement>)=>{
  e.preventDefault();setLoading(true);setError("");setResult(null);
  try{
   if(["site","seo","meta","headings","og","ai","tls","dns","ttfb","redirects","headers","pixel","gtm","images"].includes(mode)){
    const response=await fetch("/api/tools/inspect",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({url:values.url||"",mode}),signal:AbortSignal.timeout(20000)});
    const d=await response.json() as SiteReport&{error?:string};
    if(!response.ok)throw new Error(d.error||"Nie udało się sprawdzić strony.");
    setResult(fromSite(mode,d));
   }else if(mode==="sha256"){
    if(!values.body)throw new Error("Wpisz tekst do obliczenia skrótu SHA-256.");
    const digest=await calculateSha256(values.body);
    setResult({title:"Skrót SHA-256",text:digest,warning:"Skrót jest obliczany lokalnie; do przechowywania haseł stosuj funkcje specjalnie do tego przeznaczone, np. Argon2id."});
   }else setResult(localRun(mode,mode==="siteCost"?{type:"landing",forms:"simple",...values}:values,csv));
  }catch(e){setError(e instanceof Error?e.message:"Nie udało się wykonać analizy.");}
  finally{setLoading(false);}
 };
 const output=result?[result.title,...(result.metrics||[]).map(a=>a.label+": "+a.value),...(result.messages||[]),result.text||"",result.warning||""].filter(Boolean).join("\n"):"";
 const download=()=>{
  if(!output)return;
  const url=URL.createObjectURL(new Blob([output],{type:"text/plain;charset=utf-8"}));
  const a=document.createElement("a");a.href=url;a.download=slug+"-raport.txt";a.click();URL.revokeObjectURL(url);
 };
 return <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,.88fr)]">
  <form onSubmit={run} className="rounded-2xl border border-white/15 bg-[#111111] p-5 shadow-[0_20px_80px_#0005] md:p-7">
   <div className="mb-7 flex items-center justify-between gap-3"><h2 className="text-xl font-medium tracking-tight md:text-2xl">Dane do analizy</h2><span className="rounded-full border border-white/15 px-3 py-1 text-[11px] text-white/65">Bez rejestracji</span></div>
   <div className="space-y-5">
   {(inputs[mode]||[]).map(field=><label key={field.key} className="block">
    <span className="mb-2 block text-sm font-medium text-white/85">{field.label}</span>
    {field.type==="select"
     ?<select className="w-full rounded-xl border border-white/20 bg-[#191919] px-4 py-3.5 text-white outline-none focus:border-white/65" value={values[field.key]||field.options?.[0].value||""} onChange={e=>set(field.key,e.target.value)}>{field.options?.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}</select>
     :field.type==="textarea"
     ?<textarea rows={mode==="jwt"?5:mode==="adsIssues"?4:8} className="min-h-36 w-full resize-y rounded-xl border border-white/20 bg-[#0a0a0a] px-4 py-3 font-mono text-sm leading-relaxed text-white outline-none placeholder:text-white/30 focus:border-white/65" placeholder={field.placeholder} value={values[field.key]||""} onChange={e=>set(field.key,e.target.value)} />
     :<input type={field.type==="number"?"text":"text"} inputMode={field.type==="number"?"decimal":undefined} className="w-full min-w-0 rounded-xl border border-white/20 bg-[#0a0a0a] px-4 py-3.5 text-sm text-white outline-none placeholder:text-white/30 focus:border-white/65" placeholder={field.placeholder} value={values[field.key]||""} onChange={e=>set(field.key,e.target.value)} />}
    {field.hint&&<span className="mt-1 block text-xs text-white/50">{field.hint}</span>}
   </label>)}
   {mode==="adsCsv"&&<label className="flex cursor-pointer flex-col items-center gap-3 rounded-xl border border-dashed border-white/35 bg-[#0a0a0a] px-4 py-9 text-center hover:border-white/70">
      <FileUp size={30} strokeWidth={1.5}/><span className="text-sm font-medium">{filename||"Wybierz eksport CSV z Menedżera reklam"}</span><span className="text-xs text-white/55">Maks. 1 MB. Plik analizowany tylko w Twojej przeglądarce.</span>
      <input type="file" accept=".csv,text/csv" className="sr-only" onChange={async e=>{const f=e.target.files?.[0];if(!f)return;if(f.size>1_000_000){setError("Maksymalny rozmiar pliku wynosi 1 MB.");return;}setCsv(await f.text());setFilename(f.name);setResult(null);setError("");}}/>
     </label>}
   {mode==="uuid"&&<p className="text-sm leading-7 text-white/65">Wygeneruj pięć unikatowych identyfikatorów UUID v4. Nie wymagamy danych wejściowych.</p>}
   </div>
   <button disabled={loading} type="submit" className="brand-action mt-7 flex w-full min-h-12 items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold disabled:opacity-60">
     {loading?<LoaderCircle size={18} className="animate-spin"/>:<ArrowRight size={18}/>}
     {loading?"Trwa sprawdzanie...":mode==="uuid"?"Wygeneruj identyfikatory":"Sprawdź / oblicz za darmo"}
   </button>
   {error&&<p className="mt-4 rounded-xl border border-rose-400/30 bg-rose-400/5 p-3 text-sm leading-6 text-rose-200" role="alert">{error}</p>}
   <p className="mt-4 text-xs leading-6 text-white/45">{["jwt","json","adsCsv","uuid","base64","sha256"].includes(mode)?"Dane przetwarzane lokalnie — nie są wysyłane do serwera.":"Bez obowiązkowego konta. Analizy zewnętrznych domen wymagają krótkiego zapytania do serwera."}</p>
  </form>
  <section aria-live="polite" aria-atomic="true" className="min-w-0 rounded-2xl border border-white/15 bg-[#111111] p-5 md:p-7">
   <div className="mb-7 flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-medium tracking-tight md:text-2xl">Wynik</h2>{result&&<div className="flex gap-2"><button type="button" onClick={()=>navigator.clipboard.writeText(output)} className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-3 py-2 text-xs hover:border-white/65"><ClipboardCopy size={14}/>Kopiuj</button><button type="button" onClick={download} className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-3 py-2 text-xs hover:border-white/65"><Download size={14}/>TXT</button></div>}</div>
   {!result?<div className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-white/15 bg-[#0b0b0b] px-5 text-center text-white/50"><RotateCcw size={25} strokeWidth={1.4}/><p className="max-w-xs text-sm leading-6">Uzupełnij formularz, aby otrzymać wynik bez zakładania konta.</p></div>:
    <div className="space-y-5">
     <p className="flex items-center gap-2 text-sm font-medium text-white"><Check size={17}/>{result.title}</p>
     {result.metrics&&<dl className="grid gap-2 sm:grid-cols-2">{result.metrics.map(m=><div key={m.label} className="min-w-0 rounded-xl border border-white/10 bg-[#090909] p-3.5"><dt className="text-xs text-white/55">{m.label}</dt><dd className="mt-2 break-words text-lg font-medium tracking-tight text-white">{m.value}</dd></div>)}</dl>}
     {Boolean(result.messages?.length)&&<div className="space-y-2">{result.messages?.map((message,i)=><p key={i} className="rounded-lg border border-white/10 px-3 py-2.5 text-sm leading-6 text-white/80">{message}</p>)}</div>}
     {result.text&&<pre className="max-h-[460px] overflow-auto whitespace-pre-wrap break-all rounded-xl border border-white/10 bg-[#080808] p-4 font-mono text-xs leading-6 text-white/80">{result.text}</pre>}
     {result.warning&&<p className="border-t border-white/10 pt-4 text-xs leading-6 text-white/55">{result.warning}</p>}
    </div>}
  </section>
 </div>;
}
