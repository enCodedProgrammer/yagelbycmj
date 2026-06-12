"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

export default function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="relative py-20 md:py-28 overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--gold)_0%,_transparent_50%)] opacity-[0.06]" />

      {/* Decorative lines */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
        className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent"
      />
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
        className="absolute bottom-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent"
      />

      <div className="relative max-w-3xl mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground tracking-wide leading-tight"
        >
          Make Your
          <br />
          <span className="text-gold italic">Presence</span> Unforgettable
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-foreground/50 mt-5 mb-8 text-base sm:text-lg max-w-xl mx-auto"
        >
          Free shipping to the UK and US. Delivered to your door
          nationwide in Nigeria.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, delay: 0.18 }}
        >
          <Link
            href="/collection"
            className="inline-block px-12 py-4 bg-gold text-primary-foreground text-sm tracking-[0.2em] uppercase hover:shadow-[0_0_40px_rgba(196,168,120,0.35)] active:scale-[0.97] transition-[box-shadow,transform] duration-200"
          >
            Shop Now
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
