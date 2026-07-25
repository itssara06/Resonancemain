"use client";

import { useState } from "react";
import { Check, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotificationCard, NotificationProps } from "@/components/notifications/notification-card";
import { NotificationSettings } from "@/components/notifications/settings-modal";
import { motion, AnimatePresence } from "framer-motion";
import { useNotifications, useMarkNotificationRead } from "@/hooks/useInteractions";
import { formatDistanceToNow } from "date-fns";

const FILTERS = ["All", "Unread", "Mentions", "Discussions", "Reactions", "Followers", "Articles"];

export default function NotificationsPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  
  const { data: notificationsData, isLoading } = useNotifications(1, 50);
  const { mutate: markReadMutation } = useMarkNotificationRead();

  const handleRead = (id: string) => {
    markReadMutation(id);
  };

  const markAllRead = () => {
    markReadMutation(undefined);
  };

  const rawNotifications = notificationsData?.data || [];
  
  const notifications: NotificationProps[] = rawNotifications.map(n => ({
    id: n.id,
    type: n.type === 'LIKE' ? 'reaction' :
          n.type === 'COMMENT' ? 'reply' :
          n.type === 'FOLLOW' ? 'follow' :
          n.type === 'MENTION' ? 'mention' : 'reaction',
    isUnread: !n.isRead,
    time: formatDistanceToNow(new Date(n.createdAt), { addSuffix: true }),
    actors: [{
      name: n.actor?.name || n.actor?.username || 'Unknown',
      username: n.actor?.username || 'unknown',
      avatarUrl: n.actor?.avatarUrl || '',
      discipline: n.actor?.discipline || 'Member',
    }],
    contentPreview: undefined, // Backend doesn't provide this directly yet, or we fetch entity
  }));

  // Basic filter logic (mock)
  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Unread") return n.isUnread;
    if (activeFilter === "Mentions") return n.type === "mention";
    if (activeFilter === "Followers") return n.type === "follow";
    if (activeFilter === "Articles") return n.type === "article_comment";
    if (activeFilter === "Reactions") return n.type.includes("reaction");
    if (activeFilter === "Discussions") return n.type.includes("reply");
    return true;
  });

  return (
    <div className="w-full relative min-h-screen bg-background pb-24">
      
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/40">
        <div className="max-w-3xl mx-auto px-4 py-4 sm:py-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={markAllRead} className="hidden sm:flex rounded-full text-xs h-8">
                <Check size={14} className="mr-1.5" /> Mark all read
              </Button>
              <NotificationSettings />
            </div>
          </div>
          
          {/* Scrollable Filters */}
          <div className="flex overflow-x-auto no-scrollbar gap-2 -mx-4 px-4 sm:mx-0 sm:px-0">
            {FILTERS.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`relative px-4 py-1.5 text-sm font-medium transition-colors whitespace-nowrap rounded-full border ${
                  activeFilter === filter 
                    ? "bg-foreground text-background border-foreground" 
                    : "bg-secondary/30 text-muted-foreground border-transparent hover:bg-secondary"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notification List */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6">
        {isLoading ? (
          <div className="py-24 text-center text-muted-foreground">Loading notifications...</div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <motion.div
                key={notification.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <NotificationCard 
                  notification={notification} 
                  onRead={handleRead}
                />
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-24 text-center surface rounded-3xl border-dashed border-border mt-8"
            >
              <BellOff size={48} className="mx-auto text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-xl font-bold tracking-tight mb-2">No notifications yet</h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                When people engage with your ideas, reply to your discussions, or read your articles, they'll appear here.
              </p>
            </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
