import api from './api';
import { ApiResponse, College } from '../types';

export const compareService = {
  compareColleges: async (ids: string[]) => {
    const response = await api.get<ApiResponse<{ colleges: College[] }>>('/compare', {
      params: { ids: ids.join(',') }
    });
    return response.data.data.colleges;
  },
};
