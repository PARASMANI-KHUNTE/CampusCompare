import { z } from 'zod';

export const collegeQuerySchema = z.object({
  search: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  course: z.string().optional(),
  collegeType: z.enum(['GOVERNMENT', 'PRIVATE', 'DEEMED', 'AUTONOMOUS']).optional(),
  minFees: z.coerce.number().min(0).optional(),
  maxFees: z.coerce.number().min(0).optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  minPlacement: z.coerce.number().min(0).optional(),
  sort: z.enum(['rating_desc', 'fees_asc', 'fees_desc', 'placement_desc', 'newest']).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(12),
});
