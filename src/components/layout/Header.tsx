"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import CountrySelector from "@/components/layout/CountrySelector";

export default function Header() {
  const { totalItems, setIsOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50"
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="group">
          <h1 className="font-heading text-2xl md:text-3xl tracking-[0.3em] uppercase text-gold">
            Yagel
          </h1>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <NavLink href="/#collection">Collection</NavLink>
          <NavLink href="/#about">Our Story</NavLink>
          <NavLink href="/shipping">Shipping</NavLink>
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <CountrySelector />
          <button
            onClick={() => setIsOpen(true)}
            className="relative p-2 text-foreground/70 hover:text-gold transition-colors"
            aria-label="Open cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-gold text-primary-foreground rounded-full text-xs flex items-center justify-center font-medium"
              >
                {totalItems}
              </motion.span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-foreground/70 hover:text-gold transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border/50"
          >
            <nav className="flex flex-col items-center gap-6 py-8">
              <MobileNavLink
                href="/#collection"
                onClick={() => setMobileMenuOpen(false)}
              >
                Collection
              </MobileNavLink>
              <MobileNavLink
                href="/#about"
                onClick={() => setMobileMenuOpen(false)}
              >
                Our Story
              </MobileNavLink>
              <MobileNavLink
                href="/shipping"
                onClick={() => setMobileMenuOpen(false)}
              >
                Shipping
              </MobileNavLink>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-sm tracking-[0.15em] uppercase text-foreground/60 hover:text-gold transition-colors duration-300"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="text-lg tracking-[0.2em] uppercase text-foreground/60 hover:text-gold transition-colors duration-300"
    >
      {children}
    </Link>
  );
}
