"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Image as ImageIcon, Type, Bold, Italic, Quote, List, Code, Settings, Save, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function WriteArticlePage() {
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [title, setTitle] = useState("");
  
  // Simulated auto-save
  const handleContentChange = () => {
    setIsSaved(false);
    setTimeout(() => setIsSaved(true), 1500);
  };

  return (
    <div className="w-full relative min-h-screen bg-background text-foreground flex flex-col">
      
      {/* Editor Header */}
      <div className="sticky top-0 z-40 bg-background/90 backdrop-blur-xl border-b border-border/40 px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-secondary text-muted-foreground" onClick={() => router.back()}>
            <ChevronLeft size={20} />
          </Button>
          <div className="flex items-center gap-2 text-sm">
            {isSaved ? (
              <span className="flex items-center gap-1.5 text-muted-foreground"><CheckCircle2 size={14} className="text-primary" /> Saved to drafts</span>
            ) : (
              <span className="flex items-center gap-1.5 text-muted-foreground"><Save size={14} className="animate-pulse" /> Saving...</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" className="rounded-full px-4 text-muted-foreground hover:text-foreground" onClick={() => setShowSettings(!showSettings)}>
            <Settings size={18} className="mr-1.5" />
            Settings
          </Button>
          <Button className="rounded-full px-6 shadow-lg shadow-primary/20">Publish</Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Main Editor Canvas */}
        <div className="flex-1 overflow-y-auto pb-32">
          {/* Floating Action Toolbar */}
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 surface rounded-full px-2 py-1.5 flex items-center gap-1 z-30 shadow-2xl border-black/10 dark:border-white/10">
            <ToolbarButton icon={<Type size={16} />} tooltip="Heading" />
            <ToolbarButton icon={<Bold size={16} />} tooltip="Bold" />
            <ToolbarButton icon={<Italic size={16} />} tooltip="Italic" />
            <div className="w-px h-5 bg-border mx-1" />
            <ToolbarButton icon={<Quote size={16} />} tooltip="Quote" />
            <ToolbarButton icon={<List size={16} />} tooltip="List" />
            <ToolbarButton icon={<Code size={16} />} tooltip="Code Block" />
            <div className="w-px h-5 bg-border mx-1" />
            <ToolbarButton icon={<ImageIcon size={16} />} tooltip="Add Image" />
          </div>

          <div className="w-full max-w-[720px] mx-auto px-4 sm:px-6 mt-16">
            
            {/* Title Input */}
            <input 
              type="text" 
              placeholder="Article Title" 
              value={title}
              onChange={(e) => { setTitle(e.target.value); handleContentChange(); }}
              className="w-full bg-transparent border-none text-4xl sm:text-5xl font-bold tracking-tight text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-0 mb-8 leading-tight resize-none"
            />

            {/* Simulated Block Editor Area */}
            <div className="relative group">
              {/* Fake block handle */}
              <div className="absolute -left-10 top-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 cursor-pointer">
                <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground"><ImageIcon size={14} /></Button>
              </div>
              <Textarea 
                placeholder="Tell your story..." 
                onChange={handleContentChange}
                className="w-full min-h-[400px] bg-transparent border-none text-lg text-foreground/90 placeholder:text-muted-foreground/50 focus-visible:ring-0 p-0 resize-none leading-relaxed font-serif"
              />
            </div>
            
          </div>
        </div>

        {/* Settings Sidebar (Slide over) */}
        <div className={`w-80 border-l border-border/50 bg-background/50 backdrop-blur-xl transition-transform duration-300 absolute right-0 top-0 bottom-0 z-20 ${showSettings ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-6 h-full overflow-y-auto">
            <h3 className="font-semibold text-lg mb-6">Article Settings</h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Cover Image</label>
                <div className="w-full aspect-video rounded-xl border-2 border-dashed border-border/50 flex flex-col items-center justify-center gap-2 text-muted-foreground cursor-pointer hover:bg-secondary/30 transition-colors">
                  <ImageIcon size={24} />
                  <span className="text-xs">Upload high-res image</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">SEO Description</label>
                <Textarea placeholder="Brief summary for search engines..." className="resize-none h-24 bg-secondary/30 text-sm" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Tags</label>
                <Input placeholder="e.g. Design Systems, UX" className="bg-secondary/30" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function ToolbarButton({ icon, tooltip }: { icon: React.ReactNode; tooltip: string }) {
  return (
    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary" title={tooltip}>
      {icon}
    </Button>
  );
}
