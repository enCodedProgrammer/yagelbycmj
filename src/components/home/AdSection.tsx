"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { YagelAd, TOTAL_FRAMES } from "@/remotion/Ad";

const FPS = 30;
const COMP_W = 1920;
const COMP_H = 1080;

export default function AdSection() {
  const containerRef  = useRef<HTMLDivElement>(null);
  const frameRef      = useRef(0);
  const img1Ref       = useRef<HTMLDivElement>(null);
  const img2Ref       = useRef<HTMLDivElement>(null);
  const floatRafRef   = useRef(0);

  const [frame,       setFrame]       = useState(0);
  const [isMobile,    setIsMobile]    = useState(false);
  const [visible,     setVisible]     = useState(false);
  const [mobileScale, setMobileScale] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Compute scale to fit 1920×1080 composition into mobile screen width
  useEffect(() => {
    if (!isMobile) return;
    const update = () => setMobileScale(window.innerWidth / COMP_W);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [isMobile]);

  // Bottle floating animation — direct DOM transforms, no re-renders
  useEffect(() => {
    const animate = (time: number) => {
      const t = time * 0.001;
      const x1 = Math.sin(t * 0.28) * 18 + Math.sin(t * 0.17) * 10;
      const y1 = Math.cos(t * 0.22) * 14 + Math.cos(t * 0.31) * 8;
      const r1 = Math.sin(t * 0.19) * 3;
      const x2 = Math.sin(t * 0.31 + 1.4) * 16 + Math.sin(t * 0.21 + 0.7) * 10;
      const y2 = Math.cos(t * 0.25 + 2.1) * 18 + Math.cos(t * 0.14 + 1.1) * 7;
      const r2 = Math.sin(t * 0.23 + 1.0) * -3;
      if (img1Ref.current)
        img1Ref.current.style.transform = `translate(${x1}px, ${y1}px) rotate(${r1}deg)`;
      if (img2Ref.current)
        img2Ref.current.style.transform = `translate(${x2}px, ${y2}px) rotate(${r2}deg)`;
      floatRafRef.current = requestAnimationFrame(animate);
    };
    floatRafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(floatRafRef.current);
  }, []);

  // Remotion playback — resets to frame 0 each time section enters view
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let rafId = 0;
    let playing = false;
    let startTime = 0;
    const tick = (now: number) => {
      if (!playing) return;
      const f = Math.floor(((now - startTime) / 1000) * FPS) % TOTAL_FRAMES;
      frameRef.current = f;
      setFrame(f);
      rafId = requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !playing) {
          setVisible(true);
          playing = true;
          frameRef.current = 0;
          startTime = performance.now();
          rafId = requestAnimationFrame(tick);
        } else if (!entry.isIntersecting && playing) {
          playing = false;
          setVisible(false);
          cancelAnimationFrame(rafId);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => { observer.disconnect(); cancelAnimationFrame(rafId); };
  }, []);

  const scaledH = Math.round(COMP_H * mobileScale);

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", width: "100%", overflow: "hidden", background: "#000" }}
    >
      {isMobile ? (
        /* ── Mobile: render at 1920×1080 then scale to fit screen width ── */
        <div style={{
          width: "100%",
          height: mobileScale > 0 ? scaledH : "56.25vw",
          position: "relative",
          overflow: "hidden",
          background: "#000",
        }}>
          {mobileScale > 0 && (
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: COMP_W,
              height: COMP_H,
              transformOrigin: "top left",
              transform: `scale(${mobileScale})`,
            }}>
              <YagelAd frame={frame} isMobile={false} />
            </div>
          )}
        </div>
      ) : (
        /* ── Desktop: floating bottles left + video 45vw right ── */
        <div style={{ display: "flex", alignItems: "stretch", height: "100vh" }}>

          {/* Left panel — 2 bottle images with continuous organic float */}
          <div style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 32,
            padding: "60px 48px",
          }}>
            <div
              ref={img1Ref}
              style={{
                flex: 1,
                position: "relative",
                aspectRatio: "2 / 3",
                maxWidth: 220,
                willChange: "transform",
                opacity: visible ? 1 : 0,
                transition: "opacity 1s ease",
              }}
            >
              <Image
                src="/images/yagel-f.jpeg"
                alt="Yagel For Her"
                fill
                sizes="(min-width: 768px) 220px"
                style={{ objectFit: "cover" }}
              />
            </div>

            <div
              ref={img2Ref}
              style={{
                flex: 1,
                position: "relative",
                aspectRatio: "2 / 3",
                maxWidth: 220,
                willChange: "transform",
                opacity: visible ? 1 : 0,
                transition: "opacity 1s ease",
                transitionDelay: "0.2s",
              }}
            >
              <Image
                src="/images/yagel-m.jpeg"
                alt="Yagel For Him"
                fill
                sizes="(min-width: 768px) 220px"
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>

          {/* Right panel — Remotion at 45vw with right margin */}
          <div style={{ width: "45vw", flexShrink: 0, position: "relative", marginRight: 48 }}>
            <YagelAd frame={frame} isMobile={false} />
          </div>

        </div>
      )}
    </div>
  );
}
