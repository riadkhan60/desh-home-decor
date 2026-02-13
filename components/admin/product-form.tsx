/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { X } from 'lucide-react';
import type { ProductFormData } from '../../lib/actions/admin-products';
import {
  createProduct,
  updateProduct,
  deleteProduct,
} from '../../lib/actions/admin-products';

interface Category {
  id: string;
  name: string;
}

interface Collection {
  id: string;
  name: string;
  slug: string;
}

interface ProductFormProps {
  initialData?: ProductFormData & { id?: string };
  categories: Category[];
  availableCollections: Collection[];
  mode: 'create' | 'edit';
  productId?: string;
}

export function ProductForm({
  initialData,
  categories,
  availableCollections,
  mode,
  productId,
}: ProductFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<ProductFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price || '',
    comparePrice: initialData?.comparePrice || '',
    sku: initialData?.sku || '',
    stock: initialData?.stock,
    weight: initialData?.weight || '',
    categoryId: initialData?.categoryId || '',
    tags: initialData?.tags || [],
    featuredImage: initialData?.featuredImage || '',
    images: initialData?.images || [],
    isActive: initialData?.isActive ?? true,
    isFeatured: initialData?.isFeatured ?? false,
    stockShow: initialData?.stockShow ?? false,
    collections: initialData?.collections || [],
    order: initialData?.order || 0,
    variants: initialData?.variants || [],
    options: initialData?.options || [],
  });

  const [newOptionName, setNewOptionName] = useState('');

  const addOption = () => {
    if (
      newOptionName.trim() &&
      !formData.options?.some((o) => o.name === newOptionName.trim())
    ) {
      setFormData({
        ...formData,
        options: [
          ...(formData.options || []),
          { name: newOptionName.trim(), values: [] },
        ],
      });
      setNewOptionName('');
    }
  };

  const removeOption = (index: number) => {
    const newOptions = [...(formData.options || [])];
    newOptions.splice(index, 1);
    setFormData({ ...formData, options: newOptions });
  };

  const addOptionValue = (optionIndex: number, value: string) => {
    if (!value.trim()) return;

    const newOptions = [...(formData.options || [])];
    const option = newOptions[optionIndex];

    if (!option.values.includes(value.trim())) {
      option.values.push(value.trim());
      setFormData({ ...formData, options: newOptions });
    }
  };

  const removeOptionValue = (optionIndex: number, valueToRemove: string) => {
    const newOptions = [...(formData.options || [])];
    const option = newOptions[optionIndex];
    option.values = option.values.filter((v) => v !== valueToRemove);
    setFormData({ ...formData, options: newOptions });
  };

  const [tagInput, setTagInput] = useState('');
  const [imageInput, setImageInput] = useState('');
  const [isUploadingFeatured, setIsUploadingFeatured] = useState(false);
  const [isUploadingAdditional, setIsUploadingAdditional] = useState(false);

  const addVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [
        ...(prev.variants || []),
        {
          label: '',
          price: '',
          comparePrice: '',
          stock: 0,
          sku: '',
          order: 0,
          isActive: true,
        },
      ],
    }));
  };

  const updateVariant = (
    index: number,
    field:
      | 'label'
      | 'price'
      | 'comparePrice'
      | 'stock'
      | 'sku'
      | 'order'
      | 'isActive',
    value: string | number | boolean,
  ) => {
    setFormData((prev) => {
      const variants = [...(prev.variants || [])];
      const v = variants[index];
      if (!v) return prev;
      variants[index] = {
        ...v,
        [field]: value,
      };
      return { ...prev, variants };
    });
  };

  const removeVariant = (index: number) => {
    setFormData((prev) => {
      const variants = [...(prev.variants || [])];
      variants.splice(index, 1);
      return { ...prev, variants };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (mode === 'create') {
        await createProduct(formData);
      } else if (mode === 'edit' && productId) {
        await updateProduct(productId, formData);
      }
      router.push('/admin/products');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to save product');
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (mode !== 'edit' || !productId) return;

    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    setIsLoading(true);
    try {
      await deleteProduct(productId);
      router.push('/admin/products');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to delete product');
      setIsLoading(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    });
  };

  const uploadImage = async (file: File, type: 'featured' | 'additional') => {
    const uploadFormData = new FormData();
    uploadFormData.append('image', file);

    if (type === 'featured') {
      setIsUploadingFeatured(true);
    } else {
      setIsUploadingAdditional(true);
    }

    try {
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: uploadFormData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      if (type === 'featured') {
        setFormData({ ...formData, featuredImage: data.url });
      } else {
        setFormData({
          ...formData,
          images: [...formData.images, data.url],
        });
      }
    } catch (err: any) {
      alert(err.message || 'Failed to upload image');
    } finally {
      if (type === 'featured') {
        setIsUploadingFeatured(false);
      } else {
        setIsUploadingAdditional(false);
      }
    }
  };

  const addImage = () => {
    if (imageInput.trim() && !formData.images.includes(imageInput.trim())) {
      setFormData({
        ...formData,
        images: [...formData.images, imageInput.trim()],
      });
      setImageInput('');
    }
  };

  const removeImage = (image: string) => {
    setFormData({
      ...formData,
      images: formData.images.filter((img) => img !== image),
    });
  };

  const toggleCollection = (collectionId: string) => {
    setFormData((prev) => ({
      ...prev,
      collections: prev.collections.includes(collectionId)
        ? prev.collections.filter((c) => c !== collectionId)
        : [...prev.collections, collectionId],
    }));
  };

  const updateOptionName = (index: number, newName: string) => {
    const newOptions = [...(formData.options || [])];
    newOptions[index].name = newName;
    setFormData({ ...formData, options: newOptions });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Basic Info */}
      <div className="rounded-xl border bg-card p-6 space-y-4">
        <h2 className="text-lg font-semibold">Basic Information</h2>

        <div>
          <label className="block text-sm font-medium mb-2">
            Product Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="w-full rounded-lg border bg-background px-4 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={4}
            className="w-full rounded-lg border bg-background px-4 py-2 text-sm"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-2">SKU</label>
            <input
              type="text"
              value={formData.sku}
              onChange={(e) =>
                setFormData({ ...formData, sku: e.target.value })
              }
              className="w-full rounded-lg border bg-background px-4 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              value={formData.categoryId}
              onChange={(e) =>
                setFormData({ ...formData, categoryId: e.target.value })
              }
              className="w-full rounded-lg border bg-background px-4 py-2 text-sm"
            >
              <option value="">No category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Pricing & Stock */}
      <div className="rounded-xl border bg-card p-6 space-y-4">
        <h2 className="text-lg font-semibold">Pricing & Stock</h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="block text-sm font-medium mb-2">Price</label>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              className="w-full rounded-lg border bg-background px-4 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Compare Price
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.comparePrice}
              onChange={(e) =>
                setFormData({ ...formData, comparePrice: e.target.value })
              }
              className="w-full rounded-lg border bg-background px-4 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Stock</label>
            <input
              type="number"
              value={formData.stock ?? ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  stock:
                    e.target.value === ''
                      ? undefined
                      : parseInt(e.target.value) || 0,
                })
              }
              className="w-full rounded-lg border bg-background px-4 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Weight (kg)
            </label>
            <input
              type="number"
              step="0.001"
              min="0"
              value={formData.weight ?? ''}
              onChange={(e) =>
                setFormData({ ...formData, weight: e.target.value })
              }
              placeholder="e.g. 1.5"
              className="w-full rounded-lg border bg-background px-4 py-2 text-sm"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Optional, for shipping
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Display Order
          </label>
          <input
            type="number"
            value={formData.order}
            onChange={(e) =>
              setFormData({ ...formData, order: parseInt(e.target.value) || 0 })
            }
            className="w-full rounded-lg border bg-background px-4 py-2 text-sm"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Lower numbers appear first
          </p>
        </div>
      </div>

      {/* Product Options */}
      <div className="rounded-xl border bg-card p-6 space-y-4">
        <h2 className="text-lg font-semibold">Product Options</h2>
        <p className="text-sm text-muted-foreground">
          Add options like Size or Color.
        </p>

        <div className="flex gap-2">
          <input
            type="text"
            value={newOptionName}
            onChange={(e) => setNewOptionName(e.target.value)}
            placeholder="Option Name (e.g. Size, Color)"
            className="flex-1 rounded-lg border bg-background px-4 py-2 text-sm"
          />
          <button
            type="button"
            onClick={addOption}
            className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Add Option
          </button>
        </div>

        {formData.options &&
          formData.options.map((option, index) => (
            <div key={index} className="rounded-lg border bg-background p-4">
              <div className="flex items-center justify-between mb-3 gap-3">
                <input
                  type="text"
                  value={option.name}
                  onChange={(e) => updateOptionName(index, e.target.value)}
                  className="font-medium bg-transparent border-b border-transparent hover:border-border focus:border-foreground focus:outline-none px-1 py-0.5 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  className="text-destructive hover:text-destructive/80 text-sm"
                >
                  Remove
                </button>
              </div>

              <div className="space-y-3">
                {/* Option Values Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder={`Add value for ${option.name} (e.g. S, Red)`}
                    className="flex-1 rounded-lg border bg-muted/50 px-3 py-1.5 text-sm"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addOptionValue(index, e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                </div>

                {/* Values List */}
                <div className="flex flex-wrap gap-2">
                  {option.values.map((val, vIndex) => (
                    <span
                      key={vIndex}
                      className="inline-flex items-center gap-2 rounded-full border bg-muted px-3 py-1 text-xs font-medium"
                    >
                      {val}
                      <button
                        type="button"
                        onClick={() => removeOptionValue(index, val)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Variants (Size / Price) */}
      <div className="rounded-xl border bg-card p-6 space-y-4">
        <h2 className="text-lg font-semibold">Variants (Size / Price)</h2>
        <p className="text-sm text-muted-foreground">
          Use variants when the same product has different sizes or options with
          different prices and stock. The variant label should match an option
          value (e.g. a Size option like S, M, L).
        </p>

        <div className="space-y-3">
          <button
            type="button"
            onClick={addVariant}
            className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            + Add Variant
          </button>
        </div>

        {formData.variants && formData.variants.length > 0 && (
          <div className="space-y-3">
            {formData.variants.map((variant, index) => (
              <div
                key={index}
                className="rounded-lg border bg-background p-4 space-y-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 grid gap-3 sm:grid-cols-3">
                    <div>
                      <label className="block text-xs font-medium mb-1">
                        Label *
                      </label>
                      <input
                        type="text"
                        value={variant.label}
                        onChange={(e) =>
                          updateVariant(index, 'label', e.target.value)
                        }
                        placeholder="e.g. S, M, L"
                        className="w-full rounded-lg border bg-background px-3 py-1.5 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">
                        Price *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={variant.price}
                        onChange={(e) =>
                          updateVariant(index, 'price', e.target.value)
                        }
                        className="w-full rounded-lg border bg-background px-3 py-1.5 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">
                        Compare Price
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={variant.comparePrice || ''}
                        onChange={(e) =>
                          updateVariant(index, 'comparePrice', e.target.value)
                        }
                        className="w-full rounded-lg border bg-background px-3 py-1.5 text-sm"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    className="text-xs text-destructive hover:text-destructive/80"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-medium mb-1">
                      Stock
                    </label>
                    <input
                      type="number"
                      value={variant.stock}
                      onChange={(e) =>
                        updateVariant(
                          index,
                          'stock',
                          parseInt(e.target.value) || 0,
                        )
                      }
                      className="w-full rounded-lg border bg-background px-3 py-1.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">
                      SKU
                    </label>
                    <input
                      type="text"
                      value={variant.sku || ''}
                      onChange={(e) =>
                        updateVariant(index, 'sku', e.target.value)
                      }
                      className="w-full rounded-lg border bg-background px-3 py-1.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">
                      Order
                    </label>
                    <input
                      type="number"
                      value={variant.order}
                      onChange={(e) =>
                        updateVariant(
                          index,
                          'order',
                          parseInt(e.target.value) || 0,
                        )
                      }
                      className="w-full rounded-lg border bg-background px-3 py-1.5 text-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs font-medium cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={variant.isActive}
                      onChange={(e) =>
                        updateVariant(index, 'isActive', e.target.checked)
                      }
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    Active
                  </label>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Images */}
      <div className="rounded-xl border bg-card p-6 space-y-4">
        <h2 className="text-lg font-semibold">Images</h2>

        <div>
          <label className="block text-sm font-medium mb-2">
            Featured Image
          </label>
          <div className="space-y-3">
            {/* Preview */}
            {formData.featuredImage && (
              <div className="relative aspect-3/4 w-full max-w-xs overflow-hidden rounded-lg border bg-muted">
                <Image
                  src={formData.featuredImage}
                  alt="Featured image preview"
                  fill
                  className="object-cover"
                  sizes="300px"
                />
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, featuredImage: '' })
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
                value={formData.featuredImage}
                onChange={(e) =>
                  setFormData({ ...formData, featuredImage: e.target.value })
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
                    if (file) uploadImage(file, 'featured');
                  }}
                  className="hidden"
                  disabled={isUploadingFeatured}
                />
                {isUploadingFeatured ? 'Uploading...' : '📤 Upload Image'}
              </label>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Additional Images
          </label>
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="url"
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
                onKeyPress={(e) =>
                  e.key === 'Enter' && (e.preventDefault(), addImage())
                }
                placeholder="Or paste image URL..."
                className="flex-1 rounded-lg border bg-background px-4 py-2 text-sm"
              />
              <button
                type="button"
                onClick={addImage}
                className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted"
              >
                Add URL
              </button>
            </div>

            <label className="flex cursor-pointer items-center gap-2 rounded-lg border bg-background px-4 py-2 text-sm font-medium transition hover:bg-muted w-fit">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadImage(file, 'additional');
                }}
                className="hidden"
                disabled={isUploadingAdditional}
              />
              {isUploadingAdditional ? 'Uploading...' : '📤 Upload Image'}
            </label>
          </div>

          {formData.images.length > 0 && (
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {formData.images.map((image, index) => (
                <div
                  key={index}
                  className="group relative aspect-3/4 overflow-hidden rounded-lg border bg-muted"
                >
                  <Image
                    src={image}
                    alt={`Additional image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                  <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/40" />
                  <button
                    type="button"
                    onClick={() => removeImage(image)}
                    className="absolute right-2 top-2 rounded-full bg-destructive p-1.5 text-white opacity-0 transition group-hover:opacity-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <span className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-0.5 text-xs font-medium text-white">
                    {index + 1}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tags */}
      <div className="rounded-xl border bg-card p-6 space-y-4">
        <h2 className="text-lg font-semibold">Tags</h2>

        <div className="flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) =>
              e.key === 'Enter' && (e.preventDefault(), addTag())
            }
            placeholder="Add a tag..."
            className="flex-1 rounded-lg border bg-background px-4 py-2 text-sm"
          />
          <button
            type="button"
            onClick={addTag}
            className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Add
          </button>
        </div>

        {formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-medium"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="text-destructive hover:text-destructive/80"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Collections */}
      <div className="rounded-xl border bg-card p-6 space-y-4">
        <h2 className="text-lg font-semibold">Collections</h2>

        {availableCollections.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No collections yet. Create collections in the admin first.
          </p>
        ) : (
          <div className="space-y-2">
            {availableCollections.map((collection) => (
              <label
                key={collection.id}
                className="flex items-center justify-between gap-2 text-sm"
              >
                <span>
                  {collection.name}
                  <span className="ml-2 text-xs text-muted-foreground">
                    ({collection.slug})
                  </span>
                </span>
                <input
                  type="checkbox"
                  checked={formData.collections.includes(collection.id)}
                  onChange={() => toggleCollection(collection.id)}
                  className="h-4 w-4 rounded"
                />
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Settings */}
      <div className="rounded-xl border bg-card p-6 space-y-4">
        <h2 className="text-lg font-semibold">Settings</h2>

        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) =>
                setFormData({ ...formData, isActive: e.target.checked })
              }
              className="h-4 w-4 rounded"
            />
            Active (visible on site)
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={formData.isFeatured}
              onChange={(e) =>
                setFormData({ ...formData, isFeatured: e.target.checked })
              }
              className="h-4 w-4 rounded"
            />
            Featured (show on homepage)
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={formData.stockShow ?? false}
              onChange={(e) =>
                setFormData({ ...formData, stockShow: e.target.checked })
              }
              className="h-4 w-4 rounded"
            />
            Show stock to customers
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 rounded-lg bg-foreground px-6 py-2 text-sm font-medium text-background transition hover:bg-foreground/90 disabled:opacity-50 sm:flex-none"
          >
            {isLoading
              ? 'Saving...'
              : mode === 'edit'
                ? 'Update Product'
                : 'Create Product'}
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

        {mode === 'edit' && productId && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={isLoading}
            className="rounded-lg border border-destructive bg-destructive/10 px-6 py-2 text-sm font-medium text-destructive transition hover:bg-destructive/20 disabled:opacity-50"
          >
            Delete Product
          </button>
        )}
      </div>
    </form>
  );
}
