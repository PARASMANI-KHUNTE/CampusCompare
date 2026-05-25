import api from './api';
import { LoginData, RegisterData, ApiResponse, User } from '../types';

export const authService = {
  login: async (data: LoginData) => {
    const response = await api.post<ApiResponse<{ user: User }>>('/auth/login', data);
    return response.data.data;
  },

  register: async (data: RegisterData) => {
    const response = await api.post<ApiResponse<{ user: User }>>('/auth/register', data);
    return response.data.data;
  },

  getMe: async () => {
    const response = await api.get<ApiResponse<{ user: User }>>('/auth/me');
    return response.data.data.user;
  },

  logout: async () => {
    const response = await api.post<ApiResponse<void>>('/auth/logout');
    return response.data;
  },
};
