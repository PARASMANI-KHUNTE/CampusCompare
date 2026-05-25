import api from './api';
import { ApiResponse, Review, ReviewData } from '../types';

export const reviewService = {
  getReviews: async (collegeId: string) => {
    const response = await api.get<ApiResponse<{ reviews: Review[] }>>(`/reviews/${collegeId}`);
    return response.data.data.reviews;
  },

  createReview: async (collegeId: string, data: ReviewData) => {
    const response = await api.post<ApiResponse<{ review: Review }>>(`/reviews/${collegeId}`, data);
    return response.data.data.review;
  },
};
