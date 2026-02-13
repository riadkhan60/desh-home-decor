import { notFound } from 'next/navigation';
import { ProductForm } from '@/components/admin/product-form';
import {
  getAllCategoriesForForm,
  getAllCollectionsForForm,
} from '@/lib/actions/admin-products';
import { prisma } from '@/lib/prisma';

export const revalidate = 0;

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { id } = await params;

  const [product, categories, collections] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: {
        options: true,
        variants: true,
        collections: {
          select: {
            collectionId: true,
          },
        },
      },
    }),
    getAllCategoriesForForm(),
    getAllCollectionsForForm(),
  ]);

  if (!product) {
    notFound();
  }

  const initialData = {
    id: product.id,
    name: product.name,
    description: product.description || '',
    price: product.price?.toString() || '',
    comparePrice: product.comparePrice?.toString() || '',
    sku: product.sku || '',
    stock: product.stock ?? 0,
    weight: product.weight?.toString() || '',
    categoryId: product.categoryId || '',
    tags: [...product.tags],
    featuredImage: product.featuredImage || '',
    images: [...product.images],
    isActive: product.isActive,
    isFeatured: product.isFeatured,
    stockShow: product.stockShow ?? false,
    collections: product.collections.map((c) => c.collectionId),
    order: product.order,
    variants: product.variants.map((v) => ({
      id: v.id,
      label: v.label,
      price: v.price.toString(),
      comparePrice: v.comparePrice?.toString() || '',
      stock: v.stock,
      sku: v.sku || '',
      order: v.order,
      isActive: v.isActive,
    })),
    options: product.options.map((opt) => ({
      name: opt.name,
      values: opt.values,
    })),
  };

  return (
    <div className=" max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Edit Product
        </h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Update product details
        </p>
      </div>

      <ProductForm
        initialData={initialData}
        categories={categories}
        availableCollections={collections}
        mode="edit"
        productId={id}
      />
    </div>
  );
}
