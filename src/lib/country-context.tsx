"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { countries, type Country } from "./data";

interface CountryContextType {
  country: Country;
  setCountry: (country: Country) => void;
}

const CountryContext = createContext<CountryContextType | undefined>(undefined);

export function CountryProvider({ children }: { children: ReactNode }) {
  const [country, setCountryState] = useState<Country>(countries[0]); // Default to UK

  useEffect(() => {
    const saved = localStorage.getItem("yagel-country");
    if (saved) {
      const found = countries.find((c) => c.code === saved);
      if (found) setCountryState(found);
    }
  }, []);

  const setCountry = (c: Country) => {
    setCountryState(c);
    localStorage.setItem("yagel-country", c.code);
  };

  return (
    <CountryContext.Provider value={{ country, setCountry }}>
      {children}
    </CountryContext.Provider>
  );
}

export function useCountry() {
  const ctx = useContext(CountryContext);
  if (!ctx) throw new Error("useCountry must be used within CountryProvider");
  return ctx;
}
