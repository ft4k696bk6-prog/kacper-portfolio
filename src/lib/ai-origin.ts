export type ClassifierRecord={label:string;score:number};
export function aiScore(rows:ClassifierRecord[]):number|null{
 if(!Array.isArray(rows))return null;
 const matches=rows.filter(r=>r&&Number.isFinite(r.score)&&r.score>=0&&r.score<=1);
 const ai=matches.find(r=>/^(fake|ai|generated|machine|label_1)$/i.test(r.label.trim()));
 const real=matches.find(r=>/^(real|human|authentic|label_0)$/i.test(r.label.trim()));
 if(ai)return ai.score*100;
 if(real)return (1-real.score)*100;
 return null;
}
export function inspectGeneratorMarkers(buffer:ArrayBuffer):string[]{
 const data=new Uint8Array(buffer.slice(0,Math.min(buffer.byteLength,8*1024*1024)));
 let binary="";for(let i=0;i<data.length;i+=16384)binary+=String.fromCharCode(...data.subarray(i,i+16384));
 const names=[["C2PA","c2pa"],["Adobe XMP","xmpmeta"],["ComfyUI","comfyui"],["Stable Diffusion","stable diffusion"],["Midjourney","midjourney"],["DALL-E","dall-e"],["Firefly","firefly"],["Automatic1111","automatic1111"],["Photoshop","photoshop"],["EXIF","exif"]];
 const low=binary.toLowerCase();
 return names.filter(x=>low.includes(x[1])).map(x=>x[0]);
}
export function imageFileAllowed(file:{size:number;type:string}):boolean{
 return file.size>0&&file.size<=12_000_000&&/^image\/(png|jpeg|webp)$/i.test(file.type);
}
