"use client";

import { useState } from "react";
import { ArrowRight, Check, ClipboardCopy, Download, FileUp, LoaderCircle, RotateCcw } from "lucide-react";

type InputField={key:string;label:string;hint?:string;type?:"number"|"textarea"|"select";options?:{value:string;label:string}[];placeholder?:string};
type Metric={label:string;value:string};
type Result={title:string;metrics?:Metric[];messages?:string[];text?:string;warning?:string};
type SiteReport={
  status:number;url:string;bytes:number;ttfb:number;robots?:string;robotsAvailable?:boolean;
  redirects?:{from:string;to:string;status:number}[];headers?:Record<string,string>;
  html?:{title:string;description:string;robots:string;canonical:string;lang:string;
    headings:{level:number;text:string}[];og:{title:string;description:string;image:string;type:string};twitter:string;
    jsonLdCount:number;imageCount:number;imagesMissingAlt:number;linkCount:number;hasViewport:boolean;tracking?:{metaPixel:boolean;gtm:boolean;ga4:boolean};};
  host?:string;tls?:{authorized:boolean;authorizationError:string;subject:string;issuer:string;validFrom:string;validTo:string;protocol:string;daysRemaining:number|null};
  dns?:{spf:string[];dmarc:string[];txtCount:number;notes:string[]};
};
const siteInput:InputField[]=[{key:"url",label:"Adres publicznej strony",placeholder:"https://twojafirma.pl"}];
const number=(key:string,label:string,placeholder="np. 100"):InputField=>({key,label,placeholder,type:"number"});
const text=(key:string,label:string,placeholder=""):InputField=>({key,label,placeholder});
const area=(key:string,label:string,placeholder=""):InputField=>({key,label,placeholder,type:"textarea"});
const inputs:Record<string,InputField[]>={
  site:siteInput,seo:siteInput,meta:siteInput,headings:siteInput,og:siteInput,ai:siteInput,tls:siteInput,dns:siteInput,ttfb:siteInput,redirects:siteInput,headers:siteInput,pixel:siteInput,gtm:siteInput,images:siteInput,
  robots:[area("body","Wklej zawartość robots.txt","User-agent: *\nDisallow: /admin/\nSitemap: https://twojafirma.pl/sitemap.xml")],
  sitemap:[area("body","Wklej XML mapy strony",'<?xml version="1.0"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://twojafirma.pl/</loc></url></urlset>')],
  schema:[area("body","Wklej dane JSON-LD",'{"@context":"https://schema.org","@type":"Organization","name":"Firma"}')],
  schemaGenerate:[text("name","Nazwa firmy","Przykładowa firma"),text("url","Adres strony WWW","https://twojafirma.pl"),text("city","Miasto","Rzeszów"),text("street","Ulica i numer (opcjonalnie)",""),text("phone","Telefon (opcjonalnie)","")],
  serp:[text("url","Adres strony","https://twojafirma.pl"),text("title","Tytuł wyniku (title)","Tworzenie stron internetowych | Firma"),area("description","Opis strony (meta description)","Nowoczesne strony internetowe dla firm. Sprawdź ofertę i realizacje.")],
  llms:[text("name","Nazwa strony lub firmy","Moja firma"),area("description","Krótki opis działalności","Czym zajmuje się firma i jakie oferuje usługi?"),text("url","Adres strony WWW","https://twojafirma.pl"),area("links","Ważne podstrony (jeden URL w linii)","https://twojafirma.pl/uslugi\nhttps://twojafirma.pl/kontakt")],
  adsIssues:[{key:"issue",label:"Jaki problem widzisz?",type:"select",options:[
    {value:"inactive",label:"Zestaw reklam / kampania nieaktywna"},{value:"rejected",label:"Reklama odrzucona"},
    {value:"spend",label:"Reklamy nie wydają budżetu"},{value:"results",label:"Reklamy mają kliknięcia, ale brak leadów"},
    {value:"pixel",label:"Brak zdarzeń lub konwersji Pixel / CAPI"},{value:"learning",label:"Reklamy utknęły w fazie uczenia się"},
    {value:"payment",label:"Problem z płatnością lub limitem konta"}]}],
  adsCsv:[],
  cpc:[number("spend","Wydatki reklamowe (zł)","1000"),number("clicks","Liczba kliknięć linku","250")],
  cpm:[number("spend","Wydatki reklamowe (zł)","1000"),number("impressions","Liczba wyświetleń","40000")],
  traffic:[number("views","Liczba odwiedzin","1000"),number("rate","Zakładana konwersja na leada (%)","3")],
  ltv:[number("avg","Średnia wartość zakupu (zł)","500"),number("orders","Zakupy rocznie","3"),number("years","Lata współpracy","2"),number("margin","Marża brutto (%)","35")],
  base64:[area("body","Tekst wejściowy","Wklej tekst lub Base64..."),{key:"operation",label:"Operacja",type:"select",options:[{value:"encode",label:"Tekst UTF-8 → Base64"},{value:"decode",label:"Base64 → tekst UTF-8"}]}],
  sha256:[area("body","Tekst do obliczenia SHA-256","Wpisz tekst, który chcesz zahashować")],
  contrast:[text("fg","Kolor tekstu (HEX)","#f2f2f2"),text("bg","Kolor tła (HEX)","#080808")],
  roas:[number("spend","Wydatki reklamowe (zł)","1000"),number("revenue","Przychód z reklam (zł)","5000")],
  cpl:[number("spend","Wydatki reklamowe (zł)","1000"),number("leads","Liczba pozyskanych leadów","20")],
  budget:[number("leads","Docelowa liczba leadów","50"),number("cpl","Zakładany CPL (zł)","40")],
  profit:[number("revenue","Przychód z kampanii (zł)","10000"),number("margin","Marża brutto (%)","35"),number("spend","Wydatki reklamowe (zł)","2000")],
  utm:[text("url","Docelowy adres URL","https://twojafirma.pl/oferta"),text("source","utm_source","facebook"),text("medium","utm_medium","paid_social"),text("campaign","utm_campaign","promocja-listopad"),text("content","utm_content (opcjonalnie)","reklama-video")],
  adText:[text("headline","Nagłówek reklamy","Sprawdź naszą ofertę"),area("body","Tekst główny reklamy","Opis produktu lub usługi...")],
  conversion:[number("views","Liczba odwiedzin","1500"),number("leads","Liczba zapytań","60"),number("clients","Liczba nowych klientów","12")],
  cac:[number("spend","Łączne koszty marketingu i sprzedaży (zł)","5000"),number("clients","Nowi klienci","20")],
  lostLeads:[number("leads","Nieobsłużone leady / miesiąc","30"),number("rate","Potencjalna konwersja (%)","15"),number("margin","Średnia marża na sprzedaży (zł)","1500")],
  crm:[number("leads","Leady / miesiąc","100"),number("delta","Zakładany wzrost konwersji (punkty procentowe)","3"),number("margin","Marża na sprzedaży (zł)","1200"),number("cost","Koszt wdrożenia CRM (zł)","12000"),number("monthly","Koszt utrzymania CRM / miesiąc (zł)","300")],
  automation:[number("hours","Godziny pracy miesięcznie","80"),number("cost","Koszt 1 godziny pracy (zł)","60"),number("rate","Procent czasu możliwy do automatyzacji","40"),number("monthly","Koszt narzędzi / miesiąc (zł)","200")],
  siteCost:[{key:"type",label:"Rodzaj strony",type:"select",options:[{value:"landing",label:"Landing page"},{value:"business",label:"Strona firmowa"},{value:"extended",label:"Rozbudowany serwis"}]},number("pages","Liczba podstron","5"),{key:"forms",label:"Formularze i integracje",type:"select",options:[{value:"simple",label:"Prosty formularz"},{value:"advanced",label:"Wiele integracji / CRM"}]}],
  jwt:[area("body","Token JWT (dekodowanie tylko w przeglądarce)","eyJhbGciOi...")],
  unix:[text("timestamp","Unix timestamp — sekundy lub milisekundy","1794350000")],
  json:[area("body","Wklej JSON",'{"name":"Przykład","active":true}')],
  uuid:[]
};
const adsHelp:Record<string,{title:string;steps:string[];warning:string}>={
  inactive:{title:"Zestaw lub kampania nieaktywna",steps:["Sprawdź przełączniki kampanii, zestawu i reklamy — wszystkie trzy poziomy.","Otwórz kolumnę Dostarczanie i odczytaj pełny komunikat przy statusie.","Zweryfikuj datę rozpoczęcia i zakończenia, limit wydatków oraz harmonogram.","Sprawdź rozliczenia, stan konta reklamowego i ewentualne ograniczenia w Jakości konta.","Po zmianie poczekaj na aktualizację statusu; jeśli nadal nie działa, zbierz identyfikator reklamy i komunikat."],warning:"Nie każda nieaktywność oznacza błąd — czasem to świadomie wyłączony zestaw."},
  rejected:{title:"Reklama odrzucona",steps:["Otwórz szczegóły odrzucenia i zapisz dokładnie wskazaną zasadę Meta.","Sprawdź tekst, grafikę, landing page oraz treści obiecujące nierealistyczne rezultaty.","Popraw konkretne naruszenie; nie próbuj obchodzić systemu moderacji.","Jeśli decyzja jest błędna, skorzystaj z dostępnej opcji ponownego sprawdzenia.","Zapisz decyzję i datę — powtarzające się naruszenia mogą wpływać na konto."],warning:"Regulamin Meta zmienia się; decyzja zależy od konkretnej reklamy i konta."},
  spend:{title:"Brak wydawania budżetu",steps:["Potwierdź, że kampania, zestaw i reklama mają status aktywny.","Sprawdź poprawność płatności, limity wydatków i budżet.","Zobacz, czy harmonogram, lokalizacja i grupa odbiorców nie są zbyt wąskie.","Sprawdź ofertę aukcyjną: ręczny limit kosztu lub stawki może blokować dostarczanie.","Nie edytuj kampanii co kilka minut — oceń komunikaty Dostarczania po wdrożeniu zmian."],warning:"Brak wydatków może wynikać z przeglądu reklamy, ograniczeń konta lub parametrów aukcji."},
  results:{title:"Kliknięcia bez leadów",steps:["Sprawdź rzeczywistą liczbę kliknięć linku, nie wszystkich interakcji.","Otwórz stronę docelową na telefonie i przejdź cały formularz.","Sprawdź zgodność komunikatu reklamy z nagłówkiem i ofertą landing page.","Zweryfikuj zdarzenie Lead / Purchase w Menedżerze zdarzeń i UTM.","Porównaj jakość ruchu między reklamami oraz punkt, w którym odpadają użytkownicy."],warning:"Bez danych o ruchu i konwersji nie można rozstrzygnąć, czy winna jest kreacja, oferta czy formularz."},
  pixel:{title:"Brak zdarzeń Pixel / CAPI",steps:["Sprawdź, czy właściwy zbiór danych jest połączony z kontem reklamowym.","Uruchom Testowanie zdarzeń w Menedżerze zdarzeń i wykonaj akcję na własnej stronie.","Sprawdź zgody marketingowe, blokery przeglądarki i implementację tagów.","Jeśli używasz CAPI, zweryfikuj event_id i deduplikację zdarzeń z Pixel.","Sprawdź domenę, adres docelowy i ustawienie zdarzenia optymalizacji."],warning:"Brak zdarzeń może wynikać również z narzędzi ochrony prywatności."},
  learning:{title:"Zestaw w fazie uczenia się",steps:["Zweryfikuj, czy wybrane zdarzenie konwersji występuje odpowiednio często.","Ogranicz zbędne rozdrobnienie zestawów o tej samej grupie odbiorców.","Sprawdź, czy budżet i oczekiwany koszt konwersji są do siebie realistycznie dobrane.","Unikaj częstych dużych zmian zestawu w krótkim czasie.","Oceń wynik w dłuższym oknie, a nie po pierwszych godzinach."],warning:"Faza uczenia się nie jest równoznaczna z awarią."},
  payment:{title:"Płatność lub ograniczenie konta",steps:["Otwórz sekcję Rozliczenia w Menedżerze reklam.","Sprawdź status metody płatności i ewentualne zaległości.","Zweryfikuj limit wydatków konta oraz dzienne limity bezpieczeństwa.","W Jakości konta sprawdź ograniczenia i dostępne kroki odwoławcze.","Nie podawaj nikomu kodów 2FA ani danych karty w wiadomościach prywatnych."],warning:"Nie udostępniaj danych dostępowych i płatniczych osobom trzecim."}
};
const pln=(v:number)=>new Intl.NumberFormat("pl-PL",{style:"currency",currency:"PLN",maximumFractionDigits:2}).format(v);
const fmt=(v:number,digits=2)=>new Intl.NumberFormat("pl-PL",{maximumFractionDigits:digits}).format(v);
function requireNumber(values:Record<string,string>,key:string,zero=false) {
 const value=Number((values[key]||"").replace(/\s/g,"").replace(",","."));
 if(!Number.isFinite(value)||value<0||(!zero&&value===0))throw new Error("Uzupełnij poprawnie pole liczbowe: "+(inputsListLabel(key)||key)+".");
 return value;
}
function inputsListLabel(key:string){return key==="leads"?"liczba leadów":key==="spend"?"wydatki":"";}
function safeUrl(value:string){const url=new URL(value.trim());if(!["https:","http:"].includes(url.protocol)||url.username||url.password)throw new Error("Wpisz poprawny publiczny URL HTTP/HTTPS.");return url;}
function parseLocaleNumber(raw:string){
 let s=raw.replace(/[\s\u00a0zł%$€]/gi,"").replace(/[^\d,.\-]/g,"");
 if(s.includes(",")&&s.includes("."))s=s.lastIndexOf(",")>s.lastIndexOf(".")?s.replace(/\./g,"").replace(",","."):s.replace(/,/g,"");
 else if(s.includes(","))s=s.replace(",",".");
 const n=Number(s);return Number.isFinite(n)?n:0;
}
function csvRows(csv:string) {
 const firstLine=csv.split(/\r?\n/,1)[0]||"";
 const separator=(firstLine.match(/;/g)||[]).length>(firstLine.match(/,/g)||[]).length?";":",";
 const rows:string[][]=[];let row:string[]=[],cell="",quoted=false;
 for(let i=0;i<csv.length;i++){
  const ch=csv[i];
  if(ch==='"'&&quoted&&csv[i+1]==='"'){cell+='"';i++;continue;}
  if(ch==='"'){quoted=!quoted;continue;}
  if(!quoted&&ch===separator){row.push(cell);cell="";continue;}
  if(!quoted&&(ch==="\n"||ch==="\r")){if(ch==="\r"&&csv[i+1]==="\n")i++;row.push(cell);if(row.some(v=>v.trim()))rows.push(row);row=[];cell="";continue;}
  cell+=ch;
 }
 row.push(cell);if(row.some(v=>v.trim()))rows.push(row);
 return rows.slice(0,10001);
}
export function localRun(mode:string, v:Record<string,string>, fileText:string):Result {
 const n=(key:string,zero=false)=>requireNumber(v,key,zero);
 const metrics=(...items:[string,string][]):Metric[]=>items.map(([label,value])=>({label,value}));
 switch(mode){
 case "robots":{
  const lines=(v.body||"").split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
  if(!lines.length)throw new Error("Wklej zawartość robots.txt.");
  const invalid=lines.filter(s=>!s.startsWith("#")&&!/^(user-agent|allow|disallow|sitemap|crawl-delay|host):/i.test(s));
  return {title:"Analiza składni robots.txt",metrics:metrics(["Dyrektywy",String(lines.filter(s=>!s.startsWith("#")).length)],["User-agent",String(lines.filter(s=>/^user-agent:/i.test(s)).length)],["Disallow",String(lines.filter(s=>/^disallow:/i.test(s)).length)]),messages:[...invalid.slice(0,8).map(s=>"Nierozpoznana dyrektywa: "+s),...(lines.some(s=>/^disallow:\s*\/\s*$/i.test(s))?["Wykryto Disallow: / — sprawdź, czy celowo blokujesz ścieżkę główną."]:[])],warning:"To kontrola składni. Interpretacja robots.txt zależy od grup User-agent i reguł dopasowania."};
 }
 case "sitemap":{
  const xml=(v.body||"").trim();if(!xml)throw new Error("Wklej mapę XML.");
  const doc=new DOMParser().parseFromString(xml,"application/xml");
  if(doc.querySelector("parsererror"))throw new Error("Błąd składni XML — sprawdź zamknięcie tagów i encje.");
  const name=doc.documentElement.localName;
  if(name!=="urlset"&&name!=="sitemapindex")throw new Error("Głównym elementem musi być urlset albo sitemapindex.");
  const locations=Array.from(doc.getElementsByTagName("loc")).map(el=>el.textContent?.trim()||"");
  const bad=locations.filter(s=>{try{return !["http:","https:"].includes(new URL(s).protocol)}catch{return true}});
  return {title:"Wynik sprawdzania mapy strony",metrics:metrics(["Typ",name],["Liczba adresów",String(locations.length)],["Niepoprawne URL",String(bad.length)]),messages:[...(bad.length?["Wykryto "+bad.length+" niepoprawnych adresów."]:[]),...(locations.length>50000?["Jedna mapa XML zwykle nie powinna przekraczać 50 000 adresów."]:[]),...(locations.length===0?["Mapa nie zawiera elementów loc."]:[])],warning:"Poprawny XML nie jest równoznaczny z zaindeksowaniem adresów przez wyszukiwarkę."};
 }
 case "schema":{
  const data=JSON.parse(v.body||"");
  const entries=Array.isArray(data)?data:[data];
  const nodes=entries.flatMap((el:unknown)=>{if(typeof el!=="object"||el===null)return [];const obj=el as Record<string,unknown>;return Array.isArray(obj["@graph"])?obj["@graph"]:[obj];});
  const named=nodes.filter((el:unknown)=>typeof el==="object"&&el!==null&&"@type" in el);
  return {title:"Dane JSON-LD są składniowo poprawne",metrics:metrics(["Obiekty",String(nodes.length)],["Obiekty z @type",String(named.length)]),messages:[...(!JSON.stringify(data).includes("schema.org")?["Sprawdź, czy @context wskazuje na https://schema.org."]:[]),...(nodes.length!==named.length?["Nie wszystkie obiekty mają pole @type."]:[])],warning:"To walidator składni i podstawowych pól, a nie oficjalny test zgodności z Google Rich Results."};
 }
 case "schemaGenerate":{
  if(!v.name?.trim()||!v.url?.trim())throw new Error("Wpisz nazwę firmy i adres strony.");
  const url=safeUrl(v.url);
  const obj:Record<string,unknown>={"@context":"https://schema.org","@type":"LocalBusiness",name:v.name.trim(),url:url.href};
  if(v.city?.trim()||v.street?.trim())obj.address={"@type":"PostalAddress",addressLocality:v.city?.trim()||undefined,streetAddress:v.street?.trim()||undefined,addressCountry:"PL"};
  if(v.phone?.trim())obj.telephone=v.phone.trim();
  return {title:"Gotowy kod JSON-LD",text:'<script type="application/ld+json">\n'+JSON.stringify(obj,null,2)+'\n</script>',warning:"Umieść znacznik tylko wtedy, gdy typ LocalBusiness i podane informacje są odpowiednie dla faktycznej działalności."};
 }
 case "serp":{
  if(!v.title?.trim()||!v.url?.trim())throw new Error("Podaj adres URL i tytuł.");
  const url=safeUrl(v.url);
  return {title:"Symulacja wyniku wyszukiwania",metrics:metrics(["Title",v.title.length+" znaków"],["Description",(v.description||"").length+" znaków"]),text:url.hostname+"\n\n"+v.title.trim()+"\n"+(v.description||"").trim(),messages:[...(v.title.length>65?["Tytuł jest dość długi i może zostać skrócony."]:[]),...((v.description||"").length>160?["Opis może zostać skrócony w wynikach wyszukiwania."]:[])],warning:"To orientacyjny podgląd. Google może wygenerować własny tytuł i opis."};
 }
 case "llms":{
  if(!v.name?.trim()||!v.description?.trim())throw new Error("Podaj nazwę i opis.");
  const links=(v.links||"").split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
  const valid=links.filter(s=>{try{safeUrl(s);return true;}catch{return false;}});
  const root=v.url?.trim()?safeUrl(v.url).href:"";
  const result="# "+v.name.trim().replace(/[\r\n#]/g," ")+"\n\n> "+v.description.trim().replace(/\r?\n/g," ")+"\n\n"+(root?"Strona: "+root+"\n\n":"")+(valid.length?"## Najważniejsze zasoby\n\n"+valid.map(s=>"- ["+new URL(s).pathname.replace(/\W+/g," ").trim().slice(0,50)+"]("+s+")").join("\n")+"\n":"");
  return {title:"Zawartość pliku llms.txt",text:result,warning:"Format llms.txt nie gwarantuje dostępu do modeli AI ani cytowania witryny."};
 }
 case "adsIssues":{
  const help=adsHelp[v.issue||"inactive"];return {title:help.title,messages:help.steps.map((s,i)=>(i+1)+". "+s),warning:help.warning};
 }
 case "adsCsv":{
  if(!fileText.trim())throw new Error("Wybierz plik CSV z raportem reklam.");
  const rows=csvRows(fileText.replace(/^\uFEFF/,""));if(rows.length<2)throw new Error("Plik musi zawierać nagłówki i co najmniej jeden wiersz.");
  const header=rows[0].map(s=>s.trim().toLowerCase());
  const find=(candidates:string[])=>header.findIndex(x=>candidates.some(c=>x.includes(c)));
  const spend=find(["wydana kwota","amount spent","wydatki","spent"]);
  const leads=find(["wyniki","results","potencjalni klienci","leady","leads"]);
  const clicks=find(["kliknięcia linku","link clicks","clicks (link)"]);
  const impressions=find(["wyświetlenia","impressions"]);
  const sum=(index:number)=>index<0?null:rows.slice(1).reduce((a,row)=>a+parseLocaleNumber(row[index]||"0"),0);
  const sp=sum(spend),ld=sum(leads),cl=sum(clicks),im=sum(impressions);
  if([sp,ld,cl,im].every(a=>a===null))throw new Error("Nie rozpoznano kolumn raportu. Wyeksportuj CSV z kolumnami: wydana kwota, wyniki, kliknięcia linku, wyświetlenia.");
  return {title:"Podsumowanie eksportu CSV",metrics:metrics(["Wiersze kampanii",String(rows.length-1)],...(sp!==null?[["Wydatki",pln(sp)] as [string,string]]:[]),...(ld!==null?[["Wyniki",fmt(ld,0)] as [string,string]]:[]),...(sp!==null&&ld!==null&&ld>0?[["CPL / koszt wyniku",pln(sp/ld)] as [string,string]]:[]),...(cl!==null?[["Kliknięcia linku",fmt(cl,0)] as [string,string]]:[]),...(im!==null&&cl!==null&&im>0?[["CTR linku",fmt(cl/im*100)+"%"] as [string,string]]:[])),messages:["Rozpoznane kolumny: "+[spend>=0?"wydatki":"",leads>=0?"wyniki":"",clicks>=0?"kliknięcia":"",impressions>=0?"wyświetlenia":""].filter(Boolean).join(", ")],warning:"Wyniki mogą oznaczać różne typy zdarzeń. Sprawdź zakres dat, walutę, atrybucję i czy eksport nie zawiera wierszy sumy."};
 }
 case "cpc":{const sp=n("spend"),clicks=n("clicks");return {title:"Średni koszt kliknięcia CPC",metrics:metrics(["CPC",pln(sp/clicks)],["Wydatki",pln(sp)],["Kliknięcia",fmt(clicks,0)]),warning:"CPC dotyczy tylko wskazanego rodzaju kliknięcia i nie mierzy jakości ruchu."};}
 case "cpm":{const sp=n("spend"),im=n("impressions");return {title:"Koszt tysiąca wyświetleń CPM",metrics:metrics(["CPM",pln(sp/im*1000)],["Wydatki",pln(sp)],["Wyświetlenia",fmt(im,0)]),warning:"CPM sam w sobie nie przesądza o skuteczności reklamy."};}
 case "traffic":{const views=n("views"),rate=n("rate",true);if(rate>100)throw new Error("Konwersja musi być w zakresie 0–100%.");return {title:"Scenariusz pozyskania leadów",metrics:metrics(["Zakładane leady",fmt(views*rate/100,1)],["Konwersja",fmt(rate)+"%"],["Odwiedziny",fmt(views,0)]),warning:"To wynik modelu matematycznego, nie prognoza skuteczności strony."};}
 case "ltv":{const avg=n("avg"),orders=n("orders"),years=n("years"),margin=n("margin",true);if(margin>100)throw new Error("Marża musi wynosić 0–100%.");const rev=avg*orders*years;return {title:"Uproszczony model LTV",metrics:metrics(["Przychód w okresie",pln(rev)],["Marża z klienta (LTV)",pln(rev*margin/100)],["Roczne przychody",pln(avg*orders)]),warning:"Model zakłada stałą liczbę zakupów bez churn, rabatów i dyskonta."};}
 case "base64":{const input=v.body||"";if(!input)throw new Error("Wpisz tekst.");if(v.operation==="decode"){
   const raw=atob(input.trim().replace(/\s+/g,""));const bytes=Uint8Array.from(raw,ch=>ch.charCodeAt(0));
   return {title:"Zdekodowany tekst UTF-8",text:new TextDecoder("utf-8",{fatal:true}).decode(bytes)};
  }const bytes=new TextEncoder().encode(input);const binary=Array.from(bytes,b=>String.fromCharCode(b)).join("");return {title:"Zakodowany Base64",text:btoa(binary),warning:"Base64 nie szyfruje i nie chroni danych."};}
 case "contrast":{const parse=(value:string)=>{const s=value.trim();if(!/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(s))throw new Error("Podaj kolor HEX w formacie #fff lub #ffffff.");const hex=s.length===4?s.slice(1).split("").map(x=>x+x).join(""):s.slice(1);const channels=[0,2,4].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(x=>x<=0.04045?x/12.92:((x+0.055)/1.055)**2.4);return channels[0]*0.2126+channels[1]*0.7152+channels[2]*0.0722;};
   const l1=parse(v.fg||""),l2=parse(v.bg||"");const ratio=(Math.max(l1,l2)+.05)/(Math.min(l1,l2)+.05);
   return {title:"Kontrast WCAG",metrics:metrics(["Współczynnik",fmt(ratio,2)+":1"],["WCAG AA tekst zwykły",ratio>=4.5?"Spełnia":"Nie spełnia"],["WCAG AA tekst duży",ratio>=3?"Spełnia":"Nie spełnia"],["WCAG AAA zwykły",ratio>=7?"Spełnia":"Nie spełnia"]),warning:"Dotyczy kontrastu 2 kolorów, nie kompleksowej zgodności witryny z WCAG."};}
 case "roas":{const spend=n("spend"),revenue=n("revenue",true);return {title:"Wynik kampanii",metrics:metrics(["ROAS",fmt(revenue/spend)+"×"],["Przychód / 1 zł reklamy",pln(revenue/spend)],["Przychód minus reklamy",pln(revenue-spend)]),warning:"Przychód minus reklamę nie jest zyskiem netto. Uwzględnij koszt produktu, realizacji i pozostałe wydatki."};}
 case "cpl":{const spend=n("spend"),leads=n("leads");return {title:"Koszt pozyskania leada",metrics:metrics(["CPL",pln(spend/leads)],["Wydatki",pln(spend)],["Leady",fmt(leads,0)]),warning:"Sam CPL nie mówi nic o jakości zapytań ani o sprzedaży."};}
 case "budget":{const leads=n("leads"),cpl=n("cpl");return {title:"Orientacyjny budżet na kampanię",metrics:metrics(["Potrzebny budżet",pln(leads*cpl)],["Liczba leadów",fmt(leads,0)],["Założony CPL",pln(cpl)]),warning:"Wynik to obliczenie scenariuszowe, nie prognoza skuteczności kampanii."};}
 case "profit":{const rev=n("revenue",true),m=n("margin",true),spend=n("spend",true);if(m>100)throw new Error("Marża nie może przekraczać 100%.");return {title:"Uproszczona rentowność reklam",metrics:metrics(["Marża brutto",pln(rev*m/100)],["Marża po reklamach",pln(rev*m/100-spend)],["ROAS",spend?fmt(rev/spend)+"×":"—"]),warning:"To nie jest wynik księgowy. Brakuje kosztów stałych, obsługi, podatków i zwrotów."};}
 case "utm":{if(!v.url?.trim())throw new Error("Wpisz adres docelowy.");const u=safeUrl(v.url);for(const [key,val] of [["utm_source",v.source],["utm_medium",v.medium],["utm_campaign",v.campaign],["utm_content",v.content]] as const){if(val?.trim())u.searchParams.set(key,val.trim());}if(!v.source?.trim()||!v.medium?.trim()||!v.campaign?.trim())throw new Error("Wypełnij source, medium i campaign.");return {title:"Gotowy link UTM",text:u.toString(),warning:"Korzystaj ze spójnego nazewnictwa kampanii, np. paid_social / facebook / nazwa-kampanii."};}
 case "adText":{if(!v.headline?.trim()&&!v.body?.trim())throw new Error("Wpisz przynajmniej jeden tekst.");return {title:"Statystyki tekstu reklamy",metrics:metrics(["Nagłówek",String((v.headline||"").length)+" znaków"],["Tekst główny",String((v.body||"").length)+" znaków"],["Słowa",String(((v.headline||"")+" "+(v.body||"")).trim().split(/\s+/).filter(Boolean).length)]),warning:"Meta może obcinać wyświetlany tekst w zależności od formatu i miejsca emisji. Nie ma jednego uniwersalnego limitu."};}
 case "conversion":{const views=n("views"),leads=n("leads",true),clients=n("clients",true);return {title:"Konwersja ruchu w klientów",metrics:metrics(["Od wizyty do leada",fmt(leads/views*100)+"%"],["Od leada do klienta",leads?fmt(clients/leads*100)+"%":"—"],["Od wizyty do klienta",fmt(clients/views*100)+"%"]),warning:"Sprawdź, czy wszystkie dane dotyczą tego samego okresu i źródła ruchu."};}
 case "cac":{const spend=n("spend"),clients=n("clients");return {title:"Koszt pozyskania klienta",metrics:metrics(["CAC",pln(spend/clients)],["Łączny koszt",pln(spend)],["Nowi klienci",fmt(clients,0)]),warning:"Wliczaj do CAC konsekwentnie koszty marketingu i procesu sprzedaży."};}
 case "lostLeads":{const leads=n("leads"),rate=n("rate",true),margin=n("margin",true);if(rate>100)throw new Error("Konwersja musi być w zakresie 0–100%.");return {title:"Scenariusz wartości utraconych leadów",metrics:metrics(["Potencjalne transakcje",fmt(leads*rate/100)],["Potencjalna marża / miesiąc",pln(leads*rate/100*margin)],["Potencjalna marża / rok",pln(leads*rate/100*margin*12)]),warning:"To hipotetyczny scenariusz, nie rzeczywiście utracone przychody."};}
 case "crm":{const leads=n("leads"),delta=n("delta",true),margin=n("margin",true),cost=n("cost",true),monthly=n("monthly",true);if(delta>100)throw new Error("Podaj realistyczną zmianę konwersji w punktach procentowych.");const extra=leads*delta/100*margin;const net=extra-monthly;return {title:"Model zwrotu z inwestycji w CRM",metrics:metrics(["Dodatkowa marża / miesiąc",pln(extra)],["Po kosztach utrzymania",pln(net)],["Zwrot z wdrożenia",net>0?fmt(cost/net,1)+" mies.":"brak przy tych założeniach"]),warning:"Założony wzrost konwersji nie jest prognozą ani gwarancją efektu wdrożenia."};}
 case "automation":{const hours=n("hours"),cost=n("cost",true),rate=n("rate",true),monthly=n("monthly",true);if(rate>100)throw new Error("Automatyzowany procent czasu musi wynosić 0–100%.");const saved=hours*rate/100;return {title:"Oszczędność czasu i kosztu pracy",metrics:metrics(["Odzyskany czas / miesiąc",fmt(saved,1)+" h"],["Wartość odzyskanego czasu",pln(saved*cost)],["Po koszcie narzędzi",pln(saved*cost-monthly)]),warning:"Wartość odzyskanego czasu nie musi oznaczać oszczędności gotówkowej."};}
 case "siteCost":{const count=n("pages");if(count>150)throw new Error("Przy ponad 150 podstronach potrzebna jest indywidualna wycena.");const type=v.type||"business";const base=type==="landing"?2000:type==="extended"?7500:4000;const add=Math.max(0,count-1)*(type==="extended"?400:250);const extra=v.forms==="advanced"?2500:0;const low=base+add+extra;return {title:"Orientacyjny przedział budżetu",metrics:metrics(["Minimalny model",pln(low)],["Rozszerzony zakres",pln(Math.round(low*1.65))]),messages:["Przyjęty przykładowy koszt bazowy: "+pln(base)+".","Dodatkowe podstrony i integracje zwiększają orientacyjny budżet."],warning:"To przykładowe założenia kalkulatora, nie oficjalny cennik bernecki.dev ani wiążąca oferta."};}
 case "jwt":{const value=(v.body||"").trim();const parts=value.split(".");if(parts.length!==3)throw new Error("JWT powinien składać się z trzech części oddzielonych kropką.");const decode=(s:string)=>{const raw=atob(s.replace(/-/g,"+").replace(/_/g,"/").padEnd(Math.ceil(s.length/4)*4,"="));return JSON.parse(new TextDecoder().decode(Uint8Array.from(raw,c=>c.charCodeAt(0)))) as Record<string,unknown>;};const header=decode(parts[0]),payload=decode(parts[1]);const exp=typeof payload.exp==="number"?new Date(payload.exp*1000).toLocaleString("pl-PL",{timeZone:"Europe/Warsaw"}):"";return {title:"Zdekodowany token JWT",metrics:metrics(["Algorytm",String(header.alg||"brak")],["Ważność exp (czas PL)",exp||"nie podano"]),text:JSON.stringify({header,payload},null,2),warning:"Token nie został zweryfikowany kryptograficznie. Nie wklejaj tokenów do niesprawdzonych usług."};}
 case "unix":{const input=(v.timestamp||"").trim()||String(Math.floor(Date.now()/1000));const t=Number(input);if(!Number.isFinite(t))throw new Error("Podaj prawidłowy timestamp.");const date=new Date(Math.abs(t)>1e11?t:t*1000);if(!Number.isFinite(date.getTime()))throw new Error("Podano datę poza obsługiwanym zakresem.");return {title:"Konwersja czasu Unix",metrics:metrics(["UTC",date.toISOString()],["Polska",date.toLocaleString("pl-PL",{timeZone:"Europe/Warsaw"})],["Timestamp w sekundach",String(Math.floor(date.getTime()/1000))],["Timestamp w milisekundach",String(date.getTime())])};}
 case "json":{const val=JSON.parse(v.body||"");return {title:"Poprawny JSON",text:JSON.stringify(val,null,2),messages:["Składnia została sprawdzona lokalnie w przeglądarce."]};}
 case "uuid":{const arr=Array.from({length:5},()=>crypto.randomUUID());return {title:"Wygenerowane UUID v4",text:arr.join("\n"),messages:["Identyfikatory wygenerowano lokalnie przy użyciu crypto.randomUUID()."]};}
 default:throw new Error("Nieznany rodzaj narzędzia.");
 }
}
export function fromSite(mode:string,d:SiteReport):Result{
 if(mode==="tls"){
  const c=d.tls;if(!c)throw new Error("Nie znaleziono danych certyfikatu.");
  return {title:"Certyfikat TLS domeny "+d.host,metrics:[{label:"Weryfikacja",value:c.authorized?"Poprawna":"Błąd: "+c.authorizationError},{label:"Ważny do",value:c.validTo||"—"},{label:"Pozostałe dni",value:c.daysRemaining===null?"—":String(c.daysRemaining)},{label:"Protokół",value:c.protocol||"—"},{label:"Wystawca",value:c.issuer||"—"},{label:"Domena (CN)",value:c.subject||"—"}],warning:"To punktowa kontrola połączenia na porcie 443, nie pełen audyt bezpieczeństwa TLS."};
 }
 if(mode==="dns"){
  const c=d.dns;if(!c)throw new Error("Brak odpowiedzi DNS.");
  return {title:"Wynik SPF / DMARC dla "+d.host,metrics:[{label:"Rekordy SPF",value:String(c.spf.length)},{label:"Rekordy DMARC",value:String(c.dmarc.length)}],messages:[...c.notes,...c.spf.map(v=>"SPF: "+v),...c.dmarc.map(v=>"DMARC: "+v)],warning:"Tester nie sprawdza DKIM, realnej dostarczalności wiadomości ani ustawień dostawcy poczty."};
 }
 const h=d.html;if(!h)throw new Error("Serwer nie zwrócił danych HTML.");
 const base:Result={title:"Analiza strony "+new URL(d.url).hostname,metrics:[{label:"HTTP",value:String(d.status)},{label:"TTFB tego żądania",value:d.ttfb+" ms"},{label:"Pobrany HTML",value:fmt(d.bytes/1024,1)+" kB"}],messages:[],warning:"Analiza obejmuje pobrany publiczny HTML jednej podstrony. Nie jest pomiarem Core Web Vitals ani potwierdzeniem indeksacji."};
 if(mode==="ttfb"){base.metrics=[{label:"TTFB z serwera testowego",value:d.ttfb+" ms"},{label:"Kod HTTP",value:String(d.status)},{label:"HTML",value:fmt(d.bytes/1024,1)+" kB"}];base.warning="Jedno żądanie z infrastruktury serwera. Wynik zmienia się zależnie od cache, obciążenia i położenia. To nie pełny pomiar szybkości strony.";return base;}
 if(mode==="redirects"){base.metrics=[{label:"Liczba przekierowań",value:String(d.redirects?.length||0)},{label:"Końcowy status HTTP",value:String(d.status)},{label:"Docelowy URL",value:d.url}];base.messages=(d.redirects||[]).map(x=>x.status+" "+x.from+" → "+x.to);if(!base.messages.length)base.messages=["Nie wykryto przekierowań HTTP w badanym żądaniu."];return base;}
 if(mode==="headers"){const wanted=["content-security-policy","strict-transport-security","x-content-type-options","referrer-policy","permissions-policy","x-frame-options"];base.metrics=wanted.map(k=>({label:k,value:d.headers?.[k]?"Obecny":"Brak"}));base.messages=wanted.filter(k=>d.headers?.[k]).map(k=>k+": "+String(d.headers?.[k]).slice(0,200));base.warning="Odczyt nagłówków nie jest audytem bezpieczeństwa. Same nazwy nagłówków nie wystarczą do oceny ich polityk.";return base;}
 if(mode==="pixel"||mode==="gtm"){const found=mode==="pixel"?h.tracking?.metaPixel:h.tracking?.gtm;const measurement=mode==="pixel"?"Meta Pixel":"Google Tag Manager";base.metrics=[{label:measurement,value:found?"Znaleziono ślad kodu":"Nie wykryto w HTML"},{label:"Kod HTTP",value:String(d.status)},...(mode==="gtm"?[{label:"Google Analytics / gtag",value:h.tracking?.ga4?"Wykryto ślad":"Brak śladu"}]:[])];base.warning="Tester przeszukuje kod HTML pobrany z serwera; skrypty dołączone przez JavaScript po załadowaniu lub przez menedżer zgód mogą nie być widoczne. Wykryty ślad nie potwierdza wysyłania zdarzeń.";return base;}
 if(mode==="images"){base.metrics=[{label:"Obrazy img w HTML",value:String(h.imageCount)},{label:"Brak atrybutu alt",value:String(h.imagesMissingAlt)},{label:"Z atrybutem alt",value:String(h.imageCount-h.imagesMissingAlt)}];base.warning="Pusty atrybut alt może być prawidłowy dla obrazów dekoracyjnych. Nie analizowano obrazów dynamicznie ładowanych przez JavaScript.";return base;}
 if(mode==="meta"){base.metrics=[{label:"Title",value:h.title||"brak"},{label:"Description",value:h.description||"brak"},{label:"Canonical",value:h.canonical||"brak"},{label:"Robots",value:h.robots||"brak"},{label:"Język",value:h.lang||"brak"}];base.messages=["Title: "+h.title.length+" znaków; meta description: "+h.description.length+" znaków."];return base;}
 if(mode==="headings"){base.metrics=[{label:"H1",value:String(h.headings.filter(x=>x.level===1).length)},{label:"H2",value:String(h.headings.filter(x=>x.level===2).length)},{label:"Pozostałe",value:String(h.headings.filter(x=>x.level>2).length)}];base.messages=h.headings.map(x=>"H"+x.level+": "+(x.text||"(pusty)"));return base;}
 if(mode==="og"){base.metrics=[{label:"og:title",value:h.og.title||"brak"},{label:"og:description",value:h.og.description||"brak"},{label:"og:image",value:h.og.image||"brak"},{label:"twitter:card",value:h.twitter||"brak"}];base.messages=[...(h.og.image?[]:["Brak og:image — udostępniony link może nie mieć odpowiedniej miniatury."])];return base;}
 if(mode==="ai"){
  const lines=(d.robots||"").split(/\r?\n/);
  const relevant=lines.filter(s=>/gptbot|oai-searchbot|chatgpt-user|claudebot|perplexitybot|google-extended|disallow|allow/i.test(s)).slice(0,35);
  base.metrics=[{label:"HTML HTTP",value:String(d.status)},{label:"Meta robots",value:h.robots||"brak"},{label:"robots.txt",value:d.robotsAvailable?"odczytano":"nie odczytano"},{label:"Tekst HTML",value:h.title?"wykryto tytuł":"brak tytułu"}];
  base.messages=relevant.length?["Wybrane reguły robots.txt:",...relevant]:["Nie odczytano reguł botów AI. Nie oznacza to automatycznie dostępu lub blokady."];
  base.warning="Reguły wymagają interpretacji w grupach User-agent. Sam dostęp crawlera nie oznacza obecności w odpowiedziach AI.";
  return base;
 }
 const checks=[
  [h.title.length>0,"Brakuje znacznika title."],
  [h.description.length>0,"Brakuje meta description."],
  [h.headings.some(x=>x.level===1),"W pobranym HTML nie znaleziono H1."],
  [h.canonical.length>0,"Brakuje adresu canonical."],
  [!/\bnoindex\b/i.test(h.robots),"Meta robots zawiera noindex — sprawdź, czy zamierzone."],
  [h.lang.length>0,"Brakuje atrybutu lang w znaczniku HTML."],
  [h.hasViewport,"Brak meta viewport."],
  [h.imagesMissingAlt===0,h.imagesMissingAlt+" obrazów nie ma atrybutu alt."]
 ] as [boolean,string][];
 const alerts=checks.filter(([okay])=>!okay).map(([,msg])=>msg);
 base.metrics=[{label:"Sprawdzone elementy",value:String(checks.length)},{label:"Uwag do weryfikacji",value:String(alerts.length)},{label:"HTTP",value:String(d.status)},{label:"TTFB tego żądania",value:d.ttfb+" ms"},{label:"Rozmiar HTML",value:fmt(d.bytes/1024,1)+" kB"}];
 base.messages=alerts.length?alerts:["Nie wykryto problemów w tym zestawie podstawowych kontroli.",...(h.title.length>65?["Długi title — warto przejrzeć."]:[])];
 if(mode==="seo")base.messages.push("Dane strukturalne JSON-LD: "+h.jsonLdCount+" bloków. Liczba linków: "+h.linkCount+".");
 return base;
}
export async function calculateSha256(input:string):Promise<string>{
 const hash=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(input));
 return Array.from(new Uint8Array(hash),b=>b.toString(16).padStart(2,"0")).join("");
}
export function FreeToolRunner({mode,slug}:{mode:string;slug:string}){
 const [values,setValues]=useState<Record<string,string>>({});
 const [result,setResult]=useState<Result|null>(null);
 const [error,setError]=useState("");
 const [loading,setLoading]=useState(false);
 const [csv,setCsv]=useState("");
 const [filename,setFilename]=useState("");
 const set=(key:string,value:string)=>{setValues(current=>({...current,[key]:value}));setResult(null);setError("");};
 const run=async(e:React.FormEvent<HTMLFormElement>)=>{
  e.preventDefault();setLoading(true);setError("");setResult(null);
  try{
   if(["site","seo","meta","headings","og","ai","tls","dns","ttfb","redirects","headers","pixel","gtm","images"].includes(mode)){
    const response=await fetch("/api/tools/inspect",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({url:values.url||"",mode}),signal:AbortSignal.timeout(20000)});
    const d=await response.json() as SiteReport&{error?:string};
    if(!response.ok)throw new Error(d.error||"Nie udało się sprawdzić strony.");
    setResult(fromSite(mode,d));
   }else if(mode==="sha256"){
    if(!values.body)throw new Error("Wpisz tekst do obliczenia skrótu SHA-256.");
    const digest=await calculateSha256(values.body);
    setResult({title:"Skrót SHA-256",text:digest,warning:"Skrót jest obliczany lokalnie; do przechowywania haseł stosuj funkcje specjalnie do tego przeznaczone, np. Argon2id."});
   }else setResult(localRun(mode,values,csv));
  }catch(e){setError(e instanceof Error?e.message:"Nie udało się wykonać analizy.");}
  finally{setLoading(false);}
 };
 const output=result?[result.title,...(result.metrics||[]).map(a=>a.label+": "+a.value),...(result.messages||[]),result.text||"",result.warning||""].filter(Boolean).join("\n"):"";
 const download=()=>{
  if(!output)return;
  const url=URL.createObjectURL(new Blob([output],{type:"text/plain;charset=utf-8"}));
  const a=document.createElement("a");a.href=url;a.download=slug+"-raport.txt";a.click();URL.revokeObjectURL(url);
 };
 return <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,.88fr)]">
  <form onSubmit={run} className="rounded-2xl border border-white/15 bg-[#111111] p-5 shadow-[0_20px_80px_#0005] md:p-7">
   <div className="mb-7 flex items-center justify-between gap-3"><h2 className="text-xl font-medium tracking-tight md:text-2xl">Dane do analizy</h2><span className="rounded-full border border-white/15 px-3 py-1 text-[11px] text-white/65">Bez rejestracji</span></div>
   <div className="space-y-5">
   {(inputs[mode]||[]).map(field=><label key={field.key} className="block">
    <span className="mb-2 block text-sm font-medium text-white/85">{field.label}</span>
    {field.type==="select"
     ?<select className="w-full rounded-xl border border-white/20 bg-[#191919] px-4 py-3.5 text-white outline-none focus:border-white/65" value={values[field.key]||field.options?.[0].value||""} onChange={e=>set(field.key,e.target.value)}>{field.options?.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}</select>
     :field.type==="textarea"
     ?<textarea rows={mode==="jwt"?5:mode==="adsIssues"?4:8} className="min-h-36 w-full resize-y rounded-xl border border-white/20 bg-[#0a0a0a] px-4 py-3 font-mono text-sm leading-relaxed text-white outline-none placeholder:text-white/30 focus:border-white/65" placeholder={field.placeholder} value={values[field.key]||""} onChange={e=>set(field.key,e.target.value)} />
     :<input type={field.type==="number"?"text":"text"} inputMode={field.type==="number"?"decimal":undefined} className="w-full min-w-0 rounded-xl border border-white/20 bg-[#0a0a0a] px-4 py-3.5 text-sm text-white outline-none placeholder:text-white/30 focus:border-white/65" placeholder={field.placeholder} value={values[field.key]||""} onChange={e=>set(field.key,e.target.value)} />}
    {field.hint&&<span className="mt-1 block text-xs text-white/50">{field.hint}</span>}
   </label>)}
   {mode==="adsCsv"&&<label className="flex cursor-pointer flex-col items-center gap-3 rounded-xl border border-dashed border-white/35 bg-[#0a0a0a] px-4 py-9 text-center hover:border-white/70">
      <FileUp size={30} strokeWidth={1.5}/><span className="text-sm font-medium">{filename||"Wybierz eksport CSV z Menedżera reklam"}</span><span className="text-xs text-white/55">Maks. 1 MB. Plik analizowany tylko w Twojej przeglądarce.</span>
      <input type="file" accept=".csv,text/csv" className="sr-only" onChange={async e=>{const f=e.target.files?.[0];if(!f)return;if(f.size>1_000_000){setError("Maksymalny rozmiar pliku wynosi 1 MB.");return;}setCsv(await f.text());setFilename(f.name);setResult(null);setError("");}}/>
     </label>}
   {mode==="uuid"&&<p className="text-sm leading-7 text-white/65">Wygeneruj pięć unikatowych identyfikatorów UUID v4. Nie wymagamy danych wejściowych.</p>}
   </div>
   <button disabled={loading} type="submit" className="brand-action mt-7 flex w-full min-h-12 items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold disabled:opacity-60">
     {loading?<LoaderCircle size={18} className="animate-spin"/>:<ArrowRight size={18}/>}
     {loading?"Trwa sprawdzanie...":mode==="uuid"?"Wygeneruj identyfikatory":"Sprawdź / oblicz za darmo"}
   </button>
   {error&&<p className="mt-4 rounded-xl border border-rose-400/30 bg-rose-400/5 p-3 text-sm leading-6 text-rose-200" role="alert">{error}</p>}
   <p className="mt-4 text-xs leading-6 text-white/45">{["jwt","json","adsCsv","uuid","base64","sha256"].includes(mode)?"Dane przetwarzane lokalnie — nie są wysyłane do serwera.":"Bez obowiązkowego konta. Analizy zewnętrznych domen wymagają krótkiego zapytania do serwera."}</p>
  </form>
  <section aria-live="polite" aria-atomic="true" className="min-w-0 rounded-2xl border border-white/15 bg-[#111111] p-5 md:p-7">
   <div className="mb-7 flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-medium tracking-tight md:text-2xl">Wynik</h2>{result&&<div className="flex gap-2"><button type="button" onClick={()=>navigator.clipboard.writeText(output)} className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-3 py-2 text-xs hover:border-white/65"><ClipboardCopy size={14}/>Kopiuj</button><button type="button" onClick={download} className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-3 py-2 text-xs hover:border-white/65"><Download size={14}/>TXT</button></div>}</div>
   {!result?<div className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-white/15 bg-[#0b0b0b] px-5 text-center text-white/50"><RotateCcw size={25} strokeWidth={1.4}/><p className="max-w-xs text-sm leading-6">Uzupełnij dane po lewej stronie, aby otrzymać wynik bez zakładania konta.</p></div>:
    <div className="space-y-5">
     <p className="flex items-center gap-2 text-sm font-medium text-white"><Check size={17}/>{result.title}</p>
     {result.metrics&&<dl className="grid gap-2 sm:grid-cols-2">{result.metrics.map(m=><div key={m.label} className="min-w-0 rounded-xl border border-white/10 bg-[#090909] p-3.5"><dt className="text-xs text-white/55">{m.label}</dt><dd className="mt-2 break-words text-lg font-medium tracking-tight text-white">{m.value}</dd></div>)}</dl>}
     {Boolean(result.messages?.length)&&<div className="space-y-2">{result.messages?.map((message,i)=><p key={i} className="rounded-lg border border-white/10 px-3 py-2.5 text-sm leading-6 text-white/80">{message}</p>)}</div>}
     {result.text&&<pre className="max-h-[460px] overflow-auto whitespace-pre-wrap break-all rounded-xl border border-white/10 bg-[#080808] p-4 font-mono text-xs leading-6 text-white/80">{result.text}</pre>}
     {result.warning&&<p className="border-t border-white/10 pt-4 text-xs leading-6 text-white/55">{result.warning}</p>}
    </div>}
  </section>
 </div>;
}
