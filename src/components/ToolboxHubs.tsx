import Link from "next/link";
import {Calculator,Files,Gamepad2,Mail,ScanSearch,ArrowUpRight,LayoutGrid} from "lucide-react";
const hubs = [{"pl":"/narzedzia/pliki","en":"/en/tools/files","plName":"Pliki, PDF, zdjęcia i QR","enName":"Files, PDF, images & QR","plDesc":"Łączenie i edycja PDF, OCR, kody QR, zdjęcia i metadane.","enDesc":"Merge and edit PDF, OCR, QR codes, images and metadata.","icon":"Files"},{"pl":"/narzedzia/stopki","en":"/en/tools/email-signatures","plName":"Stopki e-mail premium","enName":"Premium email signatures","plDesc":"Sześć szablonów, logo, kolory, animowany piorun GIF i HTML.","enDesc":"Six layouts, logos, colors, animated lightning GIF and HTML.","icon":"Mail"},{"pl":"/narzedzia/gry","en":"/en/tools/arcade","plName":"Gry retro i dla dzieci","enName":"Retro & kids games","plDesc":"12 autorskich gier — Snake, Pong, 2048, Saper, kosmos i więcej.","enDesc":"12 original games — Snake, Pong, 2048, Minesweeper, space and more.","icon":"Gamepad2"},{"pl":"/narzedzia/detektor-ai","en":"/en/tools/ai-detector","plName":"Detektor obrazów i tekstów AI","enName":"AI image & text detector","plDesc":"Metadane i opcjonalny prawdziwy klasyfikator bez fałszywych wyników.","enDesc":"Metadata and optional real classifier without fabricated scores.","icon":"ScanSearch"},{"pl":"/narzedzia/dodatkowe","en":"/en/tools/extra","plName":"Kalkulatory i narzędzia techniczne","enName":"Calculators & developer tools","plDesc":"16 dodatkowych funkcji: VAT, marża, raty, CSV, regex, favicon.","enDesc":"16 additional tools: VAT, margins, loans, CSV, regex, favicon.","icon":"Calculator"}];
const iconMap={Calculator,Files,Gamepad2,Mail,ScanSearch,LayoutGrid};
export function ToolboxHubs({lang}:{lang:"pl"|"en"}){
 const en=lang==="en";
 return <section className="mt-9" aria-label={en?"Specialized tool collections":"Centra narzędzi"}>
  <div className="flex flex-wrap items-end justify-between gap-4">
   <div><p className="page-eyebrow">{en?"MORE TOOLS":"WIĘCEJ NARZĘDZI"}</p>
    <h2 className="mt-3 text-xl font-medium md:text-2xl">{en?"Choose what you want to do":"Wybierz, czego potrzebujesz"}</h2></div>
   <span className="text-xs text-white/50">{en?"Everything organized by purpose":"Wszystko posegregowane tematycznie"}</span>
  </div>
  <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
   <Link href={en?"/en/tools/everyday":"/narzedzia/codzienne"} className="group flex flex-col justify-between rounded-2xl border border-white/20 bg-[#121212] p-5 transition hover:border-white/60">
    <span className="mb-4 flex items-center justify-between"><LayoutGrid size={21} className="text-white/70"/><ArrowUpRight size={18}/></span>
    <h3 className="text-lg font-medium">{en?"Everyday basics":"Codzienne podstawy"}</h3>
    <p className="mt-2 text-xs leading-6 text-white/55">{en?"Text, images, percentages, passwords and quick tools.":"Tekst, zdjęcia, procenty, hasła i szybkie narzędzia."}</p>
   </Link>
   {hubs.map(h=>{const Icon=iconMap[h.icon as keyof typeof iconMap];return <Link key={h.pl} href={en?h.en:h.pl} className="group flex flex-col justify-between rounded-2xl border border-white/20 bg-[#121212] p-5 transition hover:border-white/60">
    <span className="mb-4 flex items-center justify-between"><Icon size={21} className="text-white/70"/><ArrowUpRight size={18}/></span>
    <h3 className="text-lg font-medium">{en?h.enName:h.plName}</h3>
    <p className="mt-2 text-xs leading-6 text-white/55">{en?h.enDesc:h.plDesc}</p>
   </Link>})}
  </div>
 </section>;
}
