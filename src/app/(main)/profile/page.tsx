"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Calendar, Link as LinkIcon, MapPin, Grid, AlignLeft, Bookmark, Heart, Info, Search, FileText, Trophy, Activity } from "lucide-react";
import { PostCard, PostProps } from "@/components/feed/post-card";
import { ArticleCard, ArticleProps } from "@/components/feed/article-card";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { EditProfileModal, UserProfile } from "@/components/profile/edit-profile-modal";

const TABS = ["Posts", "Articles", "Saved", "Likes", "About"];

const MOCK_POSTS: PostProps[] = [
  {
    id: "1",
    user: { name: "Sarah Jenkins", username: "sarahj", discipline: "UX Research" },
    content: "Just wrapped up user testing for our new onboarding flow. Interesting insight: users actually preferred the 3-step wizard over the single long form because it felt less overwhelming. Iterating on the micro-copy next.",
    type: "Process Journal",
    tags: ["UX", "Research", "Onboarding"],
    createdAt: "6h ago",
    likes: 42,
    comments: 12,
    isLiked: true,
  },
  {
    id: "2",
    user: { name: "Sarah Jenkins", username: "sarahj", discipline: "UX Research" },
    content: "Debating between standard pagination and infinite scroll for a massive data table. What are the accessibility implications of infinite scroll if we don't have a footer?",
    type: "Question",
    tags: ["Accessibility", "DataGrid", "UX"],
    createdAt: "2d ago",
    likes: 18,
    comments: 34,
    isSaved: true,
  }
];

const MOCK_ARTICLES: ArticleProps[] = [
  {
    id: "a1",
    title: "Design Systems Don't Scale Because of Components",
    subtitle: "We spent 6 months building a comprehensive component library, only to realize our teams weren't using it because the underlying tokens were too rigid. Here's how we fixed it by pivoting to a semantic token architecture.",
    coverImage: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1000&auto=format&fit=crop",
    readingTime: "8 min read",
    publishedDate: "Oct 12, 2025",
    views: "2.3k",
    likes: 342,
    comments: 56,
    tags: ["Design Systems", "Architecture", "Tokens"],
    author: { name: "Sarah Jenkins", username: "sarahj" }
  },
  {
    id: "a2",
    title: "The Psychology of Friction in B2B SaaS Onboarding",
    subtitle: "Why making your product harder to sign up for can actually increase your long-term retention and customer lifetime value.",
    coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop",
    readingTime: "12 min read",
    publishedDate: "Sep 28, 2025",
    views: "8.9k",
    likes: 1205,
    comments: 184,
    tags: ["UX", "Psychology", "Onboarding", "B2B"],
    author: { name: "Sarah Jenkins", username: "sarahj" }
  }
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("Posts");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: "Sarah Jenkins",
    username: "sarahj",
    discipline: "UX Research",
    bio: "Staff Product Designer specializing in complex data visualization and accessible enterprise tools. Currently helping teams build scalable design systems.",
    location: "San Francisco, CA",
    website: "sarahjenkins.design"
  });

  return (
    <div className="w-full relative min-h-screen pb-24">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 relative pt-8 md:pt-12">
        
        {/* Profile Header Card */}
        <div className="surface rounded-3xl p-6 sm:p-8 relative mb-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-6">
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-secondary shadow-xl shrink-0">
              <Image 
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80"
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
              <span className="flex items-center gap-1.5"><Calendar size={16} /> Joined March 2025</span>
            </div>

            <div className="flex gap-6">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-foreground">14.2k</span>
                <span className="text-sm text-muted-foreground">Followers</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-foreground">842</span>
                <span className="text-sm text-muted-foreground">Following</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="surface p-5 rounded-2xl flex flex-col gap-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Trophy size={14} className="text-amber-500" /> Top Article
            </span>
            <span className="text-sm font-medium hover:text-primary cursor-pointer transition-colors leading-tight line-clamp-2">The Psychology of Friction in B2B SaaS Onboarding</span>
          </div>
          <div className="surface p-5 rounded-2xl flex flex-col gap-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Activity size={14} className="text-blue-500" /> Recent Activity
            </span>
            <span className="text-sm font-medium line-clamp-2">Replied to "Debating infinite scroll vs pagination..."</span>
          </div>
          <div className="surface p-5 rounded-2xl flex flex-col gap-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Search size={14} className="text-rose-500" /> Focus Areas
            </span>
            <div className="flex flex-wrap gap-2 mt-1">
              <span className="text-xs font-medium bg-secondary/50 px-2 py-1 rounded-md">UX</span>
              <span className="text-xs font-medium bg-secondary/50 px-2 py-1 rounded-md">Systems</span>
              <span className="text-xs font-medium bg-secondary/50 px-2 py-1 rounded-md">Accessibility</span>
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

        {/* Content Area */}
        <div className="w-full">
          {activeTab === "Posts" && (
            <div className="max-w-2xl mx-auto">
              {MOCK_POSTS.map(post => <PostCard key={post.id} post={post} />)}
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
                <Button variant="outline" size="sm" className="rounded-xl">Write Article</Button>
              </div>
              {MOCK_ARTICLES.map(article => <ArticleCard key={article.id} article={article} />)}
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
        onSave={setProfile} 
      />
    </div>
  );
}
