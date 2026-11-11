"use client";
import {useMemo,useState} from "react";
import {Check,Clipboard,Download,ShieldCheck} from "lucide-react";
import {advancedSignatureHtml,signatureDefaults} from "@/lib/signature-pro";
import type {ProSignature,SignatureTheme} from "@/lib/signature-pro";
import {saveBlob} from "@/lib/browser-toolkit";

const themes:{id:SignatureTheme;pl:string;en:string}[]=[
{id:"minimal",pl:"Minimalistyczny",en:"Minimal"},
{id:"executive",pl:"Biznesowy",en:"Executive"},
{id:"silver",pl:"Srebrny",en:"Silver"},
{id:"card",pl:"Karta",en:"Card"},
{id:"border",pl:"Akcent",en:"Accent"},
{id:"dark",pl:"Ciemny",en:"Dark"}
];
const fields:{key:keyof ProSignature;pl:string;en:string;placeholder?:string}[]=[
 {key:"name",pl:"Imię i nazwisko",en:"Full name"},
 {key:"job",pl:"Stanowisko",en:"Job title"},
 {key:"company",pl:"Firma",en:"Company"},
 {key:"email",pl:"E-mail",en:"Email",placeholder:"you@example.com"},
 {key:"phone",pl:"Telefon",en:"Phone",placeholder:"+48 123 456 789"},
 {key:"web",pl:"WWW",en:"Website",placeholder:"example.com"},
 {key:"address",pl:"Adres / lokalizacja",en:"Address / location"},
 {key:"linkedin",pl:"LinkedIn",en:"LinkedIn",placeholder:"https://linkedin.com/in/..."},
 {key:"logoUrl",pl:"Publiczny URL logo (HTTPS)",en:"Public logo URL (HTTPS)",placeholder:"https://example.com/logo.png"}
];
const field="w-full min-w-0 rounded-lg border border-white/20 bg-[#0b0b0b] px-4 py-3 text-sm outline-none focus:border-white/60";
const action="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/30 px-4 py-2.5 text-sm transition hover:bg-white/10";
export function SignatureWorkshop({lang}:{lang:"pl"|"en"}){
 const en=lang==="en";
 const [data,setData]=useState<ProSignature>({...signatureDefaults,name:en?"Alex Smith":"Jan Kowalski",job:en?"Sales Director":"Dyrektor sprzedaży",company:"Berni",email:"",web:"bernecki.dev"});
 const [status,setStatus]=useState("");
 const [showCode,setShowCode]=useState(false);
 const html=useMemo(()=>advancedSignatureHtml(data),[data]);
 const set=(key:keyof ProSignature,value:string|boolean)=>setData(old=>({...old,[key]:value}));
 const copy=async()=>{
  try{
   if(typeof ClipboardItem!=="undefined"&&navigator.clipboard.write){
    await navigator.clipboard.write([new ClipboardItem({"text/html":new Blob([html],{type:"text/html"}),"text/plain":new Blob([[data.name,data.job,data.company,data.email,data.phone,data.web].filter(Boolean).join("\n")],{type:"text/plain"})})]);
    setStatus(en?"Formatted signature copied. Paste it into your email client settings.":"Skopiowano sformatowaną stopkę. Wklej do ustawień programu pocztowego.");
   }else{await navigator.clipboard.writeText(html);setShowCode(true);setStatus(en?"Copied HTML source. Use the code editor in your email settings.":"Skopiowano kod HTML. Użyj edytora kodu w ustawieniach poczty.");}
  }catch{setShowCode(true);setStatus(en?"Automatic copy failed; select the source below.":"Automatyczne kopiowanie nie działa; skopiuj kod poniżej.");}
 };
 const download=()=>{
  const doc='<!doctype html><html lang="'+(en?"en":"pl")+'"><meta charset="utf-8"><title>Email signature</title><body>'+html+'</body></html>';
  saveBlob(new Blob([doc],{type:"text/html;charset=utf-8"}),"bernecki-stopka.html");
  setStatus(en?"HTML file downloaded.":"Pobrano plik HTML.");
 };
 return <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,.88fr)]">
  <div className="space-y-5">
   <section className="rounded-2xl border border-white/15 bg-[#111111] p-5 md:p-7">
    <h2 className="text-xl font-medium">{en?"Choose a layout":"Wybierz szablon"}</h2>
    <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">{themes.map(t=><button type="button" key={t.id} aria-pressed={data.theme===t.id} onClick={()=>set("theme",t.id)}
      className={"min-h-16 rounded-xl border p-3 text-sm "+(data.theme===t.id?"border-white bg-white/15":"border-white/20 hover:border-white/50")}>{en?t.en:t.pl}</button>)}</div>
   </section>
   <section className="rounded-2xl border border-white/15 bg-[#111111] p-5 md:p-7">
    <h2 className="text-xl font-medium">{en?"Your details":"Dane do stopki"}</h2>
    <div className="mt-5 grid gap-4 sm:grid-cols-2">
     {fields.map(item=><label key={item.key} className="block text-sm text-white/75">{en?item.en:item.pl}
      <input className={field+" mt-2"} value={String(data[item.key])} placeholder={item.placeholder} onChange={e=>set(item.key,e.target.value)} maxLength={item.key==="logoUrl"?250:160}/></label>)}
     <label className="flex items-center gap-3 text-sm text-white/80">{en?"Accent color":"Kolor akcentu"}
      <input type="color" className="h-12 w-20 cursor-pointer rounded-lg border border-white/20 bg-transparent" value={data.color} onChange={e=>set("color",e.target.value)}/></label>
    </div>
    <label className="mt-5 block text-sm text-white/75">{en?"Optional legal notice":"Opcjonalna klauzula informacyjna"}
     <textarea rows={3} className={field+" mt-2"} value={data.disclaimer} onChange={e=>set("disclaimer",e.target.value)} maxLength={350}/></label>
    <label className="mt-6 flex items-start gap-3 rounded-xl border border-white/25 bg-[#171717] p-4 text-sm">
     <input type="checkbox" className="mt-1 size-4 accent-white" checked={data.bolt} onChange={e=>set("bolt",e.target.checked)}/>
     <span><strong>{en?"Animated lightning GIF":"Animowany piorun GIF"}</strong>
      <span className="mt-1 block text-xs leading-6 text-white/55">{en?"Original small GIF hosted on bernecki.dev. Used if no company logo is supplied. Email clients may show only the first frame or block images.":"Własny, lekki GIF hostowany na bernecki.dev. Używany, gdy nie ma firmowego logo. Poczta może pokazać jedynie pierwszą klatkę albo zablokować obraz."}</span></span>
    </label>
   </section>
  </div>
  <div className="min-w-0 space-y-5 lg:sticky lg:top-24 lg:self-start">
   <section className="rounded-2xl border border-white/15 bg-[#111111] p-5 md:p-7">
    <h2 className="text-xl font-medium">{en?"Live preview":"Podgląd na żywo"}</h2>
    <div className="mt-5 overflow-auto rounded-xl border border-white/15 bg-white p-5 text-black" dangerouslySetInnerHTML={{__html:html}}/>
    <div className="mt-5 grid gap-2 sm:grid-cols-2">
     <button type="button" className={action+" bg-white text-black hover:bg-neutral-200"} onClick={copy}><Clipboard size={16}/>{en?"Copy signature":"Kopiuj stopkę"}</button>
     <button type="button" className={action} onClick={download}><Download size={16}/>{en?"Download HTML":"Pobierz HTML"}</button>
    </div>
    {status&&<p role="status" className="mt-4 flex items-start gap-2 text-sm text-white/75"><Check size={16}/>{status}</p>}
    <button type="button" className="mt-5 text-xs text-white/65 underline underline-offset-4" onClick={()=>setShowCode(!showCode)}>{showCode?(en?"Hide HTML code":"Ukryj kod HTML"):(en?"Show HTML code":"Pokaż kod HTML")}</button>
    {showCode&&<textarea readOnly rows={9} className={field+" mt-3 font-mono text-xs"} value={html} aria-label="HTML"/>}
   </section>
   <section className="rounded-2xl border border-white/15 bg-[#111111] p-5 text-xs leading-7 text-white/65">
    <h3 className="flex items-center gap-2 text-sm font-medium text-white"><ShieldCheck size={17}/>{en?"Email compatibility":"Kompatybilność poczty"}</h3>
    <p className="mt-3">{en?"Uses table layout and inline styles. The GIF plays only when remote images and animation are supported. It is not an SVG/CSS animation embedded in email. Verify in your own Gmail, Outlook and Apple Mail setup.":"Używam układu tabelowego i stylów inline. GIF działa tylko wtedy, gdy program pocztowy obsługuje zdalne obrazy i animacje. To nie jest animacja CSS/SVG osadzona w e-mailu. Sprawdź efekt w używanej wersji Gmaila, Outlooka lub Apple Mail."}</p>
    <p className="mt-2">{en?"Logo links must use public HTTPS. External image requests can disclose recipient IP to the host; for privacy consider a static logo.":"Logo musi mieć publiczny URL HTTPS. Zewnętrzny obraz w wiadomości może ujawnić adres IP odbiorcy serwerowi grafiki; dla prywatności rozważ statyczne logo."}</p>
   </section>
  </div>
 </section>;
}
