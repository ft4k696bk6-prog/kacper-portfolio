"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const clients = [
  {name:"Jalapeno Kebab", detail:"Niemce", url:"https://www.instagram.com/jalapeno_kebab/", logo:null},
  {name:"Re-energy System", detail:"OZE", url:"https://re-energysystem.pl/", logo:"/images/brands/re-energy.png"},
  {name:"StarCars", detail:"USA / Canada", url:"https://star-cars.us", logo:null},
  {name:"Gentlemen Barber", detail:"Warszawa", url:null, logo:null},
  {name:"Majka Szado Walter", detail:"Rzeszów", url:"https://rzeszow-adwokat.pl/", logo:"/images/brands/msw.svg"},
];

export function ClientMarquee() {
  const {lang}=useLanguage();
  const pl=lang === "pl";
  const ref=useRef<HTMLDivElement>(null);
  const [paused,setPaused]=useState(false);
  const [reduced,setReduced]=useState(false);
  useEffect(()=>{const media=matchMedia('(prefers-reduced-motion: reduce)');const update=()=>setReduced(media.matches);update();media.addEventListener('change',update);return()=>media.removeEventListener('change',update);},[]);
  useEffect(()=>{
    const el=ref.current;
    if(!el || paused || reduced) return;
    let frame=0,last=0,hover=false;
    let position=el.scrollLeft || Math.min(el.scrollWidth/2, el.scrollWidth-el.clientWidth);
    const enter=()=>{hover=true;}; const leave=()=>{hover=false;position=el.scrollLeft;};
    const tick=(time:number)=>{if(last && !hover && !el.contains(document.activeElement)){position -= Math.min(time-last,40)*0.025;if(position<=0)position=el.scrollWidth/2;el.scrollLeft=position;}else{position=el.scrollLeft;}last=time;frame=requestAnimationFrame(tick);};
    el.scrollLeft=position;
    el.addEventListener('pointerenter',enter);el.addEventListener('pointerleave',leave);
    frame=requestAnimationFrame(tick);
    return()=>{cancelAnimationFrame(frame);el.removeEventListener('pointerenter',enter);el.removeEventListener('pointerleave',leave);};
  },[paused,reduced]);
  function move(direction:number){setPaused(true);ref.current?.scrollBy({left:direction*300,behavior:reduced?'instant':'smooth'});}
  return <section aria-label={pl?'Wybrane współprace':'Selected collaborations'} className="border-y border-white/10 bg-[#101210] py-7">
    <div className="mx-auto mb-6 flex max-w-7xl items-center justify-between gap-3 px-5 md:px-8"><p className="text-[11px] uppercase tracking-[0.2em] text-zinc-400">{pl?'Zaufali mi / wybrane współprace':'Trusted by / selected collaborations'}</p><div className="flex gap-2">
      <button onClick={()=>move(-1)} aria-label={pl?'Poprzednie firmy':'Previous businesses'} className="marquee-button"><ArrowLeft size={16}/></button>
      {!reduced && <button onClick={()=>setPaused(!paused)} aria-label={paused?(pl?'Wznów przesuwanie':'Resume scrolling'):(pl?'Zatrzymaj przesuwanie':'Pause scrolling')} className="marquee-button">{paused?<Play size={14}/>:<Pause size={14}/>}</button>}
      <button onClick={()=>move(1)} aria-label={pl?'Następne firmy':'Next businesses'} className="marquee-button"><ArrowRight size={16}/></button>
    </div></div>
    <div ref={ref} className="client-marquee mx-auto max-w-[1440px] overflow-x-auto" onTouchStart={()=>setPaused(true)}>
      <div className="flex w-max">{[0,1].map(copy=><div key={copy} className="flex shrink-0" aria-hidden={copy===1?true:undefined}>{clients.map(client=>{
        const content=<><div className="flex h-14 items-center">{client.logo?<Image src={client.logo} alt={client.name} width={170} height={65} className="h-14 w-40 object-contain"/>:<span className="text-[25px] font-semibold tracking-[-0.05em] text-[#e2e7dd]">{client.name}</span>}</div><p className="mt-3 text-[10px] uppercase tracking-widest text-zinc-500">{client.name} / {client.detail}</p></>;
        return client.url?<a key={client.name} href={client.url} target="_blank" rel="noopener noreferrer" tabIndex={copy===1?-1:0} className="client-wordmark">{content}</a>:<div key={client.name} className="client-wordmark">{content}</div>;
      })}</div>)}</div>
    </div>
  </section>;
}
