import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Anonymous usage - unchanged from before, shared across all tools.
  const [usageCount, setUsageCount] = useState(() => {
    const stored = localStorage.getItem('ewn_usage_count');
    return stored ? parseInt(stored, 10) : 0;
  });

  // Logged-in bonus usage - a SEPARATE counter, not a continuation of the
  // anonymous one. Logging in always grants a fresh 10, regardless of how
  // much of the anonymous 10 was already used. Shared per-browser (like
  // the anonymous counter) rather than tied to the account itself - fine
  // for now, just worth knowing if you later want it to follow the user
  // across devices instead of the browser.
  const [loggedInUsageCount, setLoggedInUsageCount] = useState(() => {
    const stored = localStorage.getItem('ewn_logged_in_usage_count');
    return stored ? parseInt(stored, 10) : 0;
  });

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [limitMessage, setLimitMessage] = useState('');

  const MAX_FREE_ATTEMPTS = 10;      // anonymous, before any login
  const MAX_LOGGED_IN_BONUS = 10;    // additional uses granted once logged in

  const API_BASE = import.meta.env.VITE_API_URL || 'https://pdf-suite-v2.onrender.com';

  useEffect(() => {
    const token = localStorage.getItem('ewn_token');
    const userData = localStorage.getItem('ewn_user');

    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE}/api/auth/login`, { email, password });
      setUser(response.data.user);
      localStorage.setItem('ewn_token', response.data.token);
      localStorage.setItem('ewn_user', JSON.stringify(response.data.user));
      setLimitMessage('');
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE}/api/auth/register`, { email, password });
      setUser(response.data.user);
      localStorage.setItem('ewn_token', response.data.token);
      localStorage.setItem('ewn_user', JSON.stringify(response.data.user));
      setLimitMessage('');
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

  // Called by tools before executing.
  // Anonymous: allowed up to MAX_FREE_ATTEMPTS, then blocked with a message
  //   and the login modal.
  // Logged in: allowed up to MAX_LOGGED_IN_BONUS additional uses, then
  //   blocked with a different message (no login modal needed - they're
  //   already logged in).
  const canUseTool = () => {
    if (user) {
      if (loggedInUsageCount >= MAX_LOGGED_IN_BONUS) {
        setLimitMessage(
          `You've used all ${MAX_LOGGED_IN_BONUS} of your bonus conversions. Please check back later.`
        );
        return false;
      }
      setLimitMessage('');
      return true;
    }

    if (usageCount >= MAX_FREE_ATTEMPTS) {
      setLimitMessage(
        `You've used all ${MAX_FREE_ATTEMPTS} free conversions. Log in or sign up to get ${MAX_LOGGED_IN_BONUS} more, free.`
      );
      setShowLoginModal(true);
      return false;
    }
    setLimitMessage('');
    return true;
  };

  // Called by tools after a successful conversion.
  const incrementUsage = () => {
    if (user) {
      const newCount = loggedInUsageCount + 1;
      setLoggedInUsageCount(newCount);
      localStorage.setItem('ewn_logged_in_usage_count', newCount.toString());
      return;
    }
    const newCount = usageCount + 1;
    setUsageCount(newCount);
    localStorage.setItem('ewn_usage_count', newCount.toString());
  };

  // Adapts automatically to whichever pool currently applies.
  const remainingUses = user
    ? Math.max(0, MAX_LOGGED_IN_BONUS - loggedInUsageCount)
    : Math.max(0, MAX_FREE_ATTEMPTS - usageCount);

  return (
    <AuthContext.Provider value={{
      user, login, register, logout,
      usageCount, loggedInUsageCount, remainingUses,
      MAX_FREE_ATTEMPTS, MAX_LOGGED_IN_BONUS,
      canUseTool, incrementUsage,
      showLoginModal, setShowLoginModal,
      limitMessage,
    }}>
      {children}
    </AuthContext.Provider>
  );
};