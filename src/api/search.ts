import { api } from '@/lib/api';
import { User, Post, ApiResponse } from '@/types';

// For articles, we don't have a specific type yet in types/index.ts, but we'll assume it's similar or we return any for now
export const searchUsers = async (q: string, page = 1, limit = 10): Promise<ApiResponse<User[]>> => {
  const { data } = await api.get<any>(`/search/users?q=${encodeURIComponent(q)}&page=${page}&limit=${limit}`);
  return { ...data, data: data?.data?.users || data?.data || [] };
};

export const searchPosts = async (q: string, page = 1, limit = 10): Promise<ApiResponse<Post[]>> => {
  const { data } = await api.get<any>(`/search/posts?q=${encodeURIComponent(q)}&page=${page}&limit=${limit}`);
  return { ...data, data: data?.data?.posts || data?.data || [] };
};

export const searchArticles = async (q: string, page = 1, limit = 10): Promise<ApiResponse<any[]>> => {
  const { data } = await api.get<any>(`/search/articles?q=${encodeURIComponent(q)}&page=${page}&limit=${limit}`);
  return { ...data, data: data?.data?.articles || data?.data || [] };
};
