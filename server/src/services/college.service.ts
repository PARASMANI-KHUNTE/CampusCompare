import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma';
import { z } from 'zod';
import { collegeQuerySchema } from '../validators/college.validator';
import { AppError } from '../utils/AppError';

type CollegeQueryParams = z.infer<typeof collegeQuerySchema>;

export const getColleges = async (params: CollegeQueryParams) => {
  const {
    search,
    city,
    state,
    course,
    collegeType,
    minFees,
    maxFees,
    minRating,
    minPlacement,
    sort,
    page = 1,
    limit = 12,
  } = params;

  const where: Prisma.CollegeWhereInput = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { shortName: { contains: search, mode: 'insensitive' } },
      { city: { contains: search, mode: 'insensitive' } },
      { state: { contains: search, mode: 'insensitive' } },
      { popularCourses: { hasSome: [search] } },
      { tags: { hasSome: [search] } },
    ];
  }

  if (city) where.city = { equals: city, mode: 'insensitive' };
  if (state) where.state = { equals: state, mode: 'insensitive' };
  if (collegeType) where.collegeType = collegeType;
  
  if (minFees !== undefined) where.feesMin = { gte: minFees };
  if (maxFees !== undefined) where.feesMax = { lte: maxFees };
  if (minRating !== undefined) where.rating = { gte: minRating };
  if (minPlacement !== undefined) where.placementAverage = { gte: minPlacement };

  if (course) {
    where.popularCourses = { hasSome: [course] };
  }

  let orderBy: Prisma.CollegeOrderByWithRelationInput = { rating: 'desc' };

  switch (sort) {
    case 'fees_asc':
      orderBy = { feesMin: 'asc' };
      break;
    case 'fees_desc':
      orderBy = { feesMax: 'desc' };
      break;
    case 'placement_desc':
      orderBy = { placementAverage: 'desc' };
      break;
    case 'newest':
      orderBy = { createdAt: 'desc' };
      break;
    case 'rating_desc':
    default:
      orderBy = { rating: 'desc' };
      break;
  }

  const skip = (page - 1) * limit;

  const [colleges, total] = await Promise.all([
    prisma.college.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    }),
    prisma.college.count({ where }),
  ]);

  return {
    data: colleges,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getCollegeBySlug = async (slug: string) => {
  const college = await prisma.college.findUnique({
    where: { slug },
    include: {
      courses: true,
      reviews: {
        include: {
          user: {
            select: { name: true, avatarUrl: true }
          }
        },
        orderBy: { createdAt: 'desc' },
      },
      _count: {
        select: { savedBy: true }
      }
    },
  });

  if (!college) {
    throw new AppError('College not found', 404);
  }

  return college;
};

export const getRelatedColleges = async (slug: string, limit = 4) => {
  const currentCollege = await prisma.college.findUnique({
    where: { slug },
    select: { id: true, state: true, collegeType: true },
  });

  if (!currentCollege) {
    throw new AppError('College not found', 404);
  }

  const relatedColleges = await prisma.college.findMany({
    where: {
      id: { not: currentCollege.id },
      OR: [
        { state: currentCollege.state },
        { collegeType: currentCollege.collegeType },
      ],
    },
    orderBy: { rating: 'desc' },
    take: limit,
  });

  return relatedColleges;
};
