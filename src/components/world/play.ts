import * as T from "three";
import { findCount, type Body, type FindId, type SecretBody } from "./discoveries";
import { alignRadially, box, disposeObjects, gamePalette, solid } from "./gameObjects";
import { globeDirection, globeRadius, makeSurfaceSites } from "./globe";
import { surfaceRadius } from "./terrain";
import { isSecretBody, planets } from "./planets";
import { makeDistrict } from "./district";
import { impactDirection, lakeDirection, makeWorldLife, observatoryDirection, portDirection, ridgeDirection, volcanoDirection } from "./worldLife";
import { createWorldSound } from "./worldSound";
import type { Satellite } from "./satellites";

export type Beacon = "moon" | "ufo" | "nearby" | "landmark";
type Hooks = {
  found: (id: FindId) => void;
  voyage: (body: Body) => void;
  observatory: () => void;
};

export function createPlay(scene: T.Scene, low: boolean, hooks: Hooks) {
  const p = gamePalette();
  const home = new T.Group();
  scene.add(home);
  const life = makeWorldLife(p, low);
  const sound = createWorldSound();
  const unlocked = new Set<FindId>();
  let ended = false;
  const satellites = new Map<SecretBody, Satellite>();
  const loading = new Map<SecretBody, Promise<Satellite>>();
  let currentBody: Body | null = "home";
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
  const center = new T.Vector3(), point = new T.Vector3(), cameraRay = new T.Vector3();
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
  const pearl = solid(new T.SphereGeometry(.19, 13, 9), p.crystal, 0, .12);
  fromHome("lake", lakeDirection.clone().add(new T.Vector3(.014, .013, -.025)).normalize(), pearl, .23);
  const cave = new T.Group().add(solid(new T.OctahedronGeometry(.24), p.crystal, 0, .18));
  const cavePoint = new T.Vector3(0, 0, 3.63).applyQuaternion(new T.Quaternion().setFromUnitVectors(T.Object3D.DEFAULT_UP, volcanoDirection)).addScaledVector(volcanoDirection, globeRadius).normalize();
  fromHome("cave", cavePoint, cave);
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
  const campus = makeDistrict("home", low, { find, alert: (mode) => sound.play(mode), portal: () => portal(), beat: () => {} });
  home.add(life.group, campus.root);
  for (const entry of campus.interactive) nearHits.push(entry);

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
  nearHits.push({ root: life.observatory, action: hooks.observatory });
  nearHits.push({ root: life.ufo, id: "ufo", action: () => { find("ufo"); sound.play("ufo"); hooks.voyage("signal"); } });

  async function load(body: SecretBody) {
    let pending = loading.get(body);
    if (!pending) {
      pending = import("./satellites").then(({ makeSatellite }) => {
        const result = makeSatellite(body, low);
        if (ended) { result.dispose(); return result; }
        result.root.position.fromArray(planets[body].center);
        result.root.visible = false;
        satellites.set(body, result);
        scene.add(result.root);
        return result;
      });
      loading.set(body, pending);
    }
    try { return await pending; } catch (error) { loading.delete(body); throw error; }
  }

  function release(body: SecretBody) {
    const satellite = satellites.get(body);
    if (!satellite) return;
    satellite.root.removeFromParent();
    satellite.dispose();
    satellites.delete(body);
    loading.delete(body);
  }

  function bodyFocus(body: Body | null, result: T.Vector3) {
    if (!body) return result.set(0, 0, 0);
    return result.fromArray(planets[body].center);
  }

  function setBody(body: Body | null) {
    currentBody = body;
    home.visible = body === "home";
    satellites.forEach((satellite, id) => { satellite.root.visible = body === id; });
    sound.setScene(body);
  }

  function tick(dt: number, animate: boolean, effects: boolean) {
    motion = animate;
    decorate = effects;
    if (animate) time += Math.min(dt, .1);
    if (currentBody === "home") {
      campus.update(time, decorate);
      const weather = life.update(time, animate, decorate);
      if (weather.impact) landedMeteor = true;
      impactSite.visible = landedMeteor || unlocked.has("impact") || !animate;
      stormActive = weather.storm;
      if (weather.eruption && !erupted) sound.play("rumble");
      if (life.ufo.visible && !ufoVisible) sound.play("ufo");
      erupted = weather.eruption;
      ufoVisible = life.ufo.visible;
    }
    if (portalTime >= 0) {
      ringMaterial.emissiveIntensity = .6 + Math.min(time - portalTime, 1.4) * .8;
      iris.scale.setScalar(.44 + Math.min(time - portalTime, 1) * .62);
      if (time - portalTime >= 1.13 || !animate) {
        portalTime = -1;
        iris.visible = false;
        hooks.voyage("signal");
      }
    }
    sound.tick(time);
    const medal = unlocked.size >= findCount;
    reward.visible = medal && currentBody === "home";
    if (reward.visible) medalCore.rotation.y = time * .30;
    if (isSecretBody(currentBody)) satellites.get(currentBody)?.update(time, animate);
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
    const list = currentBody === "home" ? nearHits : (isSecretBody(currentBody) ? satellites.get(currentBody) : undefined)?.targets.map(({ id, object }) => ({
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
    if (isSecretBody(currentBody)) {
      const world = satellites.get(currentBody);
      worldSphere.set(bodyFocus(currentBody, center), (world?.radius ?? 1) - .32);
      if (ray.ray.intersectSphere(worldSphere, rayPoint)) near = Math.min(near, rayPoint.distanceTo(ray.ray.origin));
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
    sound, load, release, tick, setBody, bodyFocus, projectBeacons, pick, portal, find, bounds: [...campus.bounds,
      { normal: volcanoDirection, radius: .18, height: 2.75 },
      { normal: ridgeDirection, radius: .13, height: 3.73 },
      { normal: observatoryDirection, radius: .09, height: 2.68 },
      { normal: portDirection, radius: .092, height: 1.7 }],
    homeSurface: home,
    get storm() { return stormActive && currentBody === "home"; },
    cullHome: life.cull,
    setFinds(ids: FindId[]) { for (const id of ids) unlocked.add(id); },
    scan() { life.summon(motion ? time : 1); },
    ufo() { if (life.ufo.visible) { find("ufo"); hooks.voyage("signal"); } },
    interact() { nearby?.(); },
    dispose() {
      ended = true;
      for (const body of satellites.keys()) release(body);
      disposeObjects(home);
      sound.dispose();
    },
  };
}
