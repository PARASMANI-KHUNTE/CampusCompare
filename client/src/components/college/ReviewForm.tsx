import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Star, MessageSquare } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewService } from '../../services/review.service';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import toast from 'react-hot-toast';

const reviewSchema = z.object({
  rating: z.number().min(1, 'Please select a rating').max(5),
  title: z.string().optional(),
  comment: z.string().min(10, 'Review must be at least 10 characters'),
  placementRating: z.number().min(1).max(5).optional(),
  facultyRating: z.number().min(1).max(5).optional(),
  campusRating: z.number().min(1).max(5).optional(),
  valueForMoneyRating: z.number().min(1).max(5).optional(),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  collegeId: string;
  collegeSlug: string;
  onSuccess?: () => void;
}

const HoverStarRating = ({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1.5">{label}</label>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="focus:outline-none transition-all hover:scale-110 p-0.5"
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onChange(star === value ? 0 : star)}
          >
            <Star className={`w-4 h-4 ${
              star <= (hovered || value)
                ? 'fill-yellow-400 text-yellow-400 drop-shadow-sm'
                : 'text-gray-200'
            }`} />
          </button>
        ))}
      </div>
    </div>
  );
};

export const ReviewForm = ({ collegeId, collegeSlug, onSuccess }: ReviewFormProps) => {
  const [hoveredRating, setHoveredRating] = useState(0);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      title: '',
      comment: '',
    },
  });

  const currentRating = watch('rating');

  const mutation = useMutation({
    mutationFn: (data: ReviewFormValues) => reviewService.createReview(collegeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['college', collegeSlug] });
      queryClient.invalidateQueries({ queryKey: ['reviews', collegeId] });
      toast.success('Review submitted successfully!');
      reset();
      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    }
  });

  const onSubmit = (data: ReviewFormValues) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Overall Rating */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Overall Rating *</label>
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="focus:outline-none transition-all hover:scale-110"
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              onClick={() => setValue('rating', star, { shouldValidate: true })}
            >
              <Star
                className={`w-9 h-9 transition-all ${
                  star <= (hoveredRating || currentRating)
                    ? 'fill-yellow-400 text-yellow-400 drop-shadow-sm'
                    : 'text-gray-200'
                }`}
              />
            </button>
          ))}
          {currentRating > 0 && (
            <span className="ml-2 text-sm font-bold text-yellow-600">{currentRating}/5</span>
          )}
        </div>
        {errors.rating && <p className="mt-1.5 text-sm text-red-500">{errors.rating.message}</p>}
      </div>

      <Input
        label="Review Title (Optional)"
        placeholder="Summarize your experience"
        icon={<MessageSquare className="w-4 h-4" />}
        {...register('title')}
      />

      <div>
        <label className="label">Detailed Review *</label>
        <textarea
          className={`input min-h-[120px] resize-y ${errors.comment ? 'input-error' : ''}`}
          placeholder="What did you like or dislike? How was the faculty, placement, and campus life?"
          {...register('comment')}
        />
        {errors.comment && <p className="mt-1.5 text-sm text-red-500">{errors.comment.message}</p>}
      </div>

      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">Rate Specific Aspects (Optional)</p>
        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
          <HoverStarRating value={watch('placementRating') || 0} onChange={(v) => setValue('placementRating', v)} label="Placement" />
          <HoverStarRating value={watch('facultyRating') || 0} onChange={(v) => setValue('facultyRating', v)} label="Faculty" />
          <HoverStarRating value={watch('campusRating') || 0} onChange={(v) => setValue('campusRating', v)} label="Campus Life" />
          <HoverStarRating value={watch('valueForMoneyRating') || 0} onChange={(v) => setValue('valueForMoneyRating', v)} label="Value for Money" />
        </div>
      </div>

      <Button type="submit" isLoading={mutation.isPending} className="w-full sm:w-auto">
        Submit Review
      </Button>
    </form>
  );
};
