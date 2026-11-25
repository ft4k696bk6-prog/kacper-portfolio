import { useEffect, useRef, useState } from "react";
import { emptyExpedition, gameStorage, readExpedition, type Body, type CameraMode, type Expedition, type FindId } from "./discoveries";
import type { Beacon } from "./play";
import type { WorldController } from "./scene";

export function useWorldGame() {
  const [body, setBody] = useState<Body>("home");
  const [transit, setTransit] = useState<Body | null>(null);
  const [mode, setMode] = useState<CameraMode>("planet");
  const [expedition, setExpedition] = useState<Expedition>(emptyExpedition);
  const [equipment, setEquipment] = useState({ auto: false, sound: false, day: "cycle" as "cycle" | "day" | "night", quality: "auto" as "auto" | "economy" | "high" });
  const [notice, setNotice] = useState("");
  const live = useRef(emptyExpedition);
  const markers = useRef<Partial<Record<Beacon, HTMLButtonElement | null>>>({});
  const timer = useRef<number>(0);

  useEffect(() => {
    live.current = readExpedition();
    setExpedition(live.current);
    return () => window.clearTimeout(timer.current);
  }, []);

  function notify(message: string) {
    window.clearTimeout(timer.current);
    setNotice(message);
    timer.current = window.setTimeout(() => setNotice(""), 4400);
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

  function arrive(destination: Body) {
    setBody(destination);
    setMode(destination === "home" ? "planet" : "explore");
    if (destination !== "home" && !live.current[destination]) save({ ...live.current, [destination]: true });
  }

  function project(id: Beacon, x: number, y: number, visible: boolean) {
    const button = markers.current[id];
    if (!button) return;
    const next = visible ? "true" : "false";
    if (button.dataset.visible !== next) {
      button.dataset.visible = next;
      button.tabIndex = visible ? 0 : -1;
    }
    if (visible) button.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -50%)`;
  }

  function init(scene: WorldController) {
    scene.setFinds(live.current.finds);
    scene.setAuto(equipment.auto);
    scene.setDay(equipment.day);
    scene.setQuality(equipment.quality);
  }

  return { body, transit, mode, expedition, equipment, notice, markers, notify, found, arrive, project, init, setTransit, setMode, setEquipment };
}
