"use client";

import Link from "next/link";
import { ArrowRight, Bot, BriefcaseBusiness, ChevronDown, Globe2, Megaphone, PackageSearch } from "lucide-react";

const icons=[BriefcaseBusiness,PackageSearch,Globe2,Bot,Megaphone] as const;
type Offer = readonly [title:string,description:string,href:string];

export function OfferCards({offers,english}:{offers:readonly Offer[];english:boolean}) {
 return <div className="offer-card-grid">
  {offers.map(([title,description,href],i)=>{
   const Icon=icons[i]||BriefcaseBusiness;
   return <details key={title} className="offer-card group">
    <summary className="offer-card-summary">
      <span className="offer-card-icon"><Icon size={21} strokeWidth={1.6} aria-hidden="true"/></span>
      <span className="offer-card-title">{title}</span>
      <span className="offer-card-toggle"><ChevronDown size={19} aria-hidden="true"/><small>{english?"Details":"Rozwiń"}</small></span>
    </summary>
    <div className="offer-card-body">
      <p>{description}</p>
      <div className="offer-card-actions">
       <Link href={href} className="offer-card-more">{english?"Explore service":"Poznaj ofertę"} <ArrowRight size={16} aria-hidden="true"/></Link>
       <Link href={english?"/kontakt":"/kontakt"} className="offer-card-contact">{english?"Discuss a project":"Zapytaj o wycenę"} <ArrowRight size={15} aria-hidden="true"/></Link>
      </div>
    </div>
   </details>
  })}
 </div>
}
