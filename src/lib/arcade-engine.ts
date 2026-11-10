export type Board2048=number[];
export type Slide="left"|"right"|"up"|"down";
function slideRow(row:number[]):{line:number[];points:number}{
 const a=row.filter(n=>n>0);let points=0;
 for(let i=0;i<a.length-1;i++)if(a[i]===a[i+1]){a[i]*=2;points+=a[i];a.splice(i+1,1);}
 while(a.length<4)a.push(0);return {line:a,points};
}
export function move2048(board:Board2048,direction:Slide):{board:Board2048;points:number;changed:boolean}{
 if(board.length!==16)throw Error("2048 board must have 16 tiles");
 const out=[...board];let points=0;
 for(let index=0;index<4;index++){
  const ids=Array.from({length:4},(_,j)=>direction==="left"||direction==="right"?index*4+j:j*4+index);
  if(direction==="right"||direction==="down")ids.reverse();
  const v=slideRow(ids.map(i=>board[i]));points+=v.points;
  ids.forEach((id,j)=>out[id]=v.line[j]);
 }
 return {board:out,points,changed:out.some((v,i)=>v!==board[i])};
}
export function addTile(board:Board2048,random:()=>number=Math.random):Board2048{
 const empty=board.map((x,i)=>x===0?i:-1).filter(i=>i>=0);if(!empty.length)return [...board];
 const index=empty[Math.floor(random()*empty.length)];const out=[...board];out[index]=random()<.9?2:4;return out;
}
export type SnakePoint={x:number;y:number};
export function stepSnake(body:SnakePoint[],direction:SnakePoint,food:SnakePoint,size=16):{body:SnakePoint[];dead:boolean;ate:boolean}{
 if(!body.length)return {body:[],dead:true,ate:false};
 const head={x:body[0].x+direction.x,y:body[0].y+direction.y};
 const ate=head.x===food.x&&head.y===food.y;
 const collides=(ate?body:body.slice(0,-1)).some(p=>p.x===head.x&&p.y===head.y);
 if(head.x<0||head.y<0||head.x>=size||head.y>=size||collides)return {body,dead:true,ate:false};
 return {body:[head,...body.slice(0,ate?undefined:-1)],ate,dead:false};
}
export type MineCell={mine:boolean;near:number;open:boolean;flag:boolean};
export function makeMines(total=64,count=10,skip=-1,random:()=>number=Math.random):MineCell[]{
 if(total<2||count<1||count>=total||skip>=total)throw Error("Invalid minefield");
 const cells=Array.from({length:total},()=>({mine:false,near:0,open:false,flag:false}));
 let spots=0;while(spots<count){const i=Math.floor(random()*total);if(i!==skip&&!cells[i].mine){cells[i].mine=true;spots++;}}
 const side=Math.sqrt(total);if(!Number.isInteger(side))throw Error("Square board only");
 for(let i=0;i<total;i++)if(!cells[i].mine){
  const x=i%side,y=Math.floor(i/side);
  for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){
   const nx=x+dx,ny=y+dy;if(nx>=0&&nx<side&&ny>=0&&ny<side&&cells[ny*side+nx].mine)cells[i].near++;
  }
 }return cells;
}
export function revealMines(cells:MineCell[],index:number):MineCell[]{
 const out=cells.map(c=>({...c})),side=Math.sqrt(out.length),stack=[index];
 while(stack.length){const i=stack.pop()!;const c=out[i];if(!c||c.open||c.flag)continue;c.open=true;
  if(c.near===0&&!c.mine){const x=i%side,y=Math.floor(i/side);
   for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const nx=x+dx,ny=y+dy;if(nx>=0&&nx<side&&ny>=0&&ny<side&&!out[ny*side+nx].open)stack.push(ny*side+nx);}
  }
 }return out;
}
export function wordHints(answer:string,guess:string):("hit"|"present"|"miss")[]{
 const result=Array.from({length:guess.length},()=> "miss" as "hit"|"present"|"miss");
 const count=new Map<string,number>();
 for(let i=0;i<answer.length;i++)if(guess[i]===answer[i])result[i]="hit";else count.set(answer[i],(count.get(answer[i])||0)+1);
 for(let i=0;i<guess.length;i++)if(result[i]!=="hit"&&(count.get(guess[i])||0)>0){result[i]="present";count.set(guess[i],(count.get(guess[i])||0)-1);}
 return result;
}
