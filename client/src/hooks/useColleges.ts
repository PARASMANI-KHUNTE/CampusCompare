import { useQuery } from '@tanstack/react-query';
import { collegeService } from '../services/college.service';
import { CollegeFilters } from '../types';

export const useColleges = (filters: CollegeFilters) => {
  return useQuery({
    queryKey: ['colleges', filters],
    queryFn: () => collegeService.getColleges(filters),
    placeholderData: (previousData) => previousData, // keep previous data while loading new
  });
};

export const useCollege = (slug: string) => {
  return useQuery({
    queryKey: ['college', slug],
    queryFn: () => collegeService.getCollegeBySlug(slug),
    enabled: !!slug,
  });
};

export const useRelatedColleges = (slug: string) => {
  return useQuery({
    queryKey: ['colleges', 'related', slug],
    queryFn: () => collegeService.getRelatedColleges(slug),
    enabled: !!slug,
  });
};
