import MaskHeroSection from "@/components/home/MaskHeroSection";
import AboutSection from "@/components/home/AboutSection";
import ProductsSection from "@/components/home/ProductsSection";
import AdSection from "@/components/home/AdSection";
import GallerySection from "@/components/home/GallerySection";
import TestimonialsSection, { Review } from "@/components/home/TestimonialsSection";
import CTASection from "@/components/home/CTASection";
import { getSupabase } from "@/lib/supabase";

// Re-fetch reviews periodically so new ones appear without a redeploy.
export const revalidate = 300;

async function getReviews(): Promise<Review[]> {
  const { data, error } = await getSupabase()
    .from("reviews")
    .select("id, product_id, product_name, reviewer_name, rating, comment, location, submitted_at")
    .not("submitted_at", "is", null)
    .order("submitted_at", { ascending: false })
    .limit(12);
  if (error) {
    console.error("[home] failed to load reviews:", error);
    return [];
  }
  return data ?? [];
}

export default async function Home() {
  const reviews = await getReviews();

  return (
    <>
      <MaskHeroSection />
      <AboutSection />
      <ProductsSection />

      <GallerySection />
      <TestimonialsSection reviews={reviews} />
      <CTASection />
    </>
  );
}
