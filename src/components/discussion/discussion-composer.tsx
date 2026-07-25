"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Image as ImageIcon, AtSign, Hash, Code, List, Quote, Smile } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useAddComment } from "@/hooks/useInteractions";

export function DiscussionComposer({ 
  placeholder = "Post your reply",
  entityId,
  entityType,
  parentId,
  autoFocus = false
}: { 
  placeholder?: string,
  entityId: string,
  entityType: string,
  parentId?: string,
  autoFocus?: boolean
}) {
  const [content, setContent] = useState("");
  const [isExpanded, setIsExpanded] = useState(autoFocus);
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const { mutate: addComment, isPending } = useAddComment();
  
  const requireAuth = (callback: () => void) => {
    if (isAuthenticated) callback();
    else router.push('/login');
  };

  return (
    <div className="w-full bg-transparent flex gap-3 sm:gap-4 py-2">
      <div className="flex flex-col items-center shrink-0 w-10">
        <Avatar className="w-10 h-10 ring-1 ring-border/50 shrink-0 mt-1">
          <AvatarFallback className="bg-secondary text-sm font-semibold">Me</AvatarFallback>
        </Avatar>
      </div>
      
      <div className="flex-1 min-w-0">
        <Textarea 
          placeholder={placeholder}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onFocus={() => requireAuth(() => setIsExpanded(true))}
          autoFocus={autoFocus}
          className={`w-full min-h-[50px] resize-none bg-transparent border-none focus-visible:ring-0 px-0 text-[15px] sm:text-lg placeholder:text-muted-foreground/60 transition-all duration-300 ${isExpanded ? 'min-h-[100px]' : 'min-h-[50px]'}`}
        />

        {isExpanded && (
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-border/40 animate-in fade-in slide-in-from-top-2 duration-300 mt-2">
            <div className="flex items-center gap-1 sm:gap-2 -ml-2 text-primary">
              <IconButton icon={<ImageIcon size={18} />} tooltip="Media" />
              <IconButton icon={<Smile size={18} />} tooltip="Emoji" />
            </div>
            
            <div className="flex items-center gap-4 ml-auto">
              {content.length > 0 && (
                <span className="text-xs font-medium text-muted-foreground">
                  {content.length}
                </span>
              )}
              <Button 
                disabled={content.trim().length === 0 || isPending}
                className="rounded-full px-5 py-1.5 h-auto shadow-sm"
                onClick={() => {
                  if (content.trim()) {
                    addComment({ entityType, entityId, content, parentId }, {
                      onSuccess: () => {
                        setContent("");
                        setIsExpanded(false);
                      }
                    });
                  }
                }}
              >
                {isPending ? "Posting..." : "Reply"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function IconButton({ icon, tooltip }: { icon: React.ReactNode; tooltip: string }) {
  return (
    <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-md" title={tooltip}>
      {icon}
    </Button>
  );
}
