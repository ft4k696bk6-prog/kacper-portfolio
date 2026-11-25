import * as T from "three";
import { globeDirection, globeRadius, makeSurfaceSites, type SurfaceStop } from "./globe";
import { makeRoads, surfaceRadius, terrainField } from "./terrain";
import { alignRadially, box, solid, type GamePalette } from "./gameObjects";
import type { DriveInput, FindId } from "./discoveries";

const inputKeys: Record<string, DriveInput> = { w: "forward", ArrowUp: "forward", s: "reverse", ArrowDown: "reverse", a: "left", ArrowLeft: "left", d: "right", ArrowRight: "right" };
export const carSpawn = globeDirection(-8, -23);
export const carRamp = globeDirection(-8, -30);
const contactDirections = [-13, -14, -15].map(lat => globeDirection(lat, -42));
const hornDirection = globeDirection(-6, -25);

export function makeCar(palette: GamePalette, miniature = false) {
  const root = new T.Group();
  const body = new T.Group();
  root.add(body);
  body.add(box(0.92, 0.28, 1.61, palette.coral, 0, 0.39, 0, 0.13),
    box(0.70, 0.27, 0.71, palette.glass, 0, 0.61, -0.12, 0.12),
    box(0.79, 0.09, 0.78, palette.chalk, 0, 0.78, -0.13),
    box(1.01, 0.12, 0.17, palette.ink, 0, 0.33, 0.81),
    box(0.86, 0.11, 0.13, palette.ink, 0, 0.33, -0.81),
    box(0.15, 0.07, 0.43, palette.chalk, 0, 0.53, 0.52));
  const tire = new T.CylinderGeometry(0.22, 0.22, 0.17, miniature ? 8 : 12);
  const hub = new T.CylinderGeometry(0.09, 0.09, 0.179, 9);
  const lamp = new T.SphereGeometry(0.089, 9, 7);
  const wheels: T.Group[] = [];
  for (const x of [-0.46, 0.46]) {
    body.add(solid(lamp, palette.warm, x * 0.69, 0.46, 0.80), solid(lamp, palette.coral, x * 0.85, 0.44, -0.81));
    for (const z of [-0.57, 0.57]) {
      const wheel = new T.Group();
      wheel.position.set(x, 0.24, z);
      const rubber = solid(tire, palette.rubber);
      const cap = solid(hub, palette.chalk);
      rubber.rotation.z = cap.rotation.z = Math.PI / 2;
      wheel.add(rubber, cap);
      root.add(wheel);
      wheels.push(wheel);
    }
  }
  return { root, body, wheels };
}

export function createVehicle(palette: GamePalette, low: boolean, award: (id: FindId) => void, enter: (id: SurfaceStop) => void) {
  const group = new T.Group();
  const { root, body, wheels } = makeCar(palette);
  root.scale.setScalar(1.12);
  group.add(root);
  const sites = Object.entries(makeSurfaceSites()) as [SurfaceStop, ReturnType<typeof makeSurfaceSites>[SurfaceStop]][];
  const input = new Set<string>();
  const routes = makeRoads().map(road => ({ ...road, plane: road.start.clone().cross(road.end).normalize() }));
  const normal = carSpawn.clone();
  const forward = carRamp.clone().addScaledVector(normal, -carRamp.dot(normal)).normalize();
  const basis = new T.Matrix4(), right = new T.Vector3(), next = new T.Vector3(), heading = new T.Vector3(), local = new T.Vector3();
  let speed = 0, suspension = 0, altitude = 0, verticalSpeed = 0, distance = 0, active = false, gate = false;
  const turn = new T.Quaternion();
  const obstacles = contactDirections.map((direction, index) => {
    const cone = new T.Group();
    if (index === 2) {
      cone.add(box(0.44, 0.39, 0.43, palette.chalk, 0, 0.21), box(0.46, 0.11, 0.45, palette.ink, 0, 0.23));
    } else {
      cone.add(box(0.48, 0.05, 0.48, palette.rubber, 0, 0.025), solid(new T.ConeGeometry(0.19, 0.52, 12), palette.coral, 0, 0.26),
        solid(new T.CylinderGeometry(0.076, 0.119, 0.1, 12), palette.chalk, 0, 0.30));
    }
    alignRadially(cone, direction, surfaceRadius(direction) + 0.035);
    group.add(cone);
    return { cone, direction, velocity: 0, fall: 0 };
  });
  const ramp = new T.Group();
  const rampGeometry = new T.ExtrudeGeometry(new T.Shape([new T.Vector2(-0.63, 0), new T.Vector2(0.63, 0), new T.Vector2(0.63, 0.46)]), { depth: 1.56, bevelEnabled: false });
  rampGeometry.translate(0, 0, -0.78);
  const wedge = solid(rampGeometry, palette.chalk, 0, 0.035, 0);
  wedge.rotation.y = -Math.PI / 2;
  ramp.add(wedge);
  for (const x of [-0.55, 0.55]) ramp.add(box(0.15, 0.62, 0.07, palette.coral, x, 0.28, 0.55));
  alignRadially(ramp, carRamp, surfaceRadius(carRamp));
  right.crossVectors(carRamp, forward).normalize();
  heading.crossVectors(right, carRamp).normalize();
  ramp.quaternion.setFromRotationMatrix(basis.makeBasis(right, carRamp, heading));
  group.add(ramp);
  const startingLine = new T.Group();
  const lineDirection = carSpawn.clone().addScaledVector(forward, 0.039).normalize();
  for (let i = 0; i < 8; i++) for (let j = 0; j < 2; j++) {
    startingLine.add(box(.205, .018, .205, (i + j) % 2 ? palette.chalk : palette.ink, (i - 3.5) * .205, 0, (j - .5) * .205, .005));
  }
  alignRadially(startingLine, lineDirection, surfaceRadius(lineDirection) + .024);
  right.crossVectors(lineDirection, forward).normalize();
  heading.crossVectors(right, lineDirection).normalize();
  startingLine.quaternion.setFromRotationMatrix(basis.makeBasis(right, lineDirection, heading));
  group.add(startingLine);

  const beacon = new T.Group().add(solid(new T.CylinderGeometry(0.08, 0.12, 0.64, 8), palette.ink, 0, 0.34),
    solid(new T.SphereGeometry(0.28, 13, 8), palette.warm, 0, 0.67));
  group.add(alignRadially(beacon, hornDirection, surfaceRadius(hornDirection)));
  const dummy = new T.Object3D();
  const count = low ? 18 : 38;
  const dust = new T.InstancedMesh(new T.IcosahedronGeometry(0.13, 0), new T.MeshLambertMaterial({ color: 0xd5bc8a }), count);
  const tread = new T.InstancedMesh(new T.PlaneGeometry(0.16, 0.36).rotateX(-Math.PI / 2), new T.MeshBasicMaterial({ color: 0x505346, transparent: true, opacity: 0.43, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -1 }), count * 2);
  dust.frustumCulled = tread.frustumCulled = false;
  const particles = Array.from({ length: count }, () => ({ life: 0, position: new T.Vector3(), velocity: new T.Vector3() }));
  let particle = 0, track = 0;
  const hidden = new T.Matrix4().makeScale(0, 0, 0);
  for (let i = 0; i < count * 2; i++) {
    if (i < count) dust.setMatrixAt(i, hidden);
    tread.setMatrixAt(i, hidden);
  }
  group.add(dust, tread);

  function radialHeight() {
    const road = routes.some(route => Math.abs(route.plane.dot(normal)) < .034
      && route.start.angleTo(normal) + route.end.angleTo(normal) < route.angle + .008);
    return Math.max(surfaceRadius(normal), road && terrainField(normal) < .656 ? globeRadius + .29 : globeRadius) + .045 + altitude;
  }

  function place(dt: number, steer: number) {
    right.crossVectors(normal, forward).normalize();
    root.quaternion.setFromRotationMatrix(basis.makeBasis(right, normal, forward));
    root.position.copy(normal).multiplyScalar(radialHeight());
    body.rotation.x = T.MathUtils.damp(body.rotation.x, -suspension * 0.10, 8, dt);
    body.rotation.z = T.MathUtils.damp(body.rotation.z, steer * speed * 0.018, 9, dt);
    body.position.y = Math.sin(distance * 14) * Math.min(0.055, Math.abs(speed) * 0.008) - suspension * 0.028;
    wheels.forEach((wheel, i) => {
      wheel.rotation.x = distance / 0.23;
      if (i % 2) wheel.rotation.y = steer * 0.29;
    });
  }

  function stamp() {
    for (const side of [-1, 1]) {
      dummy.position.copy(normal).multiplyScalar(radialHeight()).addScaledVector(right, side * 0.49).addScaledVector(forward, -0.54);
      dummy.position.setLength(surfaceRadius(dummy.position.clone().normalize()) + 0.024);
      dummy.quaternion.copy(root.quaternion);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      tread.setMatrixAt(track++ % (count * 2), dummy.matrix);
    }
    tread.instanceMatrix.needsUpdate = true;
    const puff = particles[particle++ % count];
    puff.position.copy(root.position).addScaledVector(forward, -0.79);
    puff.velocity.copy(normal).multiplyScalar(0.43).addScaledVector(forward, -speed * 0.16);
    puff.life = 0.48;
  }

  function step(time: number, particlesEnabled: boolean) {
    if (!active) return;
    const dt = Math.min(time, 0.085);
    const commands = new Set(Array.from(input, key => inputKeys[key] ?? key));
    const pressed = (value: DriveInput) => commands.has(value);
    const throttle = Number(pressed("forward")) - Number(pressed("reverse"));
    const steer = Number(pressed("left")) - Number(pressed("right"));
    const goal = throttle * (throttle < 0 ? 4.0 : 9.6);
    speed = T.MathUtils.damp(speed, goal, throttle && Math.sign(speed) === throttle ? 2.35 : 4.5, dt);
    if (Math.abs(speed) < 0.06) speed = 0;
    const turnAngle = -steer * Math.min(Math.abs(speed) * 0.37, 1.7) * Math.sign(speed) * dt;
    forward.applyAxisAngle(normal, turnAngle);
    const delta = speed * dt / globeRadius;
    next.copy(normal).multiplyScalar(Math.cos(delta)).addScaledVector(forward, Math.sin(delta));
    let destination: SurfaceStop | undefined;
    for (const [id, site] of sites) {
      if (site.normal.dot(next) < 0.966) continue;
      local.copy(next).multiplyScalar(globeRadius + 0.55).applyMatrix4(site.inverse);
      const x = Math.abs(local.x - site.x), z = Math.abs(local.z - site.z);
      if (x < site.width * 0.53 + 0.35 && z < site.depth * 0.58 + 1.26) destination = id;
      if (x < site.width * 0.32 && z < site.depth * 0.27 && altitude < 0.62) {
        speed *= -0.19;
        next.copy(normal);
        suspension = 0.75;
        break;
      }
    }
    if (!destination) gate = true;
    if (destination && speed > 0.8 && gate) {
      gate = false;
      enter(destination);
      return;
    }
    turn.setFromUnitVectors(normal, next);
    forward.applyQuaternion(turn);
    normal.copy(next).normalize();
    if (altitude <= 0 && speed > 3.0 && normal.dot(carRamp) > 0.99945) {
      verticalSpeed = 4.4;
      altitude = 0.045;
      award("ramp");
    }
    if (altitude > 0) {
      verticalSpeed -= 10.8 * dt;
      altitude += verticalSpeed * dt;
      if (altitude <= 0) { altitude = 0; suspension = 1; }
    }
    for (const item of obstacles) {
      if (item.fall === 0 && normal.dot(item.direction) > 0.99960 && Math.abs(speed) > 1.4) {
        item.velocity = 4.0;
        item.fall = 0.01;
        award("cones");
      }
      if (item.velocity) {
        item.fall = Math.min(1.48, item.fall + item.velocity * dt);
        alignRadially(item.cone, item.direction, surfaceRadius(item.direction) + 0.035);
        item.cone.rotateZ(item.fall);
        if (item.fall >= 1.48) item.velocity = 0;
      }
    }
    const before = Math.floor(distance / 0.44);
    distance += speed * dt;
    suspension = T.MathUtils.damp(suspension, 0, 6, dt);
    place(dt, steer);
    if (particlesEnabled && altitude === 0 && Math.abs(speed) > 2 && before !== Math.floor(distance / 0.44)) stamp();
    for (let i = 0; i < count; i++) {
      const puff = particles[i];
      if (puff.life <= 0) continue;
      puff.life -= dt;
      puff.position.addScaledVector(puff.velocity, dt);
      dummy.position.copy(puff.position);
      dummy.scale.setScalar(Math.max(0, puff.life * 2.1));
      dummy.updateMatrix();
      dust.setMatrixAt(i, dummy.matrix);
      dust.instanceMatrix.needsUpdate = true;
    }
  }

  function reset() {
    normal.copy(carSpawn);
    forward.copy(carRamp).addScaledVector(normal, -carRamp.dot(normal)).normalize();
    speed = altitude = verticalSpeed = 0;
    const nearest = sites.find(([, site]) => site.normal.angleTo(normal) < 0.24);
    gate = !nearest;
    place(1, 0);
  }
  reset();
  return {
    group, root, normal, forward, step, reset,
    get speed() { return speed; },
    setActive(value: boolean) { active = value; input.clear(); if (!value) speed = 0; },
    input(key: string, pressed: boolean) { if (pressed) input.add(key); else input.delete(key); },
    clear() { input.clear(); },
    horn() { if (normal.dot(hornDirection) > 0.990) { beacon.scale.setScalar(1.25); award("horn"); } },
  };
}
