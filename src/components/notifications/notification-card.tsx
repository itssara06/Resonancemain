"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Heart, FileText, UserPlus, Star, Bookmark, Pin, MoreHorizontal, Check, Trash2, BellOff, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";

export type NotificationType = "reaction" | "reply" | "article_comment" | "mention" | "follow" | "helpful" | "pinned" | "bookmark" | "grouped_reaction" | "grouped_reply";

export interface NotificationProps {
  id: string;
  type: NotificationType;
  isUnread: boolean;
  time: string;
  actors: { name: string; username: string; avatarUrl?: string; discipline?: string }[];
  contentPreview?: string;
  targetTitle?: string;
}

export function NotificationCard({ notification, onRead }: { notification: NotificationProps, onRead: (id: string) => void }) {
  const [isRead, setIsRead] = useState(!notification.isUnread);
  const [isHovered, setIsHovered] = useState(false);

  const markRead = () => {
    setIsRead(true);
    onRead(notification.id);
  };

  const getIcon = () => {
    switch (notification.type) {
      case "reaction":
      case "grouped_reaction": return <Heart size={16} className="text-rose-500 fill-current" />;
      case "reply":
      case "grouped_reply": return <MessageSquare size={16} className="text-blue-500 fill-current" />;
      case "article_comment": return <FileText size={16} className="text-purple-500 fill-current" />;
      case "mention": return <span className="text-orange-500 font-bold text-lg">@</span>;
      case "follow": return <UserPlus size={16} className="text-emerald-500" />;
      case "helpful": return <Star size={16} className="text-amber-500 fill-current" />;
      case "pinned": return <Pin size={16} className="text-primary fill-current" />;
      case "bookmark": return <Bookmark size={16} className="text-indigo-500 fill-current" />;
    }
  };

  const primaryActor = notification.actors[0];
  const isGrouped = notification.actors.length > 1;

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={markRead}
      className={`relative surface p-4 sm:p-5 rounded-2xl mb-4 transition-all duration-300 cursor-pointer flex gap-4 overflow-hidden group
        ${!isRead ? 'bg-primary/5 border-primary/20 hover:border-primary/40' : 'hover:border-foreground/20'}
      `}
    >
      {/* Unread Indicator Bar */}
      {!isRead && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-2xl" />
      )}

      {/* Icon Column */}
      <div className="flex flex-col items-center gap-2 pt-1 shrink-0">
        <div className="w-8 h-8 rounded-full bg-background border border-border/50 flex items-center justify-center shadow-sm">
          {getIcon()}
        </div>
        {/* Avatars */}
        {isGrouped ? (
          <div className="flex -space-x-2 mt-1">
            {notification.actors.slice(0, 3).map((actor, i) => (
              <Avatar key={i} className="w-6 h-6 border-2 border-background">
                <AvatarImage src={actor.avatarUrl} />
                <AvatarFallback className="bg-secondary text-[8px]">{actor.name.charAt(0)}</AvatarFallback>
              </Avatar>
            ))}
          </div>
        ) : (
          <Avatar className="w-8 h-8 mt-1 border border-background shadow-sm">
            <AvatarImage src={primaryActor.avatarUrl} />
            <AvatarFallback className="bg-secondary text-[10px]">{primaryActor.name.charAt(0)}</AvatarFallback>
          </Avatar>
        )}
      </div>

      {/* Content Column */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-1.5 text-sm sm:text-base leading-tight mb-1">
          {isGrouped ? (
            <span className="font-semibold text-foreground">
              {primaryActor.name}, {notification.actors[1].name} <span className="font-normal text-muted-foreground">and {notification.actors.length - 2} others</span>
            </span>
          ) : (
            <>
              <span className="font-semibold text-foreground hover:underline">{primaryActor.name}</span>
              {primaryActor.discipline && (
                <span className="hidden sm:inline text-xs bg-secondary/50 text-muted-foreground px-2 py-0.5 rounded-full ml-1">
                  {primaryActor.discipline}
                </span>
              )}
            </>
          )}
          
          <span className="text-muted-foreground">
            {notification.type === "reaction" ? "reacted to your post" :
             notification.type === "grouped_reaction" ? "appreciated your post" :
             notification.type === "reply" ? "replied to your discussion" :
             notification.type === "grouped_reply" ? "replied to" :
             notification.type === "article_comment" ? "commented on your article" :
             notification.type === "mention" ? "mentioned you" :
             notification.type === "follow" ? "started following you" :
             notification.type === "helpful" ? "marked your reply as Helpful" :
             "interacted with you"}
          </span>
          
          {notification.targetTitle && (
            <span className="font-medium text-foreground italic">"{notification.targetTitle}"</span>
          )}
        </div>

        {/* Content Preview */}
        {notification.contentPreview && (
          <div className="mt-2 text-foreground/80 text-sm sm:text-[15px] leading-relaxed border-l-2 border-border/50 pl-3 italic line-clamp-2">
            "{notification.contentPreview}"
          </div>
        )}

        {/* Action Button & Time */}
        <div className="mt-3 flex items-center gap-4">
          {notification.type === "follow" ? (
            <Button size="sm" className="h-7 px-4 rounded-full text-xs">Follow Back</Button>
          ) : (
            <span className="text-xs font-medium text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              View Conversation <ArrowRight size={12} />
            </span>
          )}
          <span className="text-xs text-muted-foreground">{notification.time}</span>
        </div>
      </div>

      {/* Hover Actions (Desktop) & More Menu (Mobile) */}
      <div className="absolute right-4 top-4">
        {/* Desktop Quick Actions */}
        <div className={`hidden sm:flex items-center gap-1 bg-background/80 backdrop-blur-md border border-border/50 rounded-xl p-1 shadow-sm transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          {!isRead && (
            <ActionIcon icon={<Check size={14} />} tooltip="Mark as read" onClick={markRead} />
          )}
          <ActionIcon icon={<Trash2 size={14} />} tooltip="Delete" />
          <ActionIcon icon={<BellOff size={14} />} tooltip="Mute conversation" />
        </div>

        {/* Mobile More Menu */}
        <div className="sm:hidden">
          <Popover>
            <PopoverTrigger render={
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground bg-background/50" onClick={(e) => e.stopPropagation()}>
                <MoreHorizontal size={16} />
              </Button>
            } />
            <PopoverContent align="end" className="w-48 p-1 surface">
              {!isRead && (
                <MenuOption icon={<Check size={14} />} label="Mark as read" onClick={markRead} />
              )}
              <MenuOption icon={<Trash2 size={14} />} label="Delete notification" />
              <MenuOption icon={<BellOff size={14} />} label="Mute conversation" />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Unread Dot (Top Right) */}
      {!isRead && <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-primary rounded-full sm:hidden" />}
    </div>
  );
}

function ActionIcon({ icon, tooltip, onClick }: { icon: React.ReactNode, tooltip: string, onClick?: (e: React.MouseEvent) => void }) {
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary" 
      title={tooltip}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(e);
      }}
    >
      {icon}
    </Button>
  );
}

function MenuOption({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick?: (e: React.MouseEvent) => void }) {
  return (
    <button 
      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md transition-colors text-left"
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(e);
      }}
    >
      {icon}
      {label}
    </button>
  );
}
