"use client";

import { useRef, useState, useEffect } from "react";
import { useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { YagelAd, TOTAL_FRAMES } from "@/remotion/Ad";

export default function AdSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [frame, setFrame] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const frameMotion = useTransform(scrollYProgress, [0, 1], [0, TOTAL_FRAMES]);

  useMotionValueEvent(frameMotion, "change", (v) => {
    setFrame(Math.round(v));
  });

  return (
    <div ref={containerRef} style={{ height: "900vh", position: "relative" }}>
      <div style={{ position: "sticky", top: 0, width: "100%", height: "100vh", overflow: "hidden" }}>
        <YagelAd frame={frame} isMobile={isMobile} />
      </div>
    </div>
  );
}
