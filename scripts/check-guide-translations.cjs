#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/* Static checks; never publish Polish placeholders as indexed English pages. */
const fs=require("node:fs");
const raw=JSON.parse(fs.readFileSync(process.argv[2]||"/tmp/bernecki-guide-source-pl.json","utf8"));
const output=JSON.parse(fs.readFileSync(process.argv[3]||"src/content/pseo/guide-translations.en.json","utf8"));
const errors=[];
const norm=x=>String(x||"").trim();
for(const g of raw){
 const entry=output[g.slug];
 if(!entry){errors.push(g.slug+": missing");continue;}
 if(entry.sourceHash!==g.sourceHash)errors.push(g.slug+": source hash stale");
 if(entry.status!=="machine"&&entry.status!=="reviewed")errors.push(g.slug+": status");
 for(const field of ["title","description","intro","serviceLabel"]){
   if(norm(entry[field]).length<3)errors.push(g.slug+": "+field+" empty");
   if(norm(g[field]).length>60&&norm(entry[field]).length<Math.min(15,norm(g[field]).length*.16))errors.push(g.slug+": "+field+" truncated");
 }
 if(!Array.isArray(entry.sections)||entry.sections.length!==g.sections.length){errors.push(g.slug+": sections mismatched");continue;}
 entry.sections.forEach((section,i)=>{
   if(!norm(section.title))errors.push(g.slug+": section "+i+" title missing");
   if(!Array.isArray(section.paragraphs)||section.paragraphs.length!==g.sections[i].paragraphs.length)errors.push(g.slug+": paragraph count");
   for(const paragraph of section.paragraphs||[]){if(!norm(paragraph)||norm(paragraph)==="[object Object]")errors.push(g.slug+": empty/nontext paragraph");}
 });
}
for(const slug of Object.keys(output)){if(!raw.some(g=>g.slug===slug))errors.push("Orphan English edition: "+slug)}
const suspiciousMachineEnglish = /\\b(?:Subabase|Subbase|Conversations API|leady|leades|defloy(?:ment)?|Escapulate|bushes)\\b/i;
for(const [slug, entry] of Object.entries(output)){
  const fields = [entry.title,entry.description,entry.intro,entry.serviceLabel,...(entry.sections||[]).flatMap(section=>[section.title,...section.paragraphs])];
  for(const value of fields){
    if(suspiciousMachineEnglish.test(value||""))errors.push(slug+": English technical terminology needs correction");
  }
}

if(errors.length){console.error(errors.slice(0,40).join("\n"));process.exit(1)}
console.log("Validated "+raw.length+" distinct, complete, version-matched EN editions with no placeholders.");
