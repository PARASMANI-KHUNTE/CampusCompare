import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { successResponse, errorResponse } from '../utils/apiResponse';
import prisma from '../config/prisma';

export const getPredictions = asyncHandler(async (req: Request, res: Response) => {
  const { exam, rank } = req.query;

  if (!exam || !rank) {
    return errorResponse(res, 'Exam and rank are required for prediction', 400);
  }

  const userRank = parseInt(rank as string, 10);
  if (isNaN(userRank) || userRank <= 0) {
    return errorResponse(res, 'Invalid rank provided', 400);
  }

  // Find courses where examsAccepted includes the exam, and cutoffRank >= userRank
  // A higher cutoff rank number means it's easier to get into (e.g. cutoff 50000 accepts rank 45000).
  const courses = await prisma.course.findMany({
    where: {
      examsAccepted: {
        has: exam as string,
      },
      cutoffRank: {
        gte: userRank,
      },
    },
    include: {
      college: {
        select: {
          id: true,
          name: true,
          slug: true,
          city: true,
          state: true,
          collegeType: true,
          rating: true,
          reviewCount: true,
          imageUrl: true,
          feesMin: true,
          feesMax: true,
          placementAverage: true,
          popularCourses: true,
        },
      },
    },
  });

  // Extract unique colleges from the courses
  const uniqueCollegesMap = new Map();
  courses.forEach((course) => {
    if (!uniqueCollegesMap.has(course.college.id)) {
      uniqueCollegesMap.set(course.college.id, course.college);
    }
  });

  const colleges = Array.from(uniqueCollegesMap.values());

  return successResponse(res, 'Predicted colleges fetched successfully', { colleges, total: colleges.length });
});
