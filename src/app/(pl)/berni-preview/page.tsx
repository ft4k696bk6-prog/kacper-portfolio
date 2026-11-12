"use client";

import Image from "next/image";
import { useState } from "react";
import { BerniPremiumPortrait } from "@/components/BerniPremiumPortrait";
import { BerniReactionLab } from "@/components/BerniReactionLab";
import {
  BERNI_POSES, BERNI_POSE_LABELS, BERNI_POSE_MOOD,
  berniPoseUrl, type BerniPose,
} from "@/lib/berni-poses";
import type { BerniTransitionName } from "@/lib/berni-transition";

const transitions: { id: BerniTransitionName; label: string }[] = [
  { id: "dive", label: "Nurek" },
  { id: "tuck", label: "Schowanie" },
  { id: "drop", label: "Opadnięcie" },
  { id: "boomerang", label: "Bumerang" },
  { id: "swoop-left", label: "Ślizg w lewo" },
  { id: "swoop-right", label: "Ślizg w prawo" },
  { id: "orbit-left", label: "Orbita lewa" },
  { id: "orbit-right", label: "Orbita prawa" },
  { id: "micro-tornado", label: "Mini-tornado" },
  { id: "blur-twist", label: "Rozmyty obrót" },
  { id: "spiral", label: "Spirala" },
  { id: "pearl", label: "Zniknięcie" },
  { id: "zoom-pop", label: "Wyskoczenie" },
  { id: "whiplash", label: "Szybki zwrot" },
  { id: "side-arc", label: "Łuk boczny" },
  { id: "roll-in", label: "Przetoczenie" },
  { id: "flip-peek", label: "Przekręcenie" },
  { id: "bounce-swirl", label: "Wir i odbicie" },
];

export default function BerniPreview() {
  const [pose, setPose] = useState<BerniPose>("neutral");
  const [blinkToken, setBlinkToken] = useState(0);
  const [reactionToken, setReactionToken] = useState(0);
  const [transitionToken, setTransitionToken] = useState(0);
  const [transitionPreset, setTransitionPreset] = useState<BerniTransitionName | null>(null);
  const mood = BERNI_POSE_MOOD[pose];

  function selectPose(value: BerniPose) {
    setPose(value);
    setReactionToken(x => x + 1);
  }
  function testTransition(id: BerniTransitionName) {
    setTransitionPreset(id);
    setPose(previous => previous === "surprised" ? "laughing" : "surprised");
    setTransitionToken(t => t + 1);
  }

  return (
    <main className="min-h-screen bg-[#090b0e] px-4 pb-16 pt-36 text-white sm:pt-40">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs uppercase tracking-[.25em] text-white/50">BERNECKI.DEV / BERNI — PODGLĄD TESTOWY</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">Berni — interaktywny podgląd reakcji</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-white/65">
          Testuj zachowanie Berniego: dotknij postaci, wpisz wiadomość lub wybierz
          jedną z 48 reakcji. Poniżej jest też osobny techniczny test przejść.
          To wersja eksperymentalna — główna strona pozostaje bez zmian.
        </p>
        <BerniReactionLab />

        <details className="mt-9 rounded-3xl border border-white/10 bg-[#10141b] p-4 sm:p-6">
          <summary className="cursor-pointer text-sm font-semibold text-white/80">
            Rozwiń starszy renderer i techniczne testy 20 min / 18 przejść
          </summary>
        <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_290px]">
          <div className="relative flex min-h-[440px] flex-col items-center justify-center overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_50%_35%,#29313c,#0e1116_68%,#090b0e)] p-5">
            <BerniPremiumPortrait mood={mood} pose={pose} size={320} priority
              blinkToken={blinkToken} reactionToken={reactionToken}
              transitionToken={transitionToken} transitionPreset={transitionPreset} />
            <p className="mt-4 text-sm text-white/60">
              Stan: <strong className="text-white">{BERNI_POSE_LABELS[pose]}</strong>
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <button type="button" onClick={() => setReactionToken(x => x + 1)}
                className="rounded-full border border-white/20 px-4 py-2.5 text-xs text-white/80 hover:bg-white/10">
                Powtórz pętlę
              </button>
              <button type="button" onClick={() => setBlinkToken(x => x + 1)}
                className="rounded-full border border-white/30 bg-white/10 px-4 py-2.5 text-xs text-white hover:bg-white/20">
                Mrugnij teraz
              </button>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center rounded-[2rem] border border-white/10 bg-[#14171c] p-8">
            <p className="mb-5 text-sm font-medium">Rozmiar rzeczywistego dymka</p>
            <div className="grid h-14 w-14 place-items-center rounded-full border border-white/20 bg-[#15171a]">
              <BerniPremiumPortrait mood={mood} pose={pose} size={56} reactionToken={reactionToken} />
            </div>
            <p className="mt-6 text-center text-xs leading-6 text-white/55">
              Podgląd ikony asystenta w rozmiarze mobilnym. Strona produkcyjna pozostaje bez zmian.
            </p>
          </div>
        </div>

        <section className="mt-7 rounded-3xl border border-white/10 bg-[#14171c] p-5 sm:p-7">
          <h2 className="text-lg font-semibold">Przetestuj żywą mimikę</h2>
          <p className="mt-2 text-sm leading-6 text-white/60">
            Każda emocja jest animowana w pętli na jednym obrazie: bez przeskoków uszu, oczu ani słuchawek.
            Otwieranie pyska i mruganie nie uruchamia filmowego przejścia.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {([
              ["talk-small","Mówi"], ["laughing","Śmieje się"], ["happy","Uśmiecha się"],
              ["excited","Cieszy się"], ["neutral","Spokojny"], ["surprised","Zaskoczony"]
            ] as const).map(([value,label]) => (
              <button key={value} type="button" onClick={() => selectPose(value)}
                className={pose===value ? "rounded-full border border-white bg-white/15 px-4 py-2.5 text-xs" :
                  "rounded-full border border-white/20 px-4 py-2.5 text-xs text-white/80 hover:bg-white/10"}>
                {label}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-7 rounded-3xl border border-white/10 bg-[#14171c] p-5 sm:p-7">
          <h2 className="text-lg font-semibold">Wybierz jedną z 20 min</h2>
          <p className="mt-2 text-sm text-white/55">
            Wybierz dowolny portret. Zmiany są wyraźne — oczy, brwi, pysk i emocje różnią się naprawdę.
          </p>
          <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
            {BERNI_POSES.map(item => (
              <button type="button" key={item}
                onClick={() => selectPose(item)}
                aria-pressed={pose === item}
                className={pose === item
                  ? "overflow-hidden rounded-2xl border border-white bg-white/15 p-2 text-center"
                  : "overflow-hidden rounded-2xl border border-white/10 bg-black/25 p-2 text-center hover:border-white/45"}>
                <span className="relative mx-auto block aspect-square w-full">
                  <Image src={berniPoseUrl(item)} alt="" fill sizes="(max-width: 640px) 30vw, 150px"
                    className="object-contain" />
                </span>
                <span className="mt-2 block text-[11px] leading-4 text-white/85">{BERNI_POSE_LABELS[item]}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-7 rounded-3xl border border-white/10 bg-[#14171c] p-5 sm:p-7">
          <h2 className="text-lg font-semibold">18 filmowych przejść (opcjonalnie)</h2>
          <p className="mt-2 text-sm leading-6 text-white/55">
            Stara postać najpierw nurkuje, odlatuje lub znika. W środku przejścia
            nie ma żadnej głowy — dopiero potem wchodzi nowa. Przejścia mają historię,
            więc nie powinny powtarzać się co chwilę.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {transitions.map(item => (
              <button type="button" key={item.id} onClick={() => testTransition(item.id)}
                className="rounded-xl border border-white/15 px-3 py-3 text-xs text-white/80 transition hover:border-white/50 hover:bg-white/10">
                {item.label}
              </button>
            ))}
          </div>
        </section>
        </details>
      </div>
    </main>
  );
}
