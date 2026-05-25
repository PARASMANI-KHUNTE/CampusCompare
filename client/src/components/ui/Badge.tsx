import { HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'gray';
}

export const Badge = ({ children, variant = 'gray', className, ...props }: BadgeProps) => {
  return (
    <span className={cn(`badge-${variant}`, className)} {...props}>
      {children}
    </span>
  );
};
