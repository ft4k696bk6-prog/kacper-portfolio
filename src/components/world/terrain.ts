import * as T from "three";
import { globeDirection, globeRadius, makeSurfaceSites, type SurfaceStop } from "./globe";

const islands = [
  [31, 32, 0.84], [1, -40, 0.81], [33, -112, 0.59], [-24, 38, 0.47],
  [-36, 114, 0.72], [29, 148, 0.63], [-48, -125, 0.48], [62, -170, 0.36],
].map(([lat, lon, spread]) => ({ direction: globeDirection(lat, lon), spread }));
const coast = 0.65;
const palette = {
  ocean: new T.Color("#286c8a"), deep: new T.Color("#284376"), shoal: new T.Color("#54bca8"),
  foam: new T.Color("#a2d1b2"), sand: new T.Color("#e0b779"), grass: new T.Color("#8fb26b"),
  meadow: new T.Color("#b0bf77"), pine: new T.Color("#507a61"), rock: new T.Color("#977f7a"),
};
const sun = new T.Vector3(33, 56, 37).normalize();

export function terrainField({ x, y, z }: T.Vector3) {
  let closest = 0;
  const waves = Math.sin(x * 14 + y * 5) * Math.cos(z * 16 - y * 9) * 0.067
    + Math.sin(x * 38 - z * 26 + y * 13) * 0.024 + Math.sin(y * 24 + z * 16) * 0.027;
  for (const island of islands) {
    const distance = 1 - island.direction.dot({ x, y, z } as T.Vector3);
    closest = Math.max(closest, Math.exp(-distance * 2.3 / island.spread ** 2));
  }
  return closest + waves;
}

export function surfaceRadius(direction: T.Vector3) {
  return globeRadius + Math.max(0, terrainField(direction) - coast) * 0.62;
}

export function colorTerrain(sphere: T.SphereGeometry, software: boolean) {
  const position = sphere.getAttribute("position");
  const colors = new Float32Array(position.count * 3);
  const direction = new T.Vector3();
  const color = new T.Color();
  const edge = T.MathUtils.smoothstep;
  for (let i = 0; i < position.count; i++) {
    direction.fromBufferAttribute(position, i).normalize();
    const { x, y, z } = direction;
    const value = terrainField(direction);
    const variation = Math.sin(x * 27 + y * 21 + z * 19) * Math.cos(z * 19 - y * 13);
    const swell = Math.sin(x * 83 + y * 43) * Math.sin(z * 46 - y * 37);
    if (value < coast) {
      color.copy(palette.deep).lerp(palette.ocean, edge(value, -0.02, 0.48));
      color.lerp(palette.shoal, edge(value, 0.42, coast));
      color.lerp(palette.foam, edge(value + swell * 0.009, coast - 0.029, coast) * 0.88);
      color.multiplyScalar(1 + variation * 0.045 + swell * 0.023);
    } else {
      const band = edge(value, coast + 0.01, coast + 0.15);
      color.copy(palette.sand).lerp(palette.grass, band);
      color.lerp(palette.pine, edge(value + variation * 0.046, 0.82, 1.065) * 0.91);
      color.lerp(palette.meadow, edge(variation, 0.32, 0.94) * band * 0.46);
      color.lerp(palette.rock, edge(value, 0.99, 1.11) * 0.55);
      color.multiplyScalar(1 + variation * 0.04);
      direction.multiplyScalar(globeRadius + (value - coast) * 0.62);
      position.setXYZ(i, direction.x, direction.y, direction.z);
      direction.normalize();
    }
    if (software) color.multiplyScalar(0.49 + Math.pow(Math.max(0, sun.dot(direction)), 0.7) * 0.51);
    colors.set([color.r, color.g, color.b], i * 3);
  }
  sphere.setAttribute("color", new T.BufferAttribute(colors, 3));
  sphere.computeVertexNormals();
}

export type Road = { start: T.Vector3; end: T.Vector3; turn: T.Quaternion; angle: number };
export const roadPairs: [SurfaceStop, SurfaceStop][] = [
  ["reenergy", "b-crm"], ["reenergy", "studio"], ["b-crm", "lab"], ["lab", "hq"],
  ["hq", "motomizer"], ["motomizer", "starcars"], ["hq", "isto-kebab"], ["isto-kebab", "starcars"],
  ["isto-kebab", "reenergy"], ["starcars", "beatmarket"], ["beatmarket", "studio"], ["studio", "b-crm"],
];

export function makeRoads() {
  const sites = makeSurfaceSites();
  return roadPairs.map(([a, b]) => {
    const start = sites[a].normal;
    const end = sites[b].normal;
    return { start, end, turn: new T.Quaternion().setFromUnitVectors(start, end), angle: start.angleTo(end) };
  });
}

export function roadPoint(road: Road, t: number, result: T.Vector3, rotation: T.Quaternion) {
  return result.copy(road.start).applyQuaternion(rotation.identity().slerp(road.turn, t));
}

export function roadMeshes(roads: Road[]) {
  const positions: number[] = [], colors: number[] = [], indices: number[] = [];
  const radial = new T.Vector3(), sideways = new T.Vector3(), point = new T.Vector3();
  const turn = new T.Quaternion();
  const road = new T.Color("#777d87"), edge = new T.Color("#a99880"), bridge = new T.Color("#96755f"), dash = new T.Color("#edd1a1");
  function strip(route: Road, start: number, end: number, width: number, height: number, steps: number, kind: "edge" | "road" | "dash") {
    sideways.crossVectors(route.start, route.end).normalize();
    const offset = positions.length / 3;
    for (let i = 0; i <= steps; i++) {
      roadPoint(route, T.MathUtils.lerp(start, end, i / steps), radial, turn);
      for (const sign of [-1, 1]) {
        point.copy(radial).addScaledVector(sideways, width * sign / globeRadius).normalize();
        const span = terrainField(radial) < coast + 0.005;
        const color = kind === "dash" ? dash : kind === "road" ? (span ? bridge : road) : edge;
        point.multiplyScalar(Math.max(surfaceRadius(point) + height, globeRadius + (span ? 0.29 : 0) + height));
        positions.push(point.x, point.y, point.z);
        colors.push(color.r, color.g, color.b);
      }
      if (i) {
        const a = offset + i * 2;
        indices.push(a - 2, a - 1, a, a, a - 1, a + 1);
      }
    }
  }
  for (const route of roads) {
    const margin = 2.1 / (route.angle * globeRadius);
    const steps = Math.ceil(route.angle * 40);
    strip(route, margin, 1 - margin, 0.80, 0.048, steps, "edge");
    strip(route, margin, 1 - margin, 0.65, 0.070, steps, "road");
    const increment = 1.40 / (route.angle * globeRadius);
    for (let t = margin + increment * 0.5; t < 1 - margin - increment; t += increment) {
      strip(route, t, t + increment * 0.44, 0.041, 0.081, 2, "dash");
    }
  }
  const geometry = new T.BufferGeometry();
  geometry.setAttribute("position", new T.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("color", new T.Float32BufferAttribute(colors, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return new T.Mesh(geometry, new T.MeshLambertMaterial({ vertexColors: true, side: T.DoubleSide }));
}
