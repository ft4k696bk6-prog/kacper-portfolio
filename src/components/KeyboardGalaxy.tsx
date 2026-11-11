"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Maximize, Minimize, RefreshCw } from "lucide-react";

type Particle={id:number;x:number;y:number;symbol:string;color:string;trail:boolean};
const symbols=["🚀","👾","🪐","⭐","🌈","🦄","🛸","🐳","☄️","✨","🌙","🎈"];
const colors=["#ffe88a","#ff9bce","#9ee7ff","#c9ffad","#e0b5ff","#ffffff"];
const themes=[
 {id:"space",pl:"Kosmos",en:"Space",background:"radial-gradient(circle at 35% 20%,#39447e 0%,#13152d 50%,#090b17 100%)"},
 {id:"sea",pl:"Ocean",en:"Ocean",background:"linear-gradient(145deg,#04364e,#086788,#06212d)"},
 {id:"forest",pl:"Las",en:"Forest",background:"linear-gradient(135deg,#173c32,#225743,#071c16)"}
];
let serial=0;
export function KeyboardGalaxy({lang}:{lang:"pl"|"en"}){
 const en=lang==="en";
 const [active,setActive]=useState(false);
 const [simulatedFullscreen,setSimulatedFullscreen]=useState(false);
 const [nativeFullscreen,setNativeFullscreen]=useState(false);
 const [theme,setTheme]=useState("space");
 const [items,setItems]=useState<Particle[]>([]);
 const area=useRef<HTMLDivElement>(null);
 const lastPointer=useRef(0);
 const emit=useCallback((key:string,x?:number,y?:number,trail=false)=>{
  const mark=trail?"●":/^[a-zA-Z0-9ĄĆĘŁŃÓŚŹŻąćęłńóśźż]$/.test(key)?key.toUpperCase():symbols[Math.floor(Math.random()*symbols.length)];
  const item:Particle={id:serial++,x:x??(15+Math.random()*70),y:y??(15+Math.random()*60),symbol:mark,color:colors[Math.floor(Math.random()*colors.length)],trail};
  setItems(old=>[...old.slice(-33),item]);
 },[]);
 useEffect(()=>{
  if(!active)return;
  const onKey=(e:KeyboardEvent)=>{
   if(e.key==="Escape"){setActive(false);setSimulatedFullscreen(false);if(document.fullscreenElement===area.current)void document.exitFullscreen();return;}
   if(e.metaKey||e.ctrlKey||e.altKey||e.key==="Tab"||e.key==="Shift")return;
   if(["INPUT","TEXTAREA","SELECT"].includes((e.target as HTMLElement)?.tagName))return;
   if(e.key===" "||e.key.length===1){e.preventDefault();emit(e.key);}
  };
  window.addEventListener("keydown",onKey);
  return()=>window.removeEventListener("keydown",onKey);
 },[active,emit]);
 const pointer=(e:React.PointerEvent<HTMLDivElement>,trail:boolean)=>{
  if(!active)return;
  if(trail){if(Date.now()-lastPointer.current<42)return;lastPointer.current=Date.now();}
  const rect=e.currentTarget.getBoundingClientRect();
  emit("",(e.clientX-rect.left)/rect.width*100,(e.clientY-rect.top)/rect.height*100,trail);
 };
 const expanded=simulatedFullscreen||nativeFullscreen;
 useEffect(()=>{
  const sync=()=>setNativeFullscreen(document.fullscreenElement===area.current);
  document.addEventListener("fullscreenchange",sync);
  return()=>document.removeEventListener("fullscreenchange",sync);
 },[]);
 useEffect(()=>{
  if(!simulatedFullscreen)return;
  const original=document.body.style.overflow;
  document.body.style.overflow="hidden";
  const onEscape=(e:KeyboardEvent)=>{if(e.key==="Escape")setSimulatedFullscreen(false);};
  window.addEventListener("keydown",onEscape);
  return()=>{document.body.style.overflow=original;window.removeEventListener("keydown",onEscape);};
 },[simulatedFullscreen]);
 const fullscreen=async()=>{
  const el=area.current;if(!el)return;
  if(simulatedFullscreen){setSimulatedFullscreen(false);return;}
  if(document.fullscreenElement===el){await document.exitFullscreen();return;}
  // iOS Safari does not support element.requestFullscreen for a regular div.
  // Use a viewport-covering CSS mode on unsupported devices.
  setActive(true);
  if(document.fullscreenEnabled&&typeof el.requestFullscreen==="function"){
   try{await el.requestFullscreen();setNativeFullscreen(true);return;}catch{/* CSS fallback below */}
  }
  setSimulatedFullscreen(true);
 };
 return <section className="space-y-4">
  <div className="flex flex-wrap items-center justify-between gap-3">
   <div><h2 className="text-2xl font-medium">{en?"Keyboard Galaxy — for kids":"Klawiaturowa galaktyka — dla dzieci"}</h2>
    <p className="mt-2 text-sm leading-6 text-white/65">{en?"Press any key or tap anywhere to create letters, numbers and surprises. No ads or account.":"Naciskaj klawisze lub dotykaj ekranu. Pojawią się litery, cyfry i niespodzianki. Bez reklam i konta."}</p></div>
   <div className="flex gap-2">
    <button type="button" onClick={()=>setItems([])} className="flex min-h-11 items-center gap-2 rounded-lg border border-white/25 px-3 text-sm"><RefreshCw size={16}/>{en?"Clear":"Wyczyść"}</button>
    <button type="button" onClick={fullscreen} aria-pressed={expanded} className="flex min-h-11 items-center gap-2 rounded-lg border border-white/25 px-3 text-sm">{expanded?<Minimize size={16}/>:<Maximize size={16}/>} {expanded?(en?"Exit full screen":"Wyjdź z pełnego ekranu"):(en?"Full screen":"Pełny ekran")}</button>
   </div>
  </div>
  <div className="flex flex-wrap gap-2" role="group" aria-label={en?"Background":"Tło"}>
   {themes.map(t=><button key={t.id} type="button" aria-pressed={theme===t.id} onClick={()=>setTheme(t.id)} className={"min-h-10 rounded-full border px-4 text-xs "+(theme===t.id?"border-white bg-white text-black":"border-white/25 text-white/75")}>{en?t.en:t.pl}</button>)}
  </div>
  <div ref={area} tabIndex={0} role="application" aria-label={en?"Interactive keyboard playground":"Interaktywna zabawa klawiaturą"}
    onPointerDown={e=>{if(!active)setActive(true);pointer(e,false);area.current?.focus();}}
    onPointerMove={e=>pointer(e,true)}
    className={"kids-stage relative h-[420px] w-full select-none overflow-hidden rounded-2xl border border-white/25 outline-none focus-visible:ring-2 focus-visible:ring-white md:h-[560px]"+(simulatedFullscreen?" is-expanded":"")}
    style={{background:themes.find(t=>t.id===theme)?.background,touchAction:"none"}}>
   {expanded&&<button type="button" aria-label={en?"Exit full screen":"Wyjdź z pełnego ekranu"} onPointerDown={e=>e.stopPropagation()} onClick={e=>{e.stopPropagation();void fullscreen();}} className="absolute right-4 z-30 flex min-h-12 items-center gap-2 rounded-xl border border-white/30 bg-black/75 px-4 text-sm text-white shadow-lg" style={{top:"max(16px, env(safe-area-inset-top))"}}><Minimize size={18}/>{en?"Close":"Zamknij"}</button>}
   <div className="pointer-events-none absolute inset-0 opacity-50" style={{backgroundImage:"radial-gradient(#fff 1px, transparent 1px)",backgroundSize:"41px 41px"}}/>
   {items.map(item=><span key={item.id} aria-hidden="true" className={"pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 select-none "+(item.trail?"kids-trail":"kids-pop")} style={{left:item.x+"%",top:item.y+"%",color:item.color,fontSize:item.trail?"18px":"clamp(40px,8vw,100px)",textShadow:"0 4px 20px #0008"}}>{item.symbol}</span>)}
   {!active&&<button type="button" onClick={()=>{setActive(true);area.current?.focus();}} className="absolute inset-0 z-10 flex w-full flex-col items-center justify-center gap-4 bg-black/35 p-6 text-center">
     <span className="text-6xl" aria-hidden="true">🚀</span><span className="text-2xl font-semibold">{en?"Start playing":"Rozpocznij zabawę"}</span>
     <span className="max-w-sm text-sm text-white/80">{en?"Use your keyboard or tap the screen. You can also open full screen.":"Użyj klawiatury lub dotykaj ekranu. Możesz też włączyć pełny ekran."}</span>
   </button>}
   {active&&<span className="pointer-events-none absolute bottom-3 left-4 rounded-full bg-black/30 px-3 py-1 text-xs text-white/70">{en?"Press Esc to stop":"Esc — zakończ"}</span>}
  </div>
  <p className="text-xs leading-6 text-white/50">{en?"Original browser mini-game. Muted by default. Parents should supervise small children.":"Autorska minigra przeglądarkowa. Domyślnie bez dźwięku. Małe dzieci powinny bawić się pod opieką dorosłego."}</p>
  <style>{".kids-stage:fullscreen,.kids-stage.is-expanded{position:fixed;inset:0;z-index:2147483647;width:100vw!important;height:100dvh!important;max-width:none;border-radius:0;border:0}.kids-stage.is-expanded{background-color:#090b17}.kids-stage:fullscreen{position:fixed}.kids-pop{animation:kids-pop 1.65s ease-out both}.kids-trail{animation:kids-trail 1s ease-out both}@keyframes kids-pop{0%{opacity:0;transform:translate(-50%,-50%) scale(.25) rotate(-20deg)}22%{opacity:1;transform:translate(-50%,-50%) scale(1.22) rotate(5deg)}75%{opacity:1}100%{opacity:0;transform:translate(-50%,-85%) scale(.88)}}@keyframes kids-trail{from{opacity:.75;transform:translate(-50%,-50%) scale(1)}to{opacity:0;transform:translate(-50%,-120%) scale(2)}}"}</style>
 </section>;
}
