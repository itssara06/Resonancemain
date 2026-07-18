"use client";

import { useState } from "react";
import { DiscussionComposer } from "./discussion-composer";
import { DiscussionThread } from "./discussion-thread";
import { CommentNode } from "./types";
import { MessageSquare, ArrowDownUp, CheckCircle2, Trophy, Clock, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function DiscussionSection({ initialComments, totalCount }: { initialComments: CommentNode[], totalCount: number }) {
  const [comments, setComments] = useState<CommentNode[]>(initialComments);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="w-full max-w-3xl mx-auto py-12">
      
      {/* Header & Insights */}
      <div className="mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight">Discussion</h2>
            <span className="text-sm font-medium bg-secondary text-muted-foreground px-2.5 py-0.5 rounded-full">
              {totalCount} Replies
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search discussion..." 
                className="w-full sm:w-64 h-10 pl-9 bg-secondary/30 border-border/50 rounded-lg text-sm focus-visible:ring-1 focus-visible:ring-primary"
              />
            </div>
            
            <button className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors surface px-3 py-2 rounded-lg">
              <ArrowDownUp size={16} />
              <span className="hidden sm:inline">Sort: Relevant</span>
            </button>
          </div>
        </div>

        {/* Discussion Insights Bar */}
        <div className="flex flex-wrap items-center gap-4 p-4 rounded-2xl bg-secondary/20 border border-border/50 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-primary" />
            <span className="text-muted-foreground">Most Helpful Response by <span className="font-semibold text-foreground">Sarah Jenkins</span></span>
          </div>
          <div className="w-px h-4 bg-border hidden sm:block" />
          <div className="flex items-center gap-2">
            <Trophy size={16} className="text-amber-500" />
            <span className="text-muted-foreground">Top Disciplines: <span className="font-medium text-foreground">UX, Architecture</span></span>
          </div>
          <div className="w-px h-4 bg-border hidden sm:block" />
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-blue-500" />
            <span className="text-muted-foreground">~4 min read</span>
          </div>
        </div>
      </div>

      {/* Start Discussion Composer */}
      <div className="mb-12">
        <DiscussionComposer placeholder="Start a discussion." />
      </div>

      {/* The Nested Thread */}
      {comments.length > 0 ? (
        <DiscussionThread comments={comments} level={0} />
      ) : (
        <div className="text-center py-20 surface rounded-3xl border-dashed border-border mt-8">
          <MessageSquare size={48} className="mx-auto text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-xl font-bold tracking-tight mb-2">Start the first discussion.</h3>
          <p className="text-muted-foreground max-w-sm mx-auto">
            Share your thoughts, ask questions, or help the creator improve their work.
          </p>
        </div>
      )}
      
    </div>
  );
}
