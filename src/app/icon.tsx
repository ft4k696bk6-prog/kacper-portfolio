import { renderBrandIcon } from "@/lib/brand-icon";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";
export const alt = "Logo KB — Kacper Bernecki";

export default function Icon() {
  return renderBrandIcon(size.width);
}
