"use client";

import { use } from "react";
import { DiscussionSection } from "@/components/discussion/discussion-section";
import { CommentNode } from "@/components/discussion/types";
import { PostCard, PostProps } from "@/components/feed/post-card";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

// --- Deep Nested Mock Data ---
const MOCK_COMMENTS: CommentNode[] = [
  {
    id: "c1",
    user: { name: "Sarah Jenkins", username: "sarahj", discipline: "UX Research" },
    content: "We faced a similar issue while redesigning a healthcare dashboard.\n\nInstead of reducing data density, we introduced progressive disclosure which improved completion rates by 23%.",
    createdAt: "2h ago",
    isBestAnswer: true,
    reactions: { Insightful: 12, Helpful: 45, Interesting: 2, Agree: 8, Appreciate: 1 },
    replies: [
      {
        id: "c1-r1",
        user: { name: "Marcus Volo", username: "marcusv", discipline: "Architecture" },
        content: "Progressive disclosure is exactly what we use in complex architectural blueprints (layers). Great to see the cognitive overlap between our fields.",
        createdAt: "1h ago",
        reactions: { Insightful: 5, Helpful: 0, Interesting: 10, Agree: 4, Appreciate: 0 },
        userReactedWith: 'Insightful',
        replies: [
          {
            id: "c1-r1-r1",
            user: { name: "Elena Rostova", username: "elena_r", discipline: "Motion Design" },
            content: "You can even animate those layers coming in contextually based on scroll depth. It reduces the perceived complexity drastically.",
            createdAt: "45m ago",
            reactions: { Insightful: 0, Helpful: 0, Interesting: 0, Agree: 0, Appreciate: 3 },
            replies: [
              {
                id: "c1-r1-r1-r1",
                user: { name: "Alex Rivera", username: "arivera", discipline: "Product Designer" },
                content: "Do you have any examples of this? I'd love to see a prototype.",
                createdAt: "10m ago",
                reactions: { Insightful: 0, Helpful: 0, Interesting: 0, Agree: 0, Appreciate: 0 },
              }
            ]
          }
        ]
      },
      {
        id: "c1-r2",
        user: { name: "David Kim", username: "dkim_arch", discipline: "Product Management" },
        content: "Did the 23% completion rate sustain over time, or was it a novelty effect?",
        createdAt: "30m ago",
        reactions: { Insightful: 0, Helpful: 0, Interesting: 1, Agree: 0, Appreciate: 0 },
      }
    ]
  },
  {
    id: "c2",
    user: { name: "Tom Chen", username: "tomchen", discipline: "UI/UX Designer" },
    content: "I honestly think the current layout is fine. Users just need time to adapt to the new mental model. We shouldn't rush into a redesign just because of initial friction.",
    createdAt: "4h ago",
    reactions: { Insightful: 2, Helpful: 0, Interesting: 0, Agree: 15, Appreciate: 0 },
  }
];

const MOCK_POST: PostProps = {
  id: "1",
  user: {
    name: "Alex Rivera",
    username: "arivera",
    discipline: "Product Designer",
  },
  content: "Just wrapped up user testing for our new onboarding flow. Interesting insight: users actually preferred the 3-step wizard over the single long form because it felt less overwhelming. Iterating on the micro-copy next.",
  type: "Process Journal",
  tags: ["UX", "Research", "Onboarding"],
  createdAt: "6h ago",
  likes: 42,
  comments: 128,
  isLiked: true,
};

export default function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const unwrappedParams = use(params);

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
        <section className="mb-4">
          <PostCard post={MOCK_POST} />
        </section>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent my-2" />

        {/* Discussion Section */}
        <section>
          <DiscussionSection initialComments={MOCK_COMMENTS} totalCount={128} />
        </section>
        
      </div>
    </div>
  );
}
