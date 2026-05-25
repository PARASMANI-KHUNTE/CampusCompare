import { useSavedColleges } from '../hooks/useSavedColleges';
import { CollegeCard } from '../components/college/CollegeCard';
import { Loader } from '../components/ui/Loader';
import { ErrorState } from '../components/ui/ErrorState';
import { EmptyState } from '../components/ui/EmptyState';
import { Heart } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';

export const SavedColleges = () => {
  const { data: savedColleges, isLoading, isError, refetch } = useSavedColleges();

  if (isLoading) return <Loader text="Loading your saved colleges..." />;
  if (isError) return <ErrorState message="Failed to load saved colleges" onRetry={() => refetch()} />;

  return (
    <div className="container-custom py-8 min-h-[calc(100vh-200px)]">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">My Saved Colleges</h1>
        <p className="text-gray-600">Your personalized list of shortlisted colleges</p>
      </div>

      {!savedColleges || savedColleges.length === 0 ? (
        <EmptyState
          icon={<Heart className="w-8 h-8" />}
          title="No colleges saved yet"
          description="Start exploring colleges and click the heart icon to save them for later."
          action={
            <Link to="/colleges">
              <Button>Explore Colleges</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {savedColleges.map((saved) => (
            <CollegeCard 
              key={saved.id} 
              college={saved.college} 
              isSaved={true} 
            />
          ))}
        </div>
      )}
    </div>
  );
};
