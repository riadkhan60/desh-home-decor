'use server';

import { prisma } from '../prisma';
import { revalidatePath } from 'next/cache';

export async function getCollections(query?: string) {
  try {
    const collections = await prisma.collection.findMany({
      where: query
        ? {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } },
              { slug: { contains: query, mode: 'insensitive' } },
            ],
          }
        : undefined,
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      include: {
        products: {
          select: {
            productId: true,
          },
        },
      },
    });

    return { success: true, data: collections };
  } catch (error) {
    console.error('Error fetching collections:', error);
    return { success: false, error: 'Failed to fetch collections' };
  }
}

export async function createCollection(data: {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive?: boolean;
  order?: number;
}) {
  try {
    const existing = await prisma.collection.findUnique({
      where: { slug: data.slug },
    });

    if (existing) {
      return { success: false, error: 'Slug already exists' };
    }

    const collection = await prisma.collection.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        image: data.image || null,
        isActive: data.isActive ?? true,
        order: data.order ?? 0,
      },
    });

    revalidatePath('/admin/collections');
    revalidatePath('/(public)', 'layout');

    return { success: true, data: collection };
  } catch (error) {
    console.error('Error creating collection:', error);
    return { success: false, error: 'Failed to create collection' };
  }
}

export async function updateCollection(
  id: string,
  data: {
    name?: string;
    slug?: string;
    description?: string;
    image?: string;
    isActive?: boolean;
    order?: number;
  },
) {
  try {
    if (data.slug) {
      const existing = await prisma.collection.findUnique({
        where: { slug: data.slug },
      });
      if (existing && existing.id !== id) {
        return { success: false, error: 'Slug already exists' };
      }
    }

    const collection = await prisma.collection.update({
      where: { id },
      data,
    });

    revalidatePath('/admin/collections');
    revalidatePath('/(public)', 'layout');

    return { success: true, data: collection };
  } catch (error) {
    console.error('Error updating collection:', error);
    return { success: false, error: 'Failed to update collection' };
  }
}

export async function deleteCollection(id: string) {
  try {
    await prisma.collection.delete({
      where: { id },
    });

    revalidatePath('/admin/collections');
    revalidatePath('/(public)', 'layout');

    return { success: true };
  } catch (error) {
    console.error('Error deleting collection:', error);
    return { success: false, error: 'Failed to delete collection' };
  }
}

export async function toggleCollectionStatus(id: string, isActive: boolean) {
  try {
    await prisma.collection.update({
      where: { id },
      data: { isActive },
    });

    revalidatePath('/admin/collections');
    revalidatePath('/(public)', 'layout');

    return { success: true };
  } catch (error) {
    console.error('Error toggling collection status:', error);
    return { success: false, error: 'Failed to update status' };
  }
}

