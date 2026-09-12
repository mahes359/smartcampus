import { api } from './api';
import type { LibraryBook, ServiceStatus } from '../types';

export const libraryService = {
  async getStatus(): Promise<ServiceStatus> {
    const res = await api.get('/api/library/status');
    return res.data;
  },

  async getBooks(collegeId?: number): Promise<LibraryBook[]> {
    const res = await api.get('/api/library/books', {
      params: collegeId ? { collegeId } : {},
    });
    return res.data || [];
  },

  async createBook(book: Partial<LibraryBook>): Promise<LibraryBook> {
    const res = await api.post('/api/library/books', book);
    return res.data;
  },

  async deleteBook(id: number): Promise<void> {
    await api.delete(`/api/library/books/${id}`);
  },
};
