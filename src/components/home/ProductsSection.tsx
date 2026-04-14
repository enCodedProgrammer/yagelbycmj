"use client";

import { useRef, useState } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import Image from "next/image";
import { ShoppingBag, Sparkles } from "lucide-react";
import { products, formatPrice, type Product } from "@/lib/data";
import { useCountry } from "@/lib/country-context";
import { useCart } from "@/lib/cart-context";
import TextReveal from "@/components/ui/text-reveal";
import ImageReveal from "@/components/ui/image-reveal";
import MagneticButton from "@/components/ui/magnetic-button";

export default function ProductsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="collection"
      ref={ref}
      className="relative py-40 md:py-56 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0d0b09] to-transparent opacity-50" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-24">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="inline-block text-[10px] tracking-[0.5em] uppercase text-gold/40 mb-6"
          >
            The Collection
          </motion.span>
          <TextReveal
            as="h2"
            className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-wide text-foreground"
            delay={0.2}
          >
            Choose Your Signature
          </TextReveal>
        </div>

        {/* Products */}
        <div className="space-y-32 lg:space-y-48">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
              reversed={index % 2 === 1}
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
  reversed,
}: {
  product: Product;
  index: number;
  reversed: boolean;
}) {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: "-100px" });
  const { country } = useCountry();
  const { addItem } = useCart();
  const [activeNote, setActiveNote] = useState<string | null>(null);
  const [isAdded, setIsAdded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const contentY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  const price = product.prices[country.currency];

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: `${product.name} (${product.tagline})`,
      tagline: product.tagline,
      image: product.image,
      prices: product.prices,
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const notes = [
    { label: "Top Notes", value: product.notes.top, key: "top" },
    { label: "Heart Notes", value: product.notes.heart, key: "heart" },
    { label: "Base Notes", value: product.notes.base, key: "base" },
  ];

  return (
    <div
      ref={cardRef}
      className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center ${
        reversed ? "lg:direction-rtl" : ""
      }`}
    >
      {/* Product Image */}
      <motion.div
        style={{ y: imageY }}
        className={`relative ${reversed ? "lg:order-2" : ""}`}
      >
        <ImageReveal delay={0.2} direction={reversed ? "right" : "left"}>
          <div className="relative aspect-square bg-gradient-to-br from-card/80 via-muted/20 to-card/80 flex items-center justify-center group">
            {/* Background glow */}
            <motion.div
              animate={{
                opacity: [0.05, 0.12, 0.05],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--gold)_0%,_transparent_60%)] opacity-[0.08]"
            />

            {/* Product image with hover effect */}
            <motion.div
              whileHover={{ scale: 1.08, rotate: 3 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10"
            >
              <Image
                src={product.image}
                alt={`${product.name} ${product.tagline}`}
                width={400}
                height={400}
                className="w-56 sm:w-72 md:w-80 h-auto drop-shadow-[0_30px_60px_rgba(0,0,0,0.4)] group-hover:drop-shadow-[0_30px_80px_rgba(196,168,120,0.25)] transition-all duration-700"
              />
            </motion.div>

            {/* Corner decorations */}
            <div className="absolute top-6 left-6 w-8 h-8 border-t border-l border-gold/20" />
            <div className="absolute bottom-6 right-6 w-8 h-8 border-b border-r border-gold/20" />

            {/* Gender tag */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="absolute top-8 left-8"
            >
              <span className="text-[9px] tracking-[0.4em] uppercase text-gold/50 bg-background/70 backdrop-blur-md px-4 py-2 border border-gold/10">
                {product.tagline}
              </span>
            </motion.div>
          </div>
        </ImageReveal>
      </motion.div>

      {/* Product Details */}
      <motion.div
        style={{ y: contentY }}
        className={`${reversed ? "lg:order-1 lg:text-right" : ""}`}
      >
        {/* Type */}
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="inline-block text-[10px] tracking-[0.4em] uppercase text-gold/40 mb-4"
        >
          {product.type}
        </motion.span>

        {/* Name */}
        <motion.h3
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 1,
            delay: 0.4,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="font-heading text-4xl sm:text-5xl md:text-6xl text-foreground tracking-wide mb-2"
        >
          {product.name}
          <span className="text-gold text-2xl sm:text-3xl italic ml-3">
            {product.tagline}
          </span>
        </motion.h3>

        {/* Signature feel */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="font-heading text-lg text-gold/60 italic mb-8"
        >
          {product.signatureFeel}
        </motion.p>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-sm text-foreground/40 leading-[2] mb-10 max-w-lg"
        >
          {product.description}
        </motion.p>

        {/* Interactive fragrance notes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mb-10"
        >
          <div className={`flex gap-3 ${reversed ? "lg:justify-end" : ""}`}>
            {notes.map((note) => (
              <motion.button
                key={note.key}
                onClick={() =>
                  setActiveNote(activeNote === note.key ? null : note.key)
                }
                className={`px-4 py-2 text-[10px] tracking-[0.2em] uppercase border transition-all duration-500 ${
                  activeNote === note.key
                    ? "border-gold/50 text-gold bg-gold/5"
                    : "border-border/30 text-foreground/40 hover:border-gold/30 hover:text-gold/60"
                }`}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                {note.label}
              </motion.button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeNote && (
              <motion.div
                key={activeNote}
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <p className="text-sm text-foreground/50 mt-4 pl-1 flex items-start gap-2">
                  <Sparkles className="w-3 h-3 text-gold/50 mt-1 shrink-0" />
                  {notes.find((n) => n.key === activeNote)?.value}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Price and CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
          className={`flex items-center gap-8 ${
            reversed ? "lg:justify-end" : ""
          }`}
        >
          <div>
            <motion.p
              className="font-heading text-3xl sm:text-4xl text-gold"
              key={country.currency}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {formatPrice(price, country.currency)}
            </motion.p>
            <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/60 mt-1">
              Free worldwide shipping
            </p>
          </div>

          <MagneticButton onClick={handleAddToCart} strength={0.15}>
            <span className="relative flex items-center gap-3 px-8 py-4 bg-gold text-primary-foreground text-[11px] tracking-[0.2em] uppercase font-medium overflow-hidden">
              <AnimatePresence mode="wait">
                {isAdded ? (
                  <motion.span
                    key="added"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2"
                  >
                    Added
                  </motion.span>
                ) : (
                  <motion.span
                    key="add"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Add to Cart
                  </motion.span>
                )}
              </AnimatePresence>
              <motion.span
                className="absolute inset-0 bg-gold-light"
                initial={{ x: "-101%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              />
            </span>
          </MagneticButton>
        </motion.div>
      </motion.div>
    </div>
  );
}
