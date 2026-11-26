import type { ProjectId, WorldLocale } from "./content";

export type ProjectBody = ProjectId | "ai";
export type SecretBody = "moon" | "signal" | "garage";
export type Body = "home" | ProjectBody | SecretBody;
export type Destination = Body | "system";
export type CameraMode = "planet" | "explore" | "photo";
export const finds = {
  chest: ["Skrzynia z nabrzeża", "Harbor chest", "Портова скриня"],
  gold: ["Złoty kluczyk", "Golden key", "Золотий ключ"],
  cave: ["Kamień z jaskini", "Cave stone", "Печерний камінь"],
  lake: ["Perła z laguny", "Lagoon pearl", "Перлина лагуни"],
  billboard: ["Miś na afiszu", "Bear on the billboard", "Ведмедик на афіші"],
  ramp: ["Próba na torze", "Track demonstration", "Показ на трасі"],
  horn: ["Sygnał z portu", "Harbor signal", "Сигнал із порту"],
  cones: ["Najmniejszy model", "The smallest model", "Найменша модель"],
  impact: ["Odłamek meteorytu", "Meteorite fragment", "Уламок метеорита"],
  terminal: ["Kod z laboratorium", "Laboratory code", "Код лабораторії"],
  rover: ["Dziennik łazika", "Rover log", "Журнал ровера"],
  flag: ["Pierwsze lądowanie", "First landing", "Перша посадка"],
  capsule: ["Zgubiona kapsuła", "Lost capsule", "Загублена капсула"],
  message: ["Wiadomość z krateru", "Message from the crater", "Повідомлення з кратера"],
  crystal: ["Świecący kryształ", "Glowing crystal", "Сяйливий кристал"],
  relic: ["Rdzeń napędu", "Drive core", "Ядро двигуна"],
  anomaly: ["Anomalia grawitacyjna", "Gravity anomaly", "Гравітаційна аномалія"],
  grid: ["Połączona sieć", "Connected grid", "З’єднана мережа"],
  concert: ["Koncert po godzinach", "After-hours concert", "Концерт після опівночі"],
  leads: ["Pierwsze przekazanie", "First handoff", "Перша передача"],
  robot: ["Robot na przerwie", "Robot on a break", "Робот на перерві"],
  recipe: ["Sekretny sos", "The secret sauce", "Таємний соус"],
  garage: ["Model z hangaru G-02", "G-02 hangar model", "Модель з ангара G-02"],
  launch: ["Start rakiety", "Liftoff", "Старт ракети"],
  ufo: ["Kontakt z obcymi", "Alien contact", "Контакт з прибульцями"],
} as const;
export type FindId = keyof typeof finds;
export const findCount = Object.keys(finds).length;
export const localeIndex: Record<WorldLocale, number> = { pl: 0, en: 1, uk: 2 };
export const gameStorage = "bernecki-world-expedition-v1";

export type Expedition = { finds: FindId[]; moon: boolean; signal: boolean };
export const emptyExpedition: Expedition = { finds: [], moon: false, signal: false };

export function readExpedition(): Expedition {
  try {
    const saved = JSON.parse(localStorage.getItem(gameStorage) ?? "null");
    if (!saved || !Array.isArray(saved.finds)) return emptyExpedition;
    return {
      finds: Array.from(new Set<FindId>(saved.finds.filter((id: unknown): id is FindId => typeof id === "string" && Object.hasOwn(finds, id)))),
      moon: saved.moon === true,
      signal: saved.signal === true,
    };
  } catch {
    return emptyExpedition;
  }
}

export type Award = "first" | "traveler" | "moon" | "contact" | "agent" | "explorer" | "complete";
export function awards(progress: Expedition) {
  const unlocked: Award[] = [];
  if (progress.finds.length > 0) unlocked.push("first");
  if (progress.finds.length >= 4) unlocked.push("traveler");
  if (progress.moon) unlocked.push("moon");
  if (progress.finds.includes("ufo")) unlocked.push("contact");
  if (progress.finds.includes("terminal")) unlocked.push("agent");
  if (progress.signal) unlocked.push("explorer");
  if (progress.finds.length === findCount) unlocked.push("complete");
  return unlocked;
}
