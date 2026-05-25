import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../stores/authStore';
import { useCompareStore } from '../stores/compareStore';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const { setUser, clearUser } = useAuthStore();

  const { data: user, isLoading: isFetchingUser } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      try {
        const user = await authService.getMe();
        setUser(user);
        return user;
      } catch {
        clearUser();
        return null;
      }
    },
    retry: false,
    staleTime: 10 * 60 * 1000,
  });

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      // Clear all cached data from previous user session before setting the new user
      queryClient.removeQueries({ queryKey: ['saved-colleges'] });
      queryClient.removeQueries({ queryKey: ['admin-colleges'] });
      queryClient.removeQueries({ queryKey: ['admin-courses'] });
      useCompareStore.getState().clearCompare();

      setUser(data.user);
      queryClient.setQueryData(['auth', 'me'], data.user);
      toast.success('Logged in successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Login failed');
    },
  });

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      setUser(data.user);
      queryClient.setQueryData(['auth', 'me'], data.user);
      toast.success('Registered successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Registration failed');
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      clearUser();
      // Clear the persisted compare store (localStorage)
      useCompareStore.getState().clearCompare();
      // Fully reset all React Query caches
      queryClient.clear();
      toast.success('Logged out successfully');
    },
  });

  return {
    user,
    isLoading: isFetchingUser,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    logout: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,
  };
};
