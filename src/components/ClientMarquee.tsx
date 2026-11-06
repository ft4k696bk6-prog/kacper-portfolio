"use client";
import { useRef } from "react";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";

const clients = [
  { name:"Motomizer", detail:"motomizer.pl", url:"https://motomizer.pl", logo:null },
  { name:"Jalapeno Kebab", detail:"Niemce", url:"https://www.instagram.com/jalapeno_kebab/", logo:"/images/brands/jalapeno.jpg" },
  { name:"Re-energy System", detail:"OZE", url:"https://re-energysystem.pl/", logo:"/images/brands/re-energy.png" },
  { name:"StarCars", detail:"USA / Canada", url:"https://star-cars.us", logo:"/images/brands/starcars.svg" },
  { name:"Gentlemen Barber Shop", detail:"Warszawa", url:null, logo:"/images/brands/gentlemen.webp" },
  { name:"Majka Szado Walter", detail:"Rzeszów", url:"https://rzeszow-adwokat.pl/", logo:"/images/brands/msw.svg" },
];

export function ClientMarquee() {
  const { lang } = useLanguage();
  const pl = lang === "pl";
  const list = useRef<HTMLDivElement>(null);
  const drag = useRef<{x:number;scroll:number;active:boolean}|null>(null);
  const suppressClick = useRef(false);
  return <section id="collaborations" aria-label={pl ? "Firmy, z którymi współpracuję" : "Businesses I work with"} className="border-y border-white/10 bg-[var(--brand-black)] py-7">
    <div className="mx-auto mb-4 flex max-w-7xl items-center justify-between gap-3 px-5 md:px-8">
      <h2 className="text-xs uppercase tracking-[.18em] text-white/70">{pl ? "Wybrane współprace" : "Selected collaborations"}</h2>
      <span className="text-[11px] text-white/50">{pl ? "Przesuń, aby zobaczyć więcej" : "Drag to explore"}</span>
    </div>
    <div ref={list} className="client-marquee mx-auto flex max-w-7xl" onPointerDown={e => {
      if (e.pointerType !== "mouse") return;
      drag.current = { x:e.clientX, scroll:list.current?.scrollLeft ?? 0, active:false };
      suppressClick.current = false;
    }} onPointerMove={e => {
      const d=drag.current;
      if (!d || e.pointerType !== "mouse" || !list.current) return;
      if (Math.abs(e.clientX-d.x) > 4) {d.active=true;suppressClick.current=true;list.current.classList.add("is-dragging");}
      if (d.active) {list.current.scrollLeft=d.scroll-(e.clientX-d.x);}
    }} onPointerUp={() => {drag.current=null;list.current?.classList.remove("is-dragging")}} onPointerLeave={() => {drag.current=null;list.current?.classList.remove("is-dragging")}} onClickCapture={e => {if(suppressClick.current){e.preventDefault();e.stopPropagation();suppressClick.current=false;}}}>
      {clients.map((client) => {
        const inner=<>
          {client.logo ? <Image src={client.logo} alt={client.name} width={200} height={65} draggable={false} className="max-h-[50px] w-auto max-w-[170px] object-contain" /> : <span className="motomizer-wordmark">{client.name.toUpperCase()}</span>}
        </>;
        return client.url
          ? <a key={client.name} href={client.url} target="_blank" rel="noopener noreferrer" className="client-wordmark" aria-label={client.name}>{inner}</a>
          : <div key={client.name} className="client-wordmark" aria-label={client.name}>{inner}</div>;
      })}
    </div>
  </section>;
}
