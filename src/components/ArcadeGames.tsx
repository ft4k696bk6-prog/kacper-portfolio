"use client";
import {useCallback,useEffect,useRef,useState} from "react";
import {ArrowDown,ArrowLeft,ArrowRight,ArrowUp,Flag,RotateCcw,Timer, Trophy} from "lucide-react";
import {canMove2048,initialSnake,mathQuestion,memoryCards,minesWon,move2048,new2048,newMineBoard,newSecret,nextSnake,revealMineBoard,spawnTile,tttBotMove,tttWinner} from "@/lib/arcade-logic";
import type {ArcadeId,Direction,MineCell,SnakeState} from "@/lib/arcade-logic";

const box="rounded-2xl border border-white/15 bg-[#111] p-4 sm:p-6";
const btn="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:border-white/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-35";
const cell="flex items-center justify-center rounded-lg border border-white/15 font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-white";
const L=({en,pl}:{en:boolean;pl:string})=>en?null:<span className="sr-only">{pl}</span>;
function GameTitle({en,pl,title,desc}:{en:boolean;pl:string;title:string;desc:string}){
 return <header className="mb-6 flex flex-wrap items-start justify-between gap-3"><div><p className="text-[10px] font-semibold uppercase tracking-[.2em] text-white/45">{en?"BROWSER ARCADE":"MINIGRA ONLINE"}</p><h2 className="mt-2 text-2xl font-semibold tracking-tight">{title}</h2><p className="mt-2 text-sm leading-6 text-white/60">{desc}</p></div><L en={en} pl={pl}/></header>;
}
function Memory({en}:{en:boolean}){
 const [deck,setDeck]=useState<string[]>(()=>memoryCards());
 const [open,setOpen]=useState<number[]>([]);
 const [matched,setMatched]=useState<number[]>([]);
 const [moves,setMoves]=useState(0);
 const [busy,setBusy]=useState(false);
 const reset=()=>{setDeck(memoryCards());setOpen([]);setMatched([]);setMoves(0);setBusy(false);};
 useEffect(()=>{
  if(open.length!==2)return;
  if(deck[open[0]]===deck[open[1]]){
   setMatched(m=>[...m,...open]);setOpen([]);return;
  }
  const t=window.setTimeout(()=>{setOpen([]);setBusy(false);},850);
  return()=>window.clearTimeout(t);
 },[open,deck]);
 const turn=(i:number)=>{
  if(busy||open.includes(i)||matched.includes(i)||matched.length===deck.length)return;
  if(open.length===1){setBusy(true);setMoves(m=>m+1);setOpen(o=>[...o,i]);}
  else setOpen([i]);
 };
 return <section className={box}>
  <GameTitle en={en} pl="memory" title={en?"Memory pairs":"Memory — znajdź pary"} desc={en?"Flip two cards at a time. Match all six pairs in as few moves as possible.":"Odkrywaj po dwie karty. Znajdź 6 par w jak najmniejszej liczbie prób."}/>
  <div className="mb-4 flex items-center justify-between gap-3 text-sm text-white/65"><span>{en?"Moves":"Ruchy"}: <strong className="text-white">{moves}</strong> · {en?"Pairs":"Pary"}: <strong className="text-white">{matched.length/2}/6</strong></span><button className={btn} onClick={reset}><RotateCcw size={16}/>{en?"New game":"Nowa gra"}</button></div>
  <div className="mx-auto grid max-w-lg grid-cols-4 gap-2 sm:gap-3">{deck.map((symbol,i)=>{const visible=open.includes(i)||matched.includes(i);return <button key={i} type="button" aria-label={(en?"Card ":"Karta ")+(i+1)+(visible?" "+symbol:"")} aria-pressed={visible} onClick={()=>turn(i)} disabled={matched.includes(i)} className={cell+" aspect-[4/5] text-2xl sm:text-4xl "+(matched.includes(i)?"border-white/45 bg-white/15 text-white":visible?"bg-[#343434] text-white":"bg-[#1a1a1a] text-white/50 hover:bg-[#303030]")}>{visible?symbol:"?"}</button>;})}</div>
  {matched.length===12&&<p role="status" className="mt-5 text-center text-lg font-semibold"><Trophy size={18} className="mr-2 inline"/>{en?"Completed in "+moves+" moves!":"Brawo! Ukończono w "+moves+" ruchach."}</p>}
 </section>;
}
function TicTacToe({en}:{en:boolean}){
 const [board,setBoard]=useState<string[]>(Array(9).fill(""));
 const [last,setLast]=useState("");
 const result=tttWinner(board);
 const reset=()=>{setBoard(Array(9).fill(""));setLast("");};
 const play=(i:number)=>{
  if(result||board[i])return;
  const next=[...board];next[i]="X";setLast(en?"You played X":"Twój ruch: X");
  if(!tttWinner(next)){const ai=tttBotMove(next);if(ai>=0)next[ai]="O";}
  setBoard(next);
 };
 return <section className={box}>
  <GameTitle en={en} pl="kółko i krzyżyk" title={en?"Tic-tac-toe":"Kółko i krzyżyk"} desc={en?"You are X, the computer is O. Make three in a row.":"Grasz krzyżykiem (X), komputer kółkiem (O). Ułóż trzy w rzędzie."}/>
  <div className="mb-4 flex justify-between gap-3 text-sm text-white/65"><span role="status">{result?(result==="draw"?(en?"It's a draw!":"Remis!"):result==="X"?(en?"You win!":"Wygrywasz!"):en?"Computer wins.":"Komputer wygrał."):(last|| (en?"Your turn":"Twój ruch"))}</span><button className={btn} onClick={reset}><RotateCcw size={16}/>{en?"Rematch":"Rewanż"}</button></div>
  <div className="mx-auto grid max-w-sm grid-cols-3 gap-2">{board.map((v,i)=><button key={i} type="button" disabled={Boolean(v)||Boolean(result)} onClick={()=>play(i)} aria-label={(en?"Field ":"Pole ")+(i+1)+": "+(v||"empty")} className={cell+" aspect-square bg-[#1b1b1b] text-4xl sm:text-6xl "+(v==="O"?"text-white/50":"text-white")}>{v}</button>)}</div>
 </section>;
}
function Merge2048({en}:{en:boolean}){
 const [board,setBoard]=useState<number[]>(()=>new2048());
 const [score,setScore]=useState(0);
 const start=useRef<{x:number;y:number}|null>(null);
 const move=useCallback((d:Direction)=>{
  const r=move2048(board,d);if(!r.changed)return;
  setScore(s=>s+r.score);setBoard(spawnTile(r.board));
 },[board]);
 useEffect(()=>{
  const key=(e:KeyboardEvent)=>{
   if(["INPUT","TEXTAREA","SELECT"].includes((e.target as HTMLElement)?.tagName))return;
   const dir:Record<string,Direction>={ArrowUp:"up",ArrowDown:"down",ArrowLeft:"left",ArrowRight:"right"};
   if(dir[e.key]){e.preventDefault();move(dir[e.key]);}
  };
  window.addEventListener("keydown",key);return()=>window.removeEventListener("keydown",key);
 },[move]);
 const touchEnd=(e:React.TouchEvent<HTMLDivElement>)=>{
  const a=start.current;if(!a)return;start.current=null;
  const dx=e.changedTouches[0].clientX-a.x,dy=e.changedTouches[0].clientY-a.y;
  if(Math.max(Math.abs(dx),Math.abs(dy))<24)return;
  move(Math.abs(dx)>Math.abs(dy)?dx>0?"right":"left":dy>0?"down":"up");
 };
 const reset=()=>{setBoard(new2048());setScore(0);};
 return <section className={box}>
  <GameTitle en={en} pl="2048" title="2048" desc={en?"Swipe, use arrow keys or the controls. Combine equal tiles to reach 2048.":"Przesuwaj palcem, używaj strzałek lub przycisków. Łącz takie same liczby."}/>
  <div className="mb-4 flex items-center justify-between gap-3"><span className="text-sm text-white/70">{en?"Score":"Punkty"}: <strong className="text-white">{score}</strong></span><button className={btn} onClick={reset}><RotateCcw size={16}/>{en?"New game":"Nowa gra"}</button></div>
  <div className="mx-auto grid aspect-square max-w-[420px] grid-cols-4 gap-2 rounded-xl bg-[#252525] p-2 touch-none" onTouchStart={e=>{start.current={x:e.touches[0].clientX,y:e.touches[0].clientY};}} onTouchEnd={touchEnd}>
   {board.map((v,i)=><div key={i} aria-label={v?String(v):"empty"} className={"flex items-center justify-center rounded-lg text-lg font-black tabular-nums sm:text-2xl "+(v>=256?"bg-[#bcbcbc] text-black":v>=32?"bg-[#737373] text-white":v?"bg-[#414141] text-white":"bg-[#171717] text-white/20")}>{v||""}</div>)}
  </div>
  <div className="mt-4 flex flex-col items-center gap-1">
   <button className={btn+" w-12 px-0"} onClick={()=>move("up")} aria-label={en?"Up":"Góra"}><ArrowUp size={18}/></button>
   <div className="flex gap-1"><button className={btn+" w-12 px-0"} onClick={()=>move("left")} aria-label={en?"Left":"Lewo"}><ArrowLeft size={18}/></button><button className={btn+" w-12 px-0"} onClick={()=>move("down")} aria-label={en?"Down":"Dół"}><ArrowDown size={18}/></button><button className={btn+" w-12 px-0"} onClick={()=>move("right")} aria-label={en?"Right":"Prawo"}><ArrowRight size={18}/></button></div>
  </div>
  {(board.some(v=>v>=2048)||!canMove2048(board))&&<p role="status" className="mt-3 text-center font-semibold">{board.some(v=>v>=2048)?(en?"You reached 2048!":"Udało się osiągnąć 2048!"):(en?"No more moves. Try again.":"Brak możliwych ruchów. Zagraj ponownie.")}</p>}
 </section>;
}
const opposite:Record<Direction,Direction>={up:"down",down:"up",left:"right",right:"left"};
function Snake({en}:{en:boolean}){
 const [state,setState]=useState<SnakeState>(()=>initialSnake());
 const [running,setRunning]=useState(false);
 const direction=useRef<Direction>("right");
 const change=useCallback((d:Direction)=>{if(d!==opposite[direction.current])direction.current=d;},[]);
 useEffect(()=>{
  const key=(e:KeyboardEvent)=>{
   const dir:Record<string,Direction>={ArrowUp:"up",ArrowDown:"down",ArrowLeft:"left",ArrowRight:"right",w:"up",s:"down",a:"left",d:"right"};
   if(dir[e.key]&&!["INPUT","TEXTAREA","SELECT"].includes((e.target as HTMLElement)?.tagName)){e.preventDefault();change(dir[e.key]);}
  };window.addEventListener("keydown",key);return()=>window.removeEventListener("keydown",key);
 },[change]);
 useEffect(()=>{
  if(!running||!state.alive||state.won)return;
  const t=window.setInterval(()=>setState(s=>nextSnake(s,direction.current)),180);
  return()=>window.clearInterval(t);
 },[running,state.alive,state.won]);
 const restart=()=>{direction.current="right";setState(initialSnake());setRunning(true);};
 return <section className={box}>
  <GameTitle en={en} pl="snake" title="Snake" desc={en?"Collect bright food. Avoid walls and your own tail. Use arrows, WASD or buttons.":"Zbieraj jasne punkty. Unikaj ścian i własnego ogona. Steruj strzałkami, WASD lub przyciskami."}/>
  <div className="mb-4 flex items-center justify-between gap-3"><span className="text-sm">{en?"Score":"Wynik"}: <strong>{state.points}</strong></span><div className="flex flex-wrap gap-2"><button className={btn} onClick={()=>running?setRunning(false):state.alive?setRunning(true):restart()}>{running?(en?"Pause":"Pauza"):state.alive?(en?"Resume":"Wznów"):(en?"Start":"Start")}</button><button className={btn} onClick={restart}><RotateCcw size={16}/></button></div></div>
  <div className="mx-auto grid aspect-square max-w-[420px] grid-cols-12 gap-[2px] rounded-xl border border-white/15 bg-[#121212] p-2">{Array.from({length:144},(_,i)=><div key={i} className={"rounded-[2px] "+(state.body[0]===i?"bg-white":state.body.includes(i)?"bg-white/55":state.food===i?"bg-white/90 ring-2 ring-white/20":"bg-white/[.04]")}/>)}</div>
  <div className="mt-4 flex flex-col items-center gap-1">
   <button className={btn+" w-12 px-0"} onClick={()=>change("up")} aria-label={en?"Up":"Góra"}><ArrowUp size={18}/></button>
   <div className="flex gap-1"><button className={btn+" w-12 px-0"} onClick={()=>change("left")} aria-label={en?"Left":"Lewo"}><ArrowLeft size={18}/></button><button className={btn+" w-12 px-0"} onClick={()=>change("down")} aria-label={en?"Down":"Dół"}><ArrowDown size={18}/></button><button className={btn+" w-12 px-0"} onClick={()=>change("right")} aria-label={en?"Right":"Prawo"}><ArrowRight size={18}/></button></div>
  </div>
  {!state.alive&&<p role="status" className="mt-4 text-center text-lg font-semibold">{en?"Game over — try again!":"Koniec gry — spróbuj ponownie!"}</p>}
  {state.won&&<p role="status" className="mt-4 text-center">{en?"You filled the board!":"Udało Ci się zapełnić planszę!"}</p>}
 </section>;
}
function Mines({en}:{en:boolean}){
 const [board,setBoard]=useState<MineCell[]>([]);
 const [status,setStatus]=useState<"idle"|"playing"|"won"|"lost">("idle");
 const [flagMode,setFlagMode]=useState(false);
 const reset=()=>{setBoard([]);setStatus("idle");setFlagMode(false);};
 const play=(i:number,flag=false)=>{
  if(status==="won"||status==="lost")return;
  if(flag||flagMode){
   if(!board.length||board[i].shown)return;
   setBoard(b=>b.map((v,j)=>i===j?{...v,flag:!v.flag}:v));return;
  }
  const next=board.length?board:newMineBoard(7,7,i);
  if(next[i].flag)return;
  const revealed=revealMineBoard(next,i,7);
  const lost=revealed[i].mine;
  if(lost)revealed.forEach(c=>{if(c.mine)c.shown=true;});
  const won=!lost&&minesWon(revealed);
  setBoard(revealed);setStatus(lost?"lost":won?"won":"playing");
 };
 return <section className={box}>
  <GameTitle en={en} pl="saper" title={en?"Minesweeper":"Saper"} desc={en?"Seven mines on a 7×7 board. Your first tap is safe. Long-press or toggle flag mode to mark mines.":"7 min na planszy 7×7. Pierwszy ruch jest bezpieczny. Przytrzymaj pole albo włącz flagi."}/>
  <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-sm"><span>{en?"Flags":"Flagi"}: {board.filter(c=>c.flag).length}/7</span><div className="flex flex-wrap gap-2"><button type="button" aria-pressed={flagMode} onClick={()=>setFlagMode(v=>!v)} className={btn+(flagMode?" border-white bg-white/20":"")}><Flag size={15}/>{en?"Flag mode":"Tryb flag"}</button><button className={btn} onClick={reset}><RotateCcw size={16}/></button></div></div>
  <div className="mx-auto grid max-w-[440px] grid-cols-7 gap-1 touch-manipulation">{Array.from({length:49},(_,i)=>{
   const c=board[i];return <button type="button" key={i} onClick={()=>play(i)} onContextMenu={e=>{e.preventDefault();play(i,true);}} aria-label={(en?"Cell ":"Pole ")+(i+1)+(c?.shown?(c.mine?" mine":" "+c.count):c?.flag?" flagged":" hidden")} disabled={status==="won"||status==="lost"||Boolean(c?.shown)} className={cell+" aspect-square min-w-0 text-xs sm:text-base "+(c?.shown?"border-white/5 bg-[#303030]":"bg-[#191919] hover:bg-[#3b3b3b]")}>{c?.shown?(c.mine?"✹":c.count||""):c?.flag?"⚑":""}</button>;
  })}</div>
  {status==="won"&&<p role="status" className="mt-5 text-center text-lg font-semibold">{en?"All safe cells uncovered!":"Wszystkie bezpieczne pola odkryte!"}</p>}
  {status==="lost"&&<p role="status" className="mt-5 text-center text-lg font-semibold">{en?"You hit a mine. Try again.":"Trafiona mina. Spróbuj ponownie."}</p>}
 </section>;
}
function QuickMath({en}:{en:boolean}){
 const [index,setIndex]=useState(0);
 const [q,setQ]=useState(()=>mathQuestion());
 const [score,setScore]=useState(0);
 const [answer,setAnswer]=useState<number|null>(null);
 const reset=()=>{setIndex(0);setScore(0);setAnswer(null);setQ(mathQuestion());};
 const select=(n:number)=>{if(answer!==null)return;setAnswer(n);if(n===q.correct)setScore(s=>s+1);};
 const next=()=>{setIndex(i=>i+1);setAnswer(null);setQ(mathQuestion());};
 const ended=index>=10;
 return <section className={box}>
  <GameTitle en={en} pl="matematyka" title={en?"Quick math":"Szybka matematyka"} desc={en?"Answer ten arithmetic questions. One point for each correct answer.":"Odpowiedz na 10 działań. Za każdą dobrą odpowiedź dostajesz punkt."}/>
  <div className="mb-5 flex items-center justify-between gap-3 text-sm"><span>{en?"Question":"Pytanie"} {Math.min(index+1,10)}/10 · {en?"Points":"Punkty"}: <strong>{score}</strong></span><button className={btn} onClick={reset}><RotateCcw size={16}/>{en?"Restart":"Od nowa"}</button></div>
  {ended?<div className="rounded-xl border border-white/20 p-10 text-center text-2xl font-bold" role="status">{en?"Final score":"Twój wynik"}: {score}/10</div>:<>
   <div className="rounded-xl bg-[#1c1c1c] p-9 text-center text-4xl font-bold tabular-nums">{q.text} = ?</div>
   <div className="mt-4 grid grid-cols-3 gap-2">{q.answers.map((n,i)=><button type="button" key={i} disabled={answer!==null} className={btn+" min-h-20 text-xl "+(answer!==null&&n===q.correct?"border-white bg-white/20":answer===n?"border-red-400/80":"")} onClick={()=>select(n)}>{n}</button>)}</div>
   {answer!==null&&<div className="mt-5 flex flex-wrap items-center justify-between gap-3"><p role="status" className="text-sm">{answer===q.correct?(en?"Correct!":"Dobrze!"):(en?"Correct answer: ":"Poprawna odpowiedź: ")+q.correct}</p><button className={btn} onClick={next}>{index===9?(en?"See result":"Zobacz wynik"):(en?"Next question":"Następne pytanie")}<ArrowRight size={16}/></button></div>}
  </>}
 </section>;
}
function GuessNumber({en}:{en:boolean}){
 const [secret,setSecret]=useState(()=>newSecret());
 const [value,setValue]=useState("");
 const [guesses,setGuesses]=useState<number[]>([]);
 const win=guesses.includes(secret);
 const reset=()=>{setSecret(newSecret());setValue("");setGuesses([]);};
 const submit=(e:React.FormEvent)=>{e.preventDefault();const n=Number(value);if(!Number.isInteger(n)||n<1||n>100||win||guesses.includes(n))return;setGuesses(g=>[...g,n]);setValue("");};
 const last=guesses[guesses.length-1];
 return <section className={box}>
  <GameTitle en={en} pl="zgadnij liczbę" title={en?"Guess the number":"Zgadnij liczbę"} desc={en?"I picked a number from 1 to 100. Guess and follow the hints.":"Wylosowałem liczbę od 1 do 100. Zgaduj, a podpowiem, czy jest większa czy mniejsza."}/>
  <div className="mb-5 flex items-center justify-between gap-3"><span className="text-sm text-white/65">{en?"Guesses":"Próby"}: {guesses.length}</span><button className={btn} onClick={reset}><RotateCcw size={16}/>{en?"New number":"Nowa liczba"}</button></div>
  <form onSubmit={submit} className="flex flex-wrap gap-3"><label className="sr-only" htmlFor="secret-guess">{en?"Your guess":"Twoja liczba"}</label><input id="secret-guess" type="number" inputMode="numeric" min="1" max="100" required value={value} onChange={e=>setValue(e.target.value)} disabled={win} placeholder="1–100" className="min-h-12 min-w-0 flex-1 rounded-xl border border-white/25 bg-black px-4 text-lg text-white outline-none focus:border-white/65"/><button className={btn} type="submit" disabled={win||!value}>{en?"Guess":"Sprawdź"}</button></form>
  {last!==undefined&&<div role="status" className="mt-5 rounded-xl bg-[#252525] p-6 text-center text-lg font-semibold">{win?(en?"Correct! The number was ":"Brawo! Liczba to ")+secret:last<secret?(en?"Higher than ":"Więcej niż ")+last:(en?"Lower than ":"Mniej niż ")+last}</div>}
  {guesses.length>0&&<p className="mt-4 break-words text-xs text-white/50">{en?"Previous guesses":"Poprzednie próby"}: {guesses.join(" · ")}</p>}
 </section>;
}
function TargetRush({en}:{en:boolean}){
 const [time,setTime]=useState(20);
 const [active,setActive]=useState(-1);
 const [hits,setHits]=useState(0);
 const [running,setRunning]=useState(false);
 useEffect(()=>{
  if(!running)return;
  const t=window.setInterval(()=>setTime(x=>Math.max(0,x-1)),1000);
  return()=>window.clearInterval(t);
 },[running]);
 useEffect(()=>{if(time===0)setRunning(false);},[time]);
 const start=()=>{setTime(20);setHits(0);setActive(Math.floor(Math.random()*16));setRunning(true);};
 const hit=(i:number)=>{if(!running||time===0||i!==active)return;setHits(n=>n+1);setActive(a=>{let n=Math.floor(Math.random()*15);if(n>=a)n++;return n;});};
 return <section className={box}>
  <GameTitle en={en} pl="łap cel" title={en?"Target rush":"Łap cel"} desc={en?"Hit the bright target as often as possible in 20 seconds. Works with touch or mouse.":"Klikaj pojawiający się jasny cel przez 20 sekund. Działa myszką i dotykiem."}/>
  <div className="mb-5 flex items-center justify-between gap-3 text-sm"><span className="inline-flex items-center gap-2"><Timer size={16}/>{time}s · {en?"Hits":"Trafienia"}: <strong>{hits}</strong></span><button className={btn} onClick={start}>{running?(en?"Restart":"Restart"):(en?"Start game":"Rozpocznij")}</button></div>
  <div className="mx-auto grid aspect-square max-w-[420px] grid-cols-4 gap-2 rounded-2xl bg-[#1a1a1a] p-3">{Array.from({length:16},(_,i)=><button type="button" key={i} aria-label={(en?"Target field ":"Pole celu ")+(i+1)} onClick={()=>hit(i)} disabled={!running} className={cell+" aspect-square "+(running&&i===active?"border-white bg-white text-black shadow-[0_0_24px_#ffffff55]":"bg-[#292929] text-white/30")}><span className="text-3xl">{running&&i===active?"◎":""}</span></button>)}</div>
  {!running&&time===0&&<p role="status" className="mt-5 text-center text-xl font-semibold">{en?"Time's up! Score: ":"Koniec czasu! Wynik: "}{hits}</p>}
 </section>;
}
export function ArcadeGames({lang,game}:{lang:"pl"|"en";game:ArcadeId}){
 const en=lang==="en";
 if(game==="memory")return <Memory en={en}/>;
 if(game==="tictactoe")return <TicTacToe en={en}/>;
 if(game==="merge")return <Merge2048 en={en}/>;
 if(game==="snake")return <Snake en={en}/>;
 if(game==="mines")return <Mines en={en}/>;
 if(game==="math")return <QuickMath en={en}/>;
 if(game==="guess")return <GuessNumber en={en}/>;
 if(game==="target")return <TargetRush en={en}/>;
 return null;
}
