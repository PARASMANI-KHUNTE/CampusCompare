import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSavedColleges } from '../hooks/useSavedColleges';
import { savedComparisonService } from '../services/saved-comparison.service';
import { compareService } from '../services/compare.service';
import { CollegeCard } from '../components/college/CollegeCard';
import { Loader } from '../components/ui/Loader';
import { ErrorState } from '../components/ui/ErrorState';
import { EmptyState } from '../components/ui/EmptyState';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Heart, Scale, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useCompareStore } from '../stores/compareStore';
import toast from 'react-hot-toast';

export const SavedColleges = () => {
  const [activeTab, setActiveTab] = useState<'colleges' | 'comparisons'>('colleges');
  const [deleteComparisonId, setDeleteComparisonId] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setItems } = useCompareStore();

  const { data: savedColleges, isLoading: isLoadingColleges, isError: isErrorColleges, refetch: refetchColleges } = useSavedColleges();

  const { data: savedComparisons, isLoading: isLoadingComparisons, isError: isErrorComparisons, refetch: refetchComparisons } = useQuery({
    queryKey: ['saved-comparisons'],
    queryFn: () => savedComparisonService.getSavedComparisons(),
  });

  const deleteComparisonMutation = useMutation({
    mutationFn: (id: string) => savedComparisonService.deleteSavedComparison(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-comparisons'] });
      toast.success('Comparison deleted');
    },
    onError: () => {
      toast.error('Failed to delete comparison');
    },
  });

  const loadComparison = async (collegeIds: string[]) => {
    try {
      const results = await compareService.compareColleges(collegeIds);
      setItems(results);
      navigate('/compare');
    } catch (error) {
      toast.error('Failed to load comparison data');
    }
  };

  const renderColleges = () => {
    if (isLoadingColleges) return <Loader text="Loading your saved colleges..." />;
    if (isErrorColleges) return <ErrorState message="Failed to load saved colleges" onRetry={() => refetchColleges()} />;

    if (!savedColleges || savedColleges.length === 0) {
      return (
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
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {savedColleges.map((saved) => (
          <CollegeCard 
            key={saved.id} 
            college={saved.college} 
            isSaved={true} 
          />
        ))}
      </div>
    );
  };

  const renderComparisons = () => {
    if (isLoadingComparisons) return <Loader text="Loading your saved comparisons..." />;
    if (isErrorComparisons) return <ErrorState message="Failed to load saved comparisons" onRetry={() => refetchComparisons()} />;

    if (!savedComparisons || savedComparisons.length === 0) {
      return (
        <EmptyState
          icon={<Scale className="w-8 h-8" />}
          title="No comparisons saved yet"
          description="Go to the compare tool and save your comparisons for quick access."
          action={
            <Link to="/compare">
              <Button>Compare Colleges</Button>
            </Link>
          }
        />
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedComparisons.map((comparison) => (
          <div key={comparison.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col transition-all hover:shadow-md">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg text-gray-900">{comparison.name}</h3>
                <p className="text-xs text-gray-500 mt-1">Saved {formatDistanceToNow(new Date(comparison.createdAt), { addSuffix: true })}</p>
              </div>
              <button
                onClick={() => setDeleteComparisonId(comparison.id)}
                className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                title="Delete comparison"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3 mb-6">
              <p className="text-sm text-gray-600 font-medium">
                Comparing <strong>{comparison.colleges.length} colleges</strong>
              </p>
            </div>

            <div className="mt-auto">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => loadComparison(comparison.colleges)}
              >
                Open Comparison
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container-custom py-8 min-h-[calc(100vh-200px)]">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">My Saved Items</h1>
        <p className="text-gray-600">Access your shortlisted colleges and side-by-side comparisons.</p>
      </div>

      <div className="flex gap-4 border-b border-gray-200 mb-8">
        <button
          className={`pb-4 px-2 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'colleges'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('colleges')}
        >
          Saved Colleges
        </button>
        <button
          className={`pb-4 px-2 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'comparisons'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('comparisons')}
        >
          Saved Comparisons
        </button>
      </div>

      {activeTab === 'colleges' ? renderColleges() : renderComparisons()}

      <ConfirmDialog
        isOpen={deleteComparisonId !== null}
        onConfirm={() => {
          if (deleteComparisonId) {
            deleteComparisonMutation.mutate(deleteComparisonId);
            setDeleteComparisonId(null);
          }
        }}
        onCancel={() => setDeleteComparisonId(null)}
        title="Delete Comparison"
        message="Are you sure you want to delete this comparison? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        isLoading={deleteComparisonMutation.isPending}
      />
    </div>
  );
};
