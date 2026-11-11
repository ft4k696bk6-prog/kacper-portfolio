/** Pure, integer-grosz VAT calculations. No floating-point currency errors. */
export type VatDirection = "net-to-gross" | "gross-to-net";
export type VatRate = 8 | 23;
export type VatAmounts = { netCents: number; taxCents: number; grossCents: number; rate: VatRate };

/** Parse common PLN inputs: 1234,56 | 1234.56 | 1 234,56 | 1.234,56 | 1,234.56. */
export function parseVatAmount(raw: string): number | null {
  const value = raw.trim().replace(/[\s\u00a0\u202f]/g, "");
  if (!value || !/^[\d,.]+$/.test(value)) return null;
  let integer = "";
  let fraction = "";
  if (value.includes(",") && value.includes(".")) {
    const separator = Math.max(value.lastIndexOf(","), value.lastIndexOf("."));
    integer = value.slice(0, separator);
    fraction = value.slice(separator + 1);
    const thousands = value[separator] === "," ? "." : ",";
    const groups = integer.split(thousands);
    if (!groups.length || !/^[0-9]{1,3}$/.test(groups[0]) ||
      !groups.slice(1).every(group => /^[0-9]{3}$/.test(group)) ||
      groups.length < 2) return null;
    integer = integer.split(thousands).join("");
    if (!/^\d{1,2}$/.test(fraction)) return null;
  } else if (/^\d{1,3}(?:[,.]\d{3})+$/.test(value)) {
    integer = value.replace(/[,.]/g, "");
  } else {
    const match = value.match(/^(\d+)(?:[,.](\d{1,2}))?$/);
    if (!match) return null;
    integer = match[1];
    fraction = match[2] || "";
  }
  const cents = Number(integer) * 100 + Number((fraction + "00").slice(0, 2));
  // Every intermediate remains an exact safe integer below this limit.
  return Number.isSafeInteger(cents) && cents <= 1_000_000_000_000 ? cents : null;
}

export function calculateVat(amountCents: number, rate: VatRate, direction: VatDirection): VatAmounts | null {
  if (!Number.isSafeInteger(amountCents) || amountCents < 0 || amountCents > 1_000_000_000_000 || (rate !== 8 && rate !== 23)) return null;
  // Max 1e12 cents ensures amount * 123 stays below Number.MAX_SAFE_INTEGER.
  // All calculations use whole grosz, rounded only at the conversion boundary.
  const gross = direction === "net-to-gross"
    ? Math.round(amountCents * (100 + rate) / 100) : amountCents;
  const net = direction === "gross-to-net"
    ? Math.round(amountCents * 100 / (100 + rate)) : amountCents;
  return { netCents: net, grossCents: gross, taxCents: gross - net, rate };
}

export function formatVatCurrency(cents: number, language: "pl" | "en" = "pl"): string {
  return new Intl.NumberFormat(language === "pl" ? "pl-PL" : "en-US", {
    style: "currency", currency: "PLN", minimumFractionDigits: 2, maximumFractionDigits: 2,
  }).format(cents / 100);
}
