import { create } from 'zustand';
import { User } from '@/types';
import { login as loginApi, register as registerApi, logout as logoutApi, fetchCurrentUser, refreshToken as refreshApi, AuthCredentials } from '@/api/auth';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  
  login: (credentials: AuthCredentials) => Promise<void>;
  register: (credentials: AuthCredentials) => Promise<void>;
  logout: () => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
  refreshToken: () => Promise<void>;
  clear: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  loading: true, // Initially true while we check session
  error: null,

  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const { user, accessToken } = await loginApi(credentials);
      set({ user, accessToken, isAuthenticated: true, loading: false });
    } catch (error: any) {
      const backendError = error.response?.data?.errors?.[0]?.message || error.response?.data?.message;
      set({ loading: false, error: backendError || error.message || 'Login failed' });
      throw error;
    }
  },

  register: async (credentials) => {
    set({ loading: true, error: null });
    try {
      await registerApi(credentials);
      set({ loading: false }); // Do not log in
    } catch (error: any) {
      const backendError = error.response?.data?.errors?.[0]?.message || error.response?.data?.message;
      set({ loading: false, error: backendError || error.message || 'Registration failed' });
      throw error;
    }
  },

  logout: async () => {
    set({ loading: true, error: null });
    try {
      await logoutApi();
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      get().clear();
    }
  },

  fetchCurrentUser: async () => {
    set({ loading: true, error: null });
    try {
      // First ensure we have a valid token
      if (!get().accessToken) {
        await get().refreshToken();
      }
      
      const user = await fetchCurrentUser();
      set({ user, isAuthenticated: true, loading: false });
    } catch (error) {
      // If fetching user fails, clear state
      get().clear();
    }
  },

  refreshToken: async () => {
    try {
      const { accessToken } = await refreshApi();
      set({ accessToken });
    } catch (error) {
      throw error;
    }
  },

  clear: () => {
    set({ user: null, accessToken: null, isAuthenticated: false, loading: false, error: null });
  }
}));
