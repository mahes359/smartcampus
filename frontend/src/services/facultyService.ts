import { api } from './api';
import type { Faculty, ServiceStatus } from '../types';

export const facultyService = {
  async getStatus(): Promise<ServiceStatus> {
    const res = await api.get('/api/faculty/status');
    return res.data;
  },

  async getAllFaculty(collegeId?: number): Promise<Faculty[]> {
    const params = collegeId ? { collegeId } : {};
    const res = await api.get('/api/faculty', { params });
    return res.data;
  },

  async getFacultyById(id: number): Promise<Faculty> {
    const res = await api.get(`/api/faculty/${id}`);
    return res.data;
  },

  async createFaculty(data: Partial<Faculty>): Promise<Faculty> {
    const res = await api.post('/api/faculty', data);
    return res.data;
  },

  async updateFaculty(id: number, data: Partial<Faculty>): Promise<Faculty> {
    const res = await api.put(`/api/faculty/${id}`, data);
    return res.data;
  },

  async deleteFaculty(id: number): Promise<{ success: boolean; message: string }> {
    const res = await api.delete(`/api/faculty/${id}`);
    return res.data;
  },
};
