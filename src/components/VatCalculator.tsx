"use client";

import { useMemo, useState } from "react";
import { ArrowLeftRight, Check, Copy } from "lucide-react";
import { calculateVat, formatVatCurrency, parseVatAmount, type VatDirection, type VatRate } from "@/lib/vat-calculator";

export function VatCalculator({ lang = "pl" }: { lang?: "pl" | "en" }) {
  const [direction, setDirection] = useState<VatDirection>("net-to-gross");
  const [rate, setRate] = useState<VatRate>(23);
  const [amount, setAmount] = useState("1000");
  const [copied, setCopied] = useState(false);
  const cents = useMemo(() => parseVatAmount(amount), [amount]);
  const totals = cents === null ? null : calculateVat(cents, rate, direction);
  const pl = lang === "pl";
  const format = (cents: number) => formatVatCurrency(cents, lang);
  const labels = {
    net: pl ? "Cena netto" : "Net price",
    gross: pl ? "Cena brutto" : "Gross price",
    tax: pl ? "Kwota VAT" : "VAT amount",
  };
  const copyResult = async () => {
    if (!totals) return;
    const result = [
      `${labels.net}: ${format(totals.netCents)}`,
      `VAT ${rate}%: ${format(totals.taxCents)}`,
      `${labels.gross}: ${format(totals.grossCents)}`,
    ].join("\n");
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };
  const changeDirection = () => {
    // Preserve the numerical amount when reversing the calculation, rather than
    // unexpectedly filling in an old result.
    setDirection(current => current === "net-to-gross" ? "gross-to-net" : "net-to-gross");
    setCopied(false);
  };
  return (
    <section aria-label={pl ? "Kalkulator VAT netto brutto" : "VAT net gross calculator"}
      className="mx-auto max-w-5xl rounded-2xl border border-white/15 bg-[#111111] p-5 shadow-[0_25px_80px_#0005] sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[.18em] text-white/45">{pl ? "Obliczenia na żywo" : "Instant results"}</p>
          <h2 className="mt-2 text-xl font-medium text-white sm:text-2xl">{pl ? "Przelicz cenę i VAT" : "Calculate price and VAT"}</h2>
        </div>
        <span className="rounded-full border border-white/15 px-3 py-2 text-xs text-white/60">{pl ? "Bez logowania · PLN" : "No sign-up · PLN"}</span>
      </div>
      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,.95fr)]">
        <div className="space-y-6">
          <fieldset>
            <legend className="mb-2 text-sm font-medium text-white/85">{pl ? "Kierunek przeliczenia" : "Conversion direction"}</legend>
            <div className="grid grid-cols-2 gap-2">
              {([
                ["net-to-gross", pl ? "Netto → brutto" : "Net → gross"],
                ["gross-to-net", pl ? "Brutto → netto" : "Gross → net"],
              ] as const).map(([value, title]) =>
                <button key={value} type="button" aria-pressed={direction === value}
                  onClick={() => { setDirection(value); setCopied(false); }}
                  className={`min-h-12 rounded-xl border px-3 py-3 text-sm font-medium transition-colors ${direction === value ? "border-white/80 bg-white text-black" : "border-white/20 bg-[#191919] text-white/75 hover:border-white/50"}`}>
                  {title}
                </button>
              )}
            </div>
          </fieldset>
          <fieldset>
            <legend className="mb-2 text-sm font-medium text-white/85">{pl ? "Stawka VAT" : "VAT rate"}</legend>
            <div className="grid grid-cols-2 gap-2">
              {([8, 23] as const).map(value =>
                <button key={value} type="button" aria-pressed={rate === value}
                  onClick={() => { setRate(value); setCopied(false); }}
                  className={`min-h-12 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${rate === value ? "border-white/80 bg-white text-black" : "border-white/20 bg-[#191919] text-white/75 hover:border-white/50"}`}>
                  {value}% VAT
                </button>
              )}
            </div>
          </fieldset>
          <div>
            <label htmlFor="vat-calculator-input" className="mb-2 block text-sm font-medium text-white/85">
              {direction === "net-to-gross" ? labels.net : labels.gross} (PLN)
            </label>
            <div className="flex items-center rounded-xl border border-white/25 bg-[#090909] focus-within:border-white/65">
              <input id="vat-calculator-input" data-testid="vat-amount-input" type="text" inputMode="decimal"
                autoComplete="off" value={amount} onChange={event => { setAmount(event.target.value); setCopied(false); }}
                placeholder={pl ? "np. 1 234,56" : "e.g. 1234.56"}
                aria-invalid={amount.trim() !== "" && cents === null}
                className="min-w-0 w-full bg-transparent px-4 py-4 text-xl tabular-nums text-white outline-none placeholder:text-white/30"
              />
              <span className="shrink-0 px-4 text-sm font-medium text-white/45">PLN</span>
            </div>
            <p className="mt-2 text-xs text-white/50">
              {pl ? "Wpisz kwotę z przecinkiem lub kropką, np. 1234,56. Wynik przelicza się automatycznie." :
                "Enter an amount with a comma or dot, e.g. 1234.56. Results update instantly."}
            </p>
            {amount.trim() !== "" && cents === null ?
              <p role="alert" className="mt-2 text-sm text-amber-200/90">{pl ? "Podaj poprawną, nieujemną kwotę." : "Enter a valid non-negative amount."}</p>
              : null}
          </div>
          <button type="button" onClick={changeDirection}
            className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-4 py-2 text-sm text-white/75 transition hover:border-white/50 hover:text-white">
            <ArrowLeftRight size={16} /> {pl ? "Odwróć kierunek" : "Reverse calculation"}
          </button>
        </div>

        <div aria-live="polite" className="flex flex-col rounded-2xl border border-white/15 bg-gradient-to-b from-[#242424] to-[#151515] p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-medium uppercase tracking-[.15em] text-white/55">{pl ? "Wynik" : "Result"}</p>
            <span className="text-xs text-white/40">VAT {rate}%</span>
          </div>
          <div className="mt-6 flex-1 space-y-5">
            {([
              ["net", totals?.netCents],
              ["tax", totals?.taxCents],
              ["gross", totals?.grossCents],
            ] as const).map(([key, value]) =>
              <div key={key} className={`border-b border-white/10 pb-4 last:border-b-0 ${key === (direction === "net-to-gross" ? "gross" : "net") ? "text-white" : "text-white/80"}`}>
                <p className="mb-1 text-sm text-white/55">{key === "tax" ? `VAT ${rate}%` : labels[key]}</p>
                <p className={`break-words font-semibold tabular-nums tracking-tight ${key === (direction === "net-to-gross" ? "gross" : "net") ? "text-3xl sm:text-4xl" : "text-2xl"}`}
                  data-testid={`vat-result-${key}`}>{value === undefined ? "—" : format(value)}</p>
              </div>
            )}
          </div>
          <button type="button" onClick={() => { void copyResult(); }} disabled={!totals}
            className="mt-3 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#ededed] px-5 text-sm font-semibold text-black transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40">
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? (pl ? "Skopiowano" : "Copied") : (pl ? "Kopiuj wynik" : "Copy result")}
          </button>
        </div>
      </div>
      <p className="mt-6 text-xs leading-relaxed text-white/45">
        {pl
          ? "Wynik matematyczny z zaokrągleniem do 1 grosza. Kalkulator nie rozstrzyga, czy do danej usługi lub towaru prawidłowo stosuje się 8% czy 23% VAT."
          : "Mathematical result rounded to the nearest grosz. This calculator does not determine whether an item or service qualifies for the 8% or 23% VAT rate."}
      </p>
    </section>
  );
}
