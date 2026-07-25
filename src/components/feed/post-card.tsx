"use client";

import Image from "next/image";
import { Heart, MessageSquare, Bookmark, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useState, useEffect } from "react";
import { useLike, useBookmark } from "@/hooks/useInteractions";

export interface PostProps {
  id: string;
  user: {
    name: string;
    username: string;
    avatarUrl?: string;
    discipline: string;
  };
  content: string;
  images?: string[];
  type: string;
  tags: string[];
  createdAt: string;
  likes: number;
  comments: number;
  isLiked?: boolean;
  isSaved?: boolean;
}

export function PostCard({ post }: { post: PostProps }) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const likeMutation = useLike();
  const bookmarkMutation = useBookmark();
  
  const [optimisticLike, setOptimisticLike] = useState(post.isLiked);
  const [optimisticLikeCount, setOptimisticLikeCount] = useState(post.likes);
  const [optimisticSave, setOptimisticSave] = useState(post.isSaved);

  // Sync state if props change from React Query cache
  useEffect(() => {
    setOptimisticLike(post.isLiked);
    setOptimisticLikeCount(post.likes);
    setOptimisticSave(post.isSaved);
  }, [post.isLiked, post.likes, post.isSaved]);

  const requireAuth = (callback: () => void) => {
    if (isAuthenticated) {
      callback();
    } else {
      router.push('/login');
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    requireAuth(() => {
      setOptimisticLike(!optimisticLike);
      setOptimisticLikeCount(prev => optimisticLike ? prev - 1 : prev + 1);
      likeMutation.mutate({ entityType: 'post', entityId: post.id }, {
        onError: () => {
          // Revert on error
          setOptimisticLike(optimisticLike);
          setOptimisticLikeCount(post.likes);
        }
      });
    });
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    requireAuth(() => {
      setOptimisticSave(!optimisticSave);
      bookmarkMutation.mutate({ entityType: 'post', entityId: post.id }, {
        onError: () => {
          // Revert on error
          setOptimisticSave(optimisticSave);
        }
      });
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Idea": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "Work in Progress": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "Seeking Feedback": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "Question": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "Process Journal": return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case "Design Debate": return "bg-rose-500/10 text-rose-500 border-rose-500/20";
      default: return "bg-secondary text-foreground border-border";
    }
  };

  const handleCardClick = () => {
    router.push(`/post/${post.id}`);
  };

  return (
    <article onClick={handleCardClick} className="flex flex-col p-5 sm:p-6 mb-4 surface rounded-2xl border-border/50 hover:border-foreground/20 transition-all duration-300 cursor-pointer group animate-in fade-in slide-in-from-bottom-4">
      
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar className="w-11 h-11 ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
            <AvatarImage src={post.user.avatarUrl} />
            <AvatarFallback className="bg-secondary text-foreground/70 font-semibold">{post.user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span onClick={(e) => { e.stopPropagation(); router.push(`/profile/${post.user.username}`); }} className="font-semibold text-[15px] hover:underline cursor-pointer tracking-tight">{post.user.name}</span>
              <span onClick={(e) => { e.stopPropagation(); router.push(`/profile/${post.user.username}`); }} className="text-muted-foreground text-sm cursor-pointer hover:underline">@{post.user.username}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{post.user.discipline}</span>
              <span>•</span>
              <span>{post.createdAt}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {post.type && (
            <Badge variant="outline" className={`${getTypeColor(post.type)} border hidden sm:flex`}>
              {post.type}
            </Badge>
          )}
          <button onClick={(e) => e.stopPropagation()} className="p-2 text-muted-foreground hover:bg-secondary rounded-full transition-colors">
            <MoreHorizontal size={18} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="mb-4">
        <p className="text-[15px] sm:text-base leading-relaxed text-foreground/90 whitespace-pre-wrap">
          {post.content}
        </p>
      </div>

      {/* Images */}
      {post.images && post.images.length > 0 && (
        <div className={`grid gap-2 mb-4 ${post.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {post.images.map((img, i) => (
            <div key={i} className="relative aspect-video rounded-xl overflow-hidden border border-border/50 bg-secondary/50">
              <Image 
                src={img} 
                alt="Post image" 
                fill 
                className="object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
              />
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-6 pt-2 border-t border-border/50">
        <button onClick={handleLike} disabled={likeMutation.isPending} className="flex items-center gap-2 text-muted-foreground hover:text-rose-500 transition-colors group/btn">
          <div className={`p-2 rounded-full group-hover/btn:bg-rose-500/10 ${optimisticLike ? 'text-rose-500' : ''}`}>
            <Heart size={18} className={optimisticLike ? 'fill-current' : ''} />
          </div>
          <span className={`text-sm font-medium ${optimisticLike ? 'text-rose-500' : ''}`}>{optimisticLikeCount}</span>
        </button>
        <button onClick={(e) => { e.stopPropagation(); router.push(`/post/${post.id}`); }} className="flex items-center gap-2 text-muted-foreground hover:text-blue-500 transition-colors group/btn">
          <div className="p-2 rounded-full group-hover/btn:bg-blue-500/10">
            <MessageSquare size={18} />
          </div>
          <span className="text-sm font-medium">{post.comments}</span>
        </button>
        <div className="flex-1" />
        <button onClick={handleSave} disabled={bookmarkMutation.isPending} className="flex items-center gap-2 text-muted-foreground hover:text-amber-500 transition-colors group/btn">
          <div className={`p-2 rounded-full group-hover/btn:bg-amber-500/10 ${optimisticSave ? 'text-amber-500' : ''}`}>
            <Bookmark size={18} className={optimisticSave ? 'fill-current' : ''} />
          </div>
        </button>
      </div>
    </article>
  );
}
