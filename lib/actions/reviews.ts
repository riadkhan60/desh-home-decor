'use server';

import { prisma } from '../prisma';
import { revalidatePath } from 'next/cache';
import { unstable_cache } from 'next/cache';

// Public function for showcase reviews - cached for performance
export const getShowcaseReviews = unstable_cache(
  async (take: number = 10) => {
    const reviews = await prisma.review.findMany({
      where: {
        isShowcase: true,
        isApproved: true,
      },
      orderBy: [
        {
          screnShotReviewImage: { sort: 'desc', nulls: 'last' },
        },
        {
          createdAt: 'desc',
        },
      ],
      // Only select fields needed for display
      select: {
        id: true,
        userName: true,
        rating: true,
        comment: true,
        image: true,
        screnShotReviewImage: true,
        source: true,
        url: true,
        createdAt: true,
      },
      take,
    });

    return reviews;
  },
  ['showcase-reviews'],
  {
    revalidate: 3600, // Cache for 1 hour
  },
);

// Admin: Get all reviews with optional search
export async function getReviews(query?: string) {
  try {
    const reviews = await prisma.review.findMany({
      where: query
        ? {
            OR: [
              { userName: { contains: query, mode: 'insensitive' } },
              { comment: { contains: query, mode: 'insensitive' } },
              { source: { contains: query, mode: 'insensitive' } },
            ],
          }
        : undefined,
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, data: reviews };
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return { success: false, error: 'Failed to fetch reviews' };
  }
}

// Admin: Get single review by ID
export async function getReviewById(id: string) {
  try {
    const review = await prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      return { success: false, error: 'Review not found' };
    }

    return { success: true, data: review };
  } catch (error) {
    console.error('Error fetching review:', error);
    return { success: false, error: 'Failed to fetch review' };
  }
}

// Admin: Create new review
export async function createReview(data: {
  productId?: string | null;
  userName?: string | null;
  userEmail?: string | null;
  rating?: number | null;
  comment?: string | null;
  image?: string | null;
  screnShotReviewImage?: string | null;
  source?: string | null;
  url?: string | null;
  isShowcase?: boolean;
  isApproved?: boolean;
}) {
  try {
    const review = await prisma.review.create({
      data: {
        productId: data.productId || null,
        userName: data.userName || null,
        userEmail: data.userEmail || null,
        rating: data.rating || null,
        comment: data.comment || null,
        image: data.image || null,
        screnShotReviewImage: data.screnShotReviewImage || null,
        source: data.source || null,
        url: data.url || null,
        isShowcase: data.isShowcase ?? false,
        isApproved: data.isApproved ?? false,
      },
    });

    revalidatePath('/admin/reviews');
    revalidatePath('/'); // Revalidate home as it may show reviews
    return { success: true, data: review };
  } catch (error) {
    console.error('Error creating review:', error);
    return { success: false, error: 'Failed to create review' };
  }
}

// Admin: Update existing review
export async function updateReview(
  id: string,
  data: {
    productId?: string | null;
    userName?: string | null;
    userEmail?: string | null;
    rating?: number | null;
    comment?: string | null;
    image?: string | null;
    screnShotReviewImage?: string | null;
    source?: string | null;
    url?: string | null;
    isShowcase?: boolean;
    isApproved?: boolean;
  },
) {
  try {
    const review = await prisma.review.update({
      where: { id },
      data: {
        productId: data.productId !== undefined ? data.productId : undefined,
        userName: data.userName !== undefined ? data.userName : undefined,
        userEmail: data.userEmail !== undefined ? data.userEmail : undefined,
        rating: data.rating !== undefined ? data.rating : undefined,
        comment: data.comment !== undefined ? data.comment : undefined,
        image: data.image !== undefined ? data.image : undefined,
        screnShotReviewImage:
          data.screnShotReviewImage !== undefined
            ? data.screnShotReviewImage
            : undefined,
        source: data.source !== undefined ? data.source : undefined,
        url: data.url !== undefined ? data.url : undefined,
        isShowcase: data.isShowcase !== undefined ? data.isShowcase : undefined,
        isApproved: data.isApproved !== undefined ? data.isApproved : undefined,
      },
    });

    revalidatePath('/admin/reviews');
    revalidatePath('/');
    return { success: true, data: review };
  } catch (error) {
    console.error('Error updating review:', error);
    return { success: false, error: 'Failed to update review' };
  }
}

// Admin: Delete review
export async function deleteReview(id: string) {
  try {
    await prisma.review.delete({
      where: { id },
    });

    revalidatePath('/admin/reviews');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error deleting review:', error);
    return { success: false, error: 'Failed to delete review' };
  }
}

// Admin: Toggle approval status
export async function toggleReviewApproval(id: string, isApproved: boolean) {
  try {
    await prisma.review.update({
      where: { id },
      data: { isApproved },
    });

    revalidatePath('/admin/reviews');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error toggling review approval:', error);
    return { success: false, error: 'Failed to update approval status' };
  }
}
