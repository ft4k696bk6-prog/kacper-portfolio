import * as T from "three";
import { findCount, type Body, type FindId } from "./discoveries";
import { alignRadially, box, disposeObjects, gamePalette, solid } from "./gameObjects";
import { globeDirection, globeRadius, makeSurfaceSites, type SurfaceStop } from "./globe";
import { makeRoads, roadMeshes, surfaceRadius } from "./terrain";
import { createVehicle } from "./vehicle";
import { impactDirection, lakeDirection, makeWorldLife, portDirection, volcanoDirection } from "./worldLife";
import { createWorldSound } from "./worldSound";
import type { Satellite } from "./satellites";

export type Beacon = "moon" | "ufo" | "nearby";
const hiddenCenter = new T.Vector3(102, 20, -126);
const worldSpan = 38;
type Hooks = {
  found: (id: FindId) => void;
  enter: (id: SurfaceStop) => void;
  voyage: (body: Body) => void;
};

export function createPlay(scene: T.Scene, low: boolean, compact: boolean, hooks: Hooks) {
  const p = gamePalette();
  const roads = makeRoads();
  const home = new T.Group();
  const paved = roadMeshes(roads);
  home.add(paved);
  scene.add(home);
  const life = makeWorldLife(p, roads, low);
  const sound = createWorldSound();
  const unlocked = new Set<FindId>();
  let ended = false;
  let moon: Satellite | undefined;
  let signal: Satellite | undefined;
  let moonPending: Promise<Satellite> | undefined;
  let signalPending: Promise<Satellite> | undefined;
  let currentBody: Body = "home";
  let time = 0;
  let motion = true;
  let decorate = !low;
  let erupted = false;
  let ufoVisible = false;
  let stormActive = false;
  let landedMeteor = false;
  let portalTime = -1;
  let strikes = 0;
  let nearby: (() => void) | undefined;
  const homePoint = new T.Vector3(), center = new T.Vector3(), point = new T.Vector3(), cameraRay = new T.Vector3();
  const nearHits: { root: T.Object3D; action: () => void; id?: FindId }[] = [];
  const worldSphere = new T.Sphere();
  const rayPoint = new T.Vector3();
  const portals = new T.Group();
  const ringMaterial = new T.MeshLambertMaterial({ color: 0x62b8ab, emissive: 0x2d8362, emissiveIntensity: .33 });
  const ring = solid(new T.TorusGeometry(.49, .068, 8, 28), ringMaterial, 0, .63);
  const iris = solid(new T.CircleGeometry(.46, 32), new T.MeshBasicMaterial({ color: 0x93f5b3, side: T.DoubleSide, transparent: true, opacity: .65, depthWrite: false }), 0, .63);
  iris.visible = false;
  portals.add(box(1.04, .15, .70, p.ink, 0, .075), ring, iris);
  const lab = makeSurfaceSites().lab;
  const portalDirection = new T.Vector3(lab.x + 3.84, 0, lab.z + 1.38).applyMatrix4(lab.matrix).normalize();
  alignRadially(portals, portalDirection, surfaceRadius(portalDirection));
  home.add(portals);

  function find(id: FindId) {
    if (unlocked.has(id)) return;
    unlocked.add(id);
    sound.play("find");
    hooks.found(id);
  }
  function fromHome(id: FindId, direction: T.Vector3, object: T.Object3D, height = .07, action?: () => void) {
    const root = new T.Group().add(object);
    alignRadially(root, direction, surfaceRadius(direction) + height);
    home.add(root);
    nearHits.push({ root, id, action: action ?? (() => { find(id); object.scale.setScalar(1.12); }) });
    return root;
  }
  const chest = new T.Group().add(box(.66, .38, .44, p.moss, 0, .20), box(.69, .12, .46, p.ink, 0, .35),
    box(.16, .10, .05, p.gold, 0, .34, .24));
  const chestDirection = portDirection.clone().add(new T.Vector3(.011, .017, -.032)).normalize();
  fromHome("chest", chestDirection, chest, .14, () => { chest.children[1].rotateX(-.4); find("chest"); });

  const spark = new T.Group().add(solid(new T.TorusGeometry(.15, .045, 8, 15), p.gold, 0, .44),
    box(.08, .40, .07, p.gold, 0, .18), box(.18, .074, .074, p.gold, .07, .03));
  fromHome("gold", globeDirection(-23, -43), spark);
  const pearl = solid(new T.SphereGeometry(.19, 13, 9), p.crystal, 0, .12);
  fromHome("lake", lakeDirection.clone().add(new T.Vector3(.014, .013, -.025)).normalize(), pearl, .23);
  const cave = new T.Group().add(solid(new T.OctahedronGeometry(.24), p.crystal, 0, .18));
  const cavePoint = new T.Vector3(0, 0, 3.63).applyQuaternion(new T.Quaternion().setFromUnitVectors(T.Object3D.DEFAULT_UP, volcanoDirection)).addScaledVector(volcanoDirection, globeRadius).normalize();
  fromHome("cave", cavePoint, cave);
  const billboard = new T.Group();
  const type = document.createElement("canvas");
  type.width = 384; type.height = 160;
  const ctx = type.getContext("2d")!;
  ctx.fillStyle = "#ebad69"; ctx.fillRect(0, 0, 384, 160);
  ctx.fillStyle = "#403b48";
  ctx.beginPath(); ctx.arc(64, 68, 23, 0, Math.PI * 2); ctx.arc(126, 68, 23, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(95, 104, 51, 43, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#edbc7c";
  ctx.beginPath(); ctx.ellipse(95, 114, 23, 17, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#403b48";
  ctx.font = "bold 57px sans-serif"; ctx.fillText("BERNI", 166, 83);
  ctx.font = "bold 25px sans-serif"; ctx.fillText("EXPRESS", 167, 119);
  const billboardTexture = new T.CanvasTexture(type);
  billboardTexture.colorSpace = T.SRGBColorSpace;
  billboard.add(box(1.41, .60, .13, p.ink, 0, .83),
    solid(new T.PlaneGeometry(1.33, .56), new T.MeshLambertMaterial({ map: billboardTexture, side: T.DoubleSide }), 0, .83, .070));
  for (const x of [-.45, .45]) billboard.add(box(.073, .62, .073, p.ink, x, .33));
  fromHome("billboard", globeDirection(7, -19), billboard);

  const debris = new T.Group();
  const meteor = solid(new T.IcosahedronGeometry(.51, 1), p.ink, 0, .33);
  const fragment = solid(new T.OctahedronGeometry(.28), p.gold, 0, .30);
  fragment.visible = false;
  debris.add(meteor, fragment);
  const impactSite = fromHome("impact", impactDirection, debris, .05, () => {
    if (strikes < 3) {
      meteor.rotation.y += .61;
      meteor.scale.multiplyScalar(.86);
      strikes++;
    }
    if (strikes >= 3) {
      meteor.visible = false;
      fragment.visible = true;
      find("impact");
    }
  });
  const vehicle = createVehicle(p, low, find, hooks.enter);
  home.add(vehicle.group, life.group);

  function portal() {
    if (portalTime >= 0) return;
    find("terminal");
    portalTime = time;
    iris.visible = true;
    sound.play("warp");
    if (!motion) {
      portalTime = -1;
      iris.visible = false;
      hooks.voyage("signal");
    }
  }

  nearHits.push({ root: portals, action: portal, id: "terminal" });
  nearHits.push({ root: life.observatory, action: () => life.summon(motion ? time : 1) });
  nearHits.push({ root: life.ufo, id: "ufo", action: () => { find("ufo"); sound.play("ufo"); hooks.voyage("signal"); } });

  function updateMoon() {
    if (!moon) return;
    const angle = (compact ? -.47 : -.86) + time * .016;
    if (compact) {
      moon.root.position.set(Math.cos(angle) * worldSpan * .68, Math.cos(angle) * worldSpan * .77, Math.sin(angle) * worldSpan);
    } else {
      moon.root.position.set(Math.cos(angle) * worldSpan, 9.2 + Math.sin(time * .017) * 5.7, Math.sin(angle) * worldSpan);
    }
  }

  async function load(body: Exclude<Body, "home">) {
    const existing = body === "moon" ? moon : signal;
    if (existing) return existing;
    let pending = body === "moon" ? moonPending : signalPending;
    if (!pending) {
      pending = import("./satellites").then(({ makeSatellite }) => {
        const result = makeSatellite(body, low);
        if (ended) { result.dispose(); return result; }
        if (body === "moon") {
          moon = result;
          moon.root.visible = currentBody !== "signal";
          updateMoon();
        } else {
          signal = result;
          signal.root.position.copy(hiddenCenter);
          signal.root.visible = false;
        }
        scene.add(result.root);
        return result;
      });
      if (body === "moon") moonPending = pending;
      else signalPending = pending;
    }
    try { return await pending; } catch (error) {
      if (body === "moon") moonPending = undefined;
      else signalPending = undefined;
      throw error;
    }
  }

  function bodyFocus(body: Body, result: T.Vector3) {
    return result.copy(body === "moon" && moon ? moon.root.position : body === "signal" ? hiddenCenter : homePoint);
  }

  function setBody(body: Body) {
    currentBody = body;
    home.visible = body !== "signal";
    if (moon) moon.root.visible = body !== "signal";
    if (signal) signal.root.visible = body === "signal";
  }

  function tick(dt: number, animate: boolean, effects: boolean, mode: string) {
    motion = animate;
    decorate = effects;
    if (animate) time += Math.min(dt, .1);
    if (currentBody === "home") {
      vehicle.step(dt, decorate);
      const weather = life.update(time, animate, decorate);
      if (weather.impact) landedMeteor = true;
      impactSite.visible = landedMeteor || unlocked.has("impact") || !animate;
      stormActive = weather.storm;
      if (weather.eruption && !erupted) sound.play("rumble");
      if (life.ufo.visible && !ufoVisible) sound.play("ufo");
      erupted = weather.eruption;
      ufoVisible = life.ufo.visible;
      if (portalTime >= 0) {
        ringMaterial.emissiveIntensity = .6 + Math.min(time - portalTime, 1.4) * .8;
        iris.scale.setScalar(.44 + Math.min(time - portalTime, 1) * .62);
        if (time - portalTime >= 1.13 || !animate) {
          portalTime = -1;
          iris.visible = false;
          hooks.voyage("signal");
        }
      }
      sound.tick(vehicle.speed, mode === "drive");
    } else {
      sound.tick(0, false);
    }
    const medal = unlocked.size >= findCount;
    reward.visible = medal && currentBody === "home";
    if (reward.visible) medalCore.rotation.y = time * .30;
    // Keep the orbit paused while the moon is the camera's target.
    if (currentBody === "home") updateMoon();
    if (moon?.root.visible) moon.update(time, animate && currentBody === "moon");
    if (signal?.root.visible) signal.update(time, animate && currentBody === "signal");
    return time;
  }
  const reward = new T.Group();
  const medalRing = solid(new T.TorusGeometry(1.05, .084, 10, 35), p.gold, 0, 2.01);
  const medalCore = solid(new T.IcosahedronGeometry(.74, 1), p.crystal, 0, 2.02);
  reward.add(medalRing, medalCore, solid(new T.CylinderGeometry(.72, .84, .16, 16), p.ink, 0, .08));
  const rewardNormal = globeDirection(0, 8);
  home.add(alignRadially(reward, rewardNormal, surfaceRadius(rewardNormal)));
  reward.visible = false;

  function possible() {
    const list = currentBody === "home" ? nearHits : (currentBody === "moon" ? moon : signal)?.targets.map(({ id, object }) => ({
      root: object, id, action: () => { find(id); object.scale.multiplyScalar(1.045); },
    })) ?? [];
    return list.filter(item => item.root.visible && (!item.id || !unlocked.has(item.id) || item.id === "terminal" || item.id === "ufo"));
  }

  function clearLine(object: T.Object3D, origin: T.Vector3) {
    object.getWorldPosition(point);
    bodyFocus(currentBody, center);
    cameraRay.copy(origin).sub(point);
    return point.clone().sub(center).dot(cameraRay) > -0.013;
  }

  function projectBeacons(camera: T.Camera, project: (key: Beacon, point: T.Vector3 | null) => void) {
    project("moon", currentBody === "home" && moon?.root.visible ? moon.root.position : null);
    project("ufo", currentBody === "home" && life.ufo.visible && clearLine(life.ufo, camera.position) ? life.ufo.position : null);
    let previous = Infinity;
    let here: T.Vector3 | null = null;
    nearby = undefined;
    for (const item of possible()) {
      if (item.root === life.ufo || !clearLine(item.root, camera.position)) continue;
      const distance = point.distanceToSquared(camera.position);
      if (distance >= previous || distance > (currentBody === "home" ? 20 : 46) ** 2) continue;
      const projected = rayPoint.copy(point).project(camera);
      if (Math.abs(projected.x) > .84 || Math.abs(projected.y) > .82 || Math.abs(projected.z) > 1) continue;
      previous = distance;
      here ??= new T.Vector3();
      here.copy(point);
      nearby = item.action;
    }
    project("nearby", here);
  }

  function pick(ray: T.Raycaster, near: number) {
    if (currentBody === "home" && moon?.root.visible) {
      worldSphere.set(moon.root.position, moon.radius);
      if (ray.ray.intersectSphere(worldSphere, rayPoint) && rayPoint.distanceTo(ray.ray.origin) < near) {
        return () => hooks.voyage("moon");
      }
    }
    if (currentBody !== "home") {
      const world = currentBody === "moon" ? moon : signal;
      worldSphere.set(bodyFocus(currentBody, center), (world?.radius ?? 1) - .15);
      if (ray.ray.intersectSphere(worldSphere, rayPoint)) near = rayPoint.distanceTo(ray.ray.origin);
    }
    let action: (() => void) | undefined;
    for (const item of possible()) {
      if (!clearLine(item.root, ray.ray.origin)) continue;
      const hits = ray.intersectObject(item.root, true).filter(hit => hit.object.visible);
      const distance = hits[0]?.distance ?? Infinity;
      if (!hits.length || distance > near + .20) continue;
      near = distance;
      action = item.action;
    }
    return action;
  }
  return {
    vehicle, sound, load, tick, setBody, bodyFocus, projectBeacons, pick, portal,
    showHome() { home.visible = true; },
    get storm() { return stormActive && currentBody === "home"; },
    cull(eye: T.Vector3) { if (currentBody === "home") life.cull(eye); },
    setFinds(ids: FindId[]) { for (const id of ids) unlocked.add(id); },
    scan() { life.summon(motion ? time : 1); },
    horn() { sound.play("horn"); vehicle.horn(); },
    ufo() { if (life.ufo.visible) { find("ufo"); hooks.voyage("signal"); } },
    interact() { nearby?.(); },
    dispose() {
      ended = true;
      moon?.dispose();
      signal?.dispose();
      billboardTexture.dispose();
      disposeObjects(home);
      sound.dispose();
    },
  };
}
