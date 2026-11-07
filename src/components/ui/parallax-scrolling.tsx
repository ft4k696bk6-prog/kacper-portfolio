"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

type ParallaxProps = { title: string; portraitAlt: string };

/** Layered scroll inspired by Osmo's parallax-scrolling component on 21st.dev.
 * Keep the original portrait still; only the scenery has a different scroll rate.
 */
export function ParallaxComponent({ title, portraitAlt }: ParallaxProps) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    let disposed = false;
    let cleanup: (() => void) | undefined;

    async function setup() {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const [{ gsap }, { ScrollTrigger }, { default: Lenis }] = await Promise.all([
        import("gsap"), import("gsap/ScrollTrigger"), import("@studio-freight/lenis"),
      ]);
      if (disposed || !root.current) return;
      gsap.registerPlugin(ScrollTrigger);
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const element = root.current;
        if (!element) return;
        const timeline = gsap.timeline({
          scrollTrigger: { trigger: element, start: "top top", end: "bottom top", scrub: true },
        });
        timeline.to(element.querySelector('[data-parallax-layer="1"]'), {
          yPercent: 30, ease: "none",
        }, 0).to(element.querySelector('[data-parallax-layer="2"]'), {
          yPercent: 12, ease: "none",
        }, 0);

        // Preserve native mobile scrolling and horizontal drag galleries.
        const lenis = window.matchMedia("(hover: hover) and (pointer: fine)").matches
          ? new Lenis({ smoothWheel: true, syncTouch: false, lerp: 0.12 }) : null;
        const tick = (time: number) => lenis?.raf(time * 1000);
        if (lenis) {
          lenis.on("scroll", ScrollTrigger.update);
          gsap.ticker.add(tick);
        }
        return () => {
          gsap.ticker.remove(tick);
          lenis?.off("scroll", ScrollTrigger.update);
          lenis?.destroy();
          // GSAP's context reverts only this component's timeline and trigger.
        };
      }, root);
      cleanup = () => media.revert();
    }
    void setup();
    return () => { disposed = true; cleanup?.(); };
  }, []);

  return (
    <section id="home" ref={root} className="hero-night scenic-parallax" aria-labelledby="hero-title">
      <div className="scenic-scene">
      <p className="scenic-signature">Kacper Bernecki</p>
      <h1 id="hero-title" className="scenic-title">{title.split(" ").map(word => <span key={word}>{word} </span>)}</h1>
      <div className="scenic-backdrop" data-parallax-layer="1" aria-hidden="true">
        <Image src="/images/hero-alpine-landscape.jpg" alt="" fill priority sizes="100vw" />
      </div>
      <div className="scenic-portrait-stage">
        <Image src="/images/profile-1-cutout.png" alt={portraitAlt} width={1122} height={1402}
          priority sizes="(min-width: 768px) 620px, 94vw" className="scenic-portrait" />
      </div>
      <div className="scenic-terrain" data-parallax-layer="2" aria-hidden="true" />
      <div className="scenic-fade" aria-hidden="true" />
      </div>
    </section>
  );
}
