import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';
import { ROLES, type UserRole } from '../constants/roles';
import { authService, type LoginPayload } from '../services/authService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  role: UserRole | null;
  activeCollegeId: number;
  isAuthenticated: boolean;
  isLoading: boolean;
  isDarkMode: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
  switchCollege: (collegeId: number) => void;
  toggleDarkMode: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Parse and validate the role from a JWT token payload (base64 decode the claims).
 * Returns null if parsing fails or if the role is not a supported ERP role.
 */
function parseRoleFromToken(token: string): UserRole | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    const r = payload.role;
    if (typeof r === 'string' && ROLES[r]) {
      return r as UserRole;
    }
    return null;
  } catch {
    return null;
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('smartcampus_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('smartcampus_token') || null;
  });

  const [activeCollegeId, setActiveCollegeId] = useState<number>(() => {
    const saved = localStorage.getItem('smartcampus_college_id');
    return saved ? parseInt(saved, 10) : 1;
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Always start in light mode
    document.documentElement.classList.remove('dark');
    localStorage.setItem('smartcampus_theme', 'light');
    setIsDarkMode(false);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('smartcampus_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('smartcampus_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const login = async (payload: LoginPayload) => {
    setIsLoading(true);
    try {
      const authData = await authService.login(payload);
      setUser(authData.user);
      setToken(authData.token);
      const colId = authData.user.collegeId || 1;
      setActiveCollegeId(colId);

      localStorage.setItem('smartcampus_token', authData.token);
      localStorage.setItem('smartcampus_user', JSON.stringify(authData.user));
      localStorage.setItem('smartcampus_college_id', colId.toString());
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  // Role resolution strictly sourced from the verified backend user account or verified JWT claims.
  // Never fallback to an administrative role like COLLEGE_ADMIN.
  const rawRole = (user?.role as string) || (token ? parseRoleFromToken(token) : null);
  const role: UserRole | null = (rawRole && ROLES[rawRole]) ? (rawRole as UserRole) : null;

  // Session is only authenticated if token, user, and a valid verified role are all present.
  const isAuthenticated = !!token && !!user && !!role;

  // Validate session integrity: if token or user exists but role is invalid or corrupted, purge session.
  useEffect(() => {
    if ((token || user) && !isAuthenticated) {
      logout();
    }
  }, [token, user, isAuthenticated]);

  const switchCollege = (collegeId: number) => {
    // Only SUPER_ADMIN is permitted to switch tenant college context
    if (role !== 'SUPER_ADMIN') {
      return;
    }
    setActiveCollegeId(collegeId);
    localStorage.setItem('smartcampus_college_id', collegeId.toString());
    if (user) {
      const updatedUser = { ...user, collegeId };
      setUser(updatedUser);
      localStorage.setItem('smartcampus_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role,
        activeCollegeId,
        isAuthenticated,
        isLoading,
        isDarkMode,
        login,
        logout,
        switchCollege,
        toggleDarkMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
