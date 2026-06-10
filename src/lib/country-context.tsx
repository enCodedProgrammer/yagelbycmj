"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { countries, type Country } from "./data";

interface CountryContextType {
  country: Country;
  loading: boolean;
}

const CountryContext = createContext<CountryContextType | undefined>(undefined);

export function CountryProvider({ children }: { children: ReactNode }) {
  const [country, setCountry] = useState<Country>(countries[0]); // Default UK
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const forced = process.env.NEXT_PUBLIC_FORCE_COUNTRY;
    if (forced) {
      const match = countries.find((c) => c.code === forced);
      if (match) setCountry(match);
      setLoading(false);
      return;
    }

    async function detectCountry() {
      try {
        const res = await fetch("https://ipapi.co/json/");
        if (!res.ok) throw new Error("IP lookup failed");
        const data = await res.json();
        const code = data.country_code; // e.g. "GB", "US", "NG"
        const match = countries.find((c) => c.code === code);
        if (match) {
          setCountry(match);
        }
        // If no match (user not in UK/US/NG), keep default UK
      } catch {
        // On error, keep default UK
      } finally {
        setLoading(false);
      }
    }

    detectCountry();
  }, []);

  return (
    <CountryContext.Provider value={{ country, loading }}>
      {children}
    </CountryContext.Provider>
  );
}

export function useCountry() {
  const ctx = useContext(CountryContext);
  if (!ctx) throw new Error("useCountry must be used within CountryProvider");
  return ctx;
}
