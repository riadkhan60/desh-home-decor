/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { X, Loader2, Star } from 'lucide-react';
import {
  createReview,
  updateReview,
  deleteReview,
} from '@/lib/actions/reviews';

export interface ReviewFormData {
  productId: string;
  userName: string;
  userEmail: string;
  rating: number;
  comment: string;
  image: string;
  screnShotReviewImage: string;
  source: string;
  url: string;
  isShowcase: boolean;
  isApproved: boolean;
}

interface ReviewFormProps {
  initialData?: ReviewFormData & { id?: string };
  mode: 'create' | 'edit';
  reviewId?: string;
  products?: Array<{ id: string; name: string }>;
}

export function ReviewForm({
  initialData,
  mode,
  reviewId,
  products = [],
}: ReviewFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState<ReviewFormData>({
    productId: initialData?.productId || '',
    userName: initialData?.userName || '',
    userEmail: initialData?.userEmail || '',
    rating: initialData?.rating || 0,
    comment: initialData?.comment || '',
    image: initialData?.image || '',
    screnShotReviewImage: initialData?.screnShotReviewImage || '',
    source: initialData?.source || '',
    url: initialData?.url || '',
    isShowcase: initialData?.isShowcase ?? false,
    isApproved: initialData?.isApproved ?? false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const reviewData = {
        productId: formData.productId || null,
        userName: formData.userName || null,
        userEmail: formData.userEmail || null,
        rating: formData.rating || null,
        comment: formData.comment || null,
        image: formData.image || null,
        screnShotReviewImage: formData.screnShotReviewImage || null,
        source: formData.source || null,
        url: formData.url || null,
        isShowcase: formData.isShowcase,
        isApproved: formData.isApproved,
      };

      if (mode === 'create') {
        const res = await createReview(reviewData);
        if (!res.success)
          throw new Error(res.error || 'Failed to create review');
      } else if (mode === 'edit' && reviewId) {
        const res = await updateReview(reviewId, reviewData);
        if (!res.success)
          throw new Error(res.error || 'Failed to update review');
      }
      router.push('/admin/reviews');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to save review');
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (mode !== 'edit' || !reviewId) return;
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    setIsLoading(true);
    try {
      const res = await deleteReview(reviewId);
      if (!res.success) throw new Error(res.error || 'Failed to delete review');
      router.push('/admin/reviews');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to delete review');
      setIsLoading(false);
    }
  };

  const uploadImage = async (
    file: File,
    field: 'image' | 'screnShotReviewImage',
  ) => {
    const uploadFormData = new FormData();
    uploadFormData.append('image', file);
    setIsUploading(true);

    try {
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: uploadFormData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Upload failed');

      setFormData((prev) => ({ ...prev, [field]: data.url }));
    } catch (err: any) {
      alert(err.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const renderStarRating = () => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setFormData({ ...formData, rating: star })}
            className="transition hover:scale-110"
          >
            <Star
              className={`h-6 w-6 ${
                star <= formData.rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-muted-foreground">
          {formData.rating > 0
            ? `${formData.rating} star${formData.rating > 1 ? 's' : ''}`
            : 'No rating'}
        </span>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="rounded-xl border bg-card p-6 space-y-4">
        <h2 className="text-lg font-semibold">Review Type & Source</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isShowcase"
              checked={formData.isShowcase}
              onChange={(e) =>
                setFormData({ ...formData, isShowcase: e.target.checked })
              }
              className="h-4 w-4 rounded border-gray-300"
            />
            <label
              htmlFor="isShowcase"
              className="text-sm font-medium cursor-pointer"
            >
              Showcase Review
            </label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isApproved"
              checked={formData.isApproved}
              onChange={(e) =>
                setFormData({ ...formData, isApproved: e.target.checked })
              }
              className="h-4 w-4 rounded border-gray-300"
            />
            <label
              htmlFor="isApproved"
              className="text-sm font-medium cursor-pointer"
            >
              Approved
            </label>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-2">
              Product (Optional)
            </label>
            <select
              value={formData.productId}
              onChange={(e) =>
                setFormData({ ...formData, productId: e.target.value })
              }
              className="w-full rounded-lg border bg-background px-4 py-2 text-sm"
            >
              <option value="">-- No Product --</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-2">
              Source (e.g., Google, Facebook)
            </label>
            <input
              type="text"
              value={formData.source}
              onChange={(e) =>
                setFormData({ ...formData, source: e.target.value })
              }
              placeholder="e.g., Google Reviews, Trustpilot"
              className="w-full rounded-lg border bg-background px-4 py-2 text-sm"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-2">
              Review URL (Optional)
            </label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) =>
                setFormData({ ...formData, url: e.target.value })
              }
              placeholder="https://maps.google.com/..."
              className="w-full rounded-lg border bg-background px-4 py-2 text-sm"
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-6 space-y-4">
        <h2 className="text-lg font-semibold">User Information</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-2">User Name</label>
            <input
              type="text"
              value={formData.userName}
              onChange={(e) =>
                setFormData({ ...formData, userName: e.target.value })
              }
              placeholder="John Doe"
              className="w-full rounded-lg border bg-background px-4 py-2 text-sm"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-2">User Email</label>
            <input
              type="email"
              value={formData.userEmail}
              onChange={(e) =>
                setFormData({ ...formData, userEmail: e.target.value })
              }
              placeholder="user@example.com"
              className="w-full rounded-lg border bg-background px-4 py-2 text-sm"
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-6 space-y-4">
        <h2 className="text-lg font-semibold">Review Content</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Rating</label>
            {renderStarRating()}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Comment</label>
            <textarea
              value={formData.comment}
              onChange={(e) =>
                setFormData({ ...formData, comment: e.target.value })
              }
              rows={4}
              placeholder="Write the review comment..."
              className="w-full rounded-lg border bg-background px-4 py-2 text-sm"
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-6 space-y-4">
        <h2 className="text-lg font-semibold">Images</h2>

        <div className="space-y-4">
          {/* Screenshot Review Image */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Screenshot Review Image
            </label>
            {formData.screnShotReviewImage && (
              <div className="relative aspect-video w-full max-w-xs overflow-hidden rounded-lg border bg-muted mb-3">
                <Image
                  src={formData.screnShotReviewImage}
                  alt="Screenshot preview"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, screnShotReviewImage: '' })
                  }
                  className="absolute right-2 top-2 rounded-full bg-destructive p-1.5 text-white hover:bg-destructive/90"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            <div className="flex gap-2">
              <input
                type="url"
                value={formData.screnShotReviewImage}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    screnShotReviewImage: e.target.value,
                  })
                }
                placeholder="Or paste screenshot URL..."
                className="flex-1 rounded-lg border bg-background px-4 py-2 text-sm"
              />
            </div>

            <div className="flex items-center gap-3 mt-2">
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border bg-background px-4 py-2 text-sm font-medium transition hover:bg-muted">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) uploadImage(file, 'screnShotReviewImage');
                  }}
                  className="hidden"
                  disabled={isUploading}
                />
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Uploading...
                  </>
                ) : (
                  '📤 Upload Screenshot'
                )}
              </label>
            </div>
          </div>

          {/* Regular Image */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Additional Image
            </label>
            {formData.image && (
              <div className="relative aspect-video w-full max-w-xs overflow-hidden rounded-lg border bg-muted mb-3">
                <Image
                  src={formData.image}
                  alt="Image preview"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, image: '' })}
                  className="absolute right-2 top-2 rounded-full bg-destructive p-1.5 text-white hover:bg-destructive/90"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            <div className="flex gap-2">
              <input
                type="url"
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                placeholder="Or paste image URL..."
                className="flex-1 rounded-lg border bg-background px-4 py-2 text-sm"
              />
            </div>

            <div className="flex items-center gap-3 mt-2">
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border bg-background px-4 py-2 text-sm font-medium transition hover:bg-muted">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) uploadImage(file, 'image');
                  }}
                  className="hidden"
                  disabled={isUploading}
                />
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Uploading...
                  </>
                ) : (
                  '📤 Upload Image'
                )}
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isLoading || isUploading}
            className="flex-1 rounded-lg bg-foreground px-6 py-2 text-sm font-medium text-background transition hover:bg-foreground/90 disabled:opacity-50 sm:flex-none"
          >
            {isLoading
              ? 'Saving...'
              : mode === 'edit'
                ? 'Update Review'
                : 'Create Review'}
          </button>

          <button
            type="button"
            onClick={() => router.back()}
            disabled={isLoading}
            className="flex-1 rounded-lg border px-6 py-2 text-sm font-medium transition hover:bg-muted disabled:opacity-50 sm:flex-none"
          >
            Cancel
          </button>
        </div>

        {mode === 'edit' && reviewId && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={isLoading}
            className="rounded-lg border border-destructive bg-destructive/10 px-6 py-2 text-sm font-medium text-destructive transition hover:bg-destructive/20 disabled:opacity-50"
          >
            Delete
          </button>
        )}
      </div>
    </form>
  );
}
