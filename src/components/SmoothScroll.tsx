"use client";

import { useEffect } from "react";

export default function SmoothScroll() {
  useEffect(() => {
    let cleanup: (() => void) | null = null;

    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      const { default: Lenis } = await import("lenis");

      gsap.registerPlugin(ScrollTrigger);

      const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
      lenis.on("scroll", ScrollTrigger.update);
      const tickerId = gsap.ticker.add((t: number) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);

      cleanup = () => {
        lenis.destroy();
        gsap.ticker.remove(tickerId);
        ScrollTrigger.getAll().forEach((t) => t.kill());
      };
    })();

    return () => { cleanup?.(); };
  }, []);

  return null;
}
