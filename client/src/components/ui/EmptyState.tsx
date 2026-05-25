import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-20 px-4 text-center glass rounded-3xl"
    >
      <div className="w-20 h-20 bg-primary-50 text-primary-500 rounded-full flex items-center justify-center mb-6 shadow-sm border border-primary-100">
        {icon}
      </div>
      <h3 className="text-2xl font-display font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-500 max-w-md mb-8 text-lg">{description}</p>
      {action && <div>{action}</div>}
    </motion.div>
  );
};
