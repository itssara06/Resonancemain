import { api } from '@/lib/api';
import { ApiResponse } from '@/types';

export const toggleBookmark = async (entityType: string, entityId: string): Promise<ApiResponse<{ isSaved: boolean }>> => {
  const { data } = await api.post<ApiResponse<{ isSaved: boolean }>>(`/bookmarks`, { entityType, entityId });
  return data;
};
