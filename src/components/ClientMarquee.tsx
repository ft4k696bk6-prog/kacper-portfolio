"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { wrapMarqueePosition } from "@/lib/marquee";
const clients = [
  { name:"Isto Kebab", detail:"Jabłonka", url:"https://isto.bernecki.dev", logo:"/images/brands/isto-kebab.svg" },
  { name:"Motomizer", detail:"motomizer.pl", url:"https://motomizer.pl", logo:null },
  { name:"Jalapeno Kebab", detail:"Niemce", url:"https://www.instagram.com/jalapeno_kebab/", logo:"/images/brands/jalapeno.jpg" },
  { name:"Re-energy System", detail:"OZE", url:"https://re-energysystem.pl/", logo:"/images/brands/re-energy.png" },
  { name:"StarCars", detail:"USA / Canada", url:"https://star-cars.us", logo:"/images/brands/starcars.svg" },
  { name:"Gentlemen Barber Shop", detail:"Warszawa", url:null, logo:"/images/brands/gentlemen.webp" },
  { name:"Majka Szado Walter", detail:"Rzeszów", url:"https://rzeszow-adwokat.pl/", logo:"/images/brands/msw.svg" },
];


export function ClientMarquee() {
 const {lang}=useLanguage(); const pl=lang==="pl";
 const ref=useRef<HTMLDivElement>(null),track=useRef<HTMLDivElement>(null);
 const savedPosition=useRef(0);
 const [paused,setPaused]=useState(false);
 useEffect(()=>{
  const viewport=ref.current,el=track.current;if(!viewport||!el)return;
  const media=matchMedia("(prefers-reduced-motion: reduce)");
  let span=0,position=savedPosition.current,frame=0,last=0,visible=true;
  let drag:null|{id:number;x:number;lastX:number;moved:boolean}=null;
  let suppress=false;
  const draw=()=>{position=wrapMarqueePosition(position,span);el.style.transform="translate3d("+(-position)+"px,0,0)";};
  const stop=()=>{cancelAnimationFrame(frame);frame=0;last=0;};
  const tick=(now:number)=>{frame=0;if(document.hidden||!visible)return;const dt=last?Math.min(now-last,50):0;last=now;if(!drag&&!paused&&!media.matches&&!viewport.contains(document.activeElement)){position+=dt*.035;draw();}schedule();};
  const schedule=()=>{if(!frame&&!document.hidden&&visible&&!paused&&!media.matches)frame=requestAnimationFrame(tick);};
  const resize=()=>{span=(el.firstElementChild as HTMLElement).offsetWidth;draw();};
  const down=(e:PointerEvent)=>{if(e.button!==0)return;suppress=false;drag={id:e.pointerId,x:e.clientX,lastX:e.clientX,moved:false};};
  const move=(e:PointerEvent)=>{if(!drag||e.pointerId!==drag.id)return;if(Math.abs(e.clientX-drag.x)>4){drag.moved=true;suppress=true;if(!viewport.hasPointerCapture(e.pointerId))viewport.setPointerCapture(e.pointerId);}if(drag.moved){e.preventDefault();position-=e.clientX-drag.lastX;draw();}drag.lastX=e.clientX;};
  const up=()=>{if(drag?.moved&&viewport.contains(document.activeElement))(document.activeElement as HTMLElement).blur();drag=null;};
  const click=(e:MouseEvent)=>{if(suppress){e.preventDefault();e.stopPropagation();suppress=false;}};
  const wheel=(e:WheelEvent)=>{if(Math.abs(e.deltaX)>Math.abs(e.deltaY)){e.preventDefault();position+=e.deltaX;draw();}};
  const visibility=()=>{stop();schedule();};
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;visibility();});
  const ro=new ResizeObserver(resize);ro.observe(viewport);observer.observe(viewport);
  viewport.addEventListener("pointerdown",down);viewport.addEventListener("pointermove",move);viewport.addEventListener("pointerup",up);viewport.addEventListener("pointercancel",up);viewport.addEventListener("lostpointercapture",up);viewport.addEventListener("click",click,true);viewport.addEventListener("wheel",wheel,{passive:false});
  document.addEventListener("visibilitychange",visibility);media.addEventListener("change",visibility);resize();schedule();
  return()=>{savedPosition.current=position;stop();observer.disconnect();ro.disconnect();viewport.removeEventListener("pointerdown",down);viewport.removeEventListener("pointermove",move);viewport.removeEventListener("pointerup",up);viewport.removeEventListener("pointercancel",up);viewport.removeEventListener("lostpointercapture",up);viewport.removeEventListener("click",click,true);viewport.removeEventListener("wheel",wheel);document.removeEventListener("visibilitychange",visibility);media.removeEventListener("change",visibility);};
 },[paused]);
 return <section id="collaborations" className="border-y border-white/10 bg-[var(--brand-black)] py-7">
 <div className="mx-auto mb-4 flex max-w-7xl items-center justify-between gap-3 px-5 md:px-8"><h2 className="text-xs uppercase tracking-[.18em] text-white/70">{pl?"Wybrane współprace":"Selected collaborations"}</h2><button type="button" onClick={()=>setPaused(value=>!value)} aria-pressed={paused} className="text-xs text-white/60">{paused?(pl?"Wznów pasek":"Resume"):(pl?"Zatrzymaj pasek":"Pause")}</button></div>
 <div ref={ref} className="client-loop"><div ref={track} className="client-loop-track">{[0,1,2].map(copy=><div key={copy} className="client-loop-copy" aria-hidden={copy!==1?true:undefined}>{clients.map(client=>{
 const inner=client.logo?<Image src={client.logo} alt={client.name} width={240} height={client.name==="Jalapeno Kebab"?240:80} draggable={false} className={client.name==="Jalapeno Kebab"?"client-jalapeno-logo":"client-loop-logo"}/>:<span className="motomizer-wordmark">MOTOMIZER</span>;
 return client.url?<a key={client.name} draggable={false} className="client-wordmark" href={client.url} target="_blank" rel="noopener noreferrer" tabIndex={copy===1?0:-1} aria-label={client.name}>{inner}</a>:<div key={client.name} className="client-wordmark">{inner}</div>;
 })}</div>)}</div></div></section>;
}
