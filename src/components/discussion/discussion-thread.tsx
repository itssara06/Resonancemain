"use client";

import { useState } from "react";
import { CommentNode, ReactionType } from "./types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, MessageSquare, Bookmark, Link as LinkIcon, Flag, ChevronDown, ChevronRight, CheckCircle2 } from "lucide-react";
import { DiscussionComposer } from "./discussion-composer";
import { motion, AnimatePresence } from "framer-motion";

const REACTION_ICONS: Record<ReactionType, string> = {
  Insightful: "💡",
  Helpful: "🙌",
  Interesting: "🤔",
  Agree: "💯",
  Appreciate: "✨"
};

export function DiscussionThread({ comments, level = 0 }: { comments: CommentNode[], level?: number }) {
  if (!comments || comments.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      {comments.map((comment, index) => (
        <DiscussionNode key={comment.id} comment={comment} level={level} isLast={index === comments.length - 1} />
      ))}
    </div>
  );
}

function DiscussionNode({ comment, level, isLast }: { comment: CommentNode, level: number, isLast: boolean }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [activeReaction, setActiveReaction] = useState<ReactionType | undefined>(comment.userReactedWith);

  const hasReplies = comment.replies && comment.replies.length > 0;
  const isMaxLevel = level >= 2; // Level 0, 1, 2 = 3 levels deep

  const toggleReaction = (type: ReactionType) => {
    setActiveReaction(prev => prev === type ? undefined : type);
  };

  return (
    <div className="relative flex flex-col group/node">
      {/* Thread Line connecting nested replies */}
      {level > 0 && (
        <div className="absolute -left-6 sm:-left-8 top-12 bottom-0 w-px bg-border/40 group-hover/node:bg-border transition-colors z-0" />
      )}

      {isCollapsed ? (
        <div className="flex items-center gap-3 py-2 cursor-pointer opacity-70 hover:opacity-100 transition-opacity" onClick={() => setIsCollapsed(false)}>
          <Avatar className="w-6 h-6 grayscale">
            <AvatarImage src={comment.user.avatarUrl} />
            <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{comment.user.name}</span>
          <span className="text-xs text-muted-foreground">{comment.createdAt}</span>
          <span className="text-xs text-muted-foreground ml-2 italic">
            ({comment.replies?.length || 0} replies)
          </span>
          <ChevronRight size={16} className="text-muted-foreground" />
        </div>
      ) : (
        <div className={`relative z-10 bg-background/50 backdrop-blur-sm rounded-2xl border transition-colors duration-300 ${comment.isBestAnswer ? 'border-primary/40 bg-primary/5 shadow-sm' : 'border-border/30 hover:border-foreground/20'}`}>
          <div className="p-4 sm:p-5">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10 ring-1 ring-border shadow-sm cursor-pointer hover:ring-primary/50 transition-all">
                  <AvatarImage src={comment.user.avatarUrl} />
                  <AvatarFallback className="bg-secondary">{comment.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground tracking-tight hover:underline cursor-pointer">{comment.user.name}</span>
                    {comment.isBestAnswer && (
                      <span className="flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        <CheckCircle2 size={12} />
                        Most Helpful
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-full">{comment.user.discipline}</span>
                    <span className="text-xs text-muted-foreground">{comment.createdAt}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {hasReplies && (
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-secondary rounded-full" onClick={() => setIsCollapsed(true)}>
                    <ChevronDown size={16} />
                  </Button>
                )}
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-secondary rounded-full">
                  <MoreHorizontal size={16} />
                </Button>
              </div>
            </div>

            {/* Content (Simulating Rich Text Markdown) */}
            <div className="mb-4 pl-1 sm:pl-13 text-[15px] leading-relaxed text-foreground/90">
              {comment.content.split('\n\n').map((paragraph, i) => (
                <p key={i} className="mb-3 last:mb-0">{paragraph}</p>
              ))}
            </div>

            {/* Actions & Reactions */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 pl-1 sm:pl-13">
              {/* Reaction Pills */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {(Object.entries(comment.reactions) as [ReactionType, number][]).map(([type, count]) => {
                  if (count === 0 && activeReaction !== type) return null;
                  const isActive = activeReaction === type;
                  return (
                    <button 
                      key={type}
                      onClick={() => toggleReaction(type)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                        isActive 
                          ? 'border-primary/50 bg-primary/10 text-primary' 
                          : 'border-border/50 bg-secondary/30 text-muted-foreground hover:bg-secondary hover:text-foreground'
                      }`}
                    >
                      <span>{REACTION_ICONS[type]}</span>
                      <span>{isActive ? count + 1 : count}</span>
                    </button>
                  );
                })}
                {/* Generic React Button if empty */}
                {Object.values(comment.reactions).every(v => v === 0) && !activeReaction && (
                  <button className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border border-dashed border-border/50 text-muted-foreground hover:bg-secondary transition-colors">
                    React
                  </button>
                )}
              </div>

              <div className="w-px h-4 bg-border hidden sm:block" />

              {/* Standard Actions */}
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground font-medium rounded-full hover:bg-secondary" onClick={() => setIsReplying(!isReplying)}>
                  <MessageSquare size={14} className="mr-1.5" />
                  Reply
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground rounded-full hover:bg-secondary" title="Save">
                  <Bookmark size={14} />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground rounded-full hover:bg-secondary" title="Copy Link">
                  <LinkIcon size={14} />
                </Button>
              </div>
            </div>

            {/* Reply Composer */}
            <AnimatePresence>
              {isReplying && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden mt-4 pl-1 sm:pl-13"
                >
                  <DiscussionComposer placeholder={`Replying to ${comment.user.name}...`} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Nested Replies */}
      {!isCollapsed && hasReplies && (
        <div className="mt-3 pl-6 sm:pl-10">
          {isMaxLevel ? (
            <div className="flex items-center gap-2 pl-4 py-2 border-l-2 border-primary/30 cursor-pointer hover:bg-secondary/30 rounded-r-lg transition-colors group">
              <span className="text-sm font-medium text-primary">View {comment.replies?.length} more replies</span>
              <ChevronRight size={16} className="text-primary group-hover:translate-x-1 transition-transform" />
            </div>
          ) : (
            <DiscussionThread comments={comment.replies || []} level={level + 1} />
          )}
        </div>
      )}
    </div>
  );
}
