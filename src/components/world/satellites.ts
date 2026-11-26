import * as T from "three";
import { alignRadially, box, disposeObjects, gamePalette, solid } from "./gameObjects";
import type { SecretBody, FindId } from "./discoveries";
import { globeDirection } from "./globe";
import { makeCar } from "./vehicle";

export type Satellite = ReturnType<typeof makeSatellite>;
const lunarDescent = globeDirection(20, 26);
const alienDescent = globeDirection(16, -24);
const craterPattern = [[19, -27, .32], [0, 53, .35], [54, 39, .27], [-26, 7, .29], [-37, -69, .3], [32, 142, .41], [15, -127, .36], [-39, 156, .3]]
  .map(([lat, lon, size]) => ({ normal: globeDirection(lat, lon), size }));

export function makeSatellite(kind: SecretBody, low: boolean) {
  const garage = kind === "garage";
  const moon = kind !== "signal";
  const radius = garage ? 5.6 : moon ? 6.25 : 12.6;
  const root = new T.Group();
  const palette = gamePalette();
  const geometry = new T.SphereGeometry(radius, low ? 70 : 100, low ? 42 : 64);
  const colors: number[] = [];
  const position = geometry.getAttribute("position");
  const base = new T.Color(garage ? 0xbc8c75 : moon ? 0xc6b8aa : 0x65557f);
  const ridge = new T.Color(garage ? 0xfad1a0 : moon ? 0xead7bd : 0xc0848d);
  const basin = new T.Color(moon ? 0x847784 : 0x303e58);
  const color = new T.Color(), normal = new T.Vector3();
  for (let i = 0; i < position.count; i++) {
    normal.fromBufferAttribute(position, i).normalize();
    const w = Math.sin(normal.x * 14 + normal.z * 5) * Math.cos(normal.y * 17 + normal.z * 11);
    let altitude = w * (moon ? .055 : .34);
    color.copy(base).lerp(ridge, Math.max(0, w) * .29);
    for (const crater of craterPattern) {
      const slope = normal.angleTo(crater.normal) / crater.size;
      if (slope > 1.25) continue;
      const rim = Math.exp(-((slope - 0.88) ** 2) * 102);
      altitude += rim * (moon ? .20 : .29) - (1 - T.MathUtils.smoothstep(slope, .22, .89)) * (moon ? .37 : .47);
      color.lerp(ridge, rim * .48);
      color.lerp(basin, (1 - T.MathUtils.smoothstep(slope, .18, .85)) * .66);
    }
    normal.multiplyScalar(radius + altitude);
    position.setXYZ(i, normal.x, normal.y, normal.z);
    colors.push(color.r, color.g, color.b);
  }
  geometry.setAttribute("color", new T.Float32BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  const vessel = new T.Mesh(geometry, new T.MeshLambertMaterial({ vertexColors: true, emissive: moon ? 0x342b38 : 0x252446, emissiveIntensity: .34 }));
  root.add(vessel);

  const descent = moon ? lunarDescent : alienDescent;
  const baseCamp = new T.Group();
  root.add(alignRadially(baseCamp, descent, radius + .06));
  const dome = solid(new T.SphereGeometry(.62, 19, 12, 0, Math.PI * 2, 0, Math.PI / 2), palette.glass, 0, .31);
  baseCamp.add(solid(new T.CylinderGeometry(.68, .76, .33, 13), palette.chalk, 0, .16), dome,
    box(.89, .31, .50, palette.chalk, -.91, .20), box(.31, .27, .05, palette.glass, -.91, .25, .27),
    box(.30, .51, .13, palette.ink, 0, .26, .66));
  const antenna = new T.Group();
  const dish = solid(new T.SphereGeometry(.45, 15, 7, 0, Math.PI * 2, .53 * Math.PI, .47 * Math.PI), palette.chalk, 0, .80);
  dish.rotation.x = -1;
  antenna.add(dish, solid(new T.CylinderGeometry(.035, .095, .84, 9), palette.ink, 0, .38), solid(new T.SphereGeometry(.065, 9, 7), palette.warm, 0, .87, .34));
  antenna.position.set(1.1, 0, -.64);
  baseCamp.add(antenna);
  const targets: { id: FindId; object: T.Object3D }[] = [];
  const flag = new T.Group();
  flag.add(solid(new T.CylinderGeometry(.016, .027, .82, 6), palette.chalk, 0, .41));
  const label = document.createElement("canvas");
  label.width = 256;
  label.height = 128;
  const context = label.getContext("2d")!;
  context.fillStyle = "#d87b56";
  context.fillRect(0, 0, 256, 128);
  context.font = "bold 70px sans-serif";
  context.fillStyle = "#fff1c8";
  context.fillText("KB", 25, 77);
  context.font = "24px sans-serif";
  context.fillText("bernecki.dev", 25, 108);
  const flagTexture = new T.CanvasTexture(label);
  flagTexture.colorSpace = T.SRGBColorSpace;
  const flagMesh = solid(new T.PlaneGeometry(.57, .30, 8, 3), new T.MeshLambertMaterial({ map: flagTexture, side: T.DoubleSide }), .288, .66);
  flag.add(flagMesh);
  flag.position.set(.89, .01, .88);
  baseCamp.add(flag);
  if (garage) {
    const hangar = new T.Group();
    hangar.position.set(.10,.03,1.48);
    hangar.add(box(1.88,.16,1.37,palette.ink,0,.09), box(1.83,1.02,.10,palette.chalk,0,.54,-.59),
      box(.12,1.07,1.24,palette.coral,-.84,.58), box(.12,1.07,1.24,palette.coral,.84,.58),
      box(1.98,.14,1.28,palette.chalk,0,1.09), box(1.56,.10,.09,palette.warm,0,1.03,.59));
    const model = makeCar(palette,true).root;
    model.position.set(0,.22,.35);
    model.scale.setScalar(.64);
    model.traverse(item => { if (item instanceof T.Mesh && item.material === palette.coral) item.material = palette.gold; });
    hangar.add(model);
    baseCamp.add(hangar);
    targets.push({ id: "garage", object: model });
  } else if (moon) {
    targets.push({ id: "flag", object: flag });
    const rover = makeCar(palette, true).root;
    rover.scale.setScalar(.48);
    rover.position.set(-.79, 0, .82);
    rover.rotation.y = .59;
    baseCamp.add(rover);
    targets.push({ id: "rover", object: rover });
  } else {
    const frame = solid(new T.TorusGeometry(.72, .115, 9, 27), palette.crystal, 0, .86, -.84);
    frame.rotation.x = -.12;
    baseCamp.add(frame,
      box(.74, .31, 1.04, palette.ink, 1.07, .33, .29),
      box(.72, .22, .95, palette.sea, 1.07, .56, .29),
      box(.82, .10, 1.07, palette.chalk, 1.07, .72, .29),
      box(.52, .13, .08, palette.warm, 1.07, .55, .79),
      box(.34, .12, .79, palette.ink, .53, .15, .34));
    const scaffold = new T.Group();
    scaffold.position.set(-1.42, .06, -.45);
    scaffold.rotation.z = -.32;
    for (const x of [-.33, .33]) scaffold.add(box(.12, 1.57, .13, palette.ink, x, .77));
    scaffold.add(box(.82, .12, .60, palette.chalk, 0, 1.47), box(.16, .48, .17, palette.coral, 0, 1.64));
    baseCamp.add(scaffold);
  }
  function artifact(id: FindId, direction: T.Vector3, object: T.Object3D) {
    const mount = new T.Group();
    mount.add(object);
    alignRadially(mount, direction, radius + .13);
    root.add(mount);
    targets.push({ id, object });
    return mount;
  }
  const crystalGeo = new T.OctahedronGeometry(.43, 0);
  const fragments = new T.InstancedMesh(crystalGeo, moon ? palette.chalk : palette.crystal, low ? 63 : 115);
  const marker = new T.Object3D();
  const colorShift = new T.Color();
  for (let i = 0; i < fragments.count; i++) {
    const lat = Math.asin(1 - (2 * i + 1) / fragments.count) * 180 / Math.PI;
    const direction = globeDirection(lat, i * 137.508);
    alignRadially(marker, direction, radius + (moon ? .05 : .15));
    marker.rotateZ(Math.sin(i * 5) * .38);
    marker.scale.setScalar(.24 + (i % 11) * (moon ? .041 : .13));
    if (!moon) marker.scale.y *= 1.4;
    marker.updateMatrix();
    fragments.setMatrixAt(i, marker.matrix);
    fragments.setColorAt(i, colorShift.setHSL(moon ? .07 : .38 + (i % 5) * .08, moon ? .14 : .60, moon ? .72 : .54));
  }
  root.add(fragments);
  let anomaly: T.Object3D | undefined;
  if (garage) {
    const crates = new T.Group();
    for (const x of [-.39,.39]) crates.add(box(.62,.43,.58,palette.chalk,x,.21));
    root.add(alignRadially(crates,globeDirection(-18,-24),radius+.1));
  } else if (moon) {
    artifact("capsule", globeDirection(-8, 41), solid(new T.CapsuleGeometry(.19, .41, 5, 13), palette.coral, 0, .39));
    const plaque = new T.Group().add(box(.50, .50, .15, palette.ink, 0, .26), box(.29, .13, .055, palette.warm, .035, .29, .09));
    artifact("message", globeDirection(21, -53), plaque);
  } else {
    const flower = new T.Group();
    flower.add(solid(new T.CylinderGeometry(.10, .23, 1.02, 10), palette.moss, 0, .52),
      solid(new T.SphereGeometry(.51, 12, 8).scale(1.7, .48, 1.15), palette.glass, 0, 1.05));
    for (const [lat, lon] of [[6, -42], [10, -50], [25, -43], [31, 4], [3, -3], [28, 26], [-30, 66], [-15, 65], [58, -55], [63, 31]]) {
      root.add(alignRadially(flower.clone(), globeDirection(lat, lon), radius + .04));
    }
    const pillar = solid(crystalGeo, palette.crystal, 0, .64);
    pillar.scale.set(.66, 2, .70);
    artifact("crystal", globeDirection(-2, -25), pillar).add(box(.79, .15, .80, palette.ink, 0, .12));
    const core = solid(new T.IcosahedronGeometry(.29, 1), palette.gold, 0, .43);
    artifact("relic", globeDirection(29, -3), core).add(box(.60, .44, .60, palette.ink, 0, .20));
    anomaly = new T.Group().add(solid(new T.TorusGeometry(.59, .052, 11, 24), palette.crystal),
      solid(new T.TorusGeometry(.39, .032, 9, 24).rotateY(Math.PI / 3), palette.gold));
    anomaly.position.y = .72;
    artifact("anomaly", globeDirection(12, -66), anomaly).add(solid(new T.CylinderGeometry(.69, .64, .15, 17), palette.ink, 0, .08));
  }
  const points = flagMesh.geometry.getAttribute("position");
  return {
    root, vessel, radius, descent, targets,
    update(t: number, spin: boolean) {
      if (!spin) return;
      antenna.rotation.y = t * .31;
      if (anomaly) anomaly.rotation.set(t * .8, t * .41, t * .7);
      for (let i = 0; i < points.count; i++) points.setZ(i, Math.sin(t * 3 - points.getX(i) * 13) * (points.getX(i) + .28) * .13);
      points.needsUpdate = true;
    },
    dispose() { flagTexture.dispose(); disposeObjects(root); },
  };
}
