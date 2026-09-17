import { api } from './api';
import type { User } from '../types';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const authService = {
  async getStatus(): Promise<{ service: string; status: string; message: string }> {
    const res = await api.get('/api/auth/status');
    return res.data;
  },

  /**
   * Authenticates against the real auth-service backend.
   * Role is determined by the server based on the user's account.
   * Throws on failure — error message propagated to the login form.
   */
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const res = await api.post('/api/auth/login', {
      email: payload.email,
      password: payload.password,
    });
    return res.data;
  },

  logout(): void {
    localStorage.removeItem('smartcampus_token');
    localStorage.removeItem('smartcampus_user');
    localStorage.removeItem('smartcampus_college_id');
  },
};
