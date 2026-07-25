"use client";

import { useState, useEffect } from "react";
import { PostCard, PostProps } from "@/components/feed/post-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Image as ImageIcon, Hash, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { usePosts, useCreatePost } from "@/hooks/usePosts";

const POST_TYPES = [
  "Idea", "Work in Progress", "Seeking Feedback", 
  "Question", "Process Journal", "Design Debate"
];

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [content, setContent] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  const { data: postsData, isLoading: loading } = usePosts();
  const createPostMutation = useCreatePost();
  const rawPosts = postsData?.data;
  const posts = Array.isArray(rawPosts) ? rawPosts : (Array.isArray(postsData) ? postsData : []);

  useEffect(() => {
    const handleScroll = () => {
      if (!isAuthenticated && window.scrollY > 400) {
        setShowBanner(true);
      } else {
        setShowBanner(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isAuthenticated]);

  const handleRequireAuth = (callback: () => void) => {
    if (isAuthenticated) {
      callback();
    } else {
      router.push('/login');
    }
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return;

    createPostMutation.mutate({
      content,
      type: selectedType || 'Idea',
      images: [],
      tags: [],
    }, {
      onSuccess: () => {
        setIsModalOpen(false);
        setContent("");
        setSelectedType(null);
      }
    });
  };

  // Convert API Post type to PostCard PostProps
  const mappedPosts: PostProps[] = posts.map(post => ({
    id: post.id,
    user: {
      name: post.author?.displayName || post.author?.username || 'Unknown User',
      username: post.author?.username || 'unknown',
      avatarUrl: post.author?.avatar || '',
      discipline: post.author?.disciplines?.[0] || 'Designer',
    },
    content: post.content,
    images: post.media?.map((m: any) => m.url) || [],
    type: post.visibility || 'Idea',
    tags: post.hashtags?.map((h: any) => h.hashtag?.name) || [],
    createdAt: new Date(post.createdAt).toLocaleDateString(),
    likes: post._count?.likes || 0,
    comments: post._count?.comments || 0,
    isLiked: post.hasLiked || false,
    isSaved: post.hasSaved || false,
  }));

  return (
    <div className="max-w-2xl mx-auto w-full pt-6 px-4 md:px-6">
      
      {/* Composer or CTA */}
      {isAuthenticated ? (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <div onClick={() => handleRequireAuth(() => setIsModalOpen(true))} className="surface p-4 rounded-2xl mb-8 cursor-text hover:border-border transition-colors group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-secondary border border-border flex items-center justify-center shrink-0">
                  <span className="font-bold text-muted-foreground">{user?.name?.charAt(0) || 'U'}</span>
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
            </div>

          <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-border bg-background surface">
            <DialogHeader className="px-6 pt-6 pb-2">
              <DialogTitle className="text-xl">Create Post</DialogTitle>
              <DialogDescription className="sr-only">Create a new post on Resonance</DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handlePostSubmit} className="flex flex-col">
              <div className="px-6 pb-4">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-secondary border border-border flex items-center justify-center shrink-0">
                    <span className="font-bold text-muted-foreground text-sm">{user?.name?.charAt(0) || 'U'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-foreground leading-tight">{user?.name}</span>
                    <span className="text-xs text-muted-foreground">{user?.discipline || 'Designer'}</span>
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
                    disabled={!content.trim() || !selectedType || createPostMutation.isPending}
                    className="rounded-full px-6 font-medium shadow-lg"
                  >
                    {createPostMutation.isPending ? 'Posting...' : 'Post'}
                  </Button>
                </div>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      ) : (
        <div className="surface p-6 sm:p-8 rounded-3xl mb-8 border-primary/20 bg-primary/5 text-center flex flex-col items-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">Join Resonance</h2>
          <p className="text-muted-foreground max-w-md mb-6 leading-relaxed">
            Share your design journey, publish articles, connect with designers, and inspire the community.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button onClick={() => router.push('/login')} className="rounded-full px-8 py-6 text-base shadow-lg font-semibold w-full sm:w-auto">
              Sign In
            </Button>
            <Button onClick={() => router.push('/login')} variant="outline" className="rounded-full px-8 py-6 text-base font-semibold w-full sm:w-auto bg-background/50 backdrop-blur-sm">
              Create Account
            </Button>
          </div>
        </div>
      )}

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
        </TabsContent>
        <TabsContent value="following" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
          <div className="py-20 text-center text-muted-foreground surface rounded-2xl">
            You aren't following anyone yet. Discover creators!
          </div>
        </TabsContent>
        <TabsContent value="latest" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
          <div className="flex flex-col">
            {mappedPosts.slice().reverse().map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Guest Scroll Banner */}
      {showBanner && !isAuthenticated && (
        <div className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-lg bg-background/90 backdrop-blur-xl border border-primary/20 p-4 rounded-2xl shadow-2xl z-50 animate-in slide-in-from-bottom-10 fade-in duration-300 flex flex-col sm:flex-row items-center gap-4 justify-between">
          <div className="flex-1 text-center sm:text-left">
            <h4 className="font-semibold text-foreground text-sm">See more inspiration</h4>
            <p className="text-xs text-muted-foreground">Join Resonance to interact with the community.</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button onClick={() => router.push('/login')} variant="outline" size="sm" className="w-full sm:w-auto rounded-full font-medium">Log In</Button>
            <Button onClick={() => router.push('/login')} size="sm" className="w-full sm:w-auto rounded-full font-medium shadow-lg">Sign Up</Button>
          </div>
        </div>
      )}
    </div>
  );
}
