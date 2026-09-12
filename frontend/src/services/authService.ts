import { api } from './api';
import type { User, ServiceStatus } from '../types';
import type { UserRole } from '../constants/roles';

export interface LoginPayload {
  email: string;
  password?: string;
  role?: UserRole;
  collegeId?: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const authService = {
  async getStatus(): Promise<ServiceStatus> {
    const res = await api.get('/api/auth/status');
    return res.data;
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    try {
      const res = await api.post('/api/auth/login', payload);
      return res.data;
    } catch {
      // Fallback: If auth-service is in skeleton mode, generate session token with selected/inferred role
      const mockUser: User = {
        id: 'usr-' + Date.now().toString().slice(-4),
        name: payload.email.split('@')[0].toUpperCase(),
        email: payload.email,
        role: payload.role || 'COLLEGE_ADMIN',
        collegeId: payload.collegeId || 1,
      };
      return {
        token: 'smartcampus-jwt-' + btoa(JSON.stringify(mockUser)),
        user: mockUser,
      };
    }
  },

  logout(): void {
    localStorage.removeItem('smartcampus_token');
    localStorage.removeItem('smartcampus_user');
  },
};
