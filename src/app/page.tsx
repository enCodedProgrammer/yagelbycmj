import HeroSection from "@/components/home/HeroSection";
import MaskHeroSection from "@/components/home/MaskHeroSection";
import AboutSection from "@/components/home/AboutSection";
import ProductsSection from "@/components/home/ProductsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CTASection from "@/components/home/CTASection";
import AdSection from "@/components/home/AdSection";

export default function Home() {
  return (
    <>
      {/* <HeroSection /> */}
      <MaskHeroSection />
      <AboutSection />
      <ProductsSection />
      <AdSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
