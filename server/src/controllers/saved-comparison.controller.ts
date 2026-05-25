import { Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { successResponse, errorResponse } from '../utils/apiResponse';
import prisma from '../config/prisma';
import { AuthRequest } from '../types';

export const saveComparison = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, colleges } = req.body;
  const userId = req.user!.id;

  if (!name || !colleges || !Array.isArray(colleges) || colleges.length < 2) {
    return errorResponse(res, 'Name and at least 2 colleges are required', 400);
  }

  const savedComparison = await prisma.savedComparison.create({
    data: {
      name,
      colleges,
      userId,
    },
  });

  return successResponse(res, 'Comparison saved successfully', { savedComparison }, 201);
});

export const getSavedComparisons = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;

  const savedComparisons = await prisma.savedComparison.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  return successResponse(res, 'Saved comparisons fetched successfully', { savedComparisons });
});

export const deleteSavedComparison = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.id;

  const savedComparison = await prisma.savedComparison.findUnique({
    where: { id },
  });

  if (!savedComparison) {
    return errorResponse(res, 'Saved comparison not found', 404);
  }

  if (savedComparison.userId !== userId) {
    return errorResponse(res, 'Not authorized', 403);
  }

  await prisma.savedComparison.delete({
    where: { id },
  });

  return successResponse(res, 'Saved comparison deleted successfully');
});
