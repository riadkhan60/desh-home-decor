"use server";

import { prisma } from "../prisma";
import { getCollections } from "./collections";

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

// Dynamic collections from database - fetches first 3 collections with products
export async function getHomeCollectionProducts() {
  const collectionsRes = await getCollections();
  if (!collectionsRes.success || !collectionsRes.data?.length) {
    return { collections: [] };
  }

  const collections = collectionsRes.data.slice(0, 6); // up to 6 collections for tabs

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
}

