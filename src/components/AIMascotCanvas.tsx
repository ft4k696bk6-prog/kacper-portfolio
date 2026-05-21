"use client";

import { useEffect, useRef, useState } from "react";
import type { Material, Mesh, Object3D } from "three";

type MascotMood = "idle" | "listening" | "thinking" | "speaking";

type AIMascotCanvasProps = {
  mood: MascotMood;
  reducedMotion: boolean;
};

const ASSISTANT_MODEL_PATH =
  process.env.NEXT_PUBLIC_AI_ASSISTANT_MODEL_PATH?.trim() || "/models/ai-assistant.glb";
const MODEL_FRONT_ROTATION = Math.PI * 1.5;

export function AIMascotCanvas({ mood, reducedMotion }: AIMascotCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const moodRef = useRef(mood);
  const reducedMotionRef = useRef(reducedMotion);
  const [renderDomFallback, setRenderDomFallback] = useState(false);

  useEffect(() => {
    moodRef.current = mood;
  }, [mood]);

  useEffect(() => {
    reducedMotionRef.current = reducedMotion;
  }, [reducedMotion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animationFrame = 0;
    let disposed = false;
    let cleanup = () => {};

    async function setupMascot() {
      try {
        const THREE = await import("three");
        const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");
        const activeCanvas = canvasRef.current;
        if (disposed || !activeCanvas) return;
        const canvasElement: HTMLCanvasElement = activeCanvas;

        const renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: true,
          canvas: canvasElement,
          powerPreference: "low-power",
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
        renderer.setClearColor(0x000000, 0);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(31, 1, 0.1, 100);
        camera.position.set(0, 0.16, 5.6);

        const root = new THREE.Group();
        scene.add(root);

        const gold = new THREE.MeshStandardMaterial({
          color: 0xd7b46a,
          metalness: 0.82,
          roughness: 0.28,
          emissive: 0x1a1204,
          emissiveIntensity: 0.18,
        });
        const softGold = new THREE.MeshStandardMaterial({
          color: 0xf4dfaa,
          metalness: 0.45,
          roughness: 0.36,
        });
        const darkGlass = new THREE.MeshStandardMaterial({
          color: 0x191815,
          metalness: 0.35,
          roughness: 0.16,
          emissive: 0x050403,
          emissiveIntensity: 0.35,
        });
        const eyeMaterial = new THREE.MeshStandardMaterial({
          color: 0xfff0bd,
          emissive: 0xffd778,
          emissiveIntensity: 1.6,
          metalness: 0.2,
          roughness: 0.12,
        });
        const blushMaterial = new THREE.MeshBasicMaterial({
          color: 0xffc7a3,
          transparent: true,
          opacity: 0.22,
        });

        const fallbackGroup = new THREE.Group();
        root.add(fallbackGroup);

        const body = new THREE.Mesh(new THREE.SphereGeometry(1.03, 48, 32), gold);
        body.scale.set(0.92, 0.76, 0.7);
        body.position.y = -0.72;
        fallbackGroup.add(body);

        const head = new THREE.Mesh(new THREE.SphereGeometry(1.05, 56, 36), gold);
        head.scale.set(1.08, 0.88, 0.82);
        head.position.y = 0.34;
        fallbackGroup.add(head);

        const face = new THREE.Mesh(new THREE.SphereGeometry(0.76, 48, 24), darkGlass);
        face.scale.set(1, 0.42, 0.14);
        face.position.set(0, 0.37, 0.82);
        fallbackGroup.add(face);

        const leftEye = new THREE.Mesh(new THREE.SphereGeometry(0.07, 18, 12), eyeMaterial);
        leftEye.position.set(-0.31, 0.42, 0.95);
        fallbackGroup.add(leftEye);

        const rightEye = leftEye.clone();
        rightEye.position.x = 0.31;
        fallbackGroup.add(rightEye);

        const smile = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.013, 8, 32, Math.PI), eyeMaterial);
        smile.rotation.set(Math.PI, 0, 0);
        smile.position.set(0, 0.25, 0.96);
        fallbackGroup.add(smile);

        const leftBlush = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 8), blushMaterial);
        leftBlush.scale.set(1.5, 0.5, 0.08);
        leftBlush.position.set(-0.53, 0.3, 0.94);
        fallbackGroup.add(leftBlush);

        const rightBlush = leftBlush.clone();
        rightBlush.position.x = 0.53;
        fallbackGroup.add(rightBlush);

        const leftEar = new THREE.Mesh(new THREE.SphereGeometry(0.28, 24, 16), softGold);
        leftEar.scale.set(0.72, 1, 0.55);
        leftEar.position.set(-0.95, 0.45, 0.02);
        fallbackGroup.add(leftEar);

        const rightEar = leftEar.clone();
        rightEar.position.x = 0.95;
        fallbackGroup.add(rightEar);

        const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.035, 0.58, 14), softGold);
        antenna.position.set(0, 1.28, 0);
        antenna.rotation.z = 0.18;
        fallbackGroup.add(antenna);

        const antennaTip = new THREE.Mesh(new THREE.SphereGeometry(0.12, 24, 16), eyeMaterial);
        antennaTip.position.set(0.1, 1.58, 0);
        fallbackGroup.add(antennaTip);

        const halo = new THREE.Mesh(new THREE.TorusGeometry(1.25, 0.018, 10, 80), softGold);
        halo.rotation.x = Math.PI / 2.8;
        halo.position.set(0, 0.13, -0.22);
        fallbackGroup.add(halo);

        const leftArm = new THREE.Mesh(new THREE.SphereGeometry(0.28, 24, 16), softGold);
        leftArm.scale.set(0.58, 1.1, 0.5);
        leftArm.position.set(-0.95, -0.62, 0.08);
        leftArm.rotation.z = -0.34;
        fallbackGroup.add(leftArm);

        const rightArm = leftArm.clone();
        rightArm.position.x = 0.95;
        rightArm.rotation.z = 0.34;
        fallbackGroup.add(rightArm);

        const keyLight = new THREE.DirectionalLight(0xfff2cb, 2.8);
        keyLight.position.set(2.8, 3.5, 4.5);
        scene.add(keyLight);

        const rimLight = new THREE.PointLight(0xd7b46a, 2.5, 7);
        rimLight.position.set(-2.2, 1.8, 2.2);
        scene.add(rimLight);

        scene.add(new THREE.AmbientLight(0xffffff, 1.05));

        let loadedModel: Object3D | null = null;
        let loadedModelBaseScale = 1;
        let mixer: { update: (delta: number) => void } | null = null;

        function disposeMaterial(material: Material | Material[]) {
          if (Array.isArray(material)) {
            material.forEach((item) => item.dispose());
            return;
          }

          material.dispose();
        }

        function disposeObject(object: Object3D) {
          object.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.geometry.dispose();
              disposeMaterial((child as Mesh).material as Material | Material[]);
            }
          });
        }

        function frameModel(model: Object3D) {
          const box = new THREE.Box3().setFromObject(model);
          const size = new THREE.Vector3();
          box.getSize(size);
          const largestSide = Math.max(size.x, size.y, size.z) || 1;
          const scale = 2.9 / largestSide;
          model.scale.setScalar(scale);

          const framedBox = new THREE.Box3().setFromObject(model);
          const center = new THREE.Vector3();
          framedBox.getCenter(center);
          model.position.sub(center);
          model.position.y -= 0.14;
          model.rotation.y = MODEL_FRONT_ROTATION;
          return scale;
        }

        function prepareModel(model: Object3D) {
          model.traverse((child) => {
            child.frustumCulled = false;

            if (child instanceof THREE.Mesh) {
              child.castShadow = false;
              child.receiveShadow = false;
            }
          });

          return frameModel(model);
        }

        const loader = new GLTFLoader();
        loader.load(
          ASSISTANT_MODEL_PATH,
          (gltf) => {
            if (disposed) return;

            const model = gltf.scene;
            loadedModelBaseScale = prepareModel(model);
            fallbackGroup.visible = false;
            root.add(model);
            loadedModel = model;

            if (gltf.animations.length > 0) {
              const nextMixer = new THREE.AnimationMixer(model);
              gltf.animations.slice(0, 2).forEach((clip) => nextMixer.clipAction(clip).play());
              mixer = nextMixer;
            }
          },
          undefined,
          () => {
            fallbackGroup.visible = true;
          },
        );

        function resize() {
          const rect = canvasElement.getBoundingClientRect();
          const size = Math.max(1, Math.floor(Math.min(rect.width, rect.height)));
          renderer.setSize(size, size, false);
          camera.aspect = 1;
          camera.updateProjectionMatrix();
        }

        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(canvasElement);
        resize();

        const clock = new THREE.Clock();

        function animate() {
          if (disposed) return;

          const delta = clock.getDelta();
          const elapsed = clock.elapsedTime;
          const currentMood = moodRef.current;
          const motionOff = reducedMotionRef.current || document.hidden;
          const breath = motionOff ? 0 : Math.sin(elapsed * 1.6) * 0.055;
          const curiousTilt = motionOff ? 0 : Math.sin(elapsed * 0.9) * 0.11;

          root.position.y = breath;
          root.rotation.y = curiousTilt;
          root.rotation.z = motionOff ? 0 : Math.sin(elapsed * 0.7) * 0.035;

          if (!loadedModel) {
            leftArm.rotation.z = -0.42 + (motionOff ? 0 : Math.sin(elapsed * 2.2) * 0.1);
            rightArm.rotation.z = 0.42 + (motionOff ? 0 : Math.cos(elapsed * 2.1) * 0.1);
            halo.rotation.z = elapsed * 0.28;
          }

          const pulse =
            currentMood === "thinking"
              ? 1 + Math.sin(elapsed * 8) * 0.2
              : currentMood === "listening"
                ? 1.18
                : currentMood === "speaking"
                  ? 1 + Math.sin(elapsed * 12) * 0.12
                  : 1;
          leftEye.scale.setScalar(pulse);
          rightEye.scale.setScalar(pulse);
          antennaTip.scale.setScalar(currentMood === "listening" ? 1.3 : 1);

          if (loadedModel) {
            const thinkingPulse = currentMood === "thinking" ? 1 + Math.sin(elapsed * 5) * 0.018 : 1;
            loadedModel.rotation.y = MODEL_FRONT_ROTATION + (motionOff ? 0 : Math.sin(elapsed * 0.8) * 0.16);
            loadedModel.scale.setScalar(loadedModelBaseScale * thinkingPulse);
          }

          mixer?.update(delta);
          renderer.render(scene, camera);
          animationFrame = requestAnimationFrame(animate);
        }

        animate();

        cleanup = () => {
          cancelAnimationFrame(animationFrame);
          resizeObserver.disconnect();
          disposeObject(fallbackGroup);
          if (loadedModel) disposeObject(loadedModel);
          renderer.dispose();
        };
      } catch {
        if (!disposed) setRenderDomFallback(true);
      }
    }

    void setupMascot();

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  if (renderDomFallback) {
    return (
      <span
        aria-hidden="true"
        className="grid h-full w-full place-items-center rounded-full border border-[#d7b46a]/35 bg-[#d7b46a]/15 text-lg font-semibold text-[#f5dfae]"
      >
        AI
      </span>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      data-model-path={ASSISTANT_MODEL_PATH}
      className="h-full w-full"
    />
  );
}
