"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import VaporizeTextCycle, {
  Tag,
} from "@/components/vapour-text-effect";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Mobile hero video — visible only on small screens */}
      <video
        className="absolute inset-0 w-full h-full object-cover md:hidden"
        src="/hero-video-mobile.mp4"
        autoPlay
        muted
        loop
        playsInline
      />

      {/* Desktop hero video — visible on md and up */}
      <video
        className="absolute inset-0 w-full h-full object-cover hidden md:block"
        src="/hero-video-desktop.mp4"
        autoPlay
        muted
        loop
        playsInline
      />

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content — above the fluid layer */}
      <div className="relative z-20 text-center px-6 w-full max-w-5xl mx-auto">
        {/* Overline — animated letter spacing pulse */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mb-6 flex items-center justify-center gap-4"
        >
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="hidden sm:block h-px w-10 bg-gradient-to-r from-transparent to-gold/40 origin-left"
          />
          <motion.span
            animate={{ letterSpacing: ["0.4em", "0.55em", "0.4em"] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="text-xs uppercase text-gold/60"
          >
            Premium Fragrance
          </motion.span>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="hidden sm:block h-px w-10 bg-gradient-to-l from-transparent to-gold/40 origin-right"
          />
        </motion.div>

        {/* Brand Name — word-by-word staggered reveal with gentle float */}
        <div className="mb-6 overflow-hidden">
          {"YAGEL".split("").map((letter, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.4 + i * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="inline-block font-heading text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-[0.2em] uppercase text-foreground"
            >
              <motion.span
                className="inline-block"
                animate={{ y: [0, -4, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.4,
                }}
              >
                {letter}
              </motion.span>
            </motion.span>
          ))}
        </div>

        {/* Decorative line — draws in from center */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="w-24 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-8"
        />

        {/* Tagline — Vapour Text Effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="h-[30px] sm:h-[35px] md:h-[45px] mb-12 w-full"
        >
          <VaporizeTextCycle
            texts={[
              "A signature of elegance and presence",
              "Crafted for him and her",
              "Unforgettable by design",
            ]}
            font={{
              fontFamily: "Playfair Display, serif",
              fontSize: "28px",
              fontWeight: 400,
            }}
            color="rgb(210, 190, 150)"
            spread={3}
            density={7}
            animation={{
              vaporizeDuration: 2.5,
              fadeInDuration: 1.2,
              waitDuration: 2.5,
            }}
            direction="left-to-right"
            alignment="center"
            tag={Tag.P}
          />
        </motion.div>

        {/* CTA Buttons — staggered entrance + hover scale/shift */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Link
                href="/#collection"
                className="group relative inline-block px-10 py-4 bg-gold text-primary-foreground text-sm tracking-[0.2em] uppercase overflow-hidden transition-shadow duration-500 hover:shadow-[0_8px_40px_rgba(196,168,120,0.35)]"
              >
                <span className="relative z-10">Explore Collection</span>
                <div className="absolute inset-0 bg-gold-light translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.0, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Link
                href="/#collection"
                className="group relative inline-block px-10 py-4 border border-gold/30 text-gold text-sm tracking-[0.2em] uppercase overflow-hidden transition-shadow duration-500 hover:shadow-[0_8px_40px_rgba(196,168,120,0.15)]"
              >
                <span className="relative z-10 transition-colors duration-500 group-hover:text-primary-foreground">
                  Buy Now
                </span>
                <div className="absolute inset-0 bg-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20 pointer-events-none"
      >
        <motion.span
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-[9px] tracking-[0.3em] uppercase text-gold/30"
        >
          Scroll
        </motion.span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-px h-12 bg-gradient-to-b from-gold/40 to-transparent"
        />
      </motion.div>
    </section>
  );
}
