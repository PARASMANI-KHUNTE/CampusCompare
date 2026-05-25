import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { successResponse, errorResponse } from '../utils/apiResponse';
import * as compareService from '../services/compare.service';

export const compareColleges = asyncHandler(async (req: Request, res: Response) => {
  const { ids } = req.query;
  
  if (!ids || typeof ids !== 'string') {
    return errorResponse(res, 'Please provide ids parameter (comma-separated college IDs)', 400);
  }

  const idsArray = ids.split(',');
  const colleges = await compareService.compareColleges(idsArray);
  
  return successResponse(res, 'Colleges compared successfully', { colleges });
});
