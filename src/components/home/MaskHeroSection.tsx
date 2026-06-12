"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import VaporizeTextCycle, { Tag } from "@/components/vapour-text-effect";
import FloatingParticles from "@/components/home/FloatingParticles";

// ─── Stable Fluids (Jos Stam, simplified) ────────────────────────────────────

const FN   = 96;          // grid resolution
const FSZ  = (FN + 2) * (FN + 2);
const ITER = 4;
const DT   = 0.016;
const DIFF = 0.00004;
const VISC = 0.000004;
const FADE = 0.992;

function IX(x: number, y: number) { return x + y * (FN + 2); }

function setBnd(b: number, x: Float32Array) {
  for (let i = 1; i <= FN; i++) {
    x[IX(0,    i)] = b === 1 ? -x[IX(1,  i)] : x[IX(1,  i)];
    x[IX(FN+1, i)] = b === 1 ? -x[IX(FN, i)] : x[IX(FN, i)];
    x[IX(i,    0)] = b === 2 ? -x[IX(i,  1)] : x[IX(i,  1)];
    x[IX(i, FN+1)] = b === 2 ? -x[IX(i, FN)] : x[IX(i, FN)];
  }
  x[IX(0,    0   )] = 0.5 * (x[IX(1, 0)]    + x[IX(0,  1)]);
  x[IX(0,    FN+1)] = 0.5 * (x[IX(1, FN+1)] + x[IX(0,  FN)]);
  x[IX(FN+1, 0   )] = 0.5 * (x[IX(FN, 0)]   + x[IX(FN+1, 1)]);
  x[IX(FN+1, FN+1)] = 0.5 * (x[IX(FN, FN+1)]+ x[IX(FN+1, FN)]);
}

function linSolve(b: number, x: Float32Array, x0: Float32Array, a: number, c: number) {
  const cR = 1 / c;
  for (let k = 0; k < ITER; k++) {
    for (let j = 1; j <= FN; j++)
      for (let i = 1; i <= FN; i++)
        x[IX(i,j)] = (x0[IX(i,j)] + a * (x[IX(i+1,j)] + x[IX(i-1,j)] + x[IX(i,j+1)] + x[IX(i,j-1)])) * cR;
    setBnd(b, x);
  }
}

function diffuseFn(b: number, x: Float32Array, x0: Float32Array, diff: number, dt: number) {
  const a = dt * diff * FN * FN;
  linSolve(b, x, x0, a, 1 + 4 * a);
}

function project(vx: Float32Array, vy: Float32Array, p: Float32Array, div: Float32Array) {
  for (let j = 1; j <= FN; j++)
    for (let i = 1; i <= FN; i++) {
      div[IX(i,j)] = -0.5 * (vx[IX(i+1,j)] - vx[IX(i-1,j)] + vy[IX(i,j+1)] - vy[IX(i,j-1)]) / FN;
      p[IX(i,j)] = 0;
    }
  setBnd(0, div); setBnd(0, p);
  linSolve(0, p, div, 1, 4);
  for (let j = 1; j <= FN; j++)
    for (let i = 1; i <= FN; i++) {
      vx[IX(i,j)] -= 0.5 * (p[IX(i+1,j)] - p[IX(i-1,j)]) * FN;
      vy[IX(i,j)] -= 0.5 * (p[IX(i,j+1)] - p[IX(i,j-1)]) * FN;
    }
  setBnd(1, vx); setBnd(2, vy);
}

function advect(b: number, d: Float32Array, d0: Float32Array, vx: Float32Array, vy: Float32Array, dt: number) {
  const dtN = dt * FN;
  for (let j = 1; j <= FN; j++) {
    for (let i = 1; i <= FN; i++) {
      const x = Math.max(0.5, Math.min(FN + 0.5, i - dtN * vx[IX(i,j)]));
      const y = Math.max(0.5, Math.min(FN + 0.5, j - dtN * vy[IX(i,j)]));
      const i0 = Math.floor(x), i1 = i0 + 1;
      const j0 = Math.floor(y), j1 = j0 + 1;
      const s1 = x - i0, s0 = 1 - s1;
      const t1 = y - j0, t0 = 1 - t1;
      d[IX(i,j)] = s0*(t0*d0[IX(i0,j0)] + t1*d0[IX(i0,j1)]) + s1*(t0*d0[IX(i1,j0)] + t1*d0[IX(i1,j1)]);
    }
  }
  setBnd(b, d);
}

interface FluidState {
  vx: Float32Array; vy: Float32Array; vx0: Float32Array; vy0: Float32Array;
  r: Float32Array;  g: Float32Array;  bl: Float32Array;
  r0: Float32Array; g0: Float32Array; bl0: Float32Array;
}

function createFluid(): FluidState {
  return {
    vx: new Float32Array(FSZ), vy: new Float32Array(FSZ),
    vx0: new Float32Array(FSZ), vy0: new Float32Array(FSZ),
    r: new Float32Array(FSZ), g: new Float32Array(FSZ), bl: new Float32Array(FSZ),
    r0: new Float32Array(FSZ), g0: new Float32Array(FSZ), bl0: new Float32Array(FSZ),
  };
}

function stepFluid(f: FluidState) {
  diffuseFn(1, f.vx0, f.vx, VISC, DT);
  diffuseFn(2, f.vy0, f.vy, VISC, DT);
  project(f.vx0, f.vy0, f.vx, f.vy);
  advect(1, f.vx, f.vx0, f.vx0, f.vy0, DT);
  advect(2, f.vy, f.vy0, f.vx0, f.vy0, DT);
  project(f.vx, f.vy, f.vx0, f.vy0);

  diffuseFn(0, f.r0, f.r, DIFF, DT);
  diffuseFn(0, f.g0, f.g, DIFF, DT);
  diffuseFn(0, f.bl0, f.bl, DIFF, DT);
  advect(0, f.r, f.r0, f.vx, f.vy, DT);
  advect(0, f.g, f.g0, f.vx, f.vy, DT);
  advect(0, f.bl, f.bl0, f.vx, f.vy, DT);

  for (let i = 0; i < FSZ; i++) { f.r[i] *= FADE; f.g[i] *= FADE; f.bl[i] *= FADE; }
}

function splat(f: FluidState, nx: number, ny: number, dx: number, dy: number, cr: number, cg: number, cb: number) {
  const radius = 5;
  const ix = Math.round(nx * FN);
  const iy = Math.round(ny * FN);
  for (let dj = -radius; dj <= radius; dj++) {
    for (let di = -radius; di <= radius; di++) {
      const dist = Math.sqrt(di * di + dj * dj);
      if (dist > radius) continue;
      const w = Math.exp(-(dist * dist) / (radius * 0.4));
      const gi = Math.max(1, Math.min(FN, ix + di));
      const gj = Math.max(1, Math.min(FN, iy + dj));
      const idx = IX(gi, gj);
      f.vx[idx] += dx * w;
      f.vy[idx] += dy * w;
      f.r[idx]  += cr * w;
      f.g[idx]  += cg * w;
      f.bl[idx] += cb * w;
    }
  }
}

// Brand-appropriate color palettes (normalized 0-1)
const PALETTES: [number, number, number][] = [
  [0.77, 0.66, 0.47],  // brand gold #C4A878
  [0.80, 0.50, 0.16],  // deep amber
  [0.86, 0.74, 0.51],  // warm cream
  [0.55, 0.36, 0.76],  // dusky violet
  [0.16, 0.50, 0.62],  // deep teal
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function MaskHeroSection() {
  const sectionRef  = useRef<HTMLElement>(null);
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const subheadRef    = useRef<HTMLDivElement>(null);
  const overlineRef   = useRef<HTMLDivElement>(null);
  const headingRef    = useRef<HTMLDivElement>(null);
  const taglineRef    = useRef<HTMLDivElement>(null);
  const btnsRef       = useRef<HTMLDivElement>(null);
  const darkOverlayRef = useRef<HTMLDivElement>(null);
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobileView(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobileView(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;

    let rafId: number;
    let gsapCleanup: (() => void) | null = null;

    // Fluid sim state
    const fluid = createFluid();

    // Offscreen canvas for fluid render (FN×FN → GPU-upscaled to main canvas)
    const offscreen = document.createElement("canvas");
    offscreen.width  = FN;
    offscreen.height = FN;
    const offCtx  = offscreen.getContext("2d")!;
    const fluidImg = offCtx.createImageData(FN, FN);

    // Seed a few initial splats so the sim isn't empty at load
    const seedColors: [number, number, number][] = [
      [0.77, 0.66, 0.47],
      [0.55, 0.36, 0.76],
      [0.16, 0.50, 0.62],
    ];
    seedColors.forEach((c, i) => {
      const angle = (i / seedColors.length) * Math.PI * 2;
      splat(fluid, 0.3 + Math.random() * 0.4, 0.3 + Math.random() * 0.4,
        Math.cos(angle) * 120, Math.sin(angle) * 120, c[0], c[1], c[2]);
    });

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    let lastSplat = 0;
    const SPLAT_INTERVAL = 1600;

    const draw = (timestamp: number) => {
      const w = canvas.width;
      const h = canvas.height;

      // Periodic auto-splat to keep fluid alive
      if (timestamp - lastSplat > SPLAT_INTERVAL) {
        lastSplat = timestamp;
        const angle  = Math.random() * Math.PI * 2;
        const speed  = 90 + Math.random() * 90;
        const [cr, cg, cb] = PALETTES[Math.floor(Math.random() * PALETTES.length)];
        splat(fluid,
          0.15 + Math.random() * 0.7,
          0.15 + Math.random() * 0.7,
          Math.cos(angle) * speed,
          Math.sin(angle) * speed,
          cr, cg, cb,
        );
      }

      stepFluid(fluid);

      // Render fluid into offscreen FN×FN ImageData
      const px = fluidImg.data;
      for (let j = 1; j <= FN; j++) {
        for (let i = 1; i <= FN; i++) {
          const idx  = IX(i, j);
          const pidx = ((j - 1) * FN + (i - 1)) * 4;
          px[pidx]   = Math.min(255, fluid.r[idx]  * 220);
          px[pidx+1] = Math.min(255, fluid.g[idx]  * 220);
          px[pidx+2] = Math.min(255, fluid.bl[idx] * 220);
          px[pidx+3] = 255;
        }
      }
      offCtx.putImageData(fluidImg, 0, 0);

      // GPU-upscale fluid onto main canvas (smooth bilinear)
      ctx.globalCompositeOperation = "source-over";
      ctx.imageSmoothingEnabled    = true;
      ctx.imageSmoothingQuality    = "high";
      ctx.drawImage(offscreen, 0, 0, w, h);

      // Punch out YAGEL so the video shows through the letter shapes
      ctx.globalCompositeOperation = "destination-out";
      const fontSize = Math.round(w * 0.2);
      ctx.font          = `700 ${fontSize}px Oswald, Impact, sans-serif`;
      ctx.textAlign     = "center";
      ctx.textBaseline  = "middle";
      ctx.fillStyle     = "#000";
      ctx.fillText("YAGEL", w / 2, h / 2);
      ctx.globalCompositeOperation = "source-over";

      rafId = requestAnimationFrame(draw);
    };

    rafId = requestAnimationFrame(draw);

    (async () => {
      const { gsap }        = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");

      gsap.registerPlugin(ScrollTrigger);

      // 2-second scroll lock once the text/buttons have appeared
      let scrollLocked = false;
      let unlockTimer: ReturnType<typeof setTimeout> | null = null;

      const preventForwardScroll = (e: WheelEvent) => { if (e.deltaY > 0) e.preventDefault(); };
      const preventTouch = (e: TouchEvent) => e.preventDefault();

      const lockScroll = () => {
        if (scrollLocked) return;
        scrollLocked = true;
        window.addEventListener("wheel", preventForwardScroll, { passive: false });
        window.addEventListener("touchmove", preventTouch, { passive: false });
        unlockTimer = setTimeout(() => {
          window.removeEventListener("wheel", preventForwardScroll);
          window.removeEventListener("touchmove", preventTouch);
          scrollLocked = false;
        }, 2000);
      };

      // Mobile uses a shorter timeline so reveal happens with less scrolling
      const total      = isMobile ? 6   : 10;
      const fadeStart  = isMobile ? 5.0 : 8.5;
      const revealAt   = isMobile ? 5.5 : 9.2;
      const lockAt     = isMobile ? 0.88 : 0.92;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: isMobile ? 0.8 : 1.5,
          onUpdate: (self) => {
            if (self.progress >= lockAt) lockScroll();
          },
        },
      });

      tl.to(canvas, { scale: 80, duration: total, ease: "expo.in", transformOrigin: "center center" }, 0);
      tl.to(subheadRef.current, { opacity: 0, duration: 0.5, ease: "none" }, 0);
      tl.to(canvas, { opacity: 0, duration: 1, ease: "power2.in" }, fadeStart);

      tl.fromTo(darkOverlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 }, revealAt);
      tl.fromTo(overlineRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4 }, revealAt);
      tl.fromTo(headingRef.current,  { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5 }, revealAt + 0.15);
      tl.fromTo(taglineRef.current,  { opacity: 0 },        { opacity: 1,        duration: 0.35 }, revealAt + 0.3);
      tl.fromTo(btnsRef.current,     { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4 }, revealAt + 0.45);

      gsapCleanup = () => {
        ScrollTrigger.getAll().forEach((t) => t.kill());
        window.removeEventListener("wheel", preventForwardScroll);
        window.removeEventListener("touchmove", preventTouch);
        if (unlockTimer) clearTimeout(unlockTimer);
      };
    })();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      gsapCleanup?.();
    };
  }, []);

  return (
    <section ref={sectionRef} className="mask-hero-section" style={{ position: "relative" }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", background: "#000" }}>

        {/* Mobile video */}
        <video autoPlay loop muted playsInline className="md:hidden" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }} src="/hero-video-mobile.mp4" />
        {/* Desktop video */}
        <video autoPlay loop muted playsInline className="hidden md:block" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }} src="/hero-video-desktop.mp4" />

        {/* Radial gradient — darkens center for text legibility once canvas fades */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 1,
          background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.2) 55%, transparent 80%)",
        }} />

        {/* Canvas mask — fluid-dynamics dark overlay with YAGEL cutout; zooms away on scroll */}
        <canvas
          ref={canvasRef}
          style={{ position: "absolute", top: 0, left: 0, zIndex: 2, willChange: "transform, opacity" }}
        />

        {/* Dark overlay — fades in with text reveal to ensure legibility over the video */}
        <div ref={darkOverlayRef} style={{ position: "absolute", inset: 0, zIndex: 3, background: "rgba(0,0,0,0.52)", opacity: 0, pointerEvents: "none" }} />

        {/* Corner labels */}
        <div ref={subheadRef} style={{ position: "absolute", inset: 0, zIndex: 4, pointerEvents: "none" }}>
          <div style={{ position: "absolute", top: 32, left: 40, fontFamily: "var(--font-condensed), sans-serif", fontSize: 11, fontWeight: 400, letterSpacing: "0.35em", textTransform: "uppercase", color: "#F5F3ED", opacity: 0.55 }}>
          
          </div>
          <div style={{ position: "absolute", bottom: 32, right: 40, fontFamily: "var(--font-condensed), sans-serif", fontSize: 11, fontWeight: 400, letterSpacing: "0.35em", textTransform: "uppercase", color: "#F5F3ED", opacity: 0.55 }}>
            Extrait de Parfum
          </div>
        </div>

        {/* Hero reveal — appears at 96% scroll */}
        <div style={{ position: "absolute", inset: 0, zIndex: 6, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 24px", pointerEvents: "none" }}>

          <FloatingParticles color="#c4a878" />

          {/* Overline */}
          <div ref={overlineRef} style={{ opacity: 0, marginBottom: isMobileView ? 12 : 24, display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
            <div style={{ width: 40, height: 1, background: "linear-gradient(to right, transparent, rgba(196,168,120,0.4))" }} />
            <span style={{ fontFamily: "var(--font-condensed), sans-serif", fontSize: 12, letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(196,168,120,0.7)" }}>
              Premium Fragrance
            </span>
            <div style={{ width: 40, height: 1, background: "linear-gradient(to left, transparent, rgba(196,168,120,0.4))" }} />
          </div>

          {/* YAGEL */}
          <div ref={headingRef} style={{ opacity: 0, marginBottom: isMobileView ? 16 : 40 }}>
            <span style={{ fontFamily: "var(--font-heading), serif", fontSize: "clamp(72px, 12vw, 140px)", letterSpacing: "0.2em", textTransform: "uppercase", color: "#ffffff", lineHeight: 1, display: "block" }}>
              YAGEL
            </span>
          </div>

          {/* Tagline cycling text */}
          <div ref={taglineRef} style={{ opacity: 0, marginBottom: isMobileView ? 20 : 40, height: isMobileView ? 36 : 45, width: "100%", maxWidth: "100vw", overflow: "hidden" }}>
            <VaporizeTextCycle
              texts={[
                "A signature of elegance and presence",
                "Crafted for him and her",
                "Unforgettable by design",
              ]}
              font={{ fontFamily: "Playfair Display, serif", fontSize: isMobileView ? "17px" : "28px", fontWeight: 400 }}
              color="rgb(210, 190, 150)"
              spread={3}
              density={7}
              animation={{ vaporizeDuration: 2.5, fadeInDuration: 1.2, waitDuration: 2.5 }}
              direction="left-to-right"
              alignment="center"
              tag={Tag.P}
            />
          </div>

          {/* Buttons */}
          <div ref={btnsRef} style={{ opacity: 0, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: isMobileView ? 12 : 20, pointerEvents: "auto" }}>
            <Link
              href="/collection"
              style={{ display: "inline-block", padding: "16px 40px", background: "#C4A878", color: "#0d0d0d", fontFamily: "var(--font-condensed), sans-serif", fontSize: 13, fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none", transition: "box-shadow 0.2s ease-out, transform 0.15s ease-out" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 8px 40px rgba(196,168,120,0.4)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none"; (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1)"; }}
              onMouseDown={(e) => { (e.currentTarget as HTMLAnchorElement).style.transform = "scale(0.97)"; }}
              onMouseUp={(e) => { (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1)"; }}
            >
              Explore Collection
            </Link>
            <Link
              href="/collection"
              style={{ display: "inline-block", padding: "16px 40px", background: "transparent", color: "#C4A878", border: "1px solid rgba(196,168,120,0.35)", fontFamily: "var(--font-condensed), sans-serif", fontSize: 13, fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none", transition: "box-shadow 0.2s ease-out, transform 0.15s ease-out" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 8px 40px rgba(196,168,120,0.2)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none"; (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1)"; }}
              onMouseDown={(e) => { (e.currentTarget as HTMLAnchorElement).style.transform = "scale(0.97)"; }}
              onMouseUp={(e) => { (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1)"; }}
            >
              Buy Now
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}
