import { api } from '@/lib/api';
import { Profile, Post, ApiResponse } from '@/types';

export const getUserProfile = async (username: string): Promise<ApiResponse<Profile>> => {
  const { data } = await api.get<ApiResponse<Profile>>(`/users/${username}`);
  return data;
};

export const getUserPosts = async (username: string, page = 1, limit = 10): Promise<ApiResponse<Post[]>> => {
  const { data } = await api.get<any>(`/posts?username=${username}&page=${page}&limit=${limit}`);
  return { ...data, data: data?.data?.posts || data?.data || [] };
};

export const toggleFollow = async (username: string): Promise<ApiResponse<void>> => {
  const { data } = await api.post<ApiResponse<void>>(`/follows/${username}`);
  return data;
};

export const getSuggestedUsers = async (limit = 5): Promise<ApiResponse<Profile[]>> => {
  const { data } = await api.get<any>(`/follows/suggestions/users?limit=${limit}`);
  return { ...data, data: data?.data?.users || data?.data?.suggestions || data?.data || [] };
};

export const onboardUser = async (onboardData: any): Promise<ApiResponse<Profile>> => {
  const { data } = await api.post<ApiResponse<Profile>>(`/users/onboard`, onboardData);
  return data;
};

export const updateProfile = async (profileData: any): Promise<ApiResponse<Profile>> => {
  const { data } = await api.put<ApiResponse<Profile>>(`/users/profile`, profileData);
  return data;
};

export const checkUsername = async (username: string): Promise<ApiResponse<{ available: boolean; suggestions?: string[] }>> => {
  const { data } = await api.get<ApiResponse<{ available: boolean; suggestions?: string[] }>>(`/users/check/username?username=${username}`);
  return data;
};
