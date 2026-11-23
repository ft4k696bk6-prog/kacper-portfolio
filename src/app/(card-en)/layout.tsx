import type { ReactNode } from "react";
import { Geist } from "next/font/google";
import "../globals.css";
import "../../components/digital-business-card.css";

const geist = Geist({ subsets: ["latin", "latin-ext"], variable: "--font-sans" });

export default function CardEnglishLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={geist.variable}>
      <body>{children}</body>
    </html>
  );
}
