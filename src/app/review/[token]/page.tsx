"use client";

import { useState, useEffect, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";

interface ReviewData {
  product_id: string;
  product_name: string;
  reviewer_name: string;
  alreadySubmitted: boolean;
}

export default function ReviewPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const [reviewData, setReviewData] = useState<ReviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/reviews/${token}`)
      .then((r) => {
        if (r.status === 404) { setNotFound(true); return null; }
        return r.json();
      })
      .then((data) => {
        if (data) {
          setReviewData(data);
          setName(data.reviewer_name);
          if (data.alreadySubmitted) setSubmitted(true);
        }
      })
      .finally(() => setLoading(false));
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) { setError("Please select a star rating."); return; }
    if (!comment.trim()) { setError("Please write a short comment."); return; }
    setError("");
    setSubmitting(true);

    const res = await fetch(`/api/reviews/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reviewer_name: name, rating, comment }),
    });

    setSubmitting(false);
    if (res.ok) {
      setSubmitted(true);
    } else {
      const data = await res.json();
      setError(data.error ?? "Something went wrong. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-gold animate-spin" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <p className="font-heading text-2xl text-foreground mb-3">Invalid Link</p>
          <p className="text-muted-foreground text-sm mb-8">
            This review link is invalid or has expired.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-gold text-primary-foreground text-sm tracking-[0.15em] uppercase"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-24">
      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="thanks"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <CheckCircle className="w-16 h-16 text-gold mx-auto mb-6" />
              <h1 className="font-heading text-3xl tracking-wide text-foreground mb-4">
                Thank You
              </h1>
              <p className="text-muted-foreground mb-8">
                Your review has been published. We truly appreciate your feedback.
              </p>
              <Link
                href="/"
                className="inline-block px-8 py-3 bg-gold text-primary-foreground text-sm tracking-[0.15em] uppercase hover:shadow-[0_0_30px_rgba(196,168,120,0.3)] transition-all duration-500"
              >
                Back to Yagel
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Header */}
              <div className="mb-10">
                <p className="text-[10px] tracking-[0.4em] uppercase text-gold/50 mb-3">
                  Verified Purchase
                </p>
                <h1 className="font-heading text-3xl tracking-wide text-foreground mb-2">
                  Leave a Review
                </h1>
                <p className="text-muted-foreground text-sm">
                  {reviewData?.product_name}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Star rating */}
                <div>
                  <label className="block text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">
                    Your Rating
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="transition-transform duration-150 hover:scale-110"
                        aria-label={`${star} star${star > 1 ? "s" : ""}`}
                      >
                        <Star
                          className={`w-8 h-8 transition-colors duration-150 ${
                            star <= (hoverRating || rating)
                              ? "fill-gold text-gold"
                              : "fill-transparent text-gold/30"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sophia M."
                    className="w-full bg-card/30 border border-border/40 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-gold/40 transition-colors"
                  />
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
                    Your Review
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    placeholder="Share your experience with this fragrance..."
                    className="w-full bg-card/30 border border-border/40 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-gold/40 transition-colors resize-none"
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-400">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-gold text-primary-foreground text-sm tracking-[0.2em] uppercase hover:shadow-[0_0_30px_rgba(196,168,120,0.3)] transition-all duration-500 disabled:opacity-60 disabled:pointer-events-none flex items-center justify-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
