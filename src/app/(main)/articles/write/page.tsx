"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Image as ImageIcon, Loader2, Save, Send } from "lucide-react";
import { useCreateArticle } from "@/hooks/useArticles";
import { uploadImage } from "@/api/upload";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

export default function ArticleWriterPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuthStore();
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const createArticleMutation = useCreateArticle();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login?next=/articles/write");
    }
  }, [isAuthenticated, loading, router]);

  const handleResize = (ref: React.RefObject<HTMLTextAreaElement | null>) => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = `${ref.current.scrollHeight}px`;
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const data = await uploadImage(file);
      // Depending on the backend response structure for uploads
      const url = (data as any)?.url || (data as any)?.imageUrl || (data as any)?.fileUrl || "";
      if (url) {
        setCoverImage(url);
      } else {
        toast.error("Failed to get image URL from server");
      }
    } catch (error) {
      toast.error("Failed to upload image");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = (publish: boolean) => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    createArticleMutation.mutate(
      { title, content, coverImage, published: publish },
      {
        onSuccess: () => {
          toast.success(publish ? "Article published!" : "Draft saved!");
          router.push("/profile");
        },
        onError: (err) => {
          toast.error("Failed to save article");
          console.error(err);
        }
      }
    );
  };

  if (loading || !isAuthenticated) return null;

  return (
    <div className="min-h-screen pb-32">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()}
              className="p-2 hover:bg-secondary rounded-full transition-colors text-muted-foreground"
            >
              <ArrowLeft size={20} />
            </button>
            <span className="font-medium text-sm text-muted-foreground">Draft</span>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              onClick={() => handleSave(false)}
              disabled={createArticleMutation.isPending || isUploading}
              className="text-muted-foreground hover:text-foreground"
            >
              {createArticleMutation.isPending ? <Loader2 size={16} className="animate-spin mr-2" /> : <Save size={16} className="mr-2" />}
              Save Draft
            </Button>
            <Button 
              onClick={() => handleSave(true)}
              disabled={createArticleMutation.isPending || isUploading || !title.trim()}
              className="rounded-full px-6 shadow-lg shadow-primary/20"
            >
              Publish <Send size={16} className="ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Editor Main */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-12">
        
        {/* Cover Image */}
        <div className="mb-10 group relative">
          {coverImage ? (
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-secondary border border-border/50">
              <Image src={coverImage} alt="Cover" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>Change Image</Button>
                <Button variant="destructive" onClick={() => setCoverImage("")}>Remove</Button>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full py-12 rounded-2xl border-2 border-dashed border-border/50 flex flex-col items-center justify-center text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-colors disabled:opacity-50"
            >
              {isUploading ? (
                <Loader2 size={32} className="animate-spin mb-3 opacity-50" />
              ) : (
                <ImageIcon size={32} className="mb-3 opacity-50" />
              )}
              <span className="font-medium">{isUploading ? "Uploading..." : "Add a cover image"}</span>
            </button>
          )}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            accept="image/*" 
            className="hidden" 
          />
        </div>

        {/* Title Input */}
        <textarea
          ref={titleRef}
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            handleResize(titleRef);
          }}
          placeholder="Article Title"
          className="w-full text-4xl sm:text-5xl font-extrabold bg-transparent border-none outline-none resize-none placeholder:text-muted-foreground/30 mb-8 leading-tight"
          rows={1}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              contentRef.current?.focus();
            }
          }}
        />

        {/* Body Input */}
        <textarea
          ref={contentRef}
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            handleResize(contentRef);
          }}
          placeholder="Tell your story... (Markdown supported)"
          className="w-full text-lg sm:text-xl leading-relaxed bg-transparent border-none outline-none resize-none placeholder:text-muted-foreground/40 min-h-[50vh]"
        />

      </div>
    </div>
  );
}
