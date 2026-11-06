import { ImageResponse } from "next/og";

/**
 * Rasterize the gold KB mark used by /favicon-gold.svg for platforms
 * that require PNG icons (home screen and PWA installations).
 */
export function renderBrandIcon(size: number) {
  const scale = size / 64;

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        background: "#090909",
        padding: 5 * scale,
        borderRadius: 14 * scale,
        alignItems: "stretch",
      }}
    >
      <div
        style={{
          display: "flex",
          flex: 1,
          border: `${2 * scale}px solid rgba(201,168,106,0.8)`,
          borderRadius: 11 * scale,
          background: "#111111",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            display: "flex",
            color: "#d8bb87",
            fontSize: 22 * scale,
            fontWeight: 700,
            letterSpacing: 1.5 * scale,
          }}
        >
          KB
        </span>
      </div>
    </div>,
    { width: size, height: size },
  );
}
