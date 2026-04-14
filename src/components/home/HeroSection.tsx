"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import MagneticButton from "@/components/ui/magnetic-button";

export default function HeroSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  // Mouse parallax for product images
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mouseX.set((clientX - innerWidth / 2) / 25);
    mouseY.set((clientY - innerHeight / 2) / 25);
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative h-[110vh] flex items-center justify-center overflow-hidden"
    >
      {/* Animated gradient background */}
      <motion.div style={{ y: bgY }} className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0806] via-background to-background" />
        {/* Animated radial glows */}
        <motion.div
          animate={{
            opacity: [0.03, 0.08, 0.03],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(ellipse,_var(--gold)_0%,_transparent_70%)] opacity-[0.05]"
        />
        <motion.div
          animate={{
            opacity: [0.02, 0.06, 0.02],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[radial-gradient(ellipse,_var(--gold)_0%,_transparent_70%)] opacity-[0.03]"
        />
      </motion.div>

      {/* Animated grain texture overlay */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')]" />

      {/* Floating vertical gold lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-px"
            style={{
              left: `${8 + i * 12}%`,
              background:
                "linear-gradient(to bottom, transparent, rgba(196,168,120,0.15), transparent)",
              height: "30vh",
            }}
            initial={{ y: "-30vh", opacity: 0 }}
            animate={{
              y: ["130vh"],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 6 + i * 0.8,
              repeat: Infinity,
              delay: i * 1.5,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Product images with mouse parallax + float */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Left bottle — For Her */}
        <motion.div
          style={{ x: springX, y: springY }}
          className="absolute left-[5%] md:left-[10%] top-[18%] md:top-[12%]"
        >
          <motion.div
            initial={{ opacity: 0, x: -100, rotate: -15 }}
            animate={{ opacity: 1, x: 0, rotate: -8 }}
            transition={{ duration: 1.8, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              animate={{
                y: [0, -15, 0],
                rotate: [-8, -5, -8],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            >
              <Image
                src="/images/yagel-for-her.png"
                alt="Yagel For Her"
                width={300}
                height={300}
                className="w-28 sm:w-40 md:w-56 lg:w-64 h-auto opacity-30 md:opacity-40 drop-shadow-[0_0_60px_rgba(196,168,120,0.2)]"
              />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Right bottle — For Him */}
        <motion.div
          style={{
            x: useTransform(springX, (v) => v * -1),
            y: useTransform(springY, (v) => v * -1),
          }}
          className="absolute right-[5%] md:right-[10%] bottom-[12%] md:bottom-[8%]"
        >
          <motion.div
            initial={{ opacity: 0, x: 100, rotate: 15 }}
            animate={{ opacity: 1, x: 0, rotate: 8 }}
            transition={{ duration: 1.8, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              animate={{
                y: [0, 15, 0],
                rotate: [8, 5, 8],
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
                alt="Yagel For Him"
                width={300}
                height={300}
                className="w-28 sm:w-40 md:w-56 lg:w-64 h-auto opacity-30 md:opacity-40 drop-shadow-[0_0_60px_rgba(196,168,120,0.2)]"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Main content */}
      <motion.div
        style={{ y: textY, opacity, scale }}
        className="relative z-10 text-center px-6 max-w-5xl mx-auto"
      >
        {/* Overline with line animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="flex items-center justify-center gap-4 mb-10"
        >
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="origin-right h-px w-12 bg-gold/40"
          />
          <span className="text-[10px] sm:text-xs tracking-[0.5em] uppercase text-gold/50 font-light">
            Premium Extrait de Parfum
          </span>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="origin-left h-px w-12 bg-gold/40"
          />
        </motion.div>

        {/* Brand name — character by character reveal */}
        <div className="overflow-hidden mb-6">
          <h1 className="font-heading text-7xl sm:text-8xl md:text-9xl lg:text-[11rem] tracking-[0.15em] uppercase leading-none">
            {"YAGEL".split("").map((char, i) => (
              <motion.span
                key={i}
                initial={{ y: "120%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 1.2,
                  delay: 0.5 + i * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="inline-block text-foreground"
                style={{
                  textShadow: "0 0 80px rgba(196,168,120,0.15)",
                }}
              >
                {char}
              </motion.span>
            ))}
          </h1>
        </div>

        {/* Decorative animated line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="w-32 h-px mx-auto mb-8 bg-gradient-to-r from-transparent via-gold to-transparent"
        />

        {/* Tagline with word reveal */}
        <div className="overflow-hidden mb-16">
          {"A signature of elegance and presence".split(" ").map((word, i) => (
            <motion.span
              key={i}
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.8,
                delay: 1.4 + i * 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="inline-block font-heading text-xl sm:text-2xl md:text-3xl text-gold/70 italic tracking-wide mr-[0.3em]"
            >
              {word}
            </motion.span>
          ))}
        </div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <MagneticButton as="a" href="#collection" strength={0.2}>
            <span className="relative px-12 py-5 bg-gold text-primary-foreground text-xs tracking-[0.25em] uppercase font-medium">
              <span className="relative z-10">Explore Collection</span>
              <motion.span
                className="absolute inset-0 bg-gold-light"
                initial={{ x: "-101%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              />
            </span>
          </MagneticButton>

          <MagneticButton as="a" href="#collection" strength={0.2}>
            <span className="relative px-12 py-5 border border-gold/30 text-gold text-xs tracking-[0.25em] uppercase font-medium group">
              <span className="relative z-10 transition-colors duration-500 group-hover:text-primary-foreground">
                Buy Now
              </span>
              <motion.span
                className="absolute inset-0 bg-gold"
                initial={{ y: "101%" }}
                whileHover={{ y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              />
            </span>
          </MagneticButton>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.8 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span className="text-[9px] tracking-[0.4em] uppercase text-gold/30">
          Scroll
        </span>
        <motion.div
          className="w-5 h-8 border border-gold/20 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [2, 12, 2] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-1 bg-gold/50 rounded-full mt-1"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
