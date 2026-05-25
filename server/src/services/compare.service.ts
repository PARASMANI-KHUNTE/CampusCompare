import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';

export const compareColleges = async (ids: string[]) => {
  if (!ids || ids.length < 2 || ids.length > 3) {
    throw new AppError('Please provide 2 to 3 college IDs for comparison', 400);
  }

  const colleges = await prisma.college.findMany({
    where: {
      id: { in: ids },
    },
    include: {
      courses: true,
    },
  });

  if (colleges.length !== ids.length) {
    throw new AppError('One or more colleges not found', 404);
  }

  return colleges;
};
