import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  metadataBase: new URL("https://kacper-bernecki.vercel.app"),
  title: {
    default: "Kacper Bernecki — AI-Assisted Web Developer",
    template: "%s | Kacper Bernecki",
  },
  description:
    "Tworzę praktyczne aplikacje webowe, CRM-y, landing page i automatyzacje dla małych firm.",
  keywords: [
    "Kacper Bernecki",
    "AI-Assisted Web Developer",
    "Business App Builder",
    "CRM dla małych firm",
    "aplikacje webowe",
    "automatyzacje",
    "landing page",
    "React",
    "TypeScript",
    "Supabase",
  ],
  authors: [{ name: "Kacper Bernecki" }],
  creator: "Kacper Bernecki",
  openGraph: {
    title: "Kacper Bernecki — AI-Assisted Web Developer",
    description:
      "I build practical web apps, CRMs, landing pages and automations for small businesses.",
    url: "https://kacper-bernecki.vercel.app",
    siteName: "Kacper Bernecki Portfolio",
    type: "website",
    locale: "pl_PL",
    alternateLocale: "en_US",
    images: [
      {
        url: "/images/profile-1.png",
        width: 1154,
        height: 1408,
        alt: "Kacper Bernecki — AI-Assisted Web Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kacper Bernecki — AI-Assisted Web Developer",
    description:
      "I build practical web apps, CRMs, landing pages and automations for small businesses.",
    images: ["/images/profile-1.png"],
  },
  alternates: {
    canonical: "https://kacper-bernecki.vercel.app",
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
  themeColor: "#070707",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl" className={cn("scroll-smooth font-sans", geist.variable)}>
      <body>
        <LanguageProvider>
          <LanguageSwitcher />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
