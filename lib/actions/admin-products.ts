'use server';

import { prisma } from '../prisma';
import { revalidatePath, revalidateTag } from 'next/cache';

export interface ProductFormData {
  name: string;
  description?: string;
  price?: string;
  comparePrice?: string;
  sku?: string;
  stock?: number;
  weight?: string;
  categoryId?: string;
  tags: string[];
  featuredImage?: string;
  images: string[];
  isActive: boolean;
  isFeatured: boolean;
  stockShow?: boolean;
  // Array of collection IDs
  collections: string[];
  order: number;
  variants?: {
    id?: string;
    label: string;
    price: string;
    comparePrice?: string;
    stock: number;
    sku?: string;
    order: number;
    isActive: boolean;
  }[];
  options?: {
    name: string;
    values: string[];
  }[];
}

export async function createProduct(data: ProductFormData) {
  const product = await prisma.product.create({
    data: {
      name: data.name,
      description: data.description || null,
      price:
        data.price && data.price.toString().trim() !== ''
          ? data.price
          : null,
      comparePrice: data.comparePrice || null,
      sku: data.sku || null,
      stock:
        typeof data.stock === 'number'
          ? data.stock
          : undefined,
      weight:
        data.weight && data.weight.toString().trim() !== ''
          ? data.weight
          : null,
      categoryId: data.categoryId || null,
      tags: data.tags,
      featuredImage: data.featuredImage || null,
      images: data.images,
      isActive: data.isActive,
      isFeatured: data.isFeatured,
      stockShow: data.stockShow ?? false,
      order: data.order,
      collections:
        data.collections.length > 0
          ? {
              create: data.collections.map((collectionId) => ({
                collectionId,
              })),
            }
          : undefined,
      variants:
        data.variants && data.variants.length > 0
          ? {
              create: data.variants.map((v) => ({
                label: v.label,
                price: v.price,
                comparePrice: v.comparePrice || null,
                stock: v.stock,
                sku: v.sku || null,
                order: v.order,
                isActive: v.isActive,
              })),
            }
          : undefined,
      options: {
        create: data.options?.map((opt) => ({
          name: opt.name,
          values: opt.values,
        })),
      },
    },
  });

  revalidatePath('/admin/products');
  revalidatePath('/(public)', 'layout');
  revalidateTag('products');
  revalidateTag('collections');

  return { success: true, id: product.id };
}

export async function updateProduct(id: string, data: ProductFormData) {
  // Update product, collections, variants, and options.
  // We avoid a long-running interactive transaction to prevent Prisma P2028 timeouts.
  const product = await prisma.product.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description || null,
      price:
        data.price && data.price.toString().trim() !== ''
          ? data.price
          : null,
      comparePrice: data.comparePrice || null,
      sku: data.sku || null,
      stock:
        typeof data.stock === 'number'
          ? data.stock
          : undefined,
      weight:
        data.weight && data.weight.toString().trim() !== ''
          ? data.weight
          : null,
      categoryId: data.categoryId || null,
      tags: data.tags,
      featuredImage: data.featuredImage || null,
      images: data.images,
      isActive: data.isActive,
      isFeatured: data.isFeatured,
      stockShow: data.stockShow ?? false,
      order: data.order,
      collections: {
        deleteMany: {}, // remove existing links for this product
        create: data.collections.map((collectionId) => ({
          collectionId,
        })),
      },
      variants: {
        deleteMany: {},
        create: (data.variants ?? []).map((v) => ({
          label: v.label,
          price: v.price,
          comparePrice: v.comparePrice || null,
          stock: v.stock,
          sku: v.sku || null,
          order: v.order,
          isActive: v.isActive,
        })),
      },
    },
  });

  // Handle options: Delete existing and create new
  if (data.options) {
    await prisma.productOption.deleteMany({
      where: { productId: id },
    });

    if (data.options.length > 0) {
      await prisma.productOption.createMany({
        data: data.options.map((opt) => ({
          productId: id,
          name: opt.name,
          values: opt.values,
        })),
      });
    }
  }

  revalidatePath('/admin/products');
  revalidatePath(`/admin/products/${id}`);
  revalidatePath('/(public)', 'layout');
  revalidateTag('products');
  revalidateTag('collections');

  return { success: true, id: product.id };
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({
    where: { id },
  });

  revalidatePath('/admin/products');
  revalidatePath('/(public)', 'layout');
  revalidateTag('products');
  revalidateTag('collections');

  return { success: true };
}

export async function getAllCategoriesForForm() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
    select: {
      id: true,
      name: true,
    },
  });

  return categories;
}

export async function getAllCollectionsForForm() {
  const collections = await prisma.collection.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });

  return collections;
}
