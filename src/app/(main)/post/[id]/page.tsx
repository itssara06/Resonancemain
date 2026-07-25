"use client";

import { use } from "react";
import { DiscussionSection } from "@/components/discussion/discussion-section";
import { CommentNode } from "@/components/discussion/types";
import { PostCard, PostProps } from "@/components/feed/post-card";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePost } from "@/hooks/usePosts";

// --- Deep Nested Mock Data Removed ---

export default function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const postId = unwrappedParams.id;
  
  const { data: postResponse, isLoading: loading } = usePost(postId);
  const rawPost = postResponse?.data?.post || postResponse?.data;

  if (loading) {
    return <div className="py-20 text-center text-muted-foreground">Loading post...</div>;
  }

  if (!rawPost) {
    return <div className="py-20 text-center text-muted-foreground">Post not found.</div>;
  }

  const post: PostProps = {
    id: rawPost.id,
    user: {
      name: rawPost.author?.displayName || rawPost.author?.username || 'Unknown User',
      username: rawPost.author?.username || 'unknown',
      avatarUrl: rawPost.author?.avatar || '',
      discipline: rawPost.author?.discipline || 'Designer',
    },
    content: rawPost.content,
    images: rawPost.media?.map((m: any) => m.url) || [],
    type: rawPost.visibility || 'Idea',
    tags: rawPost.hashtags?.map((h: any) => h.hashtag?.name) || [],
    createdAt: new Date(rawPost.createdAt).toLocaleDateString(),
    likes: rawPost._count?.likes || 0,
    comments: rawPost._count?.comments || 0,
    isLiked: rawPost.hasLiked || false,
    isSaved: rawPost.hasSaved || false,
  };

  return (
    <div className="w-full relative min-h-screen">
      
      {/* Sticky Back Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/40 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center">
          <Button variant="ghost" className="rounded-full px-4 -ml-4 hover:bg-secondary text-muted-foreground" onClick={() => router.back()}>
            <ChevronLeft size={18} className="mr-1" />
            Back to Feed
          </Button>
        </div>
      </div>

      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 pt-6 pb-24">
        
        {/* Original Post */}
        <PostCard post={post} />

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent my-2" />

        {/* Discussion Section */}
        <div className="mt-8">
          <DiscussionSection entityId={postId} entityType="POST" />
        </div>
        
      </div>
    </div>
  );
}
