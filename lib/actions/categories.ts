'use server';

import { prisma } from '../prisma';
import { revalidatePath } from 'next/cache';


export async function getHomeCategories(take: number = 6) {
  const categories = await prisma.category.findMany({
    where: {
      isActive: true,
    },
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    take,
  });

  return categories;
}

export async function getCategories(query?: string) {
  try {
    const categories = await prisma.category.findMany({
      where: query
        ? {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } },
            ],
          }
        : undefined,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
    return { success: true, data: categories };
  } catch (error) {
    console.error('Error fetching categories:', error);
    return { success: false, error: 'Failed to fetch categories' };
  }
}

export async function createCategory(data: {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive?: boolean;
}) {
  try {
    // Check if slug exists
    const existing = await prisma.category.findUnique({
      where: { slug: data.slug },
    });

    if (existing) {
      return { success: false, error: 'Slug already exists' };
    }

    const category = await prisma.category.create({
      data: {
        ...data,
        isActive: data.isActive ?? true,
      },
    });

    revalidatePath('/admin/categories');
    revalidatePath('/'); // Revalidate home as it shows categories
    return { success: true, data: category };
  } catch (error) {
    console.error('Error creating category:', error);
    return { success: false, error: 'Failed to create category' };
  }
}

export async function updateCategory(
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
    // If updating slug, check uniqueness
    if (data.slug) {
      const existing = await prisma.category.findUnique({
        where: { slug: data.slug },
      });
      if (existing && existing.id !== id) {
        return { success: false, error: 'Slug already exists' };
      }
    }

    const category = await prisma.category.update({
      where: { id },
      data,
    });

    revalidatePath('/admin/categories');
    revalidatePath('/');
    return { success: true, data: category };
  } catch (error) {
    console.error('Error updating category:', error);
    return { success: false, error: 'Failed to update category' };
  }
}

export async function deleteCategory(id: string) {
  try {
    await prisma.category.delete({
      where: { id },
    });

    revalidatePath('/admin/categories');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error deleting category:', error);
    return { success: false, error: 'Failed to delete category' };
  }
}

export async function toggleCategoryStatus(id: string, isActive: boolean) {
  try {
    await prisma.category.update({
      where: { id },
      data: { isActive },
    });

    revalidatePath('/admin/categories');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error toggling category status:', error);
    return { success: false, error: 'Failed to update status' };
  }
}
