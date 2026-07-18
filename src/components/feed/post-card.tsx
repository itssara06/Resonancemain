"use client";

import Image from "next/image";
import { Heart, MessageSquare, Bookmark, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

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

import { useRouter } from "next/navigation";

export function PostCard({ post }: { post: PostProps }) {
  const router = useRouter();

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
    <article 
      onClick={handleCardClick}
      className="surface p-5 rounded-2xl mb-6 transition-all duration-300 hover:border-foreground/20 group cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12 ring-2 ring-background border border-border">
            <AvatarImage src={post.user.avatarUrl} alt={post.user.username} />
            <AvatarFallback className="bg-secondary">{post.user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground tracking-tight">{post.user.name}</span>
              <span className="text-muted-foreground text-sm">@{post.user.username}</span>
              <span className="text-muted-foreground text-xs">•</span>
              <span className="text-muted-foreground text-xs">{post.createdAt}</span>
            </div>
            <span className="text-xs text-muted-foreground">{post.user.discipline}</span>
          </div>
        </div>
        <button className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-secondary">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="mb-4">
        <Badge variant="outline" className={`mb-3 ${getTypeColor(post.type)}`}>
          {post.type}
        </Badge>
        <p className="text-foreground leading-relaxed whitespace-pre-wrap text-sm sm:text-[15px]">
          {post.content}
        </p>
      </div>

      {/* Image Grid (Max 4) */}
      {post.images && post.images.length > 0 && (
        <div className={`grid gap-2 mb-4 rounded-xl overflow-hidden ${
          post.images.length === 1 ? 'grid-cols-1' : 
          post.images.length === 2 ? 'grid-cols-2' : 
          post.images.length === 3 ? 'grid-cols-2' : 'grid-cols-2'
        }`}>
          {post.images.slice(0, 4).map((img, i) => (
            <div key={i} className={`relative bg-secondary aspect-video ${post.images?.length === 3 && i === 0 ? 'col-span-2' : ''}`}>
              <Image 
                src={img} 
                alt="Post attachment" 
                fill 
                className="object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
              />
            </div>
          ))}
        </div>
      )}

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {post.tags.map((tag, i) => (
            <span key={i} className="text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-6 pt-2 border-t border-border/50">
        <button onClick={(e) => e.stopPropagation()} className="flex items-center gap-2 text-muted-foreground hover:text-rose-500 transition-colors group/btn">
          <div className={`p-2 rounded-full group-hover/btn:bg-rose-500/10 ${post.isLiked ? 'text-rose-500' : ''}`}>
            <Heart size={18} className={post.isLiked ? 'fill-current' : ''} />
          </div>
          <span className={`text-sm font-medium ${post.isLiked ? 'text-rose-500' : ''}`}>{post.likes}</span>
        </button>
        <button onClick={(e) => e.stopPropagation()} className="flex items-center gap-2 text-muted-foreground hover:text-blue-500 transition-colors group/btn">
          <div className="p-2 rounded-full group-hover/btn:bg-blue-500/10">
            <MessageSquare size={18} />
          </div>
          <span className="text-sm font-medium">{post.comments}</span>
        </button>
        <div className="flex-1" />
        <button onClick={(e) => e.stopPropagation()} className="flex items-center gap-2 text-muted-foreground hover:text-amber-500 transition-colors group/btn">
          <div className={`p-2 rounded-full group-hover/btn:bg-amber-500/10 ${post.isSaved ? 'text-amber-500' : ''}`}>
            <Bookmark size={18} className={post.isSaved ? 'fill-current' : ''} />
          </div>
        </button>
      </div>
    </article>
  );
}
