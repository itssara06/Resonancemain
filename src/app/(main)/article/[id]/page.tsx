"use client";

import { use, useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeft, Share2, Bookmark, Heart, MoreHorizontal, Clock, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DiscussionSection } from "@/components/discussion/discussion-section";

const MOCK_ARTICLE = {
  id: "a1",
  title: "Design Systems Don't Scale Because of Components",
  subtitle: "We spent 6 months building a comprehensive component library, only to realize our teams weren't using it because the underlying tokens were too rigid. Here's how we fixed it by pivoting to a semantic token architecture.",
  coverImage: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=2000&auto=format&fit=crop",
  readingTime: "8 min read",
  publishedDate: "Oct 12, 2025",
  views: "2.3k",
  likes: 342,
  tags: ["Design Systems", "Architecture", "Tokens"],
  author: { 
    name: "Sarah Jenkins", 
    username: "sarahj",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80",
    discipline: "Staff Product Designer"
  }
};

export default function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  
  const [readingProgress, setReadingProgress] = useState(0);
  const [activeToc, setActiveToc] = useState("introduction");

  // Calculate reading progress
  useEffect(() => {
    const updateScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollHeight = document.body.scrollHeight - window.innerHeight;
      if (scrollHeight) {
        setReadingProgress(Number((currentScrollY / scrollHeight).toFixed(4)) * 100);
      }
    };
    window.addEventListener("scroll", updateScroll);
    return () => window.removeEventListener("scroll", updateScroll);
  }, []);

  return (
    <div className="w-full relative min-h-screen bg-background text-foreground">
      
      {/* Top Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-primary z-50 transition-all duration-150 ease-out"
        style={{ width: `${readingProgress}%` }}
      />

      {/* Navigation Header */}
      <div className="sticky top-0 z-40 bg-background/90 backdrop-blur-xl border-b border-border/40 px-4 py-3">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between">
          <Button variant="ghost" className="rounded-full px-4 -ml-4 hover:bg-secondary text-muted-foreground" onClick={() => router.back()}>
            <ChevronLeft size={18} className="mr-1" />
            Back
          </Button>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-secondary text-muted-foreground"><Heart size={18} /></Button>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-secondary text-muted-foreground"><Bookmark size={18} /></Button>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-secondary text-muted-foreground"><Share2 size={18} /></Button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 mt-8 mb-12">
        <div className="max-w-[720px] mx-auto mb-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6">{MOCK_ARTICLE.title}</h1>
          <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed mb-8">{MOCK_ARTICLE.subtitle}</p>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 py-6 border-y border-border/50">
            <div className="flex items-center gap-4">
              <Avatar className="w-12 h-12">
                <AvatarImage src={MOCK_ARTICLE.author.avatarUrl} />
                <AvatarFallback>{MOCK_ARTICLE.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-semibold text-foreground text-lg">{MOCK_ARTICLE.author.name}</span>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{MOCK_ARTICLE.publishedDate}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Clock size={14} /> {MOCK_ARTICLE.readingTime}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Eye size={14} /> {MOCK_ARTICLE.views}</span>
                </div>
              </div>
            </div>
            <Button className="rounded-full px-6 shadow-lg shadow-primary/20">Follow</Button>
          </div>
        </div>

        {/* Huge Bleed Image */}
        <div className="relative w-full aspect-[21/9] rounded-2xl sm:rounded-[32px] overflow-hidden bg-secondary mb-16 shadow-2xl">
          <Image src={MOCK_ARTICLE.coverImage} alt="Cover" fill className="object-cover" priority />
        </div>
      </div>

      {/* Content Layout Grid (TOC + Article) */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 flex items-start gap-12 relative pb-24">
        
        {/* Sticky Table of Contents (Desktop only) */}
        <aside className="hidden lg:block sticky top-24 w-64 shrink-0 pr-8">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">In this article</span>
            <TocItem id="introduction" label="Introduction" active={activeToc === "introduction"} onClick={setActiveToc} />
            <TocItem id="the-problem" label="The Problem with Components" active={activeToc === "the-problem"} onClick={setActiveToc} />
            <TocItem id="semantic-tokens" label="Enter Semantic Tokens" active={activeToc === "semantic-tokens"} onClick={setActiveToc} />
            <TocItem id="migration" label="Migration Strategy" active={activeToc === "migration"} onClick={setActiveToc} />
            <TocItem id="conclusion" label="Conclusion" active={activeToc === "conclusion"} onClick={setActiveToc} />
          </div>
        </aside>

        {/* Editorial Content (720px width) */}
        <article className="w-full max-w-[720px] mx-auto prose prose-neutral dark:prose-invert prose-lg prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary">
          <p>
            When we first started scaling our design team, we thought the holy grail was a massive, highly configurable React component library. If every designer had a 1-to-1 match in Figma for what the developers were using in code, everything would be perfect, right?
          </p>
          <p>
            Wrong. Fast forward six months, and we had an adoption rate of barely 40%. The issue wasn't that the components were broken; the issue was that they were too rigid for the reality of product design.
          </p>
          
          <h2>The Problem with Components</h2>
          <p>
            Components inherently couple layout, logic, and styling. When a product designer needed a card that looked like our standard card but had slightly different padding to accommodate a new data visualization, they couldn't use the standard component. They detached the instance in Figma, and the developers wrote custom CSS to match it.
          </p>
          
          <blockquote className="border-l-4 border-primary pl-6 italic text-xl my-10 text-muted-foreground">
            "We were optimizing for consistency at the expense of flexibility, and in a fast-moving startup, flexibility always wins."
          </blockquote>

          <h2>Enter Semantic Tokens</h2>
          <p>
            The breakthrough came when we stopped trying to force everyone to use the same LEGO blocks, and instead just gave everyone the same colors of plastic. We shifted our focus entirely to <strong>Semantic Design Tokens</strong>.
          </p>
          
          <pre className="bg-secondary/50 p-6 rounded-2xl overflow-x-auto text-sm border border-black/5 dark:border-white/5 my-8">
            <code>
{`// Bad: Hardcoded or generic tokens
--color-blue-500: #3b82f6;

// Good: Semantic tokens
--color-surface-danger: #fee2e2;
--color-text-danger: #ef4444;
--border-radius-card: 16px;`}
            </code>
          </pre>
          
          <p>
            By defining tokens semantically (e.g., <code>surface-elevated</code>, <code>text-muted</code>, <code>space-section</code>), designers could build custom layouts that still felt 100% on-brand and mathematically aligned with our system, without being locked into a specific React component's prop API.
          </p>

          <h2>Conclusion</h2>
          <p>
            Design systems are about creating a shared language. Sometimes, words (tokens) are much more expressive and scalable than pre-written sentences (components). 
          </p>

          <div className="flex flex-wrap gap-2 mt-12 mb-8">
            {MOCK_ARTICLE.tags.map(tag => (
              <span key={tag} className="text-sm font-medium bg-secondary/50 px-3 py-1.5 rounded-lg border border-black/5 dark:border-white/5">#{tag}</span>
            ))}
          </div>

          <div className="w-full h-px bg-border my-12" />
        </article>
      </div>

      {/* Discussion Section at the bottom */}
      <div className="bg-secondary/10 border-t border-border/50">
        <DiscussionSection initialComments={[]} totalCount={0} />
      </div>

    </div>
  );
}

function TocItem({ id, label, active, onClick }: { id: string, label: string, active: boolean, onClick: (id: string) => void }) {
  return (
    <button 
      onClick={() => onClick(id)}
      className={`text-left text-sm py-2 pl-4 border-l-2 transition-colors ${
        active 
          ? "border-primary text-foreground font-medium" 
          : "border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
      }`}
    >
      {label}
    </button>
  );
}
