import { api } from './api';
import type { DocumentItem, ServiceStatus } from '../types';

export const documentService = {
  async getStatus(): Promise<ServiceStatus> {
    const res = await api.get('/api/documents/status');
    return res.data;
  },

  async getDocuments(collegeId?: number, studentId?: number): Promise<DocumentItem[]> {
    const res = await api.get('/api/documents', {
      params: {
        ...(collegeId ? { collegeId } : {}),
        ...(studentId ? { studentId } : {}),
      },
    });
    return res.data || [];
  },

  async uploadDocument(document: Partial<DocumentItem>): Promise<DocumentItem> {
    const res = await api.post('/api/documents', document);
    return res.data;
  },

  async verifyDocument(id: number, status: string): Promise<DocumentItem> {
    const res = await api.put(`/api/documents/${id}/verify`, { status });
    return res.data;
  },

  async deleteDocument(id: number): Promise<void> {
    await api.delete(`/api/documents/${id}`);
  },
};
