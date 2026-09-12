import { api } from './api';
import type { TransportRoute, ServiceStatus } from '../types';

export const transportService = {
  async getStatus(): Promise<ServiceStatus> {
    const res = await api.get('/api/transport/status');
    return res.data;
  },

  async getRoutes(collegeId?: number): Promise<TransportRoute[]> {
    const res = await api.get('/api/transport/routes', {
      params: collegeId ? { collegeId } : {},
    });
    return res.data || [];
  },

  async createRoute(route: Partial<TransportRoute>): Promise<TransportRoute> {
    const res = await api.post('/api/transport/routes', route);
    return res.data;
  },

  async deleteRoute(id: number): Promise<void> {
    await api.delete(`/api/transport/routes/${id}`);
  },
};
