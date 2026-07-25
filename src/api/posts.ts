import { api } from '@/lib/api';
import { Post, Pagination, ApiResponse } from '@/types';

export const getPosts = async (page = 1, limit = 10): Promise<ApiResponse<Post[]>> => {
  const { data } = await api.get<any>(`/posts?page=${page}&limit=${limit}`);
  return { ...data, data: data?.data?.posts || data?.data || [] };
};

export const getPost = async (id: string): Promise<ApiResponse<Post>> => {
  const { data } = await api.get<ApiResponse<Post>>(`/posts/${id}`);
  return data;
};

export const createPost = async (postData: Partial<Post>): Promise<ApiResponse<Post>> => {
  const { data } = await api.post<ApiResponse<Post>>('/posts', postData);
  return data;
};

export const deletePost = async (id: string): Promise<void> => {
  await api.delete(`/posts/${id}`);
};
