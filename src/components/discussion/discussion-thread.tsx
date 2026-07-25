"use client";

import { useState, useEffect } from "react";
import { CommentNode, ReactionType } from "./types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, MessageSquare, Heart, Trash2, ChevronDown, CheckCircle2 } from "lucide-react";
import { DiscussionComposer } from "./discussion-composer";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useReplies, useLike, useDeleteComment } from "@/hooks/useInteractions";

const REACTION_ICONS: Record<ReactionType, string> = {
  Insightful: "💡",
  Helpful: "🙌",
  Interesting: "🤔",
  Agree: "💯",
  Appreciate: "✨"
};

export function DiscussionThread({ comments, level = 0, entityId, entityType }: { comments: any[], level?: number, entityId: string, entityType: string }) {
  if (!comments || comments.length === 0) return null;

  const activeComments = comments.filter(c => !c.isDeleted);
  
  if (activeComments.length === 0) return null;

  return (
    <div className="flex flex-col">
      {activeComments.map((comment, index) => (
        <DiscussionNode key={comment.id} comment={comment} level={level} isLast={index === activeComments.length - 1} entityId={entityId} entityType={entityType} />
      ))}
    </div>
  );
}

function DiscussionNode({ comment, level, isLast, entityId, entityType }: { comment: any, level: number, isLast: boolean, entityId: string, entityType: string }) {
  const [isReplying, setIsReplying] = useState(false);
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  
  const { mutate: toggleLike } = useLike();
  const { mutate: deleteComment, isPending: isDeleting } = useDeleteComment();

  const [optimisticLike, setOptimisticLike] = useState(comment.hasLiked || false);
  const [optimisticLikeCount, setOptimisticLikeCount] = useState(comment._count?.likes || 0);

  useEffect(() => {
    setOptimisticLike(comment.hasLiked || false);
    setOptimisticLikeCount(comment._count?.likes || 0);
  }, [comment.hasLiked, comment._count?.likes]);

  const handleLike = () => {
    requireAuth(() => {
      setOptimisticLike(!optimisticLike);
      setOptimisticLikeCount(prev => optimisticLike ? Math.max(0, prev - 1) : prev + 1);
      toggleLike({ entityType: 'COMMENT', entityId: comment.id }, {
        onError: () => {
          setOptimisticLike(comment.hasLiked || false);
          setOptimisticLikeCount(comment._count?.likes || 0);
        }
      });
    });
  };
  
  const requireAuth = (callback: () => void) => {
    if (isAuthenticated) callback();
    else router.push('/login');
  };

  const hasReplies = comment.replies && comment.replies.length > 0;
  // If we are deep enough, we don't indent anymore, just flat
  const isDeep = level >= 2;

  const toggleReaction = (type: ReactionType) => {
    setActiveReaction(prev => prev === type ? undefined : type);
  };

  const author = comment.user || comment.author || { name: 'Unknown', username: 'unknown' };
  const authorName = author.name || author.displayName || author.username;
  const avatarUrl = author.avatarUrl || author.avatar;
  const hasThreadLine = hasReplies || comment._count?.replies > 0;

  return (
    <div className="relative flex flex-col w-full group/node">
      <div className={`flex gap-3 sm:gap-4 pt-4 pb-2 relative z-10 ${level === 0 && !isLast ? 'border-b border-border/40' : ''}`}>
        
        {/* Left Column: Avatar & Thread Line */}
        <div className="flex flex-col items-center shrink-0 w-10">
          <Avatar className="w-10 h-10 ring-1 ring-border/50 cursor-pointer hover:opacity-80 transition-opacity z-10 bg-background">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback className="bg-secondary">{authorName?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          
          {/* Thread Line connecting to replies */}
          {hasThreadLine && (
            <div className="w-[2px] grow min-h-[20px] bg-border/40 my-1 group-hover/node:bg-border/70 transition-colors" />
          )}
        </div>

        {/* Right Column: Content */}
        <div className="flex-1 min-w-0 pb-1">
          {/* Header */}
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-foreground text-[15px] hover:underline cursor-pointer truncate">
                {authorName}
              </span>
              {comment.isBestAnswer && (
                <CheckCircle2 size={14} className="text-primary shrink-0" />
              )}
              <span className="text-[15px] text-muted-foreground truncate">
                @{author.username || authorName.toLowerCase().replace(/\s/g, '')}
              </span>
              <span className="text-muted-foreground text-sm">·</span>
              <span className="text-[15px] text-muted-foreground hover:underline cursor-pointer shrink-0">
                {comment.createdAt ? formatShortDate(comment.createdAt) : 'now'}
              </span>
            </div>
          </div>
            
          {/* Content */}
          <div className="text-[15px] leading-normal text-foreground/90 whitespace-pre-wrap break-words mb-3 mt-1">
            {comment.content}
          </div>

          {/* Action Bar (X Style) */}
          <div className="flex items-center gap-6 text-muted-foreground mb-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 rounded-full hover:bg-primary/10 hover:text-primary transition-colors gap-1.5 -ml-2"
              onClick={() => requireAuth(() => setIsReplying(!isReplying))}
            >
              <MessageSquare size={16} />
              <span className="text-xs font-medium">{comment._count?.replies || comment.replies?.length || 0}</span>
            </Button>

            <Button 
              variant="ghost" 
              size="sm" 
              className={`h-8 rounded-full hover:bg-pink-500/10 hover:text-pink-500 transition-colors gap-1.5 ${optimisticLike ? 'text-pink-500' : ''}`}
              onClick={handleLike}
            >
              <Heart size={16} className={optimisticLike ? 'fill-pink-500 text-pink-500' : ''} />
              <span className="text-xs font-medium">{optimisticLikeCount}</span>
            </Button>

            <div className="flex-1" />

            {user?.id === author.id && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 rounded-full hover:bg-red-500/10 hover:text-red-500 transition-colors text-muted-foreground/60"
                onClick={() => {
                  if (confirm("Are you sure you want to delete this comment?")) {
                    deleteComment(comment.id);
                  }
                }}
                disabled={isDeleting}
              >
                <Trash2 size={15} />
              </Button>
            )}
          </div>

          {/* Inline Reply Composer */}
          <AnimatePresence>
            {isReplying && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mt-2"
              >
                <div className="bg-secondary/10 rounded-xl p-2 ring-1 ring-border/50">
                  <DiscussionComposer placeholder="Post your reply" entityId={entityId} entityType={entityType} parentId={comment.id} autoFocus />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Nested Replies (Flattened Indentation) */}
      {hasThreadLine && (
        <div className="pl-5 sm:pl-6 relative">
          {(comment.replies && comment.replies.length > 0) ? (
            isDeep ? (
              <div className="flex items-center gap-2 pl-6 py-2 cursor-pointer hover:bg-secondary/30 rounded-r-lg transition-colors group">
                <span className="text-sm font-medium text-primary">View {comment.replies.length} replies</span>
              </div>
            ) : (
              <DiscussionThread comments={comment.replies} level={level + 1} entityId={entityId} entityType={entityType} />
            )
          ) : (comment._count?.replies > 0 ? (
            <RepliesLoader parentId={comment.id} level={level + 1} entityId={entityId} entityType={entityType} replyCount={comment._count.replies} isDeep={isDeep} />
          ) : null)}
        </div>
      )}
    </div>
  );
}

function RepliesLoader({ parentId, level, entityId, entityType, replyCount, isDeep }: { parentId: string, level: number, entityId: string, entityType: string, replyCount: number, isDeep: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: repliesResponse, isLoading } = useReplies(parentId);
  const rawReplies = repliesResponse?.data;
  const replies = Array.isArray(rawReplies) ? rawReplies : (Array.isArray(repliesResponse) ? repliesResponse : []);

  if (!isOpen) {
    return (
      <div 
        className="flex items-center gap-3 pl-6 py-3 cursor-pointer hover:bg-secondary/20 transition-colors group"
        onClick={() => setIsOpen(true)}
      >
        <span className="text-[15px] font-medium text-primary">Show replies</span>
      </div>
    );
  }

  if (isLoading) {
    return <div className="text-[15px] text-muted-foreground pl-6 py-3">Loading replies...</div>;
  }

  if (isDeep) {
    return (
      <div className="flex items-center gap-3 pl-6 py-3 cursor-pointer hover:bg-secondary/20 transition-colors group">
        <span className="text-[15px] font-medium text-primary">View in thread</span>
      </div>
    );
  }

  return (
    <div className="relative mt-2">
      <DiscussionThread comments={replies} level={level} entityId={entityId} entityType={entityType} />
    </div>
  );
}

function formatShortDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return `${diffInSeconds}s`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
  
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
