export interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  displayName?: string;
  avatarUrl?: string;
  avatar?: string;
  bio?: string;
  website?: string;
  isOnboarded: boolean;
  interests?: string[];
  disciplines?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Profile extends User {
  followersCount: number;
  followingCount: number;
  isFollowing?: boolean;
}

export interface Post {
  id: string;
  userId: string;
  content: string;
  images: string[];
  type: string;
  tags: string[];
  isDraft: boolean;
  createdAt: string;
  updatedAt: string;
  user: User;
  likesCount: number;
  commentsCount: number;
  bookmarksCount: number;
  isLiked: boolean;
  isSaved: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  parentId?: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  replies?: Comment[];
}

export interface Notification {
  id: string;
  userId: string;
  actorId: string;
  type: 'LIKE' | 'COMMENT' | 'FOLLOW' | 'MENTION';
  entityId?: string;
  isRead: boolean;
  createdAt: string;
  actor: User;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: Pagination;
}
