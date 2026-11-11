export function roundMoney(value:number):number{return Math.round((value+Number.EPSILON)*100)/100;}
export function vatBreakdown(amount:number,rate:number,mode:"net"|"gross"){
 if(!Number.isFinite(amount)||amount<0||!Number.isFinite(rate)||rate<0||rate>100)throw Error("Invalid amount or VAT rate");
 const factor=1+rate/100;const net=mode==="net"?amount:amount/factor;
 return {net:roundMoney(net),gross:roundMoney(net*factor),vat:roundMoney(net*rate/100)};
}
export function marginMarkup(cost:number,price:number){
 if(!Number.isFinite(cost)||!Number.isFinite(price)||cost<0||price<=0)throw Error("Invalid cost or price");
 return {profit:roundMoney(price-cost),margin:roundMoney((price-cost)/price*100),markup:cost>0?roundMoney((price-cost)/cost*100):null};
}
export function monthlyPayment(principal:number,annualRate:number,months:number):number{
 if(!Number.isFinite(principal)||principal<0||!Number.isFinite(annualRate)||annualRate<0||!Number.isInteger(months)||months<1||months>600)throw Error("Invalid loan assumptions");
 const r=annualRate/1200;return roundMoney(r===0?principal/months:principal*r/(1-Math.pow(1+r,-months)));
}
export function savingProjection(principal:number,monthly:number,annualRate:number,years:number){
 if([principal,monthly,annualRate,years].some(x=>!Number.isFinite(x)||x<0)||years>70||annualRate>100)throw Error("Invalid savings assumptions");
 let total=principal;const n=Math.round(years*12),rate=annualRate/1200;
 for(let i=0;i<n;i++)total=total*(1+rate)+monthly;
 return {total:roundMoney(total),deposits:roundMoney(principal+monthly*n),interest:roundMoney(total-principal-monthly*n)};
}
export function tripCost(distance:number,consumption:number,price:number,passengers:number){
 if([distance,consumption,price].some(x=>!Number.isFinite(x)||x<0)||!Number.isInteger(passengers)||passengers<1)throw Error("Invalid trip assumptions");
 const litres=distance*consumption/100;return {litres:roundMoney(litres),total:roundMoney(litres*price),perPerson:roundMoney(litres*price/passengers)};
}
export function dayDifference(a:string,b:string):number{
 if(!/^\d{4}-\d{2}-\d{2}$/.test(a)||!/^\d{4}-\d{2}-\d{2}$/.test(b))throw Error("Invalid date");
 const parse=(s:string)=>{const [y,m,d]=s.split("-").map(Number);const utc=Date.UTC(y,m-1,d);if(new Date(utc).toISOString().slice(0,10)!==s)throw Error("Invalid calendar date");return utc;};
 return Math.round((parse(b)-parse(a))/86400000);
}
export function convertUnits(value:number,from:string,to:string):number{
 const table:Record<string,[string,number]>={
  m:["length",1],km:["length",1000],cm:["length",.01],mile:["length",1609.344],ft:["length",.3048],
  kg:["mass",1],g:["mass",.001],lb:["mass",.45359237],
  l:["volume",1],ml:["volume",.001],gal:["volume",3.785411784]
 };
 if(!Number.isFinite(value)||!table[from]||!table[to]||table[from][0]!==table[to][0])throw Error("Incompatible units");
 return value*table[from][1]/table[to][1];
}
export function parseCsv(text:string):string[][]{
 const rows:string[][]=[];let row:string[]=[],cell="",quote=false;
 const delim=(text.split("\n")[0].match(/;/g)||[]).length>(text.split("\n")[0].match(/,/g)||[]).length?";":",";
 for(let i=0;i<text.length;i++){
  const ch=text[i];
  if(quote){if(ch==='"'&&text[i+1]==='"'){cell+='"';i++;}else if(ch==='"')quote=false;else cell+=ch;}
  else if(ch==='"')quote=true;
  else if(ch===delim){row.push(cell);cell="";}
  else if(ch==="\n"){row.push(cell.replace(/\r$/,""));if(row.some(x=>x!==""))rows.push(row);row=[];cell="";}
  else cell+=ch;
 }
 if(quote)throw Error("Unclosed CSV quote");
 if(cell||row.length){row.push(cell);rows.push(row);}
 return rows;
}
export function csvToObjects(text:string):Record<string,string>[]{
 const rows=parseCsv(text);if(!rows.length)return [];
 const header=rows[0].map((x,i)=>x.trim()||"column_"+i);
 return rows.slice(1).map(row=>Object.fromEntries(header.map((key,i)=>[key,row[i]||""])));
}
export function objectsToCsv(items:Record<string,unknown>[]):string{
 if(!items.length)return "";
 const keys=Array.from(new Set(items.flatMap(x=>Object.keys(x))));
 const safe=(v:unknown)=>{const x=String(v??"");return /[",\n\r]/.test(x)?'"'+x.replace(/"/g,'""')+'"':x;};
 return [keys.map(safe).join(","),...items.map(obj=>keys.map(k=>safe(obj[k])).join(","))].join("\n");
}
