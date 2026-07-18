"use client";

import Image from "next/image";
import { Bookmark, Heart, MessageSquare, MoreHorizontal, Clock, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface ArticleProps {
  id: string;
  title: string;
  subtitle: string;
  coverImage: string;
  readingTime: string;
  publishedDate: string;
  views: string;
  likes: number;
  comments: number;
  tags: string[];
  author: {
    name: string;
    username: string;
    avatarUrl?: string;
  };
}

export function ArticleCard({ article }: { article: ArticleProps }) {
  const router = useRouter();

  return (
    <article 
      onClick={() => router.push(`/article/${article.id}`)}
      className="surface p-5 sm:p-6 rounded-2xl mb-6 cursor-pointer transition-all duration-300 hover:border-foreground/20 group flex flex-col md:flex-row gap-6 items-start"
    >
      {/* Cover Image */}
      <div className="relative w-full md:w-[240px] aspect-[16/9] md:aspect-[4/3] rounded-xl overflow-hidden shrink-0 bg-secondary">
        <Image 
          src={article.coverImage} 
          alt={article.title} 
          fill 
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
          <span className="text-white text-xs font-medium bg-black/40 backdrop-blur-md px-2 py-1 rounded-md flex items-center gap-1.5">
            <Clock size={12} /> {article.readingTime}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 h-full w-full">
        <div className="flex items-center gap-2 mb-3">
          <Avatar className="w-6 h-6">
            <AvatarImage src={article.author.avatarUrl} />
            <AvatarFallback className="bg-secondary text-[10px]">{article.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium hover:underline">{article.author.name}</span>
          <span className="text-xs text-muted-foreground">•</span>
          <span className="text-xs text-muted-foreground">{article.publishedDate}</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold tracking-tight mb-2 group-hover:text-primary transition-colors leading-tight">
          {article.title}
        </h3>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-4 line-clamp-2">
          {article.subtitle}
        </p>

        <div className="mt-auto pt-4 flex items-center justify-between border-t border-border/50">
          <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
            <span className="flex items-center gap-1.5"><Eye size={14} /> {article.views}</span>
            <span className="flex items-center gap-1.5"><Heart size={14} /> {article.likes}</span>
            <span className="flex items-center gap-1.5"><MessageSquare size={14} /> {article.comments}</span>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={(e) => e.stopPropagation()} className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full transition-colors">
              <Bookmark size={16} />
            </button>
            <button onClick={(e) => e.stopPropagation()} className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full transition-colors">
              <MoreHorizontal size={16} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
