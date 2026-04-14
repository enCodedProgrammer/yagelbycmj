"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface ImageRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}

export default function ImageReveal({
  children,
  className,
  delay = 0,
  direction = "up",
}: ImageRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const clipPaths = {
    up: {
      initial: "inset(100% 0% 0% 0%)",
      animate: "inset(0% 0% 0% 0%)",
    },
    down: {
      initial: "inset(0% 0% 100% 0%)",
      animate: "inset(0% 0% 0% 0%)",
    },
    left: {
      initial: "inset(0% 100% 0% 0%)",
      animate: "inset(0% 0% 0% 0%)",
    },
    right: {
      initial: "inset(0% 0% 0% 100%)",
      animate: "inset(0% 0% 0% 0%)",
    },
  };

  return (
    <motion.div
      ref={ref}
      className={cn("overflow-hidden", className)}
      initial={{ clipPath: clipPaths[direction].initial }}
      animate={
        isInView ? { clipPath: clipPaths[direction].animate } : {}
      }
      transition={{
        duration: 1.2,
        delay,
        ease: [0.77, 0, 0.175, 1],
      }}
    >
      <motion.div
        initial={{ scale: 1.3 }}
        animate={isInView ? { scale: 1 } : {}}
        transition={{
          duration: 1.6,
          delay,
          ease: [0.77, 0, 0.175, 1],
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
