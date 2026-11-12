"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

function money(amount: number) {
  if (!Number.isFinite(amount)) return "—";
  return new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN", maximumFractionDigits: 2 }).format(amount);
}
function count(value: number) {
  return Number.isFinite(value) ? new Intl.NumberFormat("pl-PL", { maximumFractionDigits: 1 }).format(value) : "—";
}
type NumericInputProps = {
  label: string; hint: string; value: number; min: number; max: number; step: number;
  setValue: (value: number) => void; unit: string;
};
function NumericInput({ label, hint, value, min, max, step, setValue, unit }: NumericInputProps) {
  return (
    <label className="block rounded-2xl border border-white/10 bg-white/[0.035] p-5">
      <span className="block font-semibold">{label}</span>
      <span className="mt-1 block text-sm leading-6 text-white/55">{hint}</span>
      <span className="mt-4 flex items-center gap-3">
        <input
          type="number" min={min} max={max} step={step} value={value}
          onChange={(event) => {
            const parsed = Number(event.target.value);
            setValue(Number.isFinite(parsed) ? Math.max(min, Math.min(max, parsed)) : min);
          }}
          className="min-w-0 flex-1 rounded-xl border border-white/20 bg-black/40 px-4 py-3 text-base font-semibold text-white outline-none focus:border-white/70"
        />
        <span className="w-10 text-sm text-white/55">{unit}</span>
      </span>
    </label>
  );
}

export function GoogleAdsBudgetCalculator() {
  const [budget, setBudget] = useState(1500);
  const [cpc, setCpc] = useState(5);
  const [conversion, setConversion] = useState(4);
  const [saleRate, setSaleRate] = useState(10);
  const [management, setManagement] = useState(0);
  const [margin, setMargin] = useState(0);

  const model = useMemo(() => {
    const clicks = cpc > 0 ? budget / cpc : 0;
    const leads = clicks * conversion / 100;
    const customers = leads * saleRate / 100;
    const total = budget + management;
    const cpl = leads > 0 ? total / leads : NaN;
    const cac = customers > 0 ? total / customers : NaN;
    const profit = margin * customers - total;
    const breakEven = margin > 0 && saleRate > 0 && conversion > 0 ? total / margin : NaN;
    return { clicks, leads, customers, total, cpl, cac, profit, breakEven };
  }, [budget, cpc, conversion, saleRate, management, margin]);

  return (
    <div className="mt-10">
      <div className="grid gap-4 md:grid-cols-2">
        <NumericInput label="Budżet na reklamy" hint="Kwota na kliknięcia, bez wynagrodzenia za obsługę." value={budget} min={0} max={10000000} step={100} setValue={setBudget} unit="zł" />
        <NumericInput label="Średni koszt kliknięcia (CPC)" hint="Założenie do symulacji, nie średnia rynkowa." value={cpc} min={0.01} max={100000} step={0.5} setValue={setCpc} unit="zł" />
        <NumericInput label="Konwersja kliknięcia w leada" hint="Jaki procent klikających wysyła formularz lub wykonuje wartościowy kontakt?" value={conversion} min={0} max={100} step={0.5} setValue={setConversion} unit="%" />
        <NumericInput label="Zamiana leada w klienta" hint="Jaki procent leadów kończy się zakupem według danych Twojej firmy?" value={saleRate} min={0} max={100} step={1} setValue={setSaleRate} unit="%" />
        <NumericInput label="Miesięczny koszt obsługi" hint="Opcjonalnie: wynagrodzenie za prowadzenie kampanii i inne stałe koszty." value={management} min={0} max={10000000} step={100} setValue={setManagement} unit="zł" />
        <NumericInput label="Średnia marża na kliencie" hint="Opcjonalnie: szacowana marża brutto z jednego pozyskanego klienta, a nie przychód." value={margin} min={0} max={10000000} step={100} setValue={setMargin} unit="zł" />
      </div>
      <section className="mt-8 rounded-3xl border border-white/15 bg-white/[0.05] p-6 md:p-9" aria-live="polite">
        <h2 className="text-2xl font-semibold">Wynik symulacji</h2>
        <p className="mt-3 leading-7 text-white/60">
          To obliczenia matematyczne na podstawie Twoich parametrów. Nie przewidują rzeczywistych stawek, liczby klientów ani wyników Google Ads.
        </p>
        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["Szacowane kliknięcia", count(model.clicks)],
            ["Szacowane leady", count(model.leads)],
            ["Szacowani klienci", count(model.customers)],
            ["Koszt łączny (reklamy + obsługa)", money(model.total)],
            ["Koszt pozyskania leada (CPL)", money(model.cpl)],
            ["Koszt pozyskania klienta (CAC)", money(model.cac)],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-black/25 p-5">
              <span className="block text-sm text-white/60">{label}</span>
              <strong className="mt-2 block text-2xl">{value}</strong>
            </div>
          ))}
        </div>
        {margin > 0 && (
          <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-6">
            <h3 className="font-semibold">Scenariusz przy wskazanej marży</h3>
            <p className="mt-2 text-white/70">
              Hipotetyczna marża po kosztach reklamy i obsługi: <strong className="text-white">{money(model.profit)}</strong>.
              Liczba klientów potrzebnych do pokrycia tych kosztów: <strong className="text-white">{count(model.breakEven)}</strong>.
            </p>
            <p className="mt-2 text-sm text-white/55">Nie uwzględnia pozostałych kosztów firmy, podatków i niepewności rzeczywistych wyników.</p>
          </div>
        )}
      </section>
      <section className="mt-10 rounded-2xl border border-white/10 p-7">
        <h2 className="text-xl font-semibold">Jak to liczymy?</h2>
        <ul className="mt-5 space-y-3 leading-7 text-white/65">
          <li>• Kliknięcia = budżet reklamowy ÷ średni CPC.</li>
          <li>• Leady = kliknięcia × procent konwersji strony.</li>
          <li>• Klienci = leady × procent zamkniętych transakcji.</li>
          <li>• CPL i CAC = reklama + obsługa, odpowiednio ÷ leady i ÷ klientów.</li>
        </ul>
        <p className="mt-6 text-sm leading-6 text-white/55">
          Kalkulator działa w przeglądarce. Nie wymaga konta ani karty płatniczej i nie wysyła wpisanych liczb do serwera.
        </p>
        <Link href="/google-ads-dla-firm" className="mt-6 inline-block font-semibold underline underline-offset-4">Zobacz ofertę kampanii Google Ads</Link>
      </section>
    </div>
  );
}
