"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar, Link as LinkIcon, MapPin, Grid, AlignLeft, Bookmark, Heart, Info, Search, FileText, Trophy, Activity } from "lucide-react";
import { PostCard, PostProps } from "@/components/feed/post-card";
import { ArticleCard, ArticleProps } from "@/components/feed/article-card";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { EditProfileModal, UserProfile } from "@/components/profile/edit-profile-modal";
import { toast } from "sonner";

import { useAuthStore } from "@/store/useAuthStore";
import { useUserPosts, useUserProfile } from "@/hooks/useUsers";
import { useMyArticles } from "@/hooks/useArticles";

const TABS = ["Posts", "Articles", "Saved", "Likes", "About"];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("Posts");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { user, isAuthenticated } = useAuthStore();
  
  const { data: postsData, isLoading: loading } = useUserPosts(user?.username || "", 1, 10);
  const posts = postsData?.data || [];

  const { data: articlesData, isLoading: articlesLoading } = useMyArticles(1, 10);
  const articles = articlesData?.data || [];

  const { data: profileResponse, isLoading: profileLoading } = useUserProfile(user?.username || "");
  const serverProfile = profileResponse?.data?.profile || profileResponse?.data;

  const [profile, setProfile] = useState<UserProfile>({
    name: user?.name || "Unknown",
    username: user?.username || "unknown",
    discipline: user?.discipline || "Designer",
    bio: "",
    location: "",
    website: ""
  });

  useEffect(() => {
    if (serverProfile) {
      setProfile({
        name: serverProfile.displayName || serverProfile.name || "Unknown",
        username: serverProfile.username || "unknown",
        discipline: (serverProfile.disciplines && serverProfile.disciplines[0]) || serverProfile.discipline || "Designer",
        bio: serverProfile.bio || "No bio yet.",
        location: serverProfile.location || "Planet Earth",
        website: serverProfile.website || ""
      });
    }
  }, [serverProfile]);

  if (!isAuthenticated) {
    return <div className="p-20 text-center text-muted-foreground">Please log in to view your profile.</div>;
  }

  const mappedPosts: PostProps[] = posts.map((post: any) => ({
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

  const mappedArticles: ArticleProps[] = articles.map((article: any) => ({
    id: article.id,
    title: article.title || "Untitled Article",
    subtitle: article.content ? article.content.substring(0, 150) + "..." : "No description",
    coverImage: article.coverImage || "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1000&auto=format&fit=crop",
    readingTime: "5 min read", // Simplified
    publishedDate: new Date(article.createdAt).toLocaleDateString(),
    views: "0",
    likes: article.likesCount || 0,
    comments: article.commentsCount || 0,
    tags: article.tags || [],
    author: {
      name: article.user?.name || user?.name || "Unknown",
      username: article.user?.username || user?.username || "unknown"
    },
    isDraft: !article.published
  }));

  return (
    <div className="w-full relative min-h-screen pb-24">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 relative pt-8 md:pt-12">
        
        {/* Profile Header Card */}
        <div className="surface rounded-3xl p-6 sm:p-8 relative mb-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-6">
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-secondary shadow-xl shrink-0">
              <Image 
                src={serverProfile?.avatar || user?.avatarUrl || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80"}
                alt={profile.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex gap-3">
              <Button onClick={() => setIsEditModalOpen(true)} variant="outline" className="rounded-full px-6 font-medium">Edit Profile</Button>
              <Button className="rounded-full px-6 font-medium shadow-lg shadow-primary/20">Share</Button>
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">{profile.name}</h1>
            <p className="text-muted-foreground font-medium mb-4">@{profile.username} • <span className="text-primary bg-primary/10 px-2 py-0.5 rounded-full text-sm">{profile.discipline}</span></p>
            <p className="text-foreground/90 max-w-2xl leading-relaxed mb-6">
              {profile.bio}
            </p>

            <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-sm text-muted-foreground mb-8">
              <span className="flex items-center gap-1.5"><MapPin size={16} /> {profile.location}</span>
              <a href={`https://${profile.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-primary hover:underline"><LinkIcon size={16} /> {profile.website}</a>
              <span className="flex items-center gap-1.5"><Calendar size={16} /> Joined 2025</span>
            </div>

            <div className="flex gap-6">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-foreground">{serverProfile?._count?.followers || 0}</span>
                <span className="text-sm text-muted-foreground">Followers</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-foreground">{serverProfile?._count?.following || 0}</span>
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
                    layoutId="profileTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          <div className="relative group w-full md:w-64 shrink-0">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input placeholder={`Search ${activeTab.toLowerCase()}...`} className="pl-9 h-10 bg-secondary/30 border-border/50 rounded-xl" />
          </div>
        </div>

        {/* Content based on Active Tab */}
        <div className="mt-8">
          {activeTab === "Posts" && (
            <div className="flex flex-col">
              {loading ? (
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
            <div className="max-w-3xl mx-auto">
              <div className="mb-6 flex justify-between items-center surface p-4 rounded-2xl border-dashed">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg"><FileText size={20} className="text-primary" /></div>
                  <div>
                    <h3 className="font-semibold text-sm">Long-form writing</h3>
                    <p className="text-xs text-muted-foreground">Deep dives, case studies, and essays.</p>
                  </div>
                </div>
                <Link href="/articles/write">
                  <Button variant="outline" size="sm" className="rounded-xl">Write Article</Button>
                </Link>
              </div>
              {articlesLoading ? (
                <div className="py-10 text-center text-muted-foreground">Loading articles...</div>
              ) : mappedArticles.length === 0 ? (
                <div className="py-10 text-center text-muted-foreground">No articles yet.</div>
              ) : (
                mappedArticles.map(article => <ArticleCard key={article.id} article={article} />)
              )}
            </div>
          )}

          {(activeTab === "Saved" || activeTab === "Likes" || activeTab === "About") && (
            <div className="py-20 text-center surface rounded-3xl border-dashed">
              <Info size={48} className="mx-auto text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-xl font-bold tracking-tight mb-2">{activeTab}</h3>
              <p className="text-muted-foreground text-sm">This section is currently empty or hidden.</p>
            </div>
          )}
        </div>
      </div>
      <EditProfileModal 
        open={isEditModalOpen} 
        onOpenChange={setIsEditModalOpen} 
        profile={profile} 
        onSave={async (updatedProfile) => {
          try {
            const { updateProfile } = await import('@/api/users');
            await updateProfile({
              displayName: updatedProfile.name,
              username: updatedProfile.username,
              bio: updatedProfile.bio,
              website: updatedProfile.website,
              location: updatedProfile.location,
              disciplines: updatedProfile.discipline ? [updatedProfile.discipline] : []
            });
            
            setProfile(updatedProfile);
            toast.success("Profile updated successfully!");
            
            // Re-fetch user in store
            await useAuthStore.getState().fetchCurrentUser();
            // Force a reload so all queries invalidate
            window.location.reload();
          } catch (error: any) {
            console.error("Failed to update profile", error);
            toast.error(error.response?.data?.message || "Failed to update profile");
            throw error;
          }
        }} 
      />
    </div>
  );
}
