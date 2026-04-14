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
      className="relative py-32 md:py-48 overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--gold)_0%,_transparent_50%)] opacity-[0.06]" />

      {/* Decorative lines */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.5 }}
        className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent"
      />
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.5 }}
        className="absolute bottom-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent"
      />

      <div className="relative max-w-3xl mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground tracking-wide leading-tight"
        >
          Make Your
          <br />
          <span className="text-gold italic">Presence</span> Unforgettable
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-foreground/50 mt-6 mb-10 text-base sm:text-lg max-w-xl mx-auto"
        >
          Free shipping on every order. Delivered to your door in the UK, US,
          and Nigeria.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <Link
            href="/#collection"
            className="inline-block px-12 py-4 bg-gold text-primary-foreground text-sm tracking-[0.2em] uppercase hover:shadow-[0_0_40px_rgba(196,168,120,0.4)] transition-all duration-500"
          >
            Shop Now
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
