import * as T from "three";
import { globeDirection, globeRadius, makeSurfaceSites } from "./globe";
import { surfaceRadius, terrainField } from "./terrain";
import { createTraffic, laneMesh, makeLane, ringWaypoints, type Lane } from "./routes";
import { makeCar } from "./vehicle";
import { alignRadially, box, solid, type GamePalette } from "./gameObjects";

export const volcanoDirection = globeDirection(-31, 110);
export const observatoryDirection = globeDirection(36, 112);
export const lakeDirection = globeDirection(25, -64);
export const portDirection = globeDirection(-19, -52);
export const windDirection = globeDirection(52, 29);
export const ridgeDirection = globeDirection(56, 10);
export const impactDirection = globeDirection(41, 145);

function seeded(seed: number) {
  return () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

export function makeWorldLife(p: GamePalette, low: boolean) {
  const group = new T.Group();
  const random = seeded(314824);
  const direction = new T.Vector3(), dummy = new T.Object3D();
  const { hq, studio } = makeSurfaceSites();
  const siteNormals = [hq.normal, studio.normal];
  const decorative = [volcanoDirection, observatoryDirection, lakeDirection, portDirection, windDirection, ridgeDirection, impactDirection];
  const lanes: Lane[] = [];
  const traffic = createTraffic();
  const surface = { radius: surfaceRadius, land: (point: T.Vector3) => terrainField(point) > .655 };
  const obstacles = [...siteNormals, ...decorative].map(normal => ({ normal, radius: .12 }));
  const trails = [
    { kind: "road", candidates: [[30, 28, .21], [30, 29, .18], [50, 14, .19]] },
    { kind: "road", candidates: [[1, -40, .22], [0, -42, .19], [10, -30, .20]] },
    { kind: "rail", candidates: [[-41, 130, .19], [-33, 133, .23], [25, 150, .23], [-48, -125, .20]] },
  ] as const;
  for (const { kind, candidates } of trails) {
    const lane = candidates.map(([lat,lon,size]) => makeLane(kind, ringWaypoints(globeDirection(lat,lon), size, 13), surface, obstacles))
      .find(candidate => candidate !== null);
    if (!lane) continue;
    lanes.push(lane);
    for (let i = 0; i < (kind === "rail" ? 3 : 2); i++) {
      const object = kind === "rail" ? new T.Group().add(box(.51,.32,.65,i ? p.chalk : p.coral,0,.22),box(.38,.19,.40,p.glass,0,.43)) : makeCar(p, true).root;
      object.scale.setScalar(.58);
      traffic.add(object, lane, kind === "rail" ? 1.67 : 1.35, kind === "rail" ? i * .065 : i * .5, kind === "rail" ? 0 : .16);
    }
  }
  const waterLane = makeLane("water", ringWaypoints(globeDirection(-18, -67), .12, 10), surface)
    ?? makeLane("water", ringWaypoints(globeDirection(-4, -78), .15, 10), surface)
    ?? makeLane("water", ringWaypoints(globeDirection(-8, -168), .14, 10), surface);
  if (waterLane) lanes.push(waterLane);
  const boatBody = new T.Group().add(box(.50,.21,.95,p.coral,0,.11),box(.35,.22,.52,p.chalk,0,.29),box(.29,.14,.36,p.glass,0,.43));
  traffic.add(boatBody, waterLane, .81, .18);
  const wildlife = makeLane("wild", ringWaypoints(globeDirection(58, -167), .095), {
    radius: surfaceRadius, land: point => terrainField(point) > .69,
  }, obstacles);
  const tortoise = new T.Group();
  const legs = [-1,1].flatMap(side => [-1,1].map(end => solid(new T.SphereGeometry(.10,7,5),p.moss,side*.205,.065,end*.13)));
  tortoise.add(solid(new T.SphereGeometry(.25,12,8).scale(.89,.58,1.19),p.moss,0,.18),
    solid(new T.SphereGeometry(.09,8,6),p.chalk,0,.13,.29),...legs);
  traffic.add(tortoise,wildlife,.21,.36,0,t => legs.forEach((leg,i) => {leg.position.z = Math.sign(i%2-.5)*.13 + Math.sin(t*4.7+i)*.055;}));
  group.add(traffic.group, laneMesh(lanes));
  const groveCount = low ? 175 : 320;
  const trees = new T.InstancedMesh(new T.SphereGeometry(0.49, low ? 7 : 10, low ? 6 : 8), new T.MeshLambertMaterial({ color: 0xffffff }), groveCount);
  const trunks = new T.InstancedMesh(new T.CylinderGeometry(0.054, .095, .61, 6), p.ink, groveCount);
  const shade = new T.InstancedMesh(new T.CircleGeometry(.42, 9).rotateX(-Math.PI / 2),
    new T.MeshBasicMaterial({ color: 0x26453c, transparent: true, opacity: .25, depthWrite: false }), groveCount);
  const treeFrames: { index: number; position: T.Vector3; rotation: T.Quaternion; scale: T.Vector3 }[] = [];
  const boulders = new T.InstancedMesh(new T.IcosahedronGeometry(0.82, 1), new T.MeshLambertMaterial({ color: 0xffffff }), 90);
  const leaf = [0x507956, 0x7ea466, 0x6d8462, 0x98ad65, 0xb49a60].map(color => new T.Color(color));
  const stone = [0x8a7d78, 0xc89f86, 0x665c66].map(color => new T.Color(color));
  let plant = 0, rock = 0;
  for (let i = 0; i < 5600 && (plant < groveCount || rock < boulders.count); i++) {
    const y = random() * 2 - 1;
    const angle = random() * Math.PI * 2;
    const section = Math.sqrt(1 - y * y);
    direction.set(section * Math.cos(angle), y, section * Math.sin(angle));
    const field = terrainField(direction);
    if (field < 0.69 || siteNormals.some(site => site.dot(direction) > 0.968)
      || decorative.some(site => site.dot(direction) > 0.979)
      || lanes.some(lane => lane.directions.some((point, index) => index % 4 === 0 && point.angleTo(direction) < .065))) continue;
    const scale = 0.6 + random() * 0.53;
    const radius = surfaceRadius(direction);
    if ((field > 0.82 || random() < 0.30) && plant < groveCount) {
      alignRadially(dummy, direction, radius + 0.26 * scale);
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      trunks.setMatrixAt(plant, dummy.matrix);
      dummy.position.addScaledVector(direction, 0.47 * scale);
      dummy.scale.set(scale * 0.84, scale * 1.29, scale * 0.83);
      dummy.updateMatrix();
      trees.setMatrixAt(plant, dummy.matrix);
      if (plant % 4 === 0) treeFrames.push({ index: plant, position: dummy.position.clone(), rotation: dummy.quaternion.clone(), scale: dummy.scale.clone() });
      alignRadially(dummy, direction, radius + .026);
      dummy.scale.set(scale * 1.27, scale, scale * .72);
      dummy.updateMatrix();
      shade.setMatrixAt(plant, dummy.matrix);
      trees.setColorAt(plant++, leaf[Math.floor(random() * leaf.length)]);
    } else if (rock < boulders.count) {
      alignRadially(dummy, direction, radius + 0.14 * scale);
      dummy.rotateY(random() * Math.PI);
      dummy.scale.set(scale * 0.92, scale * (0.42 + random() * 0.66), scale * 0.85);
      dummy.updateMatrix();
      boulders.setMatrixAt(rock, dummy.matrix);
      boulders.setColorAt(rock++, stone[Math.floor(random() * stone.length)]);
    }
  }
  trees.count = trunks.count = shade.count = plant;
  boulders.count = rock;
  group.add(shade, trees, trunks, boulders);

  const communities: { root: T.Group; normal: T.Vector3 }[] = [];
  function site(normal: T.Vector3) {
    const root = new T.Group();
    group.add(alignRadially(root, normal, surfaceRadius(normal)));
    communities.push({ root, normal });
    return root;
  }
  const edifice = new T.MeshLambertMaterial({ color: 0x78555b });
  const ash = new T.MeshLambertMaterial({ color: 0x514954 });
  const ridge = site(ridgeDirection);
  const granite = new T.MeshLambertMaterial({color: 0x85808a});
  const snow = new T.MeshLambertMaterial({color: 0xebe4cb});
  for (const [x,z,width,height] of [[-.98,.28,1.12,2.47],[.27,-.15,1.49,3.53],[1.24,.25,1.03,2.23]]) {
    const silhouette = new T.LatheGeometry([[0,.01],[width,.01],[width*.81,height*.18],[width*.55,height*.43],[width*.27,height*.69],[0,height]]
      .map(([a,b])=>new T.Vector2(a,b)), 13);
    ridge.add(solid(silhouette,granite,x,0,z),solid(new T.ConeGeometry(width*.29,height*.33,12),snow,x,height*.84,z));
  }
  const lava = new T.MeshLambertMaterial({ color: 0xf06b38, emissive: 0xec441e, emissiveIntensity: 0.7 });
  const volcano = site(volcanoDirection);
  const outline = [[0, 0.05], [3.84, 0.05], [3.47, 0.27], [2.65, 0.87], [1.62, 2.11], [1.14, 2.55], [0.83, 2.43], [0.68, 2.00], [0, 1.93]];
  const mountain = new T.LatheGeometry(outline.map(([x, y]) => new T.Vector2(x, y)), low ? 25 : 44);
  const vertices = mountain.getAttribute("position");
  for (let i = 0; i < vertices.count; i++) {
    const x = vertices.getX(i), y = vertices.getY(i), z = vertices.getZ(i);
    const curve = Math.sin(Math.atan2(x, z) * 7 + y * 3) * 0.09 + Math.cos(Math.atan2(x, z) * 4 - y * 2) * 0.12;
    vertices.setXYZ(i, x * (1 + curve), y + curve * Math.min(1.1, y), z * (1 + curve));
  }
  mountain.computeVertexNormals();
  volcano.add(solid(mountain, edifice), solid(new T.CylinderGeometry(0.82, 0.55, 0.10, 25), lava, 0, 2.20));
  const cave = new T.Group();
  const mouth = solid(new T.TorusGeometry(0.59, 0.22, 9, 19, Math.PI), edifice, 0, 0.23, 0.03);
  const hole = solid(new T.CircleGeometry(0.58, 18, 0, Math.PI), p.rubber, 0, 0.23);
  cave.add(mouth, hole, box(1.34, 0.10, 0.79, p.ink, 0, .075, .11));
  cave.position.set(0.07, 0.17, 3.32);
  volcano.add(cave);
  const embers = new T.InstancedMesh(new T.IcosahedronGeometry(0.16, 0), lava, low ? 15 : 30);
  const smoke = new T.InstancedMesh(new T.SphereGeometry(0.40, 7, 5), ash, low ? 8 : 16);
  volcano.add(embers, smoke);
  embers.frustumCulled = smoke.frustumCulled = false;

  const observatory = site(observatoryDirection);
  observatory.add(solid(new T.CylinderGeometry(0.93, 1.16, 0.79, 18), p.chalk, 0, 0.40),
    solid(new T.SphereGeometry(0.93, 21, 14, 0, Math.PI * 2, 0, Math.PI / 2), p.glass, 0, 0.79),
    box(0.38, 0.60, 0.14, p.ink, 0, 0.36, 0.91),
    solid(new T.CylinderGeometry(0.08, 0.14, 0.68, 12), p.ink, 0, 1.58));
  const dish = new T.Group();
  dish.position.set(0, 1.90, 0);
  const bowl = solid(new T.SphereGeometry(.62, 18, 9, 0, Math.PI * 2, Math.PI * .55, Math.PI * .45), p.chalk);
  bowl.rotation.x = -1.11;
  dish.add(bowl, solid(new T.CylinderGeometry(.028, .028, .60, 7), p.ink, 0, 0.10, .13),
    solid(new T.SphereGeometry(.09, 9, 5), p.warm, 0, .40, .13));
  observatory.add(dish);

  const ocean = site(lakeDirection);
  const water = new T.MeshLambertMaterial({ color: 0x56b5ad, emissive: 0x25626c, emissiveIntensity: .28 });
  ocean.add(solid(new T.CylinderGeometry(1.54, 1.62, .09, 32), p.chalk, 0, .115),
    solid(new T.CylinderGeometry(1.44, 1.48, .07, 32), water, 0, .17));
  const ripples = [0.49, 0.87, 1.18].map(radius => {
    const ring = solid(new T.TorusGeometry(radius, 0.012, 5, 28), p.crystal, 0, .218);
    ring.rotation.x = Math.PI / 2;
    ocean.add(ring);
    return ring;
  });
  const fish = solid(new T.SphereGeometry(.18, 9, 6), p.coral);
  fish.scale.set(1.4, .57, .58);
  ocean.add(fish);
  const waterfall = new T.Group();
  waterfall.position.set(-0.96, 0.20, -0.44);
  ocean.add(waterfall);
  const footbridge = new T.Group();
  footbridge.position.set(.39,.26,.68);
  for (let i=0; i<8; i++) footbridge.add(box(.15,.06,.43,p.chalk,(i-3.5)*.137,.023*Math.sin(i/7*Math.PI)));
  for (const z of [-.19,.19]) {
    footbridge.add(box(1.15,.034,.055,p.ink,0,.21,z));
    for (const x of [-.5,0,.5]) footbridge.add(box(.031,.22,.04,p.ink,x,.12,z));
  }
  ocean.add(footbridge);
  for (let i = 0; i < 3; i++) waterfall.add(box(.16, .74, .09, p.crystal, i * .17, .32));
  const port = site(portDirection);
  port.add(box(2.95, 0.17, 1.22, p.chalk, 0, .12), box(.90, .48, .55, p.coral, .75, .40),
    box(.92, .47, .56, p.sea, -.87, .40), box(.53, .42, .63, p.chalk, 0, .41));
  const crane = new T.Group();
  crane.position.set(1.25, .13, -.58);
  crane.add(box(.16, 1.16, .16, p.ink, 0, .59), box(.82, .14, .17, p.coral, -.26, 1.15));
  port.add(crane);

  const turbines = site(windDirection);
  const blades = [-1.18, .19, 1.46].map((x, i) => {
    turbines.add(solid(new T.CylinderGeometry(.065, .13, 1.55 + i * .18, 10), p.chalk, x, .8 + i * .09));
    const rotor = new T.Group();
    rotor.position.set(x, 1.61 + i * .18, .126 + .04 * i);
    for (let j = 0; j < 3; j++) {
      const arm = new T.Group();
      arm.rotation.z = j * Math.PI * 2 / 3;
      arm.add(box(.118, .74, .09, p.chalk, 0, .40), box(.12, .16, .092, p.coral, 0, .68));
      rotor.add(arm);
    }
    rotor.add(solid(new T.SphereGeometry(.135, 9, 7), p.sea));
    turbines.add(rotor);
    return rotor;
  });

  const flyers = Array.from({ length: low ? 3 : 5 }, (_, i) => {
    const bird = new T.Group();
    if (i === 0) {
      bird.add(box(.25, .24, 1.05, p.chalk, 0, 0), box(1.29, .065, .24, p.coral, 0, .025), box(.51, .05, .17, p.chalk, 0, .10, -.43));
    } else {
      bird.add(solid(new T.SphereGeometry(.5 + i * .07, 12, 8), i % 2 ? p.coral : p.warm, 0, .16),
        box(.33, .24, .33, p.chalk, 0, -.67));
    }
    group.add(bird);
    return bird;
  });
  const gulls = [0, 1, 2].map(i => {
    const gull = new T.Group();
    const wings = [-1, 1].map(side => {
      const root = new T.Group();
      const wing = solid(new T.SphereGeometry(.19, 8, 5).scale(1.2, .13, .46), p.chalk, side * .20, 0, -.05);
      root.add(wing);
      gull.add(root);
      return root;
    });
    gull.add(solid(new T.SphereGeometry(.11, 8, 6).scale(.47, .48, 1.38), p.chalk, 0, 0, .065));
    gull.scale.setScalar(.87 + i * .16);
    port.add(gull);
    return { gull, wings };
  });
  const clouds = new T.InstancedMesh(new T.SphereGeometry(.68, 9, 6), new T.MeshLambertMaterial({ color: 0xe1dac5, transparent: true, opacity: .65, depthWrite: false }), 16);
  group.add(clouds);
  const gate = new T.Group();
  gate.position.set(-1.46, .34, .57);
  gate.add(box(1.32, .07, .10, p.coral, -.65, .02));
  port.add(gate, box(.14, .4, .16, p.ink, -1.45, .2, .57));
  const trafficSignal = solid(new T.SphereGeometry(.10, 9, 5), p.warm, 1.36, .61);
  port.add(trafficSignal, box(.05, .64, .05, p.ink, 1.36, .31));

  const ufo = new T.Group();
  const beamMat = new T.MeshBasicMaterial({ color: 0xa2f9ac, transparent: true, opacity: 0.17, depthWrite: false });
  const beam = solid(new T.CylinderGeometry(.18, 1.28, 4.8, 24, 1, true), beamMat, 0, -2.43);
  ufo.add(solid(new T.SphereGeometry(.88, 21, 10).scale(1.32, .26, 1), p.ink),
    solid(new T.SphereGeometry(.53, 18, 10).scale(1, .67, 1), p.crystal, 0, .18), beam);
  for (let i = 0; i < 8; i++) {
    const angle = i * Math.PI / 4;
    ufo.add(solid(new T.SphereGeometry(.106, 7, 6), p.warm, Math.cos(angle) * .78, -.07, Math.sin(angle) * .66));
  }
  const abducted = new T.Group().add(box(.47, .34, .28, p.chalk, 0, .11), box(.24, .26, .25, p.rubber, .20, .23));
  ufo.add(abducted);
  group.add(ufo);

  const comet = new T.Group();
  comet.add(solid(new T.IcosahedronGeometry(.31, 1), p.crystal), solid(new T.ConeGeometry(.22, 2.8, 8), p.glass, 0, -1.35));
  const meteor = new T.Group();
  meteor.add(solid(new T.IcosahedronGeometry(.64, 1), lava));
  const rocket = new T.Group();
  const capsule = solid(new T.CylinderGeometry(.18, .29, 1.13, 13), p.chalk, 0, .68);
  rocket.add(capsule, solid(new T.ConeGeometry(.187, .39, 13), p.coral, 0, 1.42),
    solid(new T.ConeGeometry(.20, 0.62, 10), lava, 0, .02));
  rocket.children[2].rotation.z = Math.PI;
  group.add(comet, meteor, rocket);
  const storm = new T.InstancedMesh(new T.BoxGeometry(.015, .40, .015), new T.MeshBasicMaterial({ color: 0x89c9dc, transparent: true, opacity: .56 }), 90);
  group.add(storm);
  const lightning = new T.Line(new T.BufferGeometry().setFromPoints([
    new T.Vector3(0, 0), new T.Vector3(.55, -.7), new T.Vector3(.1, -1.35),
    new T.Vector3(.62, -1.1), new T.Vector3(.13, -2.25),
  ]), new T.LineBasicMaterial({ color: 0xffe9b6 }));
  group.add(lightning);
  const station = new T.Group();
  station.add(solid(new T.CylinderGeometry(.33, .37, 1.4, 12), p.chalk), box(2.37, .09, .38, p.glass, 0, .1),
    solid(new T.TorusGeometry(.79, .045, 6, 23), p.ink, 0, .14));
  const astronaut = new T.Group().add(solid(new T.SphereGeometry(.26, 12, 8), p.chalk, 0, .5),
    solid(new T.SphereGeometry(.225, 10, 7), p.glass, 0, .5, .095),
    box(.38, .49, .28, p.chalk, 0, .12), box(.18, .37, .22, p.coral, .21, .13));
  station.add(astronaut);
  group.add(station);

  const weatherFog = new T.Color(0x384d59);
  const weatherClear = new T.Color(0x1e344a);
  const previousSky = new T.Color();
  const rayDirection = new T.Vector3();
  function cull(eye: T.Vector3) {
    const horizon = Math.max(-.10, globeRadius / Math.max(globeRadius, eye.length()) - .40);
    rayDirection.copy(eye).normalize();
    for (const { root, normal } of communities) root.visible = rayDirection.dot(normal) > horizon;
  }
  let ufoDelay = -1;
  let ufoSeen = false;
  let stormTime = 0;
  let meteorTime = 0;
  function update(time: number, enabled: boolean, decorated: boolean) {
    const t = enabled ? time : 1;
    if (enabled && decorated) {
      for (const { index, position, rotation, scale } of treeFrames) {
        dummy.position.copy(position);
        dummy.quaternion.copy(rotation);
        dummy.rotateZ(Math.sin(t * 1.1 + index * .47) * .09);
        dummy.scale.copy(scale);
        dummy.updateMatrix();
        trees.setMatrixAt(index, dummy.matrix);
      }
      trees.instanceMatrix.needsUpdate = true;
    }
    gulls.forEach(({ gull, wings }, i) => {
      const angle = t * .58 + i * .69;
      gull.position.set(Math.cos(angle) * (1.8 + i * .28), 1.45 + Math.sin(angle * 2 + i) * .21, Math.sin(angle) * 1.8);
      gull.rotation.y = -angle;
      wings.forEach((wing, side) => { wing.rotation.z = (side ? -1 : 1) * Math.sin(t * 8 - i) * .53; });
    });
    traffic.tick(t);
    dish.rotation.y = t * .31;
    blades.forEach((blade, i) => { blade.rotation.z = t * (1.53 + i * .22); });
    gate.rotation.z = -.07 - T.MathUtils.smoothstep(Math.sin(t * .61), .1, .79) * 1.19;
    trafficSignal.scale.setScalar(Math.sin(t * .61) > .1 ? 1.10 : .62);
    crane.rotation.y = Math.sin(t * .45) * .57;
    ripples.forEach((ring, i) => { ring.scale.setScalar(.86 + Math.sin(t * 1.3 + i) * .09); });
    fish.position.set(Math.sin(t * .65) * .83, .17 + Math.max(0, Math.sin(t * 1.8 - .5)) ** 8 * .62, .43);
    fish.rotation.z = Math.cos(t * 1.8) * .7;
    waterfall.children.forEach((column, i) => { column.scale.y = .80 + Math.sin(t * 7 + i) * .19; });
    flyers.forEach((flyer, i) => {
      const angle = t * (.056 + i * .018) + .8 * i;
      direction.set(Math.cos(angle), i === 0 ? -.23 : .26 + Math.sin(angle) * .42, Math.sin(angle)).normalize();
      alignRadially(flyer, direction, globeRadius + 2.4 + i * .32);
      flyer.rotateY(-angle + Math.PI / 3);
    });
    for (let i = 0; i < clouds.count; i++) {
      const angle = (t * .018 + Math.floor(i / 3) * 1.21 + i % 3 * .051);
      direction.set(Math.cos(angle), Math.sin(i * .88) * .41, Math.sin(angle)).normalize();
      alignRadially(dummy, direction, globeRadius + 1.65 + i % 3 * .18);
      dummy.scale.set(1.53 + i % 4 * .14, .37, .98);
      dummy.updateMatrix();
      clouds.setMatrixAt(i, dummy.matrix);
    }
    clouds.visible = decorated;
    clouds.instanceMatrix.needsUpdate = true;
    const clock = (t + 10) % 56;
    const eruption = enabled && clock >= 30 && clock < 38;
    lava.emissiveIntensity = eruption ? 1.25 : .56;
    embers.visible = eruption;
    for (let i = 0; i < (eruption ? embers.count : 0); i++) {
      const phase = ((clock - 30) * .91 + i * .198) % 1;
      const angle = i * 2.4;
      dummy.position.set(Math.cos(angle) * phase * (1.32 + i % 3), 2.22 + 1.64 * Math.sin(Math.PI * phase), Math.sin(angle) * phase * (1.30 + i % 4));
      dummy.scale.setScalar(.4 + (i % 4) * .28);
      dummy.updateMatrix();
      embers.setMatrixAt(i, dummy.matrix);
    }
    embers.instanceMatrix.needsUpdate = eruption;
    smoke.visible = decorated || eruption;
    for (let i = 0; i < smoke.count; i++) {
      const phase = (t * .36 + i / smoke.count) % 1;
      dummy.position.set(phase * phase * 1.18, 2.4 + phase * (eruption ? 3.1 : 1.5), Math.sin(i * .6 + phase) * .43);
      dummy.scale.setScalar(Math.sin(phase * Math.PI) * (eruption ? 1.55 : .78));
      dummy.updateMatrix();
      smoke.setMatrixAt(i, dummy.matrix);
    }
    smoke.instanceMatrix.needsUpdate = true;
    const flight = ufoDelay >= 0 ? t - ufoDelay : (t + 49) % 93 - 70;
    ufo.visible = enabled ? flight >= 0 && flight < 13 : ufoDelay >= 0;
    if (ufo.visible) {
      direction.set(Math.cos(.54 + flight * .115), Math.sin(flight * .64) * .25 + .24, Math.sin(.54 + flight * .115)).normalize();
      if (ufoDelay >= 0) direction.copy(observatoryDirection).applyAxisAngle(T.Object3D.DEFAULT_UP, .24 + (enabled ? Math.min(flight, 8) * .019 : 0));
      alignRadially(ufo, direction, globeRadius + 5.5 + (flight > 10 ? (flight - 10) ** 2 : 0));
      ufo.rotateY(t * 1.7);
      beam.visible = flight > 3 && flight < 10;
      abducted.visible = beam.visible;
      abducted.position.y = -4.14 + T.MathUtils.smoothstep(flight, 3.8, 8.5) * 3.75;
      abducted.rotation.y = t * 1.5;
      beamMat.opacity = .11 + Math.sin(t * 6) * .037;
      ufoSeen = true;
    } else if (ufoSeen && ufoDelay >= 0) {
      ufoDelay = -1;
    }
    const meteorPhase = (t + 46) % 67 - 59;
    meteor.visible = enabled && meteorPhase >= 0 && meteorPhase < 2.4;
    meteor.position.copy(impactDirection).multiplyScalar(globeRadius + Math.max(.5, 22 - meteorPhase * 9.2));
    meteor.rotation.set(t * 4, t * 3, t * 7);
    if (meteor.visible) meteorTime = t;
    const cometPhase = (t + 46) % 61;
    comet.visible = enabled && cometPhase > 50 && cometPhase < 56;
    comet.position.set((cometPhase - 53) * 18, 23 - (cometPhase - 53) * 5, -20);
    comet.rotation.z = -.97;
    const rocketHeight = (t + 12) % 108;
    rocket.visible = enabled && rocketHeight > 58 && rocketHeight < 72;
    alignRadially(rocket, windDirection, globeRadius + .26 + Math.max(0, rocketHeight - 62) ** 2 * .57);
    rocket.children[2].visible = rocketHeight > 60;
    const stationTurn = t * .041;
    station.position.set(Math.sin(stationTurn) * 38, -13 + Math.cos(stationTurn) * 10, Math.cos(stationTurn) * 37);
    station.rotation.set(.26, stationTurn, .36);
    astronaut.position.set(1.42 + Math.sin(t * .55) * .30, Math.cos(t * .61) * .52, .37);
    astronaut.rotation.z = t * .34;
    const weather = (t + 21) % 112;
    storm.visible = decorated && enabled && weather > 64 && weather < 79;
    if (storm.visible) {
      for (let i = 0; i < storm.count; i++) {
        direction.copy(lakeDirection);
        direction.x += Math.sin(i * 17) * .14;
        direction.y += Math.cos(i * 11) * .12;
        direction.normalize();
        alignRadially(dummy, direction, globeRadius + .5 + ((16 + i * .083 - t * 1.4 % 2.7) % 2.7));
        dummy.scale.setScalar(1);
        dummy.updateMatrix();
        storm.setMatrixAt(i, dummy.matrix);
      }
      storm.instanceMatrix.needsUpdate = true;
      stormTime = t;
    }
    lightning.visible = storm.visible && Math.sin(t * 17) > .95 && Math.sin(t * 1.3) > .64;
    alignRadially(lightning, lakeDirection, globeRadius + 3.4);
    previousSky.copy(weatherClear).lerp(weatherFog, storm.visible ? .8 : Math.max(0, Math.sin(t / 38 - 1)) * .23);
    return { eruption, storm: storm.visible || t - stormTime < 0.7 && stormTime > 0, lightning: lightning.visible, impact: meteorTime > 0 && t - meteorTime < 1, sky: previousSky };
  }
  update(0, false, !low);
  return {
    group, ufo, observatory,
    update, cull, lanes,
    summon(time: number) { ufoDelay = time; ufoSeen = false; },
  };
}
