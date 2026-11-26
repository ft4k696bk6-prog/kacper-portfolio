import * as T from "three";
import type { StopId } from "./content";
import { planetAtmosphere } from "./planetFinish";

export const globeRadius = 23;
const radians = Math.PI / 180;

export function globeDirection(latitude: number, longitude: number) {
  const pitch = latitude * radians;
  const yaw = longitude * radians;
  return new T.Vector3(Math.cos(pitch) * Math.cos(yaw), Math.sin(pitch), -Math.cos(pitch) * Math.sin(yaw));
}

// The origins anchor existing local architecture and paths to separate points on the globe.
const sites = {
  reenergy: [50, 17, -7.45, -7.28, 8.7, 6.1],
  starcars: [-16, -47, 6.69, 5.7, 9.6, 6.0],
  "isto-kebab": [14, -8, -5.35, 7.18, 6.3, 6.0],
  "b-crm": [35, 44, -9.55, -0.28, 6.75, 6.0],
  lab: [13, 55, 5.25, -7.77, 7.6, 7.2],
  motomizer: [-22, 28, 10.52, -0.38, 4.75, 4.5],
  beatmarket: [20, -101, 1.23, -2.68, 4.45, 2.9],
  studio: [46, -118, -2.68, -4.45, 3.25, 3.0],
  hq: [-3, 18, 0.10, 3.43, 6.35, 6.35],
} as const satisfies Partial<Record<StopId, readonly [number, number, number, number, number, number]>>;

export type SurfaceStop = keyof typeof sites;

export function makeSurfaceSites() {
  return Object.fromEntries(Object.entries(sites).map(([id, [lat, lon, x, z, width, depth]]) => {
    const normal = globeDirection(lat, lon);
    const east = new T.Vector3(Math.sin(lon * radians), 0, Math.cos(lon * radians)).negate();
    const south = east.clone().cross(normal).normalize();
    const matrix = new T.Matrix4().makeBasis(east, normal, south);
    const offset = new T.Vector3(-x, -0.03, -z).applyMatrix4(matrix).addScaledVector(normal, globeRadius);
    matrix.setPosition(offset);
    return [id, { normal, south, matrix, inverse: matrix.clone().invert(), x, z, width, depth }];
  })) as Record<SurfaceStop, {
    normal: T.Vector3; south: T.Vector3; matrix: T.Matrix4; inverse: T.Matrix4;
    x: number; z: number; width: number; depth: number;
  }>;
}

export function loadPlanet(software: boolean, low: boolean, finish?: T.Material) {
  const sphere = new T.SphereGeometry(globeRadius, low ? 76 : 140, low ? 46 : 84);
  const material = finish ?? (software
    ? new T.MeshBasicMaterial({ vertexColors: true, toneMapped: false })
    : new T.MeshPhongMaterial({ vertexColors: true, shininess: 18, specular: 0x122b38, emissive: 0x2c3b51, emissiveIntensity: 0.27 }));
  const globe = new T.Mesh(sphere, material);
  const group = new T.Group().add(globe);
  const atmosphere = planetAtmosphere(globeRadius, new T.Color("#568cba"), low, .72);
  group.add(atmosphere);
  if (!software) globe.receiveShadow = true;
  return {
    group,
    sphere,
    dispose() {
      globe.geometry.dispose();
      globe.material.dispose();
      atmosphere.geometry.dispose();
      atmosphere.material.dispose();
    },
  };
}
