import { api } from './api';
import type { FeeRecord, ServiceStatus } from '../types';

export const feeService = {
  async getStatus(): Promise<ServiceStatus> {
    const res = await api.get('/api/fees/status');
    return res.data;
  },

  async getFees(collegeId?: number, studentId?: number): Promise<FeeRecord[]> {
    const res = await api.get('/api/fees', {
      params: {
        ...(collegeId ? { collegeId } : {}),
        ...(studentId ? { studentId } : {}),
      },
    });
    return res.data || [];
  },

  async createFee(fee: Partial<FeeRecord>): Promise<FeeRecord> {
    const res = await api.post('/api/fees', fee);
    return res.data;
  },

  async recordPayment(id: number, amount?: number): Promise<FeeRecord> {
    const res = await api.put(`/api/fees/${id}/pay`, amount ? { amount } : {});
    return res.data;
  },

  async deleteFee(id: number): Promise<void> {
    await api.delete(`/api/fees/${id}`);
  },
};
