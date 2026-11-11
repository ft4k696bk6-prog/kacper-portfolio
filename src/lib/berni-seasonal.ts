export type BerniFoxAccessory = "none" | "santa" | "elf" | "alien" | "crown" | "cap" | "glasses";
export function seasonalBerniAccessory(date: Date): BerniFoxAccessory {
  const month = date.getMonth();
  const day = date.getDate();
  if (month === 11 && day >= 1 && day <= 26) return day % 4 === 0 ? "elf" : "santa";
  if (month === 0 && day <= 6) return "santa";
  return "none";
}
