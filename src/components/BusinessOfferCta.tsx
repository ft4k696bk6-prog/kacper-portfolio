"use client";

import { ArrowUpRight } from "lucide-react";

type Props = {
  offer: string;
  label: string;
  placement: string;
  href: string;
  secondary?: boolean;
};

export function BusinessOfferCta({offer,label,placement,href,secondary=false}:Props){
  function track(){
    if (typeof window.gtag === "function") {
      window.gtag("event","offer_cta_click",{
        offer_type:offer,
        cta_placement:placement,
        link_destination:href,
        page_path:window.location.pathname
      });
    }
  }
  return <a href={href} onClick={track}
    className={secondary
      ? "inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 px-6 py-3.5 text-sm font-semibold text-white transition hover:border-white/50 hover:bg-white/10"
      : "brand-action inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3.5 text-sm font-semibold text-black transition hover:opacity-85"}>
    {label} <ArrowUpRight className="h-4 w-4" aria-hidden="true"/>
  </a>;
}
