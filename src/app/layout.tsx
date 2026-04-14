import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { CountryProvider } from "@/lib/country-context";
import { CartProvider } from "@/lib/cart-context";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import SmoothScroll from "@/components/ui/smooth-scroll";
import CustomCursor from "@/components/ui/custom-cursor";

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
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans cursor-none md:cursor-none">
        <CountryProvider>
          <CartProvider>
            <SmoothScroll />
            <CustomCursor />
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <CartDrawer />
          </CartProvider>
        </CountryProvider>
      </body>
    </html>
  );
}
