import { createContext, useState, useEffect, useCallback } from 'react';
import apiClient from '../api/apiClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [error, setError] = useState('');

  // Load user from token on mount
  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        try {
          const res = await apiClient.get('/auth/me');
          setUser(res.data);
        } catch (err) {
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  // Update axios headers when token changes
  useEffect(() => {
    if (token) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete apiClient.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [token]);

  // Register
  const register = useCallback(async (formData) => {
    setError('');
    try {
      const res = await apiClient.post('/auth/register', formData);
      const { token: newToken, user: userData } = res.data;
      setToken(newToken);
      setUser(userData);
      return userData;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Registration failed';
      setError(message);
      throw new Error(message);
    }
  }, []);

  // Login
  const login = useCallback(async (email, password) => {
    setError('');
    try {
      const res = await apiClient.post('/auth/login', { email, password });
      const { token: newToken, user: userData } = res.data;
      setToken(newToken);
      setUser(userData);
      return userData;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Login failed';
      setError(message);
      throw new Error(message);
    }
  }, []);

  // Forgot Password
  const forgotPassword = useCallback(async (email) => {
    setError('');
    try {
      await apiClient.post('/auth/forgot-password', { email });
      return true;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to send reset email';
      setError(message);
      throw new Error(message);
    }
  }, []);

  // Logout
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setError('');
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, error, login, register, logout, forgotPassword, setError }}>
      {children}
    </AuthContext.Provider>
  );
};
