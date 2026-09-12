import { api } from './api';
import type { Student, ServiceStatus } from '../types';

export const studentService = {
  async getStatus(): Promise<ServiceStatus> {
    const res = await api.get('/api/students/status');
    return res.data;
  },

  async getAllStudents(collegeId?: number): Promise<Student[]> {
    const params = collegeId ? { collegeId } : {};
    const res = await api.get('/api/students', { params });
    return res.data;
  },

  async getStudentById(id: number): Promise<Student> {
    const res = await api.get(`/api/students/${id}`);
    return res.data;
  },

  async createStudent(data: Partial<Student>): Promise<Student> {
    const res = await api.post('/api/students', data);
    return res.data;
  },

  async updateStudent(id: number, data: Partial<Student>): Promise<Student> {
    const res = await api.put(`/api/students/${id}`, data);
    return res.data;
  },

  async deleteStudent(id: number): Promise<{ success: boolean; message: string }> {
    const res = await api.delete(`/api/students/${id}`);
    return res.data;
  },
};
