import { api } from './api';
import type { SupportTicket, ServiceStatus } from '../types';

export const helpdeskService = {
  async getStatus(): Promise<ServiceStatus> {
    const res = await api.get('/api/helpdesk/status');
    return res.data;
  },

  async getTickets(collegeId?: number): Promise<SupportTicket[]> {
    const res = await api.get('/api/helpdesk/tickets', {
      params: collegeId ? { collegeId } : {},
    });
    return res.data || [];
  },

  async createTicket(ticket: Partial<SupportTicket>): Promise<SupportTicket> {
    const res = await api.post('/api/helpdesk/tickets', ticket);
    return res.data;
  },

  async updateStatus(id: number, status: string): Promise<SupportTicket> {
    const res = await api.put(`/api/helpdesk/tickets/${id}/status`, { status });
    return res.data;
  },

  async deleteTicket(id: number): Promise<void> {
    await api.delete(`/api/helpdesk/tickets/${id}`);
  },
};
