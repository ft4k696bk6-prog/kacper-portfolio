import * as T from "three";
import type { Body } from "./discoveries";
import { globeRadius } from "./globe";
import { detailDirection, planets } from "./planets";
import { surfaceFinish } from "./planetFinish";

export const frontNormal = new T.Vector3(...detailDirection).normalize();
const farNormal = new T.Vector3(-.8, .34, -.45).normalize();
const iceNormal = new T.Vector3(.12, -.92, -.24).normalize();
export const terminator = new T.Vector3(1, 2, 3).normalize();

export function placeArchitecture(group: T.Group, normal: T.Vector3, radius: number) {
  group.quaternion.setFromUnitVectors(normal, frontNormal);
  group.position.copy(frontNormal).multiplyScalar(radius - globeRadius + .12);
  return group;
}

const shoreline: Record<Body, number> = {
  home: .42, starcars: .52, reenergy: .57, ai: .47, "b-crm": .51, beatmarket: .53,
  motomizer: .55, "isto-kebab": .54, moon: .46, signal: .48, garage: .46, jalapeno: .57,
};

export function worldSurface(body: Body) {
  const info = planets[body];
  const polar = body === "moon" || body === "signal" || body === "garage";
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
  const geometry = new T.SphereGeometry(info.radius, proxy ? 36 : low ? 70 : 112, proxy ? 24 : low ? 44 : 68);
  const pos = geometry.getAttribute("position");
  const values = proxy ? new Float32Array(pos.count * 3) : null;
  const [deep, shallows, land, shore] = info.colors.map(color => new T.Color(color));
  deep.lerp(new T.Color("#142541"), .22);
  const accent = new T.Color("#69647d");
  const spray = shallows.clone().lerp(new T.Color("#f1e4ca"), .64);
  const Highlands = land.clone().lerp(accent, .36);
  const next = new T.Color(), direction = new T.Vector3();
  const ground = (body === "moon" || body === "signal" || body === "garage");
  const ease = T.MathUtils.smoothstep;
  function paint(point: T.Vector3, color: T.Color) {
    const { x, y, z } = point;
    const edge = surface.contour(point);
    const grain = Math.sin(x * 65 + y * 47) * Math.sin(z * 61 - y * 73);
    const stratum = Math.sin(x * 34 + y * 21) * Math.cos(z * 30 - y * 41);
    const relief = Math.cos(x * 11 + z * 19) * Math.sin(y * 17 - x * 10);
    if (ground) {
      color.copy(deep).lerp(land, ease(relief + stratum * .24, -.65, .72));
      color.lerp(shore, ease(relief + grain * .06, .45, 1.23) * .44);
    } else if (edge > 0) {
      color.copy(shore).lerp(land, ease(edge, .003, .15));
      color.lerp(Highlands, ease(relief + stratum * .15, -.43, .85) * .83);
    } else {
      color.copy(deep).lerp(shallows, ease(edge + relief * .045, -.42, .006) * .85);
      const surf = 1 - ease(Math.abs(edge + .019 + grain * .002), .004, .014);
      color.lerp(spray, surf * (.25 + stratum * .12));
    }
    color.multiplyScalar(1 + grain * .028 + stratum * .043 + relief * .059);
    return ground ? 0 : 1 - ease(edge, -.018, 0);
  }
  for (let i = 0; i < pos.count; i++) {
    direction.fromBufferAttribute(pos, i).normalize();
    if (values) {
      paint(direction, next);
      next.multiplyScalar(.43 + ease(terminator.dot(direction), -.42, .84) * .63);
      values.set([next.r, next.g, next.b], i * 3);
    }
    direction.multiplyScalar(surface.radius(direction));
    pos.setXYZ(i, direction.x, direction.y, direction.z);
  }
  if (values) geometry.setAttribute("color", new T.BufferAttribute(values, 3));
  const material = proxy ? new T.MeshBasicMaterial({ vertexColors: true, toneMapped: false }) : surfaceFinish(low, paint, shallows);
  return new T.Mesh(geometry, material);
}
