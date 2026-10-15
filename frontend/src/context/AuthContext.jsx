import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('pet_token') || null);
  const [loading, setLoading] = useState(true);

  // Check current session on mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axiosClient.get('/auth/me');
        if (response.data?.success) {
          setUser(response.data.user);
        }
      } catch (error) {
        console.error('Session expired or invalid:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [token]);

  // Login handler
  const login = async (email, password) => {
    const response = await axiosClient.post('/auth/login', { email, password });
    if (response.data?.success) {
      const { token: receivedToken, user: receivedUser } = response.data;
      localStorage.setItem('pet_token', receivedToken);
      setToken(receivedToken);
      setUser(receivedUser);
      return receivedUser;
    }
  };

  // Register handler
  const register = async (userData) => {
    const response = await axiosClient.post('/auth/register', userData);
    if (response.data?.success) {
      const { token: receivedToken, user: receivedUser } = response.data;
      localStorage.setItem('pet_token', receivedToken);
      setToken(receivedToken);
      setUser(receivedUser);
      return receivedUser;
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('pet_token');
    setToken(null);
    setUser(null);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAdmin,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
