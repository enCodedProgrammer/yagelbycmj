"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sophia M.",
    location: "London, UK",
    rating: 5,
    text: "I've never received so many compliments on a fragrance. Yagel for Her is absolutely divine — it lasts all day and transitions beautifully from morning to evening.",
    product: "Yagel (For Her)",
  },
  {
    name: "David A.",
    location: "Lagos, Nigeria",
    rating: 5,
    text: "Bold, warm, and unforgettable. Every time I wear Yagel, someone asks what I'm wearing. It's become my signature scent.",
    product: "Yagel (For Him)",
  },
  {
    name: "Emma R.",
    location: "New York, US",
    rating: 5,
    text: "The packaging alone feels luxurious, but the scent is on another level. Sweet without being overpowering — pure elegance in a bottle.",
    product: "Yagel (For Her)",
  },
];

export default function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-32 md:py-40 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--gold)_0%,_transparent_60%)] opacity-[0.03]" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="inline-block text-xs tracking-[0.4em] uppercase text-gold/60 mb-4"
          >
            Testimonials
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-heading text-3xl sm:text-4xl md:text-5xl tracking-wide text-foreground"
          >
            What They{" "}
            <span className="text-gold italic">Say</span>
          </motion.h2>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 + index * 0.15 }}
              className="relative bg-card/30 border border-border/30 p-8 backdrop-blur-sm hover:border-gold/20 transition-all duration-500"
            >
              {/* Quote mark */}
              <span className="absolute top-4 right-6 font-heading text-6xl text-gold/10">
                &ldquo;
              </span>

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-gold text-gold"
                  />
                ))}
              </div>

              {/* Text */}
              <p className="text-sm text-foreground/60 leading-relaxed mb-6 italic">
                &ldquo;{testimonial.text}&rdquo;
              </p>

              {/* Author */}
              <div className="pt-4 border-t border-border/20">
                <p className="text-sm font-medium text-foreground/80">
                  {testimonial.name}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {testimonial.location} &middot; {testimonial.product}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
