import { BERNI_POSES, BERNI_POSE_LABELS, type BerniPose } from "./berni-poses";

export type ReactionGroup = "klipy" | "mimika" | "gesty";
export type BerniMotion =
  | "idle" | "greet" | "nod" | "nope" | "peek" | "bow" | "dance"
  | "jump" | "startle" | "shy" | "spin" | "hide" | "sleep"
  | "scan" | "sneeze" | "celebrate" | "listen" | "think";
export type BerniReaction = {
  id: string;
  label: string;
  group: ReactionGroup;
  pose: BerniPose;
  clip?: string;
  motion?: BerniMotion;
  message: string;
};
export const BERNI_GROUPS: { id: ReactionGroup; label: string }[] = [
  { id: "klipy", label: "Żywe animacje" },
  { id: "mimika", label: "20 emocji" },
  { id: "gesty", label: "Gesty i zachowania" },
];

// The GIFs are source clips already imported in the preview build.
// Each one can now be actively selected in the main mascot, not just viewed
// in an unrelated static gallery.
const clips: BerniReaction[] = [
  ["smiech", "Śmieje się", "Ha! To mnie rozbawiło."],
  ["usmiech", "Uśmiecha się", "Miło Cię widzieć."],
  ["mruganie", "Mruga", "Widziałem to!"],
  ["ekscytacja", "Ekscytuje się", "O, to brzmi świetnie!"],
  ["zaskoczenie", "Jest zaskoczony", "O! Tego się nie spodziewałem."],
  ["wariant-01", "Mówi energicznie", "Opowiadam Ci o projekcie."],
  ["wariant-02", "Mówi spokojnie", "Już wyjaśniam."],
  ["wariant-03", "Opowiada", "Mam coś ciekawego do dodania."],
  ["wariant-04", "Śmieje się głośno", "Ha, ha! Dobre!"],
  ["wariant-05", "Gada z przejęciem", "Słuchaj, mam pomysł."],
  ["wariant-06", "Odpowiada", "Jasne, już odpowiadam."],
].map(([key, label, message]) => ({
  id: "clip-" + key, label, message, group: "klipy" as const,
  pose: key === "zaskoczenie" ? "surprised" :
    key === "mruganie" ? "wink" :
    key === "ekscytacja" ? "excited" :
    key === "smiech" || key === "wariant-04" ? "laughing" : "talk-small",
  clip: key,
}));

const faceMessages: Partial<Record<BerniPose, string>> = {
  neutral: "Jestem, słucham.", curious: "Ciekawe... opowiedz więcej.",
  skeptical: "Nie jestem jeszcze przekonany.", focused: "Pełne skupienie!",
  puzzled: "Hmm, coś mi tu nie pasuje.", happy: "To mi się podoba.",
  laughing: "Ha, ha, ha!", excited: "Ale ekstra!",
  surprised: "Co?! Naprawdę?", worried: "Trochę się martwię.",
  sad: "Ojej, przykro mi.", angry: "To jest irytujące.",
  sleeping: "Zzz...", sleepy: "Jeszcze pięć minut...",
  wink: "Mrug!", confident: "Mam to pod kontrolą.",
  embarrassed: "Ups... ale wpadka.", "talk-small": "Tak, słucham...",
  "talk-open": "Odpowiadam głośniej!", "talk-round": "Ooo!",
};
const faces: BerniReaction[] = BERNI_POSES.map(pose => ({
  id: "face-" + pose,
  group: "mimika",
  label: BERNI_POSE_LABELS[pose],
  pose,
  motion: "idle",
  message: faceMessages[pose] ?? "Słucham.",
}));

const gestures: BerniReaction[] = [
  ["greet", "Macha na powitanie", "Hej! Witaj!", "happy"],
  ["nod", "Potakuje", "Dokładnie tak!", "confident"],
  ["nope", "Kręci głową: nie", "Nie, nie, nie.", "skeptical"],
  ["peek", "Wygląda zaciekawiony", "A co się tutaj dzieje?", "curious"],
  ["bow", "Kłania się", "Do usług!", "confident"],
  ["dance", "Tańczy", "Dobra, świętujemy!", "excited"],
  ["jump", "Podskakuje", "Juhu!", "happy"],
  ["startle", "Podskakuje ze strachu", "Ojej! Wystraszyłeś mnie.", "surprised"],
  ["shy", "Chowa się ze wstydu", "Ale mi głupio...", "embarrassed"],
  ["spin", "Robi obrót", "Patrz, co potrafię!", "excited"],
  ["hide", "Znika i wraca", "A kuku!", "puzzled"],
  ["sleep", "Zasypia", "Zzz... tylko krótka drzemka.", "sleeping"],
  ["scan", "Rozgląda się", "Sprawdzam, co się dzieje.", "focused"],
  ["sneeze", "Kicha", "Apsik!", "puzzled"],
  ["celebrate", "Świętuje", "Udało się!", "laughing"],
  ["listen", "Nadstawia ucha", "Słucham uważnie.", "confident"],
  ["think", "Zastanawia się", "Daj mi pomyśleć...", "focused"],
].map(([motion, label, message, pose]) => ({
  id: "motion-" + motion, group: "gesty" as const, label, message,
  pose: pose as BerniPose, motion: motion as BerniMotion,
}));

export const BERNI_REACTIONS: BerniReaction[] = [...clips, ...faces, ...gestures];
const byId = new Map(BERNI_REACTIONS.map(reaction => [reaction.id, reaction]));
export function getBerniReaction(id: string): BerniReaction {
  return byId.get(id) ?? byId.get("face-neutral")!;
}
export function berniReactionCount(group: ReactionGroup) {
  return BERNI_REACTIONS.filter(reaction => reaction.group === group).length;
}

// Demo context rules: explicit, testable, no fake calls to a language model.
// Real assistant integration is intentionally out of scope for the test page.
export function detectBerniReaction(message: string): string {
  const v = message.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ł/g, "l");
  if (!v.trim()) return "face-neutral";
  const patterns: [RegExp, string][] = [
    [/^(czesc|hej|siema|witaj|hello|hi|dzien dobry)/, "motion-greet"],
    [/dziek|super robota|brawo|szacun/, "motion-bow"],
    [/ha\s*ha|xd|lol|dowcip|zart/, "clip-smiech"],
    [/zgadzam|dokladnie|tak jest|oczywiscie/, "motion-nod"],
    [/nie zgadzam|absolutnie nie|zly pomysl/, "motion-nope"],
    [/blad|awaria|nie dziala|zjeb|kurw|wkurw|problem/, "face-angry"],
    [/smut|przykro|placz|zalam/, "face-sad"],
    [/boje|strach|panik/, "motion-startle"],
    [/niespodzianka|wow|serio|naprawde\?/, "clip-zaskoczenie"],
    [/sukces|udalo|wygral|celebr|swietuj/, "motion-celebrate"],
    [/spac|sen|drzem|zmecz/, "motion-sleep"],
    [/pa\b|do widzenia|zegnaj|bye/, "motion-greet"],
    [/ile koszt|cena|koszt|wycena|oferta/, "face-focused"],
    [/fotowolta|oze|magazyn energ|pompa ciepl/, "clip-ekscytacja"],
    [/auto|samochod|starcars|mercedes/, "motion-peek"],
    [/seo|google|stron|crm|program|kod|vercel|github/, "motion-scan"],
    [/kocham|lubie|uwielbiam|serdusz/, "face-happy"],
    [/pomysl|zastanow|dlaczego|jak to/, "motion-think"],
    [/czy mozesz|prosze|pomoz|pomoc|pytani/, "motion-listen"],
    [/gora|skacz|podskocz/, "motion-jump"],
    [/zatancz|tancz|muzyka/, "motion-dance"],
    [/kreci|obrot|zakrec/, "motion-spin"],
    [/apsik|kich|alerg/, "motion-sneeze"],
    [/wstyd|przepraszam|sorry/, "motion-shy"],
    [/pogoda|deszcz|snieg|chmury/, "motion-scan"],
    [/mow|opowiedz|powiedz|gadaj/, "clip-wariant-01"],
    [/mrugnij|mrug/, "clip-mruganie"],
    [/usmiech|usmiechnij/, "clip-usmiech"],
    [/ciesz|rados|hura/, "motion-celebrate"],
  ];
  return patterns.find(([re]) => re.test(v))?.[1] ?? "motion-think";
}
