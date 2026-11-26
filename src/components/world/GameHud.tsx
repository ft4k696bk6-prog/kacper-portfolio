"use client";

import { ArrowLeft, ArrowRight, ArrowUpRight, Camera, ChevronDown, Compass, Crosshair, Gem, House, Minus, Moon, Orbit, Plus, Radio, SlidersHorizontal, Telescope, X } from "lucide-react";
import type { RefObject } from "react";
import { awards, findCount, type CameraMode } from "./discoveries";
import type { WorldLocale } from "./content";
import type { GameCopy } from "./gameCopy";
import { landmarkLabel, planets, projectBodies, publicBodies, visibleBodies } from "./planets";
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
      <Icon size={15} strokeWidth={1.6} aria-hidden="true" /><span>{label}</span>
    </button>)}
    {map.map(id => <button key={id} type="button" className={styles.mapTag}
      ref={node => { game.markers.current[`map-${id}`] = node; }}
      data-map-body={id} data-visible="false" tabIndex={-1} onClick={() => void scene.current?.fly(id)}>
      <span>{id === "moon" ? copy.moon : planets[id].label}</span>
      <ArrowUpRight size={12} strokeWidth={1.55} aria-hidden="true" />
    </button>)}
  </div>;
}

export function GameHud({ game, copy, scene, change, openLog }: Shared & { change: (mode: CameraMode) => void; openLog: () => void; }) {
  const { body, mode, transit, notice, expedition } = game;
  const destination = transit === "system" ? copy.map : transit === "signal" && !expedition.signal ? copy.faint : transit ? planets[transit].label : "";
  const system = body === "system";
  const hasProject = body === "ai" || projectBodies.some(id => id === body);
  const destinationLabel = system ? copy.home : copy.map;
  const MapIcon = system ? House : Orbit;
  const position = publicBodies.findIndex(id => id === body);
  const traverse = (direction: number) => {
    const index = position === -1 ? direction < 0 ? publicBodies.length - 1 : 0 : (position + direction + publicBodies.length) % publicBodies.length;
    void scene.current?.fly(publicBodies[index]);
  };
  if (mode === "photo") return <button type="button" className={styles.exitPhoto} onClick={() => change("explore")}><X size={16} strokeWidth={1.55} aria-hidden="true" />{copy.photoExit} <kbd>Esc</kbd></button>;
  return <>
    {transit && <div className={styles.transit}>
      <span className={styles.transitStatus} role="status">
        <Radio size={18} strokeWidth={1.55} aria-hidden="true" />
        <span><span className={styles.eyebrow}>{copy.traveling}</span><strong>{destination}</strong></span>
      </span>
      <button type="button" onClick={() => scene.current?.stopFlight()} aria-label={copy.cancel} title={copy.cancel}><X size={17} strokeWidth={1.55} aria-hidden="true" /></button>
    </div>}
    <div className={styles.notice} role="status" aria-live="polite">{notice && <><Gem size={16} strokeWidth={1.55} aria-hidden="true" /><span>{notice}</span></>}</div>
    {!transit && body !== "home" && <div className={styles.location}>
      <div className={styles.locationCopy}>
        {system ? <><strong>{copy.map}</strong><p>{copy.mapHint}</p></> :
          <><span className={styles.eyebrow}>{copy.world}</span><strong>{body === "moon" ? copy.moon : planets[body].label}</strong></>}
        {body === "signal" && <p>{copy.signalNote}</p>}
        {body === "moon" && <p>{copy.moonNote}</p>}
      </div>
      {hasProject && <button type="button" className={styles.caseAction} onClick={() => scene.current?.inspect()}>
        {copy.projectDetails}<ArrowUpRight size={17} strokeWidth={1.55} aria-hidden="true" />
      </button>}
    </div>}
    <div className={styles.hud} role="group" aria-label={copy.controls} data-hud-body={body}>
      <div className={styles.dockPair}>
        <button type="button" onClick={() => traverse(-1)} aria-label={copy.previous} title={copy.previous}><ArrowLeft size={17} strokeWidth={1.55} aria-hidden="true" /></button>
        <button type="button" onClick={() => traverse(1)} aria-label={copy.next} title={copy.next}><ArrowRight size={17} strokeWidth={1.55} aria-hidden="true" /></button>
      </div>
      <button type="button" className={styles.mapAction} onClick={() => void scene.current?.fly(system ? "home" : "system")}
        aria-label={destinationLabel} title={destinationLabel} aria-keyshortcuts="G">
        <MapIcon size={18} strokeWidth={1.65} aria-hidden="true" />
        <span className={styles.mapLabel}>{destinationLabel}</span>
        <span className={styles.mapLabelShort}>{system ? copy.quickHome : copy.quickMap}</span>
      </button>
      <div className={styles.dockPair}>
        <button type="button" onClick={() => scene.current?.zoom(.82)} aria-label={copy.zoomIn} title={copy.zoomIn}><Plus size={17} strokeWidth={1.55} aria-hidden="true" /></button>
        <button type="button" onClick={() => scene.current?.zoom(1.22)} aria-label={copy.zoomOut} title={copy.zoomOut}><Minus size={17} strokeWidth={1.55} aria-hidden="true" /></button>
      </div>
      <button type="button" className={styles.count} onClick={openLog} aria-label={`${copy.discovery} ${expedition.finds.length}/${findCount}`} title={copy.discovery}>
        <Gem size={16} strokeWidth={1.55} aria-hidden="true" /><span>{expedition.finds.length}/{findCount}</span>
      </button>
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
      <summary><Gem size={16} strokeWidth={1.55} aria-hidden="true" /> <span>{copy.discovery}</span>
        <span className={styles.optionCount}>{expedition.finds.length}/{findCount}</span><ChevronDown size={15} strokeWidth={1.55} aria-hidden="true" /></summary>
      <div className={styles.optionContent}>
        {unlocked.length ? <ul aria-label={copy.award}>{unlocked.map(id => <li key={id}>{copy.awards[id]}</li>)}</ul> : <p>{copy.none}</p>}
      </div>
    </details>
    {(game.chartedMoon || expedition.signal || expedition.finds.includes("gold")) && <details>
      <summary><Moon size={16} strokeWidth={1.55} aria-hidden="true" /> <span>{copy.logged}</span><ChevronDown size={15} strokeWidth={1.55} aria-hidden="true" /></summary>
      <div className={styles.optionContent}>
        <div className={styles.menuRow}>
          {game.chartedMoon && body !== "moon" && <button type="button" onClick={() => { leave(); void scene.current?.fly("moon"); }}>{copy.moon}<ArrowUpRight size={13} aria-hidden="true" /></button>}
          {expedition.finds.includes("gold") && body !== "garage" && <button type="button" onClick={() => { leave(); void scene.current?.fly("garage"); }}>{planets.garage.label}<ArrowUpRight size={13} aria-hidden="true" /></button>}
          {expedition.signal && body !== "signal" && <button type="button" onClick={() => { leave(); void scene.current?.fly("signal"); }}>{copy.signal}<ArrowUpRight size={13} aria-hidden="true" /></button>}
        </div>
      </div>
    </details>}
    <details>
      <summary><Camera size={16} strokeWidth={1.55} aria-hidden="true" /> <span>{copy.camera}</span><ChevronDown size={15} strokeWidth={1.55} aria-hidden="true" /></summary>
      <div className={styles.optionContent}>
        <div className={styles.menuRow}>
          <button type="button" onClick={() => change("planet")}>{copy.reset}</button>
          <button type="button" onClick={() => change(mode === "photo" ? "explore" : "photo")}>{copy.photo}</button>
          {body === "home" && <button type="button" onClick={() => { leave(); scene.current?.revealMoon(); void scene.current?.fly("system"); }}><Telescope size={16} strokeWidth={1.55} aria-hidden="true" />{copy.launchMap}</button>}
        </div>
        <label className={styles.setting}><span>{copy.rotation}</span><input type="checkbox" checked={equipment.auto} onChange={event => {
          const auto = event.target.checked; setEquipment({ ...equipment, auto }); scene.current?.setAuto(auto);
        }} /></label>
        <label className={styles.setting}><span>{copy.time}</span><select value={equipment.day} onChange={event => {
          const day = event.target.value as typeof equipment.day; setEquipment({ ...equipment, day }); scene.current?.setDay(day);
        }}><option value="cycle">{copy.cycle}</option><option value="day">{copy.day}</option><option value="night">{copy.night}</option></select></label>
      </div>
    </details>
    <details>
      <summary><SlidersHorizontal size={16} strokeWidth={1.55} aria-hidden="true" /> <span>{copy.graphics} &amp; {copy.sound}</span><ChevronDown size={15} strokeWidth={1.55} aria-hidden="true" /></summary>
      <div className={styles.optionContent}>
        <label className={styles.setting}><span>{copy.graphics}</span><select value={equipment.quality} onChange={event => {
          const quality = event.target.value as typeof equipment.quality; setEquipment({ ...equipment, quality }); scene.current?.setQuality(quality);
        }}><option value="auto">{copy.auto}</option><option value="economy">{copy.economy}</option><option value="high">{copy.high}</option></select></label>
        <label className={styles.setting}><span>{copy.effects}</span><input type="checkbox" checked={equipment.fx} onChange={event => {
          const fx = event.target.checked; setEquipment({ ...equipment, fx }); scene.current?.setEffects(fx);
        }} /></label>
        <label className={styles.setting}><span>{copy.sound}</span><input type="checkbox" checked={equipment.sound} onChange={event => {
          const sound = event.target.checked; setEquipment({ ...equipment, sound }); scene.current?.setSound(sound);
        }} /></label>
      </div>
    </details>
  </div>;
}
