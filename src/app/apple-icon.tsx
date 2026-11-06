import { renderSilverBrandIcon } from "@/lib/silver-brand-icon";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";
export const alt = "Srebrne logo KB — Kacper Bernecki";

export default function AppleIcon() {
  return renderSilverBrandIcon(size.width);
}
