import { Loader2 } from 'lucide-react';

export const Loader = ({ text = 'Loading...' }: { text?: string }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full">
      <Loader2 className="w-10 h-10 animate-spin text-primary-600 mb-4" />
      <p className="text-gray-500 font-medium">{text}</p>
    </div>
  );
};
