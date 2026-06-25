"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Star } from "lucide-react";

interface Review {
  id: string;
  product_id: string;
  product_name: string;
  reviewer_name: string;
  rating: number;
  comment: string;
  submitted_at: string;
}

function TestimonialCard({
  name,
  sub,
  rating,
  text,
  delay,
  isInView,
}: {
  name: string;
  sub: string;
  rating: number;
  text: string;
  delay: number;
  isInView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className="relative bg-card/30 border border-border/30 p-6 backdrop-blur-sm hover:border-gold/20 transition-[border-color] duration-200"
    >
      <span className="absolute top-4 right-6 font-heading text-6xl text-gold/10">
        &ldquo;
      </span>
      <div className="flex gap-0.5 mb-3">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} className="w-3.5 h-3.5 fill-gold text-gold" />
        ))}
      </div>
      <p className="text-sm text-foreground/60 leading-relaxed mb-5 italic">
        &ldquo;{text}&rdquo;
      </p>
      <div className="pt-4 border-t border-border/20">
        <p className="text-sm font-medium text-foreground/80">{name}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
      </div>
    </motion.div>
  );
}

export default function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    fetch("/api/reviews")
      .then((r) => r.json())
      .then((data: Review[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setReviews(data.slice(0, 6));
        }
      })
      .catch(() => {});
  }, []);

  // Only show the section once at least one real review exists in Supabase.
  if (reviews.length === 0) return null;

  const cards = reviews.map((r) => ({
    name: r.reviewer_name || "Anonymous",
    sub: r.product_name,
    rating: r.rating,
    text: r.comment,
  }));

  return (
    <section ref={ref} className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--gold)_0%,_transparent_60%)] opacity-[0.03]" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
            className="inline-block text-xs tracking-[0.4em] uppercase text-gold/60 mb-3"
          >
            Testimonials
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.06 }}
            className="font-heading text-3xl sm:text-4xl md:text-5xl tracking-wide text-foreground"
          >
            What They{" "}
            <span className="text-gold italic">Say</span>
          </motion.h2>
        </div>

        <div className={`grid grid-cols-1 gap-8 ${cards.length === 1 ? "md:grid-cols-1 max-w-md mx-auto" : cards.length === 2 ? "md:grid-cols-2 max-w-2xl mx-auto" : "md:grid-cols-3"}`}>
          {cards.map((card, i) => (
            <TestimonialCard
              key={i}
              name={card.name}
              sub={card.sub}
              rating={card.rating}
              text={card.text}
              delay={i * 0.07}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
