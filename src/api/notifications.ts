import { api } from '@/lib/api';
import { Notification, ApiResponse } from '@/types';

export const getNotifications = async (page = 1, limit = 10): Promise<ApiResponse<Notification[]>> => {
  const { data } = await api.get<any>(`/notifications?page=${page}&limit=${limit}`);
  return { ...data, data: data?.data?.notifications || data?.data || [] };
};

export const markAsRead = async (notificationId?: string): Promise<void> => {
  if (notificationId) {
    await api.put(`/notifications/${notificationId}/read`);
  } else {
    // mark all as read
    await api.put(`/notifications/read-all`);
  }
};
