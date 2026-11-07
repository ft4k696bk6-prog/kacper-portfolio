"use client";
import { useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { realizations } from "@/content/realizations";
import { InteractiveImageAccordion } from "@/components/ui/interactive-image-accordion";

const realizationCovers: Record<string, { image: string; alt: string; href?: string }> = {
 "isto-kebab-strona": {image:"https://s0.wp.com/mshots/v1/https%3A%2F%2Ftest-test-kebab-berni.vercel.app%2F?vpw=1440&vph=940&w=1200",alt:"Zrzut autentycznej strony Isto Kebab, z publicznego wdrożenia",href:"/realizacje/isto-kebab-strona"},
 "b-code": {image:"b-code-editorial.jpg",alt:"Ilustracja kodu — autorski projekt B-Code"},
 "reenergy-strona": {image:"reenergy-website-live.jpg",alt:"Zrzut działającej strony Re-energy System"},
 "reenergy-rozwoj-marki": {image:"reenergy-campaign-results.jpg",alt:"Case study Re-energy — budżet reklamowy i opis wyników",href:"/case-studies/re-energy-meta-ads"},
 "jalapeno-marketing": {image:"jalapeno-campaign-results.jpg",alt:"Opis kampanii i wyników marketingowych Jalapeno Kebab"},
 "starcars-filmy-social-media": {image:"starcars-social-case.jpg",alt:"Osobna realizacja StarCars — nagrania, montaż i social media"},
};

const previewDescriptions: Record<string, { pl: string; en: string }> = {
 "/realizacje/isto-kebab-strona": {pl:"Isto Kebab: strona, menu i system zamówień.",en:"Isto Kebab: a restaurant site, menu and ordering workflow."},
 "/case-studies/b-crm": {pl:"Autorski CRM: leady, zadania i realizacja sprzedaży w jednym miejscu.",en:"A custom CRM for leads, team tasks and sales delivery."},
 "/case-studies/motomizer": {pl:"Strona produktu z wyborem wariantów i interaktywną prezentacją funkcji.",en:"A product website with variant selection and interactive feature previews."},
 "/case-studies/starcars": {pl:"Import aut z USA i Kanady: oferta, kalkulator kosztów i kontakt.",en:"US and Canadian car imports: services, a cost calculator and contact."},
 "/case-studies/beatmarket": {pl:"Marketplace muzyczny z odsłuchem beatów i wyborem licencji.",en:"A music marketplace with beat previews and licensing options."},
 "/case-studies/interactive-portfolio": {pl:"Interaktywny pulpit z projektami, oknami aplikacji i mini grami.",en:"An interactive desktop with projects, app windows and mini games."},
 "/case-studies/berni-rush": {pl:"Grywalny prototyp areny 3D w przeglądarce.",en:"A playable 3D arena prototype in the browser."},
 "/case-studies/portfolio": {pl:"Moje projekty, doświadczenie i kontakt w jednym miejscu.",en:"My projects, experience and contact details in one place."},
 "/case-studies/unreal-gameplay-prototype": {pl:"Prototyp gry w Unreal Engine 5: jazda, misje i eksploracja.",en:"An Unreal Engine 5 prototype with driving, missions and exploration."},
 "/case-studies/kalkulator-leasingu": {pl:"Kalkulator leasingu z podsumowaniem kosztów i formularzem zapytania.",en:"A leasing calculator with a cost summary and enquiry form."},
};

const realizationPreviews: Record<string, { pl: [string, string]; en: [string, string] }> = {
 "isto-kebab-strona": {pl:["Isto Kebab — strona i zamówienia","Interaktywne menu i strona restauracji z obsługą zamówień."],en:["Isto Kebab — website and orders","An interactive restaurant website with an ordering flow."]},
 "jalapeno-marketing": {pl:["Jalapeno — lokalna społeczność","Reklamy i social media budujące lokalną społeczność."],en:["Jalapeno — local community","Advertising and social media for a local community."]},
 "reenergy-rozwoj-marki": {pl:["Re-energy — rozwój marki","Marketing, pozyskiwanie kontaktów i rekrutacja dla firmy OZE."],en:["Re-energy — brand growth","Marketing, lead generation and recruitment for a renewable energy business."]},
 "reenergy-crm": {pl:["Re-energy — CRM i proces","Obsługa zapytań i pracy zespołu w powiązaniu z reklamami."],en:["Re-energy — CRM & workflows","Enquiry handling and team workflows connected to advertising."]},
 "reenergy-strona": {pl:["Re-energy — strona firmowa","Prezentacja oferty OZE i kontakt z firmą."],en:["Re-energy — company website","Renewable energy services and a direct way to contact the business."]},
 "starcars-filmy-social-media": {pl:["StarCars — filmy i social media","Nagrywanie, montaż rolek i komunikacja marki."],en:["StarCars — video & social media","Filming, editing short videos and brand communication."]},
 "gentlemen-social-media": {pl:["Gentlemen — social media","Komunikacja salonu barberskiego w Warszawie."],en:["Gentlemen — social media","Social media for a barbershop in Warsaw."]},
 "motomizer-marka": {pl:["Motomizer — rozwój marki","Kierunek marki i prezentacja własnego produktu w internecie."],en:["Motomizer — brand development","Brand direction and online presentation of an original product."]},
 "b-code": {pl:["B-Code — narzędzie AI","Autorska aplikacja łącząca modele AI o różnych rolach."],en:["B-Code — AI tool","A custom app connecting AI models with different roles."]},
};

function ProjectMark({title}:{title:string}) {
 const logo=/Isto Kebab/i.test(title)?"/images/brands/isto-kebab.svg":/Jalapeno/.test(title)?"/images/brands/jalapeno.jpg":/Re-energy/i.test(title)?"/images/brands/re-energy.png":/StarCars/.test(title)?"/images/brands/starcars.svg":/Gentlemen/.test(title)?"/images/brands/gentlemen.webp":null;
 if(logo)return <span className={"book-brand-logo "+(/Jalapeno/.test(title)?"book-jalapeno":"")}><Image src={logo} alt="" width={180} height={60}/></span>;
 if(/Motomizer/.test(title))return <span className="book-wordmark">MOTOMIZER</span>;
 const name=/Berni/.test(title)?"BERNI RUSH":/Unreal/.test(title)?"UNREAL ENGINE":/B-Code/.test(title)?"B-CODE":/CRM/.test(title)?"B-CRM":/BeatMarket/.test(title)?"BeatMarket":/leasing/i.test(title)?"LEASING":/MacBook/.test(title)?"KB / INTERACTIVE":"KB / PORTFOLIO";
 return <span className="book-wordmark">{name}</span>;
}
export function Projects(){
 const {t,lang}=useLanguage();const [active,setActive]=useState("");const [filter,setFilter]=useState("Wszystko");
 const categories:Record<string,string>=lang==="pl"?{}:{"Wszystko":"All","Strony":"Websites","CRM i aplikacje":"CRM & apps","Marketing":"Marketing","Autorskie i eksperymenty":"Personal & experimental"};
 const items=[
 ...t.projects.items.map(p=>({title:p.title,description:previewDescriptions[p.caseStudyUrl]?.[lang]??p.description,image:p.caseStudyUrl==="/case-studies/starcars"?"/images/projects/starcars-live-current.jpg":p.image.src,href:p.caseStudyUrl,category:/CRM|BeatMarket/.test(p.title)?"CRM i aplikacje":/Berni|Unreal|Portfolio/.test(p.title)?"Autorskie i eksperymenty":"Strony",demo:p.demoUrl})),
 ...realizations.map(p=>{
   const cover=realizationCovers[p.slug];
   const preview=realizationPreviews[p.slug]?.[lang];
   return {title:preview?.[0]??p.title,description:preview?.[1]??p.summary,image:cover?.image?.startsWith("https://")?cover.image:"/images/projects/"+(cover?.image??p.slug+"-chapter.jpg"),imageAlt:cover?.alt??"Zrzut strony z opisem realizacji: "+p.title,href:cover?.href??"/realizacje/"+p.slug,category:p.category,demo:""};
 })
 ].map(p=>({...p,logoOnly:true,mark:<ProjectMark title={p.title}/>,editorial:p.href==="/realizacje/b-code"?{heading:lang==="pl"?"B-Code / narzędzie AI":"B-Code / AI tool",detail:lang==="pl"?"Integracja modeli AI o różnych rolach.":"AI models with different roles, connected in one app."}:p.category==="Marketing"?{heading:/StarCars/.test(p.title)?(lang==="pl"?"Film. Montaż.\nSocial media.":"Video. Editing.\nSocial media."):/Motomizer/.test(p.title)?(lang==="pl"?"Produkt. Marka.\nKomunikacja.":"Product. Brand.\nCommunication."):(lang==="pl"?"Treści. Kampanie.\nKomunikacja.":"Content. Campaigns.\nCommunication."),detail:p.description}:undefined})).sort((a,b)=>{
   const order:Record<string,number>={"/case-studies/starcars":0,"/realizacje/isto-kebab-strona":1,"/case-studies/b-crm":2,"/case-studies/motomizer":3};
   return (order[a.href]??3)-(order[b.href]??3);
 });
 const filtered=items.filter(p=>filter==="Wszystko"||p.category===filter);
 return <section id="projects" className="border-y border-white/10 bg-[var(--brand-black)] px-5 py-16 md:px-8 md:py-20"><div className="mx-auto max-w-7xl"><p className="brand-eyebrow text-xs uppercase tracking-widest">{lang==="pl"?"Projekty i współprace":"Projects & collaborations"}</p><h2 className="mt-4 text-4xl md:text-5xl">{lang==="pl"?"Wybrane realizacje.":"Selected work."}</h2><p className="mt-4 max-w-2xl leading-7 text-white/70">{lang==="pl"?"Strony, aplikacje i działania dla konkretnych firm.":"Websites, apps and work for real businesses."}</p>
 <div className="my-8 flex flex-wrap gap-3" aria-label={lang==="pl"?"Kategorie realizacji":"Project categories"}>{["Wszystko","Strony","CRM i aplikacje","Marketing","Autorskie i eksperymenty"].map(c=><button key={c} type="button" aria-pressed={filter===c} className={(filter===c?"brand-action":"brand-outline")+" rounded-lg px-4 py-2 text-sm"} onClick={()=>{setFilter(c);setActive("");}}>{categories[c]??c}</button>)}</div>
 <InteractiveImageAccordion key={filter} locale={lang} items={filtered.map(p=>({...p,category:categories[p.category]??p.category}))} active={active||filtered[0]?.href} onSelect={setActive}/>
 </div></section>;
}
