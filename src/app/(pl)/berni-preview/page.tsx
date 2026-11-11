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
  const [blinkToken, setBlinkToken] = useState(0);
  const [reactionToken, setReactionToken] = useState(0);
  return (
    <main className="min-h-screen bg-[#090b0e] px-4 pb-16 pt-36 text-white sm:pt-40">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs uppercase tracking-[.3em] text-white/50">BERNECKI.DEV / PŁYNNA MIMIKA 2.5D</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Berni — nowy asystent AI</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-white/60">
          Każdy stan używa pełnego portretu z tej samej ilustracji. Mruganie nie uruchamia efektów przejścia. Kliknij stany, sprawdź płynność, a na telefonie dotykaj ekranu — Berni spojrzy w stronę dotknięcia.
        </p>
        <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_290px]">
          <div className="relative flex min-h-[410px] flex-col items-center justify-center overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_50%_35%,#29313c,#0e1116_68%,#090b0e)] p-5">
            <BerniPremiumPortrait mood={mood} size={320} priority blinkToken={blinkToken} reactionToken={reactionToken} />
            <p className="mt-4 text-sm text-white/60">Stan: <strong className="text-white">{mood}</strong></p>
            <button type="button" onClick={() => setReactionToken(x => x + 1)}
              className="mt-4 rounded-full border border-white/15 px-4 py-2 text-xs text-white/70 hover:bg-white/10">
              Uruchom ponownie
            </button>
            <button type="button" onClick={() => setBlinkToken(x => x + 1)}
              className="mt-3 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs text-white hover:bg-white/20">
              Mrugnij teraz
            </button>
          </div>
          <div className="flex flex-col items-center justify-center rounded-[2rem] border border-white/10 bg-[#14171c] p-8">
            <p className="mb-5 text-sm font-medium">Rozmiar rzeczywistego dymka</p>
            <div className="grid h-14 w-14 place-items-center rounded-full border border-white/20 bg-[#15171a]">
              <BerniPremiumPortrait mood={mood} size={56} reactionToken={reactionToken} />
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
              <button type="button" key={item.value} onClick={() => { setMood(item.value); setReactionToken(x => x + 1); }}
                aria-pressed={mood === item.value}
                className={mood === item.value
                  ? "rounded-full border border-white bg-white px-3 py-2 text-xs font-medium text-black"
                  : "rounded-full border border-white/15 px-3 py-2 text-xs text-white/70 hover:border-white/50"}>
                {item.pl}
              </button>
            ))}
          </div>
          <p className="mt-5 text-xs leading-6 text-white/50">
            Pełne portrety mają identyczny kolor i obrys głowy. Do większej zmiany miny Berni używa jednego z 18 efektów: nurek, zwrot, blur, spirala, mini-tornado i inne. Podmiana następuje dopiero, gdy głowa jest ukryta w ruchu. Efekty mają historię i ograniczenie powtórek. Zwykłe spojrzenie, mrugnięcie i myślenie nie uruchamiają efektu specjalnego.
          </p>
        </section>
      </div>
    </main>
  );
}
