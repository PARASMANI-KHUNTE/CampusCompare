import api from './api';
import { Discussion, Answer, ApiResponse } from '../types';

export const discussionService = {
  getDiscussions: async (collegeId?: string, page: number = 1, limit: number = 10) => {
    const params = new URLSearchParams();
    if (collegeId) params.append('collegeId', collegeId);
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    const response = await api.get<ApiResponse<Discussion[]>>(`/discussions?${params.toString()}`);
    return response.data;
  },

  getDiscussionById: async (id: string) => {
    const response = await api.get<ApiResponse<Discussion>>(`/discussions/${id}`);
    return response.data.data;
  },

  createDiscussion: async (data: { title?: string; content: string; collegeId?: string }) => {
    const response = await api.post<ApiResponse<Discussion>>('/discussions', data);
    return response.data.data;
  },

  updateDiscussion: async (id: string, data: { title?: string; content?: string }) => {
    const response = await api.put<ApiResponse<Discussion>>(`/discussions/${id}`, data);
    return response.data.data;
  },

  deleteDiscussion: async (id: string) => {
    const response = await api.delete<ApiResponse<null>>(`/discussions/${id}`);
    return response.data;
  },

  createAnswer: async (discussionId: string, content: string) => {
    const response = await api.post<ApiResponse<Answer>>(`/discussions/${discussionId}/answers`, { content });
    return response.data.data;
  },

  deleteAnswer: async (id: string) => {
    const response = await api.delete<ApiResponse<null>>(`/discussions/answers/${id}`);
    return response.data;
  },

  upvoteDiscussion: async (id: string) => {
    const response = await api.post<ApiResponse<Discussion>>(`/discussions/${id}/upvote`);
    return response.data.data;
  },

  upvoteAnswer: async (id: string) => {
    const response = await api.post<ApiResponse<Answer>>(`/discussions/answers/${id}/upvote`);
    return response.data.data;
  }
};
