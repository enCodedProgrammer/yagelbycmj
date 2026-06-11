"use client";

import { motion } from "framer-motion";
import { Truck, Clock, Package, Globe, MapPin } from "lucide-react";
import { countries } from "@/lib/data";
import { STATE_TIERS } from "@/lib/delivery";

export default function ShippingPage() {
  return (
    <div className="pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="text-xs tracking-[0.4em] uppercase text-gold/60 mb-4 block">
            Information
          </span>
          <h1 className="font-heading text-4xl md:text-5xl tracking-wide text-foreground mb-4">
            Shipping <span className="text-gold italic">Policy</span>
          </h1>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent mx-auto" />
        </motion.div>

        <div className="space-y-16">
          {/* Free Shipping Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-card/30 border border-gold/20 p-8 text-center"
          >
            <Truck className="w-8 h-8 text-gold mx-auto mb-4" />
            <h2 className="font-heading text-2xl text-foreground mb-2">
              Free Shipping to the UK &amp; US
            </h2>
            <p className="text-muted-foreground">
              Every order to the United Kingdom and United States ships free.
              Within Nigeria, a delivery fee applies based on your location.
            </p>
          </motion.div>

          {/* Shipping Destinations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Globe className="w-5 h-5 text-gold" />
              <h2 className="font-heading text-xl text-foreground tracking-wide">
                Shipping Destinations & Times
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {countries.map((country) => (
                <div
                  key={country.code}
                  className="bg-card/30 border border-border/30 p-6 text-center hover:border-gold/20 transition-colors"
                >
                  <span className="text-3xl mb-3 block">{country.flag}</span>
                  <h3 className="font-medium text-foreground mb-1">
                    {country.name}
                  </h3>
                  <p className="text-sm text-gold">
                    {country.shippingDays} Business Days
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Nigeria Delivery Fees */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="w-5 h-5 text-gold" />
              <h2 className="font-heading text-xl text-foreground tracking-wide">
                Delivery Fees Within Nigeria
              </h2>
            </div>
            <div className="bg-card/30 border border-border/30 divide-y divide-border/20">
              <div className="p-6 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-1">Lagos</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Fee depends on your delivery area — calculated at checkout
                    when you select your location.
                  </p>
                </div>
                <span className="text-sm text-gold whitespace-nowrap">₦3,000 – ₦6,000</span>
              </div>
              <div className="p-6 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-1">Oyo State</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Flat rate to any location within Oyo.
                  </p>
                </div>
                <span className="text-sm text-gold whitespace-nowrap">₦3,000</span>
              </div>
              {STATE_TIERS.map((tier) => (
                <div key={tier.id} className="p-6 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-foreground mb-1">{tier.label}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {tier.description}: {tier.states.join(", ")}.
                    </p>
                  </div>
                  <span className="text-sm text-gold whitespace-nowrap">
                    ₦{tier.fee.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground/60 mt-3">
              Fees within Nigeria are based on distance from our Lagos dispatch
              station and are calculated automatically at checkout.
            </p>
          </motion.div>

          {/* Order Processing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-5 h-5 text-gold" />
              <h2 className="font-heading text-xl text-foreground tracking-wide">
                Order Processing
              </h2>
            </div>
            <div className="bg-card/30 border border-border/30 p-6 space-y-3">
              <p className="text-sm text-foreground/60">
                Orders are processed within{" "}
                <span className="text-foreground">1–3 business days</span>.
              </p>
              <p className="text-sm text-foreground/60">
                Orders placed on weekends or public holidays will be processed
                on the next business day.
              </p>
            </div>
          </motion.div>

          {/* Packaging */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Package className="w-5 h-5 text-gold" />
              <h2 className="font-heading text-xl text-foreground tracking-wide">
                Packaging & Care
              </h2>
            </div>
            <div className="bg-card/30 border border-border/30 p-6">
              <p className="text-sm text-foreground/60">
                We ensure every order is packaged carefully and delivered in
                perfect condition. Each Yagel fragrance is wrapped in premium
                packaging that reflects the luxury of the product inside.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
