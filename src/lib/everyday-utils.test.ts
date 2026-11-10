import { describe,expect,it } from "vitest";
import { cleanText,dedupeLines,percentage,parseNumber,password,pickRandom,signatureHtml } from "./everyday-utils";

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
});
