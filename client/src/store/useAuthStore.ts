import { create } from 'zustand';
import { api } from '../lib/api';
import { User } from '../types';

type AuthState = {
  user: User | null;
  loading: boolean;
  init: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  init: async () => {
    try {
      const data = await api<{ user: User | null }>('/auth/me');
      set({ user: data.user, loading: false });
    } catch {
      set({ user: null, loading: false });
    }
  },
  login: async (email, password) => {
    const data = await api<{ user: User }>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    set({ user: data.user });
  },
  signup: async (email, password) => {
    const data = await api<{ user: User }>('/auth/signup', { method: 'POST', body: JSON.stringify({ email, password }) });
    set({ user: data.user });
  },
  logout: async () => {
    await api('/auth/logout', { method: 'POST' });
    set({ user: null });
  }
}));
