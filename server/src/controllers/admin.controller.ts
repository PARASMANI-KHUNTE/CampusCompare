import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { successResponse } from '../utils/apiResponse';
import * as adminService from '../services/admin.service';

export const getAllColleges = asyncHandler(async (_req: Request, res: Response) => {
  const colleges = await adminService.getColleges();
  return successResponse(res, 'Colleges fetched successfully', { colleges });
});

export const getAllCourses = asyncHandler(async (_req: Request, res: Response) => {
  const courses = await adminService.getCourses();
  return successResponse(res, 'Courses fetched successfully', { courses });
});

export const createCollege = asyncHandler(async (req: Request, res: Response) => {
  const college = await adminService.createCollege(req.body);
  return successResponse(res, 'College created successfully', { college }, 201);
});

export const updateCollege = asyncHandler(async (req: Request, res: Response) => {
  const college = await adminService.updateCollege(req.params.id, req.body);
  return successResponse(res, 'College updated successfully', { college });
});

export const deleteCollege = asyncHandler(async (req: Request, res: Response) => {
  await adminService.deleteCollege(req.params.id);
  return successResponse(res, 'College deleted successfully');
});

export const createCourse = asyncHandler(async (req: Request, res: Response) => {
  const course = await adminService.createCourse(req.body);
  return successResponse(res, 'Course created successfully', { course }, 201);
});

export const updateCourse = asyncHandler(async (req: Request, res: Response) => {
  const course = await adminService.updateCourse(req.params.id, req.body);
  return successResponse(res, 'Course updated successfully', { course });
});

export const deleteCourse = asyncHandler(async (req: Request, res: Response) => {
  await adminService.deleteCourse(req.params.id);
  return successResponse(res, 'Course deleted successfully');
});

export const uploadCollegeImage = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No image file provided' });
  }
  const imageUrl = req.file.path; // provided by multer-storage-cloudinary
  
  const college = await adminService.updateCollege(req.params.id, { imageUrl });
  return successResponse(res, 'Image uploaded successfully', { college });
});

export const createNotice = asyncHandler(async (req: Request, res: Response) => {
  // If there's an uploaded file (like an image), we use it as attachmentUrl
  const data = { ...req.body };
  if (req.file) {
    data.attachmentUrl = req.file.path;
  }
  
  const notice = await adminService.createNotice(req.params.collegeId, data);
  return successResponse(res, 'Notice created successfully', { notice }, 201);
});

export const deleteNotice = asyncHandler(async (req: Request, res: Response) => {
  await adminService.deleteNotice(req.params.id);
  return successResponse(res, 'Notice deleted successfully');
});

export const bulkImportColleges = asyncHandler(async (req: Request, res: Response) => {
  const { colleges } = req.body;
  if (!colleges || !Array.isArray(colleges)) {
    return res.status(400).json({ success: false, message: 'Invalid or missing colleges array' });
  }

  const results = await adminService.bulkCreateColleges(colleges);
  
  const createdCount = results.filter(r => r.status === 'created').length;
  const skippedCount = results.filter(r => r.status === 'skipped').length;
  const failedCount = results.filter(r => r.status === 'failed').length;

  return successResponse(res, 'Bulk import completed', {
    summary: {
      total: colleges.length,
      created: createdCount,
      skipped: skippedCount,
      failed: failedCount
    },
    results
  });
});

