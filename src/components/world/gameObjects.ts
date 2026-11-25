import * as T from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

export function gamePalette() {
  return {
    chalk: new T.MeshLambertMaterial({ color: 0xf1d4a4 }),
    ink: new T.MeshLambertMaterial({ color: 0x354153 }),
    rubber: new T.MeshLambertMaterial({ color: 0x272934 }),
    glass: new T.MeshLambertMaterial({ color: 0x6baeb9, emissive: 0x285b70, emissiveIntensity: 0.37 }),
    warm: new T.MeshLambertMaterial({ color: 0xffce83, emissive: 0xe49b49, emissiveIntensity: 0.48 }),
    coral: new T.MeshLambertMaterial({ color: 0xd86b4d }),
    moss: new T.MeshLambertMaterial({ color: 0x68805d }),
    sea: new T.MeshLambertMaterial({ color: 0x428789 }),
    gold: new T.MeshLambertMaterial({ color: 0xe9a73f, emissive: 0xffa436, emissiveIntensity: 0.30 }),
    crystal: new T.MeshLambertMaterial({ color: 0x8ae0d1, emissive: 0x34b7a6, emissiveIntensity: 0.57 }),
  };
}
export type GamePalette = ReturnType<typeof gamePalette>;

export function solid(geometry: T.BufferGeometry, material: T.Material, x = 0, y = 0, z = 0) {
  const mesh = new T.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  return mesh;
}

export function box(w: number, h: number, d: number, material: T.Material, x = 0, y = 0, z = 0, radius = 0.08) {
  return solid(new RoundedBoxGeometry(w, h, d, 1, radius), material, x, y, z);
}

export function alignRadially(object: T.Object3D, normal: T.Vector3, radius: number) {
  object.position.copy(normal).multiplyScalar(radius);
  object.quaternion.setFromUnitVectors(T.Object3D.DEFAULT_UP, normal);
  return object;
}

export function disposeObjects(object: T.Object3D, disposeMaterials = true) {
  const geometries = new Set<T.BufferGeometry>();
  const materials = new Set<T.Material>();
  object.traverse(child => {
    if (child instanceof T.Mesh || child instanceof T.Line || child instanceof T.Points) {
      geometries.add(child.geometry);
      for (const material of Array.isArray(child.material) ? child.material : [child.material]) materials.add(material);
    }
  });
  geometries.forEach(geometry => geometry.dispose());
  if (disposeMaterials) materials.forEach(material => material.dispose());
}
