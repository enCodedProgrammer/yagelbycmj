"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView } from "framer-motion";

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

    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
        onComplete?.();
      }
    }, speed);

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

export default function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [phase, setPhase] = useState(0);

  // Phase progression: 0=waiting, 1=label, 2=heading, 3=paragraph1, 4=paragraph2, 5=closing1, 6=closing2, 7=done
  const advancePhase = useCallback(() => {
    setPhase((p) => p + 1);
  }, []);

  useEffect(() => {
    if (isInView && phase === 0) {
      setPhase(1);
    }
  }, [isInView, phase]);

  return (
    <section
      id="about"
      ref={ref}
      className="relative py-32 md:py-40 overflow-hidden"
    >
      {/* Background texture */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--gold)_0%,_transparent_50%)] opacity-[0.03]" />

      <div className="max-w-4xl mx-auto px-6 text-center">
        {/* Section label */}
        <div className="mb-8 min-h-[1.5em]">
          {phase >= 1 && (
            <span className="inline-block text-xs tracking-[0.4em] uppercase text-gold/60">
              <TypewriterText
                text="Our Story"
                started={phase >= 1}
                speed={60}
                onComplete={advancePhase}
              />
            </span>
          )}
        </div>

        {/* Heading */}
        <div className="mb-8 min-h-[3em]">
          {phase >= 2 && (
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl tracking-wide text-foreground">
              <TypewriterText
                text="Capturing Identity Through Scent"
                started={phase >= 2}
                speed={40}
                onComplete={advancePhase}
                className="text-foreground"
              />
            </h2>
          )}
        </div>

        {/* Decorative line */}
        {phase >= 3 && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8 }}
            className="w-16 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent mx-auto mb-12"
          />
        )}

        {/* Body text */}
        <div className="space-y-6 text-foreground/60 leading-relaxed">
          {/* Paragraph 1 */}
          <div className="min-h-[4em]">
            {phase >= 3 && (
              <p className="text-base sm:text-lg">
                <TypewriterText
                  text="Yagel was created with one purpose — to capture identity through scent. We believe fragrance is more than something you wear. It is presence. It is memory. It is how you are remembered long after you've gone."
                  started={phase >= 3}
                  speed={20}
                  onComplete={advancePhase}
                />
              </p>
            )}
          </div>

          {/* Paragraph 2 */}
          <div className="min-h-[4em]">
            {phase >= 4 && (
              <p className="text-base sm:text-lg">
                <TypewriterText
                  text="Each Yagel fragrance is carefully crafted to balance elegance, warmth, and depth, creating scents that feel personal, confident, and unforgettable. Designed for both him and her, our fragrances are made to complement individuality, not define it."
                  started={phase >= 4}
                  speed={20}
                  onComplete={advancePhase}
                />
              </p>
            )}
          </div>

          {/* Closing statements */}
          <div className="pt-8">
            <div className="min-h-[2em]">
              {phase >= 5 && (
                <p className="font-heading text-xl sm:text-2xl text-gold/80 italic">
                  <TypewriterText
                    text="Yagel is not just perfume."
                    started={phase >= 5}
                    speed={40}
                    onComplete={advancePhase}
                  />
                </p>
              )}
            </div>
            <div className="min-h-[2em] mt-2">
              {phase >= 6 && (
                <p className="font-heading text-xl sm:text-2xl text-gold italic">
                  <TypewriterText
                    text="It is a signature of elegance and presence."
                    started={phase >= 6}
                    speed={40}
                    onComplete={advancePhase}
                  />
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
