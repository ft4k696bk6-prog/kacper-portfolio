import * as T from "three";

export type Surface = { radius: (direction: T.Vector3) => number; land: (direction: T.Vector3) => boolean };
export type TrafficKind = "road" | "rail" | "walk" | "water" | "wild";
const yAxis = new T.Vector3(0, 1, 0);
const zAxis = new T.Vector3(0, 0, 1);
const width: Record<TrafficKind, number> = { road: .66, rail: .38, walk: .23, water: 0, wild: 0 };
const clearance: Record<TrafficKind, number> = { road: .065, rail: .08, walk: .04, water: .028, wild: .02 };

export function regionFrame(north: T.Vector3) {
  const east = new T.Vector3().crossVectors(Math.abs(north.y) > .86 ? zAxis : yAxis, north).normalize();
  const south = new T.Vector3().crossVectors(north, east);
  return { east, south };
}

export function ringWaypoints(normal: T.Vector3, size: number, count = 12, squash = 1) {
  const { east, south } = regionFrame(normal);
  return Array.from({ length: count }, (_, i) => {
    const angle = (i + .37) * Math.PI * 2 / count;
    return normal.clone().addScaledVector(east, Math.cos(angle) * size).addScaledVector(south, Math.sin(angle) * size * squash).normalize();
  });
}

export function makeLane(kind: TrafficKind, waypoints: T.Vector3[], surface: Surface, obstacles: readonly { normal: T.Vector3; radius: number }[] = []) {
  if (waypoints.length < 4) return null;
  const curve = new T.CatmullRomCurve3(waypoints, true, "centripetal");
  const samples = Math.max(64, waypoints.length * 10);
  const directions: T.Vector3[] = [];
  const points: T.Vector3[] = [];
  const distances = [0];
  const tangent = new T.Vector3(), sideways = new T.Vector3(), edge = new T.Vector3();
  for (let i = 0; i < samples; i++) {
    const direction = curve.getPoint(i / samples).normalize();
    curve.getTangent(i / samples, tangent);
    sideways.crossVectors(direction, tangent).normalize();
    for (const side of [-1, 0, 1]) {
      edge.copy(direction).addScaledVector(sideways, side * width[kind] / surface.radius(direction)).normalize();
      if (surface.land(edge) === (kind === "water") || obstacles.some(zone => zone.normal.angleTo(edge) < zone.radius)) return null;
    }
    directions.push(direction);
    const point = direction.clone().multiplyScalar(surface.radius(direction) + clearance[kind]);
    if (points.length) distances.push(distances.at(-1)! + point.distanceTo(points.at(-1)!));
    points.push(point);
  }
  directions.push(directions[0]);
  points.push(points[0]);
  distances.push(distances.at(-1)! + points.at(-2)!.distanceTo(points[0]));
  return { kind, points, directions, distances, length: distances.at(-1)!, surface };
}
export type Lane = NonNullable<ReturnType<typeof makeLane>>;

export function loopLane(kind: TrafficKind, size: number, center: T.Vector3, squash: number, surface: Surface, obstacles: Parameters<typeof makeLane>[3]) {
  const candidates = kind === "water" ? [size, size * .63] : [size, size + .13, size + .25, size + .36];
  for (const width of candidates) {
    const lane = makeLane(kind, ringWaypoints(center, width, 14, squash), surface, obstacles);
    if (lane) return lane;
  }
  return null;
}

export function placeOnLane(object: T.Object3D, lane: Lane, distance: number, basis: T.Matrix4, up: T.Vector3, forward: T.Vector3, right: T.Vector3, lateral = 0) {
  const cursor = T.MathUtils.euclideanModulo(distance, lane.length);
  let first = 0, last = lane.distances.length - 1;
  while (last - first > 1) {
    const middle = (first + last) >> 1;
    if (lane.distances[middle] <= cursor) first = middle;
    else last = middle;
  }
  const fraction = (cursor - lane.distances[first]) / (lane.distances[last] - lane.distances[first]);
  up.copy(lane.directions[first]).lerp(lane.directions[last], fraction).normalize();
  forward.copy(lane.points[last]).sub(lane.points[first]);
  right.crossVectors(up, forward).normalize();
  forward.crossVectors(right, up).normalize();
  if (lateral) up.addScaledVector(right, lateral / lane.surface.radius(up)).normalize();
  object.position.copy(up).multiplyScalar(lane.surface.radius(up) + clearance[lane.kind]);
  object.quaternion.setFromRotationMatrix(basis.makeBasis(right, up, forward));
}

export function laneGeometry(lanes: Lane[], roadbed = "#565668") {
  const positions: number[] = [], colors: number[] = [], indices: number[] = [];
  const right = new T.Vector3(), direction = new T.Vector3();
  const body = new T.Color(roadbed), pavement = new T.Color("#c6a98c"), marker = new T.Color("#efd496"), rail = new T.Color("#a8c4c3");
  function strip(lane: Lane, i: number, j: number, offset: number, stripWidth: number, height: number, color: T.Color) {
    const base = positions.length / 3;
    for (let k = i; k <= j; k++) {
      const index = k % (lane.points.length - 1);
      const next = index + 1;
      const center = lane.directions[index];
      right.crossVectors(center, direction.copy(lane.points[next]).sub(lane.points[index])).normalize();
      for (const side of [-1, 1]) {
        direction.copy(center).addScaledVector(right, (offset + side * stripWidth) / lane.surface.radius(center)).normalize();
        direction.multiplyScalar(lane.surface.radius(direction) + height);
        positions.push(direction.x, direction.y, direction.z);
        colors.push(color.r, color.g, color.b);
      }
      if (k > i) {
        const a = base + (k - i) * 2;
        indices.push(a - 2, a, a - 1, a - 1, a, a + 1);
      }
    }
  }
  for (const lane of lanes) {
    if (!width[lane.kind]) continue;
    const last = lane.points.length - 1;
    strip(lane, 0, last, 0, width[lane.kind], lane.kind === "walk" ? .038 : .042, lane.kind === "road" ? body : pavement);
    if (lane.kind === "road") {
      for (let i = 0; i < last; i += 8) strip(lane, i, Math.min(last, i + 3), 0, .03, .071, marker);
    } else if (lane.kind === "rail") {
      for (const side of [-1, 1]) strip(lane, 0, last, side * .21, .037, .081, rail);
      for (let i = 0; i < last; i += 7) strip(lane, i, i + 1, 0, .38, .067, body);
    }
  }
  const geometry = new T.BufferGeometry();
  geometry.setAttribute("position", new T.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("color", new T.Float32BufferAttribute(colors, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

export function laneMesh(lanes: Lane[], roadbed?: string) {
  return new T.Mesh(laneGeometry(lanes, roadbed), new T.MeshLambertMaterial({ vertexColors: true, side: T.DoubleSide }));
}

export function createTraffic() {
  const group = new T.Group();
  const agents: { object: T.Object3D; lane: Lane; speed: number; phase: number; lateral: number; pose?: (time: number) => void }[] = [];
  const up = new T.Vector3(), ahead = new T.Vector3(), right = new T.Vector3(), basis = new T.Matrix4();
  return {
    group,
    add(object: T.Object3D, lane: Lane | null, speed: number, phase: number, lateral = 0, pose?: (time: number) => void) {
      if (!lane) return false;
      group.add(object);
      agents.push({ object, lane, speed, phase, lateral, pose });
      placeOnLane(object, lane, lane.length * phase, basis, up, ahead, right, lateral);
      return true;
    },
    tick(time: number) {
      for (const agent of agents) {
        // A monotone distance clock keeps every object on the closed lane, including the seam.
        const distance = agent.lane.length * agent.phase + agent.speed * (time - Math.sin(time * .83) * .76);
        placeOnLane(agent.object, agent.lane, distance, basis, up, ahead, right, agent.lateral);
        agent.pose?.(time);
      }
    },
  };
}
