import MaskHeroSection from "@/components/home/MaskHeroSection";
import AboutSection from "@/components/home/AboutSection";
import ProductsSection from "@/components/home/ProductsSection";
import AdSection from "@/components/home/AdSection";
import GallerySection from "@/components/home/GallerySection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CTASection from "@/components/home/CTASection";

export default function Home() {
  return (
    <>
      <MaskHeroSection />
      <AboutSection />
      <ProductsSection />

      <GallerySection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
