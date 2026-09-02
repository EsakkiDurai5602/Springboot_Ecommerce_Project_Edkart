import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService, profileService } from '../services/bankingServices';
import { INITIAL_USER } from '../services/mockData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem('edkart_auth_token');
    const savedUser = localStorage.getItem('edkart_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('edkart_auth_token');
        localStorage.removeItem('edkart_user');
      }
    }
    setLoading(false);

    const handleSessionExpired = () => {
      setUser(null);
      setToken(null);
      setSessionTimeout(true);
    };

    window.addEventListener('edkart:session_expired', handleSessionExpired);
    return () => window.removeEventListener('edkart:session_expired', handleSessionExpired);
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const response = await authService.login(email, password);
      setUser(response.user);
      setToken(response.token);
      setSessionTimeout(false);
      return response;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (formData) => {
    setLoading(true);
    try {
      const response = await authService.register(formData);
      return response;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
    setToken(null);
  }, []);

  const updateProfile = useCallback(async (updatedData) => {
    const res = await profileService.updateProfile(updatedData);
    if (res.user) {
      setUser(res.user);
    }
    return res;
  }, []);

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === 'ADMIN',
    loading,
    sessionTimeout,
    setSessionTimeout,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
