import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { successResponse } from '../utils/apiResponse';
import * as reviewService from '../services/review.service';
import { AuthRequest } from '../types';

export const createReview = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { collegeId } = req.params;
  const review = await reviewService.createReview(req.user!.id, collegeId, req.body);
  return successResponse(res, 'Review added successfully', { review }, 201);
});

export const getReviews = asyncHandler(async (req: Request, res: Response) => {
  const { collegeId } = req.params;
  const reviews = await reviewService.getReviews(collegeId);
  return successResponse(res, 'Reviews fetched successfully', { reviews });
});
