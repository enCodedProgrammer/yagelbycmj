"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

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
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="inline-block text-xs tracking-[0.4em] uppercase text-gold/60 mb-8"
        >
          Our Story
        </motion.span>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-heading text-3xl sm:text-4xl md:text-5xl tracking-wide text-foreground mb-8"
        >
          Capturing Identity
          <br />
          <span className="text-gold italic">Through Scent</span>
        </motion.h2>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-16 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent mx-auto mb-12"
        />

        {/* Body text */}
        <div className="space-y-6 text-foreground/60 leading-relaxed">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-base sm:text-lg"
          >
            Yagel was created with one purpose — to capture identity through
            scent. We believe fragrance is more than something you wear. It is
            presence. It is memory. It is how you are remembered long after
            you&apos;ve gone.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-base sm:text-lg"
          >
            Each Yagel fragrance is carefully crafted to balance elegance,
            warmth, and depth, creating scents that feel personal, confident,
            and unforgettable. Designed for both him and her, our fragrances are
            made to complement individuality, not define it.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="pt-8"
          >
            <p className="font-heading text-xl sm:text-2xl text-gold/80 italic">
              Yagel is not just perfume.
            </p>
            <p className="font-heading text-xl sm:text-2xl text-gold italic mt-2">
              It is a signature of elegance and presence.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
