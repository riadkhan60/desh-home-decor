import { ReviewForm, ReviewFormData } from '@/components/admin/review-form';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditReviewPage({ params }: PageProps) {
  const { id } = await params;

  const [review, products] = await Promise.all([
    prisma.review.findUnique({
      where: { id },
    }),
    prisma.product.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    }),
  ]);

  if (!review) {
    notFound();
  }

  // Map to form data
  const initialData: ReviewFormData & { id: string } = {
    id: review.id,
    productId: review.productId || '',
    userName: review.userName || '',
    userEmail: review.userEmail || '',
    rating: review.rating || 0,
    comment: review.comment || '',
    image: review.image || '',
    screnShotReviewImage: review.screnShotReviewImage || '',
    source: review.source || '',
    url: review.url || '',
    isShowcase: review.isShowcase,
    isApproved: review.isApproved,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Edit Review</h1>
      </div>
      <ReviewForm
        mode="edit"
        initialData={initialData}
        reviewId={id}
        products={products}
      />
    </div>
  );
}
