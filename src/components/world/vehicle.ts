import * as T from "three";
import { box, solid, type GamePalette } from "./gameObjects";

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
