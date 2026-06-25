"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

export interface Review {
  id: string;
  product_id: string;
  product_name: string;
  reviewer_name: string;
  rating: number;
  comment: string;
  submitted_at: string;
}

const SCROLL_AMOUNT = 360;

function TestimonialCard({
  name,
  sub,
  rating,
  text,
}: {
  name: string;
  sub: string;
  rating: number;
  text: string;
}) {
  return (
    <div
      className="relative flex-shrink-0 flex flex-col bg-card/30 border border-border/30 p-6 backdrop-blur-sm hover:border-gold/20 transition-[border-color] duration-200"
      style={{
        width: "clamp(280px, 80vw, 380px)",
        scrollSnapAlign: "start",
      }}
    >
      <span className="absolute top-4 right-6 font-heading text-6xl text-gold/10 select-none">
        &ldquo;
      </span>
      <div className="flex gap-0.5 mb-3">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} className="w-3.5 h-3.5 fill-gold text-gold" />
        ))}
      </div>
      <p className="text-sm text-foreground/60 leading-relaxed mb-5 italic whitespace-pre-line">
        &ldquo;{text}&rdquo;
      </p>
      <div className="mt-auto pt-4 border-t border-border/20">
        <p className="text-sm font-medium text-foreground/80">{name}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
      </div>
    </div>
  );
}

export default function TestimonialsSection({ reviews }: { reviews: Review[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateButtons = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setCanScrollLeft(track.scrollLeft > 4);
    setCanScrollRight(track.scrollLeft < track.scrollWidth - track.clientWidth - 4);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const onMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      startX.current = e.pageX - track.offsetLeft;
      scrollLeft.current = track.scrollLeft;
      track.style.cursor = "grabbing";
    };
    const onMouseLeave = () => { isDragging.current = false; track.style.cursor = "grab"; };
    const onMouseUp    = () => { isDragging.current = false; track.style.cursor = "grab"; };
    const onMouseMove  = (e: MouseEvent) => {
      if (!isDragging.current) return;
      e.preventDefault();
      const x = e.pageX - track.offsetLeft;
      track.scrollLeft = scrollLeft.current - (x - startX.current) * 1.5;
    };

    track.addEventListener("mousedown",  onMouseDown);
    track.addEventListener("mouseleave", onMouseLeave);
    track.addEventListener("mouseup",    onMouseUp);
    track.addEventListener("mousemove",  onMouseMove);
    track.addEventListener("scroll",     updateButtons, { passive: true });

    updateButtons();

    return () => {
      track.removeEventListener("mousedown",  onMouseDown);
      track.removeEventListener("mouseleave", onMouseLeave);
      track.removeEventListener("mouseup",    onMouseUp);
      track.removeEventListener("mousemove",  onMouseMove);
      track.removeEventListener("scroll",     updateButtons);
    };
  }, [updateButtons]);

  const scrollByDir = (dir: "left" | "right") => {
    trackRef.current?.scrollBy({ left: dir === "left" ? -SCROLL_AMOUNT : SCROLL_AMOUNT, behavior: "smooth" });
  };

  // Only show the section once at least one real review exists in Supabase.
  if (!reviews || reviews.length === 0) return null;

  const cards = reviews.slice(0, 6).map((r) => ({
    name: r.reviewer_name || "Anonymous",
    sub: r.product_name,
    rating: r.rating,
    text: r.comment,
  }));

  return (
    <section className="relative py-16 md:py-24 bg-background overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--gold)_0%,_transparent_60%)] opacity-[0.03]" />

      {/* Header */}
      <div className="relative flex items-end justify-between px-6 md:px-12 mb-8 md:mb-12">
        <div>
          <p className="text-[10px] tracking-[0.4em] uppercase text-gold/50 mb-2">
            Testimonials
          </p>
          <h2 className="font-heading text-2xl md:text-3xl tracking-wide text-foreground">
            What They <span className="text-gold italic">Say</span>
          </h2>
        </div>

        {/* Nav buttons — desktop only */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => scrollByDir("left")}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
            className="w-10 h-10 flex items-center justify-center border border-gold/20 text-gold/60 hover:border-gold/60 hover:text-gold transition-[border-color,color] duration-200 disabled:opacity-20 disabled:pointer-events-none"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scrollByDir("right")}
            disabled={!canScrollRight}
            aria-label="Scroll right"
            className="w-10 h-10 flex items-center justify-center border border-gold/20 text-gold/60 hover:border-gold/60 hover:text-gold transition-[border-color,color] duration-200 disabled:opacity-20 disabled:pointer-events-none"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scrollable track */}
      <div
        ref={trackRef}
        className="relative flex gap-4 overflow-x-auto px-6 md:px-12 pb-4 items-stretch"
        style={{
          cursor: "grab",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
          scrollSnapType: "x mandatory",
        }}
      >
        {cards.map((card, i) => (
          <TestimonialCard
            key={i}
            name={card.name}
            sub={card.sub}
            rating={card.rating}
            text={card.text}
          />
        ))}
      </div>

      {/* Dots — mobile only */}
      {cards.length > 1 && (
        <div className="relative flex justify-center gap-1.5 mt-5 md:hidden">
          {cards.map((_, i) => (
            <div key={i} className="w-1 h-1 rounded-full bg-gold/30" />
          ))}
        </div>
      )}
    </section>
  );
}
