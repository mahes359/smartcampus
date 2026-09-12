import { api } from './api';
import type { CampusEvent, ServiceStatus } from '../types';

export const eventService = {
  async getStatus(): Promise<ServiceStatus> {
    const res = await api.get('/api/events/status');
    return res.data;
  },

  async getEvents(collegeId?: number): Promise<CampusEvent[]> {
    const res = await api.get('/api/events', {
      params: collegeId ? { collegeId } : {},
    });
    return res.data || [];
  },

  async createEvent(event: Partial<CampusEvent>): Promise<CampusEvent> {
    const res = await api.post('/api/events', event);
    return res.data;
  },

  async deleteEvent(id: number): Promise<void> {
    await api.delete(`/api/events/${id}`);
  },
};
