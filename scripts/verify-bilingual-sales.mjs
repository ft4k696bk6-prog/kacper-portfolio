#!/usr/bin/env node
// Fail CI/production builds when newly introduced sales content is published in Polish only.
import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const errors=[];
const pair=[
 ["cennik","en/pricing"],["pakiety","en/packages"],
 ["pozyskiwanie-klientow","en/customer-acquisition"],["reklamy-online","en/advertising"],
 ["kontakt","en/contact"],["polityka-prywatnosci","en/privacy"],
 ["automatyzacja-leadow-i-sprzedazy","en/services/automation"]
];
const sourceFiles=["salesGuides","salesGrowthGuides"];
const source=sourceFiles.flatMap(name=>{
 const file=read("src/content/"+name+".ts");
 const match=file.match(/export const \w+ = (\[[\s\S]*?\]);\s*$/);
 if(!match){errors.push(name+": cannot read guide data");return [];}
 try{return JSON.parse(match[1]);}
 catch(e){errors.push(name+": invalid JSON data – "+e.message);return [];}
});
const translations=Object.assign({},...["a","b","c","d"].map(letter=>{
 try {return JSON.parse(read("src/content/sales-en-"+letter+".json"));}
 catch(e){errors.push("sales-en-"+letter+".json is missing or invalid: "+e.message);return {};}
}));
const known=new Set();
for(const guide of source){
 if(known.has(guide.slug))errors.push("Duplicate Polish sales guide: "+guide.slug);
 known.add(guide.slug);
 const translated=translations[guide.slug];
 if(!translated){errors.push("Missing complete English guide: "+guide.slug);continue;}
 for(const field of ["title","description","intro","serviceLabel"]){
  if(typeof translated[field]!=="string"||translated[field].trim().length<25&&field!=="serviceLabel")errors.push("Incomplete "+field+" in EN "+guide.slug);
 }
 if(!Array.isArray(translated.sections)||translated.sections.length!==guide.sections.length){
   errors.push("Section mismatch: "+guide.slug);continue;
 }
 translated.sections.forEach((section,i)=>{
  if(typeof section.title!=="string"||section.title.trim().length<8)errors.push("English section title missing: "+guide.slug+"/"+i);
  if(!Array.isArray(section.paragraphs)||section.paragraphs.length!==guide.sections[i].paragraphs.length)errors.push("Paragraph count mismatch: "+guide.slug+"/"+i);
  for(const p of section.paragraphs||[]){if(typeof p!=="string"||p.length<45)errors.push("Missing or short English paragraph: "+guide.slug+"/"+i);}
 });
}
for(const slug of Object.keys(translations))if(!known.has(slug))errors.push("Orphan English sales translation: "+slug);
const sitemap=read("src/app/sitemap.ts"),language=read("src/components/LanguageSwitcher.tsx");
for(const [pl,en] of pair){
 const plPath="src/app/(pl)/"+pl+"/page.tsx",enPath="src/app/(en)/"+en+"/page.tsx";
 for(const file of [plPath,enPath])if(!fs.existsSync(path.join(root,file)))errors.push("Missing translated page "+file);
 if(!sitemap.includes('"/'+pl+'"')||!sitemap.includes('"/'+en+'"'))errors.push("Sitemap missing reciprocal pair: "+pl+" / "+en);
 if(!language.includes('"/'+pl+'": "/'+en+'"'))errors.push("Language switch missing "+pl+" → "+en);
 for(const [file,languageCode] of [[plPath,"pl-PL"],[enPath,"en"]]){
  if(!fs.existsSync(path.join(root,file)))continue;
  const body=read(file);
  if(!body.includes("alternates")||!body.includes("canonical")||!body.includes("languages")||!body.includes("/"+pl)||!body.includes("/"+en))errors.push("Incomplete reciprocal SEO metadata: "+file);
 }
}
const form=read("src/components/LeadContactForm.tsx");
if(!form.includes("englishOptions")||!form.includes("/en/privacy"))errors.push("English form labels or privacy URL missing");
const guideI18n=read("src/lib/guide-i18n.ts");
for(const letter of ["a","b","c","d"])if(!guideI18n.includes("sales-en-"+letter+".json"))errors.push("English guide collection "+letter+" not wired");
const packageJson=JSON.parse(read("package.json"));
if(!packageJson.scripts?.prebuild?.includes("verify:bilingual"))errors.push("Missing production prebuild gate");
if(errors.length){console.error("BILINGUAL RELEASE BLOCKED:\n"+errors.map(e=>" - "+e).join("\n"));process.exit(1);}
console.log("Bilingual release check: "+source.length+" PL/EN sales guides, "+pair.length+" reciprocal commercial routes, navigation, metadata, form and sitemap OK.");
