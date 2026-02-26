'use client';

import { useState, useEffect, useCallback } from 'react';
import { authApi, type User, type LoginCredentials, type RegisterData } from '../api';

const TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getToken = useCallback(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  }, []);

  const setTokens = useCallback((accessToken: string, refreshToken: string) => {
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }, []);

  const clearTokens = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }, []);

  const fetchUser = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const userData = await authApi.me(token);
      setUser(userData);
    } catch {
      clearTokens();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [getToken, clearTokens]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (credentials: LoginCredentials) => {
    setError(null);
    try {
      const response = await authApi.login(credentials);
      setTokens(response.access_token, response.refresh_token);
      setUser(response.user as User);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      throw err;
    }
  };

  const register = async (data: RegisterData) => {
    setError(null);
    try {
      const response = await authApi.register(data);
      setTokens(response.access_token, response.refresh_token);
      setUser(response.user as User);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setError(message);
      throw err;
    }
  };

  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
  }, [clearTokens]);

  const forgotPassword = async (email: string) => {
    setError(null);
    try {
      return await authApi.forgotPassword(email);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send reset email';
      setError(message);
      throw err;
    }
  };

  const resetPassword = async (token: string, password: string) => {
    setError(null);
    try {
      return await authApi.resetPassword(token, password);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to reset password';
      setError(message);
      throw err;
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
    token: getToken(),
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
  };
}
