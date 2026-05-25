import api from './api';
import { ApiResponse, SavedCollege } from '../types';

export const savedService = {
  saveCollege: async (collegeId: string) => {
    const response = await api.post<ApiResponse<{ savedCollege: SavedCollege }>>('/saved-colleges', { collegeId });
    return response.data.data.savedCollege;
  },

  getSavedColleges: async () => {
    const response = await api.get<ApiResponse<{ savedColleges: SavedCollege[] }>>('/saved-colleges');
    return response.data.data.savedColleges;
  },

  removeSavedCollege: async (collegeId: string) => {
    const response = await api.delete<ApiResponse<void>>(`/saved-colleges/${collegeId}`);
    return response.data;
  },
};
