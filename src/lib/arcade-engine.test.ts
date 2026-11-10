import {describe,it,expect} from "vitest";
import {addTile,makeMines,move2048,revealMines,stepSnake,wordHints} from "./arcade-engine";
describe("arcade game mechanics",()=>{
 it("2048 merges each tile once and scores correctly",()=>{
  const b=[2,2,2,2,...Array(12).fill(0)];
  const m=move2048(b,"left");expect(m.board.slice(0,4)).toEqual([4,4,0,0]);expect(m.points).toBe(8);
  const r=move2048(b,"right");expect(r.board.slice(0,4)).toEqual([0,0,4,4]);
  expect(addTile(Array(16).fill(0),()=>0).filter(Boolean)).toHaveLength(1);
 });
 it("snake collision and eating rules",()=>{
  const b=[{x:2,y:2},{x:1,y:2}];
  expect(stepSnake(b,{x:1,y:0},{x:3,y:2}).ate).toBe(true);
  expect(stepSnake(b,{x:-1,y:0},{x:8,y:8}).dead).toBe(false);
  expect(stepSnake(b,{x:0,y:-3},{x:8,y:8}).dead).toBe(true);
 });
 it("minefield avoids first click and reveals safe space",()=>{
  const m=makeMines(64,10,0,()=>0.02);expect(m.filter(x=>x.mine)).toHaveLength(10);
  expect(m[0].mine).toBe(false);expect(revealMines(m,0)[0].open).toBe(true);
 });
 it("word hint never marks more duplicate letters than available",()=>{
  expect(wordHints("APPLE","PAPAL")).toEqual(["present","present","hit","miss","present"]);
 });
});
