"use server";

import { unstable_cache } from "next/cache";
import { prisma } from "../prisma";
import { getCollectionsCached } from "./collections";

// collectionSlug matches Collection.slug
export async function getProductsByCollection(
  collectionSlug: string,
  opts?: { take?: number },
) {
  const take = opts?.take ?? 4;

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      collections: {
        some: {
          collection: {
            slug: collectionSlug,
            isActive: true,
          },
        },
      },
    },
    orderBy: [
      { order: "asc" },
      { createdAt: "desc" },
    ],
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

// Cached for homepage - avoids refetch when navigating back
export const getHomeCollectionProductsCached = unstable_cache(
  async () => {
    const collectionsRes = await getCollectionsCached();
    if (!collectionsRes.success || !collectionsRes.data?.length) {
      return { collections: [] };
    }

    const collections = collectionsRes.data.slice(0, 6);

    const collectionsWithProducts = await Promise.all(
      collections.map(async (c) => {
        const products = await getProductsByCollection(c.slug, { take: 8 });
        return {
          slug: c.slug,
          name: c.name,
          products,
        };
      })
    );

    return { collections: collectionsWithProducts };
  },
  ["home-collection-products"],
  { revalidate: 300, tags: ['products', 'collections'] },
);

// Non-cached version for admin/other use
export async function getHomeCollectionProducts() {
  const { getCollections } = await import("./collections");
  const collectionsRes = await getCollections();
  if (!collectionsRes.success || !collectionsRes.data?.length) {
    return { collections: [] };
  }
  const collections = collectionsRes.data.slice(0, 6);
  const collectionsWithProducts = await Promise.all(
    collections.map(async (c) => {
      const products = await getProductsByCollection(c.slug, { take: 8 });
      return { slug: c.slug, name: c.name, products };
    })
  );
  return { collections: collectionsWithProducts };
}

