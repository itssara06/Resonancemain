"use client";

import { useState } from "react";
import { PostCard, PostProps } from "@/components/feed/post-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Image as ImageIcon, Hash, Sparkles } from "lucide-react";

// Mock data for MVP UI
const MOCK_POSTS: PostProps[] = [
  {
    id: "1",
    user: {
      name: "Alex Rivera",
      username: "arivera",
      discipline: "Product Designer",
    },
    content: "Just wrapped up user testing for our new onboarding flow. Interesting insight: users actually preferred the 3-step wizard over the single long form because it felt less overwhelming. Iterating on the micro-copy next.",
    type: "Process Journal",
    tags: ["UX", "Research", "Onboarding"],
    createdAt: "2h ago",
    likes: 42,
    comments: 12,
    isLiked: true,
  },
  {
    id: "2",
    user: {
      name: "Sarah Chen",
      username: "schen_design",
      discipline: "UI/UX Designer",
    },
    content: "Exploring a dark mode dashboard concept for a fintech app. Trying to nail down the right elevation shadows and border colors for the glassmorphism effect. What do you think about using slightly tinted borders based on the brand color?",
    images: ["https://images.unsplash.com/photo-1618761714954-0b8cd0026356?auto=format&fit=crop&q=80&w=2000"],
    type: "Seeking Feedback",
    tags: ["UI", "Dark Mode", "Fintech"],
    createdAt: "4h ago",
    likes: 128,
    comments: 34,
    isSaved: true,
  },
  {
    id: "3",
    user: {
      name: "Marcus Volo",
      username: "marcusv",
      discipline: "Architecture",
    },
    content: "Is brutalism making a comeback in digital interfaces, or are we just getting tired of soft gradients? I feel like we're seeing more raw, unstyled-looking components lately. Thoughts?",
    type: "Design Debate",
    tags: ["Trends", "Brutalism", "UI"],
    createdAt: "5h ago",
    likes: 89,
    comments: 56,
  }
];

const POST_TYPES = [
  "Idea", "Work in Progress", "Seeking Feedback", 
  "Question", "Process Journal", "Design Debate"
];

export default function Home() {
  const [content, setContent] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeout(() => {
      setIsModalOpen(false);
      setContent("");
      setSelectedType(null);
    }, 500);
  };

  return (
    <div className="max-w-2xl mx-auto w-full pt-6 px-4 md:px-6">
      
      {/* Inline Composer */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger render={<div className="surface p-4 rounded-2xl mb-8 cursor-text hover:border-border transition-colors group" />}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-secondary border border-border flex items-center justify-center shrink-0">
                <span className="font-bold text-muted-foreground">Me</span>
              </div>
              <div className="flex-1 bg-secondary/30 group-hover:bg-secondary/50 transition-colors rounded-full px-4 py-3 text-muted-foreground text-[15px]">
                What's inspiring you today?
              </div>
            </div>
            
            <div className="flex items-center gap-4 px-2">
              <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
                <ImageIcon size={18} className="text-blue-500" />
                Photos
              </button>
              <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
                <Hash size={18} className="text-rose-500" />
                Tags
              </button>
              <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
                <Sparkles size={18} className="text-amber-500" />
                Post Type
              </button>
            </div>
          </DialogTrigger>

        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-border bg-background surface">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle className="text-xl">Create Post</DialogTitle>
            <DialogDescription className="sr-only">Create a new post on Resonance</DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handlePostSubmit} className="flex flex-col">
            <div className="px-6 pb-4">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-secondary border border-border flex items-center justify-center shrink-0">
                  <span className="font-bold text-muted-foreground text-sm">Me</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-foreground leading-tight">Jane Doe</span>
                  <span className="text-xs text-muted-foreground">Product Designer</span>
                </div>
              </div>

              <Textarea 
                placeholder="Share your creative process, ask for feedback, or spark a debate..."
                className="min-h-[150px] resize-none bg-transparent border-none focus-visible:ring-0 px-0 text-lg placeholder:text-muted-foreground/60"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={1000}
                autoFocus
              />
              
              <div className="flex justify-end pt-1">
                <span className="text-xs text-muted-foreground font-medium">
                  {content.length} / 1000
                </span>
              </div>
            </div>

            <div className="px-6 py-4 bg-secondary/10 border-t border-border/40">
              <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">Select Post Type</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {POST_TYPES.map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedType(type)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      selectedType === type 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-1">
                  <Button type="button" variant="ghost" size="icon" className="text-muted-foreground hover:text-blue-500 rounded-full">
                    <ImageIcon size={20} />
                  </Button>
                  <Button type="button" variant="ghost" size="icon" className="text-muted-foreground hover:text-rose-500 rounded-full">
                    <Hash size={20} />
                  </Button>
                </div>
                <Button 
                  type="submit" 
                  disabled={!content.trim() || !selectedType}
                  className="rounded-full px-6 font-medium shadow-lg"
                >
                  Post
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Tabs defaultValue="foryou" className="w-full mb-8">
        <TabsList className="w-full justify-start bg-transparent border-b border-border rounded-none p-0 h-auto mb-6 space-x-6">
          <TabsTrigger 
            value="foryou" 
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-1 py-3 text-base"
          >
            For You
          </TabsTrigger>
          <TabsTrigger 
            value="following" 
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-1 py-3 text-base"
          >
            Following
          </TabsTrigger>
          <TabsTrigger 
            value="latest" 
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-1 py-3 text-base"
          >
            Latest
          </TabsTrigger>
        </TabsList>
        <TabsContent value="foryou" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
          <div className="flex flex-col">
            {MOCK_POSTS.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="following" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
          <div className="py-20 text-center text-muted-foreground surface rounded-2xl">
            You aren't following anyone yet. Discover creators!
          </div>
        </TabsContent>
        <TabsContent value="latest" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
          <div className="flex flex-col">
            {MOCK_POSTS.slice().reverse().map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
