import * as T from "three";
import { mergeGeometries, mergeVertices } from "three/addons/utils/BufferGeometryUtils.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { projects, type Point, type Zone } from "./content";

const tau = Math.PI * 2;

function sampler(seed: number) {
  return () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

function surfaceTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 128;
  const context = canvas.getContext("2d")!;
  const pixels = context.createImageData(128, 128);
  const random = sampler(73);
  for (let i = 0; i < pixels.data.length; i += 4) {
    const value = Math.round(205 + random() * 45);
    pixels.data.set([value, value, value, 255], i);
  }
  context.putImageData(pixels, 0, 0);
  const texture = new T.CanvasTexture(canvas);
  texture.colorSpace = T.SRGBColorSpace;
  return texture;
}

function contactTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 128;
  const context = canvas.getContext("2d")!;
  const gradient = context.createRadialGradient(64, 64, 9, 64, 64, 63);
  gradient.addColorStop(0, "rgba(0,0,0,.7)");
  gradient.addColorStop(0.5, "rgba(0,0,0,.34)");
  gradient.addColorStop(1, "rgba(0,0,0,0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 128, 128);
  return new T.CanvasTexture(canvas);
}

function lit(color: number, emissiveIntensity = 0.65) {
  return new T.MeshLambertMaterial({ color, emissive: color, emissiveIntensity });
}

function roundedFootprint(width: number, depth: number, radius: number) {
  const w = width / 2;
  const d = depth / 2;
  const shape = new T.Shape();
  shape.moveTo(-w + radius, -d);
  shape.lineTo(w - radius, -d);
  shape.quadraticCurveTo(w, -d, w, -d + radius);
  shape.lineTo(w, d - radius);
  shape.quadraticCurveTo(w, d, w - radius, d);
  shape.lineTo(-w + radius, d);
  shape.quadraticCurveTo(-w, d, -w, d - radius);
  shape.lineTo(-w, -d + radius);
  shape.quadraticCurveTo(-w, -d, -w + radius, -d);
  return shape;
}

export type Hit = { zone: Zone; project?: number };
export const screenPositions: readonly Point[] = [
  [7.55, 1.95, 3.91], [4.57, 1.72, 3.72], [10.46, 1.72, 3.72], [4.26, 1.65, 1.03], [10.77, 1.65, 1.03],
];

export function buildModel(render: () => void, low: boolean) {
  const group = new T.Group();
  const batches = new Map<T.Material, { cast: T.BufferGeometry[]; plain: T.BufferGeometry[] }>();
  const textures = new Set<T.Texture>();
  const materials = new Set<T.Material>();
  const hits: T.Mesh<T.BufferGeometry, T.Material>[] = [];
  const noise = surfaceTexture();
  const ao = contactTexture();
  textures.add(noise);
  textures.add(ao);
  const random = sampler(317);
  const loader = new T.TextureLoader();
  function standard(color: number, roughness = 0.76, metalness = 0, map: T.Texture | null = null) {
    return low
      ? new T.MeshLambertMaterial({ color, map })
      : new T.MeshStandardMaterial({ color, roughness, metalness, map });
  }
  const concrete = standard(0x777a77, 0.95, 0, noise);
  const limestone = standard(0xbfc2ba, 0.92, 0, noise);
  const white = standard(0xd3d9d2, 0.61, 0.16);
  const road = standard(0x303438, 0.94, 0, noise);
  const pavement = standard(0x969992, 0.91, 0, noise);
  const joints = standard(0x616561);
  const graphite = standard(0x24282c, 0.65, 0.21);
  const black = standard(0x141719, 0.78, 0.1);
  const foundation = standard(0x363a3c, 0.86, 0, noise);
  const aluminium = standard(0xa3acaa, 0.36, 0.68);
  const brushed = standard(0x59605d, 0.42, 0.55, noise);
  const glass = low
    ? new T.MeshPhongMaterial({ color: 0x29383b, shininess: 56, specular: 0x686d72 })
    : new T.MeshPhysicalMaterial({
      color: 0x263438, roughness: 0.2, metalness: 0.47, clearcoat: 0.33, clearcoatRoughness: 0.22,
    });
  const windowGreen = lit(0x55734f, 0.18);
  const windowWarm = lit(0xe5c38a, 0.58);
  const lamp = lit(0xebffc8, 1.12);
  const green = lit(0xc4f35d, 0.95);
  const soil = standard(0x37422d, 1, 0, noise);
  const leaves = [0x35452c, 0x485b33, 0x536842, 0x64774c, 0x798958].map(color => standard(color, 0.99));
  const wood = standard(0x665546, 0.95);
  const glassStripe = standard(0x3f5055, 0.27, 0.56);
  const shadow = new T.MeshBasicMaterial({ map: ao, transparent: true, depthWrite: false, opacity: 0.85, polygonOffset: true, polygonOffsetFactor: -2 });
  const reflection = new T.MeshBasicMaterial({ map: ao, color: 0x000000, transparent: true, depthWrite: false, opacity: 0.9 });
  const whiteMarking = standard(0xcecec1, 0.88);

  function add(geometry: T.BufferGeometry, material: T.Material, x: number, y: number, z: number, cast = true, rx = 0, ry = 0, rz = 0) {
    geometry.rotateX(rx).rotateY(ry).rotateZ(rz).translate(x, y, z);
    let batch = batches.get(material);
    if (!batch) {
      batch = { cast: [], plain: [] };
      batches.set(material, batch);
    }
    (cast ? batch.cast : batch.plain).push(geometry);
    materials.add(material);
  }

  function box(x: number, y: number, z: number, w: number, h: number, d: number, m: T.Material, cast = true, ry = 0) {
    add(new T.BoxGeometry(w, h, d), m, x, y, z, cast, 0, ry);
  }

  function rounded(x: number, y: number, z: number, w: number, h: number, d: number, m: T.Material, radius = 0.08, ry = 0) {
    add(new RoundedBoxGeometry(w, h, d, low ? 1 : 2, radius), m, x, y, z, true, 0, ry);
  }

  function slab(w: number, d: number, height: number, radius: number, base: number, m: T.Material, x = 0, z = 0) {
    add(new T.ExtrudeGeometry(roundedFootprint(w, d, radius), {
      depth: height, steps: 1, bevelEnabled: false, curveSegments: 10,
    }), m, x, base, z, true, -Math.PI / 2);
  }

  function cylinder(x: number, y: number, z: number, rt: number, rb: number, h: number, m: T.Material, n = 32, cast = true) {
    add(new T.CylinderGeometry(rt, rb, h, n), m, x, y, z, cast);
  }

  function ring(x: number, y: number, z: number, radius: number, tube: number, m: T.Material, segments = 64) {
    add(new T.TorusGeometry(radius, tube, 6, segments), m, x, y, z, false, Math.PI / 2);
  }

  function groundShade(x: number, z: number, w: number, d: number, y = 0.054, material = shadow) {
    add(new T.PlaneGeometry(w, d), material, x, y, z, false, -Math.PI / 2);
  }

  function post(x: number, z: number, h: number, y = 0.05) {
    box(x, y + h / 2, z, 0.14, h, 0.14, graphite);
    box(x, y + h, z, 0.19, 0.06, 0.19, lamp, false);
  }

  function tree(x: number, z: number, size: number, base = 0.1) {
    groundShade(x, z, size * 1.8, size * 1.6, base + 0.013);
    cylinder(x, base + size * 0.37, z, size * 0.042, size * 0.068, size * 0.74, wood, 6);
    const count = low ? 12 : 31;
    for (let i = 0; i < count; i++) {
      const angle = random() * tau;
      const spread = (0.04 + random() * 0.39) * size;
      const radius = (0.108 + random() * 0.172) * size;
      const leaf = new T.IcosahedronGeometry(radius, low ? 0 : 1).scale(1.24, 0.53 + random() * 0.52, 1);
      add(leaf, leaves[Math.floor(random() * leaves.length)], x + Math.cos(angle) * spread,
        base + size * (0.66 + random() * 0.4) - spread * 0.18, z + Math.sin(angle) * spread, true, 0, angle);
    }
  }

  function grasses(x: number, z: number, n: number, spread: number, base = 0.052) {
    for (let i = 0; i < n; i++) {
      const angle = random() * tau;
      const r = random() * spread;
      const h = 0.12 + random() * 0.3;
      const g = new T.ConeGeometry(0.036 + random() * 0.06, h, 3);
      add(g, leaves[Math.floor(random() * leaves.length)], x + Math.cos(angle) * r, base + h / 2, z + Math.sin(angle) * r, false,
        random() * 0.35 - 0.17, angle, random() * 0.48 - 0.24);
    }
  }

  function sign(text: string, x: number, y: number, z: number, width: number, height: number, rotationX = 0, rotationY = 0, color = "#ebf1db") {
    const canvas = document.createElement("canvas");
    canvas.width = 768;
    canvas.height = Math.max(64, Math.round(768 * height / width));
    const ctx = canvas.getContext("2d")!;
    ctx.font = `600 ${Math.round(canvas.height * 0.68)}px Arial, sans-serif`;
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, canvas.width / 2, canvas.height / 2, canvas.width - 16);
    const texture = new T.CanvasTexture(canvas);
    texture.colorSpace = T.SRGBColorSpace;
    textures.add(texture);
    add(new T.PlaneGeometry(width, height), new T.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false }), x, y, z, false, rotationX, rotationY);
  }

  function proxy(x: number, y: number, z: number, w: number, h: number, d: number, hit: Hit) {
    const material = new T.MeshBasicMaterial({ visible: false });
    materials.add(material);
    const object = new T.Mesh(new T.BoxGeometry(w, h, d), material);
    object.position.set(x, y, z);
    object.userData.hit = hit;
    group.add(object);
    hits.push(object);
  }

  function bench(x: number, z: number, ry = 0) {
    rounded(x, 0.19, z, 1.55, 0.19, 0.46, concrete, 0.035, ry);
    box(x, 0.335, z, 1.57, 0.09, 0.42, wood, true, ry);
  }

  // A layered plinth, recessed panel joints and a raised paving surface.
  groundShade(0.45, 0.7, 44, 35, -2.31, reflection);
  slab(30.4, 22.2, 0.38, 2.5, -2.22, black);
  slab(31.95, 23.45, 0.32, 2.7, -1.84, graphite);
  slab(32.13, 23.63, 0.11, 2.7, -1.52, brushed);
  slab(32.25, 23.75, 1.14, 2.75, -1.41, foundation);
  slab(32.34, 23.84, 0.084, 2.8, -0.28, aluminium);
  slab(32.50, 24, 0.20, 2.82, -0.2, concrete);
  slab(31.89, 23.40, 0.035, 2.60, 0, road);
  for (let i = -6; i <= 6; i++) {
    box(i * 2.04, -0.84, 11.885, 0.03, 1.03, 0.028, black, false);
    box(i * 2.04, -0.84, -11.885, 0.03, 1.03, 0.028, black, false);
  }
  for (let i = -4; i <= 4; i++) {
    box(16.135, -0.84, i * 2.02, 0.03, 1.03, 0.035, black, false);
    box(-16.135, -0.84, i * 2.02, 0.03, 1.03, 0.035, black, false);
  }
  box(0, -0.94, 11.91, 26.5, 0.055, 0.048, brushed, false);
  box(16.15, -0.94, 0, 0.048, 0.055, 18.35, brushed, false);
  box(16.162, -0.76, 1.7, 0.043, 0.024, 11.22, aluminium, false);
  for (const depth of [-8.1, 7.68]) {
    box(16.171, -0.76, depth, 0.033, 0.029, 0.52, green, false);
  }
  box(-7.05, -0.83, 11.93, 9.15, 0.47, 0.045, graphite, false);
  box(-11.7, -0.83, 11.96, 0.025, 0.47, 0.054, green, false);
  sign("BERNECKI.DEV   /   WORLD", -7.04, -0.83, 11.976, 7.8, 0.35);
  for (let i = 0; i < 5; i++) box(10.0 + i * 0.36, -0.79, 11.93, 0.14, 0.035, 0.027, i === 0 ? green : aluminium, false);

  slab(28.2, 19.9, 0.06, 1.7, 0.033, pavement);
  slab(27.9, 19.6, 0.015, 1.64, 0.093, concrete);
  for (let x = -13; x <= 13; x += 1.3) box(x, 0.11, 0, 0.012, 0.006, 18.2, joints, false);
  for (let z = -9; z <= 9; z += 1.3) box(0, 0.11, z, 26.85, 0.006, 0.012, joints, false);
  for (let i = -12; i <= 12; i += 2) {
    box(i, 0.039, 10.53, 0.96, 0.012, 0.028, whiteMarking, false);
    box(i, 0.039, -10.61, 0.96, 0.012, 0.028, whiteMarking, false);
  }
  for (let i = -7; i <= 7; i += 2) box(14.98, 0.04, i, 0.031, 0.012, 0.75, whiteMarking, false);

  // Open courtyard with concentric paving, water and stone seating.
  cylinder(0, 0.16, 0.65, 4.14, 4.14, 0.14, limestone, 64);
  cylinder(0, 0.235, 0.65, 3.74, 3.74, 0.035, pavement, 64);
  ring(0, 0.256, 0.65, 3.45, 0.023, white);
  ring(0, 0.255, 0.65, 3.22, 0.012, joints);
  ring(0, 0.256, 0.65, 2.90, 0.015, white);
  cylinder(0, 0.33, 0.3, 1.61, 1.68, 0.19, graphite, 56);
  cylinder(0, 0.438, 0.3, 1.50, 1.50, 0.027, glass, 56, false);
  ring(0, 0.454, 0.3, 1.60, 0.027, aluminium);
  for (let i = 0; i < 28; i++) {
    const angle = i * tau / 28;
    const x = Math.cos(angle) * 3.83;
    const z = 0.65 + Math.sin(angle) * 3.83;
    box(x, 0.247, z, 0.025, 0.008, 0.22, i % 7 === 0 ? brushed : joints, false, Math.PI / 2 - angle);
  }
  const sculpture = new T.TorusGeometry(0.76, 0.1, 8, 52);
  add(sculpture, aluminium, 0, 1.26, 0.28, true, 0.18, 0.65, -0.24);
  add(new T.TorusGeometry(0.66, 0.024, 6, 48), lamp, 0, 1.26, 0.28, false, 0.18, 0.65, -0.24);
  box(0, 0.51, 0.28, 0.5, 0.16, 0.55, concrete);
  for (let i = 0; i < 4; i++) {
    const angle = i * tau / 4 + 0.78;
    bench(Math.sin(angle) * 3.7, 0.65 + Math.cos(angle) * 3.7, -angle);
  }

  const beds: readonly [number, number, number, number, number][] = [
    [-12.52, -6.12, 1.9, 4.55, 2], [-11.87, 0.85, 3.15, 1.56, 2],
    [-1.7, -8.48, 3.15, 1.55, 2], [0.58, -4.65, 3.1, 1.64, 2],
    [11.9, -5.7, 1.95, 5.3, 2], [12.49, 2.95, 1.5, 3.05, 2],
    [-11.9, 8.9, 3.0, 1.6, 2], [-2.15, 5.68, 2.0, 1.35, 1],
    [2.16, 7.72, 2.3, 1.54, 1], [11.73, 8.55, 2.9, 1.75, 2],
    [-6.0, 8.9, 2.5, 1.04, 1], [-12.4, 4.96, 1.28, 2.95, 1],
  ];
  for (const [x, z, w, d, count] of beds) {
    slab(w, d, 0.18, Math.min(w, d) * 0.23, 0.105, graphite, x, z);
    slab(w - 0.12, d - 0.12, 0.02, Math.min(w, d) * 0.22, 0.29, soil, x, z);
    for (let i = 0; i < count; i++) {
      const offset = (i - (count - 1) / 2) * 1.23;
      tree(x + (w >= d ? offset : 0), z + (d > w ? offset : 0), 0.95 + random() * 0.82, 0.32);
    }
    grasses(x, z, low ? 9 : 22, Math.min(w, d) * 0.43, 0.32);
  }
  for (const [x, z] of [[-13.7, 9.5], [-4.5, 9.55], [2, 9.6], [12.8, 9.6], [13.72, 6], [13.72, -2.3], [13.65, -9.2], [2.5, -9.7], [-13.55, -9.5]]) {
    post(x, z, 0.75);
  }

  // Headquarters: stepped concrete core, glazed office floors and a long silver cantilever.
  groundShade(-7.22, -5.37, 12, 8.6, 0.122);
  slab(9.78, 6.5, 0.21, 0.54, 0.11, limestone, -7.17, -5.31);
  rounded(-7.33, 1.31, -5.42, 8.45, 2.03, 5.04, glass, 0.09);
  rounded(-7.12, 2.67, -5.61, 10.25, 0.52, 5.75, white, 0.13);
  rounded(-7.9, 3.62, -6.14, 7.7, 1.30, 4.25, glass, 0.085);
  rounded(-7.95, 4.48, -6.18, 8.26, 0.39, 4.74, white, 0.11);
  rounded(-7.95, 4.692, -6.18, 7.81, 0.07, 4.34, brushed, 0.026);
  box(-7.91, 4.36, -3.807, 7.84, 0.032, 0.028, graphite, false);
  rounded(-8.72, 4.82, -6.68, 5.4, 0.26, 3.45, limestone, 0.10);
  rounded(-8.75, 5.045, -6.71, 4.62, 0.19, 2.72, graphite, 0.08);
  box(-7.27, 2.45, -2.82, 9.48, 0.048, 0.045, green, false);
  box(-2.51, 2.45, -5.45, 0.052, 0.048, 5.28, lamp, false);
  box(-7.87, 4.23, -3.92, 7.3, 0.035, 0.034, lamp, false);
  box(-4.0, 4.21, -6.08, 0.036, 0.04, 4.22, glassStripe, false);
  for (let i = 0; i < 12; i++) {
    const x = -11.37 + i * 0.73;
    box(x, 1.35, -2.876, 0.047, 1.97, 0.13, aluminium);
    box(x + 0.31, 1.24, -2.89, 0.37, 1.32, 0.074, i % 4 === 1 ? windowWarm : i % 3 === 0 ? windowGreen : glassStripe, false);
    if (i < 10) {
      box(x, 3.63, -3.989, 0.042, 1.15, 0.112, aluminium);
      if (i % 3 === 1) box(x + 0.31, 3.68, -4.0, 0.4, 0.88, 0.035, windowWarm, false);
    }
  }
  for (let i = 0; i < 9; i++) {
    const z = -7.8 + i * 0.57;
    box(-3.055, 1.35, z, 0.16, 2.0, 0.052, aluminium);
    box(-3.072, 1.17, z + 0.25, 0.038, 1.22, 0.4, i % 3 === 1 ? windowWarm : glassStripe, false);
  }
  box(-9.35, 1.31, -2.77, 3.6, 1.99, 0.18, graphite);
  sign("BERNECKI.DEV", -9.29, 1.62, -2.663, 3.33, 0.69);
  const brandPlate = new T.MeshBasicMaterial({ color: 0xbec8ba, transparent: true, depthWrite: false });
  const emblem = loader.load("/favicon.svg", () => {
    if (!textures.has(emblem)) return;
    brandPlate.map = emblem;
    brandPlate.color.setHex(0xffffff);
    brandPlate.needsUpdate = true;
    render();
  });
  emblem.colorSpace = T.SRGBColorSpace;
  textures.add(emblem);
  add(new T.PlaneGeometry(1.92, 1.92), brandPlate, -8.74, 5.149, -6.71, false, -Math.PI / 2);
  for (const [x, z] of [[-5.33, -7.36], [-5.33, -6.48]]) {
    rounded(x, 4.86, z, 0.97, 0.25, 0.53, graphite, 0.05);
    for (let i = 0; i < 6; i++) box(x - 0.348 + i * 0.137, 5.0, z, 0.04, 0.025, 0.37, aluminium, false);
  }
  for (let i = 0; i < 7; i++) box(-2.56, 2.61, -7.94 + i * 0.42, 0.03, 0.12, 0.15, brushed, false);
  for (let i = 0; i < 3; i++) box(-4.75, 0.163 + i * 0.064, -1.9 - i * 0.165, 2.67, 0.12, 0.48, limestone);
  for (const x of [-6.12, -3.38]) post(x, -1.74, 1.07, 0.1);
  proxy(-7.3, 2.65, -5.4, 10.2, 5.1, 5.8, { zone: "hq" });

  // Development studio: sawtooth light wells, a deep maker-space window and roof services.
  groundShade(-8.21, 5.17, 9.55, 6.4, 0.122);
  slab(8.56, 5.4, 0.16, 0.40, 0.11, limestone, -8.0, 5.2);
  rounded(-8.15, 1.08, 5.17, 7.16, 1.68, 4.31, glass, 0.08);
  box(-8.15, 0.39, 5.16, 7.28, 0.22, 4.44, graphite);
  box(-8.1, 2.04, 5.2, 7.69, 0.20, 4.67, aluminium);
  const saw = new T.Shape();
  saw.moveTo(0, 0);
  saw.lineTo(1.61, 0);
  saw.lineTo(1.61, 0.88);
  saw.closePath();
  for (let i = 0; i < 4; i++) {
    const x = -11.63 + i * 1.77;
    add(new T.ExtrudeGeometry(saw, { depth: 3.85, bevelEnabled: false, steps: 1 }), graphite, x, 2.14, 3.16);
    add(new T.BoxGeometry(1.89, 0.105, 4.35), limestone, x + 0.83, 2.62, 5.08, true, 0, 0, 0.5);
    box(x + 1.65, 2.62, 5.1, 0.074, 0.68, 3.7, windowGreen, false);
    for (let j = 0; j < 5; j++) box(x + 1.673, 2.58, 3.52 + j * 0.74, 0.09, 0.75, 0.039, aluminium, false);
    box(x + 0.8, 2.13, 7.36, 1.52, 0.037, 0.04, lamp, false);
  }
  for (let i = 0; i < 12; i++) {
    const x = -11.6 + i * 0.62;
    box(x, 1.15, 7.37, 0.045, 1.47, 0.11, aluminium);
    box(x + 0.23, 1.02, 7.344, 0.39, 1.14, 0.037, i % 3 === 0 ? windowWarm : glassStripe, false);
  }
  for (let i = 0; i < 6; i++) {
    const z = 3.35 + i * 0.635;
    box(-4.552, 1.27, z, 0.12, 1.51, 0.048, aluminium);
    box(-4.547, 1.16, z + 0.245, 0.025, 1.18, 0.46, i % 3 === 1 ? windowWarm : glassStripe, false);
  }
  rounded(-7.63, 0.87, 7.435, 2.7, 0.53, 0.12, graphite, 0.04);
  sign("DEV STUDIO", -7.63, 0.88, 7.501, 2.38, 0.41);
  proxy(-8.07, 1.57, 5.2, 7.6, 3.0, 4.6, { zone: "studio" });

  // An octagonal automation lab with glowing oculus and vertical screening.
  const labX = 7.65;
  const labZ = -5.78;
  groundShade(labX, labZ, 10.6, 8.9, 0.122);
  cylinder(labX, 0.24, labZ, 4.02, 4.09, 0.25, limestone, 12);
  cylinder(labX, 0.55, labZ, 3.65, 3.8, 0.4, graphite, 12);
  cylinder(labX, 1.69, labZ, 3.2, 3.35, 2.13, glass, 12);
  cylinder(labX, 2.89, labZ, 3.70, 3.58, 0.37, white, 12);
  cylinder(labX, 3.17, labZ, 3.30, 3.33, 0.22, graphite, 12);
  cylinder(labX, 3.33, labZ, 2.14, 2.33, 0.21, aluminium, 40);
  cylinder(labX, 3.449, labZ, 1.92, 1.92, 0.055, glass, 40, false);
  ring(labX, 3.48, labZ, 1.94, 0.071, green);
  ring(labX, 3.474, labZ, 1.66, 0.018, aluminium);
  ring(labX, 2.69, labZ, 3.29, 0.025, lamp);
  for (let i = 0; i < 36; i++) {
    const angle = i * tau / 36;
    const x = labX + Math.cos(angle) * 3.225;
    const z = labZ + Math.sin(angle) * 3.225;
    box(x, 1.65, z, 0.24, 1.96, 0.047, aluminium, true, -angle);
    if (i % 3 === 0) box(labX + Math.cos(angle + 0.07) * 3.13, 1.25, labZ + Math.sin(angle + 0.07) * 3.13, 0.048, 0.9, 0.21, windowGreen, false, -angle);
  }
  rounded(labX, 1.42, labZ + 3.25, 2.39, 1.84, 0.44, graphite, 0.11);
  box(labX, 1.33, labZ + 3.49, 1.78, 1.62, 0.055, glass);
  box(labX + 0.95, 1.66, labZ + 3.49, 0.023, 1.96, 0.035, green, false);
  sign("AI LAB", labX, 2.41, labZ + 3.50, 1.92, 0.44);
  box(labX - 0.65, 3.69, labZ, 0.07, 0.43, 0.07, brushed);
  cylinder(labX - 0.65, 3.94, labZ, 0.078, 0.078, 0.10, lamp, 8, false);
  proxy(labX, 1.61, labZ, 6.74, 3.35, 6.75, { zone: "lab" });

  // Open exhibition with a cantilevered canopy and five real project displays.
  groundShade(7.52, 2.4, 11.8, 6.6, 0.122);
  slab(9.97, 5.56, 0.23, 0.48, 0.112, limestone, 7.54, 2.12);
  rounded(7.59, 0.39, 2.11, 9.38, 0.12, 4.98, graphite, 0.055);
  for (const x of [3.05, 12.08]) {
    rounded(x, 1.92, 0.32, 0.26, 3.02, 0.29, aluminium, 0.05);
    rounded(x, 1.92, 3.85, 0.26, 3.02, 0.29, aluminium, 0.05);
  }
  rounded(7.55, 3.52, 1.60, 9.85, 0.28, 3.89, limestone, 0.085);
  rounded(7.63, 3.674, 1.56, 9.50, 0.049, 3.50, brushed, 0.015);
  box(7.55, 3.41, 3.57, 9.53, 0.105, 0.18, graphite);
  box(7.55, 3.345, 3.62, 8.75, 0.042, 0.07, green, false);
  for (let i = 0; i < 8; i++) box(3.53 + i * 1.15, 3.681, 1.62, 0.028, 0.016, 3.42, aluminium, false);
  for (let i = 0; i < 3; i++) box(7.57, 3.35, 0.52 + i * 0.86, 8.0, 0.028, 0.045, lamp, false);
  sign("PROJECT GALLERY", 7.53, 3.52, 3.556, 4.5, 0.22, 0, 0, "#182116");
  box(7.57, 0.356, 4.71, 8.85, 0.07, 0.14, brushed, true);
  box(7.57, 0.4, 4.73, 8.74, 0.026, 0.06, lamp, false);
  screenPositions.forEach(([x, y, z], i) => {
    const width = i === 0 ? 3.17 : i < 3 ? 2.30 : 1.56;
    const height = width * 0.5625;
    const angle = i === 3 ? -0.64 : i === 4 ? 0.64 : 0;
    rounded(x, y, z - 0.095, width + 0.17, height + 0.18, 0.2, black, 0.065, angle);
    box(x, (y - height / 2 + 0.42) / 2, z - 0.15, 0.125, y - height / 2 - 0.39, 0.16, brushed);
    box(x, 0.452, z - 0.13, width * 0.53, 0.062, 0.55, brushed);
    const material = new T.MeshBasicMaterial({ color: i === 0 ? 0x66715d : 0x50574f, toneMapped: false });
    const texture = loader.load(`/images/world/${projects[i].id}.webp`, () => {
      if (!textures.has(texture)) return;
      material.map = texture;
      material.color.setHex(0xffffff);
      material.needsUpdate = true;
      render();
    });
    texture.colorSpace = T.SRGBColorSpace;
    textures.add(texture);
    add(new T.PlaneGeometry(width, height), material, x + Math.sin(angle) * 0.015, y, z + 0.015, false, 0, angle);
    proxy(x, y, z, width, height, 0.18, { zone: "gallery", project: i });
  });
  proxy(7.6, 3.54, 1.58, 9.8, 0.33, 3.59, { zone: "gallery" });

  // Contact pavilion and a roadside model SUV.
  groundShade(6.04, 8.30, 7.22, 4.33, 0.122);
  slab(5.66, 2.72, 0.21, 0.43, 0.11, limestone, 6.02, 8.28);
  rounded(6.04, 2.19, 8.22, 5.02, 0.25, 2.51, graphite, 0.11);
  box(6.04, 2.08, 9.45, 4.72, 0.036, 0.04, lamp, false);
  box(6.04, 2.324, 8.23, 4.11, 0.038, 1.8, brushed);
  for (const x of [3.78, 8.3]) {
    rounded(x, 1.19, 7.26, 0.13, 1.79, 0.18, aluminium, 0.035);
    rounded(x, 1.19, 9.18, 0.13, 1.79, 0.18, aluminium, 0.035);
  }
  box(6.07, 1.12, 7.39, 4.2, 1.56, 0.16, glass);
  for (let i = 0; i < 7; i++) box(4.23 + i * 0.61, 1.14, 7.49, 0.048, 1.51, 0.045, aluminium);
  rounded(6.14, 1.36, 7.53, 2.20, 0.52, 0.14, graphite, 0.05);
  sign("CONTACT", 6.14, 1.36, 7.608, 1.90, 0.38);
  rounded(8.98, 1.42, 8.77, 0.48, 2.57, 0.47, graphite, 0.06);
  box(8.98, 2.48, 9.01, 0.27, 0.25, 0.028, green, false);
  box(9.227, 2.48, 8.77, 0.028, 0.25, 0.27, green, false);
  bench(5.28, 8.65);
  proxy(6.05, 1.24, 8.32, 5.18, 2.24, 2.54, { zone: "contact" });
  proxy(8.98, 1.42, 8.77, 0.48, 2.57, 0.47, { zone: "contact" });

  const carX = -2.43;
  const carZ = 8.61;
  groundShade(carX, carZ, 3.45, 1.67, 0.123);
  rounded(carX, 0.43, carZ, 2.50, 0.42, 1.01, brushed, 0.16);
  rounded(carX - 0.17, 0.72, carZ, 1.53, 0.43, 0.88, glass, 0.20);
  rounded(carX - 0.2, 0.91, carZ, 1.26, 0.09, 0.72, graphite, 0.045);
  for (const wheelX of [carX - 0.79, carX + 0.78]) {
    for (const side of [-1, 1]) {
      add(new T.CylinderGeometry(0.235, 0.235, 0.144, 16), black, wheelX, 0.335, carZ + side * 0.49, true, Math.PI / 2);
      add(new T.CylinderGeometry(0.151, 0.151, 0.035, 12), aluminium, wheelX, 0.335, carZ + side * 0.569, true, Math.PI / 2);
    }
  }
  for (const side of [-1, 1]) {
    box(carX + 1.218, 0.51, carZ + side * 0.296, 0.052, 0.069, 0.234, lamp, false);
    box(carX - 1.217, 0.49, carZ + side * 0.289, 0.052, 0.063, 0.218, lit(0xce332d, 0.5), false);
  }
  for (const x of [-4.03, -0.94]) box(x, 0.121, 8.63, 0.024, 0.011, 1.50, whiteMarking, false);

  for (let i = 0; i < 8; i++) {
    box(0.58 + i * 0.21, 0.045, 10.4, 0.092, 0.013, 0.63, whiteMarking, false);
    box(-13.74, 0.05, -1.24 + i * 0.22, 0.62, 0.013, 0.09, whiteMarking, false);
  }
  // Fine perimeter guardrails and park lights read clearly on the bevel.
  for (const [x, z, ry] of [[-9.2, -10.06, 0], [8.85, -10.06, 0], [13.84, -5.91, Math.PI / 2], [-13.83, 4.9, Math.PI / 2]]) {
    box(x, 0.63, z, 4.35, 0.051, 0.063, aluminium, true, ry);
    box(x, 0.30, z, 4.35, 0.032, 0.041, brushed, true, ry);
    for (let j = -2; j <= 2; j++) {
      box(x + Math.cos(ry) * j * 1.02, 0.38, z + Math.sin(ry) * j * 1.02, 0.052, 0.55, 0.052, aluminium);
    }
  }
  for (const [x, z] of [[-2.1, 2.37], [1.89, 2.77], [0.17, -2.7], [2.37, -1.17], [-2.95, -0.43]]) {
    grasses(x, z, 13, 0.35, 0.255);
  }

  for (const [material, { cast, plain }] of batches) {
    for (const [geometries, castsShadow] of [[cast, true], [plain, false]] as const) {
      if (!geometries.length) continue;
      const compatible = geometries.map(geometry => {
        if (geometry.index) return geometry;
        const indexed = mergeVertices(geometry);
        geometry.dispose();
        return indexed;
      });
      const merged = mergeGeometries(compatible)!;
      compatible.forEach(geometry => geometry.dispose());
      const mesh = new T.Mesh(merged, material);
      mesh.castShadow = castsShadow && !material.transparent;
      mesh.receiveShadow = !material.transparent;
      group.add(mesh);
    }
  }

  const beaconMaterial = lit(0xd8f98c, 0.8);
  materials.add(beaconMaterial);
  const beacon = new T.Mesh(new T.TorusGeometry(1.96, 0.021, 5, 48), beaconMaterial);
  beacon.rotation.x = -Math.PI / 2;
  beacon.position.set(labX, 3.573, labZ);
  group.add(beacon);

  const avatar = new T.Group();
  const avatarBody = new T.Mesh(new T.CapsuleGeometry(0.132, 0.23, 4, 10), white);
  avatarBody.position.y = 0.38;
  const avatarHead = new T.Mesh(new T.SphereGeometry(0.102, 12, 8), graphite);
  avatarHead.position.y = 0.648;
  const visor = new T.Mesh(new T.SphereGeometry(0.104, 12, 8, 0, Math.PI, Math.PI * 0.33, Math.PI * 0.24), green);
  visor.position.y = 0.65;
  avatar.add(avatarBody, avatarHead, visor);
  const legs = [-0.07, 0.07].map(x => {
    const leg = new T.Mesh(new T.CapsuleGeometry(0.044, 0.1, 3, 7), graphite);
    leg.position.set(x, 0.12, 0);
    avatar.add(leg);
    return leg;
  });
  const avatarShadow = new T.Mesh(new T.PlaneGeometry(0.72, 0.72), shadow);
  avatarShadow.rotation.x = -Math.PI / 2;
  avatarShadow.position.y = 0.008;
  avatar.add(avatarShadow);
  avatar.position.set(-0.93, 0.26, 2.68);
  avatar.rotation.y = 0.6;
  group.add(avatar);

  function dispose() {
    group.traverse(object => {
      if (object instanceof T.Mesh) object.geometry.dispose();
    });
    materials.forEach(material => material.dispose());
    textures.forEach(texture => texture.dispose());
    textures.clear();
  }

  return { group, hits, avatar, legs, beacon, dispose };
}
