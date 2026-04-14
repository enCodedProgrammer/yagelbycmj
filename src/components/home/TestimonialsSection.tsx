"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import TextReveal from "@/components/ui/text-reveal";

const testimonials = [
  {
    name: "Sophia M.",
    location: "London, UK",
    rating: 5,
    text: "I've never received so many compliments on a fragrance. Yagel for Her is absolutely divine — it lasts all day and transitions beautifully from morning to evening. This is luxury you can actually feel.",
    product: "Yagel — For Her",
  },
  {
    name: "David A.",
    location: "Lagos, Nigeria",
    rating: 5,
    text: "Bold, warm, and unforgettable. Every time I wear Yagel, someone asks what I'm wearing. It's become my signature scent. Nothing else compares.",
    product: "Yagel — For Him",
  },
  {
    name: "Emma R.",
    location: "New York, US",
    rating: 5,
    text: "The packaging alone feels luxurious, but the scent is on another level. Sweet without being overpowering — pure elegance in a bottle. I bought two more for gifts.",
    product: "Yagel — For Her",
  },
  {
    name: "James K.",
    location: "Manchester, UK",
    rating: 5,
    text: "I've worn Tom Ford and MFK for years, but Yagel For Him has something different. The oud base is incredible — it's commanding without being loud. My new daily scent.",
    product: "Yagel — For Him",
  },
];

export default function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const navigate = (dir: number) => {
    setDirection(dir);
    setCurrent((prev) =>
      dir === 1
        ? (prev + 1) % testimonials.length
        : (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 200 : -200,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -200 : 200,
      opacity: 0,
    }),
  };

  return (
    <section ref={ref} className="relative py-40 md:py-56 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0d0b09]/30 to-transparent" />

      <div className="relative max-w-5xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="inline-block text-[10px] tracking-[0.5em] uppercase text-gold/40 mb-6"
          >
            Testimonials
          </motion.span>
          <TextReveal
            as="h2"
            className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-wide text-foreground"
            delay={0.2}
          >
            Voices of Elegance
          </TextReveal>
        </div>

        {/* Testimonial carousel */}
        <div className="relative max-w-3xl mx-auto">
          {/* Large quote mark */}
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isInView ? { opacity: 0.04, scale: 1 } : {}}
            transition={{ duration: 1, delay: 0.5 }}
            className="absolute -top-16 left-1/2 -translate-x-1/2 font-heading text-[200px] text-gold leading-none select-none pointer-events-none"
          >
            &ldquo;
          </motion.span>

          {/* Carousel */}
          <div className="relative min-h-[280px] flex items-center">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="text-center w-full"
              >
                {/* Stars */}
                <div className="flex justify-center gap-1.5 mb-8">
                  {[...Array(testimonials[current].rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: i * 0.08 }}
                    >
                      <Star className="w-4 h-4 fill-gold text-gold" />
                    </motion.div>
                  ))}
                </div>

                {/* Quote */}
                <p className="font-heading text-xl sm:text-2xl md:text-3xl text-foreground/70 italic leading-relaxed mb-10 px-4">
                  &ldquo;{testimonials[current].text}&rdquo;
                </p>

                {/* Author */}
                <div>
                  <p className="text-sm font-medium text-foreground/80 tracking-wide">
                    {testimonials[current].name}
                  </p>
                  <p className="text-xs text-gold/50 mt-1 tracking-wider">
                    {testimonials[current].location} &middot;{" "}
                    {testimonials[current].product}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-8 mt-12">
            <motion.button
              onClick={() => navigate(-1)}
              className="p-3 border border-border/30 text-foreground/40 hover:text-gold hover:border-gold/30 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>

            {/* Progress dots */}
            <div className="flex gap-3">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDirection(i > current ? 1 : -1);
                    setCurrent(i);
                  }}
                  className="relative w-8 h-0.5 bg-border/30 overflow-hidden"
                >
                  {i === current && (
                    <motion.div
                      layoutId="testimonialDot"
                      className="absolute inset-0 bg-gold"
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </button>
              ))}
            </div>

            <motion.button
              onClick={() => navigate(1)}
              className="p-3 border border-border/30 text-foreground/40 hover:text-gold hover:border-gold/30 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
}
