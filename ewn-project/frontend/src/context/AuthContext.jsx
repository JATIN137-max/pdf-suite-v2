import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [usageCount, setUsageCount] = useState(() => {
    // Initialize directly from localStorage to avoid the "always shows 10" bug
    const stored = localStorage.getItem('ewn_usage_count');
    return stored ? parseInt(stored, 10) : 0;
  });
  const [showLoginModal, setShowLoginModal] = useState(false);

  const MAX_FREE_ATTEMPTS = 10;
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('ewn_token');
    const userData = localStorage.getItem('ewn_user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      setUser(response.data.user);
      localStorage.setItem('ewn_token', response.data.token);
      localStorage.setItem('ewn_user', JSON.stringify(response.data.user));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, { email, password });
      setUser(response.data.user);
      localStorage.setItem('ewn_token', response.data.token);
      localStorage.setItem('ewn_user', JSON.stringify(response.data.user));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Registration failed' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ewn_token');
    localStorage.removeItem('ewn_user');
  };

  // Called by tools before executing
  // If user is logged in → always allow (no payment wall)
  // If not logged in and over limit → show login modal
  const canUseTool = () => {
    if (user) return true; // Logged-in users always get access

    if (usageCount >= MAX_FREE_ATTEMPTS) {
      setShowLoginModal(true);
      return false;
    }
    return true;
  };

  // Called by tools after successful execution (only counts for guests)
  const incrementUsage = () => {
    if (user) return; // Logged-in users don't have a counter
    const newCount = usageCount + 1;
    setUsageCount(newCount);
    localStorage.setItem('ewn_usage_count', newCount.toString());
  };

  const remainingUses = Math.max(0, MAX_FREE_ATTEMPTS - usageCount);

  return (
    <AuthContext.Provider value={{
      user, login, register, logout,
      usageCount, remainingUses, MAX_FREE_ATTEMPTS,
      canUseTool, incrementUsage,
      showLoginModal, setShowLoginModal,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
