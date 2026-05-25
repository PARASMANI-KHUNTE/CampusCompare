import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, X, ArrowLeft, CheckCircle2, Star, TrendingUp, DollarSign, Trophy, BookOpen, Building2, Search, MapPin, GraduationCap, IndianRupee, Check } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useCompare } from '../hooks/useCompare';
import { useCompareStore } from '../stores/compareStore';
import { useDebounce } from '../hooks/useDebounce';
import { collegeService } from '../services/college.service';
import { Button } from '../components/ui/Button';
import { Loader } from '../components/ui/Loader';
import { ErrorState } from '../components/ui/ErrorState';
import { EmptyState } from '../components/ui/EmptyState';
import { Badge } from '../components/ui/Badge';
import { College, CollegeFilters } from '../types';
import { formatCurrency, formatRating, getCollegeTypeLabel, getCollegeTypeColor } from '../utils/format';
import toast from 'react-hot-toast';

export const Compare = () => {
  const { items, addToCompare, removeFromCompare, clearCompare, isInCompare } = useCompareStore();
  const navigate = useNavigate();

  const ids = useMemo(() => items.map((i) => i.id), [items]);
  const { data: colleges, isLoading, isError } = useCompare(ids);

  // Browse/search for more colleges
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 400);
  const hasEmptySlots = items.length < 3;

  const searchFilters: CollegeFilters = useMemo(() => ({
    search: debouncedSearch || undefined,
    limit: 6,
    page: 1,
  }), [debouncedSearch]);

  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ['colleges', 'browse-compare', searchFilters],
    queryFn: () => collegeService.getColleges(searchFilters),
    enabled: hasEmptySlots && (debouncedSearch.length >= 2 || !debouncedSearch),
  });

  const handleAdd = (college: College) => {
    const error = addToCompare(college);
    if (error) { toast.error(error); return; }
    toast.success(`Added ${college.shortName || college.name} to compare`);
    setSearchQuery('');
  };

  if (items.length === 0) {
    return (
      <div className="container-custom py-16">
        <EmptyState
          icon={<Plus className="w-8 h-8" />}
          title="No colleges to compare"
          description="Add colleges to your compare list to see a side-by-side analysis."
          action={
            <Button onClick={() => navigate('/colleges')}>
              Browse Colleges
            </Button>
          }
        />
        <div className="max-w-2xl mx-auto mt-10">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search colleges to add to compare..."
              className="w-full h-12 pl-12 pr-4 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
            />
          </div>
          <CollegeSearchResults
            data={searchResults}
            isLoading={isSearching}
            isInCompare={isInCompare}
            onAdd={handleAdd}
            query={debouncedSearch}
          />
        </div>
      </div>
    );
  }

  if (items.length === 1) {
    return (
      <div className="container-custom py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-2">Compare Colleges</h1>
            <p className="text-gray-600">Add at least one more college to start comparing</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/colleges')}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Browse Colleges
          </Button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="font-semibold text-gray-900 mb-4">Currently Selected</h3>
          <div className="flex items-center gap-4 p-4 bg-primary-50 rounded-xl max-w-md">
            <div className="w-16 h-16 bg-gray-200 rounded-xl overflow-hidden shrink-0">
              {items[0].imageUrl ? (
                <img src={items[0].imageUrl} alt={items[0].name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  <Building2 className="w-8 h-8" />
                </div>
              )}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{items[0].name}</p>
              <p className="text-sm text-gray-500">{items[0].city}, {items[0].state}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-lg text-gray-900">Add Another College</h3>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search colleges..."
                className="w-full h-10 pl-9 pr-4 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:bg-white"
              />
            </div>
          </div>
          <CollegeSearchResults
            data={searchResults}
            isLoading={isSearching}
            isInCompare={isInCompare}
            onAdd={handleAdd}
            query={debouncedSearch}
          />
        </div>
      </div>
    );
  }

  if (isLoading) return <Loader text="Analyzing colleges..." />;
  if (isError || !colleges) return <ErrorState message="Failed to load comparison data" />;

  const features = [
    { label: 'Rating', key: 'rating', render: (c: College) => `${formatRating(c.rating)} / 5.0`, best: 'max' as const },
    { label: 'Institution Type', key: 'collegeType', render: (c: College) => getCollegeTypeLabel(c.collegeType), best: null },
    { label: 'Location', key: 'location', render: (c: College) => `${c.city}, ${c.state}`, best: null },
    { label: 'Established', key: 'establishedYear', render: (c: College) => c.establishedYear ? String(c.establishedYear) : 'N/A', best: null },
    { label: 'Fees Range', key: 'fees', render: (c: College) => `${formatCurrency(c.feesMin)} - ${formatCurrency(c.feesMax)}`, best: 'min' as const },
    { label: 'Avg Placement', key: 'placementAverage', render: (c: College) => c.placementAverage ? formatCurrency(c.placementAverage) : 'N/A', best: 'max' as const },
    { label: 'Highest Placement', key: 'placementHighest', render: (c: College) => c.placementHighest ? formatCurrency(c.placementHighest) : 'N/A', best: 'max' as const },
    { label: 'Total Reviews', key: 'reviewCount', render: (c: College) => String(c.reviewCount), best: 'max' as const },
  ];

  const getBestCollegeId = (feature: typeof features[number]): string | null => {
    if (!feature.best || colleges.length < 2) return null;
    const values = colleges.map(c => {
      if (feature.key === 'fees') return c.feesMax;
      const v = c[feature.key as keyof College];
      return typeof v === 'number' ? v : null;
    });
    if (values.every(v => v === null)) return null;

    const validValues = values.filter((v): v is number => v !== null && v > 0);
    if (validValues.length === 0) return null;
    const bestVal = feature.best === 'max' ? Math.max(...validValues) : Math.min(...validValues);
    const bestIdx = values.findIndex(v => v === bestVal);
    return bestIdx >= 0 ? colleges[bestIdx].id : null;
  };

  const verdictScores: Record<string, number> = {};
  colleges.forEach(c => { verdictScores[c.id] = 0; });
  features.forEach(feature => {
    const bestId = getBestCollegeId(feature);
    if (bestId) verdictScores[bestId]++;
  });
  const verdictWinnerId = Object.entries(verdictScores).sort(([,a], [,b]) => b - a)[0]?.[0];
  const verdictWinner = colleges.find(c => c.id === verdictWinnerId);

  const allFacilities = Array.from(new Set(colleges.flatMap(c => c.facilities)));
  const allCourseNames = Array.from(new Set(
    colleges.flatMap(c => c.courses?.map(course => course.name) || c.popularCourses || [])
  ));

  const browseColleges = searchResults?.data?.filter(c => !isInCompare(c.id)) || [];

  return (
    <div className="container-custom py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-2">Compare Colleges</h1>
          <p className="text-gray-600">Side-by-side analysis of your selected colleges</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate('/colleges')}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Search
          </Button>
          <Button variant="danger" onClick={clearCompare}>
            Clear All
          </Button>
        </div>
      </div>

      {verdictWinner && colleges.length >= 2 && (
        <div className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 animate-fade-in">
          <div className="flex items-start gap-4">
            <div className="bg-green-100 p-3 rounded-xl shrink-0">
              <Trophy className="w-7 h-7 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-display font-bold text-lg text-green-900 mb-1">Best Overall Pick</h3>
              <p className="text-green-700 text-sm mb-3">
                Based on rating, fees, and placement data, <strong>{verdictWinner.shortName || verdictWinner.name}</strong> leads
                in {verdictScores[verdictWinnerId]} out of {features.filter(f => f.best).length} comparable categories.
              </p>
              <div className="flex flex-wrap gap-2">
                {features.filter(f => f.best && getBestCollegeId(f) === verdictWinnerId).map(f => (
                  <span key={f.key} className="inline-flex items-center gap-1 text-xs font-medium bg-green-100 text-green-800 px-2.5 py-1 rounded-full">
                    <CheckCircle2 className="w-3 h-3" /> Best {f.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr>
              <th className="sticky top-0 z-10 w-48 p-4 bg-gray-50 border-b border-r border-gray-200 align-top">
                <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Colleges</div>
                <div className="text-xs text-gray-400 font-normal">Features & Stats</div>
              </th>
              {colleges.map((college) => (
                <th key={college.id} className={`sticky top-0 z-10 p-4 border-b border-r border-gray-200 relative min-w-[250px] w-1/3 align-top ${verdictWinnerId === college.id ? 'bg-green-50/40' : 'bg-white'}`}>
                  <button
                    onClick={() => removeFromCompare(college.id)}
                    className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  {verdictWinnerId === college.id && (
                    <div className="absolute top-2 left-2">
                      <span className="inline-flex items-center gap-1 text-xs font-bold bg-green-500 text-white px-2 py-0.5 rounded-full">
                        <Trophy className="w-3 h-3" /> Best Pick
                      </span>
                    </div>
                  )}
                  <div className="h-32 bg-gray-100 rounded-lg mb-4 overflow-hidden mt-4">
                    {college.imageUrl ? (
                      <img src={college.imageUrl} alt={college.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <Building2 className="w-12 h-12" />
                      </div>
                    )}
                  </div>
                  <Link to={`/colleges/${college.slug}`} className="hover:text-primary-600 transition-colors">
                    <h3 className="font-semibold text-gray-900 text-lg leading-tight mb-1">{college.name}</h3>
                  </Link>
                  <p className="text-xs text-gray-500">{college.city}, {college.state}</p>
                </th>
              ))}
              {colleges.length < 3 && Array.from({ length: 3 - colleges.length }).map((_, i) => (
                <th key={i} className="sticky top-0 z-10 p-4 bg-gray-50/50 border-b border-gray-200 w-1/3 align-middle text-center">
                  <span className="text-xs text-gray-400 font-medium">Empty Slot</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-3 border-b border-r border-gray-200 bg-primary-50 font-semibold text-primary-900 text-sm" colSpan={4}>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> Key Statistics
                </div>
              </td>
            </tr>

            {features.map((feature, idx) => {
              const bestId = getBestCollegeId(feature);
              return (
                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 border-b border-r border-gray-200 bg-gray-50/30 text-sm font-medium text-gray-700">
                    <div className="flex items-center gap-1.5">
                      {feature.best === 'max' && <TrendingUp className="w-3.5 h-3.5 text-primary-500" />}
                      {feature.best === 'min' && <DollarSign className="w-3.5 h-3.5 text-green-500" />}
                      {feature.label}
                    </div>
                  </td>
                  {colleges.map((college) => {
                    const isBest = bestId === college.id;
                    return (
                      <td key={college.id} className={`p-4 border-b border-r border-gray-200 text-sm ${isBest ? 'bg-green-50/80 text-green-900 font-semibold' : 'text-gray-900'}`}>
                        <div className="flex items-center gap-1.5">
                          {isBest && <Star className="w-3.5 h-3.5 fill-green-500 text-green-500 shrink-0" />}
                          {feature.render(college)}
                        </div>
                      </td>
                    );
                  })}
                  {colleges.length < 3 && Array.from({ length: 3 - colleges.length }).map((_, i) => (
                    <td key={i} className="p-4 border-b border-gray-200 bg-gray-50/50"></td>
                  ))}
                </tr>
              );
            })}

            {allCourseNames.length > 0 && (
              <>
                <tr>
                  <td className="p-3 border-b border-r border-gray-200 bg-blue-50 font-semibold text-blue-900 text-sm" colSpan={4}>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" /> Courses Offered
                    </div>
                  </td>
                </tr>
                {allCourseNames.map((courseName, idx) => (
                  <tr key={`course-${idx}`} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 border-b border-r border-gray-200 bg-gray-50/30 text-sm text-gray-700">
                      {courseName}
                    </td>
                    {colleges.map((college) => {
                      const courseMatch = college.courses?.find(c => c.name === courseName);
                      const hasCourse = courseMatch || college.popularCourses?.includes(courseName);
                      return (
                        <td key={college.id} className="p-4 border-b border-r border-gray-200 text-center">
                          {hasCourse ? (
                            <div className="flex flex-col items-center gap-0.5">
                              <CheckCircle2 className="w-5 h-5 text-green-500" />
                              {courseMatch?.fees && (
                                <span className="text-xs text-gray-500">{formatCurrency(courseMatch.fees)}</span>
                              )}
                              {courseMatch?.duration && (
                                <span className="text-xs text-gray-400">{courseMatch.duration}</span>
                              )}
                            </div>
                          ) : (
                            <X className="w-5 h-5 text-gray-300 mx-auto" />
                          )}
                        </td>
                      );
                    })}
                    {colleges.length < 3 && Array.from({ length: 3 - colleges.length }).map((_, i) => (
                      <td key={i} className="p-4 border-b border-gray-200 bg-gray-50/50"></td>
                    ))}
                  </tr>
                ))}
              </>
            )}

            <tr>
              <td className="p-3 border-b border-r border-gray-200 bg-amber-50 font-semibold text-amber-900 text-sm" colSpan={4}>
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" /> Facilities
                </div>
              </td>
            </tr>
            {allFacilities.map((facility, idx) => (
              <tr key={`fac-${idx}`} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4 border-b border-r border-gray-200 bg-gray-50/30 text-sm text-gray-700">
                  {facility}
                </td>
                {colleges.map((college) => (
                  <td key={college.id} className="p-4 border-b border-r border-gray-200 text-center">
                    {college.facilities.includes(facility) ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-gray-300 mx-auto" />
                    )}
                  </td>
                ))}
                {colleges.length < 3 && Array.from({ length: 3 - colleges.length }).map((_, i) => (
                  <td key={i} className="p-4 border-b border-gray-200 bg-gray-50/50"></td>
                ))}
              </tr>
            ))}

            <tr className="bg-gray-50">
              <td className="p-4 border-b border-r border-gray-200 text-sm font-semibold text-gray-700">
                Total Facilities
              </td>
              {colleges.map((college) => {
                const count = college.facilities.length;
                const maxCount = Math.max(...colleges.map(c => c.facilities.length));
                const isBest = count === maxCount && colleges.length >= 2;
                return (
                  <td key={college.id} className={`p-4 border-b border-r border-gray-200 text-center text-sm font-bold ${isBest ? 'text-green-600 bg-green-50/80' : 'text-gray-900'}`}>
                    {isBest && <Star className="w-3.5 h-3.5 fill-green-500 text-green-500 inline mr-1" />}
                    {count} / {allFacilities.length}
                  </td>
                );
              })}
              {colleges.length < 3 && Array.from({ length: 3 - colleges.length }).map((_, i) => (
                <td key={i} className="p-4 border-b border-gray-200 bg-gray-50/50"></td>
              ))}
            </tr>
          </tbody>
        </table>
        </div>
      </div>

      {/* Inline Browse Section */}
      {hasEmptySlots && (
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-lg text-gray-900">
              Add More Colleges <span className="text-sm font-normal text-gray-500">({3 - colleges.length} slot{colleges.length < 2 ? 's' : ''} remaining)</span>
            </h3>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search colleges..."
                className="w-full h-10 pl-9 pr-4 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:bg-white"
              />
            </div>
          </div>

          <CollegeSearchResults
            data={searchResults}
            isLoading={isSearching}
            isInCompare={isInCompare}
            onAdd={handleAdd}
            query={debouncedSearch}
          />
        </div>
      )}

      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="font-display font-bold text-lg text-gray-900 mb-4">Exams Accepted</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {colleges.map((college) => (
            <div key={college.id} className="space-y-2">
              <h4 className="font-semibold text-sm text-gray-700">{college.shortName || college.name}</h4>
              <div className="flex flex-wrap gap-1.5">
                {college.examsAccepted.map((exam, idx) => (
                  <span key={idx} className="text-xs bg-primary-50 text-primary-700 px-2.5 py-1 rounded-full font-medium border border-primary-100">
                    {exam}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="font-display font-bold text-lg text-gray-900 mb-4">Accreditation & Approvals</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {colleges.map((college) => (
            <div key={college.id} className="space-y-3">
              <h4 className="font-semibold text-sm text-gray-700">{college.shortName || college.name}</h4>
              <div>
                <p className="text-xs text-gray-500 mb-1 font-medium">Approved By</p>
                <div className="flex flex-wrap gap-1.5">
                  {college.approvedBy.map((item, idx) => (
                    <span key={idx} className="text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-full font-medium border border-green-100">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              {college.accreditation.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 mb-1 font-medium">Accreditation</p>
                  <div className="flex flex-wrap gap-1.5">
                    {college.accreditation.map((item, idx) => (
                      <span key={idx} className="text-xs bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full font-medium border border-amber-100">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface SearchResultsProps {
  data: any;
  isLoading: boolean;
  isInCompare: (id: string) => boolean;
  onAdd: (college: College) => void;
  query?: string;
}

const CollegeSearchResults = ({ data, isLoading, isInCompare, onAdd, query }: SearchResultsProps) => {
  const rawColleges: College[] = data?.data || [];
  const totalCount = data?.pagination?.total || 0;
  const colleges = rawColleges.filter(c => !isInCompare(c.id));
  const allFilteredOut = rawColleges.length > 0 && colleges.length === 0;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-36 bg-gray-50 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (query && query.length >= 2 && colleges.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-6 py-8">
        {allFilteredOut ? `All colleges matching "${query}" are already in your compare list` : `No colleges found for "${query}"`}
      </p>
    );
  }

  if (colleges.length === 0) {
    return (
      <p className="text-center text-gray-400 mt-6 py-8 text-sm">
        Start typing to search for colleges
      </p>
    );
  }

  return (
    <div>
      <p className="text-xs text-gray-500 mt-4 mb-3">{totalCount} college{totalCount !== 1 ? 's' : ''} found</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {colleges.map((college: College) => (
          <div key={college.id} className="group bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg hover:border-primary-200 transition-all duration-200 flex flex-col">
            <div className="relative h-28 bg-gray-100 overflow-hidden">
              {college.imageUrl ? (
                <img src={college.imageUrl} alt={college.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  <Building2 className="w-10 h-10" />
                </div>
              )}
              <div className="absolute top-2 right-2">
                <Badge variant={getCollegeTypeColor(college.collegeType)} className="text-[10px] py-0.5 shadow-sm">
                  {getCollegeTypeLabel(college.collegeType)}
                </Badge>
              </div>
            </div>
            <div className="p-3 flex flex-col flex-1">
              <p className="text-sm font-semibold text-gray-900 truncate leading-tight">{college.name}</p>
              <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                <MapPin className="w-3 h-3 shrink-0" />
                <span className="truncate">{college.city}, {college.state}</span>
              </div>
              <div className="flex items-center justify-between mt-auto pt-2">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span className="inline-flex items-center gap-0.5 font-medium text-gray-900">
                    <IndianRupee className="w-3 h-3" />{formatCurrency(college.feesMin)}
                  </span>
                  {college.placementAverage && (
                    <>
                      <span className="text-gray-300">|</span>
                      <span className="inline-flex items-center gap-0.5">
                        <GraduationCap className="w-3 h-3" />{formatCurrency(college.placementAverage)}
                      </span>
                    </>
                  )}
                </div>
                <button
                  onClick={() => onAdd(college)}
                  className="flex items-center gap-1 text-xs font-semibold text-primary-600 bg-primary-50 hover:bg-primary-100 px-2.5 py-1.5 rounded-lg transition-colors shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
