/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { X, Loader2 } from 'lucide-react';
import {
  createSlider,
  updateSlider,
  deleteSlider,
} from '@/lib/actions/sliders';

export interface SliderFormData {
  title: string;
  description: string;
  image: string;
  phoneImage: string;
  link: string;
  buttonText: string;
  isActive: boolean;
  order: number;
}

interface SliderFormProps {
  initialData?: SliderFormData & { id?: string };
  mode: 'create' | 'edit';
  sliderId?: string;
}

export function SliderForm({ initialData, mode, sliderId }: SliderFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  const [formData, setFormData] = useState<SliderFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    image: initialData?.image || '',
    phoneImage: initialData?.phoneImage || '',
    link: initialData?.link || '',
    buttonText: initialData?.buttonText || '',
    isActive: initialData?.isActive ?? true,
    order: initialData?.order || 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!formData.image) {
      setError('Desktop Image is required');
      setIsLoading(false);
      return;
    }

    try {
      if (mode === 'create') {
        const res = await createSlider(formData);
        if (!res.success) throw new Error(res.error);
      } else if (mode === 'edit' && sliderId) {
        const res = await updateSlider(sliderId, formData);
        if (!res.success) throw new Error(res.error);
      }
      router.push('/admin/sliders');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to save slider');
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (mode !== 'edit' || !sliderId) return;
    if (!window.confirm('Are you sure you want to delete this slider?')) return;

    setIsLoading(true);
    try {
      const res = await deleteSlider(sliderId);
      if (!res.success) throw new Error(res.error);
      router.push('/admin/sliders');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to delete slider');
      setIsLoading(false);
    }
  };

  const uploadImage = async (file: File, field: 'image' | 'phoneImage') => {
    const uploadFormData = new FormData();
    uploadFormData.append('image', file);
    setUploadingField(field);

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
      setUploadingField(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl ">
      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="rounded-xl border bg-card p-6 space-y-4">
        <h2 className="text-lg font-semibold">Slider Content</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full rounded-lg border bg-background px-4 py-2 text-sm"
              placeholder="Summer Sale"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={2}
              className="w-full rounded-lg border bg-background px-4 py-2 text-sm"
              placeholder="Up to 50% off on all items..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Button Text
            </label>
            <input
              type="text"
              value={formData.buttonText}
              onChange={(e) =>
                setFormData({ ...formData, buttonText: e.target.value })
              }
              className="w-full rounded-lg border bg-background px-4 py-2 text-sm"
              placeholder="Shop Now"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Link / URL</label>
            <input
              type="text"
              value={formData.link}
              onChange={(e) =>
                setFormData({ ...formData, link: e.target.value })
              }
              className="w-full rounded-lg border bg-background px-4 py-2 text-sm"
              placeholder="/collections/summer"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Desktop Image */}
        <div className="rounded-xl border bg-card p-6 space-y-4">
          <h2 className="text-lg font-semibold">Desktop Image *</h2>

          <div className="space-y-3">
            {formData.image && (
              <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
                <Image
                  src={formData.image}
                  alt="Desktop preview"
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

            <label className="flex cursor-pointer items-center gap-2 rounded-lg border bg-background px-4 py-2 text-sm font-medium transition hover:bg-muted w-fit">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadImage(file, 'image');
                }}
                className="hidden"
                disabled={!!uploadingField}
              />
              {uploadingField === 'image' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Uploading...
                </>
              ) : (
                '📤 Upload Desktop Image'
              )}
            </label>
          </div>
        </div>

        {/* Mobile Image */}
        <div className="rounded-xl border bg-card p-6 space-y-4">
          <h2 className="text-lg font-semibold">Phone Image (Optional)</h2>

          <div className="space-y-3">
            {formData.phoneImage && (
              <div className="relative aspect-9/16 w-1/2 mx-auto overflow-hidden rounded-lg border bg-muted">
                <Image
                  src={formData.phoneImage}
                  alt="Phone preview"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, phoneImage: '' })}
                  className="absolute right-2 top-2 rounded-full bg-destructive p-1.5 text-white hover:bg-destructive/90"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            <div className="flex gap-2">
              <input
                type="url"
                value={formData.phoneImage}
                onChange={(e) =>
                  setFormData({ ...formData, phoneImage: e.target.value })
                }
                placeholder="Or paste image URL..."
                className="flex-1 rounded-lg border bg-background px-4 py-2 text-sm"
              />
            </div>

            <label className="flex cursor-pointer items-center gap-2 rounded-lg border bg-background px-4 py-2 text-sm font-medium transition hover:bg-muted w-fit">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadImage(file, 'phoneImage');
                }}
                className="hidden"
                disabled={!!uploadingField}
              />
              {uploadingField === 'phoneImage' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Uploading...
                </>
              ) : (
                '📤 Upload Mobile Image'
              )}
            </label>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-6 space-y-4">
        <h2 className="text-lg font-semibold">Settings</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-2">
              Display Order
            </label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  order: parseInt(e.target.value) || 0,
                })
              }
              className="w-full rounded-lg border bg-background px-4 py-2 text-sm"
            />
          </div>

          <div className="flex items-end pb-3">
            <label className="flex items-center gap-2 text-sm font-medium cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
                className="h-4 w-4 rounded border-gray-300"
              />
              Active (Visible on site)
            </label>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isLoading || !!uploadingField}
            className="flex-1 rounded-lg bg-foreground px-6 py-2 text-sm font-medium text-background transition hover:bg-foreground/90 disabled:opacity-50 sm:flex-none"
          >
            {isLoading
              ? 'Saving...'
              : mode === 'edit'
                ? 'Update Slider'
                : 'Create Slider'}
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

        {mode === 'edit' && sliderId && (
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
