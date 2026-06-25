import type { Metadata } from "next";
import { Playfair_Display, Inter, Oswald, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { CountryProvider } from "@/lib/country-context";
import { CartProvider } from "@/lib/cart-context";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import CustomCursor from "@/components/CustomCursor";
import SmoothScroll from "@/components/SmoothScroll";

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const oswald = Oswald({
  variable: "--font-condensed",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Yagel | A Signature of Elegance and Presence",
  description:
    "Discover Yagel — premium Extrait de Parfum fragrances crafted for elegance, warmth, and lasting presence. Designed for him and her.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} ${oswald.variable} ${cormorant.variable} h-full antialiased`}
      style={{ cursor: "none" }}
    >
      <body className="min-h-full flex flex-col font-sans">
        <CountryProvider>
          <CartProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <CartDrawer />
            <CustomCursor />
            <SmoothScroll />
          </CartProvider>
        </CountryProvider>
      </body>
    </html>
  );
}
