import type { SignatureFields } from "./everyday-utils";

export type SignatureMotion = "geometry"|"slices"|"cinematic"|"reveal"|"slide"|"pulse";
export type SceneAssets={logo:HTMLImageElement|null;photo:HTMLImageElement|null};
export const SCENE_WIDTH=520,SCENE_HEIGHT=208;

const clamp=(v:number)=>Math.max(0,Math.min(1,v));
const ease=(v:number)=>1-Math.pow(1-clamp(v),3);
const phase=(p:number,start:number,end:number)=>ease((p-start)/(end-start));
const hex=(s:string)=>/^#[\da-f]{6}$/i.test(s)?s:"#8a8a8a";
const nameOf=(f:SignatureFields)=>f.name||(f.language==="en"?"Your name":"Imię i nazwisko");
const brandOf=(f:SignatureFields)=>f.company||(f.language==="en"?"YOUR COMPANY":"TWOJA FIRMA");
const roleOf=(f:SignatureFields)=>f.role||(f.language==="en"?"Position":"Stanowisko");

export function loadSignatureSceneAssets(fields:SignatureFields):Promise<SceneAssets>{
 const load=(src?:string):Promise<HTMLImageElement|null>=>{
  if(!src||typeof Image==="undefined")return Promise.resolve(null);
  return new Promise(resolve=>{
   const image=new Image();
   if(/^https?:/i.test(src))image.crossOrigin="anonymous";
   image.onload=()=>resolve(image);
   image.onerror=()=>resolve(null);
   image.src=src;
  });
 };
 return Promise.all([load(fields.logo),load(fields.photo)]).then(([logo,photo])=>({logo,photo}));
}
function polygon(c:CanvasRenderingContext2D,pts:number[][]){
 c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();
}
function rounded(c:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,r=10){
 c.beginPath();c.roundRect(x,y,w,h,r);
}
function text(c:CanvasRenderingContext2D,value:string,x:number,y:number,max:number,font:string,color:string,opacity=1){
 if(!value||opacity<=0)return;
 c.save();c.globalAlpha=clamp(opacity);c.fillStyle=color;c.font=font;c.textBaseline="alphabetic";
 c.fillText(value.slice(0,96),x,y,max);c.restore();
}
function cover(c:CanvasRenderingContext2D,img:HTMLImageElement|null,x:number,y:number,w:number,h:number,bg="#d0cdd4",focusX=50,focusY=42){
 c.fillStyle=bg;c.fillRect(x,y,w,h);
 if(img){
  const ratio=Math.max(w/img.naturalWidth,h/img.naturalHeight);
  const dw=img.naturalWidth*ratio,dh=img.naturalHeight*ratio;
  c.drawImage(img,x+(w-dw)*clamp(focusX/100),y+(h-dh)*clamp(focusY/100),dw,dh);
 }else{
  c.fillStyle="#aaa6b1";c.beginPath();c.arc(x+w*.5,y+h*.31,w*.20,0,Math.PI*2);c.fill();
  c.beginPath();c.ellipse(x+w*.5,y+h*1.02,w*.42,h*.49,0,0,Math.PI*2);c.fill();
 }
}
function photoPiece(c:CanvasRenderingContext2D,img:HTMLImageElement|null,
 pts:number[][],x:number,y:number,w:number,h:number,opacity:number,dx=0,dy=0,bg="#d0cdd4",focusX=50,focusY=42){
 if(opacity<=0)return;
 c.save();c.globalAlpha=clamp(opacity);polygon(c,pts.map(([a,b])=>[a+dx,b+dy]));c.clip();
 cover(c,img,x+dx,y+dy,w,h,bg,focusX,focusY);c.restore();
}
function logo(c:CanvasRenderingContext2D,f:SignatureFields,img:HTMLImageElement|null,x:number,y:number,
 maxW:number,maxH:number,p:number,color="#242328",size=20){
 if(p<=0)return;
 c.save();c.globalAlpha=clamp(p);
 if(img){
  const scale=Math.min(maxW/img.naturalWidth,maxH/img.naturalHeight);
  c.drawImage(img,x,y,img.naturalWidth*scale,img.naturalHeight*scale);
 }else text(c,brandOf(f).toUpperCase(),x,y+Math.min(size,maxH),maxW,"bold "+size+"px Arial",color);
 c.restore();
}
function rule(c:CanvasRenderingContext2D,x:number,y:number,w:number,color:string,p:number,h=2){
 if(p<=0)return;c.fillStyle=color;c.globalAlpha=clamp(p);c.fillRect(x,y,w*clamp(p),h);c.globalAlpha=1;
}
/**
 * Reference-derived composition (user-supplied video):
 * - static white signature card / contact details
 * - left icon rail stays separate clickable HTML
 * - the wordmark reveals left-to-right over the existing copy
 * - the portrait assembles bottom-to-top in three diagonal shards
 * - grey solid facet sits BEHIND the portrait, never across the face
 *
 * The same scene renders to the live preview and the exported GIF.
 */
/**
 * One photo, three PARALLEL equal-width parallelograms. Widths, slant and
 * gutters are computed rather than manually positioning arbitrary polygons.
 * All fragments draw the same uncropped source transform. Hence each eye,
 * facial feature and garment edge continues perfectly across the gutters.
 */
export const REFERENCE_PHOTO_GRID={
 topY:34,
 bottomY:195,
 bottomStartX:303,
 bandWidth:46,
 gapWidth:5,
 topShiftX:58,
 bandCount:3,
 photoX:291,
 photoY:12,
 photoW:227,
 photoH:193
} as const;

export function referencePhotoPolygons():number[][][]{
 const g=REFERENCE_PHOTO_GRID;
 return Array.from({length:g.bandCount},(_,i)=>{
  const x=g.bottomStartX+i*(g.bandWidth+g.gapWidth);
  return [
   [x+g.topShiftX,g.topY],
   [x+g.topShiftX+g.bandWidth,g.topY],
   [x+g.bandWidth,g.bottomY],
   [x,g.bottomY]
  ];
 });
}

function sceneGeometry(c:CanvasRenderingContext2D,f:SignatureFields,a:SceneAssets,p:number){
 const accent=hex(f.accent),g=REFERENCE_PHOTO_GRID;
 c.fillStyle="#fff";c.fillRect(0,0,SCENE_WIDTH,SCENE_HEIGHT);

 // Contact copy is fixed, as in the supplied reference video.
 text(c,nameOf(f),27,102,267,"bold 23px Arial","#19181e",1);
 text(c,roleOf(f),27,122,266,"13px Arial","#605e68",1);
 text(c,f.company||"",27,147,264,"bold 11px Arial",accent,1);
 text(c,f.email||"",27,169,265,"12px Arial","#56545d",1);
 text(c,f.website||f.phone||"",27,190,266,"12px Arial","#56545d",1);

 // Subtle background facets only; actual PHOTO fragments share one grid.
 // Keep facets BEHIND the portrait instead of covering the face.
 const base=phase(p,.08,.55);
 c.save();c.globalAlpha=base;c.fillStyle="#dedce3";
 polygon(c,[[355,52],[407,52],[353,190],[302,190]]);c.fill();
 c.fillStyle="#696673";polygon(c,[[465,22],[504,22],[454,159],[415,159]]);c.fill();
 c.restore();

 const bands=referencePhotoPolygons();
 const focusX=f.photoFocusX??50, focusY=f.photoFocusY??42;
 // Bottom-up clipping is the reveal. NO lateral shifts: every pixel
 // is sampled at identical canvas coordinates for all three pieces.
 bands.forEach((poly,i)=>{
  const progress=phase(p,.15+i*.07,.65+i*.07);
  if(progress<=0)return;
  c.save();
  c.beginPath();
  c.rect(g.photoX,g.bottomY-(g.bottomY-g.topY)*progress,g.photoW,(g.bottomY-g.topY)*progress);
  c.clip();
  photoPiece(c,a.photo,poly,g.photoX,g.photoY,g.photoW,g.photoH,1,0,0,"#d0cdd4",focusX,focusY);
  c.restore();
 });
 // White, constant-width gutters make the alignment unambiguous even where
 // the grey backing would otherwise show through the cuts.
 const reveal=phase(p,.2,.82);
 if(reveal>0){
  c.save();c.globalAlpha=reveal;c.fillStyle="#fff";
  for(let i=0;i<g.bandCount-1;i++){
   const x=g.bottomStartX+(i+1)*g.bandWidth+i*g.gapWidth;
   polygon(c,[
    [x+g.topShiftX,g.topY],
    [x+g.topShiftX+g.gapWidth,g.topY],
    [x+g.gapWidth,g.bottomY],
    [x,g.bottomY]
   ]);
   c.fill();
  }
  c.restore();
 }

 // The logo is written across the top without moving its final position.
 const symbol=phase(p,.02,.24),wordmark=phase(p,.26,.95);
 const clipFraction=.14*symbol+.86*wordmark;
 if(clipFraction>0){
  c.save();c.beginPath();c.rect(27,19,217*clipFraction,48);c.clip();
  logo(c,f,a.logo,27,22,205,43,1,"#222128",25);c.restore();
 }
}

function sceneSlices(c:CanvasRenderingContext2D,f:SignatureFields,a:SceneAssets,p:number){
 const accent=hex(f.accent);c.fillStyle="#13151b";c.fillRect(0,0,520,208);
 // A genuinely different dark collage, with shutter strips moving vertically.
 c.fillStyle="#20232a";c.fillRect(315,0,205,208);
 const strips=[
  {pts:[[332,0],[390,0],[371,208],[313,208]],begin:.1,end:.45,y:-150},
  {pts:[[385,0],[451,0],[433,208],[366,208]],begin:.3,end:.65,y:160},
  {pts:[[449,0],[521,0],[503,208],[430,208]],begin:.53,end:.87,y:-160}
 ];
 strips.forEach(it=>{
  const t=phase(p,it.begin,it.end);
  photoPiece(c,a.photo,it.pts,305,0,220,208,t,0,(1-t)*it.y,"#8b8a94",f.photoFocusX??50,f.photoFocusY??42);
 });
 c.save();c.globalAlpha=phase(p,.58,.9)*.95;c.fillStyle=accent;
 polygon(c,[[326,0],[341,0],[302,208],[288,208]]);c.fill();c.restore();
 logo(c,f,a.logo,25,27,205,40,phase(p,.2,.47),"#f5f5f8",20);
 text(c,nameOf(f),25,112,290,"bold 28px Arial","#fcfcff",phase(p,.36,.62));
 text(c,roleOf(f),25,134,282,"13px Arial","#b8b9c3",phase(p,.46,.72));
 rule(c,25,146,116,accent,phase(p,.55,.83),3);
 text(c,f.email||"",25,172,280,"12px Arial","#d0d0d8",phase(p,.66,.95));
 text(c,f.website||f.phone||"",25,192,280,"12px Arial","#d0d0d8",phase(p,.72,1));
}
function sceneCinematic(c:CanvasRenderingContext2D,f:SignatureFields,a:SceneAssets,p:number){
 const accent=hex(f.accent);
 c.fillStyle="#f2eee7";c.fillRect(0,0,520,208);
 c.fillStyle="#e4ded4";c.fillRect(315,0,205,208);
 // Magazine composition: central portrait window, oversized brand mark and bottom strap.
 const shutter=phase(p,.24,.72);
 c.save();rounded(c,335,15,151*shutter,151,8);c.clip();cover(c,a.photo,335,15,151,151,"#c8c3c0",f.photoFocusX??50,f.photoFocusY??42);c.restore();
 c.save();c.globalAlpha=phase(p,.50,.86)*.86;c.fillStyle=accent;
 polygon(c,[[488,12],[507,12],[454,175],[433,175]]);c.fill();c.restore();
 c.save();c.globalAlpha=phase(p,.06,.27)*.8;
 text(c,"01  /  STUDIO",26,23,255,"bold 10px Arial","#736e68",1);
 rule(c,26,33,265,"#c3bcb0",1,1);c.restore();
 logo(c,f,a.logo,26,47,210,36,phase(p,.12,.38),"#28231f",19);
 // Unlike premium geometry, name appears in editorial serif type at the very bottom.
 const reveal=phase(p,.4,.8);
 c.save();c.beginPath();c.rect(25,70,275*reveal,102);c.clip();
 text(c,nameOf(f),26,118,274,"bold 28px Georgia","#272321",1);
 text(c,roleOf(f),26,139,270,"italic 14px Georgia","#655c57",1);
 text(c,f.email||"",26,159,270,"11px Arial","#655f59",1);
 c.restore();
 c.save();c.globalAlpha=phase(p,.72,1);c.fillStyle="#292827";c.fillRect(0,180,520,28);
 text(c,(f.website||f.phone||brandOf(f)).toUpperCase(),26,198,460,"bold 11px Arial","#ffffff",phase(p,.73,1));
 c.restore();
}
function sceneReveal(c:CanvasRenderingContext2D,f:SignatureFields,a:SceneAssets,p:number){
 // Minimal horizontal business card. No portrait slices, no gradients.
 c.fillStyle="#fff";c.fillRect(0,0,520,208);
 c.fillStyle="#f4f4f4";c.fillRect(16,18,132,172);
 const t=phase(p,.04,.48);
 c.save();c.beginPath();c.rect(16,18,132*t,172);c.clip();
 logo(c,f,a.logo,29,77,105,65,1,"#202020",22);
 c.restore();
 const v=phase(p,.3,.72);
 c.save();c.beginPath();c.rect(177,24,325*v,165);c.clip();
 text(c,nameOf(f),178,77,305,"bold 24px Arial","#1d1d20",1);
 text(c,roleOf(f),178,100,302,"13px Arial","#65656b",1);
 text(c,brandOf(f),178,127,300,"bold 12px Arial","#58585f",1);
 c.fillStyle="#e6e6e6";c.fillRect(178,138,303,1);
 text(c,f.email||"",178,157,305,"11px Arial","#56565f",1);
 text(c,f.phone||f.website||"",178,176,305,"11px Arial","#56565f",1);
 c.restore();
 rule(c,0,203,520,hex(f.accent),phase(p,.7,1),4);
}
function sceneSlide(c:CanvasRenderingContext2D,f:SignatureFields,a:SceneAssets,p:number){
 // Strong split colour composition, not a minor offset of the minimal template.
 c.fillStyle="#faf9f7";c.fillRect(0,0,520,208);
 const left=phase(p,.03,.5),right=phase(p,.24,.7);
 const tint=hex(f.accent);
 c.save();c.translate(-175*(1-left),0);
 c.fillStyle="#20232a";c.fillRect(0,0,174,208);
 c.fillStyle=tint;c.fillRect(168,0,6,208);
 logo(c,f,a.logo,21,30,132,40,left,"#ffffff",17);
 text(c,(f.company||"STUDIO").toUpperCase(),21,145,142,"bold 16px Arial","#fff",left);
 text(c,"EST. 2026",21,179,130,"10px Arial","#b5b7bf",left);
 c.restore();
 c.save();c.translate((1-right)*80,0);
 text(c,nameOf(f),204,67,268,"bold 25px Arial","#24242a",right);
 text(c,roleOf(f),204,91,270,"13px Arial","#696973",phase(p,.43,.8));
 rule(c,204,112,260,tint,phase(p,.56,.85),2);
 text(c,f.email||"",204,143,267,"12px Arial","#55555f",phase(p,.62,.9));
 text(c,f.website||f.phone||"",204,168,267,"12px Arial","#55555f",phase(p,.72,1));
 c.restore();
}
function scenePulse(c:CanvasRenderingContext2D,f:SignatureFields,a:SceneAssets,p:number){
 // Digital / neon layout: orbit, animated framing and outlined controls.
 const accent=hex(f.accent);
 c.fillStyle="#0c101d";c.fillRect(0,0,520,208);
 c.fillStyle="#1b2333";rounded(c,14,13,492,182,14);c.fill();
 c.save();c.globalAlpha=.65*phase(p,0,.46);c.strokeStyle=accent;c.lineWidth=2;
 rounded(c,14,13,492,182,14);c.stroke();c.restore();
 const orbit=phase(p,.12,.76);
 c.save();c.strokeStyle="#bac4d7";c.lineWidth=1.5;c.globalAlpha=orbit;
 c.beginPath();c.arc(82,103,48,-Math.PI/2,-Math.PI/2+Math.PI*2*orbit);c.stroke();
 c.beginPath();c.arc(82,103,34,Math.PI,Math.PI+Math.PI*2*orbit);c.stroke();
 c.restore();
 c.save();rounded(c,54,74,56,56,9);c.clip();cover(c,a.photo,54,74,56,56,"#37455b",f.photoFocusX??50,f.photoFocusY??42);c.restore();
 logo(c,f,a.logo,163,30,195,40,phase(p,.2,.55),"#f9faff",19);
 text(c,nameOf(f),163,100,295,"bold 23px Arial","#f4f7ff",phase(p,.42,.75));
 text(c,roleOf(f),163,122,290,"12px Arial","#c0c8d6",phase(p,.55,.82));
 text(c,f.email||"",163,151,290,"12px Arial","#c0c8d6",phase(p,.66,.92));
 text(c,f.website||f.phone||"",163,174,290,"12px Arial","#c0c8d6",phase(p,.76,1));
 const laser=phase(p,.3,.94);
 c.save();c.globalAlpha=.7*laser;c.fillStyle=accent;c.fillRect(162,183,298*laser,2);c.restore();
 // Single subtle pulse settles on the last frame instead of repeating constantly.
}

export function renderSignatureScene(c:CanvasRenderingContext2D,fields:SignatureFields,motion:SignatureMotion,progress:number,assets:SceneAssets):void{
 c.save();c.clearRect(0,0,SCENE_WIDTH,SCENE_HEIGHT);
 const p=clamp(progress);
 if(motion==="geometry")sceneGeometry(c,fields,assets,p);
 else if(motion==="slices")sceneSlices(c,fields,assets,p);
 else if(motion==="cinematic")sceneCinematic(c,fields,assets,p);
 else if(motion==="reveal")sceneReveal(c,fields,assets,p);
 else if(motion==="slide")sceneSlide(c,fields,assets,p);
 else scenePulse(c,fields,assets,p);
 c.restore();
}
