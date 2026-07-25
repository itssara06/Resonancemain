import { api } from '@/lib/api';
import { User } from '@/types';

export interface AuthCredentials {
  email: string;
  password?: string;
  username?: string;
  displayName?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export const login = async (credentials: AuthCredentials): Promise<AuthResponse> => {
  const { data } = await api.post<any>('/auth/login', credentials);
  return data.data || data;
};

export const register = async (credentials: AuthCredentials): Promise<AuthResponse> => {
  const { data } = await api.post<any>('/auth/register', credentials);
  return data.data || data;
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};

export const fetchCurrentUser = async (): Promise<User> => {
  const { data } = await api.get<any>('/auth/me');
  const user = data.data?.user || data.data || data.user || data;
  return user;
};

export const refreshToken = async (): Promise<{ accessToken: string }> => {
  const { data } = await api.post<any>('/auth/refresh');
  return data.data || data;
};
