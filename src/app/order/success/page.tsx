"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { useCart } from "@/lib/cart-context";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const sessionId = searchParams.get("session_id");
  const reference = searchParams.get("reference");

  useEffect(() => {
    clearCart();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="pt-32 pb-24 text-center">
      <div className="max-w-md mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <CheckCircle className="w-20 h-20 text-gold mx-auto mb-6" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 className="font-heading text-3xl tracking-wide text-foreground mb-4">
            Order Confirmed
          </h1>
          <p className="text-muted-foreground mb-2">
            Thank you for your purchase. Your fragrance is being prepared.
          </p>
          <p className="text-muted-foreground mb-8 text-sm">
            A confirmation email will be sent to you shortly.
          </p>

          {(sessionId || reference) && (
            <p className="text-xs text-muted-foreground/50 mb-8 font-mono">
              Ref: {sessionId ?? reference}
            </p>
          )}

          {/* Review nudge */}
          <div className="mb-8 border border-gold/20 bg-gold/5 px-6 py-5 text-left">
            <p className="text-sm text-gold font-medium mb-1 tracking-wide">
              Love your fragrance?
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Check your email — we&rsquo;ve sent you a link to leave a review.
              It takes 30 seconds and helps others discover their scent.
            </p>
          </div>

          <Link
            href="/"
            className="inline-block px-8 py-3 bg-gold text-primary-foreground text-sm tracking-[0.15em] uppercase hover:shadow-[0_0_30px_rgba(196,168,120,0.3)] transition-all duration-500"
          >
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense>
      <OrderSuccessContent />
    </Suspense>
  );
}
