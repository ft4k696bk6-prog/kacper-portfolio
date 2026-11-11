"use client";
/* eslint-disable @typescript-eslint/no-explicit-any -- pinned external Transformers.js runtime */
import {useEffect,useRef,useState} from "react";
import {Camera,FileText,Lock,ScanSearch,ShieldCheck} from "lucide-react";
import {aiScore,imageFileAllowed,inspectGeneratorMarkers} from "@/lib/ai-origin";

const moduleUrl="https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.3.2/dist/transformers.min.js";
type DetectorMode="image"|"text";
type Output={score:number|null;rows:{label:string;score:number}[]};
let runtimePromise:Promise<any>|null=null;
let imagePipeline:Promise<any>|null=null;
let textPipeline:Promise<any>|null=null;
async function runtime(){
 if(!runtimePromise)runtimePromise=import(/* webpackIgnore: true */ moduleUrl).catch(e=>{runtimePromise=null;throw e;});
 return runtimePromise;
}
async function detector(kind:DetectorMode){
 const mod=await runtime();
 if(mod.env){mod.env.allowLocalModels=false;mod.env.allowRemoteModels=true;}
 if(kind==="image"){
  if(!imagePipeline)imagePipeline=mod.pipeline("image-classification","onnx-community/ai-image-detection-ONNX",{device:"wasm",dtype:"q8"}).catch((e:unknown)=>{imagePipeline=null;throw e;});
  return {mod,pipe:await imagePipeline};
 }
 if(!textPipeline)textPipeline=mod.pipeline("text-classification","onnx-community/roberta-base-openai-detector-ONNX",{device:"wasm",dtype:"q8"}).catch((e:unknown)=>{textPipeline=null;throw e;});
 return {mod,pipe:await textPipeline};
}
const button="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/30 px-4 py-2.5 text-sm font-medium transition hover:bg-white/10 disabled:opacity-40";
export function AIOriginWorkshop({lang}:{lang:"pl"|"en"}){
 const en=lang==="en";
 const [mode,setMode]=useState<DetectorMode>("image");
 const [file,setFile]=useState<File|null>(null);
 const [text,setText]=useState("");
 const [markers,setMarkers]=useState<string[]>([]);
 const [imageDetails,setImageDetails]=useState("");
 const [result,setResult]=useState<Output|null>(null);
 const [error,setError]=useState("");
 const [loading,setLoading]=useState(false);const [phase,setPhase]=useState("");
 const [accepted,setAccepted]=useState(false);
 const [imageUrl,setImageUrl]=useState("");
 const abort=useRef(false);
 useEffect(()=>{return()=>{abort.current=true;};},[]);
 useEffect(()=>{if(!file){setImageUrl("");return;}const url=URL.createObjectURL(file);setImageUrl(url);return()=>URL.revokeObjectURL(url);},[file]);
 const choose=async(next:File|null)=>{
  setFile(next);setMarkers([]);setImageDetails("");setResult(null);setError("");setAccepted(false);
  if(!next)return;
  if(!imageFileAllowed(next)){setError(en?"Choose PNG, JPG or WebP up to 12 MB.":"Wybierz PNG, JPG lub WebP do 12 MB.");return;}
  try{
   const buf=await next.arrayBuffer();
   setMarkers(inspectGeneratorMarkers(buf));
   const img=await createImageBitmap(next);
   setImageDetails(img.width+" × "+img.height+" px · "+(next.size/1024/1024).toFixed(2)+" MB");
   img.close();
  }catch{setError(en?"The image could not be read.":"Nie udało się odczytać obrazu.");}
 };
 const scan=async()=>{
  setResult(null);setError("");setLoading(true);setPhase(en?"Downloading the open-source model. This can take time and use significant memory.":"Pobieranie otwartego modelu. To może potrwać i zużyć dużo pamięci.");
  try{
   if(!accepted)throw Error(en?"Please confirm the model download.":"Potwierdź pobranie modelu.");
   if(mode==="image"&&(!file||!imageFileAllowed(file)))throw Error(en?"Choose a compatible image first.":"Najpierw wybierz odpowiedni obraz.");
   if(mode==="text"&&text.trim().length<400)throw Error(en?"Enter at least 400 characters in English.":"Wklej co najmniej 400 znaków po angielsku.");
   if(mode==="text"&&/[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/.test(text))throw Error(en?"This text classifier is trained for English, not Polish.":"Ten klasyfikator tekstu jest trenowany do języka angielskiego, nie polskiego.");
   const {mod,pipe}=await detector(mode);
   setPhase(en?"Running the classifier locally…":"Klasyfikator analizuje plik lokalnie…");
   let raw:any;
   if(mode==="image"){const img=await mod.RawImage.fromBlob(file!);raw=await pipe(img,{topk:null});}
   else raw=await pipe(text.slice(0,3500),{topk:null});
   const entries=Array.isArray(raw)?raw:[raw];
   const rows=entries.map((r:{label?:string;score?:number})=>({label:String(r.label||""),score:Number(r.score)}));
   if(!abort.current)setResult({score:aiScore(rows),rows});
  }catch(e){setError((en?"Model unavailable or failed: ":"Model niedostępny lub błąd: ")+(e instanceof Error?e.message:String(e)));}
  finally{setLoading(false);setPhase("");}
 };
 const selectMode=(v:DetectorMode)=>{setMode(v);setError("");setResult(null);setAccepted(false);};
 return <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,.85fr)]">
  <div className="rounded-2xl border border-white/15 bg-[#111111] p-5 md:p-7">
   <div className="grid grid-cols-2 gap-3" role="group" aria-label={en?"Media type":"Rodzaj materiału"}>
    <button type="button" className={button+" "+(mode==="image"?"border-white bg-white/15":"")} aria-pressed={mode==="image"} onClick={()=>selectMode("image")}><Camera size={17}/>{en?"Photo":"Zdjęcie"}</button>
    <button type="button" className={button+" "+(mode==="text"?"border-white bg-white/15":"")} aria-pressed={mode==="text"} onClick={()=>selectMode("text")}><FileText size={17}/>{en?"Text":"Tekst"}</button>
   </div>
   {mode==="image"?<div className="mt-6 space-y-4">
    <label className="block text-sm text-white/75">{en?"Select JPG, PNG or WebP":"Wybierz JPG, PNG lub WebP"}
     <input type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>choose(e.target.files?.[0]||null)} className="mt-2 block w-full rounded-xl border border-white/25 bg-[#080808] p-3 text-sm"/>
    </label>
    {imageUrl&&imageFileAllowed(file!)&&<img src={imageUrl} alt={en?"Image selected for testing":"Zdjęcie wybrane do analizy"} className="max-h-72 w-full rounded-xl bg-[#080808] object-contain"/>}
    {imageDetails&&<p className="text-xs text-white/60">{imageDetails}</p>}
    {file&&<div className="rounded-xl border border-white/15 bg-[#080808] p-4"><h3 className="text-sm font-medium">{en?"Metadata indicators":"Ślady w metadanych"}</h3>
     <p className="mt-2 text-xs leading-6 text-white/65">{markers.length?markers.join(" · "):(en?"No selected generator markers found. This does not prove authenticity.":"Nie znaleziono wybranych znaczników generatorów. To nie dowodzi autentyczności.")}</p>
     {markers.includes("C2PA")&&<p className="mt-3 text-xs text-amber-200">{en?"C2PA marker found, but the cryptographic signature is not verified here.":"Znaleziono znacznik C2PA, ale jego podpis kryptograficzny nie został tutaj zweryfikowany."}</p>}
    </div>}
   </div>:<div className="mt-6">
    <label className="block text-sm text-white/75">{en?"Paste English text (minimum 400 characters)":"Wklej tekst angielski (minimum 400 znaków)"}
     <textarea rows={10} className="mt-2 w-full rounded-xl border border-white/25 bg-[#090909] p-4 text-sm leading-7 outline-none focus:border-white/60" placeholder={en?"Paste a longer English text.":"Wklej dłuższy tekst w języku angielskim."} value={text} onChange={e=>{setText(e.target.value);setResult(null);}}/>
    </label><p className="mt-2 text-xs text-white/50">{text.length} {en?"characters":"znaków"}</p>
    <p className="mt-3 text-xs leading-6 text-amber-200">{en?"This older RoBERTa model was trained mainly for GPT-2-era English text. It is not suitable for determining authorship of modern Polish or heavily edited text.":"Starszy model RoBERTa trenowano głównie na angielskich tekstach z epoki GPT-2. Nie nadaje się do rozstrzygania autorstwa nowoczesnych tekstów polskich ani mocno redagowanych."}</p>
   </div>}
   <label className="mt-6 flex items-start gap-3 rounded-xl border border-white/25 bg-white/[.04] p-4 text-sm leading-6">
    <input type="checkbox" checked={accepted} onChange={e=>setAccepted(e.target.checked)} className="mt-1 size-4 shrink-0 accent-white"/>
    <span>{en?"I agree to download a large third-party open-source AI model to this device. Models and runtime are fetched from Hugging Face and jsDelivr; submitted content is processed locally. Model score is not a calibrated probability.":"Zgadzam się na pobranie dużego otwartego modelu AI na to urządzenie. Model i biblioteki pochodzą z Hugging Face oraz jsDelivr, a materiał jest analizowany lokalnie. Wynik nie jest skalibrowanym prawdopodobieństwem."}</span>
   </label>
   <button type="button" onClick={scan} disabled={loading||!accepted||(mode==="image"?!file||!imageFileAllowed(file):text.length<400)}
    className={button+" mt-5 w-full bg-white text-black hover:bg-neutral-200"}><ScanSearch size={17}/>{loading?(en?"Analyzing…":"Analiza…"):(en?"Run actual neural model":"Uruchom prawdziwy model neuronowy")}</button>
   {phase&&<p role="status" className="mt-4 text-sm text-white/60">{phase}</p>}
   {error&&<p role="alert" className="mt-4 rounded-xl border border-red-500/35 bg-red-500/10 p-3 text-sm leading-6 text-red-200">{error}</p>}
  </div>
  <div className="min-w-0 space-y-5">
   <section className="rounded-2xl border border-white/15 bg-[#111111] p-5 md:p-7">
    <h2 className="text-xl font-medium">{en?"Model result":"Wynik modelu"}</h2>
    {!result?<p className="mt-5 text-sm leading-7 text-white/50">{en?"No result yet. A value is displayed only after the actual classifier runs successfully.":"Brak wyniku. Liczba zostanie pokazana wyłącznie po poprawnym uruchomieniu rzeczywistego klasyfikatora."}</p>:
     <div role="status" className="mt-5">
      {result.score===null?<p className="text-sm text-amber-200">{en?"Unrecognized model labels; no percentage will be shown.":"Nie rozpoznano etykiet modelu; nie wyświetlam procentu."}</p>:<><p className="text-xs uppercase tracking-widest text-white/55">{en?"AI-class score — not proof":"Wynik klasyfikatora AI — nie dowód"}</p>
       <p className="mt-3 text-5xl font-semibold tabular-nums">{result.score.toFixed(1)}%</p>
       <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full bg-white" style={{width:Math.min(100,result.score)+"%"}}/></div></>}
      <div className="mt-4 space-y-1 text-xs text-white/55">{result.rows.map((r,i)=><p key={i}>{r.label}: {(r.score*100).toFixed(1)}%</p>)}</div>
      <p className="mt-5 text-xs leading-7 text-amber-200">{en?"Not a probability that the author used AI. The model can fail on new generators, edited images, compression, multilingual texts, and unfamiliar domains. Never use this result as the sole basis for accusing anyone.":"To nie jest prawdopodobieństwo, że autor użył AI. Model może się mylić przy nowych generatorach, edycjach, kompresji, językach i nieznanych materiałach. Nie używaj tego wyniku jako jedynej podstawy oskarżeń."}</p>
     </div>}
   </section>
   <section className="rounded-2xl border border-white/15 bg-[#111111] p-5 md:p-7">
    <h3 className="flex items-center gap-2 text-sm font-medium"><ShieldCheck size={17}/>{en?"Verify signed provenance separately":"Osobno zweryfikuj podpisane pochodzenie"}</h3>
    <p className="mt-3 text-xs leading-7 text-white/60">{en?"C2PA Content Credentials can include cryptographic signatures. Metadata markers shown above are not cryptographic verification. For signed verification use the official external tool and upload your file there only if you want to.":"C2PA Content Credentials mogą zawierać podpisy kryptograficzne. Pokazane znaczniki metadanych nie są ich weryfikacją. Do sprawdzenia podpisu użyj oficjalnego narzędzia zewnętrznego i prześlij tam plik tylko świadomie."}</p>
    <a href="https://contentcredentials.org/verify" target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm underline underline-offset-4">{en?"Open Content Credentials Verify":"Otwórz Content Credentials Verify"}</a>
   </section>
   <p className="flex items-start gap-2 text-xs leading-6 text-white/50"><Lock size={16} className="mt-1 shrink-0"/>{en?"Local inference is optional. No AI percentage is fabricated when a model is unavailable.":"Lokalna analiza jest opcjonalna. Gdy model jest niedostępny, nie generujemy fikcyjnego procentu AI."}</p>
  </div>
 </section>;
}
