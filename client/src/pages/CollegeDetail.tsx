import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Star, Building2, CheckCircle2, IndianRupee, GraduationCap, Heart, ExternalLink, Clock, Award, Sparkles, Scale, Trophy } from 'lucide-react';
import { useCollege, useRelatedColleges } from '../hooks/useColleges';
import { Loader } from '../components/ui/Loader';
import { ErrorState } from '../components/ui/ErrorState';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { CollegeCard } from '../components/college/CollegeCard';
import { ReviewList } from '../components/college/ReviewList';
import { ReviewForm } from '../components/college/ReviewForm';
import { formatCurrency, formatRating, getCollegeTypeLabel } from '../utils/format';
import { useAuthStore } from '../stores/authStore';
import { useCompareStore } from '../stores/compareStore';
import { useSaveCollege, useRemoveSavedCollege, useSavedColleges } from '../hooks/useSavedColleges';
import toast from 'react-hot-toast';

export const CollegeDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: college, isLoading, isError, refetch } = useCollege(slug!);
  const { data: relatedColleges } = useRelatedColleges(slug!);
  const { data: savedColleges } = useSavedColleges();
  const { isAuthenticated } = useAuthStore();
  const { addToCompare, isInCompare, removeFromCompare } = useCompareStore();
  const { mutate: saveCollege, isPending: isSaving } = useSaveCollege();
  const { mutate: removeSaved, isPending: isRemoving } = useRemoveSavedCollege();

  if (isLoading) return <Loader text="Loading college details..." />;
  if (isError || !college) return <ErrorState message="Failed to load college details" onRetry={() => refetch()} />;

  const isSaved = savedColleges?.some((sc) => sc.collegeId === college.id) || false;
  const inCompare = isInCompare(college.id);

  const handleSaveToggle = () => {
    if (!isAuthenticated) return;
    if (isSaved) { removeSaved(college.id); }
    else { saveCollege(college.id); }
  };

  const handleCompareToggle = () => {
    if (inCompare) {
      removeFromCompare(college.id);
      toast.success(`Removed ${college.shortName || college.name} from compare`);
    } else {
      const error = addToCompare(college);
      if (error) toast.error(error);
      else toast.success(`Added ${college.shortName || college.name} to compare`);
    }
  };

  return (
    <div className="pb-16 bg-gray-50/50">
      {/* Header Banner */}
      <div className="relative h-72 md:h-96 w-full bg-gray-900 overflow-hidden">
        {college.imageUrl ? (
          <img src={college.imageUrl} alt={college.name} className="w-full h-full object-cover opacity-60 scale-105" />
        ) : (
          <div className="w-full h-full flex items-center justify-center opacity-40">
            <Building2 className="w-24 h-24 text-white" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
        
        {/* Gradient overlay animation */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-transparent" />

        <div className="absolute bottom-0 left-0 w-full text-white pb-8">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="animate-fade-in">
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="primary" className="bg-white/15 hover:bg-white/25 backdrop-blur-md border-transparent text-white">
                    {getCollegeTypeLabel(college.collegeType)}
                  </Badge>
                  <Badge variant="gray" className="bg-white/15 hover:bg-white/25 backdrop-blur-md border-transparent text-white">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />
                    {formatRating(college.rating)} ({college.reviewCount} reviews)
                  </Badge>
                </div>
                <h1 className="text-3xl md:text-5xl font-display font-bold leading-tight mb-2 drop-shadow-sm">
                  {college.name}
                </h1>
                <div className="flex items-center text-gray-300 text-sm md:text-base gap-4">
                  <span className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1.5 shrink-0" />
                    {college.city}, {college.state}
                  </span>
                  {college.establishedYear && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-gray-500" />
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1.5" />
                        Est. {college.establishedYear}
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex gap-3 shrink-0 animate-slide-up">
                <Button
                  variant="outline"
                  className="bg-white/10 hover:bg-white/20 border-white/20 text-white backdrop-blur-md"
                  onClick={handleCompareToggle}
                >
                  <Scale className="w-4 h-4 mr-2" />
                  {inCompare ? 'Remove from Compare' : 'Add to Compare'}
                </Button>
                {isAuthenticated && (
                  <Button
                    variant={isSaved ? 'secondary' : 'primary'}
                    onClick={handleSaveToggle}
                    disabled={isSaving || isRemoving}
                    className={isSaved ? 'bg-white/15 border-white/20 text-white hover:bg-white/25' : ''}
                  >
                    <Heart className={`w-4 h-4 mr-2 ${isSaved ? 'fill-current text-red-400' : ''}`} />
                    {isSaved ? 'Saved' : 'Save College'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8 animate-fade-in">
            {/* Overview */}
            <section className="card p-6 md:p-8">
              <h2 className="text-xl font-display font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary-500" />
                Overview
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{college.overview || college.description}</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-8 p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100">
                {[
                  { label: 'Established', value: college.establishedYear || 'N/A' },
                  { label: 'Ownership', value: college.ownership || getCollegeTypeLabel(college.collegeType) },
                  { label: 'Approved By', value: college.approvedBy?.join(', ') || 'N/A' },
                  { label: 'Affiliated To', value: college.affiliatedTo || 'N/A' },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">{item.label}</p>
                    <p className="font-semibold text-gray-900 text-sm">{item.value}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Courses */}
            <section className="card p-6 md:p-8">
              <h2 className="text-xl font-display font-bold text-gray-900 mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-primary-500" />
                Courses & Fees
              </h2>
              {college.courses && college.courses.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {college.courses.map((course) => (
                    <div key={course.id} className="group p-5 border border-gray-100 rounded-xl hover:shadow-lg hover:border-primary-100 transition-all duration-200">
                      <div className="flex flex-col justify-between h-full">
                        <div>
                          <h4 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">{course.name}</h4>
                          <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1 px-2 py-0.5 bg-gray-50 rounded-md">
                              <GraduationCap className="w-3 h-3" />
                              {course.degree || course.category}
                            </span>
                            <span className="flex items-center gap-1 px-2 py-0.5 bg-gray-50 rounded-md">
                              <Clock className="w-3 h-3" />
                              {course.duration}
                            </span>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                          <div>
                            <p className="text-lg font-bold text-primary-600">{formatCurrency(course.fees)}</p>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider">Total Fees</p>
                          </div>
                          {course.examsAccepted && course.examsAccepted.length > 0 && (
                            <div className="text-right">
                              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Exams</p>
                              <div className="flex gap-1">
                                {course.examsAccepted.slice(0, 2).map((exam, i) => (
                                  <Badge key={i} variant="gray" className="text-[10px] py-0.5">{exam}</Badge>
                                ))}
                                {course.examsAccepted.length > 2 && (
                                  <Badge variant="gray" className="text-[10px] py-0.5">+{course.examsAccepted.length - 2}</Badge>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Course information is not available at the moment.</p>
              )}
            </section>

            {/* Facilities */}
            <section className="card p-6 md:p-8">
              <h2 className="text-xl font-display font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary-500" />
                Facilities
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {college.facilities.map((facility, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 p-3 bg-gray-50 rounded-lg hover:bg-primary-50 transition-colors group">
                    <div className="w-2 h-2 rounded-full bg-primary-400 group-hover:scale-125 transition-transform" />
                    <span className="text-sm text-gray-700 group-hover:text-primary-700 transition-colors">{facility}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Reviews */}
            <section className="card p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-bold text-gray-900 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Student Reviews
                </h2>
                <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-full">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold text-lg text-yellow-800">{formatRating(college.rating)}</span>
                  <span className="text-yellow-600 text-sm">({college.reviewCount} reviews)</span>
                </div>
              </div>
              <div className="space-y-10">
                <ReviewList reviews={college.reviews || []} />
                {isAuthenticated ? (
                  <div className="border-t border-gray-100 pt-8">
                    <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
                    <ReviewForm collegeId={college.id} collegeSlug={college.slug} />
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-primary-50 to-indigo-50 p-8 rounded-xl text-center border border-primary-100">
                    <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Star className="w-7 h-7 text-primary-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Share your experience</h3>
                    <p className="text-gray-600 mb-6 text-sm">Login to write a review for {college.shortName || college.name}</p>
                    <Button onClick={() => navigate('/login')}>Login to Review</Button>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="w-4 h-4 text-primary-500" />
                Highlights
              </h3>
              <div className="space-y-4">
                {college.placementAverage && (
                  <div className="flex items-start gap-3 pb-4 border-b border-gray-50">
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                      <IndianRupee className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Average Placement</p>
                      <p className="font-bold text-gray-900">{formatCurrency(college.placementAverage)}</p>
                    </div>
                  </div>
                )}
                {college.placementHighest && (
                  <div className="flex items-start gap-3 pb-4 border-b border-gray-50">
                    <div className="w-10 h-10 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center shrink-0">
                      <Trophy className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Highest Placement</p>
                      <p className="font-bold text-gray-900">{formatCurrency(college.placementHighest)}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3 pb-4 border-b border-gray-50">
                  <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="font-semibold text-gray-900">{college.city}, {college.state}</p>
                  </div>
                </div>
                {college.rating && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-yellow-50 text-yellow-600 rounded-xl flex items-center justify-center shrink-0">
                      <Star className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Overall Rating</p>
                      <div className="flex items-center gap-1.5">
                        <p className="font-bold text-gray-900">{formatRating(college.rating)}</p>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} className={`w-3 h-3 ${s <= Math.round(college.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {college.officialUrl && (
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <a
                    href={college.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full bg-white border border-gray-200 hover:border-primary-300 hover:bg-primary-50 text-gray-700 hover:text-primary-700 font-medium py-2.5 px-4 rounded-lg transition-all gap-2 text-sm group"
                  >
                    <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    Visit Official Website
                  </a>
                </div>
              )}
            </div>

            {college.tags && college.tags.length > 0 && (
              <div className="card p-6">
                <h3 className="font-semibold text-gray-900 mb-4 text-sm">Tags</h3>
                <div className="flex flex-wrap gap-1.5">
                  {college.tags.map((tag, i) => (
                    <Badge key={i} variant="gray" className="bg-gray-50">{tag}</Badge>
                  ))}
                </div>
              </div>
            )}

            {relatedColleges && relatedColleges.length > 0 && (
              <div className="card p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  Similar Colleges
                </h3>
                <div className="space-y-3">
                  {relatedColleges.slice(0, 4).map((related) => (
                    <a
                      key={related.id}
                      href={`/colleges/${related.slug}`}
                      className="flex gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                        {related.imageUrl ? (
                          <img src={related.imageUrl} alt={related.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <Building2 className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 group-hover:text-primary-600 line-clamp-2 transition-colors">
                          {related.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {related.city}, {related.state}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                          <span className="text-xs font-medium text-gray-700">{formatRating(related.rating)}</span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
