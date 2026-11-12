import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

// Preview-only: capture the reviewed GIFs as local assets at build time.
// Browser requests are then same-origin; neither CSS nor runtime uses
// short-lived signed image URLs. Never run this importer in main.
const assets = [{"name":"wariant-01","url":"https://at.adobe.com/bRnYG5ozishheyfP"},{"name":"wariant-02","url":"https://at.adobe.com/HbcmzaRko0zkMuwV"},{"name":"wariant-03","url":"https://at.adobe.com/3gasgIPWcCR4LTXa"},{"name":"wariant-04","url":"https://at.adobe.com/UjCyPEHIJWQgY3Lk"},{"name":"wariant-05","url":"https://at.adobe.com/JtoitKSLGrhgPfdc"},{"name":"wariant-06","url":"https://at.adobe.com/E9PpFIRlpa5zET7k"},{"name":"smiech","url":"https://at.adobe.com/k5zYaUh2jswdV6m4"},{"name":"usmiech","url":"https://at.adobe.com/BcXfgMxTTO9Gw2rQ"},{"name":"mruganie","url":"https://at.adobe.com/wUzfjNapYP3HoYHN"},{"name":"ekscytacja","url":"https://at.adobe.com/thamPGPoTgQtQ0jd"},{"name":"zaskoczenie","url":"https://at.adobe.com/QLVpfsZ39VzmfsZB"}];
const outDir="public/images/berni/clips";
await mkdir(outDir,{recursive:true});
const results=await Promise.all(assets.map(async ({name,url})=>{
  const response=await fetch(url,{redirect:"follow",signal:AbortSignal.timeout(40000)});
  if(!response.ok)throw Error("Berni GIF "+name+": HTTP "+response.status);
  const bytes=Buffer.from(await response.arrayBuffer());
  if(bytes.length<10000 || !["GIF89a","GIF87a"].includes(bytes.toString("ascii",0,6)))
    throw Error("Berni GIF "+name+": invalid animation");
  await writeFile(join(outDir,name+".gif"),bytes);
  return name;
}));
console.log("Berni preview: imported "+results.length+" original GIF animations");
