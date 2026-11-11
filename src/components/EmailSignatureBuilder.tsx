"use client";

import { useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import { Check, Clipboard, Download, ImagePlus, Link2, RotateCcw, Trash2 } from "lucide-react";
import { signatureHtml } from "@/lib/everyday-utils";
import type { SignatureFields, SignatureLayout } from "@/lib/everyday-utils";

const initial:SignatureFields={
 name:"",role:"",company:"",email:"",phone:"",website:"",
 accent:"#939393",layout:"side",logoWidth:110,language:"pl"
};
const fieldClass="mt-2 w-full min-w-0 rounded-xl border border-white/20 bg-[#090909] px-4 py-3 text-base text-white outline-none placeholder:text-white/35 focus:border-white/60 sm:text-sm";
const layouts:{id:SignatureLayout;pl:string;en:string;hintPL:string;hintEN:string}[]=[
 {id:"side",pl:"Nowoczesny",en:"Modern",hintPL:"Logo po lewej",hintEN:"Logo on the left"},
 {id:"stacked",pl:"Elegancki",en:"Elegant",hintPL:"Logo nad danymi",hintEN:"Logo above details"},
 {id:"compact",pl:"Minimalny",en:"Minimal",hintPL:"Logo po prawej",hintEN:"Logo on the right"}
];

export function EmailSignatureBuilder({lang}:{lang:"pl"|"en"}) {
 const en=lang==="en";
 const [fields,setFields]=useState<SignatureFields>({...initial,language:lang});
 const [uploadName,setUploadName]=useState("");
 const [logoError,setLogoError]=useState("");
 const [message,setMessage]=useState("");
 const [showCode,setShowCode]=useState(false);
 const html=useMemo(()=>signatureHtml({...fields,language:lang}),[fields,lang]);
 const hasLocalLogo=Boolean(fields.logo?.startsWith("data:"));
 const hasOnlineLogo=Boolean(fields.logo?.startsWith("https://"));
 const set=(key:keyof SignatureFields,value:string|number)=>{
  setFields(previous=>({...previous,[key]:value}));
  setMessage("");
 };
 const uploadLogo=async(event:ChangeEvent<HTMLInputElement>)=>{
  const file=event.target.files?.[0];
  event.target.value="";
  if(!file)return;
  setLogoError("");setMessage("");
  if(!["image/png","image/jpeg","image/webp"].includes(file.type)){
   setLogoError(en?"Choose PNG, JPG or WebP (SVG is not supported).":"Wybierz PNG, JPG lub WebP (SVG nie jest obsługiwane).");return;
  }
  if(file.size>2_000_000){
   setLogoError(en?"Maximum logo size is 2 MB.":"Maksymalny rozmiar logo to 2 MB.");return;
  }
  const objectUrl=URL.createObjectURL(file);
  try{
   const image=new window.Image();
   image.src=objectUrl;
   await new Promise<void>((resolve,reject)=>{image.onload=()=>resolve();image.onerror=()=>reject(new Error(en?"Unable to open this image.":"Nie udało się otworzyć pliku."));});
   if(!image.naturalWidth||!image.naturalHeight||image.naturalWidth>8000||image.naturalHeight>8000)throw new Error(en?"Unsupported image dimensions.":"Nieobsługiwane wymiary grafiki.");
   const ratio=Math.min(1,340/Math.max(image.naturalWidth,image.naturalHeight));
   const canvas=document.createElement("canvas");
   canvas.width=Math.max(1,Math.round(image.naturalWidth*ratio));
   canvas.height=Math.max(1,Math.round(image.naturalHeight*ratio));
   const ctx=canvas.getContext("2d");
   if(!ctx)throw new Error(en?"Image processing is not available.":"Przetwarzanie grafiki jest niedostępne.");
   ctx.drawImage(image,0,0,canvas.width,canvas.height);
   const data=canvas.toDataURL("image/png");
   if(data.length>480000)throw new Error(en?"The logo is still too large. Use a smaller PNG or a public HTTPS link.":"Logo jest nadal za duże. Użyj mniejszego PNG lub publicznego linku HTTPS.");
   setFields(previous=>({...previous,logo:data}));
   setUploadName(file.name);
  }catch(error){
   setLogoError(error instanceof Error?error.message:(en?"Could not process the logo.":"Nie udało się przetworzyć logo."));
  }finally{URL.revokeObjectURL(objectUrl);}
 };
 const copyRich=async()=>{
  const plain=[fields.name,fields.role,fields.company,fields.email,fields.phone,fields.website].filter(Boolean).join("\n");
  try{
   if(typeof ClipboardItem!=="undefined"&&navigator.clipboard?.write){
    await navigator.clipboard.write([new ClipboardItem({
     "text/html":new Blob([html],{type:"text/html"}),
     "text/plain":new Blob([plain],{type:"text/plain"})
    })]);
    setMessage(hasLocalLogo
     ?en?"Signature copied. Some email apps remove locally embedded logos; use a public HTTPS logo URL for a lasting result.":"Skopiowano stopkę. Niektóre programy pocztowe usuwają logo osadzone lokalnie. Trwały efekt wymaga publicznego adresu HTTPS."
     :en?"Formatted signature copied. Paste it into your mail signature settings.":"Skopiowano sformatowaną stopkę. Wklej ją w ustawieniach podpisu poczty.");
    return;
   }
   await navigator.clipboard.writeText(html);
   setMessage(en?"HTML source copied. Rich clipboard is not available in this browser.":"Skopiowano kod HTML. Przeglądarka nie obsługuje formatowanego schowka.");
  }catch{
   setShowCode(true);
   setMessage(en?"Copying failed. Select and copy the HTML code below.":"Kopiowanie nie powiodło się. Zaznacz i skopiuj kod HTML poniżej.");
  }
 };
 const downloadHtml=()=>{
  const documentHtml='<!doctype html><html><head><meta charset="utf-8"><title>Email signature</title></head><body style="margin:24px;background:white">'+html+'</body></html>';
  const url=URL.createObjectURL(new Blob([documentHtml],{type:"text/html;charset=utf-8"}));
  const link=document.createElement("a");link.href=url;link.download="stopka-email.html";document.body.appendChild(link);link.click();link.remove();
  window.setTimeout(()=>URL.revokeObjectURL(url),1000);
 };
 const fieldsList:{key:"name"|"role"|"company"|"email"|"phone"|"website";pl:string;en:string;placeholder:string}[]=[
  {key:"name",pl:"Imię i nazwisko",en:"Full name",placeholder:en?"Jane Smith":"Jan Kowalski"},
  {key:"role",pl:"Stanowisko",en:"Job title",placeholder:en?"Sales director":"Dyrektor sprzedaży"},
  {key:"company",pl:"Nazwa firmy",en:"Company",placeholder:en?"Your Company":"Twoja firma"},
  {key:"email",pl:"Adres e-mail",en:"Email address",placeholder:"kontakt@firma.pl"},
  {key:"phone",pl:"Telefon",en:"Phone number",placeholder:"+48 500 600 700"},
  {key:"website",pl:"Strona WWW",en:"Website",placeholder:"twojafirma.pl"}
 ];
 return <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.95fr)]">
  <div className="min-w-0 space-y-6">
   <section className="rounded-2xl border border-white/15 bg-[#111111] p-5 md:p-7">
    <div className="flex items-center justify-between gap-3">
     <h3 className="text-lg font-medium">{en?"1. Contact details":"1. Dane kontaktowe"}</h3>
     <button type="button" onClick={()=>{setFields({...initial,language:lang});setLogoError("");setUploadName("");setMessage("");}} className="inline-flex items-center gap-1.5 text-xs text-white/60 hover:text-white"><RotateCcw size={14}/>{en?"Reset":"Wyczyść"}</button>
    </div>
    <div className="mt-5 grid gap-4 sm:grid-cols-2">
     {fieldsList.map(f=><label key={f.key} className="min-w-0 text-sm text-white/75">{en?f.en:f.pl}
      <input type={f.key==="email"?"email":f.key==="phone"?"tel":f.key==="website"?"url":"text"} className={fieldClass} value={fields[f.key]} onChange={e=>set(f.key,e.target.value)} placeholder={f.placeholder} autoComplete={f.key==="email"?"email":f.key==="name"?"name":undefined}/>
     </label>)}
    </div>
   </section>
   <section className="rounded-2xl border border-white/15 bg-[#111111] p-5 md:p-7">
    <h3 className="text-lg font-medium">{en?"2. Logo & style":"2. Logo i wygląd"}</h3>
    <p className="mt-2 text-xs leading-6 text-white/55">{en?"Upload a logo locally or use a public HTTPS image URL. PNG with a transparent background looks best.":"Wgraj logo lokalnie albo podaj publiczny adres HTTPS grafiki. Najlepiej wygląda PNG z przezroczystym tłem."}</p>
    <div className="mt-5 grid gap-3 sm:grid-cols-2">
     <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/30 bg-[#0b0b0b] p-4 text-center transition-colors hover:border-white/65">
      <ImagePlus size={23} strokeWidth={1.5}/><span className="text-sm font-medium">{en?"Upload logo":"Wgraj logo"}</span>
      <span className="max-w-full truncate text-xs text-white/55">{uploadName||"PNG / JPG / WebP · max 2 MB"}</span>
      <input type="file" accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp" className="sr-only" onChange={uploadLogo}/>
     </label>
     <label className="flex min-w-0 flex-col justify-center rounded-xl border border-white/15 bg-[#0b0b0b] p-4 text-sm text-white/75"><span className="flex items-center gap-2"><Link2 size={16}/>{en?"Or paste logo URL":"Lub wklej link do logo"}</span>
      <input type="url" inputMode="url" className={fieldClass} placeholder="https://firma.pl/logo.png" value={hasOnlineLogo?fields.logo||"":""} onChange={e=>{set("logo",e.target.value);setUploadName("");setLogoError("");}}/>
     </label>
    </div>
    {(fields.logo||logoError)&&<div className="mt-3 flex flex-wrap items-center justify-between gap-3">
     <p className={"text-xs leading-6 "+(logoError?"text-rose-300":"text-white/55")}>{logoError||(hasLocalLogo?(en?"Logo loaded locally and resized.":"Logo wczytane lokalnie i zmniejszone."):(en?"HTTPS logo address selected.":"Wybrano adres HTTPS logo."))}</p>
     {fields.logo&&<button type="button" onClick={()=>{set("logo","");setUploadName("");setLogoError("");}} className="inline-flex items-center gap-1 text-xs text-white/70 hover:text-white"><Trash2 size={13}/>{en?"Remove logo":"Usuń logo"}</button>}
    </div>}
    <div className="mt-6">
     <p className="text-sm text-white/75">{en?"Layout":"Układ stopki"}</p>
     <div className="mt-3 grid gap-2 sm:grid-cols-3">
      {layouts.map(item=><button type="button" key={item.id} aria-pressed={(fields.layout||"side")===item.id} onClick={()=>set("layout",item.id)}
       className={"min-w-0 rounded-xl border px-3 py-3 text-left transition-colors "+((fields.layout||"side")===item.id?"border-white/75 bg-white/10":"border-white/15 bg-[#090909] hover:border-white/40")}>
       <span className="flex items-center gap-2.5"><span className={"block h-5 w-1 rounded-full "+((fields.layout||"side")===item.id?"bg-white":"bg-white/25")}/><span className="text-sm font-medium">{en?item.en:item.pl}</span></span>
       <span className="mt-2 block pl-3.5 text-[11px] leading-5 text-white/55">{en?item.hintEN:item.hintPL}</span>
      </button>)}
     </div>
    </div>
    <div className="mt-6 grid gap-4 sm:grid-cols-2">
     <label className="flex items-center justify-between gap-3 rounded-xl border border-white/15 p-3 text-sm text-white/75">{en?"Accent colour":"Kolor akcentu"}
      <input type="color" value={fields.accent} onChange={e=>set("accent",e.target.value)} className="h-10 w-14 cursor-pointer rounded-md border border-white/20 bg-transparent"/>
     </label>
     <label className="rounded-xl border border-white/15 px-3 py-2 text-sm text-white/75">{en?"Logo size":"Wielkość logo"}: {fields.logoWidth||110} px
      <input type="range" min="60" max="180" step="5" value={fields.logoWidth||110} onChange={e=>set("logoWidth",Number(e.target.value))} className="mt-2 w-full accent-white" aria-label={en?"Logo width in pixels":"Szerokość logo w pikselach"}/>
     </label>
    </div>
   </section>
  </div>
  <section className="min-w-0 self-start rounded-2xl border border-white/20 bg-[#141414] p-5 xl:sticky xl:top-28 md:p-7">
   <p className="text-xs font-medium uppercase tracking-[.16em] text-white/50">{en?"Live preview":"Podgląd na żywo"}</p>
   <p className="mt-2 text-sm text-white/75">{en?"How the signature will look on a light email background":"Tak będzie wyglądać stopka na jasnym tle wiadomości"}</p>
   <div className="mt-5 min-w-0 overflow-x-auto rounded-xl border border-[#d8d8d8] bg-white p-5 sm:p-7">
    <div className="w-max max-w-full" aria-label={en?"Email signature preview":"Podgląd stopki e-mail"} dangerouslySetInnerHTML={{__html:html}}/>
   </div>
   <div className="mt-5 grid gap-2 sm:grid-cols-2">
    <button type="button" onClick={copyRich} className="brand-action inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-4 text-sm font-medium"><Clipboard size={17}/>{en?"Copy signature":"Kopiuj stopkę"}</button>
    <button type="button" onClick={downloadHtml} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/30 px-4 text-sm transition-colors hover:border-white/65"><Download size={17}/>{en?"Download HTML":"Pobierz HTML"}</button>
   </div>
   {message&&<p role="status" className="mt-4 flex items-start gap-2 text-xs leading-6 text-white/75"><Check size={15} className="mt-1 shrink-0"/>{message}</p>}
   <p className="mt-5 border-t border-white/10 pt-4 text-xs leading-6 text-white/55">
    {hasLocalLogo
     ?(en?"A locally uploaded image is included in the HTML, but Gmail, Outlook and other mail apps may remove embedded images when pasted. For the most reliable signature, host the logo and use its HTTPS URL.":"Wgrane logo jest osadzone w HTML, ale Gmail, Outlook i inne programy mogą usunąć taki obraz podczas wklejania. Aby logo działało niezawodnie, umieść je online i wpisz adres HTTPS.")
     :(en?"For reliable display in Gmail, Outlook and Apple Mail, use a publicly accessible HTTPS logo URL. The signature uses static, table-based HTML.":"Aby logo wyświetlało się poprawnie w Gmailu, Outlooku i Apple Mail, użyj publicznego adresu HTTPS. Stopka ma statyczny układ oparty na tabelach HTML.")}
   </p>
   <button type="button" aria-expanded={showCode} onClick={()=>setShowCode(!showCode)} className="mt-4 text-xs text-white/75 underline underline-offset-4 hover:text-white">{showCode?(en?"Hide HTML":"Ukryj kod HTML"):(en?"Show HTML code":"Pokaż kod HTML")}</button>
   {showCode&&<div className="mt-3 space-y-3">
    <textarea rows={7} readOnly className={fieldClass+" resize-y font-mono text-xs"} value={html} aria-label={en?"Signature HTML source":"Kod HTML stopki"}/>
    <button type="button" className="inline-flex items-center gap-2 text-xs text-white/80 underline underline-offset-4" onClick={async()=>{try{await navigator.clipboard.writeText(html);setMessage(en?"HTML source copied.":"Skopiowano kod HTML.");}catch{setMessage(en?"Select the HTML code manually.":"Zaznacz i skopiuj kod ręcznie.");}}}><Clipboard size={14}/>{en?"Copy HTML code":"Kopiuj kod HTML"}</button>
   </div>}
  </section>
 </div>;
}
