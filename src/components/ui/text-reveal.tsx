"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface TextRevealProps {
  children: string;
  className?: string;
  delay?: number;
  once?: boolean;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  charAnimation?: boolean;
}

export default function TextReveal({
  children,
  className,
  delay = 0,
  once = true,
  as: Tag = "p",
  charAnimation = false,
}: TextRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: "-50px" });

  if (charAnimation) {
    const chars = children.split("");
    return (
      <Tag ref={ref} className={cn("overflow-hidden", className)}>
        {chars.map((char, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.5,
              delay: delay + i * 0.03,
              ease: [0.215, 0.61, 0.355, 1],
            }}
            className="inline-block"
            style={{ whiteSpace: char === " " ? "pre" : undefined }}
          >
            {char}
          </motion.span>
        ))}
      </Tag>
    );
  }

  // Word-by-word reveal
  const words = children.split(" ");
  return (
    <Tag ref={ref} className={cn("overflow-hidden", className)}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.25em]">
          <motion.span
            initial={{ y: "100%" }}
            animate={isInView ? { y: 0 } : {}}
            transition={{
              duration: 0.8,
              delay: delay + i * 0.08,
              ease: [0.215, 0.61, 0.355, 1],
            }}
            className="inline-block"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
