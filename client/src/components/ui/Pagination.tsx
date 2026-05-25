import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ page, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <Button
        variant="outline"
        size="sm"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="px-3"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Prev
      </Button>
      
      <div className="flex items-center gap-1" role="navigation" aria-label="Pagination">
        {Array.from({ length: totalPages }).map((_, i) => {
          const pageNumber = i + 1;
          const isActive = pageNumber === page;
          
          if (
            pageNumber === 1 ||
            pageNumber === totalPages ||
            (pageNumber >= page - 1 && pageNumber <= page + 1)
          ) {
            return (
              <button
                key={pageNumber}
                onClick={() => onPageChange(pageNumber)}
                aria-label={`Page ${pageNumber}`}
                aria-current={isActive ? 'page' : undefined}
                className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-primary-600 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {pageNumber}
              </button>
            );
          }
          
          if (
            pageNumber === page - 2 ||
            pageNumber === page + 2
          ) {
            return <span key={pageNumber} className="text-gray-400" aria-hidden="true">...</span>;
          }
          
          return null;
        })}
      </div>

      <Button
        variant="outline"
        size="sm"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className="px-3"
        aria-label="Next page"
      >
        Next
        <ChevronRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  );
};
