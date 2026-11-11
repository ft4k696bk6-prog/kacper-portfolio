"use client";

import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import { Check, Clipboard, Download, ImagePlus, Link2, Play, RotateCcw, Sparkles, Trash2 } from "lucide-react";
import { signatureHtml, signatureSafeLink, SIGNATURE_SOCIALS } from "@/lib/everyday-utils";
import type { SignatureFields, SignatureLayout, SignatureSocial } from "@/lib/everyday-utils";
import { makeSignatureGif } from "@/lib/signature-animation";
import type { SignatureMotion } from "@/lib/signature-animation";

const initial:SignatureFields={
 name:"",role:"",company:"",email:"",phone:"",website:"",
 accent:"#858585",layout:"side",logoWidth:110,language:"pl",socials:{}
};
const inputStyle="mt-2 w-full min-w-0 rounded-xl border border-white/20 bg-[#090909] px-4 py-3 text-base text-white outline-none placeholder:text-white/35 focus:border-white/60 sm:text-sm";
const templates:{id:SignatureLayout;pl:string;en:string;hintPL:string;hintEN:string}[]=[
 {id:"side",pl:"Nowoczesny",en:"Modern",hintPL:"Logo, pionowy akcent i czytelne dane",hintEN:"Logo, accent bar and clean details"},
 {id:"stacked",pl:"Wizytówka",en:"Business Card",hintPL:"Elegancka karta z ramką",hintEN:"Elegant bordered business card"},
 {id:"compact",pl:"Editorial",en:"Editorial",hintPL:"Typografia i mocna linia",hintEN:"Typography with a bold rule"}
];
const motions:{id:SignatureMotion;pl:string;en:string;descPL:string;descEN:string}[]=[
 {id:"geometry",pl:"Geometria Premium",en:"Premium Geometry",descPL:"WZÓR Z REFERENCJI · Portret z ukośnych fragmentów, logo i dane pojawiające się etapami",descEN:"REFERENCE STYLE · Diagonal portrait slices, animated logo and sequential details"},
 {id:"slices",pl:"Geometric Split",en:"Geometric Split",descPL:"Osobne geometryczne fragmenty zdjęcia wchodzą jeden po drugim",descEN:"Layered diagonal portrait pieces appear one after another"},
 {id:"cinematic",pl:"Cinematic",en:"Cinematic",descPL:"Sekwencyjne odsłanianie i jeden delikatny przebłysk",descEN:"Staggered reveal with one subtle finishing sheen"},
 {id:"reveal",pl:"Klasyczne odsłanianie",en:"Classic Reveal",descPL:"Prostszy styl z elementami pojawiającymi się po kolei",descEN:"Simpler layout with staggered elements"},
 {id:"slide",pl:"Płynne wejście",en:"Slide In",descPL:"Logo i dane płynnie wjeżdżają",descEN:"Logo and details slide into view"},
 {id:"pulse",pl:"Linia i światło",en:"Line Accent",descPL:"Delikatne akcenty podkreślają stopkę",descEN:"Subtle finishing line"}
];
const isData=(source?:string)=>Boolean(source?.startsWith("data:image/"));
const fileHint="PNG / JPG / WebP · max 2 MB";

export function EmailSignatureBuilder({lang}:{lang:"pl"|"en"}){
 const en=lang==="en";
 const [fields,setFields]=useState<SignatureFields>({...initial,language:lang});
 const [mode,setMode]=useState<"static"|"animated">("static");
 const [motion,setMotion]=useState<SignatureMotion>("geometry");
 const [enabled,setEnabled]=useState<Partial<Record<SignatureSocial,boolean>>>({});
 const [uploadNames,setUploadNames]=useState<{logo:string;photo:string}>({logo:"",photo:""});
 const [errors,setErrors]=useState<{logo:string;photo:string}>({logo:"",photo:""});
 const [notice,setNotice]=useState("");
 const [showCode,setShowCode]=useState(false);
 const [replay,setReplay]=useState(0);
 const [busy,setBusy]=useState(false);
 const [gifBlob,setGifBlob]=useState<Blob|null>(null);
 const [gifPreview,setGifPreview]=useState("");
 const [gifData,setGifData]=useState("");
 const [hostedGif,setHostedGif]=useState("");
 const socialValues=useMemo(()=>{
  const values:Partial<Record<SignatureSocial,string>>={};
  SIGNATURE_SOCIALS.forEach(s=>{if(enabled[s.id] && fields.socials?.[s.id]) values[s.id]=fields.socials[s.id];});
  return values;
 },[enabled,fields.socials]);
 const output=useMemo(()=>({...fields,socials:socialValues,language:lang,
  animationUrl:mode==="animated"?(signatureSafeLink(hostedGif)||gifData):"",animationStyle:motion}),[fields,socialValues,lang,mode,hostedGif,gifData,motion]);
 const html=useMemo(()=>signatureHtml(output),[output]);
 const previewHtml=useMemo(()=>signatureHtml({...output,animationUrl:""}),[output]);
 const hostedIsValid=!hostedGif.trim()||Boolean(signatureSafeLink(hostedGif));
 useEffect(()=>()=>{if(gifPreview)URL.revokeObjectURL(gifPreview);},[gifPreview]);

 const invalidateGif=()=>{setGifBlob(null);setGifPreview("");setGifData("");};
 const set=(key:keyof SignatureFields,value:string|number)=>{
  setFields(previous=>({...previous,[key]:value}));invalidateGif();setNotice("");
 };
 const socialChange=(key:SignatureSocial,url:string)=>{
  setFields(previous=>({...previous,socials:{...previous.socials,[key]:url}}));invalidateGif();setNotice("");
 };
 const changeMode=(value:"static"|"animated")=>{setMode(value);if(value==="animated")setMotion("geometry");invalidateGif();setNotice("");setReplay(v=>v+1);};
 const reset=()=>{
  setFields({...initial,language:lang});setMode("static");setMotion("geometry");setEnabled({});
  setUploadNames({logo:"",photo:""});setErrors({logo:"",photo:""});
  setHostedGif("");setNotice("");setShowCode(false);invalidateGif();
 };
 const uploadImage=async(event:ChangeEvent<HTMLInputElement>,key:"logo"|"photo")=>{
  const file=event.target.files?.[0];event.target.value="";
  if(!file)return;
  setErrors(prev=>({...prev,[key]:""}));setNotice("");
  if(!["image/png","image/jpeg","image/webp"].includes(file.type)){
   setErrors(prev=>({...prev,[key]:en?"Choose PNG, JPG or WebP.":"Wybierz PNG, JPG lub WebP."}));return;
  }
  if(file.size>2_000_000){
   setErrors(prev=>({...prev,[key]:en?"Maximum file size is 2 MB.":"Maksymalny rozmiar pliku to 2 MB."}));return;
  }
  const objectUrl=URL.createObjectURL(file);
  try{
   const image=new window.Image();
   await new Promise<void>((resolve,reject)=>{
    image.onload=()=>resolve();
    image.onerror=()=>reject(new Error(en?"Cannot read this image.":"Nie można odczytać zdjęcia."));
    image.src=objectUrl;
   });
   if(!image.naturalWidth||!image.naturalHeight||image.naturalWidth>8000||image.naturalHeight>8000)throw new Error(en?"Invalid dimensions.":"Nieobsługiwane wymiary.");
   const scale=Math.min(1,340/Math.max(image.naturalWidth,image.naturalHeight));
   const canvas=document.createElement("canvas");
   canvas.width=Math.max(1,Math.round(image.naturalWidth*scale));
   canvas.height=Math.max(1,Math.round(image.naturalHeight*scale));
   const ctx=canvas.getContext("2d");if(!ctx)throw new Error("Canvas unavailable");
   ctx.drawImage(image,0,0,canvas.width,canvas.height);
   const data=canvas.toDataURL("image/png");
   if(data.length>480000)throw new Error(en?"Compress this image before uploading.":"Zmniejsz rozmiar grafiki przed wgraniem.");
   setFields(previous=>({...previous,[key]:data}));
   setUploadNames(previous=>({...previous,[key]:file.name}));invalidateGif();
  }catch(error){setErrors(previous=>({...previous,[key]:error instanceof Error?error.message:"Image error"}));}
  finally{URL.revokeObjectURL(objectUrl);}
 };
 const makeGif=async()=>{
  setBusy(true);setNotice("");
  try{
   const blob=await makeSignatureGif({...fields,socials:socialValues},motion);
   const objectUrl=URL.createObjectURL(blob);
   const reader=new FileReader();
   const data=await new Promise<string>((resolve,reject)=>{
    reader.onload=()=>resolve(String(reader.result||""));
    reader.onerror=()=>reject(new Error("Unable to encode GIF"));
    reader.readAsDataURL(blob);
   });
   setGifBlob(blob);setGifPreview(objectUrl);setGifData(data);
   setNotice(en?"Animated GIF created. Use a public HTTPS link for reliable email delivery.":"Animowany GIF jest gotowy. Dla niezawodnego działania w poczcie użyj publicznego linku HTTPS.");
  }catch(error){setNotice(error instanceof Error?error.message:(en?"GIF generation failed.":"Błąd generowania GIF."));}
  finally{setBusy(false);}
 };
 const copyRich=async()=>{
  const text=[fields.name,fields.role,fields.company,fields.email,fields.phone,fields.website].filter(Boolean).join("\n");
  try{
   if(typeof ClipboardItem!=="undefined"&&navigator.clipboard?.write){
    await navigator.clipboard.write([new ClipboardItem({"text/html":new Blob([html],{type:"text/html"}),"text/plain":new Blob([text],{type:"text/plain"})})]);
    setNotice(mode==="animated"&&!signatureSafeLink(hostedGif)
     ?(en?"Copied, but embedded GIFs may be removed in Gmail and Outlook. Host the GIF at a public HTTPS URL for reliable animation.":"Skopiowano, ale Gmail i Outlook mogą usunąć osadzony GIF. Umieść go pod publicznym adresem HTTPS, aby animacja działała niezawodnie.")
     :(en?"Signature copied with active links.":"Skopiowano stopkę z aktywnymi linkami."));
   }else{
    await navigator.clipboard.writeText(html);setNotice(en?"Copied HTML source.":"Skopiowano kod HTML.");
   }
  }catch{setShowCode(true);setNotice(en?"Copying failed. Select the HTML below.":"Kopiowanie nie powiodło się. Zaznacz kod HTML poniżej.");}
 };
 const download=(blob:Blob,name:string)=>{
  const url=URL.createObjectURL(blob),a=document.createElement("a");
  a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();
  window.setTimeout(()=>URL.revokeObjectURL(url),1000);
 };
 const downloadHtml=()=>download(new Blob(['<!doctype html><html><head><meta charset="utf-8"><title>Email signature</title></head><body style="margin:24px;background:#fff">'+html+"</body></html>"],{type:"text/html;charset=utf-8"}),"darmowa-stopka-email.html");
 const contact:[keyof Pick<SignatureFields,"name"|"role"|"company"|"email"|"phone"|"website">,string,string,string][]=[
  ["name","Imię i nazwisko","Full name",en?"Jane Smith":"Jan Kowalski"],
  ["role","Stanowisko","Job title",en?"Sales director":"Dyrektor sprzedaży"],
  ["company","Firma","Company",en?"Your Company":"Twoja firma"],
  ["email","E-mail","Email","kontakt@firma.pl"],
  ["phone","Telefon","Phone","+48 500 600 700"],
  ["website","Strona WWW","Website","twojafirma.pl"]
 ];
 const uploadBox=(key:"logo"|"photo",pl:string,enLabel:string)=>(
  <div className="min-w-0 space-y-2">
   <label className="flex min-h-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-white/30 bg-[#0b0b0b] p-3 text-center hover:border-white/60">
    <ImagePlus size={21}/><span className="text-sm font-medium">{en?enLabel:pl}</span>
    <span className="max-w-full truncate text-[11px] text-white/50">{uploadNames[key]||fileHint}</span>
    <input type="file" accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp" className="sr-only" onChange={event=>uploadImage(event,key)}/>
   </label>
   <label className="block text-xs text-white/65">{en?"Or public image URL":"Lub publiczny adres grafiki"}
    <input type="url" inputMode="url" className={inputStyle} placeholder="https://example.com/image.png" value={!isData(fields[key])?fields[key]||"":""} onChange={event=>{set(key,event.target.value);setUploadNames(p=>({...p,[key]:""}));}}/>
   </label>
   {fields[key]&&<button type="button" className="flex items-center gap-1 text-[11px] text-white/55 hover:text-white" onClick={()=>{set(key,"");setUploadNames(p=>({...p,[key]:""}));}}><Trash2 size={12}/>{en?"Remove image":"Usuń grafikę"}</button>}
   {errors[key]&&<p className="text-xs text-rose-300">{errors[key]}</p>}
  </div>
 );
 return <div className="min-w-0">
  <style>{String.raw`@keyframes sigAppear{from{opacity:0;transform:translateY(15px)}to{opacity:1;transform:translateY(0)}}@media(prefers-reduced-motion:reduce){.signature-motion-item{animation:none!important}}`}</style>
  <div className="mb-6">
   <p className="text-xs uppercase tracking-[.17em] text-white/45">{en?"FREE EMAIL SIGNATURE STUDIO":"DARMOWY GENERATOR STOPKI E-MAIL"}</p>
   <h2 className="mt-2 text-2xl font-semibold tracking-tight">{en?"Create a signature that stands out.":"Stwórz stopkę, którą zapamiętają."}</h2>
   <p className="mt-2 max-w-3xl text-sm leading-6 text-white/60">{en?"Choose a classic HTML signature or a lightweight animated GIF with real clickable links. No account and no tracking.":"Wybierz klasyczną stopkę HTML albo animację GIF z działającymi linkami. Bez konta i śledzenia."}</p>
  </div>
  <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.95fr)]">
   <div className="min-w-0 space-y-5">
    <section className="rounded-2xl border border-white/15 bg-[#111111] p-5 md:p-6">
     <div className="flex flex-wrap items-center justify-between gap-3">
      <h3 className="text-base font-semibold">{en?"1. Signature type":"1. Rodzaj stopki"}</h3>
      <button type="button" onClick={reset} className="inline-flex items-center gap-2 text-xs text-white/60 hover:text-white"><RotateCcw size={14}/>{en?"Reset":"Wyczyść"}</button>
     </div>
     <div className="mt-4 grid grid-cols-2 gap-2">
      {(["static","animated"] as const).map(id=><button key={id} type="button" onClick={()=>changeMode(id)} aria-pressed={mode===id} className={"rounded-xl border px-3 py-4 text-left transition "+(mode===id?"border-white/70 bg-white/10":"border-white/15 bg-black/30 hover:border-white/35")}>
       <span className="flex items-center gap-2 text-sm font-semibold">{id==="animated"?<Sparkles size={17}/>:<Link2 size={17}/>} {id==="animated"?(en?"Animated":"Dynamiczna"):(en?"Classic":"Zwykła")}</span>
       <span className="mt-1 block text-xs leading-5 text-white/55">{id==="animated"?(en?"GIF reveal + clickable social links":"Animowany GIF + aktywne linki"):(en?"Professional email-safe HTML":"Klasyczny HTML do poczty")}</span>
      </button>)}
     </div>
    </section>
    <section className="rounded-2xl border border-white/15 bg-[#111111] p-5 md:p-6">
     <h3 className="text-base font-semibold">{en?"2. Contact details":"2. Dane kontaktowe"}</h3>
     <div className="mt-4 grid gap-4 sm:grid-cols-2">{contact.map(([key,pl,enName,placeholder])=><label key={key} className="min-w-0 text-sm text-white/75">{en?enName:pl}
      <input type={key==="email"?"email":key==="phone"?"tel":"text"} className={inputStyle} value={fields[key]} placeholder={placeholder} onChange={event=>set(key,event.target.value)}/>
     </label>)}</div>
    </section>
    <section className="rounded-2xl border border-white/15 bg-[#111111] p-5 md:p-6">
     <h3 className="text-base font-semibold">{en?"3. Logo and profile picture":"3. Logo i zdjęcie"}</h3>
     <p className="mt-2 text-xs leading-5 text-white/55">{en?"Your images remain in the browser. For a signature installed in email, hosted HTTPS images are recommended.":"Wgrywane zdjęcia pozostają w przeglądarce. Do trwałej stopki w poczcie najlepiej używać grafik dostępnych przez HTTPS."}</p>
     <div className="mt-4 grid gap-4 sm:grid-cols-2">{uploadBox("logo","Wgraj logo","Upload logo")}{uploadBox("photo","Dodaj zdjęcie","Add portrait")}</div>
     <div className="mt-4 grid gap-4 sm:grid-cols-2">
      <label className="flex items-center justify-between rounded-xl border border-white/15 p-3 text-xs text-white/75">{en?"Accent colour":"Kolor akcentu"}<input type="color" className="h-9 w-12 bg-transparent" value={fields.accent} onChange={event=>set("accent",event.target.value)}/></label>
      <label className="rounded-xl border border-white/15 px-3 py-2 text-xs text-white/75">{en?"Logo width":"Szerokość logo"}: {fields.logoWidth} px
       <input type="range" className="mt-2 w-full accent-white" min="60" max="180" step="5" value={fields.logoWidth||110} onChange={event=>set("logoWidth",Number(event.target.value))}/></label>
     </div>
    </section>
    <section className="rounded-2xl border border-white/15 bg-[#111111] p-5 md:p-6">
     <h3 className="text-base font-semibold">{en?"4. Social media and links":"4. Social media i linki"}</h3>
     <p className="mt-2 text-xs text-white/55">{en?"Check a service and paste its URL. Every enabled icon is a separate, working HTML link.":"Zaznacz serwis i wpisz link. Każda aktywna ikona będzie osobnym, klikalnym odnośnikiem."}</p>
     <div className="mt-4 grid gap-3 sm:grid-cols-2">{SIGNATURE_SOCIALS.map(item=><div key={item.id} className="rounded-xl border border-white/15 bg-black/20 p-3">
      <label className="flex cursor-pointer items-center gap-2 text-sm text-white/85">
       <input type="checkbox" checked={Boolean(enabled[item.id])} onChange={event=>{setEnabled(prev=>({...prev,[item.id]:event.target.checked}));setNotice("");}} className="h-4 w-4 accent-white"/>
       <span className="flex h-7 min-w-7 items-center justify-center rounded-md bg-white/10 px-1 text-[11px] font-bold">{item.short}</span>{item.name}
      </label>
      {enabled[item.id]&&<><input type="url" inputMode="url" aria-label={item.name+" URL"} className={inputStyle} placeholder="https://" value={fields.socials?.[item.id]||""} onChange={event=>socialChange(item.id,event.target.value)}/>
       {fields.socials?.[item.id]&&!signatureSafeLink(fields.socials[item.id]||"")&&<p className="mt-2 text-xs text-rose-300">{en?"Enter a public HTTPS URL":"Podaj poprawny link HTTPS"}</p>}</>}
     </div>)}</div>
    </section>
    <section className="rounded-2xl border border-white/15 bg-[#111111] p-5 md:p-6">
     <h3 className="text-base font-semibold">{en?"5. Design":"5. Wygląd"}</h3>
     {mode==="static"?<div className="mt-4 grid gap-2 sm:grid-cols-3">{templates.map(item=><button type="button" key={item.id} aria-pressed={(fields.layout||"side")===item.id} onClick={()=>set("layout",item.id)} className={"rounded-xl border px-3 py-4 text-left "+((fields.layout||"side")===item.id?"border-white/70 bg-white/10":"border-white/15 bg-black/30 hover:border-white/40")}>
      <span className="block text-sm font-medium">{en?item.en:item.pl}</span><span className="mt-2 block text-[11px] leading-5 text-white/55">{en?item.hintEN:item.hintPL}</span>
     </button>)}</div>:<>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">{motions.map(item=><button key={item.id} type="button" aria-pressed={motion===item.id} onClick={()=>{setMotion(item.id);invalidateGif();setReplay(v=>v+1);}} className={"rounded-xl border px-3 py-4 text-left "+(motion===item.id?"border-white/70 bg-white/10":"border-white/15 bg-black/30 hover:border-white/40")}>
       <span className="block text-sm font-medium">{en?item.en:item.pl}</span><span className="mt-2 block text-[11px] leading-5 text-white/55">{en?item.descEN:item.descPL}</span>
      </button>)}</div>
      <button type="button" disabled={busy} onClick={makeGif} className="brand-action mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-4 text-sm font-medium disabled:opacity-50"><Sparkles size={17}/>{busy?(en?"Generating GIF…":"Generowanie GIF…"):(en?"Generate animated GIF":"Generuj animowany GIF")}</button>
      {gifBlob&&<button type="button" onClick={()=>download(gifBlob,"animowana-stopka-bernecki.gif")} className="mt-2 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/30 px-4 text-sm"><Download size={16}/>{en?"Download GIF":"Pobierz GIF"}</button>}
      <label className="mt-5 block text-xs leading-5 text-white/70">{en?"Public GIF URL (recommended for Gmail / Outlook)":"Publiczny adres GIF (zalecany do Gmaila / Outlooka)"}
       <input type="url" inputMode="url" className={inputStyle} value={hostedGif} placeholder="https://twojadomena.pl/stopka.gif" onChange={event=>{setHostedGif(event.target.value);setNotice("");}}/>
       {!hostedIsValid&&<span className="mt-2 block text-rose-300">{en?"Use a full public HTTPS URL.":"Wpisz poprawny publiczny adres HTTPS."}</span>}
      </label>
      <p className="mt-3 text-xs leading-6 text-white/55">{en?"Download the GIF and host it at your HTTPS URL for reliable playback in popular mail apps. Without a hosted link we can embed the GIF in HTML, but some email providers remove embedded images.":"Pobierz GIF i umieść go pod publicznym adresem HTTPS, aby animacja działała pewniej. Bez hostingu GIF może być osadzony w HTML, ale część programów pocztowych usuwa takie obrazy."}</p>
     </>}
    </section>
   </div>
   <section className="min-w-0 self-start rounded-2xl border border-white/20 bg-[#141414] p-5 xl:sticky xl:top-28 md:p-6">
    <div className="flex items-center justify-between gap-3">
     <div><p className="text-xs font-semibold uppercase tracking-[.15em] text-white/50">{en?"LIVE PREVIEW":"PODGLĄD NA ŻYWO"}</p><p className="mt-2 text-xs text-white/65">{en?"As seen in an email message":"Tak wygląda w wiadomości e-mail"}</p></div>
     {mode==="animated"&&<button type="button" onClick={()=>{setReplay(v=>v+1);if(gifBlob)setGifPreview(URL.createObjectURL(gifBlob));}} className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 px-3 py-2 text-xs hover:border-white/50"><Play size={14}/>{en?"Replay":"Odtwórz"}</button>}
    </div>
    <div className="mt-4 min-w-0 overflow-x-auto rounded-xl border border-[#d5d5d5] bg-white px-3 py-6 sm:p-6">
     {mode==="static"?<div className="w-max min-w-0 max-w-full" aria-label={en?"Static signature preview":"Podgląd zwykłej stopki"} dangerouslySetInnerHTML={{__html:previewHtml}}/>:
      gifPreview?<div className="min-w-[260px] max-w-[520px]"><img key={replay} src={gifPreview} alt={en?"Animated signature preview":"Podgląd animowanej stopki"} width={520} height={178} className="h-auto w-full"/>
       <div className="mt-3 flex flex-wrap gap-2">{SIGNATURE_SOCIALS.filter(x=>socialValues[x.id]&&signatureSafeLink(socialValues[x.id]||"")).map(x=><a key={x.id} href={signatureSafeLink(socialValues[x.id]||"")} target="_blank" rel="noopener noreferrer" className="rounded border border-[#ddd] bg-[#f1f1f1] px-2 py-1 text-xs font-bold text-[#252525]">{x.short}</a>)}</div>
      </div>:
      <div key={replay} className="relative h-[188px] min-w-[300px] max-w-[520px] overflow-hidden rounded-lg border border-[#e5e5e5] bg-[#fafafa] p-5 font-sans">
       <div className="signature-motion-item absolute bottom-4 left-4 top-4 w-[3px] rounded-full" style={{background:fields.accent,animation:"sigAppear .5s ease .1s both"}}/>
       <div className="signature-motion-item ml-3 max-w-[65%]" style={{animation:"sigAppear .85s ease .35s both"}}>
        {fields.logo?<img src={fields.logo} alt="" className="mb-3 max-h-10 max-w-28 object-contain"/>:<span className="mb-3 block text-xs font-bold tracking-[.15em] text-[#333]">{fields.company||"YOUR BRAND"}</span>}
        <p className="truncate text-lg font-bold text-[#1b1b1b]">{fields.name||(en?"Your Name":"Imię i nazwisko")}</p>
        <p className="truncate text-xs text-[#555]">{fields.role}</p>
        <p className="mt-2 truncate text-xs text-[#777]">{fields.email||fields.website}</p>
       </div>
       <div className="signature-motion-item absolute right-4 top-6 h-28 w-20 overflow-hidden rounded-xl bg-[#e8e8e8]" style={{animation:"sigAppear .9s ease .85s both"}}>{fields.photo?<img src={fields.photo} alt="" className="h-full w-full object-cover"/>:<div className="flex h-full items-center justify-center text-3xl text-[#aaa]">◉</div>}</div>
       <div className="signature-motion-item absolute bottom-3 left-8 flex gap-2" style={{animation:"sigAppear .8s ease 1.2s both"}}>{SIGNATURE_SOCIALS.filter(x=>enabled[x.id]&&signatureSafeLink(fields.socials?.[x.id]||"")).slice(0,6).map(x=><span key={x.id} className="rounded border border-[#ddd] bg-[#eee] px-2 py-1 text-[10px] font-bold text-[#333]">{x.short}</span>)}</div>
      </div>}
    </div>
    <div className="mt-4 grid gap-2 sm:grid-cols-2">
     <button type="button" onClick={copyRich} disabled={mode==="animated"&&!gifData&&!signatureSafeLink(hostedGif)} className="brand-action inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-3 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-45"><Clipboard size={17}/>{en?"Copy signature":"Kopiuj stopkę"}</button>
     <button type="button" onClick={downloadHtml} disabled={mode==="animated"&&!gifData&&!signatureSafeLink(hostedGif)} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/25 px-3 text-sm hover:border-white/60 disabled:opacity-45"><Download size={17}/>{en?"Download HTML":"Pobierz HTML"}</button>
    </div>
    {mode==="animated"&&!gifData&&!signatureSafeLink(hostedGif)&&<p className="mt-3 text-xs text-amber-200/80">{en?"Generate a GIF first, or enter its public HTTPS URL to enable export.":"Najpierw wygeneruj GIF lub podaj jego publiczny adres HTTPS, aby włączyć eksport."}</p>}
    {notice&&<p role="status" className="mt-3 flex items-start gap-2 text-xs leading-6 text-white/75"><Check size={15} className="mt-1 shrink-0"/>{notice}</p>}
    <div className="mt-5 border-t border-white/10 pt-4">
     <p className="text-xs leading-6 text-white/55">{en?"Linked social buttons remain real HTML links. Some mail apps only display the first GIF frame or block images. The generated GIF starts with a complete fallback frame.":"Ikony social media pozostają prawdziwymi linkami HTML. Niektóre programy wyświetlają tylko pierwszą klatkę GIF lub blokują obrazy. Pierwsza klatka zawiera pełną stopkę."}</p>
     <button type="button" onClick={()=>setShowCode(v=>!v)} aria-expanded={showCode} className="mt-4 text-xs text-white/75 underline underline-offset-4">{showCode?(en?"Hide HTML":"Ukryj HTML"):(en?"Show HTML":"Pokaż HTML")}</button>
     {showCode&&<div className="mt-3 space-y-2"><textarea readOnly rows={6} className={inputStyle+" resize-y font-mono text-xs"} value={html} aria-label={en?"Signature HTML code":"Kod HTML stopki"}/><button type="button" className="text-xs underline" onClick={async()=>{try{await navigator.clipboard.writeText(html);setNotice(en?"HTML copied.":"HTML skopiowany.");}catch{setNotice(en?"Select and copy the code.":"Zaznacz i skopiuj kod.");}}}>{en?"Copy HTML code":"Kopiuj HTML"}</button></div>}
    </div>
   </section>
  </div>
 </div>;
}
