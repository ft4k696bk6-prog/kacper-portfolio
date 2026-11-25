import * as T from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { gsap } from "gsap";
import { zones, type Zone } from "./content";
import { buildModel, screenPositions, type Hit } from "./model";
import { loadLighting } from "./lighting";

type View = { zone: Zone | null; project: number | null };
type Callbacks = {
  marker: (id: Zone, x: number, y: number, visible: boolean) => void;
  rotate: (angle: number) => void;
  hover: (id: Zone | null) => void;
  select: (hit: Hit) => void;
  lost: () => void;
  rendered: () => void;
};

const initial = { theta: 0.66, phi: 0.956, zoom: 1 };
const overview = new T.Vector3(0, 0.9, 0);
const travelKeys = new Set(["w", "a", "s", "d"]);


export async function createWorld(host: HTMLElement, callbacks: Callbacks, signal: AbortSignal) {
  const low = window.matchMedia("(pointer: coarse)").matches || host.clientWidth < 595;
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const environment = await loadLighting(signal);
  if (signal.aborted) {
    environment.dispose();
    signal.throwIfAborted();
  }
  const canvas = document.createElement("canvas");
  const options: WebGLContextAttributes = { alpha: true, antialias: !low, powerPreference: "high-performance" };
  const context = canvas.getContext("webgl2", options);
  if (!(context instanceof WebGL2RenderingContext)) {
    environment.dispose();
    throw new Error("WebGL 2 is unavailable");
  }
  const renderer = new T.WebGLRenderer({ ...options, canvas, context });
  renderer.setClearColor(0x101210, 0);
  renderer.outputColorSpace = T.SRGBColorSpace;
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  let dpr = Math.min(window.devicePixelRatio || 1, low ? 1.15 : 1.55);
  renderer.setPixelRatio(dpr);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = low ? T.BasicShadowMap : T.PCFShadowMap;
  renderer.shadowMap.autoUpdate = false;
  renderer.domElement.setAttribute("aria-hidden", "true");
  host.append(renderer.domElement);

  const scene = new T.Scene();
  const camera = new T.OrthographicCamera(-19, 19, 13, -13, 0.1, 120);
  const spherical = new T.Spherical(46, initial.phi, initial.theta);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = !motion.matches;
  controls.dampingFactor = 0.074;
  controls.enablePan = false;
  controls.rotateSpeed = 0.6;
  controls.zoomSpeed = 0.88;
  controls.minPolarAngle = 0.47;
  controls.maxPolarAngle = 1.36;
  controls.minZoom = 0.72;
  controls.maxZoom = 3.75;
  controls.mouseButtons = { LEFT: T.MOUSE.ROTATE, MIDDLE: T.MOUSE.DOLLY, RIGHT: T.MOUSE.ROTATE };
  controls.touches = { ONE: T.TOUCH.ROTATE, TWO: T.TOUCH.DOLLY_PAN };
  controls.target.copy(overview);
  camera.position.setFromSpherical(spherical).add(controls.target);
  controls.update();

  scene.environment = environment;
  scene.environmentIntensity = 0.58;

  scene.add(new T.HemisphereLight(0xe2edf6, 0x565d50, 1.42));
  const sun = new T.DirectionalLight(0xffefda, 2.55);
  sun.position.set(-18, 24, 11);
  sun.castShadow = true;
  sun.shadow.mapSize.set(low ? 1024 : 2048, low ? 1024 : 2048);
  sun.shadow.camera.left = -23;
  sun.shadow.camera.right = 23;
  sun.shadow.camera.top = 20;
  sun.shadow.camera.bottom = -20;
  sun.shadow.camera.near = 0.5;
  sun.shadow.camera.far = 75;
  sun.shadow.bias = -0.0002;
  sun.shadow.normalBias = 0.065;
  sun.shadow.intensity = 0.86;
  scene.add(sun);
  const fill = new T.DirectionalLight(0xcbd9f3, 0.97);
  fill.position.set(12, 8, -15);
  scene.add(fill);
  const model = buildModel(requestRender, low);
  scene.add(model.group);
  renderer.shadowMap.needsUpdate = true;

  const size = new T.Vector2();
  const walkOrigin = new T.Vector2();
  const raycaster = new T.Raycaster();
  const pointer = new T.Vector2();
  const projected = new T.Vector3();
  const walkingPlane = new T.Plane(new T.Vector3(0, 1, 0), -0.26);
  const walkRay = new T.Vector3();
  const avatarCenter = new T.Vector2(0, 0.65);
  const keys = new Set<string>();
  let waypoint: T.Vector2 | null = null;
  let travel = 0;
  let request = 0;
  let called = false;
  let paused = document.hidden;
  let disposed = false;
  let lost = false;
  let transition: { tween: gsap.core.Tween; start: number; duration: number } | undefined;
  let current: View = { zone: null, project: null };
  let pointerStart: { id: number; x: number; y: number; time: number } | null = null;
  let previous = 0;
  let samples = 0;
  let elapsed = 0;
  let captureFrames = 0;
  let slowWindows = 0;
  let hover: Zone | null = null;

  function writeCamera(theta: number, phi: number, radius: number, x: number, y: number, z: number, zoom: number) {
    controls.target.set(x, y, z);
    camera.position.setFromSpherical(spherical.set(radius, phi, theta)).add(controls.target);
    camera.zoom = T.MathUtils.clamp(zoom, controls.minZoom, controls.maxZoom);
    camera.updateProjectionMatrix();
    controls.update();
    requestRender();
  }

  function requestRender() {
    if (!disposed && !lost && !paused && !request) request = requestAnimationFrame(frame);
  }

  function resize() {
    if (disposed || lost) return;
    const width = Math.max(host.clientWidth, 1);
    const height = Math.max(host.clientHeight, 1);
    const aspect = width / height;
    const frustum = Math.max(25.4, (low ? 38.8 : 38.2) / aspect);
    camera.left = -frustum * aspect / 2;
    camera.right = frustum * aspect / 2;
    camera.top = frustum / 2;
    camera.bottom = -frustum / 2;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(dpr, Math.sqrt(1_550_000 / (width * height))));
    renderer.setSize(width, height, false);
    size.set(width, height);
    requestRender();
  }

  function moveAvatar(seconds: number) {
    if (!keys.size && !waypoint) {
      model.legs.forEach(leg => { leg.rotation.x = 0; });
      return;
    }
    const position = model.avatar.position;
    const amount = Math.min(seconds, 0.05) * 2.55;
    const dx = Number(keys.has("d")) - Number(keys.has("a"));
    const dz = Number(keys.has("s")) - Number(keys.has("w"));
    const angle = controls.getAzimuthalAngle();
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
    next.setLength(T.MathUtils.clamp(next.length(), 1.79, 3.38)).add(avatarCenter);
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
    if (transition) {
      const progress = Math.min((now - transition.start) / transition.duration, 1);
      transition.tween.progress(Math.max(progress, 0));
      if (progress === 1) {
        cancelTransition();
      }
    }
    moveAvatar(dt / 1000);
    if (!motion.matches) model.beacon.material.emissiveIntensity = 0.7 + Math.sin(now / 560) * 0.21;
    controls.update();
    renderer.render(scene, camera);
    for (const zone of zones) {
      const [x, y, z] = zone.marker;
      projected.set(x, y, z).project(camera);
      callbacks.marker(zone.id, (projected.x * 0.5 + 0.5) * size.x, (0.5 - projected.y * 0.5) * size.y,
        projected.z > -1 && projected.z < 1 && Math.abs(projected.x) < 0.92 && Math.abs(projected.y) < 0.90);
    }
    callbacks.rotate(controls.getAzimuthalAngle());
    if (!called) {
      called = true;
      callbacks.rendered();
    }
    if (captureFrames > 0) captureFrames--;
    if (captureFrames && dt > 0) {
      samples++;
      elapsed += Math.min(dt, 300);
      if (samples === 12) {
        const average = elapsed / samples;
        if (average > (low ? 37 : 26) && dpr > 0.76) {
          dpr = Math.max(0.75, dpr * 0.82);
          resize();
        }
        slowWindows = average > 170 && dpr <= 0.76 ? slowWindows + 1 : 0;
        samples = elapsed = 0;
        if (slowWindows >= 3) {
          callbacks.lost();
          return;
        }
      }
    }
    if (transition || keys.size || waypoint) requestRender();
  }

  function resolveView(view: View) {
    const match = zones.find(place => place.id === view.zone);
    const display = view.project === null ? null : screenPositions[view.project];
    const target = display ? new T.Vector3(display[0], display[1], display[2] - 0.10) : match ? new T.Vector3(...match.target) : overview;
    const angle = match?.angle ?? [initial.theta, initial.phi, 46];
    const scenario = view.project === 3 ? -0.34 : view.project === 4 ? 0.96 : 0.29;
    return {
      theta: display ? scenario : angle[0],
      phi: display ? 1.10 : angle[1],
      radius: display ? 14 : angle[2],
      x: target.x, y: target.y, z: target.z,
      zoom: display ? low ? 3.22 : 3.5 : match ? low ? 2.05 : 2.17 : 1,
    };
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
    current = view;
    cancelTransition();
    freezeOrbit();
    const start = {
      theta: controls.getAzimuthalAngle(), phi: controls.getPolarAngle(),
      radius: camera.position.distanceTo(controls.target),
      x: controls.target.x, y: controls.target.y, z: controls.target.z, zoom: camera.zoom,
    };
    const destination = resolveView(view);
    if (opening && !motion.matches && !view.zone) {
      start.theta -= 0.26;
      start.phi -= 0.097;
      start.zoom *= 0.91;
      writeCamera(start.theta, start.phi, start.radius, start.x, start.y, start.z, start.zoom);
    }
    const turn = destination.theta - start.theta;
    destination.theta = start.theta + Math.atan2(Math.sin(turn), Math.cos(turn));
    if (instant || motion.matches) {
      writeCamera(destination.theta, destination.phi, destination.radius, destination.x, destination.y, destination.z, destination.zoom);
      cancelTransition();
      return;
    }
    captureFrames = 49;
    previous = 0;
    const duration = opening ? 1280 : view.project !== null ? 910 : 1100;
    // The scene clock advances the tween and draws the resulting pose in the same frame.
    const tween = gsap.to(start, {
      ...destination, paused: true, lazy: false, duration: duration / 1000, ease: "power3.inOut",
      onUpdate: () => writeCamera(start.theta, start.phi, start.radius, start.x, start.y, start.z, start.zoom),
    });
    transition = { tween, start: performance.now(), duration };
    requestRender();
  }

  function nudge(theta = 0, phi = 0, zoom = 1) {
    cancelTransition();
    freezeOrbit();
    writeCamera(controls.getAzimuthalAngle() + theta,
      T.MathUtils.clamp(controls.getPolarAngle() + phi, controls.minPolarAngle, controls.maxPolarAngle),
      camera.position.distanceTo(controls.target), controls.target.x, controls.target.y, controls.target.z, camera.zoom * zoom);
    cancelTransition();
  }

  function updatePointer(event: PointerEvent) {
    const rect = canvas.getBoundingClientRect();
    raycaster.setFromCamera(pointer.set(
      (event.clientX - rect.left) / rect.width * 2 - 1,
      1 - (event.clientY - rect.top) / rect.height * 2,
    ), camera);
    return raycaster.intersectObjects(model.hits, false)[0];
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
    const hit = updatePointer(event);
    canvas.style.cursor = hit ? "pointer" : "grab";
    const next = hit ? (hit.object.userData.hit as Hit).zone : null;
    if (next !== hover) {
      hover = next;
      callbacks.hover(hover);
    }
  }

  function up(event: PointerEvent) {
    const start = pointerStart;
    pointerStart = null;
    if (!start || event.pointerId !== start.id || event.timeStamp - start.time > 850 || Math.hypot(event.clientX - start.x, event.clientY - start.y) > 7) return;
    const hit = updatePointer(event);
    if (hit) {
      callbacks.select(hit.object.userData.hit as Hit);
      return;
    }
    const location = raycaster.ray.intersectPlane(walkingPlane, walkRay);
    if (!location) return;
    const step = new T.Vector2(location.x, location.z).sub(avatarCenter);
    if (step.length() < 1.72 || step.length() > 3.5) return;
    keys.clear();
    waypoint = step.setLength(T.MathUtils.clamp(step.length(), 1.79, 3.38));
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
    cancelTransition();
    captureFrames = 49;
    previous = 0;
  }

  function visibility() {
    paused = document.hidden;
    if (paused) {
      keys.clear();
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
    if (motion.matches && transition) moveView(current, true);
  }

  controls.addEventListener("change", requestRender);
  controls.addEventListener("start", startInput);
  canvas.addEventListener("pointerdown", down);
  canvas.addEventListener("pointermove", over);
  canvas.addEventListener("pointerup", up);
  canvas.addEventListener("pointercancel", cancel);
  canvas.addEventListener("pointerleave", cancel);
  canvas.addEventListener("webglcontextlost", contextLost);
  document.addEventListener("visibilitychange", visibility);
  motion.addEventListener("change", motionChange);
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  resize();

  return {
    moveView,
    nudge,
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
    blur() { keys.clear(); requestRender(); },
    dispose() {
      disposed = true;
      cancelTransition();
      cancelAnimationFrame(request);
      observer.disconnect();
      controls.removeEventListener("change", requestRender);
      controls.removeEventListener("start", startInput);
      controls.dispose();
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", over);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", cancel);
      canvas.removeEventListener("pointerleave", cancel);
      canvas.removeEventListener("webglcontextlost", contextLost);
      document.removeEventListener("visibilitychange", visibility);
      motion.removeEventListener("change", motionChange);
      model.dispose();
      sun.shadow.dispose();
      environment.dispose();
      renderer.dispose();
      if (!lost) renderer.forceContextLoss();
      canvas.remove();
    },
  };
}

export type WorldController = Awaited<ReturnType<typeof createWorld>>;
