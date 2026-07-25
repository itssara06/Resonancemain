"use client";

import { useState, use } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Calendar, Link as LinkIcon, MapPin, FileText, Info } from "lucide-react";
import { PostCard, PostProps } from "@/components/feed/post-card";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useUserPosts, useUserProfile, useFollow } from "@/hooks/useUsers";

const TABS = ["Posts", "Articles", "About"];

export default function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const unwrappedParams = use(params);
  const usernameParam = unwrappedParams.username;
  
  const [activeTab, setActiveTab] = useState("Posts");
  
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  const { data: profileResponse, isLoading: profileLoading } = useUserProfile(usernameParam);
  const { data: postsResponse, isLoading: postsLoading } = useUserPosts(usernameParam, 1, 10);
  
  const profileResponseData = profileResponse?.data;
  const profile = profileResponseData?.profile || profileResponseData;

  const followMutation = useFollow();

  const handleFollowClick = () => {
    if (!isAuthenticated) {
      const currentPath = window.location.pathname;
      router.push(`/login?next=${encodeURIComponent(currentPath)}`);
    } else if (profile) {
      followMutation.mutate(profile.username);
    }
  };

  if (profileLoading) {
    return <div className="min-h-screen py-20 text-center text-muted-foreground">Loading profile...</div>;
  }

  if (!profile) {
    return (
      <div className="min-h-screen py-20 text-center flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-2">User not found</h2>
        <p className="text-muted-foreground mb-6">This profile doesn't exist or has been removed.</p>
        <Button onClick={() => router.push('/')} variant="outline" className="rounded-full">Back to Home</Button>
      </div>
    );
  }

  const posts: any[] = Array.isArray(postsResponse?.data) ? postsResponse.data : [];

  const mappedPosts: PostProps[] = posts.map(post => ({
    id: post.id,
    user: {
      name: post.author?.displayName || post.user?.displayName || post.author?.username || post.user?.username || 'Unknown',
      username: post.author?.username || post.user?.username || 'unknown',
      avatarUrl: post.author?.avatar || post.user?.avatar || post.user?.avatarUrl || '',
      discipline: post.author?.disciplines?.[0] || post.user?.disciplines?.[0] || post.user?.discipline || 'Designer',
    },
    content: post.content,
    images: post.images || [],
    type: post.type || 'Idea',
    tags: post.tags || [],
    createdAt: new Date(post.createdAt).toLocaleDateString(),
    likes: post.likesCount || 0,
    comments: post.commentsCount || 0,
    isLiked: post.isLiked || false,
    isSaved: post.isSaved || false,
  }));

  const displayName = profile.displayName || profile.name || "Unknown";
  const displayAvatar = profile.avatar || profile.avatarUrl;
  const displayDiscipline = (profile.disciplines && profile.disciplines[0]) || profile.discipline || 'Designer';

  return (
    <div className="w-full relative min-h-screen pb-24">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 relative pt-8 md:pt-12">
        
        {/* Profile Header Card */}
        <div className="surface rounded-3xl p-6 sm:p-8 relative mb-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-6">
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-secondary shadow-xl shrink-0">
              {displayAvatar ? (
                <Image src={displayAvatar} alt={displayName} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold text-3xl">
                  {displayName.charAt(0)}
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <Button onClick={handleFollowClick} disabled={followMutation.isPending} variant={profile.isFollowing ? "outline" : "default"} className={`rounded-full px-8 font-semibold ${profile.isFollowing ? '' : 'shadow-lg shadow-primary/20'}`}>
                {profile.isFollowing ? "Following" : "Follow"}
              </Button>
              <Button variant="outline" className="rounded-full px-6 font-medium">Share</Button>
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">{displayName}</h1>
            <p className="text-muted-foreground font-medium mb-4">@{profile.username} • <span className="text-primary bg-primary/10 px-2 py-0.5 rounded-full text-sm">{displayDiscipline}</span></p>
            <p className="text-foreground/90 max-w-2xl leading-relaxed mb-6">
              {profile.bio || "No bio yet."}
            </p>

            <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-sm text-muted-foreground mb-8">
              <span className="flex items-center gap-1.5"><MapPin size={16} /> {profile.location || "Planet Earth"}</span>
              {profile.website && (
                <a href={`https://${profile.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-primary hover:underline"><LinkIcon size={16} /> {profile.website}</a>
              )}
              <span className="flex items-center gap-1.5"><Calendar size={16} /> Joined recently</span>
            </div>

            <div className="flex gap-6">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-foreground">{profile._count?.followers || 0}</span>
                <span className="text-sm text-muted-foreground">Followers</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-foreground">{profile._count?.following || 0}</span>
                <span className="text-sm text-muted-foreground">Following</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 md:mb-6 sticky top-0 md:top-16 z-30 bg-background/80 backdrop-blur-xl py-3 border-b border-border/50">
          <div className="flex overflow-x-auto no-scrollbar gap-2">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-4 py-2.5 text-sm font-medium transition-colors whitespace-nowrap rounded-lg ${
                  activeTab === tab ? "text-foreground" : "text-muted-foreground hover:bg-secondary/50"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div 
                    layoutId="publicProfileTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content based on Active Tab */}
        <div className="mt-8">
          {activeTab === "Posts" && (
            <div className="flex flex-col">
              {postsLoading ? (
                <div className="py-10 text-center text-muted-foreground">Loading posts...</div>
              ) : mappedPosts.length === 0 ? (
                <div className="py-10 text-center text-muted-foreground">No posts yet.</div>
              ) : (
                mappedPosts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))
              )}
            </div>
          )}
          
          {activeTab === "Articles" && (
            <div className="py-20 text-center surface rounded-3xl border-dashed">
              <FileText size={48} className="mx-auto text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-xl font-bold tracking-tight mb-2">No articles</h3>
              <p className="text-muted-foreground text-sm">This user hasn't published any articles yet.</p>
            </div>
          )}

          {activeTab === "About" && (
            <div className="py-20 text-center surface rounded-3xl border-dashed">
              <Info size={48} className="mx-auto text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-xl font-bold tracking-tight mb-2">About {profile.name}</h3>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">{"No bio yet."}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
