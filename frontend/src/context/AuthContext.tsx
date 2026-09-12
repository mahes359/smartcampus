import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';
import type { UserRole } from '../constants/roles';
import { authService, type LoginPayload } from '../services/authService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  role: UserRole;
  activeCollegeId: number;
  isAuthenticated: boolean;
  isLoading: boolean;
  isDarkMode: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
  switchCollege: (collegeId: number) => void;
  switchRole: (role: UserRole) => void;
  toggleDarkMode: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('smartcampus_user');
    return saved ? JSON.parse(saved) : null;
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
    // Per user instruction: inside UI is mostly covered with white
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

  const switchCollege = (collegeId: number) => {
    setActiveCollegeId(collegeId);
    localStorage.setItem('smartcampus_college_id', collegeId.toString());
    if (user) {
      const updatedUser = { ...user, collegeId };
      setUser(updatedUser);
      localStorage.setItem('smartcampus_user', JSON.stringify(updatedUser));
    }
  };

  const switchRole = (role: UserRole) => {
    if (user) {
      const updatedUser = { ...user, role };
      setUser(updatedUser);
      localStorage.setItem('smartcampus_user', JSON.stringify(updatedUser));
    }
  };

  const role: UserRole = user?.role || 'COLLEGE_ADMIN';
  const isAuthenticated = !!token && !!user;

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
        switchRole,
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
