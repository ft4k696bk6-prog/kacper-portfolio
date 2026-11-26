import * as T from "three";
import { globeDirection, loadPlanet, type SurfaceStop } from "./globe";
import { box, disposeObjects, gamePalette, solid } from "./gameObjects";
import { colorTerrain } from "./terrain";
import { planets, projectBodies, visibleBodies } from "./planets";
import { frontNormal, makePlanetSkin, placeArchitecture } from "./planetSurface";
import { planetAtmosphere } from "./planetFinish";
import { planetLod } from "./planetLod";
import { buildModel } from "./model";
import { orbitLandmarks } from "./orbitLandmarks";
import type { Body } from "./discoveries";

export function makeUniverse(low: boolean) {
  const group = new T.Group();
  const objects = new Map<Body, T.Group>();
  const levels = new Map<Body, ReturnType<typeof planetLod>>();
  const portraits = new Map<Body, T.Quaternion>();
  const axis = new T.Vector3(0, .09, 1).normalize();
  const face = new T.Vector3(0, .42, .91).normalize();
  const aligned = new T.Quaternion();
  const selectable: T.Mesh[] = [];
  const home = loadPlanet(true, true);
  colorTerrain(home.sphere, true);
  const homeTarget = new T.Mesh(new T.SphereGeometry(planets.home.radius, 16, 10), new T.MeshBasicMaterial({ visible: false }));
  const homeLandmarks = new T.Group();
  homeTarget.userData.body = "home";
  home.group.add(homeTarget, homeLandmarks);
  portraits.set("home", new T.Quaternion().setFromUnitVectors(globeDirection(-25, -4), axis));
  objects.set("home", home.group);
  group.add(home.group);
  selectable.push(homeTarget);
  for (const id of visibleBodies(true, true, true)) {
    if (id === "home") continue;
    const skin = makePlanetSkin(id, true, true);
    const system = new T.Group().add(skin);
    system.position.fromArray(planets[id].center);
    skin.userData.body = id;
    objects.set(id, system);
    group.add(system);
    selectable.push(skin);
    const front = id === "signal" ? globeDirection(16, -24) : id === "moon" || id === "garage" ? globeDirection(20, 26) : frontNormal;
    portraits.set(id, new T.Quaternion().setFromUnitVectors(front, face));

    const hue = planets[id].colors[1];
    const shell = planetAtmosphere(planets[id].radius, new T.Color(hue), true, .58);
    system.add(shell);
    if (id === "beatmarket" || id === "reenergy" || id === "signal") {
      const radius = planets[id].radius;
      const ash = new T.Color(hue).lerp(new T.Color("#ba9c7e"), .58);
      const rings = new T.Group();
      rings.add(new T.Mesh(new T.RingGeometry(radius * 1.36, radius * 1.59, 66),
        new T.MeshBasicMaterial({ color: ash, opacity: .15, transparent: true, depthWrite: false, side: T.DoubleSide })));
      for (const [start, end, opacity] of [[1.38, 1.405, .41], [1.48, 1.494, .31], [1.58, 1.60, .43]]) {
        rings.add(new T.Mesh(new T.RingGeometry(radius * start, radius * end, 66),
          new T.MeshBasicMaterial({ color: ash, opacity, transparent: true, depthWrite: false, side: T.DoubleSide })));
      }
      rings.rotation.set(1.10, -.32, .12);
      system.add(rings);
    }
  }

  function populateAtlas() {
    const sites = new Set<SurfaceStop>(["hq", "lab", ...projectBodies.filter(id => id !== "jalapeno")]);
    const architecture = buildModel(true, true, sites, undefined, true);
    for (const [siteId, site] of architecture.atlasSites) {
      if (siteId === "hq") homeLandmarks.add(site);
      else if (siteId !== "studio") {
        const id = siteId === "lab" ? "ai" : siteId;
        objects.get(id)!.add(placeArchitecture(site, architecture.sites[siteId].normal, planets[id].radius));
      }
    }
    homeLandmarks.add(orbitLandmarks("home"));
    for (const [id, planet] of objects) {
      if (id !== "home") planet.add(orbitLandmarks(id));
      levels.set(id, planetLod([planet], true));
    }
  }

  const orbitGroup = new T.Group();
  const ticks: T.Vector3[] = [];
  const orbitalColor = new T.Color("#9a8c82");
  for (const [index, [rx, ry]] of [[40, 32], [75, 59], [121, 86]].entries()) {
    const points = Array.from({ length: 120 }, (_, i) => {
      const theta = i * Math.PI / 60;
      return new T.Vector3(rx * Math.cos(theta), ry * Math.sin(theta), -39 + 4 * Math.sin(theta));
    });
    // Use fragment coverage for the orbit strokes at both full and reduced render resolution.
    const trace = new T.Mesh(new T.RingGeometry(.97, 1.03, 144), new T.ShaderMaterial({
      transparent: true, depthWrite: false, side: T.DoubleSide, toneMapped: false,
      uniforms: { tint: { value: orbitalColor }, strength: { value: index === 2 ? .28 : .21 } },
      vertexShader: /* glsl */ `
        varying vec2 orbitPoint;
        void main() {
          orbitPoint = position.xy;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,
      fragmentShader: /* glsl */ `
        varying vec2 orbitPoint;
        uniform vec3 tint;
        uniform float strength;
        void main() {
          float radius = length(orbitPoint);
          float pixelWidth = max(fwidth(radius), .0005);
          float stroke = 1.0 - smoothstep(.18, 1.18, abs(radius - 1.0) / pixelWidth);
          gl_FragColor = vec4(tint, strength * stroke);
          #include <colorspace_fragment>
        }`,
    }));
    trace.scale.set(rx, Math.hypot(ry, 4), 1);
    trace.rotation.x = Math.atan2(4, ry);
    trace.position.z = -39;
    orbitGroup.add(trace);
    for (let i = 0; i < points.length; i += index === 2 ? 3 : 6) {
      const point = points[i];
      const tick = i % 15 === 0 ? 3.6 : 1.34;
      const normal = new T.Vector2(point.x / (rx * rx), point.y / (ry * ry)).setLength(tick);
      ticks.push(point, point.clone().add(new T.Vector3(normal.x, normal.y, 0)));
    }
  }
  orbitGroup.add(new T.LineSegments(new T.BufferGeometry().setFromPoints(ticks), new T.LineBasicMaterial({
    color: "#a89581", transparent: true, opacity: .41, depthWrite: false,
  })));
  const focusTint = new T.Color();
  const focusLight = new T.Color(0xffe6c0);
  const halo = new T.Mesh(new T.RingGeometry(1.035, 1.34, 72), new T.ShaderMaterial({
    transparent: true, depthWrite: false, toneMapped: false,
    uniforms: { tint: { value: focusTint } },
    vertexShader: /* glsl */ `
      varying vec2 ring;
      void main() {
        ring = position.xy;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
      }`,
    fragmentShader: /* glsl */ `
      varying vec2 ring;
      uniform vec3 tint;
      void main() {
        float r = length(ring);
        float glow = .19 * (1.0 - smoothstep(.014, .23, abs(r - 1.09)));
        float outline = .49 * (1.0 - smoothstep(.010, .041, abs(r - 1.10)));
        float arcs = smoothstep(.63, .81, abs(cos(2.0 * atan(ring.y, ring.x) - .41)));
        float edge = .48 * arcs * (1.0 - smoothstep(.009, .037, abs(r - 1.23)));
        gl_FragColor = vec4(tint, glow + outline + edge);
        #include <colorspace_fragment>
      }`,
  }));
  halo.visible = false;
  orbitGroup.add(halo);
  const positions: T.Vector3[] = [];
  const shine: number[] = [];
  const count = low ? 400 : 760;
  for (let i = 0; i < count; i++) {
    const offset = Math.sin((i + 1) * 538.23);
    const lat = Math.asin(1 - 2 * (i + .5) / count) * 180 / Math.PI;
    positions.push(globeDirection(lat + offset * 2.4, i * 137.508 + offset * 4).multiplyScalar(710 + i % 11 * 51));
    shine.push(offset * .5 + .5);
  }
  const starGeometry = new T.BufferGeometry().setFromPoints(positions);
  starGeometry.setAttribute("shine", new T.Float32BufferAttribute(shine, 1));
  const stars = new T.Points(starGeometry, new T.ShaderMaterial({
    transparent: true, depthWrite: false, toneMapped: false,
    vertexShader: /* glsl */ `
      attribute float shine;
      varying float intensity;
      void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
        intensity = shine;
        gl_PointSize = 1.2 + pow(shine, 8.) * 2.7;
      }`,
    fragmentShader: /* glsl */ `
      varying float intensity;
      void main() {
        vec2 p = abs(2. * gl_PointCoord - 1.);
        float center = 1. - smoothstep(.08, 1., length(p));
        float flare = (1. - smoothstep(.025, .23, min(p.x, p.y))) * (1. - smoothstep(.16, 1., max(p.x, p.y)));
        float light = center * (.20 + intensity * .38) + step(.94, intensity) * flare * .19;
        gl_FragColor = vec4(mix(vec3(.32, .49, .72), vec3(.78, .63, .43), intensity * intensity), light);
        #include <colorspace_fragment>
      }`,
  }));

  const belt = new T.InstancedMesh(new T.IcosahedronGeometry(1, 0), new T.MeshLambertMaterial({ color: 0x737384 }), low ? 30 : 64);
  const dummy = new T.Object3D();
  for (let i = 0; i < belt.count; i++) {
    const a = 2.39996 * i, r = 132 + i % 11 * 1.1;
    dummy.position.set(Math.cos(a) * r, Math.sin(a) * r * .75, Math.sin(i * 5) * 6 - 12);
    dummy.rotation.set(a, a * .5, a * .6);
    dummy.scale.setScalar(.45 + i % 7 * .20);
    dummy.updateMatrix();
    belt.setMatrixAt(i, dummy.matrix);
  }
  orbitGroup.add(belt);
  const comet = new T.Group();
  comet.add(solid(new T.IcosahedronGeometry(1.1, 1), new T.MeshBasicMaterial({ color: 0xb8eae3 })),
    solid(new T.ConeGeometry(.85, 17, 8).rotateZ(-Math.PI / 2), new T.MeshBasicMaterial({ color: 0x87b8e9, opacity: .35, transparent: true, depthWrite: false }), -8));
  orbitGroup.add(comet);
  const accents = gamePalette();
  const voyager = new T.Group();
  voyager.add(solid(new T.CylinderGeometry(.65,.76,1.86,11),accents.chalk),
    box(4.62,.066,.92,accents.glass,0,.39),
    box(.71,.10,1.47,accents.ink,0,.48), solid(new T.SphereGeometry(.34,8,6),accents.warm,0,.92));
  orbitGroup.add(voyager);
  const saucer = new T.Group();
  saucer.add(solid(new T.SphereGeometry(2.7,16,8).scale(1.32,.23,1),accents.ink),
    solid(new T.SphereGeometry(1.63,15,8).scale(1,.60,1),accents.crystal,0,.53));
  for (let i=0;i<8;i++) {
    const a=i*Math.PI/4;
    saucer.add(solid(new T.SphereGeometry(.28,7,5),accents.warm,Math.cos(a)*2.56,-.19,Math.sin(a)*2.04));
  }
  saucer.visible = false;
  orbitGroup.add(saucer);
  const transitProbe = new T.Vector3();
  group.add(orbitGroup);
  function show(system: boolean, active: Body | null, revealedMoon: boolean, unknown: boolean, garage: boolean) {
    if ((system || revealedMoon) && !levels.size) populateAtlas();
    orbitGroup.visible = system;
    const revealed = visibleBodies(revealedMoon, unknown, garage);
    objects.forEach((object, id) => {
      levels.get(id)?.(0);
      object.quaternion.copy(portraits.get(id)!);
      object.visible = active !== id && ((system && revealed.includes(id)) || (id === "moon" && active === "home" && revealedMoon));
    });
  }
  return {
    group, stars, show,
    setDetail(id: Body, fraction: number, turn = 0) {
      levels.get(id)?.(fraction);
      const object = objects.get(id)!;
      object.quaternion.slerpQuaternions(portraits.get(id)!, aligned, turn);
      object.visible = fraction < 1;
    },
    visible() { return selectable.filter(item => item.parent?.visible); },
    highlight(id: Body | null, eye: T.Vector3) {
      const target = id && objects.get(id);
      halo.visible = !!target && target.visible && orbitGroup.visible;
      if (!id || !target || !halo.visible) return;
      const radius = planets[id].radius;
      halo.position.copy(target.position);
      halo.scale.setScalar(radius);
      halo.lookAt(eye);
      focusTint.setHex(planets[id].colors[2]).lerp(focusLight, .48);
    },
    get visitor() { return orbitGroup.visible && saucer.visible ? saucer.position : null; },
    hitVisitor(ray: T.Raycaster) { return orbitGroup.visible && saucer.visible && ray.intersectObject(saucer,true).length > 0; },
    marker(id: Body) { return objects.get(id)?.visible ? objects.get(id)!.position : null; },
    update(time: number, animate: boolean) {
      const phase = time % 31;
      comet.visible = animate && phase > 17 && phase < 23;
      comet.position.set((phase - 20) * 57, 94 - (phase - 20) * 10, -.8);
      const orbit = .61 + time*.074;
      voyager.position.set(66*Math.cos(orbit),48*Math.sin(orbit),-14);
      voyager.rotation.set(.32,orbit,-.28);
      const arrival = (time + 14) % 77;
      saucer.visible = animate && arrival > 34 && arrival < 48;
      if (saucer.visible) {
        transitProbe.set(-143 + (arrival-34)*19.9, 41 + Math.sin((arrival-34)*.34)*22, 27 + Math.cos(arrival)*5.1);
        saucer.position.copy(transitProbe);
        saucer.rotation.set(.28,time*.66,-.29);
      }
    },
    dispose() {
      group.remove(home.group);
      disposeObjects(homeLandmarks);
      home.dispose();
      homeTarget.geometry.dispose();
      homeTarget.material.dispose();
      disposeObjects(group);
      Object.values(accents).forEach(material => material.dispose());
      stars.geometry.dispose();
      stars.material.dispose();
    },
  };
}
