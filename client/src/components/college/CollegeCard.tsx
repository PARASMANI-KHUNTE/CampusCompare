import { Link } from 'react-router-dom';
import { MapPin, Star, IndianRupee, GraduationCap, Building2, Heart, Scale, ExternalLink } from 'lucide-react';
import { College } from '../../types';
import { formatCurrency, formatRating, getCollegeTypeLabel, getCollegeTypeColor } from '../../utils/format';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useCompareStore } from '../../stores/compareStore';
import { useAuthStore } from '../../stores/authStore';
import { useSaveCollege, useRemoveSavedCollege } from '../../hooks/useSavedColleges';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

interface CollegeCardProps {
  college: College;
  isSaved?: boolean;
}

export const CollegeCard = ({ college, isSaved = false }: CollegeCardProps) => {
  const { addToCompare, isInCompare, removeFromCompare } = useCompareStore();
  const { isAuthenticated } = useAuthStore();
  const { mutate: saveCollege, isPending: isSaving } = useSaveCollege();
  const { mutate: removeSaved, isPending: isRemoving } = useRemoveSavedCollege();

  const inCompare = isInCompare(college.id);

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (inCompare) {
      removeFromCompare(college.id);
      toast.success(`Removed ${college.shortName || college.name} from compare`);
    } else {
      const error = addToCompare(college);
      if (error) toast.error(error);
      else toast.success(`Added ${college.shortName || college.name} to compare`);
    }
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    if (isSaved) {
      removeSaved(college.id);
    } else {
      saveCollege(college.id);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-shadow flex flex-col h-full overflow-hidden"
    >
      {/* Image */}
      <div className="relative h-48 w-full bg-gray-200 overflow-hidden">
        {college.imageUrl ? (
          <img
            src={college.imageUrl}
            alt={college.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 text-primary-200">
            <Building2 className="w-16 h-16" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <Badge variant={getCollegeTypeColor(college.collegeType)} className="shadow-sm bg-white/95 backdrop-blur-sm border-0">
            {getCollegeTypeLabel(college.collegeType)}
          </Badge>
        </div>

        <div className="absolute top-3 right-3">
          <div className="flex items-center gap-1 bg-white/95 backdrop-blur-sm rounded-full px-2.5 py-1 shadow-sm">
            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
            <span className="text-xs font-bold text-gray-900">{formatRating(college.rating)}</span>
            <span className="text-[10px] text-gray-400">({college.reviewCount})</span>
          </div>
        </div>

        {isAuthenticated && (
          <button
            onClick={handleSaveClick}
            disabled={isSaving || isRemoving}
            className="absolute bottom-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white text-gray-400 hover:text-red-500 transition-all disabled:opacity-50 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300"
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <Link to={`/colleges/${college.slug}`} className="block group/link">
          <h3 className="font-display font-semibold text-gray-900 line-clamp-2 min-h-[52px] group-hover/link:text-primary-600 transition-colors">
            {college.name}
          </h3>
        </Link>

        <div className="flex items-center text-sm text-gray-500 mt-1.5">
          <MapPin className="w-3.5 h-3.5 mr-1.5 shrink-0 text-gray-400" />
          <span className="truncate">{college.city}, {college.state}</span>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4 py-4 border-y border-gray-50">
          <div>
            <div className="flex items-center text-[11px] text-gray-400 font-medium mb-1 uppercase tracking-wider">
              <IndianRupee className="w-3 h-3 mr-1" />
              Fees
            </div>
            <p className="text-sm font-bold text-gray-900">
              {formatCurrency(college.feesMin)} - {formatCurrency(college.feesMax)}
            </p>
          </div>
          {college.placementAverage ? (
            <div>
              <div className="flex items-center text-[11px] text-gray-400 font-medium mb-1 uppercase tracking-wider">
                <GraduationCap className="w-3 h-3 mr-1" />
                Avg Package
              </div>
              <p className="text-sm font-bold text-emerald-700">
                {formatCurrency(college.placementAverage)}
              </p>
            </div>
          ) : (
            <div>
              <div className="flex items-center text-[11px] text-gray-400 font-medium mb-1 uppercase tracking-wider">
                <Star className="w-3 h-3 mr-1" />
                Rating
              </div>
              <p className="text-sm font-bold text-gray-900">
                {formatRating(college.rating)} <span className="font-normal text-gray-400">/ 5</span>
              </p>
            </div>
          )}
        </div>

        {college.popularCourses && college.popularCourses.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {college.popularCourses.slice(0, 3).map((course, idx) => (
              <span
                key={idx}
                className="text-[11px] bg-gray-50 text-gray-600 px-2 py-1 rounded-md border border-gray-100 font-medium"
              >
                {course}
              </span>
            ))}
            {college.popularCourses.length > 3 && (
              <span className="text-[11px] bg-primary-50 text-primary-600 px-2 py-1 rounded-md border border-primary-100 font-medium">
                +{college.popularCourses.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="mt-auto pt-4 flex items-center gap-2.5">
          <Button
            variant={inCompare ? 'secondary' : 'outline'}
            size="sm"
            className="flex-1 text-xs h-9"
            onClick={handleCompareClick}
          >
            <Scale className="w-3.5 h-3.5" />
            {inCompare ? 'Remove' : 'Compare'}
          </Button>
          <Link to={`/colleges/${college.slug}`} className="flex-1">
            <Button size="sm" className="w-full text-xs h-9">
              <ExternalLink className="w-3.5 h-3.5" />
              Details
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
