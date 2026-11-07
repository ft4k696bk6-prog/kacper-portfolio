import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { brand } from "@/lib/brand";

export const alt =
  "Kacper Bernecki — strony internetowe, CRM i aplikacje webowe";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const font = await readFile(
    join(process.cwd(), "public/fonts/OpenSans-Regular.ttf"),
  );
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        background: brand.background,
        color: brand.foreground,
        padding: "64px 72px",
        flexDirection: "column",
        justifyContent: "space-between",
        border: `2px solid ${brand.accent}`,
      }}
    >
      <div
        style={{
          display: "flex",
          width: "100%",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 24,
            color: brand.foreground,
            letterSpacing: 4,
          }}
        >
          KACPER BERNECKI / BERNECKI.DEV
        </div>
        {/* The same mark and palette as the browser icon and navigation. */}
        <div
          style={{
            display: "flex",
            width: 84,
            height: 84,
            padding: 7,
            borderRadius: 18,
            background: brand.background,
            border: `2px solid ${brand.accent}`,
          }}
        >
          <div
            style={{
              display: "flex",
              width: "100%",
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 12,
              background: brand.background,
              color: brand.foreground,
              fontSize: 27,
              fontWeight: 700,
              letterSpacing: 2,
            }}
          >
            KB
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontSize: 72,
          letterSpacing: -3,
          lineHeight: 1.1,
        }}
      >
        <span>Strony internetowe.</span>
        <span>Aplikacje i CRM.</span>
        <span style={{ color: brand.accent }}>Marketing.</span>
      </div>
      <div style={{ display: "flex", fontSize: 24, color: brand.foreground, opacity: 0.7 }}>
        Od pomysłu do wdrożenia. Bezpośrednio ze mną.
      </div>
    </div>,
    {
      ...size,
      fonts: [{ name: "Open Sans", data: font, style: "normal", weight: 400 }],
    },
  );
}
