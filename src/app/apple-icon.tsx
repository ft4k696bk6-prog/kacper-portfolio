import { renderBrandIcon } from "@/lib/brand-icon";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";
export const alt = "Logo KB — Kacper Bernecki";

export default function AppleIcon() {
  return renderBrandIcon(size.width);
}
