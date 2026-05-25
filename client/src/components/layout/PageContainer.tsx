import { ReactNode } from 'react';

export const PageContainer = ({ children, className = '' }: { children: ReactNode; className?: string }) => {
  return (
    <div className={`container-custom min-h-[calc(100vh-64px)] ${className}`}>
      {children}
    </div>
  );
};
