"use client";

import { useState } from "react";
import { Check, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotificationCard, NotificationProps } from "@/components/notifications/notification-card";
import { NotificationSettings } from "@/components/notifications/settings-modal";
import { motion, AnimatePresence } from "framer-motion";

const FILTERS = ["All", "Unread", "Mentions", "Discussions", "Reactions", "Followers", "Articles"];

const MOCK_NOTIFICATIONS: NotificationProps[] = [
  {
    id: "n1",
    type: "reply",
    isUnread: true,
    time: "2 mins ago",
    actors: [{ name: "Sarah Jenkins", username: "sarahj", discipline: "UX Research", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80" }],
    contentPreview: "The hierarchy issue might actually come from the lack of negative space around the primary CTA.",
    targetTitle: "Why are SaaS dashboards still identical?"
  },
  {
    id: "n2",
    type: "grouped_reaction",
    isUnread: true,
    time: "15 mins ago",
    actors: [
      { name: "Marcus Chen", username: "marcus", discipline: "Architecture" },
      { name: "Elena Rostova", username: "elena" },
      { name: "David Kim", username: "david" },
      { name: "Jane Doe", username: "jane" },
      { name: "John Smith", username: "john" }
    ],
    contentPreview: "Design Systems are becoming too rigid.",
  },
  {
    id: "n3",
    type: "mention",
    isUnread: true,
    time: "1 hour ago",
    actors: [{ name: "Pablo Stanley", username: "pablo", avatarUrl: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80" }],
    contentPreview: "@alex I think you'd enjoy this perspective on semantic tokens.",
  },
  {
    id: "n4",
    type: "helpful",
    isUnread: false,
    time: "3 hours ago",
    actors: [{ name: "Julie Zhuo", username: "julie" }],
    contentPreview: "I completely agree about progressive disclosure...",
  },
  {
    id: "n5",
    type: "follow",
    isUnread: false,
    time: "5 hours ago",
    actors: [{ name: "BIG Architects", username: "big_arch", avatarUrl: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&q=80" }],
  },
  {
    id: "n6",
    type: "article_comment",
    isUnread: false,
    time: "1 day ago",
    actors: [{ name: "John Doe", username: "johndoe", discipline: "Frontend Engineer" }],
    contentPreview: "I loved your explanation of information hierarchy. It completely changed how I approach CSS Grid.",
    targetTitle: "Design Systems Don't Scale Because of Components"
  }
];

export default function NotificationsPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [notifications, setNotifications] = useState<NotificationProps[]>(MOCK_NOTIFICATIONS);

  const handleRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isUnread: false } : n));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isUnread: false })));
  };

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
      </div>
    </div>
  );
}
