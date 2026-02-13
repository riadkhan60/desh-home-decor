import { Container } from '@/components/container';
import { getShowcaseReviews } from '@/lib/actions/reviews';
import { ShowcaseReviewsSlider } from '@/components/showcase-reviews-slider';

export default async function HomeShowcaseReviewsSection() {
  const reviews = await getShowcaseReviews(10);

  if (!reviews.length) return null;

  const mapped = reviews.map((r) => ({
    id: r.id,
    userName: r.userName,
    source: r.source,
    rating: r.rating,
    comment: r.comment,
    image: r.image,
    screnShotReviewImage: r.screnShotReviewImage,
    url: r.url,
  }));

  return (
    <section className="pb-20 pt-4">
      <Container>
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
            What our customers say
          </h2>
        </div>
      </Container>

      <Container>
        <ShowcaseReviewsSlider reviews={mapped} />
      </Container>
    </section>
  );
}
