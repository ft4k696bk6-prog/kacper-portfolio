"use client";
import {useCallback,useEffect,useMemo,useRef,useState} from "react";
import {ArrowDown,ArrowLeft,ArrowRight,ArrowUp,Flag,Pause,Play,RefreshCcw,Trophy} from "lucide-react";
import {addTile,makeMines,move2048,revealMines,stepSnake,wordHints} from "@/lib/arcade-engine";
import type {MineCell,Slide,SnakePoint} from "@/lib/arcade-engine";
import {KeyboardGalaxy} from "./KeyboardGalaxy";

type Game="snake"|"tiles"|"memory"|"tic"|"mines"|"word"|"type"|"color"|"pong"|"breakout"|"space"|"kids";
const catalog:{id:Game;pl:string;en:string;emoji:string;age:string}[]=[
{id:"snake",pl:"Snake",en:"Snake",emoji:"🐍",age:"7+"},
{id:"tiles",pl:"2048",en:"2048",emoji:"🔢",age:"7+"},
{id:"memory",pl:"Memory",en:"Memory",emoji:"🧠",age:"3+"},
{id:"tic",pl:"Kółko i krzyżyk",en:"Tic-tac-toe",emoji:"❎",age:"4+"},
{id:"mines",pl:"Saper",en:"Minesweeper",emoji:"💣",age:"9+"},
{id:"word",pl:"Zgadnij słowo",en:"Word puzzle",emoji:"🔤",age:"7+"},
{id:"type",pl:"Test pisania",en:"Typing speed",emoji:"⌨️",age:"8+"},
{id:"color",pl:"Baloniki i kolory",en:"Color balloons",emoji:"🎈",age:"3+"},
{id:"pong",pl:"Pong",en:"Pong",emoji:"🏓",age:"6+"},
{id:"breakout",pl:"Rozbij cegły",en:"Brick breaker",emoji:"🧱",age:"6+"},
{id:"space",pl:"Kosmiczna obrona",en:"Space defense",emoji:"🚀",age:"7+"},
{id:"kids",pl:"Klawiaturowa galaktyka",en:"Keyboard Galaxy",emoji:"🌌",age:"3+"}
];
const button="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/25 bg-[#151515] px-4 py-2.5 text-sm hover:border-white/60";
const frame="rounded-2xl border border-white/20 bg-[#0c0c0c] p-4 sm:p-6";
function blankSnake():SnakePoint[]{return [{x:8,y:8},{x:7,y:8},{x:6,y:8}];}
function initialTiles(){return addTile(addTile(Array(16).fill(0)));}
function memoryDeck():string[]{return ["🐸","🌙","🐳","🍉","🚀","⭐","🐸","🌙","🐳","🍉","🚀","⭐"].map((v,i)=>({v,i})).sort(()=>Math.random()-.5).map(x=>x.v);}
function randomFood(snake:SnakePoint[]):SnakePoint{
 const free:SnakePoint[]=[];for(let y=0;y<16;y++)for(let x=0;x<16;x++)if(!snake.some(p=>p.x===x&&p.y===y))free.push({x,y});
 return free[Math.floor(Math.random()*free.length)]||{x:-1,y:-1};
}
const wordsPL=["MORZE","ROBOT","LIMON","KOTEK","JABŁO","LASER","BALON","SERCE"];
const wordsEN=["SPACE","ROBOT","APPLE","OCEAN","TRAIN","MUSIC","SNAKE","LEMON"];
const promptPL="Strony internetowe mogą być szybkie i wygodne w użyciu.";
const promptEN="Great websites can be fast and pleasant to use.";
const directions:{dir:Slide;icon:typeof ArrowLeft;key:string}[]=[
{dir:"up",icon:ArrowUp,key:"ArrowUp"},{dir:"left",icon:ArrowLeft,key:"ArrowLeft"},
{dir:"down",icon:ArrowDown,key:"ArrowDown"},{dir:"right",icon:ArrowRight,key:"ArrowRight"}];
export function ArcadeWorkshop({lang}:{lang:"pl"|"en"}){
 const en=lang==="en";
 const [game,setGame]=useState<Game>("snake");
 const [snake,setSnake]=useState(blankSnake);
 const [snakeFood,setSnakeFood]=useState({x:13,y:8});
 const [snakePlaying,setSnakePlaying]=useState(false);const [snakeDead,setSnakeDead]=useState(false);
 const [snakeScore,setSnakeScore]=useState(0);const snakeDir=useRef({x:1,y:0});const snakeRef=useRef<SnakePoint[]>(blankSnake());const snakeFoodRef=useRef({x:13,y:8});
 const [board,setBoard]=useState(initialTiles);
 const [tileScore,setTileScore]=useState(0);
 const [deck,setDeck]=useState(memoryDeck);const [flipped,setFlipped]=useState<number[]>([]);const [matched,setMatched]=useState<number[]>([]);
 const memoryLock=useRef(false);
 const [tic,setTic]=useState<string[]>(Array(9).fill(""));
 const [mines,setMines]=useState<MineCell[]>([]);const [flagging,setFlagging]=useState(false);const [mineLost,setMineLost]=useState(false);
 const [word,setWord]=useState("");const [wordGuess,setWordGuess]=useState("");const [wordRows,setWordRows]=useState<string[]>([]);
 const [typed,setTyped]=useState("");const [typingStart,setTypingStart]=useState(0);const [seconds,setSeconds]=useState(0);
 const [balloonScore,setBalloonScore]=useState(0);const [target,setTarget]=useState(0);
 const answer=useMemo(()=>word||((en?wordsEN:wordsPL)[0]),[word,en]);
 const resetSnake=()=>{const start=blankSnake();setSnake(start);snakeRef.current=start;snakeDir.current={x:1,y:0};setSnakeFood({x:13,y:8});snakeFoodRef.current={x:13,y:8};setSnakePlaying(false);setSnakeDead(false);setSnakeScore(0);};
 const reset=useCallback((name:Game)=>{
  setGame(name);
  if(name==="snake")resetSnake();
  if(name==="tiles"){setBoard(initialTiles());setTileScore(0);}
  if(name==="memory"){setDeck(memoryDeck());setMatched([]);setFlipped([]);memoryLock.current=false;}
  if(name==="tic")setTic(Array(9).fill(""));
  if(name==="mines"){setMines([]);setFlagging(false);setMineLost(false);}
  if(name==="word"){setWord((en?wordsEN:wordsPL)[Math.floor(Math.random()*8)]);setWordGuess("");setWordRows([]);}
  if(name==="type"){setTyped("");setTypingStart(0);setSeconds(0);}
  if(name==="color"){setTarget(Math.floor(Math.random()*4));setBalloonScore(0);}
 },[en]);
 useEffect(()=>{reset("snake");},[reset]);
 const direction=(x:number,y:number)=>{
  const d=snakeDir.current;if(d.x===-x&&d.y===-y)return;snakeDir.current={x,y};setSnakePlaying(true);
 };
 useEffect(()=>{
  if(game!=="snake"||!snakePlaying||snakeDead)return;
  const id=window.setInterval(()=>{
   const result=stepSnake(snakeRef.current,snakeDir.current,snakeFoodRef.current,16);
   if(result.dead){setSnakeDead(true);setSnakePlaying(false);return;}
   snakeRef.current=result.body;setSnake(result.body);
   if(result.ate){setSnakeScore(v=>v+10);const food=randomFood(result.body);snakeFoodRef.current=food;setSnakeFood(food);}
  },135);
  return()=>clearInterval(id);
 },[game,snakePlaying,snakeDead]);
 const moveTile=useCallback((dir:Slide)=>{
  const moved=move2048(board,dir);if(!moved.changed)return;
  setBoard(addTile(moved.board));setTileScore(s=>s+moved.points);
 },[board]);
 useEffect(()=>{
  if(!["snake","tiles"].includes(game))return;
  const handler=(e:KeyboardEvent)=>{
   if((e.target as HTMLElement)?.closest("input,textarea,select"))return;
   const d=directions.find(d=>d.key===e.key);
   if(!d)return;e.preventDefault();
   if(game==="snake")direction(d.dir==="left"?-1:d.dir==="right"?1:0,d.dir==="up"?-1:d.dir==="down"?1:0);
   if(game==="tiles")moveTile(d.dir);
  };
  window.addEventListener("keydown",handler);return()=>window.removeEventListener("keydown",handler);
 },[game,moveTile]);
 const pickMemory=(i:number)=>{
  if(matched.includes(i)||flipped.includes(i)||memoryLock.current)return;
  const next=[...flipped,i];setFlipped(next);
  if(next.length===2){memoryLock.current=true;
   window.setTimeout(()=>{if(deck[next[0]]===deck[next[1]])setMatched(old=>[...old,...next]);setFlipped([]);memoryLock.current=false;},650);
  }
 };
 const ticWinner=(values:string[]):string=>{
  for(const [a,b,c] of [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]])if(values[a]&&values[a]===values[b]&&values[b]===values[c])return values[a];
  return values.every(Boolean)?"draw":"";
 };
 const playTic=(i:number)=>{
  if(tic[i]||ticWinner(tic))return;
  const next=[...tic];next[i]="X";if(!ticWinner(next)){
   const options=next.map((v,j)=>v?-1:j).filter(j=>j>=0);
   const index=options.includes(4)?4:options[Math.floor(Math.random()*options.length)];
   if(index!==undefined)next[index]="O";
  }setTic(next);
 };
 const clickMine=(i:number)=>{
  const field=mines.length?mines:makeMines(64,10,i);
  if(mineLost)return;
  if(flagging){setMines(field.map((m,j)=>j===i?{...m,flag:!m.flag}:m));return;}
  if(field[i].flag)return;
  const opened=revealMines(field,i);
  if(opened[i].mine){setMineLost(true);setMines(opened.map(m=>m.mine?{...m,open:true}:m));}
  else setMines(opened);
 };
 const sendWord=()=>{
  const val=wordGuess.toLocaleUpperCase(en?"en":"pl").trim();
  if(val.length!==5||wordRows.length>=6||wordRows.includes(answer))return;
  setWordRows(old=>[...old,val]);setWordGuess("");
 };
 const onTyped=(v:string)=>{if(!typingStart&&v)setTypingStart(Date.now());setTyped(v);if(v=== (en?promptEN:promptPL))setSeconds(Math.round((Date.now()-(typingStart||Date.now()))/1000));};
 const selected=catalog.find(g=>g.id===game)!;
 const gameText=game==="kids"?(en?"All letters and symbols, no score.":"Wszystkie litery i symbole, bez punktów."):"";
 const gameOver=game==="snake"&&snakeDead;
 return <section className="space-y-6">
  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
   {catalog.map(item=><button key={item.id} type="button" onClick={()=>reset(item.id)}
    className={"flex min-h-24 items-center gap-3 rounded-2xl border p-4 text-left transition-colors "+(game===item.id?"border-white/70 bg-white/15":"border-white/15 bg-[#111111] hover:border-white/40")}>
    <span className="text-3xl" aria-hidden="true">{item.emoji}</span>
    <span><span className="block text-sm font-semibold">{en?item.en:item.pl}</span><span className="mt-1 block text-xs text-white/50">{item.age}</span></span>
   </button>)}
  </div>
  {game==="kids"?<KeyboardGalaxy lang={lang}/>:<div className={frame+" mx-auto max-w-4xl"}>
   <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-xl font-medium">{en?selected.en:selected.pl}</h2><p className="mt-1 text-xs text-white/55">{en?"Original browser game. No account, no ads.":"Autorska gra przeglądarkowa. Bez konta i reklam."}</p></div>
    <button type="button" className={button} onClick={()=>reset(game)}><RefreshCcw size={16}/>{en?"New game":"Nowa gra"}</button>
   </div>
   {game==="snake"&&<div className="space-y-4">
    <div className="flex items-center justify-between gap-2 text-sm"><span>{en?"Score":"Punkty"}: {snakeScore}</span><button type="button" className={button} onClick={()=>setSnakePlaying(v=>!v)} disabled={snakeDead}>{snakePlaying?<Pause size={16}/>:<Play size={16}/>} {snakePlaying?(en?"Pause":"Pauza"):(en?"Play":"Graj")}</button></div>
    <div role="img" aria-label={en?"Snake game board":"Plansza Snake"} className="mx-auto grid aspect-square w-full max-w-[480px] grid-cols-[repeat(16,minmax(0,1fr))] overflow-hidden rounded-xl border border-white/20 bg-[#10151c]">
     {Array.from({length:256},(_,i)=>{const x=i%16,y=Math.floor(i/16),head=snake[0].x===x&&snake[0].y===y,body=snake.some(p=>p.x===x&&p.y===y),food=snakeFood.x===x&&snakeFood.y===y;return <span key={i} className={"border border-white/[.025] "+(head?"bg-[#eeeeee]":body?"bg-[#9ca3af]":food?"bg-rose-400":"")}/>;})}
    </div>
    {gameOver&&<p className="text-center text-rose-300">{en?"Game over. Start a new round.":"Koniec gry. Rozpocznij nową rundę."}</p>}
    <div className="mx-auto grid max-w-44 grid-cols-3 gap-2">{directions.map((d,i)=>{const Icon=d.icon;return <button key={d.dir} type="button" aria-label={d.dir} onClick={()=>direction(d.dir==="left"?-1:d.dir==="right"?1:0,d.dir==="up"?-1:d.dir==="down"?1:0)}
     className={button+" "+(i===0?"col-start-2":i===1?"col-start-1 row-start-2":i===2?"col-start-2 row-start-2":"col-start-3 row-start-2")}><Icon size={21}/></button>})}</div>
   </div>}
   {game==="tiles"&&<div className="space-y-4"><p className="text-sm text-white/70">{en?"Score":"Punkty"}: {tileScore}</p>
    <div className="mx-auto grid aspect-square w-full max-w-[450px] grid-cols-4 gap-2 rounded-xl bg-[#2e2e2e] p-3">{board.map((n,i)=><div key={i} className={"flex items-center justify-center rounded-lg text-lg font-bold sm:text-3xl "+(n?"bg-[#d8d8d8] text-black":"bg-[#555555]/60 text-white/30")}>{n||""}</div>)}</div>
    <div className="flex flex-wrap justify-center gap-2">{directions.map(d=>{const Icon=d.icon;return <button type="button" key={d.dir} onClick={()=>moveTile(d.dir)} className={button} aria-label={d.dir}><Icon size={19}/></button>})}</div>
   </div>}
   {game==="memory"&&<div><p className="mb-4 text-sm text-white/65">{en?"Pairs":"Pary"}: {matched.length/2}/6</p>
    <div className="mx-auto grid max-w-[540px] grid-cols-4 gap-3">{deck.map((symbol,i)=><button type="button" key={i} aria-label={(flipped.includes(i)||matched.includes(i))?symbol:(en?"Hidden card":"Ukryta karta")} onClick={()=>pickMemory(i)}
     className={"aspect-[.83] rounded-xl border text-3xl transition "+(flipped.includes(i)||matched.includes(i)?"border-white/60 bg-white/15":"border-white/20 bg-[#262626]")}>{flipped.includes(i)||matched.includes(i)?symbol:"?"}</button>)}</div>
    {matched.length===12&&<p role="status" className="mt-5 text-center">{en?"All pairs found!":"Znaleziono wszystkie pary!"}</p>}
   </div>}
   {game==="tic"&&<div className="space-y-5">
    <p role="status" className="text-center text-sm text-white/75">{ticWinner(tic)?ticWinner(tic)==="draw"?(en?"Draw":"Remis"):ticWinner(tic)==="X"?(en?"You win!":"Wygrywasz!"):(en?"Computer wins":"Komputer wygrywa"):(en?"You are X, computer is O":"Ty grasz X, komputer O")}</p>
    <div className="mx-auto grid aspect-square max-w-[360px] grid-cols-3 gap-2">{tic.map((v,i)=><button type="button" key={i} onClick={()=>playTic(i)} className="rounded-xl border border-white/25 bg-[#202020] text-5xl font-light hover:border-white/60">{v}</button>)}</div>
   </div>}
   {game==="mines"&&<div className="space-y-4">
    <div className="flex flex-wrap items-center justify-between gap-2 text-sm"><span>{en?"Mines":"Miny"}: 10</span><button type="button" aria-pressed={flagging} onClick={()=>setFlagging(v=>!v)} className={button+" "+(flagging?"bg-white/20":"")}><Flag size={16}/>{en?"Flag mode":"Tryb flagowania"}</button></div>
    <div className="mx-auto grid aspect-square max-w-[480px] grid-cols-8 gap-1">{Array.from({length:64},(_,i)=>{const c=mines[i];return <button key={i} type="button" onContextMenu={e=>{e.preventDefault();setFlagging(true);clickMine(i);}}
      onClick={()=>clickMine(i)} aria-label={(en?"Cell ":"Pole ")+(i+1)}
      className={"rounded border border-white/15 text-sm font-bold sm:text-lg "+(c?.open?"bg-[#101010]":"bg-[#404040] hover:bg-[#555555]")}>
      {c?.open?(c.mine?"💣":c.near||""):(c?.flag?"🚩":"")}</button>})}</div>
    {mineLost&&<p className="text-center text-rose-300">{en?"Mine hit! Start again.":"Trafiona mina. Spróbuj ponownie."}</p>}
    {mines.length>0&&!mineLost&&mines.every(c=>c.mine||c.open)&&<p className="text-center">{en?"All safe tiles uncovered!":"Odkryto wszystkie bezpieczne pola!"}</p>}
   </div>}
   {game==="word"&&<div className="space-y-4">
    <p className="text-sm text-white/60">{en?"Guess the five-letter word in six tries.":"Zgadnij pięcioliterowe słowo w sześciu próbach."}</p>
    <div className="mx-auto grid max-w-xs gap-2">{Array.from({length:6},(_,row)=>{const value=wordRows[row]||"";return <div key={row} className="grid grid-cols-5 gap-2">{Array.from({length:5},(_,i)=>{const hint=value?wordHints(answer,value)[i]:"";return <div key={i} className={"flex aspect-square items-center justify-center rounded-md border border-white/25 text-lg font-semibold "+(hint==="hit"?"bg-emerald-700":hint==="present"?"bg-amber-600":hint==="miss"?"bg-[#363636]":"bg-[#171717]")}>{value[i]||""}</div>})}</div>})}</div>
    {wordRows.includes(answer)||wordRows.length===6?<p className="text-center text-sm">{wordRows.includes(answer)?(en?"Correct!":"Brawo!"):(en?"The word was ":"Słowo to: ")+answer}</p>:<form onSubmit={e=>{e.preventDefault();sendWord();}} className="mx-auto flex max-w-sm gap-2">
     <input autoComplete="off" className="min-w-0 flex-1 rounded-lg border border-white/25 bg-[#111111] p-3 uppercase" maxLength={5} value={wordGuess} onChange={e=>setWordGuess(e.target.value.replace(/[^a-zA-ZĄĆĘŁŃÓŚŹŻąćęłńóśźż]/g,"").slice(0,5))}/>
     <button type="submit" disabled={wordGuess.length!==5} className={button+" disabled:opacity-30"}>{en?"Guess":"Sprawdź"}</button>
    </form>}
   </div>}
   {game==="type"&&<div className="space-y-4">
    <p className="rounded-xl bg-white/10 p-5 font-mono text-base leading-8">{en?promptEN:promptPL}</p>
    <textarea className="min-h-32 w-full rounded-xl border border-white/20 bg-[#121212] p-4 outline-none" value={typed} onChange={e=>onTyped(e.target.value)} placeholder={en?"Type the text above":"Przepisz tekst powyżej"}/>
    <p className="text-sm text-white/70">{en?"Characters":"Znaki"}: {typed.length} · {en?"Elapsed":"Czas"}: {seconds|| (typingStart?Math.floor((Date.now()-typingStart)/1000):0)} s</p>
    {typed===(en?promptEN:promptPL)&&<p role="status">{en?"Completed!":"Ukończono!"}</p>}
   </div>}
   {game==="color"&&<div className="space-y-5">
    <h3 className="text-center text-xl">{en?"Find the color":"Znajdź kolor"}: <strong>{(en?["Red","Blue","Green","Yellow"]:["Czerwony","Niebieski","Zielony","Żółty"])[target]}</strong></h3>
    <div className="grid grid-cols-2 gap-6 p-4 sm:grid-cols-4">{["bg-rose-500","bg-blue-500","bg-green-500","bg-yellow-400"].map((color,i)=><button key={i} type="button" onClick={()=>{if(i===target){setBalloonScore(s=>s+1);setTarget(Math.floor(Math.random()*4));}}} aria-label={(en?["Red","Blue","Green","Yellow"]:["Czerwony","Niebieski","Zielony","Żółty"])[i]}
     className={"mx-auto aspect-[.83] w-full max-w-32 rounded-[50%] shadow-xl transition-transform active:scale-90 "+color}/>)}</div>
    <p role="status" className="text-center text-sm">{en?"Correct choices":"Dobre odpowiedzi"}: {balloonScore}</p>
   </div>}
   {["pong","breakout","space"].includes(game)&&<CanvasArcade kind={game as "pong"|"breakout"|"space"} lang={lang}/>}
  </div>}
  <p className="text-center text-xs leading-6 text-white/50">{en?"All games are original implementations. No commercial ROMs, unauthorized copies or paid assets. Small children should play with a caregiver.":"Wszystkie gry to autorskie implementacje. Nie używamy komercyjnych ROM-ów, pirackich kopii ani płatnych grafik. Małe dzieci powinny bawić się pod opieką dorosłego."}</p>
 </section>;
}

function CanvasArcade({kind,lang}:{kind:"pong"|"breakout"|"space";lang:"pl"|"en"}){
 const en=lang==="en";const canvas=useRef<HTMLCanvasElement>(null);
 const held=useRef(new Set<string>());const pointer=useRef(320);const paused=useRef(false);
 const [score,setScore]=useState(0);const [lost,setLost]=useState(false);const [round,setRound]=useState(0);
 useEffect(()=>{
  const c=canvas.current;if(!c)return;const ctx=c.getContext("2d");if(!ctx)return;
  let raf=0,last=performance.now(),points=0,over=false;
  let ball={x:320,y:240,vx:185,vy:155,r:8};let paddle={x:275,y:363,w:90,h:10};
  let enemies=Array.from({length:18},(_,i)=>({x:35+(i%9)*64,y:45+Math.floor(i/9)*25,alive:true}));
  const bullets:{x:number;y:number}[]=[];let cooldown=0,ship=320;
  const down=(e:KeyboardEvent)=>{if(["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Space"].includes(e.code))e.preventDefault();held.current.add(e.code);};
  const up=(e:KeyboardEvent)=>held.current.delete(e.code);
  window.addEventListener("keydown",down);window.addEventListener("keyup",up);
  const render=(now:number)=>{
   const dt=Math.min(.036,(now-last)/1000);last=now;
   ctx.fillStyle="#080e18";ctx.fillRect(0,0,640,400);
   ctx.fillStyle="rgba(255,255,255,.10)";for(let i=0;i<32;i++)ctx.fillRect((i*61)%640,(i*37)%400,2,2);
   if(!paused.current&&!over){
    const left=held.current.has("ArrowLeft")||held.current.has("KeyA"),right=held.current.has("ArrowRight")||held.current.has("KeyD");
    if(kind==="pong"){
     paddle.y=Math.max(10,Math.min(310,pointer.current-45+(left?-190*dt:0)+(right?190*dt:0)));
     ball.x+=ball.vx*dt;ball.y+=ball.vy*dt;
     if(ball.y<ball.r||ball.y>400-ball.r)ball.vy*=-1;
     const aiY=200+Math.sin(now/800)*90;
     if(ball.x<30&&ball.y>paddle.y&&ball.y<paddle.y+90){ball.vx=Math.abs(ball.vx)*1.02;}
     if(ball.x>602&&Math.abs(ball.y-aiY)<50){ball.vx=-Math.abs(ball.vx)*1.02;}
     if(ball.x<0){over=true;setLost(true);}if(ball.x>640){points++;setScore(points);ball={x:320,y:Math.random()*250+80,vx:-185,vy:155,r:8};}
     ctx.fillStyle="#dadada";ctx.fillRect(20,paddle.y,12,90);ctx.fillRect(608,aiY-45,12,90);
    }else if(kind==="breakout"){
     if(left)paddle.x-=360*dt;if(right)paddle.x+=360*dt;
     if(!left&&!right)paddle.x+=(pointer.current-paddle.w/2-paddle.x)*Math.min(1,dt*12);
     paddle.x=Math.max(0,Math.min(640-paddle.w,paddle.x));
     ball.x+=ball.vx*dt;ball.y+=ball.vy*dt;
     if(ball.x<ball.r||ball.x>640-ball.r)ball.vx*=-1;if(ball.y<ball.r)ball.vy=Math.abs(ball.vy);
     if(ball.y+ball.r>paddle.y&&ball.y<paddle.y+paddle.h&&ball.x>paddle.x&&ball.x<paddle.x+paddle.w){
      ball.vy=-Math.abs(ball.vy);ball.vx+=(ball.x-(paddle.x+paddle.w/2))*1.6;
     }
     if(ball.y>405){over=true;setLost(true);}
     for(const e of enemies)if(e.alive){
      if(Math.abs(ball.x-e.x)<29&&Math.abs(ball.y-e.y)<13){e.alive=false;ball.vy*=-1;points+=10;setScore(points);break;}
     }
     if(enemies.every(e=>!e.alive)){over=true;setLost(true);}
     ctx.fillStyle="#dedede";ctx.fillRect(paddle.x,paddle.y,paddle.w,paddle.h);
     for(const e of enemies)if(e.alive){ctx.fillStyle=e.y<70?"#a3b2bd":"#6d879a";ctx.fillRect(e.x-27,e.y-10,54,19);}
    }else{
     if(left)ship-=290*dt;if(right)ship+=290*dt;ship=Math.max(24,Math.min(615,ship));
     cooldown-=dt;if((held.current.has("Space")||pointer.current>=0)&&cooldown<=0){bullets.push({x:ship,y:345});cooldown=.48;pointer.current=-1;}
     for(let i=bullets.length-1;i>=0;i--){bullets[i].y-=350*dt;if(bullets[i].y<0){bullets.splice(i,1);continue;}
      for(const e of enemies)if(e.alive&&Math.abs(bullets[i].x-e.x)<21&&Math.abs(bullets[i].y-e.y)<14){e.alive=false;bullets.splice(i,1);points+=10;setScore(points);break;}
     }
     const drift=Math.sin(now/1200)*35;for(const e of enemies){e.x+=Math.sin(now/950+e.y)*dt*12;e.y+=dt*2;}
     ctx.fillStyle="#d7d7d7";ctx.beginPath();ctx.moveTo(ship,335);ctx.lineTo(ship-17,377);ctx.lineTo(ship+17,377);ctx.fill();
     ctx.fillStyle="#fafafa";for(const b of bullets)ctx.fillRect(b.x-2,b.y,4,12);
     ctx.fillStyle="#9cbaca";for(const e of enemies)if(e.alive){ctx.beginPath();ctx.arc(e.x+drift*.06,e.y,13,0,Math.PI*2);ctx.fill();}
     if(enemies.every(e=>!e.alive)){over=true;setLost(true);}
    }
   }
   if(kind!=="space"){ctx.fillStyle="#efefef";ctx.beginPath();ctx.arc(ball.x,ball.y,ball.r,0,Math.PI*2);ctx.fill();}
   ctx.fillStyle="#fff";ctx.font="17px monospace";ctx.fillText("SCORE "+points,16,22);
   if(over){ctx.fillStyle="#fff";ctx.font="26px monospace";ctx.fillText(kind==="space"||points>0?"ROUND OVER":"GAME OVER",220,208);}
   raf=requestAnimationFrame(render);
  };
  raf=requestAnimationFrame(render);
  return()=>{cancelAnimationFrame(raf);window.removeEventListener("keydown",down);window.removeEventListener("keyup",up);held.current.clear();};
 },[kind,round]);
 return <div className="space-y-3">
  <div className="flex items-center justify-between text-sm"><span>{en?"Score":"Punkty"}: {score}</span><button type="button" className={button} onClick={()=>{setLost(false);setScore(0);setRound(n=>n+1);}}><RefreshCcw size={15}/>{en?"Restart":"Restart"}</button></div>
  <canvas ref={canvas} width={640} height={400} onPointerMove={e=>{const r=e.currentTarget.getBoundingClientRect();pointer.current=(e.clientX-r.left)/r.width*640;}}
   onPointerDown={e=>{const r=e.currentTarget.getBoundingClientRect();pointer.current=(e.clientX-r.left)/r.width*640;}}
   className="aspect-[8/5] w-full touch-none rounded-xl border border-white/20 bg-[#080e18]" aria-label={en?"Arcade game canvas":"Plansza gry arcade"}/>
  <div className="flex justify-center gap-3">{[["ArrowLeft",ArrowLeft],["ArrowRight",ArrowRight],["Space",Trophy]] .map(([key,Icon])=>{const K=Icon as typeof ArrowLeft;return <button type="button" key={key as string} className={button} onPointerDown={()=>held.current.add(key as string)} onPointerUp={()=>held.current.delete(key as string)} onPointerLeave={()=>held.current.delete(key as string)}><K size={19}/></button>})}</div>
  <p className="text-center text-xs text-white/55">{en?"Arrow keys / touch to move. Space to shoot.":"Strzałki lub dotyk — sterowanie, spacja — strzał."}</p>
  {lost&&<p className="text-center text-sm">{en?"Round finished.":"Runda zakończona."}</p>}
 </div>;
}
