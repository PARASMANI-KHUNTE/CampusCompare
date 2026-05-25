import { prisma } from '../config/prisma';
import { Prisma } from '@prisma/client';
import { AppError } from '../utils/AppError';

export const saveCollege = async (userId: string, collegeId: string) => {
  const college = await prisma.college.findUnique({
    where: { id: collegeId }
  });

  if (!college) {
    throw new AppError('College not found', 404);
  }

  try {
    const savedCollege = await prisma.savedCollege.create({
      data: {
        userId,
        collegeId,
      },
      include: {
        college: true,
      }
    });
    return savedCollege;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new AppError('College is already saved', 409);
    }
    throw error;
  }
};

export const getSavedColleges = async (userId: string) => {
  const savedColleges = await prisma.savedCollege.findMany({
    where: { userId },
    include: {
      college: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return savedColleges;
};

export const removeSavedCollege = async (userId: string, collegeId: string) => {
  await prisma.savedCollege.delete({
    where: {
      userId_collegeId: {
        userId,
        collegeId,
      },
    },
  });

  return { success: true };
};
