"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Settings, Bell, Mail, Smartphone } from "lucide-react";

export function NotificationSettings() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:bg-secondary">
          <Settings size={20} />
        </Button>
      } />
      <DialogContent className="sm:max-w-[425px] surface border-black/10 dark:border-white/10 p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b border-border/50">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Bell size={20} className="text-primary" />
            Notification Settings
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Activity Types</h4>
            <SettingToggle label="Reactions" description="Likes, Helpfuls, and Insights" defaultOn />
            <SettingToggle label="Replies & Discussions" description="When someone replies to you" defaultOn />
            <SettingToggle label="Mentions" description="When you are @tagged" defaultOn />
            <SettingToggle label="New Followers" description="When someone follows you" defaultOn />
            <SettingToggle label="Article Comments" description="Comments on your long-form writing" defaultOn />
          </div>

          <div className="w-full h-px bg-border/50" />

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Delivery</h4>
            <SettingToggle label="Email Notifications" description="Daily digest and critical mentions" icon={<Mail size={16} />} />
            <SettingToggle label="Push Notifications" description="Real-time alerts on mobile" icon={<Smartphone size={16} />} defaultOn />
          </div>
        </div>
        
        <div className="p-4 bg-secondary/30 border-t border-border/50 flex justify-end">
          <Button onClick={() => setOpen(false)} className="rounded-full px-6 shadow-lg shadow-primary/20">Save Preferences</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SettingToggle({ label, description, defaultOn = false, icon }: { label: string, description: string, defaultOn?: boolean, icon?: React.ReactNode }) {
  const [isOn, setIsOn] = useState(defaultOn);
  
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex flex-col">
        <span className="text-sm font-medium text-foreground flex items-center gap-2">
          {icon && <span className="text-muted-foreground">{icon}</span>}
          {label}
        </span>
        <span className="text-xs text-muted-foreground">{description}</span>
      </div>
      <button 
        onClick={() => setIsOn(!isOn)}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${isOn ? 'bg-primary' : 'bg-secondary border border-border'}`}
      >
        <span className="sr-only">Toggle {label}</span>
        <span className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isOn ? 'translate-x-2' : '-translate-x-2 bg-muted-foreground'}`} />
      </button>
    </div>
  );
}
