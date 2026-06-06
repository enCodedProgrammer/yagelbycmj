import HeroSection from "@/components/home/HeroSection";
import HeroSection2 from "@/components/home/HeroSection2";
import AboutSection from "@/components/home/AboutSection";
import ProductsSection from "@/components/home/ProductsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CTASection from "@/components/home/CTASection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <ProductsSection />
      <HeroSection2 />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
