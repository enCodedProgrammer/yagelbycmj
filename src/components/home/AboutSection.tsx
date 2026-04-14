"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import TextReveal from "@/components/ui/text-reveal";
import Parallax from "@/components/ui/parallax";

export default function AboutSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-150px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const lineWidth = useTransform(scrollYProgress, [0.1, 0.4], ["0%", "100%"]);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-40 md:py-56 overflow-hidden"
    >
      {/* Parallax background elements */}
      <Parallax speed={0.2} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(ellipse,_var(--gold)_0%,_transparent_70%)] opacity-[0.03]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[radial-gradient(ellipse,_var(--gold)_0%,_transparent_70%)] opacity-[0.02]" />
      </Parallax>

      {/* Decorative side lines */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={isInView ? { scaleY: 1 } : {}}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        className="absolute left-[8%] top-[20%] bottom-[20%] w-px bg-gradient-to-b from-transparent via-gold/10 to-transparent origin-top hidden lg:block"
      />
      <motion.div
        initial={{ scaleY: 0 }}
        animate={isInView ? { scaleY: 1 } : {}}
        transition={{ duration: 1.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="absolute right-[8%] top-[20%] bottom-[20%] w-px bg-gradient-to-b from-transparent via-gold/10 to-transparent origin-bottom hidden lg:block"
      />

      <div className="max-w-4xl mx-auto px-6 text-center relative">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <span className="text-[10px] tracking-[0.5em] uppercase text-gold/40 font-light">
            The Essence
          </span>
        </motion.div>

        {/* Main heading with word reveal */}
        <div className="mb-6">
          <TextReveal
            as="h2"
            className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-wide text-foreground leading-[1.1]"
            delay={0.2}
          >
            Capturing Identity
          </TextReveal>
        </div>
        <div className="mb-12">
          <TextReveal
            as="h2"
            className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-wide text-gold italic leading-[1.1]"
            delay={0.5}
          >
            Through Scent
          </TextReveal>
        </div>

        {/* Animated horizontal line */}
        <div className="flex justify-center mb-16">
          <motion.div
            style={{ width: lineWidth }}
            className="h-px max-w-[80px] bg-gradient-to-r from-transparent via-gold/50 to-transparent"
          />
        </div>

        {/* Body text with staggered paragraphs */}
        <div className="space-y-8 max-w-2xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 1,
              delay: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="text-base sm:text-lg text-foreground/50 leading-[1.9] font-light"
          >
            Yagel was created with one purpose — to capture identity through
            scent. We believe fragrance is more than something you wear.{" "}
            <span className="text-foreground/70">
              It is presence. It is memory. It is how you are remembered long
              after you&apos;ve gone.
            </span>
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 1,
              delay: 0.9,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="text-base sm:text-lg text-foreground/50 leading-[1.9] font-light"
          >
            Each Yagel fragrance is carefully crafted to balance{" "}
            <span className="text-gold/60">elegance</span>,{" "}
            <span className="text-gold/60">warmth</span>, and{" "}
            <span className="text-gold/60">depth</span> — creating scents that
            feel personal, confident, and unforgettable. Designed for both him
            and her, our fragrances are made to complement individuality, not
            define it.
          </motion.p>
        </div>

        {/* Signature quote */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={
            isInView ? { opacity: 1, y: 0, scale: 1 } : {}
          }
          transition={{
            duration: 1.2,
            delay: 1.2,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mt-20 pt-12 border-t border-gold/10 relative"
        >
          {/* Decorative quote mark */}
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isInView ? { opacity: 0.06, scale: 1 } : {}}
            transition={{ duration: 1, delay: 1.4 }}
            className="absolute -top-8 left-1/2 -translate-x-1/2 font-heading text-[120px] text-gold leading-none select-none"
          >
            &ldquo;
          </motion.span>

          <p className="font-heading text-2xl sm:text-3xl md:text-4xl text-foreground/70 italic leading-relaxed">
            Yagel is not just perfume.
          </p>
          <p className="font-heading text-2xl sm:text-3xl md:text-4xl text-gold italic leading-relaxed mt-3">
            It is a signature of elegance and presence.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
