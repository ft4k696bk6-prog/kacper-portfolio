"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import Image from "next/image";
import {
  ArrowDownRight, ArrowUpRight, Box, Building2, ChevronLeft, ChevronRight, CircleHelp, Code2,
  Compass, Cpu, Globe2, Images, Mail, Minus, Mouse, Move, Plus, RotateCcw, ScanLine, X,
} from "lucide-react";
import { gsap } from "gsap";
import { classicPaths, contactPaths, copy, projects, worldPaths, zones, type WorldLocale, type Zone } from "./content";
import { ExperienceDialog, rememberExperience } from "./Experience";
import type { WorldController } from "./scene";
import styles from "./world.module.css";

const icons = { hq: Building2, gallery: Images, studio: Code2, lab: Cpu, contact: Mail };
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
  const [help, setHelp] = useState(false);
  const [language, setLanguage] = useState(false);
  const [staticOnly, setStaticOnly] = useState(false);
  const [sceneAttempt, setSceneAttempt] = useState(0);
  const stage = useRef<HTMLDivElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const compass = useRef<SVGSVGElement>(null);
  const scene = useRef<WorldController | null>(null);
  const main = useRef<HTMLElement>(null);
  const copyArea = useRef<HTMLElement>(null);
  const markers = useRef<Partial<Record<Zone, HTMLButtonElement | null>>>({});
  const modeButton = useRef<HTMLButtonElement>(null);
  const resetButton = useRef<HTMLButtonElement>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);
  const current = useRef<Selection>(overview);
  const langMenu = useRef<HTMLDivElement>(null);
  const langButton = useRef<HTMLButtonElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const helpButton = useRef<HTMLButtonElement>(null);
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
    // The route and static model paint before Three.js is requested.
    const paint = requestAnimationFrame(() => {
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
              marker.dataset.offscreen = visible ? "false" : "true";
            },
            rotate(angle) { compass.current?.style.setProperty("--bearing", `${angle * -180 / Math.PI + 38}deg`); },
            hover(id) {
              for (const zone of zones) {
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
    else resetButton.current?.focus({ preventScroll: true });
  }, [selection]);

  useEffect(() => {
    if (!selection.zone || !copyArea.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const context = gsap.context(() => {
      gsap.from("[data-place-reveal]", { y: 8, opacity: 0, duration: 0.43, stagger: 0.045, ease: "power3.out", clearProps: "transform,opacity" });
    }, copyArea.current);
    return () => context.revert();
  }, [selection]);

  useEffect(() => {
    if (!language) return;
    const close = (event: PointerEvent) => {
      if (!langMenu.current?.contains(event.target as Node)) setLanguage(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [language]);

  useEffect(() => {
    const stop = () => scene.current?.blur();
    window.addEventListener("blur", stop);
    return () => window.removeEventListener("blur", stop);
  }, []);

  function keydown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "Escape") {
      if (modeDialog) return;
      if (language) { setLanguage(false); langButton.current?.focus(); return; }
      if (help) { setHelp(false); helpButton.current?.focus(); return; }
      if (selection.zone) go(overview);
      return;
    }
    if (modeDialog || event.ctrlKey || event.metaKey || event.altKey || (event.shiftKey && event.key !== "+") || event.target !== stage.current) return;
    const slot = ["1", "2", "3", "4", "5"].indexOf(event.key);
    if (slot !== -1) { event.preventDefault(); selectZone(zones[slot].id); return; }
    if (event.key === "0") { event.preventDefault(); go(overview); return; }
    const steps: Record<string, [number, number, number]> = {
      ArrowLeft: [-0.16, 0, 1], ArrowRight: [0.16, 0, 1], ArrowUp: [0, -0.12, 1], ArrowDown: [0, 0.12, 1],
      "+": [0, 0, 1.2], "=": [0, 0, 1.2], "-": [0, 0, 1 / 1.2],
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

  const statusLabel = status === "ready" ? t.world3d : status === "loading" ? t.loading : t.staticView;
  const activePlace = selection.zone ? t.zones[selection.zone] : null;
  const activeNumber = zones.findIndex(zone => zone.id === selection.zone) + 1;

  return <main ref={main} className={styles.world} data-render={status} data-view={selection.zone ?? "overview"} data-testid="world"
    onKeyDown={keydown} onKeyUp={event => scene.current?.avatarKey(event.key.toLowerCase(), false)}>
    <header className={styles.header}>
      <a href={classicPaths[locale]} className={styles.brand} onClick={() => rememberExperience("classic")} data-world-logo="">
        <Image src="/favicon.svg" alt="" width={34} height={34} unoptimized />
        <span>bernecki<span className={styles.brandExtension}>.dev</span></span>
      </a>
      <div className={styles.headerMode}>
        <button type="button" className={styles.mode} ref={modeButton} onClick={() => setModeDialog(true)} aria-haspopup="dialog">
          <Box size={14} strokeWidth={1.5} /><span>{t.interactive}</span><ChevronRight size={13} strokeWidth={1.6} />
          <span className={styles.visuallyHidden}> / {t.switch}</span>
        </button>
      </div>
      <div className={styles.headerActions}>
        <div className={styles.lang} ref={langMenu}>
          <button type="button" ref={langButton} aria-expanded={language} aria-controls="world-languages" aria-label={t.language}
            onClick={() => setLanguage(open => !open)}><Globe2 size={15} strokeWidth={1.5} />{locale.toUpperCase()}</button>
          <div className={styles.langMenu} id="world-languages" hidden={!language}>
            {(Object.keys(worldPaths) as WorldLocale[]).map(key =>
              <a key={key} href={worldPaths[key] + selectionHash(selection)} lang={key} hrefLang={key} aria-current={key === locale ? "page" : undefined}>{localeLabels[key]}</a>)}
          </div>
        </div>
        <a href={contactPaths[locale]} className={styles.contactTop} aria-current={selection.zone === "contact" ? "location" : undefined}
          onClick={event => {
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            event.preventDefault();
            selectZone("contact");
          }}>{t.contact}<ArrowUpRight size={15} strokeWidth={1.6} /></a>
      </div>
    </header>

    <div className={styles.experience}>
      <div ref={stage} className={styles.stage} role="region" aria-label={t.scene} aria-describedby="world-control-instructions"
        tabIndex={0} onBlur={() => scene.current?.blur()} data-testid="world-stage"
        onPointerDown={event => {
          if (event.pointerType === "mouse" && event.target instanceof HTMLCanvasElement) stage.current?.focus({ preventScroll: true });
        }}>
        <div className={styles.fallback} aria-hidden="true">
          <Image src="/images/world/model.webp" alt="" fill unoptimized priority />
        </div>
        <div className={styles.canvas} ref={host} />
        <div className={styles.hotspots} aria-label={t.places}>
          {zones.map((place, i) => (
            <button type="button" key={place.id} className={styles.hotspot}
              data-zone={place.id} data-side={place.labelSide} data-selected={selection.zone === place.id}
              ref={node => { markers.current[place.id] = node; }}
              aria-label={t.zones[place.id].title} tabIndex={isOverview ? 0 : -1}
              onClick={() => selectZone(place.id)}>
              <span className={styles.hotspotDot} aria-hidden="true" />
              <span className={styles.hotspotCaption} aria-hidden="true"><small>{String(i + 1).padStart(2, "0")}</small>{t.zones[place.id].short}<ArrowUpRight size={11} strokeWidth={1.65} /></span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.compass}>
        <button type="button" ref={resetButton} onClick={() => go(overview)} aria-label={t.reset} title={t.reset}>
          <span className={styles.north} aria-hidden="true">N</span><Compass ref={compass} size={31} strokeWidth={1.03} />
        </button>
      </div>

      <section ref={copyArea} className={styles.story} aria-label={activePlace?.title ?? "Bernecki World"}>
        <div className={isOverview ? styles.intro : styles.visuallyHidden}>
          <p className={styles.kicker} data-world-reveal=""><span />{t.explore}</p>
          <h1 className={styles.title} aria-label="Bernecki World"><span><span data-world-line="">Bernecki</span></span><span><span data-world-line="">World<span>.</span></span></span></h1>
          <p className={styles.description} data-world-reveal="">{t.description}</p>
          <button type="button" className={styles.primary} hidden={!isOverview} onClick={() => selectZone("gallery")} data-world-reveal="">{t.enter}<ArrowDownRight size={19} strokeWidth={1.7} /></button>
        </div>

        {activePlace && <div className={styles.place} data-testid="world-place">
          <div className={styles.placeTop} data-place-reveal="">
            <button type="button" className={styles.back} onClick={() => gallery ? selectZone("gallery") : go(overview)}>
              <ChevronLeft size={16} strokeWidth={1.6} />{gallery ? t.zones.gallery.short : t.overview}
            </button>
            <button type="button" className={styles.square} aria-label={t.close} onClick={() => go(overview)}><X size={17} strokeWidth={1.5} /></button>
          </div>
          <p className={styles.kicker} data-place-reveal=""><span />{String(activeNumber).padStart(2, "0")} / {activePlace.eyebrow}</p>
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
            </div>
            <h3>{t.features}</h3>
            <ul className={styles.features}>{gallery.copy[locale][1].map(feature => <li key={feature}>{feature}</li>)}</ul>
            {gallery.stack && <p className={styles.stack}><strong>{t.stack}</strong> {gallery.stack.join(" · ")}</p>}
          </>}
          {!gallery && <>
            {selection.zone === "hq" && <div className={styles.portrait} data-place-reveal="">
              <Image src="/images/profile-3-cutout.png" alt={t.portrait} width={78} height={85} sizes="78px" />
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
        <div className={styles.guide} id="world-control-instructions">
          <span className={styles.visuallyHidden}>{t.keyboard}</span>
          {status === "ready" ? <>
            <span className={styles.mouseHint}><Move size={14} strokeWidth={1.4} />{t.rotate}</span>
            <span className={styles.mouseHint}><Mouse size={14} strokeWidth={1.4} />{t.zoom}</span>
            <span className={styles.touchHint}><Move size={14} strokeWidth={1.4} />{t.touch}</span>
          </> : <span role="status">{status === "loading" ? t.loading : t.fallback}</span>}
        </div>
        <div className={styles.tools}>
          {status === "ready" && <>
            <button type="button" className={styles.square} aria-label={t.zoomIn} title={t.zoomIn} onClick={() => scene.current?.nudge(0, 0, 1.2)}><Plus size={17} strokeWidth={1.5} /></button>
            <button type="button" className={styles.square} aria-label={t.zoomOut} title={t.zoomOut} onClick={() => scene.current?.nudge(0, 0, 1 / 1.2)}><Minus size={17} strokeWidth={1.5} /></button>
          </>}
          <button type="button" className={styles.square} aria-label={t.reset} title={t.reset} onClick={() => go(overview)}><RotateCcw size={16} strokeWidth={1.5} /></button>
          <button type="button" ref={helpButton} className={styles.square} aria-expanded={help} aria-controls="world-help" aria-label={t.help} title={t.help} onClick={() => setHelp(value => !value)}><CircleHelp size={16} strokeWidth={1.5} /></button>
          <div className={styles.help} id="world-help" hidden={!help}>
            <strong>{t.help}</strong><p>{status === "ready" ? t.keyboard : t.fallback}</p>
            <button type="button" onClick={toggleStatic} disabled={status === "loading"}>{status === "ready" ? t.staticView : t.world3d}</button>
          </div>
        </div>
      </div>
    </div>

    <footer className={styles.footer}>
      <div className={styles.mapMeta}>
        <span><i />{t.places}</span>
        <span aria-live="polite">{statusLabel}</span>
      </div>
      <nav className={styles.map} aria-label={t.places}>
        <button type="button" aria-pressed={isOverview} onClick={() => go(overview)} data-testid="nav-overview">
          <ScanLine size={20} strokeWidth={1.45} /><span><small>00</small><strong>{t.overview}</strong></span>
          <ArrowUpRight className={styles.mapArrow} size={14} strokeWidth={1.45} />
        </button>
        {zones.map((zone, i) => {
          const Icon = icons[zone.id];
          return <button type="button" key={zone.id} aria-pressed={selection.zone === zone.id} onClick={() => selectZone(zone.id)} data-testid={`nav-${zone.id}`}>
            <Icon size={20} strokeWidth={1.45} /><span><small>{String(i + 1).padStart(2, "0")}</small><strong>{t.zones[zone.id].short}</strong></span>
            <ArrowUpRight className={styles.mapArrow} size={14} strokeWidth={1.45} />
          </button>;
        })}
      </nav>
      <div className={styles.footerEnd}>
        <a href={classicPaths[locale]} onClick={() => rememberExperience("classic")}>{t.classic}<ArrowUpRight size={13} strokeWidth={1.55} /></a>
        <span>BERNECKI.DEV</span>
      </div>
    </footer>
    <ExperienceDialog locale={locale} current="world" open={modeDialog} onClose={() => { setModeDialog(false); modeButton.current?.focus(); }} />
    <noscript><style>{`.${styles.hotspots},.${styles.tools},.${styles.headerMode},.${styles.lang},.${styles.compass},.${styles.primary}[data-world-reveal],.${styles.map}{display:none!important}`}</style>
      <div className={styles.noScript}><a href={contactPaths[locale]}>{t.contact}</a> · <a href={locale === "en" ? "/en/case-studies" : "/case-studies"}>{t.zones.gallery.title}</a></div>
    </noscript>
  </main>;
}
