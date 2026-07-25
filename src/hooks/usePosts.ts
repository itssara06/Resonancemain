import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPosts, getPost, createPost, deletePost } from '@/api/posts';
import { Post } from '@/types';
import { useAuthStore } from '@/store/useAuthStore';

export const usePosts = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['feed', page, limit],
    queryFn: () => getPosts(page, limit),
  });
};

export const usePost = (id: string) => {
  return useQuery({
    queryKey: ['posts', id],
    queryFn: () => getPost(id),
    enabled: !!id,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postData: Partial<Post>) => createPost(postData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      
      const authUser = useAuthStore.getState().user;
      if (authUser?.username) {
        queryClient.invalidateQueries({ queryKey: ['users', authUser.username, 'posts'] });
      }
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletePost(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['posts', id] });
      
      const authUser = useAuthStore.getState().user;
      if (authUser?.username) {
        queryClient.invalidateQueries({ queryKey: ['users', authUser.username, 'posts'] });
      }
    },
  });
};
