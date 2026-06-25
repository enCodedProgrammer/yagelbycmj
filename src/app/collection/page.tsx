"use client";

import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { products, formatPrice, type Product } from "@/lib/data";
import { useCountry } from "@/lib/country-context";
import { useCart } from "@/lib/cart-context";
import { ShoppingBag } from "lucide-react";

export default function CollectionPage() {
  const sectionRef = useRef<HTMLDivElement>(null);
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
    <div className="pt-28 pb-32" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-block text-xs tracking-[0.4em] uppercase text-gold/60 mb-4"
          >
            The Collection
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="font-heading text-3xl sm:text-4xl md:text-5xl tracking-wide text-foreground"
          >
            Choose Your{" "}
            <span className="text-gold italic">Signature</span>
          </motion.h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="w-16 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent mx-auto mt-6"
          />
        </div>

        {/* Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10"
        >
          {products.map((product) => (
            <CollectionCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </div>
  );
}

function CollectionCard({ product }: { product: Product }) {
  const { country } = useCountry();
  const { addItem } = useCart();
  const price = product.prices[country.currency];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      productId: product.id,
      name: product.name,
      tagline: product.tagline,
      image: product.image,
      prices: product.prices,
    });
  };

  return (
    <div className="product-card">
      <div className="group border border-border/50 overflow-hidden transition-all duration-700 hover:border-gold/30 hover:shadow-[0_0_60px_oklch(0.78_0.08_75_/_0.15)]">

        {/* Burgundy image area — clickable to product page */}
        <Link href={`/product/${product.slug}`} className="block">
          <div
            className="relative flex items-center justify-center overflow-hidden"
            style={{ background: "#2d0a14", aspectRatio: "4/5" }}
          >
            {/* Radial glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_50%_55%,_rgba(196,168,120,0.12)_0%,_transparent_70%)] group-hover:bg-[radial-gradient(ellipse_60%_55%_at_50%_55%,_rgba(196,168,120,0.22)_0%,_transparent_70%)] transition-all duration-700" />

            {/* Gender tag */}
            <div className="absolute top-5 left-5 z-20">
              <span className="text-[10px] tracking-[0.3em] uppercase text-gold/70 bg-black/40 backdrop-blur-sm px-3 py-1.5 border border-gold/15">
                {product.tagline}
              </span>
            </div>

            {/* Bottle */}
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
        </Link>

        {/* Info strip */}
        <div className="bg-background border-t border-border/30 px-6 py-5">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="font-heading text-xl sm:text-2xl text-foreground tracking-wide leading-tight">
                {product.name}
                <span className="text-gold ml-2 text-base italic">{product.tagline}</span>
              </h2>
              <p className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground/60 mt-1">
                {product.type} · {product.volume}
              </p>
            </div>
            <p className="font-heading text-xl sm:text-2xl text-gold shrink-0">
              {formatPrice(price, country.currency)}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-gold text-primary-foreground text-xs tracking-[0.2em] uppercase hover:shadow-[0_0_30px_rgba(196,168,120,0.35)] transition-all duration-500"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              Add to Cart
            </button>
            <Link
              href={`/product/${product.slug}`}
              className="px-5 py-3 border border-border/50 text-xs tracking-[0.2em] uppercase text-muted-foreground hover:border-gold/40 hover:text-gold transition-all duration-300"
            >
              Details
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
