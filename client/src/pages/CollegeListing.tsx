import { useState } from 'react';
import { useColleges } from '../hooks/useColleges';
import { CollegeCard } from '../components/college/CollegeCard';
import { CollegeFilters } from '../components/college/CollegeFilters';
import { CompareTray } from '../components/college/CompareTray';
import { Loader } from '../components/ui/Loader';
import { SkeletonCard } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorState } from '../components/ui/ErrorState';
import { Pagination } from '../components/ui/Pagination';
import { Building2 } from 'lucide-react';
import { useSavedColleges } from '../hooks/useSavedColleges';
import { CollegeFilters as CollegeFiltersType } from '../types';

export const CollegeListing = () => {
  const [filters, setFilters] = useState<CollegeFiltersType>({ page: 1, limit: 12 });
  const { data, isLoading, isError, refetch } = useColleges(filters);
  const { data: savedColleges } = useSavedColleges();

  const handleFilterChange = (newFilters: Partial<CollegeFiltersType>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const isCollegeSaved = (collegeId: string) => {
    return savedColleges?.some((sc) => sc.collegeId === collegeId) || false;
  };

  return (
    <div className="py-8 bg-gray-50/50 min-h-screen">
      <div className="container-custom">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">Discover Colleges</h1>
          <p className="text-gray-600">Find and compare the best colleges for your career</p>
        </div>

        <CollegeFilters onFilterChange={handleFilterChange} initialFilters={filters} />

        {isError ? (
          <ErrorState message="Failed to load colleges" onRetry={() => refetch()} />
        ) : (
          <>
            {!isLoading && data?.data.length === 0 ? (
              <EmptyState
                icon={<Building2 className="w-8 h-8" />}
                title="No colleges found"
                description="Try adjusting your filters or search terms to find what you're looking for."
              />
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {isLoading
                    ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
                    : data?.data.map((college) => (
                        <CollegeCard 
                          key={college.id} 
                          college={college} 
                          isSaved={isCollegeSaved(college.id)}
                        />
                      ))}
                </div>

                {data?.pagination && data.pagination.totalPages > 1 && (
                  <Pagination
                    page={data.pagination.page}
                    totalPages={data.pagination.totalPages}
                    onPageChange={(page) => handleFilterChange({ page })}
                  />
                )}
              </>
            )}
          </>
        )}
      </div>
      <CompareTray />
    </div>
  );
};
