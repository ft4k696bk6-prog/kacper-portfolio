import {describe,it,expect} from "vitest";
import {csvToObjects,dayDifference,marginMarkup,monthlyPayment,objectsToCsv,savingProjection,tripCost,vatBreakdown,convertUnits} from "./extra-calculators";
describe("everyday calculator and conversion suite",()=>{
 it("VAT supports net and gross without tax advice",()=>{expect(vatBreakdown(100,23,"net")).toEqual({net:100,gross:123,vat:23});expect(vatBreakdown(123,23,"gross").net).toBe(100);});
 it("margin/markup are different",()=>{expect(marginMarkup(80,100)).toEqual({profit:20,margin:20,markup:25});});
 it("loans zero interest and savings",()=>{expect(monthlyPayment(12000,0,12)).toBe(1000);expect(monthlyPayment(10000,6,12)).toBeGreaterThan(850);expect(savingProjection(0,100,0,1).total).toBe(1200);});
 it("fuel cost and units",()=>{expect(tripCost(100,8,6,2).total).toBe(48);expect(convertUnits(1,"km","m")).toBe(1000);});
 it("date input validates leap year",()=>{expect(dayDifference("2024-02-28","2024-03-01")).toBe(2);expect(()=>dayDifference("2025-02-29","2025-03-01")).toThrow();});
 it("CSV quoted delimiters and output escaping",()=>{expect(csvToObjects('name,city\n"A, B",Warsaw')[0].name).toBe("A, B");expect(objectsToCsv([{name:'A, B'}])).toContain('"A, B"');});
});
