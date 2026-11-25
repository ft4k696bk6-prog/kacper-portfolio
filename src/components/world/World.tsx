"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import Image from "next/image";
import {
  ArrowUpRight, ChevronLeft, ChevronRight, Menu, Move, X,
} from "lucide-react";
import { gsap } from "gsap";
import { classicPaths, contactPaths, copy, mapStops, projectIndex, projects, projectStops, sceneStops, worldPaths, zones, type ProjectId, type StopId, type WorldLocale, type Zone } from "./content";
import { ExperienceDialog, rememberExperience } from "./Experience";
import type { WorldController } from "./scene";
import styles from "./world.module.css";

const projectLabels: Record<ProjectId, string> = {
  reenergy: "ReEnergy", starcars: "StarCars", "isto-kebab": "Isto Kebab", "b-crm": "B-CRM", motomizer: "Motomizer", beatmarket: "BeatMarket",
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
    {children}<ArrowUpRight size={17} strokeWidth={1.55} />
  </a>;
}

export function World({ locale }: { locale: WorldLocale }) {
  const t = copy[locale];
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
  const lastTrigger = useRef<HTMLElement | null>(null);
  const current = useRef<Selection>(overview);
  const title = useRef<HTMLHeadingElement>(null);
  const gallery = selection.project !== null ? projects[selection.project] : null;
  const isOverview = selection.zone === null;
  const focusOnChange = useRef(false);

  const go = useCallback((next: Selection, focus = true) => {
    if (focus && document.activeElement instanceof HTMLElement && !copyArea.current?.contains(document.activeElement)) {
      lastTrigger.current = document.activeElement;
    }
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
            hover(id) {
              for (const zone of sceneStops) {
                const button = markers.current[zone.id];
                if (button) button.dataset.hovered = id === zone.id ? "true" : "false";
              }
            },
            select(hit) {
              if (hit.project !== undefined) selectProject(hit.project);
              else selectZone(hit.zone);
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
          controller.moveView(current.current, current.current.zone !== null, true);
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
  }, [selectProject, selectZone, staticOnly, sceneAttempt]);

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
    if (!focusOnChange.current) return;
    focusOnChange.current = false;
    if (selection.zone) {
      title.current?.focus({ preventScroll: true });
      if (window.matchMedia("(max-width: 830px)").matches) window.scrollTo({ top: 0, behavior: "instant" });
      return;
    }
    const trigger = lastTrigger.current;
    if (trigger && trigger !== document.body && trigger.isConnected) trigger.focus({ preventScroll: true });
    else menuButton.current?.focus({ preventScroll: true });
  }, [selection]);

  useEffect(() => {
    if (!selection.zone || !copyArea.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const context = gsap.context(() => {
      gsap.from("[data-testid=world-place]", { y: 12, opacity: 0, delay: 0.12, duration: 0.56, ease: "power3.out", clearProps: "transform,opacity" });
    }, copyArea.current);
    return () => context.revert();
  }, [selection]);

  useEffect(() => {
    const stop = () => scene.current?.blur();
    window.addEventListener("blur", stop);
    return () => window.removeEventListener("blur", stop);
  }, []);

  function keydown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "Escape") {
      if (modeDialog || menuOpen) return;
      if (selection.zone) go(overview);
      return;
    }
    if (modeDialog || menuOpen || event.ctrlKey || event.metaKey || event.altKey || (event.shiftKey && event.key !== "+") || event.target !== stage.current) return;
    const slot = Number(event.key) - 1;
    if (event.key.length === 1 && slot >= 0 && slot < 8) { event.preventDefault(); selectStop(mapStops[slot]); return; }
    if (event.key === "0") { event.preventDefault(); go(overview); return; }
    const steps: Record<string, [number, number]> = {
      ArrowLeft: [-0.18, 0], ArrowRight: [0.18, 0], ArrowUp: [0, -0.14], ArrowDown: [0, 0.14],
    };
    if (event.key in steps) {
      event.preventDefault();
      scene.current?.nudge(...steps[event.key]);
    } else if (["w", "a", "s", "d"].includes(event.key.toLowerCase())) {
      event.preventDefault();
      scene.current?.avatarKey(event.key.toLowerCase(), true);
    }
  }

  function toggleStatic() {
    if (status === "ready") {
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

  function openMenu() {
    menuPanel.current?.showModal();
    setMenuOpen(true);
  }

  function closeMenu() {
    menuPanel.current?.close();
    setMenuOpen(false);
    menuButton.current?.focus({ preventScroll: true });
  }
  const activePlace = selection.zone ? t.zones[selection.zone] : null;
  const activeStop = gallery?.id ?? selection.zone;
  const stopLabel = (id: StopId) => isProject(id) ? projectLabels[id] : t.zones[id].short;

  return <main ref={main} className={styles.world} data-render={status} data-view={selection.zone === "gallery" && !gallery ? "gallery-list" : selection.zone ?? "overview"} data-testid="world"
    onKeyDown={keydown} onKeyUp={event => scene.current?.avatarKey(event.key.toLowerCase(), false)}>
    <header className={styles.header}>
      <a href={classicPaths[locale]} className={styles.brand} onClick={() => rememberExperience("classic")} data-world-logo="">
        <Image src="/favicon.svg" alt="" width={34} height={34} unoptimized />
        <span>bernecki<span className={styles.brandExtension}>.dev</span></span>
      </a>
      <button type="button" ref={menuButton} className={styles.menuTrigger} aria-haspopup="dialog"
        aria-expanded={menuOpen} aria-controls="world-menu" onClick={openMenu}>{t.menu}<Menu size={20} strokeWidth={1.45} /></button>
    </header>

    <div className={styles.experience}>
      <div ref={stage} className={styles.stage} role="region" aria-label={t.scene} aria-describedby="world-control-instructions"
        tabIndex={0} onBlur={() => scene.current?.blur()} data-testid="world-stage"
        onPointerDown={event => {
          if (event.pointerType === "mouse" && event.target instanceof HTMLCanvasElement) stage.current?.focus({ preventScroll: true });
        }}>
        <div className={styles.fallback} aria-hidden="true">
          <Image ref={poster} src="/images/world/model.webp" alt="" fill unoptimized priority fetchPriority="high" />
        </div>
        <div className={styles.canvas} ref={host} />
        <div className={styles.hotspots} aria-label={t.places}>
          {sceneStops.map(place => (
            <button type="button" key={place.id} className={styles.hotspot}
              data-zone={place.id} data-side={place.labelSide} aria-label={stopLabel(place.id)}
              ref={node => { markers.current[place.id] = node; }}
              tabIndex={isOverview && status === "ready" ? 0 : -1} onClick={() => selectStop(place.id)}>
              <span className={styles.hotspotDot} aria-hidden="true" />
              <span className={styles.hotspotCaption}>{stopLabel(place.id)}<ArrowUpRight size={11} strokeWidth={1.65} aria-hidden="true" /></span>
            </button>
          ))}
        </div>
      </div>

      <section ref={copyArea} className={styles.story} aria-label={activePlace?.title ?? "Bernecki World"}>
        <div className={isOverview ? styles.intro : styles.visuallyHidden}>
          <h1 className={styles.title} aria-label="Bernecki World"><span data-world-line="">Bernecki <em>World.</em></span></h1>
        </div>

        {activePlace && <div className={styles.place} data-testid="world-place">
          <div className={styles.placeTop} data-place-reveal="">
            <button type="button" className={styles.back} onClick={() => go(overview)}>
              <ChevronLeft size={16} strokeWidth={1.6} />{t.overview}
            </button>
          </div>
          {!gallery && <p className={styles.kicker} data-place-reveal=""><span />{activePlace.eyebrow}</p>}
          <h2 tabIndex={-1} ref={title} data-place-reveal="">{gallery?.name ?? activePlace.title}</h2>
          {gallery && <>
            <div className={styles.projectNav} data-place-reveal="">
              <button type="button" className={styles.square} aria-label={t.prev} onClick={() => cycleProject(-1)}><ChevronLeft size={17} strokeWidth={1.55} /></button>
              <span aria-live="polite">{String((selection.project ?? 0) + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</span>
              <button type="button" className={styles.square} aria-label={t.next} onClick={() => cycleProject(1)}><ChevronRight size={17} strokeWidth={1.55} /></button>
            </div>
            <div className={styles.projectPhoto} data-place-reveal="">
              <a href={`/images/projects/${gallery.images[photo]}`} target="_blank" rel="noopener noreferrer" aria-label={`${t.photo} — ${gallery.name}`}>
                <Image key={gallery.images[photo]} src={`/images/projects/${gallery.images[photo]}`} alt={`${t.projectImage} — ${gallery.name}`} fill sizes="(max-width: 830px) 87vw, 360px" />
              </a>
              {gallery.images.length > 1 && <div className={styles.photoNav}>
                <button type="button" aria-label={t.prevPhoto} onClick={() => setPhoto(value => (value - 1 + gallery.images.length) % gallery.images.length)}><ChevronLeft size={16} /></button>
                <span aria-live="polite">{photo + 1} / {gallery.images.length}</span>
                <button type="button" aria-label={t.nextPhoto} onClick={() => setPhoto(value => (value + 1) % gallery.images.length)}><ChevronRight size={16} /></button>
              </div>}
            </div>
            <p className={styles.placeText}>{gallery.copy[locale][0]}</p>
            <div className={styles.placeLinks}>
              <ActionLink href={gallery.site} primary>{t.live}</ActionLink>
              {gallery.caseStudy[locale] && <ActionLink href={gallery.caseStudy[locale]}>{t.caseStudy}</ActionLink>}
              {gallery.links?.[locale]?.map(([label, href]) => <ActionLink key={href} href={href}>{label}</ActionLink>)}
            </div>
            <h3>{t.features}</h3>
            <ul className={styles.features}>{gallery.copy[locale][1].map(feature => <li key={feature}>{feature}</li>)}</ul>
            {gallery.stack && <p className={styles.stack}><strong>{t.stack}</strong> {gallery.stack.join(" · ")}</p>}
          </>}
          {!gallery && <>
            {selection.zone === "hq" && <div className={styles.portrait} data-place-reveal="">
              <Image src="/images/world/kacper-plush.webp" alt={t.portrait} width={118} height={147} sizes="92px" />
              <div><strong>Kacper Bernecki</strong><span>bernecki.dev</span></div>
            </div>}
            <p className={styles.placeText} data-place-reveal="">{activePlace.text}</p>
            {selection.zone === "gallery" && <ul className={styles.projectList} aria-label={t.gallery} data-place-reveal="">
              {projects.map((project, i) => <li key={project.id}><button type="button" onClick={() => selectProject(i)}>
                <Image src={`/images/world/${project.id}.webp`} alt="" width={68} height={38} unoptimized />
                <strong>{project.name}</strong><ArrowUpRight size={16} strokeWidth={1.45} />
              </button></li>)}
            </ul>}
            {activePlace.links && <div className={styles.placeLinks} data-place-reveal="">{activePlace.links.map(([label, href]) => <ActionLink key={href} href={href}>{label}</ActionLink>)}</div>}
            {selection.zone === "contact" && <div className={styles.placeLinks} data-place-reveal="">
              <ActionLink href={contactPaths[locale]} primary>{t.contact}</ActionLink>
              <ActionLink href="mailto:kacper@bernecki.dev">kacper@bernecki.dev</ActionLink>
            </div>}
          </>}
        </div>}
      </section>

      <div className={styles.controls}>
        <div className={styles.guide} id="world-control-instructions" data-world-reveal="">
          <span className={styles.visuallyHidden}>{t.keyboard}</span>
          {status === "ready" ? <>
            <span className={styles.mouseHint}><Move size={14} strokeWidth={1.4} />{t.rotate}</span>
            <span className={styles.touchHint}><Move size={14} strokeWidth={1.4} />{t.touch}</span>
          </> : <span role="status">{status === "loading" ? t.loading : t.fallback}</span>}
        </div>
      </div>
    </div>

    <dialog ref={menuPanel} id="world-menu" className={styles.menuPanel} aria-labelledby="world-menu-title"
      onCancel={event => { event.preventDefault(); closeMenu(); }}
      onClick={event => { if (event.target === event.currentTarget) closeMenu(); }}>
      <div className={styles.menuInner}>
        <div className={styles.menuHeading}>
          <h2 id="world-menu-title">{t.places}</h2>
          <button type="button" onClick={closeMenu} aria-label={t.close} className={styles.square}><X size={19} strokeWidth={1.5} /></button>
        </div>
        <nav className={styles.menuPlaces} aria-label={t.places}>
          <button type="button" aria-current={isOverview ? "location" : undefined}
            onClick={() => { closeMenu(); go(overview); }} data-testid="nav-overview">{t.overview}<ChevronRight size={16} strokeWidth={1.5} /></button>
          {mapStops.filter(id => id !== "gallery").map(id =>
            <button type="button" key={id} aria-current={activeStop === id ? "location" : undefined}
              onClick={() => { closeMenu(); selectStop(id); }} data-testid={`nav-${id}`}>{stopLabel(id)}<ChevronRight size={16} strokeWidth={1.5} /></button>
          )}
        </nav>
        <div className={styles.menuOptions}>
          <button type="button" onClick={() => { closeMenu(); setModeDialog(true); }}>{t.switch}</button>
          <a href={classicPaths[locale]} onClick={() => rememberExperience("classic")}>{t.classic}<ArrowUpRight size={14} strokeWidth={1.5} /></a>
          <nav aria-label={t.language} className={styles.menuLanguages}>
            {(Object.keys(worldPaths) as WorldLocale[]).map(key =>
              <a key={key} href={worldPaths[key] + selectionHash(selection)} lang={key} hrefLang={key} aria-current={key === locale ? "page" : undefined}>{localeLabels[key]}</a>)}
          </nav>
          <details>
            <summary>{t.help}</summary>
            <p>{status === "ready" ? t.keyboard : t.fallback}</p>
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
    <ExperienceDialog locale={locale} current="world" open={modeDialog} onClose={() => { setModeDialog(false); menuButton.current?.focus(); }} />
    <noscript><style>{`.${styles.hotspots},.${styles.menuTrigger}{display:none!important}`}</style>
      <div className={styles.noScript}><a href={contactPaths[locale]}>{t.contact}</a> · <a href={locale === "en" ? "/en/case-studies" : "/case-studies"}>{t.zones.gallery.title}</a></div>
    </noscript>
  </main>;
}
