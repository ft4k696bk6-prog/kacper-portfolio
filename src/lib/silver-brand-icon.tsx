import { ImageResponse } from "next/og";

/**
 * Rasterize the existing silver KB mark used by /favicon.svg for platforms
 * that require PNG icons (home screen and PWA installations).
 */
export function renderSilverBrandIcon(size: number) {
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
          border: `${2 * scale}px solid rgba(244,244,245,0.65)`,
          borderRadius: 11 * scale,
          background: "#111111",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            display: "flex",
            color: "#e4e4e7",
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
