import { api } from '@/lib/api';
import { ApiResponse } from '@/types';

export const toggleLike = async (entityType: string, entityId: string): Promise<ApiResponse<{ isLiked: boolean }>> => {
  const payload: any = {};
  const type = entityType.toUpperCase();
  if (type === 'POST') payload.postId = entityId;
  else if (type === 'ARTICLE') payload.articleId = entityId;
  else if (type === 'COMMENT') payload.commentId = entityId;

  const { data } = await api.post<ApiResponse<{ isLiked: boolean }>>(`/likes`, payload);
  return data;
};
