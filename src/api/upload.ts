import { api } from '@/lib/api';
import { ApiResponse } from '@/types';

export const uploadImage = async (file: File): Promise<ApiResponse<{ url: string }>> => {
  const formData = new FormData();
  formData.append('image', file);
  
  const { data } = await api.post<any>('/uploads/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  
  return data.data || data;
};
