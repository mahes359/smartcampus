import { api } from './api';
import type { NotificationItem, ServiceStatus } from '../types';

export const notificationService = {
  async getStatus(): Promise<ServiceStatus> {
    const res = await api.get('/api/notifications/status');
    return res.data;
  },

  async getNotifications(collegeId?: number): Promise<NotificationItem[]> {
    const res = await api.get('/api/notifications', {
      params: collegeId ? { collegeId } : {},
    });
    return res.data || [];
  },

  async createNotification(item: Partial<NotificationItem>): Promise<NotificationItem> {
    const res = await api.post('/api/notifications', item);
    return res.data;
  },

  async markAsRead(id: number): Promise<NotificationItem> {
    const res = await api.put(`/api/notifications/${id}/read`);
    return res.data;
  },

  async deleteNotification(id: number): Promise<void> {
    await api.delete(`/api/notifications/${id}`);
  },
};
