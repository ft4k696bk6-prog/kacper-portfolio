import * as T from "three";
import { globeDirection, globeRadius } from "./globe";
import { surfaceFinish } from "./planetFinish";

export const lighthouseDirection = globeDirection(-37, -12);
const islands = [
  [31, 32, 0.84], [1, -40, 0.81], [33, -112, 0.59], [-24, 38, 0.47],
  [-36, 114, 0.72], [29, 148, 0.63], [-48, -125, 0.48], [62, -170, 0.36], [-37, -12, .26],
].map(([lat, lon, spread]) => ({ direction: globeDirection(lat, lon), spread }));
const coast = 0.65;
const palette = {
  ocean: new T.Color("#245a78"), deep: new T.Color("#142648"), shoal: new T.Color("#409194"),
  foam: new T.Color("#c5d8c2"), sand: new T.Color("#ac916e"), grass: new T.Color("#819571"),
  meadow: new T.Color("#a6a476"), pine: new T.Color("#4b655d"), rock: new T.Color("#9c8581"),
};
const sun = new T.Vector3(33, 56, 37).normalize();

export function terrainField({ x, y, z }: T.Vector3) {
  let closest = 0;
  const waves = Math.sin(x * 14 + y * 5) * Math.cos(z * 16 - y * 9) * 0.067
    + Math.sin(x * 38 - z * 26 + y * 13) * 0.024 + Math.sin(y * 24 + z * 16) * 0.027;
  for (const island of islands) {
    const distance = 1 - island.direction.x * x - island.direction.y * y - island.direction.z * z;
    closest = Math.max(closest, Math.exp(-distance * 2.3 / island.spread ** 2));
  }
  return closest + waves;
}

export function surfaceRadius(direction: T.Vector3) {
  return globeRadius + Math.max(0, terrainField(direction) - coast) * 0.62;
}

function paintTerrain(direction: T.Vector3, color: T.Color, value = terrainField(direction)) {
  const { x, y, z } = direction;
  const edge = T.MathUtils.smoothstep;
  const variation = Math.sin(x * 27 + y * 21 + z * 19) * Math.cos(z * 19 - y * 13);
  const grain = Math.sin(x * 83 + y * 43) * Math.sin(z * 46 - y * 37);
  const shore = edge(value, coast - .016, coast + .018);
  if (value < coast) {
    color.copy(palette.deep).lerp(palette.ocean, edge(value + variation * .030, -0.025, 0.49));
    color.lerp(palette.shoal, edge(value + grain * .006, 0.437, coast));
    const breakers = coast - value + grain * .003;
    const surf = 1 - edge(Math.abs(breakers - .022), .005, .020);
    const foam = (1 - edge(Math.abs(breakers - .062 + .004 * variation), .004, .014)) * (variation * .5 + .5);
    color.lerp(palette.foam, surf * (.36 + variation * .12) + foam * .16).lerp(palette.sand, shore);
    const wind = Math.sin(z * 31 + y * 19 + 1.4 * Math.sin(x * 8 - y * 10));
    const swell = edge(wind, .86, .99) * edge(variation, -.36, .83) * (1 - edge(value, .45, .61));
    color.multiplyScalar(1 + variation * .032 + grain * .012 + swell * .10);
    return 1 - shore;
  }
  const band = edge(value, coast + .009, coast + .086);
  color.copy(palette.sand).lerp(palette.grass, band);
  color.lerp(palette.pine, edge(value + variation * .061, .79, 1.035) * .86);
  color.lerp(palette.meadow, edge(variation, .20, .93) * band * .33);
  color.lerp(palette.rock, edge(value + grain * .029, .957, 1.10) * .47);
  color.lerp(palette.shoal, 1 - shore);
  color.multiplyScalar(1 + variation * .059 + grain * .038);
  return 1 - shore;
}

export function terrainFinish(low: boolean) {
  return surfaceFinish(low, paintTerrain, palette.shoal);
}

export function shapeTerrain(sphere: T.SphereGeometry) {
  const position = sphere.getAttribute("position");
  const direction = new T.Vector3();
  for (let i = 0; i < position.count; i++) {
    direction.fromBufferAttribute(position, i).normalize();
    direction.multiplyScalar(surfaceRadius(direction));
    position.setXYZ(i, direction.x, direction.y, direction.z);
  }
}

export function colorTerrain(sphere: T.SphereGeometry, software: boolean) {
  const position = sphere.getAttribute("position");
  const colors = new Float32Array(position.count * 3);
  const direction = new T.Vector3();
  const color = new T.Color();
  for (let i = 0; i < position.count; i++) {
    direction.fromBufferAttribute(position, i).normalize();
    const value = terrainField(direction);
    paintTerrain(direction, color, value);
    if (value > coast) {
      direction.multiplyScalar(globeRadius + (value - coast) * 0.62);
      position.setXYZ(i, direction.x, direction.y, direction.z);
      direction.normalize();
    }
    if (software) color.multiplyScalar(.47 + T.MathUtils.smoothstep(sun.dot(direction), -.4, .84) * .59);
    colors.set([color.r, color.g, color.b], i * 3);
  }
  sphere.setAttribute("color", new T.BufferAttribute(colors, 3));
  sphere.computeVertexNormals();
}
