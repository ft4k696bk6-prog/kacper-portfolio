import * as T from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { globeDirection } from "./globe";
import type { Body } from "./discoveries";
import { frontNormal, worldSurface } from "./planetSurface";
import { planets } from "./planets";
import { laneGeometry, loopLane, regionFrame } from "./routes";
import { lighthouseDirection, surfaceRadius } from "./terrain";

const cream = 0xe4d6b7, petrol = 0x304c64, steel = 0x728594, red = 0xb74c40, gold = 0xd6a355, cyan = 0x75c4c5;

/** Small companions to the actual building meshes, at their district coordinates. */
export function orbitLandmarks(id: Body) {
  const parts: T.BufferGeometry[] = [];
  const surface = worldSurface(id);
  const north = frontNormal;
  const { east, south } = regionFrame(north);
  const frame = new T.Matrix4(), color = new T.Color();
  const rotation = new T.Quaternion();
  function mount(normal: T.Vector3, radius: number) {
    rotation.setFromUnitVectors(T.Object3D.DEFAULT_UP, normal);
    frame.makeRotationFromQuaternion(rotation).setPosition(normal.clone().multiplyScalar(radius));
  }
  function districtNormal(x: number, z: number) {
    return north.clone().addScaledVector(east, x).addScaledVector(south, z).normalize();
  }
  function town(x = 0, z = 0) {
    const normal = districtNormal(x, z);
    mount(normal, surface.radius(normal) + .035);
  }
  function add(geo: T.BufferGeometry, tint: number, x: number, y: number, z: number) {
    geo.translate(x, y, z).applyMatrix4(frame);
    const count = geo.attributes.position.count;
    if (!geo.index) geo.setIndex(Array.from({ length: count }, (_, i) => i));
    geo.deleteAttribute("uv");
    color.setHex(tint);
    const rgb = new Float32Array(count * 3);
    const channels = [color.r, color.g, color.b];
    for (let i = 0; i < rgb.length; i += 3) rgb.set(channels, i);
    geo.setAttribute("color", new T.BufferAttribute(rgb, 3));
    parts.push(geo);
  }
  function box(w: number, h: number, d: number, tint: number, x: number, y: number, z: number) {
    add(new T.BoxGeometry(w, h, d), tint, x, y, z);
  }
  function mast(top: number, foot: number, height: number, tint: number, x: number, y: number, z: number) {
    add(new T.CylinderGeometry(top, foot, height, 9), tint, x, y, z);
  }
  if (id === "home") {
    mount(lighthouseDirection, surfaceRadius(lighthouseDirection));
    mast(.34, .46, 1.64, cream, 0, .91, 0);
    mast(.38, .4, .21, red, 0, .95, 0);
    mast(.29, .33, .40, gold, 0, 1.98, 0);
    mast(0, .44, .4, red, 0, 2.4, 0);
  } else if (id === "starcars") {
    town(.44, .17);
    box(3.3, .18, 2.6, steel, 0, .08, 0);
    box(1.22, .7, .73, red, -.67, .46, .38);
    box(1.22, .7, .73, petrol, -.67, .46, -.53);
    box(1.22, .64, .73, cream, -.67, 1.11, -.53);
    mast(.11, .16, 1.95, gold, .63, 1, -.55);
    box(1.92, .20, .19, gold, .18, 1.92, -.55);
    const port = [{ normal: districtNormal(-.38, .045), radius: .089 }, { normal: districtNormal(.44, .17), radius: .10 }];
    const circuit = loopLane("road", .67, north, .86, surface, port) ?? loopLane("road", .61, north, 1, surface, port);
    if (circuit) parts.push(laneGeometry([circuit]));
  } else if (id === "reenergy") {
    town(-.34, -.20);
    for (const x of [-1.24, 0, 1.24]) {
      mast(.075, .14, 2.16, cream, x, 1.08, 0);
      for (let blade = 0; blade < 3; blade++) {
        const angle = blade * Math.PI * 2 / 3 + .32;
        add(new T.BoxGeometry(.16, .79, .10).translate(0, .39, 0).rotateZ(angle), cream, x, 2.16, .14);
      }
    }
    town(.35, .16);
    for (const x of [-.9, 0, .9]) for (const z of [-.55, .55]) {
      add(new T.BoxGeometry(.71, .11, .66).rotateX(.29), petrol, x, .51, z);
      mast(.07, .10, .44, steel, x, .23, z);
    }
  } else if (id === "b-crm") {
    town(.42, .21);
    for (const [x, h] of [[-1.06, 1.3], [0, 2.2], [1.06, 1.56]]) {
      box(.76, h, .69, petrol, x, h / 2, 0);
      box(.69, .19, .62, steel, x, h + .06, 0);
      box(.32, h * .68, .053, cyan, x, h * .53, .36);
    }
  } else if (id === "ai") {
    town(-.36, -.19);
    add(new T.TorusGeometry(.68, .14, 6, 16), cyan, 0, 1.05, 0);
    box(1.45, .17, .79, petrol, 0, .12, 0);
    town(.41, .15);
    for (const [x, h] of [[-.9, .86], [0, 1.37], [.9, .72]]) {
      add(new T.OctahedronGeometry(h).scale(.42, 1, .42).rotateZ(.13), cyan, x, h * .86, 0);
    }
  } else if (id === "motomizer") {
    town(.39, .17);
    box(2.8, .24, 1.97, steel, 0, .16, 0);
    box(2.65, .89, 1.74, petrol, 0, .68, -.09);
    box(2.75, .16, 1.48, gold, 0, 1.15, -.27);
    for (const x of [-.86, .86]) mast(.14, .18, 1.65, red, x, 1.22, -.83);
  } else if (id === "beatmarket") {
    town(.40, .02);
    box(2.81, .30, 1.92, petrol, 0, .2, 0);
    box(2.33, 1.48, .26, 0xa95884, 0, 1.05, -.59);
    for (const x of [-1.09, -.52, 0, .52, 1.09]) box(.16, 1.05, .13, x === 0 ? cyan : gold, x, 1.08, -.41);
    box(2.74, .20, 1.32, 0x745489, 0, 1.92, -.42);
  } else if (id === "isto-kebab") {
    town(-.38, .045);
    for (const x of [-1.06, 0, 1.06]) {
      box(.88, .81, .71, cream, x, .4, .11);
      box(.96, .12, 1.02, red, x, .83, .28);
      box(.5, .4, .071, petrol, x, .53, .47);
    }
  } else if (id === "jalapeno") {
    town();
    box(4.03, .19, 2.61, petrol, 0, .10, 0);
    box(3.58, .14, 2.23, cream, 0, .25, 0);
    box(1.69, .88, .90, red, -.67, .92, -.21);
    box(1.24, .45, .07, petrol, -.67, 1.01, .24);
    box(1.25, .10, .38, cream, -.67, .87, .42);
    box(1.23, .08, .45, gold, -.67, 1.30, .44);
  } else {
    const normal = id === "signal" ? globeDirection(16, -24) : globeDirection(20, 26);
    mount(normal, planets[id].radius + .06);
    mast(.68, .76, .33, cream, 0, .16, 0);
    add(new T.SphereGeometry(.62, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), cyan, 0, .31, 0);
    box(.89, .31, .50, cream, -.91, .20, 0);
    if (id === "garage") {
      box(1.98, .19, 1.28, cream, .10, 1.12, 1.48);
      box(1.84, 1.02, .12, red, .10, .57, .89);
    } else if (id === "signal") {
      add(new T.TorusGeometry(.72, .12, 6, 16), cyan, 0, .86, -.84);
      box(.82, .49, 1.07, petrol, 1.07, .45, .29);
    }
  }
  const geometry = mergeGeometries(parts);
  parts.forEach(part => part.dispose());
  return new T.Mesh(geometry, new T.MeshLambertMaterial({ vertexColors: true, emissive: 0x626775, emissiveIntensity: .2 }));
}
