import * as T from "three";
import { alignRadially, box, gamePalette, solid } from "./gameObjects";
import { makeCar } from "./vehicle";
import { frontNormal, worldSurface } from "./planetSurface";
import { createTraffic, laneMesh, makeLane, regionFrame, ringWaypoints, type Lane, type TrafficKind } from "./routes";
import { planets } from "./planets";
import { globeDirection } from "./globe";
import { surfaceRadius, terrainField } from "./terrain";
import type { FindId, ProjectBody } from "./discoveries";

type Action = { root: T.Object3D; action: () => void };
type Effects = { find: (id: FindId) => void; alert: (mode: "horn" | "find" | "warp" | "launch") => void; portal: () => void; beat: (style: number) => void };

const ring = Math.PI * 2;
const path = (time: number, length: number) => T.MathUtils.euclideanModulo(time, length);

export function makeDistrict(id: ProjectBody | "home", low: boolean, effects: Effects) {
  const root = new T.Group(), traffic = createTraffic();
  const p = gamePalette();
  const colors = planets[id].colors;
  const north = id === "home" ? globeDirection(25, -26) : frontNormal;
  const detail = regionFrame(north);
  const surface = id === "home" ? {
    radius: surfaceRadius, land: (direction: T.Vector3) => terrainField(direction) > .65,
    contour: (direction: T.Vector3) => terrainField(direction) - .65,
  } : worldSurface(id);
  const radius = planets[id].radius;
  const wall = new T.MeshLambertMaterial({ color: colors[3] });
  const garden = new T.MeshLambertMaterial({ color: colors[2] });
  const roof = new T.MeshLambertMaterial({ color: colors[0] });
  const accent = new T.MeshLambertMaterial({ color: colors[1], emissive: colors[1], emissiveIntensity: .37 });
  const animate: ((time: number, fx: boolean) => void)[] = [];
  const interactive: Action[] = [];
  const bounds: { normal: T.Vector3; radius: number; height: number }[] = [];
  const lanes: Lane[] = [];
  const output = new T.Vector3();

  function position(east: number, south: number, center = north) {
    const basis = center === north ? detail : regionFrame(center);
    return center.clone().addScaledVector(basis.east, east).addScaledVector(basis.south, south).normalize();
  }
  function district(east: number, south: number, spread = .063, height = 2.1, back = false) {
    const normal = position(east, south, back ? north.clone().negate() : north);
    const group = new T.Group();
    root.add(alignRadially(group, normal, surface.radius(normal) + .035));
    bounds.push({ normal, radius: spread, height });
    return group;
  }
  function secret(object: T.Object3D, name: FindId, action?: () => void) {
    interactive.push({ root: object, action: () => { effects.find(name); action?.(); } });
  }
  function lane(kind: TrafficKind, size: number, center = north, squash = 1) {
    const candidates = kind === "water" ? [size, size * .63] : [size, size + .13, size + .25, size + .36];
    for (const width of candidates) {
      const created = makeLane(kind, ringWaypoints(center, width, 14, squash), surface, bounds);
      if (created) { lanes.push(created); return created; }
    }
    return null;
  }
  function booth(group: T.Group, x: number, z: number, height: number, tint = wall) {
    const building = new T.Group();
    building.position.set(x, 0, z);
    building.add(box(1.16, height, .86, tint, 0, height / 2), box(1.25, .12, .96, roof, 0, height),
      box(.26, .46, .08, p.ink, .25, .25, .45));
    for (let y = .58; y < height - .13; y += .40) {
      building.add(box(.63, .17, .062, p.glass, -.10, y, .45), box(.055, .16, .57, p.glass, .61, y, -.04));
    }
    group.add(building);
    return building;
  }
  function planter(group: T.Group, x: number, z: number) {
    group.add(box(.54, .14, .52, roof, x, .07, z),
      solid(new T.SphereGeometry(.23, 9, 6).scale(.87, 1.32, .83), garden, x, .33, z),
      solid(new T.SphereGeometry(.084, 7, 5), p.warm, x + .15, .41, z + .05));
  }
  function lamp(group: T.Group, x: number, z: number) {
    group.add(solid(new T.CylinderGeometry(.035, .084, .91, 7), p.ink, x, .46, z),
      solid(new T.SphereGeometry(.11, 8, 6), p.warm, x, .98, z));
  }
  function citizen(material = p.coral, alien = false) {
    const figure = new T.Group();
    const head = solid(new T.SphereGeometry(.18, 10, 8), alien ? p.crystal : p.chalk, 0, .60, .025);
    const coat = box(.28, .31, .22, material, 0, .34, 0, .09);
    const legs = [-1, 1].map(side => box(.085, .24, .12, p.ink, side * .08, .12));
    figure.add(head, coat, ...legs);
    const arm = box(.092, .25, .092, material, .189, .36, 0, .04);
    arm.geometry.translate(0, -.08, 0);
    figure.add(arm, solid(new T.SphereGeometry(.028, 6, 5), p.ink, -.065, .62, .178),
      solid(new T.SphereGeometry(.028, 6, 5), p.ink, .065, .62, .178));
    return { figure, arm, move(t: number) { legs.forEach((leg, i) => { leg.rotation.x = Math.sin(t * 8 + i * Math.PI) * .45; }); }};
  }
  function signalWire(group: T.Group, start: T.Vector3, end: T.Vector3, offset: number) {
    const line = new T.LineCurve3(start, end);
    group.add(solid(new T.TubeGeometry(line, 5, .027, 5, false), accent));
    const packet = solid(new T.SphereGeometry(.093, 8, 6), p.warm);
    group.add(packet);
    animate.push(t => packet.position.copy(start).lerp(end, path(t * .44 + offset, 1)));
    return packet;
  }
  function vessel(cargo = false) {
    const boat = new T.Group();
    const hull = solid(new T.CapsuleGeometry(.23, .82, 5, 9), p.coral, 0, .15, 0);
    hull.rotation.x = Math.PI / 2;
    hull.scale.y = 1.34;
    boat.add(hull, box(.39, .14, 1.04, p.chalk, 0, .29), box(.27, .19, .36, p.glass, 0, .45, -.31));
    if (cargo) for (const x of [-.1, .13]) for (const z of [-.04, .28]) boat.add(box(.20, .19, .28, x > 0 ? p.warm : p.sea, x, .43, z));
    return boat;
  }

  // The campus is a clear area around the reused project landmark. Loops run outside its footprint.
  bounds.push({ normal: north, radius: id === "home" ? .19 : .29, height: id === "ai" ? 6.3 : 4.8 });
  const town = district(id === "jalapeno" ? 0 : -.38, id === "jalapeno" ? 0 : .045, .089, 3.4);
  let mainPoint: T.Vector3 | undefined;
  if (id === "starcars") {
    booth(town, -.62, 0, 1.31);
    booth(town, .65, .2, .98, p.coral);
    town.add(box(2, .15, .97, p.ink, 0, .69, 1.15));
    for (let x = -.84; x <= .84; x += .28) town.add(box(.14, .032, .95, p.warm, x, .78, 1.15));
    const container = district(.44, .17, .10, 3.4);
    container.add(box(2.21, .15, 1.72, roof, 0, .08), box(.86, .69, 1.64, p.coral, -.48, .48),
      box(.86, .12, 1.64, p.chalk, -.48, .88), box(.89, .66, .09, p.ink, -.48, .48, .86));
    const hoist = new T.Group();
    hoist.position.set(.63, .2, -.55);
    hoist.add(box(.12, 1.58, .16, p.ink, 0, .79), box(1.33, .14, .18, p.chalk, -.46, 1.59));
    const cargo = box(.50, .38, .56, p.sea, -.89, .35, 0);
    hoist.add(cargo);
    container.add(hoist);
    let signalTime = -20;
    let time = 0;
    animate.push(t => {
      time = t;
      hoist.rotation.y = Math.sin(t * .67) * .66;
      cargo.position.y = .35 + T.MathUtils.smoothstep(Math.sin(t * .9), -.33, .93) * .76;
      if (t - signalTime < 4) cargo.rotation.y = t * .7;
    });
    secret(hoist, "chest", () => { signalTime = time; });
    const champion = makeCar(p, true).root;
    champion.position.set(-.48, .19, 1.14);
    champion.scale.setScalar(.62);
    champion.traverse(item => { if (item instanceof T.Mesh && item.material === p.coral) item.material = p.gold; });
    container.add(champion);
    secret(champion, "gold", () => effects.alert("horn"));
    const signal = solid(new T.SphereGeometry(.22, 11, 7), p.warm, .63, .31, 1.02);
    container.add(signal);
    secret(signal, "horn", () => effects.alert("horn"));
    const road = lane("road", .67, frontNormal, .86) ?? lane("road", .61);
    if (road) {
      for (let i = 0; i < (low ? 3 : 5); i++) {
        const car = makeCar(p, true).root;
        car.scale.setScalar(i === 0 ? .73 : .53);
        if (i === 0) {
          const deck = box(.86, .22, 1.43, p.ink, 0, .45, -.32);
          const payload = makeCar(p, true).root;
          payload.position.set(0, .56, -.34);
          payload.scale.setScalar(.48);
          car.add(deck, payload);
          secret(car, "ramp", () => effects.alert("horn"));
        }
        traffic.add(car, road, 2.42, i / (low ? 3 : 5), .17);
      }
    }
    const tide = lane("water", .16, new T.Vector3(.72, .1, -.70).normalize());
    const freight = district(-.76, .29, .10, 2.4);
    freight.add(box(2.17, .18, 1.27, roof, 0, .08), box(.68, .46, .89, p.coral, .58, .34),
      box(.68, .53, .85, p.glass, -.52, .38), box(.092, 1.26, .12, p.chalk, .86, .69, -.57),
      box(1.3, .11, .11, p.warm, .23, 1.31, -.57));
    traffic.add(vessel(true), tide, .85, .18);
  } else if (id === "reenergy") {
    const gardenPad = district(.35, .16, .10, 3.6);
    const sunPanels = new T.Group();
    gardenPad.add(sunPanels);
    for (const x of [-.95, 0, .95]) for (const z of [-.59, .2, .99]) {
      const panel = new T.Group();
      panel.position.set(x, .5, z);
      panel.add(box(.74, .062, .53, p.ink), box(.67, .026, .46, p.glass, 0, .044),
        box(.021, .032, .45, p.chalk, 0, .059), box(.68, .033, .018, p.chalk, 0, .060));
      panel.rotation.x = .52;
      sunPanels.add(panel);
      gardenPad.add(box(.084, .47, .081, p.ink, x, .25, z));
    }
    const wind = district(-.34, -.20, .09, 4);
    for (const [i, x] of [-1, 0, 1].entries()) {
      const mill = new T.Group();
      mill.position.set(x * 1.24, 0, i * -.28);
      mill.add(solid(new T.CylinderGeometry(.053, .13, 1.91 + i * .17, 10), p.chalk, 0, .95 + i * .085));
      const rotor = new T.Group();
      rotor.position.set(0, 1.96 + i * .17, .16);
      rotor.add(solid(new T.SphereGeometry(.128, 10, 8), p.ink));
      for (let j = 0; j < 3; j++) {
        const blade = new T.Group();
        blade.rotation.z = j * ring / 3;
        blade.add(box(.12, .82, .065, p.chalk, 0, .47), box(.099, .12, .064, p.coral, 0, .79));
        rotor.add(blade);
      }
      mill.add(rotor);
      wind.add(mill);
      animate.push(t => { rotor.rotation.z = t * (1.63 + i * .25); });
    }
    const storage = district(.23, -.37, .091, 2.4);
    const battery = booth(storage, 0, 0, 1.38, p.moss);
    for (const x of [-.73, .73]) storage.add(box(.34, .91, .37, p.ink, x, .47),
      box(.20, .61, .08, accent, x, .55, .22));
    const touched = new Set<T.Object3D>();
    let surge = -20, time = 0;
    for (const object of [wind, battery, sunPanels]) interactive.push({ root: object, action: () => {
      touched.add(object);
      if (touched.size === 3) { effects.find("grid"); surge = time; touched.clear(); }
      effects.alert("find");
    } });
    animate.push(t => {
      time = t;
      sunPanels.children.forEach(panel => { panel.rotation.x = .47 + .20 * Math.sin(t * .17); });
      accent.emissiveIntensity = t - surge < 4 ? 1.45 : .39 + .22 * Math.sin(t * 2.2);
    });
    root.updateMatrixWorld(true);
    signalWire(root, wind.position.clone().multiplyScalar(1.045), storage.position.clone().multiplyScalar(1.052), .25);
    for (const x of [-.73, .66]) booth(town, x, 0, .96, p.chalk);
    const loop = lane("walk", .58);
    for (let i = 0; i < 3; i++) {
      const worker = citizen(i ? p.sea : p.warm);
      traffic.add(worker.figure, loop, .47, i * .33, 0, worker.move);
    }
  } else if (id === "b-crm") {
    for (let i = 0; i < 4; i++) booth(town, (i % 2 - .5) * 1.68, (Math.floor(i / 2) - .5) * 1.39, 1.25 + i * .50, i % 2 ? p.chalk : wall);
    const data = district(.42, .21, .13, 4.2);
    const stack = booth(data, 0, .13, 2.59, p.ink);
    const bars: T.Mesh[] = [];
    for (let i = 0; i < 7; i++) {
      const line = box(.105, .62, .057, i % 2 ? p.crystal : p.warm, (i - 3) * .143, .53, .61);
      bars.push(line);
      data.add(line);
    }
    const sides = [-1.25, 1.25].map(x => booth(data, x, -.21, 1.36, roof));
    sides.forEach((tower, i) => signalWire(data, stack.position.clone().add(new T.Vector3(0, 1.31, .28)),
      tower.position.clone().add(new T.Vector3(0, .78, .40)), i * .56));
    let priority = false;
    secret(stack, "leads", () => { priority = !priority; });
    animate.push(t => bars.forEach((bar, i) => {
      bar.scale.y = .32 + Math.max(0, Math.sin(t * (priority ? 4 : 1.6) + i)) * .99;
      bar.position.y = .29 + bar.scale.y * .31;
    }));
    const walk = lane("walk", .59, frontNormal, .87);
    for (let i = 0; i < 3; i++) {
      const operator = citizen(i % 2 ? p.sea : p.warm);
      traffic.add(operator.figure, walk, .66, i * .34, 0, operator.move);
    }
  } else if (id === "ai") {
    const repair = district(.41, .15, .115, 3.8);
    for (let i = 0; i < 3; i++) {
      const console = booth(repair, (i - 1) * 1.15, -.32, 1.4 + i * .35, i % 2 ? roof : p.ink);
      console.add(box(.59, .33, .07, p.crystal, 0, .94, .49));
    }
    const alien = citizen(p.sea, true);
    alien.figure.position.set(-.6, 0, .68);
    repair.add(alien.figure);
    let waving = false;
    secret(alien.figure, "robot", () => { waving = !waving; });
    const repairBot = new T.Group();
    repairBot.position.set(.6, .28, .63);
    repairBot.add(box(.47, .29, .40, p.chalk), box(.34, .12, .065, p.crystal, 0, .045, .216),
      box(.086, .38, .083, p.ink, -.25, .24));
    repair.add(repairBot);
    animate.push(t => {
      alien.arm.rotation.z = -(.33 + (waving ? 1.05 : .48) * Math.sin(t * 7));
      repairBot.rotation.z = Math.sin(t * 3) * .16;
      repairBot.position.y = .42 + Math.sin(t * 1.8) * .21;
    });
    const portal = district(-.36, -.19, .111, 3.1);
    const anomaly = solid(new T.TorusGeometry(.91, .12, 10, 32), p.crystal, 0, 1.13);
    portal.add(anomaly, box(2.07, .23, 1.36, p.ink, 0, .12));
    const gate = solid(new T.IcosahedronGeometry(.43, 1), p.gold, 0, 1.14);
    portal.add(gate);
    const portalLight = new T.MeshBasicMaterial({ color: 0xa3f3d0, side: T.DoubleSide, transparent: true, opacity: .54, depthWrite: false });
    const curtain = solid(new T.CircleGeometry(.82, 30), portalLight, 0, 1.13, .005);
    curtain.visible = false;
    portal.add(curtain);
    let started = -20, time = 0;
    interactive.push({ root: portal, action: () => { started = time; curtain.visible = true; effects.portal(); } });
    animate.push(t => {
      time = t;
      const active = t - started < 2.25;
      curtain.visible = active;
      if (active) curtain.scale.setScalar(.84 + Math.sin(t * 4) * .11);
      gate.rotation.set(t * .42, t, t * .6);
      gate.position.y = 1.14 + Math.sin(t * 2.4) * .19;
      gate.scale.setScalar(active ? 1.18 : 1);
    });
    for (const x of [-.8, .68]) booth(town, x, .15, 1.63, p.ink);
    const path = lane("walk", .68);
    for (let i = 0; i < 3; i++) {
      const drone = citizen(i % 2 ? p.chalk : p.coral, true);
      traffic.add(drone.figure, path, .49, i / 3, 0, drone.move);
    }
  } else if (id === "motomizer") {
    const factory = district(.39, .17, .14, 4.1);
    factory.add(box(3.87, .21, 2.63, roof, 0, .12), box(3.71, 1.04, .14, wall, 0, .59, -1.16),
      box(.23, 1.12, 2.41, wall, -1.71, .63), box(.20, 1.17, 2.41, wall, 1.72, .65),
      box(3.79, .13, .89, p.coral, 0, 1.32, -.80));
    for (let i = 0; i < 8; i++) factory.add(box(.21, .16, .92, p.ink, (i - 3.5) * .38, .36, .31));
    const manufacture = makeCar(p, true).root;
    manufacture.scale.setScalar(.42);
    manufacture.position.set(-1.3, .44, .31);
    factory.add(manufacture);
    const arms = [-.85, .43, 1.10].map(x => {
      const spindle = new T.Group();
      spindle.position.set(x, .34, -.48);
      spindle.add(solid(new T.CylinderGeometry(.15, .18, .28, 10), p.ink, 0, .12),
        box(.11, .71, .12, p.warm, 0, .48));
      const pivot = new T.Group();
      pivot.position.set(0, .80, 0);
      pivot.add(box(.105, .74, .12, p.warm, 0, .34), box(.19, .12, .19, p.ink, 0, .71));
      spindle.add(pivot);
      factory.add(spindle);
      return { spindle, pivot };
    });
    let tiny = false;
    secret(manufacture, "cones", () => { tiny = !tiny; });
    animate.push(t => {
      const x = Math.sin(t * .68) * 1.12;
      manufacture.position.x = x;
      manufacture.scale.setScalar(tiny ? .19 : .39 + Math.sin(t * .68) * .09);
      arms.forEach(({ spindle, pivot }, i) => {
        spindle.rotation.y = Math.sin(t * .89 + i) * .44;
        pivot.rotation.x = .43 + Math.sin(t * 1.5 + i) * .79;
      });
    });
    booth(town, -.66, 0, 1.69); booth(town, .72, .07, 1.24, p.ink);
    for (const x of [-1.02, .95]) town.add(solid(new T.CylinderGeometry(.15, .23, 2.37, 13), p.coral, x, 1.25, -.53));
    const smoke = new T.InstancedMesh(new T.SphereGeometry(.25, 8, 6), new T.MeshLambertMaterial({ color: 0x9994a0, transparent: true, opacity: .69, depthWrite: false }), low ? 7 : 13);
    const dummy = new T.Object3D();
    town.add(smoke);
    animate.push((t, effects) => {
      smoke.visible = effects || !low;
      for (let i = 0; i < smoke.count; i++) {
        const phase = path(t * .64 + i * .22, 1);
        dummy.position.set((i % 2 ? 1.02 : -.96) + phase * .71, 2.48 + phase * 1.41, -.53 + Math.sin(t + i) * .18);
        dummy.scale.setScalar(Math.sin(phase * Math.PI) * 1.44);
        dummy.updateMatrix();
        smoke.setMatrixAt(i, dummy.matrix);
      }
      smoke.instanceMatrix.needsUpdate = true;
    });
    const service = lane("road", .63, frontNormal, .89);
    const tug = makeCar(p, true).root;
    tug.scale.setScalar(.49);
    tug.add(box(.10, .56, .10, p.ink, -.25, .78, .56), box(.10, .56, .10, p.ink, .25, .78, .56));
    traffic.add(tug, service, .83, .2);
  } else if (id === "beatmarket") {
    const club = district(.40, .02, .14, 3.3);
    const beats = new T.Group();
    club.add(box(3.84, .21, 2.51, p.ink, 0, .11), box(3.24, .17, .54, p.coral, 0, .48, -.68), beats);
    const led = [p.crystal, p.warm, accent, p.coral];
    const bars = Array.from({ length: 12 }, (_, i) => {
      const bar = box(.14, .91, .11, led[i % 4], (i - 5.5) * .228, .86, -.92);
      beats.add(bar);
      return bar;
    });
    const dj = citizen(p.coral);
    dj.figure.position.set(0, .31, -.53);
    club.add(dj.figure);
    const crowdCount = low ? 22 : 43;
    const dancers = new T.InstancedMesh(new T.CapsuleGeometry(.13, .28, 4, 7), new T.MeshLambertMaterial({ color: 0xffffff }), crowdCount);
    const dance = new T.Object3D();
    club.add(dancers);
    const rays = new T.Group();
    const beam = new T.MeshBasicMaterial({ color: 0xcd8bf4, transparent: true, opacity: .27, side: T.DoubleSide, depthWrite: false });
    for (const x of [-1.25, 1.25]) {
      const light = solid(new T.ConeGeometry(.36, 3.1, 10, 1, true), beam, x, 1.82, -.55);
      rays.add(light);
    }
    club.add(rays);
    const spark = new T.InstancedMesh(new T.IcosahedronGeometry(.073, 0), p.warm, low ? 18 : 39);
    spark.frustumCulled = false;
    club.add(spark);
    let style = 0, encore = -20, clock = 0;
    secret(dj.figure, "concert", () => { style = (style + 1) % 3; encore = clock; effects.beat(style); });
    animate.push((t, fx) => {
      clock = t;
      const last = t - encore, schedule = path(t + 4, 49);
      const burst = last < 4.2 ? last : schedule > 32 && schedule < 35 ? schedule - 32 : -1;
      spark.visible = fx && burst > .24;
      if (spark.visible) {
        for (let i = 0; i < spark.count; i++) {
          const age = path(burst * .78 + (i % 3) * .24, 1);
          const angle = i * 2.39996;
          dance.position.set(Math.cos(angle) * age * 1.45, 2.21 + 1.5 * Math.sin(age * Math.PI), -.63 + Math.sin(angle) * age * 1.28);
          dance.rotation.set(angle,0,0);
          dance.scale.setScalar(Math.sin(age * Math.PI) * 1.39);
          dance.updateMatrix();
          spark.setMatrixAt(i, dance.matrix);
        }
        spark.instanceMatrix.needsUpdate = true;
      }
      dance.scale.setScalar(1);
      dance.rotation.set(0,0,0);
      const pulse = 2.95 + style * .47;
      bars.forEach((bar, i) => { bar.scale.y = .2 + Math.abs(Math.sin(t * pulse + i * .81)) * 1.12; });
      dj.arm.rotation.z = -1.15 + Math.sin(t * pulse) * .62;
      beam.color.setHex([0xcd8bf4, 0x69e5df, 0xf4b752][style]);
      rays.visible = fx;
      rays.rotation.z = .23 * Math.sin(t * 1.44);
      for (let i = 0; i < dancers.count; i++) {
        dance.position.set((i % 9 - 4) * .365 + .03 * Math.sin(t * pulse + i), .47 + (Math.sin(t * pulse * 2 + i) + 1) * .071, Math.floor(i / 9) * .39 -.21);
        dance.rotation.z = .25 * Math.sin(t * pulse + i);
        dance.updateMatrix();
        dancers.setMatrixAt(i, dance.matrix);
        if (t === 0) dancers.setColorAt(i, led[i % led.length].color);
      }
      dancers.instanceMatrix.needsUpdate = true;
    });
    for (const x of [-.81, .62]) booth(town, x, 0, 1.04, x < 0 ? p.coral : p.sea);
    const vinyl = solid(new T.CylinderGeometry(.29, .29, .05, 22), p.rubber, .24, 1.2, .51);
    town.add(vinyl, solid(new T.CylinderGeometry(.10, .10, .055, 17), p.coral, .24, 1.2, .51));
    secret(vinyl, "billboard", () => { style = (style + 1) % 3; effects.beat(style); });
  } else if (id === "jalapeno") {
    town.add(box(4.03,.19,2.61,roof,0,.10),box(3.58,.14,2.23,wall,0,.25));
    const trailer = new T.Group();
    trailer.position.set(-.67,.32,-.21);
    trailer.add(box(1.69,.88,.90,p.coral,0,.60,0,.22),box(1.24,.45,.07,p.ink,0,.69,.451),
      box(1.25,.10,.38,p.chalk,0,.55,.63),box(1.23,.066,.45,p.warm,0,.98,.65));
    for (const x of [-.55,.57]) {
      const tire = solid(new T.CylinderGeometry(.21,.21,.115,14),p.rubber,x,.18,.453);
      tire.rotateX(Math.PI/2);
      trailer.add(tire);
    }
    town.add(trailer);
    const wordmark = document.createElement("canvas");
    wordmark.width=256; wordmark.height=64;
    const color=wordmark.getContext("2d")!;
    color.fillStyle="#f8d28f"; color.textAlign="center"; color.font="bold 33px system-ui";
    color.fillText("JALAPENO",128,42,242);
    const label = new T.CanvasTexture(wordmark);
    label.colorSpace=T.SRGBColorSpace;
    town.add(solid(new T.PlaneGeometry(1.29,.34),new T.MeshBasicMaterial({map:label,transparent:true,depthWrite:false}),-.66,1.60,.32));
    const cook=citizen(p.chalk);
    cook.figure.position.set(-.32,.26,.60);
    town.add(cook.figure);
    animate.push(t=>{cook.arm.rotation.z=-.77+Math.sin(t*5)*.63;});
    for(const x of [.40,1.20]) {
      town.add(solid(new T.CylinderGeometry(.22,.22,.08,15),p.chalk,x,.58,.67),
        solid(new T.CylinderGeometry(.034,.063,.33,7),p.ink,x,.38,.67));
      for(const side of [-1,1]) town.add(box(.20,.21,.21,p.sea,x,.34,.68+side*.32));
    }
    for(const [x,z] of [[-1.34,-1],[1.37,.92]]) {
      lamp(town,x,z); planter(town,x,z+.18);
    }
    const grill = box(.52,.45,.52,p.ink,1.25,.52,-.48);
    town.add(grill,solid(new T.SphereGeometry(.14,9,5),p.gold,1.25,.79,-.48));
    const steam = [0,1,2].map(i=>solid(new T.SphereGeometry(.11,8,6),p.chalk,1.25,.85+i*.16,-.48));
    town.add(...steam);
    animate.push((t,fx)=>steam.forEach((puff,i)=>{
      const a=path(t*.64+i*.31,1);
      puff.visible=fx; puff.position.y=.85+a*.66; puff.position.x=1.25+Math.sin(t+i)*a*.17; puff.scale.setScalar(Math.sin(a*Math.PI));
    }));
    const guests = lane("walk",.58);
    for(let i=0;i<4;i++) {
      const diner=citizen(i%2?p.sea:p.coral);
      traffic.add(diner.figure,guests,.44,i/4,0,diner.move);
    }
    mainPoint=town.position.clone().addScaledVector(north,1.71);
    town.userData.labelTexture=label;
  } else if (id === "isto-kebab") {
    for (let i = 0; i < 3; i++) {
      const x = (i - 1) * 1.06;
      booth(town, x, .11, .85, i % 2 ? p.coral : p.chalk);
      for (let j = 0; j < 6; j++) town.add(box(.16, .081, .51, j % 2 ? p.coral : p.chalk, x + (j - 2.5) * .16, .83, .72));
    }
    const cook = citizen(p.chalk);
    cook.figure.position.set(.75, .01, 1.09);
    town.add(cook.figure, solid(new T.CylinderGeometry(.25, .25, .08, 16), p.ink, .32, .54, 1.22),
      solid(new T.ConeGeometry(.18, .24, 11), p.coral, .32, .72, 1.22));
    secret(cook.figure, "recipe");
    animate.push(t => { cook.arm.rotation.z = -1.03 + Math.sin(t * 4.1) * .34; });
    const plaza = district(.41, .16, .092, 2);
    for (let i = -1; i <= 1; i++) {
      lamp(plaza, i * .67, -.36);
      planter(plaza, i * .68, .56);
    }
    const walk = lane("walk", .61, frontNormal, .9);
    for (let i = 0; i < 4; i++) {
      const guest = citizen(i % 2 ? p.coral : p.sea);
      traffic.add(guest.figure, walk, .54, i / 4, 0, guest.move);
    }
  } else {
    for (let i = 0; i < 4; i++) booth(town, (i % 2 - .5) * 1.58, (Math.floor(i / 2) - .5) * 1.29, 1.68 + i * .54, i % 2 ? p.chalk : wall);
    const runway = district(.40, .20, .098, 2.4);
    runway.add(box(1.65, .14, 3.43, p.ink, 0, .08), box(1.53, .85, .75, wall, 1.33, .43, -.86));
    for (let i = -2; i <= 2; i++) runway.add(box(.073, .018, .278, p.chalk, 0, .16, i * .59));
    const shuttle = new T.Group();
    shuttle.add(solid(new T.CylinderGeometry(.21, .34, 1.2, 14), p.chalk, 0, .82),
      solid(new T.ConeGeometry(.211, .55, 14), p.coral, 0, 1.68));
    runway.add(shuttle);
    let launch = -50, time = 0;
    secret(shuttle, "launch", () => { launch = time; effects.alert("launch"); });
    animate.push(t => {
      time = t;
      const flight = t - launch;
      shuttle.position.y = flight < 5 ? Math.max(0, flight) ** 2 * .75 : 0;
    });
  }

  // Each district has a second silhouette and a reason to follow the coastline.
  function scenic(x: number, z: number, span: number, height: number) {
    const ideal = position(x, z);
    if (!surface.land(ideal) || bounds.some(zone => ideal.angleTo(zone.normal) < zone.radius + span + .02)
      || lanes.some(route => route.kind !== "water" && route.directions.some((p, i) => i % 3 === 0 && p.angleTo(ideal) < span + .045))) return;
    return district(x, z, span, height);
  }

  if (id === "starcars") {
    const lookout = scenic(-.22, .36, .07, 2.5);
    if (lookout) {
      for (const side of [-1, 1]) lookout.add(box(.08, 1.72, .10, p.ink, side * .7, .86));
      lookout.add(box(1.67, .22, .18, p.ink, 0, 1.62));
      for (let i = 0; i < 8; i++) lookout.add(box(.145, .07, .19, i % 2 ? p.chalk : p.coral, (i - 3.5) * .16, 1.61));
      for (let i = 0; i < 3; i++) lookout.add(box(1.63, .20, .30, i % 2 ? p.coral : p.chalk, 0, .22 + i * .19, -.16 - i * .28));
    }
  }
  if (id === "reenergy") {
    const hydro = scenic(-.06, .41, .092, 2.3);
    if (hydro) {
      const reservoir = solid(new T.CylinderGeometry(1.15, 1.26, .11, 28), p.sea, 0, .11);
      hydro.add(reservoir, box(1.48, .37, .33, p.chalk, 0, .25, .53));
      const current = [-.48, -.16, .16, .48].map(x => box(.13, .56, .07, p.crystal, x, .27, .72));
      hydro.add(...current);
      animate.push(t => current.forEach((object, i) => { object.scale.y = .69 + Math.sin(t * 6 + i * .5) * .21; }));
      for (const x of [-.93, .94]) planter(hydro, x, .63);
    }
  }
  if (id === "ai" || id === "beatmarket") {
    const arc = scenic(.26, -.35, .077, 3.1);
    if (arc) {
      const fixture = solid(new T.TorusGeometry(1.1, .092, 9, 31, Math.PI), p.crystal, 0, .89, .03);
      arc.add(fixture, box(2.32, .16, .74, roof, 0, .08));
      if (id === "ai") {
        const stone = solid(new T.IcosahedronGeometry(.34, 0), p.crystal, 0, 1.18);
        stone.scale.y = 1.52;
        arc.add(stone);
        animate.push(t => { stone.rotation.y = t * .93; stone.position.y = 1.16 + Math.sin(t * 2.7) * .18; });
      } else {
        for (let i = 0; i < 7; i++) arc.add(solid(new T.SphereGeometry(.091, 8, 6), i % 2 ? p.warm : p.coral, (i - 3) * .24, .56, .13));
      }
    }
  }
  if (id === "motomizer") {
    const plant = scenic(.06, -.38, .087, 3.7);
    if (plant) {
      const drum = solid(new T.CylinderGeometry(.54, .54, 1.35, 16), p.coral, 0, .68);
      drum.rotation.z = Math.PI / 2;
      plant.add(drum, box(1.69, .27, .86, p.ink, 0, .16));
      for (const x of [-.5, 0, .5]) {
        const rim = solid(new T.TorusGeometry(.56, .06, 7, 24), p.chalk, x, .68);
        rim.rotateY(Math.PI / 2);
        plant.add(rim);
      }
      plant.add(solid(new T.CylinderGeometry(.16,.20,2.4,11),roof,.89,1.22,-.44));
      animate.push(t => { drum.rotation.y = t * .52; });
    }
  }
  if (id === "b-crm") {
    const transit = scenic(.03, -.45, .089, 3.9);
    if (transit) {
      const mast = solid(new T.CylinderGeometry(.22,.43,2.1,14), p.ink, 0,1.05);
      const beacon = solid(new T.OctahedronGeometry(.51), p.crystal, 0, 2.25);
      transit.add(mast, beacon);
      for (const x of [-.75,.75]) {
        transit.add(box(.5, .62, .63, wall, x, .32), box(.33, .20, .07, accent, x, .46, .33));
        signalWire(transit, new T.Vector3(x,.57,.03), new T.Vector3(0,1.80,.12), x > 0 ? .25 : .72);
      }
      animate.push(t => { beacon.rotation.y = t * .58; });
    }
  }
  if (id === "isto-kebab") {
    const orchard = scenic(.04, -.40, .076, 2.3);
    if (orchard) {
      const pepper = solid(new T.CapsuleGeometry(.24, .73, 8, 15), p.coral, 0, 1.05);
      pepper.rotation.z = -.56;
      orchard.add(pepper, solid(new T.CylinderGeometry(.058,.082,.32,9),garden,-.34,1.63),
        box(1.54, .23, .84, p.chalk, 0, .15));
      for (const x of [-.63,.64]) planter(orchard,x,.49);
    }
  }

  // Secondary settlements and vegetation run around the whole globe.
  for (const [i, pair] of [[-.15, .46], [.22, .49], [-.48, -.12], [.38, -.32]].entries()) {
    const reverse = north.clone().negate();
    if (!surface.land(position(pair[0], pair[1], reverse))) {
      if (id === "home") continue;
      const smaller = [pair[0] * .51, pair[1] * .51];
      if (!surface.land(position(smaller[0], smaller[1], reverse))) continue;
      pair[0] = smaller[0];
      pair[1] = smaller[1];
    }
    const back = district(pair[0], pair[1], .064, id === "beatmarket" ? 1.6 : 2.4, true);
    booth(back, -.42, 0, .82 + i * .20, i % 2 ? p.sea : wall);
    booth(back, .55, -.23, .66 + i * .14, i % 2 ? wall : p.chalk);
    lamp(back, 0, .74);
    planter(back, .61, .59);
  }
  for (const i of [-1, 1]) { lamp(town, i * 1.13, 1.22); planter(town, i * 1.14, -.95); }
  const groveCount = id === "home" ? 36 : low ? 87 : 156;
  const leaves = new T.InstancedMesh(new T.SphereGeometry(.42, low ? 7 : 10, low ? 6 : 8), garden, groveCount);
  const trunks = new T.InstancedMesh(new T.CylinderGeometry(.053, .089, .47, 7), p.ink, groveCount);
  const rocks = new T.InstancedMesh(new T.IcosahedronGeometry(.39, 1), roof, groveCount);
  const dummy = new T.Object3D();
  let tree = 0, rock = 0;
  for (let i = 0; i < (low ? 560 : 960) && (tree < groveCount || rock < groveCount); i++) {
    const a = (i + .5) * 2.39996;
    const y = 1 - 2 * i / (low ? 560 : 960);
    output.set(Math.sqrt(1 - y * y) * Math.sin(a), y, Math.sqrt(1 - y * y) * Math.cos(a));
    if (bounds.some(zone => output.angleTo(zone.normal) < zone.radius + .052)) continue;
    if (lanes.some(route => route.directions.some((p, index) => index % 5 === 0 && p.angleTo(output) < .089))) continue;
    if (surface.land(output) && tree < groveCount) {
      alignRadially(dummy, output, surface.radius(output) + .22);
      const s = .61 + .38 * Math.sin(i * 17);
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      trunks.setMatrixAt(tree, dummy.matrix);
      dummy.position.addScaledVector(output, .40 * s);
      const axis = id === "ai" ? .44 : id === "starcars" ? 1.63 : id === "beatmarket" ? .71 : 1.32;
      dummy.scale.set(s * (id === "ai" ? 1.22 : 1), s * axis, s);
      dummy.updateMatrix();
      leaves.setMatrixAt(tree++, dummy.matrix);
    } else if (rock < groveCount && surface.contour(output) > -.07) {
      alignRadially(dummy, output, surface.radius(output) + .032);
      dummy.scale.set(.77 + .30 * Math.cos(i * .71), .44 + .32 * Math.abs(Math.sin(i)), .77);
      dummy.rotateY(i * .62);
      dummy.updateMatrix();
      rocks.setMatrixAt(rock++, dummy.matrix);
    }
  }
  leaves.count = trunks.count = tree;
  rocks.count = rock;
  root.add(leaves, trunks, rocks, traffic.group, laneMesh(lanes));
  for (const activity of animate) activity(0, true);
  return {
    root, bounds, interactive, lanes, mainPoint,
    disposeTextures() { (town.userData.labelTexture as T.Texture | undefined)?.dispose(); },
    update(t: number, effects: boolean) {
      traffic.tick(t);
      for (const activity of animate) activity(t, effects);
    },
    radius,
  };
}
