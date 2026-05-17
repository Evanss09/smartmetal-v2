'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';

export default function AuthModal() {
  const { modalOpen, modalTab, closeModal, openModal, handleLogin, handleSignUp, handleResetPassword, validateEmail, validatePassword } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
    setLoading(false);
    setResetSuccess(false);
  }, [modalTab, modalOpen]);

  useEffect(() => {
    if (!modalOpen) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [modalOpen, closeModal]);

  if (!modalOpen) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) { setError('Enter a valid email address.'); return; }

    if (modalTab === 'reset') {
      if (!validatePassword(password)) { setError('Password must be 8+ characters with at least one number.'); return; }
      if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
      setLoading(true);
      const result = await handleResetPassword(email, password);
      setLoading(false);
      if (result.error) { setError(result.error); } else { setResetSuccess(true); }
      return;
    }

    if (!validatePassword(password)) { setError('Password must be 8+ characters with at least one number.'); return; }

    if (modalTab === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match.'); return;
    }

    setLoading(true);
    const result = modalTab === 'login'
      ? await handleLogin(email, password)
      : await handleSignUp(email, password);
    setLoading(false);
    if (result.error) setError(result.error);
  }

  const tabs: { key: 'login' | 'signup' | 'reset'; label: string }[] = [
    { key: 'login', label: 'Login' },
    { key: 'signup', label: 'Sign Up' },
    { key: 'reset', label: 'Reset Password' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeModal} />
      <div className="relative w-full max-w-md bg-surface-up border border-neutral-800 shadow-2xl">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-neutral-800">
          <span className="font-display text-lg font-black text-neutral-100 tracking-tight">
            SMART<span className="text-orange-500">METAL</span>
          </span>
          <button onClick={closeModal} className="text-neutral-500 hover:text-neutral-100 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="flex border-b border-neutral-800">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => openModal(tab.key)}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
                modalTab === tab.key
                  ? 'text-orange-500 border-b-2 border-orange-500 -mb-px'
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {resetSuccess ? (
            <div className="text-center py-4">
              <p className="text-sm text-green-400 font-medium mb-4">Password updated successfully.</p>
              <Button size="sm" onClick={() => openModal('login')}>Back to Login</Button>
            </div>
          ) : (
            <form onSubmit={submit} className="flex flex-col gap-4">
              <Input
                label="Email"
                id="auth-email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
              <Input
                label={modalTab === 'reset' ? 'New Password' : 'Password'}
                id="auth-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={modalTab === 'login' ? 'current-password' : 'new-password'}
                required
              />
              {(modalTab === 'signup' || modalTab === 'reset') && (
                <Input
                  label="Confirm Password"
                  id="auth-confirm"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
              )}
              {error && <p className="text-xs text-red-500">{error}</p>}
              <Button type="submit" disabled={loading} className="w-full mt-2">
                {loading ? 'Please wait...' : modalTab === 'login' ? 'Login' : modalTab === 'signup' ? 'Create Account' : 'Update Password'}
              </Button>
              {modalTab === 'login' && (
                <p className="text-center text-xs text-neutral-500">
                  No account?{' '}
                  <button type="button" onClick={() => openModal('signup')} className="text-orange-500 hover:text-orange-400 font-bold">
                    Sign Up
                  </button>
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
