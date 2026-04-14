"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background/90" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--gold)_0%,_transparent_70%)] opacity-[0.04]" />

      {/* Animated gold particles/lines */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-px bg-gradient-to-b from-transparent via-gold/20 to-transparent"
            style={{
              left: `${15 + i * 18}%`,
              height: "40%",
            }}
            initial={{ y: "-40%", opacity: 0 }}
            animate={{ y: "140%", opacity: [0, 1, 1, 0] }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              delay: i * 1.2,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Floating product images */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          className="absolute -left-10 md:left-[8%] top-[20%] md:top-[15%] w-32 md:w-56 opacity-20 md:opacity-30"
          animate={{
            y: [0, -20, 0],
            rotate: [-5, 0, -5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Image
            src="/images/yagel-for-her.png"
            alt=""
            width={224}
            height={224}
            className="w-full h-auto drop-shadow-[0_0_30px_rgba(196,168,120,0.3)]"
          />
        </motion.div>

        <motion.div
          className="absolute -right-10 md:right-[8%] bottom-[15%] md:bottom-[10%] w-32 md:w-56 opacity-20 md:opacity-30"
          animate={{
            y: [0, 20, 0],
            rotate: [5, 0, 5],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        >
          <Image
            src="/images/yagel-for-him.png"
            alt=""
            width={224}
            height={224}
            className="w-full h-auto drop-shadow-[0_0_30px_rgba(196,168,120,0.3)]"
          />
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Overline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mb-6"
        >
          <span className="text-xs tracking-[0.4em] uppercase text-gold/60">
            Premium Fragrance
          </span>
        </motion.div>

        {/* Brand Name */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4 }}
          className="font-heading text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-[0.2em] uppercase text-foreground mb-6"
        >
          Yagel
        </motion.h1>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="w-24 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-8"
        />

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="font-heading text-lg sm:text-xl md:text-2xl text-gold/80 italic tracking-wide mb-12"
        >
          A signature of elegance and presence
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/#collection"
            className="group relative px-10 py-4 bg-gold text-primary-foreground text-sm tracking-[0.2em] uppercase overflow-hidden transition-all duration-500 hover:shadow-[0_0_30px_rgba(196,168,120,0.3)]"
          >
            <span className="relative z-10">Explore Collection</span>
            <div className="absolute inset-0 bg-gold-light translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          </Link>
          <Link
            href="/#collection"
            className="px-10 py-4 border border-gold/30 text-gold text-sm tracking-[0.2em] uppercase hover:bg-gold/10 transition-all duration-500"
          >
            Buy Now
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-px h-12 bg-gradient-to-b from-gold/40 to-transparent"
        />
      </motion.div>
    </section>
  );
}
