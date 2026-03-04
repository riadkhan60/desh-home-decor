'use server';

import { cache } from 'react';
import { prisma } from '../prisma';

export const getProductBySlug = cache(async (slug: string) => {
  let product = await prisma.product.findUnique({
    where: { slug: slug },
    include: {
      category: true,
      options: true,
      variants: true,
      collections: {
        include: {
          collection: true,
        },
      },
    },
  });

  // Fallback for older links or cases where slug hasn't fully propagated, if needed
  // Check if what looks like a slug is actually an ID
  if (!product && slug.length >= 25 && !slug.includes('-')) {
    product = await prisma.product.findUnique({
      where: { id: slug },
      include: {
        category: true,
        options: true,
        variants: true,
        collections: {
          include: {
            collection: true,
          },
        },
      },
    });
  }

  return product;
});

export async function getProductReviews(productId: string) {
  const reviews = await prisma.review.findMany({
    where: {
      productId,
      isApproved: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 20,
  });

  return reviews;
}

export async function getRelatedProducts(
  categoryId: string | null,
  currentProductId: string,
  take: number = 4,
) {
  if (!categoryId) return [];

  const products = await prisma.product.findMany({
    where: {
      categoryId,
      isActive: true,
      id: {
        not: currentProductId,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take,
    include: {
      category: true,
      variants: {
        where: { isActive: true },
        select: { price: true, stock: true },
      },
    },
  });

  return products;
}
