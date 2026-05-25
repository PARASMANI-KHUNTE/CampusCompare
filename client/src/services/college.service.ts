import api from './api';
import { CollegeFilters, PaginatedResponse, ApiResponse, College } from '../types';

export const collegeService = {
  getColleges: async (filters: CollegeFilters) => {
    // Clean undefined or empty values
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== undefined && v !== '')
    );
    
    const response = await api.get<PaginatedResponse<College>>('/colleges', {
      params: cleanFilters,
    });
    return response.data;
  },

  getCollegeBySlug: async (slug: string) => {
    const response = await api.get<ApiResponse<{ college: College }>>(`/colleges/${slug}`);
    return response.data.data.college;
  },

  getRelatedColleges: async (slug: string) => {
    const response = await api.get<ApiResponse<{ colleges: College[] }>>(`/colleges/${slug}/related`);
    return response.data.data.colleges;
  },
};
