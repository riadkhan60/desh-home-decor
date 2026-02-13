import Image from "next/image";

interface Review {
  id: string;
  userName: string | null;
  rating: number | null;
  comment: string | null;
  image: string | null;
  createdAt: Date;
}

interface ProductReviewsProps {
  reviews: Review[];
}

function Stars({ rating }: { rating: number }) {
  const full = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <div className="flex items-center gap-0.5 text-sm">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={i < full ? "text-yellow-500" : "text-muted-foreground/40"}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export function ProductReviews({ reviews }: ProductReviewsProps) {
  if (reviews.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-sm text-muted-foreground">
          No reviews yet. Be the first to review this product!
        </p>
      </div>
    );
  }

  const averageRating =
    reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="flex items-center gap-4 rounded-xl border bg-card p-6">
        <div className="text-center">
          <div className="text-3xl font-bold">{averageRating.toFixed(1)}</div>
          <Stars rating={averageRating} />
          <p className="mt-1 text-xs text-muted-foreground">
            {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
          </p>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="rounded-xl border bg-card p-5 space-y-3"
          >
            <div className="flex items-start gap-3">
              {review.image && (
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted">
                  <Image
                    src={review.image}
                    alt={review.userName ?? "User"}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">
                    {review.userName ?? "Anonymous"}
                  </span>
                  {typeof review.rating === "number" && (
                    <Stars rating={review.rating} />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(review.createdAt).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            {review.comment && (
              <p className="text-sm leading-relaxed text-muted-foreground">
                {review.comment}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
