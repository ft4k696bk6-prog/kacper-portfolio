import { NextResponse } from "next/server";

export const dynamic = "force-static";

export function GET() {
  const vcard = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    "N:Bernecki;Kacper;;;",
    "FN:Kacper Bernecki",
    "ORG:Bernecki.dev",
    "TITLE:IT & Digital | Car Import",
    "TEL;TYPE=CELL,VOICE:+48575109897",
    "EMAIL;TYPE=INTERNET,WORK:kacper@bernecki.dev",
    "URL;TYPE=WORK:https://bernecki.dev",
    "URL:https://star-cars.us",
    "URL:https://www.linkedin.com/in/kacper-bernecki/",
    "NOTE:Websites\\, CRM\\, AI automation and car imports from USA and Canada.",
    "END:VCARD",
    "",
  ].join("\r\n");

  return new NextResponse(vcard, {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": 'attachment; filename="kacper-bernecki.vcf"',
      "Cache-Control": "public, max-age=3600",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
