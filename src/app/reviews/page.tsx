import { Star } from "lucide-react";
import { getSupabase } from "@/lib/supabase";

// Re-fetch periodically so new reviews appear without a redeploy.
export const revalidate = 300;

export const metadata = {
  title: "Reviews · Yagel",
  description: "What customers say about Yagel.",
};

interface Review {
  id: string;
  product_id: string;
  product_name: string;
  reviewer_name: string;
  rating: number;
  comment: string;
  location?: string;
  submitted_at: string;
}

async function getAllReviews(): Promise<Review[]> {
  const { data, error } = await getSupabase()
    .from("reviews")
    .select("id, product_id, product_name, reviewer_name, rating, comment, location, submitted_at")
    .not("submitted_at", "is", null)
    .order("submitted_at", { ascending: false })
    .limit(500);
  if (error) {
    console.error("[reviews] failed to load reviews:", error);
    return [];
  }
  return data ?? [];
}

export default async function ReviewsPage() {
  const reviews = await getAllReviews();

  return (
    <div className="pt-28 pb-24">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <p className="text-[10px] tracking-[0.4em] uppercase text-gold/50 mb-2">
            Testimonials
          </p>
          <h1 className="font-heading text-3xl md:text-4xl tracking-wide text-foreground">
            What They <span className="text-gold italic">Say</span>
          </h1>
        </div>

        {reviews.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm">
            No reviews yet — be the first to share your experience.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((r) => (
              <div
                key={r.id}
                className="border border-border/30 bg-card/20 p-6 flex flex-col"
              >
                <div className="flex items-center justify-between gap-3 mb-1.5">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${s <= r.rating ? "fill-gold text-gold" : "fill-transparent text-gold/20"}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(r.submitted_at).toLocaleDateString("en-GB", {
                      year: "numeric", month: "short", day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center flex-wrap gap-x-2 gap-y-0.5 mb-3">
                  <span className="text-sm font-medium text-foreground/80">
                    {r.reviewer_name || "Anonymous"}
                  </span>
                  {r.location && (
                    <span className="text-xs text-muted-foreground">
                      · {r.location}
                    </span>
                  )}
                </div>
                <p className="text-sm text-foreground/60 leading-relaxed italic whitespace-pre-line">
                  &ldquo;{r.comment}&rdquo;
                </p>
                <p className="text-xs text-muted-foreground mt-4 pt-4 border-t border-border/20">
                  {r.product_name}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
