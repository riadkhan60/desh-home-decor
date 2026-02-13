/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { X, Loader2 } from 'lucide-react';
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from '@/lib/actions/categories';

export interface CategoryFormData {
  name: string;
  slug: string;
  description: string;
  image: string;
  isActive: boolean;
  order: number;
}

interface CategoryFormProps {
  initialData?: CategoryFormData & { id?: string };
  mode: 'create' | 'edit';
  categoryId?: string;
}

export function CategoryForm({
  initialData,
  mode,
  categoryId,
}: CategoryFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState<CategoryFormData>({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    description: initialData?.description || '',
    image: initialData?.image || '',
    isActive: initialData?.isActive ?? true,
    order: initialData?.order || 0,
  });

  // Auto-generate slug from name if in create mode and slug is empty or matches previous auto-gen
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    if (mode === 'create') {
      const slug = newName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData((prev) => ({ ...prev, name: newName, slug }));
    } else {
      setFormData((prev) => ({ ...prev, name: newName }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (mode === 'create') {
        const res = await createCategory(formData);
        if (!res.success) throw new Error(res.error);
      } else if (mode === 'edit' && categoryId) {
        const res = await updateCategory(categoryId, formData);
        if (!res.success) throw new Error(res.error);
      }
      router.push('/admin/categories');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to save category');
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (mode !== 'edit' || !categoryId) return;
    if (!window.confirm('Are you sure you want to delete this category?'))
      return;

    setIsLoading(true);
    try {
      const res = await deleteCategory(categoryId);
      if (!res.success) throw new Error(res.error);
      router.push('/admin/categories');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to delete category');
      setIsLoading(false);
    }
  };

  const uploadImage = async (file: File) => {
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

      setFormData((prev) => ({ ...prev, image: data.url }));
    } catch (err: any) {
      alert(err.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl ">
      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="rounded-xl border bg-card p-6 space-y-4">
        <h2 className="text-lg font-semibold">Category Details</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-2">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={handleNameChange}
              required
              className="w-full rounded-lg border bg-background px-4 py-2 text-sm"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-2">Slug *</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
              required
              className="w-full rounded-lg border bg-background px-4 py-2 text-sm text-muted-foreground"
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
              rows={3}
              className="w-full rounded-lg border bg-background px-4 py-2 text-sm"
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-6 space-y-4">
        <h2 className="text-lg font-semibold">Category Image</h2>

        <div className="space-y-3">
          {formData.image && (
            <div className="relative aspect-video w-full max-w-xs overflow-hidden rounded-lg border bg-muted">
              <Image
                src={formData.image}
                alt="Category preview"
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

          <div className="flex items-center gap-3">
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border bg-background px-4 py-2 text-sm font-medium transition hover:bg-muted">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadImage(file);
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
            disabled={isLoading || isUploading}
            className="flex-1 rounded-lg bg-foreground px-6 py-2 text-sm font-medium text-background transition hover:bg-foreground/90 disabled:opacity-50 sm:flex-none"
          >
            {isLoading
              ? 'Saving...'
              : mode === 'edit'
                ? 'Update Category'
                : 'Create Category'}
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

        {mode === 'edit' && categoryId && (
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
