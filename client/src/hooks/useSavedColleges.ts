import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { savedService } from '../services/saved.service';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';

export const useSavedColleges = () => {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['saved-colleges'],
    queryFn: savedService.getSavedColleges,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });
};

export const useSaveCollege = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: savedService.saveCollege,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-colleges'] });
      toast.success('College saved successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to save college');
    },
  });
};

export const useRemoveSavedCollege = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: savedService.removeSavedCollege,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-colleges'] });
      toast.success('College removed from saved list');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to remove college');
    },
  });
};
