'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';

type ReviewCard = {
  id: string;
  userName: string | null;
  source: string | null;
  rating: number | null;
  comment: string | null;
  image: string | null;
  screnShotReviewImage: string | null;
  url: string | null;
};

function Stars({ rating }: { rating: number }) {
  const full = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <div className="flex items-center gap-0.5 text-xs">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={i < full ? 'text-yellow-500' : 'text-muted-foreground/40'}
        >
          ★
        </span>
      ))}
    </div>
  );
}

interface ShowcaseReviewsSliderProps {
  reviews: ReviewCard[];
}

export function ShowcaseReviewsSlider({ reviews }: ShowcaseReviewsSliderProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });
  const [isHovered, setIsHovered] = useState(false);

  // Autoplay: move to next slide every 5 seconds
  useEffect(() => {
    if (!emblaApi || isHovered) return;

    const id = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);

    return () => clearInterval(id);
  }, [emblaApi, isHovered]);

  // Debug: Check if screnShotReviewImage data is coming through
  useEffect(() => {
    console.log('Reviews data:', reviews);
  }, [reviews]);

  if (!reviews.length) return null;

  return (
    <div
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="embla" ref={emblaRef}>
        <div className="embla__container flex h-full">
          {reviews.map((review) => {
            const CardContent = (
              <div className="flex h-full flex-col overflow-hidden rounded-2xl border bg-card/80 p-5 shadow-sm transition hover:shadow-md sm:p-6">
                <div className="flex items-start gap-4">
                  {review.image && (
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-muted sm:h-14 sm:w-14">
                      <Image
                        src={review.image}
                        alt={review.userName ?? 'Customer'}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col gap-1">
                    <span className="text-sm font-medium leading-tight sm:text-base">
                      {review.userName ?? 'Happy customer'}
                    </span>
                    <span className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                      {review.source ?? 'Customer'}
                    </span>
                    {typeof review.rating === 'number' && (
                      <Stars rating={review.rating} />
                    )}
                  </div>
                </div>

                <div className="mt-5 min-h-20 sm:min-h-24">
                  {review.comment && (
                    <p className="line-clamp-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                      &ldquo;{review.comment}&rdquo;
                    </p>
                  )}
                </div>

                {review.screnShotReviewImage && (
                  <div className="mt-4 relative aspect-4/5 w-full overflow-hidden rounded-xl bg-muted">
                    <Image
                      src={review.screnShotReviewImage}
                      alt="Review screenshot"
                      fill
                      className="object-cover"
                      sizes="(min-width: 768px) 33vw, 100vw"
                    />
                  </div>
                )}
              </div>
            );

            return (
              <div
                key={review.id}
                className="embla__slide shrink-0 basis-[calc(100%-1rem)] pr-4 pl-1 md:basis-[33.333%]"
              >
                {review.url ? (
                  <a
                    href={review.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block h-full cursor-pointer transition-shadow hover:shadow-md"
                  >
                    {CardContent}
                  </a>
                ) : (
                  CardContent
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
