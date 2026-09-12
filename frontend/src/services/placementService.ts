import { api } from './api';
import type { PlacementDrive, ServiceStatus } from '../types';

export const placementService = {
  async getStatus(): Promise<ServiceStatus> {
    const res = await api.get('/api/placements/status');
    return res.data;
  },

  async getDrives(collegeId?: number): Promise<PlacementDrive[]> {
    const res = await api.get('/api/placements/drives', {
      params: collegeId ? { collegeId } : {},
    });
    return res.data || [];
  },

  async createDrive(drive: Partial<PlacementDrive>): Promise<PlacementDrive> {
    const res = await api.post('/api/placements/drives', drive);
    return res.data;
  },

  async deleteDrive(id: number): Promise<void> {
    await api.delete(`/api/placements/drives/${id}`);
  },
};
