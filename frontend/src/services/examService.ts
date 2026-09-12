import { api } from './api';
import type { Exam, ServiceStatus } from '../types';

export const examService = {
  async getStatus(): Promise<ServiceStatus> {
    const res = await api.get('/api/exams/health');
    return {
      service: res.data.service || 'exam-service',
      status: res.data.status || 'UP',
      message: 'Exam Microservice is operational',
    };
  },

  async getAllExams(collegeId?: number, courseId?: number): Promise<Exam[]> {
    const params: Record<string, number> = {};
    if (collegeId) params.collegeId = collegeId;
    if (courseId) params.courseId = courseId;
    const res = await api.get('/api/exams', { params });
    return res.data;
  },

  async getExamById(id: number): Promise<Exam> {
    const res = await api.get(`/api/exams/${id}`);
    return res.data;
  },

  async createExam(data: Partial<Exam>): Promise<Exam> {
    const res = await api.post('/api/exams', data);
    return res.data;
  },

  async updateExam(id: number, data: Partial<Exam>): Promise<Exam> {
    const res = await api.put(`/api/exams/${id}`, data);
    return res.data;
  },

  async deleteExam(id: number): Promise<{ success: boolean; message: string }> {
    const res = await api.delete(`/api/exams/${id}`);
    return res.data;
  },
};
