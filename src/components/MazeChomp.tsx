"use client";
import {useCallback,useEffect,useRef,useState} from "react";
import {ArrowDown,ArrowLeft,ArrowRight,ArrowUp,Pause,Play,RotateCcw} from "lucide-react";
import type {Direction} from "@/lib/arcade-logic";

const raw=[
 "###############",
 "#P.....#....G.#",
 "#.###..#..###.#",
 "#.....#.......#",
 "#.###...###...#",
 "#...#.#...#...#",
 "###.#.###.#.#.#",
 "#...#.....#.#.#",
 "#.####.####.#.#",
 "#......#......#",
 "#.####.#.####.#",
 "#.....#.......#",
 "#.###.###.###.#",
 "#G............#",
 "###############"
];
const width=15;
const maze=raw.join("");
const origin=maze.indexOf("P");
const ghostOrigins=Array.from(maze.matchAll(/G/g),match=>match.index);
const directions:Direction[]=["up","right","down","left"];
const delta:Record<Direction,[number,number]>={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]};
const nextCell=(position:number,d:Direction)=>{
 const x=position%width,y=Math.floor(position/width),[dx,dy]=delta[d];
 const xx=x+dx,yy=y+dy;
 if(xx<0||xx>=width||yy<0||yy>=raw.length)return position;
 const target=yy*width+xx;
 return maze[target]==="#"?position:target;
};
const distance=(a:number,b:number)=>Math.abs(a%width-b%width)+Math.abs(Math.floor(a/width)-Math.floor(b/width));
type Game={player:number;ghosts:number[];pellets:number[];lives:number;score:number;tick:number;immune:number;running:boolean;won:boolean};
const fresh=():Game=>({player:origin,ghosts:[...ghostOrigins],pellets:Array.from(maze, (c,i)=>c==="."?i:-1).filter(i=>i>=0),lives:3,score:0,tick:0,immune:0,running:false,won:false});
const keyDirections:Record<string,Direction>={ArrowUp:"up",ArrowRight:"right",ArrowDown:"down",ArrowLeft:"left",w:"up",d:"right",s:"down",a:"left"};
const button="flex min-h-12 min-w-12 touch-manipulation items-center justify-center rounded-xl border border-white/25 bg-white/10 text-white active:bg-white/30";

export function MazeChomp({lang}:{lang:"pl"|"en"}){
 const en=lang==="en";
 const [game,setGame]=useState<Game>(fresh);
 const wanted=useRef<Direction>("right");
 const heading=useRef<Direction>("right");
 const start=()=>{wanted.current="right";heading.current="right";setGame({...fresh(),running:true});};
 const turn=useCallback((direction:Direction)=>{wanted.current=direction;setGame(g=>g.lives>0&&!g.won?{...g,running:true}:g);},[]);
 useEffect(()=>{
  const onKey=(event:KeyboardEvent)=>{
   if(["INPUT","TEXTAREA","SELECT"].includes((event.target as HTMLElement)?.tagName))return;
   const d=keyDirections[event.key];
   if(d){event.preventDefault();turn(d);}
  };
  window.addEventListener("keydown",onKey);
  return()=>window.removeEventListener("keydown",onKey);
 },[turn]);
 useEffect(()=>{
  if(!game.running||game.won||game.lives===0)return;
  const timer=window.setInterval(()=>setGame(old=>{
   if(!old.running||old.lives<=0||old.won)return old;
   let player=nextCell(old.player,wanted.current);
   if(player!==old.player)heading.current=wanted.current;
   else player=nextCell(old.player,heading.current);
   const ate=old.pellets.includes(player);
   const pellets=ate?old.pellets.filter(p=>p!==player):old.pellets;
   const ghosts=old.tick%2===0?old.ghosts.map((ghost,index)=>{
    const options=directions.map(d=>nextCell(ghost,d)).filter(p=>p!==ghost);
    if(!options.length)return ghost;
    const ranked=options.sort((a,b)=>distance(a,player)-distance(b,player));
    return Math.random()<.23?ranked[(old.tick+index)%ranked.length]:ranked[0];
   }):old.ghosts;
   const hit=old.immune<=0&&(ghosts.includes(player)||old.ghosts.includes(player));
   const lives=hit?old.lives-1:old.lives;
   return {player:hit?origin:player,ghosts:hit?[...ghostOrigins]:ghosts,pellets,lives,score:old.score+(ate?10:0),tick:old.tick+1,immune:hit?10:Math.max(0,old.immune-1),running:lives>0&&pellets.length>0,won:pellets.length===0};
  }),175);
  return()=>window.clearInterval(timer);
 },[game.running,game.won,game.lives]);
 const foods=new Set(game.pellets);
 const dead=game.lives===0;
 return <section className="rounded-2xl border border-white/15 bg-[#111] p-4 sm:p-6">
  <div className="flex flex-wrap items-start justify-between gap-4">
   <div><p className="text-[10px] font-semibold uppercase tracking-[.2em] text-white/45">{en?"ORIGINAL MAZE ARCADE":"AUTORSKA GRA LABIRYNTOWA"}</p>
    <h2 className="mt-2 text-2xl font-semibold">{en?"Maze Chomp — Pac-Man style":"Pożeracz labiryntu — styl Pac-Man"}</h2>
    <p className="mt-2 text-sm leading-6 text-white/60">{en?"Collect all dots and avoid two chasing ghosts. Swipe-free touch buttons and keyboard controls.":"Zbieraj kropki i unikaj dwóch duchów. Steruj przyciskami na ekranie albo strzałkami i WASD."}</p></div>
   <button type="button" onClick={start} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/25 px-4 text-sm"><RotateCcw size={16}/>{en?"Restart":"Od nowa"}</button>
  </div>
  <div className="my-5 flex flex-wrap items-center justify-between gap-3 text-sm"><p>{en?"Score":"Punkty"}: <strong>{game.score}</strong> <span className="mx-2 text-white/30">|</span> {en?"Lives":"Życia"}: <strong>{game.lives}</strong></p><p className="text-white/60">{en?"Dots left":"Pozostało kropek"}: {game.pellets.length}</p></div>
  <div className="mx-auto grid w-full max-w-[510px] overflow-hidden rounded-xl border border-white/20 bg-[#080b13] p-1 touch-none" style={{gridTemplateColumns:"repeat(15,minmax(0,1fr))"}}>
   {Array.from(maze,(tile,i)=>{
    const wall=tile==="#",isPlayer=game.player===i&&!(game.immune>0&&game.tick%2===0);
    const ghost=game.ghosts.indexOf(i);
    return <div key={i} className={"relative aspect-square min-w-0 "+(wall?"rounded-[3px] border border-sky-300/20 bg-[#243f75] shadow-[inset_0_0_6px_#5e86b655]":"bg-[#080b13]")}>
     {!wall&&foods.has(i)&&<span className="absolute left-1/2 top-1/2 size-[18%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-100/85"/>}
     {isPlayer&&<span className="absolute inset-[10%] z-10 rounded-full bg-yellow-300 shadow-[0_0_12px_#facc15aa]"/>}
     {ghost>=0&&<span className={"absolute inset-[9%] z-20 rounded-t-full rounded-b-[35%] "+(ghost===0?"bg-rose-400":"bg-cyan-300")}><span className="absolute left-1/4 top-[35%] size-[21%] rounded-full bg-white"/><span className="absolute right-1/4 top-[35%] size-[21%] rounded-full bg-white"/></span>}
    </div>;
   })}
  </div>
  <div className="mx-auto mt-5 flex max-w-xs flex-col items-center gap-1.5" aria-label={en?"Game controls":"Sterowanie grą"}>
   <button type="button" className={button} onClick={()=>turn("up")} aria-label={en?"Up":"Góra"}><ArrowUp size={21}/></button>
   <div className="flex gap-1.5">
    <button type="button" className={button} onClick={()=>turn("left")} aria-label={en?"Left":"Lewo"}><ArrowLeft size={21}/></button>
    <button type="button" className={button+" px-4 text-xs"} onClick={()=>setGame(g=>g.lives>0&&!g.won?{...g,running:!g.running}:g)} aria-label={en?"Pause or resume":"Pauza lub graj"}>{game.running?<Pause size={18}/>:<Play size={18}/>}</button>
    <button type="button" className={button} onClick={()=>turn("right")} aria-label={en?"Right":"Prawo"}><ArrowRight size={21}/></button>
   </div>
   <button type="button" className={button} onClick={()=>turn("down")} aria-label={en?"Down":"Dół"}><ArrowDown size={21}/></button>
  </div>
  {(dead||game.won)&&<p className="mt-4 text-center text-lg font-semibold" role="status">{game.won?(en?"You cleared the maze!":"Labirynt wyczyszczony!"):en?"Game over — restart to try again.":"Koniec gry — spróbuj ponownie."}</p>}
  {!game.running&&!game.won&&!dead&&<p className="mt-3 text-center text-xs text-white/50">{en?"Tap a direction or Play to begin.":"Dotknij kierunku albo Play, żeby rozpocząć."}</p>}
 </section>;
}
