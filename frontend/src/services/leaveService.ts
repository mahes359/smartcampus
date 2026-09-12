import { api } from './api';
import type { LeaveApplication, ServiceStatus } from '../types';

export const leaveService = {
  async getStatus(): Promise<ServiceStatus> {
    const res = await api.get('/api/leaves/status');
    return res.data;
  },

  async getLeaves(collegeId?: number, applicantId?: number): Promise<LeaveApplication[]> {
    const res = await api.get('/api/leaves', {
      params: {
        ...(collegeId ? { collegeId } : {}),
        ...(applicantId ? { applicantId } : {}),
      },
    });
    return res.data || [];
  },

  async applyLeave(application: Partial<LeaveApplication>): Promise<LeaveApplication> {
    const res = await api.post('/api/leaves', application);
    return res.data;
  },

  async updateStatus(id: number, status: string): Promise<LeaveApplication> {
    const res = await api.put(`/api/leaves/${id}/status`, { status });
    return res.data;
  },

  async deleteLeave(id: number): Promise<void> {
    await api.delete(`/api/leaves/${id}`);
  },
};
