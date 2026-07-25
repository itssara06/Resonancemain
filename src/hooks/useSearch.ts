import { useQuery } from '@tanstack/react-query';
import { searchUsers, searchPosts, searchArticles } from '@/api/search';

export const useSearchUsers = (q: string, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['search', 'users', q, page, limit],
    queryFn: () => searchUsers(q, page, limit),
    enabled: !!q && q.length > 2, // only search if query is at least 3 chars
  });
};

export const useSearchPosts = (q: string, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['search', 'posts', q, page, limit],
    queryFn: () => searchPosts(q, page, limit),
    enabled: !!q && q.length > 2,
  });
};

export const useSearchArticles = (q: string, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['search', 'articles', q, page, limit],
    queryFn: () => searchArticles(q, page, limit),
    enabled: !!q && q.length > 2,
  });
};
