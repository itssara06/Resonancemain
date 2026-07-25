import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { toggleLike } from '@/api/likes';
import { toggleBookmark } from '@/api/bookmarks';
import { getComments, getReplies, addComment, deleteComment } from '@/api/comments';
import { getNotifications, markAsRead } from '@/api/notifications';
import { useAuthStore } from '@/store/useAuthStore';

export const useLike = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ entityType, entityId }: { entityType: string, entityId: string }) => toggleLike(entityType, entityId),
    onSuccess: (_, { entityType, entityId }) => {
      const type = entityType.toUpperCase();
      if (type === 'POST') {
        queryClient.invalidateQueries({ queryKey: ['posts', entityId] });
        queryClient.invalidateQueries({ queryKey: ['feed'] });
      } else if (type === 'ARTICLE') {
        queryClient.invalidateQueries({ queryKey: ['articles', entityId] });
      } else if (type === 'COMMENT') {
        // Broadly invalidate comments associated with this entityId, since likes on comments don't bubble up directly easily
        queryClient.invalidateQueries({ queryKey: ['comments'] });
        queryClient.invalidateQueries({ queryKey: ['replies'] });
      }
    }
  });
};

export const useBookmark = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ entityType, entityId }: { entityType: string, entityId: string }) => toggleBookmark(entityType, entityId),
    onSuccess: (_, { entityType, entityId }) => {
      const type = entityType.toUpperCase();
      if (type === 'POST') {
        queryClient.invalidateQueries({ queryKey: ['posts', entityId] });
        queryClient.invalidateQueries({ queryKey: ['feed'] });
      } else if (type === 'ARTICLE') {
        queryClient.invalidateQueries({ queryKey: ['articles', entityId] });
      }
      
      const authUser = useAuthStore.getState().user;
      if (authUser?.id) {
        queryClient.invalidateQueries({ queryKey: ['bookmarks', authUser.id] });
      }
    }
  });
};

export const useComments = (entityType: string, entityId: string, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['comments', entityType, entityId, page, limit],
    queryFn: () => getComments(entityType, entityId, page, limit),
    enabled: !!entityId && !!entityType,
  });
};

export const useReplies = (parentId: string, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['replies', parentId, page, limit],
    queryFn: () => getReplies(parentId, page, limit),
    enabled: !!parentId,
  });
};

export const useAddComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ entityType, entityId, content, parentId }: { entityType: string; entityId: string; content: string; parentId?: string }) => addComment(entityType, entityId, content, parentId),
    onSuccess: (_, { entityType, entityId, parentId }) => {
      queryClient.invalidateQueries({ queryKey: ['comments', entityType, entityId] });
      if (parentId) {
        queryClient.invalidateQueries({ queryKey: ['replies', parentId] });
      }
      const type = entityType.toUpperCase();
      if (type === 'POST') {
        queryClient.invalidateQueries({ queryKey: ['posts', entityId] });
        queryClient.invalidateQueries({ queryKey: ['feed'] });
      } else if (type === 'ARTICLE') {
        queryClient.invalidateQueries({ queryKey: ['articles', entityId] });
      }
    }
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commentId: string) => deleteComment(commentId),
    onSuccess: () => {
      // It's hard to know which post/article to update without the comment object, so we invalidate broadly for comments
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    }
  });
};

export const useNotifications = (page = 1, limit = 10) => {
  const authUser = useAuthStore().user;
  return useQuery({
    queryKey: ['notifications', authUser?.id, page, limit],
    queryFn: () => getNotifications(page, limit),
    enabled: !!authUser?.id,
  });
};

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (notificationId?: string) => markAsRead(notificationId),
    onSuccess: () => {
      const authUser = useAuthStore.getState().user;
      if (authUser?.id) {
        queryClient.invalidateQueries({ queryKey: ['notifications', authUser.id] });
      } else {
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
      }
    }
  });
};
