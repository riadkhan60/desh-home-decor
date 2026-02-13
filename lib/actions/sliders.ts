'use server';

import { prisma } from '../prisma';
import { revalidatePath } from 'next/cache';
import { unstable_cache } from 'next/cache';

export async function getSliders() {
  try {
    const sliders = await prisma.sliderContent.findMany({
      orderBy: { order: 'asc' },
    });
    return { success: true, data: sliders };
  } catch (error) {
    console.error('Error fetching sliders:', error);
    return { success: false, error: 'Failed to fetch sliders' };
  }
}

// Cached version of getHeroSlides for better performance
// Cache is automatically revalidated when sliders are updated
export const getHeroSlides = unstable_cache(
  async () => {
    const slides = await prisma.sliderContent.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      // Only select fields that are actually used to reduce data transfer
      select: {
        id: true,
        title: true,
        description: true,
        image: true,
        phoneImage: true,
        link: true,
        buttonText: true,
        order: true,
      },
    });

    return slides;
  },
  ['hero-slides'], // Cache key
  {
    revalidate: 3600, // Revalidate every hour
    tags: ['sliders'], // Tag for on-demand revalidation
  },
);

export async function createSlider(data: {
  title?: string;
  description?: string;
  image: string;
  phoneImage?: string;
  link?: string;
  buttonText?: string;
  isActive?: boolean;
  order?: number;
}) {
  try {
    const slider = await prisma.sliderContent.create({
      data: {
        ...data,
        isActive: data.isActive ?? true,
      },
    });

    // Revalidate paths to update cached data
    revalidatePath('/admin/sliders');
    revalidatePath('/');
    return { success: true, data: slider };
  } catch (error) {
    console.error('Error creating slider:', error);
    return { success: false, error: 'Failed to create slider' };
  }
}

export async function updateSlider(
  id: string,
  data: {
    title?: string;
    description?: string;
    image?: string;
    phoneImage?: string;
    link?: string;
    buttonText?: string;
    isActive?: boolean;
    order?: number;
  },
) {
  try {
    const slider = await prisma.sliderContent.update({
      where: { id },
      data,
    });

    // Revalidate paths to update cached data
    revalidatePath('/admin/sliders');
    revalidatePath('/');
    return { success: true, data: slider };
  } catch (error) {
    console.error('Error updating slider:', error);
    return { success: false, error: 'Failed to update slider' };
  }
}

export async function deleteSlider(id: string) {
  try {
    await prisma.sliderContent.delete({
      where: { id },
    });

    // Revalidate paths to update cached data
    revalidatePath('/admin/sliders');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error deleting slider:', error);
    return { success: false, error: 'Failed to delete slider' };
  }
}
