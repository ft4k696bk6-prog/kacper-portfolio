import type { Metadata } from "next";
import { businessOffers } from "@/content/business-offers";
import { BusinessOfferPage } from "@/components/BusinessOfferPage";

const offer=businessOffers.crm;
const canonical="https://bernecki.dev/"+offer.slug;
export const metadata:Metadata={
  title:offer.metaTitle,
  description:offer.metaDescription,
  keywords:[...offer.keywords],
  alternates:{canonical},
  openGraph:{title:offer.metaTitle,description:offer.metaDescription,url:canonical,type:"website",locale:"pl_PL",images:[{url:offer.proof.img,alt:offer.proof.alt}]},
  twitter:{card:"summary_large_image",title:offer.metaTitle,description:offer.metaDescription,images:[offer.proof.img]},
};
export default function Page(){
  return <BusinessOfferPage kind="crm"/>;
}
