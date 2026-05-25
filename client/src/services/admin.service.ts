import api from './api';
import { ApiResponse, College, Course } from '../types';

interface CollegesData { colleges: College[] }
interface CollegeData { college: College }
interface CoursesData { courses: Course[] }
interface CourseData { course: Course }

export const adminService = {
  getColleges: async () => {
    const response = await api.get<ApiResponse<CollegesData>>('/admin/colleges');
    return response.data.data.colleges;
  },

  createCollege: async (data: Partial<College>) => {
    const response = await api.post<ApiResponse<CollegeData>>('/admin/colleges', data);
    return response.data.data.college;
  },

  updateCollege: async (id: string, data: Partial<College>) => {
    const response = await api.put<ApiResponse<CollegeData>>(`/admin/colleges/${id}`, data);
    return response.data.data.college;
  },

  deleteCollege: async (id: string) => {
    const response = await api.delete<ApiResponse<never>>(`/admin/colleges/${id}`);
    return response.data;
  },

  bulkImportColleges: async (colleges: any[]) => {
    const response = await api.post('/admin/colleges/bulk', { colleges });
    return response.data.data;
  },

  uploadCollegeImage: async (id: string, file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await api.post<ApiResponse<CollegeData>>(`/admin/colleges/${id}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data.college;
  },

  createNotice: async (collegeId: string, data: { title: string; content: string; attachment?: File }) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('content', data.content);
    if (data.attachment) {
      formData.append('attachment', data.attachment);
    }
    const response = await api.post(`/admin/colleges/${collegeId}/notices`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data.notice;
  },

  deleteNotice: async (id: string) => {
    const response = await api.delete(`/admin/notices/${id}`);
    return response.data;
  },

  getCourses: async () => {
    const response = await api.get<ApiResponse<CoursesData>>('/admin/courses');
    return response.data.data.courses;
  },

  createCourse: async (data: Partial<Course>) => {
    const response = await api.post<ApiResponse<CourseData>>('/admin/courses', data);
    return response.data.data.course;
  },

  updateCourse: async (id: string, data: Partial<Course>) => {
    const response = await api.put<ApiResponse<CourseData>>(`/admin/courses/${id}`, data);
    return response.data.data.course;
  },

  deleteCourse: async (id: string) => {
    const response = await api.delete<ApiResponse<never>>(`/admin/courses/${id}`);
    return response.data;
  },
};
