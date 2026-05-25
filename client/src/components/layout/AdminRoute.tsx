import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Loader } from '../ui/Loader';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

export const AdminRoute = () => {
  const { user, isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        toast.error('Please login to access this page');
      } else if (user?.role !== 'ADMIN') {
        toast.error('You do not have permission to access this page');
      }
    }
  }, [isLoading, isAuthenticated, user]);

  if (isLoading) {
    return <Loader text="Verifying permissions..." />;
  }

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
