"use client";

import { useState } from "react";
import { DiscussionComposer } from "./discussion-composer";
import { DiscussionThread } from "./discussion-thread";
import { CommentNode } from "./types";
import { MessageSquare, ArrowDownUp, CheckCircle2, Trophy, Clock, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useComments } from "@/hooks/useInteractions";

export function DiscussionSection({ entityId, entityType }: { entityId: string, entityType: string }) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: commentsResponse, isLoading } = useComments(entityType, entityId);
  const rawComments = commentsResponse?.data;
  const allComments = Array.isArray(rawComments) ? rawComments : (Array.isArray(commentsResponse) ? commentsResponse : []);
  const comments = allComments.filter((c: any) => !c.isDeleted);
  const totalCount = comments.length || 0;

  const displayComments = isAuthenticated ? comments : comments.slice(0, 1);

  return (
    <div className="w-full max-w-2xl mx-auto py-8">
      
      {/* Header */}
      <div className="mb-4 px-4 sm:px-0">
        <h2 className="text-xl font-bold tracking-tight">Replies</h2>
      </div>

      {/* Main Composer */}
      {isAuthenticated && (
        <div className="px-4 sm:px-0 mb-4 border-b border-border/40 pb-4">
          <DiscussionComposer placeholder="Post your reply" entityId={entityId} entityType={entityType} />
        </div>
      )}

      {/* The Nested Thread */}
      {displayComments.length > 0 ? (
        <div className="relative px-4 sm:px-0">
          <DiscussionThread comments={displayComments as any} level={0} entityId={entityId} entityType={entityType} />
          
          {!isAuthenticated && comments.length > 1 && (
            <div className="absolute bottom-0 left-0 w-full pt-32 pb-8 bg-gradient-to-t from-background via-background/90 to-transparent flex justify-center items-end pointer-events-none">
              <Button 
                onClick={() => router.push('/login')} 
                className="pointer-events-auto rounded-full font-medium shadow-xl px-8"
              >
                Sign in to view {comments.length - 1} more replies
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-20 mt-8">
          <MessageSquare size={40} className="mx-auto text-muted-foreground mb-3 opacity-30" />
          <h3 className="text-lg font-bold tracking-tight mb-2">No replies yet</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            {isAuthenticated ? "Be the first to share your thoughts." : "Sign in to start the discussion."}
          </p>
        </div>
      )}
      
    </div>
  );
}
