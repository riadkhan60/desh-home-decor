import { ReviewForm } from '@/components/admin/review-form';
import { prisma } from '@/lib/prisma';

export default async function NewReviewPage() {
  // Fetch products for the dropdown
  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">New Review</h1>
      </div>
      <ReviewForm mode="create" products={products} />
    </div>
  );
}
