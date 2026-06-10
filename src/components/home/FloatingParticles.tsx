"use client";

import { useEffect, useRef } from "react";

function seeded(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

const PARTICLE_DATA = Array.from({ length: 55 }, (_, i) => ({
  id: i,
  x: seeded(i * 7) * 100,
  y: seeded(i * 13) * 100,
  size: 1 + seeded(i * 3) * 2.5,
  speed: 0.04 + seeded(i * 5) * 0.08,
  drift: (seeded(i * 11) - 0.5) * 0.025,
  delay: seeded(i * 17) * 60,
  opacity: 0.15 + seeded(i * 19) * 0.5,
}));

export default function FloatingParticles({ color = "#c4a878" }: { color?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const els = PARTICLE_DATA.map((p) => {
      const el = document.createElement("div");
      el.style.cssText = [
        "position:absolute",
        "border-radius:50%",
        `background:${color}`,
        `width:${p.size}px`,
        `height:${p.size}px`,
        `box-shadow:0 0 ${p.size * 2}px ${color}`,
        "will-change:transform,opacity",
      ].join(";");
      container.appendChild(el);
      return el;
    });

    let frame = 0;
    let rafId: number;

    const tick = () => {
      PARTICLE_DATA.forEach((p, i) => {
        const t = Math.max(0, frame - p.delay) * p.speed;
        const x = ((p.x + p.drift * frame * 100) % 100 + 100) % 100;
        const y = ((p.y - t * 10) % 100 + 100) % 100;
        const pulse = 0.5 + 0.5 * Math.sin(frame * 0.05 + p.id);
        els[i].style.left = `${x}%`;
        els[i].style.top = `${y}%`;
        els[i].style.opacity = String(p.opacity * pulse);
      });
      frame++;
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      els.forEach((el) => el.remove());
    };
  }, [color]);

  return (
    <div
      ref={containerRef}
      style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}
    />
  );
}
