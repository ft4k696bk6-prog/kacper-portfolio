import { useEffect, useRef, useState } from "react";
import { emptyExpedition, gameStorage, readExpedition, type Body, type CameraMode, type Destination, type Expedition, type FindId } from "./discoveries";
import type { Beacon } from "./play";
import type { WorldController } from "./scene";

export function useWorldGame() {
  const [body, setBody] = useState<Destination>("home");
  const [transit, setTransit] = useState<Destination | null>(null);
  const [mode, setMode] = useState<CameraMode>("planet");
  const [chartedMoon, revealMoon] = useState(false);
  const [expedition, setExpedition] = useState<Expedition>(emptyExpedition);
  const [equipment, setEquipment] = useState({ auto: false, sound: false, fx: true, day: "cycle" as "cycle" | "day" | "night", quality: "auto" as "auto" | "economy" | "high" });
  const [notice, setNotice] = useState("");
  const [atlasFocus, setAtlasFocus] = useState<Body | null>(null);
  const live = useRef(emptyExpedition);
  const markers = useRef<Partial<Record<Beacon | `map-${Body}`, HTMLButtonElement | null>>>({});
  const timer = useRef<number>(0);
  const flightTrack = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    live.current = readExpedition();
    setExpedition(live.current);
    revealMoon(live.current.moon);
    return () => window.clearTimeout(timer.current);
  }, []);

  function notify(message: string) {
    window.clearTimeout(timer.current);
    setNotice(message);
    timer.current = window.setTimeout(() => setNotice(""), 4200);
  }

  function save(next: Expedition) {
    live.current = next;
    setExpedition(next);
    try { localStorage.setItem(gameStorage, JSON.stringify(next)); } catch {}
  }

  function found(id: FindId) {
    if (live.current.finds.includes(id)) return false;
    save({ ...live.current, finds: [...live.current.finds, id] });
    return true;
  }

  function arrive(destination: Destination) {
    setBody(destination);
    setMode("planet");
    if (destination === "moon") revealMoon(true);
    if ((destination === "moon" || destination === "signal") && !live.current[destination]) save({ ...live.current, [destination]: true });
  }

  function project(id: Beacon | Body, x: number, y: number, visible: boolean, system = false) {
    const key = system ? `map-${id as Body}` as const : id as Beacon;
    const button = markers.current[key];
    if (!button) return;
    const next = visible ? "true" : "false";
    if (button.dataset.visible !== next) {
      button.dataset.visible = next;
      button.tabIndex = visible ? 0 : -1;
    }
    if (visible) {
      const left = `${x.toFixed(1)}px`;
      const top = `${y.toFixed(1)}px`;
      if (button.style.getPropertyValue("--atlas-marker-x") !== left) button.style.setProperty("--atlas-marker-x", left);
      if (button.style.getPropertyValue("--atlas-marker-y") !== top) button.style.setProperty("--atlas-marker-y", top);
    }
  }

  function init(scene: WorldController) {
    scene.setFinds(live.current.finds, live.current.moon || chartedMoon, live.current.signal);
    scene.setAuto(equipment.auto);
    scene.setDay(equipment.day);
    scene.setQuality(equipment.quality);
    scene.setEffects(equipment.fx);
  }

  return { body, transit, mode, expedition, equipment, notice, markers, notify, found, arrive, project, init, chartedMoon, revealMoon, setTransit, setMode, setEquipment,
    atlasFocus, setAtlasFocus, flightTrack };
}
