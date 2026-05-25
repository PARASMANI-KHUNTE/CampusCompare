import { useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { predictorService } from '../services/predictor.service';
import { College } from '../types';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { MapPin, Star, Users } from 'lucide-react';
import { Loader } from '../components/ui/Loader';
import { Badge } from '../components/ui/Badge';
import { getCollegeTypeLabel } from '../utils/format';

export const Predictor = () => {
  const [exam, setExam] = useState('');
  const [rank, setRank] = useState<number | ''>('');
  const [shouldFetch, setShouldFetch] = useState(false);

  const exams = [
    { value: 'JEE_MAIN', label: 'JEE Main' },
    { value: 'JEE_ADVANCED', label: 'JEE Advanced' },
    { value: 'BITSAT', label: 'BITSAT' },
    { value: 'MHT_CET', label: 'MHT CET' },
  ];

  const { data, isLoading, error } = useQuery({
    queryKey: ['predictor', exam, rank],
    queryFn: () => predictorService.getPredictions(exam, Number(rank)),
    enabled: shouldFetch && exam !== '' && rank !== '',
  });

  const handlePredict = (e: React.FormEvent) => {
    e.preventDefault();
    if (exam && rank) {
      setShouldFetch(true);
    }
  };

  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">College Predictor</h1>
          <p className="text-lg text-gray-600">Find the best colleges you can get into based on your exam rank.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-10">
          <form onSubmit={handlePredict} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div>
              <Select
                label="Exam"
                options={exams}
                value={exam}
                placeholder="Select an exam"
                onChange={(e) => {
                  setExam(e.target.value);
                  setShouldFetch(false);
                }}
                required
              />
            </div>
            <div>
              <Input
                label="Your Rank"
                type="number"
                min="1"
                placeholder="Enter your rank e.g. 5000"
                value={rank}
                onChange={(e) => {
                  setRank(e.target.value ? Number(e.target.value) : '');
                  setShouldFetch(false);
                }}
                required
              />
            </div>
            <div>
              <Button type="submit" className="w-full" disabled={!exam || !rank}>
                Predict Colleges
              </Button>
            </div>
          </form>
        </div>

        {isLoading && (
          <div className="flex justify-center py-12">
            <Loader text="Analyzing chances..." />
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center mb-8">
            An error occurred while fetching predictions. Please try again.
          </div>
        )}

        {data && data.colleges.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Recommended Colleges ({data.total})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.colleges.map((college) => (
                <Link
                  key={college.id}
                  to={`/colleges/${college.slug}`}
                  className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-primary-100 transition-all duration-300 flex flex-col h-full"
                >
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={college.imageUrl || 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80'}
                      alt={college.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <div className="flex justify-between items-end">
                        <div>
                          <h3 className="text-xl font-bold line-clamp-1 group-hover:text-primary-300 transition-colors">
                            {college.name}
                          </h3>
                          <div className="flex items-center text-gray-200 mt-1">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span className="text-sm">{college.city}, {college.state}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 flex-grow flex flex-col">
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="success">Great Match</Badge>
                      <Badge variant="primary">{getCollegeTypeLabel(college.collegeType)}</Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-auto">
                      <div className="flex items-center text-gray-600 bg-gray-50 p-2 rounded-lg">
                        <Star className="w-4 h-4 text-yellow-400 mr-2" />
                        <span className="text-sm font-medium">{college.rating.toFixed(1)} Rating</span>
                      </div>
                      <div className="flex items-center text-gray-600 bg-gray-50 p-2 rounded-lg">
                        <Users className="w-4 h-4 text-primary-500 mr-2" />
                        <span className="text-sm font-medium">{college.reviewCount} Reviews</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {data && data.colleges.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <h3 className="text-xl font-medium text-gray-900 mb-2">No Matches Found</h3>
            <p className="text-gray-500">
              We couldn't find any colleges matching your criteria. Try adjusting your rank or exam.
            </p>
          </div>
        )}
      </div>
    </PageContainer>
  );
};
