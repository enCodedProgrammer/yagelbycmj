"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { products, formatPrice, type Product } from "@/lib/data";
import { useCountry } from "@/lib/country-context";
import { FluidDynamics } from "@/components/fluid-dynamics";

export default function ProductsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section
      id="collection"
      ref={ref}
      className="relative py-32 md:py-40 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-card/30 to-transparent" />

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({
  product,
  index,
  isInView,
}: {
  product: Product;
  index: number;
  isInView: boolean;
}) {
  const { country } = useCountry();
  const price = product.prices[country.currency];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.3 + index * 0.2 }}
    >
      <Link href={`/product/${product.slug}`} className="group block">
        <div className="relative bg-card/50 border border-border/50 overflow-hidden backdrop-blur-sm hover:border-gold/30 transition-all duration-700">
          {/* Product image area */}
          <div className="relative aspect-[3/4] bg-gradient-to-b from-muted/20 to-card/50 flex items-center justify-center overflow-hidden">
            {/* Background glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--gold)_0%,_transparent_60%)] opacity-[0.04] group-hover:opacity-[0.1] transition-opacity duration-700" />

            {/* Fluid dynamics — scent swirling around the bottle */}
            <div className="absolute inset-0 opacity-[0.15] mix-blend-screen pointer-events-none z-[1]">
              <FluidDynamics
                width={100}
                height={130}
                iterations={3}
                strength={40}
                radius={2}
                viscosity={0.0}
                diffusion={0.0}
                showDensity={true}
                showVelocity={false}
                addDensity={true}
                addVelocity={true}
                animate={true}
                circle={true}
                resetInterval={8000}
                fitContainer={true}
                orbitCenterX={0.5}
                orbitCenterY={0.45}
                orbitRadiusX={0.2}
                orbitRadiusY={0.22}
              />
            </div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.6 }}
              className="relative z-10"
            >
              <Image
                src={product.image}
                alt={`${product.name} ${product.tagline}`}
                width={400}
                height={400}
                className="w-56 sm:w-72 md:w-80 h-auto drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)] group-hover:drop-shadow-[0_20px_60px_rgba(196,168,120,0.2)] transition-all duration-700"
              />
            </motion.div>

            {/* Gender tag */}
            <div className="absolute top-6 left-6 z-20">
              <span className="text-[10px] tracking-[0.3em] uppercase text-gold/60 bg-background/60 backdrop-blur-sm px-3 py-1.5 border border-gold/10">
                {product.tagline}
              </span>
            </div>
          </div>

          {/* Name and price — minimal */}
          <div className="p-6 sm:p-8 flex items-center justify-between">
            <div>
              <h3 className="font-heading text-2xl sm:text-3xl text-foreground tracking-wide">
                {product.name}
                <span className="text-gold ml-2 text-lg italic">
                  {product.tagline}
                </span>
              </h3>
              <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mt-1">
                {product.type}
              </p>
            </div>
            <p className="font-heading text-xl sm:text-2xl text-gold">
              {formatPrice(price, country.currency)}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
