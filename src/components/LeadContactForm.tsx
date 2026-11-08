"use client";

import { useState, type FormEvent } from "react";
import { ArrowUpRight, CheckCircle2, Loader2, Mail, Send } from "lucide-react";
import { Turnstile } from "@marsidev/react-turnstile";

const serviceChoices=[
 ["","Wybierz temat"],
 ["Strona internetowa lub sklep","Strona internetowa lub sklep"],
 ["CRM i aplikacja","CRM i aplikacja"],
 ["AI i automatyzacja","AI i automatyzacja"],
 ["Marketing i reklamy","Marketing i reklamy"],
 ["Rozwój biznesu","Rozwój biznesu"],
 ["Inne / jeszcze nie wiem","Inne / jeszcze nie wiem"]
] as const;

type Status="idle"|"sending"|"success"|"fallback";
const recipient="kacper@bernecki.dev";

export function LeadContactForm({initialService="",english=false}:{initialService?:string;english?:boolean}) {
 const [name,setName]=useState("");
 const [email,setEmail]=useState("");
 const [service,setService]=useState(serviceChoices.some(([v])=>v===initialService)?initialService:"");
 const [message,setMessage]=useState("");
 const [company,setCompany]=useState("");
 const [website,setWebsite]=useState("");
 const [token,setToken]=useState("");
 const [status,setStatus]=useState<Status>("idle");
 const [feedback,setFeedback]=useState("");
 const siteKey=process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
 const mailSubject="Zapytanie z bernecki.dev — "+(service||"Współpraca");
 const mailBody="Imię: "+name+"\nEmail: "+email+"\nFirma: "+(company||"—")+"\nTemat: "+(service||"—")+"\n\n"+message;
 const mailto="mailto:"+recipient+"?subject="+encodeURIComponent(mailSubject)+"&body="+encodeURIComponent(mailBody);
 const field="w-full min-w-0 rounded-xl border border-white/20 bg-[#111] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-white/40 focus:border-white/70";
 async function submit(event:FormEvent<HTMLFormElement>){
  event.preventDefault();
  if(status==="sending")return;
  setStatus("sending");setFeedback("");
  try{
   const res=await fetch("/api/contact/send",{
    method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({name,email,company,service:service||"Nie określono",message,website,turnstileToken:token})
   });
   if(!res.ok)throw Error("service_unavailable");
   setStatus("success");
   setFeedback(english?"Your message has been sent. Thank you.":"Wiadomość została wysłana. Dziękuję za kontakt.");
   setMessage("");setToken("");
   if(typeof window.gtag==="function"){window.gtag("event","generate_lead",{lead_type:"contact_form",page_path:window.location.pathname});}
  }catch{
   setStatus("fallback");
   setFeedback(english?"Automatic delivery is unavailable. Use the button below to open a ready-to-send email in your mail app.":"Automatyczna wysyłka jest niedostępna. Poniżej możesz otworzyć gotową wiadomość w swojej poczcie i wysłać ją samodzielnie.");
  }
 }
 return <div className="rounded-2xl border border-white/15 bg-white/[0.025] p-5 sm:p-7">
   <div className="mb-6">
    <p className="text-xs uppercase tracking-[0.16em] text-white/55">{english?"Project enquiry":"Zapytanie ofertowe"}</p>
    <h3 className="mt-2 text-2xl font-semibold text-white">{english?"Tell me what you need":"Napisz, co chcesz zrobić"}</h3>
    <p className="mt-2 text-sm leading-6 text-white/65">{english?"A few sentences are enough. No need for a technical brief.":"Wystarczy kilka zdań. Nie musisz znać technicznych szczegółów."}</p>
   </div>
   <form onSubmit={submit} className="grid gap-4">
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="grid gap-2 text-sm text-white/85">{english?"Your name":"Imię i nazwisko"}
       <input className={field} name="name" autoComplete="name" value={name} onChange={e=>setName(e.target.value)} maxLength={90} placeholder={english?"Full name":"Jak się nazywasz?"} required/>
      </label>
      <label className="grid gap-2 text-sm text-white/85">E-mail
       <input className={field} name="email" type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} maxLength={160} placeholder="name@company.com" required/>
      </label>
    </div>
    <div className="grid gap-4 sm:grid-cols-2">
     <label className="grid gap-2 text-sm text-white/85">{english?"Company (optional)":"Firma (opcjonalnie)"}
      <input className={field} name="company" autoComplete="organization" value={company} onChange={e=>setCompany(e.target.value)} maxLength={100} placeholder={english?"Company name":"Nazwa firmy"}/>
     </label>
     <label className="grid gap-2 text-sm text-white/85">{english?"What do you need?":"Czego potrzebujesz?"}
      <select className={field} name="service" value={service} onChange={e=>setService(e.target.value)}>
       {serviceChoices.map(([value,label])=><option key={value} value={value}>{english&&value===""?"Choose a topic":label}</option>)}
      </select>
     </label>
    </div>
    <label className="grid gap-2 text-sm text-white/85">{english?"Describe the project":"Opisz swój pomysł lub problem"}
      <textarea className={field+" min-h-36 resize-y"} name="message" value={message} onChange={e=>setMessage(e.target.value)} required minLength={12} maxLength={3000} placeholder={english?"What would you like to change?":"Co ma działać lepiej? Co chcesz zbudować? Jakich narzędzi używasz?"}/>
    </label>
    <div className="absolute -left-[10000px]" aria-hidden="true">
     <label>Website <input tabIndex={-1} autoComplete="off" name="website" value={website} onChange={e=>setWebsite(e.target.value)}/></label>
    </div>
    {siteKey?<div className="max-w-full overflow-hidden"><Turnstile siteKey={siteKey} onSuccess={setToken} onExpire={()=>setToken("")} options={{theme:"dark",size:"flexible"}}/></div>:null}
    <p className="text-xs leading-5 text-white/55">{english?"By sending, you request a response to your enquiry. Do not include passwords, API keys or sensitive personal data.":"Wysyłając formularz, prosisz o odpowiedź na zapytanie. Nie przesyłaj haseł, kluczy API ani wrażliwych danych."}</p>
    {feedback&&<p role="status" className={"rounded-lg border p-3 text-sm leading-6 "+(status==="success"?"border-white/30 text-white":"border-amber-400/35 text-white/85")}>{feedback}</p>}
    <button type="submit" disabled={status==="sending"||(Boolean(siteKey)&&!token)} className="brand-action inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-6 py-3.5 font-semibold text-black disabled:cursor-not-allowed disabled:opacity-50">
      {status==="sending"?<Loader2 size={17} className="animate-spin"/>:status==="success"?<CheckCircle2 size={17}/>:<Send size={17}/>}
      {status==="success"?(english?"Message sent":"Wiadomość wysłana"):(english?"Send enquiry":"Wyślij zapytanie")}
    </button>
    {status==="fallback"&&<a className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/40 px-5 py-3 text-center text-sm font-medium text-white hover:border-white" href={mailto}>
      <Mail size={17} aria-hidden="true"/>{english?"Open email to send":"Otwórz gotowego e-maila"}<ArrowUpRight size={15} aria-hidden="true"/>
    </a>}
    <a className="text-center text-xs text-white/60 underline underline-offset-4 hover:text-white" href={mailto}>
     {english?"Prefer your own mail app?":"Wolisz napisać ze swojej poczty?"}
    </a>
   </form>
  </div>;
}
