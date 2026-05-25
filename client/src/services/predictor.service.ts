import api from './api';
import { College, ApiResponse } from '../types';

export const predictorService = {
  getPredictions: async (exam: string, rank: number) => {
    const response = await api.get<ApiResponse<{ colleges: College[], total: number }>>('/predictor', {
      params: { exam, rank },
    });
    return response.data.data;
  },
};
