import * as T from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { gsap } from "gsap";
import { projects, projectStops, sceneStops, zones, type StopId, type Zone } from "./content";
import { buildModel, type Hit } from "./model";
import { loadLighting } from "./lighting";
import { colorTerrain } from "./terrain";
import { createPlay, type Beacon } from "./play";
import { observatoryDirection } from "./worldLife";
import type { Body, CameraMode, FindId } from "./discoveries";
import { globeDirection, globeRadius, loadPlanet, type SurfaceStop } from "./globe";

type View = { zone: Zone | null; project: number | null };
type Callbacks = {
  marker: (id: StopId, x: number, y: number, visible: boolean) => void;
  hover: (id: StopId | null) => void;
  select: (hit: Hit) => void;
  lost: () => void;
  rendered: () => void;
  found: (id: FindId) => void;
  beacon: (id: Beacon, x: number, y: number, visible: boolean) => void;
  arrived: (body: Body) => void;
  traveling: (body: Body | null) => void;
};

const initial = globeDirection(23, 6);
const overview = new T.Vector3();
const planetSphere = new T.Sphere(overview, globeRadius - 0.05);
const fov = 35;
const fovTangent = Math.tan(T.MathUtils.degToRad(fov / 2));
type Pose = { target: T.Vector3; direction: T.Vector3; distance: number };
const travelKeys = new Set(["w", "a", "s", "d"]);

function makeContext(antialias: boolean) {
  const canvas = document.createElement("canvas");
  const options: WebGLContextAttributes = { alpha: true, antialias, powerPreference: "high-performance" };
  const context = canvas.getContext("webgl2", options);
  if (!(context instanceof WebGL2RenderingContext)) throw new Error("WebGL 2 is unavailable");
  return { canvas, options, context };
}

export async function createWorld(host: HTMLElement, callbacks: Callbacks, signal: AbortSignal) {
  const compact = window.matchMedia("(pointer: coarse)").matches || host.clientWidth < 595;
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let graphics = makeContext(!compact);
  const debug = graphics.context.getExtension("WEBGL_debug_renderer_info");
  const rendererName = debug ? String(graphics.context.getParameter(debug.UNMASKED_RENDERER_WEBGL)) : "";
  const software = /swiftshader|llvmpipe|softpipe|software rasterizer/i.test(rendererName);
  if (software && !compact) {
    graphics.context.getExtension("WEBGL_lose_context")?.loseContext();
    graphics = makeContext(false);
  }
  const { canvas, context, options } = graphics;
  const low = compact || software;
  let environment: T.Texture | null = null;
  let planet: ReturnType<typeof loadPlanet>;
  try {
    if (!low) environment = await loadLighting(signal);
    signal.throwIfAborted();
    planet = loadPlanet(software, low);
    colorTerrain(planet.sphere, software);
  } catch (error) {
    environment?.dispose();
    context.getExtension("WEBGL_lose_context")?.loseContext();
    throw error;
  }
  const renderer = new T.WebGLRenderer({ ...options, canvas, context });
  renderer.setClearColor(0x101210, 0);
  renderer.outputColorSpace = T.SRGBColorSpace;
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  const pixelBudget = software ? 560_000 : 1_550_000;
  const motionBudget = compact ? 56_000 : 46_000;
  const minimumDpr = 0.75;
  let motionScale = 1;
  let reduceMotionPixels = software;
  let dpr = Math.min(window.devicePixelRatio || 1, software ? 1 : compact ? 1.15 : 1.55);
  renderer.setPixelRatio(dpr);
  renderer.shadowMap.enabled = !software;
  renderer.shadowMap.type = low ? T.BasicShadowMap : T.PCFShadowMap;
  renderer.shadowMap.autoUpdate = false;
  renderer.domElement.setAttribute("aria-hidden", "true");
  if (software) canvas.dataset.renderer = "software";
  host.append(renderer.domElement);

  const scene = new T.Scene();
  const depthFog = new T.Fog(0x111a24, 205, 290);
  scene.fog = depthFog;
  const camera = new T.PerspectiveCamera(fov, 1, 0.15, 490);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = !motion.matches;
  controls.dampingFactor = software ? 0.17 : 0.074;
  controls.enablePan = false;
  controls.rotateSpeed = 0.59;
  controls.enableZoom = true;
  controls.zoomSpeed = 0.78;
  controls.minPolarAngle = 0.12;
  controls.maxPolarAngle = Math.PI - 0.12;
  controls.mouseButtons = { LEFT: T.MOUSE.ROTATE, RIGHT: T.MOUSE.ROTATE };
  controls.touches = { ONE: T.TOUCH.ROTATE, TWO: T.TOUCH.DOLLY_ROTATE };
  controls.target.copy(overview);
  camera.position.copy(initial).multiplyScalar(overviewDistance());
  controls.update();
  scene.add(planet.group);

  scene.environment = environment;
  scene.environmentIntensity = 0.63;

  scene.add(new T.HemisphereLight(0xe3ebf6, 0x514d47, low ? 1.13 : 0.91));
  const sun = new T.DirectionalLight(0xffedda, low ? 1.65 : 2.05);
  sun.position.set(33, 56, 37);
  sun.castShadow = true;
  const shadowSize = software ? 512 : compact ? 1024 : 2048;
  sun.shadow.mapSize.set(shadowSize, shadowSize);
  sun.shadow.camera.left = -31;
  sun.shadow.camera.right = 31;
  sun.shadow.camera.top = 31;
  sun.shadow.camera.bottom = -31;
  sun.shadow.camera.near = 0.5;
  sun.shadow.camera.far = 125;
  sun.shadow.bias = -0.0002;
  sun.shadow.normalBias = 0.065;
  sun.shadow.intensity = 0.78;
  sun.shadow.radius = 2.4;
  scene.add(sun);
  const fill = new T.DirectionalLight(0xd3e0f3, low ? 0.47 : 0.48);
  fill.position.set(12, 8, -15);
  scene.add(fill);
  const model = buildModel(low, software);
  const play = createPlay(scene, low, compact, {
    found: callbacks.found,
    enter(id) {
      const index = projects.findIndex(project => project.id === id);
      callbacks.select(index === -1 ? { zone: id as Zone } : { zone: "gallery", project: index });
    },
    voyage: fly,
  });
  const followTarget = new T.Vector3();
  const followEye = new T.Vector3();
  const spaceCenter = new T.Vector3();
  const cameraWorldOffset = new T.Vector3();
  const cameraProjected = new T.Vector3();
  const startSun = sun.position.clone();
  let mode: CameraMode = "planet";
  let body: Body = "home";
  let worldRadius = globeRadius;
  let auto = false;
  let day: "cycle" | "day" | "night" = "cycle";
  let quality: "auto" | "economy" | "high" = "auto";
  let animationTimer = 0;
  let flightId = 0;
  let traveling = false;
  const starCarsSite = model.sites.starcars.normal.clone().multiplyScalar(globeRadius);
  scene.add(model.group);
  renderer.shadowMap.needsUpdate = true;

  const size = new T.Vector2();
  const walkOrigin = new T.Vector2();
  const raycaster = new T.Raycaster();
  const pointer = new T.Vector2();
  const projected = new T.Vector3();
  const walkingPlane = new T.Plane(new T.Vector3(0, 1, 0), -0.25);
  const walkRay = new T.Ray();
  const walkHit = new T.Vector3();
  const planetHit = new T.Vector3();
  const avatarCamera = new T.Vector3();
  const markerNormal = new T.Vector3();
  const markerToEye = new T.Vector3();
  const avatarCenter = new T.Vector2(0.10, 3.43);
  const keys = new Set<string>();
  let waypoint: T.Vector2 | null = null;
  let travel = 0;
  let request = 0;
  let interacting = false;
  let bufferWidth = 0;
  let bufferHeight = 0;
  let bufferDpr = 0;
  let compiled = false;
  let called = false;
  let paused = document.hidden;
  let disposed = false;
  let lost = false;
  let transition: { tween: gsap.core.Tween; start: number; duration: number; after?: () => void } | undefined;
  let current: View = { zone: null, project: null };
  let pointerStart: { id: number; x: number; y: number; time: number } | null = null;
  let previous = 0;
  let samples = 0;
  let elapsed = 0;
  let captureFrames = 0;
  let slowWindows = 0;
  let hover: StopId | null = null;

  function overviewDistance() {
    const fraction = Math.min(1, camera.aspect) * (compact ? 0.79 : 0.765);
    return (globeRadius * 1.06) / Math.sin(Math.atan(fovTangent * fraction));
  }

  function isOverview(view: View) {
    return view.project === null && (view.zone === null || view.zone === "gallery" || view.zone === "contact");
  }

  function writeCamera(pose: Pose) {
    controls.target.copy(pose.target);
    camera.position.copy(pose.target).addScaledVector(pose.direction, pose.distance);
    controls.update();
    requestRender();
  }

  function currentPose(): Pose {
    const target = controls.target.clone();
    const offset = camera.position.clone().sub(target);
    return { target, distance: offset.length(), direction: offset.normalize() };
  }

  function requestRender() {
    if (compiled && !disposed && !lost && !paused && !request) request = requestAnimationFrame(frame);
  }

  function resize() {
    if (disposed || lost) return;
    const width = Math.max(host.clientWidth, 1);
    const height = Math.max(host.clientHeight, 1);
    const pose = currentPose();
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    size.set(width, height);
    if (isOverview(current) && !transition && body === "home" && mode === "planet" && (!called || pose.distance > globeRadius * 2)) {
      writeCamera({ ...pose, distance: overviewDistance() });
    }
    requestRender();
  }

  function updateDrawingBuffer(moving: boolean) {
    // The camera uses CSS-pixel dimensions even when the render buffer is smaller.
    const baseBudget = quality === "economy" ? pixelBudget * 0.51 : pixelBudget;
    const budget = reduceMotionPixels && moving ? Math.min(motionBudget, size.x * size.y * (compact ? 0.24 : 0.31)) * motionScale : baseBudget;
    const ratio = Math.min(dpr, Math.sqrt(budget / (size.x * size.y)));
    if (size.x === bufferWidth && size.y === bufferHeight && ratio === bufferDpr) return;
    bufferWidth = size.x;
    bufferHeight = size.y;
    bufferDpr = ratio;
    renderer.setDrawingBufferSize(bufferWidth, bufferHeight, bufferDpr);
  }

  function moveAvatar(seconds: number) {
    if (!keys.size && !waypoint) {
      model.legs.forEach(leg => { leg.rotation.x = 0; });
      return;
    }
    const position = model.avatar.position;
    const amount = Math.min(seconds, 0.08) * 2.7;
    const dx = Number(keys.has("d")) - Number(keys.has("a"));
    const dz = Number(keys.has("s")) - Number(keys.has("w"));
    avatarCamera.copy(camera.position).applyMatrix4(model.sites.hq.inverse);
    const angle = Math.atan2(avatarCamera.x - position.x, avatarCamera.z - position.z);
    const direction = new T.Vector2(dx * Math.cos(angle) + dz * Math.sin(angle), dz * Math.cos(angle) - dx * Math.sin(angle));
    if (keys.size) waypoint = null;

    if (waypoint) {
      const radial = new T.Vector2(position.x, position.z).sub(avatarCenter);
      const difference = waypoint.angle() - radial.angle();
      const turn = Math.atan2(Math.sin(difference), Math.cos(difference));
      if (Math.abs(turn) < 0.045) {
        direction.copy(waypoint).sub(radial);
        if (direction.length() < 0.05) waypoint = null;
      } else {
        direction.copy(radial).rotateAround(walkOrigin, Math.sign(turn) * Math.min(Math.abs(turn), amount / radial.length())).sub(radial);
      }
    }
    if (!direction.lengthSq()) return;
    direction.setLength(Math.min(amount, direction.length()));
    const next = new T.Vector2(position.x + direction.x, position.z + direction.y).sub(avatarCenter);
    if (next.lengthSq() < 0.0001) return;
    next.setLength(T.MathUtils.clamp(next.length(), 1.44, 2.78)).add(avatarCenter);
    const moving = Math.hypot(next.x - position.x, next.y - position.z) > 0.001;
    if (moving) {
      model.avatar.rotation.y = Math.atan2(next.x - position.x, next.y - position.z);
      position.x = next.x;
      position.z = next.y;
      travel += seconds * 11;
    }
    model.legs.forEach((leg, i) => { leg.rotation.x = moving && !motion.matches ? Math.sin(travel + Math.PI * i) * 0.55 : 0; });
  }

  function frame(now: number) {
    request = 0;
    const measuredFrame = previous > 0;
    const dt = measuredFrame ? now - previous : 0;
    previous = now;
    const seconds = Math.min(dt / 1000, 0.085);
    if (transition) {
      const progress = Math.min((now - transition.start) / transition.duration, 1);
      transition.tween.progress(Math.max(progress, 0));
      if (progress === 1) {
        const after = transition.after;
        cancelTransition();
        controls.enabled = mode !== "drive";
        after?.();
      }
    }
    const animate = !motion.matches;
    const clock = play.tick(seconds, animate && !traveling, quality === "high" || (quality === "auto" && !low), mode);
    if (mode === "drive" && !transition) {
      const car = play.vehicle;
      followTarget.copy(car.root.position).addScaledVector(car.normal, 0.74).addScaledVector(car.forward, 0.7);
      followEye.copy(car.root.position).addScaledVector(car.normal, 3.3).addScaledVector(car.forward, -5.9);
      const mix = motion.matches ? 1 : 1 - Math.exp(-Math.max(0.016, seconds) * 10);
      camera.position.lerp(followEye, mix);
      controls.target.lerp(followTarget, mix);
      camera.up.lerp(car.normal, mix).normalize();
      camera.lookAt(controls.target);
    } else {
      moveAvatar(seconds);
    }
    if (animate || day !== "cycle") {
      const night = day === "night" ? 1 : day === "day" ? 0 : T.MathUtils.smoothstep(Math.sin(clock / 29 - 1.14), .10, .94);
      sun.intensity = T.MathUtils.lerp(low ? 1.65 : 2.05, .40, night);
      sun.color.setRGB(1 - night * .28, .90 - night * .18, .73 + night * .24);
      if (body === "home") sun.position.copy(startSun);
      else sun.position.copy(play.bodyFocus(body, spaceCenter)).add(startSun);
      const mood = Math.sin(clock / 29 - 1.1);
      scene.environmentIntensity = .64 - night * .24 + Math.max(0, mood) * .048;
      renderer.toneMappingExposure = 1.05 - (software ? night * .19 : night * .14);
    }
    if (!motion.matches) model.beacon.material.emissiveIntensity = 0.34 + Math.sin(now / 760) * 0.08;
    if (!transition && !isOverview(current)) model.loadSurfaces(requestRender);
    controls.autoRotate = auto && !transition && mode !== "drive" && animate;
    const orbitMoved = mode === "drive" ? false : controls.update(seconds);
    const moving = Boolean(transition || interacting || mode === "drive" && Math.abs(play.vehicle.speed) > 0.3 || orbitMoved || keys.size || waypoint);
    if (!transition && body === "home" && mode !== "drive" && controls.target.lengthSq() > 1) {
      cameraWorldOffset.copy(camera.position);
      if (cameraWorldOffset.lengthSq() < (globeRadius + .75) ** 2) camera.position.copy(cameraWorldOffset.setLength(globeRadius + .75));
      camera.lookAt(controls.target);
    }
    updateDrawingBuffer(moving);
    if (model.showDetailedCars(!transition && camera.position.distanceToSquared(starCarsSite) < 36 * 36)) {
      renderer.shadowMap.needsUpdate = true;
    }
    fill.position.copy(camera.position).normalize().multiplyScalar(45);
    const approach = body === "home" && !traveling ? T.MathUtils.smoothstep(controls.target.length(), 8, 20) : 0;
    const distance = camera.position.distanceTo(controls.target);
    depthFog.near = T.MathUtils.lerp(205, distance * (play.storm ? .83 : 1.12), approach);
    depthFog.far = T.MathUtils.lerp(290, distance * (play.storm ? 1.95 : 2.85), approach);
    depthFog.color.setHex(play.storm ? 0x354956 : 0x192637);
    play.cull(camera.position);
    model.cull(camera.position);
    renderer.render(scene, camera);
    if (body === "home" && isOverview(current) && mode !== "drive" && mode !== "photo" && !traveling) for (const zone of sceneStops) {
      const [x, y, z] = zone.marker;
      projected.set(x, y, z);
      if (zone.id === "hq") projected.add(model.avatar.position);
      const site = model.sites[zone.id as SurfaceStop];
      projected.applyMatrix4(site.matrix);
      markerNormal.copy(projected).normalize();
      markerToEye.copy(camera.position).sub(projected).normalize();
      const front = markerNormal.dot(markerToEye) > 0.13;
      projected.project(camera);
      callbacks.marker(zone.id, (projected.x * 0.5 + 0.5) * size.x, (0.5 - projected.y * 0.5) * size.y,
        front && projected.z > -1 && projected.z < 1 && Math.abs(projected.x) < 0.92 && Math.abs(projected.y) < 0.90);
    }
    play.projectBeacons(camera, (id, point) => {
      if (!point || traveling || mode === "photo") { callbacks.beacon(id, 0, 0, false); return; }
      cameraProjected.copy(point).project(camera);
      const visible = Math.abs(cameraProjected.x) < .93 && Math.abs(cameraProjected.y) < .88 && Math.abs(cameraProjected.z) < 1;
      callbacks.beacon(id, (cameraProjected.x * .5 + .5) * size.x, (.5 - cameraProjected.y * .5) * size.y, visible);
    });
    if (!called) {
      called = true;
      callbacks.rendered();
    }
    if (captureFrames > 0) captureFrames--;
    if (captureFrames && dt > 0) {
      samples++;
      elapsed += Math.min(dt, 300);
      // Some browsers mask their renderer name. React to sustained slow frames there as well.
      if (!reduceMotionPixels && samples >= 4 && elapsed / samples > 95) {
        reduceMotionPixels = true;
        canvas.dataset.renderer = "adaptive";
      }
      if (samples === 12) {
        const average = elapsed / samples;
        if (average > (low ? 37 : 26)) {
          if (reduceMotionPixels && motionScale > 0.63) motionScale = Math.max(0.62, motionScale * 0.86);
          else if (!reduceMotionPixels && dpr > minimumDpr + 0.01) dpr = Math.max(minimumDpr, dpr * 0.82);
        }
        const minimumQuality = reduceMotionPixels ? motionScale <= 0.63 : dpr <= minimumDpr + 0.01;
        slowWindows = average > 170 && minimumQuality ? slowWindows + 1 : 0;
        samples = elapsed = 0;
        if (slowWindows >= 3) {
          callbacks.lost();
          return;
        }
      }
    }
    if (transition || keys.size || waypoint || mode === "drive" && Math.abs(play.vehicle.speed) > .04) requestRender();
    else if (animate && !animationTimer) {
      if (!low && quality !== "economy") requestRender();
      else animationTimer = window.setTimeout(() => { animationTimer = 0; requestRender(); }, software ? 63 : 24);
    }
  }

  function resolveView(view: View): Pose {
    if (isOverview(view)) return { target: overview, direction: initial, distance: overviewDistance() };
    const project = view.project === null ? null : projects[view.project];
    const stop = project ? projectStops[project.id] : zones.find(place => place.id === view.zone)!;
    const id = (project?.id ?? view.zone) as SurfaceStop;
    const site = model.sites[id];
    const target = new T.Vector3(...stop.target);
    if (id === "hq") target.add(model.avatar.position);
    target.applyMatrix4(site.matrix);
    const tangent = new T.Vector3().setFromMatrixColumn(site.matrix, 0);
    const tilt = id === "hq" ? 1.85 : id === "starcars" ? 1.28 : id === "b-crm" ? 1.38 : 1.02;
    const direction = site.normal.clone().addScaledVector(site.south, tilt).addScaledVector(tangent, id === "b-crm" ? 0.46 : 0.23).normalize();
    const span = id === "hq" ? 4.0 : Math.max(site.width, site.depth) + 1.8;
    const aspect = Math.min(1.36, camera.aspect);
    return { target, direction, distance: span / (2 * fovTangent * aspect * 0.81) };
  }

  function cancelTransition() {
    transition?.tween.kill();
    transition = undefined;
    controls.enableDamping = !motion.matches;
  }

  function freezeOrbit() {
    // Flush residual mouse or touch inertia without moving the rendered camera.
    const position = camera.position.clone();
    const target = controls.target.clone();
    controls.enableDamping = false;
    controls.update();
    camera.position.copy(position);
    controls.target.copy(target);
    controls.update();
  }

  function moveView(view: View, instant = false, opening = false) {
    flightId++;
    traveling = false;
    callbacks.traveling(null);
    const switchingBody = body !== "home";
    if (switchingBody) {
      body = "home";
      worldRadius = globeRadius;
      play.setBody(body);
      model.group.visible = planet.group.visible = true;
      callbacks.arrived(body);
    }
    mode = "planet";
    play.vehicle.setActive(false);
    camera.up.set(0, 1, 0);
    const focusLimit = isOverview(view) ? globeRadius + 5 : 3.7;
    controls.minDistance = .1;
    controls.maxDistance = 164;
    if (view.project !== null && projects[view.project].id === "starcars") {
      void model.loadCars(() => { renderer.shadowMap.needsUpdate = true; requestRender(); });
    }
    const preserveBearing = (view.zone === "gallery" || view.zone === "contact") && isOverview(current);
    current = view;
    if (!isOverview(view)) { keys.clear(); waypoint = null; }
    cancelTransition();
    freezeOrbit();
    controls.enabled = false;
    const start = currentPose();
    if (opening && isOverview(view) && !motion.matches) {
      start.direction.applyAxisAngle(camera.up, 0.16);
      writeCamera(start);
    }
    const destination = resolveView(view);
    if (preserveBearing) destination.direction = start.direction;
    if (instant || switchingBody || motion.matches || (opening && !isOverview(view))) {
      writeCamera(destination);
      controls.enabled = true;
      controls.minDistance = focusLimit;
      controls.enableDamping = !motion.matches;
      return;
    }

    // Pull back before crossing the globe, orbit at a fixed radius, then approach from outside.
    const outbound = start.target.lengthSq() > 1;
    const inbound = destination.target.lengthSq() > 1;
    const exitAt = outbound ? (inbound ? 0.30 : 0.56) : 0;
    const approachAt = inbound ? (outbound ? 0.64 : 0.51) : 1;
    const orbitDistance = overviewDistance();
    const turn = new T.Quaternion().setFromUnitVectors(start.direction, destination.direction);
    const rotation = new T.Quaternion();
    const direction = new T.Vector3();
    const target = new T.Vector3();
    const progress = { value: 0 };
    const ease = gsap.parseEase("sine.inOut");
    captureFrames = 64;
    previous = 0;
    const duration = opening ? 1100 : outbound && inbound ? 1840 : 1460;
    const tween = gsap.to(progress, {
      value: 1, paused: true, lazy: false, duration: duration / 1000, ease: "none",
      onUpdate() {
        const t = progress.value;
        if (exitAt && t < exitAt) {
          const step = ease(t / exitAt);
          writeCamera({ direction: start.direction, target: target.copy(start.target).lerp(overview, step), distance: T.MathUtils.lerp(start.distance, orbitDistance, step) });
        } else if (t < approachAt) {
          const step = ease((t - exitAt) / (approachAt - exitAt));
          rotation.identity().slerp(turn, step);
          writeCamera({ direction: direction.copy(start.direction).applyQuaternion(rotation), target: overview, distance: orbitDistance });
        } else {
          const step = inbound ? ease((t - approachAt) / (1 - approachAt)) : 1;
          writeCamera({ direction: destination.direction, target: target.copy(overview).lerp(destination.target, step), distance: T.MathUtils.lerp(orbitDistance, destination.distance, step) });
        }
      },
    });
    transition = { tween, start: performance.now(), duration, after: () => { if (mode !== "drive") controls.minDistance = focusLimit; } };
    requestRender();
  }

  function nudge(theta = 0, phi = 0) {
    if (mode === "drive" || traveling) return;
    cancelTransition();
    freezeOrbit();
    const spherical = new T.Spherical().setFromVector3(camera.position.clone().sub(controls.target));
    spherical.theta += theta;
    spherical.phi = T.MathUtils.clamp(spherical.phi + phi, controls.minPolarAngle, controls.maxPolarAngle);
    writeCamera({ target: controls.target, direction: new T.Vector3().setFromSpherical(spherical).normalize(), distance: spherical.radius });
    controls.enabled = true;
    controls.enableDamping = !motion.matches;
  }

  function updatePointer(event: PointerEvent) {
    const rect = canvas.getBoundingClientRect();
    raycaster.setFromCamera(pointer.set(
      (event.clientX - rect.left) / rect.width * 2 - 1,
      1 - (event.clientY - rect.top) / rect.height * 2,
    ), camera);
    const hit = body === "home" ? raycaster.intersectObjects(model.hits, false)[0] : undefined;
    const surface = body === "home" ? raycaster.ray.intersectSphere(planetSphere, planetHit) : null;
    const limit = surface ? raycaster.ray.origin.distanceTo(surface) + .09 : Infinity;
    const destination = hit && hit.distance <= limit ? hit : undefined;
    return { destination, action: play.pick(raycaster, Math.min(limit, destination?.distance ?? Infinity)) };
  }

  function down(event: PointerEvent) {
    if (!event.isPrimary || event.button !== 0) {
      pointerStart = null;
      return;
    }
    pointerStart = { id: event.pointerId, x: event.clientX, y: event.clientY, time: event.timeStamp };
  }

  function over(event: PointerEvent) {
    if (event.buttons || event.pointerType === "touch") return;
    const { destination: hit, action } = updatePointer(event);
    canvas.style.cursor = hit || action ? "pointer" : "grab";
    const destination = hit?.object.userData.hit as Hit | undefined;
    const next = destination?.project !== undefined ? projects[destination.project].id : destination?.zone ?? null;
    if (next !== hover) {
      hover = next;
      callbacks.hover(hover);
    }
  }

  function up(event: PointerEvent) {
    const start = pointerStart;
    pointerStart = null;
    if (transition || !start || event.pointerId !== start.id || event.timeStamp - start.time > 850 || Math.hypot(event.clientX - start.x, event.clientY - start.y) > 7) return;
    const { destination: hit, action } = updatePointer(event);
    if (action) { action(); requestRender(); return; }
    if (hit) {
      callbacks.select(hit.object.userData.hit as Hit);
      return;
    }
    if (body !== "home" || mode === "drive" || transition || model.sites.hq.normal.dot(camera.position) < globeRadius) return;
    const location = walkRay.copy(raycaster.ray).applyMatrix4(model.sites.hq.inverse).intersectPlane(walkingPlane, walkHit);
    if (!location) return;
    const step = new T.Vector2(location.x, location.z).sub(avatarCenter);
    if (step.length() < 1.36 || step.length() > 2.92) return;
    keys.clear();
    waypoint = step.setLength(T.MathUtils.clamp(step.length(), 1.44, 2.78));
    previous = performance.now();
    requestRender();
  }

  function cancel() {
    pointerStart = null;
    canvas.style.cursor = "grab";
    hover = null;
    callbacks.hover(null);
  }

  function startInput() {
    interacting = true;
    cancelTransition();
    captureFrames = 49;
    previous = 0;
  }

  function endInput() {
    interacting = false;
    requestRender();
  }

  function visibility() {
    paused = document.hidden;
    if (paused) {
      interacting = false;
      keys.clear();
      play.vehicle.clear();
      window.clearTimeout(animationTimer);
      animationTimer = 0;
      cancelAnimationFrame(request);
      request = 0;
    } else {
      previous = performance.now();
      requestRender();
    }
  }

  function contextLost(event: Event) {
    event.preventDefault();
    lost = true;
    cancelAnimationFrame(request);
    cancelTransition();
    callbacks.lost();
  }

  function motionChange() {
    controls.enableDamping = !motion.matches;
    if (motion.matches && transition) {
      transition.tween.progress(1);
      const after = transition.after;
      cancelTransition();
      controls.enabled = mode !== "drive";
      after?.();
    }
    requestRender();
  }

  controls.addEventListener("change", requestRender);
  controls.addEventListener("start", startInput);
  controls.addEventListener("end", endInput);
  canvas.addEventListener("pointerdown", down);
  canvas.addEventListener("pointermove", over);
  canvas.addEventListener("pointerup", up);
  canvas.addEventListener("pointercancel", cancel);
  canvas.addEventListener("pointerleave", cancel);
  canvas.addEventListener("webglcontextlost", contextLost);
  document.addEventListener("visibilitychange", visibility);
  motion.addEventListener("change", motionChange);
  const observer = new ResizeObserver(resize);

  async function fly(destination: Body) {
    if (traveling || destination === body || disposed) return;
    const token = ++flightId;
    traveling = true;
    callbacks.traveling(destination);
    play.vehicle.setActive(false);
    mode = "explore";
    const previousBody = body;
    try {
      const world = destination === "home" ? undefined : await play.load(destination);
      if (disposed || token !== flightId) return;
      if (world) world.root.visible = true;
      if (destination === "home") {
        play.showHome();
        model.group.visible = planet.group.visible = true;
      }
      cancelTransition();
      freezeOrbit();
      controls.enabled = false;
      controls.minDistance = .1;
      controls.maxDistance = 320;
      camera.up.set(0, 1, 0);
      const start = currentPose();
      const origin = play.bodyFocus(previousBody, new T.Vector3());
      const center = play.bodyFocus(destination, new T.Vector3());
      const tangent = world ? new T.Vector3().crossVectors(T.Object3D.DEFAULT_UP, world.descent).normalize() : null;
      const finishDirection = world && tangent ? world.descent.clone().addScaledVector(tangent, .58).normalize() : initial;
      const finishDistance = world ? world.radius * (destination === "moon" ? 3.48 : 3.32) * Math.max(1, .90 / camera.aspect) : overviewDistance();
      const finishTarget = world ? center.clone().addScaledVector(world.descent, world.radius * .16) : center;
      const finishEye = finishTarget.clone().addScaledVector(finishDirection, finishDistance);
      const pull = start.direction.clone().multiplyScalar(previousBody === "home" ? 105 : worldRadius * 4).add(origin);
      const outer = center.clone().addScaledVector(finishDirection, world ? world.radius * 3.6 : 99);
      outer.y += (destination === "signal" ? 23 : 10);
      const flight = new T.CubicBezierCurve3(camera.position.clone(), pull, outer, finishEye);
      const phase = { value: 0 };
      const eye = new T.Vector3(), target = new T.Vector3();
      const complete = () => {
        body = destination;
        worldRadius = world?.radius ?? globeRadius;
        play.setBody(body);
        model.group.visible = planet.group.visible = body !== "signal";
        traveling = false;
        controls.minDistance = world ? world.radius * 1.06 : globeRadius + 5;
        controls.maxDistance = world ? world.radius * 9 : 164;
        controls.enabled = true;
        callbacks.traveling(null);
        callbacks.arrived(body);
        writeCamera({ target: finishTarget, direction: finishDirection, distance: finishDistance });
        renderer.shadowMap.needsUpdate = true;
      };
      play.sound.play("warp");
      if (motion.matches) { complete(); return; }
      const duration = destination === "signal" ? 2860 : 2350;
      const tween = gsap.to(phase, {
        value: 1, paused: true, lazy: false, ease: "power2.inOut", duration: duration / 1000,
        onUpdate() {
          flight.getPoint(phase.value, eye);
          target.copy(start.target).lerp(finishTarget, T.MathUtils.smoothstep(phase.value, .12, .83));
          camera.position.copy(eye);
          controls.target.copy(target);
          camera.lookAt(target);
        },
      });
      transition = { tween, start: performance.now(), duration, after: complete };
      captureFrames = 64;
      requestRender();
    } catch {
      if (token !== flightId || disposed) return;
      traveling = false;
      controls.enabled = true;
      callbacks.traveling(null);
      requestRender();
    }
  }

  function setMode(value: CameraMode) {
    if (traveling) return;
    mode = value;
    if (mode === "drive" && body !== "home") mode = "explore";
    play.vehicle.setActive(mode === "drive");
    if (mode !== "drive") camera.up.set(0, 1, 0);
    controls.enabled = mode !== "drive" && !transition;
    if (mode === "drive" && !transition) {
      controls.minDistance = .1;
      followTarget.copy(play.vehicle.root.position).addScaledVector(play.vehicle.normal, .74);
      followEye.copy(play.vehicle.root.position).addScaledVector(play.vehicle.normal, 3.3).addScaledVector(play.vehicle.forward, -5.9);
      controls.target.copy(followTarget);
      camera.position.copy(followEye);
    }
    captureFrames = 48;
    requestRender();
  }

  function zoom(amount: number) {
    if (mode === "drive" || traveling) return;
    const pose = currentPose();
    pose.distance = T.MathUtils.clamp(pose.distance * amount, controls.minDistance, controls.maxDistance);
    writeCamera(pose);
  }

  const controller = {
    moveView,
    nudge, zoom, setMode, fly,
    setAuto(value: boolean) { auto = value; requestRender(); },
    setDay(value: typeof day) { day = value; requestRender(); },
    setQuality(value: typeof quality) { quality = value; resize(); },
    setFinds(ids: FindId[]) { play.setFinds(ids); requestRender(); },
    setSound(value: boolean) { play.sound.setEnabled(value); },
    driveInput(key: string, value: boolean) { play.vehicle.input(key, value); requestRender(); },
    resetCar() { play.vehicle.reset(); setMode("drive"); },
    horn() { play.horn(); requestRender(); },
    scan() {
      if (body !== "home") return;
      cancelTransition();
      freezeOrbit();
      const goal = observatoryDirection.clone().applyAxisAngle(T.Object3D.DEFAULT_UP, .13);
      const start = currentPose();
      const distance = overviewDistance();
      controls.minDistance = globeRadius + 5;
      if (motion.matches) {
        writeCamera({ target: overview, direction: goal, distance });
        play.scan();
      } else {
        const rotation = new T.Quaternion().setFromUnitVectors(start.direction, goal);
        const vector = new T.Vector3(), turn = new T.Quaternion(), aim = new T.Vector3();
        const phase = { value: 0 };
        const duration = 930;
        controls.enabled = false;
        const tween = gsap.to(phase, { value: 1, paused: true, lazy: false, ease: "sine.inOut", duration: duration / 1000,
          onUpdate() {
            turn.identity().slerp(rotation, phase.value);
            writeCamera({ target: aim.copy(start.target).lerp(overview, phase.value), direction: vector.copy(start.direction).applyQuaternion(turn), distance: T.MathUtils.lerp(start.distance, distance, phase.value) });
          } });
        transition = { tween, start: performance.now(), duration, after: () => play.scan() };
      }
      requestRender();
    },
    portal() { play.portal(); requestRender(); },
    interact() { play.interact(); requestRender(); },
    ufo() { play.ufo(); requestRender(); },
    avatarKey(key: string, pressed: boolean) {
      if (!travelKeys.has(key)) return;
      if (pressed) {
        if (!keys.size) previous = performance.now();
        keys.add(key);
      } else {
        keys.delete(key);
      }
      requestRender();
    },
    blur() { keys.clear(); play.vehicle.clear(); requestRender(); },
    dispose() {
      disposed = true;
      flightId++;
      window.clearTimeout(animationTimer);
      cancelTransition();
      cancelAnimationFrame(request);
      observer.disconnect();
      controls.removeEventListener("change", requestRender);
      controls.removeEventListener("start", startInput);
      controls.removeEventListener("end", endInput);
      controls.dispose();
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", over);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", cancel);
      canvas.removeEventListener("pointerleave", cancel);
      canvas.removeEventListener("webglcontextlost", contextLost);
      document.removeEventListener("visibilitychange", visibility);
      motion.removeEventListener("change", motionChange);
      play.dispose();
      model.dispose();
      planet.dispose();
      sun.shadow.dispose();
      environment?.dispose();
      renderer.dispose();
      if (!lost) renderer.forceContextLoss();
      canvas.remove();
    },
  };

  try {
    if (context.getExtension("KHR_parallel_shader_compile")) await renderer.compileAsync(scene, camera);
    else renderer.compile(scene, camera);
    signal.throwIfAborted();
    if (lost) throw new Error("The WebGL context was lost during startup");
  } catch (error) {
    controller.dispose();
    throw error;
  }
  compiled = true;
  controls.minDistance = globeRadius + 5;
  controls.maxDistance = 164;
  void play.load("moon").then(requestRender).catch(() => {});
  observer.observe(host);
  resize();
  return controller;
}

export type WorldController = Awaited<ReturnType<typeof createWorld>>;
