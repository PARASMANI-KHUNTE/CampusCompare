import { z } from 'zod';

export const createReviewSchema = z.object({
  rating: z.number().min(1).max(5),
  title: z.string().optional(),
  comment: z.string().min(10, 'Comment must be at least 10 characters'),
  placementRating: z.number().min(1).max(5).optional(),
  facultyRating: z.number().min(1).max(5).optional(),
  campusRating: z.number().min(1).max(5).optional(),
  valueForMoneyRating: z.number().min(1).max(5).optional(),
});
