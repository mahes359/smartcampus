import { api } from './api';
import type { HostelRoom, ServiceStatus } from '../types';

export const hostelService = {
  async getStatus(): Promise<ServiceStatus> {
    const res = await api.get('/api/hostel/status');
    return res.data;
  },

  async getRooms(collegeId?: number): Promise<HostelRoom[]> {
    const res = await api.get('/api/hostel/rooms', {
      params: collegeId ? { collegeId } : {},
    });
    return res.data || [];
  },

  async createRoom(room: Partial<HostelRoom>): Promise<HostelRoom> {
    const res = await api.post('/api/hostel/rooms', room);
    return res.data;
  },

  async deleteRoom(id: number): Promise<void> {
    await api.delete(`/api/hostel/rooms/${id}`);
  },
};
