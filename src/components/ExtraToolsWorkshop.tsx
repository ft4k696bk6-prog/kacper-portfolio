"use client";
import {useMemo,useState} from "react";
import {ArrowRight,Calculator,Clipboard,Code2} from "lucide-react";
import {convertUnits,csvToObjects,dayDifference,marginMarkup,monthlyPayment,objectsToCsv,savingProjection,tripCost,vatBreakdown} from "@/lib/extra-calculators";
import {saveBlob} from "@/lib/browser-toolkit";

type Mode="vat"|"margin"|"loan"|"savings"|"trip"|"dates"|"units"|"discount"|"split"|"subscription"|"csvjson"|"jsoncsv"|"regex"|"gradient"|"contrast"|"favicon";
const catalog:{id:Mode;pl:string;en:string;kind:"calc"|"dev"}[]=[
{id:"vat",pl:"Kalkulator VAT",en:"VAT calculator",kind:"calc"},
{id:"margin",pl:"Marża i narzut",en:"Margin and markup",kind:"calc"},
{id:"loan",pl:"Rata kredytu",en:"Loan payment",kind:"calc"},
{id:"savings",pl:"Oszczędzanie i procent składany",en:"Compound savings",kind:"calc"},
{id:"trip",pl:"Koszt przejazdu",en:"Trip cost",kind:"calc"},
{id:"dates",pl:"Różnica dat",en:"Date difference",kind:"calc"},
{id:"units",pl:"Przelicznik jednostek",en:"Unit converter",kind:"calc"},
{id:"discount",pl:"Kalkulator rabatów",en:"Discount calculator",kind:"calc"},
{id:"split",pl:"Podział rachunku",en:"Split a bill",kind:"calc"},
{id:"subscription",pl:"Koszt subskrypcji",en:"Subscription cost",kind:"calc"},
{id:"csvjson",pl:"CSV na JSON",en:"CSV to JSON",kind:"dev"},
{id:"jsoncsv",pl:"JSON na CSV",en:"JSON to CSV",kind:"dev"},
{id:"regex",pl:"Tester regex z limitem czasu",en:"Timeout-safe regex tester",kind:"dev"},
{id:"gradient",pl:"Generator gradientów CSS",en:"CSS gradient generator",kind:"dev"},
{id:"contrast",pl:"Kontrast kolorów WCAG",en:"WCAG contrast checker",kind:"dev"},
{id:"favicon",pl:"Generator ikonki PNG",en:"PNG favicon generator",kind:"dev"}
];
const field="w-full min-w-0 rounded-lg border border-white/20 bg-[#090909] px-4 py-3 text-sm outline-none focus:border-white/60";
const button="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-white/25 px-5 py-2.5 text-sm hover:border-white/60 disabled:opacity-40";
type Entry={key:string;pl:string;en:string;default:string;type?:"date"|"select"|"textarea";options?:{value:string;label:string}[]};
const inputs:Record<Mode,Entry[]>={
 vat:[{key:"amount",pl:"Kwota",en:"Amount",default:"1000"},{key:"rate",pl:"Stawka VAT %",en:"VAT rate %",default:"23"},{key:"basis",pl:"Wprowadzasz",en:"Input type",default:"net",type:"select",options:[{value:"net",label:"Netto / Net"},{value:"gross",label:"Brutto / Gross"}]}],
 margin:[{key:"cost",pl:"Koszt",en:"Cost",default:"80"},{key:"price",pl:"Cena sprzedaży",en:"Sale price",default:"100"}],
 loan:[{key:"principal",pl:"Kwota kredytu",en:"Loan principal",default:"150000"},{key:"rate",pl:"Oprocentowanie roczne %",en:"Annual interest %",default:"7"},{key:"months",pl:"Liczba rat",en:"Installments",default:"60"}],
 savings:[{key:"principal",pl:"Kapitał początkowy",en:"Initial balance",default:"1000"},{key:"monthly",pl:"Wpłata miesięczna",en:"Monthly deposit",default:"300"},{key:"rate",pl:"Zwrot roczny %",en:"Annual return %",default:"5"},{key:"years",pl:"Lata",en:"Years",default:"10"}],
 trip:[{key:"distance",pl:"Dystans km",en:"Distance km",default:"500"},{key:"consumption",pl:"Spalanie l/100 km",en:"Consumption L/100 km",default:"8"},{key:"fuel",pl:"Cena za litr",en:"Price per liter",default:"6"},{key:"people",pl:"Liczba osób",en:"Passengers",default:"2"}],
 dates:[{key:"from",pl:"Od",en:"From",default:"2026-11-11",type:"date"},{key:"to",pl:"Do",en:"To",default:"2026-12-01",type:"date"}],
 units:[{key:"value",pl:"Wartość",en:"Value",default:"1"},{key:"from",pl:"Z jednostki",en:"From unit",default:"km",type:"select",options:["m","km","cm","mile","ft","kg","g","lb","l","ml","gal"].map(n=>({value:n,label:n}))},{key:"to",pl:"Na jednostkę",en:"To unit",default:"mile",type:"select",options:["m","km","cm","mile","ft","kg","g","lb","l","ml","gal"].map(n=>({value:n,label:n}))}],
 discount:[{key:"price",pl:"Cena wyjściowa",en:"Original price",default:"200"},{key:"rate",pl:"Rabat %",en:"Discount %",default:"15"}],
 split:[{key:"price",pl:"Rachunek",en:"Bill total",default:"245"},{key:"people",pl:"Liczba osób",en:"People",default:"4"},{key:"rate",pl:"Napiwek %",en:"Tip %",default:"10"}],
 subscription:[{key:"price",pl:"Opłata miesięczna",en:"Monthly fee",default:"99"},{key:"years",pl:"Lata",en:"Years",default:"3"},{key:"increase",pl:"Coroczna podwyżka %",en:"Yearly price increase %",default:"0"}],
 csvjson:[{key:"body",pl:"Tekst CSV",en:"CSV text",default:'name,city\nJan,Rzeszów',type:"textarea"}],
 jsoncsv:[{key:"body",pl:"Tablica obiektów JSON",en:"JSON object array",default:'[{"name":"Jan","city":"Rzeszów"}]',type:"textarea"}],
 regex:[{key:"pattern",pl:"Wzorzec regex",en:"Regex pattern",default:"[A-Z]+"},{key:"flags",pl:"Flagi",en:"Flags",default:"g"},{key:"body",pl:"Tekst",en:"Text",default:"AAA bbb CCC",type:"textarea"}],
 gradient:[{key:"a",pl:"Kolor początkowy",en:"Start color",default:"#202020"},{key:"b",pl:"Kolor końcowy",en:"End color",default:"#b7b7b7"},{key:"angle",pl:"Kąt °",en:"Angle °",default:"135"}],
 contrast:[{key:"a",pl:"Kolor tekstu HEX",en:"Text color HEX",default:"#ffffff"},{key:"b",pl:"Kolor tła HEX",en:"Background color HEX",default:"#111111"}],
 favicon:[{key:"name",pl:"Litery (max 3)",en:"Letters (max 3)",default:"KB"},{key:"a",pl:"Kolor tła HEX",en:"Background HEX",default:"#111111"},{key:"b",pl:"Kolor liter HEX",en:"Text HEX",default:"#ffffff"}]
};
const number=(x:string)=>{const n=Number(x.trim().replace(/\s/g,"").replace(",","."));if(!x.trim()||!Number.isFinite(n))throw Error("Invalid number");return n;};
const money=(n:number,lang:string)=>new Intl.NumberFormat(lang,{maximumFractionDigits:2}).format(n);
const hex=(v:string)=>/^#[\da-fA-F]{6}$/.test(v);
function luminance(v:string){const hexes=[1,3,5].map(i=>parseInt(v.slice(i,i+2),16)/255).map(x=>x<=.04045?x/12.92:Math.pow((x+.055)/1.055,2.4));return .2126*hexes[0]+.7152*hexes[1]+.0722*hexes[2];}
async function regexSafe(pattern:string,flags:string,body:string):Promise<string>{
 if(pattern.length>200||body.length>4000||!/^[gimsuyd]*$/.test(flags))throw Error("Regex pattern, text or flags too long/invalid");
 return new Promise((resolve,reject)=>{
  const src='self.onmessage=function(e){try{const r=new RegExp(e.data.p,e.data.f);const m=Array.from(e.data.s.matchAll(new RegExp(r.source,r.flags.includes("g")?r.flags:r.flags+"g"))).slice(0,80).map(x=>({match:x[0],index:x.index}));postMessage({ok:true,matches:m});}catch(e){postMessage({ok:false,error:String(e.message)})}};';
  const url=URL.createObjectURL(new Blob([src],{type:"text/javascript"}));const w=new Worker(url);
  const timer=setTimeout(()=>{w.terminate();URL.revokeObjectURL(url);reject(Error("Regex evaluation exceeded 1 second."));},1000);
  w.onmessage=e=>{clearTimeout(timer);w.terminate();URL.revokeObjectURL(url);e.data.ok?resolve(JSON.stringify(e.data.matches,null,2)):reject(Error(e.data.error));};
  w.onerror=()=>{clearTimeout(timer);w.terminate();URL.revokeObjectURL(url);reject(Error("Regex worker failed"));};
  w.postMessage({p:pattern,f:flags,s:body});
 });
}
export function ExtraToolsWorkshop({lang}:{lang:"pl"|"en"}){
 const en=lang==="en";
 const [mode,setMode]=useState<Mode>("vat");
 const [kind,setKind]=useState("all");
 const [query,setQuery]=useState("");
 const [values,setValues]=useState<Record<string,string>>({});
 const [result,setResult]=useState("");
 const [error,setError]=useState("");
 const [busy,setBusy]=useState(false);
 const [copied,setCopied]=useState(false);
 const current=useMemo(()=>catalog.find(x=>x.id===mode)!,[mode]);
 const shown=useMemo(()=>catalog.filter(x=>(kind==="all"||x.kind===kind)&&(en?x.en:x.pl).toLowerCase().includes(query.toLowerCase())),[kind,query,en]);
 const val=(key:string)=>(values[key]??inputs[mode].find(x=>x.key===key)?.default??"");
 const go=(id:Mode)=>{setMode(id);setValues({});setResult("");setError("");};
 async function calculate(){
  setBusy(true);setError("");setResult("");setCopied(false);
  try{
   const n=(key:string)=>number(val(key));let out="";
   switch(mode){
    case "vat":{const v=vatBreakdown(n("amount"),n("rate"),val("basis") as "net"|"gross");out="Net: "+money(v.net,lang)+"\nGross: "+money(v.gross,lang)+"\nVAT: "+money(v.vat,lang);break;}
    case "margin":{const v=marginMarkup(n("cost"),n("price"));out="Profit: "+money(v.profit,lang)+"\nMargin: "+v.margin+"%\nMarkup: "+(v.markup??"N/A")+"%";break;}
    case "loan":{const monthly=monthlyPayment(n("principal"),n("rate"),n("months"));out=(en?"Payment: ":"Rata: ")+money(monthly,lang)+"\nTotal: "+money(monthly*n("months"),lang)+"\nInterest (estimate): "+money(monthly*n("months")-n("principal"),lang);break;}
    case "savings":{const v=savingProjection(n("principal"),n("monthly"),n("rate"),n("years"));out="Balance: "+money(v.total,lang)+"\nDeposits: "+money(v.deposits,lang)+"\nInterest (hypothetical): "+money(v.interest,lang);break;}
    case "trip":{const v=tripCost(n("distance"),n("consumption"),n("fuel"),n("people"));out="Fuel: "+v.litres+" L\nTotal: "+money(v.total,lang)+"\nPer person: "+money(v.perPerson,lang);break;}
    case "dates":out=(en?"Days: ":"Dni: ")+dayDifference(val("from"),val("to"));break;
    case "units":out=String(convertUnits(n("value"),val("from"),val("to")));break;
    case "discount":out=(en?"After discount: ":"Po rabacie: ")+money(n("price")*(1-n("rate")/100),lang);break;
    case "split":out=(en?"Per person: ":"Na osobę: ")+money(n("price")*(1+n("rate")/100)/n("people"),lang);break;
    case "subscription":{const years=n("years");if(years<0||years>50||!Number.isInteger(years))throw Error("Years must be 0-50");let sum=0;for(let y=0;y<years;y++)sum+=n("price")*12*Math.pow(1+n("increase")/100,y);out=(en?"Total nominal cost: ":"Suma nominalna: ")+money(sum,lang);break;}
    case "csvjson":out=JSON.stringify(csvToObjects(val("body")),null,2);break;
    case "jsoncsv":{const j=JSON.parse(val("body"));if(!Array.isArray(j)||j.some(x=>!x||typeof x!=="object"||Array.isArray(x)))throw Error("Expected an array of JSON objects");out=objectsToCsv(j);break;}
    case "regex":out=await regexSafe(val("pattern"),val("flags"),val("body"));break;
    case "gradient":{if(!hex(val("a"))||!hex(val("b"))||n("angle")<0||n("angle")>360)throw Error("Invalid gradient settings");out="background: linear-gradient("+n("angle")+"deg, "+val("a")+", "+val("b")+");";break;}
    case "contrast":{if(!hex(val("a"))||!hex(val("b")))throw Error("Invalid HEX");const a=luminance(val("a")),b=luminance(val("b"));const ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);out="Contrast: "+ratio.toFixed(2)+":1\nWCAG AA normal text: "+(ratio>=4.5?"PASS":"FAIL")+"\nWCAG AAA normal text: "+(ratio>=7?"PASS":"FAIL");break;}
    case "favicon":{if(!hex(val("a"))||!hex(val("b")))throw Error("Invalid HEX");const canvas=document.createElement("canvas");canvas.width=256;canvas.height=256;const ctx=canvas.getContext("2d");if(!ctx)throw Error("Canvas unsupported");ctx.fillStyle=val("a");ctx.fillRect(0,0,256,256);ctx.font="bold 110px Arial";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillStyle=val("b");ctx.fillText(val("name").slice(0,3),128,132,225);const blob=await new Promise<Blob|null>(resolve=>canvas.toBlob(resolve,"image/png"));if(blob)saveBlob(blob,"bernecki-favicon.png");out=en?"PNG icon saved (256 × 256).":"Zapisano ikonkę PNG (256 × 256).";break;}
   }
   setResult(out);
  }catch(e){setError(e instanceof Error?e.message:(en?"Calculation failed.":"Błąd obliczeń."));}
  finally{setBusy(false);}
 }
 return <section className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
  <div>
   <input type="search" className={field} value={query} onChange={e=>setQuery(e.target.value)} placeholder={en?"Search tools…":"Szukaj narzędzi…"}/>
   <div className="mt-3 flex flex-wrap gap-2">{[["all",en?"All":"Wszystko"],["calc",en?"Calculators":"Kalkulatory"],["dev",en?"Developer":"Techniczne"]].map(([id,label])=><button key={id} type="button" onClick={()=>setKind(id)} aria-pressed={kind===id} className={"rounded-full border px-3 py-2 text-xs "+(kind===id?"border-white bg-white/15":"border-white/20")}>{label}</button>)}</div>
   <nav className="mt-4 flex gap-2 overflow-x-auto pb-3 lg:flex-col" aria-label={en?"Additional tools":"Dodatkowe narzędzia"}>{shown.map(item=><button key={item.id} type="button" onClick={()=>go(item.id)} className={"min-w-44 rounded-xl border px-4 py-3 text-left text-sm lg:min-w-0 "+(mode===item.id?"border-white/70 bg-white/15":"border-white/15 bg-[#111111] hover:border-white/40")}>{en?item.en:item.pl}</button>)}</nav>
  </div>
  <div className="min-w-0 space-y-5">
   <div className="rounded-2xl border border-white/15 bg-[#111111] p-5 md:p-7">
    <h2 className="flex items-center gap-3 text-2xl font-medium">{current.kind==="calc"?<Calculator size={23}/>:<Code2 size={23}/>} {en?current.en:current.pl}</h2>
    <div className="mt-6 grid gap-4 sm:grid-cols-2">{inputs[mode].map(item=><label key={item.key} className={"block text-sm text-white/80 "+(item.type==="textarea"?"sm:col-span-2":"")}>{en?item.en:item.pl}
     {item.type==="textarea"?<textarea rows={8} className={field+" mt-2 font-mono"} value={val(item.key)} onChange={e=>setValues(s=>({...s,[item.key]:e.target.value}))}/>:
      item.type==="select"?<select className={field+" mt-2"} value={val(item.key)} onChange={e=>setValues(s=>({...s,[item.key]:e.target.value}))}>{item.options?.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}</select>:
      <input type={item.type==="date"?"date":"text"} inputMode={item.type==="date"?undefined:"decimal"} className={field+" mt-2"} value={val(item.key)} onChange={e=>setValues(s=>({...s,[item.key]:e.target.value}))}/>}
    </label>)}</div>
    {mode==="gradient"&&hex(val("a"))&&hex(val("b"))&&<div className="mt-4 h-24 rounded-xl border border-white/20" style={{background:"linear-gradient("+val("angle")+"deg,"+val("a")+","+val("b")+")"}}/>}
    <button type="button" onClick={calculate} disabled={busy} className={button+" mt-6 w-full bg-white text-black hover:bg-neutral-100"}><ArrowRight size={17}/>{busy?(en?"Working…":"Przetwarzanie…"):en?"Calculate / generate":"Oblicz / wygeneruj"}</button>
    {error&&<p role="alert" className="mt-4 rounded-xl border border-red-500/30 p-4 text-sm text-red-200">{error}</p>}
   </div>
   <div className="rounded-2xl border border-white/15 bg-[#111111] p-5 md:p-7">
    <div className="flex items-center justify-between"><h3 className="text-xl font-medium">{en?"Result":"Wynik"}</h3><button type="button" className={button+" disabled:opacity-40"} disabled={!result} onClick={async()=>{try{await navigator.clipboard.writeText(result);setCopied(true);}catch{setCopied(false);}}}><Clipboard size={15}/>{copied?(en?"Copied":"Skopiowano"):(en?"Copy":"Kopiuj")}</button></div>
    <pre className="mt-5 min-h-28 overflow-auto whitespace-pre-wrap break-words rounded-xl border border-white/10 bg-[#080808] p-4 font-mono text-sm leading-7 text-white/75" aria-live="polite">{result|| (en?"Fill in the fields and run the calculation.":"Wypełnij pola i uruchom obliczenie.")}</pre>
    <p className="mt-4 text-xs leading-6 text-white/50">{en?"Calculators are mathematical estimates, not financial, tax or legal advice. No input is sent to the server.":"Kalkulatory pokazują matematyczne szacunki, nie porady finansowe, podatkowe ani prawne. Dane nie są wysyłane na serwer."}</p>
   </div>
  </div>
 </section>;
}
