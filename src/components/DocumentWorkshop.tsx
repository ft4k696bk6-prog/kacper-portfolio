"use client";
/* eslint-disable @typescript-eslint/no-explicit-any -- pdf-lib, PDF.js, QR and OCR browser APIs are loaded as pinned third-party UMD modules */
import {useMemo,useRef,useState} from "react";
import {ArrowDownToLine,Files,RotateCw} from "lucide-react";
import {browserLibrary,makeWifiQrPayload,parsePageSelection,saveBlob} from "@/lib/browser-toolkit";

type Mode="merge"|"extract"|"rotate"|"watermark"|"images"|"render"|"inspect"|"qr"|"ocr"|"picture";
const modes:{id:Mode;pl:string;en:string;group:string}[]=[
{id:"merge",pl:"Łączenie PDF",en:"Merge PDFs",group:"PDF"},{id:"extract",pl:"Wyciąganie i kolejność stron",en:"Extract / reorder pages",group:"PDF"},
{id:"rotate",pl:"Obracanie stron PDF",en:"Rotate PDF pages",group:"PDF"},{id:"watermark",pl:"Znak wodny PDF",en:"PDF watermark",group:"PDF"},
{id:"images",pl:"Zdjęcia do PDF",en:"Images to PDF",group:"PDF"},{id:"render",pl:"Strona PDF do PNG",en:"PDF page to PNG",group:"PDF"},
{id:"inspect",pl:"Metadane plików",en:"File metadata",group:"Privacy"},{id:"qr",pl:"Kody QR",en:"QR codes",group:"Utilities"},
{id:"ocr",pl:"OCR — tekst ze zdjęcia",en:"OCR image to text",group:"Utilities"},{id:"picture",pl:"Studio zdjęć",en:"Image studio",group:"Images"}
];
const field="w-full min-w-0 rounded-xl border border-white/20 bg-[#090909] px-4 py-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-white/70";
const btn="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/35 px-5 py-2.5 text-sm font-medium transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40";
const bytes=(number:number)=>(number/1024/1024).toLocaleString("pl-PL",{maximumFractionDigits:2})+" MB";
function canvasToBlob(canvas:HTMLCanvasElement,type="image/png",quality=0.9):Promise<Blob>{
 return new Promise((res,rej)=>canvas.toBlob(b=>b?res(b):rej(Error("Canvas export failed")),type,quality));
}
export function DocumentWorkshop({lang}:{lang:"pl"|"en"}){
 const en=lang==="en";
 const [mode,setMode]=useState<Mode>("merge");
 const [files,setFiles]=useState<File[]>([]);
 const [pages,setPages]=useState("");
 const [angle,setAngle]=useState("90");
 const [stamp,setStamp]=useState(en?"CONFIDENTIAL":"POUFNE");
 const [title,setTitle]=useState("");
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState("");
 const [report,setReport]=useState("");
 const [qrText,setQrText]=useState("https://bernecki.dev");
 const [qrType,setQrType]=useState("link");
 const [ssid,setSsid]=useState("");const [wifiPassword,setWifiPassword]=useState("");
 const [qrData,setQrData]=useState("");
 const qrRef=useRef<HTMLCanvasElement>(null);
 const [ocrOutput,setOcrOutput]=useState("");
 const [ocrProgress,setOcrProgress]=useState("");
 const [format,setFormat]=useState("image/webp");const [maxWidth,setMaxWidth]=useState("1600");
 const [quality,setQuality]=useState("82");
 const [imageEffect,setImageEffect]=useState("none");
 const [metadata,setMetadata]=useState<string[]>([]);
 const chosen=useMemo(()=>modes.find(x=>x.id===mode)!,[mode]);
 const filesValid=files.length>0;
 const accept=(m:Mode)=>m==="images"||m==="picture"||m==="ocr"?"image/*,.heic,.heif":m==="inspect"?"image/*,.pdf":"application/pdf,.pdf";
 const multi=(m:Mode)=>m==="merge"||m==="images";
 const chooseMode=(next:Mode)=>{setMode(next);setFiles([]);setPages("");setError("");setReport("");setQrData("");setOcrOutput("");setMetadata([]);};
 const upload=(list:FileList|null)=>{
  const next=Array.from(list||[]).slice(0,12);
  const tooLarge=next.some(f=>f.size>20_000_000);
  setFiles(tooLarge?[]:next);setError(tooLarge?(en?"Maximum 20 MB per file.":"Maksymalnie 20 MB na plik."):"");setReport("");setMetadata([]);
 };
 async function runPdf(){
  if(!filesValid)throw Error(en?"Select a file first.":"Najpierw wybierz plik.");
  const lib=await browserLibrary("pdf");
  const PDFDocument=lib.PDFDocument;
  if(mode==="images"){
   const doc=await PDFDocument.create();
   for(const file of files){
    const bitmap=await createImageBitmap(file);
    try{
     const canvas=document.createElement("canvas");const scale=Math.min(1,2100/Math.max(bitmap.width,bitmap.height));
     canvas.width=Math.round(bitmap.width*scale);canvas.height=Math.round(bitmap.height*scale);
     canvas.getContext("2d")?.drawImage(bitmap,0,0,canvas.width,canvas.height);
     const blob=await canvasToBlob(canvas,"image/jpeg",.87);
     const image=await doc.embedJpg(await blob.arrayBuffer());
     const page=doc.addPage([595.28,841.89]);
     const fit=Math.min(550/image.width,795/image.height);
     const w=image.width*fit,h=image.height*fit;
     page.drawImage(image,{x:(595.28-w)/2,y:(841.89-h)/2,width:w,height:h});
    }finally{bitmap.close();}
   }
   saveBlob(new Blob([await doc.save()],{type:"application/pdf"}),"bernecki-zdjecia.pdf");
   setReport(en?"PDF created on your device.":"Utworzono PDF na urządzeniu.");return;
  }
  const source=await PDFDocument.load(await files[0].arrayBuffer());
  if(mode==="merge"){
   if(files.length<2)throw Error(en?"Choose two or more PDF files.":"Wybierz przynajmniej dwa pliki PDF.");
   const merged=await PDFDocument.create();
   for(const file of files){const pdf=await PDFDocument.load(await file.arrayBuffer());const copied=await merged.copyPages(pdf,pdf.getPageIndices());copied.forEach((page:any)=>merged.addPage(page));}
   saveBlob(new Blob([await merged.save()],{type:"application/pdf"}),"bernecki-polaczone.pdf");
   setReport((en?"Merged ":"Połączono ")+files.length+(en?" PDFs.":" plików PDF."));return;
  }
  const count=source.getPageCount();
  const picked=parsePageSelection(pages,count);
  if(mode==="extract"){
   const output=await PDFDocument.create();const copies=await output.copyPages(source,picked);
   copies.forEach((p:any)=>output.addPage(p));
   saveBlob(new Blob([await output.save()],{type:"application/pdf"}),"bernecki-strony.pdf");
   setReport((en?"Exported pages: ":"Wyeksportowane strony: ")+picked.map(i=>i+1).join(", "));return;
  }
  if(mode==="rotate"){
   const deg=Number(angle);
   if(![90,180,270].includes(deg))throw Error(en?"Invalid angle.":"Nieprawidłowy kąt.");
   for(const index of picked){const page=source.getPage(index);page.setRotation(lib.degrees((page.getRotation().angle+deg)%360));}
   saveBlob(new Blob([await source.save()],{type:"application/pdf"}),"bernecki-obrocone.pdf");
   setReport(en?"Pages rotated successfully.":"Strony obrócone poprawnie.");return;
  }
  if(mode==="watermark"){
   if(!stamp.trim())throw Error(en?"Enter watermark text.":"Wpisz tekst znaku wodnego.");
   const canvas=document.createElement("canvas");canvas.width=1000;canvas.height=250;
   const ctx=canvas.getContext("2d");if(!ctx)throw Error("Canvas unavailable");
   ctx.fillStyle="rgba(100,100,100,.30)";ctx.font="bold 72px Arial";ctx.textAlign="center";ctx.textBaseline="middle";
   ctx.fillText(stamp.slice(0,50),500,125,940);
   const png=await source.embedPng(await (await canvasToBlob(canvas)).arrayBuffer());
   for(const index of picked){const page=source.getPage(index);const {width,height}=page.getSize();const w=Math.min(width*.83,550);page.drawImage(png,{x:(width-w)/2,y:(height-w*.25)/2,width:w,height:w*.25,rotate:lib.degrees(25),opacity:.55});}
   if(title.trim())source.setTitle(title.slice(0,160));
   saveBlob(new Blob([await source.save()],{type:"application/pdf"}),"bernecki-znak-wodny.pdf");
   setReport(en?"Watermark added.":"Dodano znak wodny.");return;
  }
  if(mode==="render"){
   const pdfjs=await browserLibrary("pdfjs");pdfjs.GlobalWorkerOptions.workerSrc="https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js";
   const task=pdfjs.getDocument({data:new Uint8Array(await files[0].arrayBuffer())});
   const pdf=await task.promise;const index=pages.trim()?parsePageSelection(pages,pdf.numPages)[0]+1:1;
   if(index>pdf.numPages)throw Error("Page unavailable");
   const page=await pdf.getPage(index);
   const view=page.getViewport({scale:1.5});const canvas=document.createElement("canvas");
   canvas.width=Math.round(view.width);canvas.height=Math.round(view.height);
   const ctx=canvas.getContext("2d");if(!ctx)throw Error("Canvas unavailable");
   await page.render({canvasContext:ctx,viewport:view}).promise;
   saveBlob(await canvasToBlob(canvas),"bernecki-strona-"+index+".png");
   await task.destroy();setReport((en?"Exported page ":"Wyeksportowano stronę ")+index+".");
  }
 }
 async function run(){
  setBusy(true);setError("");setReport("");
  try{if(mode==="picture")await picture();else if(mode==="inspect")await inspect();else if(mode==="ocr")await runOcr();else if(mode==="qr")await makeQr();else await runPdf();}
  catch(e){setError(e instanceof Error?e.message:(en?"Operation failed.":"Operacja nie powiodła się."));}
  finally{setBusy(false);}
 }
 async function makeQr(){
  const generator=await browserLibrary("qr");
  const payload=qrType==="wifi"?makeWifiQrPayload(ssid,wifiPassword):qrText.trim();
  if(!payload)throw Error(en?"Enter QR content.":"Wpisz zawartość QR.");
  if(payload.length>1200)throw Error(en?"QR content is too long.":"Zbyt długa zawartość kodu.");
  const qr=generator(0,"M");qr.addData(payload);qr.make();
  const canvas=qrRef.current;if(!canvas)return;
  const modules=qr.getModuleCount(),size=8,margin=4;
  canvas.width=(modules+margin*2)*size;canvas.height=canvas.width;
  const ctx=canvas.getContext("2d");if(!ctx)throw Error("Canvas unavailable");
  ctx.fillStyle="#ffffff";ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle="#111111";for(let y=0;y<modules;y++)for(let x=0;x<modules;x++)if(qr.isDark(y,x))ctx.fillRect((x+margin)*size,(y+margin)*size,size,size);
  setQrData(canvas.toDataURL("image/png"));setReport(en?"QR ready. Scan it before sharing.":"Kod QR gotowy. Sprawdź skanerem przed udostępnieniem.");
 }
 async function runOcr(){
  if(!files[0])throw Error(en?"Choose an image.":"Wybierz zdjęcie.");
  if(files[0].size>8_000_000)throw Error(en?"OCR limit: 8 MB.":"Limit OCR: 8 MB.");
  setOcrProgress(en?"Downloading OCR language data…":"Pobieranie danych językowych OCR…");
  const tesseract=await browserLibrary("ocr");
  try{
   const output=await tesseract.recognize(files[0],en?"eng":"pol+eng",{logger:(m:{status?:string;progress?:number})=>setOcrProgress((m.status||"OCR")+" "+Math.round((m.progress||0)*100)+"%")});
   setOcrOutput(output.data.text||"");setReport(en?"Recognition complete. Check the result manually.":"Rozpoznawanie zakończone. Zweryfikuj tekst ręcznie.");
  }finally{setOcrProgress("");}
 }
 async function picture(){
  if(!files[0])throw Error(en?"Choose an image.":"Wybierz zdjęcie.");
  const f=files[0];const img=await createImageBitmap(f);
  try{
   const target=Number(maxWidth);if(!Number.isInteger(target)||target<200||target>6000)throw Error(en?"Width must be 200–6000.":"Szerokość musi wynosić 200–6000.");
   const scale=Math.min(1,target/Math.max(img.width,img.height));
   const cv=document.createElement("canvas");cv.width=Math.max(1,Math.round(img.width*scale));cv.height=Math.max(1,Math.round(img.height*scale));
   const ctx=cv.getContext("2d");if(!ctx)throw Error("Canvas unavailable");
   if(format==="image/jpeg"){ctx.fillStyle="white";ctx.fillRect(0,0,cv.width,cv.height);}
   if(imageEffect==="mirror"){ctx.translate(cv.width,0);ctx.scale(-1,1);}
   ctx.filter=imageEffect==="grayscale"?"grayscale(100%)":imageEffect==="sepia"?"sepia(100%)":imageEffect==="blur"?"blur(3px)":"none";
   ctx.drawImage(img,0,0,cv.width,cv.height);
   const blob=await canvasToBlob(cv,format,Number(quality)/100);
   const ext=format==="image/jpeg"?"jpg":format==="image/png"?"png":"webp";
   saveBlob(blob,"bernecki-obraz."+ext);
   setReport((en?"Original ":"Przed ")+bytes(f.size)+" / "+(en?"result ":"po ")+bytes(blob.size)+". "+(en?"Image processed locally; metadata was not copied to the exported canvas.":"Zdjęcie przetworzono lokalnie; metadane nie są kopiowane do eksportowanego obrazu."));
  }finally{img.close();}
 }
 async function inspect(){
  if(!files[0])throw Error(en?"Choose a file.":"Wybierz plik.");
  const file=files[0];
  const output:string[]=[(en?"Name: ":"Nazwa: ")+file.name,"MIME: "+(file.type||"unknown"),(en?"Size: ":"Rozmiar: ")+bytes(file.size),(en?"Modified: ":"Zmodyfikowano: ")+new Date(file.lastModified).toLocaleString(en?"en":"pl")];
  const buffer=await file.slice(0,524288).arrayBuffer();const data=new Uint8Array(buffer);
  if(file.type.startsWith("image/")){
   try{const img=await createImageBitmap(file);output.push((en?"Dimensions: ":"Wymiary: ")+img.width+" × "+img.height);img.close();}catch{output.push(en?"Image preview unsupported in this browser.":"Brak obsługi podglądu formatu.");}
  }
  if(data[0]===0xff&&data[1]===0xd8){
   let pos=2,hasExif=false,hasGps=false;
   while(pos+4<data.length&&data[pos]===0xff){
    const marker=data[pos+1],len=(data[pos+2]<<8)+data[pos+3];
    if(len<2||pos+len+2>data.length||marker===0xda)break;
    if(marker===0xe1){
     const part=data.slice(pos+4,Math.min(pos+4+len, data.length));
     const text=new TextDecoder("latin1").decode(part);
     if(text.startsWith("Exif"))hasExif=true;
     if(/GPSInfo|GPSLatitude|GPSLongitude/.test(text))hasGps=true;
     if(text.includes("http://ns.adobe.com/xap/1.0/"))output.push("XMP: present");
    }
    pos+=len+2;
   }
   output.push("EXIF: "+(hasExif?"present":"not detected in JPEG segments"));
   if(hasGps)output.push(en?"GPS field reference found (not a full GPS audit).":"Wykryto odniesienie do GPS (to nie jest pełny audyt GPS).");
  }
  const scan=new TextDecoder("latin1").decode(data.slice(0,Math.min(data.length,100000)));
  if(scan.includes("c2pa"))output.push(en?"C2PA marker detected — cryptographic validity NOT verified.":"Wykryto znacznik C2PA — podpis kryptograficzny NIE został zweryfikowany.");
  setMetadata(output);setReport(en?"This is a local metadata inspection, not proof of origin.":"To lokalny przegląd metadanych, a nie dowód pochodzenia pliku.");
 }
 const fileNeeded=mode!=="qr";
 return <section className="grid gap-5 lg:grid-cols-[255px_minmax(0,1fr)]">
  <nav className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible" aria-label={en?"File tools":"Narzędzia plików"}>
   {modes.map(item=><button type="button" key={item.id} aria-pressed={mode===item.id} onClick={()=>chooseMode(item.id)}
    className={"min-w-48 rounded-xl border px-4 py-3 text-left text-sm lg:min-w-0 "+(mode===item.id?"border-white/70 bg-white/15":"border-white/15 bg-[#111111] text-white/70 hover:border-white/40")}>{en?item.en:item.pl}</button>)}
  </nav>
  <div className="min-w-0 space-y-5">
   <div className="rounded-2xl border border-white/15 bg-[#111111] p-5 md:p-7">
    <div className="flex items-center gap-3"><Files size={23}/><h2 className="text-2xl font-medium">{en?chosen.en:chosen.pl}</h2></div>
    <p className="mt-3 text-sm leading-7 text-white/60">{en?"Files are processed in your browser. The required open-source libraries are fetched on first use.":"Pliki są przetwarzane w przeglądarce. Potrzebne biblioteki open source pobieramy przy pierwszym użyciu."}</p>
    {fileNeeded&&<label className="mt-6 block text-sm text-white/80">{en?"Choose file(s)":"Wybierz plik(i)"}
      <input type="file" key={mode} accept={accept(mode)} multiple={multi(mode)} onChange={e=>upload(e.target.files)} className={field+" mt-2 block file:mr-3 file:rounded-lg file:border-0 file:bg-white file:px-3 file:py-2 file:text-black"}/>
      <span className="mt-2 block text-xs text-white/50">{en?"Maximum 12 files, 20 MB per file.":"Maksymalnie 12 plików, 20 MB każdy."}</span>
     </label>}
    {files.length>0&&<div className="mt-3 space-y-1 text-xs text-white/65">{files.map((f,i)=><p key={i}>{f.name} · {bytes(f.size)}</p>)}</div>}
    {["extract","rotate","watermark","render"].includes(mode)&&<label className="mt-5 block text-sm">{en?"Pages (e.g. 1,3-5; blank = all or first page for PNG)":"Strony (np. 1,3-5; puste = wszystkie lub pierwsza dla PNG)"}
     <input className={field+" mt-2"} value={pages} onChange={e=>setPages(e.target.value)} placeholder="1,3-5"/></label>}
    {mode==="rotate"&&<label className="mt-5 block text-sm">{en?"Rotate clockwise":"Obróć zgodnie z ruchem wskazówek"}<select className={field+" mt-2"} value={angle} onChange={e=>setAngle(e.target.value)}><option value="90">90°</option><option value="180">180°</option><option value="270">270°</option></select></label>}
    {mode==="watermark"&&<div className="mt-5 grid gap-4"><label className="text-sm">{en?"Watermark text":"Tekst znaku wodnego"}<input className={field+" mt-2"} value={stamp} onChange={e=>setStamp(e.target.value)}/></label><label className="text-sm">{en?"Document title (optional)":"Tytuł dokumentu (opcjonalnie)"}<input className={field+" mt-2"} value={title} onChange={e=>setTitle(e.target.value)}/></label></div>}
    {mode==="qr"&&<div className="mt-6 space-y-4">
     <label className="block text-sm">{en?"QR type":"Rodzaj QR"}<select className={field+" mt-2"} value={qrType} onChange={e=>setQrType(e.target.value)}><option value="link">URL / text</option><option value="wifi">Wi-Fi</option></select></label>
     {qrType==="wifi"?<><label className="block text-sm">Wi-Fi SSID<input className={field+" mt-2"} value={ssid} onChange={e=>setSsid(e.target.value)}/></label><label className="block text-sm">{en?"Password":"Hasło"}<input className={field+" mt-2"} type="password" value={wifiPassword} onChange={e=>setWifiPassword(e.target.value)}/></label></>:<label className="block text-sm">{en?"URL or text":"Link lub tekst"}<textarea className={field+" mt-2"} rows={3} value={qrText} onChange={e=>setQrText(e.target.value)}/></label>}
     <canvas ref={qrRef} hidden={!qrData} className="mx-auto max-w-full rounded-xl border-8 border-white bg-white"/>
     {qrData&&<a className={btn} href={qrData} download="bernecki-kod-qr.png"><ArrowDownToLine size={16}/>{en?"Download QR PNG":"Pobierz kod QR PNG"}</a>}
    </div>}
    {mode==="picture"&&<div className="mt-5 grid gap-3 sm:grid-cols-3">
     <label className="text-sm">{en?"Format":"Format"}<select className={field+" mt-2"} value={format} onChange={e=>setFormat(e.target.value)}><option value="image/webp">WebP</option><option value="image/jpeg">JPG</option><option value="image/png">PNG</option></select></label>
     <label className="text-sm">{en?"Max. dimension":"Maks. wymiar"}<input type="number" className={field+" mt-2"} value={maxWidth} onChange={e=>setMaxWidth(e.target.value)}/></label>
     <label className="text-sm">{en?"Quality %":"Jakość %"}<input type="number" min={20} max={100} className={field+" mt-2"} value={quality} onChange={e=>setQuality(e.target.value)}/></label>
     <label className="text-sm sm:col-span-3">{en?"Effect":"Efekt"}<select value={imageEffect} onChange={e=>setImageEffect(e.target.value)} className={field+" mt-2"}><option value="none">{en?"No effect":"Bez efektu"}</option><option value="mirror">{en?"Mirror":"Odbicie lustrzane"}</option><option value="grayscale">{en?"Black and white":"Czarno-białe"}</option><option value="sepia">Sepia</option><option value="blur">{en?"Blur":"Rozmycie"}</option></select></label>
    </div>}
    <button type="button" onClick={run} disabled={busy||(!filesValid&&fileNeeded)} className={btn+" mt-6 w-full bg-white text-black hover:bg-neutral-200"}>{busy?<RotateCw size={16} className="animate-spin"/>:<ArrowDownToLine size={16}/>}
     {busy?(en?"Processing…":"Przetwarzanie…"):en?"Run / export":"Uruchom / pobierz"}</button>
    {ocrProgress&&<p role="status" className="mt-3 text-sm text-white/60">{ocrProgress}</p>}
    {error&&<p role="alert" className="mt-4 rounded-lg border border-red-500/35 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}
    {report&&<p role="status" className="mt-4 rounded-lg border border-white/20 bg-white/5 p-3 text-sm text-white/75">{report}</p>}
    {metadata.length>0&&<div className="mt-4 space-y-2 text-sm">{metadata.map((s,i)=><p key={i} className="break-words rounded-lg bg-white/5 px-3 py-2">{s}</p>)}</div>}
    {ocrOutput&&<div className="mt-5"><textarea className={field+" min-h-48"} readOnly value={ocrOutput}/><button type="button" className={btn+" mt-3"} onClick={()=>navigator.clipboard.writeText(ocrOutput)}>{en?"Copy recognized text":"Kopiuj rozpoznany tekst"}</button></div>}
   </div>
   <p className="text-xs leading-6 text-white/50">{en?"No file is sent to our server. Using the optional OCR, PDF and QR tools downloads version-pinned libraries from jsDelivr; OCR additionally downloads language data. Large files may use considerable device memory. The metadata inspector does not cryptographically verify C2PA signatures.":"Pliki nie są wysyłane na nasz serwer. PDF, QR i OCR pobierają przy użyciu sprawdzanej integralności biblioteki z jsDelivr; OCR pobiera dodatkowo dane językowe. Duże pliki obciążają pamięć telefonu. Inspektor metadanych nie sprawdza kryptograficznie podpisów C2PA."}</p>
  </div>
 </section>;
}
