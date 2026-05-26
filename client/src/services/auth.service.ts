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

  updateProfile: async (data: { name: string }) => {
    const response = await api.put<ApiResponse<{ user: User }>>('/auth/me', data);
    return response.data.data.user;
  },

  uploadAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await api.post<ApiResponse<{ user: User }>>('/auth/me/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data.user;
  },

  deleteAccount: async () => {
    const response = await api.delete<ApiResponse<void>>('/auth/me');
    return response.data;
  },
};

