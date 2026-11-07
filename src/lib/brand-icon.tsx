import { ImageResponse } from "next/og";
import { brand } from "@/lib/brand";

/**
 * Rasterize the shared KB mark used by /favicon.svg for platforms
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
        background: brand.background,
        padding: 5 * scale,
        borderRadius: 14 * scale,
        alignItems: "stretch",
      }}
    >
      <div
        style={{
          display: "flex",
          flex: 1,
          border: `${2 * scale}px solid ${brand.accent}`,
          borderRadius: 11 * scale,
          background: brand.background,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            display: "flex",
            color: brand.foreground,
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
