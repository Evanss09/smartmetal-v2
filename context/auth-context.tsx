'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getAuthState, login, logout, signUp, resetPassword, validateEmail, validatePassword } from '@/lib/auth';

interface AuthContextValue {
  isLoggedIn: boolean;
  userEmail: string | null;
  modalOpen: boolean;
  modalTab: 'login' | 'signup' | 'reset';
  openModal: (tab?: 'login' | 'signup' | 'reset') => void;
  closeModal: () => void;
  handleLogin: (email: string, password: string) => Promise<{ error?: string }>;
  handleSignUp: (email: string, password: string) => Promise<{ error?: string }>;
  handleResetPassword: (email: string, newPassword: string) => Promise<{ error?: string }>;
  handleLogout: () => void;
  validateEmail: (email: string) => boolean;
  validatePassword: (password: string) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'login' | 'signup' | 'reset'>('login');

  useEffect(() => {
    const state = getAuthState();
    setIsLoggedIn(state.isLoggedIn);
    setUserEmail(state.userEmail);
  }, []);

  const openModal = useCallback((tab: 'login' | 'signup' | 'reset' = 'login') => {
    setModalTab(tab);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => setModalOpen(false), []);

  const handleLogin = useCallback(async (email: string, password: string) => {
    const result = login(email, password);
    if (result.success) {
      const state = getAuthState();
      setIsLoggedIn(true);
      setUserEmail(state.userEmail);
      closeModal();
    }
    return result.error ? { error: result.error } : {};
  }, [closeModal]);

  const handleSignUp = useCallback(async (email: string, password: string) => {
    const result = signUp(email, password);
    if (result.success) {
      const state = getAuthState();
      setIsLoggedIn(true);
      setUserEmail(state.userEmail);
      closeModal();
    }
    return result.error ? { error: result.error } : {};
  }, [closeModal]);

  const handleResetPassword = useCallback(async (email: string, newPassword: string) => {
    const result = resetPassword(email, newPassword);
    if (result.success) setModalTab('login');
    return result.error ? { error: result.error } : {};
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    setIsLoggedIn(false);
    setUserEmail(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      isLoggedIn, userEmail, modalOpen, modalTab,
      openModal, closeModal,
      handleLogin, handleSignUp, handleResetPassword, handleLogout,
      validateEmail, validatePassword,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
