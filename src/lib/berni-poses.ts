import type { BerniLivingMood } from "./berni-face-state";

export const BERNI_POSES = [
  "neutral", "curious", "skeptical", "focused", "puzzled",
  "happy", "laughing", "excited", "surprised", "worried",
  "sad", "angry", "sleeping", "sleepy", "wink",
  "confident", "embarrassed", "talk-small", "talk-open", "talk-round",
] as const;

export type BerniPose = (typeof BERNI_POSES)[number];

export const BERNI_POSE_LABELS: Record<BerniPose, string> = {
  neutral:"Spokojny", curious:"Zaciekawiony", skeptical:"Sceptyczny",
  focused:"Skupiony", puzzled:"Zdezorientowany", happy:"Zadowolony",
  laughing:"Śmieje się", excited:"Podekscytowany", surprised:"Zaskoczony",
  worried:"Zmartwiony", sad:"Smutny", angry:"Zły",
  sleeping:"Śpi", sleepy:"Senny", wink:"Mruga okiem",
  confident:"Pewny siebie", embarrassed:"Zawstydzony",
  "talk-small":"Mówi: krótka sylaba", "talk-open":"Mówi: otwarte usta",
  "talk-round":"Mówi: okrągłe usta",
};

export const BERNI_MOOD_POSE: Record<BerniLivingMood, BerniPose> = {
 idle:"neutral", curious:"curious", thinking:"focused", happy:"happy",
 excited:"excited", sleeping:"sleeping", typing:"talk-small",
 listening:"confident", surprised:"surprised", worried:"worried",
 working:"focused", grabbed:"puzzled",
};

export const BERNI_POSE_MOOD: Record<BerniPose, BerniLivingMood> = {
 neutral:"idle", curious:"curious", skeptical:"thinking",
 focused:"thinking", puzzled:"grabbed", happy:"happy", laughing:"excited",
 excited:"excited", surprised:"surprised", worried:"worried",
 sad:"worried", angry:"worried", sleeping:"sleeping", sleepy:"sleeping",
 wink:"happy", confident:"listening", embarrassed:"worried",
 "talk-small":"typing", "talk-open":"typing", "talk-round":"typing",
};

export const berniPoseUrl = (pose: BerniPose): string =>
  `/images/berni/generated/${pose}.png`;
