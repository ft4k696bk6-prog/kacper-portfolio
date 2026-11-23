"use client";

import NextImage from "next/image";
import { useState } from "react";
import {
  ArrowDownToLine, ArrowUpRight, CarFront, Check, Code2, ContactRound,
  Globe2, Linkedin, Mail, Phone, QrCode, Share2, WalletCards,
} from "lucide-react";

type Lang = "pl" | "en";

const qrRows = [
"000000000000000000000000000000000",
"000000000000000000000000000000000",
"000000000000000000000000000000000",
"000000000000000000000000000000000",
"000011111110100111100011111110000",
"000010000010111011000010000010000",
"000010111010101001000010111010000",
"000010111010010111011010111010000",
"000010111010111100100010111010000",
"000010000010001000100010000010000",
"000011111110101010101011111110000",
"000000000000000101000000000000000",
"000010011111111110101100101110000",
"000001010101000010010001111100000",
"000011000111001111011010010010000",
"000000111000101010011010011110000",
"000000111111010110101011000010000",
"000010111101101000111100100100000",
"000011010111001110110010111110000",
"000010011000010100011001011010000",
"000010100011000011011111101100000",
"000000000000101110001000101100000",
"000011111110111110101010100010000",
"000010000010110001011000100110000",
"000010111010111010111111100000000",
"000010111010101100111110000110000",
"000010111010001110100100111110000",
"000010000010001010100001101110000",
"000011111110110100001100010010000",
"000000000000000000000000000000000",
"000000000000000000000000000000000",
"000000000000000000000000000000000",
"000000000000000000000000000000000",
];

function ContactQR() {
  const modules = qrRows.flatMap((line, y) =>
    Array.from(line).flatMap((pixel, x) => pixel === "1" ? [<rect key={y + "-" + x} x={x} y={y} width="1" height="1" />] : [])
  );
  return (
    <svg id="bernecki-card-qr" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 33 33" role="img" aria-label="QR: https://bernecki.dev/card" shapeRendering="crispEdges">
      <rect width="33" height="33" fill="#fff" />
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
    copyright: "Wizytówka cyfrowa • Bernecki.dev", showQR: "Kod QR",
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
    copyright: "Digital business card • Bernecki.dev", showQR: "QR code",
  },
} as const;

export function DigitalBusinessCard({ lang }: { lang: Lang }) {
  const t = copy[lang];
  const [shared, setShared] = useState(false);

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
            <span className="db-monogram">B</span>
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
            <div className="db-qr-mark"><span>B</span><span>BERNECKI.DEV</span></div>
            <div className="db-qr-holder"><ContactQR /></div>
            <strong>Kacper Bernecki</strong>
            <small><QrCode size={15}/>{t.scan}</small>
          </div>
        </section>

        <footer className="db-footer">
          <span>{t.copyright}</span>
          <a href="https://bernecki.dev">bernecki.dev <ArrowUpRight size={14}/></a>
        </footer>
      </div>
    </main>
  );
}
