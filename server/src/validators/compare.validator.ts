import { z } from 'zod';

export const compareQuerySchema = z.object({
  ids: z.string().min(1, 'ids parameter is required'),
});
