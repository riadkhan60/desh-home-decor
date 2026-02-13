/* eslint-disable react/no-unescaped-entities */
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Star } from 'lucide-react';
import { getReviews } from '@/lib/actions/reviews';
import { ReviewApprovalToggle } from '@/components/admin/review-approval-toggle';

export const dynamic = 'force-dynamic';

export default async function ReviewsPage() {
  const { data: reviews, error } = await getReviews();

  if (error || !reviews) {
    return (
      <div className="p-8 text-center text-destructive">
        Failed to load reviews.
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Reviews
          </h1>
          <p className="mt-1 text-sm text-muted-foreground sm:mt-2 sm:text-base">
            Manage product reviews and testimonials
          </p>
        </div>
        <Link
          href="/admin/reviews/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:bg-foreground/90"
        >
          <Plus className="h-4 w-4" />
          Add Review
        </Link>
      </div>

      {/* Desktop Table View */}
      <div className="hidden rounded-2xl border bg-card md:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                  Comment
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                  Source
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {reviews.map((review) => (
                <tr key={review.id} className="transition hover:bg-muted/30">
                  <td className="px-6 py-4">
                    {review.screnShotReviewImage || review.image ? (
                      <div className="relative h-12 w-12 overflow-hidden rounded-lg border bg-muted">
                        <Image
                          src={
                            review.screnShotReviewImage || review.image || ''
                          }
                          alt="Review"
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg border bg-muted text-xs text-muted-foreground">
                        No Img
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium">
                      {review.userName || 'Anonymous'}
                    </div>
                    {review.userEmail && (
                      <div className="text-xs text-muted-foreground">
                        {review.userEmail}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {review.rating ? (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{review.rating}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs truncate text-sm">
                      {review.comment || '—'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        review.isShowcase
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                      }`}
                    >
                      {review.isShowcase ? 'Showcase' : 'Product'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-muted-foreground">
                      {review.source || '—'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <ReviewApprovalToggle
                      id={review.id}
                      isApproved={review.isApproved}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/reviews/${review.id}`}
                      className="text-sm font-medium text-foreground/80 transition hover:text-foreground hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {reviews.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">No reviews yet</p>
            <Link
              href="/admin/reviews/new"
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium hover:underline"
            >
              <Plus className="h-4 w-4" />
              Add your first review
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Card View */}
      <div className="space-y-4 md:hidden">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="rounded-xl border bg-card p-4 space-y-3"
          >
            <div className="flex gap-3">
              {/* Review Image */}
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted border">
                {review.screnShotReviewImage || review.image ? (
                  <Image
                    src={review.screnShotReviewImage || review.image || ''}
                    alt="Review"
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                    No img
                  </div>
                )}
              </div>

              {/* Review Info */}
              <div className="flex-1 space-y-1.5">
                <h3 className="font-semibold line-clamp-1 leading-tight">
                  {review.userName || 'Anonymous'}
                </h3>
                {review.userEmail && (
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {review.userEmail}
                  </p>
                )}
                <div className="flex items-center gap-2">
                  {review.rating ? (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">
                        {review.rating}
                      </span>
                    </div>
                  ) : null}
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      review.isShowcase
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                    }`}
                  >
                    {review.isShowcase ? 'Showcase' : 'Product'}
                  </span>
                </div>
              </div>
            </div>

            {/* Comment */}
            {review.comment && (
              <div className="border-t pt-3">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  "{review.comment}"
                </p>
              </div>
            )}

            {/* Details Grid */}
            <div className="grid grid-cols-3 gap-3 border-t pt-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Source</p>
                <p className="text-xs font-medium truncate">
                  {review.source || '—'}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <ReviewApprovalToggle
                  id={review.id}
                  isApproved={review.isApproved}
                />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Created</p>
                <p className="text-xs">
                  {new Date(review.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>

            {/* Edit Button */}
            <Link
              href={`/admin/reviews/${review.id}`}
              className="flex w-full items-center justify-center gap-2 rounded-lg border bg-background px-4 py-2 text-sm font-medium transition hover:bg-muted"
            >
              Edit Review
            </Link>
          </div>
        ))}

        {reviews.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">No reviews yet</p>
            <Link
              href="/admin/reviews/new"
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium hover:underline"
            >
              <Plus className="h-4 w-4" />
              Add your first review
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
