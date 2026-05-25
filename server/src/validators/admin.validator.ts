import { z } from 'zod';

export const createCollegeSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  collegeType: z.enum(['GOVERNMENT', 'PRIVATE', 'DEEMED', 'AUTONOMOUS']),
  feesMin: z.number().min(0),
  feesMax: z.number().min(0),
  imageUrl: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
  officialUrl: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
});

export const updateCollegeSchema = createCollegeSchema.partial();

export const createCourseSchema = z.object({
  collegeId: z.string().min(1, 'College ID is required'),
  name: z.string().min(1, 'Course name is required'),
  category: z.string().min(1, 'Category is required'),
  duration: z.string().min(1, 'Duration is required'),
  fees: z.number().min(0),
});

export const updateCourseSchema = createCourseSchema.partial();
