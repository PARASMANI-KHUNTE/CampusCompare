import { useState, useEffect } from 'react';
import { Filter, X, Search, IndianRupee, Star, SlidersHorizontal } from 'lucide-react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { useDebounce } from '../../hooks/useDebounce';
import { CollegeFilters as CollegeFiltersType } from '../../types';
import { COLLEGE_COURSES, INDIAN_STATES, COLLEGE_TYPES, SORT_OPTIONS } from '../../constants';

interface FiltersProps {
  onFilterChange: (filters: Partial<CollegeFiltersType>) => void;
  initialFilters?: Partial<CollegeFiltersType>;
}

export const CollegeFilters = ({ onFilterChange, initialFilters = {} }: FiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(initialFilters.search || '');
  
  const debouncedSearch = useDebounce(searchTerm, 500);

  const [filters, setFilters] = useState({
    state: initialFilters.state || '',
    course: initialFilters.course || '',
    collegeType: initialFilters.collegeType || '',
    sort: initialFilters.sort || 'rating_desc',
    minFees: initialFilters.minFees?.toString() || '',
    maxFees: initialFilters.maxFees?.toString() || '',
    minRating: initialFilters.minRating?.toString() || '',
    minPlacement: initialFilters.minPlacement?.toString() || '',
  });

  useEffect(() => {
    onFilterChange({ search: debouncedSearch });
  }, [debouncedSearch]);

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    const payload: Partial<CollegeFiltersType> = { page: 1 };
    if (['minFees', 'maxFees', 'minRating', 'minPlacement'].includes(key)) {
      const numVal = value ? parseInt(value) : undefined;
      (payload as any)[key] = numVal;
    } else {
      (payload as any)[key] = value || undefined;
    }
    onFilterChange(payload);
  };

  const handleReset = () => {
    setSearchTerm('');
    const resetFilters = { state: '', course: '', collegeType: '', sort: 'rating_desc', minFees: '', maxFees: '', minRating: '', minPlacement: '' };
    setFilters(resetFilters);
    onFilterChange({ search: '', state: '', course: '', collegeType: '', sort: 'rating_desc', minFees: undefined, maxFees: undefined, minRating: undefined, minPlacement: undefined, page: 1 });
  };

  const activeFilterCount = [
    filters.state, filters.course, filters.collegeType,
    filters.minFees, filters.maxFees, filters.minRating,
  ].filter(Boolean).length;

  const FilterChips = () => (
    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
      {filters.state && (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-primary-50 text-primary-700 px-3 py-1.5 rounded-full border border-primary-100">
          {INDIAN_STATES.find(s => s === filters.state) || filters.state}
          <button onClick={() => handleFilterChange('state', '')} className="hover:text-primary-900">
            <X className="w-3 h-3" />
          </button>
        </span>
      )}
      {filters.course && (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full border border-indigo-100">
          {filters.course}
          <button onClick={() => handleFilterChange('course', '')} className="hover:text-indigo-900">
            <X className="w-3 h-3" />
          </button>
        </span>
      )}
      {filters.collegeType && (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full border border-emerald-100">
          {COLLEGE_TYPES.find(t => t.value === filters.collegeType)?.label || filters.collegeType}
          <button onClick={() => handleFilterChange('collegeType', '')} className="hover:text-emerald-900">
            <X className="w-3 h-3" />
          </button>
        </span>
      )}
      {filters.minFees && (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full border border-amber-100">
          Min: ₹{parseInt(filters.minFees).toLocaleString()}
          <button onClick={() => handleFilterChange('minFees', '')} className="hover:text-amber-900">
            <X className="w-3 h-3" />
          </button>
        </span>
      )}
      {filters.maxFees && (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full border border-amber-100">
          Max: ₹{parseInt(filters.maxFees).toLocaleString()}
          <button onClick={() => handleFilterChange('maxFees', '')} className="hover:text-amber-900">
            <X className="w-3 h-3" />
          </button>
        </span>
      )}
      {filters.minRating && (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-yellow-50 text-yellow-700 px-3 py-1.5 rounded-full border border-yellow-100">
          <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
          {filters.minRating}+ Rating
          <button onClick={() => handleFilterChange('minRating', '')} className="hover:text-yellow-900">
            <X className="w-3 h-3" />
          </button>
        </span>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-5 mb-6 sticky top-20 z-30">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="w-full md:w-96 relative">
          <Input
            placeholder="Search colleges, cities, courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="w-5 h-5" />}
            className="w-full bg-gray-50 border-transparent focus:bg-white"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Select
            value={filters.sort}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
            options={SORT_OPTIONS.map(o => ({ value: o.value, label: o.label }))}
            className="w-full md:w-48 bg-gray-50 border-transparent focus:bg-white"
          />
          
          <Button
            variant={isOpen ? 'primary' : 'outline'}
            onClick={() => setIsOpen(!isOpen)}
            className="relative shrink-0"
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-primary-600 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Active Filter Chips */}
      {activeFilterCount > 0 && !isOpen && <FilterChips />}

      {/* Expanded Filters */}
      <div className={`overflow-hidden transition-all duration-300 ease-out ${
        isOpen ? 'max-h-[600px] opacity-100 mt-4' : 'max-h-0 opacity-0'
      }`}>
        <div className="pt-4 border-t border-gray-100">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">State</label>
              <Select
                value={filters.state}
                onChange={(e) => handleFilterChange('state', e.target.value)}
                placeholder="All States"
                options={INDIAN_STATES.map(s => ({ value: s, label: s }))}
              />
            </div>
            
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Course</label>
              <Select
                value={filters.course}
                onChange={(e) => handleFilterChange('course', e.target.value)}
                placeholder="All Courses"
                options={COLLEGE_COURSES.map(c => ({ value: c, label: c }))}
              />
            </div>
            
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Type</label>
              <Select
                value={filters.collegeType}
                onChange={(e) => handleFilterChange('collegeType', e.target.value)}
                placeholder="All Types"
                options={COLLEGE_TYPES.map(t => ({ value: t.value, label: t.label }))}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Min Fees</label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  min="0"
                  step="1000"
                  placeholder="0"
                  value={filters.minFees}
                  onChange={(e) => handleFilterChange('minFees', e.target.value)}
                  className="input pl-8"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Max Fees</label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  min="0"
                  step="1000"
                  placeholder="Any"
                  value={filters.maxFees}
                  onChange={(e) => handleFilterChange('maxFees', e.target.value)}
                  className="input pl-8"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Min Rating</label>
              <div className="relative">
                <Star className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-400" />
                <input
                  type="number"
                  min="1"
                  max="5"
                  step="0.5"
                  placeholder="1"
                  value={filters.minRating}
                  onChange={(e) => handleFilterChange('minRating', e.target.value)}
                  className="input pl-8"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={handleReset} size="sm" className="text-gray-500 hover:text-gray-900">
              <X className="w-4 h-4 mr-2" />
              Clear All Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Chips when expanded */}
      {isOpen && activeFilterCount > 0 && <FilterChips />}
    </div>
  );
};
