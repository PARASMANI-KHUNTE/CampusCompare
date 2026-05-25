import { useQuery } from '@tanstack/react-query';
import { compareService } from '../services/compare.service';

export const useCompare = (ids: string[]) => {
  const stableKey = JSON.stringify(ids);
  return useQuery({
    queryKey: ['compare', stableKey],
    queryFn: () => compareService.compareColleges(ids),
    enabled: ids.length >= 2,
  });
};
