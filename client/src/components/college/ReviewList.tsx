import { Star, Quote } from 'lucide-react';
import { Review } from '../../types';

interface ReviewListProps {
  reviews: Review[];
}

const RatingBar = ({ label, value }: { label: string; value?: number | null }) => {
  if (!value) return null;
  const percentage = (value / 5) * 100;
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-gray-400 w-14 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-yellow-400 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-gray-500 w-4 text-right font-medium">{value}</span>
    </div>
  );
};

export const ReviewList = ({ reviews }: ReviewListProps) => {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <Quote className="w-10 h-10 text-gray-200 mx-auto mb-3" />
        <p className="text-gray-500 text-sm">No reviews yet. Be the first to review this college!</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                {review.user?.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h5 className="font-semibold text-gray-900 text-sm">{review.user?.name}</h5>
                <p className="text-xs text-gray-400">
                  {new Date(review.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2.5 py-1 rounded-full text-sm font-bold shadow-sm">
              <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
              {review.rating.toFixed(1)}
            </div>
          </div>
          
          {review.title && (
            <h6 className="font-semibold text-gray-900 mb-2">{review.title}</h6>
          )}
          
          <p className="text-gray-600 text-sm leading-relaxed mb-4">{review.comment}</p>

          {(review.placementRating || review.facultyRating || review.campusRating || review.valueForMoneyRating) && (
            <div className="space-y-1.5 pt-4 border-t border-gray-50">
              <RatingBar label="Placement" value={review.placementRating} />
              <RatingBar label="Faculty" value={review.facultyRating} />
              <RatingBar label="Campus" value={review.campusRating} />
              <RatingBar label="Value" value={review.valueForMoneyRating} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
