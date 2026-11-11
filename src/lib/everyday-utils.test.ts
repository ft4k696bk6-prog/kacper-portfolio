import { describe,expect,it } from "vitest";
import { cleanText,dedupeLines,percentage,parseNumber,password,pickRandom,signatureHtml,signatureSafeLink,SIGNATURE_SOCIALS } from "./everyday-utils";

describe("Everyday Tools",()=>{
 it("supports localized numbers and rejects invalid input",()=>{
  expect(parseNumber("1 500,50")).toBe(1500.5);
  expect(Number.isNaN(parseNumber("10xyz"))).toBe(true);
 });
 it("calculates percentages consistently",()=>{
  expect(percentage(200,10,"increase")).toBe(220.00000000000003);
  expect(percentage(200,10,"decrease")).toBe(180);
  expect(percentage(200,10,"part")).toBe(20);
  expect(percentage(100,125,"difference")).toBe(25);
  expect(Number.isNaN(percentage(0,2,"difference"))).toBe(true);
 });
 it("normalizes hidden characters without erasing paragraphs",()=>{
  expect(cleanText("  Hi\u200B  there \r\n\r\n\r\n Again  ")).toBe("Hi there\n\nAgain");
  expect(dedupeLines("Alpha\nalpha\nBeta\n")).toBe("Alpha\nBeta");
 });
 it("generates secure passwords covering all selected groups",()=>{
  const p=password(24,["abc","XYZ","123","!?"]);
  expect(p).toHaveLength(24);
  expect(p).toMatch(/[abc]/);expect(p).toMatch(/[XYZ]/);expect(p).toMatch(/[123]/);expect(p).toMatch(/[!?]/);
  expect(()=>password(2,["a"])).toThrow();
 });
 it("picks one of submitted choices and safely escapes signature fields",()=>{
  expect(["a","b"]).toContain(pickRandom("a\nb"));
  const html=signatureHtml({name:'<img src=x onerror=alert(1)>',role:"CEO",company:"& Co",email:"a@example.com",phone:"+48 123 456 789",website:"example.com",accent:"#dfdfdf"});
  expect(html).toContain("&lt;img");
  expect(html).not.toContain("<img");
  expect(html).toContain("mailto:a@example.com");
  expect(html).toContain("#dfdfdf");
 });
 it("renders three compatible logo signature layouts",()=>{
  const base={name:"Anna Nowak",role:"CEO",company:"Nowak Sp. z o.o.",email:"anna@example.com",phone:"+48 500 000 001",website:"example.com",accent:"#aabbcc",logo:"https://cdn.example.com/logo.png",logoWidth:135};
  const side=signatureHtml({...base,layout:"side"});
  const stacked=signatureHtml({...base,layout:"stacked"});
  const compact=signatureHtml({...base,layout:"compact"});
  for(const html of [side,stacked,compact]){
   expect(html).toContain('src="https://cdn.example.com/logo.png"');
   expect(html).toContain('width="135"');
   expect(html).toContain('role="presentation"');
   expect(html).toContain("Anna Nowak");
   expect(html).toContain("mailto:anna@example.com");
   expect(html).not.toContain("<style");
  }
  expect(side).toContain("border-left:3px solid #aabbcc");
  expect(stacked).toContain("border-top:3px solid #aabbcc");
  expect(compact).toContain("border-bottom:2px solid #aabbcc");
 });
 it("rejects unsafe logo URLs and clamps dimensions",()=>{
  const s={name:"Safe",role:"",company:"& Sons",email:"",phone:"",website:"",accent:"#abcdef"};
  expect(signatureHtml({...s,logo:'javascript:alert(1)'})).not.toContain("<img");
  expect(signatureHtml({...s,logo:'https://user:password@cdn.example.org/logo.png'})).not.toContain("<img");
  expect(signatureHtml({...s,logo:'data:image/svg+xml;base64,PHN2Zz4='})).not.toContain("<img");
  expect(signatureHtml({...s,logo:"data:image/png;base64,aGVsbG8=",logoWidth:999})).toContain('width="180"');
  expect(signatureHtml({...s,logo:"https://cdn.example.org/?x=%22%3E"})).not.toContain('src="https://cdn.example.org/?x=">');
  expect(signatureHtml({...s,logo:"https://cdn.example.org/?x=1&y=2"})).toContain("&amp;y=2");
 });
 it("creates independently clickable safe social links for every supported service",()=>{
  const socials=Object.fromEntries(SIGNATURE_SOCIALS.map(item=>[item.id,"https://example.org/"+item.id]));
  const html=signatureHtml({name:"Ania",role:"CEO",company:"Example",email:"a@example.org",phone:"",website:"",accent:"#555555",socials});
  for(const item of SIGNATURE_SOCIALS){
   expect(html).toContain('href="https://example.org/'+item.id+'"');
   expect(html).toContain('title="'+item.name+'"');
  }
  expect(signatureSafeLink("javascript:alert(1)")).toBe("");
  expect(signatureSafeLink("https://user:pass@example.org")).toBe("");
  expect(signatureSafeLink("https://example.org/valid")).toBe("https://example.org/valid");
  expect(signatureHtml({name:"X",role:"",company:"",email:"",phone:"",website:"",accent:"#555555",socials:{facebook:"javascript:alert(1)",linkedin:"https://linkedin.com/in/example"}}))
   .not.toContain('href="javascript:');
 });
 it("uses an Outlook-safe animated image and retains real email/social links",()=>{
  const html=signatureHtml({name:"Anna",role:"CEO",company:"Acme",email:"anna@acme.org",phone:"",website:"",accent:"#888888",
   animationUrl:"https://cdn.example.org/signature.gif",socials:{linkedin:"https://linkedin.com/in/anna"}});
  expect(html).toContain('src="https://cdn.example.org/signature.gif"');
  expect(html).toContain("Anna · CEO · Acme · anna@acme.org");
  expect(html).toContain('href="mailto:anna@acme.org"');
  expect(html).toContain('href="https://linkedin.com/in/anna"');
  const unsafe=signatureHtml({name:"Anna",role:"",company:"",email:"",phone:"",website:"",accent:"#888888",animationUrl:"javascript:evil()"});
  expect(unsafe).not.toContain("javascript:");
 });

 it("exports reference-inspired premium signature with a separate clickable vertical icon rail",()=>{
  const socials={
   facebook:"https://facebook.com/example",linkedin:"https://linkedin.com/in/example",
   instagram:"https://instagram.com/example",youtube:"https://youtube.com/@example",
   tiktok:"https://tiktok.com/@example",x:"https://x.com/example",
   github:"https://github.com/example",calendar:"https://cal.com/example"
  };
  const html=signatureHtml({name:"Jan Kowalski",role:"Founder",company:"Brand",email:"jan@brand.pl",phone:"+48 500 600 700",website:"brand.pl",
   accent:"#787878",animationStyle:"geometry",animationUrl:"https://cdn.example.com/geometric.gif",socials});
  expect(html).toContain('width="578"');
  expect(html).toContain('height="208"');
  expect(html).toContain('border-right:1px solid #e5e3e8');
  expect(html).toContain('src="https://cdn.example.com/geometric.gif"');
  expect(html).toContain('href="mailto:jan@brand.pl"');
  expect(html).toContain('href="tel:+48500600700"');
  expect(html).toContain('href="https://brand.pl/"');
  for(const link of Object.values(socials)) expect(html).toContain('href="'+link+'"');
  expect(html).not.toContain("<script");
  expect(html).not.toContain("<style");
 });
 it("keeps previous animated formats unchanged and rejects malicious rail URLs",()=>{
  const base={name:"A",role:"CEO",company:"Company",email:"",phone:"",website:"",accent:"#777777",animationUrl:"https://a.example.org/a.gif"};
  const classic=signatureHtml({...base,animationStyle:"reveal"});
  expect(classic).toContain('width="520"');
  expect(classic).not.toContain('width="578"');
  const premium=signatureHtml({...base,animationStyle:"geometry",socials:{linkedin:'javascript:alert(1)',facebook:"https://user:secret@example.com"}});
  expect(premium).not.toContain("javascript:");
  expect(premium).not.toContain("user:secret@");
 });

 it("uses real rasterized brand logos instead of letter abbreviations in every email layout",()=>{
  const socials=Object.fromEntries(SIGNATURE_SOCIALS.map(item=>[item.id,"https://example.org/"+item.id]));
  const shared={name:"Jan",role:"CEO",company:"Acme",email:"jan@acme.pl",phone:"",website:"",accent:"#333333",socials};
  const plain=signatureHtml({...shared,layout:"side"});
  const premium=signatureHtml({...shared,animationUrl:"https://cdn.example.org/signature.gif",animationStyle:"geometry"});
  for(const html of [plain,premium]){
   for(const social of SIGNATURE_SOCIALS){
    expect(html).toContain('src="https://bernecki.dev/api/signature-icon/'+social.id+'"');
    expect(html).toContain('alt="'+social.name+'"');
    expect(html).toContain('href="https://example.org/'+social.id+'"');
   }
   expect(html).not.toContain(">ig</a>");
   expect(html).not.toContain(">GH</a>");
   expect(html).not.toContain(">↗</a>");
   expect(html).not.toContain("<svg");
  }
  expect(premium).toContain('src="https://bernecki.dev/api/signature-icon/calendar"');
 });

});
