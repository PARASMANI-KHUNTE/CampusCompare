import { Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { successResponse } from '../utils/apiResponse';
import * as savedService from '../services/saved.service';
import { AuthRequest } from '../types';

export const saveCollege = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { collegeId } = req.body;
  const savedCollege = await savedService.saveCollege(req.user!.id, collegeId);
  return successResponse(res, 'College saved successfully', { savedCollege }, 201);
});

export const getSavedColleges = asyncHandler(async (req: AuthRequest, res: Response) => {
  const savedColleges = await savedService.getSavedColleges(req.user!.id);
  return successResponse(res, 'Saved colleges fetched successfully', { savedColleges });
});

export const removeSavedCollege = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { collegeId } = req.params;
  await savedService.removeSavedCollege(req.user!.id, collegeId);
  return successResponse(res, 'College removed from saved list');
});
