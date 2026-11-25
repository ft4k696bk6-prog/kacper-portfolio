import * as T from "three";
import type { Body } from "./discoveries";
import { detailDirection, planets } from "./planets";

export const frontNormal = new T.Vector3(...detailDirection).normalize();
const farNormal = new T.Vector3(-.8, .34, -.45).normalize();
const iceNormal = new T.Vector3(.12, -.92, -.24).normalize();
export const terminator = new T.Vector3(1, 2, 3).normalize();

export function worldSurface(body: Body) {
  const info = planets[body];
  const polar = body === "moon" || body === "signal" || body === "garage";
  const shoreline: Record<Body, number> = { home: .42, starcars: .52, reenergy: .57, ai: .47, "b-crm": .51,
    beatmarket: .53, motomizer: .55, "isto-kebab": .54, moon: .46, signal: .48, garage: .46, jalapeno: .57 };
  const contour = (normal: T.Vector3) => {
    const { x, y, z } = normal;
    const weave = Math.sin(x * 18 - z * 14) * Math.cos(y * 14 + z * 9) * .11 + Math.cos(x * 31 - y * 23) * .033;
        const irregular = body === "reenergy" ? Math.sin(z * 12 + x * 11) * .08
      : body === "beatmarket" ? Math.cos(z * 14 - y * 7) * .065
      : body === "motomizer" ? Math.sin(x * 13 + y * 4) * .072
      : body === "starcars" ? Math.sin(y * 15 - z * 7) * .054 : 0;
    return Math.max(normal.dot(frontNormal) - shoreline[body] + irregular, normal.dot(farNormal) - .70, normal.dot(iceNormal) - .86) + weave;
  };
  return {
    land(direction: T.Vector3) { return polar || contour(direction) > 0; },
    radius(direction: T.Vector3) {
      const val = contour(direction);
      if (val <= 0) return info.radius;
      return info.radius + T.MathUtils.smoothstep(val, -.03, .67) * .14;
    },
    contour,
  };
}

export function makePlanetSkin(body: Body, low: boolean, proxy = false) {
  const info = planets[body];
  const surface = worldSurface(body);
  const geometry = new T.SphereGeometry(info.radius, proxy ? 34 : low ? 75 : 112, proxy ? 22 : low ? 43 : 62);
  const pos = geometry.getAttribute("position");
  const values: number[] = [];
  const palette = info.colors.map(color => new T.Color(color));
  const next = new T.Color(), side = new T.Color(), direction = new T.Vector3();
  const ground = (body === "moon" || body === "signal" || body === "garage");
  for (let i = 0; i < pos.count; i++) {
    direction.fromBufferAttribute(pos, i).normalize();
    const { x, y, z } = direction;
    const edge = surface.contour(direction);
    const noise = Math.sin(x * 36 + y * 24) * Math.sin(z * 35 - y * 46) * .07;
    const accent = Math.cos(x * 11 + z * 19) * Math.sin(y * 17 - x * 10) * .13;
    if (ground) next.copy(palette[0]).lerp(palette[2], T.MathUtils.smoothstep(noise + accent, -.19, .19));
    else if (edge > 0) {
      next.copy(palette[3]).lerp(palette[2], T.MathUtils.smoothstep(edge, .007, .21));
      side.copy(palette[2]).lerp(palette[0], .41);
      next.lerp(side, (noise + accent + .22) * .86);
    } else {
      next.copy(palette[0]).lerp(palette[1], T.MathUtils.smoothstep(edge, -.42, .012));
      next.multiplyScalar(1 + noise * .54 + accent * .24);
    }
    const daylight = Math.pow(Math.max(0, terminator.dot(direction)), .63);
    next.multiplyScalar(.53 + daylight * .47);
    values.push(next.r, next.g, next.b);
    direction.multiplyScalar(surface.radius(direction));
    pos.setXYZ(i, direction.x, direction.y, direction.z);
  }
  geometry.setAttribute("color", new T.Float32BufferAttribute(values, 3));
  geometry.computeVertexNormals();
  return new T.Mesh(geometry, new T.MeshBasicMaterial({ vertexColors: true, toneMapped: false }));
}
