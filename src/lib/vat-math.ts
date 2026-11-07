/** General VAT arithmetic; not a determination of a specific taxpayer's eligibility. */
export type VatBasis="gross"|"net";
export type VatAmount={net:number;gross:number;vat:number};
const round=(n:number)=>Math.round((n+Number.EPSILON)*100)/100;
export function calculateVat(amount:number,rate:number,basis:VatBasis):VatAmount{
  const safe=Number.isFinite(amount)?Math.min(100000000,Math.max(0,amount)):0;
  if(basis==="net"){
    const net=round(safe),vat=round(net*rate/100);
    return {net,vat,gross:round(net+vat)};
  }
  const gross=round(safe),net=round(gross/(1+rate/100));
  return {net,gross,vat:round(gross-net)};
}
