"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { wrapMarqueePosition } from "@/lib/marquee";
import { useLanguage } from "@/contexts/LanguageContext";

const clients = [
  {name:"Motomizer", detail:"motomizer.pl", url:"https://motomizer.pl", logo:null},
  {name:"Jalapeno Kebab", detail:"Niemce", url:"https://www.instagram.com/jalapeno_kebab/", logo:"/images/brands/jalapeno.jpg"},
  {name:"Re-energy System", detail:"OZE", url:"https://re-energysystem.pl/", logo:"/images/brands/re-energy.png"},
  {name:"StarCars", detail:"USA / Canada", url:"https://star-cars.us", logo:"/images/brands/starcars.svg"},
  {name:"Gentlemen Barber Shop", detail:"Warszawa", url:null, logo:"/images/brands/gentlemen.webp"},
  {name:"Majka Szado Walter", detail:"Rzeszów", url:"https://rzeszow-adwokat.pl/", logo:"/images/brands/msw.svg"},
];

export function ClientMarquee() {
  const {lang}=useLanguage();
  const pl=lang === "pl";
  const ref=useRef<HTMLDivElement>(null);
  const [paused,setPaused]=useState(false);
  const [reduced,setReduced]=useState(false);
  useEffect(()=>{const media=matchMedia('(prefers-reduced-motion: reduce)');const update=()=>setReduced(media.matches);update();media.addEventListener('change',update);return()=>media.removeEventListener('change',update);},[]);
  const moveRef = useRef<(direction: number) => void>(() => {});
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let span = el.scrollWidth / 3;
    let position = el.scrollLeft ? wrapMarqueePosition(el.scrollLeft, span) : span;
    let frame = 0, last = 0, pending = 0, holdUntil = 0;
    let hovered = false, dragging = false, visible = true;

    function write(value: number) {
      position = wrapMarqueePosition(value, span);
      el!.scrollLeft = position;
    }
    function stop() { cancelAnimationFrame(frame); frame = 0; last = 0; }
    function schedule() {
      if (!frame && visible && !document.hidden && ((!paused && !reduced) || pending !== 0)) {
        frame = requestAnimationFrame(tick);
      }
    }
    function tick(time: number) {
      frame = 0;
      if (!visible || document.hidden) { last = 0; return; }
      const elapsed = last ? Math.min(time - last, 40) : 16;
      last = time;
      if (pending !== 0) {
        const step = Math.abs(pending) < .5 ? pending : pending * (1 - Math.exp(-elapsed / 65));
        write(position + step);
        pending -= step;
        holdUntil = time + 1400;
      } else if (!paused && !reduced && !hovered && !dragging && !el!.contains(document.activeElement) && time >= holdUntil) {
        write(position - elapsed * .025);
      }
      schedule();
    }
    // Native touch/trackpad scrolling uses the same wrapping as autoplay/arrows.
    function syncScroll() {
      if (Math.abs(el!.scrollLeft - position) > 1.2) {
        pending = 0;
        write(el!.scrollLeft);
      }
    }
    function enter() { hovered = true; }
    function leave() { hovered = false; schedule(); }
    function pointerDown() { dragging = true; pending = 0; }
    function pointerUp() { dragging = false; holdUntil = performance.now() + 1400; schedule(); }
    function wheel() { pending = 0; holdUntil = performance.now() + 1400; }
    function visibilityChanged() { if (document.hidden) stop(); else schedule(); }
    function resize() { span = el!.scrollWidth / 3; write(position); }

    moveRef.current = (direction) => {
      if (reduced) write(position + direction * 300);
      else { pending += direction * 300; schedule(); }
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) schedule(); else stop();
    });
    const resizeObserver = new ResizeObserver(resize);
    observer.observe(el);
    resizeObserver.observe(el);
    el.addEventListener("scroll", syncScroll, { passive: true });
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointerleave", leave);
    el.addEventListener("pointerdown", pointerDown, { passive: true });
    el.addEventListener("wheel", wheel, { passive: true });
    window.addEventListener("pointerup", pointerUp);
    window.addEventListener("pointercancel", pointerUp);
    document.addEventListener("visibilitychange", visibilityChanged);
    write(position);
    schedule();
    return () => {
      stop();
      observer.disconnect();
      resizeObserver.disconnect();
      el.removeEventListener("scroll", syncScroll);
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointerleave", leave);
      el.removeEventListener("pointerdown", pointerDown);
      el.removeEventListener("wheel", wheel);
      window.removeEventListener("pointerup", pointerUp);
      window.removeEventListener("pointercancel", pointerUp);
      document.removeEventListener("visibilitychange", visibilityChanged);
      moveRef.current = () => {};
    };
  }, [paused, reduced]);
  function move(direction: number) { moveRef.current(direction); }
  return <section id="collaborations" aria-label={pl?'Przykładowe firmy, z którymi współpracuję':'Some of the businesses I work with'} className="border-y border-white/10 bg-[#101010] py-7">
    <div className="mx-auto mb-6 flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 md:px-8"><h2 className="max-w-sm text-xs leading-6 uppercase tracking-[0.16em] text-zinc-400">{pl?'Przykładowe firmy, z którymi współpracuję':'Some of the businesses I work with'}</h2><div className="flex shrink-0 gap-2">
      <button onClick={()=>move(-1)} aria-label={pl?'Poprzednie firmy':'Previous businesses'} className="glass-action marquee-button"><ArrowLeft size={16}/></button>
      {!reduced && <button onClick={()=>setPaused(!paused)} aria-label={paused?(pl?'Wznów przesuwanie':'Resume scrolling'):(pl?'Zatrzymaj przesuwanie':'Pause scrolling')} className="glass-action marquee-button">{paused?<Play size={14}/>:<Pause size={14}/>}</button>}
      <button onClick={()=>move(1)} aria-label={pl?'Następne firmy':'Next businesses'} className="glass-action marquee-button"><ArrowRight size={16}/></button>
    </div></div>
    <div ref={ref} className="client-marquee mx-auto max-w-[1440px] overflow-x-auto">
      <div className="flex w-max">{[0,1,2].map(copy=><div key={copy} className="flex shrink-0" aria-hidden={copy!==1?true:undefined}>{clients.map(client=>{
        const content=<><div className="flex h-20 items-center justify-center overflow-hidden">{client.logo ? <Image src={client.logo} alt={client.name} width={240} height={client.name === "Jalapeno Kebab" ? 240 : 80} className={client.name === "Jalapeno Kebab" ? "h-60 w-60 shrink-0 object-contain" : "h-16 w-48 object-contain"}/> : <span className="motomizer-wordmark">MOTOMIZER</span>}</div><p className="mt-4 text-center text-[10px] uppercase tracking-widest text-zinc-400">{client.name} / {client.detail}</p></>;
        return client.url?<a key={client.name} href={client.url} target="_blank" rel="noopener noreferrer" tabIndex={copy!==1?-1:0} className="client-wordmark">{content}</a>:<div key={client.name} className="client-wordmark">{content}</div>;
      })}</div>)}</div>
    </div>
  </section>;
}
