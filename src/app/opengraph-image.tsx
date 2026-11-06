import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

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
        background: "#0c0c0c",
        color: "#fafafa",
        padding: "64px 72px",
        flexDirection: "column",
        justifyContent: "space-between",
        border: "2px solid #303030",
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
            color: "#f4f4f5",
            letterSpacing: 4,
          }}
        >
          KACPER BERNECKI / BERNECKI.DEV
        </div>
        {/* Silver KB badge matches /favicon-silver.svg. */}
        <div
          style={{
            display: "flex",
            width: 84,
            height: 84,
            padding: 7,
            borderRadius: 18,
            background: "#090909",
            border: "2px solid #cbd5e1",
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
              background: "#111111",
              border: "2px solid rgba(203,213,225,0.85)",
              color: "#cbd5e1",
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
        <span style={{ color: "#f4f4f5" }}>CRM i aplikacje webowe.</span>
      </div>
      <div style={{ display: "flex", fontSize: 24, color: "#a1a1aa" }}>
        Od pomysłu do wdrożenia. Bezpośrednio ze mną.
      </div>
    </div>,
    {
      ...size,
      fonts: [{ name: "Open Sans", data: font, style: "normal", weight: 400 }],
    },
  );
}
