import type { ArcadeId } from "@/lib/arcade-logic";
const cell="flex items-center justify-center rounded-[4px] border border-white/10 bg-white/[.09] text-xs font-semibold text-white/85";
export function GameThumbnail({game}:{game:ArcadeId}){
 return <div aria-hidden="true" className="relative flex h-24 w-full items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-[radial-gradient(circle_at_50%_25%,#353535,#101010_75%)]">
  {game==="reflex"&&<div className="flex items-center gap-3"><div className="size-9 rounded-full bg-emerald-400/90 shadow-[0_0_22px_rgba(52,211,153,.32)]"/><span className="font-mono text-lg font-bold text-white/80">243 <span className="text-xs">ms</span></span></div>}
  {game==="kids"&&<div className="relative flex h-full w-full items-center justify-center gap-4 text-xl"><span className="absolute left-4 top-3 text-xs text-white/40">✦</span><span className="text-white/40">A</span><span className="text-3xl text-white">★</span><span className="text-white/80">Z</span><span className="absolute bottom-3 right-6 text-xs text-white/40">✧</span></div>}
  {game==="memory"&&<div className="grid w-36 grid-cols-4 gap-1.5">{["◆","?","●","?","?","◆","?","●"].map((v,i)=><span key={i} className={cell+" h-8"}>{v}</span>)}</div>}
  {game==="tictactoe"&&<div className="grid w-24 grid-cols-3 gap-1">{["X","","O","","X","","O","","X"].map((v,i)=><span key={i} className={cell+" aspect-square text-base"}>{v}</span>)}</div>}
  {game==="merge"&&<div className="grid w-36 grid-cols-4 gap-1">{[2,4,0,0,4,8,16,0,0,32,64,0,0,0,128,256].map((v,i)=><span key={i} className={cell+" h-5 text-[10px] "+(v?"bg-white/25":"")}>{v||""}</span>)}</div>}
  {game==="snake"&&<div className="grid w-36 grid-cols-9 gap-1">{Array.from({length:45},(_,i)=><span key={i} className={"aspect-square rounded-[2px] "+([22,23,24,33,42].includes(i)?"bg-white":i===16?"bg-emerald-300":"bg-white/[.055]")}/>)}</div>}
  {game==="mines"&&<div className="grid w-36 grid-cols-6 gap-1">{Array.from({length:24},(_,i)=><span key={i} className={cell+" h-5 "+(i%5===0?"bg-white/20":"")}>{i===14?"✹":i%8===0?"1":i%9===0?"2":""}</span>)}</div>}
  {game==="math"&&<div className="text-center font-mono"><p className="text-2xl font-bold">12 × 8 = ?</p><p className="mt-2 text-[10px] tracking-[.3em] text-white/50">84  96  108</p></div>}
  {game==="guess"&&<div className="flex items-center gap-4"><span className="text-5xl font-light text-white/85">?</span><span className="font-mono text-sm text-white/50">1 — 100</span></div>}
  {game==="target"&&<div className="relative grid size-16 place-items-center rounded-full border-[8px] border-white/45 bg-white/10"><div className="grid size-9 place-items-center rounded-full border-[6px] border-white/60"><div className="size-2 rounded-full bg-white"/></div></div>}
 </div>;
}
