"use client";
import { useEffect, useRef } from "react";
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
  { name:"Majka Szado Walter", detail:"Rzeszów", url:null, logo:"/images/brands/msw.svg" },
];



export function ClientMarquee(){
 const {lang}=useLanguage();const pl=lang==="pl";
 const viewportRef=useRef<HTMLDivElement>(null),trackRef=useRef<HTMLDivElement>(null);
 const savedPosition=useRef(0);
 useEffect(()=>{
  const viewport=viewportRef.current,track=trackRef.current;if(!viewport||!track)return;
  const media=matchMedia("(prefers-reduced-motion: reduce)");
  let position=savedPosition.current,span=0,frame=0,last=0,visible=true,interactedAt=0;
  let mouse:null|{id:number,lastX:number,startX:number,moved:boolean}=null;
  let touch:null|{startX:number,startY:number,lastX:number,moved:boolean,vertical:boolean}=null;
  let blockNextClick=false;
  const draw=()=>{position=wrapMarqueePosition(position,span);track.style.transform="translate3d("+(-position)+"px,0,0)"};
  const measure=()=>{span=(track.firstElementChild as HTMLElement).offsetWidth;draw()};
  const stop=()=>{if(frame)cancelAnimationFrame(frame);frame=0;last=0};
  const schedule=()=>{if(!frame&&!document.hidden&&visible&&!media.matches)frame=requestAnimationFrame(tick)};
  const tick=(time:number)=>{
   frame=0;if(document.hidden||!visible)return;
   const dt=last?Math.min(time-last,50):0;last=time;
   if(!mouse&&!touch&&time-interactedAt>700){position+=dt*.035;draw()}
   schedule();
  };
  const mark=()=>{interactedAt=performance.now();viewport.dataset.dragging="true"};
  const release=()=>{delete viewport.dataset.dragging};
  const down=(e:PointerEvent)=>{
   if(e.pointerType!=="mouse"||e.button!==0)return;
   blockNextClick=false;mouse={id:e.pointerId,lastX:e.clientX,startX:e.clientX,moved:false};
  };
  const move=(e:PointerEvent)=>{
   if(!mouse||mouse.id!==e.pointerId)return;
   if(!mouse.moved&&Math.abs(e.clientX-mouse.startX)>6){
    mouse.moved=true;blockNextClick=true;mark();viewport.setPointerCapture(e.pointerId);
   }
   if(mouse.moved){e.preventDefault();position-=e.clientX-mouse.lastX;draw();mark()}
   mouse.lastX=e.clientX;
  };
  const up=()=>{if(mouse?.moved)interactedAt=performance.now();mouse=null;release()};
  const touchDown=(e:TouchEvent)=>{
   if(e.touches.length!==1)return;
   const p=e.touches[0];touch={startX:p.clientX,startY:p.clientY,lastX:p.clientX,moved:false,vertical:false};blockNextClick=false;
  };
  const touchMove=(e:TouchEvent)=>{
   if(!touch||e.touches.length!==1)return;
   const p=e.touches[0],dx=p.clientX-touch.startX,dy=p.clientY-touch.startY;
   if(!touch.moved&&!touch.vertical){
    if(Math.abs(dy)>8&&Math.abs(dy)>Math.abs(dx))touch.vertical=true;
    else if(Math.abs(dx)>8&&Math.abs(dx)>Math.abs(dy)*1.1){touch.moved=true;blockNextClick=true;mark()}
   }
   if(touch.moved){
    if(e.cancelable)e.preventDefault();
    position-=p.clientX-touch.lastX;draw();mark();
   }
   touch.lastX=p.clientX;
  };
  const touchUp=()=>{if(touch?.moved)interactedAt=performance.now();touch=null;release()};
  const click=(e:MouseEvent)=>{if(blockNextClick){e.preventDefault();e.stopPropagation();blockNextClick=false}};
  const wheel=(e:WheelEvent)=>{
   if(Math.abs(e.deltaX)>Math.abs(e.deltaY)||e.shiftKey){
    e.preventDefault();position+=e.shiftKey?e.deltaY:e.deltaX;draw();interactedAt=performance.now();
   }
  };
  const visibility=()=>{stop();schedule()};
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;visibility()});
  const resize=new ResizeObserver(measure);resize.observe(viewport);observer.observe(viewport);
  viewport.addEventListener("pointerdown",down);viewport.addEventListener("pointermove",move);
  viewport.addEventListener("pointerup",up);viewport.addEventListener("pointercancel",up);viewport.addEventListener("lostpointercapture",up);
  viewport.addEventListener("touchstart",touchDown,{passive:true});viewport.addEventListener("touchmove",touchMove,{passive:false});
  viewport.addEventListener("touchend",touchUp);viewport.addEventListener("touchcancel",touchUp);
  viewport.addEventListener("click",click,true);viewport.addEventListener("wheel",wheel,{passive:false});
  document.addEventListener("visibilitychange",visibility);media.addEventListener("change",visibility);
  measure();schedule();
  return()=>{
   savedPosition.current=position;stop();observer.disconnect();resize.disconnect();
   viewport.removeEventListener("pointerdown",down);viewport.removeEventListener("pointermove",move);
   viewport.removeEventListener("pointerup",up);viewport.removeEventListener("pointercancel",up);viewport.removeEventListener("lostpointercapture",up);
   viewport.removeEventListener("touchstart",touchDown);viewport.removeEventListener("touchmove",touchMove);
   viewport.removeEventListener("touchend",touchUp);viewport.removeEventListener("touchcancel",touchUp);
   viewport.removeEventListener("click",click,true);viewport.removeEventListener("wheel",wheel);
   document.removeEventListener("visibilitychange",visibility);media.removeEventListener("change",visibility);
  };
 },[]);
 return <section id="collaborations" className="border-y border-white/10 bg-[var(--brand-black)] py-7">
  <div className="mx-auto mb-4 flex max-w-7xl items-center justify-between gap-3 px-5 md:px-8">
   <h2 className="text-xs uppercase tracking-[.18em] text-white/70">{pl?"Wybrane współprace":"Selected collaborations"}</h2>
  </div>
  <div ref={viewportRef} className="client-loop" aria-label={pl?"Logotypy firm — przeciągnij w lewo lub prawo":"Company logos — swipe left or right"}>
   <div ref={trackRef} className="client-loop-track">{[0,1,2].map(copy=>
    <div key={copy} className="client-loop-copy" aria-hidden={copy!==1?true:undefined}>
     {clients.map(client=>{
      const inner=client.logo?<Image src={client.logo} alt={client.name} width={240} height={client.name==="Jalapeno Kebab"?240:80} draggable={false} className={client.name==="Jalapeno Kebab"?"client-jalapeno-logo":"client-loop-logo"}/>:<span className="motomizer-wordmark">MOTOMIZER</span>;
      return client.url?<a key={client.name} draggable={false} className="client-wordmark" href={client.url} target="_blank" rel="noopener noreferrer" tabIndex={copy===1?0:-1} aria-label={client.name}>{inner}</a>:<div key={client.name} className="client-wordmark">{inner}</div>;
     })}
    </div>
   )}</div>
  </div>
 </section>;
}
