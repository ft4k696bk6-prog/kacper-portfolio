export type Direction = "up" | "down" | "left" | "right";
export const ARCADE_GAMES = [
 {id:"reflex",pl:"Test refleksu",en:"Reaction test",plDesc:"Złap zielony sygnał i pobij swój wynik.",enDesc:"React when the signal turns green."},
 {id:"kids",pl:"Klawiaturowa galaktyka",en:"Keyboard Galaxy",plDesc:"Kosmos, litery i efekty na dotyk.",enDesc:"A touch-friendly galaxy of letters and stars."},
 {id:"memory",pl:"Memory",en:"Memory pairs",plDesc:"Odkrywaj i zapamiętuj 6 par kart.",enDesc:"Find six matching pairs."},
 {id:"tictactoe",pl:"Kółko i krzyżyk",en:"Tic-tac-toe",plDesc:"Zagraj przeciwko komputerowi.",enDesc:"Challenge the computer."},
 {id:"merge",pl:"2048",en:"2048",plDesc:"Łącz kafelki i zdobądź 2048.",enDesc:"Merge tiles and reach 2048."},
 {id:"snake",pl:"Snake",en:"Snake",plDesc:"Zbieraj punkty, nie uderz w ścianę.",enDesc:"Collect food, avoid the walls."},
 {id:"mines",pl:"Saper",en:"Minesweeper",plDesc:"Odkryj pola, omijaj miny.",enDesc:"Reveal cells without hitting a mine."},
 {id:"math",pl:"Szybka matematyka",en:"Quick math",plDesc:"10 pytań na szybkość i celność.",enDesc:"Ten quick arithmetic questions."},
 {id:"guess",pl:"Zgadnij liczbę",en:"Guess the number",plDesc:"Odgadnij liczbę od 1 do 100.",enDesc:"Find a secret number from 1 to 100."},
 {id:"target",pl:"Łap cel",en:"Target rush",plDesc:"Trafiaj pojawiające się cele przez 20 sekund.",enDesc:"Hit as many targets as you can in 20 seconds."}
] as const;
export type ArcadeId = typeof ARCADE_GAMES[number]["id"];
export const newSecret = () => 1 + Math.floor(Math.random() * 100);
export function shuffled<T>(array: readonly T[]): T[] {
 const copy=[...array];
 for(let i=copy.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]];}
 return copy;
}
export function memoryCards():string[] {
 return shuffled(["◆","●","▲","★","♥","♣"].flatMap(x=>[x,x]));
}
export function tttWinner(cells:readonly string[]):"X"|"O"|"draw"|null {
 for(const [a,b,c] of [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]){
  if(cells[a]&&cells[a]===cells[b]&&cells[b]===cells[c])return cells[a] as "X"|"O";
 }
 return cells.every(Boolean)?"draw":null;
}
export function tttBotMove(cells:readonly string[]):number {
 const possible=cells.map((v,i)=>v?-1:i).filter(i=>i!==-1);
 for(const mark of ["O","X"]){
  for(const i of possible){const trial=[...cells];trial[i]=mark;if(tttWinner(trial)===mark)return i;}
 }
 if(possible.includes(4))return 4;
 return shuffled(possible)[0]??-1;
}
export function spawnTile(board: readonly number[]):number[] {
 const next=[...board];const empty=next.map((v,i)=>v===0?i:-1).filter(i=>i>=0);
 if(empty.length){next[empty[Math.floor(Math.random()*empty.length)]]=Math.random()<.9?2:4;}
 return next;
}
export function new2048():number[] {return spawnTile(spawnTile(Array(16).fill(0)));}
export function move2048(board:readonly number[],direction:Direction):{board:number[];changed:boolean;score:number}{
 if(board.length!==16)throw new Error("Invalid 2048 board");
 const out=Array(16).fill(0);let score=0;
 for(let line=0;line<4;line++){
  const indices=Array.from({length:4},(_,n)=>{
   if(direction==="left")return line*4+n;
   if(direction==="right")return line*4+3-n;
   if(direction==="up")return n*4+line;
   return (3-n)*4+line;
  });
  const compact=indices.map(i=>board[i]).filter(Boolean);
  const values:number[]=[];
  for(let i=0;i<compact.length;i++){
   if(i+1<compact.length&&compact[i]===compact[i+1]){const merged=compact[i]*2;values.push(merged);score+=merged;i++;}
   else values.push(compact[i]);
  }
  indices.forEach((index,i)=>{out[index]=values[i]||0;});
 }
 return {board:out,changed:out.some((v,i)=>v!==board[i]),score};
}
export function canMove2048(board:readonly number[]):boolean {
 if(board.includes(0))return true;
 return (["up","down","left","right"] as Direction[]).some(d=>move2048(board,d).changed);
}
export type MineCell={mine:boolean;count:number;shown:boolean;flag:boolean};
export function newMineBoard(size=7,bombs=7,safeIndex=0):MineCell[] {
 if(size<2||bombs>=size*size||safeIndex<0||safeIndex>=size*size)throw new Error("Invalid mines");
 const mines=new Set(shuffled(Array.from({length:size*size},(_,i)=>i).filter(i=>i!==safeIndex)).slice(0,bombs));
 return Array.from({length:size*size},(_,i)=>({
  mine:mines.has(i),count:neighbors(i,size).filter(n=>mines.has(n)).length,shown:false,flag:false
 }));
}
export function neighbors(i:number,size:number):number[]{
 const r=Math.floor(i/size),c=i%size;const out:number[]=[];
 for(let dr=-1;dr<=1;dr++)for(let dc=-1;dc<=1;dc++){
  const rr=r+dr,cc=c+dc;
  if((dr||dc)&&rr>=0&&rr<size&&cc>=0&&cc<size)out.push(rr*size+cc);
 }
 return out;
}
export function revealMineBoard(board:readonly MineCell[],index:number,size=7):MineCell[]{
 if(!board[index]||board[index].shown||board[index].flag)return [...board];
 const copy=board.map(cell=>({...cell}));const queue=[index],seen=new Set<number>();
 while(queue.length){
  const i=queue.pop()!;if(seen.has(i)||copy[i].shown||copy[i].flag)continue;
  seen.add(i);copy[i].shown=true;
  if(copy[i].mine)continue;
  if(copy[i].count===0)queue.push(...neighbors(i,size).filter(j=>!copy[j].mine));
 }
 return copy;
}
export function minesWon(board:readonly MineCell[]):boolean {return board.every(c=>c.mine||c.shown);}
export type SnakeState={body:number[];food:number;alive:boolean;won:boolean;points:number};
export function initialSnake():SnakeState{return {body:[77,76,75],food:40,alive:true,won:false,points:0};}
export function nextSnake(s:SnakeState,d:Direction,size=12):SnakeState {
 if(!s.alive||s.won)return s;
 const head=s.body[0],r=Math.floor(head/size),c=head%size;
 const rr=r+(d==="down"?1:d==="up"?-1:0),cc=c+(d==="right"?1:d==="left"?-1:0);
 if(rr<0||rr>=size||cc<0||cc>=size)return {...s,alive:false};
 const next=rr*size+cc,eat=next===s.food;
 if(s.body.slice(0,eat?undefined:-1).includes(next))return {...s,alive:false};
 const body=[next,...s.body.slice(0,eat?undefined:-1)];
 if(!eat)return {...s,body};
 const available=Array.from({length:size*size},(_,i)=>i).filter(i=>!body.includes(i));
 if(!available.length)return {body,food:-1,alive:true,won:true,points:s.points+1};
 return {body,food:available[Math.floor(Math.random()*available.length)],alive:true,won:false,points:s.points+1};
}
export type MathQuestion={text:string;answers:number[];correct:number};
export function mathQuestion():MathQuestion {
 const op=Math.floor(Math.random()*3);
 let a=2+Math.floor(Math.random()*19),b=2+Math.floor(Math.random()*15);
 if(op===1&&b>a)[a,b]=[b,a];
 const correct=op===0?a+b:op===1?a-b:a*b;
 const options=new Set<number>([correct]);
 for(let step=1;options.size<3&&step<12;step++){
  const delta=step%2?step:-step;
  if(correct+delta>=0)options.add(correct+delta);
 }
 return {text:String(a)+(op===0?" + ":op===1?" − ":" × ")+String(b),correct,answers:shuffled([...options].slice(0,3))};
}
