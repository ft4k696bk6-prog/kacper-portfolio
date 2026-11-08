"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";

const options=[
 ["","Wybierz temat"],
 ["Strona internetowa lub sklep","Strona internetowa lub sklep"],
 ["CRM i aplikacja","CRM i aplikacja"],
 ["AI i automatyzacja","AI i automatyzacja"],
 ["Marketing i reklamy","Marketing i reklamy"],
 ["Rozwój biznesu","Rozwój biznesu"],
 ["Inne / jeszcze nie wiem","Inne / jeszcze nie wiem"]
] as const;
type Status="idle"|"sending"|"success"|"notice"|"error";
type Proof={nonce:string;expiresAt:number;signature:string;difficulty:number;solution:number};

async function getBotProof():Promise<Proof>{
 const r=await fetch("/api/contact/send?challenge=1",{cache:"no-store"});
 if(!r.ok)throw Error("challenge_unavailable");
 const value=(await r.json()) as Partial<Proof>;
 if(typeof value.nonce!=="string"||!/^[a-f0-9]{32}$/.test(value.nonce)||
    typeof value.expiresAt!=="number"||typeof value.signature!=="string"||
    !/^[a-f0-9]{64}$/.test(value.signature)||value.difficulty!==14)throw Error("challenge_invalid");
 const encoder=new TextEncoder();
 for(let solution=0;solution<=500000;solution++){
  const digest=new Uint8Array(await crypto.subtle.digest("SHA-256",encoder.encode(value.nonce+":"+solution)));
  if(digest[0]===0&&(digest[1]&0xfc)===0){
   return {nonce:value.nonce,expiresAt:value.expiresAt,signature:value.signature,difficulty:14,solution};
  }
 }
 throw Error("challenge_failed");
}

export function LeadContactForm({initialService="",english=false}:{initialService?:string;english?:boolean}){
 const [name,setName]=useState(""),[email,setEmail]=useState(""),[company,setCompany]=useState("");
 const [service,setService]=useState(options.some(([v])=>v===initialService)?initialService:"");
 const [message,setMessage]=useState(""),[website,setWebsite]=useState("");
 const [readPolicy,setReadPolicy]=useState(false);
 const [status,setStatus]=useState<Status>("idle"),[feedback,setFeedback]=useState("");
 const mountedAt=useRef(Date.now());
 const field="w-full min-w-0 rounded-xl border border-white/20 bg-[#111] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-white/40 focus:border-white/70";
 async function submit(event:FormEvent<HTMLFormElement>){
  event.preventDefault();if(status==="sending"||!readPolicy)return;
  setStatus("sending");setFeedback("");
  try{
   const botProof=await getBotProof();
   const r=await fetch("/api/contact/send",{
    method:"POST",headers:{"content-type":"application/json"},
    body:JSON.stringify({
     name,email,company,service:service||"Nie określono",message,website,
     privacy:readPolicy,requestId:crypto.randomUUID(),
     elapsedMs:Date.now()-mountedAt.current,botProof
    })
   });
   const data=(await r.json().catch(()=>null)) as {ok?:boolean;saved?:boolean;notification?:string}|null;
   if(!r.ok||data?.ok!==true||data?.saved!==true)throw Error("delivery_failed");
   const notified=data.notification==="sent";
   setStatus(notified?"success":"notice");
   setFeedback(notified
    ?(english?"Your enquiry has been saved and delivered. Thank you.":"Zgłoszenie zapisane i powiadomienie wysłane. Dziękuję.")
    :(english?"Your enquiry has been saved. Email notification is not confirmed; you may also book a call below.":"Zgłoszenie zostało zapisane. Powiadomienie e-mail nie jest potwierdzone — możesz też umówić rozmowę poniżej."));
   setMessage("");
   if(typeof window!=="undefined"&&typeof window.gtag==="function"){
    window.gtag("event","generate_lead",{lead_type:"contact_form",page_path:window.location.pathname});
   }
  }catch{
   setStatus("error");
   setFeedback(english?"Unable to save your message. Please try again or book a conversation.":"Nie udało się zapisać zgłoszenia. Spróbuj ponownie lub umów rozmowę.");
  }
 }
 return <div className="rounded-2xl border border-white/15 bg-white/[0.025] p-5 sm:p-7">
  <div className="mb-6">
   <p className="text-xs uppercase tracking-[0.16em] text-white/55">{english?"Project enquiry":"Zapytanie ofertowe"}</p>
   <h3 className="mt-2 text-2xl font-semibold text-white">{english?"Tell me what you need":"Napisz, co chcesz zrobić"}</h3>
   <p className="mt-2 text-sm leading-6 text-white/65">{english?"A short description is enough. No technical brief needed.":"Wystarczy kilka zdań. Nie musisz znać technicznych szczegółów."}</p>
  </div>
  <form onSubmit={submit} className="grid gap-4">
   <div className="grid gap-4 sm:grid-cols-2">
    <label className="grid gap-2 text-sm text-white/85">{english?"Your name":"Imię i nazwisko"}
     <input className={field} name="name" autoComplete="name" value={name} onChange={e=>setName(e.target.value)} maxLength={90} required/>
    </label>
    <label className="grid gap-2 text-sm text-white/85">E-mail
     <input className={field} name="email" type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} maxLength={160} required/>
    </label>
   </div>
   <div className="grid gap-4 sm:grid-cols-2">
    <label className="grid gap-2 text-sm text-white/85">{english?"Company (optional)":"Firma (opcjonalnie)"}
     <input className={field} name="company" autoComplete="organization" value={company} onChange={e=>setCompany(e.target.value)} maxLength={100}/>
    </label>
    <label className="grid gap-2 text-sm text-white/85">{english?"Project type":"Czego potrzebujesz?"}
     <select className={field} name="service" value={service} onChange={e=>setService(e.target.value)}>
      {options.map(([value,label])=><option key={value} value={value}>{english&&value===""?"Choose a topic":label}</option>)}
     </select>
    </label>
   </div>
   <label className="grid gap-2 text-sm text-white/85">{english?"Describe your project":"Opisz swój pomysł lub problem"}
    <textarea className={field+" min-h-36 resize-y"} name="message" value={message} onChange={e=>setMessage(e.target.value)} minLength={12} maxLength={3000} required placeholder={english?"What would you like to build or improve?":"Co chcesz zbudować lub usprawnić? Jakich narzędzi używasz?"}/>
   </label>
   <div className="absolute -left-[10000px]" aria-hidden="true"><label>Website <input name="website" value={website} onChange={e=>setWebsite(e.target.value)} autoComplete="off" tabIndex={-1}/></label></div>
   <label className="flex items-start gap-3 text-xs leading-6 text-white/70">
    <input type="checkbox" name="privacy" checked={readPolicy} onChange={e=>setReadPolicy(e.target.checked)} required className="mt-1 h-4 w-4 shrink-0 accent-white"/>
    <span>{english?"I have read the ":"Zapoznałem(-am) się z "}<Link href="/polityka-prywatnosci" className="font-medium text-white underline underline-offset-4">{english?"privacy policy":"polityką prywatności"}</Link>. {english?"My data will only be used to handle this enquiry.":"Dane zostaną wykorzystane do obsługi tego zapytania."}</span>
   </label>
   <p className="text-xs leading-5 text-white/50">{english?"Please do not send passwords, API keys or sensitive information.":"Nie przesyłaj haseł, kluczy API ani wrażliwych informacji."}</p>
   {feedback&&<p role={status==="error"?"alert":"status"} className="rounded-lg border border-white/25 p-3 text-sm leading-6 text-white/85">{feedback}</p>}
   <button type="submit" disabled={status==="sending"||!readPolicy} className="brand-action inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-6 py-3.5 font-semibold text-black disabled:cursor-not-allowed disabled:opacity-50">
    {status==="sending"?<Loader2 size={17} className="animate-spin"/>:status==="success"||status==="notice"?<CheckCircle2 size={17}/>:<Send size={17}/>}
    {status==="sending"?(english?"Sending...":"Wysyłanie..."):(english?"Send enquiry":"Wyślij zapytanie")}
   </button>
  </form>
 </div>;
}
