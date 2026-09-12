import { api } from './api';
import type { Attendance, ServiceStatus } from '../types';

export const attendanceService = {
  async getStatus(): Promise<ServiceStatus> {
    const res = await api.get('/api/attendance/status');
    return res.data;
  },

  async getAllAttendance(collegeId?: number): Promise<Attendance[]> {
    const params = collegeId ? { collegeId } : {};
    const res = await api.get('/api/attendance', { params });
    return res.data;
  },

  async getAttendanceByCollege(collegeId?: number): Promise<Attendance[]> {
    return this.getAllAttendance(collegeId);
  },

  async getAttendanceById(id: number): Promise<Attendance> {
    const res = await api.get(`/api/attendance/${id}`);
    return res.data;
  },

  async getByStudentAndCourse(studentId: number, courseId: number): Promise<Attendance[]> {
    const res = await api.get(`/api/attendance/student/${studentId}/course/${courseId}`);
    return res.data;
  },

  async recordAttendance(data: Partial<Attendance>): Promise<Attendance> {
    const res = await api.post('/api/attendance', data);
    return res.data;
  },

  async updateAttendance(id: number, data: Partial<Attendance>): Promise<Attendance> {
    const res = await api.put(`/api/attendance/${id}`, data);
    return res.data;
  },

  async deleteAttendance(id: number): Promise<{ success: boolean; message: string }> {
    const res = await api.delete(`/api/attendance/${id}`);
    return res.data;
  },
};
