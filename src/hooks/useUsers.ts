import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserProfile, getUserPosts, toggleFollow, getSuggestedUsers, checkUsername, updateProfile } from '@/api/users';

export const useCheckUsername = (username: string) => {
  return useQuery({
    queryKey: ['checkUsername', username],
    queryFn: () => checkUsername(username),
    enabled: username.length >= 3,
    staleTime: 1000 * 60 * 5, // Cache results for 5 minutes
  });
};

export const useUserProfile = (username: string) => {
  return useQuery({
    queryKey: ['users', username],
    queryFn: () => getUserProfile(username),
    enabled: !!username,
  });
};

export const useUserPosts = (username: string, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['users', username, 'posts', page, limit],
    queryFn: () => getUserPosts(username, page, limit),
    enabled: !!username,
  });
};

import { useAuthStore } from '@/store/useAuthStore';

export const useFollow = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (username: string) => toggleFollow(username),
    onSuccess: (response: any, targetUsername) => {
      // Toggle logic based on response
      const isFollowing = response?.data?.following ?? response?.following ?? true;
      const countChange = isFollowing ? 1 : -1;

      // Optimistically update the target user
      queryClient.setQueryData(['users', targetUsername], (old: any) => {
        if (!old) return old;
        const hasProfileWrapper = !!old.data?.profile;
        const profile = hasProfileWrapper ? old.data.profile : (old.data || old);
        
        const updatedProfile = {
          ...profile,
          _count: {
             ...profile._count,
             followers: Math.max(0, (profile._count?.followers || 0) + countChange)
          },
          isFollowing,
        };

        if (hasProfileWrapper) return { ...old, data: { ...old.data, profile: updatedProfile } };
        if (old.data) return { ...old, data: updatedProfile };
        return updatedProfile;
      });
      
      // Optimistically update the authenticated user
      const authUser = useAuthStore.getState().user;
      if (authUser?.username) {
        queryClient.setQueryData(['users', authUser.username], (old: any) => {
          if (!old) return old;
          const hasProfileWrapper = !!old.data?.profile;
          const profile = hasProfileWrapper ? old.data.profile : (old.data || old);
          
          const updatedProfile = {
            ...profile,
            _count: {
               ...profile._count,
               following: Math.max(0, (profile._count?.following || 0) + countChange)
            }
          };

          if (hasProfileWrapper) return { ...old, data: { ...old.data, profile: updatedProfile } };
          if (old.data) return { ...old, data: updatedProfile };
          return updatedProfile;
        });
      }

      // Invalidate feeds and suggestions for eventual consistency
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['suggestedUsers'] });
    }
  });
};

export const useSuggestedUsers = (limit = 5) => {
  return useQuery({
    queryKey: ['suggestedUsers', limit],
    queryFn: () => getSuggestedUsers(limit),
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (profileData: any) => import('@/api/users').then(m => m.updateProfile(profileData)),
    onSuccess: (_, variables) => {
      const authUser = useAuthStore.getState().user;
      if (authUser?.username) {
        queryClient.invalidateQueries({ queryKey: ['users', authUser.username] });
      } else {
        queryClient.invalidateQueries({ queryKey: ['users'] }); // Fallback
      }
    }
  });
};
