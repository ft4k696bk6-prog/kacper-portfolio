import { renderSilverBrandIcon } from "@/lib/silver-brand-icon";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";
export const alt = "Srebrne logo KB — Kacper Bernecki";

export default function Icon() {
  return renderSilverBrandIcon(size.width);
}
