import { prisma } from '../config/prisma';
import { z } from 'zod';
import { createReviewSchema } from '../validators/review.validator';
import { AppError } from '../utils/AppError';

type ReviewData = z.infer<typeof createReviewSchema>;

export const createReview = async (userId: string, collegeId: string, data: ReviewData) => {
  const college = await prisma.college.findUnique({
    where: { id: collegeId }
  });

  if (!college) {
    throw new AppError('College not found', 404);
  }

  const existingReview = await prisma.review.findFirst({
    where: { userId, collegeId }
  });

  if (existingReview) {
    throw new AppError('You have already reviewed this college', 409);
  }

  const review = await prisma.review.create({
    data: {
      userId,
      collegeId,
      ...data,
    },
  });

  // Update college rating and review count in a transaction
  const [{ _avg }] = await prisma.$transaction([
    prisma.review.aggregate({
      where: { collegeId },
      _avg: { rating: true },
    }),
    prisma.college.update({
      where: { id: collegeId },
      data: {
        reviewCount: { increment: 1 },
      },
    }),
  ]);

  const averageRating = _avg.rating ?? 0;

  await prisma.college.update({
    where: { id: collegeId },
    data: {
      rating: Number(averageRating.toFixed(1)),
    },
  });

  return review;
};

export const getReviews = async (collegeId: string) => {
  const reviews = await prisma.review.findMany({
    where: { collegeId },
    include: {
      user: {
        select: {
          name: true,
          avatarUrl: true,
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return reviews;
};
