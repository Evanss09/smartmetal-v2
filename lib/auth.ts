import type { User } from './types';

const USERS_KEY = '@smartmetal/users';
const LOGGED_IN_KEY = '@smartmetal/isLoggedIn';
const EMAIL_KEY = '@smartmetal/userEmail';

function getUsers(): User[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveUsers(users: User[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function signUp(email: string, password: string): { success: boolean; error?: string } {
  const normalizedEmail = email.toLowerCase().trim();
  const users = getUsers();
  if (users.find((u) => u.email === normalizedEmail)) {
    return { success: false, error: 'An account with this email already exists.' };
  }
  users.push({ email: normalizedEmail, password });
  saveUsers(users);
  localStorage.setItem(LOGGED_IN_KEY, 'true');
  localStorage.setItem(EMAIL_KEY, normalizedEmail);
  return { success: true };
}

export function login(email: string, password: string): { success: boolean; error?: string } {
  const normalizedEmail = email.toLowerCase().trim();
  const users = getUsers();
  const user = users.find((u) => u.email === normalizedEmail && u.password === password);
  if (!user) {
    return { success: false, error: 'Invalid email or password.' };
  }
  localStorage.setItem(LOGGED_IN_KEY, 'true');
  localStorage.setItem(EMAIL_KEY, normalizedEmail);
  return { success: true };
}

export function logout(): void {
  localStorage.setItem(LOGGED_IN_KEY, 'false');
  localStorage.removeItem(EMAIL_KEY);
}

export function resetPassword(email: string, newPassword: string): { success: boolean; error?: string } {
  const normalizedEmail = email.toLowerCase().trim();
  const users = getUsers();
  const idx = users.findIndex((u) => u.email === normalizedEmail);
  if (idx === -1) {
    return { success: false, error: 'No account found with this email.' };
  }
  users[idx].password = newPassword;
  saveUsers(users);
  return { success: true };
}

export function getAuthState(): { isLoggedIn: boolean; userEmail: string | null } {
  if (typeof window === 'undefined') return { isLoggedIn: false, userEmail: null };
  const isLoggedIn = localStorage.getItem(LOGGED_IN_KEY) === 'true';
  const userEmail = localStorage.getItem(EMAIL_KEY);
  return { isLoggedIn, userEmail };
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePassword(password: string): boolean {
  return password.length >= 8 && /\d/.test(password);
}
