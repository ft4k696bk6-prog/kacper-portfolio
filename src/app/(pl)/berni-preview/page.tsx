"use client";

import { useState } from "react";
import { BerniPremiumPortrait, type BerniPortraitMood } from "@/components/BerniPremiumPortrait";

const moods: { value: BerniPortraitMood; pl: string; en: string }[] = [
  { value: "idle", pl: "Spokojny", en: "Idle" },
  { value: "curious", pl: "Ciekawski", en: "Curious" },
  { value: "thinking", pl: "Myśli", en: "Thinking" },
  { value: "happy", pl: "Zadowolony", en: "Happy" },
  { value: "excited", pl: "Podekscytowany", en: "Excited" },
  { value: "sleeping", pl: "Odpoczywa", en: "Resting" },
  { value: "typing", pl: "Odpowiada", en: "Answering" },
  { value: "surprised", pl: "Zaskoczony", en: "Surprised" },
  { value: "worried", pl: "Zmartwiony", en: "Worried" },
];

export default function BerniPreview() {
  const [mood, setMood] = useState<BerniPortraitMood>("idle");
  const [replay, setReplay] = useState(0);
  return (
    <main className="min-h-screen bg-[#090b0e] px-4 py-16 text-white">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs uppercase tracking-[.3em] text-white/50">BERNECKI.DEV / PROTOTYP 2.5D</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Berni — nowy asystent AI</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-white/60">
          Teraz używamy prawdziwej szczegółowej grafiki pod kątem 3/4 — z obiema słuchawkami i dwoma oznaczeniami B.
          Bez schematycznego SVG. Zmieniaj reakcje, żeby ocenić płynność i czytelność postaci na telefonie.
        </p>
        <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_290px]">
          <div className="relative flex min-h-[410px] flex-col items-center justify-center overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_50%_35%,#29313c,#0e1116_68%,#090b0e)] p-5">
            <div key={replay}><BerniPremiumPortrait mood={mood} size={320} priority /></div>
            <p className="mt-4 text-sm text-white/60">Stan: <strong className="text-white">{mood}</strong></p>
            <button type="button" onClick={() => setReplay(x => x + 1)}
              className="mt-4 rounded-full border border-white/15 px-4 py-2 text-xs text-white/70 hover:bg-white/10">
              Odtwórz animację
            </button>
          </div>
          <div className="flex flex-col items-center justify-center rounded-[2rem] border border-white/10 bg-[#14171c] p-8">
            <p className="mb-5 text-sm font-medium">Rozmiar rzeczywistego dymka</p>
            <div className="grid h-14 w-14 place-items-center rounded-full border border-white/20 bg-[#15171a]">
              <BerniPremiumPortrait mood={mood} size={56} />
            </div>
            <p className="mt-6 text-center text-xs leading-6 text-white/55">
              Podgląd tego, co użytkownik zobaczy na bernecki.dev.
            </p>
          </div>
        </div>
        <section className="mt-7 rounded-3xl border border-white/10 bg-[#14171c] p-6">
          <h2 className="text-lg font-semibold">Animacje i stany rozmowy</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {moods.map(item => (
              <button type="button" key={item.value} onClick={() => setMood(item.value)}
                aria-pressed={mood === item.value}
                className={mood === item.value
                  ? "rounded-full border border-white bg-white px-3 py-2 text-xs font-medium text-black"
                  : "rounded-full border border-white/15 px-3 py-2 text-xs text-white/70 hover:border-white/50"}>
                {item.pl}
              </button>
            ))}
          </div>
          <p className="mt-5 text-xs leading-6 text-white/50">
            Ten prototyp animuje całą renderowaną głowę. Mimika poszczególnych oczu i pyska
            oraz przebrania wymagają osobnych, dopasowanych stylistycznie warstw 3D.
            Nie nakładamy na dopracowaną ilustrację tanich kształtów ani naklejek.
          </p>
        </section>
      </div>
    </main>
  );
}
