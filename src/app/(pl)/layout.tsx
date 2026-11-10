import type { Metadata, Viewport } from "next";
import "../globals.css";
import "../design-system.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { LanguageMetadataSync } from "@/components/LanguageMetadataSync";
import { AnalyticsConsent } from "@/components/AnalyticsConsent";
import { AIMascotAssistant } from "@/components/AIMascotAssistant";
import { Geist } from "next/font/google";
import { SiteFooter } from "@/components/SiteFooter";
import { brand } from "@/lib/brand";

const geist = Geist({ subsets: ["latin", "latin-ext"], variable: "--font-sans" });
const siteUrl = "https://bernecki.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Strony internetowe, CRM i marketing | Kacper Bernecki",
    // Page titles are already composed by the route; appending the brand here duplicates it.
    template: "%s",
  },
  description:
    "Strony internetowe, aplikacje i CRM dla firm. Meta Ads, automatyzacje i integracje pomagające pozyskiwać oraz obsługiwać klientów.",
  keywords: [
    "Kacper Bernecki",
    "rozwój biznesu",
    "sourcing produktów",
    "wdrożenia biznesowe",
    "marketing i sprzedaż",
    "Frontend Developer",
    "Web App Developer",
    "React Developer",
    "TypeScript Developer",
    "Next.js Developer",
    "Supabase",
    "CRM",
    "wdrożenia AI dla firm",
    "AI i automatyzacje",
    "asystenci AI dla biznesu",
    "dashboardy",
    "aplikacje biznesowe",
    "formularze",
    "React",
    "TypeScript",
  ],
  authors: [{ name: "Kacper Bernecki" }],
  creator: "Kacper Bernecki",
  openGraph: {
    title: "Kacper Bernecki — rozwój biznesu, AI i technologia",
    description:
      "Pomysły biznesowe, produkty, dostawcy, strony, CRM i marketing. Praktyczne wsparcie od planu po wdrożenie.",
    url: siteUrl,
    siteName: "Kacper Bernecki Portfolio",
    type: "website",
    locale: "pl_PL",
    alternateLocale: "en_US",
    images: [
      {
        url: "/opengraph-image?hero=20261108-01",
        width: 1200,
        height: 630,
        alt: "Kacper Bernecki na tle rzeczywistych realizacji StarCars, Isto Kebab i B-CRM",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kacper Bernecki — rozwój biznesu, AI i technologia",
    description:
      "Pomysły biznesowe, produkty, dostawcy, strony, CRM i marketing. Praktyczne wsparcie od planu po wdrożenie.",
    images: ["/opengraph-image?hero=20261108-01"],
  },
  alternates: {
    canonical: siteUrl,
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.svg?v=silver-20261108-01", type: "image/svg+xml" },
      { url: "/icon?v=silver-20261108-01", type: "image/png", sizes: "512x512" },
    ],
    shortcut: [{ url: "/favicon.svg?v=silver-20261108-01", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon?v=silver-20261108-01", type: "image/png", sizes: "180x180" }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: brand.background,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl" suppressHydrationWarning className={`scroll-smooth font-sans ${geist.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: '(function(){if(location.pathname!=="/")return;var root=document.documentElement;if(window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches){root.dataset.homeIntro="skip";return;}var replay=new URLSearchParams(location.search).get("intro")==="1";try{var key="bernecki-home-intro-v4";if(sessionStorage.getItem(key)&&!replay){root.dataset.homeIntro="skip";return;}sessionStorage.setItem(key,"1");root.dataset.homeIntro="armed";}catch(e){root.dataset.homeIntro="armed";}window.setTimeout(function(){if(root.dataset.homeIntro==="armed"){root.dataset.homeIntro="skip";}},4150);})();',
          }}
        />
      </head>
      <body>
        <LanguageProvider>
          <AnalyticsConsent />
          <LanguageMetadataSync />
          <LanguageSwitcher />
          {children}
          <SiteFooter />
          <AIMascotAssistant />
        </LanguageProvider>
      </body>
    </html>
  );
}
