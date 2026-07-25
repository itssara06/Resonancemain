import { api } from '@/lib/api';

export const getArticles = async (page = 1, limit = 10, username?: string) => {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (username) params.append('username', username);
  const { data } = await api.get<any>(`/articles?${params.toString()}`);
  return { ...data, data: data?.data?.articles || data?.data || [] };
};

export const getMyArticles = async (page = 1, limit = 10) => {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  const { data } = await api.get<any>(`/articles/my?${params.toString()}`);
  return { ...data, data: data?.data?.articles || data?.data || [] };
};

export const getArticle = async (slugOrId: string) => {
  const response = await api.get(`/articles/${slugOrId}`);
  return response.data;
};

export const createArticle = async (data: { title: string; content: string; coverImage?: string; published?: boolean }) => {
  const response = await api.post('/articles', data);
  return response.data;
};

export const updateArticle = async (id: string, data: { title: string; content: string; coverImage?: string }) => {
  const response = await api.put(`/articles/${id}`, data);
  return response.data;
};

export const publishArticle = async (id: string) => {
  const response = await api.patch(`/articles/${id}/publish`);
  return response.data;
};

export const unpublishArticle = async (id: string) => {
  const response = await api.patch(`/articles/${id}/unpublish`);
  return response.data;
};

export const deleteArticle = async (id: string) => {
  const response = await api.delete(`/articles/${id}`);
  return response.data;
};
