"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { products, formatPrice, type Product } from "@/lib/data";
import { useCountry } from "@/lib/country-context";
import { useCart } from "@/lib/cart-context";

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
  const { addItem } = useCart();
  const price = product.prices[country.currency];

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: `${product.name} (${product.tagline})`,
      tagline: product.tagline,
      image: product.image,
      prices: product.prices,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.3 + index * 0.2 }}
      className="group relative"
    >
      <div className="relative bg-card/50 border border-border/50 overflow-hidden backdrop-blur-sm hover:border-gold/30 transition-all duration-700">
        {/* Product image area */}
        <div className="relative h-80 sm:h-96 bg-gradient-to-b from-muted/30 to-card/50 flex items-center justify-center overflow-hidden">
          {/* Background glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--gold)_0%,_transparent_60%)] opacity-[0.06] group-hover:opacity-[0.12] transition-opacity duration-700" />

          <motion.div
            whileHover={{ scale: 1.05, rotate: 2 }}
            transition={{ duration: 0.6 }}
            className="relative z-10"
          >
            <Image
              src={product.image}
              alt={`${product.name} ${product.tagline}`}
              width={280}
              height={280}
              className="w-48 sm:w-64 h-auto drop-shadow-[0_20px_40px_rgba(0,0,0,0.3)] group-hover:drop-shadow-[0_20px_60px_rgba(196,168,120,0.2)] transition-all duration-700"
            />
          </motion.div>

          {/* Gender tag */}
          <div className="absolute top-6 left-6">
            <span className="text-[10px] tracking-[0.3em] uppercase text-gold/60 bg-background/60 backdrop-blur-sm px-3 py-1.5 border border-gold/10">
              {product.tagline}
            </span>
          </div>
        </div>

        {/* Product details */}
        <div className="p-8">
          {/* Name and type */}
          <div className="mb-4">
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

          {/* Signature feel */}
          <p className="font-heading text-gold/70 italic text-sm mb-4">
            {product.signatureFeel}
          </p>

          {/* Description */}
          <p className="text-sm text-foreground/50 leading-relaxed mb-6 line-clamp-3">
            {product.description}
          </p>

          {/* Fragrance notes */}
          <div className="space-y-2 mb-8">
            <NoteRow label="Top" value={product.notes.top} />
            <NoteRow label="Heart" value={product.notes.heart} />
            <NoteRow label="Base" value={product.notes.base} />
          </div>

          {/* Price and actions */}
          <div className="flex items-center justify-between pt-6 border-t border-border/30">
            <div>
              <p className="font-heading text-2xl text-gold">
                {formatPrice(price, country.currency)}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Free shipping to {country.name}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                className="flex items-center gap-2 px-6 py-3 bg-gold text-primary-foreground text-xs tracking-[0.15em] uppercase hover:shadow-[0_0_20px_rgba(196,168,120,0.3)] transition-all duration-500"
              >
                <ShoppingBag className="w-4 h-4" />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function NoteRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3 text-xs">
      <span className="text-gold/60 uppercase tracking-wider w-12 shrink-0">
        {label}
      </span>
      <span className="text-foreground/40">{value}</span>
    </div>
  );
}
