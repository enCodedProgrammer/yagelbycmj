"use client";

import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { products, formatPrice, type Product } from "@/lib/data";
import { useCountry } from "@/lib/country-context";

export default function ProductsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView || !gridRef.current) return;
    const cards = gridRef.current.querySelectorAll<HTMLElement>(".product-card");
    gsap.set(cards, { y: 60, opacity: 0 });
    gsap.to(cards, {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: "power3.out",
      stagger: 0.2,
    });
  }, [isInView]);

  return (
    <section
      id="collection"
      ref={sectionRef}
      className="relative py-8 md:py-24 overflow-hidden"
    >
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="inline-block text-xs tracking-[0.4em] uppercase text-gold/60 mb-4"
          >
            The Collection
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-heading text-3xl sm:text-4xl md:text-5xl tracking-wide text-foreground"
          >
            Choose Your{" "}
            <span className="text-gold italic">Signature</span>
          </motion.h2>
        </div>

        {/* Products Grid */}
        <div ref={gridRef} className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: Product }) {
  const { country } = useCountry();
  const price = product.prices[country.currency];

  return (
    <div className="product-card">
      <Link href={`/product/${product.slug}`} className="group block">
        <div className="overflow-hidden border border-border/50 transition-all duration-700 group-hover:border-gold/30 group-hover:shadow-[0_0_60px_oklch(0.78_0.08_75_/_0.15)]">

          {/* Image area */}
          <div className="relative flex items-center justify-center overflow-hidden" style={{ aspectRatio: "4/5", background: "#2d0a14" }}>
            {/* Radial gold glow behind bottle */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_50%_55%,_rgba(196,168,120,0.12)_0%,_transparent_70%)] group-hover:bg-[radial-gradient(ellipse_60%_55%_at_50%_55%,_rgba(196,168,120,0.22)_0%,_transparent_70%)] transition-all duration-700" />

            {/* Gender tag */}
            <div className="absolute top-5 left-5 z-20">
              <span className="text-[10px] tracking-[0.3em] uppercase text-gold/70 bg-black/40 backdrop-blur-sm px-3 py-1.5 border border-gold/15">
                {product.tagline}
              </span>
            </div>

            {/* Bottle image */}
            <motion.div
              whileHover={{ scale: 1.06 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="relative z-10"
            >
              <Image
                src={product.image}
                alt={`${product.name} ${product.tagline}`}
                width={420}
                height={420}
                className="w-64 sm:w-80 lg:w-72 xl:w-80 h-auto drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)] group-hover:drop-shadow-[0_30px_70px_oklch(0.78_0.08_75_/_0.25)] transition-all duration-700"
              />
            </motion.div>
          </div>

          {/* Info strip */}
          <div className="bg-background border-t border-border/30 px-6 py-5 flex items-center justify-between gap-4">
            <div>
              <h3 className="font-heading text-xl sm:text-2xl text-foreground tracking-wide leading-tight">
                {product.name}
                <span className="text-gold ml-2 text-base italic">{product.tagline}</span>
              </h3>
              <p className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground/60 mt-1">
                {product.type}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="font-heading text-xl sm:text-2xl text-gold">
                {formatPrice(price, country.currency)}
              </p>
              <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/50 mt-1 group-hover:text-gold/60 transition-colors duration-300">
                Explore →
              </p>
            </div>
          </div>

        </div>
      </Link>
    </div>
  );
}
