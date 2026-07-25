import { create } from 'zustand';
import { User } from '@/types';
import { AuthCredentials } from '@/api/auth';
import { authClient, signIn, signUp, signOut } from '@/lib/auth-client';

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
    
    const { data, error } = await signIn.email({
        email: credentials.email,
        password: credentials.password
    });

    if (error) {
        set({ loading: false, error: error.message || 'Login failed' });
        throw new Error(error.message);
    }
    
    // Better Auth handles the token via cookies.
    // For local state we just need to refetch the user.
    await get().fetchCurrentUser();
  },

  register: async (credentials) => {
    set({ loading: true, error: null });
    
    const { data, error } = await signUp.email({
        email: credentials.email,
        password: credentials.password,
        name: credentials.username || credentials.email.split('@')[0],
    });

    if (error) {
        set({ loading: false, error: error.message || 'Registration failed' });
        throw new Error(error.message);
    }

    await get().fetchCurrentUser();
  },

  logout: async () => {
    set({ loading: true, error: null });
    await signOut();
    get().clear();
  },

  fetchCurrentUser: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await authClient.getSession();
      
      if (error || !data) {
          get().clear();
          return;
      }

      // Map Better Auth user to our internal User format
      const userToStore = {
          ...data.user,
          displayName: data.user.name,
          avatar: data.user.image,
      } as unknown as User;

      set({ user: userToStore, isAuthenticated: true, loading: false });
    } catch (error) {
      get().clear();
    }
  },

  refreshToken: async () => {
    // Better Auth handles token refreshes automatically in the background via cookies!
    // We just keep this here to satisfy the old interface if something calls it.
  },

  clear: () => {
    set({ user: null, accessToken: null, isAuthenticated: false, loading: false, error: null });
  }
}));
