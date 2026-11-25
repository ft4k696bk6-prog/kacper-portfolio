import * as T from "three";
import { projectIndex, projectStops } from "./content";
import type { ProjectBody } from "./discoveries";
import { makeDistrict } from "./district";
import { globeRadius } from "./globe";
import { disposeObjects } from "./gameObjects";
import { buildModel, type Hit } from "./model";
import { planets } from "./planets";
import { frontNormal, makePlanetSkin } from "./planetSurface";

export type ProjectScene = ReturnType<typeof buildProjectScene>;
export function buildProjectScene(body: ProjectBody, low: boolean, software: boolean, effects: Parameters<typeof makeDistrict>[2]) {
  const root = new T.Group();
  const info = planets[body];
  root.position.fromArray(info.center);
  const skin = makePlanetSkin(body, low);
  const district = makeDistrict(body, low, effects);
  root.add(skin, district.root);
  const inspect: Hit = body === "ai" ? { zone: "lab" } : { zone: "gallery", project: projectIndex(body) };
  let architecture: ReturnType<typeof buildModel> | undefined;
  let hits: T.Mesh[] = [];
  let marker = district.mainPoint?.clone().add(root.position) ?? root.position.clone();
  let focus = marker.clone();
  let proxy: T.Mesh<T.SphereGeometry, T.MeshBasicMaterial> | undefined;
  if (body === "jalapeno") {
    proxy = new T.Mesh(new T.SphereGeometry(1.78,12,8), new T.MeshBasicMaterial({ visible: false }));
    proxy.position.copy(marker).addScaledVector(frontNormal,-.43).sub(root.position);
    proxy.userData.hit = inspect;
    root.add(proxy);
    hits = [proxy];
  } else {
    const siteId = body === "ai" ? "lab" : body;
    architecture = buildModel(low, software, new Set([siteId]), info.colors[2]);
    const site = architecture.sites[siteId];
    architecture.group.quaternion.setFromUnitVectors(site.normal, frontNormal);
    architecture.group.position.copy(frontNormal).multiplyScalar(info.radius - globeRadius + .12);
    root.add(architecture.group);
    root.updateMatrixWorld(true);
    marker = (body === "ai" ? new T.Vector3(5.35, 5.85, -7.78) : new T.Vector3(...projectStops[body].marker))
      .applyMatrix4(site.matrix).applyMatrix4(architecture.group.matrixWorld);
    focus = (body === "ai" ? new T.Vector3(5.1, 2.4, -7.8) : new T.Vector3(...projectStops[body].target))
      .applyMatrix4(site.matrix).applyMatrix4(architecture.group.matrixWorld);
    hits = architecture.hits;
  }
  const viewDirection = new T.Vector3(.05, .28, 1).add(frontNormal).normalize();
  return {
    root, marker, focus, viewDirection, inspect, interactive: district.interactive, hits, bounds: district.bounds,
    update: district.update,
    loadSurfaces(redraw: () => void) { architecture?.loadSurfaces(redraw); },
    loadCars(redraw: () => void) { if (body === "starcars") void architecture?.loadCars(redraw); },
    showCars(visible: boolean) { architecture?.showDetailedCars(visible); },
    dispose() {
      if (architecture) {
        root.remove(architecture.group);
        architecture.dispose();
      }
      district.disposeTextures();
      disposeObjects(root);
      root.removeFromParent();
    },
  };
}
