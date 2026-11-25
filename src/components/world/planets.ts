import type { Body, ProjectBody, SecretBody } from "./discoveries";
import type { WorldLocale } from "./content";

type Triple = readonly [number, number, number];
type Planet = {
  label: string;
  center: Triple;
  radius: number;
  colors: readonly [number, number, number, number];
  landmark: readonly [string, string, string];
};

export const planets = {
  home: { label: "Bernecki World", center: [0, 0, 0], radius: 23, colors: [0x315c79, 0x66afa2, 0x86a96a, 0xe4c08a],
    landmark: ["Siedziba Bernecki.dev", "Bernecki.dev headquarters", "Штаб Bernecki.dev"] },
  starcars: { label: "StarCars", center: [-94, 8, 6], radius: 15, colors: [0x325e70, 0x5a9c9f, 0xd99b61, 0xf6cd93],
    landmark: ["Salon importera", "Import showroom", "Салон імпортера"] },
  reenergy: { label: "ReEnergy", center: [-45, 75, -7], radius: 15.5, colors: [0x2b7790, 0x81cbad, 0x8cbd60, 0xefd6a0],
    landmark: ["Centrum energii", "Energy center", "Енергетичний центр"] },
  "b-crm": { label: "B-CRM", center: [48, 76, 0], radius: 14, colors: [0x445680, 0x61afbc, 0xa6a7ca, 0xefbb8c],
    landmark: ["Centrum dowodzenia", "Operations center", "Центр керування"] },
  ai: { label: "AI World", center: [98, 14, -8], radius: 16, colors: [0x354572, 0x529d9d, 0x9d8bbb, 0x7fe0cd],
    landmark: ["Laboratorium AI", "AI laboratory", "Лабораторія ШІ"] },
  beatmarket: { label: "BeatMarket", center: [62, -61, 9], radius: 14.5, colors: [0x29446f, 0x554087, 0xa163a5, 0xf196a0],
    landmark: ["Główna scena", "Main stage", "Головна сцена"] },
  motomizer: { label: "Motomizer", center: [-30, -78, -10], radius: 15, colors: [0x365c70, 0x738997, 0xb37a5c, 0xefd09a],
    landmark: ["Linia montażowa", "Assembly line", "Монтажна лінія"] },
  "isto-kebab": { label: "Isto Kebab", center: [-100, -66, 0], radius: 12.5, colors: [0x356878, 0x73aaa0, 0xc6aa68, 0xef977c],
    landmark: ["Bistro w Jabłonce", "Jabłonka bistro", "Бістро в Яблонці"] },
  moon: { label: "K-01", center: [39, 25, 18], radius: 6.25, colors: [0x767384, 0xa59b9d, 0xd0c6b5, 0xf9e3b6],
    landmark: ["Baza księżycowa", "Lunar base", "Місячна база"] },
  jalapeno: { label: "Jalapeno Kebab", center: [-50, -23, -17], radius: 12, colors: [0x75495f, 0xb78282, 0xc87e5b, 0xe9c280],
    landmark: ["Plac Jalapeno", "Jalapeno terrace", "Тераса Jalapeno"] },
  garage: { label: "G-02", center: [-135, 36, -6], radius: 5.6, colors: [0x443d57, 0x8f7d82, 0xb98e76, 0xf3c486],
    landmark: ["Hangar G-02", "G-02 hangar", "Ангар G-02"] },
  signal: { label: "The Unknown", center: [124, -65, -3], radius: 12.6, colors: [0x3c365a, 0x5a6695, 0x86648d, 0x95e5cb],
    landmark: ["Opuszczona stacja", "Abandoned station", "Покинута станція"] },
} as const satisfies Record<Body, Planet>;

export const projectBodies = ["starcars", "reenergy", "motomizer", "beatmarket", "b-crm", "isto-kebab", "jalapeno"] as const satisfies readonly ProjectBody[];
export const publicBodies: Body[] = ["home", ...projectBodies, "ai"];
export const systemDistance = 475;
export const detailDirection = [0.54, 0.32, 0.78] as const;
export const shipClearance = 4;

const localeSlot = { pl: 0, en: 1, uk: 2 };
export function landmarkLabel(body: Body, locale: WorldLocale) {
  return planets[body].landmark[localeSlot[locale]];
}

export function visibleBodies(moon: boolean, signal: boolean, garage = false): Body[] {
  return [...publicBodies, ...(moon ? ["moon" as const] : []), ...(signal ? ["signal" as const] : []), ...(garage ? ["garage" as const] : [])];
}

export function isSecretBody(body: Body | null): body is SecretBody {
  return body === "moon" || body === "signal" || body === "garage";
}
