"use client";

import NextImage from "next/image";
import { useState } from "react";
import {
  ArrowDownToLine, ArrowUpRight, CarFront, Check, Code2, ContactRound,
  Globe2, Linkedin, Mail, Phone, QrCode, Share2, WalletCards,
} from "lucide-react";

type Lang = "pl" | "en";

const qrRows = ["00000000000000000000000000000000000000000","00000000000000000000000000000000000000000","00000000000000000000000000000000000000000","00000000000000000000000000000000000000000","00001111111010010011000110101011111110000","00001000001001001101111001001010000010000","00001011101011001101111001111010111010000","00001011101000101100110111011010111010000","00001011101011100110111001000010111010000","00001000001000110010010001011010000010000","00001111111010101010101010101011111110000","00000000000010100110010110010000000000000","00000000011001110100010000110010101010000","00001010110011010010110100110101111000000","00000011001010110011101111000111001100000","00000110010111001001101110101011011010000","00001110011011010110101111111010110110000","00001111000101111001010101110010001010000","00000010001010101001101100100110011100000","00001111000111011010011000011100101110000","00001011101110000101101100000101111010000","00001110110010111111010111011010000000000","00000010011000111001001111110001011000000","00000111100110001101100100111011011010000","00000100001000000011011000000111110110000","00001000010100011101110000101011111000000","00001000111000101100101011100001111100000","00001011010011000111011110001000011010000","00001101001101010001110101111111100000000","00000000000010010011100111001000111010000","00001111111000010111101000111010111100000","00001000001010010111100101111000111100000","00001011101001111110100101101111110110000","00001011101001010001110101010101110100000","00001011101001110100100111011000110110000","00001000001001011111100100000100010000000","00001111111000111001011011011100001100000","00000000000000000000000000000000000000000","00000000000000000000000000000000000000000","00000000000000000000000000000000000000000","00000000000000000000000000000000000000000"];

function ContactQR() {
  const modules = qrRows.flatMap((line, y) =>
    Array.from(line).flatMap((pixel, x) => pixel === "1" ? [<rect key={y + "-" + x} x={x} y={y} width="1" height="1" />] : [])
  );
  return (
    <svg id="bernecki-card-qr" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 41 41" role="img" aria-label="QR: https://bernecki.dev/card" shapeRendering="crispEdges">
      <rect width="41" height="41" fill="#fff" />
      <g fill="#111214">{modules}</g>
    </svg>
  );
}

const copy = {
  pl: {
    subtitle: "Osobista wizytówka",
    tagline: "Technologia. Biznes. Motoryzacja.",
    description: "Projektuję strony WWW, systemy CRM i automatyzacje AI. Pomagam też sprowadzać samochody z USA i Kanady.",
    save: "Zapisz kontakt", call: "Zadzwoń", share: "Udostępnij", copied: "Link skopiowany",
    services: "Czym się zajmuję", it: "IT & Digital", itDesc: "Strony WWW, aplikacje, CRM, automatyzacje i AI",
    auto: "Import samochodów", autoDesc: "Indywidualny import aut z USA i Kanady",
    visit: "Zobacz ofertę", connect: "Bezpośredni kontakt", wallet: "Twoja wizytówka w Apple Wallet",
    walletDesc: "Zapisz poniższy kod QR, a następnie dodaj go do Apple Wallet jako własną kartę. Kod zawsze prowadzi do aktualnej wizytówki.",
    qrDownload: "Pobierz kod QR", scan: "Zeskanuj i zapisz kontakt", steps: "Jak dodać do Apple Wallet?",
    instructions: ["Zapisz kod QR na iPhonie (lub zrób zrzut ekranu).", "Otwórz aplikację Portfel (Wallet), stuknij + i wybierz „Utwórz kartę” / „Create a Pass”.", "Wybierz zapisany obraz z kodem, sprawdź dane i zapisz kartę."],
    walletNote: "Funkcja tworzenia własnych kart jest dostępna na zgodnych iPhone'ach z iOS 27. To karta z kodem QR, nie oficjalny podpisany pass od wystawcy.",
    copyright: "Wizytówka cyfrowa • Bernecki.dev", showQR: "Pokaż QR", closeQR: "Zamknij",
  },
  en: {
    subtitle: "Personal business card",
    tagline: "Technology. Business. Automotive.",
    description: "I build websites, custom CRM systems and AI automations. I also help clients import cars from the US and Canada.",
    save: "Save contact", call: "Call me", share: "Share", copied: "Link copied",
    services: "What I do", it: "IT & Digital", itDesc: "Websites, apps, CRM, automation and AI",
    auto: "Car imports", autoDesc: "Personalized car imports from the US and Canada",
    visit: "Explore services", connect: "Get in touch", wallet: "Keep my card in Apple Wallet",
    walletDesc: "Save the QR code and create a custom pass in Apple Wallet. The code always links to the latest version of my card.",
    qrDownload: "Download QR code", scan: "Scan and save my details", steps: "How to add to Apple Wallet",
    instructions: ["Save the QR code on your iPhone (or take a screenshot).", "Open Wallet, tap + and choose Create a Pass.", "Select the saved QR image, review the details, and save your pass."],
    walletNote: "Custom pass creation requires a compatible iPhone with iOS 27. This is a QR-based custom pass, not an issuer-signed pass.",
    copyright: "Digital business card • Bernecki.dev", showQR: "Show QR", closeQR: "Close",
  },
} as const;

export function DigitalBusinessCard({ lang }: { lang: Lang }) {
  const t = copy[lang];
  const [shared, setShared] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);

  async function share() {
    const url = "https://bernecki.dev/card";
    try {
      if (navigator.share) {
        await navigator.share({ title: "Kacper Bernecki — Bernecki.dev", url });
      } else {
        await navigator.clipboard.writeText(url);
        setShared(true);
      }
    } catch {
      // Closing the native share dialog does not need an error message.
    }
  }

  async function downloadQR() {
    const svg = document.getElementById("bernecki-card-qr");
    if (!svg) return;
    const xml = new XMLSerializer().serializeToString(svg);
    const url = URL.createObjectURL(new Blob([xml], { type: "image/svg+xml;charset=utf-8" }));
    const image = new window.Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 990;
      canvas.height = 990;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.imageSmoothingEnabled = false;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, 990, 990);
        ctx.drawImage(image, 0, 0, 990, 990);
        const a = document.createElement("a");
        a.href = canvas.toDataURL("image/png");
        a.download = "bernecki-wallet-qr.png";
        a.click();
      }
      URL.revokeObjectURL(url);
    };
    image.onerror = () => URL.revokeObjectURL(url);
    image.src = url;
  }

  return (
    <main className="db-root" lang={lang}>
      <div className="db-grain" aria-hidden="true" />
      <div className="db-wrap">
        <header className="db-topbar">
          <a className="db-wordmark" href="https://bernecki.dev" aria-label="Bernecki.dev — home">
            <NextImage src="/favicon-silver.svg" alt="Oryginalne logo Bernecki.dev" width={45} height={45} className="db-brand-logo" />
            <span className="db-wordmark-text">BERNECKI<span>.DEV</span></span>
          </a>
          <nav aria-label="Languages" className="db-languages">
            <a href="/card" lang="pl" aria-current={lang === "pl" ? "page" : undefined} className={lang === "pl" ? "active" : ""}>PL</a>
            <span aria-hidden="true">/</span>
            <a href="/en/card" lang="en" aria-current={lang === "en" ? "page" : undefined} className={lang === "en" ? "active" : ""}>EN</a>
          </nav>
        </header>

        <section className="db-hero" aria-labelledby="db-heading">
          <div className="db-hero-light" aria-hidden="true" />
          <div className="db-portrait-stage" aria-hidden="true">
            <NextImage src="/images/profile-3-cutout.png" alt="" width={680} height={850} priority sizes="(max-width: 600px) 230px, 440px" className="db-portrait" />
          </div>
          <div className="db-hero-content">
            <p className="db-kicker"><span className="db-kicker-rule" /> {t.subtitle}</p>
            <h1 id="db-heading"><span>Kacper</span><strong>Bernecki</strong></h1>
            <p className="db-tagline">{t.tagline}</p>
            <p className="db-intro">{t.description}</p>
            <div className="db-hero-actions">
              <a className="db-button db-button-primary" href="/api/card.vcf"><ContactRound size={18} />{t.save}</a>
              <button type="button" className="db-button db-button-ghost" onClick={share}>{shared ? <Check size={18} /> : <Share2 size={18} />}{shared ? t.copied : t.share}</button>
            </div>
            <div className="db-mobile-actions">
              <a href="https://bernecki.dev/" aria-label="Bernecki.dev IT"><Code2 size={18}/><span>IT</span><ArrowUpRight size={16}/></a>
              <a href="https://star-cars.us/" target="_blank" rel="noopener noreferrer"><CarFront size={18}/><span>{t.auto}</span><ArrowUpRight size={16}/></a>
              <button type="button" onClick={() => setQrOpen(true)}><QrCode size={18}/><span>{t.showQR}</span></button>
            </div>
          </div>
          <div className="db-hero-bottom"><span>BERNECKI.DEV</span><span>EST. 2026 <span aria-hidden="true">✦</span> PERSONAL CARD</span></div>
        </section>

        <div className="db-grid">
          <section className="db-panel db-services" aria-labelledby="db-services-heading">
            <div className="db-section-heading"><span className="db-section-index">01 /</span><h2 id="db-services-heading">{t.services}</h2></div>
            <a className="db-service" href="https://bernecki.dev/">
              <span className="db-service-icon"><Code2 size={23} strokeWidth={1.5} /></span>
              <span className="db-service-copy"><strong>{t.it}</strong><small>{t.itDesc}</small><span>{t.visit} <ArrowUpRight size={14} /></span></span>
              <ArrowUpRight className="db-service-arrow" size={21} strokeWidth={1.4} />
            </a>
            <a className="db-service" href="https://star-cars.us/" target="_blank" rel="noopener noreferrer">
              <span className="db-service-icon"><CarFront size={23} strokeWidth={1.5} /></span>
              <span className="db-service-copy"><strong>{t.auto}</strong><small>{t.autoDesc}</small><span>StarCars Import <ArrowUpRight size={14} /></span></span>
              <ArrowUpRight className="db-service-arrow" size={21} strokeWidth={1.4} />
            </a>
          </section>

          <section className="db-panel db-contact" aria-labelledby="db-contact-heading">
            <div className="db-section-heading"><span className="db-section-index">02 /</span><h2 id="db-contact-heading">{t.connect}</h2></div>
            <a href="tel:+48575109897" className="db-contact-row"><Phone size={19} /><span>+48 575 109 897</span><ArrowUpRight size={17} /></a>
            <a href="mailto:kacper@bernecki.dev" className="db-contact-row"><Mail size={19} /><span>kacper@bernecki.dev</span><ArrowUpRight size={17} /></a>
            <a href="https://www.linkedin.com/in/kacper-bernecki/" target="_blank" rel="noopener noreferrer" className="db-contact-row"><Linkedin size={19} /><span>LinkedIn</span><ArrowUpRight size={17} /></a>
            <a href="https://bernecki.dev" className="db-contact-row"><Globe2 size={19} /><span>bernecki.dev</span><ArrowUpRight size={17} /></a>
            <a href="tel:+48575109897" className="db-contact-cta"><Phone size={17} /> {t.call} <ArrowUpRight size={17}/></a>
          </section>
        </div>

        <section className="db-wallet" id="apple-wallet" aria-labelledby="db-wallet-title">
          <div className="db-wallet-copy">
            <p className="db-kicker"><WalletCards size={17}/> APPLE WALLET</p>
            <h2 id="db-wallet-title">{t.wallet}</h2>
            <p>{t.walletDesc}</p>
            <button type="button" onClick={downloadQR} className="db-button db-button-primary"><ArrowDownToLine size={18}/>{t.qrDownload}</button>
            <details className="db-instructions">
              <summary>{t.steps}</summary>
              <ol>{t.instructions.map((instruction) => <li key={instruction}>{instruction}</li>)}</ol>
              <p>{t.walletNote}</p>
            </details>
          </div>
          <div className="db-qr-card">
            <div className="db-qr-mark"><NextImage src="/favicon-silver.svg" alt="Logo Bernecki.dev" width={28} height={28} /><span>BERNECKI.DEV</span></div>
            <div className="db-qr-holder"><ContactQR /></div>
            <strong>Kacper Bernecki</strong>
            <small><QrCode size={15}/>{t.scan}</small>
          </div>
        </section>

        {qrOpen && <div className="db-qr-modal" role="dialog" aria-modal="true" aria-label={t.scan}>
          <button type="button" className="db-qr-close" onClick={() => setQrOpen(false)} aria-label={t.closeQR}>×</button>
          <div className="db-qr-modal-inner"><div><ContactQR /></div><strong>bernecki.dev/card</strong><p>{t.scan}</p></div>
        </div>}
        <footer className="db-footer">
          <span>{t.copyright}</span>
          <a href="https://bernecki.dev">bernecki.dev <ArrowUpRight size={14}/></a>
        </footer>
      </div>
    </main>
  );
}
