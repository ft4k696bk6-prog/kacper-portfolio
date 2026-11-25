"use client";

import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Camera, CarFront, CircleHelp, Compass, Crosshair, Gem, Minus, Moon, Plus, Radio, RotateCcw, Volume2 } from "lucide-react";
import type { RefObject } from "react";
import { awards, findCount, type Body, type CameraMode, type DriveInput } from "./discoveries";
import type { GameCopy } from "./gameCopy";
import type { WorldController } from "./scene";
import type { useWorldGame } from "./useWorldGame";
import styles from "./game.module.css";

type Game = ReturnType<typeof useWorldGame>;
export function GameBeacons({ game, copy, scene }: { game: Game; copy: GameCopy; scene: RefObject<WorldController | null> }) {
  const markers = [
    ["moon", copy.moon, Moon, () => scene.current?.fly("moon")],
    ["ufo", copy.ufo, Radio, () => scene.current?.ufo()],
    ["nearby", copy.nearby, Crosshair, () => scene.current?.interact()],
  ] as const;
  return <div className={styles.beacons}>
    {markers.map(([id, label, Icon, action]) => <button type="button" key={id} className={styles.beacon} ref={node => { game.markers.current[id] = node; }}
      data-visible="false" data-beacon={id} tabIndex={-1} onClick={action}>
      <Icon size={15} /><span>{label}</span>
    </button>)}
  </div>;
}

export function GameHud({ game, copy, scene, change, reset, openLog, fieldLink }: {
  game: Game; copy: GameCopy; scene: RefObject<WorldController | null>;
  change: (mode: CameraMode) => void; reset: () => void; openLog: () => void; fieldLink?: readonly [string, string];
}) {
  const { body, mode, transit, notice, expedition } = game;
  const drive = mode === "drive";
  const input = [
    ["left", ArrowLeft], ["forward", ArrowUp], ["reverse", ArrowDown], ["right", ArrowRight],
  ] as const;
  const set = (key: DriveInput, value: boolean) => scene.current?.driveInput(key, value);
  return <>
    {transit && <div className={styles.transit} role="status"><Radio size={15} />{copy.traveling} · {copy[transit]}</div>}
    <div className={styles.notice} role="status" aria-live="polite">{notice && <><Gem size={15} /> {notice}</>}</div>
    {mode === "photo" ? <button type="button" className={styles.exitPhoto} onClick={() => change("explore")}>{copy.photoExit} <kbd>Esc</kbd></button> :
      <>
        {body !== "home" && !transit && <div className={styles.location}>
          <p>{body === "moon" ? copy.moonNote : copy.signalNote}</p>
          <button type="button" className={styles.button} onClick={() => scene.current?.fly("home")}><ArrowLeft size={15} />{copy.docking}</button>
          {fieldLink && <a className={styles.button} href={fieldLink[1]}>{fieldLink[0]}</a>}
        </div>}
        <div className={styles.hud} role="group" aria-label={copy.controls}>
          {drive ? <>
            <button type="button" onClick={() => scene.current?.resetCar()} aria-label={copy.resetCar} title={copy.resetCar}><RotateCcw size={17} /></button>
            <button type="button" onClick={() => scene.current?.horn()} aria-label={copy.horn} title={copy.horn}><Volume2 size={17} /></button>
            <button type="button" onClick={reset}><Compass size={17} /><span>{copy.stop}</span></button>
          </> : <>
            {body === "home" && !transit && <button type="button" className={styles.drive} onClick={() => change("drive")}><CarFront size={19} /><span>{copy.drive}</span></button>}
            <button type="button" onClick={() => scene.current?.zoom(.82)} aria-label={copy.zoomIn} title={copy.zoomIn}><Plus size={17} /></button>
            <button type="button" onClick={() => scene.current?.zoom(1.22)} aria-label={copy.zoomOut} title={copy.zoomOut}><Minus size={17} /></button>
            <button type="button" onClick={openLog} aria-label={`${copy.discovery} ${expedition.finds.length}/${findCount}`} title={copy.discovery}><Gem size={16} /><span>{expedition.finds.length}/{findCount}</span></button>
          </>}
        </div>
        {drive && <>
          <p className={styles.driveHelp}>{copy.controlsDrive}</p>
          <div className={styles.touchpad}>
            {input.map(([key, Icon]) => <button type="button" key={key} aria-label={copy[key]} data-drive={key}
              onPointerDown={event => { event.preventDefault(); event.currentTarget.setPointerCapture(event.pointerId); set(key, true); }}
              onLostPointerCapture={() => set(key, false)} onPointerUp={() => set(key, false)} onPointerCancel={() => set(key, false)}>
              <Icon size={23} />
            </button>)}
          </div>
        </>}
      </>}
  </>;
}

export function GameMenu({ game, copy, scene, change, leave, log }: {
  game: Game; copy: GameCopy; scene: RefObject<WorldController | null>;
  change: (mode: CameraMode) => void; leave: () => void; log: RefObject<HTMLDetailsElement | null>;
}) {
  const { body, expedition, equipment, setEquipment, mode } = game;
  const fly = (destination: Body) => { leave(); void scene.current?.fly(destination); };
  const unlocked = awards(expedition);
  return <div className={styles.options}>
    <details ref={log}>
      <summary><Gem size={15} /> {copy.discovery} <span>{expedition.finds.length}/{findCount}</span></summary>
      {unlocked.length ? <ul aria-label={copy.award}>{unlocked.map(id => <li key={id}>{copy.awards[id]}</li>)}</ul> : <p>{copy.none}</p>}
    </details>
    {(expedition.moon || expedition.signal || body !== "home") && <details>
      <summary><Moon size={15} /> {copy.fast}</summary>
      <div className={styles.menuRow}>
        {body !== "home" && <button type="button" onClick={() => fly("home")}>{copy.home}</button>}
        {body !== "moon" && expedition.moon && <button type="button" onClick={() => fly("moon")}>{copy.moon}</button>}
        {body !== "signal" && expedition.signal && <button type="button" onClick={() => fly("signal")}>{copy.signal}</button>}
      </div>
    </details>}
    <details>
      <summary><Camera size={15} /> {copy.camera}</summary>
      <div className={styles.menuRow}>
        <button type="button" onClick={() => change("planet")}>{copy.reset}</button>
        <button type="button" onClick={() => change("explore")}>{copy.free}</button>
        {body === "home" && <button type="button" onClick={() => change("drive")}>{copy.drive}</button>}
        <button type="button" onClick={() => change(mode === "photo" ? "explore" : "photo")}>{copy.photo}</button>
      </div>
      <label><input type="checkbox" checked={equipment.auto} onChange={event => {
        const auto = event.target.checked;
        setEquipment({ ...equipment, auto }); scene.current?.setAuto(auto);
      }} /> {copy.rotation}</label>
      <label>{copy.time}<select value={equipment.day} onChange={event => {
        const day = event.target.value as typeof equipment.day;
        setEquipment({ ...equipment, day }); scene.current?.setDay(day);
      }}><option value="cycle">{copy.cycle}</option><option value="day">{copy.day}</option><option value="night">{copy.night}</option></select></label>
    </details>
    <details>
      <summary><CircleHelp size={15} /> {copy.controls}</summary>
      <p>{copy.controlsOrbit}</p><p>{copy.controlsDrive}</p>
      <label>{copy.graphics}<select value={equipment.quality} onChange={event => {
        const quality = event.target.value as typeof equipment.quality;
        setEquipment({ ...equipment, quality }); scene.current?.setQuality(quality);
      }}><option value="auto">{copy.auto}</option><option value="economy">{copy.economy}</option><option value="high">{copy.high}</option></select></label>
      <label><input type="checkbox" checked={equipment.sound} onChange={event => {
        const sound = event.target.checked;
        setEquipment({ ...equipment, sound }); scene.current?.setSound(sound);
      }} /> {copy.sound}</label>
    </details>
  </div>;
}
