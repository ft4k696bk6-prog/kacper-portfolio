"use client";

import { ArrowLeft, ArrowRight, Camera, Compass, Crosshair, Gem, Globe2, HelpCircle, Minus, Moon, Plus, Radio, Telescope, X } from "lucide-react";
import type { RefObject } from "react";
import { awards, findCount, type CameraMode } from "./discoveries";
import type { WorldLocale } from "./content";
import type { GameCopy } from "./gameCopy";
import { landmarkLabel, planets, publicBodies, visibleBodies } from "./planets";
import type { WorldController } from "./scene";
import type { useWorldGame } from "./useWorldGame";
import styles from "./game.module.css";

type Game = ReturnType<typeof useWorldGame>;
type Shared = { game: Game; copy: GameCopy; scene: RefObject<WorldController | null> };

export function GameBeacons({ game, copy, scene, locale }: Shared & { locale: WorldLocale }) {
  const body = game.body;
  const markers = [
    ["moon", copy.moon, Moon, () => scene.current?.fly("moon")],
    ["ufo", copy.ufo, Radio, () => scene.current?.ufo()],
    ["nearby", copy.nearby, Crosshair, () => scene.current?.interact()],
    ["landmark", body === "system" ? copy.inspect : landmarkLabel(body, locale), Compass, () => scene.current?.inspect()],
  ] as const;
  const map = visibleBodies(game.chartedMoon, game.expedition.signal, game.expedition.finds.includes("gold"));
  return <div className={styles.beacons}>
    {markers.map(([id, label, Icon, action]) => <button type="button" key={id} className={styles.beacon} ref={node => { game.markers.current[id] = node; }}
      data-visible="false" data-beacon={id} tabIndex={-1} onClick={action}>
      <Icon size={15} /><span>{label}</span>
    </button>)}
    {map.map(id => <button key={id} type="button" className={styles.mapTag}
      ref={node => { game.markers.current[`map-${id}`] = node; }}
      data-map-body={id} data-visible="false" tabIndex={-1} onClick={() => void scene.current?.fly(id)}>
      {id === "moon" ? copy.moon : planets[id].label}<ArrowRight size={12} />
    </button>)}
  </div>;
}

export function GameHud({ game, copy, scene, change, openLog }: Shared & { change: (mode: CameraMode) => void; openLog: () => void; }) {
  const { body, mode, transit, notice, expedition } = game;
  const destination = transit === "system" ? copy.map : transit === "signal" && !expedition.signal ? copy.faint : transit ? planets[transit].label : "";
  const position = publicBodies.findIndex(id => id === body);
  const traverse = (direction: number) => {
    const index = position === -1 ? direction < 0 ? publicBodies.length - 1 : 0 : (position + direction + publicBodies.length) % publicBodies.length;
    void scene.current?.fly(publicBodies[index]);
  };
  if (mode === "photo") return <button type="button" className={styles.exitPhoto} onClick={() => change("explore")}>{copy.photoExit} <kbd>Esc</kbd></button>;
  return <>
    {transit && <div className={styles.transit}><span role="status"><Radio size={15} />{copy.traveling} <span aria-hidden="true">·</span> {destination}</span>
      <button type="button" onClick={() => scene.current?.stopFlight()} aria-label={copy.cancel} title={copy.cancel}><X size={19} /></button></div>}
    <div className={styles.notice} role="status" aria-live="polite">{notice && <><Gem size={15} /> {notice}</>}</div>
    {!transit && <div className={styles.location}>
      {body === "system" ? <><span className={styles.eyebrow}>{copy.universe}</span><strong>{copy.map}</strong><p>{copy.mapHint}</p></> :
        <><span className={styles.eyebrow}>{copy.world}</span><strong>{body === "moon" ? copy.moon : planets[body].label}</strong></>}
      {body === "signal" && <p>{copy.signalNote}</p>}
      {body === "moon" && <p>{copy.moonNote}</p>}
    </div>}
    <div className={styles.hud} role="group" aria-label={copy.controls}>
      <button type="button" onClick={() => traverse(-1)} aria-label={copy.previous} title={copy.previous}><ArrowLeft size={16} /></button>
      <button type="button" onClick={() => traverse(1)} aria-label={copy.next} title={copy.next}><ArrowRight size={16} /></button>
      {body !== "system" && <button type="button" className={styles.mapAction} onClick={() => void scene.current?.fly("system")} aria-label={copy.map} title={copy.map}><Globe2 size={18} /><span>{copy.map}</span></button>}
      {body === "system" && <button type="button" className={styles.mapAction} onClick={() => void scene.current?.fly("home")} aria-label={copy.home} title={copy.home}><Globe2 size={18} /><span>{copy.home}</span></button>}
      <button type="button" onClick={() => scene.current?.zoom(.82)} aria-label={copy.zoomIn} title={copy.zoomIn}><Plus size={16} /></button>
      <button type="button" onClick={() => scene.current?.zoom(1.22)} aria-label={copy.zoomOut} title={copy.zoomOut}><Minus size={16} /></button>
      <button type="button" onClick={openLog} aria-label={`${copy.discovery} ${expedition.finds.length}/${findCount}`} title={copy.discovery}><Gem size={15} /><span>{expedition.finds.length}/{findCount}</span></button>
    </div>
  </>;
}

export function GameMenu({ game, copy, scene, change, leave, log }: Shared & {
  change: (mode: CameraMode) => void; leave: () => void; log: RefObject<HTMLDetailsElement | null>;
}) {
  const { body, expedition, equipment, setEquipment, mode } = game;
  const unlocked = awards(expedition);
  return <div className={styles.options}>
    <details ref={log}>
      <summary><Gem size={15} /> {copy.discovery} <span>{expedition.finds.length}/{findCount}</span></summary>
      {unlocked.length ? <ul aria-label={copy.award}>{unlocked.map(id => <li key={id}>{copy.awards[id]}</li>)}</ul> : <p>{copy.none}</p>}
    </details>
    {(game.chartedMoon || expedition.signal || expedition.finds.includes("gold")) && <details>
      <summary><Moon size={15} /> {copy.logged}</summary>
      <div className={styles.menuRow}>
        {game.chartedMoon && body !== "moon" && <button type="button" onClick={() => { leave(); void scene.current?.fly("moon"); }}>{copy.moon}</button>}
        {expedition.finds.includes("gold") && body !== "garage" && <button type="button" onClick={() => { leave(); void scene.current?.fly("garage"); }}>{planets.garage.label}</button>}
        {expedition.signal && body !== "signal" && <button type="button" onClick={() => { leave(); void scene.current?.fly("signal"); }}>{copy.signal}</button>}
      </div>
    </details>}
    <details>
      <summary><Camera size={15} /> {copy.camera}</summary>
      <div className={styles.menuRow}>
        <button type="button" onClick={() => change("planet")}>{copy.reset}</button>
        <button type="button" onClick={() => change(mode === "photo" ? "explore" : "photo")}>{copy.photo}</button>
        {body === "home" && <button type="button" onClick={() => { leave(); scene.current?.revealMoon(); void scene.current?.fly("system"); }}><Telescope size={15} />{copy.launchMap}</button>}
      </div>
      <label><input type="checkbox" checked={equipment.auto} onChange={event => {
        const auto = event.target.checked; setEquipment({ ...equipment, auto }); scene.current?.setAuto(auto);
      }} /> {copy.rotation}</label>
      <label>{copy.time}<select value={equipment.day} onChange={event => {
        const day = event.target.value as typeof equipment.day; setEquipment({ ...equipment, day }); scene.current?.setDay(day);
      }}><option value="cycle">{copy.cycle}</option><option value="day">{copy.day}</option><option value="night">{copy.night}</option></select></label>
    </details>
    <details>
      <summary><HelpCircle size={15} /> {copy.graphics} &amp; {copy.sound}</summary>
      <label>{copy.graphics}<select value={equipment.quality} onChange={event => {
        const quality = event.target.value as typeof equipment.quality; setEquipment({ ...equipment, quality }); scene.current?.setQuality(quality);
      }}><option value="auto">{copy.auto}</option><option value="economy">{copy.economy}</option><option value="high">{copy.high}</option></select></label>
      <label><input type="checkbox" checked={equipment.fx} onChange={event => {
        const fx = event.target.checked; setEquipment({ ...equipment, fx }); scene.current?.setEffects(fx);
      }} /> {copy.effects}</label>
      <label><input type="checkbox" checked={equipment.sound} onChange={event => {
        const sound = event.target.checked; setEquipment({ ...equipment, sound }); scene.current?.setSound(sound);
      }} /> {copy.sound}</label>
    </details>
  </div>;
}
