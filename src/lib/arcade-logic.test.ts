import {describe,expect,it} from "vitest";
import {ARCADE_GAMES,canMove2048,initialSnake,mathQuestion,memoryCards,minesWon,move2048,new2048,newMineBoard,nextSnake,revealMineBoard,tttBotMove,tttWinner} from "./arcade-logic";

describe("arcade catalog and game rules",()=>{
 it("offers twelve distinct games for Polish and English visitors",()=>{
  expect(ARCADE_GAMES).toHaveLength(12);
  expect(new Set(ARCADE_GAMES.map(x=>x.id)).size).toBe(12);
  expect(ARCADE_GAMES.some(g=>g.id==="maze")).toBe(true);
  expect(ARCADE_GAMES.some(g=>g.id==="fps")).toBe(true);
  for(const g of ARCADE_GAMES){
   expect(g.pl.length).toBeGreaterThan(2);expect(g.en.length).toBeGreaterThan(2);
   expect(g.plDesc.length).toBeGreaterThan(12);expect(g.enDesc.length).toBeGreaterThan(12);
  }
 });
 it("memory cards contain six pairs and no extras",()=>{
  const d=memoryCards();expect(d).toHaveLength(12);
  for(const s of new Set(d))expect(d.filter(x=>x===s)).toHaveLength(2);
 });
 it("tic-tac-toe detects wins and bot blocks immediate wins",()=>{
  expect(tttWinner(["X","X","X","","","","","",""])).toBe("X");
  expect(tttWinner(["X","O","X","X","O","O","O","X","X"])).toBe("draw");
  expect(tttBotMove(["X","X","","O","","","","",""])).toBe(2);
 });
 it("2048 handles one merge per tile per move and full-grid check",()=>{
  const b=[2,2,2,2,...Array(12).fill(0)];
  const r=move2048(b,"left");
  expect(r.board.slice(0,4)).toEqual([4,4,0,0]);
  expect(r.score).toBe(8);expect(r.changed).toBe(true);
  expect(move2048(r.board,"left").board.slice(0,4)).toEqual([8,0,0,0]);
  const initial=new2048();expect(initial.filter(Boolean)).toHaveLength(2);
  expect(canMove2048([2,4,2,4,4,2,4,2,2,4,2,4,4,2,4,2])).toBe(false);
 });
 it("mines have a safe first click and flood-fill stays in bounds",()=>{
  const b=newMineBoard(7,7,24);
  expect(b).toHaveLength(49);expect(b.filter(x=>x.mine)).toHaveLength(7);expect(b[24].mine).toBe(false);
  const r=revealMineBoard(b,24,7);expect(r[24].shown).toBe(true);
  expect(r.every((v,i)=>v.mine?(!v.shown):true)).toBe(true);
  const all=b.map(x=>({...x,shown:!x.mine}));
  expect(minesWon(all)).toBe(true);
 });
 it("snake advances, grows on food and ends at walls",()=>{
  const initial=initialSnake();
  const advanced=nextSnake(initial,"right");
  expect(advanced.body).toHaveLength(3);
  expect(advanced.body[0]).toBe(78);
  const growing=nextSnake({...initial,food:78},"right");
  expect(growing.body).toHaveLength(4);expect(growing.points).toBe(1);
  expect(nextSnake({...initial,body:[11,10,9]},"right").alive).toBe(false);
 });
 it("math questions always contain the correct answer",()=>{
  for(let i=0;i<50;i++){
   const q=mathQuestion();expect(q.answers).toHaveLength(3);
   expect(new Set(q.answers).size).toBe(3);
   expect(q.answers).toContain(q.correct);
  }
 });
});
