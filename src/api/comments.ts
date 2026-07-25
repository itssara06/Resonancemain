import { api } from '@/lib/api';
import { Comment, ApiResponse } from '@/types';

export const getComments = async (entityType: string, entityId: string, page = 1, limit = 10): Promise<ApiResponse<Comment[]>> => {
  const { data } = await api.get<any>(`/comments/${entityType}/${entityId}?page=${page}&limit=${limit}`);
  return { ...data, data: data?.data?.comments || data?.data || [] };
};

export const getReplies = async (parentId: string, page = 1, limit = 10): Promise<ApiResponse<Comment[]>> => {
  const { data } = await api.get<any>(`/comments/${parentId}/replies?page=${page}&limit=${limit}`);
  return { ...data, data: data?.data?.replies || data?.data?.comments || data?.data || [] };
};

export const addComment = async (entityType: string, entityId: string, content: string, parentId?: string): Promise<ApiResponse<Comment>> => {
  const payload: any = { content, parentId };
  if (entityType === 'POST') payload.postId = entityId;
  else if (entityType === 'ARTICLE') payload.articleId = entityId;

  const { data } = await api.post<ApiResponse<Comment>>(`/comments`, payload);
  return data;
};

export const deleteComment = async (commentId: string): Promise<void> => {
  await api.delete(`/comments/${commentId}`);
};
