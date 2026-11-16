"use client";
import {useRef,useState,type FormEvent} from "react";

type Proof={nonce:string;expiresAt:number;signature:string;difficulty:number;solution:number};
async function getBotProof():Promise<Proof>{
 const r=await fetch("/api/contact/send?challenge=1",{cache:"no-store"});
 if(!r.ok)throw new Error("challenge unavailable");
 const v=(await r.json()) as Partial<Proof>;
 if(typeof v.nonce!=="string"||!/^[a-f0-9]{32}$/.test(v.nonce)||typeof v.expiresAt!=="number"||
    typeof v.signature!=="string"||!/^[a-f0-9]{64}$/.test(v.signature)||v.difficulty!==14)throw Error("invalid challenge");
 const encoder=new TextEncoder();
 for(let solution=0;solution<=500000;solution++){
  const digest=new Uint8Array(await crypto.subtle.digest("SHA-256",encoder.encode(v.nonce+":"+solution)));
  if(digest[0]===0&&(digest[1]&0xfc)===0)return {nonce:v.nonce,expiresAt:v.expiresAt,signature:v.signature,difficulty:14,solution};
 }
 throw Error("proof timeout");
}
export function UkrainianLeadForm({service}:{service:string}){
 const [status,setStatus]=useState<"idle"|"sending"|"saved"|"failed">("idle");
 const [feedback,setFeedback]=useState("");
 const mounted=useRef(Date.now());
 async function submit(event:FormEvent<HTMLFormElement>){
  event.preventDefault();if(status==="sending")return;
  const form=event.currentTarget;if(!form.reportValidity())return;
  const f=new FormData(form);setStatus("sending");
  try{
   const botProof=await getBotProof();
   const r=await fetch("/api/contact/send",{method:"POST",headers:{"content-type":"application/json"},
    body:JSON.stringify({name:f.get("name"),email:f.get("email"),company:f.get("company"),service,
      message:"[UK] "+String(f.get("message")||""),website:f.get("website"),
      privacy:f.has("privacy"),requestId:crypto.randomUUID(),elapsedMs:Date.now()-mounted.current,botProof})});
   const data=await r.json().catch(()=>null);
   if(!r.ok||data?.ok!==true||data?.saved!==true)throw Error("not saved");
   setStatus("saved");
   setFeedback(data.notification==="sent"?"Запит збережено та повідомлення надіслано. Дякуємо.":"Запит збережено. Підтвердження надсилання сповіщення немає.");
   form.reset();
   if(window.localStorage.getItem("site-cookie-consent")==="accepted"&&typeof window.gtag==="function")
    window.gtag("event","generate_lead",{lead_type:"contact_form",page_path:window.location.pathname});
  }catch{
   setStatus("failed");setFeedback("Не вдалося зберегти запит. Спробуйте ще раз.");
  }
 }
 const field="w-full rounded-xl border border-white/20 bg-[#111] px-4 py-3 text-white placeholder:text-white/40 focus:border-white/60";
 return <form onSubmit={submit} className="grid gap-4 rounded-2xl border border-white/15 bg-white/[0.03] p-5 sm:p-8">
  <h2 className="text-2xl font-semibold text-white">Отримати пропозицію</h2>
  <p className="text-sm leading-6 text-white/70">Коротко опишіть ваш проєкт. Можна писати українською.</p>
  <div className="grid gap-4 sm:grid-cols-2">
   <label className="grid gap-2 text-sm">Ваше ім’я<input name="name" className={field} required maxLength={90} autoComplete="name"/></label>
   <label className="grid gap-2 text-sm">Електронна пошта<input name="email" type="email" className={field} required maxLength={160} autoComplete="email"/></label>
  </div>
  <label className="grid gap-2 text-sm">Компанія (необов’язково)<input name="company" className={field} maxLength={100} autoComplete="organization"/></label>
  <label className="grid gap-2 text-sm">Що потрібно зробити?<textarea name="message" className={field} required minLength={12} maxLength={3000} rows={5} placeholder="Який сайт, CRM або процес потрібно створити чи вдосконалити?"/></label>
  <div className="absolute -left-[10000px]" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off"/></label></div>
  <label className="flex items-start gap-3 text-xs leading-6 text-white/75"><input type="checkbox" name="privacy" required className="mt-1"/>
   <span>Я ознайомився(-лася) з <a className="underline" href="/polityka-prywatnosci" lang="pl">політикою конфіденційності (польською мовою)</a>. Дані використовуватимуться для відповіді на запит.</span>
  </label>
  <p className="text-xs text-white/50">Не надсилайте паролі, ключі API або чутливі дані.</p>
  {feedback&&<p role={status==="failed"?"alert":"status"} className="text-sm text-white">{feedback}</p>}
  <button type="submit" disabled={status==="sending"} className="brand-action rounded-lg px-6 py-3 font-semibold text-black disabled:opacity-50">{status==="sending"?"Надсилання…":"Надіслати запит"}</button>
 </form>
}
