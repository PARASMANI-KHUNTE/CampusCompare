import { AlertCircle } from 'lucide-react';
import { Button } from './Button';
import { motion } from 'framer-motion';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState = ({ message = 'Something went wrong', onRetry }: ErrorStateProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-20 px-4 text-center glass rounded-3xl border-red-100"
    >
      <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6 shadow-sm border border-red-100">
        <AlertCircle className="w-10 h-10" />
      </div>
      <h3 className="text-2xl font-display font-semibold text-gray-900 mb-3">Oops! Error occurred</h3>
      <p className="text-gray-500 max-w-md mb-8 text-lg">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          Try Again
        </Button>
      )}
    </motion.div>
  );
};
