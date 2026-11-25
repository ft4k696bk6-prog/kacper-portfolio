import * as T from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { gsap } from "gsap";
import { projects, projectStops, sceneStops, zones, type StopId, type Zone } from "./content";
import { buildModel, type Hit } from "./model";
import { loadLighting } from "./lighting";
import { globeDirection, globeRadius, loadPlanet, type SurfaceStop } from "./globe";

type View = { zone: Zone | null; project: number | null };
type Callbacks = {
  marker: (id: StopId, x: number, y: number, visible: boolean) => void;
  hover: (id: StopId | null) => void;
  select: (hit: Hit) => void;
  lost: () => void;
  rendered: () => void;
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
  let planet: Awaited<ReturnType<typeof loadPlanet>>;
  try {
    if (!low) environment = await loadLighting(signal);
    planet = await loadPlanet(software, low, signal);
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
  const camera = new T.PerspectiveCamera(fov, 1, 0.15, 260);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = !motion.matches;
  controls.dampingFactor = software ? 0.17 : 0.074;
  controls.enablePan = false;
  controls.rotateSpeed = 0.59;
  controls.enableZoom = false;
  controls.minPolarAngle = 0.12;
  controls.maxPolarAngle = Math.PI - 0.12;
  controls.mouseButtons = { LEFT: T.MOUSE.ROTATE, RIGHT: T.MOUSE.ROTATE };
  controls.touches = { ONE: T.TOUCH.ROTATE };
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
  let transition: { tween: gsap.core.Tween; start: number; duration: number } | undefined;
  let current: View = { zone: null, project: null };
  let pointerStart: { id: number; x: number; y: number; time: number } | null = null;
  let previous = 0;
  let samples = 0;
  let elapsed = 0;
  let captureFrames = 0;
  let slowWindows = 0;
  let hover: StopId | null = null;

  function overviewDistance() {
    const fraction = Math.min(1, camera.aspect) * (compact ? 0.86 : 0.765);
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
    if (isOverview(current) && !transition) writeCamera({ ...pose, distance: overviewDistance() });
    else if (!transition) writeCamera(resolveView(current));
    requestRender();
  }

  function updateDrawingBuffer(moving: boolean) {
    // The camera uses CSS-pixel dimensions even when the render buffer is smaller.
    const budget = reduceMotionPixels && moving ? Math.min(motionBudget, size.x * size.y * (compact ? 0.24 : 0.31)) * motionScale : pixelBudget;
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
    if (transition) {
      const progress = Math.min((now - transition.start) / transition.duration, 1);
      transition.tween.progress(Math.max(progress, 0));
      if (progress === 1) {
        cancelTransition();
        controls.enabled = isOverview(current);
      }
    }
    moveAvatar(dt / 1000);
    if (!motion.matches) model.beacon.material.emissiveIntensity = 0.34 + Math.sin(now / 760) * 0.08;
    if (!transition && !isOverview(current)) model.loadSurfaces(requestRender);
    const orbitMoved = controls.update();
    const moving = Boolean(transition || interacting || orbitMoved || keys.size || waypoint);
    updateDrawingBuffer(moving);
    if (model.showDetailedCars(!transition && camera.position.distanceToSquared(starCarsSite) < 36 * 36)) {
      renderer.shadowMap.needsUpdate = true;
    }
    fill.position.copy(camera.position).normalize().multiplyScalar(45);
    const approach = T.MathUtils.smoothstep(controls.target.length(), 8, 20);
    const distance = camera.position.distanceTo(controls.target);
    depthFog.near = T.MathUtils.lerp(205, distance * 1.12, approach);
    depthFog.far = T.MathUtils.lerp(290, distance * 2.85, approach);
    renderer.render(scene, camera);
    for (const zone of sceneStops) {
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
    if (transition || keys.size || waypoint) requestRender();
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
    if (instant || motion.matches || (opening && !isOverview(view))) {
      writeCamera(destination);
      controls.enabled = isOverview(view);
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
    transition = { tween, start: performance.now(), duration };
    requestRender();
  }

  function nudge(theta = 0, phi = 0) {
    if (!isOverview(current)) return;
    cancelTransition();
    freezeOrbit();
    const spherical = new T.Spherical().setFromVector3(camera.position);
    spherical.theta += theta;
    spherical.phi = T.MathUtils.clamp(spherical.phi + phi, controls.minPolarAngle, controls.maxPolarAngle);
    writeCamera({ target: overview, direction: new T.Vector3().setFromSpherical(spherical).normalize(), distance: overviewDistance() });
    controls.enabled = true;
    controls.enableDamping = !motion.matches;
  }

  function updatePointer(event: PointerEvent) {
    const rect = canvas.getBoundingClientRect();
    raycaster.setFromCamera(pointer.set(
      (event.clientX - rect.left) / rect.width * 2 - 1,
      1 - (event.clientY - rect.top) / rect.height * 2,
    ), camera);
    const hit = raycaster.intersectObjects(model.hits, false)[0];
    const surface = raycaster.ray.intersectSphere(planetSphere, planetHit);
    return hit && (!surface || hit.distance <= raycaster.ray.origin.distanceTo(surface) + 0.04) ? hit : undefined;
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
    const hit = updatePointer(event);
    if (hit) {
      callbacks.select(hit.object.userData.hit as Hit);
      return;
    }
    if (transition || model.sites.hq.normal.dot(camera.position) < globeRadius) return;
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

  const controller = {
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
  observer.observe(host);
  resize();
  return controller;
}

export type WorldController = Awaited<ReturnType<typeof createWorld>>;
