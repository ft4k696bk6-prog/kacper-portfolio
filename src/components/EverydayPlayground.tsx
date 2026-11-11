"use client";
import { useEffect,useMemo,useRef,useState } from "react";
import { ArrowRight, Check, Clipboard, Download, FileImage, Gamepad2, Image as ImageIcon, Keyboard, LockKeyhole, Mail, Percent, RefreshCcw, Shuffle, Type, Zap } from "lucide-react";
import { cleanText,dedupeLines,parseNumber,percentage,password,pickRandom } from "@/lib/everyday-utils";
import type { PercentMode } from "@/lib/everyday-utils";
import { KeyboardGalaxy } from "./KeyboardGalaxy";
import { ArcadeGames } from "./ArcadeGames";
import { ARCADE_GAMES } from "@/lib/arcade-logic";
import { GameThumbnail } from "./GameThumbnail";
import { EmailSignatureBuilder } from "./EmailSignatureBuilder";
import type { ArcadeId } from "@/lib/arcade-logic";

type Tab="text"|"percentage"|"password"|"image"|"random"|"signature"|ArcadeId;
const entries:{id:Tab;icon:typeof Type;group:"utility"|"play";pl:string;en:string;descPL:string;descEN:string}[]=[
 {id:"text",icon:Type,group:"utility",pl:"Porządkowanie tekstu",en:"Text cleaner",descPL:"Usuń ukryte znaki i duplikaty.",descEN:"Remove hidden characters and duplicates."},
 {id:"percentage",icon:Percent,group:"utility",pl:"Kalkulator procentów",en:"Percentage calculator",descPL:"Rabaty, podwyżki i różnice.",descEN:"Discounts, increases and differences."},
 {id:"password",icon:LockKeyhole,group:"utility",pl:"Generator haseł",en:"Password generator",descPL:"Losowe hasła tworzone lokalnie.",descEN:"Cryptographically secure local passwords."},
 {id:"image",icon:ImageIcon,group:"utility",pl:"Konwerter zdjęć",en:"Image converter",descPL:"JPG, PNG, WebP i zmniejszanie zdjęć.",descEN:"JPG, PNG, WebP and image resizing."},
 {id:"random",icon:Shuffle,group:"utility",pl:"Losowanie",en:"Random picker",descPL:"Wybierz losowo spośród wpisanych opcji.",descEN:"Pick a random choice from a list."},
 {id:"signature",icon:Mail,group:"utility",pl:"Darmowy generator stopki e-mail",en:"Free email signature maker",descPL:"Stopki statyczne i animowane GIF z linkami do social mediów.",descEN:"Classic and animated GIF signatures with social links."},
 {id:"reflex",icon:Zap,group:"play",pl:"Test refleksu",en:"Reaction speed test",descPL:"Sprawdź swój czas reakcji.",descEN:"Check your reaction time."},
 {id:"kids",icon:Gamepad2,group:"play",pl:"Klawiaturowa galaktyka",en:"Keyboard Galaxy",descPL:"Litery, cyfry, kosmos i efekty.",descEN:"Letters, numbers and space effects."},
 ...ARCADE_GAMES.filter(game=>game.id!=="reflex"&&game.id!=="kids").map(game=>({id:game.id,icon:Gamepad2,group:"play" as const,pl:game.pl,en:game.en,descPL:game.plDesc,descEN:game.enDesc}))
];
const fieldClass="w-full rounded-xl border border-white/20 bg-[#090909] px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-white/60";
const panelClass="rounded-2xl border border-white/15 bg-[#111111] p-5 md:p-7";
const actionClass="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/25 px-4 py-2.5 text-sm transition-colors hover:border-white/60";

export function EverydayPlayground({lang,mode="utility"}:{lang:"pl"|"en";mode?:"utility"|"games"}){
 const en=lang==="en";
 const [tab,setTab]=useState<Tab>(mode==="games"?"reflex":"text");
 const [filter,setFilter]=useState("");
 const [input,setInput]=useState("");
 const [output,setOutput]=useState("");
 const [base,setBase]=useState("200");
 const [rate,setRate]=useState("10");
 const [percentMode,setPercentMode]=useState<PercentMode>("increase");
 const [pwdLength,setPwdLength]=useState(18);
 const [pwdOptions,setPwdOptions]=useState([true,true,true,true]);
 const [pwd,setPwd]=useState("");
 const [photo,setPhoto]=useState<File|null>(null);
 const [imageType,setImageType]=useState("image/webp");
 const [width,setWidth]=useState(1920);
 const [quality,setQuality]=useState(80);
 const [converted,setConverted]=useState("");
 const [imageError,setImageError]=useState("");
 const [convertedSize,setConvertedSize]=useState(0);
 const [choices,setChoices]=useState("");
 const [chosen,setChosen]=useState("");
 const [reflex,setReflex]=useState<"idle"|"waiting"|"ready"|"early"|"done">("idle");
 const [reaction,setReaction]=useState(0);
 const timer=useRef<ReturnType<typeof setTimeout>|null>(null);
 const started=useRef(0);
 const [toast,setToast]=useState("");
 const texts=useMemo(()=>entries.filter(e=>e.group===(mode==="games"?"play":"utility")&&(en?e.en+" "+e.descEN:e.pl+" "+e.descPL).toLocaleLowerCase().includes(filter.toLocaleLowerCase().trim())),[filter,en,mode]);
 const selected=entries.find(x=>x.id===tab)!;
 const result=percentage(parseNumber(base),parseNumber(rate),percentMode);
 useEffect(()=>{
  const hash=location.hash.replace("#","");
  const target=entries.find(x=>x.id===hash);
   if(target?.group===(mode==="games"?"play":"utility"))setTab(hash as Tab);
   else if(target?.group==="play"&&mode==="utility")window.location.replace((en?"/en/games":"/minigry")+"#"+hash);
  return()=>{if(timer.current)clearTimeout(timer.current);};
 },[mode,en]);
 useEffect(()=>()=>{if(converted)URL.revokeObjectURL(converted);},[converted]);
 const go=(id:Tab)=>{setTab(id);history.replaceState(null,"","#"+id);setToast("");if(mode==="games")window.requestAnimationFrame(()=>document.getElementById("game-stage")?.scrollIntoView({behavior:"smooth",block:"start"}));};
 const notify=(message:string)=>{setToast(message);window.setTimeout(()=>setToast(""),2600);};
 const copy=async(value:string)=>{try{await navigator.clipboard.writeText(value);notify(en?"Copied":"Skopiowano");}catch{notify(en?"Copy unavailable in this browser":"Kopiowanie niedostępne w tej przeglądarce");}};
 const generatePassword=()=>{
  const groups=[pwdOptions[0]?"abcdefghijkmnopqrstuvwxyz":"",pwdOptions[1]?"ABCDEFGHJKLMNPQRSTUVWXYZ":"",pwdOptions[2]?"23456789":"",pwdOptions[3]?"!@#$%&*?":""] .filter(Boolean);
  if(!groups.length){notify(en?"Select at least one character type":"Wybierz przynajmniej jeden rodzaj znaków");return;}
  setPwd(password(pwdLength,groups));
 };
 const convertImage=async()=>{
  if(!photo)return;
  setImageError("");setConverted("");
  if(photo.size>20_000_000){setImageError(en?"Maximum file size is 20 MB.":"Maksymalny rozmiar pliku: 20 MB.");return;}
  let source="";
  try{
   source=URL.createObjectURL(photo);
   const img=new window.Image();
   img.src=source;
   await new Promise<void>((resolve,reject)=>{img.onload=()=>resolve();img.onerror=()=>reject(new Error(en?"This browser cannot open this image format. Try JPG or PNG.":"Przeglądarka nie obsługuje tego formatu. Spróbuj JPG lub PNG."));});
   const scale=Math.min(1,width/Math.max(img.naturalWidth,img.naturalHeight));
   const canvas=document.createElement("canvas");
   canvas.width=Math.max(1,Math.round(img.naturalWidth*scale));
   canvas.height=Math.max(1,Math.round(img.naturalHeight*scale));
   const ctx=canvas.getContext("2d");if(!ctx)throw new Error(en?"Canvas unavailable":"Brak obsługi Canvas");
   if(imageType==="image/jpeg"){ctx.fillStyle="#ffffff";ctx.fillRect(0,0,canvas.width,canvas.height);}
   ctx.drawImage(img,0,0,canvas.width,canvas.height);
   const blob=await new Promise<Blob|null>(resolve=>canvas.toBlob(resolve,imageType,quality/100));
   if(!blob)throw new Error(en?"Conversion failed":"Konwersja się nie powiodła");
   if(blob.type!==imageType)throw new Error(en?"Output format is not supported by this browser":"Wybrany format nie jest obsługiwany przez przeglądarkę");
   setConverted(URL.createObjectURL(blob));setConvertedSize(blob.size);
  }catch(err){setImageError(err instanceof Error?err.message:(en?"Unable to process image":"Nie udało się przetworzyć zdjęcia"));}
  finally{if(source)URL.revokeObjectURL(source);}
 };
 const downloadImage=()=>{
  if(!photo||!converted)return;
  const link=document.createElement("a");link.href=converted;link.download=photo.name.replace(/\.[^.]+$/,"")+"-bernecki."+(imageType==="image/jpeg"?"jpg":imageType==="image/png"?"png":"webp");link.click();
 };
 const reflexClick=()=>{
  if(reflex==="waiting"){if(timer.current)clearTimeout(timer.current);setReflex("early");return;}
  if(reflex==="ready"){setReaction(Math.round(performance.now()-started.current));setReflex("done");return;}
  setReflex("waiting");timer.current=setTimeout(()=>{started.current=performance.now();setReflex("ready");},1200+Math.random()*2400);
 };
 return <div className={mode==="games"?"mt-9 space-y-8":"mt-9 grid gap-6 lg:grid-cols-[290px_minmax(0,1fr)]"}>
  <aside className="min-w-0">
   <label className="block"><span className="sr-only">{en?"Search tools":"Szukaj narzędzi"}</span>
    <input type="search" className={fieldClass} value={filter} onChange={e=>setFilter(e.target.value)} placeholder={en?"Find a tool…":"Znajdź narzędzie…"}/></label>
   <nav className="mt-4 space-y-6" aria-label={mode==="games"?(en?"Choose a game":"Wybierz grę"):(en?"Tool selection":"Wybierz narzędzie")}>
    {([mode==="games"?"play":"utility"] as const).map(group=>{
     const groupItems=texts.filter(item=>item.group===group);
     if(!groupItems.length)return null;
     return <div key={group}>
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[.16em] text-white/50">{group==="utility"?(en?"02 / Tools":"02 / Narzędzia"):(en?"01 / Games & entertainment":"01 / Gry i rozrywka")} <span className="ml-2 text-white/35">{groupItems.length}</span></p>
      <div className={mode==="games"?"grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5":"grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-1"}>{groupItems.map(item=>{const Icon=item.icon;return <button type="button" key={item.id} onClick={()=>go(item.id)}
       aria-current={tab===item.id?"page":undefined} aria-pressed={tab===item.id}
       className={(mode==="games"?"flex min-w-0 flex-col gap-3 rounded-2xl border p-2.5 text-left transition-colors ":"flex min-h-[58px] min-w-0 items-center gap-3 rounded-xl border px-3 py-3 text-left transition-colors ")+(tab===item.id?"border-white/60 bg-white/15 text-white":"border-white/10 bg-[#111111] text-white/70 hover:border-white/35")}>
       {mode==="games"?<><GameThumbnail game={item.id as ArcadeId}/><span className="px-1 pb-1 text-sm font-medium leading-5">{en?"Free "+item.en:"Darmowa gra: "+item.pl}</span></>:<><Icon size={18} className="shrink-0"/><span className="min-w-0 text-xs leading-5 sm:text-sm">{en?(item.en.startsWith("Free ")?item.en:"Free "+item.en):(item.pl.startsWith("Darmow")?item.pl:"Darmowe narzędzie: "+item.pl)}</span></>}</button>;})}</div>
     </div>;
    })}
   </nav>
   {!texts.length&&<p className="mt-3 text-sm text-white/50">{en?"No matching tools.":"Brak pasujących narzędzi."}</p>}
   <p className="mt-3 text-xs leading-6 text-white/45">{mode==="games"?(en?"Play on your device — no download or account.":"Graj bez pobierania i bez konta."):(en?"Tools run locally in your browser, without account creation.":"Narzędzia działają lokalnie w przeglądarce, bez zakładania konta.")}</p>
  </aside>
  <div id={mode==="games"?"game-stage":undefined} className="min-w-0 scroll-mt-28 space-y-5">
   {(selected.group==="utility"||tab==="reflex")&&<header className={panelClass}>
    <div className="flex items-center gap-3"><selected.icon size={22}/><h2 className="text-2xl font-medium">{en?(selected.en.startsWith("Free ")?selected.en:"Free "+selected.en):(selected.pl.startsWith("Darmow")?selected.pl:(selected.group==="play"?"Darmowa gra: ":"Darmowe narzędzie: ")+selected.pl)}</h2></div>
    <p className="mt-3 text-sm leading-6 text-white/65">{en?selected.descEN:selected.descPL}</p>
   </header>}
   {tab==="text"&&<div className={panelClass+" space-y-4"}>
    <label className="block text-sm text-white/75">{en?"Paste text":"Wklej tekst"}<textarea rows={8} value={input} onChange={e=>{setInput(e.target.value);setOutput("");}} className={fieldClass+" mt-2 font-mono"} placeholder={en?"Paste your text here":"Wklej tekst tutaj"}/></label>
    <div className="flex flex-wrap gap-2">
     <button className={actionClass} onClick={()=>setOutput(cleanText(input))}>{en?"Clean text":"Uporządkuj tekst"}</button>
     <button className={actionClass} onClick={()=>setOutput(dedupeLines(input))}>{en?"Remove duplicate lines":"Usuń duplikaty wierszy"}</button>
     <button className={actionClass} onClick={()=>setOutput(input.toLocaleUpperCase(en?"en":"pl"))}>{en?"UPPERCASE":"WIELKIE LITERY"}</button>
     <button className={actionClass} onClick={()=>setOutput(input.toLocaleLowerCase(en?"en":"pl"))}>{en?"lowercase":"małe litery"}</button>
    </div>
    <p className="text-xs text-white/50">{en?"Characters":"Znaki"}: {input.length} · {en?"Words":"Słowa"}: {input.trim()?input.trim().split(/\s+/).length:0}</p>
    <label className="block text-sm text-white/75">{en?"Result":"Wynik"}<textarea readOnly rows={7} value={output} className={fieldClass+" mt-2 font-mono"}/></label>
    <button disabled={!output} className={actionClass+" disabled:opacity-40"} onClick={()=>copy(output)}><Clipboard size={16}/>{en?"Copy result":"Kopiuj wynik"}</button>
   </div>}
   {tab==="percentage"&&<div className={panelClass+" space-y-5"}>
    <div className="grid gap-4 sm:grid-cols-2">
     <label className="text-sm">{en?"Base value":"Wartość początkowa"}<input className={fieldClass+" mt-2"} inputMode="decimal" value={base} onChange={e=>setBase(e.target.value)}/></label>
     <label className="text-sm">{percentMode==="difference"?(en?"New value":"Nowa wartość"):(en?"Percent":"Procent")}<input className={fieldClass+" mt-2"} inputMode="decimal" value={rate} onChange={e=>setRate(e.target.value)}/></label>
    </div>
    <label className="block text-sm">{en?"Operation":"Działanie"}<select className={fieldClass+" mt-2"} value={percentMode} onChange={e=>setPercentMode(e.target.value as PercentMode)}>
     <option value="increase">{en?"Increase by %":"Zwiększ o %"}</option><option value="decrease">{en?"Decrease by %":"Zmniejsz o %"}</option>
     <option value="part">{en?"Find % of a number":"Oblicz % z liczby"}</option><option value="difference">{en?"Percentage change between values":"Zmiana procentowa między wartościami"}</option>
    </select></label>
    <div aria-live="polite" className="rounded-xl border border-white/20 bg-[#080808] p-6"><p className="text-xs text-white/55">{en?"Result":"Wynik"}</p><p className="mt-2 break-words text-3xl font-semibold">{Number.isFinite(result)?new Intl.NumberFormat(en?"en-US":"pl-PL",{maximumFractionDigits:4}).format(result)+(percentMode==="difference"?"%":""):(en?"Check the entered numbers":"Sprawdź wprowadzone liczby")}</p></div>
    <p className="text-xs text-white/50">{en?"For estimates only. Taxes and specific financial regulations are not included.":"Wynik matematyczny — bez uwzględnienia podatków i przepisów szczególnych."}</p>
   </div>}
   {tab==="password"&&<div className={panelClass+" space-y-5"}>
    <label className="block text-sm">{en?"Password length":"Długość hasła"}: <strong>{pwdLength}</strong><input type="range" min="8" max="64" value={pwdLength} onChange={e=>setPwdLength(Number(e.target.value))} className="mt-3 w-full accent-white"/></label>
    <div className="grid gap-3 sm:grid-cols-2">{[en?"Lowercase letters":"Małe litery",en?"Uppercase letters":"Wielkie litery",en?"Numbers":"Cyfry",en?"Special characters":"Znaki specjalne"].map((label,i)=><label key={label} className="flex items-center gap-3 rounded-xl border border-white/15 p-3 text-sm"><input type="checkbox" checked={pwdOptions[i]} onChange={e=>setPwdOptions(old=>old.map((v,j)=>i===j?e.target.checked:v))} className="size-4 accent-white"/>{label}</label>)}</div>
    <button className={actionClass} onClick={generatePassword}><RefreshCcw size={16}/>{en?"Generate password":"Wygeneruj hasło"}</button>
    <div className="flex min-w-0 items-center gap-2"><input readOnly aria-label={en?"Generated password":"Wygenerowane hasło"} className={fieldClass+" min-w-0 font-mono"} value={pwd}/><button disabled={!pwd} onClick={()=>copy(pwd)} className={actionClass+" shrink-0 disabled:opacity-40"}><Clipboard size={16}/></button></div>
    <p className="text-xs leading-6 text-white/55">{en?"Generated using the browser's cryptographic random number generator. We do not save your password.":"Generator korzysta z kryptograficznego źródła losowości przeglądarki. Hasła nie zapisujemy."}</p>
   </div>}
   {tab==="image"&&<div className={panelClass+" space-y-5"}>
    <label className="block text-sm">{en?"Choose an image (max 20 MB)":"Wybierz zdjęcie (maks. 20 MB)"}<input type="file" accept="image/*,.heic,.heif" className={fieldClass+" mt-2"} onChange={e=>{setPhoto(e.target.files?.[0]||null);setConverted("");setImageError("");}}/></label>
    <div className="grid gap-4 sm:grid-cols-3">
     <label className="text-sm">{en?"Output format":"Format docelowy"}<select className={fieldClass+" mt-2"} value={imageType} onChange={e=>setImageType(e.target.value)}><option value="image/webp">WebP</option><option value="image/jpeg">JPG</option><option value="image/png">PNG</option></select></label>
     <label className="text-sm">{en?"Maximum longer side (px)":"Maks. dłuższy bok (px)"}<input type="number" min={320} max={6000} className={fieldClass+" mt-2"} value={width} onChange={e=>setWidth(Math.max(320,Math.min(6000,Number(e.target.value)||320)))}/></label>
     <label className="text-sm">{en?"Quality":"Jakość"}: {quality}%<input type="range" min={30} max={100} value={quality} onChange={e=>setQuality(Number(e.target.value))} className="mt-5 w-full accent-white" disabled={imageType==="image/png"}/></label>
    </div>
    <button className={actionClass} disabled={!photo} onClick={convertImage}><FileImage size={16}/>{en?"Convert locally":"Konwertuj lokalnie"}</button>
    {imageError&&<p className="text-sm text-red-300" role="alert">{imageError}</p>}
    {converted&&<div className="space-y-3"><img src={converted} alt={en?"Converted result preview":"Podgląd przekonwertowanego obrazu"} className="max-h-72 w-full rounded-xl bg-[#080808] object-contain"/><p className="text-xs text-white/60">{en?"Result size":"Rozmiar wyniku"}: {(convertedSize/1024).toFixed(1)} KB</p><button className={actionClass} onClick={downloadImage}><Download size={16}/>{en?"Download image":"Pobierz obraz"}</button></div>}
    <p className="text-xs leading-6 text-white/50">{en?"Files stay on your device. HEIC support depends on the browser. Converting may remove metadata, but this is not a certified metadata-scrubbing tool.":"Pliki pozostają na urządzeniu. Obsługa HEIC zależy od przeglądarki. Konwersja może usuwać metadane, ale nie jest certyfikowanym narzędziem ich czyszczenia."}</p>
   </div>}
   {tab==="random"&&<div className={panelClass+" space-y-4"}>
    <label className="block text-sm">{en?"One option per line":"Jedna opcja w każdym wierszu"}<textarea className={fieldClass+" mt-2"} rows={8} value={choices} onChange={e=>{setChoices(e.target.value);setChosen("");}} placeholder={en?"Pizza\nSushi\nBurgers":"Pizza\nSushi\nBurgery"}/></label>
    <button className={actionClass} disabled={!choices.trim()} onClick={()=>setChosen(pickRandom(choices))}><Shuffle size={16}/>{en?"Pick a winner":"Losuj wynik"}</button>
    {chosen&&<div aria-live="polite" className="rounded-xl border border-white/35 bg-[#171717] p-7 text-center"><p className="text-xs text-white/55">{en?"Winner":"Wylosowano"}</p><p className="mt-3 break-words text-3xl font-medium">{chosen}</p></div>}
   </div>}
   {tab==="signature"&&<EmailSignatureBuilder lang={lang}/>}
   {tab==="reflex"&&<div className={panelClass+" space-y-4"}>
    <p className="text-sm leading-6 text-white/60">{en?"Click to start. Wait for green, then click as quickly as possible.":"Kliknij, żeby zacząć. Poczekaj na zielony kolor i kliknij jak najszybciej."}</p>
    <button type="button" onClick={reflexClick} aria-live="polite" className={"flex min-h-72 w-full flex-col items-center justify-center rounded-2xl p-8 text-center text-xl font-semibold transition-colors "+(reflex==="ready"?"bg-emerald-700":reflex==="waiting"?"bg-rose-800":"bg-[#252525]")}>
     <Zap size={40} className="mb-5"/>
     {reflex==="idle"?(en?"Start test":"Rozpocznij test"):reflex==="waiting"?(en?"Wait for green…":"Czekaj na zielony…"):reflex==="ready"?(en?"CLICK NOW!":"KLIKNIJ TERAZ!"):reflex==="early"?(en?"Too early — try again":"Za wcześnie — spróbuj ponownie"):(en?"Reaction time: "+reaction+" ms. Try again!":"Czas reakcji: "+reaction+" ms. Spróbuj ponownie!")}
    </button>
   </div>}
   {tab==="kids"&&<div className={panelClass}><KeyboardGalaxy lang={lang}/></div>}
   {selected.group==="play"&&tab!=="kids"&&tab!=="reflex"&&<ArcadeGames lang={lang} game={tab as ArcadeId}/>}
   {toast&&<p role="status" className="fixed bottom-6 right-6 z-50 rounded-xl bg-white px-5 py-3 text-sm text-black shadow-xl"><Check size={15} className="mr-2 inline"/>{toast}</p>}
   <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5 text-xs text-white/50">
    <span>{en?"Made for everyday use. No sign-up.":"Stworzone do codziennego użytku. Bez logowania."}</span>
    <a className="inline-flex items-center gap-1 underline underline-offset-4" href={en?"/en/tools":"/narzedzia"}>{en?"Browse tools":"Wszystkie narzędzia"}<ArrowRight size={14}/></a>
   </div>
  </div>
 </div>;
}
