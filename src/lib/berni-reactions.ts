export type BerniMood =
  | "idle" | "curious" | "thinking" | "happy" | "excited" | "sleeping"
  | "typing" | "listening" | "surprised" | "worried" | "working" | "grabbed";

export type BerniWeatherCondition =
  | "clear" | "clouds" | "rain" | "snow" | "sleet"
  | "thunder" | "hail" | "fog" | "wind" | "unknown";

export type BerniWeather = {
  condition: BerniWeatherCondition;
  temperature: number;
  updatedAt: string;
  source: "MET Norway";
};

export function classifyBerniWeather(symbolCode: string, windSpeed = 0): BerniWeatherCondition {
  const code = symbolCode.toLowerCase().replace(/[^a-z]/g, "");
  if (code.includes("thunder")) return "thunder";
  if (code.includes("hail")) return "hail";
  if (code.includes("sleet")) return "sleet";
  if (code.includes("snow")) return "snow";
  if (code.includes("rain")) return "rain";
  if (code.includes("fog")) return "fog";
  if (windSpeed >= 14) return "wind";
  if (code.includes("cloud")) return "clouds";
  if (code.includes("clear") || code.includes("fair")) return "clear";
  return "unknown";
}

export function detectBerniReaction(message: string): BerniMood {
  const value = message.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ł/g, "l");
  if (/(awaria|blad|error|problem|nie dziala|nie udalo|failed|sorry|przykro|unavailable|odrzucon|odmow)/.test(value)) return "worried";
  if (/(udalo sie|gotowe|sukces|success|confirmed|potwierdzon|rezerwacj.*(udana|potwierdz)|zrobion|done|excellent)/.test(value)) return "excited";
  if (/(haha|hehe|xd|zart|joke|funny|smiesz|lol)/.test(value)) return "happy";
  if (/(analiz|audyt|skan|seo|stron|website|raport|zbad|sprawdz|audit|scan|kod|code|crm)/.test(value)) return "working";
  if (/(hej|czesc|hello|hi |witaj|dzieku|thanks|thank you|super|great)/.test(value)) return "happy";
  if (/(umow|spotkani|rezerwac|book|calendar|kalendarz|kontakt|contact)/.test(value)) return "curious";
  if (message.includes("?")) return "curious";
  return "idle";
}

export function getBerniWeatherLabel(condition: BerniWeatherCondition, lang: "pl" | "en"): string {
  const labels: Record<BerniWeatherCondition, [string, string]> = {
    clear: ["Słonecznie", "Sunny"], clouds: ["Pochmurno", "Cloudy"],
    rain: ["Deszcz", "Rain"], snow: ["Śnieg", "Snow"],
    sleet: ["Deszcz ze śniegiem", "Sleet"], thunder: ["Burza", "Thunderstorm"],
    hail: ["Grad", "Hail"], fog: ["Mgła", "Fog"],
    wind: ["Wietrznie", "Windy"], unknown: ["Pogoda", "Weather"],
  };
  return labels[condition][lang === "pl" ? 0 : 1];
}

export function getBerniTemperatureMood(temperature: number): "cold" | "hot" | "normal" {
  if (temperature <= 2) return "cold";
  if (temperature >= 29) return "hot";
  return "normal";
}
