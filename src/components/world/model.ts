import * as T from "three";
import { mergeGeometries, mergeVertices } from "three/addons/utils/BufferGeometryUtils.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { projectIndex, type ProjectId, type Zone } from "./content";

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
  texture.wrapS = texture.wrapT = T.RepeatWrapping;
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
const sunlight = new T.Vector3(-18, 24, 11).normalize();

// Fit the scene exposure once per vertex for the software-rendered profile.
function filmicChannel(linear: number) {
  const exposed = linear * 1.75;
  const mapped = (exposed * (exposed + 0.0245786) - 0.000090537)
    / (exposed * (0.983729 * exposed + 0.432951) + 0.238081);
  return Math.round(T.MathUtils.clamp(mapped, 0, 1) * 255);
}

function bakeSurface(geometry: T.BufferGeometry, material: T.MeshLambertMaterial | T.MeshPhongMaterial) {
  const normal = geometry.getAttribute("normal");
  const position = geometry.getAttribute("position");
  const colors = new Uint8Array(normal.count * 3);
  const tint = geometry.getAttribute("color");
  const base = material.color;
  const emission = material.emissive;
  const intensity = material.emissiveIntensity;
  for (let i = 0; i < normal.count; i++) {
    const y = normal.getY(i);
    const direct = Math.max(0, normal.getX(i) * sunlight.x + y * sunlight.y + normal.getZ(i) * sunlight.z);
    const ambient = 0.57 + Math.max(0, y) * 0.23;
    const light = (ambient + direct * 0.59 + Math.min(0.045, Math.max(0, position.getY(i)) * 0.01)) * (tint ? tint.getX(i) : 1);
    colors[i * 3] = filmicChannel(base.r * light + emission.r * intensity);
    colors[i * 3 + 1] = filmicChannel(base.g * light * 0.99 + emission.g * intensity);
    colors[i * 3 + 2] = filmicChannel(base.b * light * 0.96 + emission.b * intensity);
  }
  geometry.deleteAttribute("normal");
  geometry.deleteAttribute("uv");
  geometry.setAttribute("color", new T.BufferAttribute(colors, 3, true));
  return geometry;
}

export function buildModel(low: boolean, bakeLighting = false) {
  const group = new T.Group();
  const batches = new Map<T.Material, { cast: T.BufferGeometry[]; plain: T.BufferGeometry[] }>();
  const textures = new Set<T.Texture>();
  const materials = new Set<T.Material>();
  const hits: T.Mesh<T.BufferGeometry, T.Material>[] = [];
  const noise = bakeLighting ? null : surfaceTexture();
  const ao = contactTexture();
  if (noise) textures.add(noise);
  textures.add(ao);
  const random = sampler(317);
  function standard(color: number, roughness = 0.76, metalness = 0, map: T.Texture | null = null) {
    return low
      ? new T.MeshLambertMaterial({ color, map })
      : new T.MeshStandardMaterial({ color, roughness, metalness, map });
  }
  const stone = standard(0xc0aa91, 0.95, 0, noise);
  const sandstone = standard(0xddc5a4, 0.91, 0, noise);
  const pale = standard(0xe9dbc4, 0.8, 0.06);
  const asphalt = standard(0x363b43, 0.97, 0, noise);
  const curb = standard(0x9c8e7d, 0.88, 0, noise);
  const slate = standard(0x30373e, 0.88, 0, noise);
  const graphite = standard(0x292e36, 0.64, 0.24);
  const black = standard(0x191b21, 0.79);
  const metal = standard(0x9ca5a7, 0.37, 0.56);
  const bronze = standard(0x997155, 0.44, 0.42);
  const wood = standard(0x62453a, 0.95);
  const soil = standard(0x4b563a, 1, 0, noise);
  const grass = standard(0x6f794e, 0.99, 0, noise);
  grass.vertexColors = true;
  const gardens = [0x576b43, 0x60714b, 0x798558, 0x7c8056].map(color => standard(color, 1));
  const leaves = [0x3d5137, 0x4f6542, 0x667b4b, 0x7d8e55, 0xa2a66b].map(color => standard(color, 0.98));
  const glass = low
    ? new T.MeshPhongMaterial({ color: 0x354a56, shininess: 72, specular: 0x737c8e })
    : new T.MeshPhysicalMaterial({ color: 0x354a56, roughness: 0.17, metalness: 0.36, clearcoat: 0.52 });
  const deepGlass = low
    ? new T.MeshPhongMaterial({ color: 0x202b37, shininess: 82, specular: 0x777e8b })
    : new T.MeshPhysicalMaterial({ color: 0x202b37, roughness: 0.16, metalness: 0.39, clearcoat: 0.59 });
  const warmGlass = lit(0xd1a369, 0.35);
  const cyanGlass = lit(0x287a82, 0.34);
  const lamp = lit(0xffd699, 0.84);
  const cyan = lit(0x61eadb, 0.82);
  const paintLine = standard(0xe8d9ba, 0.88);
  const shadow = new T.MeshBasicMaterial({ map: ao, transparent: true, depthWrite: false, opacity: 0.84, polygonOffset: true, polygonOffsetFactor: -2 });
  const reflection = new T.MeshBasicMaterial({ map: ao, color: 0x000000, transparent: true, depthWrite: false, opacity: 0.92 });

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
    const geometry = bakeLighting && radius < 0.055
      ? new T.BoxGeometry(w, h, d)
      : new RoundedBoxGeometry(w, h, d, low ? 1 : 2, radius);
    add(geometry, m, x, y, z, true, 0, ry);
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
    add(new T.TorusGeometry(radius, tube, 6, bakeLighting ? Math.min(segments, 36) : segments), m, x, y, z, false, Math.PI / 2);
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

  function projectHit(id: ProjectId, x: number, y: number, z: number, w: number, h: number, d: number) {
    proxy(x, y, z, w, h, d, { zone: "gallery", project: projectIndex(id) });
  }

  function band(inner: number, outer: number, y: number, material: T.Material) {
    add(new T.RingGeometry(inner, outer, low ? 84 : 136), material, 0, y, 0, false, -Math.PI / 2);
  }

  function ball(x: number, y: number, z: number, w: number, h: number, d: number, material: T.Material, rx = 0, ry = 0, rz = 0) {
    add(new T.SphereGeometry(1, low ? 10 : 18, low ? 7 : 12).scale(w, h, d), material, x, y, z, true, rx, ry, rz);
  }

  function rail(a: readonly [number, number, number], b: readonly [number, number, number], width: number, material: T.Material, cast = true) {
    const start = new T.Vector3(...a);
    const end = new T.Vector3(...b);
    const delta = end.clone().sub(start);
    const midpoint = start.lerp(end, 0.5);
    const rotation = new T.Quaternion().setFromUnitVectors(T.Object3D.DEFAULT_UP, delta.clone().normalize());
    const geometry = new T.BoxGeometry(width, delta.length(), width).applyQuaternion(rotation);
    add(geometry, material, midpoint.x, midpoint.y, midpoint.z, cast);
  }

  function flowerBed(x: number, z: number, width: number, depth: number) {
    rounded(x, 0.23, z, width, 0.32, depth, stone, 0.07);
    box(x, 0.40, z, width - 0.13, 0.035, depth - 0.13, soil);
    for (let i = 0; i < 7; i++) {
      const r = random();
      ball(x + (r - 0.5) * (width - 0.30), 0.45 + random() * 0.09, z + (random() - 0.5) * (depth - 0.25), 0.13, 0.17, 0.14, leaves[i % leaves.length]);
    }
  }

  function seat(x: number, z: number, angle = 0) {
    for (const t of [-0.48, 0.48]) box(x + Math.cos(angle) * t, 0.29, z - Math.sin(angle) * t, 0.08, 0.36, 0.46, graphite, true, angle);
    for (const t of [-0.13, 0, 0.13]) box(x + Math.sin(angle) * t, 0.47, z + Math.cos(angle) * t, 1.32, 0.065, 0.095, bronze, true, angle);
  }

  // A machined circular plinth, exposed terrain layers and a road shared by every address.
  const disk = low ? 84 : 144;
  groundShade(0.75, 1.15, 41, 40, -3.05, reflection);
  cylinder(0, -2.17, 0, 16.54, 15.15, 0.57, black, disk);
  cylinder(0, -1.82, 0, 16.69, 16.54, 0.17, bronze, disk);
  cylinder(0, -1.56, 0, 16.62, 16.69, 0.35, graphite, disk);
  cylinder(0, -0.85, 0, 16.21, 16.61, 1.07, slate, disk);
  cylinder(0, -0.22, 0, 16.26, 16.17, 0.23, stone, disk);
  cylinder(0, -0.015, 0, 16.08, 16.14, 0.19, asphalt, disk);
  cylinder(0, 0.065, 0, 13.45, 13.52, 0.13, curb, disk);
  add(terrainSurface(), grass, 0, 0.151, 0, false);
  band(13.59, 13.63, 0.084, paintLine);
  band(15.8, 15.84, 0.084, paintLine);
  ring(0, -0.26, 0, 16.22, 0.028, bronze, 144);
  function terrainSurface() {
    const strips = 13;
    const slices = low ? 88 : 144;
    const radius = 13.24;
    const points: number[] = [];
    const tints: number[] = [];
    const uv: number[] = [];
    const indices: number[] = [];
    for (let strip = 0; strip <= strips; strip++) {
      for (let slice = 0; slice <= slices; slice++) {
        const angle = slice / slices * tau;
        const r = radius * strip / strips;
        const x = r * Math.cos(angle), z = r * Math.sin(angle);
        const patch = 0.97 + Math.sin(x * 0.53 + Math.sin(z * 1.3)) * 0.083 + Math.cos(z * 0.76 - x * 0.74) * 0.052;
        points.push(x, 0, z);
        tints.push(patch, patch, patch * 0.98);
        uv.push(x * 0.40, z * 0.40);
        if (strip > 0 && slice > 0) {
          const a = strip * (slices + 1) + slice;
          const b = a - slices - 1;
          indices.push(a, b - 1, b, a, a - 1, b - 1);
        }
      }
    }
    const geometry = new T.BufferGeometry();
    geometry.setAttribute("position", new T.Float32BufferAttribute(points, 3));
    geometry.setAttribute("color", new T.Float32BufferAttribute(tints, 3));
    geometry.setAttribute("uv", new T.Float32BufferAttribute(uv, 2));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    return geometry;
  }
  for (let i = 0; i < 92; i++) {
    const a = i * tau / 92;
    const x = Math.sin(a);
    const z = Math.cos(a);
    box(x * 14.78, 0.086, z * 14.78, 0.45, 0.012, 0.043, paintLine, false, a);
    box(x * 16.43, -1.11, z * 16.43, 0.03, 0.45, 0.038, black, false, a);
    if (i % 5 === 0) post(x * 13.42, z * 13.42, 0.84, 0.12);
    if (i % 6 === 0) box(x * 16.51, -1.69, z * 16.51, 0.38, 0.033, 0.04, lamp, false, a);
  }
  for (let i = 0; i < 40; i++) {
    const a = i * tau / 40 + 0.08;
    const x = Math.sin(a);
    const z = Math.cos(a);
    const g = new T.IcosahedronGeometry(1, 0).scale(0.75 + random() * 1.55, 0.26 + random() * 0.48, 0.18 + random() * 0.34);
    add(g, i % 6 === 0 ? wood : slate, x * (16.08 + random() * 0.13), -0.83 + random() * 0.20, z * (16.08 + random() * 0.13), false, 0, a, (random() - 0.5) * 0.16);
  }
  for (let i = 0; i < 6; i++) {
    const a = i * tau / 6 + 0.37;
    const dirX = Math.sin(a), dirZ = Math.cos(a);
    box(dirX * 8.2, 0.162, dirZ * 8.2, 1.26, 0.028, 10.0, stone, false, a);
    for (let j = -2; j <= 2; j++) {
      box(dirX * 14.58 + Math.cos(a) * j * 0.24, 0.089, dirZ * 14.58 - Math.sin(a) * j * 0.24, 0.1, 0.014, 1.13, paintLine, false, a);
    }
  }
  for (const [x, z, w, d] of [[-7.4,-7.2,8.7,6.1],[-9.6,-0.10,6.75,6.0],[-5.55,7.65,6.7,5.4],[6.55,5.65,9.6,6.0],[5.3,-7.8,7.2,6.3],[10.5,-0.45,4.65,3.8],[1.2,-2.55,4.25,2.3],[-2.65,-4.45,2.9,2.55]]) {
    slab(w, d, 0.075, 0.58, 0.15, curb, x, z);
    slab(w - 0.14, d - 0.14, 0.035, 0.54, 0.22, stone, x, z);
    for (let i = 1; i * 0.65 < w - 0.85; i++) {
      box(x - w / 2 + 0.36 + i * 0.65, 0.257, z, 0.014, 0.004, d - 0.37, curb, false);
    }
    for (let i = 1; i * 0.65 < d - 0.85; i++) {
      box(x, 0.257, z - d / 2 + 0.36 + i * 0.65, w - 0.43, 0.004, 0.014, curb, false);
    }
  }
  for (const [x, z, size] of [[-10.6,-6.8,1.6],[-11.9,-3.8,1.4],[-12.4,2.9,1.55],[-10.35,5.12,1.42],[-8.7,8.1,1.6],[-5.55,10.8,1.36],[-1.15,11.7,1.52],[1.65,10.9,1.44],[9.2,8.8,1.24],[12.1,3.4,1.45],[12.6,-3.5,1.46],[9.3,-8.1,1.38],[4.4,-11.35,1.32],[0.5,-11.65,1.45],[-3.1,-10.4,1.57],[-3.6,2.22,1.35],[2.71,2.2,1.24],[3.6,-4.55,1.24],[-5.65,-3.63,1.2]]) {
    cylinder(x, 0.158, z, 0.52, 0.55, 0.025, gardens[Math.floor(random() * gardens.length)], 15, false);
    tree(x, z, size, 0.151);
  }
  for (const [x,z] of [[-10.7,3.7],[-7.7,4.6],[-3.15,9.5],[2.8,8.8],[11.6,2.0],[7.9,-4.5],[-1.0,-8.0],[-10.25,-4.0],[-3.95,-2.0],[3.4,3.0]]) {
    grasses(x, z, low ? 11 : 23, 0.53, 0.15);
  }

  // ReEnergy. Terracotta structure, glass showroom and two tracked arrays of solar cells.
  const terracotta = standard(0xb58362, 0.81, 0, noise);
  const solarFrame = standard(0x93a7b6, 0.44, 0.37);
  const solarCell = [0x2c4968, 0x325373, 0x466b86].map(color => standard(color, 0.28, 0.42));
  const solarGrid = standard(0x9aaab9, 0.53, 0.35);
  const energyX = -7.45, energyZ = -7.28;
  shadeBuilding(energyX, energyZ, 8.6, 6.2);
  rounded(energyX, 0.37, energyZ, 6.75, 0.26, 4.05, slate, 0.10);
  rounded(energyX, 1.38, energyZ, 6.25, 1.96, 3.48, terracotta, 0.08);
  box(energyX, 1.37, energyZ + 1.75, 5.98, 1.49, 0.054, glass);
  for (let i = -5; i <= 5; i++) box(energyX + i * 0.56, 1.34, energyZ + 1.78, 0.048, 1.55, 0.065, pale);
  for (let i = -4; i <= 4; i++) {
    box(energyX + i * 0.53, 1.2, energyZ + 1.79, 0.38, 0.7, 0.025, i % 3 === 0 ? warmGlass : deepGlass, false);
  }
  rounded(energyX, 2.51, energyZ, 6.66, 0.29, 3.93, sandstone, 0.08);
  box(energyX, 2.332, energyZ + 1.99, 6.0, 0.065, 0.055, lamp, false);
  sign("RE · ENERGY", energyX, 2.52, energyZ + 1.97, 2.7, 0.33, 0, 0, "#342a25");
  for (const z of [energyZ - 0.91, energyZ + 0.46]) {
    for (let i = -1; i <= 1; i++) panel(energyX + i * 1.9, 2.95, z, 1.69, 1.13);
  }
  for (const x of [energyX - 2.4, energyX + 2.4]) flowerBed(x, energyZ + 2.35, 1.42, 0.72);
  projectHit("reenergy", energyX, 1.88, energyZ, 6.86, 3.44, 4.09);

  function panel(x: number, y: number, z: number, width: number, depth: number) {
    const tilt = 0.31;
    for (const dx of [-0.64, 0.64]) {
      rail([x + dx, y - 0.32, z - 0.34], [x + dx, y + 0.1, z - 0.34], 0.08, graphite);
      rail([x + dx, y - 0.32, z + 0.34], [x + dx, y - 0.09, z + 0.34], 0.08, graphite);
    }
    add(new T.BoxGeometry(width, 0.066, depth), solarFrame, x, y, z, true, tilt);
    add(new T.BoxGeometry(width - 0.067, 0.024, depth - 0.065), solarCell[Math.floor(random() * 3)], x, y + 0.045, z + 0.013, true, tilt);
    for (let i = -2; i <= 2; i++) {
      add(new T.BoxGeometry(0.016, 0.011, depth - 0.071), solarGrid, x + i * width / 6, y + 0.059, z + 0.017, false, tilt);
    }
    for (const t of [-0.25, 0, 0.25]) {
      add(new T.BoxGeometry(width - 0.065, 0.01, 0.014), solarGrid, x, y + 0.057 - Math.sin(tilt) * depth * t, z + 0.016 + Math.cos(tilt) * depth * t, false, tilt);
    }
  }

  // A civic building as a visual metaphor for B-CRM. The project description is independent of the fiction.
  const civicX = -9.55, civicZ = -0.28;
  const civicRoof = standard(0x73777a, 0.68, 0.38);
  const civicTrim = standard(0xae9c81, 0.76, 0.06);
  const civicBay = standard(0x756e61, 0.93);
  shadeBuilding(civicX, civicZ, 7.75, 6.3);
  rounded(civicX, 0.42, civicZ, 5.90, 0.33, 4.54, civicTrim);
  box(civicX, 1.73, civicZ - 0.2, 5.38, 2.56, 3.62, sandstone);
  for (const side of [-1, 1]) {
    box(civicX + side * 1.99, 1.76, civicZ + 1.64, 1.21, 2.49, 0.53, sandstone);
    for (const y of [1.02, 2.13]) {
      box(civicX + side * 1.99, y, civicZ + 1.92, 0.66, 0.70, 0.052, civicTrim);
      box(civicX + side * 1.99, y + 0.02, civicZ + 1.95, 0.51, 0.59, 0.05, warmGlass, false);
      box(civicX + side * 1.99, y + 0.02, civicZ + 1.982, 0.034, 0.57, 0.025, graphite);
      box(civicX + side * 1.99, y - 0.34, civicZ + 1.97, 0.75, 0.056, 0.11, pale);
      for (const dz of [-1.25, -0.42, 0.41, 1.24]) {
        box(civicX + side * 2.71, y, civicZ + dz, 0.035, 0.57, 0.47, y > 2 ? deepGlass : warmGlass, false);
        box(civicX + side * 2.73, y - 0.31, civicZ + dz, 0.045, 0.045, 0.54, civicTrim);
      }
    }
  }
  box(civicX, 1.52, civicZ + 1.63, 2.88, 1.81, 0.23, civicBay);
  box(civicX, 1.28, civicZ + 1.77, 1.16, 1.51, 0.037, deepGlass);
  box(civicX, 1.27, civicZ + 1.80, 0.06, 1.51, 0.045, bronze);
  for (const x of [-1.36,-0.47,0.47,1.36]) {
    cylinder(civicX + x, 1.63, civicZ + 2.22, 0.101, 0.138, 1.98, pale, 12);
    cylinder(civicX + x, 0.64, civicZ + 2.22, 0.15, 0.17, 0.12, civicTrim, 12);
    cylinder(civicX + x, 2.58, civicZ + 2.22, 0.17, 0.14, 0.105, pale, 12);
  }
  for (let i = 0; i < 4; i++) box(civicX, 0.27 + i * 0.074, civicZ + 2.65 - i * 0.123, 3.25, 0.10, 0.79 - i * 0.06, civicTrim);
  box(civicX, 2.78, civicZ + 1.83, 3.24, 0.27, 0.98, pale);
  sign("URZĄD SKARBOWY", civicX, 2.78, civicZ + 2.329, 2.96, 0.19, 0, 0, "#322b25");
  box(civicX, 3.07, civicZ - 0.07, 5.81, 0.15, 4.28, pale);
  box(civicX, 3.17, civicZ - 0.1, 5.5, 0.09, 3.98, civicTrim);
  const roof = new T.CylinderGeometry(1, 1.62, 0.62, 4, 1).rotateY(Math.PI / 4).scale(2.44, 1, 1.66);
  add(roof, civicRoof, civicX, 3.46, civicZ - 0.12, true);
  box(civicX, 3.79, civicZ - 0.12, 2.6, 0.10, 1.86, civicRoof);
  const pediment = new T.Shape().moveTo(-1.62, 0).lineTo(0, 0.61).lineTo(1.62, 0).closePath();
  add(new T.ExtrudeGeometry(pediment, { depth: 0.13, bevelEnabled: false }), sandstone, civicX, 2.92, civicZ + 2.24);
  rail([civicX - 1.63, 2.94, civicZ + 2.39], [civicX, 3.56, civicZ + 2.39], 0.07, pale);
  rail([civicX, 3.56, civicZ + 2.39], [civicX + 1.63, 2.94, civicZ + 2.39], 0.07, pale);
  add(new T.CylinderGeometry(0.13, 0.13, 0.04, 20), bronze, civicX, 3.15, civicZ + 2.386, false, Math.PI / 2);
  projectHit("b-crm", civicX, 2.07, civicZ + 0.11, 5.91, 3.72, 5.2);

  function shadeBuilding(x: number, z: number, w: number, d: number) {
    groundShade(x + 0.36, z - 0.25, w, d, 0.263);
  }

  // Isto Kebab. Ribbed counter, striped canopy, scaled menu and a roof-mounted kebab.
  const kioskX = -5.35, kioskZ = 7.18;
  const orange = standard(0xc95f31, 0.63, 0.04);
  const awning = standard(0xde7750, 0.89);
  const tortilla = standard(0xd7a96e, 0.89);
  shadeBuilding(kioskX, kioskZ + 0.48, 6.25, 4.75);
  rounded(kioskX, 0.35, kioskZ, 4.1, 0.18, 2.86, black);
  rounded(kioskX, 1.35, kioskZ, 3.91, 1.91, 2.72, orange);
  box(kioskX, 1.55, kioskZ + 1.381, 3.29, 0.91, 0.07, black);
  box(kioskX - 0.18, 1.54, kioskZ + 1.42, 2.49, 0.70, 0.035, warmGlass, false);
  box(kioskX, 1.14, kioskZ + 1.59, 3.57, 0.094, 0.48, wood);
  for (let i = -9; i <= 9; i++) box(kioskX + i * 0.193, 0.77, kioskZ + 1.384, 0.035, 0.53, 0.049, i % 4 === 0 ? bronze : wood);
  box(kioskX + 1.40, 1.56, kioskZ + 1.425, 0.43, 0.64, 0.04, graphite);
  for (let i = 0; i < 4; i++) box(kioskX + 1.39, 1.77 - i * 0.094, kioskZ + 1.448, 0.285 - (i % 2) * 0.09, 0.023, 0.012, pale, false);
  for (const side of [-1, 1]) {
    box(kioskX + side * 1.82, 1.60, kioskZ + 1.42, 0.059, 1.2, 0.07, bronze);
    box(kioskX + side * 1.96, 1.47, kioskZ, 0.022, 0.75, 1.52, deepGlass);
  }
  rounded(kioskX, 2.40, kioskZ, 4.25, 0.29, 2.96, pale, 0.09);
  box(kioskX, 2.35, kioskZ + 1.50, 3.85, 0.45, 0.06, graphite);
  sign("ISTO KEBAB", kioskX, 2.36, kioskZ + 1.54, 3.28, 0.41, 0, 0, "#fff0d0");
  for (let i = 0; i < 12; i++) {
    const x = kioskX + (i - 5.5) * 0.33;
    const material = i % 2 === 0 ? awning : pale;
    add(new T.BoxGeometry(0.331, 0.059, 0.9), material, x, 2.07, kioskZ + 1.90, true, 0.24);
    box(x, 1.93, kioskZ + 2.337, 0.331, 0.16, 0.057, material);
  }
  box(kioskX, 1.99, kioskZ + 2.19, 3.74, 0.027, 0.027, lamp, false);
  rail([kioskX + 0.95,2.53,kioskZ + 0.32],[kioskX + 0.96,3.05,kioskZ + 0.32],0.11,graphite);
  ball(kioskX + 0.94, 3.00, kioskZ + 0.31, 0.75, 0.31, 0.33, tortilla, 0.05, -0.14, 0.20);
  for (let i = 0; i < 9; i++) {
    ball(kioskX + 0.54 + i * 0.10, 3.20 + i * 0.015, kioskZ + 0.39, 0.13, 0.105, 0.14, i % 3 === 0 ? awning : leaves[i % leaves.length]);
  }
  for (const x of [kioskX - 2.38, kioskX + 2.18]) {
    const z = kioskZ + 1.97;
    cylinder(x, 0.53, z, 0.051, 0.11, 0.55, graphite, 12);
    cylinder(x, 0.79, z, 0.30, 0.30, 0.075, wood, 20);
    cylinder(x, 1.49, z, 0.026, 0.026, 1.43, metal, 8);
    cylinder(x, 1.99, z, 0.08, 0.55, 0.18, awning, 12);
    seat(x, z + 0.54);
  }
  projectHit("isto-kebab", kioskX, 1.65, kioskZ + 0.25, 4.6, 2.94, 3.95);

  // StarCars. A striped display lot with three individually shaped sports cars.
  const carsX = 6.69, carsZ = 5.7;
  const red = standard(0xc03c32, 0.26, 0.34);
  const blue = standard(0x77a8b1, 0.29, 0.38);
  const silver = standard(0xd4b994, 0.30, 0.43);
  const tire = standard(0x1c2025, 0.99);
  const tail = lit(0xf85a42, 0.75);
  const head = lit(0xe9faff, 0.58);
  slab(9.28, 5.67, 0.015, 0.55, 0.259, asphalt, carsX, carsZ);
  box(carsX, 0.286, carsZ + 2.40, 8.36, 0.012, 0.057, paintLine, false);
  box(carsX, 0.286, carsZ - 1.65, 8.39, 0.012, 0.055, paintLine, false);
  for (let i = 0; i < 4; i++) box(carsX + (i - 1.5) * 2.54, 0.282, carsZ + 0.21, 0.051, 0.014, 3.63, paintLine, false, -0.25);
  for (let i = 0; i < 3; i++) {
    const x = carsX + (i - 1) * 2.50;
    const z = carsZ + (i === 1 ? 0.55 : 0.17);
    const r = i === 0 ? -0.20 : i === 1 ? -0.33 : -0.36;
    car(x, z, r, [red, silver, blue][i], i);
    projectHit("starcars", x, 0.70, z, 1.92, 0.93, 3.13);
  }
  const canopyZ = carsZ - 2.03;
  rounded(carsX, 1.89, canopyZ, 7.8, 0.21, 1.1, slate, 0.075);
  box(carsX, 1.83, canopyZ + 0.58, 7.57, 0.082, 0.052, tail, false);
  for (const x of [carsX - 3.74, carsX + 3.74]) box(x, 1.05, canopyZ + 0.43, 0.14, 1.50, 0.16, graphite);
  rounded(carsX, 2.15, canopyZ + 0.34, 2.81, 0.37, 0.14, black, 0.04);
  sign("STAR CARS", carsX, 2.148, canopyZ + 0.413, 2.45, 0.26, 0, 0, "#fff2e0");
  projectHit("starcars", carsX, 1.25, canopyZ, 7.8, 2.0, 1.24);

  function car(x: number, z: number, angle: number, paint: T.Material, variant: number) {
    const cos = Math.cos(angle), sin = Math.sin(angle);
    const local = (dx: number, y: number, dz: number): [number, number, number] => [x + dx * cos + dz * sin, y, z - dx * sin + dz * cos];
    const height = variant === 2 ? 0.91 : 0.85;
    // Cross-sections follow the front bumper, bonnet, cabin, rear deck and diffuser.
    const body = [
      [-1.55,0.53,0.48,0.58],[-1.31,0.72,0.44,0.69],[-0.79,0.70,0.43,0.74],
      [0.075,0.68,0.42,0.78],[0.94,0.76,0.44,0.72],[1.42,0.70,0.48,0.66],[1.55,0.55,0.47,0.59],
    ];
    hull(body, paint);
    hull([[-0.73,0.52,0.71,0.75],[-0.29,0.46,0.72,height+0.17],[0.48,0.42,0.69,height+0.15],[0.95,0.51,0.68,0.73]], deepGlass);
    const [roofX,roofY,roofZ] = local(0,height+0.145,0.12);
    rounded(roofX, roofY, roofZ, 0.80, 0.06, 0.62, variant === 0 ? black : paint, 0.027, angle);
    const [sx, , sz] = local(0, 0.45, 0);
    groundShade(sx, sz, 2.16, 3.55, 0.279);
    for (const side of [-1, 1]) {
      for (const dz of [-0.97, 0.96]) {
        const wheel = local(side * 0.67, 0.50, dz);
        add(new T.CylinderGeometry(0.226, 0.226, 0.18, 18).rotateZ(Math.PI / 2), tire, ...wheel, true, 0, angle);
        // Align a cylinder with the car's local axle.
        const [hx,hy,hz] = local(side * 0.766, 0.50, dz);
        const axle = new T.CylinderGeometry(0.13, 0.13, 0.028, 14).rotateZ(Math.PI / 2);
        add(axle, metal, hx,hy,hz,true,0,angle);
      }
      const [px,py,pz] = local(side * 0.44,0.63,-1.387);
      box(px,py,pz,0.246,0.040,0.071,head,false,angle);
      const [tx,ty,tz] = local(side * 0.44,0.61,1.46);
      box(tx,ty,tz,0.225,0.046,0.054,tail,false,angle);
      const [mx,my,mz] = local(side * 0.71,0.80,-0.36);
      box(mx,my,mz,0.16,0.077,0.19,paint,true,angle);
    }
    const [bx,by,bz] = local(0,0.531,-1.53);
    box(bx,by,bz,0.70,0.088,0.069,black,true,angle);
    if (variant === 1) {
      const [wx,wy,wz] = local(0,0.81,1.24);
      box(wx,wy,wz,1.28,0.068,0.32,black,true,angle);
      for (const side of [-1,1]) {
        const [px,py,pz] = local(side * 0.42,0.742,1.24);
        box(px,py,pz,0.045,0.102,0.09,metal,true,angle);
      }
    }

    function hull(sections: readonly (readonly number[])[], material: T.Material) {
      const vertices: number[] = [];
      const profile = ([z, w, base, top]: readonly number[]) => [
        local(-w * 0.93,base,z), local(-w,base + (top-base) * 0.50,z), local(-w * 0.78,top,z),
        local(w * 0.78,top,z), local(w,base + (top-base) * 0.50,z), local(w * 0.93,base,z),
      ];
      const outlines = sections.map(profile);
      for (let i = 0; i < outlines.length - 1; i++) {
        const a = outlines[i], b = outlines[i + 1];
        for (let j = 0; j < 6; j++) {
          const n = (j + 1) % 6;
          vertices.push(...a[j],...b[j],...a[n],...a[n],...b[j],...b[n]);
        }
      }
      for (let i = 1; i < 5; i++) vertices.push(...outlines[0][0],...outlines[0][i],...outlines[0][i + 1],...outlines.at(-1)![0],...outlines.at(-1)![i + 1],...outlines.at(-1)![i]);
      const geometry = new T.BufferGeometry();
      geometry.setAttribute("position", new T.Float32BufferAttribute(vertices, 3));
      geometry.setAttribute("uv", new T.BufferAttribute(new Float32Array(vertices.length / 3 * 2), 2));
      geometry.computeVertexNormals();
      add(geometry, material, 0, 0, 0);
    }
  }

  // AI lab. A dark observatory with segmented glazing, a luminous chamber and roof antenna.
  const labX = 5.25, labZ = -7.77;
  const ceramic = standard(0x3a4d54, 0.53, 0.43);
  const chamber = standard(0x717c7d, 0.65, 0.40);
  const labRoof = low ? new T.MeshPhongMaterial({ color: 0x2e5f68, emissive: 0x124c50, emissiveIntensity: 0.28, shininess: 82 })
    : new T.MeshPhysicalMaterial({ color: 0x376f78, emissive: 0x105558, emissiveIntensity: 0.23, roughness: 0.19, metalness: 0.27, clearcoat: 0.65 });
  shadeBuilding(labX, labZ, 8.30, 7.28);
  cylinder(labX, 0.43, labZ, 3.19, 3.34, 0.34, slate, 48);
  cylinder(labX, 0.72, labZ, 2.93, 3.15, 0.28, metal, 48);
  cylinder(labX, 1.55, labZ, 2.75, 2.90, 1.48, ceramic, 48);
  cylinder(labX, 2.36, labZ, 2.95, 2.75, 0.24, bronze, 48);
  cylinder(labX, 2.58, labZ, 2.92, 3.01, 0.24, slate, 48);
  const dome = new T.SphereGeometry(1, low ? 24 : 48, low ? 10 : 18, 0, tau, 0, Math.PI * 0.5).scale(2.71, 1.94, 2.71);
  add(dome, labRoof, labX, 2.69, labZ);
  ring(labX, 2.70, labZ, 2.78, 0.036, cyan, 96);
  ring(labX, 3.50, labZ, 2.48, 0.033, metal, 72);
  ring(labX, 4.16, labZ, 1.79, 0.033, chamber, 60);
  for (let i = 0; i < 12; i++) {
    const a = i / 12 * tau;
    const x = Math.cos(a), z = Math.sin(a);
    for (let j = 0; j < 8; j++) {
      const p = j / 8 * Math.PI / 2, q = (j + 1) / 8 * Math.PI / 2;
      rail([labX + 2.73 * Math.cos(p) * x, 2.69 + 1.96 * Math.sin(p), labZ + 2.73 * Math.cos(p) * z],
        [labX + 2.73 * Math.cos(q) * x, 2.69 + 1.96 * Math.sin(q), labZ + 2.73 * Math.cos(q) * z], 0.048, metal, false);
    }
    for (const y of [1.06, 1.88]) {
      box(labX + x * 2.83, y, labZ + z * 2.83, 0.65, 0.15, 0.055, y < 1.5 ? cyanGlass : glass, false, Math.PI / 2 - a);
    }
  }
  rounded(labX, 1.16, labZ + 2.83, 1.97, 1.81, 1.06, graphite, 0.12);
  box(labX, 1.08, labZ + 3.385, 1.40, 1.39, 0.045, cyanGlass, false);
  box(labX, 1.08, labZ + 3.42, 0.068, 1.39, 0.045, chamber);
  for (const x of [-0.72, 0.72]) box(labX + x, 1.09, labZ + 3.439, 0.036, 1.41, 0.028, cyan, false);
  rounded(labX, 2.07, labZ + 3.18, 1.94, 0.25, 0.54, slate, 0.055);
  sign("AI LAB", labX, 2.065, labZ + 3.46, 1.62, 0.26, 0, 0, "#9ff9e9");
  cylinder(labX, 4.63, labZ, 0.37, 0.57, 0.23, bronze, 20);
  cylinder(labX, 4.98, labZ, 0.037, 0.083, 0.60, metal, 12);
  ball(labX, 5.29, labZ, 0.11, 0.11, 0.11, cyan);
  for (const dx of [-3.35, 3.35]) {
    cylinder(labX + dx, 0.84, labZ - 0.95, 0.22, 0.35, 1.14, graphite, 16);
    cylinder(labX + dx, 1.32, labZ - 0.95, 0.23, 0.22, 0.18, cyanGlass, 16);
    rail([labX + dx,0.62,labZ - 0.95],[labX + dx * 0.82,0.62,labZ - 0.95],0.13,bronze);
  }
  proxy(labX, 2.48, labZ + 0.35, 6.32, 4.55, 6.67, { zone: "lab" });

  // Motomizer's tuning garage and BeatMarket's open-air sound stage.
  const garageX = 10.52, garageZ = -0.38;
  const amber = lit(0xffac55, 0.68);
  const yellow = standard(0xcca85a, 0.76);
  shadeBuilding(garageX, garageZ, 4.63, 3.95);
  rounded(garageX, 1.16, garageZ, 3.66, 1.81, 2.62, graphite, 0.07);
  box(garageX, 1.08, garageZ + 1.33, 2.92, 1.35, 0.136, black);
  for (let i = 0; i < 4; i++) box(garageX, 1.39 + i * 0.12, garageZ + 1.405, 2.85, 0.065, 0.049, metal, false);
  for (const s of [-1, 1]) box(garageX + s * 1.48, 1.05, garageZ + 1.42, 0.082, 1.39, 0.066, amber, false);
  rounded(garageX, 2.17, garageZ, 3.98, 0.30, 2.90, yellow, 0.075);
  sign("MOTOMIZER", garageX, 2.16, garageZ + 1.46, 3.10, 0.27, 0, 0, "#282422");
  for (let i = 0; i < 4; i++) cylinder(garageX + 1.69, 0.29 + i * 0.13, garageZ + 1.70, 0.20, 0.20, 0.12, tire, 16);
  projectHit("motomizer", garageX, 1.36, garageZ, 4.01, 2.20, 3.33);

  const stageX = 1.23, stageZ = -2.68;
  const aubergine = standard(0x684b63, 0.72);
  const pink = lit(0xdc8295, 0.51);
  rounded(stageX, 0.40, stageZ, 4.0, 0.25, 2.04, graphite, 0.06);
  box(stageX, 1.21, stageZ - 0.85, 3.73, 1.43, 0.064, aubergine);
  box(stageX, 1.41, stageZ - 0.803, 2.46, 0.89, 0.06, black);
  const bars = [0.26,0.43,0.33,0.65,0.55,0.38,0.68,0.46,0.54,0.22];
  bars.forEach((h, i) => box(stageX + (i - 4.5) * 0.207, 1.045 + h / 2, stageZ - 0.761, 0.106, h, 0.02, i % 3 ? pink : amber, false));
  for (const x of [-1.68, 1.68]) {
    box(stageX + x, 1.21, stageZ + 0.32, 0.52, 1.42, 0.57, black);
    for (const h of [0.89,1.42]) add(new T.CylinderGeometry(0.178,0.178,0.033,20), metal, stageX + x, h, stageZ + 0.62, false, Math.PI / 2);
  }
  for (const x of [-1.84,1.84]) box(stageX + x, 1.36, stageZ - 0.68, 0.08, 2.0, 0.08, metal);
  rounded(stageX, 2.40, stageZ - 0.34, 4.04, 0.24, 1.68, aubergine, 0.06);
  sign("BEATMARKET", stageX, 2.406, stageZ + 0.51, 3.12, 0.23);
  projectHit("beatmarket", stageX, 1.4, stageZ, 4.04, 2.35, 2.17);

  const studioX = -2.68, studioZ = -4.45;
  rounded(studioX, 0.96, studioZ, 2.55, 1.44, 2.0, sandstone, 0.08);
  box(studioX, 1.01, studioZ + 1.025, 2.13, 0.86, 0.07, glass);
  for (const x of [-0.77,0,0.77]) box(studioX + x, 1.02, studioZ + 1.07, 0.052, 0.85, 0.045, bronze);
  rounded(studioX, 1.78, studioZ, 2.77, 0.22, 2.21, graphite, 0.08);
  sign("STUDIO", studioX, 1.79, studioZ + 1.118, 1.52, 0.22);
  proxy(studioX, 1.05, studioZ, 2.75, 1.63, 2.28, { zone: "studio" });

  // The mascot's central walking plaza and a small fountain at the centre of the map.
  cylinder(0.10, 0.193, 3.43, 3.03, 3.17, 0.096, stone, 60);
  ring(0.10, 0.247, 3.43, 2.88, 0.019, bronze, 70);
  ring(0.10, 0.247, 3.43, 2.30, 0.011, curb, 60);
  const water = low ? new T.MeshPhongMaterial({ color: 0x4b7d7d, shininess: 85, specular: 0x91c9c9 })
    : new T.MeshPhysicalMaterial({ color: 0x4b7d7d, roughness: 0.18, metalness: 0.42, clearcoat: 0.68 });
  cylinder(0.10, 0.386, 3.43, 1.22, 1.30, 0.29, sandstone, 48);
  cylinder(0.10, 0.54, 3.43, 1.13, 1.13, 0.028, water, 48, false);
  ring(0.10, 0.558, 3.43, 1.18, 0.074, sandstone, 60);
  ring(0.10, 0.559, 3.43, 0.79, 0.009, cyanGlass, 44);
  cylinder(0.10, 0.66, 3.43, 0.115, 0.18, 0.23, bronze, 16);
  cylinder(0.10, 0.82, 3.43, 0.033, 0.066, 0.30, water, 12, false);
  for (const [x,z,r] of [[-2.28,4.04,1.03],[1.81,5.21,-0.83],[-0.24,1.17,0],[2.51,3.57,-1.45]]) seat(x,z,r);
  for (const [x,z] of [[-2.9,5.74],[2.79,6.06],[0.55,6.54]]) post(x,z,0.75,0.15);

  const beaconMaterial = lit(0x86e9d9, 0.8);
  materials.add(beaconMaterial);
  const beacon = new T.Mesh(new T.TorusGeometry(2.79, 0.022, 5, 64), beaconMaterial);
  beacon.rotation.x = -Math.PI / 2;
  beacon.position.set(labX, 2.74, labZ);
  group.add(beacon);

  const avatar = new T.Group();
  const fabric = standard(0xb68a62, 0.97, 0, noise);
  const plushCream = standard(0xefd3aa, 0.93);
  const sweater = standard(0x68754b, 0.97, 0, noise);
  const stitch = standard(0xa0aa73, 0.97);
  const eye = standard(0x1b2024, 0.55);
  function plush(material: T.Material, x: number, y: number, z: number, w: number, h: number, d: number, rotationZ = 0) {
    materials.add(material);
    const part = new T.Mesh(new T.SphereGeometry(1, low ? 14 : 24, low ? 10 : 16), material);
    part.position.set(x,y,z);
    part.scale.set(w,h,d);
    part.rotation.z = rotationZ;
    part.castShadow = true;
    avatar.add(part);
    return part;
  }
  plush(sweater, 0, 0.68, 0, 0.40, 0.40, 0.30);
  plush(stitch, 0, 0.63, 0.285, 0.136, 0.142, 0.028);
  const badge = new T.Mesh(new T.TorusGeometry(0.078, 0.009, 5, 20), fabric);
  badge.position.set(0, 0.63, 0.315);
  avatar.add(badge);
  for (let i = -3; i <= 3; i++) plush(stitch, i * 0.057, 0.43, 0.236 - Math.abs(i) * 0.012, 0.012, 0.043, 0.029);
  plush(fabric, 0, 1.22, 0.026, 0.41, 0.37, 0.33);
  for (const side of [-1,1]) {
    plush(fabric, side * 0.325, 1.51, 0.025, 0.163, 0.154, 0.102, side * -0.29);
    plush(plushCream, side * 0.327, 1.509, 0.108, 0.113, 0.105, 0.037, side * -0.29);
    plush(fabric, side * 0.405, 0.71, 0.05, 0.124, 0.24, 0.13, side * -0.42);
    plush(eye, side * 0.142, 1.275, 0.325, 0.055, 0.064, 0.047);
    plush(plushCream, side * 0.151, 1.299, 0.367, 0.016, 0.018, 0.011);
  }
  plush(plushCream, 0, 1.11, 0.307, 0.168, 0.107, 0.076);
  plush(eye, 0, 1.155, 0.376, 0.058, 0.042, 0.032);
  plush(eye, 0, 1.096, 0.378, 0.034, 0.013, 0.016);
  const legs = [-0.175,0.175].map(x => plush(fabric,x,0.23,0.063,0.151,0.21,0.194));
  const avatarShadow = new T.Mesh(new T.PlaneGeometry(1.59, 1.50), shadow);
  avatarShadow.rotation.x = -Math.PI / 2;
  avatarShadow.position.y = 0.009;
  avatar.add(avatarShadow);
  avatar.position.set(-0.28,0.25,5.12);
  avatar.rotation.y = 0.40;
  const avatarHit = new T.Mesh(new T.BoxGeometry(1.02, 1.59, 0.74), new T.MeshBasicMaterial({ visible: false }));
  materials.add(avatarHit.material);
  avatarHit.position.set(0, 0.81, 0.051);
  avatarHit.userData.hit = { zone: "hq" } satisfies Hit;
  avatar.add(avatarHit);
  hits.push(avatarHit);
  group.add(avatar);

  // Static opaque surfaces share one unlit draw call in the software profile.
  const bakedSurfaces: T.BufferGeometry[] = [];
  for (const [material, { cast, plain }] of batches) {
    for (const [geometries, castsShadow] of [[cast, true], [plain, false]] as const) {
      if (!geometries.length) continue;
      const compatible = geometries.map(geometry => {
        if (geometry.index) return geometry;
        const indexed = mergeVertices(geometry);
        geometry.dispose();
        return indexed;
      });
      if (bakeLighting && (material instanceof T.MeshLambertMaterial || material instanceof T.MeshPhongMaterial)) {
        for (const geometry of compatible) bakedSurfaces.push(bakeSurface(geometry, material));
        continue;
      }
      const merged = mergeGeometries(compatible)!;
      compatible.forEach(geometry => geometry.dispose());
      const mesh = new T.Mesh(merged, material);
      mesh.castShadow = castsShadow && !material.transparent;
      mesh.receiveShadow = !material.transparent;
      group.add(mesh);
    }
  }
  if (bakedSurfaces.length) {
    const surfaceMaterial = new T.MeshBasicMaterial({ vertexColors: true, toneMapped: false });
    materials.add(surfaceMaterial);
    group.add(new T.Mesh(mergeGeometries(bakedSurfaces)!, surfaceMaterial));
    bakedSurfaces.forEach(geometry => geometry.dispose());
  }

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
