import * as T from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { gsap } from "gsap";
import { projects, zones, type Zone, type StopId } from "./content";
import { buildModel, type Hit } from "./model";
import { loadLighting } from "./lighting";
import { globeDirection, loadPlanet, type SurfaceStop } from "./globe";
import { shapeTerrain, surfaceRadius, terrainFinish } from "./terrain";
import { createPlay, type Beacon } from "./play";
import { makeUniverse } from "./universe";
import { clearancePose, flightPath, safeDirection, spheres, systemAxis } from "./cameraFlight";
import { isSecretBody, planets, systemDistance } from "./planets";
import type { Body, CameraMode, Destination, FindId } from "./discoveries";
import type { ProjectScene } from "./planetScene";
import { observatoryDirection } from "./worldLife";
import { planetLod } from "./planetLod";

type View = { zone: Zone | null; project: number | null };
type Callbacks = {
  marker: (id: StopId, x: number, y: number, visible: boolean) => void;
  select: (hit: Hit) => void;
  lost: () => void;
  rendered: () => void;
  found: (id: FindId) => void;
  beacon: (id: Beacon, x: number, y: number, visible: boolean) => void;
  planet: (id: Body, x: number, y: number, visible: boolean) => void;
  arrived: (body: Destination) => void;
  traveling: (body: Destination | null, keepPanel?: boolean) => void;
  moonRevealed: () => void;
  interrupted: (previous: View, failed: boolean) => void;
};
type Pose = { target: T.Vector3; eye: T.Vector3 };
const homeOrbit = globeDirection(-25, -4);
const heading = new T.Vector3(.54, .32, .78).normalize();
const fov = T.MathUtils.degToRad(36) / 2;
const origin = new T.Vector3();

export async function createWorld(host: HTMLElement, callbacks: Callbacks, signal: AbortSignal) {
  const compact = host.clientWidth < 590 || window.matchMedia("(pointer: coarse)").matches;
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const canvas = document.createElement("canvas");
  const options: WebGLContextAttributes = { alpha: true, antialias: false, powerPreference: "high-performance" };
  const gl = canvas.getContext("webgl2", options);
  if (!(gl instanceof WebGL2RenderingContext)) throw new Error("WebGL 2 is unavailable");
  const info = gl.getExtension("WEBGL_debug_renderer_info");
  const software = !!info && /swiftshader|llvmpipe|softpipe|software/i.test(gl.getParameter(info.UNMASKED_RENDERER_WEBGL));
  const low = compact || software;
  const environment = low ? null : await loadLighting(signal).catch(() => null);
  if (signal.aborted) { environment?.dispose(); signal.throwIfAborted(); }
  const renderer = new T.WebGLRenderer({ ...options, canvas, context: gl });
  renderer.setClearColor(0x181b28, 0);
  renderer.outputColorSpace = T.SRGBColorSpace;
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  canvas.setAttribute("aria-hidden", "true");
  canvas.dataset.renderer = software ? "software" : "hardware";
  host.appendChild(canvas);
  const scene = new T.Scene();
  scene.environment = environment;
  scene.environmentIntensity = .55;
  const camera = new T.PerspectiveCamera(36, 1, .20, 2300);
  const controls = new OrbitControls(camera, canvas);
  controls.enablePan = false;
  controls.enableZoom = true;
  controls.zoomSpeed = .79;
  controls.rotateSpeed = .60;
  controls.enableDamping = !motion.matches;
  controls.dampingFactor = software ? .18 : .095;
  controls.mouseButtons = { LEFT: T.MOUSE.ROTATE, MIDDLE: T.MOUSE.DOLLY, RIGHT: T.MOUSE.ROTATE };
  controls.touches = { ONE: T.TOUCH.ROTATE, TWO: T.TOUCH.DOLLY_ROTATE };
  const ambient = new T.HemisphereLight(0xf2f5ff, 0x586581, 1.32);
  const sun = new T.DirectionalLight(0xffe6c8, 2.18);
  const fill = new T.DirectionalLight(0xb5d6ff, .56);
  sun.position.set(38, 49, 44);
  fill.position.set(-15, 17, -31);
  scene.add(ambient, sun, sun.target, fill, fill.target);
  renderer.shadowMap.enabled = !low;
  renderer.shadowMap.type = T.PCFShadowMap;
  renderer.shadowMap.autoUpdate = false;
  sun.castShadow = !low;
  sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, { left: -32, right: 32, top: 32, bottom: -32, near: .5, far: 128 });
  sun.shadow.normalBias = .08;
  sun.shadow.bias = -.00015;
  sun.shadow.intensity = .62;

  const planet = loadPlanet(software, low, terrainFinish(low));
  shapeTerrain(planet.sphere);
  const home = buildModel(low, software, new Set<SurfaceStop>(["hq", "studio"]));
  scene.add(planet.group, home.group);
  const universe = makeUniverse(low);
  scene.add(universe.group, universe.stars);
  const play = createPlay(scene, low, {
    found: callbacks.found,
    voyage(destination) { void fly(destination); },
    observatory() { revealMoon(); void fly("system"); },
  });
  const surfaces = new WeakMap<T.Object3D, ReturnType<typeof planetLod>>();
  const homeSurface = [planet.group, home.group, play.homeSurface];
  const bounds = new T.Vector2();
  const measured = new T.Vector2();
  const v = new T.Vector3(), center = new T.Vector3(), projected = new T.Vector3(), radial = new T.Vector3(), offset = new T.Vector3();
  const originRay = new T.Vector2();
  const cast = new T.Raycaster(), sphere = new T.Sphere(), rayPoint = new T.Vector3();
  let body: Body | null = "home";
  let detail: ProjectScene | undefined;
  let mode: CameraMode = "planet";
  let poseView: View = { zone: null, project: null };
  let quality: "auto" | "economy" | "high" = "auto";
  let day: "cycle" | "day" | "night" = "cycle";
  let auto = false;
  let fx = true;
  let nearShowroom = false;
  let moonKnown = false, unknown = false, garage = false;
  let previous = 0, worldTime = 0, pending = 0, timer = 0, flightToken = 0;
  let engineDpr = 1, fastBudget = !software, slow = 0;
  let started = false, disposed = false, lost = false, dragging = false, ready = false, flying = false;
  let flight: { tween: gsap.core.Tween; start: number; duration: number; progress: number; maxStep: number; finish: () => void } | undefined;
  let action: (() => void) | undefined;
  let press: { x: number; y: number; id: number } | undefined;
  let previewPrepared: ProjectScene | undefined;
  let resetArrival: (() => void) | undefined;

  function redraw() {
    if (started && !disposed && !lost && !document.hidden && !pending) pending = requestAnimationFrame(frame);
  }
  function normalOf(id: Body) {
    if (id === "home") return homeOrbit.clone();
    if (id === "moon" || id === "garage") return globeDirection(19, 26);
    if (id === "signal") return globeDirection(17, -28);
    const look = {
      starcars: [.89, .43, .16], reenergy: [.12, .63, .77], "b-crm": [.78, .55, .30],
      ai: [.22, .43, .88], beatmarket: [.85, .23, .47], motomizer: [.77, .32, .34], "isto-kebab": [.25, .65, .73], jalapeno: [.72,.53,.48],
    } as const;
    return new T.Vector3(...look[id]).normalize();
  }
  function focusOf(id: Body, view?: View, prepared = detail): Pose {
    const point = new T.Vector3(...planets[id].center);
    const radius = planets[id].radius;
    const factor = Math.min(camera.aspect, 1);
    if (view?.project !== null && view?.project !== undefined || view?.zone === "lab") {
      if (prepared) {
        const target = prepared.focus.clone();
        const direction = prepared.viewDirection;
        return { target, eye: target.clone().addScaledVector(direction, prepared.viewDistance / Math.max(.72, factor)) };
      }
    }
    if (id === "home" && (view?.zone === "hq" || view?.zone === "studio")) {
      const s = home.sites[view.zone];
      const headquarters = view.zone === "hq";
      const target = headquarters ? new T.Vector3(-.14, 1.80, 2.19) : new T.Vector3(...zones.find(zone => zone.id === view.zone)!.target);
      const direction = s.normal.clone().addScaledVector(s.south, headquarters ? 1.23 : .77).normalize();
      target.applyMatrix4(s.matrix);
      return { target, eye: target.clone().addScaledVector(direction, (headquarters ? 13.4 : 10.8) / Math.max(.62, factor)) };
    }
    const framing = compact ? .84 : id === "home" ? .87 : .80;
    const distance = (radius * 1.08) / Math.sin(Math.atan(Math.tan(fov) * factor * framing));
    const direction = safeDirection(id, normalOf(id), distance);
    return { target: point, eye: point.clone().addScaledVector(direction, distance) };
  }
  function mapPose(width = bounds.x, height = bounds.y): Pose {
    // The camera remains in front of the orbital plane. Narrow screens use depth rather than smaller hit targets.
    const aspect = width / height;
    const portrait = aspect < .77;
    const short = portrait && height < 725;
    const target = new T.Vector3(portrait ? short ? -20 : -7 : 6, 0, 0);
    const span = portrait ? 106 : 153;
    const distance = Math.max(short ? 640 : systemDistance, span / (Math.tan(fov) * Math.min(1, aspect)));
    return { target, eye: target.clone().addScaledVector(systemAxis, distance) };
  }
  function setUp(id: Body | null) {
    if (!id && camera.aspect < .77) camera.up.set(1, 0, 0);
    else camera.up.set(0, 1, 0);
  }
  function setControls(focus: boolean) {
    controls.enabled = !flying;
    controls.enableDamping = !motion.matches;
    if (body) {
      controls.minAzimuthAngle = -Infinity; controls.maxAzimuthAngle = Infinity;
      controls.minPolarAngle = .045; controls.maxPolarAngle = Math.PI - .045;
      controls.minDistance = focus ? 2.3 : planets[body].radius + 1.15;
      controls.maxDistance = Math.max(planets[body].radius * 8, focusOf(body).target.distanceTo(focusOf(body).eye) * 1.24);
    } else {
      controls.minAzimuthAngle = -.36; controls.maxAzimuthAngle = .36;
      controls.minPolarAngle = 1.24; controls.maxPolarAngle = 1.77;
      controls.minDistance = Math.max(365, mapPose().eye.length() * .79);
      controls.maxDistance = 1800;
    }
  }
  function setPose(pose: Pose) {
    controls.target.copy(pose.target);
    camera.position.copy(pose.eye);
    camera.lookAt(pose.target);
  }
  function keepOutside(eye = camera.position) {
    if (!body) { clearancePose(eye, null); return; }
    if (!eye.lengthSq()) eye.copy(heading);
    play.bodyFocus(body, center);
    radial.copy(eye).sub(center).normalize();
    const activeBounds = body === "home" ? play.bounds : detail?.bounds ?? [];
    let minHeight = 1.08;
    for (const patch of activeBounds) if (radial.angleTo(patch.normal) < patch.radius + .02) minHeight = Math.max(minHeight, patch.height + .7);
    if (body === "home") {
      for (const site of [home.sites.hq, home.sites.studio]) if (radial.dot(site.normal) > .985) minHeight = Math.max(minHeight, 5.15);
      minHeight += Math.max(0, surfaceRadius(radial) - planets.home.radius);
    }
    if (isSecretBody(body)) minHeight = 1.85;
    clearancePose(eye, body, minHeight);
  }
  function placeLight() {
    play.bodyFocus(body, center);
    sun.position.copy(center).add(new T.Vector3(38, 49, 44));
    fill.position.copy(center).add(new T.Vector3(-15, 17, -31));
    sun.target.position.copy(center);
    fill.target.position.copy(center);
    renderer.shadowMap.needsUpdate = true;
  }
  function show() {
    home.group.visible = planet.group.visible = body === "home";
    if (detail) detail.root.visible = !!body && body !== "home" && !isSecretBody(body);
    play.setBody(body);
    universe.show(body === null || flying, body, moonKnown, unknown, garage);
  }
  function coords(point: T.Vector3 | null, report: (x: number, y: number, on: boolean) => void) {
    if (!point || mode === "photo" || flying) { report(0, 0, false); return; }
    projected.copy(point).project(camera);
    report((projected.x * .5 + .5) * bounds.x, (.5 - projected.y * .5) * bounds.y,
      Math.abs(projected.x) <= .935 && Math.abs(projected.y) <= .91 && Math.abs(projected.z) <= 1);
  }
  function projectMarkers() {
    for (const { key } of spheres) {
      const point = !body && universe.marker(key);
      coords(point || null, (x, y, on) => callbacks.planet(key, x, y, on));
    }
    const hq = body === "home" && !poseView.zone ? v.copy(home.avatar.position).add(new T.Vector3(0, 2.3, 0)).applyMatrix4(home.sites.hq.matrix) : null;
    coords(hq && v.dot(camera.position.clone().sub(v)) > 0 ? hq : null, (x, y, on) => callbacks.marker("hq", x, y, on));
    const marker = detail?.marker;
    play.bodyFocus(body, center);
    const front = marker && radial.copy(marker).sub(center).dot(offset.copy(camera.position).sub(marker)) > 0;
    coords(front && !poseView.zone ? marker! : null, (x, y, on) => callbacks.beacon("landmark", x, y, on));
    play.projectBeacons(camera, (id, point) => coords(point, (x, y, on) => callbacks.beacon(id, x, y, on)));
    if (!body) coords(universe.visitor, (x, y, on) => callbacks.beacon("ufo", x, y, on));
    coords(body === "home" && moonKnown ? universe.marker("moon") : null, (x, y, on) => callbacks.beacon("moon", x, y, on));
    // Keep a keyboard equivalent near each project artifact, alongside direct raycast interaction.
    action = undefined;
    if (detail && !poseView.zone && !flying) {
      let nearest = Infinity, anchor: T.Vector3 | null = null;
      for (const item of detail.interactive) {
        item.root.getWorldPosition(v);
        if (radial.copy(v).sub(center).dot(offset.copy(camera.position).sub(v)) <= 0) continue;
        const distance = v.distanceToSquared(camera.position);
        if (distance > nearest || distance > 23 ** 2) continue;
        projected.copy(v).project(camera);
        if (Math.abs(projected.x) > .80 || Math.abs(projected.y) > .78 || Math.abs(projected.z) > 1) continue;
        nearest = distance;
        anchor = v.clone();
        action = item.action;
      }
      coords(anchor, (x, y, on) => callbacks.beacon("nearby", x, y, on));
    }
  }
  function resize() {
    measured.set(host.clientWidth || 1, host.clientHeight || 1);
    if (bounds.equals(measured)) return;
    bounds.copy(measured);
    camera.aspect = bounds.x / bounds.y;
    camera.updateProjectionMatrix();
    if (!flight && !flying && (!ready || !body || !!poseView.zone || camera.position.distanceTo(controls.target) > planets[body].radius * 2.7)) {
      setUp(body);
      setPose(body ? focusOf(body, poseView) : mapPose());
      if (ready) setControls(!!poseView.zone);
    }
    redraw();
  }
  function updateShowroom() {
    if (flying || body !== "starcars" || !detail) return;
    // Keep the full cars for close inspection. The orbit uses the batched silhouettes on touch screens.
    const threshold = detail.viewDistance * (nearShowroom ? 1.95 : 1.75);
    const close = !compact || camera.position.distanceToSquared(detail.focus) < threshold ** 2;
    if (close && !nearShowroom) detail.loadCars(() => { renderer.shadowMap.needsUpdate = true; redraw(); });
    nearShowroom = close;
    detail.showCars(close);
  }
  function cullHome(eye: T.Vector3) {
    home.cull(eye);
    play.cullHome(eye);
  }
  function frame(now: number) {
    // Match the drawing buffer and projected labels to the same committed layout.
    resize();
    pending = 0;
    const seconds = previous ? Math.min((now - previous) / 1000, .12) : .016;
    previous = now;
    const animate = !motion.matches;
    const decorated = fx && quality !== "economy";
    if (animate) worldTime += seconds;
    if (flight) {
      const progress = Math.max(0, Math.min(1, (now - flight.start) / flight.duration, flight.progress + flight.maxStep));
      flight.progress = progress;
      flight.tween.progress(progress);
      if (progress === 1) {
        const done = flight.finish;
        flight.tween.kill();
        flight = undefined;
        done();
      }
    }
    controls.autoRotate = auto && animate && !flying && !!body;
    const orbiting = !flight && controls.update(seconds);
    if (!flight) { keepOutside(); camera.lookAt(controls.target); }
    if (animate && !flying) detail?.update(worldTime, decorated);
    universe.update(worldTime, animate);
    play.tick(seconds, animate && !flying, decorated);
    if (body === "home" && animate) {
      const a = worldTime * .39;
      home.avatar.position.x = .10 + Math.sin(a) * 1.73;
      home.avatar.position.z = 3.43 + Math.cos(a) * 1.73;
      home.avatar.rotation.y = Math.atan2(Math.cos(a), -Math.sin(a));
      home.legs.forEach((leg, i) => { leg.rotation.x = Math.sin(worldTime * 6 + i * Math.PI) * .42; });
    }
    const night = body === "beatmarket" || day === "night" ? .72 : day === "day" || !animate ? 0 : T.MathUtils.smoothstep(Math.sin(worldTime * .019 - .9), .34, .98) * .58;
    sun.intensity = 2.18 - night * 1.35;
    sun.color.setRGB(1 - night * .28, .91 - night * .21, .81 + night * .15);
    ambient.intensity = 1.28 - night * .56;
    const moving = !!flight || dragging || !!orbiting;
    if (moving && seconds > .064) slow = Math.min(12, slow + 1);
    else slow = Math.max(0, slow - 1);
    if (slow > 5) fastBudget = false;
    const chart = body === null && !flying;
    const softwareBudget = chart ? 580_000 : moving ? 135_000 : 475_000;
    const budget = software ? softwareBudget : fastBudget && quality !== "economy" ? 1_440_000 : 390_000;
    const ratio = Math.min(devicePixelRatio || 1, quality === "high" ? 1.55 : 1.25, Math.sqrt(budget / (bounds.x * bounds.y)));
    if (Math.abs(ratio - engineDpr) > .018 || canvas.width !== Math.floor(bounds.x * engineDpr) || canvas.height !== Math.floor(bounds.y * engineDpr)) {
      engineDpr = ratio;
      renderer.setDrawingBufferSize(bounds.x, bounds.y, ratio);
    }
    if (body === "home") cullHome(camera.position);
    detail?.cull(camera.position);
    updateShowroom();
    renderer.render(scene, camera);
    projectMarkers();
    if (!ready) {
      ready = true;
      callbacks.rendered();
    }
    if (flight || orbiting || dragging || controls.autoRotate) redraw();
    else if (animate && !timer) {
      if (!low && quality !== "economy") redraw();
      else timer = window.setTimeout(() => { timer = 0; redraw(); }, software ? 80 : 19);
    }
  }
  function cancelTransition() {
    flight?.tween.kill();
    flight = undefined;
  }
  function clearArrival() {
    resetArrival?.();
    resetArrival = undefined;
  }
  function transition(duration: number, update: (phase: number) => void, finish: () => void, maxStep = 1) {
    if (motion.matches) { update(1); finish(); return; }
    const phase = { p: 0 };
    const tween = gsap.to(phase, { p: 1, paused: true, duration: duration / 1000, ease: "sine.inOut", onUpdate: () => update(phase.p) });
    flight = { tween, start: performance.now(), duration, progress: 0, maxStep, finish };
    redraw();
  }
  function revealMoon() {
    moonKnown = true;
    callbacks.moonRevealed();
    show(); redraw();
  }
  async function fly(destination: Destination, requested?: View, instant = false) {
    const next = destination === "system" ? null : destination;
    if (next === body && !flying) {
      if (requested) focus(requested, instant);
      return;
    }
    const token = ++flightToken;
    cancelTransition();
    clearArrival();
    previewPrepared?.dispose();
    previewPrepared = undefined;
    flying = true;
    controls.enabled = false;
    callbacks.traveling(destination, !!requested);
    const previousBody = body;
    try {
      let prepared: ProjectScene | undefined;
      let arrival: T.Group[] | undefined;
      if (isSecretBody(next)) {
        const satellite = await play.load(next);
        arrival = [satellite.root];
      } else if (next === "home") {
        arrival = homeSurface;
      } else if (next) {
        if (next === body && detail) prepared = detail;
        else {
          const { buildProjectScene } = await import("./planetScene");
          if (disposed || token !== flightToken) return;
          prepared = buildProjectScene(next, low, software, {
            find(id) {
              play.find(id);
              if (id === "gold") garage = true;
            }, alert: play.sound.play, beat: play.sound.beat, portal: play.portal,
          });
          previewPrepared = prepared;
          prepared.root.visible = false;
          scene.add(prepared.root);
        }
        arrival = [prepared.root];
      }
      if (disposed || token !== flightToken) { if (prepared && prepared !== detail) prepared.dispose(); return; }
      // Travel to the full-screen map even when the launch view has a shorter, inset canvas.
      const mapWidth = document.documentElement.clientWidth;
      const mapHeight = window.innerHeight;
      const destinationPose = next ? focusOf(next, requested, prepared) : mapPose(mapWidth, mapHeight);
      const follow = flightPath(camera.position, destinationPose.eye, previousBody, next);
      const startingAim = controls.target.clone(), startingUp = camera.up.clone();
      const endingUp = next === null && mapWidth / mapHeight < .77 ? new T.Vector3(1, 0, 0) : new T.Vector3(0, 1, 0);
      const eye = new T.Vector3(), aim = new T.Vector3();
      const endPoint = play.bodyFocus(next, new T.Vector3());
      universe.show(true, previousBody, moonKnown || next === "moon", unknown || next === "signal", garage || next === "garage");
      play.sound.play("warp");
      function finish() {
        if (token !== flightToken || disposed) return;
        clearArrival();
        resize();
        if (detail && detail !== prepared) detail.dispose();
        if (previousBody !== next && isSecretBody(previousBody)) play.release(previousBody);
        detail = prepared;
        nearShowroom = false;
        previewPrepared = undefined;
        body = next;
        poseView = requested ?? { zone: null, project: null };
        flying = false;
        mode = "planet";
        if (next === "signal") unknown = true;
        if (next === "moon") moonKnown = true;
        show();
        setUp(body);
        setPose(next ? destinationPose : mapPose());
        setControls(!!requested?.zone && requested.zone !== "contact");
        placeLight();
        detail?.loadSurfaces(redraw);
        callbacks.traveling(null);
        callbacks.arrived(destination);
        redraw();
      }
      if (instant || motion.matches) { finish(); return; }
      let approach: ((eye: T.Vector3) => void) | undefined;
      if (next && previousBody !== next && arrival) {
        const roots = arrival;
        const root = roots[0];
        const mix = surfaces.get(root) ?? planetLod(roots);
        surfaces.set(root, mix);
        const radius = planets[next].radius;
        const near = Math.max(radius * 6, destinationPose.eye.distanceTo(endPoint) * 1.19);
        const far = near + radius * 10;
        for (const item of roots) renderer.compile(item, camera, scene);
        prepared?.loadSurfaces(redraw);
        resetArrival = () => {
          universe.setDetail(next, 0);
          mix(1);
          for (const item of roots) item.visible = false;
        };
        approach = eye => {
          const distance = eye.distanceTo(endPoint);
          const fraction = 1 - T.MathUtils.smoothstep(distance, near, far);
          const turn = 1 - T.MathUtils.smoothstep(distance, far, far + radius * 12);
          universe.setDetail(next, fraction, turn);
          mix(fraction);
          for (const item of roots) item.visible = fraction > 0;
          if (fraction > 0) {
            if (next === "home") cullHome(eye);
            else prepared?.cull(eye);
          }
        };
      }
      // Leave enough transition frames even after a slow frame or a shader compilation stall.
      transition(next === "signal" ? 2300 : next === null || previousBody === null ? 1770 : 1960, amount => {
        follow.sample(amount, eye);
        approach?.(eye);
        aim.copy(startingAim).lerp(endPoint, T.MathUtils.smoothstep(amount, .13, .63)).lerp(destinationPose.target, T.MathUtils.smoothstep(amount, .65, .98));
        if (eye.distanceToSquared(aim) < .025) aim.z -= .85;
        camera.up.copy(startingUp).lerp(endingUp, T.MathUtils.smoothstep(amount,.33,.85)).normalize();
        setPose({ target: aim, eye });
      }, finish, .085);
    } catch {
      if (disposed || flightToken !== token) return;
      clearArrival(); previewPrepared?.dispose(); previewPrepared = undefined;
      flying = false; show(); setControls(!!poseView.zone); callbacks.traveling(null); callbacks.interrupted(poseView, true); redraw();
    }
  }
  function stopFlight() {
    const interrupted = flying;
    flightToken++;
    cancelTransition();
    clearArrival();
    previewPrepared?.dispose(); previewPrepared = undefined;
    flying = false;
    if (disposed) return;
    show();
    setUp(body);
    setPose(body ? focusOf(body, poseView) : mapPose());
    setControls(!!poseView.zone);
    callbacks.traveling(null);
    if (interrupted) callbacks.interrupted(poseView, false);
    redraw();
  }
  function focus(view: View, instant: boolean) {
    poseView = view;
    if (!body || view.zone === "contact" || view.zone === "gallery" && view.project === null) { redraw(); return; }
    const next = focusOf(body, view);
    const startEye = camera.position.clone(), startTarget = controls.target.clone();
    const eye = new T.Vector3(), aim = new T.Vector3();
    cancelTransition();
    controls.enabled = false;
    const finish = () => { setPose(next); setControls(!!view.zone); keepOutside(); redraw(); };
    if (instant || motion.matches) { finish(); return; }
    transition(730, amount => {
      eye.copy(startEye).lerp(next.eye, amount);
      aim.copy(startTarget).lerp(next.target, amount);
      keepOutside(eye);
      setPose({ target: aim, eye });
    }, finish);
  }
  function moveView(view: View, instant = false) {
    mode = "planet";
    if (view.zone === "contact" || view.zone === "gallery" && view.project === null) { poseView = view; redraw(); return; }
    const next = view.project !== null ? projects[view.project].id : view.zone === "lab" ? "ai" : view.zone ? "home" : body;
    if (next && next !== body) void fly(next, view, instant);
    else if (!flying) focus(view, instant);
  }
  function inspect() {
    if (detail) callbacks.select(detail.inspect);
    else if (body === "home") callbacks.select({ zone: "hq" });
  }
  function pick(event: PointerEvent) {
    const box = canvas.getBoundingClientRect();
    cast.setFromCamera(originRay.set((event.clientX - box.left) * 2 / box.width - 1, 1 - (event.clientY - box.top) * 2 / box.height), camera);
    if (!body) {
      if (universe.hitVisitor(cast)) return encounter;
      const found = cast.intersectObjects(universe.visible(), false)[0]?.object.userData.body as Body | undefined;
      return found ? () => { void fly(found); } : undefined;
    }
    if (body === "home" && moonKnown && universe.marker("moon")) {
      const moon = cast.intersectObjects(universe.visible(), false).find(hit => hit.object.userData.body === "moon");
      if (moon) return () => { void fly("moon"); };
    }
    play.bodyFocus(body, center);
    sphere.set(center, planets[body].radius - .22);
    const surface = cast.ray.intersectSphere(sphere, rayPoint);
    let distance = surface ? cast.ray.origin.distanceTo(surface) + .20 : Infinity;
    const building = cast.intersectObjects(body === "home" ? home.hits : detail?.hits ?? [], false)[0];
    let resolved: (() => void) | undefined;
    if (building && building.distance <= distance) {
      distance = building.distance + .05;
      resolved = () => callbacks.select(building.object.userData.hit);
    }
    if (detail) {
      for (const item of detail.interactive) {
        const mesh = cast.intersectObject(item.root, true).find(hit => hit.object.visible);
        if (mesh && mesh.distance < distance) { resolved = item.action; distance = mesh.distance; }
      }
    }
    return play.pick(cast, distance) ?? resolved;
  }
  function down(event: PointerEvent) {
    press = event.isPrimary && event.button === 0 ? { x: event.clientX, y: event.clientY, id: event.pointerId } : undefined;
  }
  function up(event: PointerEvent) {
    const start = press; press = undefined;
    if (!start || start.id !== event.pointerId || Math.hypot(start.x - event.clientX, start.y - event.clientY) > 7 || flying) return;
    pick(event)?.(); redraw();
  }
  function encounter() {
    if (!body && universe.visitor) { play.find("ufo"); play.sound.play("ufo"); void fly("signal"); }
    else play.ufo();
    redraw();
  }
  function hover(event: PointerEvent) {
    if (event.pointerType !== "mouse" || event.buttons || flying) return;
    canvas.style.cursor = pick(event) ? "pointer" : "grab";
  }
  function startDrag() { dragging = true; redraw(); }
  function stopDrag() {
    dragging = false;
    if (!flying && body && !poseView.zone && camera.position.distanceTo(controls.target) >= controls.maxDistance * .965) void fly("system");
    redraw();
  }
  function visibility() {
    if (document.hidden) {
      cancelAnimationFrame(pending); pending = 0; window.clearTimeout(timer); timer = 0;
    } else { previous = 0; redraw(); }
  }
  function contextLost(event: Event) {
    event.preventDefault();
    lost = true; callbacks.lost();
  }
  function reduced() {
    controls.enableDamping = !motion.matches;
    if (motion.matches && flight) { const complete = flight.finish; cancelTransition(); complete(); }
    redraw();
  }
  function zoom(amount: number) {
    if (flying) return;
    offset.copy(camera.position).sub(controls.target);
    const distance = offset.length() * amount;
    if (body && amount > 1 && !poseView.zone && distance >= controls.maxDistance * .97) { void fly("system"); return; }
    camera.position.copy(controls.target).add(offset.setLength(T.MathUtils.clamp(distance, controls.minDistance, controls.maxDistance)));
    redraw();
  }
  function nudge(x: number, y: number) {
    if (flying) return;
    offset.copy(camera.position).sub(controls.target);
    const spherical = new T.Spherical().setFromVector3(offset);
    spherical.theta += x;
    spherical.phi += y;
    spherical.makeSafe();
    camera.position.copy(controls.target).add(offset.setFromSpherical(spherical));
    redraw();
  }

  const observer = new ResizeObserver(resize);
  const controller = {
    moveView, fly, zoom, nudge, inspect, revealMoon, stopFlight,
    refresh() { resize(); redraw(); },
    setMode(next: CameraMode) { mode = next; if (next === "planet" && body) focus({ zone: null, project: null }, false); redraw(); },
    scan() {
      if (body !== "home" || flying) return;
      cancelTransition();
      const start = camera.position.clone();
      const target = origin.clone();
      const goal = observatoryDirection.clone().applyAxisAngle(T.Object3D.DEFAULT_UP, .16);
      const beginning = start.clone().normalize();
      const rotation = new T.Quaternion().setFromUnitVectors(beginning, goal);
      const partial = new T.Quaternion(), eye = new T.Vector3();
      const distance = focusOf("home").eye.length();
      controls.enabled = false;
      transition(710, phase => {
        partial.identity().slerp(rotation, phase);
        eye.copy(beginning).applyQuaternion(partial).multiplyScalar(T.MathUtils.lerp(start.length(), distance, phase));
        keepOutside(eye);
        setPose({ target, eye });
      }, () => {
        setControls(false);
        play.scan();
        redraw();
      });
    },
    setAuto(value: boolean) { auto = value; redraw(); },
    setDay(value: typeof day) { day = value; redraw(); },
    setEffects(value: boolean) { fx = value; if (motion.matches) detail?.update(0, false); redraw(); },
    setQuality(value: typeof quality) { quality = value; fastBudget = !software; redraw(); },
    setSound(value: boolean) { play.sound.setEnabled(value); },
    setFinds(ids: FindId[], moon: boolean, secret: boolean) { play.setFinds(ids); moonKnown = moon; unknown = secret; garage = ids.includes("gold"); show(); redraw(); },
    portal() { play.portal(); redraw(); },
    interact() { if (action) action(); else play.interact(); redraw(); },
    ufo: encounter,
    dispose() {
      disposed = true; stopFlight();
      cancelAnimationFrame(pending); window.clearTimeout(timer);
      observer.disconnect(); controls.dispose(); play.dispose(); detail?.dispose(); universe.dispose(); home.dispose(); planet.dispose();
      document.removeEventListener("visibilitychange", visibility);
      motion.removeEventListener("change", reduced);
      canvas.removeEventListener("webglcontextlost", contextLost);
      sun.shadow.dispose(); environment?.dispose(); renderer.dispose();
      if (!lost) renderer.forceContextLoss();
      canvas.remove();
    },
  };
  resize();
  setPose(focusOf("home"));
  setControls(false);
  show();
  placeLight();
  try {
    if (gl.getExtension("KHR_parallel_shader_compile")) await renderer.compileAsync(scene, camera);
    else renderer.compile(scene, camera);
    signal.throwIfAborted();
  } catch (error) { controller.dispose(); throw error; }
  started = true;
  controls.addEventListener("change", redraw);
  controls.addEventListener("start", startDrag);
  controls.addEventListener("end", stopDrag);
  canvas.addEventListener("pointerdown", down);
  canvas.addEventListener("pointerup", up);
  canvas.addEventListener("pointermove", hover);
  canvas.addEventListener("pointercancel", () => { press = undefined; });
  canvas.addEventListener("webglcontextlost", contextLost);
  document.addEventListener("visibilitychange", visibility);
  motion.addEventListener("change", reduced);
  observer.observe(host);
  redraw();
  return controller;
}

export type WorldController = Awaited<ReturnType<typeof createWorld>>;
