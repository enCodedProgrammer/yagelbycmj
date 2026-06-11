"use client";

import { useRef, useState, useEffect } from "react";
import { YagelAd, TOTAL_FRAMES } from "@/remotion/Ad";

const FPS = 30;

export default function AdSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef(0);
  const [frame, setFrame] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Auto-play loop; pauses while the section is off-screen
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let rafId = 0;
    let playing = false;
    let startTime = 0;

    const tick = (now: number) => {
      if (!playing) return;
      const elapsed = (now - startTime) / 1000;
      const f = Math.floor(elapsed * FPS) % TOTAL_FRAMES;
      frameRef.current = f;
      setFrame(f);
      rafId = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !playing) {
          playing = true;
          // Resume from the frame we paused at
          startTime = performance.now() - (frameRef.current / FPS) * 1000;
          rafId = requestAnimationFrame(tick);
        } else if (!entry.isIntersecting && playing) {
          playing = false;
          cancelAnimationFrame(rafId);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden" }}>
      <YagelAd frame={frame} isMobile={isMobile} />
    </div>
  );
}
