import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { successResponse, paginatedResponse } from '../utils/apiResponse';
import * as collegeService from '../services/college.service';

export const getColleges = asyncHandler(async (req: Request, res: Response) => {
  const result = await collegeService.getColleges(req.query as any);
  return paginatedResponse(res, 'Colleges fetched successfully', result.data, result.pagination);
});

export const getCollegeBySlug = asyncHandler(async (req: Request, res: Response) => {
  const college = await collegeService.getCollegeBySlug(req.params.slug);
  return successResponse(res, 'College fetched successfully', { college });
});

export const getRelatedColleges = asyncHandler(async (req: Request, res: Response) => {
  const colleges = await collegeService.getRelatedColleges(req.params.slug);
  return successResponse(res, 'Related colleges fetched successfully', { colleges });
});
