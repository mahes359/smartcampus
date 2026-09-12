import { api } from './api';
import type { TimetableSlot, ServiceStatus } from '../types';

export const timetableService = {
  async getStatus(): Promise<ServiceStatus> {
    const res = await api.get('/api/timetable/status');
    return res.data;
  },

  async getSlots(collegeId?: number, dayOfWeek?: string): Promise<TimetableSlot[]> {
    const res = await api.get('/api/timetable/slots', {
      params: {
        ...(collegeId ? { collegeId } : {}),
        ...(dayOfWeek ? { dayOfWeek } : {}),
      },
    });
    return res.data || [];
  },

  async createSlot(slot: Partial<TimetableSlot>): Promise<TimetableSlot> {
    const res = await api.post('/api/timetable/slots', slot);
    return res.data;
  },

  async deleteSlot(id: number): Promise<void> {
    await api.delete(`/api/timetable/slots/${id}`);
  },
};
