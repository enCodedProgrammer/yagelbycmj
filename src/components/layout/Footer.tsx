"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function Footer() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <footer ref={ref} className="relative bg-[#060504] border-t border-gold/5">
      {/* Top decorative line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-gold/10 to-transparent"
      />

      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="md:col-span-2"
          >
            <h2 className="font-heading text-3xl tracking-[0.3em] uppercase text-gold mb-6">
              Yagel
            </h2>
            <p className="text-foreground/30 text-sm leading-[2] max-w-sm font-light">
              A signature of elegance and presence. Premium fragrances crafted
              for those who leave a lasting impression — designed for him and
              her.
            </p>
          </motion.div>

          {/* Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-[10px] tracking-[0.3em] uppercase text-gold/40 mb-6">
              Navigate
            </h3>
            <ul className="space-y-4">
              {[
                { label: "Collection", href: "/#collection" },
                { label: "Our Story", href: "/#about" },
                { label: "Shipping", href: "/shipping" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-foreground/30 hover:text-gold transition-colors duration-500 font-light"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h3 className="text-[10px] tracking-[0.3em] uppercase text-gold/40 mb-6">
              Contact
            </h3>
            <p className="text-sm text-foreground/30 font-light">
              For inquiries and support
            </p>
            <p className="text-sm text-gold/70 mt-3 hover:text-gold transition-colors duration-300">
              hello@yagel.co.uk
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 pt-8 border-t border-gold/5 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <p className="text-[10px] text-foreground/20 tracking-wider">
            &copy; {new Date().getFullYear()} Yagel. All rights reserved.
          </p>
          <p className="text-[10px] text-gold/15 tracking-[0.4em] uppercase">
            Elegance &middot; Warmth &middot; Presence
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
