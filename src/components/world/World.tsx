"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";
import Image from "next/image";
import {
  ArrowDown, ArrowUpRight, ChevronLeft, ChevronRight, Maximize2, Move, X,
} from "lucide-react";
import { gsap } from "gsap";
import { classicPaths, contactPaths, copy, mapStops, projectIndex, projects, projectStops, sceneStops, worldEditorial, worldPaths, zones, type ProjectId, type StopId, type WorldLocale, type Zone } from "./content";
import { ExperienceDialog, rememberExperience } from "./Experience";
import type { WorldController } from "./scene";
import { GameBeacons, GameHud, GameMenu } from "./GameHud";
import { useWorldGame } from "./useWorldGame";
import { gameCopy } from "./gameCopy";
import { finds, localeIndex, type CameraMode } from "./discoveries";
import styles from "./world.module.css";
import gameStyles from "./game.module.css";
import { planets, projectBodies } from "./planets";

const projectLabels: Record<ProjectId, string> = {
  reenergy: "ReEnergy", starcars: "StarCars", "isto-kebab": "Isto Kebab", "b-crm": "B-CRM", motomizer: "Motomizer", beatmarket: "BeatMarket", jalapeno: "Jalapeno",
};
function isProject(id: StopId): id is ProjectId {
  return Object.hasOwn(projectStops, id);
}
const localeLabels = { pl: "Polski", en: "English", uk: "Українська" } as const;
type Selection = { zone: Zone | null; project: number | null };
const overview: Selection = { zone: null, project: null };

function readSelection(): Selection {
  const hash = window.location.hash.slice(1);
  const project = projects.findIndex(item => `project-${item.id}` === hash);
  if (project >= 0) return { zone: "gallery", project };
  return { zone: zones.find(item => item.id === hash)?.id ?? null, project: null };
}

function selectionHash(selection: Selection) {
  if (selection.project !== null) return `#project-${projects[selection.project].id}`;
  return selection.zone ? `#${selection.zone}` : "";
}

function ActionLink({ href, children, primary = false }: { href: string; children: ReactNode; primary?: boolean }) {
  const external = href.startsWith("https://");
  return <a className={primary ? styles.primary : styles.inlineLink} href={href}
    target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}>
    <span>{children}</span><span className={primary ? styles.actionIcon : undefined}><ArrowUpRight size={16} strokeWidth={1.35} aria-hidden="true" /></span>
  </a>;
}

export function World({ locale }: { locale: WorldLocale }) {
  const t = copy[locale];
  const gt = gameCopy(locale);
  const editorial = worldEditorial[locale];
  const game = useWorldGame();
  const gameRef = useRef(game);
  gameRef.current = game;
  const gameLog = useRef<HTMLDetailsElement>(null);
  const [selection, setSelection] = useState<Selection>(overview);
  const [photo, setPhoto] = useState(0);
  const [status, setStatus] = useState<"loading" | "ready" | "static">("loading");
  const [modeDialog, setModeDialog] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [staticOnly, setStaticOnly] = useState(false);
  const [sceneAttempt, setSceneAttempt] = useState(0);
  const stage = useRef<HTMLDivElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const poster = useRef<HTMLImageElement>(null);
  const scene = useRef<WorldController | null>(null);
  const main = useRef<HTMLElement>(null);
  const copyArea = useRef<HTMLElement>(null);
  const markers = useRef<Partial<Record<StopId, HTMLButtonElement | null>>>({});
  const menuButton = useRef<HTMLButtonElement>(null);
  const menuPanel = useRef<HTMLDialogElement>(null);
  const photoPanel = useRef<HTMLDialogElement>(null);
  const photoTrigger = useRef<HTMLButtonElement>(null);
  const menuReturn = useRef<HTMLElement | null>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);
  const current = useRef<Selection>(overview);
  const title = useRef<HTMLHeadingElement>(null);
  const gallery = selection.project !== null ? projects[selection.project] : null;
  const [previewOpen, setPreviewOpen] = useState(false);
  const isOverview = selection.zone === null;
  const showOpening = isOverview && game.body === "home" && game.mode !== "photo" && !game.transit;
  const focusOnChange = useRef(false);

  const go = useCallback((next: Selection, focus = true) => {
    if (focus && document.activeElement instanceof HTMLElement && !copyArea.current?.contains(document.activeElement)) {
      lastTrigger.current = document.activeElement;
    }
    gameRef.current.setMode("planet");
    focusOnChange.current = focus;
    current.current = next;
    setSelection(next);
    setPhoto(0);
    window.history.replaceState(window.history.state, "", window.location.pathname + window.location.search + selectionHash(next));
    scene.current?.moveView(next);
  }, []);

  const selectZone = useCallback((zone: Zone) => go({ zone, project: null }), [go]);
  const selectProject = useCallback((project: number) => go({ zone: "gallery", project }), [go]);

  const selectStop = (id: StopId) => {
    if (isProject(id)) selectProject(projectIndex(id));
    else selectZone(id);
  };

  useEffect(() => {
    const read = () => {
      const next = readSelection();
      current.current = next;
      setSelection(next);
      setPhoto(0);
      scene.current?.moveView(next);
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);

  useEffect(() => {
    const node = host.current;
    if (!node || staticOnly) return;
    let stopped = false;
    const abort = new AbortController();
    let controller: WorldController | undefined;
    const fallback = () => {
      if (stopped) return;
      controller?.dispose();
      controller = undefined;
      scene.current = null;
      for (const badge of Object.values(markers.current)) {
        badge?.style.removeProperty("--x");
        badge?.style.removeProperty("--y");
        badge?.removeAttribute("data-offscreen");
      }
      gameRef.current.setTransit(null);
      gameRef.current.setEquipment({ ...gameRef.current.equipment, sound: false });
      gameRef.current.arrive("home");
      setStatus("static");
    };
    let paint = 0;
    // Decode and paint the overview artwork before starting GPU and shader setup.
    const loadScene = () => {
      import("./scene").then(async ({ createWorld }) => {
        if (stopped) return;
        if (!window.WebGL2RenderingContext) { fallback(); return; }
        try {
          const created = await createWorld(node, {
            marker(id, x, y, visible) {
              const marker = markers.current[id];
              if (!marker) return;
              marker.style.setProperty("--x", `${x.toFixed(1)}px`);
              marker.style.setProperty("--y", `${y.toFixed(1)}px`);
              const offscreen = visible ? "false" : "true";
              if (marker.dataset.offscreen !== offscreen) marker.dataset.offscreen = offscreen;
            },
            select(hit) {
              if (hit.project !== undefined) selectProject(hit.project);
              else selectZone(hit.zone);
            },
            beacon(id, x, y, visible) { gameRef.current.project(id, x, y, visible); },
            planet(id, x, y, visible) { gameRef.current.project(id, x, y, visible, true); },
            atlasFocus(id) { gameRef.current.setAtlasFocus(id); },
            flightProgress(progress) { gameRef.current.flightTrack.current?.style.setProperty("--flight-progress", String(progress)); },
            moonRevealed() { gameRef.current.revealMoon(true); },
            found(id) {
              if (gameRef.current.found(id)) gameRef.current.notify(finds[id][localeIndex[locale]]);
            },
            traveling(destination, keepPanel) {
              gameRef.current.setTransit(destination);
              if (!destination || keepPanel) return;
              current.current = overview;
              setSelection(overview);
              window.history.replaceState(window.history.state, "", window.location.pathname + window.location.search);
            },
            arrived(destination) {
              gameRef.current.arrive(destination);
              if (!current.current.zone) stage.current?.focus({ preventScroll: true });
            },
            interrupted(previous, failed) {
              focusOnChange.current = false;
              current.current = previous;
              setSelection(previous);
              setPhoto(0);
              window.history.replaceState(window.history.state, "", window.location.pathname + window.location.search + selectionHash(previous));
              if (failed) gameRef.current.notify(gameCopy(locale).flightError);
              stage.current?.focus({ preventScroll: true });
            },
            lost: fallback,
            rendered() { if (!stopped) setStatus("ready"); },
          }, abort.signal);
          if (stopped) {
            created.dispose();
            return;
          }
          controller = created;
          scene.current = controller;
          gameRef.current.init(controller);
          controller.moveView(current.current, current.current.zone !== null);
        } catch {
          fallback();
        }
      }, fallback);
    };
    const decoded = poster.current?.decode() ?? Promise.resolve();
    decoded.catch(() => {}).then(() => {
      if (stopped) return;
      paint = requestAnimationFrame(() => { paint = requestAnimationFrame(loadScene); });
    });
    return () => {
      stopped = true;
      abort.abort();
      cancelAnimationFrame(paint);
      controller?.dispose();
      if (scene.current === controller) scene.current = null;
    };
  }, [locale, selectProject, selectZone, staticOnly, sceneAttempt]);

  useLayoutEffect(() => { scene.current?.refresh(); }, [status, game.body, game.transit, game.mode, game.chartedMoon, selection]);

  useEffect(() => {
    if (!main.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = main.current;
    const context = gsap.context(() => {
      gsap.from("[data-world-logo]", { clipPath: "inset(0 100% 0 0)", duration: 0.75, ease: "power3.out", clearProps: "clipPath" });
      gsap.from("[data-world-line]", { yPercent: 106, duration: 0.88, stagger: 0.08, ease: "power4.out", clearProps: "transform" });
      gsap.from("[data-world-reveal]", { y: 9, opacity: 0, delay: 0.14, duration: 0.55, stagger: 0.06, ease: "power2.out", clearProps: "transform,opacity" });
    }, root);
    return () => context.revert();
  }, []);

  useLayoutEffect(() => {
    if (!focusOnChange.current || game.transit) return;
    focusOnChange.current = false;
    if (selection.zone) {
      title.current?.focus({ preventScroll: true });
      const panel = title.current?.closest("[data-testid=world-place]");
      if (!panel) return;
      if (window.matchMedia("(max-width: 830px)").matches) panel.scrollIntoView({ block: "start", behavior: "instant" });
      else panel.scrollTop = 0;
      return;
    }
    const trigger = lastTrigger.current;
    if (trigger && trigger !== document.body && trigger.isConnected) trigger.focus({ preventScroll: true });
    else menuButton.current?.focus({ preventScroll: true });
  }, [selection, game.transit]);

  useEffect(() => {
    if (game.transit || !selection.zone || !copyArea.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const context = gsap.context(() => {
      gsap.from("[data-testid=world-place]", { y: 12, opacity: 0, delay: 0.12, duration: 0.56, ease: "power3.out", clearProps: "transform,opacity" });
    }, copyArea.current);
    return () => context.revert();
  }, [selection, game.transit]);

  function keydown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "Escape") {
      if (modeDialog || menuOpen || photoPanel.current?.open) return;
      if (game.mode === "photo") { changeMode("explore"); return; }
      if (game.transit) { scene.current?.stopFlight(); return; }
      if (selection.zone) { go(overview); return; }
      if (game.body !== "home") void scene.current?.fly(game.body === "system" ? "home" : "system");
      return;
    }
    if (modeDialog || menuOpen || event.ctrlKey || event.metaKey || event.altKey || (event.shiftKey && event.key !== "+") || event.target !== stage.current) return;
    const lower = event.key.toLowerCase();
    if (game.transit) return;
    if (lower === "f") { event.preventDefault(); changeMode(game.mode === "photo" ? "explore" : "photo"); return; }
    if (lower === "e") { event.preventDefault(); scene.current?.interact(); return; }
    if (lower === "g") { event.preventDefault(); void scene.current?.fly(game.body === "system" ? "home" : "system"); return; }
    if (event.key === "+" || event.key === "=" || event.key === "-") {
      event.preventDefault(); scene.current?.zoom(event.key === "-" ? 1.22 : .82); return;
    }
    const slot = Number(event.key) - 1;
    if (event.key.length === 1 && slot >= 0 && slot < 8) { event.preventDefault(); selectStop(mapStops[slot]); return; }
    if (event.key === "0") { event.preventDefault(); go(overview); return; }
    const steps: Record<string, [number, number]> = {
      ArrowLeft: [-0.18, 0], ArrowRight: [0.18, 0], ArrowUp: [0, -0.14], ArrowDown: [0, 0.14],
    };
    if (event.key in steps) {
      event.preventDefault();
      scene.current?.nudge(...steps[event.key]);

    }
  }

  function toggleStatic() {
    if (status === "ready") {
      gameRef.current.arrive("home");
      gameRef.current.setTransit(null);
      gameRef.current.setEquipment({ ...gameRef.current.equipment, sound: false });
      setStaticOnly(true);
      setStatus("static");
      return;
    }
    setStaticOnly(false);
    setStatus("loading");
    setSceneAttempt(value => value + 1);
  }

  function cycleProject(direction: number) {
    if (selection.project === null) return;
    go({ zone: "gallery", project: (selection.project + direction + projects.length) % projects.length }, false);
  }

  function cyclePhoto(direction: number) {
    if (!gallery) return;
    setPhoto(value => (value + direction + gallery.images.length) % gallery.images.length);
  }

  function closePhoto() {
    photoPanel.current?.close();
    setPreviewOpen(false);
    photoTrigger.current?.focus({ preventScroll: true });
  }

  function photoControls(className: string) {
    if (!gallery || gallery.images.length < 2) return null;
    return <div className={className}>
      <button type="button" aria-label={t.prevPhoto} onClick={() => cyclePhoto(-1)}><ChevronLeft size={16} aria-hidden="true" /></button>
      <span aria-live="polite">{photo + 1} / {gallery.images.length}</span>
      <button type="button" aria-label={t.nextPhoto} onClick={() => cyclePhoto(1)}><ChevronRight size={16} aria-hidden="true" /></button>
    </div>;
  }

  function openMenu() {
    menuReturn.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    menuPanel.current?.showModal();
    setMenuOpen(true);
  }

  function closeMenu() {
    menuPanel.current?.close();
    setMenuOpen(false);
    const trigger = menuReturn.current;
    if (trigger && trigger !== document.body && trigger.isConnected) trigger.focus({ preventScroll: true });
    else menuButton.current?.focus({ preventScroll: true });
  }
  function changeMode(mode: CameraMode) {
    if (menuOpen) closeMenu();
    if (mode === "planet") {
      go(overview, false);
      scene.current?.setMode("planet");
    } else {
      game.setMode(mode);
      scene.current?.setMode(mode);
    }
    stage.current?.focus({ preventScroll: true });
  }

  function showLog() {
    openMenu();
    if (gameLog.current) gameLog.current.open = true;
    gameLog.current?.querySelector("summary")?.focus();
  }

  const activePlace = selection.zone ? t.zones[selection.zone] : null;
  const activeStop = gallery?.id ?? selection.zone;
  const stopLabel = (id: StopId) => isProject(id) ? projectLabels[id] : t.zones[id].short;

  return <main ref={main} className={styles.world} data-render={status} data-view={selection.zone === "gallery" && !gallery ? "gallery-list" : selection.zone ?? "overview"} data-testid="world"
    data-opening={showOpening} data-camera={game.mode} data-light={game.equipment.day} data-body={game.body} data-transit={game.transit ?? undefined}
    onKeyDown={keydown}>
    <header className={styles.header}>
      <a href={classicPaths[locale]} className={styles.brand} onClick={() => rememberExperience("classic")} data-world-logo="">
        <Image src="/favicon.svg" alt="" width={34} height={34} unoptimized />
        <span>bernecki<span className={styles.brandExtension}>.dev</span></span>
      </a>
      <div className={styles.headerActions}>
        <a href={contactPaths[locale]} className={styles.headerContact}>{t.contact}<ArrowUpRight size={14} strokeWidth={1.35} aria-hidden="true" /></a>
        <button type="button" ref={menuButton} className={styles.menuTrigger} aria-haspopup="dialog"
          aria-expanded={menuOpen} aria-controls="world-menu" onClick={openMenu}>{t.menu}<span className={styles.menuGlyph} aria-hidden="true" /></button>
      </div>
    </header>

    <div className={styles.experience}>
      <div ref={stage} className={styles.stage} role="region" aria-label={t.scene} aria-describedby="world-control-instructions"
        tabIndex={0} data-testid="world-stage"
        onPointerDown={event => {
          if (event.pointerType === "mouse" && event.target instanceof HTMLCanvasElement) stage.current?.focus({ preventScroll: true });
        }}>
        {showOpening && <div className={styles.observation} aria-hidden="true" />}
        <div className={styles.fallback} aria-hidden="true">
          <Image ref={poster} src="/images/world/model.webp" alt="" fill unoptimized priority fetchPriority="high" />
        </div>
        <div className={styles.canvas} ref={host} />
        {status === "ready" && <GameBeacons game={game} copy={gt} scene={scene} locale={locale} />}
        <div className={styles.hotspots} role="group" aria-label={t.places}>
          {sceneStops.map(place => (
            <button type="button" key={place.id} className={styles.hotspot}
              data-zone={place.id} data-offscreen="true" data-side={place.labelSide} aria-label={stopLabel(place.id)}
              ref={node => { markers.current[place.id] = node; }}
              tabIndex={isOverview && status === "ready" ? 0 : -1} onClick={() => selectStop(place.id)}>
              <span className={styles.hotspotDot} aria-hidden="true" />
              <span className={styles.hotspotCaption}>{stopLabel(place.id)}<ArrowUpRight size={11} strokeWidth={1.65} aria-hidden="true" /></span>
            </button>
          ))}
        </div>
      </div>

      <section ref={copyArea} className={styles.story} aria-label={activePlace?.title ?? "Bernecki World"}>
        <div className={showOpening ? styles.intro : styles.visuallyHidden}>
          {showOpening && <p className={styles.edition} data-world-reveal="">{t.explore}</p>}
          <h1 className={styles.title} aria-label="Bernecki Universe">
            <span className={styles.titleLine}><span data-world-line="">Bernecki</span></span>
            <span className={styles.titleLine}><em data-world-line="">Universe.</em></span>
          </h1>
          {showOpening && <>
            <p className={styles.introLead} data-world-reveal="">{editorial.lead}</p>
            <div className={styles.introActions} data-world-reveal="">
              {status !== "static" && <button type="button" className={styles.primary} aria-busy={status === "loading"}
                disabled={status === "loading"} onClick={() => void scene.current?.fly("system")}>
                <span>{editorial.atlas}</span><span className={styles.actionIcon}><ArrowUpRight size={17} strokeWidth={1.35} aria-hidden="true" /></span>
              </button>}
              <button type="button" className={styles.introSecondary} onClick={() => selectZone("gallery")}>
                {editorial.projects}<ArrowDown size={16} strokeWidth={1.35} aria-hidden="true" />
              </button>
            </div>
          </>}
        </div>

        {activePlace && game.mode !== "photo" && !game.transit && <div className={styles.place} data-testid="world-place">
          <div className={styles.placeTop} data-place-reveal="">
            <button type="button" className={styles.back} onClick={() => go(overview)}>
              <ChevronLeft size={17} strokeWidth={1.35} />{editorial.return}
            </button>
          </div>
          <p className={styles.kicker} data-place-reveal=""><span />{gallery ? editorial.commission : activePlace.eyebrow}</p>
          <h2 tabIndex={-1} ref={title} data-place-reveal="">{gallery?.name ?? activePlace.title}</h2>
          {gallery && <>
            <div className={styles.projectPhoto} data-place-reveal="">
              <button type="button" ref={photoTrigger} aria-haspopup="dialog" aria-controls="world-photo" aria-label={`${t.photo} — ${gallery.name}`} onClick={() => {
                photoPanel.current?.showModal();
                setPreviewOpen(true);
              }}>
                <Image key={gallery.images[photo]} src={`/images/projects/${gallery.images[photo]}`} alt={`${t.projectImage} — ${gallery.name}`} fill loading="eager" sizes="(max-width: 830px) 87vw, 360px" />
                <span className={styles.expandPhoto}><Maximize2 size={16} strokeWidth={1.6} aria-hidden="true" /></span>
              </button>
              {photoControls(styles.photoNav)}
            </div>
            <p className={styles.placeText}>{gallery.copy[locale][0]}</p>
            <div className={styles.placeLinks}>
              {gallery.site && <ActionLink href={gallery.site} primary>{t.live}</ActionLink>}
              {gallery.caseStudy[locale] && <ActionLink href={gallery.caseStudy[locale]} primary={!gallery.site}>{t.caseStudy}</ActionLink>}
              {!gallery.site && <ActionLink href={contactPaths[locale]} primary={!gallery.caseStudy[locale]}>{t.contact}</ActionLink>}
              {gallery.links?.[locale]?.map(([label, href]) => <ActionLink key={href} href={href}>{label}</ActionLink>)}
            </div>
            <h3>{t.features}</h3>
            <ul className={styles.features}>{gallery.copy[locale][1].map(feature => <li key={feature}>{feature}</li>)}</ul>
            {gallery.stack && <p className={styles.stack}><strong>{t.stack}</strong> {gallery.stack.join(" · ")}</p>}
            <div className={styles.projectNav} data-place-reveal="">
              <button type="button" className={styles.square} aria-label={t.prev} onClick={() => cycleProject(-1)}><ChevronLeft size={17} strokeWidth={1.55} /></button>
              <span aria-live="polite">{String((selection.project ?? 0) + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</span>
              <button type="button" className={styles.square} aria-label={t.next} onClick={() => cycleProject(1)}><ChevronRight size={17} strokeWidth={1.55} /></button>
            </div>
          </>}
          {!gallery && <>
            {selection.zone === "hq" && <div className={styles.portrait} data-place-reveal="">
              <Image src="/images/world/kacper-plush.webp" alt={t.portrait} width={118} height={147} sizes="92px" />
              <div><strong>Kacper Bernecki</strong><span>bernecki.dev</span></div>
            </div>}
            <p className={styles.placeText} data-place-reveal="">{selection.zone === "gallery" ? editorial.gallery : activePlace.text}</p>
            {selection.zone === "gallery" && <ul className={styles.projectList} aria-label={t.gallery} data-place-reveal="">
              {projects.map((project, i) => <li key={project.id}><button type="button" onClick={() => selectProject(i)}>
                <Image src={`/images/world/${project.id}.webp`} alt="" width={68} height={38} unoptimized />
                <strong>{project.name}</strong><ArrowUpRight size={16} strokeWidth={1.45} />
              </button></li>)}
            </ul>}
            {selection.zone === "lab" && status === "ready" && <details className={styles.serviceLog}>
              <summary>{gt.log}</summary><p>{gt.signalHint}</p>
              <button type="button" className={styles.back} onClick={() => scene.current?.portal()}>{gt.terminal}<ArrowUpRight size={15} /></button>
            </details>}
            {activePlace.links && <div className={styles.placeLinks} data-place-reveal="">{activePlace.links.map(([label, href]) => <ActionLink key={href} href={href}>{label}</ActionLink>)}</div>}
            {selection.zone === "contact" && <div className={styles.placeLinks} data-place-reveal="">
              <ActionLink href={contactPaths[locale]} primary>{t.contact}</ActionLink>
              <ActionLink href="mailto:kacper@bernecki.dev">kacper@bernecki.dev</ActionLink>
            </div>}
          </>}
        </div>}
      </section>

      <span id="world-control-instructions" className={styles.visuallyHidden}>{gt.controlsOrbit}</span>
      {showOpening && <div className={styles.controls}>
        <div className={styles.guide} data-world-reveal="">
          {status === "ready" ? <>
            <span className={styles.mouseHint}><Move size={14} strokeWidth={1.4} />{t.rotate}</span>
            <span className={styles.touchHint}><Move size={14} strokeWidth={1.4} />{t.touch}</span>
          </> : <span role="status">{status === "loading" ? t.loading : t.fallback}</span>}
        </div>
      </div>}
      {status === "ready" && <div className={gameStyles.layer}><GameHud game={game} copy={gt} scene={scene} change={changeMode} openLog={showLog} /></div>}
    </div>

    <dialog ref={menuPanel} id="world-menu" className={styles.menuPanel} aria-labelledby="world-menu-title"
      onCancel={event => { event.preventDefault(); closeMenu(); }}
      onClick={event => { if (event.target === event.currentTarget) closeMenu(); }}>
      <div className={styles.menuInner}>
        <div className={styles.menuHeading}>
          <h2 id="world-menu-title">{editorial.index}</h2>
          <button type="button" onClick={closeMenu} aria-label={t.close} className={styles.square}><X size={19} strokeWidth={1.5} /></button>
        </div>
        <nav className={styles.menuPlaces} aria-label={gt.fast}>
          <button type="button" aria-current={game.body === "home" ? "location" : undefined}
            onClick={() => { closeMenu(); if (game.body !== "home" && scene.current) void scene.current.fly("home"); else go(overview); }}
            data-testid="nav-overview">{planets.home.label}<ChevronRight size={16} strokeWidth={1.5} /></button>
          {status === "ready" && <button type="button" onClick={() => { closeMenu(); void scene.current?.fly("system"); }}>{gt.map}<ChevronRight size={16} strokeWidth={1.5} /></button>}
          <h3 className={styles.menuSection}>{gt.projects}</h3>
          {projectBodies.map(id =>
            <button type="button" key={id} aria-current={activeStop === id || game.body === id ? "location" : undefined}
              onClick={() => { closeMenu(); selectStop(id); }} data-testid={`nav-${id}`}>
                <span className={styles.navBody}><span className={styles.navPlanet} style={{ "--planet-color": `#${planets[id].colors[2].toString(16).padStart(6, "0")}` } as CSSProperties} aria-hidden="true" />{stopLabel(id)}</span>
                <ChevronRight size={16} strokeWidth={1.35} aria-hidden="true" />
              </button>
          )}
          <h3 className={styles.menuSection}>{gt.technology}</h3>
          <button type="button" onClick={() => { closeMenu(); selectStop("lab"); }} data-testid="nav-lab">{planets.ai.label}<ChevronRight size={16} strokeWidth={1.5} /></button>
          <button type="button" onClick={() => { closeMenu(); selectStop("studio"); }} data-testid="nav-studio">{stopLabel("studio")}<ChevronRight size={16} strokeWidth={1.5} /></button>
          <button type="button" onClick={() => { closeMenu(); selectStop("hq"); }} data-testid="nav-hq">{stopLabel("hq")}<ChevronRight size={16} strokeWidth={1.5} /></button>
          <button type="button" onClick={() => { closeMenu(); selectStop("contact"); }} data-testid="nav-contact">{t.contact}<ChevronRight size={16} strokeWidth={1.5} /></button>
        </nav>
        <div className={styles.menuOptions}>
          {status === "ready" && <GameMenu game={game} copy={gt} scene={scene} change={changeMode} leave={closeMenu} log={gameLog} />}
          <button type="button" onClick={() => { closeMenu(); setModeDialog(true); }}>{t.switch}</button>
          <a href={classicPaths[locale]} onClick={() => rememberExperience("classic")}>{t.classic}<ArrowUpRight size={14} strokeWidth={1.5} /></a>
          <nav aria-label={t.language} className={styles.menuLanguages}>
            {(Object.keys(worldPaths) as WorldLocale[]).map(key =>
              <a key={key} href={worldPaths[key] + selectionHash(selection)} lang={key} hrefLang={key} aria-current={key === locale ? "page" : undefined}>{localeLabels[key]}</a>)}
          </nav>
          <details>
            <summary>{t.help}</summary>
            <p>{status === "ready" ? gt.controlsOrbit : t.fallback}</p>
            {status === "ready" && game.body === "home" && <button type="button" onClick={() => {
              closeMenu();
              go(overview, false);
              scene.current?.scan();
              game.notify(gt.scanning);
            }}>{gt.scan}</button>}
            <button type="button" onClick={toggleStatic} disabled={status === "loading"}>{status === "ready" ? t.staticView : t.world3d}</button>
          </details>
          <details>
            <summary>{t.credits}</summary>
            <a href="https://www.solarsystemscope.com/textures/">Solar System Scope / NASA · CC BY 4.0</a>
            <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>
            <a href="https://tevy.dev/models/supercar">tevy · CC0</a>
            <a href="https://ambientcg.com/">ambientCG · CC0</a>
            <a href="https://polyhaven.com/a/kloppenheim_06_puresky">Poly Haven · CC0</a>
          </details>
        </div>
      </div>
    </dialog>
    {gallery && <dialog ref={photoPanel} id="world-photo" className={styles.photoPanel} aria-labelledby="world-photo-title"
      onCancel={event => { event.preventDefault(); closePhoto(); }}
      onClick={event => { if (event.target === event.currentTarget) closePhoto(); }}
      onKeyDown={event => {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
        event.preventDefault();
        cyclePhoto(event.key === "ArrowLeft" ? -1 : 1);
      }}>
      <div className={styles.photoInner}>
        <div className={styles.photoHeading}>
          <h2 id="world-photo-title">{gallery.name}</h2>
          <button type="button" className={styles.square} onClick={closePhoto} aria-label={t.close}><X size={19} strokeWidth={1.5} aria-hidden="true" /></button>
        </div>
        {previewOpen && <div className={styles.photoFrame}>
          <Image key={gallery.images[photo]} src={`/images/projects/${gallery.images[photo]}`} alt={`${t.projectImage} — ${gallery.name}`} fill loading="eager" sizes="(max-width: 830px) 94vw, 1100px" />
        </div>}
        {photoControls(styles.photoPager)}
      </div>
    </dialog>}
    <ExperienceDialog locale={locale} current="world" open={modeDialog} onClose={() => { setModeDialog(false); menuButton.current?.focus(); }} />
    <noscript><style>{`.${styles.hotspots},.${styles.menuTrigger}{display:none!important}`}</style>
      <div className={styles.noScript}><a href={contactPaths[locale]}>{t.contact}</a> · <a href={locale === "en" ? "/en/case-studies" : "/case-studies"}>{t.zones.gallery.title}</a></div>
    </noscript>
  </main>;
}
