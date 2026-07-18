"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Image as ImageIcon, AtSign, Hash, Code, List, Quote, Smile } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function DiscussionComposer({ placeholder = "Share your perspective..." }: { placeholder?: string }) {
  const [content, setContent] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`surface rounded-2xl transition-all duration-300 ${isExpanded ? 'ring-1 ring-primary/50 bg-secondary/20' : 'hover:border-foreground/20'}`}>
      <div className="p-4 sm:p-5">
        <div className="flex gap-4">
          <Avatar className="w-10 h-10 ring-1 ring-border shrink-0 mt-1">
            <AvatarFallback className="bg-secondary text-sm font-semibold">Me</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea 
              placeholder={placeholder}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              className={`min-h-[50px] resize-none bg-transparent border-none focus-visible:ring-0 px-0 text-base sm:text-lg placeholder:text-muted-foreground/60 transition-all duration-300 ${isExpanded ? 'min-h-[120px]' : ''}`}
            />
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 py-3 bg-secondary/30 border-t border-border/50 flex flex-wrap items-center justify-between gap-4 rounded-b-2xl animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-1 sm:gap-2">
            <IconButton icon={<ImageIcon size={18} />} tooltip="Image" />
            <div className="w-px h-5 bg-border mx-1" />
            <IconButton icon={<AtSign size={18} />} tooltip="Mention" />
            <IconButton icon={<Hash size={18} />} tooltip="Hashtag" />
            <div className="w-px h-5 bg-border mx-1" />
            <IconButton icon={<Quote size={18} />} tooltip="Quote" />
            <IconButton icon={<Code size={18} />} tooltip="Code Block" />
            <IconButton icon={<List size={18} />} tooltip="List" />
            <div className="w-px h-5 bg-border mx-1" />
            <IconButton icon={<Smile size={18} />} tooltip="Emoji" />
          </div>
          
          <div className="flex items-center gap-4 ml-auto">
            <span className="text-xs font-medium text-muted-foreground">
              {content.length} <span className="hidden sm:inline">characters</span>
            </span>
            <Button 
              disabled={content.trim().length === 0}
              className="rounded-full px-6 shadow-lg shadow-primary/20"
              onClick={() => {
                setContent("");
                setIsExpanded(false);
              }}
            >
              Reply
            </Button>
          </div>
        </div>
      )}
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
