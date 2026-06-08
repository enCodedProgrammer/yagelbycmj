"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, Loader2 } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useCountry } from "@/lib/country-context";
import { formatPrice } from "@/lib/data";

const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa",
  "Benue", "Borno", "Cross River", "Delta", "Ebonyi", "Edo",
  "Ekiti", "Enugu", "FCT (Abuja)", "Gombe", "Imo", "Jigawa",
  "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara",
  "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun",
  "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
];

function getNigerianDeliveryFee(state: string): number {
  if (state === "Lagos" || state === "Oyo") return 3000;
  return 7500;
}

export default function CheckoutPage() {
  const { items, totalItems } = useCart();
  const { country } = useCountry();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    state: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isNigeria = country.currency === "NGN";
  const subtotal = items.reduce(
    (sum, item) => sum + item.prices[country.currency] * item.quantity,
    0
  );
  const deliveryFee = isNigeria && formData.state
    ? getNigerianDeliveryFee(formData.state)
    : 0;
  const total = subtotal + deliveryFee;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isNigeria && !formData.state) {
      setError("Please select your state.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currency: country.currency,
          items: items.map((item) => ({
            productId: item.productId,
            name: item.name,
            image: item.image,
            quantity: item.quantity,
            unitPrice: item.prices[country.currency],
          })),
          deliveryFee: isNigeria ? deliveryFee : 0,
          customer: {
            name: formData.name,
            email: formData.email,
            address: formData.address,
            city: formData.city,
            postalCode: formData.postalCode,
            state: formData.state,
            country: country.name,
            countryCode: country.code,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Something went wrong. Please try again.");
      }

      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-card/50 border border-border/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-gold/50 transition-colors";

  if (totalItems === 0) {
    return (
      <div className="pt-32 pb-24 text-center">
        <div className="max-w-md mx-auto px-6">
          <ShoppingBag className="w-16 h-16 text-muted-foreground/20 mx-auto mb-6" />
          <h1 className="font-heading text-2xl text-foreground mb-4">
            Your cart is empty
          </h1>
          <p className="text-muted-foreground mb-8">
            Add some fragrances to your cart before checking out.
          </p>
          <Link
            href="/collection"
            className="inline-block px-8 py-3 bg-gold text-primary-foreground text-sm tracking-[0.15em] uppercase"
          >
            Browse Collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24">
      <div className="max-w-6xl mx-auto px-6">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-heading text-3xl tracking-wide text-foreground mb-8">
              Checkout
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs tracking-[0.15em] uppercase text-muted-foreground mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-xs tracking-[0.15em] uppercase text-muted-foreground mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-xs tracking-[0.15em] uppercase text-muted-foreground mb-2">
                  Shipping Country
                </label>
                <div className="w-full bg-card/50 border border-border/50 px-4 py-3 text-sm text-foreground">
                  {country.flag} {country.name}
                </div>
              </div>

              {/* Nigerian state selector */}
              {isNigeria && (
                <div>
                  <label className="block text-xs tracking-[0.15em] uppercase text-muted-foreground mb-2">
                    State
                  </label>
                  <select
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full bg-card/50 border border-border/50 px-4 py-3 text-sm text-foreground focus:outline-none focus:border-gold/50 transition-colors appearance-none"
                  >
                    <option value="" disabled className="bg-card text-muted-foreground">
                      Select your state
                    </option>
                    {NIGERIAN_STATES.map((s) => (
                      <option key={s} value={s} className="bg-card text-foreground">
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs tracking-[0.15em] uppercase text-muted-foreground mb-2">
                  Shipping Address
                </label>
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Street address"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs tracking-[0.15em] uppercase text-muted-foreground mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="block text-xs tracking-[0.15em] uppercase text-muted-foreground mb-2">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Postal code"
                  />
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-400 text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gold text-primary-foreground text-sm tracking-[0.2em] uppercase hover:shadow-[0_0_30px_rgba(196,168,120,0.3)] transition-all duration-500 mt-4 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? "Processing..." : `Pay ${formatPrice(total, country.currency)}`}
              </button>

              <p className="text-xs text-muted-foreground/60 text-center">
                {isNigeria
                  ? "You will be redirected to Paystack for secure payment"
                  : "You will be redirected to Stripe for secure payment"}
              </p>
            </form>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="font-heading text-xl tracking-wide text-foreground mb-8">
              Order Summary
            </h2>

            <div className="bg-card/30 border border-border/30 p-6">
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center gap-4 pb-4 border-b border-border/20 last:border-0 last:pb-0"
                  >
                    <div className="w-16 h-16 bg-muted/20 flex items-center justify-center shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={48}
                        height={48}
                        className="w-10 h-auto"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {item.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm text-gold">
                      {formatPrice(
                        item.prices[country.currency] * item.quantity,
                        country.currency
                      )}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-border/30 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">
                    {formatPrice(subtotal, country.currency)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery</span>
                  {isNigeria ? (
                    formData.state ? (
                      <span className="text-foreground">
                        {formatPrice(deliveryFee, "NGN")}
                      </span>
                    ) : (
                      <span className="text-muted-foreground/50 text-xs italic">
                        Select state
                      </span>
                    )
                  ) : (
                    <span className="text-gold">Free</span>
                  )}
                </div>

                <div className="flex justify-between pt-2 border-t border-border/20">
                  <span className="font-heading text-foreground">Total</span>
                  <span className="font-heading text-lg text-gold">
                    {formatPrice(total, country.currency)}
                  </span>
                </div>
              </div>

              <div className="mt-6 p-3 bg-muted/20 border border-border/20">
                <p className="text-xs text-muted-foreground">
                  Estimated delivery: {country.shippingDays} business days to{" "}
                  {country.name}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
