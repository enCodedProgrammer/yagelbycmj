"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion";
import Image from "next/image";

// ─── 12 visually varied picks from the story folder ──────────────────────────
const STORY_IMAGES = [
  "/story/_DSC3825.jpeg",
  "/story/_DSC3836.jpeg",
  "/story/_DSC3851.jpeg",
  "/story/_DSC3860.jpeg",
  "/story/_DSC3872.jpeg",
  "/story/_DSC3882.jpeg",
  "/story/_DSC3899.jpeg",
  "/story/_DSC3910.jpeg",
  "/story/_DSC3931.jpeg",
  "/story/_DSC3951.jpeg",
  "/story/_DSC3963.jpeg",
  "/story/_DSC4010.jpeg",
];

const N = STORY_IMAGES.length; // 12

// Desktop dimensions
const RADIUS = 190;
const CARD_W = 155;
const CARD_H = 210;

// Mobile dimensions
const RADIUS_MOBILE = 75;
const CARD_W_MOBILE = 65;
const CARD_H_MOBILE = 88;

interface CardConfig {
  src: string;
  targetX: number;
  targetY: number;
  targetXMobile: number;
  targetYMobile: number;
  targetRotate: number;
  spreadEnd: number;
}

// Full 360° ring — evenly spaced, each card at a different speed
const CARD_CONFIGS: CardConfig[] = STORY_IMAGES.map((src, i) => {
  const angle = (i / N) * 2 * Math.PI;
  const speedMult = 0.52 + (i % 6) * 0.08;
  return {
    src,
    targetX: RADIUS * Math.cos(angle),
    targetY: RADIUS * Math.sin(angle),
    targetXMobile: RADIUS_MOBILE * Math.cos(angle),
    targetYMobile: RADIUS_MOBILE * Math.sin(angle),
    targetRotate: (angle * 180) / Math.PI,
    spreadEnd: 0.44 * speedMult,
  };
});

// ─── Single card component (own hooks = no hooks-in-loops violation) ──────────
function StoryCard({
  config,
  scrollYProgress,
  isMobile,
}: {
  config: CardConfig;
  scrollYProgress: MotionValue<number>;
  isMobile: boolean;
}) {
  const { src, targetX, targetY, targetXMobile, targetYMobile, targetRotate, spreadEnd } = config;

  const tx = isMobile ? targetXMobile : targetX;
  const ty = isMobile ? targetYMobile : targetY;
  const cw = isMobile ? CARD_W_MOBILE : CARD_W;
  const ch = isMobile ? CARD_H_MOBILE : CARD_H;

  const x = useTransform(scrollYProgress, [0, spreadEnd], [0, tx]);
  const y = useTransform(scrollYProgress, [0, spreadEnd], [0, ty]);
  const rotate = useTransform(scrollYProgress, [0, spreadEnd], [0, targetRotate]);
  const scale = useTransform(scrollYProgress, [0.44, 0.68], [1, 0.80]);

  return (
    <motion.div
      style={{ x, y, rotate, scale }}
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
    >
      <div
        className="relative overflow-hidden rounded-sm border border-white/10 shadow-[0_16px_48px_rgba(0,0,0,0.55)]"
        style={{ width: cw, height: ch }}
      >
        <Image src={src} alt="" fill className="object-cover" sizes="155px" />
      </div>
    </motion.div>
  );
}

// ─── Typewriter ───────────────────────────────────────────────────────────────
function TypewriterText({
  text,
  started,
  speed = 30,
  onComplete,
  className,
}: {
  text: string;
  started: boolean;
  speed?: number;
  onComplete?: () => void;
  className?: string;
}) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    setDisplayed("");
    setDone(false);
    // For sub-ms speeds, advance multiple chars per 1ms tick
    const tickMs = Math.max(1, speed);
    const charsPerTick = speed < 1 ? Math.round(1 / speed) : 1;
    const interval = setInterval(() => {
      i = Math.min(i + charsPerTick, text.length);
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
        onComplete?.();
      }
    }, tickMs);
    return () => clearInterval(interval);
  }, [started, text, speed, onComplete]);

  if (!started) return null;

  return (
    <span className={className}>
      {displayed}
      {!done && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.6, repeat: Infinity }}
          className="inline-block w-[2px] h-[1em] bg-gold/70 ml-[2px] align-text-bottom"
        />
      )}
    </span>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
export default function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // No horizontal shift — cards and text are already a centered flex row
  const groupX = useTransform(scrollYProgress, [0.44, 0.70], ["0%", "0%"]);

  // Act 3: text panel visibility — driven by phase state (not scroll progress)
  // to avoid motion value stale binding issues

  const phaseRef = useRef(0);
  const [phase, setPhaseState] = useState(0);
  const setPhase = useCallback((v: number) => {
    phaseRef.current = v;
    setPhaseState(v);
  }, []);
  const advancePhase = useCallback(() => setPhase(phaseRef.current + 1), [setPhase]);

useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (v >= 0.50 && phaseRef.current === 0) setPhase(1);
    if (v < 0.45 && phaseRef.current > 0) setPhase(0);
  });

  return (
    <section id="about" ref={containerRef} className="relative h-[480vh]">
      <div className="sticky top-0 h-screen overflow-hidden bg-background">

        {/* ── Static header — always visible above the circle ── */}
        <div className="absolute top-[100px] md:top-[160px] inset-x-0 flex flex-col items-center z-30 pointer-events-none">
          <span className="text-xs tracking-[0.4em] uppercase text-gold/60 mb-3">
            Our Story
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl tracking-wide text-foreground text-center">
            Capturing Identity Through Scent
          </h2>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent mt-4" />
        </div>

        {/* ── Shifting group: cards + text — row on desktop, column on mobile ── */}
        <motion.div
          style={{ x: groupX }}
          className="absolute inset-0 flex flex-col md:flex-row items-center justify-start md:justify-center pt-[160px] md:pt-[60px] gap-0"
        >
          {/* Card ring */}
          <div
            className="relative flex-shrink-0"
            style={isMobile
              ? { width: (RADIUS_MOBILE + CARD_W_MOBILE / 2) * 2, height: (RADIUS_MOBILE + CARD_H_MOBILE / 2) * 2 }
              : { width: (RADIUS + CARD_W / 2) * 2, height: (RADIUS + CARD_H / 2) * 2 }
            }
          >
            {CARD_CONFIGS.map((config, i) => (
              <StoryCard key={i} config={config} scrollYProgress={scrollYProgress} isMobile={isMobile} />
            ))}
          </div>

          {/* Typewriter text — below cards on mobile, right on desktop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 1 ? 1 : 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col justify-center z-20 px-6 md:px-0"
            style={isMobile ? { width: "100%", maxWidth: 320, marginTop: 16 } : { marginLeft: 60, width: 350, flexShrink: 0 }}
          >
            <div className="space-y-3 text-foreground/60 leading-relaxed">
              <div>
                {phase >= 1 && (
                  <p className="text-sm">
                    <TypewriterText
                      text="Yagel was created with one purpose — to capture identity through scent. We believe fragrance is more than something you wear. It is presence. It is memory. It is how you are remembered long after you've gone."
                      started={phase >= 1}
                      speed={0.2}
                      onComplete={advancePhase}
                    />
                  </p>
                )}
              </div>

              <div>
                {phase >= 2 && (
                  <p className="text-sm">
                    <TypewriterText
                      text="Each Yagel fragrance is carefully crafted to balance elegance, warmth, and depth — creating scents that feel personal, confident, and unforgettable."
                      started={phase >= 2}
                      speed={0.2}
                      onComplete={advancePhase}
                    />
                  </p>
                )}
              </div>

              <div className="pt-2">
                <div>
                  {phase >= 3 && (
                    <p className="font-heading text-base sm:text-xl text-gold/80 italic">
                      <TypewriterText
                        text="Yagel is not just perfume."
                        started={phase >= 3}
                        speed={0.4}
                        onComplete={advancePhase}
                      />
                    </p>
                  )}
                </div>
                <div className="mt-1">
                  {phase >= 4 && (
                    <p className="font-heading text-base sm:text-xl text-gold italic">
                      <TypewriterText
                        text="It is a signature of elegance and presence."
                        started={phase >= 4}
                        speed={0.4}
                        onComplete={advancePhase}
                      />
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
