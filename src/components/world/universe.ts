import * as T from "three";
import { globeDirection, loadPlanet } from "./globe";
import { box, disposeObjects, gamePalette, solid } from "./gameObjects";
import { colorTerrain } from "./terrain";
import { planets, visibleBodies } from "./planets";
import { makePlanetSkin } from "./planetSurface";
import type { Body } from "./discoveries";

export function makeUniverse(low: boolean) {
  const group = new T.Group();
  const objects = new Map<Body, T.Object3D>();
  const selectable: T.Mesh[] = [];
  const home = loadPlanet(true, true);
  colorTerrain(home.sphere, true);
  const homeTarget = new T.Mesh(new T.SphereGeometry(planets.home.radius, 16, 10), new T.MeshBasicMaterial({ visible: false }));
  homeTarget.userData.body = "home";
  home.group.add(homeTarget);
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

    const hue = planets[id].colors[1];
    const shell = solid(new T.SphereGeometry(planets[id].radius * 1.045, 28, 16), new T.ShaderMaterial({
      uniforms: { hue: { value: new T.Color(hue) } }, transparent: true, depthWrite: false, side: T.BackSide, blending: T.AdditiveBlending,
      vertexShader: "varying vec3 normalInView; void main(){normalInView=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
      fragmentShader: "uniform vec3 hue; varying vec3 normalInView; void main(){gl_FragColor=vec4(hue,pow(1.-abs(normalInView.z),2.)*.60);}",
    }));
    system.add(shell);
    if (id === "beatmarket" || id === "reenergy" || id === "signal") {
      const line = new T.Mesh(new T.RingGeometry(planets[id].radius * 1.36, planets[id].radius * 1.47, 58),
        new T.MeshBasicMaterial({ color: hue, opacity: .34, transparent: true, depthWrite: false, side: T.DoubleSide }));
      line.rotation.set(.99, -.28, .12);
      system.add(line);
    }
  }

  const orbitGroup = new T.Group();
  for (const [rx, ry] of [[40, 32], [74, 58], [121, 86]]) {
    const points = Array.from({ length: 120 }, (_, i) => {
      const theta = i * Math.PI / 60;
      return new T.Vector3(rx * Math.cos(theta), ry * Math.sin(theta), -.13 * rx + 4 * Math.sin(theta));
    });
    const trace = new T.LineLoop(new T.BufferGeometry().setFromPoints(points), new T.LineBasicMaterial({ color: 0x8fabd2, transparent: true, opacity: .19, depthWrite: false }));
    orbitGroup.add(trace);
  }
  const positions: T.Vector3[] = [];
  const colors: number[] = [];
  for (let i = 0; i < (low ? 240 : 520); i++) {
    const lat = Math.asin(1 - 2 * (i + .5) / (low ? 240 : 520)) * 180 / Math.PI;
    positions.push(globeDirection(lat, i * 137.508).multiplyScalar(695 + i % 11 * 51));
    const value = .14 + (i % 11) * .045;
    colors.push(value * (i % 2 ? .85 : 1), value, value * 1.33);
  }
  const starGeometry = new T.BufferGeometry().setFromPoints(positions);
  starGeometry.setAttribute("color", new T.Float32BufferAttribute(colors, 3));
  const stars = new T.Points(starGeometry, new T.PointsMaterial({ vertexColors: true, size: low ? 1.05 : 1.42, sizeAttenuation: true, depthWrite: false, transparent: true, opacity: .81 }));

  const belt = new T.InstancedMesh(new T.IcosahedronGeometry(1, 0), new T.MeshLambertMaterial({ color: 0x8e8ca6 }), low ? 40 : 75);
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
    orbitGroup.visible = system;
    objects.forEach((object, id) => {
      object.visible = active !== id && ((system && visibleBodies(revealedMoon, unknown, garage).includes(id)) || (id === "moon" && active === "home" && revealedMoon));
    });
  }
  return {
    group, stars, show,
    visible() { return selectable.filter(item => item.parent?.visible); },
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
