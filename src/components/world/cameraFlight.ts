import * as T from "three";
import { planets, shipClearance } from "./planets";
import type { Body } from "./discoveries";

export const spheres = Object.entries(planets).map(([key, planet]) => ({
  key: key as Body, center: new T.Vector3(...planet.center), radius: planet.radius,
}));
export const systemAxis = new T.Vector3(0, .09, 1).normalize();
export const safeZ = 114;
const line = new T.Line3(), closest = new T.Vector3(), step = new T.Vector3();

export function pathClear(from: T.Vector3, to: T.Vector3, clearance = shipClearance) {
  line.set(from, to);
  return spheres.every(({ center, radius }) => line.closestPointToPoint(center, true, closest).distanceToSquared(center) >= (radius + clearance) ** 2);
}

export function safeDirection(body: Body, preferred: T.Vector3, distance: number) {
  const current = spheres.find(site => site.key === body)!;
  const direction = preferred.clone().normalize();
  const target = current.center;
  const distanceToCheck = Math.min(distance, current.radius + 22);
  const exit = target.clone().addScaledVector(direction, current.radius + shipClearance + .5);
  const end = target.clone().addScaledVector(direction, distanceToCheck);
  return pathClear(exit, end) ? direction : systemAxis.clone();
}

export function clearancePose(position: T.Vector3, body: Body | null, overSurface = 0) {
  for (const sphere of spheres) {
    step.copy(position).sub(sphere.center);
    const min = sphere.radius + (sphere.key === body ? overSurface : shipClearance);
    if (step.lengthSq() >= min * min) continue;
    if (step.lengthSq() < .01) step.copy(systemAxis);
    position.copy(sphere.center).add(step.setLength(min + .015));
  }
}

// Launch out of the local radius and use the empty corridor in front of the system.
export function flightPath(from: T.Vector3, to: T.Vector3, origin: Body | null, destination: Body | null) {
  const points = [from.clone()];
  function departure(position: T.Vector3, body: Body | null) {
    if (!body) return new T.Vector3(position.x, position.y, Math.max(safeZ, position.z));
    const { center, radius } = spheres.find(sphere => sphere.key === body)!;
    const radial = position.clone().sub(center).normalize();
    const level = Math.max(radius + 11, position.distanceTo(center));
    const elevated = center.clone().addScaledVector(radial, level);
    const turn = new T.Quaternion().setFromUnitVectors(radial, systemAxis);
    const direction = new T.Vector3(), partial = new T.Quaternion();
    const arc = [elevated];
    for (let i = 1; i <= 8; i++) arc.push(center.clone().addScaledVector(direction.copy(radial).applyQuaternion(partial.identity().slerp(turn, i / 8)), level));
    return arc;
  }
  const outgoing = departure(from, origin);
  const incoming = departure(to, destination);
  if (Array.isArray(outgoing)) points.push(...outgoing);
  else points.push(outgoing);
  const last = points.at(-1)!;
  const first = Array.isArray(incoming) ? incoming.at(-1)! : incoming;
  points.push(new T.Vector3(last.x, last.y, Math.max(safeZ, last.z)), new T.Vector3(first.x, first.y, Math.max(safeZ, first.z)));
  if (Array.isArray(incoming)) points.push(...incoming.reverse());
  else points.push(incoming);
  points.push(to.clone());
  const safe = points.filter((point, i) => i === 0 || point.distanceToSquared(points[i - 1]) > .0001);
  const length = [0];
  for (let i = 1; i < safe.length; i++) length.push(length[i - 1] + safe[i].distanceTo(safe[i - 1]));
  const total = length.at(-1)!;
  function sample(progress: number, result: T.Vector3) {
    if (progress <= 0 || !total) return result.copy(from);
    if (progress >= 1) return result.copy(to);
    const distance = total * progress;
    const end = length.findIndex(value => value > distance);
    const section = (distance - length[end - 1]) / (length[end] - length[end - 1]);
    result.copy(safe[end - 1]).lerp(safe[end], section);
    clearancePose(result, section < .5 ? origin : destination, 1.2);
    return result;
  }
  return { sample, points: safe };
}
