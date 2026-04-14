"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { countries } from "@/lib/data";
import { useCountry } from "@/lib/country-context";

export default function CountrySelector() {
  const { country, setCountry } = useCountry();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-sm text-foreground/60 hover:text-gold transition-colors px-2 py-1"
      >
        <span>{country.flag}</span>
        <span className="hidden sm:inline">{country.currencySymbol}</span>
        <ChevronDown className="w-3 h-3" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 bg-card border border-border rounded-lg shadow-xl overflow-hidden min-w-[180px]"
          >
            {countries.map((c) => (
              <button
                key={c.code}
                onClick={() => {
                  setCountry(c);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted transition-colors ${
                  c.code === country.code
                    ? "text-gold bg-muted/50"
                    : "text-foreground/70"
                }`}
              >
                <span className="text-base">{c.flag}</span>
                <span>{c.name}</span>
                <span className="ml-auto text-muted-foreground">
                  {c.currencySymbol}
                </span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
