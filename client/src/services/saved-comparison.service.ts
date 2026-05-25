import api from './api';
import { SavedComparison, ApiResponse } from '../types';

export const savedComparisonService = {
  getSavedComparisons: async () => {
    const response = await api.get<ApiResponse<SavedComparison[]>>('/saved-comparisons');
    return response.data.data;
  },

  createSavedComparison: async (data: { name: string; colleges: string[] }) => {
    const response = await api.post<ApiResponse<SavedComparison>>('/saved-comparisons', data);
    return response.data.data;
  },

  deleteSavedComparison: async (id: string) => {
    const response = await api.delete<ApiResponse<null>>(`/saved-comparisons/${id}`);
    return response.data.data;
  }
};
