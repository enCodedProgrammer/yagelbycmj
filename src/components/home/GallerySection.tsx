"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const GALLERY_ITEMS = [
  { src: "/story/_DSC3865.jpeg",                               alt: "For Her — Portrait" },
  { src: "/story/035AD806-64CD-49C6-B0E9-A44961D04C43.png",   alt: "Both — Roses" },
  { src: "/story/4F0AA910-F278-4E57-80A1-C6200F4017C3.png",   alt: "For Her — Hands" },
  { src: "/story/8C4270F2-ADD4-472D-9022-D3DFAFE8CCC2.png",   alt: "Both — Notes" },
  { src: "/story-old/_DSC3958.jpeg",                               alt: "For Him — Portrait" },
  { src: "/story/491029B2-5C93-4273-BF67-3C3F2C9E3A50.png",   alt: "Both — Gold Satin" },
  { src: "/story/4C93DCC8-FCD5-4722-A0F2-6D5DE1DB94E2.png",   alt: "For Him — Uncap" },
  { src: "/story/AB1A8EAC-2553-4107-ADD3-4E7509CA3C75.png",   alt: "For Him — Flat Lay" },
];

const SCROLL_AMOUNT = 400;

export default function GallerySection() {
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

  const scrollBy = (dir: "left" | "right") => {
    trackRef.current?.scrollBy({ left: dir === "left" ? -SCROLL_AMOUNT : SCROLL_AMOUNT, behavior: "smooth" });
  };

  return (
    <section className="py-16 md:py-24 bg-background overflow-hidden">
      {/* Header */}
      <div className="flex flex-col items-center text-center gap-4 md:flex-row md:items-center md:justify-between md:text-left md:gap-0 px-6 md:px-12 mb-8 md:mb-12">
        <div>
          <p className="text-[10px] tracking-[0.4em] uppercase text-gold/50 mb-2">
            The Collection
          </p>
          <h2 className="font-heading text-2xl md:text-3xl tracking-wide text-foreground">
            Moments &amp; Identity
          </h2>
        </div>

        {/* Nav buttons — desktop only */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => scrollBy("left")}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
            className="w-10 h-10 flex items-center justify-center border border-gold/20 text-gold/60 hover:border-gold/60 hover:text-gold transition-[border-color,color] duration-200 disabled:opacity-20 disabled:pointer-events-none"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scrollBy("right")}
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
        className="flex gap-3 md:gap-4 overflow-x-auto px-6 md:px-12 pb-4"
        style={{
          cursor: "grab",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
          scrollSnapType: "x mandatory",
        }}
      >
        {GALLERY_ITEMS.map((item, i) => (
          <div
            key={i}
            className="relative flex-shrink-0 overflow-hidden"
            style={{
              width: "clamp(200px, 28vw, 360px)",
              height: "clamp(260px, 36vw, 480px)",
              scrollSnapAlign: "start",
            }}
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              className="object-cover transition-transform duration-300 hover:scale-[1.04]"
              sizes="(max-width: 768px) 200px, 360px"
              draggable={false}
            />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        ))}
      </div>

      {/* Dots — mobile only */}
      <div className="flex justify-center gap-1.5 mt-5 md:hidden">
        {GALLERY_ITEMS.map((_, i) => (
          <div key={i} className="w-1 h-1 rounded-full bg-gold/30" />
        ))}
      </div>
    </section>
  );
}
