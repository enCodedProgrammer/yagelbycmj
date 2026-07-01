"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, Minus, Plus, Star } from "lucide-react";
import { products, formatPrice } from "@/lib/data";
import { useCountry } from "@/lib/country-context";
import { useCart } from "@/lib/cart-context";

interface Review {
  id: string;
  reviewer_name: string;
  rating: number;
  comment: string;
  location?: string;
  submitted_at: string;
}

function ReviewsSection({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch(`/api/reviews?product=${productId}`)
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setReviews(data); })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, [productId]);

  const shown = reviews.slice(0, 12);

  const avg = shown.length
    ? Math.round((shown.reduce((s, r) => s + r.rating, 0) / shown.length) * 10) / 10
    : 0;

  return (
    <div className="mt-20 pt-16 border-t border-border/20">
      <div className="flex items-center justify-between gap-4 mb-2">
        <h2 className="font-heading text-2xl tracking-wide text-foreground">
          Customer Reviews
        </h2>
        <Link
          href="/reviews"
          className="text-xs tracking-[0.15em] uppercase text-gold/70 hover:text-gold transition-colors whitespace-nowrap"
        >
          View All →
        </Link>
      </div>

      {loaded && reviews.length === 0 && (
        <p className="text-muted-foreground text-sm mt-4">
          No reviews yet — be the first to share your experience.
        </p>
      )}

      {reviews.length > 0 && (
        <>
          {/* Average */}
          <div className="flex items-center gap-3 mb-10">
            <span className="font-heading text-4xl text-gold">{avg}</span>
            <div>
              <div className="flex gap-1 mb-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-4 h-4 ${s <= Math.round(avg) ? "fill-gold text-gold" : "fill-transparent text-gold/30"}`}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                {shown.length} review{shown.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {/* Review cards */}
          <div className="space-y-6">
            {shown.map((r) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="border border-border/30 bg-card/20 p-6"
              >
                <div className="flex items-center justify-between gap-3 mb-1.5">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${s <= r.rating ? "fill-gold text-gold" : "fill-transparent text-gold/20"}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(r.submitted_at).toLocaleDateString("en-GB", {
                      year: "numeric", month: "short", day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center flex-wrap gap-x-2 gap-y-0.5 mb-3">
                  <span className="text-sm font-medium text-foreground/80">
                    {r.reviewer_name || "Anonymous"}
                  </span>
                  {r.location && (
                    <span className="text-xs text-muted-foreground">
                      · {r.location}
                    </span>
                  )}
                </div>
                <p className="text-sm text-foreground/60 leading-relaxed italic whitespace-pre-line line-clamp-5">
                  &ldquo;{r.comment}&rdquo;
                </p>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;
  const product = products.find((p) => p.slug === slug);
  const { country } = useCountry();
  const { addItem } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="pt-32 pb-24 text-center">
        <div className="max-w-md mx-auto px-6">
          <h1 className="font-heading text-2xl text-foreground mb-4">
            Product not found
          </h1>
          <Link
            href="/#collection"
            className="inline-block px-8 py-3 bg-gold text-primary-foreground text-sm tracking-[0.15em] uppercase"
          >
            Browse Collection
          </Link>
        </div>
      </div>
    );
  }

  const price = product.prices[country.currency];

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        productId: product.id,
        name: `${product.name} (${product.tagline})`,
        tagline: product.tagline,
        image: product.image,
        prices: product.prices,
      });
    }
  };

  return (
    <div className="pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-10"
        >
          <Link
            href="/#collection"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Collection
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Main viewer */}
            <div className="relative aspect-square bg-gradient-to-b from-muted/20 to-card/50 border border-border/30 flex items-center justify-center overflow-hidden mb-4">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--gold)_0%,_transparent_60%)] opacity-[0.06]" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImage}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="relative z-10 w-full h-full flex items-center justify-center"
                >
                  {product.gallery[selectedImage].type === "video" ? (
                    <video
                      src={product.gallery[selectedImage].src}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Image
                      src={product.gallery[selectedImage].src}
                      alt={product.gallery[selectedImage].alt}
                      width={500}
                      height={500}
                      className="w-72 sm:w-80 md:w-96 h-auto drop-shadow-[0_20px_60px_rgba(0,0,0,0.3)]"
                      priority
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3">
              {product.gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-b from-muted/20 to-card/50 border flex items-center justify-center overflow-hidden transition-all duration-300 ${
                    selectedImage === i
                      ? "border-gold/60 shadow-[0_0_15px_rgba(196,168,120,0.15)]"
                      : "border-border/30 hover:border-gold/30"
                  }`}
                >
                  {img.type === "video" ? (
                    <video
                      src={img.src}
                      muted
                      playsInline
                      className="w-full h-full object-cover pointer-events-none"
                    />
                  ) : (
                    <Image
                      src={img.src}
                      alt={img.alt}
                      width={80}
                      height={80}
                      className="w-14 sm:w-16 h-auto"
                    />
                  )}
                  {selectedImage === i && (
                    <motion.div
                      layoutId="thumbnail-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold"
                    />
                  )}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col"
          >
            {/* Gender tag */}
            <span className="inline-block self-start text-[10px] tracking-[0.3em] uppercase text-gold/60 bg-gold/5 border border-gold/10 px-3 py-1.5 mb-6">
              {product.tagline}
            </span>

            {/* Name */}
            <h1 className="font-heading text-4xl sm:text-5xl tracking-wide text-foreground mb-2">
              {product.name}
              <span className="text-gold ml-3 text-2xl sm:text-3xl italic">
                {product.tagline}
              </span>
            </h1>

            {/* Type + volume */}
            <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-6">
              {product.type} · {product.volume}
            </p>

            {/* Signature feel */}
            <p className="font-heading text-lg text-gold/70 italic mb-6">
              {product.signatureFeel}
            </p>

            {/* Price */}
            <div className="mb-8">
              <p className="font-heading text-3xl text-gold">
                {formatPrice(price, country.currency)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {country.currency === "NGN"
                  ? `Delivery fee calculated at checkout · ${country.shippingDays} business days`
                  : `Free shipping to ${country.name} · ${country.shippingDays} business days`}
              </p>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-border/30 mb-8" />

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">
                Description
              </h3>
              <p className="text-sm text-foreground/60 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Fragrance Notes */}
            <div className="mb-10">
              <h3 className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">
                Fragrance Notes
              </h3>
              <div className="space-y-3">
                <NoteRow label="Top" value={product.notes.top} />
                <NoteRow label="Heart" value={product.notes.heart} />
                <NoteRow label="Base" value={product.notes.base} />
              </div>
            </div>

            {/* Quantity + Add to Cart */}
            <div className="mt-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-8 border-t border-border/30">
              {/* Quantity selector */}
              <div className="flex items-center border border-border/50">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-3 text-foreground/60 hover:text-gold transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-sm text-foreground">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-3 text-foreground/60 hover:text-gold transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-3 py-4 bg-gold text-primary-foreground text-sm tracking-[0.2em] uppercase hover:shadow-[0_0_30px_rgba(196,168,120,0.3)] transition-all duration-500"
              >
                <ShoppingBag className="w-4 h-4" />
                Add to Cart
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Reviews */}
        <ReviewsSection productId={product.id} />
      </div>
    </div>
  );
}

function NoteRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4 text-sm">
      <span className="text-gold/60 uppercase tracking-wider w-14 shrink-0 text-xs pt-0.5">
        {label}
      </span>
      <span className="text-foreground/50">{value}</span>
    </div>
  );
}
