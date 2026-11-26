import * as T from "three";
import { projectIndex, projectStops } from "./content";
import type { ProjectBody } from "./discoveries";
import { makeDistrict } from "./district";
import { disposeObjects } from "./gameObjects";
import { buildModel, type Hit } from "./model";
import { planets } from "./planets";
import { frontNormal, makePlanetSkin, placeArchitecture } from "./planetSurface";
import { planetAtmosphere } from "./planetFinish";

export type ProjectScene = ReturnType<typeof buildProjectScene>;
export function buildProjectScene(body: ProjectBody, low: boolean, software: boolean, effects: Parameters<typeof makeDistrict>[2]) {
  const root = new T.Group();
  const info = planets[body];
  root.position.fromArray(info.center);
  const skin = makePlanetSkin(body, low);
  const district = makeDistrict(body, low, effects);
  const atmosphere = planetAtmosphere(info.radius, new T.Color(info.colors[1]), low, .56);
  root.add(skin, atmosphere, district.root);
  const inspect: Hit = body === "ai" ? { zone: "lab" } : { zone: "gallery", project: projectIndex(body) };
  let architecture: ReturnType<typeof buildModel> | undefined;
  let hits: T.Mesh[] = [];
  let marker = district.mainPoint?.clone().add(root.position) ?? root.position.clone();
  let focus = marker.clone();
  let viewDirection = frontNormal.clone().add(new T.Vector3(-.8, -.14, .3)).normalize();
  let viewDistance = 11.4;
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
    root.add(placeArchitecture(architecture.group, site.normal, info.radius));
    root.updateMatrixWorld(true);
    marker = (body === "ai" ? new T.Vector3(5.35, 5.85, -7.78) : new T.Vector3(...projectStops[body].marker))
      .applyMatrix4(site.matrix).applyMatrix4(architecture.group.matrixWorld);
    focus = (body === "ai" ? new T.Vector3(5.1, 2.4, -7.8) : new T.Vector3(...projectStops[body].target))
      .applyMatrix4(site.matrix).applyMatrix4(architecture.group.matrixWorld);
    // Detail shots lead with the entrance and form of the building before exposing its rooftop.
    const east = new T.Vector3().setFromMatrixColumn(site.matrix, 0).applyQuaternion(architecture.group.quaternion);
    const south = site.south.clone().applyQuaternion(architecture.group.quaternion);
    const elevation = body === "starcars" ? .88 : .58;
    viewDirection = frontNormal.clone().multiplyScalar(elevation).add(south).addScaledVector(east, -.44).normalize();
    viewDistance = Math.max(site.width, site.depth) * 1.92;
    hits = architecture.hits;
  }
  root.updateMatrixWorld(true);
  const radialGroups = district.root.children.filter(child => child.position.length() > info.radius * .8);
  if (architecture) radialGroups.push(architecture.group);
  const view = new T.Vector3();
  const ground = info.radius - .07;
  const clusters = radialGroups.map(object => {
    const bound = new T.Box3().setFromObject(object).getBoundingSphere(new T.Sphere());
    const direction = bound.center.sub(root.position);
    const distance = direction.length();
    // Both the roof height and the cluster's angular extent can reach beyond the ground horizon.
    const angle = Math.acos(T.MathUtils.clamp(ground / (distance + bound.radius + .32), 0, 1))
      + Math.asin(T.MathUtils.clamp(bound.radius / distance, 0, 1));
    return { object, direction: direction.normalize(), angle };
  });
  return {
    root, marker, focus, viewDirection, viewDistance, inspect, interactive: district.interactive, hits, bounds: district.bounds,
    update: district.update,
    cull(eye: T.Vector3) {
      view.copy(eye).sub(root.position);
      const horizon = Math.acos(T.MathUtils.clamp(ground / view.length(), 0, 1));
      view.normalize();
      for (const { object, direction, angle } of clusters) {
        object.visible = horizon + angle >= Math.PI || view.dot(direction) >= Math.cos(horizon + angle);
      }
    },
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
