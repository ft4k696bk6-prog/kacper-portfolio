"use client";
import { useState } from "react";
import { BerniFoxHead, type BerniFoxMood, type BerniFoxAccessory } from "@/components/BerniFoxHead";

const moods: {value: BerniFoxMood; pl: string; en: string}[] = [
 {value:"idle",pl:"Spokojny",en:"Idle"},
 {value:"curious",pl:"Ciekawski",en:"Curious"},
 {value:"thinking",pl:"Myśli",en:"Thinking"},
 {value:"happy",pl:"Zadowolony",en:"Happy"},
 {value:"excited",pl:"Podekscytowany",en:"Excited"},
 {value:"sleeping",pl:"Śpi",en:"Sleeping"},
 {value:"typing",pl:"Odpowiada",en:"Typing"},
 {value:"surprised",pl:"Zaskoczony",en:"Surprised"},
 {value:"worried",pl:"Zmartwiony",en:"Worried"},
];
const accessories: {value: BerniFoxAccessory; label: string}[] = [
 {value:"none",label:"Bez dodatków"},
 {value:"santa",label:"Mikołaj"},
 {value:"elf",label:"Elf"},
 {value:"alien",label:"Kosmita"},
 {value:"glasses",label:"Okulary"},
 {value:"crown",label:"Korona"},
 {value:"cap",label:"Czapka B"},
];
export default function BerniPreview() {
 const [mood,setMood]=useState<BerniFoxMood>("idle");
 const [accessory,setAccessory]=useState<BerniFoxAccessory>("none");
 const [replay,setReplay]=useState(0);
 return <main className="min-h-screen bg-[#090b0e] px-4 py-16 text-white">
  <div className="mx-auto max-w-5xl">
   <p className="text-xs uppercase tracking-[.35em] text-white/50">BERNECKI.DEV / WERSJA TESTOWA</p>
   <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Berni — nowa maskotka AI</h1>
   <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">Jedna, warstwowa głowa liska. Wybierz emocję lub przebranie. Ruchy są wykonywane przez kod, a nie przez odtwarzanie GIF-ów. Ten ekran nie zmienia wersji produkcyjnej.</p>
   <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_290px]">
    <div className="relative flex min-h-[380px] flex-col items-center justify-center overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_50%_30%,#343b46,#101319_62%,#090b0e)] p-7">
     <div key={replay} className="drop-shadow-[0_18px_35px_rgba(0,0,0,.55)]"><BerniFoxHead mood={mood} accessory={accessory} size={280}/></div>
     <p className="mt-6 text-sm text-white/60">Aktualny stan: <strong className="text-white">{mood}</strong> · {accessory}</p>
     <button type="button" onClick={()=>setReplay(x=>x+1)} className="mt-4 rounded-full border border-white/15 px-4 py-2 text-xs text-white/70 hover:bg-white/10">Odtwórz animację od początku</button>
    </div>
    <div className="flex flex-col items-center justify-center rounded-[2rem] border border-white/10 bg-[#14171c] p-8">
      <p className="mb-5 text-sm font-medium">Rzeczywisty rozmiar dymka</p>
      <div className="grid h-14 w-14 place-items-center rounded-full border border-white/20 bg-[#15171a]"><BerniFoxHead mood={mood} accessory={accessory} size={56}/></div>
      <p className="mt-6 text-center text-xs leading-6 text-white/55">Tak maskotka będzie widoczna w prawym dolnym rogu strony.</p>
    </div>
   </div>
   <section className="mt-8 grid gap-5 md:grid-cols-2">
    <div className="rounded-3xl border border-white/10 bg-[#14171c] p-5">
      <h2 className="text-lg font-semibold">Emocje</h2>
      <div className="mt-4 flex flex-wrap gap-2">{moods.map(item=><button type="button" key={item.value} onClick={()=>setMood(item.value)} aria-pressed={mood===item.value} className={mood===item.value?"rounded-full border border-white bg-white px-3 py-2 text-xs font-medium text-black":"rounded-full border border-white/15 px-3 py-2 text-xs text-white/70 hover:border-white/50"}>{item.pl}</button>)}</div>
    </div>
    <div className="rounded-3xl border border-white/10 bg-[#14171c] p-5">
      <h2 className="text-lg font-semibold">Nakładane dodatki</h2>
      <div className="mt-4 flex flex-wrap gap-2">{accessories.map(item=><button type="button" key={item.value} onClick={()=>setAccessory(item.value)} aria-pressed={accessory===item.value} className={accessory===item.value?"rounded-full border border-white bg-white px-3 py-2 text-xs font-medium text-black":"rounded-full border border-white/15 px-3 py-2 text-xs text-white/70 hover:border-white/50"}>{item.label}</button>)}</div>
    </div>
   </section>
  </div>
 </main>;
}
