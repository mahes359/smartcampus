import { api } from './api';
import type { Enrollment, ServiceStatus } from '../types';

export const enrollmentService = {
  async getStatus(): Promise<ServiceStatus> {
    const res = await api.get('/api/enrollments/status');
    return res.data;
  },

  async getAllEnrollments(collegeId?: number): Promise<Enrollment[]> {
    const params = collegeId ? { collegeId } : {};
    const res = await api.get('/api/enrollments', { params });
    return res.data;
  },

  async getEnrollmentById(id: number): Promise<Enrollment> {
    const res = await api.get(`/api/enrollments/${id}`);
    return res.data;
  },

  async createEnrollment(data: Partial<Enrollment>): Promise<Enrollment> {
    const res = await api.post('/api/enrollments', data);
    return res.data;
  },

  async updateEnrollment(id: number, data: Partial<Enrollment>): Promise<Enrollment> {
    const res = await api.put(`/api/enrollments/${id}`, data);
    return res.data;
  },

  async deleteEnrollment(id: number): Promise<{ success: boolean; message: string }> {
    const res = await api.delete(`/api/enrollments/${id}`);
    return res.data;
  },
};
