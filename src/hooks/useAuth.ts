'use client';

import { useState, useEffect } from 'react';

export interface UseAuthReturn {
  isAuthenticated: boolean;
  showPasswordModal: boolean;
  setShowPasswordModal: (show: boolean) => void;
  validatePassword: (password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

export function useAuth(): UseAuthReturn {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Check if user is already authenticated (from sessionStorage)
  useEffect(() => {
    const authStatus = sessionStorage.getItem('color-features-auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const validatePassword = async (password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        setIsAuthenticated(true);
        setShowPasswordModal(false);
        // Store authentication state in sessionStorage (expires when browser closes)
        sessionStorage.setItem('color-features-auth', 'true');
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Authentication error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('color-features-auth');
  };

  return {
    isAuthenticated,
    showPasswordModal,
    setShowPasswordModal,
    validatePassword,
    logout,
    isLoading,
  };
}
