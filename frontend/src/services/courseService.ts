import { api } from './api';
import type { Course, ServiceStatus } from '../types';

export const courseService = {
  async getStatus(): Promise<ServiceStatus> {
    const res = await api.get('/api/courses/status');
    return res.data;
  },

  async getAllCourses(collegeId?: number): Promise<Course[]> {
    const params = collegeId ? { collegeId } : {};
    const res = await api.get('/api/courses', { params });
    return res.data;
  },

  async getCourseById(id: number): Promise<Course> {
    const res = await api.get(`/api/courses/${id}`);
    return res.data;
  },

  async createCourse(data: Partial<Course>): Promise<Course> {
    const res = await api.post('/api/courses', data);
    return res.data;
  },

  async updateCourse(id: number, data: Partial<Course>): Promise<Course> {
    const res = await api.put(`/api/courses/${id}`, data);
    return res.data;
  },

  async deleteCourse(id: number): Promise<{ success: boolean; message: string }> {
    const res = await api.delete(`/api/courses/${id}`);
    return res.data;
  },
};
