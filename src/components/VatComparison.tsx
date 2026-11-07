"use client";

import { useState } from "react";

type Basis = "gross" | "net";
type Lang = "pl" | "en";
type Amount = {net:number;gross:number;vat:number};
const money = (value:number,lang:Lang) => new Intl.NumberFormat(lang==="pl"?"pl-PL":"en-GB",{
  minimumFractionDigits:2,maximumFractionDigits:2
}).format(value)+" zł";
const round=(n:number)=>Math.round((n+Number.EPSILON)*100)/100;
const calculate=(amount:number,rate:number,basis:Basis):Amount=>{
  const safe=Number.isFinite(amount)?Math.min(100000000,Math.max(0,amount)):0;
  if(basis==="net"){
    const net=round(safe),vat=round(net*rate/100);
    return {net,vat,gross:round(net+vat)};
  }
  const gross=round(safe),net=round(gross/(1+rate/100));
  return {net,gross,vat:round(gross-net)};
};

export function VatComparison({lang="pl"}:{lang?:Lang}) {
  const [basis,setBasis]=useState<Basis>("gross");
  const [sales,setSales]=useState(50000);
  const [purchases,setPurchases]=useState(50000);
  const s=calculate(sales,8,basis);
  const p=calculate(purchases,23,basis);
  const excess=round(p.vat-s.vat);
  const margin=round(s.net-p.net);
  const pl=lang==="pl";
  return <section aria-label={pl?"Interaktywny kalkulator VAT 8% i 23%":"Interactive 8% versus 23% VAT calculator"} className="my-10 scroll-mt-28 rounded-2xl border border-white/20 bg-[#11161b] p-5 md:p-7">
    <p className="text-xs uppercase tracking-[.18em] text-white/60">{pl?"Kalkulator edukacyjny":"Educational calculator"}</p>
    <h2 className="mt-3 text-2xl font-medium text-white">{pl?"Policz VAT na własnych kwotach":"Calculate VAT for your own amounts"}</h2>
    <p className="mt-3 max-w-2xl leading-7 text-white/70">{pl?"Zmień kwoty i wybierz, czy są netto, czy brutto. Zakładamy sprzedaż opodatkowaną 8% i zakupy z 23% VAT dające pełne prawo do odliczenia.":"Change the amounts and choose net or gross. This illustration assumes sales at 8% and purchases at 23%, with full entitlement to deduct input VAT."}</p>
    <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label={pl?"Rodzaj podanych kwot":"Amount type"}>
      {(["gross","net"] as const).map(next=><button key={next} type="button" aria-pressed={basis===next} onClick={()=>setBasis(next)}
        className={`rounded-lg border px-4 py-2 text-sm transition-colors ${basis===next?"border-white/70 bg-white/15 text-white":"border-white/20 text-white/70 hover:border-white/50"}`}>{next==="gross"?(pl?"Kwoty brutto":"Gross amounts"):(pl?"Kwoty netto":"Net amounts")}</button>)}
    </div>
    <div className="mt-6 grid gap-4 md:grid-cols-2">
      <label className="space-y-2 text-sm text-white/80"><span className="block">{pl?"Sprzedaż (8% VAT)":"Sales (8% VAT)"}</span>
        <input type="number" min="0" max="100000000" step="0.01" inputMode="decimal" value={sales} onChange={e=>setSales(Math.max(0,Math.min(100000000,Number(e.target.value)||0)))} className="w-full rounded-lg border border-white/25 bg-black/40 px-4 py-3 text-base text-white outline-offset-2 focus-visible:outline-white"/>
      </label>
      <label className="space-y-2 text-sm text-white/80"><span className="block">{pl?"Zakupy (23% VAT)":"Purchases (23% VAT)"}</span>
        <input type="number" min="0" max="100000000" step="0.01" inputMode="decimal" value={purchases} onChange={e=>setPurchases(Math.max(0,Math.min(100000000,Number(e.target.value)||0)))} className="w-full rounded-lg border border-white/25 bg-black/40 px-4 py-3 text-base text-white outline-offset-2 focus-visible:outline-white"/>
      </label>
    </div>
    <div className="mt-6 overflow-x-auto">
      <table className="w-full min-w-[300px] border-collapse text-sm">
        <thead><tr className="border-b border-white/20 text-left text-white/65"><th className="py-3 font-normal"></th><th className="py-3 pr-2 font-normal">{pl?"Sprzedaż 8%":"Sales 8%"}</th><th className="py-3 font-normal">{pl?"Zakupy 23%":"Purchases 23%"}</th></tr></thead>
        <tbody className="text-white">
          <tr className="border-b border-white/10"><th className="py-3 text-left font-normal text-white/70">{pl?"Brutto":"Gross"}</th><td className="py-3 pr-2">{money(s.gross,lang)}</td><td>{money(p.gross,lang)}</td></tr>
          <tr className="border-b border-white/10"><th className="py-3 text-left font-normal text-white/70">{pl?"Netto":"Net"}</th><td className="py-3 pr-2">{money(s.net,lang)}</td><td>{money(p.net,lang)}</td></tr>
          <tr><th className="py-3 text-left font-normal text-white/70">VAT</th><td className="py-3 pr-2">{money(s.vat,lang)}</td><td>{money(p.vat,lang)}</td></tr>
        </tbody>
      </table>
    </div>
    <div className="mt-5 grid gap-3 md:grid-cols-2">
      <div className="rounded-xl border border-white/15 bg-white/[.04] p-4">
        <p className="text-xs text-white/60">{excess>=0?(pl?"Potencjalna nadwyżka VAT":"Potential excess input VAT"):(pl?"VAT do zapłaty z tych transakcji":"VAT payable from these items")}</p>
        <p className="mt-2 text-2xl font-medium text-white">{money(Math.abs(excess),lang)}</p>
      </div>
      <div className="rounded-xl border border-white/15 bg-white/[.04] p-4">
        <p className="text-xs text-white/60">{pl?"Marża netto przed pozostałymi kosztami":"Net margin before other expenses"}</p>
        <p className="mt-2 text-2xl font-medium text-white">{money(margin,lang)}</p>
      </div>
    </div>
    <p className="mt-5 text-xs leading-6 text-white/60">{pl?"To uproszczony model dwóch transakcji. Nadwyżka VAT nie gwarantuje zwrotu: decydują zasady odliczenia, całe rozliczenie JPK_VAT i kontrola urzędu. Nie jest to indywidualna porada podatkowa.":"This models two transactions only. Excess VAT does not guarantee a refund; deduction rules, the full return and tax authority verification apply. This is not personalized tax advice."}</p>
  </section>;
}
