import { useQuery } from '@tanstack/react-query';
import { reviewService } from '../services/review.service';

export const useReviews = (collegeId: string) => {
  return useQuery({
    queryKey: ['reviews', collegeId],
    queryFn: () => reviewService.getReviews(collegeId),
    enabled: !!collegeId,
  });
};
