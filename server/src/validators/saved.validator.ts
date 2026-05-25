import { z } from 'zod';

export const saveCollegeSchema = z.object({
  collegeId: z.string().min(1, 'College ID is required'),
});
