"use client";

import { useState } from "react";
import { Search, Flame, MessageSquare, TrendingUp, Hash, Users, Compass } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostCard, PostProps } from "@/components/feed/post-card";
import { motion, AnimatePresence } from "framer-motion";

// --- MOCK DATA ---
const TRENDING_TAGS = [
  "UX", "Architecture", "ProductDesign", "IndustrialDesign", 
  "GraphicDesign", "Typography", "BrandIdentity", "Accessibility", 
  "MotionDesign", "InteractionDesign", "CreativeCoding", "AI", "DesignSystems"
];

const DISCUSSIONS = [
  { id: 1, title: "Why are most SaaS dashboards still visually identical?", comments: 328, hot: true },
  { id: 2, title: "Parametric architecture is becoming repetitive.", comments: 421, hot: false },
  { id: 3, title: "Is minimalism making every product look the same?", comments: 291, hot: true },
  { id: 4, title: "Accessibility shouldn't be an afterthought.", comments: 183, hot: false }
];

const DESIGNERS = [
  { id: "1", name: "Julie Zhuo", username: "julie", discipline: "Product Design", followers: "245k", avatar: "J" },
  { id: "2", name: "Pablo Stanley", username: "pablostanley", discipline: "Illustration", followers: "128k", avatar: "P" },
  { id: "3", name: "BIG Architects", username: "big_builds", discipline: "Architecture", followers: "890k", avatar: "B" },
  { id: "4", name: "IDEO", username: "ideo", discipline: "Industrial Design", followers: "500k", avatar: "I" },
  { id: "5", name: "Pentagram", username: "pentagram", discipline: "Brand Identity", followers: "340k", avatar: "P" }
];

const DISCIPLINES = [
  { name: "UI/UX", color: "from-blue-500/20 to-blue-500/5", border: "border-blue-500/20" },
  { name: "Architecture", color: "from-amber-500/20 to-amber-500/5", border: "border-amber-500/20" },
  { name: "Product Design", color: "from-purple-500/20 to-purple-500/5", border: "border-purple-500/20" },
  { name: "Graphic Design", color: "from-rose-500/20 to-rose-500/5", border: "border-rose-500/20" },
  { name: "Industrial Design", color: "from-emerald-500/20 to-emerald-500/5", border: "border-emerald-500/20" },
  { name: "Motion Design", color: "from-cyan-500/20 to-cyan-500/5", border: "border-cyan-500/20" }
];

const SUGGESTED_POSTS: PostProps[] = [
  {
    id: "101",
    user: { name: "Elena Rostova", username: "elena_r", discipline: "Motion Design" },
    content: "Experimenting with spring animations in Framer Motion. The difference between stiffness 100 vs 300 completely changes the personality of the UI component.",
    type: "Work in Progress",
    tags: ["Motion", "React", "FramerMotion"],
    createdAt: "1h ago",
    likes: 312,
    comments: 45
  },
  {
    id: "102",
    user: { name: "David Kim", username: "dkim_arch", discipline: "Architecture" },
    content: "A study on light and shadow for the new library proposal. We are trying to maximize natural light during the winter months without causing glare.",
    images: ["https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=2000"],
    type: "Process Journal",
    tags: ["Architecture", "Lighting", "PublicSpace"],
    createdAt: "3h ago",
    likes: 890,
    comments: 112
  }
];

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const isSearching = searchQuery.length > 0;

  return (
    <div className="flex flex-col w-full min-h-screen relative">
      {/* Sticky Search Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/40 px-4 md:px-8 py-4">
        <div className="max-w-4xl mx-auto relative group">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search designers, posts, hashtags, discussions..." 
            className="w-full h-14 pl-12 pr-4 bg-secondary/30 border-border/50 rounded-2xl text-lg focus-visible:ring-1 focus-visible:ring-primary shadow-sm"
          />
        </div>
      </div>

      <div className="flex-1 w-full max-w-4xl mx-auto px-4 md:px-8 py-8">
        <AnimatePresence mode="wait">
          {isSearching ? (
            <motion.div 
              key="search-results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <SearchResults query={searchQuery} />
            </motion.div>
          ) : (
            <motion.div 
              key="default-explore"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-14"
            >
              {/* Trending Today (Chips) */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={20} className="text-primary" />
                  <h2 className="text-lg font-semibold tracking-tight">Trending Today</h2>
                </div>
                <div className="flex overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 gap-3 no-scrollbar scroll-smooth">
                  {TRENDING_TAGS.map(tag => (
                    <button key={tag} className="whitespace-nowrap px-4 py-2 rounded-full surface border-border/50 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors">
                      #{tag}
                    </button>
                  ))}
                </div>
              </section>

              {/* Trending Discussions */}
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <Flame size={20} className="text-rose-500" />
                  <h2 className="text-xl font-bold tracking-tight">Trending Discussions</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {DISCUSSIONS.map(discussion => (
                    <motion.div 
                      key={discussion.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="surface p-6 rounded-2xl cursor-pointer hover:border-foreground/20 transition-colors group"
                    >
                      <h3 className="text-lg font-semibold leading-snug mb-4 group-hover:text-primary transition-colors">
                        {discussion.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                        <MessageSquare size={16} />
                        {discussion.comments} comments
                        {discussion.hot && <span className="ml-2 text-xs bg-rose-500/20 text-rose-500 px-2 py-0.5 rounded-full">Hot</span>}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* Suggested Designers Carousel */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Users size={20} className="text-blue-500" />
                    <h2 className="text-xl font-bold tracking-tight">Suggested Designers</h2>
                  </div>
                  <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                    See All →
                  </button>
                </div>
                <div className="flex overflow-x-auto pb-6 -mx-4 px-4 md:mx-0 md:px-0 gap-4 no-scrollbar">
                  {DESIGNERS.map(designer => (
                    <DesignerCard key={designer.id} designer={designer} />
                  ))}
                </div>
              </section>

              {/* Discover by Discipline (Bento) */}
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <Compass size={20} className="text-amber-500" />
                  <h2 className="text-xl font-bold tracking-tight">Discover by Discipline</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
                  {DISCIPLINES.map(disc => (
                    <motion.div 
                      key={disc.name}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className={`relative overflow-hidden h-24 md:h-32 rounded-2xl bg-gradient-to-br ${disc.color} border ${disc.border} flex items-center justify-center p-4 cursor-pointer group`}
                    >
                      <div className="absolute inset-0 bg-background/50 group-hover:bg-transparent transition-colors duration-300" />
                      <span className="relative z-10 font-bold text-center text-foreground/90 group-hover:text-foreground group-hover:scale-110 transition-all duration-300">
                        {disc.name}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* Suggested Posts */}
              <section>
                <h2 className="text-xl font-bold tracking-tight mb-6">Suggested For You</h2>
                <div className="flex flex-col gap-6">
                  {SUGGESTED_POSTS.map(post => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// --- Subcomponents ---

function DesignerCard({ designer }: { designer: any }) {
  const [isFollowing, setIsFollowing] = useState(false);

  return (
    <div className="surface min-w-[240px] p-6 rounded-2xl flex flex-col items-center text-center shrink-0">
      <div className="w-20 h-20 rounded-full bg-secondary border-2 border-background mb-4 flex items-center justify-center shadow-lg">
        <span className="text-2xl font-bold text-muted-foreground">{designer.avatar}</span>
      </div>
      <h3 className="font-bold text-lg leading-tight">{designer.name}</h3>
      <p className="text-sm text-muted-foreground mb-1">@{designer.username}</p>
      <div className="text-xs font-medium px-2 py-1 bg-secondary/50 rounded-full mb-3 text-muted-foreground">
        {designer.discipline}
      </div>
      <p className="text-xs font-medium text-muted-foreground mb-4">{designer.followers} followers</p>
      
      <Button 
        variant={isFollowing ? "outline" : "default"}
        className={`w-full rounded-xl transition-all duration-300 ${isFollowing ? 'bg-transparent text-foreground border-border' : ''}`}
        onClick={() => setIsFollowing(!isFollowing)}
      >
        {isFollowing ? 'Following ✓' : 'Follow'}
      </Button>
    </div>
  );
}

function SearchResults({ query }: { query: string }) {
  return (
    <div className="w-full">
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full justify-start bg-transparent border-b border-border rounded-none p-0 h-auto mb-8 space-x-6 overflow-x-auto no-scrollbar">
          {["All", "People", "Posts", "Hashtags", "Disciplines", "Communities"].map(tab => (
            <TabsTrigger 
              key={tab}
              value={tab.toLowerCase()} 
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-1 py-3 text-sm md:text-base whitespace-nowrap"
            >
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          <div className="py-20 text-center surface rounded-2xl">
            <h3 className="text-lg font-medium mb-2">Searching for "{query}"</h3>
            <p className="text-muted-foreground">Showing simulated live results across all categories.</p>
          </div>
        </TabsContent>
        {/* Other tabs omitted for brevity, they would filter the same mock results */}
      </Tabs>
    </div>
  );
}
