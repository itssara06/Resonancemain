export type ReactionType = 'Insightful' | 'Helpful' | 'Interesting' | 'Agree' | 'Appreciate';

export interface ReactionCounts {
  Insightful: number;
  Helpful: number;
  Interesting: number;
  Agree: number;
  Appreciate: number;
}

export interface CommentUser {
  name: string;
  username: string;
  avatarUrl?: string;
  discipline: string;
}

export interface CommentNode {
  id: string;
  user: CommentUser;
  content: string; // supports markdown
  createdAt: string;
  isBestAnswer?: boolean;
  reactions: ReactionCounts;
  userReactedWith?: ReactionType;
  replies?: CommentNode[];
}
