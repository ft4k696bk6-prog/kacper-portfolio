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
  const cents = BigInt(integer) * 100n + BigInt((fraction + "00").slice(0, 2));
  // Value cap prevents pathological inputs and protects consumers expecting JS numbers.
  return cents <= 1_000_000_000_000n ? Number(cents) : null;
}

export function calculateVat(amountCents: number, rate: VatRate, direction: VatDirection): VatAmounts | null {
  if (!Number.isSafeInteger(amountCents) || amountCents < 0 || amountCents > 1_000_000_000_000 || (rate !== 8 && rate !== 23)) return null;
  const amount = BigInt(amountCents);
  const grossFactor = BigInt(100 + rate);
  let net: bigint;
  let gross: bigint;
  if (direction === "net-to-gross") {
    net = amount;
    gross = (amount * grossFactor + 50n) / 100n;
  } else {
    gross = amount;
    net = (amount * 100n + grossFactor / 2n) / grossFactor;
  }
  return { netCents: Number(net), grossCents: Number(gross), taxCents: Number(gross - net), rate };
}

export function formatVatCurrency(cents: number, language: "pl" | "en" = "pl"): string {
  return new Intl.NumberFormat(language === "pl" ? "pl-PL" : "en-US", {
    style: "currency", currency: "PLN", minimumFractionDigits: 2, maximumFractionDigits: 2,
  }).format(cents / 100);
}
