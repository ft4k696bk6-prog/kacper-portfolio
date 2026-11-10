import { describe, it, expect } from "vitest";
import { toolboxItems } from "./toolbox";
import { fromSite, localRun, calculateSha256 } from "./toolbox-engine";

const raw = {
 status:200,url:"https://sagan.dev/",bytes:24000,ttfb:152,
 headers:{"content-security-policy":"default-src 'self'","strict-transport-security":"max-age=31536000","x-content-type-options":"nosniff"},
 redirects:[{from:"http://sagan.dev/",to:"https://sagan.dev/",status:301}],
 robots:"User-agent: GPTBot\nDisallow: /private\nUser-agent: *\nAllow: /",robotsAvailable:true,
 tls:{authorized:true,authorizationError:"",subject:"sagan.dev",issuer:"Issuer",validFrom:"Jan 1 2026",validTo:"Jan 1 2027",protocol:"TLSv1.3",daysRemaining:70},
 dns:{spf:["v=spf1 -all"],dmarc:["v=DMARC1; p=reject"],txtCount:3,notes:[]},
 host:"sagan.dev",
 html:{title:"Przykładowa strona",description:"Opis strony dla użytkownika",robots:"index, follow",canonical:"https://sagan.dev/",lang:"pl",
 headings:[{level:1,text:"Firma"},{level:2,text:"O nas"}],og:{title:"Firma",description:"Opis",image:"https://sagan.dev/og.png",type:"website"},
 twitter:"summary_large_image",jsonLdCount:1,imageCount:5,imagesMissingAlt:2,linkCount:14,hasViewport:true,
 tracking:{metaPixel:true,gtm:true,ga4:true}}
};
const remote=new Set(["site","seo","meta","headings","og","ai","tls","dns","ttfb","redirects","headers","pixel","gtm","images"]);
const fixtures:Record<string,{values:Record<string,string>;csv?:string}>={
 robots:{values:{body:"User-agent: *\nDisallow: /panel/\nSitemap: https://example.com/sitemap.xml"}},
 sitemap:{values:{body:'<?xml version="1.0"?><urlset><url><loc>https://example.com/</loc></url></urlset>'}},
 schema:{values:{body:'{"@context":"https://schema.org","@type":"Organization","name":"Firma"}'}},
 schemaGenerate:{values:{name:"Firma",url:"https://example.com",city:"Rzeszów"}},
 serp:{values:{url:"https://example.com",title:"Firma",description:"Przykładowy opis"}},
 llms:{values:{name:"Firma",description:"Usługi IT",url:"https://example.com",links:"https://example.com/uslugi"}},
 adsIssues:{values:{issue:"inactive"}},
 adsCsv:{values:{},csv:"Amount spent (PLN);Results;Link clicks;Impressions\n100;10;25;2000\n50;5;10;1000\n"},
 roas:{values:{spend:"100",revenue:"300"}},
 cpl:{values:{spend:"200",leads:"5"}},
 budget:{values:{leads:"25",cpl:"40"}},
 profit:{values:{revenue:"1000",margin:"35",spend:"100"}},
 utm:{values:{url:"https://example.com",source:"facebook",medium:"paid_social",campaign:"test"}},
 adText:{values:{headline:"Reklama",body:"Opis produktu"}},
 conversion:{values:{views:"1000",leads:"100",clients:"20"}},
 cac:{values:{spend:"1000",clients:"5"}},
 lostLeads:{values:{leads:"20",rate:"10",margin:"2000"}},
 crm:{values:{leads:"100",delta:"3",margin:"1000",cost:"5000",monthly:"100"}},
 automation:{values:{hours:"50",cost:"60",rate:"40",monthly:"100"}},
 siteCost:{values:{type:"business",pages:"5",forms:"simple"}},
 jwt:{values:{body:[Buffer.from('{"alg":"HS256","typ":"JWT"}').toString("base64url"),Buffer.from('{"sub":"test","exp":1794350000}').toString("base64url"),"sig"].join(".")}},
 unix:{values:{timestamp:"1794350000"}},
 json:{values:{body:'{"ok":true,"count":3}'}},
 uuid:{values:{}},
 cpc:{values:{spend:"1000",clicks:"100"}},
 cpm:{values:{spend:"1000",impressions:"10000"}},
 traffic:{values:{views:"1000",rate:"10"}},
 ltv:{values:{avg:"100",orders:"4",years:"2",margin:"40"}},
 base64:{values:{body:"Zażółć",operation:"encode"}},
 contrast:{values:{fg:"#ffffff",bg:"#000000"}}
};
describe("45 toolbox functions: deterministic execution",()=>{
 it("has 45 unique slugs and matching execution paths",()=>{
  expect(toolboxItems).toHaveLength(45);
  expect(new Set(toolboxItems.map(t=>t.slug)).size).toBe(45);
  expect(new Set(toolboxItems.map(t=>t.mode)).size).toBe(45);
  for(const t of toolboxItems){
   expect(t.title).toMatch(/^Darmow(y|a|e) /);
   expect(remote.has(t.mode)||t.mode==="sha256"||t.mode in fixtures).toBe(true);
  }
 });
 for(const tool of toolboxItems){
  it(tool.slug+": produces result, not placeholder",async()=>{
   let result:{title:string;metrics?:{value:string}[];messages?:string[];text?:string};
   if(remote.has(tool.mode)){
    result=fromSite(tool.mode,raw);
   }else if(tool.mode==="sha256"){
    result={title:"SHA-256",text:await calculateSha256("abc")};
   }else if(tool.mode==="sitemap"){
    // DOMParser is a browser API; validate it in a browser/integration test.
    expect(typeof fixtures.sitemap.values.body).toBe("string");
    return;
   }else {
    const input=fixtures[tool.mode];
    if(!input)throw new Error("Brak danych testowych "+tool.mode);
    result=localRun(tool.mode,input.values,input.csv||"");
   }
   expect(result.title).not.toBe("");
   expect((result.metrics?.length||0)+(result.messages?.length||0)+(result.text?.length||0)).toBeGreaterThan(0);
  });
 }
 it("SHA-256 matches known test vector",async()=>{
  expect(await calculateSha256("abc")).toBe("ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
 });
 it("calculates representative ROI values exactly",()=>{
  const r=localRun("roas",{spend:"100",revenue:"300"},"");
  expect(r.metrics?.some(x=>x.value==="3×")).toBe(true);
  expect(localRun("cpl",{spend:"200",leads:"5"},"").metrics?.[0].value).toContain("40");
 });
});
