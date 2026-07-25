import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getArticles, getMyArticles, getArticle, createArticle, updateArticle, publishArticle, unpublishArticle, deleteArticle } from '@/api/articles';

export const useArticles = (page = 1, limit = 10, username?: string) => {
  return useQuery({
    queryKey: ['articles', page, limit, username],
    queryFn: () => getArticles(page, limit, username),
  });
};

export const useMyArticles = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['my-articles', page, limit],
    queryFn: () => getMyArticles(page, limit),
  });
};

export const useArticle = (slugOrId: string) => {
  return useQuery({
    queryKey: ['articles', slugOrId],
    queryFn: () => getArticle(slugOrId),
    enabled: !!slugOrId,
  });
};

export const useCreateArticle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { title: string; content: string; coverImage?: string; published?: boolean }) => createArticle(data),
    onSuccess: () => {
      // Invalidate collections without invalidating individual articles unnecessarily
      queryClient.invalidateQueries({ queryKey: ['articles'], exact: false });
      queryClient.invalidateQueries({ queryKey: ['my-articles'] });
    },
  });
};

export const useUpdateArticle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { title: string; content: string; coverImage?: string } }) => updateArticle(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['articles', id] });
      // To ensure lists update but we don't necessarily want to drop everything
      queryClient.invalidateQueries({ queryKey: ['my-articles'] });
    },
  });
};

export const usePublishArticle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => publishArticle(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['articles', id] });
      queryClient.invalidateQueries({ queryKey: ['my-articles'] });
    },
  });
};

export const useUnpublishArticle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => unpublishArticle(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['articles', id] });
      queryClient.invalidateQueries({ queryKey: ['my-articles'] });
    },
  });
};

export const useDeleteArticle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteArticle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      queryClient.invalidateQueries({ queryKey: ['my-articles'] });
    },
  });
};
