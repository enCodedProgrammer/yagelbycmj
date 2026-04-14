"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import MagneticButton from "@/components/ui/magnetic-button";
import TextReveal from "@/components/ui/text-reveal";

export default function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const bgScale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 0.08]);

  return (
    <section ref={ref} className="relative py-40 md:py-56 overflow-hidden">
      {/* Animated background glow */}
      <motion.div
        style={{ scale: bgScale, opacity: bgOpacity }}
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--gold)_0%,_transparent_50%)]"
      />

      {/* Decorative top and bottom lines */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-0 left-[5%] right-[5%] h-px bg-gradient-to-r from-transparent via-gold/15 to-transparent"
      />
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-0 left-[5%] right-[5%] h-px bg-gradient-to-r from-transparent via-gold/15 to-transparent"
      />

      {/* Corner decorations */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 0.5 }}
        className="hidden lg:block"
      >
        <div className="absolute top-12 left-[5%] w-16 h-16 border-t border-l border-gold/10" />
        <div className="absolute top-12 right-[5%] w-16 h-16 border-t border-r border-gold/10" />
        <div className="absolute bottom-12 left-[5%] w-16 h-16 border-b border-l border-gold/10" />
        <div className="absolute bottom-12 right-[5%] w-16 h-16 border-b border-r border-gold/10" />
      </motion.div>

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <TextReveal
          as="h2"
          className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-foreground tracking-wide leading-[1.1]"
          delay={0}
        >
          Make Your
        </TextReveal>
        <TextReveal
          as="h2"
          className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-gold italic tracking-wide leading-[1.1]"
          delay={0.3}
        >
          Presence Unforgettable
        </TextReveal>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-foreground/40 mt-10 mb-14 text-base sm:text-lg max-w-xl mx-auto font-light leading-relaxed"
        >
          Free shipping on every order. Delivered with care to your door in the
          United Kingdom, United States, and Nigeria.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.8,
            delay: 1,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <MagneticButton as="a" href="#collection" strength={0.2}>
            <span className="relative inline-flex px-16 py-5 bg-gold text-primary-foreground text-xs tracking-[0.3em] uppercase font-medium overflow-hidden">
              <span className="relative z-10">Shop Now</span>
              <motion.span
                className="absolute inset-0 bg-gold-light"
                initial={{ x: "-101%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              />
            </span>
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}
