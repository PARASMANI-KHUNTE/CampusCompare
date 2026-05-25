import { useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Loader } from '../ui/Loader';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { isLoading } = useAuth(); // This hook triggers the initial /me fetch

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader text="Initializing app..." />
      </div>
    );
  }

  return <>{children}</>;
};
